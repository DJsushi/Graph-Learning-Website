# Restructure plan: one concept per page

Agreed with the owner on 2026-11-10, cut down the same day to fit a Pro plan. Branch
`restructure`. Next task: the first row of §2 without a commit hash.

The approach in one paragraph: a script splits the 8 lecture files into about 100 concept
pages without changing a word. Every page then gets the cheap improvements (narrow text, large
figures, long proofs closed). Model time goes to the proofs: every proof gets a step-by-step
explanation with a figure that changes with the steps, and fills in what the written proof
skips. Every definition and statement gets an example figure. The lecturer's drawings are the
starting point; the owner wants more figures than the lecture has. Graph theory comes first: the owner has an exam on lectures 1 to 5
around 2026-11-24. A full rewrite of a page happens only when the owner asks for it.

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
3. Take the first row of §2 that has no commit hash and is not marked `skip`. Do the rows in
   order; later rows depend on earlier ones. A `skip` row is never done (§2, Scope).
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
| `writer` | Opus | The proofs of one page, or one full page rewrite. Pass `model: "sonnet"` when the row or the Gate B decision (§6) says so. |
| `math-checker` | Opus | Independent check of the new mathematics on one page. Read-only. Always Opus. |
| `visual-qa` | Sonnet | Looks at pages in Chrome and measures them, so screenshots stay out of your context. |

If one of these is missing from your Agent tool, use `general-purpose` with the model above and
begin the prompt with "Read `.claude/agents/<name>.md` and follow it."

### 1.2 The prompt you send

| For | Prompt |
|-----|--------|
| Coding task | `Task T1.3 of RESTRUCTURE.md.` Add a fact from an earlier report only if the row cannot contain it. |
| Proofs of a page | `Explain the proofs on content/theory/trees/leaves.md.` The writer also adds example figures for entries that have none. |
| Figures only | `Add example figures on content/theory/basics/graphs.md.` For a page without proofs. |
| Full rewrite | `Taught rewrite of content/algorithms/mst/cut-and-cycle-properties.md.` |
| New page | `New page content/theory/planarity/faces.md, chapter planarity, lecture t06, from theory/2026-10-20 p3 and theory/2026-10-27 p1.` Take the path, chapter, lecture and pages from the row. |
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
3. Set `status: reviewed` in the page's frontmatter (you do this, not the writer). The page
   header shows it as "Checked"; `draft` shows "Not checked yet" (owner, 2026-11-12).
4. `npm run check`.
5. Commit.

Run `visual-qa` after every fifth page, on those five pages, not once per page. One writer at
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

### Scope: only what the lecture notes contain

Decided by the owner on 2026-11-12, after a read of all the notes: theory scans 2026-09-15
to 2026-11-03 and algorithms slides 01 to 04, including the slide images. Nothing that is not
in the notes is added to the site or explained. The proofs marked `skip` below appear nowhere
in the notes, also not in a later lecture (the Menger edge-version proof is not finished
after 2026-10-13 either). Lectures 1 to 5 and slides 01 to 03 are fully covered by the
existing pages; theory lectures 6 to 8 and slides 04 get new pages in Phases 6 and 7.

- A proof gets a walkthrough only if the notes give that proof: in full, as a sketch, a
  picture or a one-line argument. A result the notes only state gets no walkthrough, and
  T4.0 deletes its written proof (owner, 2026-11-12). The rows below say
  which proofs to skip; a row with nothing left is marked `skip`.
- Example figures (T4.29, T5.34) only for entries that are in the notes.
- T4.0 removes from the site what the notes never state:
  - Pages: `theory/basics/isomorphism-invariants.md`, `theory/trees/removing-a-leaf.md`,
    `theory/trees/tree-characterisations.md`, `theory/menger/cut-vertices-and-bridges.md`,
    `theory/menger/back-to-undirected-graphs.md` (a proof of undirected Menger; the notes
    give none).
  - Entries on pages that stay: `obs:edge-counts-classes`, `cor:odd-degree-count`,
    `prop:distance-metric`, `prop:spanning-tree-exists`, `thm:generalized-greedy` (slides 01
    p7 ask "Correctness?" and do not answer), `cor:mst-unique`, `lem:edmonds-one-entry`,
    `lem:flow-across-cut`, `cor:integrality`.
- Kept although marked `extra=true`, because the notes state them (without proof):
  `def:adjacent` and `def:graphic-sequence` (terms the notes use), `obs:chordal-induced`
  (used in the proof on theory/2026-10-06 p3), `prop:interval-chordal` (2026-10-06 p1 gives
  interval graphs as an example of chordal graphs), `thm:maxflow-characterisation` (items 1
  and 2 are the observation on algorithms/02 p14), `lem:dinic-phases` (02 p37),
  `prop:matching-flow` (02 p57).
- Not in the notes either, but kept: `alg:bfs`. The notes use BFS layers and the BFS tree in
  the proof of König's theorem without teaching BFS.

### Phase 1: split the lectures into concept pages

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T1.1 | Content index: scan `content/{theory,algorithms}/**`, page kinds, the new frontmatter, first and last line of every container and figure, build once per build, proof attachment; tests. | coder (opus) | R §4.2, CC §2 | S1 S2 S3 S8 S22 | 87142df |
| T1.2 | Routes and pages: rewrite for `content/:course/:chapter/:page`, sidebar by chapter, previous and next, concept page header, done button, "Continue", lecture page list and hash redirect, progress shape. | coder | R §4.2, §4.5 | S8 S9 S13 | 144c57b |
| T1.3 | Entry lock: `scripts/lock-entries.ts`, `content/entries.lock.json` made from the current content, validator check. | coder | R §4.1 | | 477a3a1 |
| T1.4 | Labels without numbers and the `source` tag. | coder | R §4.3 | S11 S14 S22 | 424a7cd |
| T1.5 | Reading layout: prose width, statement tint, long proofs closed, figure size, enlarge button. | coder | R §4.3, §4.4 | S23 S24 FL1 C4 FT1 | 31c23ec |
| T1.6 | Validator: checks for concept pages, exit codes, the extra checks, the list of long proofs without a walkthrough. | coder | R §4.1 | S7 S19 S20 | 0df8efc |
| T1.7 | `scripts/split.ts` with tests. Do not run it on `content/` yet. | coder | R §4.1 | | 9db22f9 |
| T1.8 | Run the split on all 8 lecture files. Fix what breaks. Check a theory page, an algorithms page with a player, a lecture page and Ctrl-K search at 390px and 1366×768. Delete `scripts/split.ts` and `scripts/split-map.yaml`. | coder, then visual-qa | R §4.1 | S10 | 75a49df |

**Gate A.** See §6.

### Phase 2: walkthroughs and marks in the framework

| ID | Task | Agent | Read | Backlog | Done |
|----|------|-------|------|---------|------|
| T2.1 | Parser: `mark`, `set`, reserved words, marks per step; tests. | coder | DSL §16 | C3 F9 | cb8bacc |
| T2.2 | Marks end to end: registry by figure id, spotlight in `GraphView.vue`, link component, the `[[fig:id#mark\|text]]` rule, vertex hit area. | coder | CC §6.1 | C2 FA2 F11 | c072fee |
| T2.3 | Walkthrough: containers, component, sticky layout, scroll sync, stepper driven from outside, keyboard, the "This proof uses" line. A walkthrough without a figure is a numbered list. | coder (opus) | CC §9 | C1 FA1 | 94317ce |
| T2.4 | Validator rules for walkthroughs and mark links. | coder | R §4.1 | | 3ac06fc |
| T2.5 | Acceptance: a test page with a five-step walkthrough, three mark links and a walkthrough without a figure; mouse, keyboard, touch emulation; light and dark; 390px, 1366×768, 1920×1080; reduced motion. Fix what fails; delete the page. | coder, then visual-qa | CC §9, §6.1 | | 4f877bc |

### Phase 3: two exemplar pages

Each task explains every proof on its page.

| ID | Task | Agent | Done |
|----|------|-------|------|
| T3.1 | Explain the proofs on `content/theory/trees/leaves.md` (17 and 2 lines). | writer, math-checker | d944fff |
| T3.2 | Explain the proof on `content/theory/walks-connectivity/closed-walks.md` (19 lines). | writer with `model: "sonnet"`, math-checker | d7f336b |
| T3.3 | Check the two pages at 390px and 1366×768. | visual-qa | 0f7a958 |

**Gate B.** See §6.

### Phase 4: graph theory, every proof

One row per page, in lecture order. Rows marked `skip` have no proof in the notes (Scope
above). The last row covers the pages without proofs.
Pipeline §1.4. The writer's model is the one the owner chose at Gate B. The owner may reorder
the rows at any time.

| ID | Page (under `content/`) | Proof lines | Done |
|----|-------------------------|-------------|------|
| T4.0 | Remove what Scope (above) lists: delete the five pages; delete the nine entries with their proofs, intuitions, figures and walkthroughs (including the T4.1 walkthrough of `cor:odd-degree-count`); delete every proof the notes do not give, with its walkthrough and the text that only introduces it, and put "The lecture states this without proof." in its place: the proofs of all `skip` rows of Phases 4 and 5, the proofs named "skip the …" in T4.12, T4.14, T5.26, T5.31 and T5.32, and the proofs of `thm:erdos-gallai` (T4.3) and `cor:tree-leaf` (T3.1); remove exactly the removed ids from `content/topics.yaml`, and those ids and the `#proof<n>` keys of the deleted proofs from `content/entries.lock.json` (nothing else); delete exercises and summary lines that are only about removed material; turn every other link to a removed id into plain text. Remove `extra=true` from the seven kept entries. Agent: `coder`. | 6c9ab6c |
| T4.1 | `theory/degrees/degrees-and-handshake.md` | 8; the 4 of `cor:odd-degree-count` go in T4.0 | 3364005 |
| T4.2 | `theory/degrees/havel-hakimi.md` | 54 | 528662b |
| T4.3 | `theory/degrees/erdos-gallai.md` | 95, not in the notes (2026-09-15 p7 states the theorem only); see §6 | 7a65cd5 |
| T4.4 | `theory/walks-connectivity/walks-and-paths.md` | 6, not in the notes (2026-09-22 p4: claim with an empty □) | skip |
| T4.5 | `theory/bipartite/bipartite-graphs.md` | 7, not in the notes (2026-09-22 p4: claim only) | skip |
| T4.6 | `theory/bipartite/odd-cycles.md` | 27 | c61b389 |
| T4.7 | `theory/trees/small-degree-test.md` | 6 | f2cf457 |
| T4.8 | `theory/trees/unique-paths.md` | 8 | f9ee9a0 |
| T4.9 | `theory/trees/cayley-formula.md` | 37 | 5aa25ae |
| T4.10 | `theory/degrees/regular-graphs-of-large-girth.md` | 37 | 30c1144 |
| T4.11 | `theory/chordal/minimal-cuts.md` | 22 | 3e05d7d |
| T4.12 | `theory/chordal/two-simplicial-vertices.md` | 19; skip the 2 of `thm:chordal-simplicial` (stated only, 2026-10-06 p1) | 2836003 |
| T4.13 | `theory/chordal/simplicial-decompositions.md` | 10 | f74097a |
| T4.14 | `theory/hamiltonian/hamiltonian-completion.md` | 23; skip the 5 of `thm:dirac-ore` (stated only, 2026-10-06 p5) | 25cbe6d |
| T4.15 | `theory/menger/vertex-version-from-edge-version.md` | 17 | 0a5749a |
| T4.16 | `theory/menger/proving-the-edge-version.md` | 8, 28, not in the notes (2026-10-13 p6 states the claim and stops at "?") | skip |
| T4.17 | `theory/menger/back-to-undirected-graphs.md` | 16, not in the notes; page removed in T4.0 | skip |
| T4.18 | `theory/menger/set-version.md` | 12 | 6677cae |
| T4.19 | `theory/menger/two-connected-graphs.md` | 12 | 98812d0 |
| T4.20 | `theory/menger/ear-decompositions.md` | 14 | 661b3c0 |
| T4.21 | `theory/basics/graph-families.md` | 6, not in the notes; entry removed in T4.0 | skip |
| T4.22 | `theory/basics/isomorphism-invariants.md` | 8, not in the notes; page removed in T4.0 | skip |
| T4.23 | `theory/walks-connectivity/distance.md` | 5, not in the notes; entry removed in T4.0 | skip |
| T4.24 | `theory/trees/removing-a-leaf.md` | 6, not in the notes; page removed in T4.0 | skip |
| T4.25 | `theory/trees/tree-characterisations.md` | 21, 1, not in the notes; page removed in T4.0 | skip |
| T4.26 | `theory/trees/spanning-trees.md` | 4, not in the notes; entry removed in T4.0 | skip |
| T4.27 | `theory/chordal/chordal-graphs.md` | 2, not in the notes | skip |
| T4.28 | `theory/chordal/interval-graphs.md` | 6, not in the notes | skip |
| T4.29 | Every theory page that `npm run validate` still lists with fewer figures than entries: `Add example figures on <page>.`, one page per run, writer then math-checker. Only for entries in the notes (Scope). Write each page and its commit here. Done: `basics/graph-families` 7b24171, `basics/graphs` 306d5d9, `basics/subgraphs` 1b0c3c1, `bipartite/bipartite-graphs` 7741daf, `chordal/chordal-graphs` cfe4986, `chordal/simplicial-vertices` 5958c50, `degrees/degree-sequences` 27e341f, `hamiltonian/dirac-and-ore` db1ba44, `hamiltonian/hamiltonian-graphs` 7dad7c6, `menger/k-connectivity` d81e96d, `menger/mengers-theorem` fd0d973, `menger/paths-and-cuts` 2b9cc5d, `walks-connectivity/connected-components` 151d57e, `walks-connectivity/distance` 40e3556. | | 40e3556 |
| T4.30 | Audit tag: a frontmatter field `audited: <date>` on concept pages, shown in the page header next to the Checked tag as "Matches the lecture notes" (validator accepts the field; test). Agent: `coder`. Added by the owner, 2026-11-13. | | 548b857 |
| T4.31 | Audit lectures 1 to 5 against the notes, one run per lecture (t01 to t05), read-only: `general-purpose` with `model: "opus"`. Prompt: "Read-only audit of lecture <slug>. For every concept page of that lecture, compare each definition, statement and written proof with the scan page named in its `source`, under `resources/graph-theory/`. Report only mismatches, one line each: page path, line, what the site says, what the notes say. Then list the pages with no mismatch." The math-checker compares only against the page itself (§6); this audit is the check against the notes. Write the result of each lecture here. t01: 4 mismatches; t02: 1 mismatch, 5 additions; t03: 0 mismatches; t04: 1 mismatch; t05: 1 mismatch, 5 marked REVIEW (§6, Audit). | | 5e4e314 |
| T4.32 | Resolve the audit: the owner decides each mismatch. A transcription slip the owner confirms is fixed minimally with `<!-- REVIEW: audit, what and why -->` and `scripts/lock-entries.ts --accept <key>` for that entry only. Then set `audited:` on every page that has no open mismatch. Agent: `coder`. | | |
| T4.33 | `BACKLOG.md` D1 (budget checks for taught pages), needed before the rewrites below. Agent: `coder`. Added by the owner, 2026-11-13. | | a9b449b |
| T4.34 | Taught rewrite of `theory/basics/multigraphs-and-digraphs.md`. Rows T4.34 to T4.44: the theory pages that no writer touched (no proof in the notes, enough figures), owner 2026-11-13. Prompt §1.2 "Full rewrite", pipeline §1.4, writer Opus. | | b1c08ce |
| T4.35 | Taught rewrite of `theory/basics/isomorphism.md` | | 961bd17 |
| T4.36 | Taught rewrite of `theory/basics/cliques-and-independent-sets.md` | | b9689e6 |
| T4.37 | Taught rewrite of `theory/walks-connectivity/walks-and-paths.md` | | 4f06c34 |
| T4.46 | Walkthrough sticky figure at 390px: the figure box (`.ga-figure-anchor`, 341px) is shorter than figure plus caption, so the caption overflows by 12–81px and the scrolling step text runs over it (visual-qa 2026-11-13: `gomory-hu/correctness` 5 of 9 walkthroughs, `stoer-wagner-correctness`, `karger-success-probability`). Fix in the framework, not by shortening captions. Re-check those three pages at 390 with visual-qa. Agent: `coder`. | | |
| T4.38 | Taught rewrite of `theory/walks-connectivity/breadth-first-search.md` | | |
| T4.39 | Taught rewrite of `theory/degrees/havel-hakimi-test.md` | | |
| T4.40 | Taught rewrite of `theory/degrees/girth-and-regular-graphs.md` | | |
| T4.41 | Taught rewrite of `theory/trees/forests-and-trees.md` | | |
| T4.42 | Taught rewrite of `theory/trees/spanning-trees.md` | | |
| T4.43 | Taught rewrite of `theory/chordal/interval-graphs.md` | | |
| T4.44 | Taught rewrite of `theory/menger/proving-the-edge-version.md` | | |
| T4.45 | Audit the pages of T4.34 to T4.44 against the notes, read-only, as T4.31 (same agent and prompt, but for these pages only). Write the mismatches in §6 for the owner. Owner, 2026-11-13: audit at the end. | | |

**Gate C.** See §6.

### Phase 5: graph algorithms, every proof

After Gate C. Same pipeline.

| ID | Page (under `content/`) | Proof lines | Done |
|----|-------------------------|-------------|------|
| T5.1 | `algorithms/mst/cut-and-cycle-properties.md` | 3, 3, not in the notes (01 p5 states both properties only) | skip |
| T5.2 | `algorithms/mst/distinct-weights.md` | 7, 3, not in the notes (01 p5 states only); `cor:mst-unique` removed in T4.0 | skip |
| T5.3 | `algorithms/mst/generalized-greedy.md` | 15, not in the notes; entry removed in T4.0 | skip |
| T5.4 | `algorithms/mst/union-find.md` | 3 | f94a22a |
| T5.5 | `algorithms/mst/boruvka.md` | 4 | 0d8e01d |
| T5.6 | `algorithms/mst/contractions.md` | 8, not in the notes (01 p20 states the lemma only) | skip |
| T5.7 | `algorithms/mst/f-heavy-edges.md` | 2, not in the notes (01 p37 states the lemma only) | skip |
| T5.8 | `algorithms/mst/verification.md` | 3 | 4672c9f |
| T5.9 | `algorithms/mst/sampling-lemma.md` | 21 | a204aca |
| T5.10 | `algorithms/mst/karger-klein-tarjan.md` | 8 | 101181b |
| T5.11 | `algorithms/arborescences/reduced-weights.md` | 2, 3, not in the notes (01 p51–52 state only) | skip |
| T5.12 | `algorithms/arborescences/edmonds-algorithm.md` | 11, not in the notes; entry removed in T4.0 | skip |
| T5.13 | `algorithms/flows/cuts-in-networks.md` | 4, not in the notes; entry removed in T4.0 | skip |
| T5.14 | `algorithms/flows/augmenting-paths.md` | 9, not in the notes (02 p12 states the lemma only) | skip |
| T5.15 | `algorithms/flows/characterising-maximum-flows.md` | 7, 3, not in the notes (02 p6 and p14 state only) | skip |
| T5.16 | `algorithms/flows/ford-fulkerson-analysis.md` | 4 | 2a8a3ae |
| T5.17 | `algorithms/fast-flows/edmonds-karp-analysis.md` | 9, 8, 2 | d7309fc |
| T5.18 | `algorithms/fast-flows/dinic.md` | 4, not in the notes (02 p37 states only) | skip |
| T5.19 | `algorithms/fast-flows/blocking-flows.md` | 6, 1 | e6d68f7 |
| T5.20 | `algorithms/fast-flows/mpm.md` | 4, 1 | dbb44a1 |
| T5.21 | `algorithms/flows/matchings-as-flows.md` | 4, not in the notes (02 p57 is a picture of the network only) | skip |
| T5.22 | `algorithms/fast-flows/unit-capacity-networks.md` | 4, 8 | 5e436f9 |
| T5.23 | `algorithms/gomory-hu/node-identification.md` | 6, not in the notes (03 p32 states the observation only) | skip |
| T5.24 | `algorithms/gomory-hu/gomory-hu-trees.md` | 3, 4, not in the notes (03 p4 and p6 state only) | skip |
| T5.25 | `algorithms/gomory-hu/uncrossing-cuts.md` | 9 (03 p17: "proof by picture") | 7f98e2e |
| T5.26 | `algorithms/gomory-hu/gomory-hu-lemma.md` | 16; skip the 4 of `cor:gomory-hu-contraction` (stated only, 03 p14) | abd9525 |
| T5.27 | `algorithms/gomory-hu/triangle-inequality.md` | 3, not in the notes (03 p19 states Lemmas A and B only) | skip |
| T5.28 | `algorithms/gomory-hu/correctness.md` | 33, 14 | 156ce7a |
| T5.29 | `algorithms/global-min-cut/global-minimum-cuts.md` | 3 | aab45b0 |
| T5.30 | `algorithms/global-min-cut/stoer-wagner.md` | 3, not in the notes (03 p32 states the corollary only) | skip |
| T5.31 | `algorithms/global-min-cut/stoer-wagner-correctness.md` | 5, 5; skip the 4 of `cor:stoer-wagner` (not argued in the notes) | 4fca56a |
| T5.32 | `algorithms/global-min-cut/karger-success-probability.md` | 11, 2, 2; skip the 2 of `cor:number-min-cuts` (stated only, 03 p49) | ada79d0 |
| T5.33 | `algorithms/global-min-cut/karger-stein.md` | 4, 3, 10, 3, 7 | |
| T5.34 | Every algorithms page that `npm run validate` still lists with fewer figures than entries: `Add example figures on <page>.`, one page per run, writer then math-checker. Only for entries in the notes (Scope). Write each page and its commit here. Done: `basics/graph-families` 7b24171. | | |
| T5.35 | Audit slides 01 to 03 against the algorithms concept pages, read-only, as T4.31: one run per slide deck (a01 to a03), `general-purpose` with `model: "opus"`, comparing with the PDFs under `resources/`. Write the mismatches in §6 for the owner. Owner, 2026-11-13: audit at the end. | | |

**Gate D.** See §6.

### Phase 6: theory lectures 6 to 8 (planarity, colouring)

New content, written from the notes (Scope). The owner may move this phase before Phase 5.
Writer rows use the "New page" prompt (§1.2) and the pipeline of §1.4; a page whose notes
contain no proof skips the math-checker unless it has a quiz or numbers. Notes: 2026-10-20
(t06), 2026-10-27 (t07), 2026-11-03 (t08), all under `resources/graph-theory/`.

| ID | Task | Agent | Notes | Done |
|----|------|-------|-------|------|
| T6.1 | Planarity in the framework: `BACKLOG.md` FS1, FS2, FS12, FL7, FL8, C12. | coder (opus) | | |
| T6.2 | Colouring in the framework: `BACKLOG.md` C13 and `is-proper-coloring` (FS11). | coder | | |
| T6.3 | Lecture files `content/theory/06-planarity.md`, `07-planarity-combinatorial.md`, `08-colouring.md` (lectures 6 to 8, slugs t06 to t08, their `sources`), chapters `planarity` and `colouring` in `content/topics.yaml`, sidebar. Frontmatter and empty sections only; no lesson text. | coder | | |
| T6.4 | `theory/planarity/planar-drawings.md`: planar drawing, planar graph. | writer | 2026-10-20 p1 | |
| T6.5 | `theory/planarity/polygonal-drawings.md`: drawings with polygonal lines, lemma and proof sketch. | writer | 2026-10-20 p2 | |
| T6.6 | `theory/planarity/faces.md`: faces, outer face, facial walks, equivalent drawings; a drawing as G plus its facial walks; planar and plane graphs. | writer | 2026-10-20 p3; 2026-10-27 p1 | |
| T6.7 | `theory/planarity/geometric-dual.md`: the geometric dual; the exercise (G*)* = G. | writer | 2026-10-27 p1–2 | |
| T6.8 | `theory/planarity/euler-formula.md`: Euler's formula and its proof (the step "E(G) \ E(T) gives a spanning tree of G*" is stated only). | writer | 2026-10-27 p2 | |
| T6.9 | `theory/planarity/k5-not-planar.md`: K5 is not planar, with proof; the exercise on 3n − 6 and 2n − 4. | writer | 2026-10-27 p3 | |
| T6.10 | `theory/planarity/small-degree.md`: planar graphs have a vertex of degree ≤ 5, bipartite planar ≤ 3, with proof. | writer | 2026-10-27 p4 | |
| T6.11 | `theory/planarity/kuratowski.md`: subdivisions, Kuratowski's theorem and its proof sketch (THM2 on contractible edges is stated only, "see Diestel"). | writer | 2026-10-27 p5–6 | |
| T6.12 | `theory/colouring/colourings.md`: k-colouring, proper colouring, chromatic number, the two facts. | writer | 2026-11-03 p1 | |
| T6.13 | `theory/colouring/two-colourable.md`: χ(G) ≤ 2 iff no odd cycle, with proof. | writer | 2026-11-03 p2 | |
| T6.14 | `theory/colouring/three-colouring-and-sat.md`: "3-COL solves SAT", construction and both directions. | writer | 2026-11-03 p2–4 | |
| T6.15 | `theory/colouring/chromatic-bounds.md`: cliques give a lower bound, small degrees an upper bound (proof of b), χ(K_{m,n}) = 2. | writer | 2026-11-03 p5 | |
| T6.16 | `theory/colouring/mycielski.md`: Mycielski graphs, theorem and proof. | writer | 2026-11-03 p6 | |
| T6.17 | Lecture pages t06 to t08: intro, summary, and the exercises the notes give. Only text from the notes. | writer | all three | |
| T6.18 | Check the pages of T6.4 to T6.17 at 390px and 1366×768. | visual-qa | | |

### Phase 7: algorithms lecture 4 (matchings in general graphs)

Same rules as Phase 6. Notes: `resources/graph-algorithms/04-matchings.pdf` (a04). Slides
52 to 54 ("Bonus: stable matching") are title slides with no content: nothing to add.
`def:matching` already exists on `algorithms/flows/matchings-as-flows.md` (02 p56), and slide
04 p9 (matchings by flows) is that page: link them, do not repeat them.

| ID | Task | Agent | Notes | Done |
|----|------|-------|-------|------|
| T7.1 | Matchings in the framework: `BACKLOG.md` C14, `is-perfect-matching` and `is-augmenting-path` (FS11). | coder (opus) | | |
| T7.2 | Lecture file `content/algorithms/04-matchings.md` (lecture 4, slug a04, its `sources`), chapter `matchings` in `content/topics.yaml`, sidebar. Frontmatter and empty sections only. | coder | | |
| T7.3 | `algorithms/matchings/matchings.md`: maximum and perfect matchings, covered and exposed vertices, ν(G); the dancing problem and the applications. | writer | 04 p2–7 | |
| T7.4 | `algorithms/matchings/berge.md`: M-alternating and M-augmenting paths, Berge's theorem with proof, the basic algorithm. | writer | 04 p10–13 | |
| T7.5 | `algorithms/matchings/alternating-trees.md`: alternating trees, A(T) and B(T), EXTEND, AUGMENT. | writer | 04 p14–16 | |
| T7.6 | `algorithms/matchings/perfect-bipartite.md`: PERFECTBIPARTITE, frustrated trees, Lemma X with proof, running time O(nm) with its argument ("no perfect matching if frustrated" is asked, not proved). | writer | 04 p18–20 | |
| T7.7 | `algorithms/matchings/odd-cycles.md`: why odd cycles break the tree, G/C, Lemma A and its corollary (stated only), tight cycles. | writer | 04 p22–25 | |
| T7.8 | `algorithms/matchings/blossoms.md`: blossoms and stems, CONTRACT, Lemma B (stated only). | writer | 04 p26–29 | |
| T7.9 | `algorithms/matchings/edmonds-blossom.md`: PERFECTBLOSSOM, derived graphs and pseudovertices, Lemma C (stated only), the correctness argument, the step count. | writer | 04 p30–33 | |
| T7.10 | `algorithms/matchings/maximum-matchings.md`: the Tutte–Berge formula (stated, p13), from perfect to maximum matchings and its correctness argument. | writer | 04 p13, p35 | |
| T7.11 | `algorithms/matchings/implementing-blossom.md`: union-find representation, O(nm log n) with its argument. | writer | 04 p36–37 | |
| T7.12 | `algorithms/matchings/assignment-problem.md`: the two motivating examples, the assignment problem, maximum-weight matching. | writer | 04 p39–42 | |
| T7.13 | `algorithms/matchings/kuhn-munkres.md`: feasible labellings, equality subgraphs, the Kuhn–Munkres theorem with proof. | writer | 04 p43–44 | |
| T7.14 | `algorithms/matchings/hungarian.md`: core idea, initial labelling, improving a labelling, Lemma Y (stated only), HUNGARIAN, correctness remark, O(n³) with its argument. | writer | 04 p45–51 | |
| T7.15 | Lecture page a04: intro and summary from the notes (the slides have no exercises). | writer | | |
| T7.16 | Check the pages of T7.3 to T7.15 at 390px and 1366×768. | visual-qa | | |

### Later, only when the owner asks

- A taught rewrite of a page the owner names (the full template, `CONTENT_CONVENTIONS.md` §8).
  Do `BACKLOG.md` D1 first if there are more than a few.
- The deferred parts in `BACKLOG.md` §14; D4 (proof tasks in exam format) is the most useful.
- Lectures given after 2026-11-12: add a phase like Phase 6 from the new notes.

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
| Proofs | Every proof gets a step-by-step explanation that fills in what the written proof skips. Each has a figure that changes with the steps (required over 10 source lines; left out for a short proof only when there is nothing to draw). The written proof stays below it, closed. |
| Figures | Every walkthrough has a figure and every definition and statement has an example figure. The lecturer's examples are used first; new ones are added wherever the lecture has none. |
| Order | Graph theory first: the owner has an exam on lectures 1 to 5 around 2026-11-24. Algorithms after it. The framework work of Phases 1 and 2 covers both courses. |
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
  every proof without a walkthrough, longest first, and every concept page that has fewer
  figures than reference entries.
- **Validator for walkthroughs and marks** (T2.4). Errors: a walkthrough for a proof longer
  than 10 source lines has no figure; a figure in a walkthrough is not its first child or not
  `widget=stepper`; with a figure, the number of `::: step` blocks differs from the number of
  `step:` lines; a step has more than 60 words; `for=` does not name a statement on the same
  page; a mark link without link text, to a figure on another page, or to a mark that is not
  declared. Warning: a walkthrough without a figure.

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
- Until Gate B the model for a walkthrough is the block in `CONTENT_CONVENTIONS.md` §15. After
  Gate B it is the approved page.

---

## 6. Gates, feedback and questions

**Gate A** (after T1.8). Do not stop. Tell the owner that the split site is ready to look at
(start the dev server outside the sandbox and give the URL) and go on with Phase 2. The site
now has about 100 short pages with the old text. Page titles and URLs can still change until
the branch is merged; after that they are permanent.

**Gate B** (after T3.3). Stop. Give the owner the two URLs. The owner decides, and you write
down here:

1. who writes the remaining pages: Opus, Sonnet, or Opus only for pages with a proof over 20
   lines;
2. changes to the writer's rules (then edit `.claude/agents/writer.md`).

**Gate C** (after the last row of Phase 4). Stop. Graph theory is done. The owner decides
whether to merge `restructure` into `main` now, so their friends can use it before the exam.

**Gate D** (after the last row of Phase 5). Stop. The owner decides what to do from "Later".

### Decisions and feedback

- T1.8 done (75a49df). Left open, not fixed:
  - At 911px wide every page scrolls horizontally (nav "more" menu). Also on `main`, so it predates the restructure.
  - Ctrl-K "leaf" ranks `/theory/trees/leaves` 4th. Acceptable unless the owner objects.
  - At 390px the active sidebar item on `/algorithms/mst/kruskal` is visible but not centred (scrollTop 0). Minor.
  - The Chrome window cannot be resized; visual-qa measures 390/1366 in iframes.
- T2.5 done (4f877bc), test page deleted. Not covered by visual-qa: real touch input (only synthetic events), reduced motion via CSS (only matchMedia override), Escape on the Enlarge dialog, Previous/First after the last scroll fix (the coder checked them in Chrome). Safari without `scrollend`: steps do not follow scrolling for 3s after Next/Previous. Re-check on the first real walkthrough page (T3.1).
- Carry-over notes from coders (2026-11-11):
  - T2.2 done. Open for T2.3: `[[fig:x#m|t]]` inside a figure's own caption or step text is not rendered as a link (only page markdown). Not browser-tested; no content figure uses a mark yet (T2.5 covers it).
  - T2.2 (done): `mark` errors at parse time on an unknown element, so marks only name elements that exist in that step. Skip marks whose element is absent from a step. `set class=` adds the class (DSL §16.2 says replace; decide on purpose or align). `GraphData.marks: Record<string,string[]>`; a ref is a vertex id, `@edgeId`, `face:id` or a group id.
  - T1.7/T1.8: `scripts/lock-entries.ts` with no argument overwrites the whole lock and would erase the verbatim proof after the split. Use `--accept <key>` only.
  - T2.3 done: proofs match their walkthrough by `for=` (not "next proof"). Sticky top offsets (48px local nav) are estimates; T2.5 must check them in a browser.
  - T2.4: the validator finds walkthroughs by regex on page source (`walkthrough ... for=`); switch to the container type once T2.3 registers it.
  - T1.2: `index.lessons` holds concept pages with `lecture: 0`; lecture-only consumers filter them out (`lectureLessons`).

- T3.3 visual-qa (2026-11-11), pages `/theory/trees/leaves` and `/theory/walks-connectivity/closed-walks`:
  - FIXED (re-measured at 1366: 32.3px/17.4px and 28.6px/15.4px). Was: `closed-walks` figures `fig-t03-closed-walk-base` (18px vertex circles, 9.8px labels) and `fig-t03-closed-walk-no-repeat` (24.5px, 13.2px) render tiny at 1366×768 (934×226 box; minimum 26px and 14px). The writer must change their layout or size.
  - Walkthrough step trigger sits about 70% down the viewport; at 390px a tall active step can extend 30px past the bottom. Not fixed.
  - `closed-walks` has no "This proof uses" line (no `uses` attribute in the source). Fine unless the owner wants one.
  - At 390px `fig-t03-closed-walk-base` renders at ~0.48 scale (12.5px circles, 6.7px labels): a wide one-row figure shrinks on phones. Informational; the thresholds apply at 1366. Consider a two-row layout for wide figures.
  - Not run: reduced motion; real touch; Safari. Chrome window cannot be resized, so measured in iframes. Console only read for the top-level tab.
  - Passed: no console errors, no horizontal scroll, at most 74 characters per line, figures follow steps, mark hover/focus, arrow keys / Next / Previous / First / Last after scrolling, Enlarge closes with Escape, sticky offset 64px (1366) and 48px (390).

- **Gate B decided (2026-11-11, owner).** Pages look good. Writer model: Opus for pages with a proof over 20 lines, Sonnet for shorter ones. `math-checker` is always Opus. If a Sonnet writer fails the checker twice, rerun with Opus (as on T3.2). No change to `.claude/agents/writer.md`. The multigraph cycle convention (see open questions): the owner left it open; no definition box is added, the page states the rule itself. Rule added 2026-11-12 (owner): walkthrough figure size, in `.claude/agents/writer.md`.
- **Scope decided (2026-11-12, owner).** Only what the notes contain (§2, Scope). One-step consequences the notes state without writing the step (Dirac–Ore from the completion lemma, a simplicial vertex from LEM2, shortest walks are paths) count as not proved: they stay `skip`. The finished walkthroughs of Erdős–Gallai (T4.3) and "trees have leaves" (T3.1) go, in T4.0. Written proofs the notes do not give are deleted too, in T4.0, so the site shows those statements without proof, as the notes do.

- Visual-qa on T4.6–T4.10 (2026-11-12): passed after fixes 7b71be6 (odd-cycles) and the T4.10 layout fix. Lesson for writers: a walkthrough figure gets a box of about 314×195 px at 1366; near-square layouts and group hulls (their label padding) shrink it below 26px vertices / 14px labels. Use wide, flat layouts and colour classes instead of hulls. Minor, not fixed: consecutive walkthrough steps with identical figures (unique-paths, girth).

- Visual-qa on T4.18–T4.20, graph-families, graphs (2026-11-13): passed except two minor points. (1) `ear-decompositions` `fig-t05-ear-max-edge` step 5: muted vertices are translucent, so edge 1–8 shows through labels 1 and 8. A renderer issue for every muted vertex: fix in the framework (opaque backing under muted vertices). (2) `set-version` at 390: `fig-t05-total-menger` labels scale to 8.7px (the size rule is for 1366 only). Header unchanged by T4.30. Chrome cannot go below ~495px; 390 measured in an iframe.

- T4.29 `degrees/degree-sequences` (2026-11-13): the checker failed it twice (labels template without a `d` attribute, then `[d=2, class=rejected]` with a comma). The second failure was a one-character syntax slip, so the main agent allowed a third round instead of stopping the task; it passed. Lesson for writers: DSL attribute lists are space-separated; a comma becomes part of the value. Muted-vertex fix: 1ce4c80 (CSS only, not yet seen in a browser).

- T4.29 `menger/mengers-theorem` (2026-11-13), for the owner: the REVIEW comment at line 14 inside the locked `thm:menger` entry points to "the remark after the proof" for multigraphs, but the page has no such remark and no proof of a). Editorial only. Fixing it needs `scripts/lock-entries.ts --accept thm:menger`; left as is.

- Visual-qa on the T4.29 pages (2026-11-13): fixed after review: dots instead of circles from long `{id}: {d}` labels (degree-sequences, dirac-and-ore), a vertex on an edge (degree-sequences, mengers-theorem), a caption naming Left/Middle/Right on a wrapping figure (paths-and-cuts), and captions naming colours that render differently (hamiltonian-graphs, dirac-and-ore, distance, graphs, vertex-version-from-edge-version, hamiltonian-completion). Proposed writer rule for the owner: captions describe a marking (thick, dashed, filled, ringed), never a colour name, and vertex labels stay short. Added to `.claude/agents/writer.md` (owner, 2026-11-13).

- **Gate C (2026-11-13, owner).** T4.32 (the audit mismatches) is put off; the owner decides it later. No merge into `main` was asked for, so none is done. Go on with Phase 5 until Gate D. The `thm:menger` REVIEW comment (an HTML comment readers do not see) stays as it is.
- T4.33 (coder): rules E1–E11 run only on `stage: taught` pages. E11 reads frontmatter `needs`: a taught page lists every concept page it links to. Not done: `symbols` resolving (needs D2). The "term not linked" lint is skipped on concept pages (§10). 30 split-page steps exceed 2 heavy spans; that only matters once a page is taught.
- Visual-qa on T5.28, T5.29, T5.31, T5.32, T4.34 (2026-11-13): passed at 1366 on every page; at 390, the caption overflow of T4.46 on three pages. `karger-success-probability` walkthroughs 4 and 5 have no figure (proofs of 2 lines, allowed by E7). 390 measured in an iframe (the window minimum is 412px).
- **Old theory pages (2026-11-13, owner).** 11 theory pages kept their old text and "Not checked yet": no proof in the notes, enough figures, so no task touched them. The owner chose a taught rewrite of all 11 (T4.33 to T4.44), done after T5.32 and before T5.33. Same question for the ~36 algorithms pages: left until Gate D.

- T5.10 `mst/karger-klein-tarjan` (2026-11-13): the written proof applies `thm:mst-verification` to the forest F′ (the theorem states spanning trees). Not edited (locked); the walkthrough supplies the dummy-edge argument and a REVIEW comment sits before the proof. The Sonnet writer failed the checker twice (the second error came from the main agent's incomplete base-case instruction); an Opus writer took over the remaining fixes, and the page passed on the fourth check. Exception to §1.4's stop rule, as for degree-sequences.
- T5.4 `mst/union-find`: the lecture slide 10 gives Galler–Fischer as 1954 (it is 1964) and slide 11 gives O(n log n) for the loop (O(m log n) is right). Both marked REVIEW on the page.

- Visual-qa on T5.4–T5.10 (2026-11-13): fixes sent for the cramped `fig-a01-kkt-recurrence` and the "blue trees" wording on `boruvka`. Not fixed, framework: the pseudocode panel of the algorithm player (`fig-a01-boruvka-player` at 1366) is clipped on the right and scrolls. Probably on every player page; a coder task if the owner wants it.

- Visual-qa on T5.16–T5.26 (2026-11-13): passed after layout fixes (ddb8050, a2067c4, 5295677, a942c65). Left open, minor: `fig-a01-kkt-recurrence` steps 1–2 (the 12-vertex graph) render edge labels at 13.7px at 1366, below the 14px rule; two layout rounds did not fix it, the labels are legible. Writers built their own clearance scripts on the real parser and `routeEdges` (label–label, label–edge, edge–vertex); a shared check in `viewbox.ts` would save visual-qa rounds (coder task if the owner wants it).

### Needs reported by writers

- T4.10: group hulls dropped from the toy figures for size; the three copies of G are told apart by colour and caption.

- T4.10 (`degrees/regular-graphs-of-large-girth.md`): no way to show several graphs side by side in one figure (G, H and F of the construction), so H gets its own step. The steps use a toy instance (k = 5, d = 2) because a real one is too large to draw.

- T4.12 (`chordal/two-simplicial-vertices.md`): no two-graph view of G[A ∪ X] and G − A; muting the other part stands in.

- T4.35 (`basics/isomorphism.md`): a stepper draws only panel 0, so G and H share one graph in both new steppers.

### Open questions from Phase 4 writers

- T4.6 (`bipartite/odd-cycles.md`): WLOG the edge is in A, while the figure has it in B (L3). Decided (main agent, owner delegated, 2026-11-12): keep as is; WLOG covers both sides and the proof text must not change.
- T4.6: the walkthrough reduces to one component, a step the notes do not write out.
- T4.15 (`menger/vertex-version-from-edge-version.md`): the proof is attached to `thm:menger-directed`, which lives on `menger/mengers-theorem.md`, so its three walkthroughs have no `for=` and the validator keeps warning "proof of thm:menger-directed has no walkthrough". Open: allow a cross-page `for=` (coder task), or accept the warning.
- T4.7 (`trees/small-degree-test.md`) and T4.10: the math-checker found false sentences in the old intuition, pitfall and intro text; fixed minimally with `<!-- REVIEW -->` comments.

### Open questions for the owner


- `theory/walks-connectivity/closed-walks.md` (T3.2): the theorem statement links "cycle" to
  `def:cycle-graph` (n ≥ 3, simple graphs), but its base cases count loops and parallel edges
  as cycles. No container defines that multigraph convention; it is only a plain paragraph at
  `theory/trees/forests-and-trees.md:23`. Should that paragraph become a definition box (and
  the statement link to it)?

- Status tag (2026-11-12, owner request, d342ec5): every page header shows "Checked" (`status: reviewed`, set by the main agent after the math-checker passes, §1.4) or "Not checked yet" (`draft`). The `skip` pages never get a math check, so they stay "Not checked yet" unless T4.29 covers them. Add a check-only pass for them?
- Visual-qa on T4.11–T4.15 and the status tag (2026-11-13): passed. 1366 measured in an iframe; tags at least 5:1 contrast in light and dark, at 1366 and 390. Not repeated at 390: the sticky-figure check on all five pages (done on hamiltonian-completion only).

### Audit mismatches (T4.31), for the owner

Each line: site text against the notes. The owner decides each one (T4.32): fix to the notes,
or keep and say so on the page. None changes a result.

- t01 (scans 2026-09-15 p1–7, 2026-09-22 p1–2; 9 pages):
  1. `basics/multigraphs-and-digraphs.md:18`: site "$V$ and $E$ are disjoint sets"; the notes give $G=(V,E,\varepsilon)$ with $\varepsilon: E\to V\cup(V\times V)\cup\binom V2$ and no disjointness.
  2. `basics/multigraphs-and-digraphs.md:44`: the special-cases remark has a third case (non-injective into $\binom V2\cup V$: undirected multigraph); the notes list only a) graph and b) digraph.
  3. `basics/graph-families.md:27`: site defines $C_n$ "for $n\ge3$"; the notes give no bound (the bound is needed for simple graphs).
  4. `degrees/havel-hakimi.md:16`: site adds the hypothesis $d_1\le n-1$, not in the notes (09-15 p7, 09-22 p1); the page's remark at line 36 already says so.
  - No mismatch: `basics/graphs.md`, `basics/isomorphism.md`, `degrees/degrees-and-handshake.md`, `degrees/degree-sequences.md`, `degrees/erdos-gallai.md`; the Havel–Hakimi proof matches.
  - Not comparable (no `source`, nothing on the scans): `def:adjacent`, `def:graphic-sequence`, `alg:havel-hakimi` (notes have worked examples only, p6), the in/out-degree remark (`degrees-and-handshake.md:136`), the equivalence-relation remark (`isomorphism.md:46`).
- t02 (scan 2026-09-22 p3–5; 8 pages):
  1. `bipartite/odd-cycles.md:257–262` (proof of ⇐): the site first reduces to a non-bipartite component K, then runs BFS from x ∈ K; the notes run BFS from any x ∈ V(G), complete only for connected G. The site's step fills that gap but has no REVIEW mark (see also the T4.6 question above).
  - Additions beyond the notes, same meaning: `walks-and-paths.md:11–18` (walks in multigraphs, "length k", "closed"; the notes: simple graphs only); `connected-components.md:20–21` ("connected = exactly one component"); `distance.md:14` (dist = ∞ across components); `bipartite-graphs.md:12` (A ∩ B = ∅, equivalent); `bipartite-graphs.md:39` ("proposition", the notes: CLAIM).
  - No mismatch: `basics/subgraphs.md`, `basics/cliques-and-independent-sets.md`, the shortest-walk claim, the bipartite ⇔ K_{m,n} claim, the statement and ⇒ proof of `odd-cycles.md`.
  - Not comparable: `walks-connectivity/breadth-first-search.md` (no `source`, BFS not in the scan; kept by Scope).
- t03 (scan 2026-09-29 p1–8; 9 pages): no mismatch; every `source` page is right. Additions beyond the notes, same meaning:
  `girth-and-regular-graphs.md:12` (girth ∞ if acyclic; d-regular as its own definition);
  `regular-graphs-of-large-girth.md:15` (d ≥ 0, k ≥ 1), `:360–362` (extra base cases d = 0, 1, k ≤ 3, k = 4), `:367` (⌈k/2⌉ for the notes' k/2), `:374–391` (the argument that F is simple, d-regular, girth ≥ k; the notes give the construction picture only);
  `cayley-formula.md:298–321` (invariant, injectivity of the triples, converse);
  `closed-walks.md:15` ("possibly both", has a REVIEW), `:229–233` (base cases for k ≤ 2 written out);
  `leaves.md:127`, `:137`, `:173` (small added reasons), `:153` (`def:leaf` has no source: the notes never define a leaf);
  `small-degree-test.md:12` ("non-empty"), `:116`, `:119` (one-vertex case, loop and digon degrees);
  `unique-paths.md:114`, `:117–121` (direct argument instead of contradiction, E(P1) = E(P2) ⇒ P1 = P2).
- t04 (scan 2026-10-06 p1–6; 9 pages):
  1. `hamiltonian/dirac-and-ore.md:27`: the site assumes $n = |V(G)| \ge 3$; the notes (p5) state the theorem with no condition. The condition is needed ($K_2$ satisfies Dirac and is not Hamiltonian) but has no REVIEW mark.
  - Additions, same meaning: `chordal-graphs.md:13` ("length at least 4", has REVIEW); `simplicial-vertices.md:31` ("with at least one vertex"); `interval-graphs.md:12` (a definition; the notes only name interval graphs and draw a sketch); `minimal-cuts.md:15` (meaning of "minimal"), `:198` (proof takes shortest x–y paths through C_u and C_v; the notes take a minimal x–y walk in P_ux ∪ P_uy: same idea, the site's makes the chordless step correct); `two-simplicial-vertices.md:168` and `simplicial-decompositions.md:139` (induction details); `dirac-and-ore.md:16` (δ(G), has REVIEW); `hamiltonian-completion.md:17` ("closure", has REVIEW), `:236` (explicit pigeonhole count), `:289` (order-independence remark, labelled as not in the notes).
  - The auditor found `obs:chordal-induced` and `prop:interval-chordal` not in the notes, while Scope (§2) says 2026-10-06 p3 uses the first and p1 names interval graphs. The owner may want to look.
- t05 (scan 2026-10-13 p1–6; 8 pages):
  1. `menger/vertex-version-from-edge-version.md:179`: the B ⇒ A construction also replaces every arc by k parallel copies; the board (p5) only splits each x ≠ s, t into x⁻ → x⁺. The argument stays valid.
  - Hypotheses that differ from the board but carry a REVIEW comment (deliberate): `mengers-theorem.md:12` ("undirected simple graph with ≥ 2 vertices"; board: "undirected multigraph"), `:51` (A adds "no arc from s to t"); `set-version.md:12` ("at least k + 1 vertices"); `two-connected-graphs.md:13,16` ("at least 3 vertices"; in b) "no isolated vertex"); `ear-decompositions.md:12` (ears join distinct ends and have new inner vertices; board: "new paths between some two existing vertices").
  - Additions, same meaning: `k-connectivity.md:13–14`; `paths-and-cuts.md:16–17` (internally disjoint, edge-disjoint); `mengers-theorem.md:49` (k ≥ 1); `set-version.md:166` (full ⇒ argument; the board has a picture, and no ⇐); `two-connected-graphs.md:275` (details of b); the board: "Menger k=2", "Total Menger k=2"); `ear-decompositions.md:214` (case analysis for ⇐); `vertex-version-from-edge-version.md:173` (lifting and translating back; the board gives the construction and □).
  - No mismatch: `k-connectivity.md`, `paths-and-cuts.md`, `proving-the-edge-version.md`.
