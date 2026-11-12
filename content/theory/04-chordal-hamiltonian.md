---
title: Chordal and Hamiltonian graphs
course: theory
lecture: 4
slug: t04
summary: Chordal graphs, simplicial vertices, minimal separators, simplicial decompositions; Hamiltonian cycles, Dirac's and Ore's theorems via Hamiltonian completions.
prerequisites: [theory/03-trees]
sources:
  - resources/graph-theory/2026-10-06-13_41_19-join.pdf
status: draft
---

This lesson studies two classes of graphs defined by their cycles. **Chordal graphs** are graphs in
which every long cycle has a "shortcut". They have a beautiful recursive structure: they can be
taken apart one simplicial vertex at a time, which makes many hard problems easy on them.
**Hamiltonian graphs** contain a cycle through all vertices. Deciding Hamiltonicity is NP-hard in
general, so we look for simple sufficient conditions, and prove the classical theorems of Dirac and
Ore.

## Summary

- $G$ is chordal if every [[def:cycle-graph|cycle]] of [[def:path-graph|length]] $\ge 4$ has a chord ([[def:chordal]]); interval graphs are chordal
  ([[prop:interval-chordal]]).
- In a chordal graph, [[def:minimal-cut|minimal vertex cuts]] are [[def:clique|cliques]] ([[lem:minimal-cut-clique]]); hence a chordal graph is complete
  or has two non-adjacent simplicial vertices ([[lem:two-simplicial]]).
- $G$ is chordal iff it has a [[def:simplicial-decomposition|simplicial decomposition]] ([[thm:chordal-decomposition]]).
- Dirac: $\delta \ge n/2$ ([[def:minimum-degree]]), Ore: $d(u) + d(v) \ge n$ for non-adjacent $u, v$; each implies Hamiltonian for $n \ge 3$
  ([[thm:dirac-ore]]). $K_{k,k+1}$ shows tightness.

## Exercises

```graph id=t04-ex-simplicial widget=exercise
task: select-vertices
prompt: Select all simplicial vertices of this chordal graph.
check: simplicial-vertices
solution: The simplicial vertices are $1$, $5$ and $6$. Vertex $1$ has neighbours $\set{2,3}$, vertex $5$ has $\set{3,4}$, vertex $6$ has $\set{4}$; each set is a clique. Vertices $2, 3, 4$ are not simplicial.
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 3 -- 5; 4 -- 5; 4 -- 6
```

```graph id=t04-ex-hamiltonian-cube widget=exercise
task: select-edges
prompt: Find a Hamiltonian cycle in the cube $Q_3$.
check: is-hamiltonian-cycle
hint: Go around the "top" square, but leave out one edge and use the "bottom" square instead.
solution: For example $000, 001, 011, 010, 110, 111, 101, 100, 000$ (a Gray code).
use: Q(3)
```

:::: exercise {#exr:t04-kmn-hamiltonian title="Hamiltonian complete bipartite graphs" difficulty=1}
For which $m, n \ge 1$ is $K_{m,n}$ Hamiltonian?

::: solution
Exactly when $m = n \ge 2$. A [[def:cycle-graph|cycle]] alternates between the sides, so a [[def:hamiltonian|Hamiltonian cycle]] requires $m = n$, and a cycle
has at least $3$ vertices, hence at least $4$ in a [[def:bipartite|bipartite]] graph, so $m = n \ge 2$. Conversely, for $m = n \ge 2$ the cycle
$1, 1', 2, 2', \dots, n, n', 1$ is Hamiltonian.
:::
::::

:::: exercise {#exr:t04-ore-path title="Hamiltonian paths" difficulty=2}
Let $G$ be a graph on $n \ge 2$ vertices such that $d_G(u) + d_G(v) \ge n - 1$ for all non-adjacent $u \ne v$. Show that $G$ has a
[[def:hamiltonian|Hamiltonian path]].
<!-- REVIEW: d(u) → d_G(u) (course notation). -->

::: hint
Add a new vertex adjacent to all vertices of $G$, and apply Ore's theorem.
:::

::: solution
Let $G'$ be $G$ plus a new vertex $z$ adjacent to all of $V(G)$; it has $n + 1 \ge 3$ vertices. A non-adjacent pair of
$G'$ is a non-adjacent pair $u, v$ of $G$ (as $z$ is adjacent to everything), and $d_{G'}(u) + d_{G'}(v) = d_G(u) + d_G(v) + 2
\ge n + 1$. By Ore's theorem $G'$ has a Hamiltonian cycle; deleting $z$ from it leaves a Hamiltonian path of $G$.
:::
::::

:::: exercise {#exr:t04-chordal-tree-like title="Cut vertices and chordality" difficulty=2}
Let $G_1, G_2$ be [[def:chordal|chordal graphs]] that share exactly one vertex (and no edges). Show that $G_1 \cup G_2$ is chordal. More
generally: gluing two chordal graphs along a common [[def:clique|clique]] gives a chordal graph.

::: solution
Let $G = G_1 \cup G_2$ and $K = V(G_1) \cap V(G_2)$, a clique. There are no edges between $V(G_1) \setminus K$ and
$V(G_2) \setminus K$. Let $C$ be a cycle of [[def:path-graph|length]] $\ge 4$ in $G$. If $C \subseteq G_1$ or $C \subseteq G_2$, it has a [[def:chordal|chord]] because
$G_1, G_2$ are chordal. Otherwise $C$ contains a vertex $a \in V(G_1) \setminus K$ and a vertex $b \in V(G_2) \setminus K$
(if $C \not\subseteq G_2$, then $C$ has a vertex outside $V(G_2)$, or an edge of $G_1$ not in $G_2$, which has an endpoint
outside $K$ because $K$ is a clique in $G_2$; symmetrically for $b$). The vertices $a$ and $b$ split $C$ into two $a$–$b$ paths. Walking along either path from $a$ to $b$ we must leave
$V(G_1) \setminus K$, and the only way to do so is to step into $K$; so each path contains an inner vertex in $K$. Pick
$k_1 \in K$ on the first path and $k_2 \in K$ on the second; $k_1 \ne k_2$. Going around $C$ we meet $a, k_1, b, k_2$ in this
order, so each of the two $k_1$–$k_2$ paths of $C$ has an inner vertex ($b$, respectively $a$). Hence $k_1, k_2$ are not
consecutive on $C$, and the edge $k_1k_2$ (present, as $K$ is a clique) is a chord. (If $\abs{K} = 1$, this shows that
no cycle can leave $G_1$ or $G_2$ at all.)
<!-- REVIEW: filled the gap why a and b exist (C ⊄ G_1 could a priori be due to an edge only). -->
:::
::::

:::: quiz {#q:t04-tree-chordal}
Is every [[def:forest-tree|tree]] chordal?

- [x] Yes
- [ ] No

::: explanation
A tree has no cycles at all, so the condition holds vacuously.
:::
::::

:::: quiz {#q:t04-cycle-chordal}
For which $n \ge 3$ is $C_n$ chordal?

- [x] Only $n = 3$
- [ ] All $n$
- [ ] Even $n$

::: explanation
$C_n$ itself is a cycle without chords; for $n \ge 4$ this violates the definition.
:::
::::

:::: quiz {#q:t04-dirac}
A graph on 10 vertices has [[def:minimum-degree|minimum degree]] 5. Must it be Hamiltonian?

- [x] Yes
- [ ] No
- [ ] Only if it is [[def:component|connected]]

::: explanation
$\delta = 5 \ge 10/2$, so Dirac's theorem applies ([[thm:dirac-ore]]). (Connectivity follows automatically.)
:::
::::

:::: quiz {#q:t04-petersen-ore}
The Petersen graph has 10 vertices and is 3-regular. Does Ore's theorem show that it is Hamiltonian?

- [ ] Yes
- [x] No

::: explanation
Non-adjacent vertices have [[def:degree|degree]] sum $6 < 10$, so the condition fails. (In fact the Petersen graph is not Hamiltonian;
the theorems give only sufficient conditions.)
:::
::::
