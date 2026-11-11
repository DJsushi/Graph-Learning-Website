---
title: "Interval graphs"
course: theory
chapter: chordal
order: 2
lectures: [t04]
stage: split
status: draft
---

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
