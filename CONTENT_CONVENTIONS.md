# Content conventions

Rules for the course Markdown in `content/`. The site build parses these files to produce the
lessons, the generated `/reference/` section, flashcards, the practice pages and cross-links.
That only works if every file follows these conventions **exactly**. Graph figures use the DSL
in `GRAPH_DSL.md`.

---

## 1. Directory layout

```
content/
  theory/
    01-basic-notions.md          one file per lecture, numbered by lecture order
    02-degrees-paths-trees.md
    ...
  algorithms/
    01-minimum-spanning-trees.md
    02-maximum-flow.md
    ...
```

- File names: `NN-kebab-title.md`, `NN` = lecture number (two digits). The slug
  (`theory/01-basic-notions`) is the page URL and must never change once published.
- The courses are still running. New lectures are **appended** as new files; existing files and
  ids are never renumbered. If a lecture is split over two files, use `03a-…`, `03b-…`.
- The reference section is **not** written by hand. It is generated from the theorem-like
  containers (§4) across all lessons.

---

## 2. Frontmatter

Every lesson starts with YAML frontmatter:

```yaml
---
title: Basic notions
course: theory            # theory | algorithms
lecture: 1                # lecture number, matches the file prefix
slug: t01                 # short id prefix used for figure / exercise ids in this file
summary: Graphs, multigraphs, digraphs, subgraphs, isomorphism and special graph families.
prerequisites: []         # list of lesson paths, e.g. [theory/01-basic-notions]
sources:                  # lecture material this lesson is based on
  - resources/graph-theory/2026-09-15_09_45_32-join.pdf
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

---

## 4. Theorem-like containers

Containers use the `markdown-it-container` syntax with an attribute block:

```markdown
::: definition {#def:graph title="Graph"}
A **graph** is a pair $G = (V, E)$ where ...
:::
```

### 4.1 Container types and id prefixes

| Container | Id prefix | Numbered | In reference | In flashcards |
|-----------|-----------|----------|--------------|---------------|
| `definition` | `def:` | yes | yes | yes |
| `theorem` | `thm:` | yes | yes | yes |
| `lemma` | `lem:` | yes | yes | yes |
| `proposition` | `prop:` | yes | yes | yes |
| `corollary` | `cor:` | yes | yes | yes |
| `observation` | `obs:` | yes | yes | no |
| `claim` | `claim:` | yes (within the proof) | no | no |
| `algorithm` | `alg:` | yes | yes | no |
| `example` | `ex:` | yes | no | no |
| `proof` | — (no id) | no | attached to the preceding statement | no |
| `remark` | optional `rem:` | no | no | no |
| `intuition` | — | no | no | no |
| `pitfall` | — | no | no | no |
| `exercise` | `exr:` | yes | in practice pages | no |
| `quiz` | `q:` | no | in practice / exam pages | no |

- Theorems, lemmas, propositions, corollaries and observations share **one numbering sequence
  per lesson** (Theorem 1.1, Lemma 1.2, Corollary 1.3 …). Definitions have their own sequence
  (Definition 1.1, 1.2 …). Numbers are generated; content never writes numbers.
- Ids are **semantic, not numeric** (`thm:handshake`, not `thm:1-3`), unique site-wide, never
  renamed. Use kebab-case after the prefix.

### 4.2 Attributes

| Attribute | On | Meaning |
|-----------|----|---------|
| `#id` | all numbered containers | Stable id. |
| `title` | optional | Name shown after the number: "Theorem 2.3 (Handshake lemma)". |
| `aka` | optional | Alternative names, for search: `aka="degree sum formula"`. |
| `source` | optional | Where it appears in the lecture material: `source="theory/2026-09-22 p2"`. |
| `extra` | optional flag | `extra=true` marks material **not covered in the lectures** (added for completeness/intuition). Rendered with an "extra" badge so students know it is beyond the lectures. |
| `defines` | definitions | Space-separated list of terms defined, for search and auto-linking: `defines="loop multigraph"`. |

### 4.3 Proofs

- A `::: proof` container immediately follows the statement it proves. It ends with the
  container end; the renderer adds the ∎.
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
| `[[thm:handshake]]` | "Theorem 2.3 (Handshake lemma)" with a link and a hover preview |
| `[[thm:handshake\|the handshake lemma]]` | custom link text |
| `[[def:tree]]` | "Definition 3.1 (Tree)" |
| `[[theory/03-trees]]` | link to a lesson by path |
| `[[fig:t03-leaf-removal]]` | link to a graph figure by its id |

- A broken reference fails the build.
- References across courses are encouraged (algorithms lessons should cite the theory
  definitions instead of redefining them; when a definition is genuinely needed in both, define
  it once and reference it).

---

## 6. Figures

- Figures are ```` ```graph ```` blocks (see `GRAPH_DSL.md`).
- Every figure has an `id` (prefix = lesson `slug`, e.g. `t01-…`, `a02-…`), a `caption`, and an
  `intent` unless it is trivially obvious.
- Figures transcribed from the lecture material keep the lecture's vertex names and numbers so
  students can match them with their notes.
- Prefer `widget=player` for algorithms in the registry, `widget=stepper` for proof
  constructions, `widget=editable` when a property is best understood by experimenting.

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

---

## 8. Lesson structure

Each lesson follows this outline (sections may be omitted when empty):

1. Short motivation paragraph (why this topic, what it is used for).
2. Content sections (`##`), each: definitions → examples/figures → statements → proofs, with
   `::: intuition` and `::: pitfall` blocks where they help.
3. `## Summary` — bullet list of the key facts with cross-references.
4. `## Exercises` — text exercises, graph exercises and quizzes.

Headings: the page title comes from frontmatter; the lesson body starts at `##`.

---

## 9. Faithfulness to the source material

- Everything stated in the lectures must appear, with the lecture's names and notation.
- Additions beyond the lectures are welcome (intuition, extra examples, filled-in proof steps)
  but whole extra **statements or sections** get `extra=true`.
- If the source is illegible or ambiguous, do not invent content. Write

  ```markdown
  <!-- SOURCE UNCLEAR: resources/graph-theory/<file>.pdf p.N — <what is unclear> -->
  ```

  and, where possible, give the standard textbook version marked `extra=true`.
- A content validation script (see `PLAN.md` §13) lists all `SOURCE UNCLEAR` markers.
