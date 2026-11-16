---
title: Faces
course: theory
chapter: planarity
order: 3
lectures: [t06, t07]
goal: Find the faces and facial walks of a planar drawing, and say when two planar drawings of a graph are equivalent.
needs: [theory/planarity/planar-drawings, theory/planarity/polygonal-drawings, theory/walks-connectivity/walks-and-paths]
stage: taught
status: reviewed
---

The lecture drew the planar drawing below. Its vertices and edges cut the plane into pieces,
and the closed walk $W$ runs around one of them. How many pieces are there, and which closed
walk runs around each one?

```graph id=t06-faces-board widget=figure
caption: Five vertices and seven edges, drawn without crossings; the edge $ab$ is a curve. The closed walk $W$ through $b$, $c$ and $d$ runs around the shaded piece of the plane.
intent: From the lecture (theory/2026-10-20 p3, top right; the board has no vertex names, the letters are new). The board marks the triangle W as an example of a facial walk.
layout: fixed
a @(1.6, 2.6); b @(0, 1.6); c @(2, 1.6); d @(0.1, 0.2); e @(1.9, 0)
a -- b [via="(0.6, 2.45)"]; a -- c; b -- c; b -- d; c -- d; d -- e; c -- e
face fW: b c d [label="$W$"]
mark W: b--c c--d b--d
```

Point at the words to find them in the picture: [[fig:t06-faces-board#W|the walk $W$]].

Erase the drawing from the plane. What is left falls apart into pieces, the faces. Here there
are four: three triangles, and the piece around the outside, which goes on without end. That
last one is the outer face. Walking once around a face along its border gives a closed walk,
its facial walk.

## Faces and facial walks

::: definition {#def:face title="Faces and facial walks" defines="face, outer face, facial walk, equivalent drawings" source="theory/2026-10-20 p3"}
Let $D$ be a planar drawing of $G$. The **faces** of $D$ are the arc-connected regions of
$\R^2 \setminus \bigcup D$. (One of them is the **outer face**.)

A closed walk $W \subseteq G$ is a **facial walk** of $D$ if $W$ bounds a face of $D$.

Two planar drawings of $G$ are **equivalent** if they have the same collection of facial walks.
:::

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-10-20-13_44_38-join.pdf p.3 — the board also has a wheel-like drawing (a centre joined to six vertices on a circle) with black curves inside four sectors, two blue curves around pairs of sectors through the centre, and a red "NO!". What it rules out is not legible from the photo, so it is not drawn here. -->

::: intuition
Cut the plane along every vertex and every edge of the drawing. Each piece that is left is a
face: inside a piece, you can get from any point to any other without touching the drawing.
The piece that reaches out without end is the outer face.
:::

In the definition, $\bigcup D$ is the set of all points of the drawing: the points of the
vertices and of all arcs. A region is arc-connected when an arc inside the region joins any two
of its points. A facial walk is a [[def:walk|closed walk]] along the border of one face.

Below we take the faces of the lecture's drawing one by one and walk around each.

```graph id=t06-faces-walks widget=stepper
caption: The four faces of the drawing and their facial walks. Each step shades one more face, and the thick edges are its facial walk. The outer face in the last step is not shaded.
intent: Worked example on the lecture drawing of theory/2026-10-20 p3 (same positions and names as t06-faces-board). New: listing all faces and walks.
layout: fixed
a @(1.6, 2.6); b @(0, 1.6); c @(2, 1.6); d @(0.1, 0.2); e @(1.9, 0)
a -- b [via="(0.6, 2.45)"]; a -- c; b -- c; b -- d; c -- d; d -- e; c -- e
mark W: b--c c--d b--d
mark outer: a--b a--c c--e d--e b--d
step: The drawing $D$: five vertices, seven edges, no crossings.
step: The face $W$. Its facial walk is $b\,c\,d$.
face fW: b c d [label="$W$"]
class bold: b--c c--d b--d
step: The face above it. Its facial walk is $a\,b\,c$.
face fA: a b c
unclass bold: c--d b--d
class bold: a--b a--c
step: The face below it. Its facial walk is $c\,d\,e$.
face fE: c d e
unclass bold: a--b b--c a--c
class bold: c--d d--e c--e
step: The outer face, all around the drawing. Its facial walk is $a\,c\,e\,d\,b$.
unclass bold: c--d
class bold: a--b a--c d--e b--d
```

We write a facial walk by its vertices in order. Where it starts and which way round it runs
do not matter, so $b\,c\,d$ and $d\,c\,b$ are the same walk. The drawing has four faces and
four facial walks. The last one, [[fig:t06-faces-walks#outer|the walk around the outer face]],
uses five of the seven edges.

A facial walk need not be a cycle. In the lecture's next drawing, a small square hangs inside a
big one by the edge from 1 to 5.

```graph id=t06-facial-walk-repeats widget=figure
caption: The shaded face lies between the two squares. Its facial walk $W$ runs 1 2 3 4 1 5 8 7 6 5 and back to 1. It passes the ringed vertices 1 and 5 twice, and the edge 15 once in each direction.
intent: From the lecture (theory/2026-10-20 p3, middle right, the drawing with "!"; same vertex names). Shows that a facial walk can repeat vertices and edges.
layout: fixed
1 @(0, 2); 2 @(2.4, 2); 3 @(2.4, 0); 4 @(0, 0); 5 @(0.8, 1.35); 6 @(1.6, 1.35); 7 @(1.6, 0.65); 8 @(0.8, 0.65)
1 -- 2 -- 3 -- 4 -- 1; 5 -- 6 -- 7 -- 8 -- 5; 1 -- 5
face fW: 1 2 3 4 1 5 8 7 6 5 [label="$W$"]
class highlight: 1 5
mark twice: 1 5 1--5
```

The face between the squares has one closed walk as its border, $W$. It passes
[[fig:t06-facial-walk-repeats#twice|the vertices 1 and 5 and the edge between them]] twice, so
$W$ is a closed walk but not a cycle. The drawing has three faces: inside the small square,
between the squares, and the outer face.

## Equivalent drawings

Two drawings can look different and still have the same facial walks. The lecture drew the
[[def:complete-graph|complete graph]] $K_4$ twice.

```graph id=t06-equivalent-k4 widget=figure
caption: Two planar drawings of $K_4$. In both, the facial walks are 1 2 4, 2 3 4, 1 3 4 and 1 2 3 (the outer face). The drawings are equivalent.
intent: From the lecture (theory/2026-10-20 p3, bottom middle; same vertex names). Two drawings that are mirror images of each other have the same facial walks.
layout: fixed
panel: first
1 @(0, 0); 2 @(1.8, 0); 3 @(1.1, 1.5); 4 @(0.95, 0.55)
1 -- 2; 2 -- 3; 1 -- 3; 1 -- 4; 2 -- 4; 3 -- 4
mark outer: 1--2 2--3 1--3
panel: second
1 @(0, 1.5); 2 @(1.8, 1.5); 3 @(1.1, 0); 4 @(0.95, 0.95)
1 -- 2; 2 -- 3; 1 -- 3; 1 -- 4; 2 -- 4; 3 -- 4
mark outer: 1--2 2--3 1--3
```

The second drawing is the first one turned upside down. In both,
[[fig:t06-equivalent-k4#outer|the triangle 1 2 3]] goes around the outer face, and the three
triangles through 4 go around the inner faces. Same facial walks, so the drawings are
equivalent.

The definition compares only the collections of walks. It does not ask which face is the outer
one. The lecture redrew the squares with the small square outside the big one.

```graph id=t06-equivalent-squares widget=figure
caption: Two planar drawings of the same graph. Both have the facial walks 1 2 3 4, 5 6 7 8 and $W$ = 1 2 3 4 1 5 8 7 6 5. In "square inside", $W$ bounds the face between the squares; in "square outside", it bounds the outer face. The drawings are equivalent.
intent: From the lecture (theory/2026-10-20 p3, middle right: the drawing with "!" and the one below it; same vertex names). Equivalent drawings in which different walks go around the outer face.
layout: fixed
panel: square inside
1 @(0, 2); 2 @(2.4, 2); 3 @(2.4, 0); 4 @(0, 0); 5 @(0.8, 1.35); 6 @(1.6, 1.35); 7 @(1.6, 0.65); 8 @(0.8, 0.65)
1 -- 2 -- 3 -- 4 -- 1; 5 -- 6 -- 7 -- 8 -- 5; 1 -- 5
face fW: 1 2 3 4 1 5 8 7 6 5 [label="$W$"]
mark outer: 1--2 2--3 3--4 1--4
panel: square outside
1 @(1.2, 1.2); 2 @(2.6, 1.2); 3 @(2.6, -0.2); 4 @(1.2, -0.2); 5 @(0.7, 1.7); 6 @(0.7, 2.5); 7 @(-0.1, 2.5); 8 @(-0.1, 1.7)
1 -- 2 -- 3 -- 4 -- 1; 5 -- 6 -- 7 -- 8 -- 5; 1 -- 5
mark outer: 1--2 2--3 3--4 1--4 1--5 5--6 6--7 7--8 5--8
```

Point at [[fig:t06-equivalent-squares#outer|the walk around the outer face]]: in "square
inside" it is 1 2 3 4, in "square outside" it is $W$. Both drawings still have the same three
facial walks, so they are equivalent.

## Plane graphs

The next lecture changes the point of view. A drawing is now recorded by its facial walks only.

::: remark {title="A drawing as a graph with facial walks" source="theory/2026-10-27 p1"}
From now on, a planar drawing of a graph $G$ is the abstract graph $G$ together with the
collection of facial walks, such that the facial walks can be realised in the plane by the
faces of a polygonal-line drawing of $G$.
:::

Such a drawing exists for every planar graph, by the lemma on
[[lem:polygonal-drawing|polygonal drawings]]. As before, $G$ is
[[def:planar-graph|planar]] if $G$ has a planar drawing.

::: definition {#def:plane-graph title="Plane graph" defines="plane graph" source="theory/2026-10-27 p1"}
A **plane graph** $G$ is a graph $G$ together with a given planar drawing of $G$.
:::

::: intuition
"Planar" says that some planar drawing exists. "Plane" says that one planar drawing is fixed,
so its faces and its facial walks are known.
:::

One planar graph can give different plane graphs. Below, the lecture's first drawing is
redrawn with $a$ moved inside the triangle $b\,c\,d$.

```graph id=t06-two-plane-graphs widget=figure
caption: Two planar drawings of the same graph. "a outside" has the facial walks a b c, b c d, c d e and a c e d b. "a inside" has a b c, b a c d, c d e and b c e d. The shaded face is bounded by b c d in "a outside" and by b a c d in "a inside", where the ringed vertex a now sits inside the triangle b c d. Both drawings have four faces, but the walks differ, so they are not equivalent: two different plane graphs.
intent: New figure. The left panel is the lecture drawing of theory/2026-10-20 p3 (positions of t06-faces-board, edge ab straightened); the right panel moves a into the face bcd. A non-example of equivalence, and two plane graphs with the same underlying graph.
layout: fixed
panel: a outside
a @(1.6, 2.6); b @(0, 1.6); c @(2, 1.6); d @(0.1, 0.2); e @(1.9, 0)
a -- b [via="(0.6, 2.45)"]; a -- c; b -- c; b -- d; c -- d; d -- e; c -- e
face fW: b c d
mark bcd: b--c c--d b--d
panel: a inside
a @(0.6, 1.12); b @(0, 1.6); c @(2, 1.6); d @(0.1, 0.2); e @(1.9, 0)
a -- b; a -- c; b -- c; b -- d; c -- d; d -- e; c -- e
face fW: b a c d
class highlight: a
mark bcd: b--c c--d b--d
```

In "a outside", [[fig:t06-two-plane-graphs#bcd|the triangle $b\,c\,d$]] bounds a face. In
"a inside" it does not: the vertex $a$ and two edges lie inside it, and the face there is
bounded by $b\,a\,c\,d$. The two drawings have different facial walks. So they are not
equivalent, and they make one planar graph into two different plane graphs.

::: pitfall
A cycle of a drawing is not always a facial walk. In "a inside" the cycle $b\,c\,d$ has the
vertex $a$ inside, so it bounds no face. And a facial walk is not always a cycle: the walk $W$
between the two squares passes 1 and 5 twice.
:::

## Check yourself

:::: quiz {#q:t06-faces-count}
How many faces does the drawing with the small square inside the big square have?

answer: 3

::: explanation
The faces are the inside of the small square (facial walk 5 6 7 8), the region between the
squares (facial walk $W$ = 1 2 3 4 1 5 8 7 6 5) and the outer face (facial walk 1 2 3 4).
:::
::::

:::: quiz {#q:t06-facial-walk-which}
In the drawing "a inside", which closed walks are facial walks?

- [ ] $b\,c\,d$
- [x] $b\,a\,c\,d$
- [x] $b\,c\,e\,d$
- [ ] $a\,c\,e\,d\,b$

::: explanation
The four faces have the facial walks $a\,b\,c$, $b\,a\,c\,d$, $c\,d\,e$ and $b\,c\,e\,d$ (the
outer face). The cycle $b\,c\,d$ has $a$ inside, so it bounds no face. The walk
$a\,c\,e\,d\,b$ bounds the outer face of the other drawing, "a outside", not of this one.
:::
::::

:::: quiz {#q:t06-same-face-count}
Two planar drawings of the same graph have the same number of faces. Are they equivalent?

- [ ] Yes, always.
- [x] Not necessarily.

::: explanation
Equivalence asks for the same facial walks, not the same number of faces. The drawings
"a outside" and "a inside" both have four faces, but $b\,c\,d$ is a facial walk only in the
first one.
:::
::::
