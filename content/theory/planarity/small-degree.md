---
title: Planar graphs have a vertex of small degree
course: theory
chapter: planarity
order: 7
lectures: [t07]
goal: Prove that a simple planar graph has a vertex of degree at most 5, by counting edges.
needs: [theory/planarity/k5-not-planar, theory/planarity/faces, theory/planarity/planar-drawings, theory/degrees/degrees-and-handshake]
stage: taught
status: reviewed
---

The page before this one drew two plane graphs, the octahedron and the cube. In the octahedron
every vertex has degree 4, and in the cube every vertex has degree 3. Is there a planar graph
in which every vertex has degree 6 or more?

```graph id=t07-small-degree-board widget=figure
caption: The octahedron has 6 vertices and 12 edges, and every vertex has degree 4. The cube has 8 vertices and 12 edges, and every vertex has degree 3.
intent: From the lecture (theory/2026-10-27 p3, the two red drawings; the lecture shows them next to the exercise on edge bounds, not next to this corollary; the numbers are new). Same graphs and vertex names as t07-edge-bounds-examples. They show planar graphs with small degrees, and the page proves that this is no accident.
layout: fixed
panel: octahedron
1 @(1.5, 2.3); 2 @(3, 0); 3 @(0, 0); 4 @(1.875, 0.96); 5 @(1.5, 0.385); 6 @(1.125, 0.96)
1 -- 2 -- 3 -- 1; 4 -- 5 -- 6 -- 4
1 -- 4; 2 -- 4; 2 -- 5; 3 -- 5; 3 -- 6; 1 -- 6
panel: cube
1 @(0, 0); 2 @(2.4, 0); 3 @(2.4, 2.4); 4 @(0, 2.4); 5 @(0.8, 0.8); 6 @(1.6, 0.8); 7 @(1.6, 1.6); 8 @(0.8, 1.6)
1 -- 2 -- 3 -- 4 -- 1; 5 -- 6 -- 7 -- 8 -- 5
1 -- 5; 2 -- 6; 3 -- 7; 4 -- 8
```

The answer is no, and the reason is counting. A drawing without crossings has fewer than three
edges for each vertex, as the exercise on the previous page shows. Every edge has two ends, so
the average degree is below 6.

::: corollary {#cor:planar-small-degree title="Small degrees in planar graphs" source="theory/2026-10-27 p4"}
Every planar (simple) graph has a vertex of degree at most 5.
Every bipartite planar (simple) graph has a vertex of degree at most 3.
:::

::: intuition
Planar graphs are sparse: fewer than 3 edges per vertex, so the average degree is below 6.
Bipartite planar graphs are sparser still.
:::

## Why it is true

The proof of the first part is a **contradiction between two counts of the edges**: large degrees
force many edges, and the [[exr:t07-edge-bounds|edge bound]] allows few.

:::: walkthrough {for=cor:planar-small-degree}
```graph id=t07-small-degree-planar widget=stepper
caption: A stand-in for the first part: the octahedron (6 vertices, 12 edges, 8 faces of length 3) and, as a second component, the edge 7 8. No planar graph with all degrees at least 6 exists, so we cannot draw one.
intent: New figure. The octahedron is the lecture's red drawing (theory/2026-10-27 p3), flattened, with the same vertex names as t07-edge-bounds-examples. The lecture has no figure for the corollary (p4). The edge 7 8 is a second component, for the step that passes to a component. Each step is one step of the proof.
layout: fixed
1 @(1.8, 1.5); 2 @(3.6, 0); 3 @(0, 0); 4 @(2.2, 0.9); 5 @(1.8, 0.4); 6 @(1.4, 0.9); 7 @(0.1, 1.5); 8 @(0.9, 1.5)
1 -- 2 -- 3 -- 1; 4 -- 5 -- 6 -- 4
1 -- 4; 2 -- 4; 2 -- 5; 3 -- 5; 3 -- 6; 1 -- 6
7 -- 8
mark H: 1 2 3 4 5 6 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
mark tri: 1--4 4--6 6--1
mark rest: 7 8 7--8
step: Suppose every vertex has degree at least 6, and fix a plane drawing.
step: Pass to the component $H$ of one vertex.
class muted: 7 8 7--8
step: Degrees at least 6 give at least $3\abs{V(H)}$ edges.
class bold: 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
step: Every face of $H$ has length at least 3.
unclass bold: 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
class cycle: 1--4 4--6 6--1
step: The edge bound gives at most $3\abs{V(H)} - 6$ edges.
unclass cycle: 1--4 4--6 6--1
class highlight: 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
step: The two counts contradict each other.
unclass highlight: 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
class rejected: 1--2 2--3 3--1 4--5 5--6 6--4 1--4 2--4 2--5 3--5 3--6 1--6
```

::: step
We argue by contradiction. Suppose $G$ is a simple [[def:planar-graph|planar graph]] in which
every degree is at least 6, and fix a plane drawing. No such $G$ exists, so
[[fig:t07-small-degree-planar#H|the octahedron]] plus the edge 7 8 is a stand-in.
:::

::: step
Take a vertex $v$ and let $H$ be its [[def:component|component]], a connected plane graph. All
edges at a vertex of $H$ lie in $H$, so every degree in $H$ is still at least 6, and $H$ has an
edge. Here [[fig:t07-small-degree-planar#rest|the edge 7 8]] is another component.
:::

::: step
By [[lem:handshake|the handshake lemma]], the degrees in $H$ add up to twice the number of
edges. Each of the $\abs{V(H)}$ degrees is at least 6, so $\abs{E(H)} \ge 3\abs{V(H)}$. Here the
octahedron would need at least 18 edges. It has 12.
:::

::: step
Now an upper bound. Every face of $H$ has length at least 3. Length 1 needs a loop. Length 2
needs parallel edges or a vertex of degree 1. We excluded these: $G$ is simple and all degrees are at
least 6. Length 0 needs no edge, but $H$ has one. Here: [[fig:t07-small-degree-planar#tri|the face 1 4 6]].
:::

::: step
So [[exr:t07-edge-bounds|the edge bound]] applies to $H$: it is connected and plane, has an edge, and
has no face of length 1 or 2. It gives $\abs{E(H)} \le 3\abs{V(H)} - 6$. Here
$3 \cdot 6 - 6 = 12$: the octahedron reaches the bound.
:::

::: step
The first count gives at least $3\abs{V(H)}$ edges, the second at most $3\abs{V(H)} - 6$. That is
impossible, so $G$ has a vertex of degree at most 5. We used that $G$ is planar (the drawing) and
simple (the faces).
:::
::::

The lecture states the second part, for bipartite graphs, without proof. The cube in the first
figure is an example: it is bipartite and planar, and every vertex has degree 3.

:::: proof {title="Proof of the first part: a vertex of degree at most 5"}
This proves only the first part, for planar graphs. Let $G$ be a planar (simple) graph and suppose that $G$ has no vertex of degree at most 5. Fix a
plane drawing of $G$, take a vertex of $G$, and let $H$ be its component. Then $H$ is a connected plane graph with
an edge, and every vertex of $H$ has degree at least 6. By the handshake lemma, $H$ has at least
$\frac12 \cdot 6 \cdot \abs{V(H)}$ edges, which is more than $3\abs{V(H)} - 6$. But $H$ is simple
and has no vertex of degree 1, so it has no face of length 1 or 2, and the edge bound gives
$\abs{E(H)} \le 3\abs{V(H)} - 6$, a contradiction.
::::

::: pitfall
The corollary needs a simple graph. Two vertices joined by 6 parallel edges form a planar
multigraph in which both vertices have degree 6. The proof breaks at the faces of length 2.
:::

## Check yourself

:::: quiz {#q:t07-small-degree-count}
A simple planar graph has 12 vertices, and every vertex has degree at least 5. How many edges
does it have at least?

answer: 30

::: explanation
By the handshake lemma, the degrees add up to at least $5 \cdot 12 = 60$, which is twice the
number of edges. So there are at least 30 edges. The bound $3 \cdot 12 - 6 = 30$ allows exactly
that many, so a degree of 5 everywhere is not excluded by the count.
:::
::::
