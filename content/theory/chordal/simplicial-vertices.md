---
title: "Simplicial vertices"
course: theory
chapter: chordal
order: 3
lectures: [t04]
stage: split
status: reviewed
---

::: definition {#def:simplicial title="Simplicial vertex" defines="simplicial vertex" source="theory/2026-10-06 p1"}
A vertex $x \in V(G)$ is **simplicial** if the neighbours of $x$ in $G$ form a [[def:clique|clique]].
:::

::: intuition
A simplicial vertex sits in a single "corner" of the graph: all of its neighbours already know each other, so $x$
lies on no chordless cycle of length at least $4$,<!-- REVIEW: the intuition said "no chordless cycle", false for triangles (x a b is one, a triangle has no chord to miss); added "of length at least 4" --> and deleting it never destroys a shortcut that another cycle needs. Examples: every
vertex of $K_n$ is simplicial, and so is every vertex of [[def:degree|degree]] $0$ or $1$ (the empty set and a single vertex are
cliques). Non-example: no vertex of $C_n$, $n \ge 4$, is simplicial.
:::

```graph id=t04-simplicial widget=figure
caption: The vertex $x$ is simplicial: its neighbours $a, b, c$ are pairwise adjacent. The vertex $a$ is not simplicial, since its neighbours $x$ and $d$ are not adjacent.
intent: Definition by example.
layout: fixed
x [class=current] @(0, 0); a @(1, 0.8); b @(1.4, 0); c @(1, -0.8); d @(2.4, 0.8)
x -- a; x -- b; x -- c; a -- b [class=highlight]; b -- c [class=highlight]; a -- c [class=highlight bend=-0.3]; a -- d
```

::: theorem {#thm:chordal-simplicial title="Chordal graphs have simplicial vertices" source="theory/2026-10-06 p1"}
Every chordal graph (with at least one vertex) contains a simplicial vertex.
:::

::: intuition
This is the chordal analogue of "every tree has a [[def:leaf|leaf]]": there is always a vertex that can be peeled off
cleanly, and peeling it keeps the graph chordal, so the process can be repeated ([[thm:chordal-decomposition]]).
Example: a tree on at least $2$ vertices is chordal, and its leaves are simplicial. Non-example: $C_5$ has no
simplicial vertex, and indeed it is not chordal.
:::

```graph id=t04-chordal-simplicial widget=figure
caption: Left, a chordal graph (a strip of four triangles). Its simplicial vertices are $1$ and $6$, the two ends of the strip. Right, $C_5$ is not chordal, and none of its vertices is simplicial.
intent: New figure (the lecture shows no drawing for this theorem; p1 draws only the neighbourhood of a simplicial vertex). The theorem on a concrete chordal graph, and a graph where its hypothesis fails.
layout: fixed
panel: chordal
1 [class=current] @(0, 0.4); 2 @(0.9, 0.8); 3 @(0.9, 0); 4 @(1.8, 0.8); 5 @(1.8, 0); 6 [class=current] @(2.7, 0.4)
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 3 -- 5; 4 -- 5; 4 -- 6; 5 -- 6
panel: not chordal
a @(1.35, 1); b @(2.2, 0.4); c @(1.9, -0.5); d @(0.8, -0.5); e @(0.5, 0.4)
a -- b -- c -- d -- e -- a
```

The lecture states this without proof.
