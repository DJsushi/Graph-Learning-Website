---
title: Subgraphs, walks and bipartite graphs
course: theory
lecture: 2
slug: t02
summary: Subgraphs and induced subgraphs, cliques and independent sets, walks and paths, connected components, graph distance, and the characterisation of bipartite graphs by odd cycles.
prerequisites: [theory/01-basic-notions]
sources:
  - resources/graph-theory/2026-09-22-13_38_58-join.pdf (pp. 3–5)
status: draft
---

In this lesson we start looking *inside* graphs: at smaller graphs contained in them, and at
ways of moving through them along edges. Moving along edges leads to the notions of
connectivity and distance. As a first real structural theorem, we characterise bipartite graphs:
a graph can be split into two independent halves exactly when it has no cycle of odd length.

## Subgraphs

::: definition {#def:subgraph title="Subgraph, induced subgraph" defines="subgraph, induced subgraph" source="theory/2026-09-22 p3"}
A graph $G_1$ is a **subgraph** of a graph $G$, written $G_1 \subseteq G$, if
$V(G_1) \subseteq V(G)$, $E(G_1) \subseteq E(G)$ (and $G_1$ is a graph, i.e. every edge of $G_1$ has
both endpoints in $V(G_1)$).

$G_1$ is an **induced subgraph** of $G$, written $G_1 \subseteq_i G$, if $G_1 \subseteq G$ and for all
$u, v \in V(G_1)$:
$$\set{u, v} \in E(G_1) \iff \set{u, v} \in E(G).$$
:::

An induced subgraph is determined by its vertex set alone: it keeps **all** edges of $G$ among
the chosen vertices. For $X \subseteq V(G)$ we write $G[X]$ for the subgraph **induced** on $X$, and
$G - X = G[V(G) \setminus X]$ for the graph obtained by **deleting** the vertices of $X$ (with all
their edges). For a set $F$ of edges, $G - F$ deletes the edges (and keeps all vertices), and
$G + e$ adds an edge $e$. We write $G - v$ and $G - e$ for single elements.

```graph id=t02-subgraphs widget=figure
caption: A graph $G$, a subgraph of $G$ that is not induced (the edge $bd$ is missing), and the induced subgraph $G[\set{a,b,c,d}]$.
intent: Contrast subgraph vs induced subgraph on the same vertex set.
layout-sync: true
height: small
panel: $G$
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0); e @(2, 0.5)
a -- b -- c -- d -- a; b -- d; b -- e; c -- e
panel: subgraph
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
a -- b -- c -- d -- a
panel: $G[\set{a,b,c,d}]$
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
a -- b -- c -- d -- a; b -- d
```

For multigraphs the definition must also keep the endpoint map:

::: definition {#def:submultigraph title="Submultigraph" source="theory/2026-09-22 p3"}
$G_1 = (V_1, E_1, \varepsilon_1)$ is a **submultigraph** of $G = (V, E, \varepsilon)$ if
$V_1 \subseteq V$, $E_1 \subseteq E$, and $\varepsilon_1(e) = \varepsilon(e)$ for all $e \in E_1$.
:::

The condition $\varepsilon_1(e) = \varepsilon(e)$ says that an edge keeps its endpoints when we pass
to the submultigraph (and implicitly that those endpoints lie in $V_1$).

::: definition {#def:clique title="Clique, independent set" defines="clique, independent set" source="theory/2026-09-22 p3"}
A **clique** in $G$ is a subgraph of $G$ isomorphic to a complete graph $K_m$. (Equivalently, a set
of pairwise adjacent vertices.)

An **independent set** in $G$ is a set $X \subseteq V(G)$ such that no edge of $G$ has both ends in
$X$.
:::

```graph id=t02-clique-independent widget=figure
caption: The highlighted vertices form a clique $K_4$; the four vertices on the right form an independent set.
intent: Transcription of the lecture picture: a dense blob and a set of pairwise non-adjacent vertices.
layout: fixed
a @(0, 1) [class=highlight]; b @(1, 1) [class=highlight]; c @(1, 0) [class=highlight]; d @(0, 0) [class=highlight]
p @(2.4, 1) [class=color2]; q @(3.2, 1) [class=color2]; r @(2.4, 0) [class=color2]; s @(3.2, 0) [class=color2]
a -- b -- c -- d -- a [class=highlight]; a -- c [class=highlight]; b -- d [class=highlight]
c -- r; b -- p; d -- r; c -- s
```

A set $X$ is independent in $G$ exactly when it is a clique in the complement $\ol{G}$.

## Walks and paths

::: definition {#def:walk title="Walk" defines="walk, closed walk, length of a walk" source="theory/2026-09-22 p3"}
A **walk** in a (multi)graph $G$ is a sequence
$$W = (v_0, e_0, v_1, e_1, v_2, \dots, e_{k-1}, v_k)$$
of vertices $v_i$ and edges $e_i$ of $G$ such that $e_i$ has the endpoints $v_i$ and $v_{i+1}$ for all
$i \in \set{0, \dots, k-1}$ (in a simple graph: $e_i = \set{v_i, v_{i+1}} \in E(G)$). The walk goes
**from $v_0$ to $v_k$**, and its **length** is $k$, the number of edge steps. It is **closed** if
$v_0 = v_k$.
:::

In a walk, vertices and edges may repeat. In simple graphs the edges are determined by the
vertices, so we often write just $(v_0, v_1, \dots, v_k)$.

A **path** in $G$ is a subgraph of $G$ isomorphic to some $P_k$ ([[def:path-graph]]); a **cycle** in
$G$ is a subgraph isomorphic to some $C_k$ ([[def:cycle-graph]]). A walk whose vertices are all
distinct "traces" a path: its vertices and edges form a path from $v_0$ to $v_k$. A **$u$–$v$ path** is
a path whose two ends are $u$ and $v$.

::: claim {#claim:shortest-walk-path title="Shortest walks are paths" source="theory/2026-09-22 p4"}
A shortest walk between vertices $v_0$ and $v_k$ in a graph is a path.
:::

::: proof
Let $W = (v_0, e_0, v_1, \dots, e_{k-1}, v_k)$ be a walk from $v_0$ to $v_k$ of minimum length. If
some vertex repeats, say $v_i = v_j$ with $i < j$, then
$$W' = (v_0, e_0, \dots, v_i, e_j, v_{j+1}, \dots, v_k)$$
(we skip the closed part between the two visits) is again a walk from $v_0$ to $v_k$, of length
$k - (j - i) < k$. This contradicts minimality. So all vertices of $W$ are distinct, and its vertices
and edges form a path from $v_0$ to $v_k$.
:::

The proof is a "shortcut" argument that is used all the time: whenever a walk visits a vertex
twice, cut out the loop between the two visits.

```graph id=t02-shortcut widget=stepper
caption: Shortening a walk: when a walk revisits a vertex, the part between the two visits can be cut out.
intent: Visualise the proof of the claim: walk a-b-c-d-b-e repeats b; cutting gives the path a-b-e.
layout: fixed
a @(0, 0); b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9)
a -- b; b -- c; c -- d; d -- b; b -- e
step: The walk $(a, b, c, d, b, e)$ from $a$ to $e$ visits $b$ twice.
class path: a--b b--c c--d d--b b--e
step: The closed part $(b, c, d, b)$ between the two visits can be removed.
class muted: b--c c--d d--b
unclass path: b--c c--d d--b
step: What remains, $(a, b, e)$, is a shorter walk from $a$ to $e$; here it is already a path.
```

## Connectivity and distance

The relation "$u$ and $v$ are connected by a walk" on $V(G)$ is an **equivalence relation**:

- it is reflexive: $(v)$ is a walk of length $0$ from $v$ to $v$;
- it is symmetric: reversing a walk from $u$ to $v$ gives a walk from $v$ to $u$;
- it is transitive: a walk from $u$ to $v$ followed by a walk from $v$ to $w$ is a walk from $u$ to $w$.

::: definition {#def:component title="Connected components" defines="component, connected" source="theory/2026-09-22 p4"}
The equivalence classes of the relation "connected by a walk" on $V(G)$ are called the
**(connected) components** of $G$. (Often the subgraphs induced on these classes are also called
components.) A graph is **connected** if it has exactly one component, that is, if every two
vertices are connected by a walk.
:::

By [[claim:shortest-walk-path]], "connected by a walk" is the same as "connected by a path".

::: definition {#def:distance title="Graph distance" defines="distance, dist" source="theory/2026-09-22 p4"}
The **distance** of vertices $u, v$ in $G$ is
$$\mathrm{dist}_G(u, v) := \min\set{\text{length of a walk from } u \text{ to } v},$$
with $\mathrm{dist}_G(u, v) = \infty$ if $u$ and $v$ lie in different components.
:::

::: proposition {#prop:distance-metric title="Distance is a metric" extra=true}
For all vertices $u, v, w$ of a graph $G$: $\mathrm{dist}(u, v) \ge 0$ with equality iff $u = v$;
$\mathrm{dist}(u, v) = \mathrm{dist}(v, u)$; and
$\mathrm{dist}(u, w) \le \mathrm{dist}(u, v) + \mathrm{dist}(v, w)$. In particular, if
$uv \in E(G)$, then $\abs{\mathrm{dist}(x, u) - \mathrm{dist}(x, v)} \le 1$ for every vertex $x$ in the
component of $u$ (for $x$ in another component both distances are $\infty$).
<!-- REVIEW: restricted the last claim to x in the component of u; for other x the difference is ∞ − ∞. -->
:::

::: proof
A walk of length $0$ stays at its start, which gives the first property; reversing walks gives the
second; concatenating a shortest $u$–$v$ walk with a shortest $v$–$w$ walk gives a $u$–$w$ walk of
length $\mathrm{dist}(u,v) + \mathrm{dist}(v,w)$, which gives the triangle inequality (with the usual
rules for $\infty$). If $uv$ is an edge, then $\mathrm{dist}(u, v) = 1$, so the triangle inequality
gives $\mathrm{dist}(x, u) \le \mathrm{dist}(x, v) + 1$ and $\mathrm{dist}(x, v) \le \mathrm{dist}(x, u) + 1$.
:::

### Breadth-first search

The distances from one vertex to all others are computed by **breadth-first search** (BFS), which
also appears in the proof of the main theorem of this lesson.

::: algorithm {#alg:bfs title="Breadth-first search (BFS)"}
**Input:** a graph $G$ and a start vertex $x$. **Output:** $\mathrm{dist}(x, v)$ for all $v$ and a BFS tree.

```pseudo
dist(x) ← 0; mark x; Q ← queue containing x            // @init
while Q is not empty:                                  // @loop
    u ← remove the first vertex of Q                   // @dequeue
    for each neighbour w of u:                         // @scan
        if w is not marked:                            // @test
            mark w; dist(w) ← dist(u) + 1; parent(w) ← u // @discover
            append w to Q                              // @enqueue
```
:::

BFS discovers the vertices in order of their distance from $x$. The **layer** $i$ is the set
$L_i = \set{v : \mathrm{dist}(x, v) = i}$; the edges $\set{\mathrm{parent}(w), w}$ form the **BFS tree**,
in which the path from any $w \in L_i$ up to $x$ has length exactly $i$ and visits one vertex of each
layer $L_{i-1}, L_{i-2}, \dots, L_0$. By [[prop:distance-metric]], every edge of $G$ joins two vertices in the
same layer or in consecutive layers.

Why the computed values are the true distances: the queue always holds some vertices with value
$i$ followed by some with value $i + 1$, so vertices leave the queue in non-decreasing order of value.
Each value $\mathrm{dist}(w) = \mathrm{dist}(u) + 1$ is the length of a walk (the tree path) from $x$
to $w$, so it is at least $\mathrm{dist}(x, w)$. Conversely, by induction on $d = \mathrm{dist}(x, w)$: a
vertex $w$ at distance $d \ge 1$ has a neighbour $u$ at distance $d - 1$, which by induction is
reached with value $d - 1$. When $u$ leaves the queue, $w$ is either marked now with value $d$, or it was
marked earlier from a vertex that left the queue before $u$, hence with value at most $d$. So BFS
reaches exactly the component of $x$, and the value of $w$ is $\mathrm{dist}(x, w)$.
<!-- REVIEW: added the BFS correctness argument; the theorem proof below relies on BFS values being the true distances. -->

```graph id=t02-bfs-player widget=player
caption: Breadth-first search from $x$. Vertices are discovered layer by layer; the BFS tree edges are highlighted.
intent: Show BFS layers (distance classes) and the BFS tree; prepares the proof of the bipartite theorem.
algo: bfs
params: source=x
x -- a; x -- b; x -- c; a -- d; b -- d; b -- e; c -- e; c -- f; d -- g; e -- g; f -- h; g -- h; e -- f
```

## Bipartite graphs

::: definition {#def:bipartite title="Bipartite graph" defines="bipartite, bipartition" source="theory/2026-09-22 p4"}
A graph $G$ is **bipartite** if there are sets $A, B$ with $A \cup B = V(G)$, $A \cap B = \emptyset$, such
that both $A$ and $B$ are independent. The pair $(A, B)$ is a **bipartition** of $G$.
:::

So every edge of a bipartite graph has one end in $A$ and the other in $B$.

::: proposition {#prop:bipartite-subgraph-kmn title="Bipartite graphs are subgraphs of $K_{m,n}$" source="theory/2026-09-22 p4"}
A graph $G$ is bipartite if and only if $G$ is isomorphic to a subgraph of $K_{m,n}$ for suitable
$m, n$.
:::

::: proof
If $(A, B)$ is a bipartition of $G$, let $m = \abs{A}$ and $n = \abs{B}$, and identify $A$ with $V_m$ and $B$
with $V_n$ in $K_{m,n}$ ([[def:complete-bipartite]]) by any bijections. Every edge of $G$ joins $A$ and $B$,
so it is an edge of $K_{m,n}$; hence $G$ becomes a subgraph of $K_{m,n}$.

Conversely, $(V_m, V_n)$ is a bipartition of $K_{m,n}$, and a subgraph inherits it: a set that is
independent in $K_{m,n}$ is independent in every subgraph, since the subgraph has fewer edges.
(Vertices of $K_{m,n}$ that are not in the subgraph are simply dropped from $V_m$ and $V_n$.)
:::

::: theorem {#thm:bipartite-odd-cycle title="König's characterisation of bipartite graphs" aka="bipartite iff no odd cycle" source="theory/2026-09-22 p5"}
A graph $G$ is bipartite if and only if $G$ contains no cycle of odd length.
:::

:::: proof
**($\Rightarrow$)** Let $(A, B)$ be a bipartition of $G$ and let $C \subseteq G$ be a cycle with vertices
$c_1, c_2, \dots, c_\ell$ in cyclic order. Every edge $c_i c_{i+1}$ joins $A$ and $B$, so the vertices of $C$
alternate between $A$ and $B$ as we go around. Going once around the cycle we return to $c_1$, which
lies in the same set it started in. So the number of steps, $\ell$, is even.

**($\Leftarrow$)** We show the contrapositive: if $G$ is not bipartite, then $G$ has an odd cycle.

First, a graph is bipartite iff each of its components is: given bipartitions $(A_j, B_j)$ of all
the components, $(\bigcup A_j, \bigcup B_j)$ is a bipartition of $G$, because there are no edges between
different components. So if $G$ is not bipartite, some component $K$ is not bipartite; we find an odd
cycle in $K$.

Run BFS from any vertex $x \in K$. It reaches all of $K$. Let
$$A := L_0 \cup L_2 \cup L_4 \cup \dots \quad (\text{even layers}), \qquad B := L_1 \cup L_3 \cup \dots \quad (\text{odd layers}).$$
Since $K$ is not bipartite, one of $A, B$ is not independent; without loss of generality (the argument
is the same for $B$) there is an edge $a_1a_2 \in E(G)$ with $a_1, a_2 \in A$. Every edge joins
vertices in the same or consecutive layers, and $a_1, a_2$ both lie in even layers, so they lie in
the **same** layer $L_i$, $i \ge 1$ (layer $L_0 = \set{x}$ has only one vertex).

Consider the paths from $a_1$ and from $a_2$ to $x$ in the BFS tree. Once these two paths meet, they
continue identically (each vertex has a unique parent). Let $b$ be the first vertex where they meet,
the **least common ancestor** of $a_1$ and $a_2$; say $b \in L_j$ with $j < i$ (as $a_1 \ne a_2$ are in the
same layer, $b$ is neither of them). The tree path from $a_1$ to $b$ and the tree path from $a_2$ to $b$
both have length $i - j$, and they share only the vertex $b$. Together with the edge $a_1a_2$ they form a
cycle of length
$$(i - j) + (i - j) + 1 = 2(i - j) + 1,$$
which is odd.
::::

```graph id=t02-odd-cycle-bfs widget=stepper
caption: The proof in action: BFS layers from $x$, an edge $a_1a_2$ inside one layer, and the odd cycle through their least common ancestor $b$.
intent: Transcription of the lecture sketch with layers 0..3; show how the edge inside a layer closes an odd cycle with the two tree paths.
layout: fixed
x @(0, 3); b @(-1, 2); p @(1, 2); c1 @(-1.6, 1); c2 @(-0.4, 1); q @(1, 1); a1 @(-1.6, 0) [label="$a_1$"]; a2 @(-0.4, 0) [label="$a_2$"]; r @(1, 0)
x -- b [class=tree]; x -- p [class=tree]; b -- c1 [class=tree]; b -- c2 [class=tree]; p -- q [class=tree]
c1 -- a1 [class=tree]; c2 -- a2 [class=tree]; q -- r [class=tree]; c2 -- q; a2 -- r
a1 -- a2
group L0: x [label="$L_0$"]
group L1: b p [label="$L_1$"]
group L2: c1 c2 q [label="$L_2$"]
group L3: a1 a2 r [label="$L_3$"]
step: BFS layers from $x$; tree edges are drawn bold. Even layers form $A$, odd layers form $B$.
step: The edge $a_1a_2$ has both ends in layer $L_3$, so $A$ or $B$ is not independent.
class highlight: a1--a2
step: Follow the tree paths from $a_1$ and $a_2$ upwards until they meet at $b$, their least common ancestor in layer $L_1$.
class path: a1--c1 c1--b a2--c2 c2--b
step: Both tree paths have length $3 - 1 = 2$; with the edge $a_1a_2$ they form a cycle of length $2 \cdot 2 + 1 = 5$.
class cycle: a1 a2 c1 c2 b a1--a2 a1--c1 c1--b a2--c2 c2--b
```

::: remark
The proof gives an efficient algorithm: run BFS in every component and 2-colour the vertices by the
parity of their layer. Either this colouring is a bipartition, or an edge inside a layer exhibits an
odd cycle, a short **certificate** that the graph is not bipartite.
:::

```graph id=t02-bipartite-sandbox widget=editable
caption: Experiment: the graph is bipartite exactly when it has no odd cycle. Add an edge that closes an odd cycle and watch the property change.
intent: Let students test the theorem; live properties show bipartiteness and girth.
live: bipartite, girth, components
use: C(6)
```

## Summary

- $G_1 \subseteq G$ is a subgraph; induced subgraphs $G[X]$ keep all edges among $X$
  ([[def:subgraph]]). Cliques and independent sets ([[def:clique]]).
- Walks may repeat vertices and edges; a shortest walk is a path ([[claim:shortest-walk-path]]).
- Components are the classes of "connected by a walk" ([[def:component]]); distance is the length
  of a shortest walk ([[def:distance]]) and is computed by BFS ([[alg:bfs]]).
- $G$ is bipartite iff $G \subseteq K_{m,n}$ ([[prop:bipartite-subgraph-kmn]]) iff $G$ has no odd cycle
  ([[thm:bipartite-odd-cycle]]).

## Exercises

```graph id=t02-ex-odd-cycle widget=exercise
task: select-edges
prompt: This graph is not bipartite. Select the edges of an odd cycle.
check: is-cycle
check: odd-length
hint: Run BFS from any vertex and look for an edge inside one layer.
solution: For example $a\,b\,c\,d\,e\,a$ is a cycle of length 5.
a -- b; b -- c; c -- d; d -- e; e -- a; a -- f; f -- g; g -- c; b -- h; h -- d
```

```graph id=t02-ex-bipartition widget=exercise
task: select-vertices
prompt: Select one side $A$ of a bipartition of this graph.
check: is-bipartition-side
solution: The vertices of $Q_3$ are the binary strings of length 3; one side is the strings with an even number of ones, $\set{000, 011, 101, 110}$, the other side the strings with an odd number of ones.
use: Q(3)
```

:::: exercise {#exr:t02-induced-count title="Counting subgraphs" difficulty=1}
How many induced subgraphs does a graph with $n$ vertices have (counting subgraphs with different
vertex sets as different, including the empty graph)? How many subgraphs does $K_3$ have?

::: solution
An induced subgraph is determined by its vertex set, so there are $2^n$ of them. For $K_3$: choose the
vertex set $X$, then any subset of the edges of $K_3$ inside $X$. $\abs{X} = 0$: 1 subgraph; $\abs{X} = 1$:
$3 \cdot 1$; $\abs{X} = 2$: $3 \cdot 2$ (with or without the edge); $\abs{X} = 3$: $2^3 = 8$. In total
$1 + 3 + 6 + 8 = 18$.
:::
::::

:::: exercise {#exr:t02-connected-complement title="A graph or its complement is connected" difficulty=2}
Show that for every graph $G$, at least one of $G$ and $\ol{G}$ is connected.

::: hint
Assume $G$ is disconnected and take two vertices $u, v$. Distinguish whether they are in the same
component of $G$.
:::

::: solution
Assume $G$ is disconnected; we show $\ol{G}$ is connected. Let $u, v$ be vertices. If $u, v$ are in
different components of $G$, they are not adjacent in $G$, so $uv \in E(\ol{G})$. If they are in the same
component, pick a vertex $w$ in another component (it exists since $G$ is disconnected). Then $uw$ and
$wv$ are non-edges of $G$, so $(u, w, v)$ is a walk in $\ol{G}$. In both cases $u$ and $v$ are connected
in $\ol{G}$.
:::
::::

:::: exercise {#exr:t02-closed-odd-walk title="Odd closed walks" difficulty=2}
Show that every closed walk of odd length contains (the vertices and edges of) an odd cycle. Conclude
that a graph is bipartite iff it has no closed walk of odd length.

::: hint
Induction on the length. If a vertex repeats, split the walk into two shorter closed walks; one of
them has odd length.
:::

::: solution
Let $W = (v_0, \dots, v_k = v_0)$ be a closed walk of odd length $k$. If $k = 1$, the walk is a loop,
which is impossible in a simple graph, so in a simple graph $k \ge 3$. If the vertices
$v_0, \dots, v_{k-1}$ are distinct, then $k \ge 3$ and $W$ traces a cycle of odd length $k$. Otherwise
$v_i = v_j$ for some $0 \le i < j \le k - 1$, and $W$ splits into the closed walks
$(v_i, \dots, v_j)$ of length $j - i$ and $(v_j, \dots, v_k = v_0, \dots, v_i)$ of length $k - (j - i)$.
Both are shorter than $k$, their lengths add up to the odd number $k$, so one of them is odd and
contains an odd cycle by induction.

For the conclusion: an odd cycle is an odd closed walk; conversely an odd closed walk contains an odd
cycle. Now apply [[thm:bipartite-odd-cycle]].
:::
::::

:::: exercise {#exr:t02-distance-bipartite title="Distances in bipartite graphs" difficulty=2}
Let $G$ be a connected bipartite graph with bipartition $(A, B)$ and $x \in A$. Show that
$A = \set{v : \mathrm{dist}(x, v) \text{ is even}}$. Deduce that the bipartition of a connected
bipartite graph is unique (up to swapping $A$ and $B$).

::: solution
Along any walk the vertices alternate between $A$ and $B$. A shortest walk from $x \in A$ to $v$ of
length $d$ ends in $A$ iff $d$ is even. Hence $v \in A$ iff $\mathrm{dist}(x, v)$ is even. This
describes $A$ (and $B = V \setminus A$) purely in terms of $G$ and $x$, so any bipartition with
$x$ on the first side is this one.
:::
::::

:::: quiz {#q:t02-induced}
Is every subgraph of $G$ on the vertex set $X$ equal to $G[X]$?

- [ ] Yes
- [x] No, only if it contains all edges of $G$ among $X$

::: explanation
$G[X]$ keeps **all** edges of $G$ with both ends in $X$; a subgraph may omit some of them.
:::
::::

:::: quiz {#q:t02-cycle-bipartite}
For which $n \ge 3$ is the cycle $C_n$ bipartite?

- [x] Exactly for even $n$
- [ ] Exactly for odd $n$
- [ ] For all $n$
- [ ] For no $n$

::: explanation
$C_n$ is itself a cycle of length $n$; by [[thm:bipartite-odd-cycle]] it is bipartite iff $n$ is even.
:::
::::

:::: quiz {#q:t02-kn-bipartite}
For which $n \ge 1$ is $K_n$ bipartite?

- [x] $n \le 2$
- [ ] $n$ even
- [ ] never

::: explanation
For $n \ge 3$, $K_n$ contains a triangle $C_3$, an odd cycle. $K_1$ and $K_2$ are bipartite.
:::
::::
