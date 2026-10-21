# Architecture plan

A learning website for two university courses — **Graph Theory** and **Graph Algorithms**
(MA015) — consisting of full written courses, a generated reference of all definitions /
lemmas / theorems, practice and exam-prep pages, and a full-screen graph playground. All
graph visualisation, from a tiny figure in a lesson to the playground, goes through one shared
graph framework.

Companion documents:

- `GRAPH_DSL.md` — the text format for graphs (parser spec).
- `CONTENT_CONVENTIONS.md` — the Markdown format of lessons (containers, references, quizzes).
- `content/` — the course text. **The content is the source of truth**: when the code and the
  content disagree, the code adapts (or the spec is updated deliberately).

---

## 1. Decisions (agreed with the author)

| Topic | Decision |
|-------|----------|
| Site | **VitePress** + **Vue 3** + **TypeScript** (strict). Docs layout only for course/reference sections; custom layouts for home, practice, exam and playground. |
| Hosting | Static (GitHub Pages / Netlify / Cloudflare Pages). No backend, no accounts. Persistence in `localStorage` and share URLs. |
| Renderer | **Own SVG renderer** in Vue. No graph-drawing library. |
| Layout | Auto layout with optional pinned vertices. Borrow **d3-force** and **elkjs** for layout computation only. Deterministic. |
| Graph format in content | Inline ```` ```graph ```` DSL blocks (`GRAPH_DSL.md`). |
| Graph features | Directed, undirected, mixed, multigraphs, loops, weights/capacities/flows, parametric families, planar embeddings & faces, hypergraphs. |
| Algorithm animation | Algorithms are TS **generators** yielding steps; the player precomputes all steps (free stepping backwards). |
| Exercises | select elements, build a graph, simulate an algorithm, numeric / multiple choice. Property-based checking. |
| Playground formats | DSL, JSON, TikZ export, adjacency matrix / list, SVG / PNG export, share URL. |
| Course structure | Two courses (`/theory/`, `/algorithms/`) + one shared generated `/reference/`. |
| Content depth | Full rigorous proofs + intuition, lecture notation, English. |
| Visual style | Clean textbook look, KaTeX labels, colour-blind-safe semantic palette, light + dark. |

---

## 2. Repository layout

pnpm workspace monorepo:

```
graph-learning-website/
  PLAN.md  GRAPH_DSL.md  CONTENT_CONVENTIONS.md  CLAUDE.md
  resources/                     lecture PDFs (input material, not published)
  content/                       course Markdown (source of truth)
    theory/  algorithms/
  packages/
    graph-core/                  pure TypeScript, no DOM, no Vue
      src/model/                 graph data model, element refs, commands (undo/redo)
      src/dsl/                   tokenizer, parser, serializer, generators, transforms
      src/layout/                layout algorithms (wrapping d3-force, elkjs, own simple ones)
      src/algorithms/            algorithm generators + registry
      src/properties/            live property registry
      src/predicates/            exercise predicate registry
      src/io/                    JSON, TikZ, adjacency matrix/list, share-URL codec
      test/
    graph-vue/                   Vue 3 components and composables
      src/render/                GraphView.vue and its layers
      src/interaction/           interaction modes, pointer handling, selection, shortcuts
      src/widgets/               GraphFigure, AlgoPlayer, GraphSandbox, GraphExercise, GraphStepper, GraphBlock
      src/theme/                 CSS variables, class palette
  site/                          VitePress project
    .vitepress/config.ts         srcDir → ../content plus site pages; markdown plugins
    .vitepress/theme/            custom layouts, global components, KaTeX macros
    .vitepress/plugins/          markdown-it plugins: graph blocks, containers, [[refs]], quiz, pseudo
    .vitepress/data/             build-time data loaders (reference index, exercise index)
    pages/                       index, practice, exam, playground, reference (generated)
  scripts/
    validate-content.ts          parses all content, checks ids/refs/predicates/algos
```

Tooling: Vite, Vitest, ESLint + Prettier, `vue-tsc` in CI. Dependencies to expect: `katex`,
`markdown-it-container`, `d3-force`, `elkjs`, `lz-string` (share URLs), `@codemirror/*` (DSL
editor in the playground), `html-to-image` or equivalent (PNG export). Add nothing else without
a reason.

---

## 3. `graph-core`: the graph model

### 3.1 Data

Plain serialisable data (no classes in the stored state), so that Vue `reactive()` can wrap it,
JSON export is trivial, and steps can snapshot it.

```ts
type Id = string;

interface Vertex {
  id: Id;
  label?: string;            // may contain $math$
  x?: number; y?: number;    // layout output or pinned position (math coords, y up)
  pinned?: boolean;
  classes: string[];
  data: Record<string, unknown>;   // any extra attributes (d, color, excess, …)
}

interface Edge {
  id: Id;
  tail: Id[];                // ordinary edge: [u]; hyperedge: several
  head: Id[];                // ordinary edge: [v]; loop: tail[0] === head[0]
  directed: boolean;
  hyper: boolean;            // true when written as `hyperedge`
  label?: string;
  classes: string[];
  data: Record<string, unknown>;   // w, c, f, l, bend, side, …
}

interface Face { id: Id; walk: Id[]; outer: boolean; label?: string; classes: string[] }
interface Group { id: Id; members: Id[]; label?: string; classes: string[] }

interface GraphData {
  type: 'undirected' | 'directed' | 'mixed';
  simple: boolean;
  vertices: Vertex[];        // ordered: declaration order matters for layouts
  edges: Edge[];             // ordered: parallel-edge indices (#2) and auto ids depend on it
  faces: Face[];
  groups: Group[];
  meta: Record<string, string>;    // caption, intent, layout, edge-label, …
}
```

Undirected ordinary edges store their endpoints as written (`tail=[u]`, `head=[v]`) for
round-tripping; algorithms must not rely on that orientation.

### 3.2 Query layer

A read-only `GraphIndex` built on demand (and memoised per data version) with adjacency maps,
incidence lists, `neighbors`, `outNeighbors`, `inNeighbors`, `degree` (a loop counts 2,
in/out degree for arcs), `edgesBetween(u, v)`, `resolveRef(ref)` (`GRAPH_DSL.md` §5.4).
Algorithms, properties and predicates use only this layer.

### 3.3 Mutations and undo

All edits go through **commands** (`addVertex`, `removeVertex`, `addEdge`, `removeEdge`,
`moveVertices`, `setAttrs`, `setClasses`, `batch`). Each command applies to `GraphData` and
returns its inverse. A `History` keeps undo/redo stacks; drag operations are merged into one
command. The playground, the sandbox widget and `build` exercises all use this.

### 3.4 DSL

Tokenizer → line parser → `GraphDocument` (header + panels + steps + widget directives) →
`GraphData` per panel. Serializer writes canonical DSL back. Requirements:

- Exact error positions; unknown directives produce warnings.
- `serialize(parse(x))` round-trips the graph (property-tested in Vitest).
- Generators and transforms (`GRAPH_DSL.md` §11) are pure functions in `src/dsl/generators.ts`,
  also callable from the playground UI.

### 3.5 Layout

`layout(graph, spec, opts) → positions`. Pinned vertices are constraints. All layouts are
deterministic (seeded). `force` uses d3-force run synchronously for a fixed tick count, so it
works during SSR; `layered` uses elkjs (async) — for course figures, run it at **build time**
and bake positions into the page data so pages never re-layout on load. Edge routing
(parallel-edge bending, loop placement, arrow trimming against vertex radius, label anchor
points) is a separate pure function `routeEdges(graph, positions, style)` shared by the SVG
renderer and the TikZ exporter.

---

## 4. `graph-vue`: rendering

### 4.1 `GraphView.vue`

The single drawing component. Everything else (widgets, playground) composes it.

```ts
props: {
  graph: GraphData;
  overlay?: Overlay;          // per-step classes / attr overrides / temporary elements
  mode?: InteractionMode;     // 'view' | 'drag' | 'edit' | 'select' | …
  selection?: Selection;
  theme?: 'auto' | 'light' | 'dark';
  viewport?: { fit: boolean; zoom: boolean; pan: boolean };
}
emits: 'vertex-click', 'edge-click', 'background-click', 'command' (an edit command),
       'selection-change', 'hover'
```

SVG layers, bottom to top: background (hit target) → groups → faces → hyperedge hulls →
edges (with an invisible wide hit-stroke each) → arrowheads → edge labels → vertices → vertex
labels → interaction overlays (rubber band, edge-creation preview, snapping indicator).

- Coordinates: model coordinates are math coordinates (y up); a single `<g transform>`
  maps them to screen and also carries pan/zoom.
- **Labels with math:** plain labels and simple sub/superscripts (`$v_1$`, `$x'$`) are rendered
  with SVG `<text>`/`<tspan>` (fast, exportable). Anything else is rendered with KaTeX inside a
  `<foreignObject>`. The exporters handle both.
- Styling only via CSS classes and CSS custom properties (`theme/`), never inline colours.
  Element classes from the DSL map 1:1 to CSS classes (`.gv-edge.tree`, `.gv-vertex.current`).
- Transitions: class changes animate via CSS transitions; position changes tween (respect
  `prefers-reduced-motion`).
- SSR-safe: renders a complete static SVG on the server when positions are known.

### 4.2 Interaction

Interaction is a pluggable **mode** object that receives normalised pointer/keyboard events
(already converted to model coordinates with `getScreenCTM().inverse()`, Pointer Events with
pointer capture, so mouse, pen and touch share one code path) and emits commands or selection
changes. Modes:

| Mode | Behaviour |
|------|-----------|
| `view` | Nothing (optionally zoom/pan). |
| `drag` | Move vertices only. |
| `select` | Click / shift-click / rubber-band selection, filtered to vertices, edges or both (exercises). |
| `edit` | Full editor: click empty space = add vertex; drag from vertex = create edge (preview line, snap to target, drop on empty space = new vertex + edge); drag vertex = move; double-click = edit label/attributes; Delete = remove selection; Ctrl+Z / Ctrl+Shift+Z undo/redo; toggle directed with a modifier or a setting. |
| `simulate` | Like `select`, but each click is validated against the expected algorithm step. |

Composables: `useGraphEditor(graphRef)` (history, commands, selection), `useViewport()`,
`useKeyboardShortcuts()`. Accessibility: vertices and edges are focusable (`tabindex`), arrow
keys move focus along adjacency, Enter/Space selects, every widget has an `aria-label` from its
caption and a hidden textual description (vertex/edge list) for screen readers.

---

## 5. Widgets and Markdown integration

A markdown-it plugin turns each ```` ```graph ```` block into
`<GraphBlock id="…" widget="…" :source="…" />`. `GraphBlock` parses the DSL (at build time
where possible, via a VitePress data loader, so parse errors fail the build) and dispatches:

| Widget | Component | Uses |
|--------|-----------|------|
| `figure` | `GraphFigure` | `GraphView` in `view`/`drag` mode, panels side by side, caption |
| `player` | `AlgoPlayer` | algorithm registry; controls ⏮ ◀ ▶ ⏭ play/pause + speed + step slider; message line with KaTeX; pseudocode panel highlighting `@label`; state panel (queue, heap, sets, current flow value); optional residual panel |
| `stepper` | `GraphStepper` | same controls as the player, but steps come from the DSL `step:` blocks |
| `editable` | `GraphSandbox` | `edit` mode + live properties panel + reset |
| `exercise` | `GraphExercise` | `select`/`edit`/`simulate` mode + prompt + check button + hints + solution |

Other markdown plugins: theorem-like containers (numbering, ids, anchors, badges for
`extra`), `[[ref]]` resolution with hover previews, `quiz`, `exercise`/`hint`/`solution`,
`pseudo` blocks with `@label` extraction. All of them collect metadata into a site-wide index
used by the reference, practice and exam pages.

---

## 6. Algorithms

### 6.1 Interface

```ts
interface Step {
  message: string;                      // explanation, may contain $math$
  line?: string;                        // pseudocode @label to highlight
  overlay: Overlay;                     // FULL snapshot of classes/attr overrides for this step
  graph?: GraphData;                    // only when the structure changes (contraction, residual network)
  state?: Record<string, StateView>;    // e.g. { queue: [...], 'T': edges, 'flow value': 12 }
}

interface AlgorithmDef<P, R> {
  id: string;                           // 'kruskal'
  name: string;                         // 'Kruskal's algorithm'
  pseudocode: string;                   // content container id, default `alg:<id>`
  requires: { directed?: boolean; weights?: 'w' | 'c'; connected?: boolean; params?: string[] };
  run(g: GraphIndex, params: P): Generator<Step, R>;
}
```

- The same generator is used for the player (collect all steps), `simulate` exercises (compare
  the reader's action with the next step) and plain results (run to completion, used by
  predicates such as `is-max-flow`).
- Overlays are full snapshots (graphs in teaching are small), so stepping back is an array
  index.
- Deterministic tie-breaking: by declaration order of edges/vertices, so the player matches the
  worked examples in the text.

### 6.2 Registry (initial; grows with the content)

| Id | Course / lesson | Notes |
|----|-----------------|-------|
| `bfs`, `dfs` | prerequisites | trees, discovery order, layers |
| `kruskal` | algorithms 01 | union-find state panel |
| `jarnik` | algorithms 01 | Jarník / Prim, heap state panel |
| `boruvka` | algorithms 01 | per phase: cheapest edge per component, contraction |
| `reverse-delete` | algorithms 01 | if used in content |
| `fredman-tarjan` | algorithms 01 | phases with heap-size bound $k_i$ |
| `kkt-sampling` | algorithms 01 | Karger–Klein–Tarjan: sampling, F-heavy edge filtering (illustrative, seeded) |
| `edmonds-branching` | algorithms 01 | min-cost arborescence, cycle contraction |
| `ford-fulkerson` | algorithms 02 | `params: choice=any|dfs|bfs|widest`; residual panel |
| `edmonds-karp` | algorithms 02 | shortest augmenting paths |
| `dinic` | algorithms 02 | level graph, blocking flow |
| `mpm` | algorithms 02 | vertex potentials, push/pull through min-potential vertex |
| (theory) | theory lessons | e.g. Euler tours, tree algorithms — added as the content needs them |

**To find the required set, grep `algo:` in `content/`.** The validation script fails on unknown
ids.

---

## 7. Live properties (`editable` widgets, playground)

`PropertyDef = { id, name, compute(g: GraphIndex): PropertyValue, applicable?(g) }`. Initial
set: `vertex-count`, `edge-count`, `degree-sequence`, `degree-sum`, `min-degree`,
`max-degree`, `connected`, `components`, `bipartite`, `is-tree`, `is-forest`, `has-cycle`,
`girth`, `diameter`, `radius`, `eulerian`, `planar`, `chromatic-number` (exact, small graphs
only), `is-regular`, `is-simple`, `max-flow-value`. Grow as the content needs (`grep live:`).

---

## 8. Exercise predicates

```ts
type Predicate = (ctx: {
  graph: GraphIndex;           // the (possibly edited) graph
  original: GraphIndex;        // the figure as authored
  selection: Selection;        // selected vertices / edges
  args: Record<string, unknown>;
}) => { ok: boolean; feedback?: string };   // feedback explains *why* not, e.g. "this edge set contains a cycle"
```

Initial registry: `is-spanning-tree`, `is-mst`, `is-path` (`from`, `to`), `is-cycle`,
`is-hamiltonian-cycle`, `is-euler-trail`, `is-matching`, `is-max-matching`,
`is-perfect-matching`, `is-vertex-cover`, `is-independent-set`, `is-clique`, `is-cut`
(`s`, `t`), `is-min-cut`, `is-augmenting-path`, `is-proper-coloring` (`k`),
`degree-sequence` (`seq`), `is-tree`, `is-bipartite`, `is-connected`, `isomorphic-to`
(`ref`), `vertex-count`, `edge-count`. **Grep `check:` in `content/` for the required set**;
the validation script fails on unknown predicate names.

Feedback must be specific and never reveal the full answer.

---

## 9. Site structure

| Route | Layout | Content |
|-------|--------|---------|
| `/` | custom landing | course overview, entry points |
| `/theory/…` | VitePress docs (sidebar per course) | lessons from `content/theory/` |
| `/algorithms/…` | VitePress docs | lessons from `content/algorithms/` |
| `/reference/` | docs | **generated**: definitions, theorems/lemmas/corollaries, algorithms; searchable; filter by course/lesson; each entry links back to its lesson and shows statement + proof toggle |
| `/practice/` | custom | all exercises and quizzes grouped by lesson; generated random practice (seeded generators + predicates, e.g. "find an MST of this random graph") |
| `/exam/` | custom | flashcards generated from definitions/theorems (front: number + title, back: statement); mixed quizzes; "which lemmas do I not know yet" tracking |
| `/playground/` | full-screen custom layout | the graph app (§10) |

Progress (seen lessons, solved exercises, flashcard ratings) lives in `localStorage` under a
versioned key; a JSON export/import button allows moving it between devices.

---

## 10. Playground app

Full-screen page built from the same `GraphView` plus its own panels:

- **Canvas:** `GraphView` in `edit` mode, zoom/pan, grid snapping toggle.
- **Left panel:** new graph / generators (`K(n)`, `C(n)`, `Petersen`, `Gnp`, …, with parameter
  inputs), graph type (undirected / directed / mixed), layouts (re-layout all / selection),
  examples gallery (all course figures are loadable by id via `ref(…)`).
- **Right panel:** inspector for the selection (label, attributes `w`/`c`/`f`/…, classes),
  live properties (§7), algorithm runner (pick algorithm + params, then the `AlgoPlayer`
  controls run on the current graph).
- **Bottom/side drawer:** DSL text editor (CodeMirror 6 with syntax highlighting and inline
  errors), two-way synced with the canvas.
- **Import / export:** DSL, JSON, adjacency matrix and adjacency/edge list (import + export),
  TikZ (export), SVG and PNG (export), **share URL** (DSL compressed with lz-string in the URL
  hash).
- **Persistence:** autosave to `localStorage`; a list of named saved graphs.

### 10.1 TikZ export

Uses the same `routeEdges` geometry: `\node` per vertex at its position (scaled), `\draw` per
edge with `bend left=…` for bent edges, `loop above` etc. for loops, `->` for arcs, edge labels
as `node[midway, auto]`, classes mapped to a small set of TikZ styles defined in a preamble
comment. Output must compile with plain `tikz` (no exotic libraries beyond `arrows.meta`).

---

## 11. Theming

- CSS custom properties under `.gv-root`, switched by VitePress' `.dark` class.
- Categorical palette: Okabe–Ito (colour-blind safe) for `color1…color8`; semantic classes
  (`current`, `tree`, `path`, `cut`, `rejected`, …) additionally differ in stroke width or
  dash so they stay distinguishable in greyscale and print.
- Textbook look: thin dark strokes, small white-filled vertices with dark outline, labels in the
  KaTeX font, generous whitespace, no shadows/gradients.

---

## 12. Accessibility and responsiveness

- Widgets work at 320px width: panels stack, controls stay ≥ 44px touch targets.
- Keyboard operable widgets (§4.2), visible focus, `prefers-reduced-motion` respected.
- Every figure has a text alternative (caption + generated description).

---

## 13. Quality and validation

- **Vitest** in `graph-core`: DSL parse/serialize round-trips, every generator, every algorithm
  against hand-checked results (including the worked examples from the content), every
  predicate with positive and negative cases, TikZ snapshot tests.
- **`scripts/validate-content.ts`** (runs in CI and before `vitepress build`):
  - parses every ```` ```graph ```` block; errors fail;
  - figure ids, container ids unique; every `[[ref]]` resolves;
  - every `algo:`, `check:`, `live:` and `use:` name exists in its registry;
  - every `@label` referenced by an algorithm exists in its pseudocode;
  - lists `SOURCE UNCLEAR` markers and `status: draft` lessons.

---

## 14. Build order (for the implementation session)

1. Monorepo skeleton, VitePress site rendering `content/` as plain Markdown (KaTeX working,
   containers rendered with basic styling, graph blocks shown as code).
2. `graph-core` model + DSL parser/serializer + tests.
3. Layouts + edge routing + `GraphView` static rendering → `widget=figure` live in lessons.
4. Containers numbering, `[[refs]]`, generated `/reference/`, validation script.
5. Interaction modes + editor composables → `editable` widget.
6. Algorithm interface + `kruskal`, `jarnik`, `boruvka`, `ford-fulkerson`, `edmonds-karp`,
   `dinic` → `player` and `stepper` widgets.
7. Predicates → `exercise` widget, quizzes, practice page.
8. Playground app with import/export.
9. Exam page (flashcards), progress tracking, remaining algorithms, polish.

Each step leaves the site deployable.
