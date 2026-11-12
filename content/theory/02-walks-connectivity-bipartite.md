---
title: Subgraphs, walks and bipartite graphs
course: theory
lecture: 2
slug: t02
summary: Subgraphs and induced subgraphs, cliques and independent sets, walks and paths, connected components, graph distance, and the characterisation of bipartite graphs by odd cycles.
prerequisites: [theory/01-basic-notions]
sources:
  - resources/graph-theory/2026-09-22-13_38_58-join.pdf (pp. 3–5)
status: draft
---

In this lesson we start looking *inside* graphs: at smaller graphs contained in them, and at
ways of moving through them along edges. Moving along edges leads to the notions of
connectivity and distance. As a first real structural theorem, we characterise bipartite graphs:
a graph can be split into two independent halves exactly when it has no cycle of odd length.

## Summary

- $G_1 \subseteq G$ is a subgraph; induced subgraphs $G[X]$ keep all edges among $X$
  ([[def:subgraph]]). Cliques and independent sets ([[def:clique]]).
- [[def:walk|Walks]] may repeat vertices and edges; a shortest walk is a [[def:path-graph|path]] ([[claim:shortest-walk-path]]).
- Components are the classes of "connected by a walk" ([[def:component]]); distance is the length
  of a shortest walk ([[def:distance]]) and is computed by BFS ([[alg:bfs]]).
- $G$ is [[def:bipartite|bipartite]] iff $G \subseteq K_{m,n}$ ([[prop:bipartite-subgraph-kmn]]) iff $G$ has no odd [[def:cycle-graph|cycle]]
  ([[thm:bipartite-odd-cycle]]).

## Exercises

```graph id=t02-ex-odd-cycle widget=exercise
task: select-edges
prompt: This graph is not bipartite. Select the edges of an odd cycle.
check: is-cycle
check: odd-length
hint: Run BFS from any vertex and look for an edge inside one layer.
solution: For example $a\,b\,c\,d\,e\,a$ is a cycle of length 5.
a -- b; b -- c; c -- d; d -- e; e -- a; a -- f; f -- g; g -- c; b -- h; h -- d
```

```graph id=t02-ex-bipartition widget=exercise
task: select-vertices
prompt: Select one side $A$ of a bipartition of this graph.
check: is-bipartition-side
solution: The vertices of $Q_3$ are the binary strings of length 3; one side is the strings with an even number of ones, $\set{000, 011, 101, 110}$, the other side the strings with an odd number of ones.
use: Q(3)
```

:::: exercise {#exr:t02-induced-count title="Counting subgraphs" difficulty=1}
How many [[def:subgraph|induced subgraphs]] does a graph with $n$ vertices have (counting subgraphs with different
vertex sets as different, including the empty graph)? How many subgraphs does $K_3$ have?

::: solution
An induced subgraph is determined by its vertex set, so there are $2^n$ of them. For $K_3$: choose the
vertex set $X$, then any subset of the edges of $K_3$ inside $X$. $\abs{X} = 0$: 1 subgraph; $\abs{X} = 1$:
$3 \cdot 1$; $\abs{X} = 2$: $3 \cdot 2$ (with or without the edge); $\abs{X} = 3$: $2^3 = 8$. In total
$1 + 3 + 6 + 8 = 18$.
:::
::::

:::: exercise {#exr:t02-connected-complement title="A graph or its complement is connected" difficulty=2}
Show that for every graph $G$, at least one of $G$ and $\ol{G}$ is [[def:component|connected]].

::: hint
Assume $G$ is disconnected and take two vertices $u, v$. Distinguish whether they are in the same
component of $G$.
:::

::: solution
Assume $G$ is disconnected; we show $\ol{G}$ is connected. Let $u, v$ be vertices. If $u, v$ are in
different components of $G$, they are not adjacent in $G$, so $uv \in E(\ol{G})$. If they are in the same
component, pick a vertex $w$ in another component (it exists since $G$ is disconnected). Then $uw$ and
$wv$ are non-edges of $G$, so $(u, w, v)$ is a walk, indeed a [[def:path-graph|path]], in $\ol{G}$. In both cases $u$ and $v$ are connected
in $\ol{G}$.
:::
::::

:::: exercise {#exr:t02-closed-odd-walk title="Odd closed walks" difficulty=2}
Show that every [[def:walk|closed walk]] of odd length contains (the vertices and edges of) an odd [[def:cycle-graph|cycle]]. Conclude
that a graph is [[def:bipartite|bipartite]] iff it has no closed walk of odd length.

::: hint
Induction on the length. If a vertex repeats, split the walk into two shorter closed walks; one of
them has odd length.
:::

::: solution
Let $W = (v_0, \dots, v_k = v_0)$ be a closed walk of odd length $k$. If $k = 1$, the walk is a [[def:mixed-multigraph|loop]],
which is impossible in a simple graph, so in a simple graph $k \ge 3$. If the vertices
$v_0, \dots, v_{k-1}$ are distinct, then $k \ge 3$ and $W$ traces a cycle of odd length $k$. Otherwise
$v_i = v_j$ for some $0 \le i < j \le k - 1$, and $W$ splits into the closed walks
$(v_i, \dots, v_j)$ of length $j - i$ and $(v_j, \dots, v_k = v_0, \dots, v_i)$ of length $k - (j - i)$.
Both are shorter than $k$, their lengths add up to the odd number $k$, so one of them is odd and
contains an odd cycle by induction.

For the conclusion: an odd cycle is an odd closed walk; conversely an odd closed walk contains an odd
cycle. Now apply [[thm:bipartite-odd-cycle]].
:::
::::

:::: exercise {#exr:t02-distance-bipartite title="Distances in bipartite graphs" difficulty=2}
Let $G$ be a connected bipartite graph with bipartition $(A, B)$ and $x \in A$. Show that
$A = \set{v : \mathrm{dist}(x, v) \text{ is even}}$. Deduce that the bipartition of a connected
bipartite graph is unique (up to swapping $A$ and $B$).

::: solution
Along any walk the vertices alternate between $A$ and $B$. A shortest walk from $x \in A$ to $v$ of
length $d$ ends in $A$ iff $d$ is even. Hence $v \in A$ iff $\mathrm{dist}(x, v)$ is even. This
describes $A$ (and $B = V \setminus A$) purely in terms of $G$ and $x$, so any bipartition with
$x$ on the first side is this one.
:::
::::

:::: quiz {#q:t02-induced}
Is every subgraph of $G$ on the vertex set $X$ equal to $G[X]$?

- [ ] Yes
- [x] No, only if it contains all edges of $G$ among $X$

::: explanation
$G[X]$ keeps **all** edges of $G$ with both ends in $X$; a subgraph may omit some of them.
:::
::::

:::: quiz {#q:t02-cycle-bipartite}
For which $n \ge 3$ is the cycle $C_n$ bipartite?

- [x] Exactly for even $n$
- [ ] Exactly for odd $n$
- [ ] For all $n$
- [ ] For no $n$

::: explanation
$C_n$ is itself a cycle of length $n$; by [[thm:bipartite-odd-cycle]] it is bipartite iff $n$ is even.
:::
::::

:::: quiz {#q:t02-kn-bipartite}
For which $n \ge 1$ is $K_n$ bipartite?

- [x] $n \le 2$
- [ ] $n$ even
- [ ] never

::: explanation
For $n \ge 3$, $K_n$ contains a triangle $C_3$, an odd cycle. $K_1$ and $K_2$ are bipartite.
:::
::::
