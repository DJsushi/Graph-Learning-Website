---
title: Basic notions
course: theory
lecture: 1
slug: t01
summary: Graphs and mixed multigraphs, the basic graph classes, isomorphism, degrees, the handshake lemma, and which sequences are degree sequences (Havel–Hakimi, Erdős–Gallai).
prerequisites: []
sources:
  - resources/graph-theory/2026-09-15-09_45_32-join.pdf
  - resources/graph-theory/2026-09-22-13_38_58-join.pdf (pp. 1–2, proof of Havel–Hakimi)
status: draft
---

Graphs are the mathematical model of anything made of *objects* and *connections between
pairs of objects*: road networks, friendships, molecules, dependencies between tasks,
computer networks. This first lesson fixes the language used in the rest of both courses. We
define what a graph is, meet the small families of graphs that come up everywhere, decide when
two graphs are "the same", and study the simplest numerical information a graph carries: the
degrees of its vertices.

## Summary

- A graph is $G = (V, E)$ with $E \subseteq \binom{V}{2}$ ([[def:graph]]); mixed multigraphs
  $(V, E, \varepsilon)$ add loops, parallel edges and arcs ([[def:mixed-multigraph]]).
- Standard families: $P_n$ (length $n$, so $n+1$ vertices), $C_n$, $K_n$, $K_{m,n}$
  ([[def:path-graph]], [[def:cycle-graph]], [[def:complete-graph]], [[def:complete-bipartite]]).
- Isomorphism is a bijection preserving adjacency *and* non-adjacency ([[def:isomorphism]]); a
  "graph" usually means an isomorphism class. Equal vertex counts, edge counts and degree
  sequences are necessary for isomorphism, but not sufficient.
- The [[def:degree|degree]] sum is $\sum_v d(v) = 2\abs{E}$ ([[lem:handshake]]).
- Havel–Hakimi: $(d_1, \dots, d_n)$ is graphic iff the sequence obtained by deleting $d_1$ and
  decreasing the next $d_1$ entries is graphic ([[thm:havel-hakimi]]). The proof uses 2-switches.
- Erdős–Gallai: graphic iff the sum is even and
  $\sum_{i \le k} d_i \le k(k-1) + \sum_{i > k}\min(d_i, k)$ for all $k$ ([[thm:erdos-gallai]]).

## Exercises

```graph id=t01-ex-build-sequence widget=exercise
task: build
prompt: Add edges so that the graph has degree sequence $(3, 3, 2, 2, 2)$.
check: degree-sequence seq="3,3,2,2,2"
check: is-simple
hint: The sum is $12$, so you need exactly $6$ edges.
hint: Run Havel–Hakimi: $(3,3,2,2,2) \to (2,1,1,2) \sim (2,2,1,1) \to (1,0,1) \sim (1,1,0) \to (0,0)$. Now add the vertices back.
solution: One realisation: the cycle $1\,3\,4\,2\,5\,1$ plus the edge $12$. Then $1$ and $2$ have degree $3$, the others degree $2$.
use: E(5)
```

```graph id=t01-ex-odd-vertices widget=exercise
task: select-vertices
prompt: Select all vertices of odd degree.
check: odd-degree-vertices
solution: The odd-degree vertices are $a$, $c$, $d$ and $f$ (degrees $3, 1, 3, 1$). There are four of them, an even number.
a -- b; a -- d; a -- e; b -- d; c -- d; e -- f
```

:::: exercise {#exr:t01-equal-degrees title="Two vertices of the same degree" difficulty=2}
Prove that every simple graph with at least two vertices has two vertices of the same
[[def:degree|degree]].

::: hint
What values can the degrees take? Can the values $0$ and $n-1$ both occur?
:::

::: solution
Let $n \ge 2$ be the number of vertices. Every degree lies in $\set{0, 1, \dots, n-1}$, a set of $n$
values. The values $0$ and $n - 1$ cannot both occur: a vertex of degree $n-1$ is adjacent to every
other vertex, so no vertex is isolated. Hence the $n$ degrees take at most $n - 1$ different values,
and by the pigeonhole principle two vertices have the same degree.
:::
::::

:::: exercise {#exr:t01-graphic-check title="Graphic or not?" difficulty=1}
Decide which of the following sequences are [[def:graphic-sequence|graphic]]. For the graphic
ones, draw a realisation.

1. $(3, 3, 3, 3, 3, 3)$
2. $(5, 5, 4, 3, 2, 1)$
3. $(3, 3, 3, 1)$

::: solution
1. Graphic: $(3,3,3,3,3,3) \to (2,2,2,3,3) \sim (3,3,2,2,2) \to (2,1,1,2) \sim (2,2,1,1) \to (1,0,1) \sim (1,1,0) \to (0,0)$. A realisation is $K_{3,3}$ (or the triangular prism).
2. Not graphic: $(5,5,4,3,2,1) \to (4,3,2,1,0) \to (2,1,0,-1)$. Alternatively, Erdős–Gallai fails for
   $k = 2$: $5 + 5 = 10 > 2 + \min(4,2) + \min(3,2) + \min(2,2) + \min(1,2) = 9$.
3. Not graphic: $(3,3,3,1) \to (2,2,0) \to (1,-1)$. Directly: the three vertices of degree 3 are each
   adjacent to all other vertices, so the last vertex would have degree 3.
:::
::::

:::: exercise {#exr:t01-c5-self-complementary title="A self-complementary graph" difficulty=2}
The **complement** $\ol{G}$ of a simple graph $G$ has the same vertices, and two distinct vertices
are adjacent in $\ol{G}$ exactly when they are not adjacent in $G$. Show that $C_5 \cong \ol{C_5}$.

::: hint
In $\ol{C_5}$, the vertex $i$ is adjacent to $i + 2$ and $i - 2$ (modulo 5).
:::

::: solution
The non-edges of $C_5$ on $\set{1, \dots, 5}$ are $13, 35, 52, 24, 41$, so $\ol{C_5}$ is the [[def:cycle-graph|cycle]]
$1\,3\,5\,2\,4\,1$. The bijection $f(1) = 1$, $f(2) = 3$, $f(3) = 5$, $f(4) = 2$, $f(5) = 4$ maps the
edges $12, 23, 34, 45, 51$ of $C_5$ to $13, 35, 52, 24, 41$, the edges of $\ol{C_5}$. Both graphs have
5 edges, and $f$ maps edges onto edges bijectively, so it also maps non-edges onto non-edges. Hence
$f$ is an [[def:isomorphism|isomorphism]].
:::
::::

```graph id=t01-ex-complement widget=figure
caption: $C_5$ and its complement, drawn with the vertex positions of $C_5$: the complement is a pentagram, which is again a 5-cycle.
intent: Visual support for the exercise above.
height: small
layout-sync: true
panel: $C_5$
use: C(5)
panel: $\overline{C_5}$
use: complement(C(5))
```

:::: exercise {#exr:t01-havel-hakimi-ties title="Ties in Havel–Hakimi" difficulty=3}
In [[thm:havel-hakimi]], the vertex of the **largest** degree is removed. Show by an example that the
following variant is false: "$(d_1, \dots, d_n)$ is graphic iff the sequence obtained by removing
the **smallest** positive entry $d_j$ and subtracting $1$ from the $d_j$ **smallest** other positive
entries is graphic."

::: solution
Take the graphic sequence $(2, 2, 1, 1)$ (realised by $P_3$). The smallest positive entry is $1$;
removing one $1$ and subtracting $1$ from the smallest other positive entry, which is the other
$1$, gives $(2, 2, 0)$. This is not graphic: two vertices of degree 2 among three vertices would
both be adjacent to the third vertex, which has degree 0. So the variant fails. (Removing the
smallest entry is fine if you subtract from the **largest** entries; that is another valid version
of the theorem.)
:::
::::

:::: quiz {#q:t01-degree-sum}
A graph has 7 edges. What is the sum of its vertex degrees?

- [ ] 7
- [x] 14
- [ ] 21
- [ ] It depends on the graph.

::: explanation
By [[lem:handshake]], the degree sum is $2m = 14$ for every graph with 7 edges.
:::
::::

:::: quiz {#q:t01-path-vertices}
How many vertices does $P_4$ have?

answer: 5

::: explanation
$P_n$ is the path of **length** $n$, that is, with $n$ edges and $n + 1$ vertices
([[def:path-graph]]).
:::
::::

:::: quiz {#q:t01-kmn-edges}
How many edges does $K_{3,4}$ have?

answer: 12

::: explanation
Each of the 3 vertices on one side is adjacent to each of the 4 vertices on the other side:
$3 \cdot 4 = 12$.
:::
::::

:::: quiz {#q:t01-iso-degree}
Two graphs have the same [[def:degree-sequence|degree sequence]]. Are they necessarily
isomorphic?

- [ ] Yes
- [x] No

::: explanation
$C_6$ and two disjoint triangles both have degree sequence $(2,2,2,2,2,2)$ but are not isomorphic.
:::
::::
