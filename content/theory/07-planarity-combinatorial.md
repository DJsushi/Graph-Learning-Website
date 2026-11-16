---
title: Planarity and Euler's formula
course: theory
lecture: 7
slug: t07
summary: The geometric dual, Euler's formula, edge bounds for planar graphs, and Kuratowski's theorem.
prerequisites: [theory/06-planarity]
sources:
  - resources/graph-theory/2026-10-27-13_48_43-join.pdf
status: reviewed
---

This lecture works with the combinatorial side of planarity. From now on a planar drawing of $G$ is the abstract
graph together with its collection of facial walks, such that these walks can be realised by the faces of a
polygonal drawing. A **plane graph** is a graph with a given planar drawing. We build the **geometric dual**, which has
one vertex for each face, and prove **Euler's formula** with it. Counting the sides of the faces then shows that
$K_5$ is not planar and that a planar graph has a vertex of small degree. The lecture ends with
**Kuratowski's theorem**: a graph is planar iff it contains no subdivision of $K_5$ or $K_{3,3}$.

## Summary

- A [[def:plane-graph|plane graph]] is a graph with a given [[def:planar-drawing|planar drawing]]; a graph is [[def:planar-graph|planar]] iff it has a planar drawing ([[def:plane-graph]]).
- The [[def:geometric-dual|geometric dual]] $G^*$ of a plane [[def:mixed-multigraph|multigraph]] $G$ has one vertex for each [[def:face|face]] of $G$ (its facial walk). Each
  edge of $G$ gives one edge of $G^*$, joining the two (or one) faces that contain it ([[def:geometric-dual]]).
- Euler: for a [[def:component|connected]] plane multigraph, $\abs{V} + \abs{F} - \abs{E} = 2$ ([[thm:euler-formula]]). Proof: the edges outside a
  [[def:spanning-tree|spanning tree]] of $G$ form a spanning tree of $G^*$ ([[claim:euler-dual-tree]]), so $\abs{E} = (\abs{V} - 1) + (\abs{F} - 1)$.
- $K_5$ is not planar: Euler gives $7$ [[def:face|faces]], each facial walk has at least $3$ edges (counted with repeats), and the facial walks together count
  every edge twice ([[prop:k5-not-planar]]).
- A planar simple graph has a vertex of [[def:degree|degree]] at most $5$, and a [[def:bipartite|bipartite]] one of degree at most $3$
  ([[cor:planar-small-degree]]). The notes prove the first part by comparing the edge count with $3\abs{V} - 6$ ([[exr:t07-edge-bounds]]) and state the bipartite part without proof.
- A graph is planar iff it contains no [[def:subdivision|subdivision]] of $K_5$ or $K_{3,3}$ ([[thm:kuratowski]]). The proof of
  the direction "no subdivision, so planar" takes a smallest counterexample $G_0$ and shows that it is $3$-connected. It then
  contracts an edge, using a theorem that the notes state without proof ([[thm:contractible-edge]]).

## Exercises

The notes give two exercises. Both sit on concept pages.

- $(G^*)^* = G$ for [[def:component|connected]] plane [[def:mixed-multigraph|multigraphs]]: [[exr:t07-dual-of-dual]].
- The edge bounds for plane multigraphs with an edge: $\abs{E} \le 3\abs{V} - 6$ if no [[def:face|facial walk]] has at most $2$ edges (counted with repeats), and $\abs{E} \le 2\abs{V} - 4$ if none has at most $3$ edges. The graph must be connected: [[exr:t07-edge-bounds]].
