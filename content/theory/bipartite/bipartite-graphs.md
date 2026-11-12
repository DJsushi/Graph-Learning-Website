---
title: "Bipartite graphs"
course: theory
chapter: bipartite
order: 1
lectures: [t02]
stage: split
status: reviewed
---

::: definition {#def:bipartite title="Bipartite graph" defines="bipartite, bipartition" source="theory/2026-09-22 p4"}
A graph $G$ is **bipartite** if there are sets $A, B$ with $A \cup B = V(G)$, $A \cap B = \emptyset$, such
that both $A$ and $B$ are independent. The pair $(A, B)$ is a **bipartition** of $G$.
:::

So every edge of a bipartite graph has one end in $A$ and the other in $B$.

::: intuition {for=def:bipartite}
Bipartite means 2-colourable: colour $A$ red and $B$ blue, and every edge joins a red and a blue
vertex. Typical examples are graphs of "two kinds of objects", such as students and courses, with
edges only between the kinds; the matchings of the algorithms course ([[def:matching]],
[[prop:matching-flow]]) live in such graphs. Examples: $K_{m,n}$, even cycles, paths, and every graph
without edges (take $B = \emptyset$). Non-example: the triangle, since two of its three vertices get the
same colour.
:::

```graph id=t02-bipartite-c6 widget=figure
caption: The cycle $C_6$ is bipartite: colouring its vertices alternately and redrawing them in two rows shows the bipartition $(A, B)$.
intent: Show that a bipartition is a 2-colouring, and that redrawing makes it visible.
layout: fixed
panel: $C_6$
1 @(0, 1) [class=color1]; 2 @(0.87, 0.5) [class=color2]; 3 @(0.87, -0.5) [class=color1]; 4 @(0, -1) [class=color2]; 5 @(-0.87, -0.5) [class=color1]; 6 @(-0.87, 0.5) [class=color2]
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
panel: redrawn
1 @(0, 1) [class=color1]; 3 @(1, 1) [class=color1]; 5 @(2, 1) [class=color1]; 2 @(0, 0) [class=color2]; 4 @(1, 0) [class=color2]; 6 @(2, 0) [class=color2]
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
```

::: proposition {#prop:bipartite-subgraph-kmn title="Bipartite graphs are subgraphs of $K_{m,n}$" source="theory/2026-09-22 p4"}
A graph $G$ is bipartite if and only if $G$ is [[def:isomorphism|isomorphic]] to a [[def:subgraph|subgraph]] of $K_{m,n}$ for suitable
$m, n$.
:::

::: intuition
$K_{m,n}$ is the bipartite graph with every edge a bipartition allows, so a bipartite graph is
$K_{m,n}$ with some edges deleted. Example: the path $P_3$ with vertices $0, 1, 2, 3$ has bipartition
$(\set{0, 2}, \set{1, 3})$ and is a subgraph of $K_{2,2} \cong C_4$. Non-example: the triangle is not a
subgraph of any $K_{m,n}$.
:::

```graph id=t02-bipartite-subgraph-kmn widget=figure
caption: The path $P_3$ with bipartition $(\set{0, 2}, \set{1, 3})$ (left) is the subgraph of $K_{2,2}$ (right) that keeps its 3 bold edges and drops the dashed edge $03$, one of the 4 edges of $K_{2,2}$.
intent: New figure (the lecture shows no drawing on p4; the example is the one in the intuition). A bipartite graph is $K_{m,n}$ with edges deleted.
layout: fixed
panel: $P_3$
0 @(0, 1) [class=color1]; 2 @(1, 1) [class=color1]; 1 @(0, 0) [class=color2]; 3 @(1, 0) [class=color2]
0 -- 1 -- 2 -- 3
panel: $K_{2,2}$
0 @(0, 1) [class=color1]; 2 @(1, 1) [class=color1]; 1 @(0, 0) [class=color2]; 3 @(1, 0) [class=color2]
0 -- 1 [class=bold]; 1 -- 2 [class=bold]; 2 -- 3 [class=bold]; 0 -- 3 [class=dashed]
```

The lecture states this without proof.
