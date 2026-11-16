---
title: K5 is not planar
course: theory
chapter: planarity
order: 6
lectures: [t07]
goal: Prove that K5 has no planar drawing by counting the sides of the faces that Euler's formula forces.
needs: [theory/planarity/euler-formula, theory/planarity/faces, theory/planarity/planar-drawings, theory/basics/graph-families, theory/basics/multigraphs-and-digraphs]
stage: taught
status: reviewed
---

The lecture drew the [[def:complete-graph|complete graph]] $K_5$ as a pentagon with all its
diagonals, and the diagonals cross. Can we move the vertices and bend the edges so that
nothing crosses?

```graph id=t07-k5-board widget=figure
caption: $K_5$ drawn as a pentagon with its five diagonals: 5 vertices, 10 edges. The diagonals cross in 5 points.
intent: From the lecture (theory/2026-10-27 p3, top right, the green drawing; the board has no vertex names, the numbers are new). Shows where this drawing fails; the page then proves that every drawing fails.
layout: fixed
1 @(1.6, 3.15); 2 @(3.07, 2.08); 3 @(2.51, 0.35); 4 @(0.69, 0.35); 5 @(0.13, 2.08)
1 -- 2 -- 3 -- 4 -- 5 -- 1
1 -- 3; 1 -- 4; 2 -- 4; 2 -- 5; 3 -- 5
mark diagonals: 1--3 1--4 2--4 2--5 3--5
```

Trying drawings one by one never ends, so the lecture counts. Suppose a drawing without
crossings exists. [[thm:euler-formula|Euler's formula]] says that it has 7 faces. Every face
has at least 3 sides, so the faces need at least 21 sides together. But each of the 10 edges
has only 2 sides, so there are 20. We are one side short, and no such drawing exists.

::: proposition {#prop:k5-not-planar title="$K_5$ is not planar" source="theory/2026-10-27 p3"}
$K_5$ is not planar.
:::

::: intuition
However we place five vertices and join every pair, two edges cross. The proof does not look
for the crossing. It counts: ten edges have too few sides for the faces that Euler's formula
demands.
:::

## Why it is true

The proof is a **contradiction by double counting**. We count the sides of all faces once from
the faces and once from the edges, and the two counts disagree.

:::: walkthrough {for=prop:k5-not-planar}
```graph id=t07-k5-proof widget=stepper
caption: A stand-in for the proof: $K_5$ without the edge 3 5, drawn without crossings. It has 9 edges and the 6 faces A to E and O, all triangles. The dashed curve is the tenth edge 3 5 of $K_5$; it has to cross the edge 2 4.
intent: New figure; the lecture has only the drawing of K5 with crossings (t07-k5-board). Since K5 has no plane drawing, the figure shows K5 minus one edge, which has one, with the missing edge dashed. Each step is one step of the written proof (theory/2026-10-27 p3).
layout: fixed
1 @(0, 0); 2 @(3.95, 0); 3 @(1.45, 2.1); 4 @(1.55, 1.22); 5 @(1.64, 0.51)
1 -- 2; 2 -- 3; 3 -- 1; 1 -- 4; 2 -- 4; 3 -- 4; 1 -- 5; 2 -- 5; 4 -- 5
3 -- 5 [class=dashed via="(2.14, 0.97) (1.81, 0.56)"]
mark miss: 3--5
mark tri: 1--4 3--4 1--3
mark side: 1--2
step: Suppose $K_5$ has a planar drawing: 5 vertices, 10 edges, connected.
step: Euler's formula: 10 + 2 - 5 = 7 faces.
face A: 1 4 3 [class=color1 label="A"]
face B: 4 2 3 [class=color1 label="B"]
face C: 1 5 4 [class=color1 label="C"]
face D: 5 2 4 [class=color1 label="D"]
face E: 1 2 5 [class=color1 label="E"]
face O outer: 1 2 3 [label="O"]
mark faces: face:A face:B face:C face:D face:E face:O
step: Every facial walk has length at least 3.
class bold: 1--4 3--4 1--3
step: The sum of the lengths is at least $3 \cdot 7 = 21$.
unclass bold: 1--4 3--4 1--3
class bold: 1--2 2--3 3--1 1--4 2--4 3--4 1--5 2--5 4--5
step: Every edge is counted twice, so the sum is 2 times 10 = 20.
unclass bold: 2--3 3--1 1--4 2--4 3--4 1--5 2--5 4--5
class color2: face:E face:O
unclass color1: face:E
step: The sum is at least 21 and equals 20: a contradiction.
unclass bold: 1--2
unclass color2: face:E face:O
class rejected: 3--5
```

::: step
We argue by contradiction. Suppose $K_5$ has a planar drawing, and fix one. It has 5 vertices
and 10 edges, because every pair of vertices is an edge. It is connected, because any two
vertices are adjacent. The picture is a stand-in, since $K_5$ cannot be drawn: it shows $K_5$
without [[fig:t07-k5-proof#miss|the edge 3 5]].
:::

::: step
Euler's formula applies, because the drawing is a connected plane graph: the number of faces
is $\abs{E} + 2 - \abs{V}$. Here that is 10 + 2 - 5 = 7. The stand-in has 9 edges and
[[fig:t07-k5-proof#faces|6 faces]]. The tenth edge would add a seventh.
:::

::: step
Take a facial walk. Length 0 needs no edges; $K_5$ has 10. Length 1 is a loop; $K_5$
has none. Length 2 is two parallel edges, absent in $K_5$, or one edge there and back, which
needs a vertex of degree 1; all have degree 4. So each length is at least 3. Here:
[[fig:t07-k5-proof#tri|the walk 1 4 3]].
:::

::: step
Add the lengths of the 7 facial walks. Each is at least 3, so the sum is at least $3 \cdot 7$,
which is 21. In the stand-in, all 6 faces have length 3, so the sum there is 18.
:::

::: step
Each edge has two sides, and each side lies on one facial walk. So every edge is counted
twice in the sum. Here [[fig:t07-k5-proof#side|the edge 1 2]] is counted once in E and once in
O. The sum equals $2 \cdot 10$, which is 20. The stand-in gives 18, which is $2 \cdot 9$.
:::

::: step
The sum is at least 21 and equals 20. That is impossible: 21 is more than 20, or in the
lecture's form, $10 \ge 21/2 = 10.5$. So the drawing of step 1 does not exist, and $K_5$ is
not planar. We used that $K_5$ is connected (Euler) and simple and without vertices of degree 1 (lengths at least 3).
:::
::::

:::: proof {title="Proof that $K_5$ is not planar"}
By contradiction. Suppose $K_5$ has a planar drawing. Then $\abs{V(K_5)} = 5$ and
$\abs{E(K_5)} = 10$, so by Euler's formula the drawing has 7 faces.

Every face of $K_5$ has length at least 3, so the sum of the lengths of all facial walks of
$K_5$ is at least $3 \cdot 7 = 21$. Every edge of $K_5$ has been counted twice in this sum,
and so
$$\abs{E(K_5)} \ge \frac{21}{2} > \abs{E(K_5)},$$
a contradiction.
::::

::: pitfall
The count does not rule out $K_5$ without one edge. Its 9 edges have 18 sides, exactly enough
for 6 faces of length 3. [[fig:t07-k5-proof#faces|The figure]] draws it.
:::

## Edge bounds for planar graphs

The lecture ends the page with an exercise: the number of edges of a plane graph is bounded by
its number of vertices.

:::: exercise {#exr:t07-edge-bounds title="Edge bounds" difficulty=2 source="theory/2026-10-27 p3"}
For every connected plane multigraph $G$ with at least one edge and without faces of length 1
or 2,
$$\abs{E(G)} \le 3 \cdot \abs{V(G)} - 6,$$
and if there are no faces of length 1, 2, 3, then
$$\abs{E(G)} \le 2 \cdot \abs{V(G)} - 4.$$
::::

<!-- REVIEW: the board says "for every plane multigraph without faces of length 1 or 2". Euler's formula, which the bounds need, is stated for connected graphs, so "connected" is added, as on the page on Euler's formula. A single vertex also fails: it has 0 edges and one face of length 0, and 0 is not at most 3 - 6. Added "with at least one edge". -->

Next to it the lecture drew two graphs in red. They reach the bounds.

```graph id=t07-edge-bounds-examples widget=figure
caption: The octahedron has 6 vertices, 12 edges and 8 faces, all of length 3, so 12 = 3 · 6 - 6. The cube has 8 vertices, 12 edges and 6 faces, all of length 4, so 12 = 2 · 8 - 4. Both reach their bound.
intent: From the lecture (theory/2026-10-27 p3, the two red drawings at the bottom right: a triangle inside a triangle, and a square inside a square, each with its vertices joined; the board has no names, the numbers are new). Reading the top one as the octahedron is ours. Examples for the exercise.
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

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-10-27-13_48_43-join.pdf p.3 — the two red drawings have no caption and the top one is only partly legible. They are read as examples that reach the bounds; the top one as the octahedron. -->

## Check yourself

:::: quiz {#q:t07-k5-faces}
A connected plane graph has 5 vertices and 9 edges. How many faces does it have?

answer: 6

::: explanation
By Euler's formula, 5 plus the number of faces minus 9 is 2, so there are 6 faces. The
stand-in of the proof, $K_5$ without one edge, is an example.
:::
::::

:::: quiz {#q:t07-k5-simple}
Where does the proof use that $K_5$ has no loops and no parallel edges?

- [ ] To apply Euler's formula.
- [x] To show that every facial walk has length at least 3.
- [ ] To show that every edge is counted twice.

::: explanation
A loop can bound a face of length 1, and two parallel edges can bound a face of length 2. Euler's
formula needs only that the graph is connected, and each edge has two sides in any plane
multigraph.
:::
::::

## More

For $K_5$ the first bound of the exercise reads $10 \le 3 \cdot 5 - 6 = 9$, which is false. So
the exercise gives a second proof that $K_5$ is not planar.
