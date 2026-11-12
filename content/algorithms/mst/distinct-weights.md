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

The lecture states this without proof.

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

**We will always assume that all weights are distinct.** This is no real restriction: ties can be broken consistently, for example by
comparing pairs $(w(e), \text{index of } e)$ lexicographically. With this convention we can speak of **the** MST $M$.
