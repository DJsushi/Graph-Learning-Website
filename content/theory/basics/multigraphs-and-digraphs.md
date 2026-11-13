---
title: "Multigraphs and directed graphs"
course: theory
chapter: basics
order: 2
lectures: [t01]
goal: Describe loops, parallel edges and one-way edges with a map that tells every edge its endpoints.
needs: [theory/basics/graphs]
stage: taught
status: reviewed
---

The lecture drew the picture below. Some of its edges have no place in a
[[def:graph|graph]] as we defined it. Which ones, and what must change so that they fit?

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
mark parallel: c--d c--d#2 c--d#3
mark loop: f--f
mark arcs: g->e g->e#2 e->g
```

Point at the words to find them in the picture:
[[fig:t01-mixed-multigraph#parallel|three different edges between $c$ and $d$]],
[[fig:t01-mixed-multigraph#loop|an edge from $f$ back to $f$]] and
[[fig:t01-mixed-multigraph#arcs|three edges with arrows between $e$ and $g$]].

In a graph, an edge *is* its set of two endpoints, and that rules out all three. A loop would
need a 2-element set with the same vertex twice, but the two elements of such a set are
different. Two parallel edges would be the same element of the edge set twice, and a set
contains each element only once. A set has no order, so it cannot say which way an edge points.

The fix: edges become objects of their own, and a separate map tells each edge its endpoints.
Two edges may then get the same endpoints, an edge may get a single vertex, and an edge may get
an ordered pair.

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

::: intuition
Every edge has a name, and $\varepsilon$ tells us its endpoints: one vertex for a loop, an
ordered pair for an arc, a set of two vertices for an ordinary edge. Two different edges may get
the same answer. Then they are parallel.
:::

Below, we read off $\varepsilon$ edge by edge on a small example. The edges are $e_1$ to $e_7$,
the vertices $u$, $v$, $w$, $x$ and $y$.

```graph id=t01-reading-epsilon widget=stepper
caption: Reading off $\varepsilon$ edge by edge: undirected edges, parallel edges, a loop, arcs.
intent: New figure (the lecture has no worked example of the map). Makes the definition concrete: every edge is a named object, and the kind of the value of the map decides its kind. The last step shows the boundary of "parallel": opposite arcs are not parallel.
type: mixed
layout: fixed
u @(0, 1.2); v @(1.5, 1.2); w @(3, 1.2); x @(0.75, 0); y @(2.25, 0)
u -- v [id=e1 label="$e_1$"]; u -- v [id=e2 label="$e_2$"]
x -- x [id=e3 label="$e_3$" side=bottom]
v -> w [id=e4 label="$e_4$"]; w -> v [id=e5 label="$e_5$"]
x -- y [id=e6 label="$e_6$"]; y -> w [id=e7 label="$e_7$"]
step: Five vertices and seven edges, each edge with its own name.
step: Undirected edges: $\varepsilon$ gives a set of two vertices, for example $\varepsilon(e_6) = \set{x, y}$.
class highlight: @e1 @e2 @e6
step: $e_1 \ne e_2$, but $\varepsilon(e_1) = \varepsilon(e_2) = \set{u, v}$: they are parallel.
unclass highlight: @e6
step: A loop: $\varepsilon(e_3) = x$, a single vertex.
unclass highlight: @e1 @e2
class highlight: @e3
step: Arcs: $\varepsilon(e_4) = (v, w)$, $\varepsilon(e_5) = (w, v)$ and $\varepsilon(e_7) = (y, w)$.
unclass highlight: @e3
class highlight: @e4 @e5 @e7
step: $(v, w) \ne (w, v)$, so the opposite arcs $e_4$ and $e_5$ are not parallel.
unclass highlight: @e7
class dashed: @e4 @e5
```

## Special cases

Three special cases have names of their own.

::: remark
Special cases of a mixed multigraph:

1. Every edge is undirected, and different edges get different endpoints: $\varepsilon$ is
   **injective**. Then no edge is a loop or an arc, and no two edges are parallel. If we identify
   each edge with its set of endpoints, we get exactly a graph.
2. Every edge is an arc, and different edges get different ordered pairs. We get a **directed
   graph** (**digraph**) $D = (V, E)$ with $E \subseteq V \times V$: every edge is an ordered
   pair. A vertex paired with itself is an ordered pair too, so a digraph may have directed loops (arcs $(v, v)$).
3. Every edge is undirected or a loop, and different edges may get the same endpoints. We get an
   (undirected) **multigraph**, which may have loops and parallel edges.
:::

```graph id=t01-special-cases widget=figure
caption: The three special cases. In "graph" every edge has its own pair of endpoints. In "digraph" every edge is an arc; the arcs from $a$ to $b$ and from $b$ to $a$ are different ordered pairs. In "multigraph" two parallel edges join $a$ and $b$, and $c$ has a loop.
intent: New figure (the lecture names the cases without drawing them). One small example per special case of the remark, on the same four vertices, so the reader sees what each case allows.
layout: fixed
panel: graph
a @(0, 1); b @(1.2, 1); c @(1.2, 0); d @(0, 0)
a -- b; b -- c; c -- d; d -- a; a -- c
panel: digraph
type: directed
a @(0, 1); b @(1.2, 1); c @(1.2, 0); d @(0, 0)
a -> b; b -> a; b -> c; c -> d; d -> a
panel: multigraph
a @(0, 1); b @(1.2, 1); c @(1.2, 0); d @(0, 0)
a -- b; a -- b; b -- c; c -- d; d -- a
c -- c [side=right]
```

::: pitfall
A loop at $x$ is not an ordinary edge from $x$ to $x$. A set that lists $x$ twice is the set
with the single element $x$, so it is not a 2-element set. This is why the map sends a loop to
the vertex itself.
:::

## Check yourself

:::: quiz {#q:t01-parallel-pairs}
In the lecture's picture at the top of the page, how many pairs of different edges are parallel?

answer: 4

::: explanation
The three edges between $c$ and $d$ give three pairs. Of the arcs between $e$ and $g$, the two
from $g$ to $e$ have the same ordered pair: one more pair. The arc from $e$ to $g$ has a
different ordered pair, so it is parallel to neither. All other edges have endpoints of their
own. Total: $3 + 1 = 4$.
:::
::::

## More

Think of a graph as a *relation* ("who knows whom") and of a multigraph as a *network of
connections* ("which roads lead from town to town"). Several different roads may connect the
same two towns, and a road may be one-way. The extra map $\varepsilon$ is what lets us count the
roads separately.

The special cases in symbols, for $G = (V, E, \varepsilon)$:

1. $\varepsilon$ maps $E$ injectively into $\binom{V}{2}$: a graph, after identifying each edge with its pair of endpoints.
2. $\varepsilon$ maps $E$ injectively into $V \times V$: a digraph $D = (V, E)$ with
   $E \subseteq V \times V$. Since $V \times V$ contains the pairs $(v, v)$, directed loops are
   allowed.
3. $\varepsilon$ maps into $\binom{V}{2} \cup V$, not necessarily injectively: a multigraph.

The algorithms course works with *simple* digraphs, which exclude directed loops.
