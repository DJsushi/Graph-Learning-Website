# Restructure plan: one concept per page

Agreed with the owner on 2026-11-10. Branch `restructure`. Next task: the first row of §2
without a commit hash.

Delete this file and `BACKLOG.md` when the rollout is finished; move what is still true into
`ARCHITECTURE.md` first.

---

## 1. Start here (main agent)

You orchestrate. You do not write lesson text or feature code yourself, and you do not read
lesson files, large source files or screenshots. The task board (§2) is the only state: a new
session resumes from it.

1. Work on branch `restructure`. Never push. Never touch `main`: it is the live site.
2. Read §1 and §2 of this file. Open §3 to §6, `BACKLOG.md`, the convention files and source
   files only when a step tells you to.
3. Take the first row of §2 that has no commit hash. Do the rows in order; later rows depend
   on earlier ones.
4. Spawn the agent named in the row (§1.1, §1.2). When it returns, verify (§1.3), commit
   (Conventional Commits, task id in the subject: `feat(T1.3): entry lock`), and write the
   short hash in the row's Done cell.
5. Stop at a gate (§6). Otherwise stop after 6 finished tasks, or as soon as the harness has
   summarised this conversation once. Say which task is next.

This works with `/loop`: one task per iteration.

### 1.1 Agents

Defined in `.claude/agents/`. Each one reads its own instructions, so your prompt holds only
the task.

| Agent | Model | Use for |
|-------|-------|---------|
| `coder` | Sonnet | One coding task. Pass `model: "opus"` when the row says `coder (opus)`. |
| `writer` | Opus | One concept page or practice page. |
| `math-checker` | Opus | Independent check of the new mathematics on one page. Read-only. |
| `visual-qa` | Sonnet | Looks at pages in Chrome and measures them, so screenshots stay out of your context. |

If one of these is missing from your Agent tool, use `general-purpose` with the model above and
begin the prompt with "Read `.claude/agents/<name>.md` and follow it."

### 1.2 The prompt you send

| For | Prompt |
|-----|--------|
| Coding task | `Task T1.3 of RESTRUCTURE.md.` Add a fact from an earlier report only if the row cannot contain it. |
| Content task | `Task T3.1 of RESTRUCTURE.md. Target content/algorithms/mst/cut-property.md.` Send it after you moved the source lines (§1.4). |
| Math check | `Check content/algorithms/mst/cut-property.md.` |
| Visual check | `Check /algorithms/mst/cut-property at http://localhost:5173.` Start `npm run dev` outside the sandbox, in the background, once per session. |

### 1.3 Verify after every agent that changed files

- `npm run check` must pass. It is the authority; the agent's report is not.
- `git status --short` shows only files the task should touch.
- For a task that changes the renderer, the theme or the CSS: run `visual-qa` on one affected
  page.
- If the check fails, send the failing lines back to the same agent once (SendMessage). If it
  fails again: rerun a Sonnet task once with `model: "opus"`; for an Opus task stop and tell
  the owner.

Do not read diffs or source files to verify. If you doubt a change, ask `coder` with
`model: "opus"` to review the diff and return one line per finding.

### 1.4 Content task pipeline

1. `node --import tsx scripts/inventory.ts <lecture file>`: find the line ranges of the ids
   that §5 lists for the page.
2. `node --import tsx scripts/move.ts <lecture file> <from> <to> <target>` for each range.
   Line numbers shift after every move: run the inventory again before the next one.
3. `writer`.
4. `math-checker`. Findings go back to the same writer once (SendMessage), then the checker
   runs again. A second failure stops the task: tell the owner.
5. `npm run check`.
6. `visual-qa`.
7. Commit.

One page per writer. Never two writers at once: they cut from the same files.

### 1.5 Spend rules

- Do not spawn an agent for something you can do in three tool calls (a tick, a typo, a
  rename).
- Agents that only read (`math-checker`, `visual-qa`, a review) may run in parallel. Agents
  that write run one at a time.
- Do not ask an agent to explain or summarise beyond its fixed report.
- A backlog item with Checked `no` is unconfirmed. The coder confirms it first and reports
  "not reproducible" instead of changing code.
- A question this plan does not answer: write it in §6, continue with a task that does not
  depend on it, and tell the owner at the end of the session.
- Do not change a budget, a validator rule or a test to make a task pass.

---

## 2. Task board

"Read" names the spec the agent reads: CC = `CONTENT_CONVENTIONS.md`, DSL = `GRAPH_DSL.md`,
R = this file. "Backlog" lists the `BACKLOG.md` ids the task must close.

### Phase 1: tooling and site shell

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T1.1 | Content index: scan `content/{theory,algorithms}/**`, page kinds, new frontmatter, first and last line of every container and figure, build once per build, proof attachment; tests. | coder (opus) | R §4.2, CC §2 | S1 S2 S3 S8 S22 | |
| T1.2 | Tools `scripts/inventory.ts` and `scripts/move.ts`; tests. | coder | R §4.1 | | |
| T1.3 | Entry lock: `scripts/lock-entries.ts`, `content/entries.lock.json`, validator check. | coder | R §4.1 | | |
| T1.4 | Labels without numbers, the `source` tag, proofs open or closed by length. | coder | R §4.3 | S11 S14 S22 | |
| T1.5 | Measuring functions (reading path, words, light and heavy math spans) with unit tests, in `packages/content`. | coder | CC §10 | | |
| T1.6 | Validator: rules E1 to E13, the warnings, exit codes, the extra checks. | coder | CC §10 | S7 S19 S20 | |
| T1.7 | Routing: rewrite for `content/:course/:chapter/:page`, sidebar by chapter, previous and next. | coder | R §4.2 | S8 | |
| T1.8 | Concept page header, done button, lecture page list and hash redirect, progress shape. | coder | R §4.5 | S9 S13 | |
| T1.9 | CSS: prose width, statement tint, header styles. | coder | R §4.4 | S23 S24 | |
| T1.10 | `content/notation.yaml`, `content/techniques.yaml`, generated `/reference/notation` and `/techniques/<id>`, symbols strip. | coder | CC §3.1, §7.4 | | |
| T1.11 | Home, course index and practice overview list chapters and pages; "Continue" works for concept pages. | coder | R §4.2 | | |
| T1.12 | Markdown robustness and dead code. | coder | | S4 S5 S6 S21 | |
| T1.13 | Acceptance: add a throwaway concept page; check header, sidebar, previous/next and Ctrl-K search at 390px, 1366×768, 1920×1080; fix what fails; delete the page. | coder, then visual-qa | R §4 | S10 | |

### Phase 2: graph framework

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T2.1 | Parser: `mark`, `set`, reserved words, marks per step; tests. | coder | DSL §16 | C3 F9 | |
| T2.2 | Marks end to end: registry by figure id, spotlight in `GraphView.vue`, link component, the `[[fig:id#mark\|text]]` rule, vertex hit area. | coder | CC §6.1 | C2 FA2 F11 | |
| T2.3 | Walkthrough: containers, component, sticky layout, scroll sync, stepper driven from outside, keyboard, "Technique" and "This proof uses" lines. | coder (opus) | CC §9 | C1 FA1 | |
| T2.4 | Figure size, enlarge button, one widget dispatch, playground link, drag in the enlarged sandbox. | coder | R §4.4 | C4 FL1 FT1 F1 F7 | |
| T2.5 | Label rendering: KaTeX fallback for edge labels and badges, clipping, label mode per vertex, memoised KaTeX. | coder | | F2 F3 F4 FP1 | |
| T2.6 | Pinned vertices with structured layouts; tests for `geometry.ts` and `rich.ts`; document the weight attribute rule in `GRAPH_DSL.md`. | coder | | F13 FT4 F20 | |
| T2.7 | Figure geometry lint in the validator. | coder | R §4.1 | C5 | |
| T2.8 | Acceptance: a test page with a five-step walkthrough and three mark links; mouse, keyboard, touch emulation; light and dark; 390px, 1366×768, 1920×1080; reduced motion. Fix what fails; delete the page. | coder, then visual-qa | CC §9, §6.1 | | |

### Phase 3: two exemplar pages

| ID | Task | Agent | Read | Done |
|----|------|-------|------|------|
| T3.1 | `content/algorithms/mst/cut-property.md` | §1.4 | R §5, CC §15 | |
| T3.2 | `content/theory/trees/leaves.md` | §1.4 | R §5 | |

**Gate A.** See §6.

### Phase 4: the rest of the pilots

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T4.1 | Stepper `state` and `badge`. | coder | DSL §16.3 | C6 | |
| T4.2 | Player: typed table view, extra panels without `show: residual`, Kruskal shows the sorted edge list and the union-find forest. | coder (opus) | | C7 F18 | |
| T4.3 | Quiz and exercise fixes, progress for written exercises, proof task rendering, "open all compact proofs". | coder | CC §7.4 | F14 F15 F16 F17 S16 S18 | |
| T4.4 | `simulate` accepts every valid next step. | coder (opus) | | F6 | |
| T4.5 | `theory/trees/forests-and-trees.md` | §1.4 | R §5 | | |
| T4.6 | `theory/trees/small-degree-test.md` | §1.4 | R §5 | | |
| T4.7 | `theory/trees/unique-paths.md` | §1.4 | R §5 | | |
| T4.8 | `theory/trees/removing-a-leaf.md` | §1.4 | R §5 | | |
| T4.9 | `theory/trees/tree-characterisations.md` | §1.4 | R §5 | | |
| T4.10 | `theory/trees/spanning-trees.md` | §1.4 | R §5 | | |
| T4.11 | `theory/trees/cayley-formula.md` (needs T4.1) | §1.4 | R §5 | | |
| T4.12 | `theory/trees/practice.md` (needs T4.3) | §1.4 | R §5, CC §7.4 | | |
| T4.13 | `algorithms/mst/minimum-spanning-tree.md` | §1.4 | R §5 | | |
| T4.14 | `algorithms/mst/cuts.md` | §1.4 | R §5 | | |
| T4.15 | `algorithms/mst/cycle-property.md` | §1.4 | R §5 | | |
| T4.16 | `algorithms/mst/distinct-weights.md` | §1.4 | R §5 | | |
| T4.17 | `algorithms/mst/generalized-greedy.md` | §1.4 | R §5 | | |
| T4.18 | `algorithms/mst/kruskal.md` (needs T4.2, T4.4) | §1.4 | R §5 | | |
| T4.19 | `algorithms/mst/union-find.md` (needs T4.2) | §1.4 | R §5 | | |
| T4.20 | `algorithms/mst/practice.md` (needs T4.3) | §1.4 | R §5, CC §7.4 | | |
| T4.21 | Set `needs` on all pilot pages to their sibling pages; check the two chapters end to end at 390px and 1366×768. | coder, then visual-qa | | | |

**Gate B.** See §6.

### Phase 5: rollout

Not planned yet. After Gate B write the page list for the remaining chapters and the order of
conversion, using what the pilots showed about cost and quality. Schedule every `BACKLOG.md`
item marked "Before <chapter>" ahead of its chapter, and settle the items marked "Decide" and
"Later" with the owner.

---

## 3. Why and decisions

The owner and their friends use the site to learn, and find it too dense, too fast, heavy on
notation and light on pictures. Measured on 2026-11-10:

| Fact | Value |
|------|-------|
| Words on 8 lesson pages | 46 000 |
| Height of the Menger page at 1920px | 15 screens, 908 math spans |
| Characters per text line at 1920px | about 160 (comfortable: 60 to 75) |
| Figures | 94, one per 490 words; 46 static, 12 steppers, 15 players |
| Proofs | 90; none has a picture tied to its steps |
| Words in the reading path (outside statements and proofs) | 25 500 |
| Math spans per 100 reading-path words | 7.3 light, 4.5 heavy (`CONTENT_CONVENTIONS.md` §10 defines these) |

Causes:

1. The conventions demand completeness and rigour and never demand a picture, an example or a
   pace. The text is a good reference and a poor first explanation.
2. Inside a concept the order is formal definition, then commentary, then picture. The picture
   often comes after the proof it belongs to.
3. The last revision added an `intuition` block after every entry (173 blocks). They are more
   prose in the same register, with cross-links and forward references.
4. Proofs are open walls of symbols. They hold most of the notation.
5. One lecture is one page.

The exams give some basic results and ask for a full proof of a new statement. So the site
must teach how proofs work (the technique, where each hypothesis is used), and the full proofs
stay.

The graph framework and the site shell are in good shape. They are extended, not replaced.

### Decisions

| Topic | Decision |
|-------|----------|
| Unit of content | One concept per page, 5 to 8 minutes. About 110 to 120 pages when all 8 lectures are done. |
| Chapters | The topics in `content/topics.yaml`. |
| Lecture pages | Keep their URLs. Each shows a generated list of its concept pages, plus whatever part of the old text is not converted yet. |
| Statements and proofs | Moved verbatim with their ids. Never reworded during the move. |
| Proofs on the page | Every step is explained in a walkthrough beside a figure. The compact written proof sits below it, collapsed. |
| Numbers ("Theorem 3.2") | Removed. Entries are shown by kind and name, with a tag pointing into the lecture notes. |
| Text width | Prose is capped at about 68 characters. Figures and walkthroughs use the full column. |
| Figure size | Larger by default, with an obvious enlarge button. |
| Exam preparation | Each proof names its technique and lists what it uses. Chapters get proof tasks in exam format. |
| Pilots | Chapter `trees` (theory) and the core of chapter `mst` (algorithms). Owner reviews before anything else is converted. |
| Framework and shell | Keep VitePress, the DSL and the renderer. |
| Branch | All work happens on `restructure`. `main`, the live site, changes only when the owner merges. |

---

## 4. Implementation specs

What authors see is specified in `CONTENT_CONVENTIONS.md` and `GRAPH_DSL.md`. This section
holds only what those files do not say.

### 4.1 Tooling

- `npm run check` runs the validator, the tests and the type check. It is the gate for every
  change.
- `scripts/inventory.ts <file>` prints one line per heading, container (kind, id, title, first
  and last line, `for`), figure (id, widget, first and last line), quiz and exercise. It uses
  the index of `packages/content`.
- `scripts/move.ts <source> <from> <to> <target>` cuts the lines `from..to` out of the source
  and appends them to the target. It refuses a range that starts or ends inside a container or
  a fence, or that separates a statement from a proof attached to it by position. If the
  target does not exist it creates it with a frontmatter skeleton (CC §2.1, `status: draft`).
  It prints the ids it moved.
- Entry lock. `content/entries.lock.json` maps each statement id to the SHA-256 of its
  container text, and `<id>#proof<n>` to that of each of its proofs (line ends normalised,
  trailing spaces removed). `scripts/lock-entries.ts` writes the file; with `--accept <id>` it
  updates one entry. The validator fails when a locked text differs or a locked id is gone.
  Create the lock from the current content in T1.3, before anything is moved.
- Geometry lint (T2.7), warnings only, for figures with pinned positions: two vertices closer
  than one vertex diameter, a vertex lying on an edge it does not belong to, the number of
  edge crossings. 63 of 94 figures are hand-placed and authors cannot see them. Use the pure
  functions in `packages/graph-vue/src/geometry.ts`.

### 4.2 Content index, pages and routes

| Layer | Source | URL |
|-------|--------|-----|
| Concept page | `content/<course>/<chapter>/<page>.md` | `/<course>/<chapter>/<page>` |
| Chapter practice | `content/<course>/<chapter>/practice.md` | `/<course>/<chapter>/practice` |
| Lecture page | `content/<course>/NN-title.md` (existing files) | unchanged |
| Reference | generated, unchanged | `/reference/...` |
| Techniques | generated from `content/techniques.yaml` | `/techniques/<id>` |
| Notation sheet | generated from `content/notation.yaml` | `/reference/notation` |

Every `[[id]]` link resolves to wherever the container now lives, so the reference, the
flashcards and the hover previews follow the move without edits.

- The index scans `content/{theory,algorithms}/**/*.md`. A file with `chapter` is a concept
  page (or a practice page when `kind: practice`); a file with a numeric `lecture` is a
  lecture page.
- Build the index once per build. Today `loadContent` runs for every link, fence and container
  from `.vitepress/markdown.ts`. The cache key covers every content file and `topics.yaml`,
  `notation.yaml`, `techniques.yaml`.
- Add the rewrite `content/:course/:chapter/:page` in `.vitepress/config.mts`; keep the
  existing one.
- Sidebar per course: one group per chapter of that course (`topics.yaml`, in file order) with
  its pages by `order` and its practice page last, then a group "Lectures". Previous and next
  follow that order.
- Home, the course index and the practice overview list chapters and pages. Lecture pages that
  still have content keep their generated `/practice/<slug>` page.
- The content-claims tests find figures by id; they must keep working when a figure moves.

### 4.3 Labels without numbers

- Remove the generated numbers everywhere (`packages/content/index.ts`, labels, previews,
  flashcards, reference search).
- A box is headed by kind and name: "Theorem · Cut property".
- The default text of `[[thm:cut-property]]` is "Theorem (Cut property)". In the reading path
  always write the link text: `[[thm:cut-property|the cut property]]`.
- The `source` attribute (about 150 containers have it, nothing shows it today) becomes a small
  tag in the box head. Format in the source: `<course>/<document> p<page>`. Show
  "Lecture 2026-09-29, p. 1" for theory and "Slides 01, p. 5" for algorithms.

Proofs: on a concept page a proof longer than 5 source lines renders closed with the summary
"Compact proof"; a shorter one renders open. Lecture pages keep today's behaviour.

### 4.4 Reading layout and figure size

- All doc pages: paragraphs, lists and boxes are at most 68ch wide. Figures and walkthroughs
  use the full content column.
- Concept pages have no right-hand outline (`aside: false`); the pages are short.
- Figure size. Today the height is capped at 200, 300 or 440px
  (`packages/graph-vue/src/GraphBlock.vue`, near line 30) and at 240px per graph when a figure
  has several panels (`widgets/FigureWidget.vue`, near line 43). Required outcome: on a
  1366×768 screen, in every pilot figure at default size, vertex circles are at least 26px
  across and labels at least 14px. A figure may be as wide as its column and up to 70% of the
  viewport height. Keep parsing the `height:` directive so existing content stays valid.
- Enlarge: every figure has an always-visible icon button in its top right corner
  (`aria-label="Enlarge figure"`). A static figure also opens on click and on Enter. Reuse
  `ZoomDialog.vue`. Remove the small "Enlarge" text link.

### 4.5 Lecture pages, page header and progress

- A lecture page shows, under its header, the generated list of concept pages that name it in
  `lectures:`, in chapter order.
- Converting a section means **cutting** it out of the lecture file. The lecture file shrinks.
  When no content section is left, it keeps its frontmatter and one intro paragraph.
- If a visitor arrives on a lecture page with a `#hash` of an entry that has moved, redirect
  to the entry's new URL.
- Progress: concept pages get "Mark as done". The old per-lecture marks are not migrated.
  Quiz, flashcard and exercise progress is keyed by id and survives.

Concept page header: chapter name, title, the `goal`, the `needs` as links, the symbols strip
(CC §3.1), a tag per lecture in `lectures`, and the done button. `LessonHeader.vue` and
`LessonDone.vue` require a truthy `lecture` today. Lecture pages also show their `sources`.

---

## 5. Pilot pages

Ids listed are moved to that page. Split a page further if it breaks a budget; do not merge
pages.

### Theory, chapter `trees` (`content/theory/trees/`)

| Order | File | Moves | Notes |
|-------|------|-------|-------|
| 1 | `forests-and-trees.md` | `def:forest-tree`, fig `t03-forest` | Add a sandbox with live "is a tree" and "has a cycle" readouts (add the properties if `properties.ts` lacks them). |
| 2 | `leaves.md` | `thm:two-leaves`, `def:leaf`, `cor:tree-leaf`, fig `t03-longest-path`, `q:t03-tree-leaves` | Exemplar. Technique: longest path. |
| 3 | `small-degree-test.md` | `cor:acyclic-subgraph-small-degree` | |
| 4 | `unique-paths.md` | `cor:tree-unique-path` | Uses `lem:closed-walk-cycle`, which stays in the lecture file for now. |
| 5 | `removing-a-leaf.md` | `lem:leaf-removal`, fig `t03-leaf-removal` | Sets up induction on trees. |
| 6 | `tree-characterisations.md` | `thm:tree-characterisations`, `cor:forest-edges`, fig `t03-tree-plus-edge`, `q:t03-forest-edges` | Probably `long: true`. One walkthrough per implication chain. |
| 7 | `spanning-trees.md` | `def:spanning-tree`, `prop:spanning-tree-exists`, fig `t03-spanning-tree-exercise` | |
| 8 | `cayley-formula.md` | `thm:cayley`, figs `t03-k4-spanning-trees`, `t03-cayley-construction`, `q:t03-cayley-5` | 37-line proof: the stress test for walkthroughs. |
| | `practice.md` | `exr:t03-leaves-count`, `exr:t03-degree-sequence-tree`, `exr:t03-spanning-trees-cycle`, fig `t03-ex-tree-edges` | Plus three new proof tasks. |

Stays in `content/theory/03-trees.md` for now: "Closed walks and cycles" (the lemma), "Girth
and regular graphs", `q:t03-girth-kmn`.

### Algorithms, chapter `mst`, core part (`content/algorithms/mst/`)

| Order | File | Moves | Notes |
|-------|------|-------|-------|
| 1 | `minimum-spanning-tree.md` | `def:mst`, fig `a01-example-graph` | Introduces the running example used by every page of the chapter. |
| 2 | `cuts.md` | `def:cut` | Also the two unnamed facts from the old prose: a cycle crosses a cut an even number of times; removing a tree edge leaves two components. Show each with a stepper. |
| 3 | `cut-property.md` | `thm:cut-property`, its proof, fig `a01-cut-property` | Exemplar: `CONTENT_CONVENTIONS.md` §15. Technique: exchange argument. |
| 4 | `cycle-property.md` | `thm:cycle-property`, its proof, fig `a01-cycle-property` | |
| 5 | `distinct-weights.md` | `thm:strong-cut-cycle`, `cor:mst-unique` | Includes the convention that all weights are distinct. |
| 6 | `generalized-greedy.md` | `thm:generalized-greedy` | |
| 7 | `kruskal.md` | `alg:kruskal`, figs `a01-kruskal-player`, `a01-ex-kruskal-simulate` | |
| 8 | `union-find.md` | `prop:kruskal-complexity`, `q:a01-kruskal-complexity` | Needs the Phase 4 player views. |
| | `practice.md` | fig `a01-ex-mst`, `exr:a01-max-spanning-tree`, `exr:a01-bottleneck`, `exr:a01-second-best` | Plus three new proof tasks. |

Stays in `content/algorithms/01-minimum-spanning-trees.md`: everything from "Jarník's (Prim's)
algorithm" on.

Until its sibling pages exist, a page lists the lecture page in `needs`. T4.21 replaces these
with the sibling pages.

---

## 6. Gates, feedback and questions

**Gate A** (after T3.2). Stop. Start the dev server outside the sandbox and give the owner the
two URLs. The owner reads both pages in the browser. Write the feedback below, change
`CONTENT_CONVENTIONS.md` (and the budgets, if the owner agrees) to match, and only then go on.
From then on the two approved pages are the exemplar for every writer; delete
`CONTENT_CONVENTIONS.md` §15.

**Gate B** (after T4.21). Stop. The owner and their friends use both chapters. Write the
feedback below. The owner decides whether to merge `restructure` into `main`.

### Feedback log

(empty)

### Open questions for the owner

(empty)
