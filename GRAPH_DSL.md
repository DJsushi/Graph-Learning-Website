# Graph DSL specification

This document defines the text format used to describe graphs inside the course Markdown
(`content/**/*.md`) and in the playground app (import/export, share URLs). The parser lives
in `packages/graph-core` and must accept everything described here. When this document and
the content disagree, fix the content or extend this spec — never silently guess.

Design goals:

- **Readable as plain text.** A student reading the raw Markdown should understand the graph.
- **Easy to write correctly** for humans and LLMs: line-based, no nesting, few keywords.
- **Lossless round-trip** for the playground: `serialize(parse(text))` must produce an
  equivalent graph (formatting may change).
- **One model for everything:** simple graphs, digraphs, mixed graphs, multigraphs, loops,
  hypergraphs, embedded planar graphs, flow networks.

---

## 1. Embedding in Markdown

A graph is a fenced code block whose info string starts with `graph`, followed by optional
`key=value` attributes:

````markdown
```graph id=mst-intro widget=figure
caption: A weighted graph and its minimum spanning tree.
a -- b [w=4]
b -- c [w=2]
a -- c [w=5 class=muted]
```
````

Info-string attributes:

| Attribute | Required | Meaning |
|-----------|----------|---------|
| `id`      | yes      | Unique across the whole site, kebab-case, prefixed by lesson slug where practical (`t01-handshake-example`). Never renamed once published (exercises and progress refer to it). |
| `widget`  | no       | `figure` (default), `player`, `editable`, `exercise`, `stepper`. See §9. |
| `height`  | no       | `small` (≈180px), `medium` (default, ≈300px), `large` (≈450px). |

Attribute values may be quoted (`caption="..."`) only if they contain spaces; in the info
string this is rarely needed.

A renderer that does not know a widget type must fall back to `figure`. A site build without
the graph renderer must still show the block as readable code.

---

## 2. Lexical rules

- The body is processed **line by line**. A line may contain several statements separated by
  `;`.
- **Comments:** `//` to end of line. (Not `#` — `#` is used in edge references, §5.4.)
- Blank lines are ignored.
- **Identifiers** (vertex ids, edge ids, face ids, class names):
  `[A-Za-z0-9_][A-Za-z0-9_']*` — so `v1`, `s`, `t`, `a'`, `12`, `x_3` are all valid.
  Identifiers are case-sensitive.
- **Values** in attribute lists:
  - numbers: `3`, `-2`, `0.5`, `1e3` → parsed as numbers;
  - `inf` → `Infinity` (for capacities);
  - bare words matching the identifier rule → strings;
  - quoted strings `"..."` with `\"` and `\\` escapes → strings (needed for spaces, math,
    commas, brackets).
- **Math** inside any user-visible string (labels, captions, prompts, step text) uses KaTeX
  syntax between `$...$`. Example: `label="$v_1$"`, `caption: The cycle $C_6$.`

---

## 3. Line types

Every non-empty line (after stripping comments) is exactly one of:

| Line kind        | Recognised by                                          | Section |
|------------------|--------------------------------------------------------|---------|
| Directive        | `keyword:` where `keyword` is in the directive list    | §4      |
| Vertex statement | identifiers, optional attributes / position, no edge operator | §5.1 |
| Edge statement   | contains `--` or `->`                                   | §5.2    |
| Hyperedge        | starts with `hyperedge`                                 | §5.5    |
| Face             | starts with `face`                                      | §6      |
| Group            | starts with `group`                                     | §7      |
| Class edit       | starts with `class` or `unclass`                        | §8      |
| Removal          | starts with `remove`                                    | §5.6    |
| Step marker      | starts with `step:`                                     | §9.5    |
| Panel marker     | starts with `panel:`                                    | §10     |

Because identifiers cannot contain `:`, a directive is never confused with a vertex.

---

## 4. Directives

`keyword: value`. Unknown directives are a parse **warning** (not an error) so content can
run slightly ahead of the implementation.

### 4.1 Graph-level

| Directive | Values | Default | Meaning |
|-----------|--------|---------|---------|
| `type` | `undirected`, `directed`, `mixed` | `undirected` | Validation: in `undirected` graphs `->` is an error; in `directed` graphs `--` is an error; `mixed` allows both. |
| `simple` | `true`, `false` | `false` | If `true`, the parser errors on loops and parallel edges. Use it in figures that illustrate simple graphs, so mistakes are caught. |
| `use` | generator call, see §11 | — | Inserts a generated graph. May appear several times (with `prefix=`). |
| `layout` | layout name + options, see §12 | `auto` | Positioning algorithm. |
| `caption` | text with `$math$` | — | Shown under the figure. |
| `intent` | free text | — | **Not rendered.** Explains what the figure must teach; written for the implementer and for future editors. Every non-trivial figure should have one. |
| `vertex-label` | template | `{label}` | How vertex labels are rendered. `{label}` falls back to the id. Use `none` to hide labels. |
| `edge-label` | template | auto | How edge labels are rendered; see §5.3. `none` hides them. |
| `directed-style` | `arrow`, `mid-arrow` | `arrow` | Arrowhead at the end or in the middle of directed edges. |
| `interactive` | list of `drag`, `zoom` | none for `figure` | Extra interaction for static figures. |

### 4.2 Widget-specific

Listed in §9 together with their widgets.

---

## 5. Vertices and edges

### 5.1 Vertex statements

```
a                                // declare vertex a
a b c d                          // declare several vertices
v1 [label="$v_1$" class=source]  // attributes
x @(0, 1)                        // pinned position
x [label="$x$"] @(2, -1.5)       // both (either order is accepted)
```

- Vertices are created implicitly by edges, so declaring them is only needed for isolated
  vertices, for attributes, for pins, or to force an ordering (layouts respect declaration
  order where it matters, e.g. `circle`).
- A second statement for an existing vertex **merges** attributes (later wins).
- **Positions** `@(x, y)` are in abstract units; `y` grows **upwards** (mathematical
  convention). The renderer fits the bounding box to the viewport. One unit ≈ the default
  edge length. Pinned vertices are fixed for every layout; unpinned vertices are placed by the
  layout.
- Known vertex attributes: `label`, `class` (space-separated list in quotes, or one bare
  class), `id` is the vertex id itself. Any other attribute (e.g. `d=3`, `h=2`, `color=1`)
  is stored as data and may be used in label templates or by algorithms
  (e.g. `excess`, `height` for push-relabel, `color` for colourings).

### 5.2 Edge statements

```
a -- b                  // undirected edge
a -> b                  // directed edge (arc) from a to b
a -- b -- c -- a        // chain: three edges
s -> a [c=10 f=4]       // attributes apply to every edge of the statement
a -- a                  // loop
a -- b; a -- b          // two parallel edges
```

- Chains create one edge per consecutive pair; operators may be mixed in a chain only in
  `mixed` graphs.
- Every edge gets an id: either explicit `[id=e7]` or automatic `e1, e2, …` in source order
  (counting only edges without an explicit id). Automatic ids are stable as long as the
  source does not change.
- Known edge attributes:

| Attribute | Meaning |
|-----------|---------|
| `w` | weight / length / cost |
| `c` | capacity |
| `f` | flow |
| `l` | lower bound (flows with demands) |
| `label` | explicit label text (overrides template) |
| `class` | style classes, §8 |
| `id` | explicit edge id |
| `bend` | curvature, number in roughly `[-1, 1]`; overrides automatic bending of parallel edges |
| `side` | for loops: `top`, `bottom`, `left`, `right`, or angle in degrees |

Any other attribute is stored as data.

### 5.3 Edge label templates

If `edge-label` is not given, the label is chosen automatically:

1. `label` if present;
2. otherwise `{f}/{c}` if both `f` and `c` are present;
3. otherwise `{c}` if only `c`, otherwise `{w}` if `w`;
4. otherwise no label.

A template is any text with `{attr}` placeholders and optional `$math$`, e.g.
`edge-label: "{f}/{c}"`, `edge-label: "$w={w}$"`. Missing attributes render as empty.

### 5.4 Element references

Some statements refer to existing elements (class edits, groups, exercises, steps):

| Reference | Meaning |
|-----------|---------|
| `a` | vertex `a` |
| `a--b` | the (first) undirected edge between `a` and `b` (either orientation) |
| `a->b` | the (first) arc from `a` to `b` |
| `a--b#2` | the 2nd parallel edge between `a` and `b`, in source order |
| `@e7` | edge with id `e7` |
| `face:f1` | face `f1` |

No spaces inside a reference. A reference to a non-existing element is a parse error.

### 5.5 Hyperedges

```
hyperedge {a b c}                        // undirected hyperedge
hyperedge {a b} -> {c d} [label="$h$"]   // directed hyperedge (tail set → head set)
hyperedge {a b c} [id=h1 class=color2]
```

Rendered as a translucent hull around its vertices (undirected) or as a multi-tail,
multi-head arrow (directed). Hyperedges count as edges in the model (see `PLAN.md`, graph
model).

### 5.6 Removal

```
remove 3                // remove vertex 3 and its incident edges
remove 1--2             // remove an edge
remove @e4
```

Useful after `use:` to derive a graph (e.g. `K5` minus an edge).

---

## 6. Planar embeddings and faces

```
layout: fixed
a @(0,0); b @(2,0); c @(1,1.6); d @(1,0.6)
a -- b -- c -- a; a -- d; b -- d; c -- d
face f1: a b d [label="$f_1$"]
face f2: b c d
face f3: c a d
face f0 outer: a b c [label="$f_\infty$"]
```

- `face <id> [outer]: <vertex walk>` lists the boundary walk of a face in order (the walk is
  closed implicitly). A walk may repeat vertices (faces of non-2-connected graphs).
- Faces are only drawn when vertex positions come from `fixed` or `planar` layout. With
  `planar`, the layout must realise the given faces if they are specified.
- Face attributes: `label`, `class` (e.g. `color1`…`color8` for face colourings).
- The renderer fills each inner face with its class colour and places the label at a point
  inside the face; the outer face label goes near the boundary, outside the drawing.
- `layout: planar` without explicit faces means "compute a planar embedding and draw it
  without crossings"; it is an error to request it for a non-planar graph.
- The dual graph is produced by a generator transform, not by hand: `use: dual(this)` in a
  separate panel (§10, §11).

---

## 7. Groups

```
group S: s a b [label="$S$"]
group T: c d t [label="$\bar S$" class=muted]
```

Draws a soft hull around the listed vertices (cuts, components, bipartition sides,
contracted super-vertices). Groups are purely visual; they do not change the graph. A vertex
may belong to several groups.

---

## 8. Style classes

Styling is **semantic**: content names a role, the theme decides the colours. Raw colours are
not allowed in content.

```
a -- b [class=tree]
v [class="source current"]
class highlight: a b a--b        // add class to several elements
unclass highlight: a--b          // remove it again
```

Standard classes (the theme must define all of them, for light and dark mode, colour-blind
safe, distinguishable in greyscale where possible by also varying stroke width or dash):

| Class | Typical use |
|-------|-------------|
| `highlight` | generic emphasis |
| `muted` | de-emphasised, drawn faded |
| `hidden` | not drawn, but still in the model (for exercises/steps that reveal it later) |
| `dashed`, `bold` | stroke modifiers |
| `current` | element currently processed by an algorithm |
| `visited`, `done` | already processed |
| `frontier` | in a queue/heap/candidate set |
| `tree` | edge belongs to a (spanning) tree / forest |
| `path` | edge/vertex on a path or augmenting path |
| `cycle` | edge/vertex on a cycle |
| `cut` | edge in a cut |
| `matched` | edge in a matching |
| `rejected` | considered and discarded (e.g. Kruskal edge closing a cycle) |
| `saturated` | flow edge with `f = c` |
| `residual` | residual-network edge |
| `back` | backward / reverse edge (residual graphs, DFS back edges) |
| `source`, `sink` | flow network terminals |
| `color1` … `color8` | categorical colours: vertex/edge colourings, faces, components |

Content may introduce a new class only together with a note in `intent:`; the implementer then
adds it to the theme and to this table.

---

## 9. Widgets

### 9.1 `figure` (default)

Static drawing. Optional `interactive: drag zoom`.

### 9.2 `player` — algorithm step-through

```graph id=a01-kruskal-demo widget=player
caption: Kruskal's algorithm on a small graph.
algo: kruskal
a -- b [w=4]; a -- h [w=8]; b -- c [w=8]; b -- h [w=11]
```

| Directive | Meaning |
|-----------|---------|
| `algo` | Algorithm id from the registry in `PLAN.md` §6 (e.g. `kruskal`, `jarnik`, `boruvka`, `ford-fulkerson`, `edmonds-karp`, `dinic`, `bfs`, `dfs`). |
| `params` | `key=value` list passed to the algorithm, e.g. `params: source=s sink=t`, `params: root=a`, `params: choice=widest` (for Ford–Fulkerson's path choice). |
| `show` | Optional side panels: `pseudocode`, `state` (queues, sets, heap), `residual` (flows: show residual network next to the original). Default: `pseudocode state`. |
| `start` | Step index to show initially (default 0). |
| `editable` | `true` lets the reader modify the graph and rerun. |

### 9.3 `editable` — live sandbox

The reader can drag, add and delete vertices and edges; selected properties update live.

| Directive | Meaning |
|-----------|---------|
| `live` | Comma-separated list of property ids to display, e.g. `live: degree-sequence, degree-sum, edge-count, connected, components, bipartite, is-tree`. Property registry in `PLAN.md` §7. |
| `allow` | What the reader may change: any of `add-vertex delete-vertex add-edge delete-edge move edit-attrs`. Default: all. |
| `reset` | `true` (default) shows a "reset to original" button. |

### 9.4 `exercise`

| Directive | Meaning |
|-----------|---------|
| `task` | `select-vertices`, `select-edges`, `select-elements` (both), `build` (reader edits the graph), `simulate` (reader performs algorithm steps), `answer` (numeric/text answer about the figure). |
| `prompt` | Text shown to the reader (`$math$` allowed). |
| `check` | Predicate call that decides correctness, from the registry in `PLAN.md` §8: `check: is-mst`, `check: is-path from=s to=t`, `check: degree-sequence seq="3,3,2,2,2"`. Several `check:` lines must all hold. |
| `answer` | For `task: answer`: the expected value (`answer: 23`), compared numerically with tolerance or as trimmed string. |
| `algo`, `params` | For `task: simulate`: the algorithm whose steps the reader reproduces. |
| `hint` | Optional; may appear multiple times; revealed one at a time. |
| `solution` | Optional explanation shown after solving or giving up (`$math$` allowed). |
| `reveal` | Element references whose `hidden` class is removed when the solution is shown. |

Checks are **property-based** wherever possible ("is a minimum spanning tree"), never "equals
this fixed set", so that every correct answer is accepted.

### 9.5 `stepper` — authored storyboard

A sequence of hand-written states, used for proofs and constructions that are not an
algorithm from the registry (e.g. "contract this edge", "the induction step adds vertex $v$").

```graph id=t03-leaf-removal widget=stepper
caption: Removing a leaf keeps a tree a tree.
1 -- 2 -- 3; 2 -- 4; 4 -- 5
step: A tree $T$ with a leaf $v = 5$.
class highlight: 5
step: Remove $v$ and its edge; $T - v$ is still connected and acyclic.
remove 5
step: Adding $v$ back cannot create a cycle, since $\deg v = 1$.
4 -- 5 [class=highlight]
```

- Lines before the first `step:` define the base graph.
- Each `step: <text>` starts a new step; statements after it (edges, removals, class edits,
  attribute merges, groups) are applied **cumulatively** on top of the previous step.
- Layout is computed once on the union of all elements over all steps, so vertices do not
  jump between steps. A vertex given an explicit `@(x, y)` in a later step moves there.
- Moving between steps is animated: shared vertices slide, new ones fade in, removed ones fade out
  (instant under `prefers-reduced-motion`).
- `merge u v w -> x [attrs]` identifies or contracts vertices into `x` (an existing id among the
  sources, or a new one placed at their centroid). Incident edges are rewired and keep their ids
  (`[id=...]` on the edge); edges whose ends all lie in the merged set vanish. The animation slides
  the sources together. Parallel edges are kept; remove the extra ones in a later step.
- `split x -> p q [attrs]` is the inverse for directed graphs: arcs into `x` now enter `p`, arcs
  out of `x` now leave `q`. Give `p`, `q` their positions with a vertex statement afterwards.
- A step may merge or split, not both.

---

## 10. Panels (several graphs in one figure)

```graph id=t02-complement widget=figure
caption: A graph $G$ and its complement $\bar G$.
panel: $G$
use: C(5)
panel: $\bar G$
use: complement(C(5))
```

- `panel: <title>` starts a new, independent graph drawn side by side (stacked on narrow
  screens). Lines before the first `panel:` are shared header directives (`caption`, `intent`,
  `type`, `layout`) inherited by all panels unless overridden inside a panel.
- Each panel has its own vertex namespace.
- `layout-sync: true` (header directive) makes panels with the same vertex ids use the same
  positions (useful for complements, subgraphs, before/after).

---

## 11. Generators

`use: <generator>[ prefix=<p>]`. Generated vertex ids follow the conventions below; with
`prefix=x` every generated id is prefixed (`x1, x2, …`). Generators also set a default
`layout` (shown in the table) unless `layout:` is given explicitly. After `use:` the graph can be
modified with normal statements (add edges, attributes, `remove`, classes).

| Generator | Vertex ids | Default layout |
|-----------|-----------|----------------|
| `K(n)` complete graph | `1..n` | `circle` |
| `K(m,n)` complete bipartite | `1..m`, `1'..n'` (lecture convention) | `bipartite` |
| `K(n1,n2,...,nk)` complete multipartite | `p1_1..`, `p2_1..` … | `circle` |
| `C(n)` cycle | `1..n` | `circle` |
| `P(n)` path **of length `n`** (lecture convention: $n$ edges, $n+1$ vertices) | `0..n` | `line` |
| `E(n)` empty graph | `1..n` | `circle` |
| `Star(n)` star $K_{1,n}$ | centre `0`, leaves `1..n` | `star` |
| `Wheel(n)` wheel, rim of `n` | hub `0`, rim `1..n` | `wheel` |
| `Q(d)` hypercube | binary strings `000…` | `hypercube` |
| `Grid(m,n)` | `r_c` (e.g. `1_1`) | `grid` |
| `Petersen` | outer `0..4`, inner `5..9` | `petersen` (classic drawing) |
| `BinTree(h)` complete binary tree of height `h` | `1..` in BFS order | `tree` |
| `Gnp(n,p,seed=s)` Erdős–Rényi | `1..n` | `force` |
| `Gnm(n,m,seed=s)` | `1..n` | `force` |
| `RandomTree(n,seed=s)` | `1..n` | `tree` |
| `RandomWeights(lo,hi,seed=s)` | — (transform: assigns `w` to all edges of the graph so far) | — |

An algorithm player whose algorithm constructs the graph itself (e.g. `algo: havel-hakimi` with
`params: seq="4,4,3,3,1,1,0"`) may have an empty graph body.

Transforms take a graph expression and return a new graph:

| Transform | Meaning |
|-----------|---------|
| `complement(G)` | complement of a simple graph |
| `line(G)` | line graph |
| `dual(G)` | planar dual (requires faces / planar embedding) |
| `this` | the graph defined so far in the current panel (only inside transforms) |
| `ref(<figure-id>)` | the graph of another figure, by id (optionally `ref(<id>, panel=2)`) |

**Randomness:** every random generator requires an explicit `seed` in course content so the
figure is reproducible. The playground may omit it (then a random seed is generated and
shown).

---

## 12. Layouts

`layout: <name> [options]`

| Name | Options | Notes |
|------|---------|-------|
| `auto` | — | Generator default if any, else `tree` for trees, `layered` for DAGs with a source, `force` otherwise. |
| `force` | `seed=` | Deterministic force-directed (d3-force with a seeded start). |
| `circle` | `start=<vertex>` | Vertices on a circle in declaration order, `start` at the top. |
| `line` | — | Vertices on a horizontal line in declaration order. |
| `grid` | `cols=` | Row-major in declaration order. |
| `tree` | `root=<v>` `direction=down|right` | Layered tree drawing (Reingold–Tilford style). |
| `layered` | `direction=right|down` | Sugiyama-style for DAGs and flow networks (ELK layered). Default `right` (source left, sink right) for flow networks. |
| `bipartite` | `left="a b c"` | Two columns; without `left`, computes a bipartition. |
| `planar` | — | Crossing-free straight-line drawing. |
| `fixed` | — | Every vertex must be pinned with `@(x, y)`. |
| `star`, `wheel`, `hypercube`, `petersen` | — | Special drawings used by generators. |

Layouts are **deterministic**: the same source text always produces the same drawing.

---

## 13. Full grammar (EBNF)

```ebnf
graph       = { line } ;
line        = [ statement { ";" statement } ] [ comment ] NEWLINE ;
comment     = "//" { any-char } ;

statement   = directive | step | panel | hyperedge | face | group
            | class-edit | removal | merge | split | edge-stmt | vertex-stmt ;
merge       = "merge" ident { ident } "->" ident [ attrs ] ;    (* inside a step *)
split       = "split" ident "->" ident ident [ attrs ] ;        (* inside a step, arcs only *)

directive   = keyword ":" rest-of-statement ;      (* keyword ∈ known directive names *)
step        = "step" ":" text ;
panel       = "panel" ":" text ;

vertex-stmt = ident { ident } ( [ attrs ] [ position ] | position attrs ) ;
position    = "@(" number "," number ")" ;

edge-stmt   = ident op ident { op ident } [ attrs ] ;
op          = "--" | "->" ;

hyperedge   = "hyperedge" vset [ "->" vset ] [ attrs ] ;
vset        = "{" ident { ident } "}" ;

face        = "face" ident [ "outer" ] ":" ident { ident } [ attrs ] ;
group       = "group" ident ":" ident { ident } [ attrs ] ;
class-edit  = ( "class" | "unclass" ) ident ":" ref { ref } ;
removal     = "remove" ref { ref } ;

ref         = ident [ op ident [ "#" integer ] ] | "@" ident | "face:" ident ;

attrs       = "[" { attr } "]" ;
attr        = key "=" value ;
value       = number | "inf" | ident | string ;

ident       = ( letter | digit | "_" ) { letter | digit | "_" | "'" } ;
string      = '"' { char | '\"' | '\\' } '"' ;
```

Notes: inside `step:` and `panel:` the text runs to the end of the line (a `;` inside step text
does **not** split statements). The same holds for `caption:`, `intent:`, `prompt:`, `hint:`,
`solution:`. For other directives, `;` separates statements.

---

## 14. Error handling

- Parse errors carry line and column; the course build fails on errors in content
  (warnings are printed but do not fail the build).
- In the playground, errors are shown inline in the text editor and the last valid graph stays
  rendered.

---

## 15. Complete examples

### Flow network

```graph id=a02-flow-example widget=figure
caption: A flow network with a flow of value 19. Labels show $f/c$.
type: directed
layout: layered
s [class=source]; t [class=sink]
s -> a [f=10 c=10]; s -> b [f=9 c=10]
a -> b [f=0 c=2]; a -> c [f=4 c=4]; a -> d [f=6 c=8]
b -> d [f=9 c=9]
d -> c [f=5 c=6]; c -> t [f=9 c=10]; d -> t [f=10 c=10]
```

### Exercise

```graph id=a01-mst-ex1 widget=exercise
task: select-edges
prompt: Select the edges of a minimum spanning tree.
check: is-mst
hint: Start with the cheapest edge. Which edges can never be in an MST?
solution: Kruskal adds $ab$, $cd$, $bc$ and rejects $ac$ because it would close a cycle.
a -- b [w=1]; b -- c [w=3]; c -- d [w=2]; a -- c [w=4]; b -- d [w=5]
```

### Multigraph with loop

```graph id=t01-multigraph widget=figure
caption: A multigraph with a loop at $a$ and two parallel edges between $b$ and $c$. Here $\deg(a)=4$.
intent: Show that a loop contributes 2 to the degree.
a -- a; a -- b; a -- c; b -- c; b -- c
```

### Derived graph

```graph id=t02-k5-minus-e widget=figure
caption: $K_5 - e$.
use: K(5)
remove 1--2
```
