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
- [x] W t01
- [x] M t02 `content/theory/02-walks-connectivity-bipartite.md`
- [x] W t02
- [x] M t03 `content/theory/03-trees.md`
- [x] W t03
- [x] M t04 `content/theory/04-chordal-hamiltonian.md`
- [x] W t04
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

### t01 (W) Basic notions

**Math fixes (W):** none. Wording only in the Erdős–Gallai proof: Case 3b (v_k ∈ N(v_r)) split into v_k deficient / full, with the u = x bookkeeping written out and u ∈ B stated; the remark after the proof no longer repeats it.

Entries as in M (`prop:iso-invariants` now links [[def:degree-sequence]], [[def:degree]]). Added: intuitions for all entries; pitfalls (multigraph degree ≠ neighbour count; Havel–Hakimi re-sort each round; Erdős–Gallai needs all k and the sorted order); remark after `thm:havel-hakimi` on the hypothesis d_1 ≤ n−1; links to t02 (def:bipartite, def:clique, def:component) and a02 (def:flow-network). Lint for t01: 0.

Open questions: SOURCE UNCLEAR on `t01-iso-multigraph` (check the recording); the 2-switch connectivity claim in a remark is unproved (standard).

### t02 Subgraphs, walks and bipartite graphs (`content/theory/02-walks-connectivity-bipartite.md`)

**Math fixes (M):** checked against 2026-09-22 pp. 3–5.
1. `prop:distance-metric`: |dist(x,u) − dist(x,v)| ≤ 1 for an edge uv now restricted to x in the component of u (otherwise ∞ − ∞). REVIEW.
2. BFS section: added a correctness argument (computed values are true distances, BFS reaches exactly the component of x; queue order + induction), needed by the odd-cycle proof. REVIEW. Prose after the algorithm; W may move it into a remark/proof.

- `def:subgraph` — G_1 ⊆ G: V(G_1)⊆V(G), E(G_1)⊆E(G); induced G_1 ⊆_i G keeps all edges among its vertices — G[X], G−X, G−F, G+e, G−v, G−e in the prose.
- `def:submultigraph` — (V_1,E_1,ε_1) ⊆ (V,E,ε): V_1⊆V, E_1⊆E, ε_1 = ε restricted — endpoints in V_1 implicit.
- `def:clique` — clique = subgraph ≅ K_m; independent set X ⊆ V(G) with no edge inside — "clique" also in t01 `def:complete-graph` defines.
- `def:walk` — (v_0,e_0,…,e_{k−1},v_k), e_i joins v_i v_{i+1}; length k; closed if v_0=v_k — path/cycle in G = subgraph ≅ P_k / C_k (prose); "u–v path".
- `claim:shortest-walk-path` — a shortest walk between two vertices is a path — shortcut argument.
- `def:component` — components = equivalence classes of "joined by a walk"; connected = exactly one component.
- `def:distance` — dist_G(u,v) = min length of a u–v walk; ∞ across components — \mathrm{dist}_G.
- `prop:distance-metric` (extra) — dist is a metric (allowing ∞); edge uv ⇒ |dist(x,u)−dist(x,v)| ≤ 1 for x in u's component.
- `alg:bfs` — queue BFS computing dist, parent, BFS tree; layers L_i = {v : dist(x,v)=i} — anchors @init @loop @dequeue @scan @test @discover @enqueue.
- `def:bipartite` — V(G)=A∪B disjoint, A and B independent; (A,B) bipartition — lecture omits A∩B=∅ (equivalent).
- `prop:bipartite-subgraph-kmn` — G bipartite iff G isomorphic to a subgraph of some K_{m,n} — lecture writes G ⊆ K_{m,n}; m or n may be 0.
- `thm:bipartite-odd-cycle` — G bipartite iff G has no odd cycle — title "König" not in lecture (standard); proof via BFS layer parity + LCA, cycle length 2(i−j)+1.

Open questions:
- "clique" in both `def:complete-graph` (t01) and `def:clique` (t02) defines; drop it from t01 in W/F.
- König attribution kept (standard, not in lecture).

### t02 (W) Subgraphs, walks and bipartite graphs

**Math fixes (W):** none. The BFS correctness argument from M is now `::: remark {title="Why BFS computes distances"}` after the layer paragraph (math unchanged, REVIEW kept).

Entries as in M; statements only gained links (def:clique → isomorphism, complete graph; prop:bipartite-subgraph-kmn → isomorphic, subgraph; thm:bipartite-odd-cycle → cycle; alg:bfs → BFS tree [[def:forest-tree]]). Metadata: "clique" removed from t01 `def:complete-graph` defines; now only `def:clique`.

Added: intuitions for all entries (alg:bfs: O(n+m), links [[alg:edmonds-karp]], [[def:level-graph]]; def:bipartite: [[def:matching]], [[prop:matching-flow]]); pitfalls (G−v induced, G−e not; walk vs path/cycle; empty graph not connected, connected subgraph ≠ component; BFS mark on discovery, DFS tree paths not shortest; triangle-free ≠ bipartite, C_5); figure `t02-bipartite-c6`. Lint t01: 0, t02: 0.

Open questions: König attribution kept. t04 has 3 "clique" lint hits (lines 83, 350, 403) for W t04. Unproved standard facts added in intuition/pitfall: BFS is O(n+m).

### t03 Trees (`content/theory/03-trees.md`)

**Math fixes (M):** checked against 2026-09-29 pp. 1–8; no statement errors.
1. `lem:closed-walk-cycle`: "either … or" → inclusive or ("possibly both"). REVIEW.
2. `thm:regular-large-girth` proof: β_h applied to edges e_i ∈ E(H), not to H-edges f_i of F; made explicit why t ≥ ⌈k/2⌉. REVIEW.
3. `exr:t03-leaves-count` solution: gap filled (why the maximal walk ends at a leaf). REVIEW.
4. `t03-leaf-removal` caption: `\deg v = 1` → "v gets only one edge" (notation d_G, not deg).

- `def:forest-tree` — acyclic/forest: no cycle; tree: acyclic and connected — acyclic multigraph is simple (loop = 1-cycle, parallel edges = 2-cycle).
- `thm:two-leaves` — acyclic graph on ≥ 2 vertices has ≥ 2 vertices of degree ≤ 1 — longest path; "leaf" (degree 1) defined only in prose.
- `cor:tree-leaf` — tree on ≥ 2 vertices has a leaf (in fact two).
- `cor:acyclic-subgraph-small-degree` — G acyclic ⇔ every non-empty subgraph has a vertex of degree ≤ 1 — lecture omits "non-empty".
- `lem:closed-walk-cycle` — closed walk contains a cycle or uses every edge an even number of times (inclusive) — induction, split at repeated vertex.
- `cor:tree-unique-path` — in a tree any two vertices are joined by exactly one path — P_1·P_2^{-1} notation.
- `lem:leaf-removal` (extra) — T tree, v leaf ⇒ T−v tree; adding a new leaf keeps a tree.
- `thm:tree-characterisations` (extra) — tree ⇔ unique paths ⇔ minimally connected ⇔ maximally acyclic ⇔ connected, n−1 edges ⇔ acyclic, n−1 edges — n ≥ 1; G+e, e ∈ binom(V,2)∖E.
- `cor:forest-edges` (extra) — forest with n vertices, c components has n−c edges.
- `def:spanning-tree` — tree T ⊆ G with V(T) = V(G).
- `prop:spanning-tree-exists` (extra) — G has a spanning tree iff connected — delete cycle edges; BFS tree also works.
- `thm:cayley` — K_n has n^{n−2} spanning trees — Pitman double counting C(n)·n·(n−1)! = n^{n−1}(n−1)!.
- `def:girth` — girth = length of a shortest cycle (∞ if acyclic, not in lecture); d-regular: all degrees d.
- `thm:regular-large-girth` — ∀ d ≥ 0, k ≥ 1 ∃ d-regular graph with girth ≥ k — lexicographic induction on (k,d); ⌈k/2⌉; "good for (k,d)", "H-edges", bijection β_h.

Open questions:
- Lecture base case "OK for d, k ∈ {3,4}" read as k ∈ {3,4} for every d (K_{d+1}, K_{d,d}); no SOURCE UNCLEAR added.
- "Pitman" attribution and "cage problem" remark not in lecture (standard).
- W: "leaf" is defined only in prose, not in any `defines` (not searchable); `t03-girth-construction` caption says every vertex gets an H-edge but the drawing shows 3 (illustrative).

### t03 (W) Trees

**Math fixes (W):** none (statements gained links only; M REVIEW comments kept).

New entry `def:leaf` — a vertex of degree 1 is a leaf — `defines="leaf"`; was prose after `thm:two-leaves`, same place; added to topics.yaml (trees, after thm:two-leaves); no `source` yet. Definition numbers in t03 shift (def:spanning-tree 3.3, def:girth 3.4); ids unchanged. `t03-girth-construction` caption now says only some H-edges are drawn. Otherwise entries as in M.

Added: intuitions for all 15 entries; figure `t03-tree-plus-edge` (T+e has exactly one cycle; deleting any cycle edge gives a tree); pitfalls (subgraph quantifier in cor:acyclic-subgraph-small-degree; inclusive or in lem:closed-walk-cycle; n−1 edges alone insufficient; spanning tree not induced/unique; Cayley counts labelled trees of K_n; girth ≥ 3 in simple graphs); cross-course links [[thm:cycle-property]], [[thm:cut-property]], [[def:mst]], [[alg:kruskal]], [[alg:jarnik]]. Lint t01–t03: 0.

Open questions: `def:leaf` source page (≈ 2026-09-29 p2–3). Pitman / cage-problem attribution (from M). W a01: check the informal MST exchange sketch in the `thm:tree-characterisations` intuition matches a01's proofs.

### t04 Chordal and Hamiltonian graphs (`content/theory/04-chordal-hamiltonian.md`)

**Math fixes (M):** checked against 2026-10-06 pp. 1–6 (whole PDF); no statement errors.
1. `def:chordal`: lecture says "every cycle has a chord"; lesson's "of length ≥ 4" kept, REVIEW comment.
2. `lem:two-simplicial` proof: existence of the minimal cut now from u, v non-adjacent (remark after def:minimal-cut), not from lem:minimal-cut-clique. REVIEW.
3. Bondy–Chvátal remark: "Dirac/Ore are the cases where the closure is complete" weakened to "special cases"; complete closure can occur without them. REVIEW.
4. `exr:t04-ore-path`: d(u) → d_G(u). REVIEW.
5. `exr:t04-chordal-tree-like` solution: gap filled (why C ⊄ G_1, G_2 gives a ∈ V(G_1)∖K, b ∈ V(G_2)∖K). REVIEW.

- `def:chordal` — chord joins non-consecutive vertices of C; chordal: every cycle of length ≥ 4 has a chord — equivalently no induced C_k, k ≥ 4 (prose).
- `obs:chordal-induced` (extra) — induced subgraphs of chordal graphs are chordal — G[X].
- `ex:interval-graphs` — intersection graphs of finitely many closed real intervals — "interval graph" not in any defines.
- `prop:interval-chordal` (extra) — every interval graph is chordal — interval with smallest right endpoint b_1.
- `def:simplicial` — x simplicial if N_G(x) is a clique.
- `thm:chordal-simplicial` — every chordal graph with ≥ 1 vertex has a simplicial vertex — lecture omits "≥ 1 vertex".
- `def:minimal-cut` — X ⊆ V∖{u,v} separating u, v in G−X, inclusion-minimal — defines vertex cut, separator, minimal cut; exists iff uv ∉ E.
- `lem:minimal-cut-clique` — in a chordal graph every minimal u–v cut is a clique — C_u, C_v components; shortest Q_u, Q_v.
- `lem:two-simplicial` — chordal G is complete or has two non-adjacent simplicial vertices — induction on G[A∪X], G−A.
- `def:simplicial-decomposition` — ordering v_1..v_n with earlier neighbours of each v_i a clique — aka perfect elimination ordering (reversed).
- `thm:chordal-decomposition` — G chordal ⇔ G has a simplicial decomposition — ⇐ uses rightmost vertex of a cycle.
- `def:hamiltonian` — Hamiltonian cycle/path spans V(G); graph Hamiltonian if it has a Hamiltonian cycle.
- `thm:dirac-ore` — n ≥ 3 and (δ(G) ≥ n/2, or d_G(u)+d_G(v) ≥ n for all non-adjacent u,v) ⇒ Hamiltonian — δ(G) defined in prose only.
- `ex:dirac-tight` — K_{k,k+1}: δ = (n−1)/2, not Hamiltonian.
- `def:hamiltonian-completion` — add uv for non-adjacent u,v with d(u)+d(v) ≥ n in the current graph, repeatedly — defines Hamiltonian completion, closure.
- `lem:hamiltonian-completion` — H Hamiltonian completion of G ⇒ (H Hamiltonian ⇔ G Hamiltonian) — black/red pigeonhole on w_1..w_n; source pp. 6, 5.

Open questions:
- "closure" is in defines of def:hamiltonian-completion but explained only in the remark; order-independence of the closure is unproved. W: move or add a short argument.
- W: "interval graph" and "minimum degree δ(G)" defined only in prose; add to some `defines` so search finds them.
- `t04-hamiltonian-switch` has d(x)+d(y) = 6 < n = 7; illustrates only the switch, caption makes no degree claim.

### t04 (W) Chordal and Hamiltonian graphs

**Math fixes (W):** none to checked statements/proofs. Additions (REVIEW-marked, not in lecture): `def:hamiltonian-completion` now defines the **closure** (completion admitting no further step); the Bondy–Chvátal remark proves order-independence of the closure (induction on the additions of one maximal sequence, symmetry).

Entries as in M, except:
- New `def:minimum-degree` — δ(G) = min_v d_G(v), G non-empty — `defines="minimum degree, δ(G)"`, source p5 (where δ is used; separate definition in lecture not checked); before `thm:dirac-ore`; topics.yaml: hamiltonian, after def:hamiltonian. Later t04 definition numbers shift; ids unchanged.
- "interval graph": no new entry; `prop:interval-chordal` links [[ex:interval-graphs|interval graph]].
- Statements gained links only (def:chordal, obs:chordal-induced, def:simplicial, def:minimal-cut, thm:chordal-decomposition, def:hamiltonian, lem:hamiltonian-completion).

Added: intuitions for all 17 entries; pitfalls (chordal ≠ "no C_4"; minimal vs minimum cut; v_n simplicial, reverse order not a decomposition; Hamiltonian vs Euler; Dirac/Ore sufficient not necessary, Ore only non-adjacent pairs; completions use current degrees); figure `t04-minimal-not-minimum`; links to [[def:mst]] (tour ≥ MST) and [[alg:bfs]] (lexicographic BFS). Lint t01–t04: 0.

Open questions: whether the lecture defines δ(G) separately (source p5 cited). W t05: lint hits for "minimum degree" (line ~383) and "degree" (line ~376).

## Report
