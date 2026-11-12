---
title: "k-connectivity"
course: theory
chapter: menger
order: 1
lectures: [t05]
stage: split
status: reviewed
---

::: definition {#def:k-connected title="k-connected, k-edge-connected" defines="k-connected, k-edge-connected, vertex connectivity, edge connectivity" source="theory/2026-10-13 p1"}
Let $k \ge 1$. An undirected [[def:mixed-multigraph|multigraph]] $G$ is **$k$-connected** if after deleting any at most $k - 1$ vertices of $G$, the
rest stays connected. By convention, $K_1$ is $1$-connected, and $K_n$ for $n \ge 2$ is $(n-1)$-connected (but not
$n$-connected); in general a $k$-connected graph must have at least $k + 1$ vertices, unless it is $K_1$ and $k = 1$.

$G$ is **$k$-edge-connected** if after deleting any at most $k - 1$ edges of $G$, the rest stays connected.
:::

::: intuition
$k$-connectivity measures robustness: an adversary who may destroy fewer than $k$ vertices (or edges) cannot cut the network
into pieces. The larger $k$, the more failures the network survives. Example: $C_n$ ($n \ge 3$) is $2$-connected and
$2$-edge-connected, since deleting one vertex or one edge leaves a [[def:path-graph|path]], which is still [[def:component|connected]].
Non-example: a [[def:forest-tree|tree]] on at least $3$ vertices is neither $2$-connected nor $2$-edge-connected: deleting any edge
disconnects it, and deleting an inner vertex (one exists since there are at least $3$ vertices) disconnects it too.
<!-- REVIEW: was only "deleting any edge disconnects it", which shows just that a tree is not 2-edge-connected; added the cut-vertex reason for "not 2-connected". -->
:::

So "$1$-connected" and "$1$-edge-connected" both mean connected. The convention for [[def:complete-graph|complete graphs]] is
needed because deleting fewer than $n$ vertices from $K_n$ never disconnects it: without the convention, $K_n$ would be $n$-connected (deleting
$n - 1$ vertices leaves $K_1$), although no two of its vertices are joined by $n$ internally disjoint paths.
<!-- REVIEW: was "deleting vertices from K_n never disconnects it"; now "fewer than n", since deleting all n leaves the empty graph. -->
<!-- REVIEW: was "K_n would be infinitely connected"; deleting all n vertices leaves the empty graph, which is not connected (t02), so literally K_n is n- but not (n+1)-connected. -->
<!-- REVIEW: for multigraphs the convention is read as applying to every multigraph whose underlying simple graph is K_n (the board states it for K_n only). -->

::: pitfall
"$k$-connected" is a lower bound, not an exact value: a $3$-connected graph is also $2$- and $1$-connected. The exact value,
the largest such $k$, is the vertex connectivity (written $\kappa(G)$ in [[exr:t05-whitney]]). Also, vertex and edge
connectivity differ: the left graph in the figure below is $2$-edge-connected but not $2$-connected.
:::

```graph id=t05-k-connected-example widget=figure
caption: Left, two triangles sharing the vertex $c$ are $2$-edge-connected but not $2$-connected, since deleting $c$ leaves the two components $\{a, b\}$ and $\{d, e\}$. Right, the pentagon $1, \dots, 5$ with the chord $13$ is $2$-connected, since deleting any one vertex leaves a connected graph.
intent: New figure. Example and non-example for the definition on theory/2026-10-13 p1; the lecture draws no example for it. The pitfall's "left graph" is the left panel. The cut vertex $c$ is marked.
layout: fixed
panel: 2-edge-connected, not 2-connected
a @(0, 1); b @(0, 0); c [class=cut] @(1, 0.5); d @(2, 1); e @(2, 0)
a -- b; a -- c; b -- c; c -- d; c -- e; d -- e
panel: 2-connected
1 @(0.2, 0.5); 2 @(0.9, 1); 3 @(1.7, 1); 4 @(2.2, 0.5); 5 @(1.2, 0)
1 -- 2; 2 -- 3; 3 -- 4; 4 -- 5; 5 -- 1; 1 -- 3
```
