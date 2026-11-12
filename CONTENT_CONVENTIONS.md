# Content conventions

Rules for the course Markdown in `content/`. The build parses these files to produce the
pages, the generated `/reference/` section, flashcards, practice pages and cross-links. That
only works if every file follows these conventions exactly. Figures use the DSL in
`GRAPH_DSL.md`.

The content is being rebuilt from one page per lecture into one page per concept
(`RESTRUCTURE.md`). A script first cuts the lecture files into concept pages without changing
the text (stage `split`). Every proof then gets a walkthrough (§9). A page rebuilt to the
full template (§8, §10, §11) has stage `taught`; that happens only for pages the owner names.

Parts marked *planned* describe syntax or behaviour that the code supports only after the
phase of `RESTRUCTURE.md` named there.

---

## 1. Directory layout

```
content/
  topics.yaml                      chapters: slug, title, intro, course, entry ids in reference order
  notation.yaml                    every symbol once (§3.1)          deferred
  techniques.yaml                  proof techniques (§7.4)           deferred
  theory/
    03-trees.md                    lecture file: one per lecture, numbered by lecture order
    trees/
      leaves.md                    concept page: one concept
      practice.md                  chapter practice page (deferred)
  algorithms/
    01-minimum-spanning-trees.md
    mst/
      cut-property.md
```

- A concept page is `content/<course>/<chapter>/<page>.md`, served at
  `/<course>/<chapter>/<page>`. `<chapter>` is a slug from `topics.yaml`. File names are
  kebab-case and never change once published.
- A lecture file is `content/<course>/NN-kebab-title.md`. Its URL never changes. It shows the
  generated list of the concept pages that came from it, and whatever part of its old text is
  not converted yet.
- The courses are still running. A new lecture gets a lecture file with frontmatter and one
  intro paragraph; its content is written directly as concept pages.
- The reference section is generated from the containers (§4). It is never written by hand.

---

## 2. Frontmatter

### 2.1 Concept page

```yaml
---
title: The cut property
course: algorithms            # theory | algorithms
chapter: mst                  # slug from content/topics.yaml
order: 3                      # position in the chapter, unique per chapter
lectures: [a01]               # slugs of the lecture files this page comes from
goal: Explain why the lightest edge across a cut is in every minimum spanning tree.
needs: [algorithms/mst/cuts]  # pages to read first (concept pages or lecture pages)
symbols: [weight, cut-partition]   # ids from content/notation.yaml
stage: split                  # split = text as cut from the lecture | taught = rebuilt to §8
long: false                   # true raises the word cap; needs a comment saying why
status: draft
---
```

A split page has `title`, `course`, `chapter`, `order`, `lectures`, `stage` and `status`. `goal`
and `long` belong to taught pages. `needs` and `symbols` are deferred (`BACKLOG.md` §14).

Lecture files keep their frontmatter. A page is a concept page when it has `chapter`.
New figures keep the lecture prefix in their id (`a01-...`, `t03-...`).
`content/topics.yaml` is the chapter list and the grouping of the reference; every topic has a
`course`.

### 2.2 Lecture file

```yaml
---
title: Trees
course: theory            # theory | algorithms
lecture: 3                # lecture number, matches the file prefix
slug: t03                 # prefix of figure and exercise ids from this lecture
summary: Forests and trees, leaves, characterisations, spanning trees, Cayley's formula.
sources:                  # lecture material
  - resources/graph-theory/2026-09-29-13_47_15-join.pdf
status: draft             # draft | reviewed
---
```

---

## 3. Mathematics

- Inline math `$...$`, display math `$$...$$` on their own lines. KaTeX-compatible LaTeX only:
  no `\newcommand` inside lessons, no `align` (use `aligned` inside `$$`), no TikZ.
- Shared macros are defined once in the site's KaTeX config. The content may use exactly these
  (add new ones here and in the config together):

| Macro | Expands to | Use |
|-------|-----------|-----|
| `\N`, `\Z`, `\R` | $\mathbb{N}, \mathbb{Z}, \mathbb{R}$ | number sets |
| `\deg` | built-in | degree |
| `\binom{V}{2}` | built-in | 2-element subsets |
| `\abs{x}` | $\lvert x \rvert$ | cardinality |
| `\set{x}` | $\{x\}$ | sets |
| `\ol{x}` | $\overline{x}$ | complement |
| `\O` | $\mathcal{O}$ | big-O |

- **Notation follows the lectures** (e.g. $G=(V,E)$, $n=\abs{V(G)}$, $m=\abs{E(G)}$, $D$ for
  digraphs, $(G,s,t,c)$ for flow networks). Where textbooks commonly use other notation, mention
  it once in a `::: remark`.

### 3.1 Notation registry

*Deferred (`BACKLOG.md` §14).*

`content/notation.yaml` lists every symbol once:

```yaml
- id: min-degree
  tex: '\delta(G)'
  name: minimum degree
  says: the smallest degree of a vertex of G
  defined: def:minimum-degree     # optional
```

A page lists the symbols it uses in `symbols:`. The page header shows them as a small
"Symbols on this page" strip (symbol, name, meaning, link). `/reference/notation` lists all.
Introduce a symbol in the text one at a time, with its reading the first time:
"$\delta(G)$, the minimum degree: the smallest degree of any vertex".

---

## 4. Containers

Containers use the `markdown-it-container` syntax with an attribute block. The fence starts at
column 0.

```markdown
::: definition {#def:graph title="Graph"}
A **graph** is a pair $G = (V, E)$ where ...
:::
```

### 4.1 Container types and id prefixes

| Container | Id prefix | In reference | In flashcards |
|-----------|-----------|--------------|---------------|
| `definition` | `def:` | yes | yes |
| `theorem` | `thm:` | yes | yes |
| `lemma` | `lem:` | yes | yes |
| `proposition` | `prop:` | yes | yes |
| `corollary` | `cor:` | yes | yes |
| `observation` | `obs:` | yes | no |
| `claim` | `claim:` | no | no |
| `algorithm` | `alg:` | yes | no |
| `example` | `ex:` | no | no |
| `proof` | none | attached to its statement | no |
| `intuition` | none | attached to its entry, headed "In words" | no |
| `remark` | optional `rem:` | no | no |
| `pitfall` | none | no | no |
| `exercise` | `exr:` | practice pages | no |
| `quiz` | `q:` (required) | practice and exam pages | no |
| `walkthrough`, `step` | none | no (§9; planned, Phase 2) | no |

- Ids are **semantic** (`thm:handshake`), unique site-wide, kebab-case after the prefix, and
  never renamed.
- Entries are shown by kind and name: "Theorem · Cut property". There are no numbers. Every entry that
  appears in the reference needs a `title`.

### 4.2 Attributes

| Attribute | On | Meaning |
|-----------|----|---------|
| `#id` | all numbered containers | Stable id. |
| `title` | optional | Name shown in the box head: "Theorem · Handshake lemma". |
| `aka` | optional | Alternative names, for search: `aka="degree sum formula"`. |
| `source` | optional | Where it appears in the lecture material: `source="theory/2026-09-22 p2"`. Shown as a tag ("Lecture 2026-09-22, p. 2"; "Slides 01, p. 5" for algorithms) and validated: `<theory\|algorithms>/<document> p<page>`, also `p1–2`, `p6, p5`, several joined by `; `. |
| `extra` | optional flag | `extra=true` marks material **not covered in the lectures** (added for completeness/intuition). Rendered with an "extra" badge so students know it is beyond the lectures. |
| `defines` | definitions | Comma-separated list of the terms (or phrases) defined, for search and link linting: `defines="loop, parallel edges"`. |

Further attributes:

| Attribute | On | Meaning |
|-----------|----|---------|
| `for` | `proof`, `intuition`, `walkthrough` | The id of the statement it belongs to, when that is not the nearest preceding one. |
| `technique` | `walkthrough` | Id from `content/techniques.yaml` (§7.4). Deferred. |
| `kind=proof`, `given` | `exercise` | A proof task in exam format and the results the reader may use (§7.4). Deferred. |
| `difficulty` | `exercise` | 1 (routine) to 3 (hard). |

### 4.3 Proofs

- A `::: proof` container belongs to the nearest preceding numbered statement container
  (theorem, lemma, proposition, corollary, observation, claim), even if text, figures or
  `intuition`/`remark` blocks come in between. If it proves a different statement, give it
  `for=<id>`: `::: proof {title="Proof of the theorem" for=thm:dirac-ore}`. The renderer adds the ∎.
- A `::: intuition` container is attached the same way, but to the nearest preceding reference
  entry with an id (definition, theorem, lemma, proposition, corollary, observation or algorithm;
  not a claim). Override with `for=<id>`. The reference pages collect them
  with `intuitionsFor`.
- Proofs are complete and rigorous. Steps the lecture skips are filled in. If a proof has
  sub-claims, nest `claim` containers inside the proof; the outer container then needs four
  colons:

```markdown
:::: proof
We prove both directions.

::: claim {#claim:tree-unique-path title="Unique paths"}
Between any two vertices of a tree there is exactly one path.
:::

Proof of the claim ...
::::
```

- Optional `::: proof {title="Proof sketch"}` or `{title="Alternative proof"}`.

On a concept page a proof longer than 10 source lines, or one that has a walkthrough (§9),
renders closed; other proofs render open. The validator lists proofs that have no walkthrough
yet. *Planned, Phase 1.*

### 4.4 Algorithms and pseudocode

````markdown
::: algorithm {#alg:kruskal title="Kruskal's algorithm"}
**Input:** a connected weighted graph $G=(V,E,w)$. **Output:** an MST $T$.

```pseudo
sort edges by weight: w(e_1) ≤ … ≤ w(e_m)      // @sort
T ← ∅                                             // @init
for i = 1 … m:                                    // @loop
    if T + e_i is acyclic:                        // @test
        T ← T + e_i                               // @accept
return T                                          // @return
```
:::
````

- Pseudocode lives in a ```` ```pseudo ```` block inside an `algorithm` container.
- Lines that an algorithm player should highlight end with `// @label`. Labels are unique within
  the block. Algorithm implementations in `graph-core` refer to these **labels**, never to line
  numbers, so editing the pseudocode text does not break the player.
- The player for `algo: kruskal` displays the pseudocode of `alg:kruskal`. The mapping
  algorithm id → container id is `alg:<algo-id>` unless the registry says otherwise.

---

## 5. Cross-references

| Syntax | Renders as |
|--------|-----------|
| `[[lem:handshake]]` | "Lemma (Handshake lemma)" with a link and a hover preview |
| `[[lem:handshake\|the handshake lemma]]` | custom link text |
| `[[theory/03-trees]]`, `[[theory/trees/leaves]]` | link to a page by path |
| `[[fig:t03-leaf-removal]]` | link to a figure by its id |
| `[[fig:a01-cut-property#crossing\|the crossing edges]]` | mark link: lights up part of a figure (§6.1; planned, Phase 2) |

- A broken reference fails the build.
- A link resolves to wherever its target lives. Moving an entry to another page needs no link
  edits.
- In the reading path always give the link text, and link a target once per page (§11).
- Define a notion once and reference it from the other course instead of defining it twice.

---

## 6. Figures

- Figures are ```` ```graph ```` blocks (see `GRAPH_DSL.md`).
- Every figure has an `id` (prefix = lesson `slug`, e.g. `t01-…`, `a02-…`), a `caption`, and an
  `intent` unless it is trivially obvious.
- Every definition and statement has a figure near it: an example, and for a definition a
  non-example where it makes the boundary clear.
- Figures transcribed from the lecture material keep the lecture's vertex names and numbers so
  students can match them with their notes.
- Prefer `widget=player` for algorithms in the registry, `widget=stepper` for proof
  constructions, `widget=editable` when a property is best understood by experimenting.
- Steppers and players animate between steps. Use stable vertex and edge ids so shared elements
  slide instead of fading; use `merge` / `split` (GRAPH_DSL.md §9.5) for contraction,
  identification and vertex splitting rather than faking them with `remove` and colours, and give
  edges that survive a merge an explicit `id`.
- A figure is drawn at its natural size, at most 1.25 px per layout unit, so a small graph stays
  small. Do not spread `@(x,y)` positions to fill the width. A figure wider than about 15 units
  or taller than 8 shrinks below the minimum readable size (validator warning): split it into
  panels or steps instead.

### 6.1 Marks: text that lights up the figure

In a figure, a mark is a named set of elements with no visual effect of its own:

```
mark S: a b c
mark crossing: b--d c--e c--f
```

`mark` is allowed in the base graph and inside steps. Inside a stepper a mark is cumulative
like other statements, and a later `mark` with the same name replaces the earlier one.

In text: `[[fig:a01-cut-property#crossing|the three crossing edges]]`. The link text is
required and the figure must be on the same page. The validator checks the figure, the page, the
link text and that some step (or the base graph) defines the mark.

Behaviour: pointing at, focusing or tapping the link spotlights the mark. Marked elements get
an accent ring or a thicker stroke and everything else in that figure fades to about 30%.
Leaving, blurring or tapping again clears it. Elements absent from the current step are
skipped. The link is a focusable element with a dotted accent underline.

Authoring rule: in a walkthrough step, every named object (a set, a path, an edge) is either a
visible label in the figure or a mark link at its first mention in that step.

Adding `mark` lines to a moved figure is allowed. Nothing else in a moved figure changes.

---

## 7. Exercises and quizzes

### 7.1 Graph exercises

Interactive exercises are ```` ```graph ```` blocks with `widget=exercise` (`GRAPH_DSL.md` §9.4).

### 7.2 Text exercises

```markdown
:::: exercise {#exr:degree-parity title="Odd degrees" difficulty=2}
Show that every graph has an even number of vertices of odd degree.

::: hint
Use [[thm:handshake]].
:::

::: solution
...
:::
::::
```

The outer container needs more colons (`::::`) than the containers nested in it. `difficulty` is
1 (routine) to 3 (hard). The solution is hidden by default.

### 7.3 Quizzes

```markdown
:::: quiz {#q:t01-degree-sum}
A graph has 7 edges. What is the sum of its vertex degrees?

- [ ] 7
- [x] 14
- [ ] 21
- [ ] It depends on the graph.

::: explanation
By [[thm:handshake]], the sum of degrees is $2m = 14$.
:::
::::
```

- Multiple choice: a task list; `[x]` marks correct choices (one or more).
- Numeric answer instead of choices: a line `answer: 14` (optional `tolerance: 0.01`).
- A quiz may contain a graph figure.
- The explanation is mandatory.

### 7.4 Techniques and proof tasks

*Deferred (`BACKLOG.md` §14).*

`content/techniques.yaml`: `id`, `name`, `how` (two or three sentences: what the move is and
how to recognise when it applies). Start with the techniques the pilots need (exchange
argument, longest path, induction by removing a leaf, counting edges two ways, bijection) and
add entries as proofs are converted. `/techniques/<id>` shows the description and every proof
that uses it.

Exam-format tasks use the existing `exercise` container with two new attributes:

```markdown
:::: exercise {#exr:t03-two-leaves-forest title="Leaves of a forest" kind=proof given="thm:two-leaves, cor:forest-edges" difficulty=2}
Prove that a forest with $c$ components and no isolated vertex has at least $2c$ leaves.

::: hint
First hint: one step of the proof.
:::

::: solution
The model proof.
:::
::::
```

Rendering: "You may use:" followed by the given results as chips with hover previews, hints
revealed one at a time, the solution closed, and an "I solved it" button that stores progress
under the exercise id (written exercises have no progress today).

Each chapter `practice.md` has at least three proof tasks, and at least one of them combines
results from two different pages. Model solutions get the same mathematical check as
walkthroughs (§13).

---

## 8. Concept page template

For a page with `stage: taught`, in this order. "Required" items are checked by the validator
once the budget checks exist (§10).

1. **Opening** (required). One to three sentences that ask a concrete question about a small
   concrete graph, and the figure that shows it. No definition before this figure.
2. **Idea.** The answer in plain words, at most 120 words and one heavy math span.
3. **Statement.** The definition, theorem or algorithm container, moved verbatim. Directly
   after it an `::: intuition` block, rendered with the heading "In words": at most 50 words.
4. **Worked example.** A stepper, player or sandbox that applies the statement to a concrete
   graph. Required for definitions and algorithms.
5. **Why it is true** (required for every proof longer than 5 source lines). One sentence that
   names the technique, then a `walkthrough` (§9), then the verbatim `proof` container.
   A proof that has a walkthrough renders closed with the summary "Compact proof".
6. **Pitfall.** At most two `::: pitfall` blocks.
7. **Check yourself** (required). At least one `quiz` or graph `exercise` about this concept.
8. **`## More`** (optional). Cross-course connections, forward references, history. This
   section is outside the budgets and outside the forward-reference rule.
9. **Next.** Generated: the next page in the chapter and the pages that `need` this one.

---

## 9. Walkthrough

*Implemented (T2.3, T2.5).*

A proof or construction explained step by step beside one figure.

`````markdown
:::: walkthrough {for=thm:cut-property technique=exchange}
```graph id=a01-cut-exchange widget=stepper
...base graph...
step: A spanning tree without e.
step: Adding e closes a cycle.
class cycle: c--f e--f c--e
```

::: step
Text of step 1.
:::

::: step
Text of step 2.
:::
::::
`````

- A walkthrough for a proof longer than 10 source lines starts with exactly one `graph` block
  with `widget=stepper`. A shorter proof has one too, unless the proof is pure arithmetic with
  nothing to draw. A proof with separate parts (two directions, several cases) gets one
  walkthrough per part, each with its own figure.
- The figure uses the lecturer's example and drawing when the lecture has one for this proof
  (the statement's `source` attribute names the page): the same graph and the same vertex
  names. Where the lecture has none, make a new one. The lecture's figures are the minimum,
  not the limit. The `intent` says whether a figure comes from the lecture or is new.
- With a figure, the number of `::: step` blocks equals the number of `step:` lines in it. The
  `step:` captions stay short (they are the fallback caption and the screen-reader text).
- `for=` names the statement being proved; it must be on the same page. Omit it when the
  walkthrough explains a definition or an example.
- `technique=` (an id from `content/techniques.yaml`, §7.4) is deferred. Name the technique in
  the sentence before the walkthrough instead.
- Each step: at most 60 words and 2 heavy math spans, and one inference. Say what we do, why we
  may do it, and what we now know.
- The steps follow the written proof in the same order. They fill in every reason the proof
  skips: each "so", "hence" and "clearly" gets its why, with a link to the entry it uses. They
  do not change the argument.

Rendering:

- Wide (content column at least 960px): two columns. Steps on the left, numbered, the active
  one marked. The figure on the right, sticky below the navigation bar, with the usual stepper
  controls.
- Narrow: one column. The figure is sticky at the top, at most 45% of the viewport height.
- The active step follows scrolling (the step that crosses the middle of the viewport),
  a click on a step, and the stepper controls. The controls scroll the active step into view
  only when it is off screen.
- Without JavaScript all steps are readable and the figure shows step 1.
- A walkthrough without a figure is a numbered list in the text column.

Under the walkthrough the page shows one generated line, "This proof uses: ..." (the
`[[refs]]` inside the compact proof; `entryLinks` in `packages/content/pages.ts` already
computes this for the reference).

---

## 10. Budgets, checked by `npm run validate`

These budgets are for pages with `stage: taught`. Their checks in the validator are deferred
(`BACKLOG.md` D1); until then the writer of a taught page counts by hand. The rules for
walkthroughs and mark links (E7, E13) and for fences (E12) are checked on every page, and
proofs without a walkthrough are listed as warnings.

Definitions:

- **Reading path**: all text of a concept page except frontmatter, statement containers
  (`definition`, `theorem`, `lemma`, `proposition`, `corollary`, `observation`, `claim`,
  `algorithm`), `proof`, `hint`, `solution`, `explanation`, fenced blocks, HTML comments and the
  `## More` section.
- **Light math span**: a single letter with an optional subscript or prime (`$P$`, `$v_1$`,
  `$K_{3,3}$`), a number, or two such atoms joined by one `+` or `-` (`$n-1$`).
- **Heavy math span**: every other `$...$`.

Errors (the build fails). They apply to concept pages only; items 2, 3 and 9 do not apply to
`kind: practice`.

| # | Rule |
|---|------|
| E1 | The first `graph` block comes before the first statement container. |
| E2 | At least 2 `graph` blocks, at least one of them not `widget=figure`. |
| E3 | At most 2 definitions and at most 3 other statements. |
| E4 | Reading path at most 900 words (1400 with `long: true`). |
| E5 | Reading path: at most 3 heavy spans and at most 12 spans in total per 100 words. |
| E6 | Every `proof` has a `walkthrough` with `for=` its statement. |
| E7 | Walkthrough: a figure when the proof is longer than 10 lines; a figure is the first child and a stepper; step counts match; each step within its limits. |
| E8 | `intuition`: at most 50 words and 1 heavy span. Every statement has one. |
| E9 | At least one `quiz` or graph `exercise`. |
| E10 | Frontmatter: `chapter` exists, `order` unique, `goal` present and at most 25 words, `needs`, `lectures` and `symbols` resolve, `needs` has no cycle. |
| E11 | No forward reference in the reading path: the target is on the same page, on a page reachable through `needs`, or on a lecture page. |
| E12 | Every container fence starts at column 0. |
| E13 | Mark links: figure on the same page, mark declared, link text present. |

Warnings: a sentence over 30 words; a paragraph over 80 words; the same target linked twice on
a page; a bare `[[id]]` in the reading path; more than 8 symbols; a stepper step that changes
nothing; reading path over 600 words.

Remove for concept pages: the lint "term not linked in this section"
(`scripts/validate-content.ts`, near line 124). It produced a link in almost every sentence.

The numbers in E4, E5 and E8 are starting values calibrated on the current text. Do not loosen
them without the owner's agreement. If a page cannot meet them, split the page.

---

## 11. Writing rules for the reading path

1. Concrete first. Show the thing on the page's graph with real vertex names and numbers, then
   say it in general. Reuse the chapter's running example and its vertex positions.
2. Words before symbols. Say the sentence in words, then give the formula if it is needed.
3. One new symbol at a time, with its reading at first use.
4. One idea per paragraph, at most four sentences. Short sentences. Active voice, "we" and
   "you".
5. The opening and the idea are fully concrete. A walkthrough uses the general names of the
   proof (the reader must be able to write the proof in an exam), binds each name to the
   picture with a mark link, and gives the concrete numbers as a check.
6. Name the technique. Say where each hypothesis is used: "Here we need that $e$ is strictly
   the lightest."
7. A figure change for every step. If nothing in the picture changes, the step is probably
   two steps merged or not a step.
8. No "clearly", "obviously", "trivially", "it is easy to see".
9. No forward references and no cross-course remarks in the reading path. They go to
   `## More`.
10. Link a target once per page, at its first mention, with link text that reads as part of the
    sentence.

Before (current intuition for `def:cut`, 106 words, 6 links, 5 heavy spans):

> A cut splits the vertices into two non-empty sides, and the crossing edges are the only
> connections between them. Every spanning tree must use **at least one** crossing edge of
> every cut, otherwise it could not connect the two sides. The cut property below says which
> crossing edge the MST uses. Example: in [[fig:a01-cut-property]], $S = \set{a, b, c}$ and the
> crossing edges are $bd$, $ce$ and $cf$. The simplest cuts are
> $(\set{v}, V \setminus \set{v})$ ... In a [[def:flow-network|flow network]], an $s$–$t$ cut
> ([[def:flow-cut]]) is a cut with $s \in S$ and $t \notin S$ ...

After (34 words; the flow-network sentences move to `## More`):

> Draw a line through the graph so that some vertices are on each side. The edges the line
> passes through are the crossing edges. They are the only way to get from one side to the
> other.

---

## 12. Moving content out of a lecture file

Converting a section means **cutting** it out of its lecture file and into a concept page. The
lecture file shrinks; its URL stays.

The move is done once, by `scripts/split.ts` (`RESTRUCTURE.md` §4.1). Statements and proofs
are locked by hash in `content/entries.lock.json`; the validator fails when the text of a
locked entry changes. The rules below also hold for every later move by hand.

1. Cut statements, their proofs and their figures and paste them unchanged (ids, attributes,
   text). `REVIEW` and `SOURCE UNCLEAR` comments travel with their text.
2. Lead-ins, intuition, pitfalls and remarks are rewritten to the template, the budgets and
   §11. A mathematical claim made in the old prose must survive in meaning. If you drop or
   change one, leave a `REVIEW` comment.
3. Content of an old intuition block that does not fit 50 words goes to `## More`. Do not
   delete facts silently.
4. Quizzes and exercises stay in the lecture file for now (chapter practice pages are
   deferred).
5. Never rename a container id, a figure id or a lecture slug.
6. If you find a mathematical error in a moved statement or proof, fix it minimally, mark it
   `<!-- REVIEW: what and why -->` and report it. The lock entry is then updated on purpose.

---

## 13. New mathematics

Moved text was checked against the lectures. New text was not. Rules for everything new:

- A walkthrough follows its written proof step by step. Every reason it adds must be correct;
  it does not change the argument (§9).
- Every number in new text (a weight, a count, a degree) is computed with `graph-core`, not by
  hand, and gets a test in `packages/graph-core/test/content-claims.test.ts`.
- A new proof task states a standard result or a direct consequence of entries on the site.
  It carries `extra=true`, and its model solution is a complete proof.
- "In words" and idea paragraphs may simplify, and must stay true as stated.
- Every new walkthrough, proof task, model solution and quiz is checked by an independent
  reader before it is committed (the `math-checker` agent, `RESTRUCTURE.md` §1).
- British English, lecture notation.

---

## 14. Faithfulness to the source material

- Everything stated in the lectures must appear, with the lecture's names and notation.
- Add nothing the lectures do not contain (owner, 2026-11-12). Allowed: intuition, examples
  and figures for what the lectures state, and filled-in steps of a proof the lectures give.
  Not allowed: new statements, new sections, or proofs of results the lectures only state.
  `extra=true` remains only on material that was here before this rule.
- If the source is illegible or ambiguous, do not invent content. Write

  ```markdown
  <!-- SOURCE UNCLEAR: resources/graph-theory/<file>.pdf p.N — <what is unclear> -->
  ```

  and, where possible, give the standard textbook version marked `extra=true`.
- A content validation script (`npm run validate`) lists all `SOURCE UNCLEAR` markers.

---

## 15. Exemplar sketch: `content/algorithms/mst/cut-property.md`

A sketch of structure and register. The syntax of `mark`, `walkthrough` and `step` is the
design of this document and is implemented in Phase 2 of `RESTRUCTURE.md`. The numbers were checked with a script on 2026-11-10
(tree of step 1 is spanning and weighs 35, after the swap 29, the minimum spanning tree weighs
29, the quiz answer is $ef$). Still add them to `content-claims.test.ts`.

`````markdown
---
title: The cut property
course: algorithms
chapter: mst
order: 3
lectures: [a01]
goal: Explain why the lightest edge across a cut is in every minimum spanning tree.
needs: [algorithms/mst/minimum-spanning-tree, algorithms/mst/cuts]
symbols: [weight, cut-partition]
status: draft
---

Split the towns into two groups. Three roads run between the groups. A network that connects
all towns must use at least one of them. Which one does the cheapest network use?

```graph id=a01-cut-property widget=figure
(the existing figure, unchanged, plus:)
mark S: a b c
mark crossing: b--d c--e c--f
mark lightest: c--f
```

Point at the words to see them in the picture:
[[fig:a01-cut-property#S|the left group]],
[[fig:a01-cut-property#crossing|the three crossing roads]],
[[fig:a01-cut-property#lightest|the cheapest of them]].

The cheapest network always uses the cheapest crossing road. The rest of the graph does not
matter.

::: theorem {#thm:cut-property title="Cut property" source="algorithms/01 p5"}
(verbatim)
:::

::: intuition
Split the vertices into two groups in any way you like. Look only at the edges between the
groups. The lightest of them is in the minimum spanning tree.
:::

"The lightest" means strictly lighter than every other crossing edge.

## Why it is true

This is an **exchange argument**. We take a spanning tree that avoids the edge, swap one edge,
and get a lighter spanning tree. So a tree that avoids the edge is never the minimum.

:::: walkthrough {for=thm:cut-property technique=exchange}
```graph id=a01-cut-exchange widget=stepper
caption: The exchange argument behind the cut property.
intent: Proof walkthrough on the running example. The tree of step 1 crosses the cut only at ce.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4 class=tree]; a -- c [w=8 class=tree]; b -- c [w=11]; b -- d [w=9]
c -- e [w=7 class=tree]; c -- f [w=1]; d -- e [w=2 class=tree]; d -- g [w=6 class=tree]
e -- f [w=5 class=tree]; e -- g [w=12]; f -- h [w=3 class=tree]; g -- h [w=10]
group S: a b c [label="$S$"]
mark M: a--b a--c c--e d--e d--g e--f f--h
mark e: c--f
mark f: c--e
mark cycle: c--f e--f c--e
step: A spanning tree M that does not use e.
step: Adding e closes a cycle.
class cycle: c--f e--f c--e
step: The cycle crosses the cut a second time, at f.
class cut: c--e
step: f is heavier than e.
class highlight: c--f
step: Swap f for e: a lighter spanning tree.
unclass cycle: c--f e--f c--e
unclass tree: c--e
class rejected: c--e
class tree: c--f
```

::: step
Let [[fig:a01-cut-exchange#e|$e$]] be the lightest edge across the cut. Suppose a spanning
tree [[fig:a01-cut-exchange#M|$M$]] does not use $e$. We will build a lighter spanning tree,
so $M$ is not a minimum one.
:::

::: step
Add $e$ to $M$. Adding an edge to a tree always closes
[[fig:a01-cut-exchange#cycle|a cycle]], because
[[thm:tree-characterisations|a tree is maximally acyclic]]. The cycle goes through $e$.
:::

::: step
The cycle crosses the cut along $e$. A cycle returns to where it started, so it must cross
back. It crosses back along another edge [[fig:a01-cut-exchange#f|$f$]]. Every edge of the
cycle except $e$ belongs to $M$, so $f$ belongs to $M$.
:::

::: step
Both $e$ and $f$ cross the cut, and $e$ is strictly the lightest crossing edge. So $f$ is
heavier than $e$. Here: 7 against 1.
:::

::: step
Swap them: remove $f$ and keep $e$. Everything is still connected, because the rest of the
cycle leads around $f$. The number of edges is the same as before. So this is a spanning
tree, and it is lighter. Here: $35 - 7 + 1 = 29$.
:::
::::

::: proof {title="Proof of the cut property" for=thm:cut-property}
(verbatim)
:::

::: pitfall
The cut property speaks about **one** cut. An edge of the minimum spanning tree need not be
the lightest across every cut it crosses. In the example $ac$ is in the tree, but across the
cut that separates $a$ from all other vertices, $ab$ is lighter.
:::

## Check yourself

:::: quiz {#q:a01-cut-property-pick}
In the first figure, put $d$, $e$ and $g$ on one side and all other vertices on the other.
Which edge does the cut property put into the minimum spanning tree?

- [ ] $de$ (weight 2)
- [x] $ef$ (weight 5)
- [ ] $ce$ (weight 7)
- [ ] $bd$ (weight 9)

::: explanation
The crossing edges are $bd$, $ce$, $ef$ and $gh$, and $ef$ is the lightest. The edge $de$ is
lighter, but both its ends are on the same side, so it does not cross.
:::
::::

## More

(The links to cuts in flow networks and to vertex cuts, from the old intuition and pitfall.)
`````
