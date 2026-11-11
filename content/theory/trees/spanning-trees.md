---
title: "Spanning trees"
course: theory
chapter: trees
order: 7
lectures: [t03]
stage: split
status: draft
---

::: definition {#def:spanning-tree title="Spanning tree" defines="spanning tree" source="theory/2026-09-29 p6"}
A [[def:forest-tree|tree]] $T \subseteq G$ is **spanning** in $G$ if $V(T) = V(G)$.
:::

::: intuition
A spanning tree is a minimal skeleton of $G$ that still reaches every vertex: it keeps all vertices
and only as many edges as needed to stay connected, namely $n - 1$
([[thm:tree-characterisations]]). Example: removing any one edge of $C_n$ gives a spanning tree (a [[def:path-graph|path]]).
Non-example: a tree in $G$ that misses a vertex is not spanning. With edge weights, finding the
lightest spanning tree is the [[def:mst|minimum spanning tree]] problem of the algorithms course.
:::

::: pitfall
A spanning tree has to contain **every** vertex of $G$ but only **some** of its edges; it is not an
induced subgraph in general. Also, $G$ usually has many spanning trees ($K_n$ has $n^{n-2}$, see below),
not a single one.
:::

::: proposition {#prop:spanning-tree-exists title="Connected graphs have spanning trees" extra=true}
A graph has a spanning tree if and only if it is [[def:component|connected]].
:::

::: intuition
Spanning trees are exactly what remains of a connected graph after removing redundancy: an edge on a
cycle can be deleted without disconnecting anything, and once no cycle is left we have a tree. A
disconnected graph cannot have one, as a tree is connected. The proof deletes edges; the MST
algorithms build the tree instead by adding edges that close no cycle ([[alg:kruskal]]) or by growing it
from one vertex ([[alg:jarnik]]), like the BFS tree.
:::

::: proof
A spanning tree is connected and contains all vertices, so $G$ is connected. Conversely, as long as a
connected graph has a [[def:cycle-graph|cycle]], delete an edge of a cycle; the graph stays connected. When no cycle is left
we have a connected acyclic spanning [[def:subgraph|subgraph]], a spanning tree. (A BFS tree, [[alg:bfs]], is another
spanning tree of a connected graph.)
:::

```graph id=t03-spanning-tree-exercise widget=exercise
task: select-edges
prompt: Select the edges of a spanning tree of this graph.
check: is-spanning-tree
hint: You need exactly $n - 1 = 6$ edges and no cycle.
solution: For example the BFS tree from $a$: $ab, ac, ad, be, cf, eg$. Any acyclic set of 6 edges is correct.
a -- b; a -- c; a -- d; b -- c; b -- e; c -- f; d -- f; e -- f; e -- g; f -- g
```
