# Backlog

The complete list from the code and content review of 2026-11-10, plus the open items of the
first content revision (§13). The plan that schedules these is `RESTRUCTURE.md`.

- **When**: `P1`, `P2`, `P4` = do it in that phase of `RESTRUCTURE.md` (the task board names the
  task). `Done` = closed. `Before <chapter>` = do it before converting that chapter (schedule
  it in Phase 5). `Later` = not blocking; do it when the file is touched or after the rollout.
  `Decide` = ask the owner first.
- **Checked**: `yes` = confirmed in the code by the planner. `no` = reported by a review
  subagent; confirm before changing code. Line numbers are approximate.
- Tick an item by appending the commit hash to its row.
- An id that no task row of `RESTRUCTURE.md` §2 names is deferred, whatever its When says: do it
  when a page shows the problem.

## 1. Framework: defects

| ID | Where | Defect | When | Checked |
|----|-------|--------|------|---------|
| F1 | `graph-vue/src/GraphBlock.vue` ~37 | "Open in playground" on a stepper strips `step:` lines but keeps `merge` and `split`; the playground then reports "belongs inside a step". | P2 | no |
| F2 | `graph-vue/src/GraphView.vue` ~451, ~498 | Edge labels and badges have no KaTeX fallback: TeX that the SVG text path cannot render is shown as raw source. | P2 | no |
| F3 | `GraphView.vue` ~488, ~506 | Vertex, group and face labels fall back to KaTeX inside a fixed 80×24 (groups 120×24) box that clips long labels. | P2 | partly |
| F4 | `GraphView.vue` ~83 (`labelsInside`) | One complex vertex label switches every vertex of the figure to a 6.5px dot with an outside label. Decide per vertex. | P2 | no |
| F5 | `GraphBlock.vue` ~27 | No parse options are passed, so `ref(<figure id>)` would throw in the browser; only the validator resolves it. No content uses it yet. | Later | no |
| F6 | `graph-vue/src/widgets/ExerciseWidget.vue` ~80 | `simulate` tasks compare with one fixed run, so an equally valid tie order is rejected. | P4 | no |
| F7 | `graph-vue/src/EditableGraph.vue` ~326, `GraphView.vue` ~289 | In the enlarged sandbox a background drag both starts a selection rectangle and pans. | P2 | no |
| F8 | `graph-core/src/io.ts` ~170 | `toTikZ` re-implements edge labels and bends and has drifted from the renderer; a label that already contains `$` becomes `$$..$$`. | Later | no |
| F9 | `graph-core/src/dsl/parser.ts` ~425 | A vertex named `group`, `class`, `face`, `remove`, `merge` or `split` is parsed as a keyword (soon also `mark`, `set`, `state`, `badge`). `-inf` is not accepted as a number. | P2 | no |
| F10 | `io.ts` `fromJSON` | Imported JSON is not validated. | Later | no |
| F11 | `graph-vue/src/rich.ts` | A link `href` is escaped only for `&`, `<`, `>`; a `"` in a URL breaks the attribute. | P2 | no |
| F12 | `.vitepress/theme/components/Playground.vue` | Document-level listeners (`fullscreenchange`, `matchMedia`) are never removed. | Later | no |
| F13 | `graph-core/src/layout.ts` ~36 | A figure with some pinned vertices and a structured layout (`tree`, `circle`) is re-run through the force layout with seed 1: the structure is lost and `seed=` is ignored. | P2 | no |
| F14 | `graph-vue/src/QuizBlock.vue` ~160 | A quiz solved earlier looks unsolved after a reload. | P4 | no |
| F15 | `QuizBlock.vue` | A single-choice quiz re-grades on every click, so it can be clicked through to "solved". | P4 | no |
| F16 | `QuizBlock.vue` ~22, ~33, ~176 | The component edits slot DOM by hand; the roving tabindex is overwritten (every choice is a tab stop); listeners are never removed. | P4 | no |
| F17 | `ExerciseWidget.vue` ~45, `QuizBlock.vue` ~63 | The numeric-answer comparison exists twice and the copies differ (comma handling). Share one function. | P4 | no |
| F18 | `graph-vue/src/widgets/PlayerWidget.vue` ~63 | State values are split on `,\ ` for display. Replaced by the typed views of C7. | P4 | no |
| F19 | `graph-core/src/algorithms/basic.ts` ~47 | `dfs` has one counter, no finish times, no edge classification, no pseudocode line and no state. | Before a page uses DFS | no |
| F20 | `algorithms/mst.ts`, `flow.ts`, `cuts.ts` | The weight attribute differs between algorithms (`w` and `c`). Document the rule in `GRAPH_DSL.md`; unify if cheap. | Later | no |

## 2. Framework: performance

Measure before optimising, except FP1.

| ID | Where | Problem | When | Checked |
|----|-------|---------|------|---------|
| FP1 | `GraphView.vue` ~489, ~507, ~512, ~516 | `katexHtml()` runs inside `v-html` on every render, so during an animation KaTeX runs per complex label per frame. Memoise by source string. | P2 | no |
| FP2 | `graph-vue/src/tween.ts` `interpolate` | Recomputes default bends and searches the vertex list per vertex per frame. | Later | no |
| FP3 | `EditableGraph.vue` ~265, `Playground.vue` ~92 | Dragging emits a cloned graph per pointer move; the playground then serialises, writes `localStorage` and rewrites the DSL text on every move. | Later | no |
| FP4 | `widgets/SandboxWidget.vue`, `graph-core/src/analysis.ts` | All `live` properties are recomputed per move. Maximum matching is exponential on non-bipartite graphs; chromatic number runs up to 12 vertices. | Later (P4 if the trees sandbox lags) | no |
| FP5 | `GraphBlock.vue`, widgets | No lazy mounting: every figure parses, lays out and (player) runs its whole algorithm at mount, on the server and again in the browser. | Later | no |
| FP6 | `graph-vue/src/positions.ts` | Layout is computed in the browser at mount. The first plan said it is baked at build time; `ARCHITECTURE.md` now states what the code does. Bake it only if pages feel slow. | Later | no |

## 3. Framework: specified but not implemented

`GRAPH_DSL.md` §17 lists these for authors.

| ID | Where | Gap | When | Checked |
|----|-------|-----|------|---------|
| FS1 | `layout.ts` ~32 | `layout: planar` silently uses the force layout. The spec promises a crossing-free drawing. | Before planarity | yes |
| FS2 | `dsl/parser.ts` ~241 | `dual()` throws "not supported yet". | Before planarity | yes |
| FS3 | `layout.ts` ~147 | `layered` is not ELK as specified: it uses BFS levels without dummy nodes, so an edge can run through a vertex or lie inside a level. | Before fast-flows | no |
| FS4 | `layout.ts` | `tree` places vertices by leaf order and ignores non-tree edges. | Later | no |
| FS5 | widgets | `interactive: zoom` is ignored. | Later | no |
| FS6 | `PlayerWidget.vue`, `StepperWidget.vue` | `start` (initial step) is ignored. | Later | no |
| FS7 | `SandboxWidget.vue` | `reset: false` is ignored. | Later | no |
| FS8 | `PlayerWidget.vue` | `editable: true` on a player is ignored. | Later | no |
| FS9 | `GraphView.vue` | `directed-style` is ignored on loops. | Later | no |
| FS10 | `GraphView.vue` | No `hover` event and no arrow-key navigation along adjacency, both promised by the first plan. | Later | no |
| FS11 | `graph-core/src/predicates.ts` | Predicates the first plan listed that do not exist: `is-vertex-cover`, `is-proper-coloring`, `isomorphic-to`, `is-euler-trail`, `is-perfect-matching`, `is-cut`, `is-augmenting-path`. | Each before the chapter that needs it | partly |
| FS12 | `graph-core/src/properties.ts` | Properties the first plan listed that do not exist: `planar`, `radius`. | Before planarity | no |

## 4. Framework: drawing quality

| ID | Where | Problem | When | Checked |
|----|-------|---------|------|---------|
| FL1 | `GraphBlock.vue` ~30, `widgets/FigureWidget.vue` ~43 | Height caps make vertex size differ between figures and make graphs tiny on a laptop. See `RESTRUCTURE.md` §4.4. | P2 | yes |
| FL2 | `graph-vue/src/geometry.ts` ~88 | Edge labels sit 11px off the midpoint with no collision avoidance. | Later (C5 reports collisions) | no |
| FL3 | `geometry.ts` | Straight edges ignore other vertices; there is no routing. | Later (C5 reports it) | no |
| FL4 | `geometry.ts` | Several loops at one vertex point in the same direction. | Later | no |
| FL5 | `geometry.ts` | Two parallel edges on a short edge are only about 10px apart (estimate from the formula). | Later | no |
| FL6 | `geometry.ts` | The mid-arrow on a curved directed edge is placed approximately. | Later | no |
| FL7 | `GraphView.vue` | Faces are straight polygons even when their edges curve. | Before planarity | no |
| FL8 | DSL | An edge cannot be routed through given points. | Before planarity | no |

## 5. Framework: accessibility and input

| ID | Where | Problem | When | Checked |
|----|-------|---------|------|---------|
| FA1 | `widgets/StepControls.vue` ~25 | Step keys work only while focus is inside the controls. A walkthrough must be operable from its steps too. | P2 | no |
| FA2 | `GraphView.vue` ~480 | The vertex hit radius is about 18px, below a 44px touch target. | P2 | no |
| FA3 | `EditableGraph.vue` ~433 | The editor cannot select or create edges by keyboard; Enter on a focused vertex does nothing. | Later | no |
| FA4 | `GraphView.vue` `<desc>` | The screen-reader description lists vertices and edges but not classes or highlights; math labels are read as raw TeX. | Later | no |

## 6. Framework: new capabilities

| ID | Capability | When | Checked |
|----|------------|------|---------|
| C1 | Walkthrough: steps beside a sticky stepper (`CONTENT_CONVENTIONS.md` §9). | P2 | |
| C2 | Marks: text that spotlights figure elements (`CONTENT_CONVENTIONS.md` §6.1). | P2 | |
| C3 | Stepper statement `set` to change attributes of an existing element. Today `a -- b [w=3]` in a step adds a second edge (`dsl/parser.ts` ~388, ~449). | P2 | no |
| C4 | Figure size and the enlarge button (`RESTRUCTURE.md` §4.4). | P2 | |
| C5 | Figure geometry lint in the validator, warnings only, for figures with pinned positions: two vertices closer than one vertex diameter, a vertex lying on an edge it does not belong to, the number of edge crossings. 63 of 94 figures are hand-placed and authors cannot see them. Use `packages/graph-vue/src/geometry.ts`. | Later | |
| C6 | Stepper `state` lines and vertex `badge`s (`GRAPH_DSL.md` §16.3). | Later | |
| C7 | Player: typed `table` state view; extra panels without `show: residual`; Kruskal shows the sorted edge list and the union-find forest. | P4 | no |
| C8 | Stepper with several panels, and `layout-sync` in steppers and players. Today `StepperWidget.vue` draws `doc.panels[0]` only and `layout-sync` works in static figures only. | Before flows, Menger, Gomory–Hu | yes |
| C9 | Matching elements across two panels: highlighting one highlights its partner. | With C8 | |
| C10 | Free annotations on the canvas: a note, a brace, an arrow, a "this edge is missing" mark. Today only vertices, edges, groups and faces can be drawn; vertices are always circles. | Before the first page that needs one | no |
| C11 | Non-graph visuals, each when its chapter needs it: intervals on a line (chordal; `t04-interval-graph` cannot draw its intervals today), bars for degree sequences (degrees), heap and array views (Jarník, Fredman–Tarjan), a matrix view. Tree-shaped state (recursion tree, union-find) can be a graph panel. | Before that chapter | yes |
| C12 | Planarity: a planar layout or an authored embedding, edges through given points (FL8), faces that follow curves (FL7), the dual (FS2) drawn over the primal graph. | Before planarity | |
| C13 | Colouring: an exercise task where the reader assigns colours to vertices, and `is-proper-coloring`. Today the tasks are `select-*`, `build`, `simulate`, `answer`. | Before colouring | yes |
| C14 | Matchings: generators for augmenting-path bipartite matching, the Hungarian algorithm and Edmonds' blossom algorithm; `is-perfect-matching`. Contraction, badges and the `matched` class exist. | Before matchings | |
| C15 | `simulate` for more algorithms: only `bfs`, `kruskal` and `jarnik` emit the action the reader must reproduce. | Per chapter | no |
| C16 | Property witnesses: a live property can highlight why (the odd cycle, the bridge, the cycle that makes it not a tree). Properties return strings only today. | Later (useful for the trees sandbox) | no |
| C17 | Build exercise with a live check ("build a counterexample"); today a built graph is checked on demand only. | Later | no |
| C18 | Inline figure: a small graph inside a sentence or a table cell, without the card, caption row and links. | Later | no |
| C19 | Reverse marks: pointing at a figure element highlights the matching text. | Later | |
| C20 | Pointing at a symbol inside a formula shows its meaning. | Later | |
| C21 | Playground: the algorithm parameter form is hard-coded (`Playground.vue` ~209); a new parameter name needs an edit there. | When adding an algorithm | no |
| C22 | One step model. Authored steppers use `StepDoc` (`dsl/parser.ts`: a whole-graph snapshot and a caption); players use `Step` (`algorithms/types.ts`: overlay, badges, panels, state). C6 narrows the gap. If steppers keep needing player features after Gate B, make authored steps produce `Step` objects and delete the separate path. | Decide after Gate B | yes |

## 7. Framework: cleanup and tests

| ID | Where | Item | When | Checked |
|----|-------|------|------|---------|
| FT1 | `GraphBlock.vue` ~49, ~57 | The widget dispatch is written twice (inline and in the enlarge dialog). Make it one. | P2 | no |
| FT2 | `GraphView.vue` | The label `tspan` template is repeated three times. | Later | no |
| FT3 | `dsl/parser.ts` (649 lines), `GraphView.vue` (521), `EditableGraph.vue` (471), `Playground.vue` (517) | Large files that mix concerns. Split one only when a change needs it. | Later | yes |
| FT4 | tests | No tests for `layout.ts`, `geometry.ts`, `texsvg.ts`, `rich.ts`, direct predicate cases, properties, or any component. Add tests for what Phase 2 touches (`geometry.ts`, `rich.ts`, parser additions). | P2 for touched code, rest Later | no |
| FT5 | `tween.ts`, `easing.ts`, settings | Candidates for deletion: the metaball merge and spring fan-out animations (used by 21 `merge`/`split` lines), the Bezier easing editor (keep on/off and speed), hyperedges, mid-arrows, `interactive` (no content uses them). Keep faces: planarity needs them. | Decide | no |

## 8. Site shell and content pipeline: defects

| ID | Where | Defect | When | Checked |
|----|-------|--------|------|---------|
| S1 | `.vitepress/markdown.ts` ~48, ~88, ~111, ~181; `packages/content/index.ts` ~92 | `loadContent` runs for every link, fence and container and stats every lesson file each time. Cost grows with the square of the page count. | P1 | no |
| S2 | `content/index.ts` ~159 | The index scanner needs `:::` at column 0; the renderer accepts up to 3 spaces. An indented container renders but has no index entry, no reference entry and no link target. Rule E12 guards this. | P1 | no |
| S3 | `content/index.ts` ~174 | A proof attaches to the last statement, and a `claim` counts as one. A proof that follows a proof containing a claim attaches to the claim and disappears from the reference. A proof with no statement is not reported. | P1 | no |
| S4 | `packages/content/pages.ts` ~376, `.vitepress/data/refs.data.ts` ~51, ~59 | Figures are stripped with a regex that breaks on four-backtick fences. | P1 | no |
| S5 | `markdown.ts` ~31 `inlineMath` | Splits on `$` and breaks on `\$`. | P1 | no |
| S6 | `markdown.ts` `linkRefs` | A regex runs over raw DSL source. Confirm what it can corrupt. | P1 | no |
| S7 | `markdown.ts` `anchorId` | Lossy: `thm:a.b` and `thm:a-b` give the same anchor. Add a validator check. | P1 | no |
| S8 | `.vitepress/config.mts`, `content/index.ts` | Sidebar and navigation are built when the config loads, so a new file needs a dev-server restart. The index cache key covers lesson files only; it must also cover the new folders and `topics.yaml`, `notation.yaml`, `techniques.yaml`. | P1 | partly |
| S9 | `graph-vue/src/progress.ts` | `loadProgress` does not validate the stored shape and has no version migration. | P1 | no |
| S10 | `.vitepress/search.ts` ~135 | The path match for dynamic routes was not verified. Confirm that Ctrl-K finds concept pages, statements by name, and the generated pages. | P1 | no |
| S11 | `content/index.ts` ~126, ~170 | Two files with the same `lecture` both produce "Theorem 3.1"; claims with ids use up theorem numbers. Both disappear with the numbers (`RESTRUCTURE.md` §4.3). | P1 | no |
| S12 | `PLAN.md` | Said the base path is `/graph-learning-website/`; the config default is `/`. | Done (`PLAN.md` deleted) | no |

## 9. Site shell: unused or half-finished

| ID | Where | Item | When | Checked |
|----|-------|------|------|---------|
| S13 | frontmatter | `prerequisites` and `sources` are read by nothing. `needs` replaces `prerequisites`; show `sources` on lecture pages. | P1 | no |
| S14 | containers | `source=` on about 150 containers is never shown or validated. See `RESTRUCTURE.md` §4.3; validate its format. | P1 | no |
| S15 | `progress.ts` | `attempted` and `cards[].seen` are written and never read, so flashcards have no repetition by date. Use them or remove them. | Decide | no |
| S16 | `.vitepress/data/site.data.ts` ~105 | Written exercises have no progress and are not counted; only figure exercises and quizzes are. Give every written exercise the "I solved it" button of `CONTENT_CONVENTIONS.md` §7.4 and count it. | P4 | no |
| S17 | `.vitepress/theme/components/Settings.vue` | Settings cover animation only. No text size control. | Decide | no |
| S18 | proofs | No "open all compact proofs" control for revision. | P4 | no |

## 10. Validator gaps beyond the budgets

| ID | Item | When | Checked |
|----|------|------|---------|
| S19 | Lint messages are printed and never fail the build (`scripts/validate-content.ts` ~131). The errors of `CONTENT_CONVENTIONS.md` §10 must fail it. | P1 | partly |
| S20 | Missing checks: unique `slug` and `lecture`; required frontmatter fields; the id prefix matches the container type; a figure id starts with a lecture slug; every quiz has an id (without one its progress is lost silently) and an `explanation`. | P1 | no |

## 11. Site shell: cleanup and tests

| ID | Where | Item | When | Checked |
|----|-------|------|------|---------|
| S21 | `markdown.ts` ~129 (`opened`), `pages.ts` ~259 (`fenced()`), `kindName`, `practiceLessons`, `.ga-page` CSS | Dead code. | P1 | no |
| S22 | tests | No tests for `markdown.ts`, `resolveTarget` or labels. Add them for what Phase 1 changes. | P1 | no |

## 12. Reading experience and site ideas

| ID | Item | When | Checked |
|----|------|------|---------|
| S23 | Text lines are about 160 characters at 1920px (`custom.css` ~645 removes the column cap). See `RESTRUCTURE.md` §4.4. | P1 | yes |
| S24 | Theorem boxes use the same neutral grey as the base tint, while definitions, algorithms and pitfalls have their own colour. Give statements their own tint. | P1 | no |
| S25 | Boxes have no entry in the page outline. Concept pages have no outline; lecture pages keep theirs. | Later | no |
| S26 | A concept map page: the prerequisite graph of all pages, drawn with the framework, with progress marks. | Later | |
| S27 | Estimated reading time in the page header, computed from the reading-path word count. | Later | |
| S28 | A flag for exam-relevant or optional pages and entries. Today only `extra=true` ("beyond the lectures") exists. | Decide | no |

## 13. Content: open items from the first revision

From the report of the first content revision (October 2026). It covered the 7 lessons that
existed then; `a03` (minimum cuts) was written later and was not part of it, so the owner
should decide whether it gets the same check against the slides. Every
change it made to a statement or proof is marked `<!-- REVIEW: ... -->` in the lesson. These
items are for the owner; none blocks the restructure.

### Departures from the lecture
- t01 `thm:havel-hakimi`: hypothesis d_1 ≤ n − 1 added (needed for φ_1; remark after the theorem).
- t02 `thm:bipartite-odd-cycle`: the title "König" is not in the lecture.
- t04 `def:chordal`: "every cycle of length ≥ 4 has a chord" (lecture: "every cycle has a chord").
- t05 the hypotheses listed above for Menger, total Menger, 2-connected cycles and ears are not on the board.
- t05 the K_n convention for multigraphs (underlying simple graph K_n) is our reading of the board.
- a01 Jarník array INSERT is O(1) (slide p15: n). Total O(n²) is unchanged.
- a01 Pettie–Ramachandran is O(T*(m,n)) (slide p25: O(m T*(m,n))).
- a01 Jarník runs n − 1 rounds (slide: n − 2); Kruskal with union by rank is O(m log n) (slide: O(n log n)).
- a01 Fredman–Tarjan phase bound log* n + 1 for m < n (slide p32 garbled).
- a02 `lem:dinic-phases`: ≤ n − 1 phases (lecture: n); `q:a02-dinic-phases` answer 49 (lecture's bound gives 50).
- a02 additions not on the slides: net-value paragraph, antiparallel note, Menger reduction, `cor:integrality` as its
  own corollary, Hopcroft–Karp O(√n) remark.

### New reference entries
| id | lesson | extra | source |
|---|---|---|---|
| `def:leaf` | t03 | no | none (≈ 2026-09-29 p2–3, not set) |
| `def:minimum-degree` | t04 | no | theory/2026-10-06 p5 (where δ is used) |
| `def:cut-vertex-bridge` | t05 | yes | none (the lecture does not define it) |
| `def:cut` | a01 | no | algorithms/01 p5 (slides use the term, never define it) |
| `def:msf` | a01 | no | algorithms/01 p40 |

### SOURCE UNCLEAR spots
- `content/theory/01-basic-notions.md:298` (`t01-iso-multigraph`): the lecture drawing H (2026-09-15 p4) has doubled
  edges 34 and 45. As drawn, H is not isomorphic to G. The lesson uses a pentagram drawing, which is isomorphic.
  The recording could settle this.

### Open questions
**Sources and attribution**
- `def:leaf` has no `source`. Does the lecture define δ(G) separately (`def:minimum-degree` cites p5)?
- `def:cut` and `def:msf` are not marked `extra`, although the lecture only uses the terms.
- Names not in the lecture (standard): König, Pitman (Cayley proof), cage problem, Whitney, κ/λ notation, Tarjan
  (generalized greedy), Harris–Ross, Hopcroft–Karp.
- t03 base case "OK for d, k ∈ {3,4}" is read as k ∈ {3,4} for every d (K_{d+1}, K_{d,d}).

**Unproved standard facts (in remarks, intuitions or pitfalls)**
- t01: the 2-switch connectivity claim.
- t02: BFS runs in O(n + m).
- a01: a contracted tree is a tree; no deterministic linear-time MST is known; Borůvka parallelises; small integer
  weights make Kruskal O(m α(n)); high-probability and worst-case KKT remarks.
- a02: real capacities can make FF converge to a non-maximum value; subdividing arcs keeps the arc-disjoint path
  counts; Lemma A is tight; informal Dinic prefix re-walk.

**Presentation**
- a01: Edmonds "contractions" link to the undirected `def:edge-contraction`; directed contraction is prose only.
- a02: there is no König–Egerváry entry to link. The render of the `a02-cut-crossing` figure (two edge classes) is
  unchecked.
- t04: `t04-hamiltonian-switch` has d(x) + d(y) = 6 < n = 7. It shows only the switch; the caption makes no degree claim.
- t04 uses "cut vertices" (plural), which the lint does not match to `def:cut-vertex-bridge`.

### Needs your decision
- `status: draft` on all 7 lessons (7 validate warnings). Flip to reviewed once you have read them.
- The SOURCE UNCLEAR on `t01-iso-multigraph` (1 validate warning). Remove it once settled.
- Every item under "Departures from the lecture": keep, or revert to the slides/board.
- Entries without a lecture source: `def:leaf` (no source), `def:cut-vertex-bridge` (extra, no source); `def:cut`
  and `def:msf` (term used but not defined; mark `extra`?).
- `def:minimum-degree` sits in the hamiltonian topic, where it is first used. It could also go in degrees.

## 14. Deferred parts of the plan

Cut on 2026-11-10 to fit the usage limit. None is needed for the split or the walkthroughs.

| ID | Item | When |
|----|------|------|
| D1 | Budget checks for taught pages: measuring functions (reading path, words, light and heavy math spans) in `packages/content` with unit tests, and rules E1 to E11 of `CONTENT_CONVENTIONS.md` §10 in the validator. | Before more than a few pages are rewritten |
| D2 | Notation: `content/notation.yaml`, the "Symbols on this page" strip, `/reference/notation` (`CONTENT_CONVENTIONS.md` §3.1). | Decide |
| D3 | Techniques: `content/techniques.yaml`, the `technique=` attribute, `/techniques/<id>` (`CONTENT_CONVENTIONS.md` §7.4). | Decide |
| D4 | Proof tasks in exam format: `exercise` with `kind=proof given=`, hints one at a time, an "I solved it" button; about three per chapter, each checked by the math checker (`CONTENT_CONVENTIONS.md` §7.4, §13). The owner's exams ask for exactly this kind of task. | Decide |
| D5 | Chapter practice pages; home, course index and practice overview by chapter instead of by lecture. | Later |
| D6 | `needs`: prerequisites per page, shown in the page header. The concept map (S26) needs it. | Later |
| D7 | Walkthroughs for short proofs. | Done: now in the plan, every proof gets one |
