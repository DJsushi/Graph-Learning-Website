---
title: "Jarník's algorithm"
course: algorithms
chapter: mst
order: 8
lectures: [a01]
stage: split
status: draft
---

Jarník (1930), rediscovered by Prim (1957) and Dijkstra (1959), grows a single **blue tree**: start with any vertex $s$, creating the tree
$T = (\set{s}, \emptyset)$; repeatedly find a minimum-weight edge with exactly one end in $T$ and add it to $T$, until $T$ spans $G$.

::: algorithm {#alg:jarnik title="Jarník's (Prim's) algorithm" source="algorithms/01 p12"}
**Input:** a connected graph $G$ with weights $w$. **Output:** the [[def:mst|MST]] $T$.

```pseudo
choose some s ∈ V(G)                 // @start
T ← ({s}, ∅)                         // @init
for n − 1 times do                   // @loop
    e ← the lightest edge of G leaving T   // @select
    T ← T ∪ {e}                      // @add
```
:::

::: intuition
One tree grows from $s$, like the BFS tree ([[alg:bfs]]), but the next vertex is the one reachable by the **cheapest** edge
leaving the tree, not the one discovered first. Each step is the cut property for the cut between the tree and the rest. On the
running example from $a$, the edges are added in the order $ab$ ($4$), $ac$ ($8$), $cf$ ($1$), $fh$ ($3$), $ef$ ($5$), $de$ ($2$),
$dg$ ($6$): the edge of weight $8$ comes before the edge of weight $1$, because $cf$ does not leave the tree until $c$ is in it.
The result is the same tree as Kruskal's, of weight $29$.
:::
