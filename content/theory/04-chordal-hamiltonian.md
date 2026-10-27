---
title: Chordal and Hamiltonian graphs
course: theory
lecture: 4
slug: t04
summary: Chordal graphs, simplicial vertices, minimal separators, simplicial decompositions; Hamiltonian cycles, Dirac's and Ore's theorems via Hamiltonian completions.
prerequisites: [theory/03-trees]
sources:
  - resources/graph-theory/2026-10-06-13_41_19-join.pdf
status: draft
---

This lesson studies two classes of graphs defined by their cycles. **Chordal graphs** are graphs in
which every long cycle has a "shortcut". They have a beautiful recursive structure: they can be
taken apart one simplicial vertex at a time, which makes many hard problems easy on them.
**Hamiltonian graphs** contain a cycle through all vertices. Deciding Hamiltonicity is NP-hard in
general, so we look for simple sufficient conditions, and prove the classical theorems of Dirac and
Ore.

## Chordal graphs

::: definition {#def:chordal title="Chord, chordal graph" defines="chord, chordal graph" source="theory/2026-10-06 p1"}
A **chord** of a cycle $C \subseteq G$ is an edge of $G$ between two vertices of $C$ that are not consecutive on
$C$. A graph $G$ is **chordal** if every cycle $C \subseteq G$ of length at least $4$ has a chord.
<!-- REVIEW: lecture writes "every cycle C ⊆ G has a chord"; "of length at least 4" added, since a triangle can never have a chord. -->
:::

(A triangle has no pair of non-consecutive vertices, so the condition is only about cycles of length at least $4$.)
Equivalently: $G$ is chordal iff it has no **induced** cycle of length at least $4$.

```graph id=t04-chord widget=figure
caption: The cycle $C_6$ has the chord $14$. The graph on the right is not chordal: the 4-cycle $1\,2\,3\,4$ has no chord.
intent: Show a chord, and the smallest non-chordal graph C_4.
height: small
panel: a chord
use: C(6)
1 -- 4 [class=highlight]
panel: $C_4$, not chordal
use: C(4)
```

Every complete graph and every forest is chordal (forests have no cycles at all). Removing vertices keeps a
graph chordal:

::: observation {#obs:chordal-induced title="Induced subgraphs of chordal graphs" extra=true}
Every induced subgraph of a chordal graph is chordal.
:::

::: proof
Let $G$ be chordal, $X \subseteq V(G)$, and $C$ a cycle of length at least $4$ in $G[X]$. Then $C$ is a cycle in $G$, so it
has a chord $xy \in E(G)$. Both $x, y$ lie on $C$, hence in $X$, so $xy$ is an edge of the induced subgraph $G[X]$.
:::

### Interval graphs

::: example {#ex:interval-graphs title="Interval graphs" source="theory/2026-10-06 p1"}
Take finitely many closed intervals on the real line, and make a graph whose vertices are the intervals,
two of them adjacent iff they intersect. Graphs arising this way are called **interval graphs**. They model,
e.g., scheduling: vertices are tasks with time windows, edges are conflicts.
:::

```graph id=t04-interval-graph widget=figure
caption: Six intervals and their interval graph: two intervals are adjacent iff they overlap.
intent: Give a concrete interval graph. Intervals: a=[0,2], b=[1,4], c=[3,5], d=[3.5,7], e=[6,8], f=[4.5,6.5].
a -- b; b -- c; b -- d; c -- d; c -- f; d -- f; d -- e; f -- e
```

::: proposition {#prop:interval-chordal title="Interval graphs are chordal" extra=true}
Every interval graph is chordal.
:::

::: proof
Suppose an interval graph has a chordless cycle $C = (c_1, c_2, \dots, c_k)$ with $k \ge 4$, where $c_i$ is the
interval $[a_i, b_i]$. Choose the interval of $C$ whose right endpoint is smallest; renumber so that it is
$c_1$. Its neighbours on the cycle, $c_2$ and $c_k$, intersect $c_1$, so $a_2 \le b_1$ and $a_k \le b_1$; and by the
choice of $c_1$, $b_2 \ge b_1$ and $b_k \ge b_1$. Hence both $c_2$ and $c_k$ contain the point $b_1$, so they intersect and
$c_2c_k$ is an edge. Since $k \ge 4$, $c_2$ and $c_k$ are not consecutive on $C$, so this edge is a chord, a
contradiction.
:::

### Simplicial vertices

::: definition {#def:simplicial title="Simplicial vertex" defines="simplicial vertex" source="theory/2026-10-06 p1"}
A vertex $x \in V(G)$ is **simplicial** if the neighbours of $x$ in $G$ form a clique.
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

The proof needs two lemmas. The first one is about how chordal graphs can be cut apart.

::: definition {#def:minimal-cut title="Minimal vertex cut between two vertices" defines="vertex cut, separator, minimal cut" source="theory/2026-10-06 p2"}
Let $u \ne v$ be vertices of $G$. A set $X \subseteq V(G) \setminus \set{u, v}$ is a **cut between $u$ and $v$** if $u$ and
$v$ lie in different components of $G - X$. It is a **minimal cut** if no proper subset of $X$ is a cut
between $u$ and $v$.
:::

If $u, v$ are non-adjacent, then $V(G) \setminus \set{u, v}$ is a cut between them, so a minimal cut exists (take an
inclusion-minimal subset that is still a cut).

::: lemma {#lem:minimal-cut-clique title="Minimal cuts in chordal graphs are cliques" source="theory/2026-10-06 p2"}
Let $G$ be a graph, $u \ne v \in V(G)$, and $X \subseteq V(G)$ a minimal cut between $u$ and $v$. If $G$ is chordal, then
$X$ is a clique.
:::

:::: proof
Let $C_u$ and $C_v$ be the components of $G - X$ containing $u$ and $v$.

First, **every $x \in X$ has a neighbour in $C_u$ and a neighbour in $C_v$.** Indeed, by minimality $X \setminus \set{x}$
is not a cut, so there is a $u$–$v$ path $P$ in $G - (X \setminus \set{x})$. As $X$ is a cut, $P$ passes through $x$. Follow
$P$ from $u$ to its first vertex in $X$, which must be $x$; the part before $x$ lies in $G - X$ and starts at $u$,
hence in $C_u$, so the predecessor of $x$ on $P$ is a neighbour of $x$ in $C_u$. Symmetrically (follow $P$ from $v$)
$x$ has a neighbour in $C_v$.

Now suppose, for a contradiction, that $x \ne y \in X$ with $xy \notin E(G)$. Since $C_u$ is connected and both $x$ and
$y$ have neighbours in $C_u$, there are $x$–$y$ paths whose inner vertices all lie in $C_u$. Let $Q_u$ be a
**shortest** such path, and similarly $Q_v$ a shortest $x$–$y$ path with all inner vertices in $C_v$. Then
$C := Q_u \cup Q_v$ is a cycle (the two paths share only $x$ and $y$, since $C_u \cap C_v = \emptyset$).

- $C$ has length at least $4$: $xy \notin E(G)$, so each of $Q_u, Q_v$ has at least one inner vertex, i.e. at least
  $2$ edges.
- $C$ has no chord. A chord between an inner vertex of $Q_u$ and an inner vertex of $Q_v$ is impossible, as
  $C_u$ and $C_v$ are different components of $G - X$. The pair $x, y$ is not an edge. A chord joining two
  vertices of $Q_u$ would give a shorter $x$–$y$ path with inner vertices in $C_u$, contradicting the choice of
  $Q_u$; similarly for $Q_v$.

So $C$ is a chordless cycle of length at least $4$ in the chordal graph $G$, a contradiction. Hence $xy \in E(G)$
for all $x, y \in X$.
::::

```graph id=t04-minimal-cut widget=figure
caption: If two vertices $x, y$ of a minimal cut $X$ were non-adjacent, shortest $x$–$y$ paths through $C_u$ and through $C_v$ would form a chordless cycle of length at least 4.
intent: Transcription of the lecture sketch.
layout: fixed
u @(-2, 0); p1 @(-1, 0.8); p2 @(-1, -0.8); x @(0, 1) ; y @(0, -1); q1 @(1, 0.8); q2 @(1, -0.8); v @(2, 0)
u -- p1; u -- p2
v -- q1; v -- q2
x -- p1 [class=cycle]; p1 -- p2 [class=cycle]; p2 -- y [class=cycle]; x -- q1 [class=cycle]; q1 -- v [class=cycle]; v -- q2 [class=cycle]; q2 -- y [class=cycle]
x -- y [class="rejected dashed"]
group X: x y [label="$X$"]
group Cu: u p1 p2 [label="$C_u$"]
group Cv: v q1 q2 [label="$C_v$"]
```

::: lemma {#lem:two-simplicial title="Two non-adjacent simplicial vertices" source="theory/2026-10-06 p3"}
If $G$ is chordal, then $G$ is complete or $G$ contains two non-adjacent simplicial vertices.
:::

:::: proof
By induction on $n = \abs{V(G)}$. If $G$ is complete there is nothing to prove (this covers $n \le 1$). Assume $G$ is
not complete, and let $u \ne v \in V(G)$ with $uv \notin E(G)$. As $u, v$ are non-adjacent, there is a minimal cut
$X$ between $u$ and $v$, and by [[lem:minimal-cut-clique]] $X$ is a clique. Let $A$ be the
component of $G - X$ containing $u$. Note that **no edge joins $A$ to $V(G) \setminus (A \cup X)$**, because $A$ is a component of $G - X$.
<!-- REVIEW: existence of the minimal cut comes from non-adjacency (remark after the definition), not from the lemma. -->

Both $G[A \cup X]$ and $G - A$ are induced subgraphs of $G$, so they are chordal ([[obs:chordal-induced]]), and they
have fewer vertices than $G$ ($v \notin A \cup X$ and $u \in A$). So the lemma holds for them by induction.

*A simplicial vertex $x \in A$.* If $G[A \cup X]$ is complete, take $x = u$. Otherwise $G[A \cup X]$ has two non-adjacent
simplicial vertices; they cannot both lie in the clique $X$, so one of them, $x$, lies in $A$. In either case
$x \in A$ is simplicial in $G[A \cup X]$. All neighbours of $x$ in $G$ lie in $A \cup X$, so $x$ is simplicial in $G$.

*A simplicial vertex $y \notin A \cup X$.* If $G - A$ is complete, take $y = v$. Otherwise $G - A$ has two non-adjacent
simplicial vertices, and one of them, $y$, is not in the clique $X$. In either case $y \in V(G) \setminus (A \cup X)$ is
simplicial in $G - A$. Since $y$ has no neighbours in $A$, its neighbours in $G$ and in $G - A$ are the same, so
$y$ is simplicial in $G$.

Finally $xy \notin E(G)$, since $x \in A$ and $y \notin A \cup X$. This proves the claim.
::::

::: proof {title="Proof of the theorem" for=thm:chordal-simplicial}
By [[lem:two-simplicial]], a chordal graph is complete (and then every vertex is simplicial) or it has two
simplicial vertices.
:::

### Simplicial decompositions

::: definition {#def:simplicial-decomposition title="Simplicial decomposition" aka="perfect elimination ordering" defines="simplicial decomposition" source="theory/2026-10-06 p4"}
A **simplicial decomposition** of $G$ is an ordering $V(G) = (v_1, v_2, \dots, v_n)$ such that for every
$1 < i \le n$, the neighbours of $v_i$ in $\set{v_1, \dots, v_{i-1}}$ induce a clique.
:::

In other words, $v_n$ is simplicial in $G$, $v_{n-1}$ is simplicial in $G - v_n$, and so on. (Read backwards, this
ordering is known as a **perfect elimination ordering**.)

::: theorem {#thm:chordal-decomposition title="Chordal graphs and simplicial decompositions" source="theory/2026-10-06 p4"}
A graph $G$ is chordal if and only if $G$ has a simplicial decomposition.
:::

::: proof
**($\Rightarrow$)** By induction on $n$, using [[thm:chordal-simplicial]]: choose a simplicial vertex of $G$ as $v_n$.
The graph $G - v_n$ is chordal ([[obs:chordal-induced]]), so by induction it has a simplicial decomposition
$(v_1, \dots, v_{n-1})$. Appending $v_n$ gives a simplicial decomposition of $G$: the neighbours of $v_n$ among
$v_1, \dots, v_{n-1}$ are all its neighbours, which form a clique.

**($\Leftarrow$)** Let $(v_1, \dots, v_n)$ be a simplicial decomposition and $C \subseteq G$ a cycle of length at least $4$.
Let $a = v_i$ be the vertex of $C$ that comes **last** (rightmost) in the ordering. Its two neighbours on $C$
come earlier, so they are among the neighbours of $v_i$ in $\set{v_1, \dots, v_{i-1}}$, which form a clique. Hence
the two neighbours of $a$ on $C$ are adjacent. They are not consecutive on $C$ (as $C$ has length at least $4$), so
this edge is a chord of $C$.
:::

```graph id=t04-simplicial-decomposition widget=stepper
caption: Building a simplicial decomposition backwards: repeatedly remove a simplicial vertex.
intent: Algorithmic view of the theorem; each removed vertex is simplicial in the remaining graph.
layout: fixed
1 @(0, 0); 2 @(1, 0); 3 @(0.5, 0.9); 4 @(1.5, 0.9); 5 @(2, 0); 6 @(2.5, 0.9)
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 2 -- 5; 4 -- 5; 4 -- 6; 5 -- 6
step: A chordal graph. Vertex $6$ is simplicial (its neighbours $4, 5$ are adjacent): it becomes $v_6$.
class current: 6
step: In $G - 6$, vertex $5$ is simplicial (neighbours $2, 4$ are adjacent): $v_5 = 5$.
remove 6
class current: 5
step: In the rest, vertex $1$ is simplicial (neighbours $2, 3$): $v_4 = 1$.
remove 5
class current: 1
step: The triangle $\set{2, 3, 4}$ remains, a clique: any order works. Decomposition $(2, 3, 4, 1, 5, 6)$.
remove 1
```

::: remark
Simplicial decompositions can be found in linear time (e.g. by lexicographic breadth-first search), which gives
a linear-time recognition algorithm for chordal graphs. Along a simplicial decomposition, problems such as
maximum clique or optimal colouring, NP-hard in general, become easy for chordal graphs.
:::

## Hamiltonian graphs

::: definition {#def:hamiltonian title="Hamiltonian cycle, path and graph" defines="Hamiltonian cycle, Hamiltonian path, Hamiltonian graph" source="theory/2026-10-06 p5"}
A cycle $C \subseteq G$ is **Hamiltonian** if $V(C) = V(G)$. A path $P \subseteq G$ is **Hamiltonian** if
$V(P) = V(G)$. A graph $G$ is **Hamiltonian** if $G$ contains a Hamiltonian cycle.
:::

Unlike Euler tours (which traverse every *edge* once and have a simple characterisation), deciding whether a
graph is Hamiltonian is NP-complete. So we look for **sufficient** conditions. Intuitively, a graph with many
edges should be Hamiltonian. We write $\delta(G)$ for the **minimum degree** of $G$.

::: theorem {#thm:dirac-ore title="Dirac's and Ore's theorem" source="theory/2026-10-06 p5"}
Let $G$ be a graph with $n = \abs{V(G)} \ge 3$ vertices, and assume

a) **(Dirac)** $\delta(G) \ge \frac{1}{2}\abs{V(G)}$, or

b) **(Ore)** for all $u \ne v \in V(G)$: $uv \notin E(G) \implies d_G(u) + d_G(v) \ge \abs{V(G)}$.

Then $G$ is Hamiltonian.
:::

The assumption $n \ge 3$ is needed: $K_2$ satisfies both conditions but has no cycle at all. Dirac's condition
implies Ore's (if every degree is at least $n/2$, every two degrees sum to at least $n$), so it suffices to prove
b). The bound is **tight**:

::: example {#ex:dirac-tight title="The bound $n/2$ is tight" source="theory/2026-10-06 p5"}
$K_{k, k+1}$ has $n = 2k + 1$ vertices and minimum degree $k = \frac{n-1}{2}$, just below $\frac{n}{2}$. It is not
Hamiltonian: a cycle in a bipartite graph alternates between the two sides, so it has as many vertices on each
side, while a Hamiltonian cycle would have to contain all $k$ vertices of one side and all $k + 1$ of the other.
:::

```graph id=t04-dirac-tight widget=figure
caption: $K_{3,4}$: minimum degree $3 = \frac{n-1}{2}$, and no Hamiltonian cycle.
intent: Tightness example from the lecture.
height: small
use: K(3,4)
```

The proof works by adding edges that do not change Hamiltonicity.

::: definition {#def:hamiltonian-completion title="Hamiltonian completion" defines="Hamiltonian completion, closure" source="theory/2026-10-06 p6"}
If $u \ne v \in V(G)$, $uv \notin E(G)$, and $d_G(u) + d_G(v) \ge \abs{V(G)}$, then the graph $G + uv$ is called a
**(one-step) Hamiltonian completion** of $G$. In general, $H$ is a **Hamiltonian completion** of $G$ if $H$ is
obtained from $G$ by any sequence of one-step Hamiltonian completions.
:::

Note that each step uses the degrees in the *current* graph, which only grow as edges are added.

::: lemma {#lem:hamiltonian-completion title="Completions preserve Hamiltonicity" source="theory/2026-10-06 p6, p5"}
If $H$ is a Hamiltonian completion of $G$, then $H$ is Hamiltonian $\iff$ $G$ is Hamiltonian.
:::

:::: proof
($\Leftarrow$) is trivial: a Hamiltonian cycle of $G$ is also one of $H \supseteq G$ (same vertex set).

($\Rightarrow$) By induction on the number of completion steps; zero steps is trivial. Let $H := H_1 + xy$ be the
last step, where $H_1$ is a Hamiltonian completion of $G$ (with fewer steps), $xy \notin E(H_1)$, and
$d_{H_1}(x) + d_{H_1}(y) \ge n$. If $H_1$ is Hamiltonian, then so is $G$ by induction. So it remains to show:
**if $H$ is Hamiltonian, then so is $H_1$.**

Let $C \subseteq H$ be a Hamiltonian cycle. If $xy \notin E(C)$, then $C \subseteq H_1$ and we are done. Otherwise
$C - xy$ is a Hamiltonian path in $H_1$ from $x$ to $y$; write it as
$$x = w_1, w_2, \dots, w_n = y.$$

- Colour **black** every neighbour of $y$ (in $H_1$). These are among $w_2, \dots, w_{n-1}$ (as $xy \notin E(H_1)$), so
  there are $d_{H_1}(y)$ black vertices, all in $\set{w_1, \dots, w_{n-1}}$.
- Colour **red** every vertex $w_{i-1}$ whose successor $w_i$ (on the path, towards $y$) is a neighbour of $x$; i.e. the
  predecessors (towards $x$) of the neighbours of $x$. The neighbours of $x$ are among $w_2, \dots, w_{n-1}$, so the
  red vertices are among $w_1, \dots, w_{n-2}$, and there are $d_{H_1}(x)$ of them.

So the vertex $y = w_n$ has no colour, and the $d_{H_1}(x) + d_{H_1}(y) \ge n$ colourings fall into the $n - 1$
vertices $w_1, \dots, w_{n-1}$. By the pigeonhole principle **some vertex is black and red**, say $w_j$. That means
$w_j y \in E(H_1)$ and $x w_{j+1} \in E(H_1)$. Now
$$(x = w_1, w_2, \dots, w_j, \; y = w_n, w_{n-1}, \dots, w_{j+1}, \; x)$$
is a Hamiltonian cycle in $H_1$: it walks along the path from $x$ to $w_j$, jumps to $y$, walks back along the path to
$w_{j+1}$, and jumps back to $x$.
::::

```graph id=t04-hamiltonian-switch widget=stepper
caption: The key step: a Hamiltonian path from $x$ to $y$ and a vertex $w_j$ adjacent to $y$ whose successor $w_{j+1}$ is adjacent to $x$ give a Hamiltonian cycle.
intent: Visualise the black/red colouring argument and the resulting cycle.
layout: fixed
x [label="$x = w_1$"] @(0, 0); w2 [label="$w_2$"] @(1, 0); w3 [label="$w_3$"] @(2, 0); wj [label="$w_j$"] @(3, 0); wj1 [label="$w_{j+1}$"] @(4, 0); w6 [label="$w_6$"] @(5, 0); y [label="$y = w_7$"] @(6, 0)
x -- w2 -- w3 -- wj -- wj1 -- w6 -- y [class=path]
x -- w3 [bend=0.5]; x -- wj1 [bend=0.6]; wj -- y [bend=-0.6]; w2 -- y [bend=-0.7]
step: A Hamiltonian path from $x$ to $y$ in $H_1$; $xy$ is not an edge.
step: Black: the neighbours of $y$, i.e. $w_2$, $w_j$ and $w_6$.
class color1: w2 wj w6
step: Red: the predecessors of the neighbours $w_2, w_3, w_{j+1}$ of $x$, i.e. $x$, $w_2$ and $w_j$.
class color2: x w2 wj
step: $w_j$ is both black and red (and so is $w_2$): $w_j y \in E$ and $x w_{j+1} \in E$.
class current: wj
class highlight: wj--y x--wj1
step: The Hamiltonian cycle $x, w_2, w_3, w_j, y, w_6, w_{j+1}, x$.
unclass path: wj--wj1
class cycle: x--w2 w2--w3 w3--wj wj--y y--w6 w6--wj1 wj1--x
```

::: proof {title="Proof of the theorem" for=thm:dirac-ore}
As noted, a) implies b), so assume b). We show that $K_n$ is a Hamiltonian completion of $G$. Starting from
$H = G$, as long as $H \ne K_n$, pick any non-adjacent pair $u, v$ of $H$. They are non-adjacent in $G$ as well, so
$d_H(u) + d_H(v) \ge d_G(u) + d_G(v) \ge n$ by b), and $H + uv$ is a one-step Hamiltonian completion of $H$. After
finitely many steps we reach $K_n$, which is Hamiltonian for $n \ge 3$. By [[lem:hamiltonian-completion]], $G$ is
Hamiltonian.
:::

::: remark
The graph obtained by adding edges as long as possible (it does not depend on the order) is the
**Bondy–Chvátal closure** of $G$. The lemma shows: $G$ is Hamiltonian iff its closure is. Dirac's and Ore's conditions
are special cases in which the closure is complete; the closure can be complete also when neither condition holds.
<!-- REVIEW: "Dirac and Ore are the cases where the closure is complete" overstated it (complete closure is strictly more general). -->

:::

## Summary

- $G$ is chordal if every cycle of length $\ge 4$ has a chord ([[def:chordal]]); interval graphs are chordal
  ([[prop:interval-chordal]]).
- In a chordal graph, minimal vertex cuts are cliques ([[lem:minimal-cut-clique]]); hence a chordal graph is complete
  or has two non-adjacent simplicial vertices ([[lem:two-simplicial]]).
- $G$ is chordal iff it has a simplicial decomposition ([[thm:chordal-decomposition]]).
- Dirac: $\delta \ge n/2$, Ore: $d(u) + d(v) \ge n$ for non-adjacent $u, v$; each implies Hamiltonian for $n \ge 3$
  ([[thm:dirac-ore]]), proved via Hamiltonian completions ([[lem:hamiltonian-completion]]). $K_{k,k+1}$ shows
  tightness.

## Exercises

```graph id=t04-ex-simplicial widget=exercise
task: select-vertices
prompt: Select all simplicial vertices of this chordal graph.
check: simplicial-vertices
solution: The simplicial vertices are $1$, $5$ and $6$. Vertex $1$ has neighbours $\set{2,3}$, vertex $5$ has $\set{3,4}$, vertex $6$ has $\set{4}$; each set is a clique. Vertices $2, 3, 4$ are not simplicial.
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 3 -- 5; 4 -- 5; 4 -- 6
```

```graph id=t04-ex-hamiltonian-cube widget=exercise
task: select-edges
prompt: Find a Hamiltonian cycle in the cube $Q_3$.
check: is-hamiltonian-cycle
hint: Go around the "top" square, but leave out one edge and use the "bottom" square instead.
solution: For example $000, 001, 011, 010, 110, 111, 101, 100, 000$ (a Gray code).
use: Q(3)
```

:::: exercise {#exr:t04-kmn-hamiltonian title="Hamiltonian complete bipartite graphs" difficulty=1}
For which $m, n \ge 1$ is $K_{m,n}$ Hamiltonian?

::: solution
Exactly when $m = n \ge 2$. A cycle alternates between the sides, so a Hamiltonian cycle requires $m = n$, and a cycle
has at least $3$ vertices, hence at least $4$ in a bipartite graph, so $m = n \ge 2$. Conversely, for $m = n \ge 2$ the cycle
$1, 1', 2, 2', \dots, n, n', 1$ is Hamiltonian.
:::
::::

:::: exercise {#exr:t04-ore-path title="Hamiltonian paths" difficulty=2}
Let $G$ be a graph on $n \ge 2$ vertices such that $d_G(u) + d_G(v) \ge n - 1$ for all non-adjacent $u \ne v$. Show that $G$ has a
Hamiltonian path.
<!-- REVIEW: d(u) → d_G(u) (course notation). -->

::: hint
Add a new vertex adjacent to all vertices of $G$, and apply Ore's theorem.
:::

::: solution
Let $G'$ be $G$ plus a new vertex $z$ adjacent to all of $V(G)$; it has $n + 1 \ge 3$ vertices. A non-adjacent pair of
$G'$ is a non-adjacent pair $u, v$ of $G$ (as $z$ is adjacent to everything), and $d_{G'}(u) + d_{G'}(v) = d_G(u) + d_G(v) + 2
\ge n + 1$. By Ore's theorem $G'$ has a Hamiltonian cycle; deleting $z$ from it leaves a Hamiltonian path of $G$.
:::
::::

:::: exercise {#exr:t04-chordal-tree-like title="Cut vertices and chordality" difficulty=2}
Let $G_1, G_2$ be chordal graphs that share exactly one vertex (and no edges). Show that $G_1 \cup G_2$ is chordal. More
generally: gluing two chordal graphs along a common clique gives a chordal graph.

::: solution
Let $G = G_1 \cup G_2$ and $K = V(G_1) \cap V(G_2)$, a clique. There are no edges between $V(G_1) \setminus K$ and
$V(G_2) \setminus K$. Let $C$ be a cycle of length $\ge 4$ in $G$. If $C \subseteq G_1$ or $C \subseteq G_2$, it has a chord because
$G_1, G_2$ are chordal. Otherwise $C$ contains a vertex $a \in V(G_1) \setminus K$ and a vertex $b \in V(G_2) \setminus K$
(if $C \not\subseteq G_2$, then $C$ has a vertex outside $V(G_2)$, or an edge of $G_1$ not in $G_2$, which has an endpoint
outside $K$ because $K$ is a clique in $G_2$; symmetrically for $b$). The vertices $a$ and $b$ split $C$ into two $a$–$b$ arcs. Walking along either arc from $a$ to $b$ we must leave
$V(G_1) \setminus K$, and the only way to do so is to step into $K$; so each arc contains an inner vertex in $K$. Pick
$k_1 \in K$ on the first arc and $k_2 \in K$ on the second; $k_1 \ne k_2$. Going around $C$ we meet $a, k_1, b, k_2$ in this
order, so each of the two $k_1$–$k_2$ arcs of $C$ has an inner vertex ($b$, respectively $a$). Hence $k_1, k_2$ are not
consecutive on $C$, and the edge $k_1k_2$ (present, as $K$ is a clique) is a chord. (If $\abs{K} = 1$, this shows that
no cycle can leave $G_1$ or $G_2$ at all.)
<!-- REVIEW: filled the gap why a and b exist (C ⊄ G_1 could a priori be due to an edge only). -->
:::
::::

:::: quiz {#q:t04-tree-chordal}
Is every tree chordal?

- [x] Yes
- [ ] No

::: explanation
A tree has no cycles at all, so the condition holds vacuously.
:::
::::

:::: quiz {#q:t04-cycle-chordal}
For which $n \ge 3$ is $C_n$ chordal?

- [x] Only $n = 3$
- [ ] All $n$
- [ ] Even $n$

::: explanation
$C_n$ itself is a cycle without chords; for $n \ge 4$ this violates the definition.
:::
::::

:::: quiz {#q:t04-dirac}
A graph on 10 vertices has minimum degree 5. Must it be Hamiltonian?

- [x] Yes
- [ ] No
- [ ] Only if it is connected

::: explanation
$\delta = 5 \ge 10/2$, so Dirac's theorem applies ([[thm:dirac-ore]]). (Connectivity follows automatically.)
:::
::::

:::: quiz {#q:t04-petersen-ore}
The Petersen graph has 10 vertices and is 3-regular. Does Ore's theorem show that it is Hamiltonian?

- [ ] Yes
- [x] No

::: explanation
Non-adjacent vertices have degree sum $6 < 10$, so the condition fails. (In fact the Petersen graph is not Hamiltonian;
the theorems give only sufficient conditions.)
:::
::::
