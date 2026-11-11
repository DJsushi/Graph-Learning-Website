---
title: "Simplicial decompositions"
course: theory
chapter: chordal
order: 6
lectures: [t04]
stage: split
status: draft
---

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
