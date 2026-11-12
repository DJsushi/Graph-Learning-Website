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

::: proposition {#prop:interval-chordal title="Interval graphs are chordal"}
Every [[ex:interval-graphs|interval graph]] is chordal.
:::

::: intuition
Intervals live on a line, and a line has no room for a long "ring" of intervals in which only neighbours overlap.
Go around such a ring, starting at the interval that ends first: both of its ring neighbours must reach back to its
right end, so they overlap each other, which gives a chord. Example: the interval graph in the figure above has
the cycle $b\,c\,f\,d$, and it has the chord $cd$. Non-example: $C_4$ is not an interval graph, since it is not chordal.
:::

The lecture states this without proof.
