---
title: "Cliques and independent sets"
course: theory
chapter: basics
order: 7
lectures: [t02]
goal: Recognise cliques and independent sets in a small graph, and check a given set pair by pair.
needs: [theory/basics/graphs, theory/basics/graph-families, theory/basics/isomorphism, theory/basics/subgraphs]
stage: taught
status: reviewed
---

The lecture drew the graph below. Look at the four vertices $a, b, c, d$ on the left, and then
at the four vertices $p, q, r, s$ on the right. What is special about each group?

```graph id=t02-clique-independent widget=figure
caption: The highlighted vertices form a clique $K_4$; the four vertices on the right form an independent set.
intent: Transcription of the lecture picture: a dense blob and a set of pairwise non-adjacent vertices.
layout: fixed
a @(0, 1) [class=highlight]; b @(1, 1) [class=highlight]; c @(1, 0) [class=highlight]; d @(0, 0) [class=highlight]
p @(2.4, 1) [class=color2]; q @(3.2, 1) [class=color2]; r @(2.4, 0) [class=color2]; s @(3.2, 0) [class=color2]
a -- b -- c -- d -- a [class=highlight]; a -- c [class=highlight]; b -- d [class=highlight]
c -- r; b -- p; d -- r; c -- s
```

On the left, every two vertices are joined by an edge: $a$ and $b$, $a$ and $c$, and so on,
six pairs in all. Such a group is a clique. On the right, no two vertices are joined: none of
the six pairs is an edge. Such a group is an independent set.

To check a set of vertices, we go through all pairs in it. For a clique, every pair must be
an edge. For an independent set, no pair may be an edge. Edges that leave the set do not
matter: $p$ is [[def:adjacent|adjacent]] to $b$, and the right group is still independent.

The lecture writes a clique as a [[def:subgraph|subgraph]]: the vertices of the group together
with the edges between them. On the left, this subgraph is a complete graph on four vertices.

::: definition {#def:clique title="Clique, independent set" defines="clique, independent set" source="theory/2026-09-22 p3"}
A **clique** in $G$ is a subgraph of $G$ [[def:isomorphism|isomorphic]] to a [[def:complete-graph|complete graph]] $K_m$. (Equivalently, a set
of pairwise adjacent vertices.)

An **independent set** in $G$ is a set $X \subseteq V(G)$ such that no edge of $G$ has both ends in
$X$.
:::

::: intuition {for=def:clique}
Read "adjacent" as "know each other". A clique is a group in which everybody knows everybody.
An independent set is a group in which nobody knows anybody. A single vertex is both: it has
no pair to check.
:::

Now a smaller graph, the [[def:cycle-graph|cycle]] $C_5$. We look for the largest clique and
the largest independent set, one pair at a time.

```graph id=t02-clique-c5 widget=stepper
caption: Cliques and independent sets in the cycle $C_5$.
intent: New figure (the lecture has no example for $C_5$). Grows a clique and an independent set pair by pair and shows where each one stops.
layout: fixed
1 @(1.2, 1.3); 2 @(2.4, 0.8); 3 @(1.9, 0); 4 @(0.5, 0); 5 @(0, 0.8)
1 -- 2 -- 3 -- 4 -- 5 -- 1
step: The cycle $C_5$. Every vertex has two neighbours.
step: $1$ and $2$ are adjacent, so $\set{1, 2}$ is a clique (thick).
class highlight: 1 2 1--2
step: $1$ and $3$ are not adjacent (ringed), so $\set{1, 2, 3}$ is not a clique.
class rejected: 3
step: $1$ and $3$ are not adjacent, so $\set{1, 3}$ is an independent set (filled).
unclass highlight: 1 2 1--2
unclass rejected: 3
class color2: 1 3
step: Each of $2, 4, 5$ is adjacent to $1$ or $3$ (thick edges), so none of them can join.
class bold: 1--2 2--3 3--4 5--1
class rejected: 2 4 5
```

So in $C_5$ the largest cliques are the edges, copies of $K_2$. Three vertices are never
pairwise adjacent, because $C_5$ has no triangle. The largest independent sets have two
vertices. Three vertices that are pairwise not adjacent would each need a free vertex after
them on the cycle, and that takes six vertices.

In the complete graph $K_n$ it is the other way round. Every pair of vertices is an edge, so
the whole vertex set is a clique. For the same reason, every independent set has at most one
vertex.

::: pitfall
An independent set may have edges to the rest of the graph. In the lecture's figure, $p$ is
adjacent to $b$, and $r$ is adjacent to $c$ and $d$. Only an edge with both ends in the set is
forbidden.
:::

## Check yourself

:::: quiz {#q:t02-largest-independent}
In the lecture's figure at the top of the page, $p, q, r, s$ form an independent set with 4
vertices. How many vertices does the largest independent set of this graph have?

answer: 5

::: explanation
Add $a$. Its only neighbours are $b$, $c$ and $d$, so $\set{a, p, q, r, s}$ is independent.
More is impossible: $a, b, c, d$ are pairwise adjacent, so an independent set contains at
most one of them, and there are only four other vertices.
:::
::::

:::: quiz {#q:t02-c5-independent-pairs}
How many independent sets with exactly 2 vertices does $C_5$ have?

answer: 5

::: explanation
$C_5$ has $5 \cdot 4 / 2 = 10$ pairs of vertices. Five of them are edges. The other five pairs
are not edges, and each of them is an independent set.
:::
::::

## More

A set $X$ is independent in $G$ exactly when it is a clique in the complement $\ol{G}$.
The complement $\ol{G}$ has the same vertices as $G$, and two distinct vertices are adjacent
in $\ol{G}$ exactly when they are not adjacent in $G$.
