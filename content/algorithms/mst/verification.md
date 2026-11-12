---
title: "Verifying a minimum spanning tree"
course: algorithms
chapter: mst
order: 16
lectures: [a01]
stage: split
status: draft
---

The $T$-heavy and $T$-light edges can be computed efficiently:

::: theorem {#thm:mst-verification title="MST verification in linear time" source="algorithms/01 p38"}
**(Dixon–Rauch–Tarjan 1992, King 1995, Hagerup 2009)** There is a deterministic algorithm which, given a graph $G$ and a spanning tree $T$, computes $w_T(e)$ for
each edge $e \in E(G)$ in time $\O(m + n)$.
:::

::: intuition
Computing $w_T(e)$ is a "maximum on a tree path" query, one per edge of $G$. Walking each path takes up to $\O(n)$, so the naive method needs
$\O(mn)$; the theorem answers all $m$ queries together in linear time. Example: if $T$ is the path $1\,2\,3\,4$ with weights $5, 1, 7$, then
$w_T(13) = 5$, $w_T(24) = 7$ and $w_T(14) = 7$.
:::

The proof is beyond the scope of the course. It gives a linear-time solution of the **MST verification** problem (input: a weighted graph $G$ and a spanning tree
$T \subseteq G$; question: is $T$ the MST of $G$?):

::: corollary {#cor:mst-verification title="Verifying an MST" source="algorithms/01 p38"}
There is a deterministic algorithm which, given $G$ and a spanning tree $T$, checks in time $\O(m + n)$ whether $T$ is the minimum spanning tree of $G$: it is iff all
edges of $G \setminus T$ are $T$-heavy.
:::

::: intuition
Checking an MST is easier than finding one: this check is deterministic and linear, while no deterministic linear-time MST algorithm is known.
Example: in the running example with $T = M$, the edge $bc$ ($11$) is $T$-heavy, as $w_T(bc) = \max(4, 8) = 8$. If instead $T = M - ac + bc$, then
$w_T(ac) = \max(4, 11) = 11 > 8$, so $ac$ is $T$-light and the test reports that $T$ is not the MST.
:::

::: proof
If every non-tree edge is $T$-heavy, it is the heaviest edge of the cycle it closes with $T$, so by the strong cycle property ([[thm:strong-cut-cycle]]) no non-tree edge
is in $M$; as $M$ has $n - 1$ edges, $M = T$. Conversely, if $T = M$, every non-tree edge $e$ is not in $M$, so it is the heaviest edge on some cycle; it is in particular
heavier than all edges of the cycle in $T + e$ (by the proof of [[thm:strong-cut-cycle]]), i.e. $T$-heavy.
:::
