---
title: "Isomorphism"
course: theory
chapter: basics
order: 4
lectures: [t01]
goal: Decide when two graphs are the same up to the names of their vertices, and check a given bijection pair by pair.
needs: [theory/basics/graphs, theory/basics/graph-families, theory/basics/multigraphs-and-digraphs]
stage: taught
status: reviewed
---

The lecture drew the two graphs below. In the first, no edges cross. In the second, two edges
cross. Is there any real difference between them?

```graph id=t01-iso-c4 widget=figure
caption: Two drawings of $C_4$. The bijection $f(a)=1,\ f(b)=2,\ f(c)=3,\ f(d)=4$ maps edges to edges and non-edges to non-edges.
intent: Transcription of the lecture example. The second drawing has a crossing, yet the graphs are isomorphic; the mapping is given by the labels.
layout: fixed
panel: $G$
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
a -- b -- c -- d -- a
panel: $H$
1 @(0, 1); 2 @(1, 1); 3 @(0, 0); 4 @(1, 0)
1 -- 2 -- 3 -- 4 -- 1
```

No. Both are a [[def:cycle-graph|cycle]] on four vertices. Rename the vertices of $G$: $a$
becomes 1, $b$ becomes 2, $c$ becomes 3 and $d$ becomes 4. Then each of the four edges of $G$
becomes an edge of $H$. Each of the two pairs that are not edges of $G$ becomes a pair that is
not an edge of $H$.

So after the renaming, the two graphs have exactly the same edges. Only the drawing differs, and
the drawing is not part of a [[def:graph|graph]]. What matters is which vertices are adjacent,
not where they sit on the paper or what they are called. A renaming with this property is
called an isomorphism.

::: definition {#def:isomorphism title="Isomorphism of graphs" defines="isomorphic, isomorphism" source="theory/2026-09-15 p4"}
Graphs $G$ and $H$ are **isomorphic**, written $G \cong H$, if there exists a bijection
$f : V(G) \to V(H)$ such that for all $u \ne v \in V(G)$:
$$\set{u, v} \in E(G) \iff \set{f(u), f(v)} \in E(H).$$
Such a bijection $f$ is called an **isomorphism** of $G$ and $H$.
:::

::: intuition
An isomorphism is a renaming of the vertices. After the renaming, $G$ and $H$ have exactly the
same edges. So the two graphs differ only in the names of their vertices and in how they are
drawn.
:::

To check that a bijection $f$ is an isomorphism, we go through all pairs of vertices of $G$.
Each edge must go to an edge, and each pair that is not an edge must go to a pair that is not
an edge. Below, we do this for the lecture's example, one pair per step.

```graph id=t01-iso-check widget=stepper
caption: Checking the lecture's bijection pair by pair. Left $G$, right $H$; a vertex and its image have the same fill.
intent: From the lecture (theory/2026-09-15 p4): the two drawings of $C_4$ with the bijection that the lecturer drew as arrows, shown here as equal fills. The pair-by-pair check is new.
layout: fixed
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
1 @(2.2, 1); 2 @(3.2, 1); 3 @(2.2, 0); 4 @(3.2, 0)
a -- b -- c -- d -- a
1 -- 2 -- 3 -- 4 -- 1
step: $f$ sends $a, b, c, d$ to $1, 2, 3, 4$: equal fills.
class color1: a 1
class color2: b 2
class color3: c 3
class color4: d 4
step: The edge $ab$ goes to the pair $1, 2$: an edge of $H$.
class highlight: a--b 1--2
step: The edge $bc$ goes to $2, 3$: an edge of $H$.
class highlight: b--c 2--3
step: The edge $cd$ goes to $3, 4$: an edge of $H$.
class highlight: c--d 3--4
step: The edge $da$ goes to $4, 1$: an edge of $H$. All four edges are done.
class highlight: d--a 4--1
step: $a$ and $c$ are not adjacent, and neither are $1$ and $3$.
class current: a c 1 3
step: $b$ and $d$ are not adjacent, and neither are $2$ and $4$. So $f$ is an isomorphism.
unclass current: a c 1 3
class current: b d 2 4
```

::: pitfall
Edges to edges is not enough. The "if and only if" in the definition also asks that pairs that
are not edges go to pairs that are not edges. Take two vertices without an edge, and $K_2$. No
edge of the first graph goes to a non-edge, because it has no edges. Still, every bijection
sends its one pair to the edge of $K_2$, so the two graphs are not isomorphic.
:::

::: remark
Isomorphism is an equivalence relation on graphs (the identity, the inverse of an isomorphism,
and the composition of two isomorphisms are again isomorphisms). When we say "*a graph*" in
statements like "$K_{3,3}$ is not planar", we usually mean the whole **isomorphism class** of
that graph, that is, the structure without regard to vertex names. For example, "$C_4$" is any
graph isomorphic to the cycle on $\set{1,2,3,4}$.
:::

## Multigraphs

For [[def:mixed-multigraph|multigraphs]], edges are separate objects, so an isomorphism must also
say where each edge goes:

::: definition {#def:isomorphism-multigraph title="Isomorphism of mixed multigraphs" source="theory/2026-09-15 p4"}
Mixed multigraphs $G = (V_1, E_1, \varepsilon_1)$ and $H = (V_2, E_2, \varepsilon_2)$ are
**isomorphic** if there exist bijections $f : V_1 \to V_2$ and $g : E_1 \to E_2$ such that
$$\forall e \in E_1 : \quad f\bigl(\varepsilon_1(e)\bigr) = \varepsilon_2\bigl(g(e)\bigr),$$
where $f$ is applied to the endpoints: $f(v)$ for a loop, $(f(u), f(v))$ for an arc $(u, v)$, and
$\set{f(u), f(v)}$ for an undirected edge $\set{u, v}$.
:::

::: intuition
Now the edges have names too. The map $f$ says where each vertex goes, the map $g$ where each
edge goes. Each edge must land on an edge of the same kind whose endpoints are the images of its
own endpoints.
:::

In words, the condition says: the edge that $g$ picks for $e$ has as its endpoints exactly the
images of the endpoints of $e$. It is also of the same kind: a loop, an arc in the same
direction, or an undirected edge. Since $g$ is a bijection, parallel edges are matched one to
one. So the number of undirected edges between $u$ and $v$ in $G$ equals the number between
their images under $f$ in $H$. Likewise for loops at $u$, and for arcs from $u$ to $v$, which go
to the arcs from the image of $u$ to the image of $v$.

Below, one map $f$ of the vertices works with two different maps $g$ of the edges.

```graph id=t01-iso-edge-map widget=stepper
caption: An isomorphism of mixed multigraphs. Left $G$, right $H$. The map $f$ is fixed; the parallel edges can be matched in two ways.
intent: New figure (the lecture gives the definition without a worked example). Shows that the edge map $g$ is part of the isomorphism: the same $f$ with two different $g$. The last step shows that $g$ must keep the kind of an edge.
type: mixed
layout: fixed
u @(0, 1.2); v @(0, 0); w @(1, 0.6)
1 @(2.2, 1.2); 2 @(2.2, 0); 3 @(3.2, 0.6)
u -- v [id=e1 label="$e_1$"]; u -- v [id=e2 label="$e_2$"]; v -> w [id=e3 label="$e_3$"]
1 -- 2 [id=h1 label="$h_1$"]; 1 -- 2 [id=h2 label="$h_2$"]; 2 -> 3 [id=h3 label="$h_3$"]
step: $G$ has edges $e_1, e_2, e_3$; $H$ has edges $h_1, h_2, h_3$.
step: $f$ sends $u, v, w$ to $1, 2, 3$: equal fills.
class color1: u 1
class color2: v 2
class color3: w 3
step: $g$ sends the arc $e_3$ from $v$ to $w$ to the arc $h_3$ from $2$ to $3$.
class highlight: @e3 @h3
step: $g$ sends $e_1$ to $h_1$ (thick) and $e_2$ to $h_2$ (dashed).
unclass highlight: @e3 @h3
class bold: @e1 @h1
class dashed: @e2 @h2
step: Also an isomorphism: $g$ sends $e_1$ to $h_2$ and $e_2$ to $h_1$.
unclass bold: @h1
unclass dashed: @h2
class bold: @h2
class dashed: @h1
step: $g$ may not send the arc $e_3$ to the undirected edge $h_1$.
unclass bold: @e1 @h2
unclass dashed: @e2 @h1
class rejected: @e3 @h1
```

The lecture drew a larger example: a pentagon and a pentagram, each with two doubled edges.

```graph id=t01-iso-multigraph widget=figure
caption: Two isomorphic multigraphs. In both, the edges $23$ and $45$ are doubled; the identity map on the labels (together with a matching of the parallel edges) is an isomorphism.
intent: Show that drawings of the same multigraph can look completely different (a pentagon versus a pentagram). Parallel edges must be matched to parallel edges.
layout: fixed
panel: $G$
1 @(-0.59, -0.81); 2 @(0.59, -0.81); 3 @(0.95, 0.31); 4 @(0, 1); 5 @(-0.95, 0.31)
1 -- 2; 2 -- 3; 2 -- 3; 3 -- 4; 4 -- 5; 4 -- 5; 5 -- 1
panel: $H$
1 @(-0.95, 0.31); 4 @(-0.59, -0.81); 2 @(0.59, -0.81); 5 @(0.95, 0.31); 3 @(0, 1)
1 -- 2; 2 -- 3; 2 -- 3; 3 -- 4; 4 -- 5; 4 -- 5; 5 -- 1
```

## Check yourself

:::: quiz {#q:t01-iso-count-c4}
In the lecture's figure at the top of the page, $G$ and $H$ have 4 vertices each, so there are
24 bijections from the vertices of $G$ to the vertices of $H$. How many of them are isomorphisms?

answer: 8

::: explanation
Choose where $a$ goes: 4 choices, say to $x$. The neighbours $b$ and $d$ of $a$ must go to the
two neighbours of $x$ in $H$, in one of 2 orders. Then $c$ goes to the last vertex. That vertex
is adjacent to both neighbours of $x$, just as $c$ is adjacent to $b$ and $d$. So the four edges
of $G$ go to the four edges of $H$, and the two non-edges go to the two non-edges. In total
$4 \cdot 2 = 8$.
:::
::::

:::: quiz {#q:t01-iso-multigraph-edge-maps}
In the lecture's multigraphs $G$ and $H$ (the pentagon and the pentagram), let $f$ be the
identity on the labels. How many bijections $g$ between the edges make $f$ and $g$ together an
isomorphism?

answer: 4

::: explanation
Each edge of $G$ must go to an edge of $H$ with the same endpoints. The single edges $12$, $34$
and $51$ have one choice each. The two edges between 2 and 3 can go to the two edges between 2
and 3 in $H$ in 2 orders, and the same holds for the two edges between 4 and 5. In total
$2 \cdot 2 = 4$.
:::
::::

## More

Two more examples. The path with edges $ab, bc$ and the path with edges $13, 32$ are isomorphic
via $a \mapsto 1$, $b \mapsto 3$, $c \mapsto 2$. Two vertices joined by two parallel edges have
two isomorphisms to themselves with $f = \mathrm{id}$: one keeps the edges and one swaps them.
