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
A **chord** of a [[def:cycle-graph|cycle]] $C \subseteq G$ is an edge of $G$ between two vertices of $C$ that are not consecutive on
$C$. A graph $G$ is **chordal** if every cycle $C \subseteq G$ of [[def:path-graph|length]] at least $4$ has a chord.
<!-- REVIEW: lecture writes "every cycle C ⊆ G has a chord"; "of length at least 4" added, since a triangle can never have a chord. -->
:::

::: intuition
A chord is a shortcut across a cycle: it splits the cycle into two shorter ones. In a chordal graph you can keep
cutting until only triangles are left, so every long cycle is "triangulated". Example: $K_4$ contains $4$-cycles,
but each of them has both diagonals as chords, so $K_4$ is chordal. Non-example: $C_4$, a $4$-cycle with no
diagonal.
:::

(A triangle has no pair of non-consecutive vertices, so the condition is only about cycles of length at least $4$.)
Equivalently: $G$ is chordal iff it has no **induced** cycle of length at least $4$.

::: pitfall
Chordal does not mean "contains no $4$-cycle": $K_4$ is full of $4$-cycles and is chordal. What is forbidden is a
long cycle **without** a chord, i.e. an induced $C_k$ with $k \ge 4$. Also, one chord is enough: in $C_6$ with the single
chord $14$ the $6$-cycle has a chord, but the two $4$-cycles $1\,2\,3\,4$ and $1\,4\,5\,6$ have none, so that graph is not chordal.
:::

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

Every [[def:complete-graph|complete graph]] and every [[def:forest-tree|forest]] is chordal (forests have no cycles at all). Removing vertices keeps a
graph chordal:

::: observation {#obs:chordal-induced title="Induced subgraphs of chordal graphs" extra=true}
Every [[def:subgraph|induced subgraph]] of a chordal graph is chordal.
:::

::: intuition
Deleting vertices cannot create a cycle, and an induced subgraph keeps every edge among the remaining
vertices, so every chord of a surviving cycle survives too. This is what makes induction on chordal graphs
work: delete a vertex, and the rest is still chordal. Non-example: for **non-induced** subgraphs it fails;
deleting the diagonal of $K_4 - e$ (a $4$-cycle plus one chord) leaves $C_4$.
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
Every [[ex:interval-graphs|interval graph]] is chordal.
:::

::: intuition
Intervals live on a line, and a line has no room for a long "ring" of intervals in which only neighbours overlap.
Go around such a ring, starting at the interval that ends first: both of its ring neighbours must reach back to its
right end, so they overlap each other, which gives a chord. Example: the interval graph in the figure above has
the cycle $b\,c\,f\,d$, and it has the chord $cd$. Non-example: $C_4$ is not an interval graph, since it is not chordal.
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
A vertex $x \in V(G)$ is **simplicial** if the neighbours of $x$ in $G$ form a [[def:clique|clique]].
:::

::: intuition
A simplicial vertex sits in a single "corner" of the graph: all of its neighbours already know each other, so $x$
lies on no chordless cycle, and deleting it never destroys a shortcut that another cycle needs. Examples: every
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

The proof needs two lemmas. The first one is about how chordal graphs can be cut apart.

::: definition {#def:minimal-cut title="Minimal vertex cut between two vertices" defines="vertex cut, separator, minimal cut" source="theory/2026-10-06 p2"}
Let $u \ne v$ be vertices of $G$. A set $X \subseteq V(G) \setminus \set{u, v}$ is a **cut between $u$ and $v$** if $u$ and
$v$ lie in different [[def:component|components]] of $G - X$. It is a **minimal cut** if no proper subset of $X$ is a cut
between $u$ and $v$.
:::

::: intuition
A cut between $u$ and $v$ is a set of "checkpoints": every way from $u$ to $v$ passes through one of them. It is
minimal if every checkpoint is needed, so putting any single one back reopens a way. Example: in $C_4 = (u, a, v, b)$
the set $\set{a, b}$ is a minimal cut between $u$ and $v$, while $\set{a}$ is not a cut at all. Adjacent $u, v$ have no cut,
since deleting other vertices never removes the edge $uv$.
:::

If $u, v$ are non-adjacent, then $V(G) \setminus \set{u, v}$ is a cut between them, so a minimal cut exists (take an
inclusion-minimal subset that is still a cut).

::: pitfall
**Minimal** (no proper subset is a cut) is not **minimum** (smallest possible size). In the graph below,
$\set{y}$ is a minimum cut between $u$ and $v$, but $\set{x_1, x_2}$ is also a minimal cut: removing only $x_1$ or only $x_2$
leaves a $u$–$v$ path. The lemmas below are about **all** minimal cuts, not only the smallest ones.
:::

```graph id=t04-minimal-not-minimum widget=figure
caption: Both $\set{x_1, x_2}$ and $\set{y}$ are minimal cuts between $u$ and $v$; only $\set{y}$ is a minimum one.
intent: Minimal versus minimum vertex cuts.
height: small
layout: fixed
u @(0, 0); x1 [label="$x_1$" class=highlight] @(1, 0.6); x2 [label="$x_2$" class=highlight] @(1, -0.6); y [class=current] @(2, 0); v @(3, 0)
u -- x1; u -- x2; x1 -- y; x2 -- y; y -- v
```

::: lemma {#lem:minimal-cut-clique title="Minimal cuts in chordal graphs are cliques" source="theory/2026-10-06 p2"}
Let $G$ be a graph, $u \ne v \in V(G)$, and $X \subseteq V(G)$ a minimal cut between $u$ and $v$. If $G$ is chordal, then
$X$ is a clique.
:::

::: intuition
Each vertex of a minimal cut is reachable from both sides. If two of them, $x$ and $y$, were non-adjacent, you could go
from $x$ to $y$ through the $u$-side and come back through the $v$-side, and the shortest such round trip would be a
long cycle with no shortcut. Chordality forbids this, so the cut vertices must be pairwise adjacent. Example: $C_6 = (1, \dots, 6)$ with the
chords $13, 14, 15$ is chordal, and the only minimal cut between $2$ and $4$ is $\set{1, 3}$, an edge. Non-example: in $C_4 = (u, a, v, b)$ the minimal cut
$\set{a, b}$ is not a clique.
:::

:::: proof
Let $C_u$ and $C_v$ be the components of $G - X$ containing $u$ and $v$.

First, **every $x \in X$ has a neighbour in $C_u$ and a neighbour in $C_v$.** Indeed, by minimality $X \setminus \set{x}$
is not a cut, so there is a $u$–$v$ [[def:path-graph|path]] $P$ in $G - (X \setminus \set{x})$. As $X$ is a cut, $P$ passes through $x$. Follow
$P$ from $u$ to its first vertex in $X$, which must be $x$; the part before $x$ lies in $G - X$ and starts at $u$,
hence in $C_u$, so the predecessor of $x$ on $P$ is a neighbour of $x$ in $C_u$. Symmetrically (follow $P$ from $v$)
$x$ has a neighbour in $C_v$.

Now suppose, for a contradiction, that $x \ne y \in X$ with $xy \notin E(G)$. Since $C_u$ is [[def:component|connected]] and both $x$ and
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

::: intuition
Asking for **two non-adjacent** simplicial vertices is a stronger statement than [[thm:chordal-simplicial]], and that is what makes the
induction work. A clique cut $X$ splits $G$ into two sides; each side, together with $X$, is smaller and chordal, so it has a
simplicial vertex away from $X$. Because $X$ is a clique, at most one of the two vertices promised for a side can lie in $X$,
so the other lies off $X$, and it stays simplicial in $G$. Example: a path $P_n$ ($n \ge 2$) has its two ends.
Non-example: $K_n$ is the exception, as any two vertices are adjacent.
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

::: intuition
Think of building $G$ by adding $v_1, v_2, \dots$ one at a time, each new vertex attached to a clique of the vertices already
present. Equivalently, take $G$ apart from the end, removing a vertex that is simplicial in what is left. Example: for the path
$1 - 2 - 3$, the ordering $(1, 2, 3)$ works, as each new vertex has one earlier neighbour. Non-example: $C_4$ has none,
because whichever vertex comes last has two non-adjacent earlier neighbours.
:::

In other words, $v_n$ is simplicial in $G$, $v_{n-1}$ is simplicial in $G - v_n$, and so on. (Read backwards, this
ordering is known as a **perfect elimination ordering**.)

::: pitfall
The condition looks only at **earlier** neighbours, and it is $v_n$ (the last vertex) that is simplicial in $G$, not $v_1$.
In the decomposition $(2, 3, 4, 1, 5, 6)$ of the stepper below, $v_1 = 2$ has the non-adjacent neighbours $1$ and $4$
in $G$. Reversing a simplicial decomposition does not give a simplicial decomposition in general.
:::

::: theorem {#thm:chordal-decomposition title="Chordal graphs and simplicial decompositions" source="theory/2026-10-06 p4"}
A graph $G$ is chordal if and only if $G$ has a [[def:simplicial-decomposition|simplicial decomposition]].
:::

::: intuition
Chordal graphs are exactly the graphs that can be dismantled one simplicial vertex at a time. One direction repeats
[[thm:chordal-simplicial]]; for the other, the last vertex of any long cycle sees two earlier cycle neighbours, which
must be adjacent, giving a chord. This is why chordal graphs are algorithmically easy: many problems can be solved by
processing the vertices along the ordering. Example: every tree has one (remove leaves). Non-example: $C_n$, $n \ge 4$.
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
Simplicial decompositions can be found in linear time (e.g. by lexicographic [[alg:bfs|breadth-first search]]), which gives
a linear-time recognition algorithm for chordal graphs. Along a simplicial decomposition, problems such as
maximum clique or optimal colouring, NP-hard in general, become easy for chordal graphs.
:::

## Hamiltonian graphs

::: definition {#def:hamiltonian title="Hamiltonian cycle, path and graph" defines="Hamiltonian cycle, Hamiltonian path, Hamiltonian graph" source="theory/2026-10-06 p5"}
A [[def:cycle-graph|cycle]] $C \subseteq G$ is **Hamiltonian** if $V(C) = V(G)$. A [[def:path-graph|path]] $P \subseteq G$ is **Hamiltonian** if
$V(P) = V(G)$. A graph $G$ is **Hamiltonian** if $G$ contains a Hamiltonian cycle.
:::

::: intuition
A Hamiltonian cycle is a round trip that visits every vertex exactly once, the shape of a travelling salesman's
tour. Examples: $C_n$ and $K_n$ ($n \ge 3$) are Hamiltonian; the cube $Q_3$ is too (see the exercises). Non-examples: a [[def:forest-tree|tree]]
on at least $2$ vertices has no cycle at all, though a path $P_n$ has a Hamiltonian path; $K_{1,3}$ has neither. Deleting one
edge from a Hamiltonian cycle gives a Hamiltonian path, which is a [[def:spanning-tree|spanning tree]]; so with non-negative weights an optimal
tour costs at least a [[def:mst|minimum spanning tree]].
:::

::: pitfall
Do not confuse Hamiltonian cycles with Euler tours: a Hamiltonian cycle visits every **vertex** once and may skip
edges; an Euler tour uses every **edge** once and may revisit vertices. $K_4$ is Hamiltonian but has no Euler tour
(all degrees are odd), and two triangles sharing a vertex have an Euler tour but no Hamiltonian cycle.
:::

Unlike Euler tours (which traverse every *edge* once and have a simple characterisation), deciding whether a
graph is Hamiltonian is NP-complete. So we look for **sufficient** conditions. Intuitively, a graph with many
edges should be Hamiltonian.

::: definition {#def:minimum-degree title="Minimum degree" defines="minimum degree, δ(G)" source="theory/2026-10-06 p5"}
The **minimum degree** of a graph $G$ with at least one vertex is $\delta(G) := \min_{v \in V(G)} d_G(v)$.
<!-- REVIEW: was prose ("We write δ(G) for the minimum degree of G"); made a definition so that search finds it. -->
:::

::: intuition
$\delta(G) \ge k$ says that **every** vertex has at least $k$ [[def:adjacent|neighbours]], a uniform lower bound on the
[[def:degree|degrees]]. Examples: $\delta(C_n) = 2$, $\delta(K_n) = n - 1$, $\delta(K_{m,n}) = \min(m, n)$. A graph with an
isolated vertex has $\delta = 0$, however many edges the rest has.
:::

::: theorem {#thm:dirac-ore title="Dirac's and Ore's theorem" source="theory/2026-10-06 p5"}
Let $G$ be a graph with $n = \abs{V(G)} \ge 3$ vertices, and assume

a) **(Dirac)** $\delta(G) \ge \frac{1}{2}\abs{V(G)}$, or

b) **(Ore)** for all $u \ne v \in V(G)$: $uv \notin E(G) \implies d_G(u) + d_G(v) \ge \abs{V(G)}$.

Then $G$ is Hamiltonian.
:::

::: intuition
If every vertex has many neighbours, there is no bottleneck that a round trip could get stuck at. The proof keeps adding
edges between non-adjacent pairs whose degrees sum to at least $n$; such an edge can always be "rerouted" around
([[lem:hamiltonian-completion]]), until the graph is $K_n$. Example: $K_{k,k}$ ($k \ge 2$) has $\delta = k = n/2$, so it is
Hamiltonian by Dirac. Ore is more flexible: add to $K_4$ a vertex $w$ adjacent to two of its vertices. Then $n = 5$ and $d_G(w) = 2 < 5/2$, so
Dirac fails, but each non-adjacent pair is $w$ and a vertex of degree $3$, with degree sum $5 \ge n$.
:::

::: pitfall
Both conditions are **sufficient, not necessary**. The cycle $C_n$ ($n \ge 5$) is Hamiltonian although $\delta(C_n) = 2 < n/2$
and non-adjacent degree sums are $4 < n$. So failing Dirac's or Ore's condition says nothing (see also the Petersen quiz below).
Ore's condition is required only for **non-adjacent** pairs.
:::

The assumption $n \ge 3$ is needed: $K_2$ satisfies both conditions but has no cycle at all. Dirac's condition
implies Ore's (if every [[def:degree|degree]] is at least $n/2$, every two degrees sum to at least $n$), so it suffices to prove
b). The bound is **tight**:

::: example {#ex:dirac-tight title="The bound $n/2$ is tight" source="theory/2026-10-06 p5"}
$K_{k, k+1}$ has $n = 2k + 1$ vertices and minimum degree $k = \frac{n-1}{2}$, just below $\frac{n}{2}$. It is not
Hamiltonian: a cycle in a [[def:bipartite|bipartite]] graph alternates between the two sides, so it has as many vertices on each
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
obtained from $G$ by any sequence of one-step Hamiltonian completions. A Hamiltonian completion to which no further
one-step completion applies is called the **closure** of $G$.
<!-- REVIEW: closure sentence added (it is in `defines`; not in the lecture). It is well defined by the argument in the remark at the end of this section. -->
:::

::: intuition
A completion step adds only edges that are "safe": an edge whose endpoints have degree sum at least $n$
can be rerouted out of any Hamiltonian cycle ([[lem:hamiltonian-completion]]). Example: in the path $P_3 = (a, b, c, d)$ with
$n = 4$, the pair $a, d$ has degree sum $2 < 4$, so $ad$ may **not** be added, and rightly so: $P_3$ is not Hamiltonian, while $P_3 + ad = C_4$ is.
:::

Note that each step uses the degrees in the *current* graph, which only grow as edges are added.

::: pitfall
The threshold is $n = \abs{V(G)}$, the number of vertices, not $n - 1$ or the number of edges, and the degrees are those of
the current graph. A pair that fails the test now may pass later, after other steps have raised its degrees; so to
compute the closure, keep re-checking all non-adjacent pairs until none qualifies.
:::

::: lemma {#lem:hamiltonian-completion title="Completions preserve Hamiltonicity" source="theory/2026-10-06 p6, p5"}
If $H$ is a [[def:hamiltonian-completion|Hamiltonian completion]] of $G$, then $H$ is Hamiltonian $\iff$ $G$ is Hamiltonian.
:::

::: intuition
Adding edges can only help, so one direction is free. For the other, suppose the new edge $xy$ is used by a Hamiltonian cycle.
Removing it leaves a Hamiltonian path from $x$ to $y$, and since the degrees of $x$ and $y$ sum to at least $n$ on a path of
$n$ vertices, by pigeonhole some neighbour of $y$ is followed on the path by a neighbour of $x$; that lets us close the path into a cycle
without $xy$ (the figure below). Example: $C_4 = (a, b, c, d)$ plus the [[def:chordal|chord]] $ac$ is a completion of $C_4$ (as $d_{C_4}(a) + d_{C_4}(c) = 4$),
and both are Hamiltonian.
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
is a Hamiltonian cycle in $H_1$: it follows the path from $x$ to $w_j$, jumps to $y$, goes back along the path to
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

*Why the order does not matter* (not in the lecture). Let $H$ and $H'$ be obtained from $G$ by two sequences of one-step
completions that cannot be continued, and let $e_1, \dots, e_s$ be the edges added on the way to $H'$, in order. We show
$e_i \in E(H)$ by induction on $i$. If $e_1, \dots, e_{i-1} \in E(H)$, then the graph $G + e_1 + \dots + e_{i-1}$, in which
$e_i = uv$ was added, is a [[def:subgraph|subgraph]] of $H$ on the same vertices, so $d_H(u) + d_H(v) \ge n$. If $uv \notin E(H)$, then $H + uv$
would be a further one-step completion of $H$, which is impossible. Hence $E(H') \subseteq E(H)$, and by symmetry $H = H'$.
<!-- REVIEW: added the standard order-independence argument for the closure (W t04). -->

:::

## Summary

- $G$ is chordal if every [[def:cycle-graph|cycle]] of [[def:path-graph|length]] $\ge 4$ has a chord ([[def:chordal]]); interval graphs are chordal
  ([[prop:interval-chordal]]).
- In a chordal graph, [[def:minimal-cut|minimal vertex cuts]] are [[def:clique|cliques]] ([[lem:minimal-cut-clique]]); hence a chordal graph is complete
  or has two non-adjacent simplicial vertices ([[lem:two-simplicial]]).
- $G$ is chordal iff it has a [[def:simplicial-decomposition|simplicial decomposition]] ([[thm:chordal-decomposition]]).
- Dirac: $\delta \ge n/2$ ([[def:minimum-degree]]), Ore: $d(u) + d(v) \ge n$ for non-adjacent $u, v$; each implies Hamiltonian for $n \ge 3$
  ([[thm:dirac-ore]]), proved via [[def:hamiltonian-completion|Hamiltonian completions]] ([[lem:hamiltonian-completion]]). $K_{k,k+1}$ shows
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
Exactly when $m = n \ge 2$. A [[def:cycle-graph|cycle]] alternates between the sides, so a [[def:hamiltonian|Hamiltonian cycle]] requires $m = n$, and a cycle
has at least $3$ vertices, hence at least $4$ in a [[def:bipartite|bipartite]] graph, so $m = n \ge 2$. Conversely, for $m = n \ge 2$ the cycle
$1, 1', 2, 2', \dots, n, n', 1$ is Hamiltonian.
:::
::::

:::: exercise {#exr:t04-ore-path title="Hamiltonian paths" difficulty=2}
Let $G$ be a graph on $n \ge 2$ vertices such that $d_G(u) + d_G(v) \ge n - 1$ for all non-adjacent $u \ne v$. Show that $G$ has a
[[def:hamiltonian|Hamiltonian path]].
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
Let $G_1, G_2$ be [[def:chordal|chordal graphs]] that share exactly one vertex (and no edges). Show that $G_1 \cup G_2$ is chordal. More
generally: gluing two chordal graphs along a common [[def:clique|clique]] gives a chordal graph.

::: solution
Let $G = G_1 \cup G_2$ and $K = V(G_1) \cap V(G_2)$, a clique. There are no edges between $V(G_1) \setminus K$ and
$V(G_2) \setminus K$. Let $C$ be a cycle of [[def:path-graph|length]] $\ge 4$ in $G$. If $C \subseteq G_1$ or $C \subseteq G_2$, it has a [[def:chordal|chord]] because
$G_1, G_2$ are chordal. Otherwise $C$ contains a vertex $a \in V(G_1) \setminus K$ and a vertex $b \in V(G_2) \setminus K$
(if $C \not\subseteq G_2$, then $C$ has a vertex outside $V(G_2)$, or an edge of $G_1$ not in $G_2$, which has an endpoint
outside $K$ because $K$ is a clique in $G_2$; symmetrically for $b$). The vertices $a$ and $b$ split $C$ into two $a$–$b$ paths. Walking along either path from $a$ to $b$ we must leave
$V(G_1) \setminus K$, and the only way to do so is to step into $K$; so each path contains an inner vertex in $K$. Pick
$k_1 \in K$ on the first path and $k_2 \in K$ on the second; $k_1 \ne k_2$. Going around $C$ we meet $a, k_1, b, k_2$ in this
order, so each of the two $k_1$–$k_2$ paths of $C$ has an inner vertex ($b$, respectively $a$). Hence $k_1, k_2$ are not
consecutive on $C$, and the edge $k_1k_2$ (present, as $K$ is a clique) is a chord. (If $\abs{K} = 1$, this shows that
no cycle can leave $G_1$ or $G_2$ at all.)
<!-- REVIEW: filled the gap why a and b exist (C ⊄ G_1 could a priori be due to an edge only). -->
:::
::::

:::: quiz {#q:t04-tree-chordal}
Is every [[def:forest-tree|tree]] chordal?

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
A graph on 10 vertices has [[def:minimum-degree|minimum degree]] 5. Must it be Hamiltonian?

- [x] Yes
- [ ] No
- [ ] Only if it is [[def:component|connected]]

::: explanation
$\delta = 5 \ge 10/2$, so Dirac's theorem applies ([[thm:dirac-ore]]). (Connectivity follows automatically.)
:::
::::

:::: quiz {#q:t04-petersen-ore}
The Petersen graph has 10 vertices and is 3-regular. Does Ore's theorem show that it is Hamiltonian?

- [ ] Yes
- [x] No

::: explanation
Non-adjacent vertices have [[def:degree|degree]] sum $6 < 10$, so the condition fails. (In fact the Petersen graph is not Hamiltonian;
the theorems give only sufficient conditions.)
:::
::::
