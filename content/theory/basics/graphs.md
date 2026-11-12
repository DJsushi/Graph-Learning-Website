---
title: "Graphs"
course: theory
chapter: basics
order: 1
lectures: [t01]
stage: split
status: draft
---

Informally, a graph is a **symmetric binary relation**: a set of objects together with the
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
the vertices $1$ and $3$ are not related. Weighted graphs and flow networks
([[def:flow-network]]) in the algorithms course are graphs with extra numbers on the edges.
:::

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
