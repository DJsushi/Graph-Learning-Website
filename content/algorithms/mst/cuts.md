---
title: "Cuts"
course: algorithms
chapter: mst
order: 2
lectures: [a01]
stage: split
status: draft
---

::: definition {#def:cut title="Cut" defines="cut (vertex partition), crossing edge" source="algorithms/01 p5"}
A **cut** in $G$ is a partition $(S, V \setminus S)$ of the vertex set with $\emptyset \ne S \ne V$; an edge **crosses** the cut
(goes **across** it, is a **crossing edge**) if it has one end in $S$ and the other in $V \setminus S$.
:::

::: intuition
A cut splits the vertices into two non-empty sides, and the crossing edges are the only connections between them. Every spanning
tree must use **at least one** crossing edge of every cut, otherwise it could not connect the two sides. The cut property below
says which crossing edge the MST uses. Example: in [[fig:a01-cut-property]], $S = \set{a, b, c}$ and the crossing edges are $bd$,
$ce$ and $cf$. The simplest cuts are $(\set{v}, V \setminus \set{v})$, crossed exactly by the edges at $v$. In a [[def:flow-network|flow network]], an
$s$–$t$ cut ([[def:flow-cut]]) is a cut with $s \in S$ and $t \notin S$; in an undirected graph, the crossing edges of such a cut
form an $s$–$t$ edge cut ([[def:st-cut]]).
:::

::: pitfall
Here a cut is a partition of the **vertices**, and what crosses it are edges. This is not the vertex cut (separator) of
[[def:minimal-cut]], which is a set of vertices whose deletion disconnects the graph.
:::
