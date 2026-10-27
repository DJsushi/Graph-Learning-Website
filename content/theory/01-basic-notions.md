---
title: Basic notions
course: theory
lecture: 1
slug: t01
summary: Graphs and mixed multigraphs, the basic graph classes, isomorphism, degrees, the handshake lemma, and which sequences are degree sequences (Havel–Hakimi, Erdős–Gallai).
prerequisites: []
sources:
  - resources/graph-theory/2026-09-15-09_45_32-join.pdf
  - resources/graph-theory/2026-09-22-13_38_58-join.pdf (pp. 1–2, proof of Havel–Hakimi)
status: draft
---

Graphs are the mathematical model of anything made of *objects* and *connections between
pairs of objects*: road networks, friendships, molecules, dependencies between tasks,
computer networks. This first lesson fixes the language used in the rest of both courses. We
define what a graph is, meet the small families of graphs that come up everywhere, decide when
two graphs are "the same", and study the simplest numerical information a graph carries: the
degrees of its vertices.

## What is a graph?

Informally, a graph is a **symmetric binary relation**: a set of objects together with the
information which pairs of them are related. Unless said otherwise, the word *graph* always
means a **simple undirected graph**:

::: definition {#def:graph title="Graph" defines="graph, vertex, edge" basic=true source="theory/2026-09-15 p1"}
A **graph** is a pair $G = (V, E)$, where $V$ is a set and $E \subseteq \binom{V}{2}$ is a set of
2-element subsets of $V$.

The elements of $V$ are the **vertices** of $G$ and the elements of $E$ are its **edges**. We
write $V(G)$ and $E(G)$ for the vertex set and the edge set of a graph $G$.
:::

::: intuition
A graph records only *which pairs* of objects are related. An edge is an unordered pair, so $uv$
and $vu$ are the same edge, and a pair $\set{v, v}$ is not a 2-element set, so no edge joins a
vertex to itself. Example: $V = \set{1, 2, 3}$ and $E = \set{12, 23}$ is a [[def:path-graph|path]] through $1, 2, 3$;
the vertices $1$ and $3$ are not related. Weighted graphs and flow networks
([[def:flow-network]]) in the algorithms course are graphs with extra numbers on the edges.
:::

Throughout, graphs are **finite** ($V$ is a finite set), and we use the notation of the lectures:

- $n = \abs{V(G)}$ is the number of vertices and $m = \abs{E(G)}$ the number of edges;
- an edge $\set{u, v}$ is often written shortly as $uv$ (so $uv = vu$).

::: definition {#def:adjacent title="Adjacency and incidence" defines="adjacent, incident, neighbour, neighbourhood, endpoint" basic=true extra=true}
Let $G$ be a graph and $e = uv \in E(G)$. The vertices $u$ and $v$ are the **endpoints** of $e$;
we say that $u$ and $v$ are **adjacent** (or **neighbours**), and that $e$ is **incident** with
$u$ and with $v$. The **neighbourhood** of a vertex $v$ is the set
$N_G(v) = \set{u \in V(G) : uv \in E(G)}$.
:::

::: intuition
Adjacency relates two vertices; incidence relates a vertex and an edge. In the graph with edges
$12$ and $23$, the vertex $2$ has neighbourhood $N(2) = \set{1, 3}$, while $N(1) = \set{2}$. The
edge $12$ is incident with $1$ and $2$ but not with $3$, and $1$ and $3$ are not adjacent.
:::

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

## Basic graph classes

A few graphs appear so often that they have standard names. Mind the conventions for the index
$n$: they follow the lectures, and they are a common source of off-by-one mistakes.

::: definition {#def:path-graph title="Path $P_n$" defines="path, P_n, length" source="theory/2026-09-15 p2"}
The **path of length $n$**, denoted $P_n$, is the graph with
$$V(P_n) = \set{0, 1, \dots, n}, \qquad E(P_n) = \set{\set{i-1, i} : 1 \le i \le n}.$$
So $P_n$ has $n + 1$ vertices and $n$ edges. The **length** of a path is the number of its edges.
:::

::: intuition
$P_n$ is a chain of $n$ edges, $0 - 1 - 2 - \dots - n$. Indexing by the number of edges makes
"path of length $n$" and "$P_n$" say the same thing. Examples: $P_0$ is a single vertex, $P_1$ is a
single edge ($P_1 = K_2$), and $P_2$ has three vertices, the middle one with two neighbours.
:::

::: definition {#def:cycle-graph title="Cycle $C_n$" defines="cycle, C_n" source="theory/2026-09-15 p2"}
For $n \ge 3$, the **cycle of length $n$**, denoted $C_n$, is the graph with
$$V(C_n) = \set{1, 2, \dots, n}, \qquad E(C_n) = \set{\set{i, i+1} : 1 \le i < n} \cup \set{\set{n, 1}}.$$
So $C_n$ has $n$ vertices and $n$ edges.
:::

::: intuition
$C_n$ is $n$ vertices around a circle, each joined to its two neighbours on the circle: take the
path $P_{n-1}$ on $n$ vertices and join its two ends. The bound $n \ge 3$ comes from simplicity:
a "$C_2$" would need two [[def:mixed-multigraph|parallel edges]] and a "$C_1$" a loop.
Example: $C_3 = K_3$ is the triangle, and $C_4$ is the square.
:::

::: definition {#def:complete-graph title="Complete graph $K_n$" defines="complete graph, K_n, clique" source="theory/2026-09-15 p2"}
The **complete graph on $n$ vertices**, denoted $K_n$, has $\abs{V(K_n)} = n$ and
$E(K_n) = \binom{V(K_n)}{2}$: every two distinct vertices are adjacent.
:::

::: intuition
$K_n$ has every edge a simple graph on $n$ vertices can have, so every simple graph on $n$
vertices is $K_n$ with some edges deleted. Examples: $K_1$ is a single vertex, $K_2$ an edge, $K_3$
a triangle, $K_4$ the tetrahedron. A copy of $K_k$ inside a larger graph, a set of $k$ pairwise
adjacent vertices, is a clique ([[def:clique]]).
:::

::: definition {#def:complete-bipartite title="Complete bipartite graph $K_{m,n}$" defines="complete bipartite graph, K_{m,n}" source="theory/2026-09-15 p3"}
The **complete bipartite graph on $m + n$ vertices**, denoted $K_{m,n}$, has vertex set
$V_m \cup V_n$, where $V_m = \set{1, \dots, m}$ and $V_n = \set{1', \dots, n'}$ are disjoint, and
$$E(K_{m,n}) = \set{\set{u, v} : u \in V_m,\ v \in V_n}.$$
Every vertex of $V_m$ is adjacent to every vertex of $V_n$, and there are no other edges. The
lecture writes this briefly as $E(K_{m,n}) = V_m \times V_n$, identifying the ordered pair
$(u, v)$ with the edge $\set{u, v}$.
:::

::: intuition
Two teams, where everyone meets everyone of the other team and nobody of their own. $K_{m,n}$ is
the [[def:bipartite|bipartite]] graph with sides of sizes $m$ and $n$ that has all possible edges.
Examples: $K_{1,n}$ is a star (one centre, $n$ leaves), $K_{2,2} \cong C_4$, and $K_{3,3}$ is the
"three houses, three utilities" graph. Non-example: $K_3$ is not of this form, since a triangle
always has two vertices on the same side.
:::

```graph id=t01-graph-classes widget=figure
caption: The basic graph classes: the path $P_4$ (5 vertices!), the cycle $C_6$, the complete graph $K_5$ and the complete bipartite graph $K_{3,3}$.
intent: Visual dictionary of the four families. Vertex ids follow the definitions so students see the conventions (P_n starts at 0; K_{m,n} uses primes on one side).
height: small
panel: $P_4$
use: P(4)
panel: $C_6$
use: C(6)
panel: $K_5$
use: K(5)
panel: $K_{3,3}$
use: K(3,3)
```

::: observation {#obs:edge-counts-classes title="Edge counts" extra=true}
$\abs{E(P_n)} = n$, $\abs{E(C_n)} = n$, $\abs{E(K_n)} = \binom{n}{2} = \frac{n(n-1)}{2}$ and
$\abs{E(K_{m,n})} = m \cdot n$.
:::

::: proof
The first two counts are read off the definitions: $P_n$ has one edge $\set{i-1,i}$ for each
$i \in \set{1, \dots, n}$, and $C_n$ has the $n - 1$ edges $\set{i, i+1}$ plus the edge
$\set{n, 1}$. For $K_n$, the edge set is the set of all 2-element subsets of an $n$-element set,
of which there are $\binom{n}{2} = n(n-1)/2$. For $K_{m,n}$, an edge is determined by choosing its
endpoint in $V_m$ ($m$ ways) and its endpoint in $V_n$ ($n$ ways), independently; different
choices give different edges, so there are $mn$ edges.
:::

::: intuition
Each count is a count of pairs: $K_n$ has an edge for every pair of vertices, and $K_{m,n}$ one
for every choice of one vertex from each side. Examples: $K_4$ has $6$ edges, $K_{3,3}$ has $9$,
$K_6$ has $15$. A quick sanity check: $K_{m,n}$ is $K_{m+n}$ minus the edges inside the two sides,
and indeed $\binom{m+n}{2} - \binom{m}{2} - \binom{n}{2} = mn$.
:::

::: pitfall
$P_n$ has $n + 1$ vertices, but $C_n$ and $K_n$ have $n$ vertices. Some textbooks use $P_n$ for
the path on $n$ vertices; in this course the index of $P_n$ is always the **length**.
:::

## Isomorphism

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

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-09-15-09_45_32-join.pdf p.4 — the lecture's second drawing H of the pentagon example is hard to read; as transcribed, its doubled edges (34 and 45) would share vertex 4, which would make H non-isomorphic to G. The figure above uses a pentagram drawing that is certainly isomorphic to G. -->

How do we show that two graphs are **not** isomorphic? Trying all $n!$ bijections is hopeless
for larger graphs. Instead we look for a property that isomorphisms preserve and that the two
graphs do not share.

::: proposition {#prop:iso-invariants title="Simple isomorphism invariants" extra=true}
If $G \cong H$, then $G$ and $H$ have the same number of vertices, the same number of edges, and
the same [[def:degree-sequence|degree sequence]] up to reordering ([[def:degree|degrees]] are defined in the next section; in fact an
isomorphism $f$ satisfies $d_G(v) = d_H(f(v))$ for every vertex $v$).
:::

::: proof
Let $f$ be an isomorphism. It is a bijection $V(G) \to V(H)$, so $\abs{V(G)} = \abs{V(H)}$. The
map $\set{u, v} \mapsto \set{f(u), f(v)}$ sends $E(G)$ into $E(H)$ by the "$\Rightarrow$"
direction of the definition; it is injective because $f$ is, and it is surjective onto $E(H)$
because every edge $\set{x, y} \in E(H)$ equals $\set{f(u), f(v)}$ for $u = f^{-1}(x)$,
$v = f^{-1}(y)$, and then $\set{u, v} \in E(G)$ by the "$\Leftarrow$" direction. Hence
$\abs{E(G)} = \abs{E(H)}$. The same argument restricted to the edges incident with a fixed vertex
$v$ shows that $f$ maps the edges at $v$ bijectively onto the edges at $f(v)$, so
$d_G(v) = d_H(f(v))$.
:::

::: intuition
An isomorphism only renames vertices, and renaming cannot change anything that is counted
without looking at names. So comparing $n$, $m$ and the degrees is the first test when two graphs
are suspected to be non-isomorphic. Example: $P_3$ and the star $K_{1,3}$ both have $4$ vertices
and $3$ edges, but their degrees are $2, 2, 1, 1$ and $3, 1, 1, 1$, so
$P_3 \not\cong K_{1,3}$.
:::

::: pitfall
These invariants are **necessary but not sufficient**. The cycle $C_6$ and two disjoint
triangles both have 6 vertices, 6 edges and all degrees equal to 2, but they are not isomorphic:
one is [[def:component|connected]] and the other is not.
:::

```graph id=t01-same-degrees-not-iso widget=figure
caption: Same number of vertices, edges and the same degrees, yet not isomorphic.
intent: Counterexample to "same degree sequence implies isomorphic".
height: small
panel: $C_6$
use: C(6)
panel: $2 \times C_3$
use: C(3) prefix=a
use: C(3) prefix=b
```

## Degrees

::: definition {#def:degree title="Degree" defines="degree, d_G(v), isolated vertex" source="theory/2026-09-15 p5"}
The **degree** of a vertex $v \in V(G)$ is
$$d_G(v) := \text{the number of edges incident with } v,$$
where **loops are counted twice**. A vertex of degree $0$ is **isolated**.
:::

::: intuition
The degree counts the *ends* of edges at $v$. In a simple graph this is just the number of
neighbours. Examples: every vertex of $C_n$ has degree $2$, every vertex of $K_n$ has degree
$n - 1$, and in $K_{m,n}$ the vertices on the side of size $m$ have degree $n$. In $P_n$ with
$n \ge 1$, the two ends have degree $1$ and the inner vertices degree $2$.
:::

In a simple graph, $d_G(v) = \abs{N_G(v)}$. Many texts write $\deg(v)$ or $\deg_G(v)$; the lectures
use $d_G(v)$, and we drop the index $G$ when the graph is clear.

Why count a loop twice? Because a loop has *two ends* at $v$: if you go around a small circle
centred at $v$, you cross the loop twice. With this convention the next statement holds for all
[[def:mixed-multigraph|multigraphs]], not only for simple graphs.

```graph id=t01-loop-degree widget=figure
caption: $d(a) = 4$: the loop contributes $2$, the edges $ab$ and $ac$ contribute $1$ each. Also $d(b) = d(c) = 3$.
intent: Show that a loop contributes 2 to the degree, and that parallel edges each count.
height: small
a -- a; a -- b; a -- c; b -- c; b -- c
```

::: pitfall
In a multigraph the degree is **not** the number of neighbours. In the figure above, $a$ has
two neighbours but degree $4$, and $b$ has two neighbours but degree $3$. The formula
$d_G(v) = \abs{N_G(v)}$ holds only in simple graphs.
:::

::: lemma {#lem:handshake title="Handshake lemma" aka="degree sum formula" source="theory/2026-09-15 p5"}
For every (multi)graph $G$:
$$\sum_{v \in V(G)} d_G(v) = 2 \cdot \abs{E(G)}.$$
:::

::: proof
We count the **incidences**, the pairs (vertex, end of an edge at that vertex), in two ways.
Every edge has exactly two ends: an edge $uv$ with $u \ne v$ has one end at $u$ and one at $v$,
and a loop at $v$ has both ends at $v$. So the number of incidences is $2 \abs{E(G)}$. On the
other hand, the number of ends at a vertex $v$ is exactly $d_G(v)$ (this is where loops must be
counted twice), so the number of incidences is also $\sum_{v} d_G(v)$.

In the words of the lecture: going over all edges of $G$, every edge contributes exactly $+2$ to
the degree sum.
:::

::: intuition
Summing the degrees counts every edge once from each end, so every edge is counted twice. The
name comes from the situation at a party: if every handshake involves two hands, then the total
number of hands shaken is twice the number of handshakes. Example: $K_4$ has degree sum
$4 \cdot 3 = 12 = 2 \cdot 6$, and a single loop has degree sum $2 = 2 \cdot 1$.
:::

::: corollary {#cor:odd-degree-count title="Odd-degree vertices" extra=true}
Every (multi)graph has an even number of vertices of odd degree.
:::

::: proof
Split the degree sum into the vertices of even degree and those of odd degree:
$$2\abs{E(G)} = \sum_{d(v) \text{ even}} d(v) + \sum_{d(v) \text{ odd}} d(v).$$
The left-hand side and the first sum on the right are even, hence the second sum is even. A sum
of odd numbers is even exactly when the number of summands is even.
:::

::: intuition
The degree sum is even, and a sum of integers is even exactly when it has an even number of odd
terms. This gives a quick impossibility test: there is no graph with degrees $3, 2, 2$, and no
graph on $5$ vertices in which every vertex has degree $3$. Example: the star $K_{1,3}$ has four
odd-degree vertices, an even number.
:::

::: remark
For a digraph $D$ one distinguishes the **out-degree** $d^+(v)$ (number of arcs leaving $v$)
and the **in-degree** $d^-(v)$ (number of arcs entering $v$). Every arc has exactly one tail and
one head, so $\sum_v d^+(v) = \sum_v d^-(v) = \abs{E(D)}$.
:::

```graph id=t01-handshake-sandbox widget=editable
caption: Try it: add, remove and move vertices and edges (including loops and parallel edges). The degree sum is always twice the number of edges.
intent: Let students convince themselves of the handshake lemma and of the corollary by experiment.
live: degree-sequence, degree-sum, edge-count
1 -- 2 -- 3 -- 1; 3 -- 4
```

## Degree sequences

::: definition {#def:degree-sequence title="Degree sequence" defines="degree sequence" source="theory/2026-09-15 p5"}
The **degree sequence** of a graph $G$ with $V(G) = \set{v_1, v_2, \dots, v_n}$ is the sequence
$$\bigl(d_G(v_1), d_G(v_2), \dots, d_G(v_n)\bigr).$$
:::

::: intuition
The degree sequence lists the [[def:degree|degrees]] and forgets who is adjacent to whom.
Examples: the star $K_{1,3}$ has degree sequence $(3, 1, 1, 1)$, the [[def:cycle-graph|cycle]] $C_4$ has
$(2, 2, 2, 2)$. Different graphs can share a degree sequence: $C_6$ and two disjoint triangles
both have $(2, 2, 2, 2, 2, 2)$.
:::

The sequence depends on the order of the vertices; usually we list it **non-increasingly**. Then
it is an [[def:isomorphism|isomorphism]] invariant ([[prop:iso-invariants]]).

```graph id=t01-degree-sequence-example widget=figure
caption: A graph with degree sequence $(4, 4, 3, 3, 1, 1, 0)$. Vertex labels show the degrees.
intent: Transcription of the lecture example; an isolated vertex contributes a 0 to the degree sequence.
layout: fixed
vertex-label: "{d}"
x [d=0] @(1, 1.6)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
l -- r [bend=0.5]; l -- mt; mt -- r; l -- mb; mt -- mb; r -- mb; l -- p; r -- q
```

Now the reverse question: given a sequence of numbers, **is there a (simple) graph with this
degree sequence?** This question is the subject of the rest of the lesson.

::: definition {#def:graphic-sequence title="Graphic sequence" defines="graphic sequence, realisation" extra=true}
A sequence $(d_1, \dots, d_n)$ of non-negative integers is **graphic** if there is a simple graph
$G$ with $V(G) = \set{v_1, \dots, v_n}$ and $d_G(v_i) = d_i$ for all $i$. Such a $G$ is a
**realisation** of the sequence.
:::

::: intuition
A graph gives a degree sequence; "graphic" asks the reverse question, whether some simple graph
has exactly the prescribed degrees. Realisations are usually far from unique: $(2, 2, 2, 2, 2, 2)$
is realised by $C_6$ and by two disjoint triangles ([[fig:t01-same-degrees-not-iso]]).
Non-examples: $(1, 1, 1)$ has an odd sum, and $(2, 0)$ asks for two neighbours with only one
other vertex available.
:::

Two necessary conditions are immediate: the sum $d_1 + \dots + d_n$ must be even
([[lem:handshake]]), and every $d_i \le n - 1$ (a vertex of a simple graph has at most $n-1$
neighbours). They are not sufficient: $(3, 3, 1, 1)$ has an even sum and all entries are at most
$3$, but it is not graphic. The two vertices of degree $3$ would each be adjacent to all other
vertices, so each vertex of "degree 1" would get two neighbours.

### The Havel–Hakimi theorem

The following theorem reduces the question for a sequence of $n$ numbers to the same question for
a sequence of $n - 1$ numbers. Applying it repeatedly gives an efficient algorithm.

::: theorem {#thm:havel-hakimi title="Havel–Hakimi" source="theory/2026-09-15 p7; theory/2026-09-22 p1–2"}
Let $(d_1, d_2, \dots, d_n)$ be a non-increasing sequence of non-negative integers with
$d_1 \le n - 1$. Then there exists a graph with degree sequence $(d_1, \dots, d_n)$ if and only if
$$\varphi_1 = \bigl(d_2 - 1,\ d_3 - 1,\ \dots,\ d_{d_1 + 1} - 1,\ d_{d_1 + 2},\ \dots,\ d_n\bigr)$$
is a degree sequence of a graph.
:::

In words: remove the largest entry $d_1$ and subtract $1$ from the next $d_1$ entries. The new
sequence $\varphi_1$ need not be non-increasing; that does not matter, because whether a sequence
is graphic does not depend on the order of its entries (simply rename the vertices). Before the
next step we sort it again.

::: intuition
The vertex with the largest demand $d_1$ should take its neighbours among the vertices with the
largest remaining demands, because those are the hardest to satisfy later. The theorem says that
this greedy choice never hurts: if the sequence has any realisation, it has one in which $v_1$ is
adjacent exactly to $v_2, \dots, v_{d_1+1}$. Examples: $(3, 3, 2, 2, 2) \to (2, 1, 1, 2)$, which is
graphic, so $(3, 3, 2, 2, 2)$ is graphic too; $(3, 3, 1, 1) \to (2, 0, 0)$, which is not graphic,
so neither is $(3, 3, 1, 1)$.
:::

::: remark
The lecture states the theorem without the hypothesis $d_1 \le n - 1$. It is needed for
$\varphi_1$ to make sense: there must be $d_1$ entries after $d_1$ to decrease. It costs nothing,
since a sequence with $d_1 > n - 1$ is never graphic (a vertex has at most $n - 1$ neighbours);
the test below rejects such sequences in line `@too-big`.
:::

```graph id=t01-havel-hakimi-idea widget=figure
caption: The idea of the theorem: the vertex $v_1$ of the largest degree $d_1$ is joined to the $d_1$ vertices of the next largest degrees.
intent: Transcription of the lecture sketch. Show v1 joined to v2..v_{d1+1} and not to the rest; removing v1 lowers exactly those degrees by one.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_{d_1+1}$"] @(0.6, 1.3)
v5 [label="$v_{d_1+2}$" class=muted] @(1.6, 1.3); v6 [label="$v_n$" class=muted] @(2.6, 1.3)
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]
```

:::: proof
**($\Leftarrow$)** This direction is easy. Let $H$ be a graph with degree sequence $\varphi_1$, on
vertices $v_2, \dots, v_n$ where $v_i$ has degree $d_i - 1$ for $2 \le i \le d_1 + 1$ and degree
$d_i$ for $i \ge d_1 + 2$. Add a new vertex $v_1$ adjacent to exactly $v_2, \dots, v_{d_1+1}$. The
new vertex has degree $d_1$, the degree of each of $v_2, \dots, v_{d_1+1}$ grows by one to $d_i$,
and all other degrees stay $d_i$. The result is a simple graph with degree sequence
$(d_1, \dots, d_n)$.

**($\Rightarrow$)** We want: from a graph $G$ with degree sequence $\varphi = (d_1, \dots, d_n)$,
construct a graph $H$ with degree sequence $\varphi_1$. It would be enough to find a realisation
$G$ of $\varphi$ in which the vertex of degree $d_1$ is adjacent exactly to the vertices of the
degrees $d_2, \dots, d_{d_1+1}$; then deleting this vertex gives $H$. Not every realisation has
this property, so we choose a good one.

Consider all pairs consisting of a graph $G$ and a numbering $V(G) = \set{v_1, \dots, v_n}$ with
$d_G(v_i) = d_i$ for every $i$ (by assumption there is at least one). Among them choose one such
that

1. the sum of the degrees of the neighbours of $v_1$ is **maximum**, and, among those,
2. the number of neighbours of $v_1$ in the set $\set{v_{d_1+2}, \dots, v_n}$ is **minimum**.

There are only finitely many such pairs, so the choice is possible. We show that the neighbours
of $v_1$ are then exactly $v_2, \dots, v_{d_1+1}$.

**(a)** If the neighbours of $v_1$ are $\set{v_2, \dots, v_{d_1+1}}$, then $H = G - v_1$ has degree
sequence $\varphi_1$, and we are done.

**(b)** Otherwise, $v_1$ has a neighbour $v_j$ with $j \ge d_1 + 2$. Since $v_1$ has exactly $d_1$
neighbours and one of them lies outside $\set{v_2, \dots, v_{d_1+1}}$, at most $d_1 - 1$ of the
$d_1$ vertices $v_2, \dots, v_{d_1+1}$ are neighbours of $v_1$. So there is an index
$i \le d_1 + 1$ with $\set{v_1, v_i} \notin E(G)$. Because $i < j$ and the sequence is
non-increasing, $d_G(v_i) = d_i \ge d_j = d_G(v_j)$. There are two cases.

- **$d_G(v_i) = d_G(v_j)$.** Exchange the names of $v_i$ and $v_j$. The numbering still satisfies
  $d_G(v_k) = d_k$ for all $k$ (the two vertices have the same degree), the graph and hence the
  neighbour degree sum of $v_1$ are unchanged, but $v_1$ now has one neighbour fewer in
  $\set{v_{d_1+2}, \dots, v_n}$ (the old $v_j$ is now called $v_i$, with $i \le d_1 + 1$, and the
  old $v_i$, which now has index $j$, is not a neighbour of $v_1$). This contradicts the
  minimality in rule 2.

- **$d_G(v_i) > d_G(v_j)$.** We find a vertex $v_k$ with $\set{v_i, v_k} \in E(G)$ and
  $\set{v_j, v_k} \notin E(G)$. Indeed, $v_i$ has $d_G(v_i)$ neighbours, so at least
  $d_G(v_i) - 1 \ge d_G(v_j)$ neighbours other than $v_j$. The vertex $v_j$ has at most
  $d_G(v_j) - 1$ neighbours other than $v_1$ (one of its neighbours is $v_1$). So some neighbour
  $v_k \ne v_j$ of $v_i$ is not a neighbour of $v_j$ and is not $v_1$. (We also know
  $v_k \ne v_1$ directly, since $v_1$ and $v_i$ are not adjacent.) Now take the graph
  $$G' = \bigl(G - \set{v_1, v_j} - \set{v_i, v_k}\bigr) + \set{v_1, v_i} + \set{v_j, v_k}.$$
  The two added pairs were non-edges, so $G'$ is a simple graph. Each of $v_1, v_i, v_j, v_k$ loses
  one incident edge and gains one, so $G'$ has the same degree sequence $\varphi$, with the same
  numbering. But in $G'$ the neighbour $v_j$ of $v_1$ has been replaced by $v_i$, so the sum of
  the degrees of the neighbours of $v_1$ grew by $d_i - d_j > 0$. This contradicts the
  maximality in rule 1.

Both cases are impossible, so case (a) holds, and $G - v_1$ is a graph with degree sequence
$\varphi_1$.
::::

```graph id=t01-havel-hakimi-switch widget=stepper
caption: The exchange in case (b): replace $v_1v_j$ and $v_iv_k$ by $v_1v_i$ and $v_jv_k$. No degree changes, but $v_1$ gets a neighbour of larger degree.
intent: Illustrate the 2-switch from the proof. Degrees of all four vertices are preserved.
layout: fixed
v1 [label="$v_1$"] @(0, 0); vi [label="$v_i$"] @(1, 1.2); vj [label="$v_j$"] @(2.6, 1.2); vk [label="$v_k$"] @(1.8, 2.2)
x1 [class=muted label=""] @(0.4, 2.2); x2 [class=muted label=""] @(3.2, 2.2)
v1 -- vj; vi -- vk; vi -- x1 [class=muted]; vj -- x2 [class=muted]
step: Situation in case (b): $v_1 v_j \in E$, $v_1 v_i \notin E$, $v_i v_k \in E$, $v_j v_k \notin E$.
class highlight: v1--vj vi--vk
step: Remove the edges $v_1 v_j$ and $v_i v_k$.
remove v1--vj vi--vk
step: Add the edges $v_1 v_i$ and $v_j v_k$. Every one of the four vertices kept its degree.
v1 -- vi [class=highlight]; vj -- vk [class=highlight]
```

::: remark
This exchange of two edges for two others, keeping all degrees, is called a **2-switch**. One can
show that any two realisations of the same degree sequence can be transformed into each other by
a sequence of 2-switches.
:::

::: algorithm {#alg:havel-hakimi title="Havel–Hakimi test"}
**Input:** a sequence $(d_1, \dots, d_n)$ of non-negative integers. **Output:** whether it is
graphic (and a realisation, by reading the steps backwards).

```pseudo
repeat:                                                    // @loop
    sort the sequence non-increasingly: d_1 ≥ d_2 ≥ … ≥ d_k // @sort
    if all entries are 0: return GRAPHIC                    // @yes
    if d_1 > k − 1: return NOT GRAPHIC                      // @too-big
    remove d_1, subtract 1 from the next d_1 entries         // @reduce
    if some entry is negative: return NOT GRAPHIC           // @negative
```
:::

::: intuition
Each round settles one vertex for good: it is given its neighbours, and the remaining sequence
records what the other vertices still need. So the test is [[thm:havel-hakimi]] applied at most
$n$ times, each round a sort and at most $n$ subtractions. Example:
$(2, 2, 2) \to (1, 1) \to (0)$, so the sequence is graphic, and running the rounds backwards gives
the triangle. Non-example: $(4, 4, 2, 2, 0) \to (3, 1, 1, -1)$ stops at `@negative`.
:::

::: pitfall
Always **re-sort** before the next round, and always remove the **largest** entry. Working on
an unsorted sequence gives wrong answers: treating $(1, 1, 2, 2)$ as if $1$ were the largest
entry gives $(0, 2, 2)$, which is not graphic, although $(2, 2, 1, 1)$ is realised by $P_3$
(compare [[exr:t01-havel-hakimi-ties]]).
:::

Each round shortens the sequence by one, so the test finishes after at most $n$ rounds. By
[[thm:havel-hakimi]], every round preserves graphicness (the conditions in lines `@too-big` and
`@negative` detect sequences that are obviously not graphic), and the all-zero sequence is
realised by a graph without edges. Running the rounds backwards and adding the removed vertex
each time, as in the ($\Leftarrow$) part of the proof, builds a realisation.

::: example {#ex:havel-hakimi-11 title="A long Havel–Hakimi run" source="theory/2026-09-15 p6"}
Is $(7, 6, 6, 5, 4, 2, 2, 2, 2, 1, 1)$ graphic? (The sum is $38$, which is even.)

$$
\begin{aligned}
&(7, 6, 6, 5, 4, 2, 2, 2, 2, 1, 1) \\
\xrightarrow{-7}\ &(5, 5, 4, 3, 1, 1, 1, 2, 1, 1) \ \sim\ (5, 5, 4, 3, 2, 1, 1, 1, 1, 1) \\
\xrightarrow{-5}\ &(4, 3, 2, 1, 0, 1, 1, 1, 1) \ \sim\ (4, 3, 2, 1, 1, 1, 1, 1, 0) \\
\xrightarrow{-4}\ &(2, 1, 0, 0, 1, 1, 1, 0) \ \sim\ (2, 1, 1, 1, 1, 0, 0, 0).
\end{aligned}
$$

The last sequence is obviously graphic: a [[def:path-graph|path]] with degrees $1, 2, 1$, one more edge (degrees
$1, 1$) and three isolated vertices. So the original sequence is graphic, and adding the removed
vertices back gives a realisation.
:::

```graph id=t01-havel-hakimi-build widget=stepper
caption: Building a realisation of $(7,6,6,5,4,2,2,2,2,1,1)$ by running the Havel–Hakimi steps backwards. $v_i$ is the vertex that ends with degree $d_i$.
intent: Turn the abstract run into a picture: each step re-inserts the removed vertex adjacent to the vertices whose entries were decreased.
layout: force seed=3
v1 [label="$v_1$" class=hidden]; v2 [label="$v_2$" class=hidden]; v3 [label="$v_3$" class=hidden]
v4 [label="$v_4$"]; v5 [label="$v_5$"]; v6 [label="$v_6$"]; v7 [label="$v_7$"]; v8 [label="$v_8$"]; v9 [label="$v_9$"]; v10 [label="$v_{10}$"]; v11 [label="$v_{11}$"]
v4 -- v5; v4 -- v8; v10 -- v11
step: Realisation of the final sequence $(2,1,1,1,1,0,0,0)$: $v_4$ has degree 2, $v_5, v_8, v_{10}, v_{11}$ degree 1, and $v_6, v_7, v_9$ are isolated.
step: Undo the third round: add $v_3$ adjacent to $v_4, v_5, v_9, v_7$ (the entries $3,2,1,1$ that were decreased).
unclass hidden: v3
v3 -- v4 [class=highlight]; v3 -- v5 [class=highlight]; v3 -- v9 [class=highlight]; v3 -- v7 [class=highlight]
step: Undo the second round: add $v_2$ adjacent to $v_3, v_4, v_5, v_9, v_6$.
unclass hidden: v2
unclass highlight: v3--v4 v3--v5 v3--v9 v3--v7
v2 -- v3 [class=highlight]; v2 -- v4 [class=highlight]; v2 -- v5 [class=highlight]; v2 -- v9 [class=highlight]; v2 -- v6 [class=highlight]
step: Undo the first round: add $v_1$ adjacent to $v_2, \dots, v_8$. The degree sequence is now $(7,6,6,5,4,2,2,2,2,1,1)$.
unclass hidden: v1
unclass highlight: v2--v3 v2--v4 v2--v5 v2--v9 v2--v6
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]; v1 -- v5 [class=highlight]; v1 -- v6 [class=highlight]; v1 -- v7 [class=highlight]; v1 -- v8 [class=highlight]
```

::: example {#ex:havel-hakimi-fail title="Sequences that are not graphic" source="theory/2026-09-15 p6"}
1. $(4, 4, 2, 2, 0) \xrightarrow{-4} (3, 1, 1, -1)$. A negative entry appears, so the sequence is
   not graphic. (Directly: two vertices of degree 4 among five vertices would both be adjacent to
   every other vertex, including the vertex of degree 0.)
2. $(7, 2, 2, 1, 1, 1)$: here $d_1 = 7 > 5 = n - 1$, so there are not even enough other vertices
   for the first one, although the sum $14$ is even. Not graphic.
:::

```graph id=t01-havel-hakimi-player widget=player
caption: Run the Havel–Hakimi test step by step on the degree sequence of the example graph above.
intent: Algorithm player for the sequence test; the state panel shows the current sequence and the graph is built backwards at the end.
algo: havel-hakimi
params: seq="4,4,3,3,1,1,0"
```

### The Erdős–Gallai theorem

The lecture closes with a second characterisation of degree sequences. It does not need to be
applied repeatedly; it is a list of inequalities to check.

::: theorem {#thm:erdos-gallai title="Erdős–Gallai" source="theory/2026-09-15 p7"}
There exists a graph with a non-increasing degree sequence $(d_1, d_2, \dots, d_n)$ of
non-negative integers if and only if $d_1 + \dots + d_n$ is even and, for every
$k \in \set{1, \dots, n}$,
$$\sum_{i=1}^{k} d_i \ \le\ k(k-1) + \sum_{i=k+1}^{n} \min(d_i, k).$$
:::

::: intuition
Fix the $k$ vertices of the largest degrees, $A = \set{v_1, \dots, v_k}$. Their degrees are paid
by edges inside $A$ (at most $k(k-1)$ in total, since each of the $k$ vertices has at most $k-1$
neighbours in $A$) and by edges going to the other vertices. A vertex $v_i$ outside $A$ can
"absorb" at most $\min(d_i, k)$ of those edges: at most $d_i$ because that is its degree, and at
most $k$ because it can be adjacent to each vertex of $A$ only once.
:::

::: pitfall
The inequalities are for the **non-increasing** order, and they must hold for **every** $k$.
For $(3, 3, 1, 1)$ the case $k = 1$ holds ($3 \le 0 + 1 + 1 + 1$), but $k = 2$ fails
($6 > 2 + 1 + 1$), so the sequence is not graphic. Written in the wrong order as $(1, 1, 3, 3)$,
the same numbers pass all four inequalities.
:::

The lecture states this theorem without proof. Necessity is exactly the intuition above;
sufficiency is harder. We give a complete proof following the constructive argument of Tripathi,
Venugopalan and West (2010).

:::: proof {title="Proof (not covered in the lecture)"}
**Necessity.** Let $G$ realise the sequence with $d_G(v_i) = d_i$, and fix $k$. The sum is even by
[[lem:handshake]]. Let $A = \set{v_1, \dots, v_k}$ and $B = V(G) \setminus A$. Counting each edge by
its endpoints in $A$,
$$\sum_{i=1}^{k} d_i = 2\abs{E(G[A])} + \sum_{v \in B} \abs{N(v) \cap A},$$
where $E(G[A])$ are the edges with both endpoints in $A$. There are at most $\binom{k}{2}$ of those,
so the first term is at most $k(k-1)$. For $v_i \in B$ we have $\abs{N(v_i) \cap A} \le \abs{A} = k$ and
$\abs{N(v_i) \cap A} \le d_i$. This proves the inequality.

**Sufficiency.** Let the sequence satisfy the conditions. Call a simple graph $G$ on
$\set{v_1, \dots, v_n}$ a **subrealisation** if $d_G(v_i) \le d_i$ for all $i$, and call
$e_i = d_i - d_G(v_i) \ge 0$ the **deficiency** of $v_i$. The edgeless graph is a subrealisation.
A subrealisation with all deficiencies $0$ is a realisation.

Given a subrealisation that is not a realisation, let $r$ be the smallest index with $e_r > 0$.
So $v_1, \dots, v_{r-1}$ have their full degrees, and $d_G(v_r) < d_r$. We show how to change $G$ into
another subrealisation in which $v_1, \dots, v_{r-1}$ still have full degree and **the degree of
$v_r$ is larger**. Repeating this, $d_G(v_r)$ grows until it reaches $d_r$; then the smallest
deficient index moves to the right. It never moves left, and the degree of $v_r$ is bounded by
$d_r$, so after finitely many steps we reach a realisation.

Two facts are used repeatedly.

- *(Parity.)* $\sum_i d_i$ is even by assumption and $\sum_i d_G(v_i)$ is even by [[lem:handshake]],
  so the total deficiency $\sum_i e_i$ is even. Hence, **if $e_r = 1$**, some other vertex is
  deficient, and since $v_1, \dots, v_{r-1}$ are not, there is a deficient $v_k$ with $k > r$.
- *(Full vertices have many neighbours.)* If $i < r$, then $d_G(v_i) = d_i \ge d_r > d_G(v_r)$.

We write $N(x)$ for the neighbourhood in the current graph $G$. Every operation below removes
some edges and adds some non-edges; for each one we list how the degrees change, and every degree
not listed is unchanged. One checks directly that no degree exceeds its target and that
$v_1, \dots, v_{r-1}$ keep their degrees.

*Case 1: $v_r$ is not adjacent to some $v_k$ with $k > r$ and $e_k > 0$.* Add the edge $v_r v_k$.
($v_r$ and $v_k$ gain one; both were deficient.)

*Case 2: $v_r$ is not adjacent to some $v_i$ with $i < r$.* Since
$d_G(v_i) > d_G(v_r)$ and $v_r \notin N(v_i)$, there is $u \in N(v_i) \setminus N(v_r)$, $u \ne v_r$.

- If $e_r \ge 2$: remove $v_i u$, add $v_i v_r$ and $u v_r$. ($v_i$ and $u$ lose one and gain one;
  $v_r$ gains two, which is allowed since $e_r \ge 2$.)
- If $e_r = 1$: by parity there is a deficient $v_k$ with $k > r$. If $v_k \notin N(v_r)$, Case 1
  applies, so assume $v_k \in N(v_r)$. We have $d_G(v_i) = d_i \ge d_k > d_G(v_k)$, so $v_i$ has a
  neighbour $w$ with $w \ne v_k$ and $w \notin N(v_k)$: if $v_i \notin N(v_k)$, this follows from
  $d_G(v_i) > d_G(v_k)$; if $v_i \in N(v_k)$, then $v_i$ has $d_G(v_i) - 1$ neighbours other than
  $v_k$, and at most $d_G(v_k) - 1$ of them are neighbours of $v_k$ (as $v_i$ itself is one), and
  $d_G(v_i) - 1 > d_G(v_k) - 1$. Also $w \ne v_r$ because $v_r \notin N(v_i)$. Remove $v_i w$, add
  $v_i v_r$ and $w v_k$. ($v_i$, $w$ unchanged; $v_r$ and $v_k$ gain one.)

*Case 3: neither Case 1 nor Case 2 applies.* Then $v_r$ is adjacent to all of $v_1, \dots, v_{r-1}$,
and every $v_k$ with $k > r$ that is not adjacent to $v_r$ has full degree. Let
$A = \set{v_1, \dots, v_r}$ and $B$ the rest. As in the necessity part,
$$\sum_{i=1}^{r} d_i - e_r = \sum_{i=1}^{r} d_G(v_i) = 2\abs{E(G[A])} + \sum_{v \in B}\abs{N(v) \cap A}.$$
The condition for $k = r$ says the left-hand side plus $e_r \ge 1$ is at most
$r(r-1) + \sum_{v_i \in B}\min(d_i, r)$. Since always $2\abs{E(G[A])} \le r(r-1)$ and
$\abs{N(v_i) \cap A} \le \min(d_G(v_i), r) \le \min(d_i, r)$, at least one of these inequalities
is strict:

- **(3a)** some two vertices $v_i, v_j \in A$ are non-adjacent, or
- **(3b)** some $v_k \in B$ satisfies $\abs{N(v_k) \cap A} < \min(d_k, r)$.

*Case 3a.* As $v_r$ is adjacent to all of $A$, we have $i, j < r$, so both are full. For
$x \in \set{v_i, v_j}$ let $X_x = N(x) \setminus (N(v_r) \cup \set{v_r})$. Since $x \in N(v_r)$
and $v_r \in N(x)$, we get $\abs{X_x} \ge (d_G(x) - 1) - (d_G(v_r) - 1) \ge d_r - d_G(v_r) = e_r \ge 1$.

- If $e_r \ge 2$: then $\abs{X_{v_i}}, \abs{X_{v_j}} \ge 2$, so we can pick $u \in X_{v_i}$ and
  $u' \in X_{v_j}$ with $u \ne u'$. Remove $v_i u$ and $v_j u'$, add $v_i v_j$, $v_r u$ and
  $v_r u'$. ($v_i, v_j, u, u'$ unchanged; $v_r$ gains two.) The added pairs are non-edges: $v_iv_j$
  by assumption, and $u, u' \notin N(v_r)$.
- If $e_r = 1$: by parity there is a deficient $v_k$, $k > r$; as Case 1 does not apply,
  $v_k \in N(v_r)$. Pick $w \in N(v_i) \setminus (N(v_k) \cup \set{v_k})$, which exists as shown in
  Case 2, and $u' \in X_{v_j}$. Remove $v_i w$ and $v_j u'$, add $v_i v_j$, $w v_k$ and $u' v_r$.
  Here $w \ne v_r$ (since $v_r \in N(v_k)$) and $u' \ne v_k$ (since $v_k \in N(v_r)$). If $w = u'$,
  this vertex loses two edges and gains the two edges $wv_k$, $wv_r$, which are different and both
  new; otherwise $w$ and $u'$ each lose one and gain one. Altogether $v_i, v_j, w, u'$ are unchanged,
  and $v_r$ and $v_k$ gain one.

*Case 3b.* Since $\abs{N(v_k) \cap A} < r$, some vertex of $A$ is not adjacent to $v_k$, and
$\abs{N(v_k) \cap A} < d_k$.

- If $v_k \notin N(v_r)$: then $v_k$ is full (Case 1 does not apply), so
  $d_G(v_k) = d_k > \abs{N(v_k) \cap A}$, and $v_k$ has a neighbour $x \in B$. Remove $v_k x$, add
  $v_k v_r$. ($v_k$ unchanged, $x \in B$ loses one, which is allowed since $x$ has index $> r$;
  $v_r$ gains one.)
- If $v_k \in N(v_r)$: let $v_i \in A$ be a vertex not adjacent to $v_k$; then $i < r$. Pick
  $u \in X_{v_i}$ as in Case 3a; $u \ne v_k$ since $v_k \in N(v_r)$, and $u \in B$ since $v_r$ is
  adjacent to all other vertices of $A$.
  - If $v_k$ is deficient: remove $v_i u$, add $v_i v_k$ and $u v_r$. ($v_i, u$ unchanged;
    $v_k, v_r$ gain one.)
  - If $v_k$ is full: it has a neighbour $x \in B$ as before. Remove $v_i u$ and $v_k x$, add
    $v_i v_k$ and $u v_r$. ($v_i$ and $v_k$ unchanged; $v_r$ gains one.) If $u \ne x$, then $u$ is
    unchanged and $x$ loses one. If $u = x$, this vertex loses two edges and gains one, so it
    loses one. Either way the only vertex that loses degree lies in $B$.

In every case the degree of $v_r$ grows, the first $r - 1$ vertices stay full, and no target is
exceeded. This completes the proof.
::::

::: remark
Some operations in Case 3b lower the degree of a vertex of $B$. This
is allowed: a vertex of $B$ has index larger than $r$, a subrealisation only bounds degrees from
above, and only the vertices before $v_r$ must stay full.
:::

## Summary

- A graph is $G = (V, E)$ with $E \subseteq \binom{V}{2}$ ([[def:graph]]); mixed multigraphs
  $(V, E, \varepsilon)$ add loops, parallel edges and arcs ([[def:mixed-multigraph]]).
- Standard families: $P_n$ (length $n$, so $n+1$ vertices), $C_n$, $K_n$, $K_{m,n}$
  ([[def:path-graph]], [[def:cycle-graph]], [[def:complete-graph]], [[def:complete-bipartite]]).
- Isomorphism is a bijection preserving adjacency *and* non-adjacency ([[def:isomorphism]]); a
  "graph" usually means an isomorphism class. Equal vertex counts, edge counts and degree
  sequences are necessary for isomorphism, but not sufficient ([[prop:iso-invariants]]).
- The [[def:degree|degree]] sum is $\sum_v d(v) = 2\abs{E}$ ([[lem:handshake]]), so the number of odd-degree vertices is even
  ([[cor:odd-degree-count]]).
- Havel–Hakimi: $(d_1, \dots, d_n)$ is graphic iff the sequence obtained by deleting $d_1$ and
  decreasing the next $d_1$ entries is graphic ([[thm:havel-hakimi]]). The proof uses 2-switches.
- Erdős–Gallai: graphic iff the sum is even and
  $\sum_{i \le k} d_i \le k(k-1) + \sum_{i > k}\min(d_i, k)$ for all $k$ ([[thm:erdos-gallai]]).

## Exercises

```graph id=t01-ex-build-sequence widget=exercise
task: build
prompt: Add edges so that the graph has degree sequence $(3, 3, 2, 2, 2)$.
check: degree-sequence seq="3,3,2,2,2"
check: is-simple
hint: The sum is $12$, so you need exactly $6$ edges.
hint: Run Havel–Hakimi: $(3,3,2,2,2) \to (2,1,1,2) \sim (2,2,1,1) \to (1,0,1) \sim (1,1,0) \to (0,0)$. Now add the vertices back.
solution: One realisation: the cycle $1\,3\,4\,2\,5\,1$ plus the edge $12$. Then $1$ and $2$ have degree $3$, the others degree $2$.
use: E(5)
```

```graph id=t01-ex-odd-vertices widget=exercise
task: select-vertices
prompt: Select all vertices of odd degree.
check: odd-degree-vertices
solution: The odd-degree vertices are $a$, $c$, $d$ and $f$ (degrees $3, 1, 3, 1$). There are four of them, an even number, as [[cor:odd-degree-count]] predicts.
a -- b; a -- d; a -- e; b -- d; c -- d; e -- f
```

:::: exercise {#exr:t01-equal-degrees title="Two vertices of the same degree" difficulty=2}
Prove that every simple graph with at least two vertices has two vertices of the same
[[def:degree|degree]].

::: hint
What values can the degrees take? Can the values $0$ and $n-1$ both occur?
:::

::: solution
Let $n \ge 2$ be the number of vertices. Every degree lies in $\set{0, 1, \dots, n-1}$, a set of $n$
values. The values $0$ and $n - 1$ cannot both occur: a vertex of degree $n-1$ is adjacent to every
other vertex, so no vertex is isolated. Hence the $n$ degrees take at most $n - 1$ different values,
and by the pigeonhole principle two vertices have the same degree.
:::
::::

:::: exercise {#exr:t01-graphic-check title="Graphic or not?" difficulty=1}
Decide which of the following sequences are [[def:graphic-sequence|graphic]]. For the graphic
ones, draw a realisation.

1. $(3, 3, 3, 3, 3, 3)$
2. $(5, 5, 4, 3, 2, 1)$
3. $(3, 3, 3, 1)$

::: solution
1. Graphic: $(3,3,3,3,3,3) \to (2,2,2,3,3) \sim (3,3,2,2,2) \to (2,1,1,2) \sim (2,2,1,1) \to (1,0,1) \sim (1,1,0) \to (0,0)$. A realisation is $K_{3,3}$ (or the triangular prism).
2. Not graphic: $(5,5,4,3,2,1) \to (4,3,2,1,0) \to (2,1,0,-1)$. Alternatively, Erdős–Gallai fails for
   $k = 2$: $5 + 5 = 10 > 2 + \min(4,2) + \min(3,2) + \min(2,2) + \min(1,2) = 9$.
3. Not graphic: $(3,3,3,1) \to (2,2,0) \to (1,-1)$. Directly: the three vertices of degree 3 are each
   adjacent to all other vertices, so the last vertex would have degree 3.
:::
::::

:::: exercise {#exr:t01-c5-self-complementary title="A self-complementary graph" difficulty=2}
The **complement** $\ol{G}$ of a simple graph $G$ has the same vertices, and two distinct vertices
are adjacent in $\ol{G}$ exactly when they are not adjacent in $G$. Show that $C_5 \cong \ol{C_5}$.

::: hint
In $\ol{C_5}$, the vertex $i$ is adjacent to $i + 2$ and $i - 2$ (modulo 5).
:::

::: solution
The non-edges of $C_5$ on $\set{1, \dots, 5}$ are $13, 35, 52, 24, 41$, so $\ol{C_5}$ is the [[def:cycle-graph|cycle]]
$1\,3\,5\,2\,4\,1$. The bijection $f(1) = 1$, $f(2) = 3$, $f(3) = 5$, $f(4) = 2$, $f(5) = 4$ maps the
edges $12, 23, 34, 45, 51$ of $C_5$ to $13, 35, 52, 24, 41$, the edges of $\ol{C_5}$. Both graphs have
5 edges, and $f$ maps edges onto edges bijectively, so it also maps non-edges onto non-edges. Hence
$f$ is an [[def:isomorphism|isomorphism]].
:::
::::

```graph id=t01-ex-complement widget=figure
caption: $C_5$ and its complement, drawn with the vertex positions of $C_5$: the complement is a pentagram, which is again a 5-cycle.
intent: Visual support for the exercise above.
height: small
layout-sync: true
panel: $C_5$
use: C(5)
panel: $\overline{C_5}$
use: complement(C(5))
```

:::: exercise {#exr:t01-havel-hakimi-ties title="Ties in Havel–Hakimi" difficulty=3}
In [[thm:havel-hakimi]], the vertex of the **largest** degree is removed. Show by an example that the
following variant is false: "$(d_1, \dots, d_n)$ is graphic iff the sequence obtained by removing
the **smallest** positive entry $d_j$ and subtracting $1$ from the $d_j$ **smallest** other positive
entries is graphic."

::: solution
Take the graphic sequence $(2, 2, 1, 1)$ (realised by $P_3$). The smallest positive entry is $1$;
removing one $1$ and subtracting $1$ from the smallest other positive entry, which is the other
$1$, gives $(2, 2, 0)$. This is not graphic: two vertices of degree 2 among three vertices would
both be adjacent to the third vertex, which has degree 0. So the variant fails. (Removing the
smallest entry is fine if you subtract from the **largest** entries; that is another valid version
of the theorem.)
:::
::::

:::: quiz {#q:t01-degree-sum}
A graph has 7 edges. What is the sum of its vertex degrees?

- [ ] 7
- [x] 14
- [ ] 21
- [ ] It depends on the graph.

::: explanation
By [[lem:handshake]], the degree sum is $2m = 14$ for every graph with 7 edges.
:::
::::

:::: quiz {#q:t01-path-vertices}
How many vertices does $P_4$ have?

answer: 5

::: explanation
$P_n$ is the path of **length** $n$, that is, with $n$ edges and $n + 1$ vertices
([[def:path-graph]]).
:::
::::

:::: quiz {#q:t01-kmn-edges}
How many edges does $K_{3,4}$ have?

answer: 12

::: explanation
Each of the 3 vertices on one side is adjacent to each of the 4 vertices on the other side:
$3 \cdot 4 = 12$ ([[obs:edge-counts-classes]]).
:::
::::

:::: quiz {#q:t01-iso-degree}
Two graphs have the same [[def:degree-sequence|degree sequence]]. Are they necessarily
isomorphic?

- [ ] Yes
- [x] No

::: explanation
$C_6$ and two disjoint triangles both have degree sequence $(2,2,2,2,2,2)$ but are not isomorphic.
:::
::::

:::: quiz {#q:t01-odd-count}
Is there a graph with exactly three vertices of odd degree?

- [ ] Yes
- [x] No

::: explanation
By [[cor:odd-degree-count]] the number of odd-degree vertices is always even.
:::
::::
