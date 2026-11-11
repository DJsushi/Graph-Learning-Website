---
title: "Kruskal's algorithm"
course: algorithms
chapter: mst
order: 6
lectures: [a01]
stage: split
status: draft
---

Kruskal (1956) grows a **blue [[def:forest-tree|forest]]**: sort the edges by [[def:mst|weight]]; take the lightest unprocessed edge $e$ and colour it blue if it connects
two different blue [[def:component|components]], discard it (colour it red) otherwise; repeat until all edges are processed.

::: algorithm {#alg:kruskal title="Kruskal's algorithm" source="algorithms/01 p8–9"}
**Input:** a connected graph $G$ with weights $w$. **Output:** the MST $F$.

```pseudo
F ← (V, ∅)                                               // @init
foreach v ∈ V(G) do MAKE-SET(v)                          // @makeset
sort edges according to w into a non-decreasing sequence // @sort
foreach e = {u, v} in this order do                      // @loop
    if FIND-SET(u) ≠ FIND-SET(v) then                    // @test
        F ← F ∪ e                                        // @accept
        UNION(u, v)                                      // @union
```
:::

::: intuition
Be greedy: take the cheapest edges first and skip every edge that would close a cycle with the edges already taken. The forest
$F$ starts as $n$ single vertices and every accepted edge merges two of its components, so after $n - 1$ acceptances it is a
spanning tree ([[cor:forest-edges]]). Example: a 4-cycle $a\,b\,c\,d$ with $w(ab) = 1$, $w(bc) = 2$, $w(cd) = 3$, $w(da) = 4$ and a
chord $ac$ of weight $5$. Kruskal accepts $ab$, $bc$, $cd$ and rejects $da$ and $ac$, as both ends of each already lie in one
component.
:::

::: pitfall
An edge is rejected only if its ends lie in the **same** component, not whenever both ends are already touched by $F$. On the
running example, after $cf$, $de$, $fh$ and $ab$ the edge $ef$ joins two vertices that both have an edge of $F$, but they lie in
different components $\set{c, f, h}$ and $\set{d, e}$, so $ef$ is accepted.
:::

**Correctness.** Since the edges are processed in increasing order: if $e = uv$ is accepted, it is the first processed edge across the [[def:cut|cut]]
$(S, V \setminus S)$, where $S$ is the blue component of $u$ (any earlier crossing edge would have been accepted and would have merged $S$ with
another component), hence the lightest such edge: **blue rule**. If $e$ is rejected, its ends are joined by a blue path of earlier, hence
lighter, edges, so $e$ is the last and heaviest edge of a cycle: **red rule**.

```graph id=a01-kruskal-player widget=player
caption: Kruskal's algorithm on the running example. Watch the union-find components merge.
intent: Algorithm player; state panel shows the sorted edge list and the components.
algo: kruskal
show: pseudocode state
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```
