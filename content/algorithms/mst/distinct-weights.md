---
title: "Distinct weights and uniqueness"
course: algorithms
chapter: mst
order: 4
lectures: [a01]
stage: split
status: draft
---

If all weights are distinct, the converse statements hold as well:

::: theorem {#thm:strong-cut-cycle title="Strong cut and cycle properties" source="algorithms/01 p5"}
Assume all edge weights are distinct, and let $M$ be a minimum spanning tree. Then

- **(strong cut property)** $e \in M \iff e$ is the lightest edge across some cut of $G$;
- **(strong cycle property)** $e \notin M \iff e$ is the heaviest edge on some cycle of $G$.
:::

::: proof
The directions "$\Leftarrow$" of the cut property and "$\Leftarrow$" of the cycle property are [[thm:cut-property]] and [[thm:cycle-property]].

Cut, "$\Rightarrow$": let $e \in M$, and let $(S, V \setminus S)$ be the cut formed by the two components of $M - e$. For any other edge $f$ across
this cut, $M - e + f$ is a spanning tree, so $w(M) - w(e) + w(f) \ge w(M)$, i.e. $w(f) \ge w(e)$, and by distinctness $w(f) > w(e)$.

Cycle, "$\Rightarrow$": let $e \notin M$, and let $C$ be the cycle in $M + e$. For any other edge $f$ of $C$, $M + e - f$ is a spanning tree, so
$w(e) \ge w(f)$, and by distinctness $w(e) > w(f)$.
:::

::: intuition {for=thm:strong-cut-cycle}
With distinct weights every edge carries a certificate of its status. An edge $e \in M$ is certified by the cut that $M - e$
defines, and an edge $e \notin M$ by the cycle it closes with $M$. Example (running example): $ac \in M$, and $M - ac$ splits
off $\set{a, b}$; across this cut go $ac$ ($8$), $bd$ ($9$) and $bc$ ($11$), and $ac$ is the lightest. The edge $ce \notin M$
closes the cycle $c\,f\,e$ with $M$, on which $ce$ ($7$) is heavier than $cf$ ($1$) and $fe$ ($5$). Checking such cycle
certificates for all non-tree edges at once is MST verification ([[cor:mst-verification]]).
:::

::: pitfall
The directions "$\Rightarrow$" need distinct weights. In a triangle with all weights $1$, an MST edge is not the strictly lightest
edge across any cut, and a non-tree edge is not the strictly heaviest edge on any cycle.
:::

::: corollary {#cor:mst-unique title="Uniqueness of the MST" extra=true}
If all edge weights are distinct, the minimum spanning tree is unique.
:::

::: intuition
The strong cut property describes the MST without referring to any particular MST: it is the set of edges that are the lightest
across some cut. So two MSTs consist of the same edges. With ties, uniqueness fails: a triangle with weights $1, 2, 2$ has two
MSTs, each containing the edge of weight $1$ and one of the two edges of weight $2$.
:::

::: proof
Let $M, M'$ be two different MSTs and let $e$ be the lightest edge in their symmetric difference, say $e \in M \setminus M'$. The cycle $C$ in
$M' + e$ is not contained in $M$ (as $M$ is acyclic), so $C$ has an edge $f \notin M$; then $f \in M' \setminus M$ and $f \ne e$, so $w(f) > w(e)$ by
the choice of $e$. Now $M' + e - f$ is a spanning tree lighter than $M'$, a contradiction.
:::

**We will always assume that all weights are distinct.** This is no real restriction: ties can be broken consistently, for example by
comparing pairs $(w(e), \text{index of } e)$ lexicographically. With this convention we can speak of **the** MST $M$.
