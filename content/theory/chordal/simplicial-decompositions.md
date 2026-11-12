---
title: "Simplicial decompositions"
course: theory
chapter: chordal
order: 6
lectures: [t04]
stage: split
status: draft
---

<!-- REVIEW: aka said "perfect elimination ordering", but the text below says the PEO is this ordering read backwards. aka changed to match. -->

::: definition {#def:simplicial-decomposition title="Simplicial decomposition" aka="reverse of a perfect elimination ordering" defines="simplicial decomposition" source="theory/2026-10-06 p4"}
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

The direction ($\Rightarrow$) is an induction on the number of vertices: peel off a simplicial vertex, decompose the rest, and put the vertex back at the end.

:::: walkthrough {for=thm:chordal-decomposition}
```graph id=t04-decomposition-forward widget=stepper
caption: Vertex 6 is simplicial, $G - 6$ has the decomposition (2, 3, 4, 1, 5), and appending 6 gives one for $G$.
intent: New. Same graph and positions as the stepper figure below; the lecture (theory/2026-10-06 p4) only says "easy by recursion".
layout: fixed
1 @(0, 0); 2 @(1, 0); 3 @(0.5, 0.9); 4 @(1.5, 0.9); 5 @(2, 0); 6 @(2.5, 0.9)
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 2 -- 5; 4 -- 5; 4 -- 6; 5 -- 6
mark vn: 6
mark rest: 1 2 3 4 5 1--2 1--3 2--3 2--4 3--4 2--5 4--5
mark N: 4 5 4--5 4--6 5--6
step: A chordal graph has a simplicial vertex; call it $v_n$.
class current: 6
step: $G - v_n$ is chordal.
unclass current: 6
class muted: 6 4--6 5--6
step: Induction decomposes $G - v_n$.
class color1: 2 3 4 1 5
step: Appending $v_n$ keeps the earlier conditions.
unclass muted: 6 4--6 5--6
step: The condition for $v_n$ holds.
class current: 6
class highlight: 4--5
class bold: 4--6 5--6
```

::: step
We use induction on the number of vertices $n$. One vertex is trivially ordered, so take $n \ge 2$. The hypothesis says $G$ is chordal, so [[thm:chordal-simplicial]] gives a simplicial vertex. We call it [[fig:t04-decomposition-forward#vn|$v_n$]]. Here: vertex $6$, whose neighbours $4$ and $5$ are adjacent.
:::

::: step
We remove $v_n$. The graph [[fig:t04-decomposition-forward#rest|$G - v_n$]] is an induced subgraph of the chordal graph $G$, so it is chordal ([[obs:chordal-induced]]). Here: it is vertices $1$ to $5$, and it has $5$ vertices against $6$.
:::

::: step
The graph $G - v_n$ has fewer vertices, so the induction hypothesis applies. It gives a simplicial decomposition of $G - v_n$, the ordering $(v_1, \dots, v_{n-1})$. Here: $(2, 3, 4, 1, 5)$. For example, $5$ has the earlier neighbours $2$ and $4$, and they are adjacent.
:::

::: step
We append $v_n$ at the end. The condition for $v_i$ with $i < n$ looks only at $v_1, \dots, v_{i-1}$. Vertex $v_n$ is not among them, so these neighbours are the same in $G$ as in $G - v_n$. All conditions for $v_1, \dots, v_{n-1}$ still hold.
:::

::: step
One condition is left: the one for $v_n$. All $n - 1$ other vertices come before it, so its earlier neighbours are all its neighbours. They form a clique because $v_n$ is simplicial. Here: [[fig:t04-decomposition-forward#N|the neighbours]] $4$ and $5$ of $6$ are adjacent. So $G$ has a simplicial decomposition.
:::
::::

The direction ($\Leftarrow$) shows that every long cycle has a chord: the last vertex of the cycle in the ordering sees its two cycle neighbours earlier, and they must be adjacent.

:::: walkthrough {for=thm:chordal-decomposition}
```graph id=t04-decomposition-cycle widget=stepper
caption: In the decomposition (2, 3, 4, 1, 5, 6), the last vertex of the cycle 1, 3, 4, 5, 2 is $5$; its cycle neighbours $4$ and $2$ are adjacent.
intent: New. Same graph and positions as the stepper figure below; the lecture (theory/2026-10-06 p4) draws the vertices on a line with arcs, not this graph.
layout: fixed
1 @(0, 0); 2 @(1, 0); 3 @(0.5, 0.9); 4 @(1.5, 0.9); 5 @(2, 0); 6 @(2.5, 0.9)
1 -- 2; 1 -- 3; 2 -- 3; 2 -- 4; 3 -- 4; 2 -- 5; 4 -- 5; 4 -- 6; 5 -- 6
mark C: 1 3 4 5 2 1--3 3--4 4--5 2--5 1--2
mark a: 5
mark nbrs: 4 2 4--5 2--5
mark chord: 2--4
step: A cycle of length at least $4$.
class cycle: 1 3 4 5 2 1--3 3--4 4--5 2--5 1--2
step: Take the vertex of the cycle that comes last.
class current: 5
step: Its two cycle neighbours come earlier.
class bold: 4 2 4--5 2--5
step: Those two neighbours are adjacent.
class highlight: 2--4
step: The edge is a chord of $C$; as $C$ was arbitrary, $G$ is chordal.
class bold: 2--4
```

::: step
Let $(v_1, \dots, v_n)$ be a simplicial decomposition of $G$ and $C$ a cycle of length at least $4$. To show that $G$ is [[def:chordal|chordal]], we must find a chord of $C$. Here: the decomposition is $(2, 3, 4, 1, 5, 6)$ and [[fig:t04-decomposition-cycle#C|$C$]] is the cycle $1, 3, 4, 5, 2$.
:::

::: step
The cycle has finitely many vertices, and the ordering puts them in a line, so one of them comes last. We call it $a = v_i$. Here: $1, 3, 4, 5, 2$ stand at positions $4, 2, 3, 5, 1$. So [[fig:t04-decomposition-cycle#a|$a$]] is vertex $5$, the fifth in the ordering.
:::

::: step
The cycle gives $a$ two neighbours on $C$, both different from $a$. Since $a$ comes last on $C$, both stand before $a$ in the ordering. So they are neighbours of $v_i$ among $v_1, \dots, v_{i-1}$. Here: [[fig:t04-decomposition-cycle#nbrs|the two neighbours]] are $4$ and $2$, at positions $3$ and $1$.
:::

::: step
The hypothesis is used here. By the definition of a simplicial decomposition, the earlier neighbours of $v_i$ induce a clique. Any two vertices of a clique are adjacent. So the two cycle neighbours of $a$ are adjacent in $G$. Here: $4$ and $2$ are adjacent, and they are the only earlier neighbours of $5$.
:::

::: step
Suppose the two neighbours were consecutive on $C$. Together with $a$ they would form a cycle of length $3$, which is all of $C$. This contradicts the length of $C$. So the edge between them is not an edge of $C$: it is [[fig:t04-decomposition-cycle#chord|a chord]]. Every cycle of length at least $4$ has a chord, so $G$ is chordal.
:::
::::

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
