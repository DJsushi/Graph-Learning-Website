---
title: Planar drawings
course: theory
chapter: planarity
order: 1
lectures: [t06]
goal: Say when a drawing of a graph in the plane is planar, and when a graph is planar.
needs: [theory/basics/multigraphs-and-digraphs, theory/basics/graph-families]
stage: taught
status: draft
---

The lecture drew the graph below on the board. Some edges are curves, and two edges join the
same pair of vertices, so it is a [[def:mixed-multigraph|multigraph]]. Still, no two lines cross and no line runs through a vertex. When can we
draw a graph like this?

```graph id=t06-board-drawing widget=figure
caption: Five vertices and seven edges. Two parallel edges join 1 and 3, one over the top and one around the bottom. No two edges meet except at a common end.
intent: Transcription of the lecture drawing (theory/2026-10-20 p1, right; the board has no vertex names, the numbers are new). A first look at a planar drawing of a multigraph with curved edges.
layout: fixed
1 @(0.76, 2.32); 2 @(2.02, 2.6); 3 @(2.78, 1.7); 4 @(1.04, 0.92); 5 @(2.06, 0.9)
1 -- 2; 1 -- 4; 1 -- 5; 2 -- 5; 2 -- 3
1 -- 3 [via="(1.4, 2.88) (2.1, 3.1) (2.82, 2.66)"]
1 -- 3 [via="(0.3, 1.7) (0.45, 0.6) (1.5, 0.28) (2.7, 0.5) (3.18, 1.25)"]
mark parallel: 1--3 1--3#2
```

Point at the words to find them in the picture:
[[fig:t06-board-drawing#parallel|the two edges between 1 and 3]]. Both are curves, and they
meet only at their ends.

A planar drawing puts every vertex at its own point of the plane and every edge on its own
curve. The curve joins the two ends of the edge, avoids every other vertex and touches no other
curve. A graph is planar when it has at least one such drawing.

## Drawing a graph

The curves of a drawing are open arcs. The lecture drew two of them.

```graph id=t06-open-arcs widget=figure
caption: An open arc $\alpha$ from $u = \alpha(0)$ to $v = \alpha(1)$, and the arc of a loop, whose two ends are the same point: $\alpha(0) = \alpha(1) = u$. The ends are not part of the open arc.
intent: From the lecture (theory/2026-10-20 p1, the two small drawings under the graph). The arc of an edge uv and of a loop, with the ends marked as vertices.
layout: fixed
panel: an arc
u @(0, 0); v @(2.2, 0.3)
u -- v [label="$\alpha$" via="(0.5, -0.45) (1.1, -0.55) (1.5, 0.2)"]
panel: a loop
u @(0, 0)
u -- u [label="$\alpha$" via="(-0.1, 0.9) (0.8, 1.2) (1.1, 0.4)"]
```

::: definition {#def:planar-drawing title="Planar drawing" defines="planar drawing, open arc" source="theory/2026-10-20 p1"}
An **open arc** is the image $\alpha((0,1))$ of a map $\alpha : [0,1] \to \R^2$ that is
continuous on $[0,1]$ and injective on $(0,1)$. Its **ends** are $\alpha(0)$ and $\alpha(1)$.

A **planar drawing** of a (multi)graph $G$ is

1. an injective map $V(G) \to \R^2$, and
2. a map $E(G) \to \set{\alpha \,;\, \alpha \subseteq \R^2 \text{ is an open arc}}$,

such that every edge $e = uv \in E(G)$ is mapped to an arc with ends $u, v$ that is disjoint
from all vertices of $G$, and for all $e, f \in E(G)$ with $e \ne f$ the arcs of $e$ and $f$
are disjoint.
:::

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-10-20-13_44_38-join.pdf p.1 — the board says "continuous inj. image of (0,1)" with "(on [0,1])" written over "continuous". The loop drawn next to it has α(0) = α(1), so injectivity cannot be meant at both ends; read here as continuous on [0,1], injective on (0,1). -->

::: intuition
Put each vertex on its own point. Draw each edge as one curve from one end to the other that
never passes a point twice; a loop ends where it starts. A curve touches vertices only at its
ends. Two curves never meet, except at a common end.
:::

In the definition, $u$ and $v$ stand for the points the vertices go to. The arc is open, so its
ends are not on it. That is why two edges with a common end can have disjoint arcs: in the
first picture, five edges leave 1.

The figure below breaks the rule "disjoint from all vertices", and then keeps it.

```graph id=t06-arc-through-vertex widget=figure
caption: Two drawings of the same graph. In "through x" the straight arc of $ac$ passes through $x$, which is not one of its ends, so this is not a planar drawing; it even looks like two edges $ax$ and $xc$. In "around x" the arc of $ac$ bends below $x$, and the drawing is planar.
intent: New figure (the lecture states the rule without a picture). A non-example and an example of the rule "the arc of e is disjoint from all vertices of G" on the same graph.
layout: fixed
panel: through x
a @(0, 0); x @(1, 0); c @(2, 0); y @(1, 1)
a -- y; c -- y; x -- y
a -- c [class=rejected]
panel: around x
a @(0, 0); x @(1, 0); c @(2, 0); y @(1, 1)
a -- y; c -- y; x -- y
a -- c [class=highlight via="(1, -0.55)"]
```

## Planar graphs

::: definition {#def:planar-graph title="Planar graph" defines="planar" source="theory/2026-10-20 p1"}
$G$ is **planar** if $G$ has a planar drawing.
:::

::: intuition
Planar is a property of the graph, not of one picture. One planar drawing is enough. A drawing
with crossings proves nothing, because another drawing of the same graph may have none.
:::

Below, we draw the [[def:complete-graph|complete graph]] $K_4$ step by step, following the two maps of the definition. The first try
fails, and one curved edge repairs it.

```graph id=t06-drawing-k4 widget=stepper
caption: A planar drawing of $K_4$, built map by map. The straight drawing has a crossing; rerouting one edge removes it.
intent: New figure (the lecture has no example). Shows the two maps of the definition, a drawing that breaks the rule "arcs are disjoint", and that the graph is still planar.
layout: fixed
a @(0, 1.2); b @(1.6, 1.2); c @(1.6, 0); d @(0, 0)
step: Map 1: the four vertices of $K_4$ go to four different points.
step: Map 2 begins: the edges $ab$, $bc$, $cd$ and $da$ become straight arcs. They meet only at common ends.
a -- b; b -- c; c -- d; d -- a
step: The edge $ac$ goes straight across. Still no two arcs meet.
a -- c
step: The edge $bd$ straight across meets the arc of $ac$ in the middle. This is not a planar drawing.
b -- d [class=rejected]
mark crossing: a--c b--d
step: Draw $bd$ around the outside instead. Now all six arcs are disjoint: a planar drawing, so $K_4$ is planar.
set b--d [via="(2.35, 0.9) (2.2, -0.55) (0.7, -0.7)"]
unclass rejected: b--d
class highlight: b--d
```

The fourth step shows a drawing that is not planar:
[[fig:t06-drawing-k4#crossing|the arcs of $ac$ and $bd$]] meet. That says nothing about $K_4$:
the fifth step draws the same graph again, and this time every pair of arcs is disjoint.

Try it yourself. The drawing below has crossings, but the graph is planar. Drag the vertices
until no two edges cross.

```graph id=t06-untangle widget=editable
caption: A drawing of a planar graph with crossings. Drag the vertices until no two edges cross. "planar" is about the graph: it says whether some planar drawing exists, whatever the current picture looks like.
intent: New figure. Lets the reader find a planar drawing by hand, and separates "this drawing has crossings" from "the graph is not planar". Starts as the triangular prism (two triangles 123 and 456 joined by 14, 25, 36) with three crossings.
layout: fixed
live: planar, edge-count
allow: move add-edge delete-edge
1 @(1, 0.25); 2 @(1, 1.5); 3 @(0, 0); 4 @(2, 0.25); 5 @(3, 0); 6 @(2, 1.5)
1 -- 2 -- 3 -- 1
4 -- 5 -- 6 -- 4
1 -- 4; 2 -- 5; 3 -- 6
```

::: pitfall
"Disjoint arcs" does not forbid edges with a common end. The arcs are open, so the shared
vertex is on neither of them. The definition forbids two curves that meet at a point that is
not a vertex, and a curve that runs through a vertex that is not one of its ends.
:::

## Check yourself

:::: quiz {#q:t06-crossing-drawing}
A drawing of a graph $G$ has two edges that cross. What follows?

- [ ] $G$ is not planar.
- [ ] $G$ is planar.
- [x] This drawing is not a planar drawing. $G$ may still be planar.

::: explanation
The arcs of the two edges meet, so this drawing breaks the definition. A graph is planar when
*some* planar drawing exists, so one bad drawing decides nothing. In the $K_4$ example the
straight drawing has a crossing, yet rerouting one edge gives a planar drawing.
:::
::::

:::: quiz {#q:t06-which-breaks}
Which of these breaks the definition of a planar drawing?

- [ ] An edge drawn as a wavy curve.
- [ ] Two parallel edges drawn as two curves that meet only at their two common ends.
- [x] An edge whose curve passes through a vertex that is not one of its ends.
- [ ] A loop drawn as a closed curve that starts and ends at its vertex.

::: explanation
An arc may be any continuous curve that does not pass a point twice, so a wavy curve is fine.
The arcs are open, so common ends are not on them: parallel edges as in the lecture's drawing
are allowed. A loop's arc has $\alpha(0) = \alpha(1)$, which the definition allows. But the arc
of every edge must be disjoint from all vertices of $G$.
:::
::::
