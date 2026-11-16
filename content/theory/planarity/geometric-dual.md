---
title: The geometric dual
course: theory
chapter: planarity
order: 4
lectures: [t07]
goal: Build the geometric dual of a plane graph, with one vertex for each face and one edge across each edge.
needs: [theory/planarity/faces]
stage: taught
status: reviewed
---

The lecture drew the plane graph $G$ below: a small pentagon inside a big one, joined by five
spokes. Its drawing has seven faces, named by letters. Put a new vertex into each face. For
every edge of $G$, draw a new edge across it that joins the faces on its two sides. What graph
do we get?

```graph id=t07-dual-faces widget=figure
caption: The lecture's plane graph $G$: 10 vertices and 15 edges. Its seven faces are the pentagon $P$ in the middle, the five four-sided faces $A$ to $E$ around it, and the outer face $O$.
intent: From the lecture (theory/2026-10-27 p1, the big drawing on the right, in green; the board has no vertex or face names, the numbers and letters are new). The faces that become the vertices of G*.
layout: fixed
1 @(2.3, 4.8); 2 @(4.45, 2.65); 3 @(3.35, 0); 4 @(0.74, 0.2); 5 @(0, 2.73); 6 @(2.03, 3.47); 7 @(3.32, 2.61); 8 @(2.85, 1.17); 9 @(1.87, 1.13); 10 @(1.33, 2.65)
1 -- 2 -- 3 -- 4 -- 5 -- 1
6 -- 7 -- 8 -- 9 -- 10 -- 6
1 -- 6; 2 -- 7; 3 -- 8; 4 -- 9; 5 -- 10
face fA: 1 2 7 6 [label="A"]
face fB: 2 3 8 7 [label="B"]
face fC: 3 4 9 8 [label="C"]
face fD: 4 5 10 9 [label="D"]
face fE: 5 1 6 10 [label="E"]
face fP: 6 7 8 9 10 [label="P"]
face fO outer: 1 2 3 4 5 [label="O"]
mark P: face:fP
mark B: face:fB
```

Point at the words to find them in the picture: [[fig:t07-dual-faces#P|the face $P$]] and
[[fig:t07-dual-faces#B|the face $B$]]. The new graph is the geometric dual. It has one vertex
for each face, so seven vertices. It has one edge for each edge of $G$, so fifteen edges. Each
new edge joins the two faces that lie on the two sides of its edge.

## The definition

The lecture names each face by its facial walk, as on the page on [[def:face|faces]]: the face
$B$ is the facial walk 2 3 8 7.

::: definition {#def:geometric-dual title="Geometric dual" defines="geometric dual, dual" source="theory/2026-10-27 p1"}
The **geometric dual** $G^*$ of a plane (multi)graph $G$ has

- the vertices $V(G^*) =$ the facial walks of $G$, one for each face of $G$,
- the edges "$E(G^*) = E(G)$", and an edge $e \in E(G)$ joins in $G^*$ the two (or one)
  facial walks containing $e$.
:::

<!-- REVIEW: the board says "V(G*) = the set of facial walks of G". The inside and the outside of a cycle have the same facial walk, so as a set they would give the dual of the square one vertex; the board draws two (2026-10-27 p1, bottom left). Changed to "the facial walks of G, one for each face of G". -->

::: intuition
Put a dot in every face. For every edge, draw a curve that crosses this edge once and joins
the dots on its two sides. The dots and curves form the dual. An edge with the same face on
both sides gives a loop.
:::

The quotes around "$E(G^*) = E(G)$" are the lecture's. They say that the dual has no new
edges: each edge $e$ of $G$ is also an edge of the dual, there joining two faces. The figures
give both the same name.

## Building the dual, edge by edge

We build the dual of the lecture's graph. The dual is drawn dashed, with its vertices inside
the faces of $G$.

```graph id=t07-dual-board widget=stepper
caption: The dual of the lecture's plane graph, built one group of edges at a time. Each dashed edge of the dual crosses exactly one edge of $G$, its own.
intent: From the lecture (theory/2026-10-27 p1, the big drawing on the right: G in green, G* in red, the edge e marked in both). Same graph and positions as t07-dual-faces. The board puts the outer vertex O at the top right too; the route of each edge to O is redrawn.
layout: fixed
1 @(2.3, 4.8); 2 @(4.45, 2.65); 3 @(3.35, 0); 4 @(0.74, 0.2); 5 @(0, 2.73); 6 @(2.03, 3.47); 7 @(3.32, 2.61); 8 @(2.85, 1.17); 9 @(1.87, 1.13); 10 @(1.33, 2.65)
1 -- 2 -- 3 -- 4 -- 5 -- 1
6 -- 7; 7 -- 8 [label="$e$"]; 8 -- 9 -- 10 -- 6
1 -- 6; 2 -- 7; 3 -- 8; 4 -- 9; 5 -- 10
A @(3.03, 3.38) [class=dual]; B @(3.49, 1.61) [class=dual]; C @(2.2, 0.63) [class=dual]; D @(0.99, 1.68) [class=dual]; E @(1.42, 3.41) [class=dual]; P @(2.28, 2.21) [class=dual]; O @(4.3, 4.6) [class=dual]
mark e: 7--8
mark P: P
step: One new vertex inside each face of $G$: the seven vertices of the dual.
step: The edge $e$ lies on the faces $P$ and $B$, so in the dual it joins $P$ and $B$.
P -- B [class=dual label="$e$" via="(3.085, 1.89)"]
class bold: 7--8
step: The other four edges of the small pentagon join $P$ to $A$, $C$, $D$ and $E$.
P -- A [class=dual via="(2.675, 3.04)"]; P -- C [class=dual via="(2.36, 1.15)"]; P -- D [class=dual via="(1.6, 1.89)"]; P -- E [class=dual via="(1.68, 3.06)"]
unclass bold: 7--8
class bold: 6--7 8--9 9--10 6--10
step: Each spoke lies between two neighbouring four-sided faces, so $A$, $B$, $C$, $D$, $E$ become a cycle.
E -- A [class=dual via="(2.165, 4.135)"]; A -- B [class=dual via="(3.885, 2.63)"]; B -- C [class=dual via="(3.1, 0.585)"]; C -- D [class=dual via="(1.305, 0.665)"]; D -- E [class=dual via="(0.665, 2.69)"]
unclass bold: 6--7 8--9 9--10 6--10
class bold: 1--6 2--7 3--8 4--9 5--10
step: Each edge of the big pentagon lies between the outer face $O$ and a four-sided face.
A -- O [class=dual via="(3.375, 3.725)"]
B -- O [class=dual via="(3.9, 1.325) (4.8, 1.7) (5.05, 3.0)"]
C -- O [class=dual via="(2.045, 0.1) (2.4, -0.55) (4.3, -0.55) (5.65, 1.5) (5.6, 3.7)"]
E -- O [class=dual via="(1.15, 3.765) (1.2, 4.75) (2.3, 5.5) (3.6, 5.2)"]
D -- O [class=dual via="(0.37, 1.465) (-0.55, 1.6) (-0.6, 3.8) (0.7, 5.75) (2.6, 6.2) (4.2, 5.6)"]
unclass bold: 1--6 2--7 3--8 4--9 5--10
class bold: 1--2 2--3 3--4 4--5 1--5
step: The dual alone, with $G$ muted: 7 vertices and 15 edges.
unclass bold: 1--2 2--3 3--4 4--5 1--5
class muted: 1 2 3 4 5 6 7 8 9 10 1--2 2--3 3--4 4--5 1--5 6--7 7--8 8--9 9--10 6--10 1--6 2--7 3--8 4--9 5--10
```

[[fig:t07-dual-board#e|The edge $e$]] runs along two facial walks: the walk 6 7 8 9 10 of the
face $P$ and the walk 2 3 8 7 of the face $B$. So in the dual, $e$ joins
[[fig:t07-dual-board#P|the vertex $P$]] and $B$. In the same way, each spoke such as 2 7 lies
between two of the faces $A$ to $E$. Count the edges: five at $P$, five around the ring and
five at $O$. That makes 15, as many as $G$ has.

## Parallel edges and loops

The lecture wrote "(multi)" into the definition and "(or one)" into the rule for the edges. Its
two small drawings show why.

```graph id=t07-dual-multi widget=stepper
caption: The dual of a square has two vertices and four parallel edges. After adding a pendant edge inside, the dual also has a loop.
intent: From the lecture (theory/2026-10-27 p1, the two small drawings at the bottom right: the square, and the square with an edge hanging inside, each with its dual in red; vertex names are new). The board has the two as separate drawings; here the second one grows out of the first.
layout: fixed
1 @(0, 1.75); 2 @(1.95, 1.7); 3 @(1.9, 0); 4 @(0, 0.15)
1 -- 2 -- 3 -- 4 -- 1
step: The square $G$. It has two faces, the inside and the outside.
step: The dual: $I$ inside, $O$ outside, and one edge across each side of the square.
I @(0.55, 0.65) [class=dual]; O @(2.85, 0.85) [class=dual]
I -- O [class=dual via="(1.1, 0.38) (1.925, 0.7)"]
I -- O [class=dual via="(0.6, 0.12) (1.2, -0.35) (2.5, -0.3)"]
I -- O [class=dual via="(0.3, 1.2) (0.6, 1.74) (1.5, 2.15) (2.5, 2.0)"]
I -- O [class=dual via="(0, 0.95) (-0.45, 1.1) (-0.3, 2.35) (1.5, 2.65) (3.1, 2.1)"]
mark parallel: I--O I--O#2 I--O#3 I--O#4
step: Add the vertex 5 and the thick edge from 2 to 5 inside the square.
5 @(1.05, 1.05)
2 -- 5 [class=bold]
mark pendant: 2--5
step: The edge 2 5 lies on the inner face only, so in the dual it is a loop at $I$.
I -- I [class=dual via="(1.2, 0.72) (1.6, 1.1) (1.35, 1.55) (0.75, 1.4)"]
```

The square has two faces, and each of its four sides lies between them. So the dual has two
vertices and [[fig:t07-dual-multi#parallel|four parallel edges]]: it is a
[[def:mixed-multigraph|multigraph]], not a graph. Now add [[fig:t07-dual-multi#pendant|the edge
2 5]] inside. The inner facial walk becomes 1 2 5 2 3 4, and it runs along 2 5 twice. The
outer walk 1 2 3 4 misses 2 5. So 2 5 lies on one facial walk only, and in the dual it is a
loop at $I$.

::: pitfall
The dual has one vertex for each face, even when two faces have the same facial walk. The
inside and the outside of the square both have the walk 1 2 3 4, so the dual has two vertices.
:::

## The dual of the dual

The dual comes with a drawing: each vertex inside its face, each edge across its edge of $G$.
So the dual is a plane multigraph too, and we can take its dual. The lecture leaves the result
as an exercise.

:::: exercise {#exr:t07-dual-of-dual title="The dual of the dual" difficulty=2 source="theory/2026-10-27 p2"}
$(G^*)^* = G$ for connected plane multigraphs.
::::

<!-- REVIEW: the board says "for plane multigraphs". The dual is always connected, so for a disconnected G the equality fails; the faces of a disconnected drawing are also not bounded by single closed walks. Added "connected", as the board does for Euler's formula on the same page. -->

The figure takes the dual twice for the lecture's square.

```graph id=t07-dual-of-dual widget=stepper
caption: The dual of the dual of a square. The dual has four faces, each holding one vertex of the square; taking the dual again gives the square back.
intent: From the lecture (theory/2026-10-27 p1, bottom left: the square with its dual in red, the outer vertex on the left; vertex names are new). New: the second dual, for the exercise (G*)* = G on p2. Drawn by hand, since dual() refuses multigraphs.
layout: fixed
1 @(0.9, 2.4); 2 @(2.34, 2.7); 3 @(2.76, 0.24); 4 @(1.38, 0.42)
I @(1.92, 1.5) [class=dual]; O @(0.36, 1.44) [class=dual]
1 -- 2 -- 3 -- 4 -- 1
I -- O [class=dual via="(1.14, 1.41)"]
I -- O [class=dual via="(1.62, 2.55) (1.1, 3.1) (0.1, 2.6)"]
I -- O [class=dual via="(2.07, 0.33) (1.3, -0.15) (0.3, 0.5)"]
I -- O [class=dual via="(2.55, 1.47) (3.35, 1.2) (3.2, -0.4) (1.4, -0.65) (-0.2, 0.4)"]
mark corners: 1 2 3 4
step: The square $G$ and its dual, dashed: two vertices and four parallel edges.
step: The dual alone, with the vertices of $G$ muted. It has four faces, one between each two neighbouring parallel edges.
class hidden: 1--2 2--3 3--4 1--4
class muted: 1 2 3 4
step: Each face of the dual holds exactly one vertex of $G$. The dual of the dual gets one vertex per face; we put it there.
unclass muted: 1 2 3 4
class highlight: 1 2 3 4
step: Each dashed edge lies between two of these faces. Its new edge crosses it and joins their vertices: the four thick edges.
unclass hidden: 1--2 2--3 3--4 1--4
class bold: 1--2 2--3 3--4 1--4
step: The dual of the dual alone, with the dual muted: the square $G$ again.
unclass highlight: 1 2 3 4
unclass bold: 1--2 2--3 3--4 1--4
class muted: I O I--O I--O#2 I--O#3 I--O#4
```

In the second step, [[fig:t07-dual-of-dual#corners|the four corners]] sit one in each face of
the dual. Each dashed edge separates two neighbouring corners, and the new edge across it is a
side of the square. So the dual of the dual has the vertices 1, 2, 3, 4 and the edges of the
square: it is $G$ again.

## Check yourself

:::: quiz {#q:t07-dual-vertices}
The lecture's plane graph $G$, the pentagon inside a pentagon, has 10 vertices and 15 edges.
How many vertices does its dual have?

answer: 7

::: explanation
The dual has one vertex for each face of $G$. The faces are the small pentagon $P$, the five
four-sided faces $A$ to $E$ and the outer face $O$: seven faces, so seven vertices.
:::
::::

:::: quiz {#q:t07-dual-loop}
In the square with the extra edge 2 5 inside, which edge of $G$ becomes a loop in the dual?

- [ ] 1 2
- [x] 2 5
- [ ] 2 3
- [ ] none: the dual of a plane graph has no loops

::: explanation
An edge becomes a loop when it lies on only one facial walk. The edge 2 5 lies only on the inner
walk 1 2 5 2 3 4, which runs along it twice. Each side of the square lies on the inner walk and
on the outer walk 1 2 3 4, so it joins $I$ and $O$.
:::
::::

:::: quiz {#q:t07-dual-edges}
A plane graph has 9 edges. How many edges does its dual have?

answer: 9

::: explanation
"$E(G^*) = E(G)$": every edge of $G$ is an edge of the dual, and the dual has no others.
:::
::::
