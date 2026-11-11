---
title: "Bipartite matchings as flows"
course: algorithms
chapter: flows
order: 10
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:matching title="Matching" defines="matching, maximum matching" source="algorithms/02 p56"}
A **matching** $M$ of a graph $G$ is a subset of edges such that no two edges in $M$ share a vertex. A **maximum matching** is a matching of maximum size.
:::

::: intuition
A matching pairs up vertices, each vertex with at most one partner: workers with jobs, students with projects. Example: in the path $a\,b\,c\,d$, the set
$\set{ab, cd}$ is a maximum matching, of size $2$. Non-example: $\set{ab, bc}$, since both edges contain $b$. Matchings are most often studied in
[[def:bipartite|bipartite graphs]], where the two sides are the two kinds of objects being paired.
:::

::: pitfall
A matching to which no edge can be added (**maximal**) need not be **maximum**. In the path $a\,b\,c\,d$, the matching $\set{bc}$ is maximal, but $\set{ab, cd}$ is
larger. Greedy choices give maximal matchings; finding a maximum one needs augmenting paths, e.g. via flows.
:::

```graph id=a02-bipartite-matching-flow widget=figure
caption: Bipartite matching as a flow problem: orient all edges from left to right, add a source joined to the left side and a sink joined to the right side, all capacities 1.
intent: Transcription of the lecture construction.
type: directed
layout: fixed
s [class=source] @(0, 0); l1 @(1.5, 1.5); l2 @(1.5, 0.5); l3 @(1.5, -0.5); l4 @(1.5, -1.5); r1 @(3, 1.5); r2 @(3, 0.5); r3 @(3, -0.5); r4 @(3, -1.5); t [class=sink] @(4.5, 0)
s -> l1 [c=1]; s -> l2 [c=1]; s -> l3 [c=1]; s -> l4 [c=1]
l1 -> r1 [c=1]; l1 -> r2 [c=1]; l2 -> r1 [c=1]; l3 -> r2 [c=1]; l3 -> r3 [c=1]; l4 -> r3 [c=1]; l4 -> r4 [c=1]
r1 -> t [c=1]; r2 -> t [c=1]; r3 -> t [c=1]; r4 -> t [c=1]
```

::: proposition {#prop:matching-flow title="Bipartite matchings are flows" extra=true}
Let $G$ be a [[def:bipartite|bipartite graph]] with bipartition $(A, B)$, and let $N$ be the network with vertices $V(G) \cup \set{s, t}$, edges $(s, a)$ for $a \in A$, $(a, b)$ for every edge $ab$ of $G$
($a \in A$, $b \in B$), and $(b, t)$ for $b \in B$, all of [[def:flow-network|capacity]] $1$. Then the maximum size of a matching in $G$ equals the maximum [[def:flow|flow]] value in $N$.
:::

::: intuition
The capacity $1$ on $(s, a)$ lets each $a \in A$ be used once, the capacity $1$ on $(b, t)$ lets each $b \in B$ be used once, and the direction from $A$ to $B$ makes each unit
choose one edge $ab$. So integral flows and matchings are the same thing. Example: in [[fig:a02-bipartite-matching-flow]], the matching $l_1 r_1$, $l_3 r_2$, $l_4 r_3$
gives a flow of value $3$; the maximum is $4$ (e.g. $l_1 r_2$, $l_2 r_1$, $l_3 r_3$, $l_4 r_4$). Since every vertex of $A$ and $B$ carries at most one unit, the flow paths
are also internally disjoint, so this is the vertex version of Menger ([[thm:menger-directed]] A) in disguise.
:::

::: proof
A matching $M$ gives a flow of value $\abs{M}$: send one unit along $s \to a \to b \to t$ for each $ab \in M$; since the edges of $M$ are disjoint, every vertex carries at most one unit,
so the capacities are respected. Conversely, by the integrality theorem ([[cor:integrality]]) there is a maximum flow with all values in $\set{0, 1}$. Every $a \in A$ receives at most one
unit (from $s$), so at most one edge $(a, b)$ carries flow; similarly every $b \in B$ sends at most one unit to $t$. So the edges $ab$ with $f(a, b) = 1$ form a matching, of size equal to
the flow value.
:::
