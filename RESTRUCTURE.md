# Restructure plan: one concept per page

Agreed with the owner on 2026-11-10, cut down the same day to fit a Pro plan. Branch
`restructure`. Next task: the first row of §2 without a commit hash.

The approach in one paragraph: a script splits the 8 lecture files into about 100 concept
pages without changing a word. Every page then gets the cheap improvements (narrow text, large
figures, long proofs closed). Model time is spent only where it matters most: a step-by-step
walkthrough beside a figure for each of the 24 proofs longer than 10 lines. A full rewrite of a
page happens only when the owner asks for it.

Delete this file and `BACKLOG.md` when the work is finished; move what is still true into
`ARCHITECTURE.md` first.

---

## 1. Start here (main agent)

Run the main session on **Sonnet**. You orchestrate. You do not write lesson text or feature
code yourself, and you do not read lesson files, large source files or screenshots. The task
board (§2) is the only state: a new session resumes from it.

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

Defined in `.claude/agents/`. Each one carries its own instructions, so your prompt holds only
the task.

| Agent | Model | Use for |
|-------|-------|---------|
| `coder` | Sonnet | One coding task. Pass `model: "opus"` when the row says `coder (opus)`. |
| `writer` | Opus | One walkthrough, or one full page rewrite. Pass `model: "sonnet"` when the row or the Gate B decision (§6) says so. |
| `math-checker` | Opus | Independent check of the new mathematics on one page. Read-only. Always Opus. |
| `visual-qa` | Sonnet | Looks at pages in Chrome and measures them, so screenshots stay out of your context. |

If one of these is missing from your Agent tool, use `general-purpose` with the model above and
begin the prompt with "Read `.claude/agents/<name>.md` and follow it."

### 1.2 The prompt you send

| For | Prompt |
|-----|--------|
| Coding task | `Task T1.3 of RESTRUCTURE.md.` Add a fact from an earlier report only if the row cannot contain it. |
| Walkthrough | `Walkthrough for the 17-line proof on content/theory/trees/leaves.md.` |
| Full rewrite | `Taught rewrite of content/algorithms/mst/cut-and-cycle-properties.md.` |
| Math check | `Check content/theory/trees/leaves.md.` |
| Visual check | `Check /theory/trees/leaves at http://localhost:5173.` Start `npm run dev` outside the sandbox, in the background, once per session. |

### 1.3 Verify after every agent that changed files

- `npm run check` must pass. It is the authority; the agent's report is not.
- `git status --short` shows only files the task should touch.
- If the check fails, send the failing lines back to the same agent once (SendMessage). If it
  fails again: rerun a Sonnet task once with `model: "opus"`; for an Opus task stop and tell
  the owner.

Do not read diffs or source files to verify. If you doubt a change, ask `coder` with
`model: "opus"` to review the diff and return one line per finding.

### 1.4 Content task pipeline

1. `writer`.
2. `math-checker`. Findings go back to the same writer once (SendMessage), then the checker
   runs again. A second failure stops the task: tell the owner.
3. `npm run check`.
4. Commit.

Run `visual-qa` once per chapter, on the pages that changed, not once per page. One writer at
a time.

### 1.5 Spend rules

- Do not spawn an agent for something you can do in three tool calls (a tick, a typo, a
  rename).
- Agents that only read (`math-checker`, `visual-qa`, a review) may run in parallel. Agents
  that write run one at a time.
- Do not ask an agent to explain or summarise beyond its fixed report.
- A backlog item with Checked `no` is unconfirmed. The coder confirms it first and reports
  "not reproducible" instead of changing code.
- A writer that reports NEEDS (the figure language cannot show something) does not get a new
  feature built for it. Write the need in §6 and go on.
- A question this plan does not answer: write it in §6, continue with a task that does not
  depend on it, and tell the owner at the end of the session.
- Do not change a validator rule, a lock entry or a test to make a task pass.

---

## 2. Task board

"Read" names the spec the agent reads: CC = `CONTENT_CONVENTIONS.md`, DSL = `GRAPH_DSL.md`,
R = this file. "Backlog" lists the `BACKLOG.md` ids the task must close.

### Phase 1: split the lectures into concept pages

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T1.1 | Content index: scan `content/{theory,algorithms}/**`, page kinds, the new frontmatter, first and last line of every container and figure, build once per build, proof attachment; tests. | coder (opus) | R §4.2, CC §2 | S1 S2 S3 S8 S22 | |
| T1.2 | Routes and pages: rewrite for `content/:course/:chapter/:page`, sidebar by chapter, previous and next, concept page header, done button, "Continue", lecture page list and hash redirect, progress shape. | coder | R §4.2, §4.5 | S8 S9 S13 | |
| T1.3 | Entry lock: `scripts/lock-entries.ts`, `content/entries.lock.json` made from the current content, validator check. | coder | R §4.1 | | |
| T1.4 | Labels without numbers and the `source` tag. | coder | R §4.3 | S11 S14 S22 | |
| T1.5 | Reading layout: prose width, statement tint, long proofs closed, figure size, enlarge button. | coder | R §4.3, §4.4 | S23 S24 FL1 C4 FT1 | |
| T1.6 | Validator: checks for concept pages, exit codes, the extra checks, the list of long proofs without a walkthrough. | coder | R §4.1 | S7 S19 S20 | |
| T1.7 | `scripts/split.ts` with tests. Do not run it on `content/` yet. | coder | R §4.1 | | |
| T1.8 | Run the split on all 8 lecture files. Fix what breaks. Check three pages and Ctrl-K search at 390px and 1366×768. Delete `scripts/split.ts` and `scripts/split-map.yaml`. | coder, then visual-qa | R §4.1 | S10 | |

**Gate A.** See §6.

### Phase 2: walkthroughs and marks in the framework

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T2.1 | Parser: `mark`, `set`, reserved words, marks per step; tests. | coder | DSL §16 | C3 F9 | |
| T2.2 | Marks end to end: registry by figure id, spotlight in `GraphView.vue`, link component, the `[[fig:id#mark\|text]]` rule, vertex hit area. | coder | CC §6.1 | C2 FA2 F11 | |
| T2.3 | Walkthrough: containers, component, sticky layout, scroll sync, stepper driven from outside, keyboard, the "This proof uses" line. | coder (opus) | CC §9 | C1 FA1 | |
| T2.4 | Validator rules for walkthroughs and mark links. | coder | R §4.1 | | |
| T2.5 | Acceptance: a test page with a five-step walkthrough and three mark links; mouse, keyboard, touch emulation; light and dark; 390px, 1366×768, 1920×1080; reduced motion. Fix what fails; delete the page. | coder, then visual-qa | CC §9, §6.1 | | |

### Phase 3: three exemplar pages

| ID | Task | Agent | Done |
|----|------|-------|------|
| T3.1 | Walkthrough for the 17-line proof on `content/theory/trees/leaves.md`. | writer, math-checker | |
| T3.2 | Walkthrough for the 19-line proof on `content/theory/walks-connectivity/closed-walks.md`. | writer with `model: "sonnet"`, math-checker | |
| T3.3 | Taught rewrite of `content/algorithms/mst/cut-and-cycle-properties.md`: the whole page to the full template. The cut property follows CC §15; treat the cycle property the same way. | writer, math-checker | |
| T3.4 | Check the three pages at 390px and 1366×768. | visual-qa | |

**Gate B.** See §6.

### Phase 4: walkthroughs for the other long proofs

One row per proof longer than 10 source lines. Pipeline §1.4. The writer's model is the one
the owner chose at Gate B. After the last row of a chapter, run `visual-qa` on its changed
pages.

| ID | Page (under `content/`) | Proof lines | Done |
|----|-------------------------|-------------|------|
| T4.1 | `theory/trees/tree-characterisations.md` | 21 | |
| T4.2 | `theory/trees/cayley-formula.md` | 37 | |
| T4.3 | `theory/bipartite/odd-cycles.md` | 27 | |
| T4.4 | `theory/degrees/havel-hakimi.md` | 54 | |
| T4.5 | `theory/degrees/erdos-gallai.md` | 95 | |
| T4.6 | `theory/degrees/regular-graphs-of-large-girth.md` | 37 | |
| T4.7 | `theory/chordal/minimal-cuts.md` | 22 | |
| T4.8 | `theory/chordal/two-simplicial-vertices.md` | 19 | |
| T4.9 | `theory/hamiltonian/hamiltonian-completion.md` | 23 | |
| T4.10 | `theory/menger/vertex-version-from-edge-version.md` | 17 | |
| T4.11 | `theory/menger/proving-the-edge-version.md` | 28 | |
| T4.12 | `theory/menger/back-to-undirected-graphs.md` | 16 | |
| T4.13 | `theory/menger/set-version.md` | 12 | |
| T4.14 | `theory/menger/two-connected-graphs.md` | 12 | |
| T4.15 | `theory/menger/ear-decompositions.md` | 14 | |
| T4.16 | `algorithms/mst/generalized-greedy.md` | 15 | |
| T4.17 | `algorithms/mst/sampling-lemma.md` | 21 | |
| T4.18 | `algorithms/arborescences/edmonds-algorithm.md` | 11 | |
| T4.19 | `algorithms/gomory-hu/gomory-hu-lemma.md` | 16 | |
| T4.20 | `algorithms/gomory-hu/correctness.md` | 33 | |
| T4.21 | `algorithms/gomory-hu/correctness.md` | 14 | |
| T4.22 | `algorithms/global-min-cut/karger-success-probability.md` | 11 | |

**Gate C.** See §6.

### Later, only when the owner asks

- Walkthroughs for the 24 proofs of 6 to 10 lines (`npm run validate` lists them).
- Taught rewrites of pages the owner names. Do `BACKLOG.md` D1 first if there are more than a
  few.
- The deferred parts in `BACKLOG.md` §14, and the items marked "Before <chapter>" when the
  lectures on planarity, colouring and matchings are added.

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
| Unit of content | One concept per page: 101 pages, listed in `scripts/split-map.yaml`. |
| How pages are made | A script cuts the lecture files. No text changes; a hash lock proves it. |
| Chapters | The topics in `content/topics.yaml`. |
| Lecture pages | Keep their URLs. Each shows its intro, the generated list of its concept pages, its summary and its exercises. |
| Long proofs | Each proof over 10 source lines gets a walkthrough beside a figure. The written proof stays below it, closed. |
| Full rewrites | Only for pages the owner names. The template and budgets are in `CONTENT_CONVENTIONS.md` §8 to §11. |
| Numbers ("Theorem 3.2") | Removed. Entries are shown by kind and name, with a tag pointing into the lecture notes. |
| Text width | Prose is capped at about 68 characters. Figures and walkthroughs use the full column. |
| Figure size | Larger by default, with an obvious enlarge button. |
| Models | Sonnet orchestrates and codes. Opus checks all new mathematics. Who writes walkthroughs is decided at Gate B. |
| Deferred | Notation registry, technique pages, proof tasks in exam format, chapter practice pages, budget checks: `BACKLOG.md` §14. |
| Framework and shell | Keep VitePress, the DSL and the renderer. |
| Branch | All work happens on `restructure`. `main`, the live site, changes only when the owner merges. |

---

## 4. Implementation specs

What authors see is specified in `CONTENT_CONVENTIONS.md` and `GRAPH_DSL.md`. This section
holds only what those files do not say.

### 4.1 Tooling and validator

- `npm run check` runs the validator, the tests and the type check. It is the gate for every
  change.
- **Entry lock.** `content/entries.lock.json` maps each statement id to the SHA-256 of its
  container text, and `<id>#proof<n>` to that of each of its proofs (line ends normalised,
  trailing spaces removed). `scripts/lock-entries.ts` writes the file; with `--accept <id>` it
  updates one entry. The validator fails when a locked text differs or a locked id is gone.
  The lock is made in T1.3, before anything moves, so the split is proven to be verbatim.
- **Split.** `scripts/split.ts` reads `scripts/split-map.yaml` (its header explains the
  format). For each lecture file:
  - a page that starts at a heading starts at that line, and the heading line itself is
    dropped (the title replaces it);
  - a page that starts at an id starts on the first line after the previous container or
    fence, so the lead-in text comes along;
  - a page ends where the next one starts; `stay` ends the last page;
  - the page file is `content/<course>/<page>.md` with frontmatter `title`, `course`,
    `chapter` (the folder), `order` (running number per chapter, lecture files in order),
    `lectures: [<slug>]`, `stage: split`, `status: draft`;
  - the lecture file keeps its frontmatter, the text before the first page, and everything
    from `stay` on;
  - it stops with a clear message when an anchor is missing or not unique.
- **Validator for concept pages** (T1.6). Errors: missing or unknown `chapter`, `order` not
  unique in its chapter, `lectures` that do not resolve, a container fence that does not start
  at column 0, a quiz without id or explanation, two ids with the same anchor, a locked entry
  that changed. A lint message is printed; an error fails the run. Also print, as a warning,
  every proof longer than 10 source lines without a walkthrough, and count the ones of 6 to 10
  lines.
- **Validator for walkthroughs and marks** (T2.4). Errors: the first child of a walkthrough is
  not a `widget=stepper` figure; the number of `::: step` blocks differs from the number of
  `step:` lines; a step has more than 60 words; `for=` does not name a statement on the same
  page; a mark link without link text, to a figure on another page, or to a mark that is not
  declared.

### 4.2 Content index, pages and routes

| Layer | Source | URL |
|-------|--------|-----|
| Concept page | `content/<course>/<chapter>/<page>.md` | `/<course>/<chapter>/<page>` |
| Lecture page | `content/<course>/NN-title.md` (existing files) | unchanged |
| Reference, practice, exam | generated, unchanged | unchanged |

- The index scans `content/{theory,algorithms}/**/*.md`. A file with `chapter` is a concept
  page; a file with a numeric `lecture` is a lecture page.
- Every `[[id]]` link resolves to wherever the container now lives, so the reference, the
  flashcards and the hover previews follow the split without edits.
- Build the index once per build. Today `loadContent` runs for every link, fence and container
  from `.vitepress/markdown.ts`. The cache key covers every content file and `topics.yaml`.
- Add the rewrite `content/:course/:chapter/:page` in `.vitepress/config.mts`; keep the
  existing one.
- Sidebar per course: one group per chapter of that course (`topics.yaml`, in file order) with
  its pages by `order`, then a group "Lectures". Previous and next follow that order.
- Exercises and quizzes stay in the lecture files, so the generated `/practice/<slug>` pages
  and the exam pages need no change.
- The content-claims tests find figures by id; they must keep working when a figure moves.

### 4.3 Labels and proofs

- Remove the generated numbers everywhere (`packages/content/index.ts`, labels, previews,
  flashcards, reference search).
- A box is headed by kind and name: "Theorem · Cut property".
- The default text of `[[thm:cut-property]]` is "Theorem (Cut property)". In the reading path
  always write the link text: `[[thm:cut-property|the cut property]]`.
- The `source` attribute (about 150 containers have it, nothing shows it today) becomes a small
  tag in the box head. Format in the source: `<course>/<document> p<page>`. Show
  "Lecture 2026-09-29, p. 1" for theory and "Slides 01, p. 5" for algorithms.

Proofs on a concept page: a proof longer than 10 source lines, or one that has a walkthrough,
renders closed. Its summary is "Compact proof" when it has a walkthrough and "Proof" otherwise.
Other proofs render open. Lecture pages keep today's behaviour.

### 4.4 Reading layout and figure size

- All doc pages: paragraphs, lists and boxes are at most 68ch wide. Figures and walkthroughs
  use the full content column.
- Concept pages have no right-hand outline (`aside: false`); the pages are short.
- Figure size. Today the height is capped at 200, 300 or 440px
  (`packages/graph-vue/src/GraphBlock.vue`, near line 30) and at 240px per graph when a figure
  has several panels (`widgets/FigureWidget.vue`, near line 43). Required outcome: on a
  1366×768 screen, in every figure at default size, vertex circles are at least 26px
  across and labels at least 14px. A figure may be as wide as its column and up to 70% of the
  viewport height. Keep parsing the `height:` directive so existing content stays valid.
- Enlarge: every figure has an always-visible icon button in its top right corner
  (`aria-label="Enlarge figure"`). A static figure also opens on click and on Enter. Reuse
  `ZoomDialog.vue`. Remove the small "Enlarge" text link.

### 4.5 Lecture pages, page header and progress

- A lecture page shows, under its header, the generated list of concept pages that name it in
  `lectures:`, in chapter order.
- After the split a lecture file keeps its frontmatter, its intro, its `## Summary` and its
  `## Exercises`.
- If a visitor arrives on a lecture page with a `#hash` of an entry that has moved, redirect
  to the entry's new URL.
- Progress: concept pages get "Mark as done". The old per-lecture marks are not migrated.
  Quiz, flashcard and exercise progress is keyed by id and survives.

Concept page header: chapter name, title, a tag per lecture in `lectures` that links to the
lecture page, the `goal` when the page has one, and the done button. `LessonHeader.vue` and
`LessonDone.vue` require a truthy `lecture` today. "Continue" on the home page must work for
concept pages. Lecture pages also show their `sources`.

---

## 5. The exemplars

- T3.1 and T3.2 are the same kind of task on proofs of similar length, one written by Opus and
  one by Sonnet, both checked by Opus. The owner compares them at Gate B.
- T3.3 shows what a full rewrite gives on top of a walkthrough, so the owner can decide whether
  any page is worth it.
- Until Gate B the model for a walkthrough is the block in `CONTENT_CONVENTIONS.md` §15. After
  Gate B it is the approved page.

---

## 6. Gates, feedback and questions

**Gate A** (after T1.8). Stop. Start the dev server outside the sandbox and give the owner the
URL. The site now has about 100 short pages with the old text. The owner checks the page
titles and URLs (they are permanent once merged) and the look. Write the feedback below.

**Gate B** (after T3.4). Stop. Give the owner the three URLs. The owner decides, and you write
down here:

1. who writes the remaining walkthroughs: Opus or Sonnet;
2. whether any page gets a taught rewrite, and which;
3. changes to the writer's rules (then edit `.claude/agents/writer.md`).

**Gate C** (after T4.22). Stop. The owner and their friends use the site. The owner decides
whether to merge `restructure` into `main` and what to do from "Later".

### Decisions and feedback

(empty)

### Needs reported by writers

(empty)

### Open questions for the owner

(empty)
