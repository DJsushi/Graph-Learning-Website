---
title: "F-heavy and F-light edges"
course: algorithms
chapter: mst
order: 15
lectures: [a01]
stage: split
status: draft
---

### F-heavy and F-light edges

::: definition {#def:f-heavy title="F-heavy and F-light edges" defines="subforest, F-heavy, F-light" source="algorithms/01 p37"}
A **subforest** $F$ of a graph $G = (V, E)$ is a subgraph of $G$ which is a forest. For $e \in E$, let $w_F(e)$ be the weight of the heaviest edge on the unique
path in $F$ between the endpoints of $e$, and $w_F(e) = \infty$ if $e$ joins two different components of $F$. The edge $e$ is **$F$-heavy** if $w(e) > w_F(e)$,
and **$F$-light** otherwise.
:::

All edges of $F$ are $F$-light (for $e \in F$, the path is $e$ itself, so $w_F(e) = w(e)$).

::: intuition
$w_F(e)$ is the weight of the worst edge one must use to travel between the ends of $e$ inside $F$. An $F$-heavy edge $e$ is the heaviest edge of
the cycle it closes with $F$. Example: let $F$ be the path $a\,b\,c$ with $w(ab) = 1$, $w(bc) = 3$. Then $w_F(ac) = 3$, so an edge $ac$ of weight
$5$ is $F$-heavy, and one of weight $2$ is $F$-light. An edge from $a$ to a vertex outside the component of $F$ containing $a$ has $w_F = \infty$
and is always $F$-light.
:::

::: pitfall
"$F$-light" is not "in the MST". It only means that the forest $F$ does not rule the edge out: the edges of $F$, the edges between different
components of $F$ and many other edges are $F$-light, and most of them may still be missing from the MST.
:::

::: lemma {#lem:f-heavy-not-in-mst title="F-heavy edges are not in the MST" source="algorithms/01 p37"}
Let $F$ be an arbitrary subforest of $G$. Then the [[def:mst|MST]] of $G$ does not include any $F$-heavy edge.
:::

::: intuition
The forest $F$ need not have anything to do with the MST; any forest works, and its paths serve only as witnesses for the cycle property. A
better $F$ rules out more edges: for $F = M$, every edge outside $M$ is $M$-heavy ([[cor:mst-verification]]), while for the empty forest no
edge is heavy. Example: if $F$ is the path $a\,b\,c$ with weights $1$ and $3$, an edge $ac$ of weight $5$ is the heaviest on the triangle
$a\,b\,c$ and cannot be in the MST.
:::

::: proof
If $e$ is $F$-heavy, its ends are joined by a path in $F$ all of whose edges are lighter than $e$. Together with $e$ this path is a cycle on which $e$ is the
heaviest edge, so $e \notin M$ by the cycle property ([[thm:cycle-property]]).
:::

```graph id=a01-f-heavy widget=exercise
task: select-edges
prompt: The highlighted edges form a forest $F$. Select all $F$-heavy edges.
check: f-heavy-edges forest="class:tree"
solution: $bd$ ($9 > 8$), $ce$ ($7 > 5$) and $bc$ ($11 > 8$) are $F$-heavy: each is heavier than every edge on the $F$-path between its ends. $eg$ and $gh$ join different components of $F$, so $w_F = \infty$ and they are $F$-light.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4 class=tree]; a -- c [w=8 class=tree]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1 class=tree]
d -- e [w=2 class=tree]; e -- f [w=5 class=tree]; e -- g [w=12]; f -- h [w=3 class=tree]; g -- h [w=10]
```
