---
title: "Girth and regular graphs"
course: theory
chapter: degrees
order: 6
lectures: [t03]
goal: Find the length of the shortest cycle of a graph, and recognise graphs in which every vertex has the same degree.
needs: [theory/basics/graph-families, theory/degrees/degrees-and-handshake, theory/basics/multigraphs-and-digraphs]
stage: taught
status: reviewed
---

Both graphs below have six vertices, and every vertex has three neighbours. In the prism, three
edges already lead around and back to the start. How many edges does the shortest round trip in
$K_{3,3}$ need?

```graph id=t03-girth-question widget=figure
caption: Two graphs with six vertices, each of degree 3. The prism has a triangle, marked. Does $K_{3,3}$ have one?
intent: New figure for the opening question. The lecture defines girth on theory/2026-09-29 p8 and draws only the Petersen graph; K_{3,3} has the positions of t03-girth-k33.
layout: fixed
panel: prism
a @(0, 0); b @(3, 0); c @(1.5, 1.3); x @(1, 0.35); y @(2, 0.35); z @(1.5, 0.85)
a -- b [class=cycle]; b -- c [class=cycle]; c -- a [class=cycle]
x -- y; y -- z; z -- x; a -- x; b -- y; c -- z
panel: $K_{3,3}$
u1 @(0, 1.3); u2 @(1.5, 1.3); u3 @(3, 1.3); w1 @(0, 0); w2 @(1.5, 0); w3 @(3, 0)
u1 -- w1; u1 -- w2; u1 -- w3; u2 -- w1; u2 -- w2; u2 -- w3; u3 -- w1; u3 -- w2; u3 -- w3
```

In $K_{3,3}$ every edge joins the top row to the bottom row. So a round trip changes rows at
every edge, and it needs an even number of edges to get back. Three edges are not enough, but
four are.

The number of edges of the shortest cycle is the **girth**. The prism has girth 3, and $K_{3,3}$
has girth 4. A graph in which every vertex has the same degree is **regular**. Both graphs here
are 3-regular.

::: definition {#def:girth title="Girth, regular graph" defines="girth, regular, d-regular" source="theory/2026-09-29 p8"}
The **girth** of a graph $G$ is the length of the shortest [[def:cycle-graph|cycle]] in $G$ ($\infty$ if $G$ is [[def:forest-tree|acyclic]]). A
graph is **$d$-regular** if every vertex has [[def:degree|degree]] $d$.
:::

::: intuition
The girth counts the edges of the shortest cycle. A graph with no cycle at all has girth
$\infty$. A graph is $d$-regular when every vertex has degree $d$, so all vertices look the
same as far as degrees go.
:::

Here is the search for the shortest cycle of $K_{3,3}$, one cycle at a time.

```graph id=t03-girth-k33 widget=stepper
caption: The girth of $K_{3,3}$. A cycle of length 6, a shorter one of length 4, and no triangle.
intent: New worked example; the lecture has none for the definition (theory/2026-09-29 p8). The same positions as the K_{3,3} panel of t03-girth-question.
layout: fixed
u1 @(0, 1.3); u2 @(1.5, 1.3); u3 @(3, 1.3); w1 @(0, 0); w2 @(1.5, 0); w3 @(3, 0)
u1 -- w1; u1 -- w2; u1 -- w3; u2 -- w1; u2 -- w2; u2 -- w3; u3 -- w1; u3 -- w2; u3 -- w3
step: Vertex u1 has the three neighbours w1, w2 and w3. Every vertex has three, so the graph is 3-regular.
class current: u1
class highlight: u1--w1 u1--w2 u1--w3
step: A cycle through all six vertices has length 6.
unclass current: u1
unclass highlight: u1--w1 u1--w2 u1--w3
class cycle: u1--w1 u2--w1 u2--w2 u3--w2 u3--w3 u1--w3
step: A shorter cycle, u1 w1 u2 w2, has length 4.
unclass cycle: u3--w2 u3--w3 u1--w3
class cycle: u1--w2
step: A triangle would need an edge inside a row, such as the dashed u1u2. There is none, so the girth is 4.
unclass cycle: u1--w1 u2--w1 u2--w2 u1--w2
class path: u1--w1 u2--w1
u1 -- u2 [class=dashed]
```

The cycle of length 6 is a cycle, but not the shortest. The girth asks for the shortest one,
so we keep looking until no shorter cycle can exist.

The same reasoning gives the girth of whole families. A [[def:complete-graph|complete graph]]
with at least 3 vertices has girth 3, since any three vertices form a triangle. A complete
bipartite graph with at least 2 vertices on each side has girth 4, as $K_{3,3}$ does. The cycle
$C_n$ has girth $n$, because its only cycle is the whole graph.

The lecture's example is the Petersen graph. It is 3-regular, and its shortest cycles, such as
[[fig:t03-petersen#five|the cycle 0, 1, 2, 3, 4]], have length 5.

```graph id=t03-petersen widget=figure
caption: The Petersen graph is 3-regular and has girth 5.
intent: The example drawn in the lecture next to the theorem.
height: small
use: Petersen
mark five: 0--1 1--2 2--3 3--4 4--0
```

::: pitfall
A simple graph has girth at least $3$. In a [[def:mixed-multigraph|multigraph]] we count a loop
as a cycle of length $1$ and two parallel edges as a cycle of length $2$, so there the girth
can be $1$ or $2$. And the girth is the **shortest** cycle, not the longest: $K_4$ has a $4$-cycle
but girth $3$.
:::

## Check yourself

:::: quiz {#q:t03-girth-add-edge}
Add the dashed edge u1u2 from the last step to $K_{3,3}$. What is true of the new graph?

- [ ] It is 3-regular, and its girth is 4.
- [ ] It is 4-regular, and its girth is 3.
- [x] It is not regular, and its girth is 3.
- [ ] It is not regular, and its girth is 4.

::: explanation
Now u1 and u2 have degree 4, and the other four vertices still have degree 3, so the graph is
not regular. The new edge closes the triangle u1, u2, w1 with the edges u1w1 and u2w1. A simple
graph has no shorter cycle, so the girth is 3.
:::
::::

:::: quiz {#q:t03-girth-infinite}
Which of these graphs has girth $\infty$?

- [ ] the cycle $C_6$
- [x] the path $P_3$
- [ ] $K_{3,3}$
- [ ] the prism

::: explanation
The path $P_3$ has no cycle at all, so it has no shortest cycle, and the definition sets its
girth to $\infty$. The others have girth 6, 4 and 3.
:::
::::

## More

Large girth means that the graph looks like a tree nearby: if the girth is at least $k$, two
different [[def:path-graph|paths]] from a vertex $v$ of length less than $k/2$ never meet again,
since together they would close a cycle shorter than $k$. A [[def:forest-tree|tree]] has girth
$\infty$, and $K_4$ is 3-regular with girth 3.

Many edges at every vertex and no short cycles pull in opposite directions. Still,
[[thm:regular-large-girth|for every $d$ and $k$ there is a $d$-regular graph of girth at least
$k$]]. The Petersen graph is such a graph for $d = 3$ and $k = 5$.
