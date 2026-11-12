---
title: "The minimum spanning tree problem"
course: algorithms
chapter: mst
order: 1
lectures: [a01]
stage: split
status: draft
---

The algorithms course uses the following conventions:

- $G = (V, E)$ is a simple undirected graph, $E \subseteq \binom{V}{2}$; $D = (V, E)$ is a simple directed graph,
  $E \subseteq V \times V$.
- $n = \abs{V(G)}$, $m = \abs{E(G)}$; $\log n$ is the logarithm to base $2$.
- The **length** of a path is the number of its edges ([[def:path-graph]]); the **height** (depth) of a rooted tree is
  the length of its longest root-to-leaf path.
- $P$ denotes a path, $T$ a tree, $F$ a forest; $P_n, C_n, K_n, K_{m,n}$ are as in [[theory/01-basic-notions]], and
  $S_n$ is the star $K_{1,n}$.

Throughout, $G = (V, E)$ is an undirected **connected** graph with a **weight function** $w : E(G) \to \R^+$. The
**weight** of a subgraph $H$ is $w(H) = \sum_{e \in E(H)} w(e)$.

::: definition {#def:mst title="Minimum spanning tree" defines="minimum spanning tree, MST, weight" source="algorithms/01 p3"}
A **spanning tree** of $G$ is a subgraph $T \subseteq G$ such that $V(T) = V(G)$ and $T$ is a tree
([[def:spanning-tree]]). A **minimum spanning tree (MST)** of $G$ is a spanning tree $M$ such that $w(M) \le w(T)$ for
all spanning trees $T$ of $G$.
:::

::: intuition
Among the many spanning trees of $G$ we want the cheapest one. Why a tree at all: if a connected spanning subgraph
contained a [[def:cycle-graph|cycle]], deleting one edge of the cycle would keep it connected and, as weights are positive,
make it cheaper; so the cheapest connected spanning subgraph is acyclic, i.e. a spanning tree.
Example: a triangle with weights $1, 2, 3$ has three
spanning trees (any two of its edges), of weights $3$, $4$ and $5$; the MST consists of the edges of weight $1$ and $2$.
:::

::: pitfall
An MST minimises the **total** weight, not the distances between vertices. In a triangle $abc$ with $w(ab) = w(ac) = 2$
and $w(bc) = 3$, the MST is $\set{ab, ac}$ of weight $4$, but the path from $b$ to $c$ in it has weight $4$, while the
edge $bc$ alone has weight $3$. An MST is not a shortest-path tree.
:::

By Cayley's formula ([[thm:cayley]]), $K_n$ has $n^{n-2}$ spanning trees: **the brute-force approach is far too
expensive.** MSTs have a remarkable range of applications: network design (communication, electrical, hydraulic,
road), approximation algorithms for NP-hard problems such as the travelling salesman and Steiner tree problems,
cluster analysis, image segmentation and registration, error-correcting codes, avoiding cycles in Ethernet
bridging, and many more.

```graph id=a01-example-graph widget=figure
caption: Our running example. All weights are distinct. Its minimum spanning tree (highlighted) has weight $1+2+3+4+5+6+8 = 29$.
intent: The weighted graph used by all MST players in this lesson; MST edges highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4 class=tree]; a -- c [w=8 class=tree]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1 class=tree]
d -- e [w=2 class=tree]; d -- g [w=6 class=tree]; e -- f [w=5 class=tree]; e -- g [w=12]; f -- h [w=3 class=tree]; g -- h [w=10]
```
