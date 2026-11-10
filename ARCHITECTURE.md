# Architecture

Where things live and how a page is built. Written on 2026-11-10 from a code review. If this
file and the code disagree, the code is right: fix this file.

Planned changes are in `RESTRUCTURE.md`; known defects and missing features are in
`BACKLOG.md`.

## Stack

VitePress + Vue 3 + TypeScript (strict). Static site, no backend, no accounts. Reader state
lives in `localStorage`. One npm package: the folders under `packages/` are source folders
imported through the Vite aliases `@core`, `@gv` and `@content`. Own SVG renderer, no
graph-drawing library; `d3-force` is used for the force layout only.

## Layout of the repository

```
content/                         course text: the source of truth
  topics.yaml                    chapters and the grouping of the reference
  theory/*.md, algorithms/*.md   lecture files
packages/
  graph-core/src/                pure TypeScript, no DOM
    model.ts                     graph data
    dsl/parser.ts, generators.ts figure text format (GRAPH_DSL.md), K(n), C(n), ...
    layout.ts                    deterministic layouts: fixed, force, circle, tree, layered, ...
    analysis.ts                  components, bipartition, matching, chromatic number, ...
    algorithms/                  step-recording generators; registry in algorithms/index.ts
    properties.ts                live properties (`live:`) for sandboxes and the playground
    predicates.ts                exercise checks (`check:`)
    io.ts                        DSL, JSON, TikZ, adjacency matrix and list, share URLs
  graph-core/test/               vitest; content-claims.test.ts checks numbers stated in lessons
  graph-vue/src/
    GraphView.vue                the single SVG renderer
    EditableGraph.vue            editor on top of GraphView (tools, undo, selection)
    GraphBlock.vue               one `graph` block: parse, pick the widget, caption, enlarge
    widgets/                     Figure, Stepper, Player, Sandbox, Exercise, StepControls
    geometry.ts                  edge routing: paths, bends, loops, arrowheads, label anchors
    tween.ts, useTweened.ts      animation between two graph states
    texsvg.ts, rich.ts           math in SVG labels; inline rich text for captions
    QuizBlock.vue                quizzes
    progress.ts, settings.ts     reader state in localStorage
  content/
    index.ts                     scans content/: pages, containers, figures, references
    pages.ts                     Markdown of the generated reference, practice and exam pages
    search.ts                    ranking for the reference search
.vitepress/
  config.mts                     site config, rewrites, sidebar, srcExclude
  markdown.ts                    markdown-it plugins: math, containers, fences, [[refs]]
  data/*.data.ts                 build-time data: site summary, reference previews, pseudocode
  theme/                         layout slots, components, custom.css
  search.ts                      sections for the local search
site/                            pages that are not lessons; dynamic routes for reference,
                                 practice and exam
scripts/validate-content.ts      content validator
.github/workflows/deploy.yml     GitHub Pages; runs on every push to main
```

## How a content page is built

1. `.vitepress/config.mts` rewrites `content/<course>/<page>` to `/<course>/<page>` and
   `site/...` to the root.
2. `packages/content/index.ts` (`loadContent`) reads the content files with its own
   line-by-line scanner and builds the index: pages, containers with ids, figures, references,
   pseudocode. Everything else asks this index.
3. `.vitepress/markdown.ts` renders:
   - math with KaTeX at build time (an error fails the build);
   - containers as boxes; proofs, hints and solutions as `<details>`; quizzes as `QuizBlock`;
   - `graph` fences as `<GraphBlock>` with the source in an attribute, `pseudo` fences as
     highlighted code;
   - `[[id]]` as a link to wherever the id lives, with a hover preview loaded from
     `data/refs.data.ts`.
4. `site/reference/`, `site/practice/` and `site/exam/` are dynamic routes; their `.paths.ts`
   files return Markdown built by `packages/content/pages.ts`.
5. `npm run build` runs the validator, then `vitepress build`.

## How a figure is drawn

1. `GraphBlock.vue` calls `parseGraph` (`dsl/parser.ts`), which returns the directives, one
   graph per panel, and for a stepper one graph snapshot per step.
2. Layout runs in the browser when the component is set up (`graph-vue/src/positions.ts`
   calling `layout.ts`). Pinned positions win.
3. `GraphView.vue` draws SVG: `geometry.ts` routes the edges; labels are SVG text when simple
   and KaTeX in a `foreignObject` otherwise. Styling is by CSS class only (`custom.css`,
   light and dark).
4. Widgets: `figure` (static, panels side by side), `stepper` (authored steps), `player`
   (an algorithm from the registry: all steps are computed at mount; pseudocode line, state
   and extra panels per step), `editable` (sandbox with live properties), `exercise`
   (select, build, simulate or answer; checked by predicates).
5. Steppers and players animate between states with `tween.ts`.

## Registries

| What | Where | Used by content as |
|------|-------|--------------------|
| Algorithms | `packages/graph-core/src/algorithms/index.ts` | `algo: <id>`, pseudocode in `::: algorithm {#alg:<id>}` |
| Exercise checks | `packages/graph-core/src/predicates.ts` | `check: <name> ...` |
| Live properties | `packages/graph-core/src/properties.ts` | `live: <id>, ...` |
| Graph generators | `packages/graph-core/src/dsl/generators.ts` | `use: K(5)` |

`grep -rn "algo:\|check:\|live:" content/` lists what the content needs. The validator fails
on an unknown name.

To add an algorithm: one generator that yields steps, one entry in the registry, one
`algorithm` container with `// @label` lines that the steps refer to, and a test against a
worked example.

## Reader state

`localStorage` key `graph-atlas-progress-v1` (`graph-vue/src/progress.ts`): pages done and
visited by path; quizzes, exercises and flashcards by id. Settings (animation on or off, speed,
easing) in `settings.ts`.

## Checks

- `npm run check`: validator, tests, type check. Run it before every commit.
- `npm run validate`: every `graph` block parses, ids are unique, every reference resolves,
  every `algo`, `check` and `live` name exists, every reference entry is in one topic.
- `npm test`: the DSL, the algorithms, and every number the lessons state about a figure.
