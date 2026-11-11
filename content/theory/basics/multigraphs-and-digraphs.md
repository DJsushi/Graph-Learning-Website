---
title: "Multigraphs and directed graphs"
course: theory
chapter: basics
order: 2
lectures: [t01]
stage: split
status: draft
---

Because $E \subseteq \binom{V}{2}$, a simple graph cannot have an edge from a vertex to itself
(a 2-element set has two *different* elements) and cannot have two different edges with the
same endpoints (a set cannot contain the same element twice). Many applications need exactly
these features, and sometimes they also need edges with a direction. The following very general
definition covers all of that at once.

::: definition {#def:mixed-multigraph title="Mixed multigraph" defines="mixed, multigraph, loop, parallel edges, arc" source="theory/2026-09-15 p1"}
A **mixed multigraph** is a triple $G = (V, E, \varepsilon)$, where $V$ and $E$ are disjoint sets
and
$$\varepsilon : E \to V \,\cup\, (V \times V) \,\cup\, \binom{V}{2}$$
is a map assigning to every edge its endpoints. An edge $e$ is

- a **loop** if $\varepsilon(e) \in V$ (one endpoint, the edge goes from a vertex back to itself),
- a **directed edge** (an **arc**) from $u$ to $v$ if $\varepsilon(e) = (u, v) \in V \times V$,
- an **undirected edge** if $\varepsilon(e) = \set{u, v} \in \binom{V}{2}$.

Edges $e \ne f$ with $\varepsilon(e) = \varepsilon(f)$ are **parallel** (multiple) edges.
:::

The point of $\varepsilon$ is that edges are now objects in their own right: two different edges
may have the same endpoints, which is impossible when an edge *is* its pair of endpoints.

::: remark
Special cases of a mixed multigraph $G = (V, E, \varepsilon)$:

1. If $\varepsilon$ maps $E$ **injectively** into $\binom{V}{2}$, then no edge is a loop or directed
   and no two edges are parallel. Identifying each edge with its pair of endpoints, we get
   exactly a graph in the sense of [[def:graph]].
2. If $\varepsilon$ maps $E$ injectively into $V \times V$, we get a **directed graph**
   (**digraph**) $D = (V, E)$ with $E \subseteq V \times V$: every edge is an ordered pair. (Note
   that $V \times V$ contains the pairs $(v, v)$, so this definition allows directed loops; the
   algorithms course works with *simple* digraphs, which exclude them, for example in
   [[def:flow-network|flow networks]].)
3. If $\varepsilon$ maps into $\binom{V}{2} \cup V$ but is not necessarily injective, we get an
   (undirected) **multigraph**, which may have loops and parallel edges.
:::

```graph id=t01-mixed-multigraph widget=figure
caption: A mixed multigraph: three parallel edges between $c$ and $d$, a loop at $f$, and three arcs between $e$ and $g$ (two from $g$ to $e$, one from $e$ to $g$).
intent: Transcription of the lecture drawing. Show at a glance all the features a simple graph forbids: loops, parallel edges, directed edges, mixed together with ordinary edges.
type: mixed
layout: fixed
a @(0, 3); b @(2, 3); c @(1, 2); d @(-1, 1.5); e @(2.6, 1.5); f @(0.7, 0.3); g @(2.2, 0.3)
a -- b; a -- c; b -- c
c -- d [class=highlight]; c -- d [class=highlight]; c -- d
d -- e; c -- e; c -- g; c -- f; f -- g
f -- f [class=highlight side=bottom]
g -> e [class=highlight]; g -> e [class=highlight]; e -> g [class=highlight]
```

::: intuition
Think of a simple graph as a *relation* ("who knows whom") and of a multigraph as a *network of
connections* ("which roads lead from town to town"). Several different roads may connect the
same two towns, and a road may be one-way. The extra map $\varepsilon$ is what lets us count
the roads separately.
:::
