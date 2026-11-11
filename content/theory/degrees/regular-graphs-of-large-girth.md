---
title: "Regular graphs of large girth"
course: theory
chapter: degrees
order: 7
lectures: [t03]
stage: split
status: draft
---

Can a graph have **many** edges at every vertex and still no short cycles? Locally, around every vertex,
such a graph looks like a tree branching $d$ ways, for $k/2$ levels. Surprisingly, this is always possible:

::: theorem {#thm:regular-large-girth title="Regular graphs of large girth" source="theory/2026-09-29 p8"}
For all $d \ge 0$ and $k \ge 1$ there exists a $d$-regular graph of girth at least $k$.
:::

::: intuition
Many edges at every vertex and no short cycles pull in opposite directions, but they can be reconciled
by making the graph huge. The proof raises the degree by one at a time: take many copies of a graph
of degree $d - 1$ and add one edge at every vertex, joining the copies along the pattern of a graph $H$
whose own girth is at least $k/2$. A short cycle would have to travel through at least $k/2$ copies,
and it spends at least one edge inside each, so it is not short after all. Example: for $d = 2$ a long enough
cycle does the job; for $d = 3$, $k = 5$ the Petersen graph does ([[fig:t03-petersen]]).
:::

:::: proof
Call a graph **good for $(k, d)$** if it is $d$-regular with girth at least $k$. We proceed by induction,
primarily on $k$ and secondarily on $d$.

**(a) Base cases.**

- $d = 0$: $K_1$; $d = 1$: $K_2$ (both acyclic, girth $\infty$). $d = 2$: the cycle $C_{\max(k,3)}$.
- $k \le 3$: $K_{d+1}$ (every simple graph has girth at least $3$). $k = 4$: $K_{d,d}$, which is
  $d$-regular and [[def:bipartite|bipartite]], hence has no triangle ([[thm:bipartite-odd-cycle]]).

**(b) Induction step.** Let $k \ge 5$ and $d \ge 3$, and assume we have graphs

- $G$ good for $(k, d-1)$ (by induction on $d$), with $N := \abs{V(G)}$, and
- $H$ good for $(\lceil k/2 \rceil, N)$ (by induction on $k$, since $\lceil k/2 \rceil < k$).

Then the following graph $F$ is good for $(k, d)$. Take one copy $G_h$ of $G$ for every vertex $h \in V(H)$.
Every vertex $h$ of $H$ has exactly $N$ incident edges, and $G_h$ has exactly $N$ vertices; fix a bijection
$\beta_h$ from the edges of $H$ at $h$ to the vertices of $G_h$. For every edge $hh' \in E(H)$ add to $F$ an
edge joining $\beta_h(hh') \in V(G_h)$ and $\beta_{h'}(hh') \in V(G_{h'})$. Call these the **$H$-edges** of $F$.

*$F$ is a simple $d$-regular graph.* Every vertex of every copy $G_h$ had degree $d - 1$ and receives exactly
one $H$-edge (as $\beta_h$ is a bijection), so it has degree $d$. $H$-edges join different copies, and two
$H$-edges come from different edges of $H$, so they cannot join the same pair of vertices.

*$F$ has girth at least $k$.* Let $C$ be a cycle in $F$. If $C$ uses no $H$-edge, it lies inside one copy of $G$
and has length at least $k$. Otherwise let $f_1, \dots, f_t$ be the $H$-edges of $C$ in cyclic order. Between
$f_i$ and $f_{i+1}$ the cycle stays inside one copy $G_h$, so the copies visited, $h_1, h_2, \dots, h_t, h_1$,
form a [[def:walk|closed walk]] in $H$ that uses the edges of $H$ corresponding to $f_1, \dots, f_t$, each exactly once.
(A single $H$-edge cannot close a walk, so $t \ge 2$.) By [[lem:closed-walk-cycle]], since no edge is traversed
an even number of times, this closed walk contains a cycle of $H$, which has length at least
$\lceil k/2 \rceil$; its edges are among the $t$ edges of the walk, so $t \ge \lceil k/2 \rceil$. Moreover, let
$e_i \in E(H)$ be the edge corresponding to $f_i$. If $C$ enters $G_h$ through $f_i$ and leaves through
$f_{i+1}$, it enters at the vertex $\beta_h(e_i)$ and leaves at $\beta_h(e_{i+1})$; these are different vertices
because $e_i \ne e_{i+1}$ are different edges of $H$ at $h$ and $\beta_h$ is a bijection. So between any two
consecutive $H$-edges, $C$ uses at least one edge of a copy of $G$. Therefore
<!-- REVIEW: β_h is defined on edges of H, not on H-edges of F: introduced e_i and wrote β_h(e_i); made explicit why t ≥ ⌈k/2⌉ (the cycle's edges are among the t walk edges). -->

$$\abs{E(C)} \ \ge\ 2t\ \ge\ 2\lceil k/2 \rceil\ \ge\ k.$$
::::

```graph id=t03-girth-construction widget=figure
caption: The construction: one copy of $G$ for each vertex of $H$; each edge of $H$ becomes one edge between the corresponding copies (only some of these $H$-edges are drawn; in $F$ every vertex of every copy gets exactly one).
intent: Schematic version of the lecture drawing. Groups are the copies of G (here G = C_4 is good for (4, 2)); H-edges are highlighted. Purely illustrative, not an actual instance of the theorem's parameters.
layout: fixed
a1 @(0, 1); a2 @(0.6, 1); a3 @(0.6, 0.4); a4 @(0, 0.4)
b1 @(3, 1); b2 @(3.6, 1); b3 @(3.6, 0.4); b4 @(3, 0.4)
c1 @(1.5, -1); c2 @(2.1, -1); c3 @(2.1, -1.6); c4 @(1.5, -1.6)
a1 -- a2 -- a3 -- a4 -- a1; b1 -- b2 -- b3 -- b4 -- b1; c1 -- c2 -- c3 -- c4 -- c1
a2 -- b1 [class=highlight]; a3 -- c1 [class=highlight]; b4 -- c2 [class=highlight]
group G1: a1 a2 a3 a4 [label="$G_{h_1}$"]
group G2: b1 b2 b3 b4 [label="$G_{h_2}$"]
group G3: c1 c2 c3 c4 [label="$G_{h_3}$"]
```

::: remark
The graphs produced by this construction are huge. How small a $d$-regular graph of girth $k$ can be is a
famous open problem (the "cage problem"); the Petersen graph is the smallest $3$-regular graph of girth $5$.
:::
