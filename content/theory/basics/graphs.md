---
title: "Graphs"
course: theory
chapter: basics
order: 1
lectures: [t01]
stage: split
status: reviewed
---

<!-- REVIEW: added "irreflexive": a symmetric relation alone would allow pairs (v, v), i.e. loops; a simple graph has none. -->
Informally, a graph is a **symmetric irreflexive binary relation** (no object is related to itself): a set of objects together with the
information which pairs of them are related. Unless said otherwise, the word *graph* always
means a **simple undirected graph**:

::: definition {#def:graph title="Graph" defines="graph, vertex, edge" basic=true source="theory/2026-09-15 p1"}
A **graph** is a pair $G = (V, E)$, where $V$ is a set and $E \subseteq \binom{V}{2}$ is a set of
2-element subsets of $V$.

The elements of $V$ are the **vertices** of $G$ and the elements of $E$ are its **edges**. We
write $V(G)$ and $E(G)$ for the vertex set and the edge set of a graph $G$.
:::

::: intuition
A graph records only *which pairs* of objects are related. An edge is an unordered pair, so $uv$
and $vu$ are the same edge, and a pair $\set{v, v}$ is not a 2-element set, so no edge joins a
vertex to itself. Example: $V = \set{1, 2, 3}$ and $E = \set{12, 23}$ is a [[def:path-graph|path]] through $1, 2, 3$;
the vertices $1$ and $3$ are not related. <!-- REVIEW: a flow network is a directed graph, not a simple undirected one; reworded so the sentence does not call it a "graph" in the page's sense. -->
Weighted graphs have extra numbers on the edges, and flow networks
([[def:flow-network]]) in the algorithms course are directed graphs with a source, a sink and capacities.
:::

```graph id=t01-graph-examples widget=figure
caption: Left, a graph with $V = \set{1, 2, 3, 4, 5}$ and the 5 edges $12, 23, 24, 34, 45$; this is only 5 of the $\binom{5}{2} = 10$ possible pairs, and the pairs not in $E$, such as $15$, are not related. Right, not a graph in this sense, because there is a loop at $3$ and two edges between $1$ and $2$.
intent: New figure (the lecture shows no drawing on p1). Example and non-example for the definition of a graph; the right panel breaks both conditions, a loop is not a 2-element subset and $E$ is a set, so it cannot hold the pair $12$ twice.
layout: fixed
panel: a graph
1 @(0, 0.5); 2 @(1, 1); 3 @(2, 1); 4 @(1.5, 0); 5 @(2.7, 0)
1 -- 2; 2 -- 3; 2 -- 4; 3 -- 4; 4 -- 5
panel: not a graph
1 @(0, 0); 2 @(1.2, 0); 3 @(2.4, 0)
1 -- 2 [class=rejected]; 1 -- 2 [class=rejected]; 3 -- 3 [class=rejected]; 2 -- 3
```

Throughout, graphs are **finite** ($V$ is a finite set), and we use the notation of the lectures:

- $n = \abs{V(G)}$ is the number of vertices and $m = \abs{E(G)}$ the number of edges;
- an edge $\set{u, v}$ is often written shortly as $uv$ (so $uv = vu$).

::: definition {#def:adjacent title="Adjacency and incidence" defines="adjacent, incident, neighbour, neighbourhood, endpoint" basic=true}
Let $G$ be a graph and $e = uv \in E(G)$. The vertices $u$ and $v$ are the **endpoints** of $e$;
we say that $u$ and $v$ are **adjacent** (or **neighbours**), and that $e$ is **incident** with
$u$ and with $v$. The **neighbourhood** of a vertex $v$ is the set
$N_G(v) = \set{u \in V(G) : uv \in E(G)}$.
:::

::: intuition
Adjacency relates two vertices; incidence relates a vertex and an edge. In the graph with edges
$12$ and $23$, the vertex $2$ has neighbourhood $N(2) = \set{1, 3}$, while $N(1) = \set{2}$. The
edge $12$ is incident with $1$ and $2$ but not with $3$, and $1$ and $3$ are not adjacent.
:::

```graph id=t01-adjacency-examples widget=figure
caption: Left, the neighbourhood of the vertex $2$ in the graph of the previous figure: $N(2) = \set{1, 3, 4}$ (the neighbours are filled, the vertex $2$ itself has a different fill, and its three edges are thick). The vertices $1$ and $3$ are both neighbours of $2$ but not adjacent to each other. Right, the edge $34$: its endpoints $3$ and $4$ are adjacent, and the edge is incident with these two vertices and with no other.
intent: New figure (the lecture shows no drawing on p1). Same graph as the previous figure. Shows adjacency (vertex with vertex) against incidence (vertex with edge).
layout: fixed
panel: $N(2)$
1 @(0, 0.5) [class=color2]; 2 @(1, 1) [class=color1]; 3 @(2, 1) [class=color2]; 4 @(1.5, 0) [class=color2]; 5 @(2.7, 0)
1 -- 2 [class=highlight]; 2 -- 3 [class=highlight]; 2 -- 4 [class=highlight]; 3 -- 4; 4 -- 5
panel: edge $34$
1 @(0, 0.5); 2 @(1, 1); 3 @(2, 1) [class=color1]; 4 @(1.5, 0) [class=color1]; 5 @(2.7, 0)
1 -- 2; 2 -- 3; 2 -- 4; 3 -- 4 [class=highlight]; 4 -- 5
```
