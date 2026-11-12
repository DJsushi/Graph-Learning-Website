---
title: "Isomorphism"
course: theory
chapter: basics
order: 4
lectures: [t01]
stage: split
status: draft
---

The two drawings below look different, but they describe the same structure: a [[def:cycle-graph|cycle]] of four
vertices. What matters about a graph is *which vertices are adjacent*, not how the graph is drawn
or what its vertices are called.

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

::: definition {#def:isomorphism title="Isomorphism of graphs" defines="isomorphic, isomorphism" source="theory/2026-09-15 p4"}
Graphs $G$ and $H$ are **isomorphic**, written $G \cong H$, if there exists a bijection
$f : V(G) \to V(H)$ such that for all $u \ne v \in V(G)$:
$$\set{u, v} \in E(G) \iff \set{f(u), f(v)} \in E(H).$$
Such a bijection $f$ is called an **isomorphism** of $G$ and $H$.
:::

::: intuition
An isomorphism is a renaming of the vertices: $G$ and $H$ differ only in the names of the vertices
and in how they are drawn. Example: the [[def:path-graph|path]] with edges $ab, bc$ and the path
with edges $13, 32$ are isomorphic via $a \mapsto 1$, $b \mapsto 3$, $c \mapsto 2$. Non-example:
the graph on two vertices without edges is not isomorphic to $K_2$, because every bijection maps
the non-edge to the edge.
:::

Note the "$\iff$": an isomorphism must map edges to edges **and** non-edges to non-edges. A
bijection that only maps edges to edges is not enough (think of $f$ from the empty graph on two
vertices to $K_2$).

::: remark
Isomorphism is an equivalence relation on graphs (the identity, the inverse of an isomorphism,
and the composition of two isomorphisms are again isomorphisms). When we say "*a graph*" in
statements like "$K_{3,3}$ is not planar", we usually mean the whole **isomorphism class** of
that graph, that is, the structure without regard to vertex names. For example, "$C_4$" is any
graph isomorphic to the cycle on $\set{1,2,3,4}$.
:::

For [[def:mixed-multigraph|multigraphs]], edges are separate objects, so an isomorphism must also say where each edge
goes:

::: definition {#def:isomorphism-multigraph title="Isomorphism of mixed multigraphs" source="theory/2026-09-15 p4"}
Mixed multigraphs $G = (V_1, E_1, \varepsilon_1)$ and $H = (V_2, E_2, \varepsilon_2)$ are
**isomorphic** if there exist bijections $f : V_1 \to V_2$ and $g : E_1 \to E_2$ such that
$$\forall e \in E_1 : \quad f\bigl(\varepsilon_1(e)\bigr) = \varepsilon_2\bigl(g(e)\bigr),$$
where $f$ is applied to the endpoints: $f(v)$ for a loop, $(f(u), f(v))$ for an arc $(u, v)$, and
$\set{f(u), f(v)}$ for an undirected edge $\set{u, v}$.
:::

::: intuition
With parallel edges, knowing where the vertices go no longer says where each edge goes, so the
edge map $g$ is part of the isomorphism. Example: two vertices joined by two parallel edges have
two isomorphisms to themselves with $f = \mathrm{id}$, one keeping the edges and one swapping
them. Non-example: an arc $(u, v)$ can be mapped neither to an undirected edge nor to the
reversed arc $(f(v), f(u))$.
:::

The condition says: the edge $g(e)$ of $H$ has exactly the images of the endpoints of $e$ as its
endpoints, with the same type (loop, arc in the same direction, undirected edge). Since $g$ is a
bijection, parallel edges are matched one to one, so the *number* of edges between every two
vertices is preserved.

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
