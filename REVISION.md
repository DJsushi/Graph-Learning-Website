# Content revision plan (loop-driven)

On approval, this file is copied to `REVISION.md` in the repo root (added to `srcExclude` in
`.vitepress/config.mts`, so it is not published). It is the single state file for the `/loop` run: each
iteration does the first unchecked task, ticks it, appends to the ledger, commits.

## Context
All 7 lessons (4386 lines, `status: draft`) have never been proofread. The reference (`site/reference/[kind]`) lists statements in
lecture order. It has only 3 intuition blocks, all in t01. Ctrl-K does not find theorems, because container titles
are not headings.
Goals:
- correct math, checked against the lecture PDFs;
- intuition and an example for every reference entry;
- complete cross-links;
- a reference grouped by topic, with a search bar, and every entry findable with Ctrl-K.

User decisions:
- Lessons stay in lecture order (slugs and ids unchanged) and are rewritten inside.
- The reference is grouped by topic.
- Search: a filter bar plus global Ctrl-K.
- Intuition plus example or non-example for every entry.
- Math is checked against the PDFs as well.

Markdown stays. The limits are structural, and tasks I1–I3 fix them: intuition is not attached to its statement,
there is no topic layer, and there are no dependency links.

## How each iteration runs (context hygiene)
- The main loop session only orchestrates. It reads this file, takes the first `[ ]` task and spawns **one
  `general-purpose` subagent** with the task text plus the "Rules for content tasks" section below. The subagent
  starts with fresh context, so the main session stays small across the whole run.
- After the subagent returns, the main session runs `npm run validate && npm test`. If both pass, it ticks the box,
  appends the subagent's ledger entry and commits. If either fails, it does not tick: it sends the failure back to
  the same agent (SendMessage) once, and otherwise stops and reports.
- Each content task fits comfortably in one context (one lesson plus its PDF pages plus the ledger is roughly 40–60k
  tokens). The algorithm PDFs are 56–60 slides, so read them with `pdftotext -layout` and open individual pages as
  images only where the text is garbled.

## Rules for content tasks (give these to every content subagent)
1. Read the whole lesson first. Read `## Ledger` below: it lists every reference entry from the already-revised
   lessons, one line each with its statement, notation and conventions. Use it for consistency and links, and do
   not re-open other lessons unless you must.
2. Math check (task type **M**):
   - Compare every statement, name and notation with the source PDF pages listed in `sources:`. Theory files are
     handwritten scans, so use Read with `pages`.
   - Verify every proof step and fill in any gaps. Fix errors minimally.
   - Mark each change in a statement or proof with `<!-- REVIEW: <what/why> -->`. Unclear source:
     `<!-- SOURCE UNCLEAR: … -->`.
   - Never rename ids or slugs.
3. Writing pass (task type **W**):
   - Every definition, theorem, lemma, proposition, corollary, observation and algorithm gets an `::: intuition`
     right after it, attached by position or by `for=`. It covers why the result is true or useful, plus a tiny
     example or non-example. Add a small `graph` figure (new id `<slug>-…`) when a picture says it faster.
   - Split dense paragraphs. Add `::: pitfall` blocks where students typically slip.
   - Add the missing `[[refs]]`, driven by the lint warnings, and the cross-course links.
   - Do not change the math you checked in M, except to fix a new error you find (with a REVIEW comment).
4. Leave `status: draft`. Run `npm run validate`. The lesson must have 0 errors, and 0 lint warnings after W.
5. Return a ledger entry:
   - lesson;
   - list of math fixes;
   - one line per reference entry: `id — statement in ≤ 20 words — notation notes`;
   - open questions.

## Tasks

### Infrastructure (code; subagent may be skipped for small ones)
- [x] I0 Copy this file to `REVISION.md`; add `'REVISION.md'` to `srcExclude` in `.vitepress/config.mts`.
- [x] I1 Attached intuition.
  - `packages/content/index.ts`: extend the proof `forId` logic (around line 90) to `intuition`, so that it
    attaches to the nearest preceding statement, or to `for=`.
  - Add `intuitionsFor(ix, id)` next to `proofsFor` in `packages/content/pages.ts`.
  - Update CONTENT_CONVENTIONS.md §4.1/§4.3.
  - Add a vitest case.
- [x] I2 Lint in `scripts/validate-content.ts`, as warnings with their own count:
  - a reference container without an intuition;
  - a `defines` term mentioned unlinked in a section other than its defining one (first mention per section).
- [x] I3 Topic map.
  - Add `content/topics.yaml`: an ordered list of `{slug, title, intro, ids[]}`. Draft topics:
    - basics and isomorphism
    - degrees
    - walks and connectivity
    - bipartite
    - trees
    - spanning trees and MST
    - chordal
    - Hamiltonian
    - k-connectivity and Menger
    - flows and cuts

    Adjust the topics to the actual containers.
  - Validator: every reference container is in exactly one topic, and no listed id is unknown.
- [x] I4 Topic reference pages.
  - Add `site/reference/[topic].md` and `[topic].paths.ts`, modelled on `[kind]`.
  - Each page has the intro, then definitions, then results, then algorithms. Each entry is a real `####` heading
    with the container anchor (so Ctrl-K indexes it) and a visually hidden line with `aka` and `defines`. It shows:
    - the statement;
    - the intuition (open);
    - the proof (collapsed);
    - "Uses" and "Used by", computed from the `[[refs]]` in its body and proof.
  - The `[kind]` pages keep their URLs and become compact lists grouped by topic.
  - Update the sidebar and `site/reference/index.md`.
- [x] I5 Search bar.
  - Add `.vitepress/theme/components/ReferenceSearch.vue` on `/reference`.
  - Data: extend `.vitepress/data/refs.data.ts` with the label (`T5.2`), title, `aka`, `defines`, kind, course,
    topic, plain text and link.
  - Matching: token scoring with no new dependency. Matches in the label or title rank highest, then `aka` and
    `defines`, then the text.
  - Filters: chips for kind and course.
  - Interaction: results show the rendered statement. ↑/↓/Enter move through them, and `/` focuses the box.
- [x] I6 Check in Chrome, with the dev server running outside the sandbox:
  - the search finds "Menger", "T5.2" and "cut vertex";
  - Ctrl-K "Menger" lands on the entry;
  - the topic pages render;
  - `/reference/theorems` still works;
  - hover previews still work.

  Then run `npm run typecheck && npm run build`.

### Content (lesson order matters: the ledger accumulates)
- [x] M t01 `content/theory/01-basic-notions.md`
- [ ] W t01
- [ ] M t02 `content/theory/02-walks-connectivity-bipartite.md`
- [ ] W t02
- [ ] M t03 `content/theory/03-trees.md`
- [ ] W t03
- [ ] M t04 `content/theory/04-chordal-hamiltonian.md`
- [ ] W t04
- [ ] M t05 `content/theory/05-connectivity-menger.md`
- [ ] W t05 (cut vertex and bridge are defined only in prose at line ~29: make them a definition or add them to a `defines=`, so the search finds "cut vertex")
- [ ] M a01 `content/algorithms/01-minimum-spanning-trees.md`
- [ ] W a01 (link to the tree theory in t03: cut and cycle properties)
- [ ] M a02 `content/algorithms/02-maximum-flow.md`
- [ ] W a02 (Menger ↔ max-flow min-cut, both directions)
- [ ] F Final pass:
  - re-check `content/topics.yaml` against the final containers;
  - get validate to 0 warnings;
  - run typecheck, test and build;
  - re-run the I6 Chrome checks;
  - write `## Report` below (all math fixes, SOURCE UNCLEAR spots, open questions).

  Then stop the loop.

## Ledger
(appended by each content task)

### t01 Basic notions (`content/theory/01-basic-notions.md`)

**Math fixes (M):** none; file unchanged. Checked against 2026-09-15 pp. 1–7 and 2026-09-22 pp. 1–2: all proofs (Havel–Hakimi both cases; Erdős–Gallai TVW proof all cases), the 11-term Havel–Hakimi run and stepper, exercise/quiz answers, figure claims. Existing SOURCE UNCLEAR on `t01-iso-multigraph` confirmed (lecture H has 34 and 45 doubled, so not isomorphic; pentagram replacement valid).

- `def:graph` — Graph G=(V,E) with E ⊆ binom(V,2) — V(G), E(G); n=|V(G)|, m=|E(G)|; edge uv; finite simple by default; `basic=true`.
- `def:adjacent` (extra) — endpoints of e=uv adjacent (neighbours), e incident with both; N_G(v) neighbour set — British "neighbour"; `basic=true`.
- `def:mixed-multigraph` — (V,E,ε), ε: E→V ∪ (V×V) ∪ binom(V,2); loops, arcs, edges, parallel edges — remark: graph / digraph D=(V,E) / multigraph as special cases.
- `def:path-graph` — P_n: vertices 0..n, edges {i−1,i} — index = length (n edges, n+1 vertices).
- `def:cycle-graph` — C_n (n ≥ 3): vertices 1..n, edges {i,i+1}, {n,1} — n vertices, n edges.
- `def:complete-graph` — K_n: n vertices, all pairs adjacent — also defines "clique".
- `def:complete-bipartite` — K_{m,n}: all edges between V_m={1..m} and V_n={1'..n'} — lecture writes E = V_m × V_n.
- `obs:edge-counts-classes` (extra) — |E(P_n)|=n, |E(C_n)|=n, |E(K_n)|=binom(n,2), |E(K_{m,n})|=mn.
- `def:isomorphism` — G ≅ H iff bijection f with uv ∈ E(G) ⇔ f(u)f(v) ∈ E(H) — "a graph" = isomorphism class.
- `def:isomorphism-multigraph` — bijections f: V1→V2, g: E1→E2 with f(ε1(e)) = ε2(g(e)) — preserves type and direction.
- `prop:iso-invariants` (extra) — isomorphic graphs share n, m, degree multiset; d_G(v)=d_H(f(v)) — necessary not sufficient (C6 vs 2·C3).
- `def:degree` — d_G(v) = number of incident edges, loops twice; degree 0 = isolated — notation d_G(v), not deg.
- `lem:handshake` — Σ_v d_G(v) = 2|E(G)| for every (multi)graph — aka "degree sum formula".
- `cor:odd-degree-count` (extra) — every (multi)graph has an even number of odd-degree vertices.
- `def:degree-sequence` — (d_G(v_1),…,d_G(v_n)), usually non-increasing.
- `def:graphic-sequence` (extra) — non-negative integer sequence realised by some simple graph — "realisation".
- `thm:havel-hakimi` — non-increasing (d_1..d_n), d_1 ≤ n−1, graphic iff φ_1=(d_2−1,…,d_{d_1+1}−1,d_{d_1+2},…,d_n) is — proof: extremal choice + 2-switch.
- `alg:havel-hakimi` — sort, check d_1 ≤ k−1, remove d_1, decrement next d_1, reject on negatives — anchors @loop @sort @yes @too-big @reduce @negative.
- `thm:erdos-gallai` — graphic iff sum even and Σ_{i≤k} d_i ≤ k(k−1)+Σ_{i>k} min(d_i,k) ∀k — sufficiency proof extra (Tripathi–Venugopalan–West 2010); "subrealisation", "deficiency e_i".

Open questions:
- `thm:havel-hakimi` hypothesis d_1 ≤ n−1 is not on the board but needed for φ_1; kept unmarked. W may add a remark.
- Lecture H drawing in the multigraph isomorphism example: SOURCE UNCLEAR stays (could check the recording).
- W: Erdős–Gallai Case 3b bookkeeping (v_k full, u=x) is clumsy and repeated in the remark after the proof.
- 2-switch connectivity claim in a remark is stated without proof (standard).

## Report
