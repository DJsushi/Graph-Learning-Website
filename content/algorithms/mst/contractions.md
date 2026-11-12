---
title: "Contractions"
course: algorithms
chapter: mst
order: 11
lectures: [a01]
stage: split
status: draft
---

Borůvka's algorithm is naturally expressed with **contractions**.

::: definition {#def:edge-contraction title="Edge and subgraph contraction" defines="contraction, edge contraction" source="algorithms/01 p21"}
Let $e = uv$ be an edge of $G$. The graph $G_{uv} = G_e$ obtained from $G$ by **contracting** $e$ is defined by
$$V(G_{uv}) = (V(G) \setminus \set{u, v}) \cup \set{w_{uv}}, \quad w_{uv} \notin V(G),$$
$$E(G_{uv}) = \set{ab \in E(G) \mid \set{a, b} \cap \set{u, v} = \emptyset} \ \cup\ \set{w_{uv}x \mid ux \in E(G) \lor vx \in E(G)},$$
with the edge weights inherited from $G$. **Contracting a connected subgraph** $H$ of $G$ means replacing the whole $H$ by a single new vertex
$v_H$; it can be implemented by contracting the edges of (a spanning tree of) $H$ one by one.
:::

::: intuition
Contracting shrinks an edge to a point: its two ends merge, and the new vertex inherits all their other edges. Each contraction removes one
vertex, so contracting a connected subgraph $H$ removes $\abs{V(H)} - 1$ vertices. Example: in [[fig:a01-contraction]], contracting $uv$ gives
a vertex $w_{uv}$ adjacent to $x$, $y$ and $z$. Non-example: merging two **non-adjacent** vertices is not a contraction. Merging the two ends of
the path $P_3$ turns it into a triangle, whereas contracting an edge of a tree always leaves a tree.
:::

When contracting, parallel edges and loops can appear (an edge from $x$ to both $u$ and $v$ gives two edges $w_{uv}x$). There are two solutions:
keep all multigraph edges (then the MST algorithm must be aware of this), or remove loops and replace parallel edges by the lightest one. For
MSTs the second is safe: a loop is never in a spanning tree, and of two parallel edges the heavier one is the heaviest edge of a 2-cycle (cycle
property). In the formula above, the weight of $w_{uv}x$ is the smaller of $w(ux)$ and $w(vx)$.

```graph id=a01-contraction widget=stepper
caption: Contracting the edge $uv$: $u$ and $v$ merge into $w_{uv}$; the two edges to $x$ become parallel, and the lighter one is kept.
intent: Illustrate edge contraction and removal of parallel edges.
layout: fixed
u @(0, 0); v @(1, 0); x @(0.5, 1); y @(-0.8, 0.6); z @(1.8, 0.6)
u -- v [w=1 class=highlight]; u -- x [id=ux w=4]; v -- x [w=3]; u -- y [w=2]; v -- z [w=5]
step: Contract the edge $uv$.
step: $u$ and $v$ become one vertex $w_{uv}$; $x$ now has two parallel edges to it.
merge u v -> w [label="$w_{uv}$" class=color1]
step: Keep only the lighter parallel edge (weight 3).
remove @ux
```

::: lemma {#lem:contraction-mst title="Contractions and MST" source="algorithms/01 p20"}
Let $H$ be a connected subgraph of the MST $M$ of $G$, and let $G'$ be obtained from $G$ by contracting $H$ to a single vertex $v_H$ (removing loops,
keeping the lightest of parallel edges). Then the MST $M'$ of $G'$, with $v_H$ replaced by $H$ (i.e. each edge of $M'$ replaced by the edge of $G$ it
came from, plus the edges of $H$), is the MST of $G$.
:::

The lecture states this without proof.

::: intuition
Once we know that the edges of $H$ belong to $M$, the only remaining question is how to connect $H$ cheaply to the rest, and for that the
inner structure of $H$ is irrelevant: $H$ behaves like a single vertex. Example: in the running example $cf \in M$; contract it to $v_{cf}$,
which keeps the lighter of $ce$ ($7$) and $fe$ ($5$) as its edge to $e$. The MST of the contracted graph has weight $29 - 1 = 28$, and adding
$cf$ back gives $M$.
:::

::: pitfall
$H$ must be part of the MST. Contracting an edge that is not in $M$ forces it into the result: contracting $bc$ ($11$) in the running example and
adding it back to the MST of the contracted graph yields a spanning tree containing $bc$; it is not $M$, so it is heavier than $M$.
:::

::: algorithm {#alg:boruvka-contract title="Borůvka's algorithm with contractions" source="algorithms/01 p22"}
```pseudo
while G has more than one vertex do               // @phase
    foreach vertex v ∈ V(G) do                    // @loop
        e_v ← the lightest edge incident to v     // @select
        add e_v to the MST                        // @add
    contract all edges e_v                        // @contract
    eliminate parallel edges and loops            // @clean
```
:::

::: intuition
After contracting, every component of the blue forest is a single vertex, so "the lightest edge leaving a component" becomes simply "the
lightest edge at a vertex". On the running example, phase 1 leaves three vertices $\set{a, b}$, $\set{c, f, h}$, $\set{d, e, g}$ joined by the
lightest edges between the groups: $ac$ ($8$), $bd$ ($9$) and $ef$ ($5$). Phase 2 picks $ac$ and $ef$, and one vertex remains. The edges $e_v$
belong to the MST by the cut property, and the contracted graph still has the right MST by [[lem:contraction-mst]].
:::

Let $n_i$ and $m_i$ be the numbers of vertices and edges at the beginning of phase $i$. In phase $i$ we need time $\O(m_i)$ to find all edges $e_v$, and
again $\O(m_i)$ to relabel the endpoints of contracted edges and remove multiplicities (this is not straightforward: it can be done by two passes of
bucket sort on the pairs of new endpoints). Since $n_{i+1} \le n_i / 2$ and $m_i \le \min(m, n_i^2)$, a more detailed analysis gives
$\O\bigl(\min(m \log n, n^2)\bigr)$: the sum $\sum_i \min(m, n^2/4^{i})$ is $\O(m \log n)$, and also $\O(n^2)$ as a geometric series.
