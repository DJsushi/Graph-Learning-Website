---
title: "Gomory–Hu trees"
course: algorithms
chapter: gomory-hu
order: 3
lectures: [a03]
stage: split
status: draft
---

How long does it take to find the minimum $s$–$t$ cut for **all** pairs $s, t \in V$? One pair costs one maximum [[def:flow|flow]], time $\tau$, so the obvious
method needs $\O(n^2 \cdot \tau)$. It can be done with $n - 1$ maximum-flow computations.

::: definition {#def:gomory-hu-tree title="Gomory–Hu tree" defines="Gomory–Hu tree, equivalent flow graph" source="algorithms/03 p4"}
Let $G = (V, E)$ be an [[def:undirected-cut|undirected network]] with capacities $c$. A **Gomory–Hu tree** for $G$ is a tree $T = (V, F)$ on the same
vertex set with capacities $w : F \to \R^+$ such that for all $s \ne t \in V$:

1. $f_G(s, t) = f_T(s, t)$ ($T$ is an **equivalent flow graph**), and
2. a minimum $s$–$t$ cut in $T$ is also a minimum $s$–$t$ cut in $G$ (the **cut property**): if $\delta_T(U)$ is a minimum $s$–$t$ cut of $T$,
   then $\delta_G(U)$ is a minimum $s$–$t$ cut of $G$.

Here $f_T$ is computed with the capacities $w$.
:::

::: intuition
The tree stores all $\binom{n}{2}$ minimum cut values of $G$ in only $n - 1$ numbers, and each tree edge also tells you **where** a minimum cut is.
$T$ need not be a [[def:subgraph|subgraph]] of $G$: its edges are pairs with a known minimum cut, not edges of the network.
Example: the tree $T$ of [[fig:a03-network]]; $f_G(b, f) = 17 = f_T(b, f)$, and removing the edge $bf$ from $T$ leaves the component $\set{a, b}$,
whose cut $\delta_G(\set{a, b})$ has [[def:flow-network|capacity]] $17$. Non-example: a maximum spanning tree of $G$ is no Gomory–Hu tree in general; here it contains
$ab$ of capacity $10$, but $f_G(a, b) = 18$.
:::

::: observation {#obs:gomory-hu-edge title="Tree edges are minimum cuts" source="algorithms/03 p4"}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] for $G$ and $e = st$ an edge of $T$. If $U$ is the vertex set of either of the two components of
$T - e$, then $\delta_G(U)$ is a minimum $s$–$t$ cut of $G$, of capacity $w(e) = f_G(s, t)$.
:::

::: proof
The only $s$–$t$ path in the tree $T$ is the edge $e$ itself, and $s$, $t$ lie in different components of $T - e$. So every $s$–$t$ cut of $T$
contains $e$, while $\delta_T(U) = \set{e}$. Hence $\delta_T(U)$ is a minimum $s$–$t$ cut of $T$ and $f_T(s, t) = w(e)$. By the cut property,
$\delta_G(U)$ is a minimum $s$–$t$ cut of $G$, and its capacity is $f_G(s, t) = f_T(s, t) = w(e)$ by flow equivalence.
:::

::: intuition
Cutting one tree edge splits the vertices into two groups, and that split is a cheapest way to separate the two ends of the edge in $G$. Example: in
[[fig:a03-network]], removing $fe$ from $T$ leaves $\set{a, b, f}$ and $\set{c, d, e}$, and $\delta_G(\set{c, d, e}) = \set{bc, be, cf, fe, fd}$ has
capacity $4 + 2 + 2 + 3 + 2 = 13 = f_G(f, e)$. Non-example: for the non-adjacent pair $a, e$ of $T$, the component of $T - ab$ containing $a$
gives $\delta_G(\set{a})$ of capacity $18$, which is not a minimum $a$–$e$ cut ($f_G(a, e) = 13$).
:::

::: proposition {#prop:gomory-hu-path title="Minimum cuts from the tree" source="algorithms/03 p6"}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] for $G$. Then for all $s \ne t \in V(G)$, $f_G(s, t)$ is the minimum of $w(e)$ over the edges
$e$ of the unique $s$–$t$ path in $T$.
:::

::: proof
By flow equivalence it suffices to show this for $f_T(s, t)$. Let $P$ be the $s$–$t$ path in $T$. Every $s$–$t$ cut $\delta_T(U)$ contains an edge
of $P$, because $P$ starts on one side of $U$ and ends on the other; so $c(\delta_T(U)) \ge \min_{e \in P} w(e)$. Conversely, let $e \in P$ have
minimum capacity $w(e)$. $T - e$ has two components, and $s$, $t$ lie in different ones ($P$ is their only connecting path in $T$, and it uses $e$). For the
component $U$ of $s$, $\delta_T(U) = \set{e}$ is an $s$–$t$ cut of capacity $\min_{e \in P} w(e)$.
:::

::: intuition
The minimum cut between two vertices is the **bottleneck** of their tree path: a chain is as strong as its weakest link. Example: in
[[fig:a03-network]], $f_G(a, c) = \min(18, 17, 13, 15) = 13$ and $f_G(d, c) = \min(14, 15) = 14$. A consequence: among the $\binom{n}{2}$ values
$f_G(s, t)$ there are at most $n - 1$ different ones ([[exr:a03-distinct-values]]).
:::

Two questions remain: does a Gomory–Hu tree always exist, and can it be computed efficiently? The answer to both is **yes**.
