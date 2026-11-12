---
title: "Arborescences"
course: algorithms
chapter: arborescences
order: 1
lectures: [a01]
stage: split
status: draft
---

How do we generalize spanning trees to directed graphs?

::: definition {#def:arborescence title="Arborescence" defines="arborescence, root" source="algorithms/01 p48"}
For a digraph $D = (V, E)$ and a **root** $r \in V$, an **arborescence** (rooted at $r$) is a subgraph $T = (V, F)$ such that

1. $T$ is a spanning tree (if we forget the edge orientations), and
2. there is a directed path in $T$ from $r$ to each other vertex.
:::

::: intuition
An arborescence is a [[def:spanning-tree|spanning tree]] whose arcs all point away from the root, like the parent pointers of a BFS tree read from parent
to child: each vertex other than $r$ has exactly one incoming arc, from its parent. It is the directed analogue of a spanning tree, and the min-cost
version below is the directed analogue of the [[def:mst|MST]]. Example: in [[fig:a01-arborescence-example]] the highlighted arcs form an arborescence
rooted at $r$. Non-example: the arcs $a \to b$ and $c \to b$ form a spanning tree of $\set{a, b, c}$ if we forget orientations, but no vertex reaches
both others, so it is an arborescence for no root.
:::

::: pitfall
Orientation and root matter. The same underlying spanning tree may be an arborescence for one root and not for another (the path
$r \to a \to b$ is one for $r$, not for $a$), and only a vertex from which every vertex is reachable in $D$ can be the root of an arborescence.
:::

Equivalently: every vertex other than $r$ has exactly one incoming arc in $T$, $r$ has none, and $T$ has no directed cycle (or: every vertex is reachable from $r$). It is
trivial to find **some** arborescence: just use BFS or DFS from $r$ ([[alg:bfs]]). Our problem is to find a cheapest one.

::: definition {#def:min-cost-arborescence title="Min-cost arborescence problem" defines="optimal arborescence" source="algorithms/01 p49"}
Given a digraph $D$, a root $r \in V(D)$ and a weight function $w : E(D) \to \R^+$, find an arborescence of minimum cost (an **optimal arborescence**).
:::

::: intuition
The task is the MST problem with directions: connect everything as cheaply as possible, but now every vertex must be **reachable from $r$** along the
chosen arcs. This changes the problem considerably: the greedy cut and cycle arguments break down, as the example below shows, so Kruskal's and
Jarník's algorithms do not apply. Example: with arcs $r \to a$ ($1$), $r \to b$ ($3$) and $a \to b$ ($1$), the optimal arborescence is $r \to a \to b$ of
cost $2$.
:::

We assume that $D$ has an arborescence rooted at $r$ (this can be checked by BFS/DFS) and that no edges enter $r$ (such edges, if any, can safely be deleted, as no
arborescence uses them).

**Unlike in undirected graphs, a min-cost arborescence may not include the lightest edge across some cut, and it may include the heaviest edge on some cycle.** In the example
below, an optimal arborescence (weight $22$; there are two optimal ones) does not use the arc $(c, a)$ of weight $1$, the lightest arc across the cut $(\set{r, c}, \text{rest})$, but it uses the arc
$(d, c)$ of weight $4$, the heaviest arc of the directed cycle $a \to d \to c \to a$.

```graph id=a01-arborescence-example widget=figure
caption: A min-cost arborescence rooted at $r$ (highlighted, weight $2+6+3+4+7 = 22$). Another optimal one is $rc, ca, ad, ab, de$ (also 22). The greedy cut and cycle properties fail for arborescences.
intent: Transcription of the lecture example; vertices named a..e (unnamed on the slides).
type: directed
layout: fixed
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=2 class=tree]; a -> b [w=6 class=tree]; r -> c [w=5]; c -> a [w=1]; a -> d [w=3 class=tree]
a -> e [w=8]; b -> e [w=9]; d -> c [w=4 class=tree]; d -> e [w=7 class=tree]
```
