---
title: "k-connectivity"
course: theory
chapter: menger
order: 1
lectures: [t05]
stage: split
status: draft
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
disconnects it.
:::

So "$1$-connected" and "$1$-edge-connected" both mean connected. The convention for [[def:complete-graph|complete graphs]] is
needed because deleting vertices from $K_n$ never disconnects it: without the convention, $K_n$ would be $n$-connected (deleting
$n - 1$ vertices leaves $K_1$), although no two of its vertices are joined by $n$ internally disjoint paths.
<!-- REVIEW: was "K_n would be infinitely connected"; deleting all n vertices leaves the empty graph, which is not connected (t02), so literally K_n is n- but not (n+1)-connected. -->
<!-- REVIEW: for multigraphs the convention is read as applying to every multigraph whose underlying simple graph is K_n (the board states it for K_n only). -->

::: pitfall
"$k$-connected" is a lower bound, not an exact value: a $3$-connected graph is also $2$- and $1$-connected. The exact value,
the largest such $k$, is the vertex connectivity (written $\kappa(G)$ in [[exr:t05-whitney]]). Also, vertex and edge
connectivity differ: the left graph in the figure below is $2$-edge-connected but not $2$-connected.
:::
