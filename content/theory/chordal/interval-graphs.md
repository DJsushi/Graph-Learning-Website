---
title: "Interval graphs"
course: theory
chapter: chordal
order: 2
lectures: [t04]
goal: Build the graph of a few intervals on a line, and see on it that every interval graph is chordal.
needs: [theory/chordal/chordal-graphs]
stage: taught
status: reviewed
---

Six tasks share one machine. Each task needs it during a time window, drawn as a bar on the
time line below. Two tasks clash when their windows overlap. Draw one vertex per task and join
two vertices when the tasks clash. Which graph do we get?

```graph id=t04-interval-bars widget=figure
caption: Six time windows on a time line. Each bar is one interval, with its name at both ends.
intent: New figure. The lecture (theory/2026-10-06 p1) draws intervals as bars on a line; these are the six intervals of t04-interval-graph, a=[0,2], b=[1,4], c=[3,5], d=[3.5,7], e=[6,8], f=[4.5,6.5], with x = 1.2 times the time.
layout: fixed
a1 [label=a] @(0, 1.4); a2 [label=a] @(2.4, 1.4); c1 [label=c] @(3.6, 1.4); c2 [label=c] @(6, 1.4)
e1 [label=e] @(7.2, 1.4); e2 [label=e] @(9.6, 1.4)
b1 [label=b] @(1.2, 0.7); b2 [label=b] @(4.8, 0.7); f1 [label=f] @(5.4, 0.7); f2 [label=f] @(7.8, 0.7)
d1 [label=d] @(4.2, 0); d2 [label=d] @(8.4, 0)
a1 -- a2 [class=bold]; b1 -- b2 [class=bold]; c1 -- c2 [class=bold]
d1 -- d2 [class=bold]; e1 -- e2 [class=bold]; f1 -- f2 [class=bold]
mark a: a1 a2 a1--a2
mark b: b1 b2 b1--b2
```

Look at the bars one by one. [[fig:t04-interval-bars#a|Bar $a$]] overlaps only
[[fig:t04-interval-bars#b|bar $b$]]. Bar $b$ overlaps $a$, $c$ and $d$, but it ends before $f$
starts. Going through all fifteen pairs, we find eight that overlap. So the graph has six
vertices and eight edges.

A graph that comes from intervals in this way is an interval graph. Since the intervals lie on
one line, such a graph has a special shape: every cycle of length at least 4 has a chord. In
other words, every interval graph is [[def:chordal|chordal]].

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
Intervals lie side by side on one line. A long ring of intervals in which only neighbours on
the ring overlap does not fit there. Some intervals that are not neighbours on the ring overlap
as well, and their edge is a chord.
:::

The lecture states this without proof. We check it on our six intervals. We look at two long
cycles and find a chord in each.

```graph id=t04-interval-chords widget=stepper
caption: Two long cycles in the interval graph of the six bars, and their chords.
intent: New figure (the lecture has no example for this entry). The graph of t04-interval-graph with fixed positions; it checks the proposition on two cycles.
layout: fixed
a @(0, 0.6); b @(1.2, 0.6); c @(2.4, 1.2); d @(2.4, 0); f @(3.6, 1.2); e @(4.8, 0.6)
a -- b; b -- c; b -- d; c -- d; c -- f; d -- f; d -- e; f -- e
step: The interval graph of the six bars.
step: The cycle b c f d has length 4.
class cycle: b c f d b--c c--f f--d d--b
step: Its chord cd: bars c and d overlap.
class highlight: c--d
step: The cycle b c f e d has length 5.
unclass highlight: c--d
unclass cycle: f--d
class cycle: e f--e e--d
step: Its chords cd and df.
class highlight: c--d d--f
```

In step 2 the cycle $b\,c\,f\,d$ has length 4. The vertices $c$ and $d$ are not neighbours on
it, and bars $c$ and $d$ overlap: both contain the time 4. So the edge $cd$ is a chord.

In step 4 the cycle $b\,c\,f\,e\,d$ has length 5, and it has two chords, $cd$ and $df$. Every
other cycle of length at least 4 in this graph has a chord too, so the graph is chordal, as
the proposition says.

The proposition also tells us what is not an interval graph. The cycle $C_4$ has no chord, so
it is not chordal. Hence no four intervals give $C_4$.

::: pitfall
The intervals are closed, so they contain their end points. Two intervals that only touch,
such as $[0, 2]$ and $[2, 3]$, share the point 2. They intersect, and their vertices are
adjacent.
:::

## Check yourself

:::: quiz {#q:t04-interval-new-bar}
Add a seventh task $g$ with the time window $[2, 3.2]$ to the six bars at the top of the page.
How many neighbours does $g$ have in the interval graph?

answer: 3

::: explanation
$g$ meets $a = [0, 2]$ in the point 2, $b = [1, 4]$ in $[2, 3.2]$, and $c = [3, 5]$ in
$[3, 3.2]$. It ends before $d$, $f$ and $e$ start. So $g$ is adjacent to $a$, $b$ and $c$.
:::
::::

:::: quiz {#q:t04-interval-which}
Which of these graphs is **not** an interval graph?

- [ ] the triangle $K_3$
- [ ] the complete graph $K_4$
- [x] the cycle $C_4$
- [ ] the path with 4 vertices

::: explanation
$C_4$ is a cycle of length 4 without a chord, so it is not chordal, and by the proposition it
is not an interval graph. The others are: four copies of $[0, 1]$ give $K_4$, three copies give
$K_3$, and $[0, 1]$, $[1, 2]$, $[2, 3]$, $[3, 4]$ give the path.
:::
::::

## More

Why a line has no room for a long ring of intervals: take a cycle of length at least 4 and
start at the interval that ends first. Both of its neighbours on the cycle meet it, and they
end no earlier, so both reach back to its right end. So they overlap each other, which gives a
chord. In the example above, $b$ ends first on the cycle $b\,c\,f\,d$, at time 4, and its
neighbours $c$ and $d$ both contain 4.
