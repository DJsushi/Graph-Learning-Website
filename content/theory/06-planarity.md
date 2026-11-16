---
title: Planar drawings and faces
course: theory
lecture: 6
slug: t06
summary: Drawings of graphs in the plane, planar graphs, polygonal drawings and faces.
prerequisites: [theory/05-connectivity-menger]
sources:
  - resources/graph-theory/2026-10-20-13_44_38-join.pdf
status: reviewed
---

Until now a graph was a set of vertices and a set of edges, and any picture of it was only a help. This
lecture starts **planarity** and takes the picture seriously: a drawing in the plane puts each vertex at
its own point and each edge on an arc between its ends that meets no other vertex, and no two arcs may meet. A graph is **planar** if it has such a drawing.
We then show that curved edges can be replaced by polygonal lines, and we cut the plane along a drawing
into **faces**, and the closed walks that bound them. Two drawings of the same graph count as the same when they
have the same facial walks.

## Summary

- A [[def:planar-drawing|planar drawing]] of a (multi)graph puts the vertices at distinct points and each edge
  on an [[def:planar-drawing|open arc]] between its ends. These curves are disjoint for different edges, and none of them meets a vertex
  of the graph. $G$ is [[def:planar-graph|planar]] if it has a planar drawing.
- Every planar graph has a planar drawing by polygonal lines ([[lem:polygonal-drawing]]). The notes give a proof
  sketch.
- The [[def:face|faces]] of a planar drawing are the arc-connected regions of the plane outside the drawing. One
  of them is the outer face. A [[def:walk|closed walk]] is a facial walk if it bounds a face. Two planar drawings of $G$ are
  equivalent if they have the same collection of facial walks ([[def:face]]).
