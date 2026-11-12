---
title: "Paths, cycles and complete graphs"
course: theory
chapter: basics
order: 3
lectures: [t01]
stage: split
status: reviewed
---

A few graphs appear so often that they have standard names. Mind the conventions for the index
$n$: they follow the lectures, and they are a common source of off-by-one mistakes.

::: definition {#def:path-graph title="Path $P_n$" defines="path, P_n, length" source="theory/2026-09-15 p2"}
The **path of length $n$**, denoted $P_n$, is the graph with
$$V(P_n) = \set{0, 1, \dots, n}, \qquad E(P_n) = \set{\set{i-1, i} : 1 \le i \le n}.$$
So $P_n$ has $n + 1$ vertices and $n$ edges. The **length** of a path is the number of its edges.
:::

::: intuition
$P_n$ is a chain of $n$ edges, $0 - 1 - 2 - \dots - n$. Indexing by the number of edges makes
"path of length $n$" and "$P_n$" say the same thing. Examples: $P_0$ is a single vertex, $P_1$ is a
single edge ($P_1 = K_2$), and $P_2$ has three vertices, the middle one with two neighbours.
:::

```graph id=t01-path-examples widget=figure
caption: Left, the path $P_3$ on the vertices $0, 1, 2, 3$ (4 vertices, 3 edges, path edges highlighted). Right, a star with the same counts, 4 vertices and 3 edges, that is not a path, because the middle vertex has three neighbours.
intent: New figure. Example and non-example for the path $P_n$; the vertex names $0..n$ follow the lecture drawing on p2. The star shows that "n edges on n+1 vertices" alone does not make a path.
layout: fixed
panel: $P_3$
0 @(0, 0); 1 @(1, 0); 2 @(2, 0); 3 @(3, 0)
0 -- 1 -- 2 -- 3 [class=highlight]
panel: not a path
c @(1, 0.5) [class=color2]; a @(0, 1); b @(0, 0); d @(2, 0.5)
c -- a; c -- b; c -- d
```

::: definition {#def:cycle-graph title="Cycle $C_n$" defines="cycle, C_n" source="theory/2026-09-15 p2"}
For $n \ge 3$, the **cycle of length $n$**, denoted $C_n$, is the graph with
$$V(C_n) = \set{1, 2, \dots, n}, \qquad E(C_n) = \set{\set{i, i+1} : 1 \le i < n} \cup \set{\set{n, 1}}.$$
So $C_n$ has $n$ vertices and $n$ edges.
:::

::: intuition
$C_n$ is $n$ vertices around a circle, each joined to its two neighbours on the circle: take the
path $P_{n-1}$ on $n$ vertices and join its two ends. The bound $n \ge 3$ comes from simplicity:
a "$C_2$" would need two [[def:mixed-multigraph|parallel edges]] and a "$C_1$" a loop.
Example: $C_3 = K_3$ is the triangle, and $C_4$ is the square.
:::

```graph id=t01-cycle-examples widget=figure
caption: Left, the cycle $C_5$ (5 vertices, 5 edges, every vertex has two neighbours). Right, two disjoint triangles: 6 vertices and 6 edges, as many edges as vertices, but not $C_6$, because the graph falls into two pieces.
intent: New figure. Example and non-example for the cycle $C_n$; the vertex names $1..n$ follow the lecture drawing on p2. The non-example has the right counts but the wrong structure.
layout: fixed
panel: $C_5$
1 @(0, 1); 2 @(1.52, 0.31); 3 @(0.94, -0.81); 4 @(-0.94, -0.81); 5 @(-1.52, 0.31)
1 -- 2 -- 3 -- 4 -- 5 -- 1 [class=highlight]
panel: not a cycle
1 @(0, 0); 2 @(1, 0); 3 @(0.5, 0.9) ; 4 @(2, 0); 5 @(3, 0); 6 @(2.5, 0.9)
1 -- 2 -- 3 -- 1; 4 -- 5 -- 6 -- 4
```

::: definition {#def:complete-graph title="Complete graph $K_n$" defines="complete graph, K_n" source="theory/2026-09-15 p2"}
The **complete graph on $n$ vertices**, denoted $K_n$, has $\abs{V(K_n)} = n$ and
$E(K_n) = \binom{V(K_n)}{2}$: every two distinct vertices are adjacent.
:::

::: intuition
$K_n$ has every edge a simple graph on $n$ vertices can have, so every simple graph on $n$
vertices is $K_n$ with some edges deleted. Examples: $K_1$ is a single vertex, $K_2$ an edge, $K_3$
a triangle, $K_4$ the tetrahedron. A copy of $K_k$ inside a larger graph, a set of $k$ pairwise
adjacent vertices, is a clique ([[def:clique]]).
:::

```graph id=t01-complete-examples widget=figure
caption: Left, $K_5$ with all $\binom{5}{2} = 10$ edges. Right, $K_5$ without the edge $24$: only 9 edges, so the graph is not complete, because the vertices 2 and 4 are not adjacent.
intent: New figure. Example and non-example for the complete graph $K_n$; the lecture draws $K_5$ on p2 with the same vertex names, a pentagon with all diagonals.
layout: fixed
panel: $K_5$
1 @(0, 1); 2 @(1.52, 0.31); 3 @(0.94, -0.81); 4 @(-0.94, -0.81); 5 @(-1.52, 0.31)
1 -- 2 -- 3 -- 4 -- 5 -- 1; 1 -- 3 -- 5 -- 2 -- 4 -- 1
panel: not complete
1 @(0, 1); 2 @(1.52, 0.31) [class=color2]; 3 @(0.94, -0.81); 4 @(-0.94, -0.81) [class=color2]; 5 @(-1.52, 0.31)
1 -- 2 -- 3 -- 4 -- 5 -- 1; 4 -- 1 -- 3 -- 5 -- 2
```

::: definition {#def:complete-bipartite title="Complete bipartite graph $K_{m,n}$" defines="complete bipartite graph, K_{m,n}" source="theory/2026-09-15 p3"}
The **complete bipartite graph on $m + n$ vertices**, denoted $K_{m,n}$, has vertex set
$V_m \cup V_n$, where $V_m = \set{1, \dots, m}$ and $V_n = \set{1', \dots, n'}$ are disjoint, and
$$E(K_{m,n}) = \set{\set{u, v} : u \in V_m,\ v \in V_n}.$$
Every vertex of $V_m$ is adjacent to every vertex of $V_n$, and there are no other edges. The
lecture writes this briefly as $E(K_{m,n}) = V_m \times V_n$, identifying the ordered pair
$(u, v)$ with the edge $\set{u, v}$.
:::

::: intuition
Two teams, where everyone meets everyone of the other team and nobody of their own. $K_{m,n}$ is
the [[def:bipartite|bipartite]] graph with sides of sizes $m$ and $n$ that has all possible edges.
Examples: $K_{1,n}$ is a star (one centre, $n$ leaves), $K_{2,2} \cong C_4$, and $K_{3,3}$ is the
"three houses, three utilities" graph. Non-example: $K_3$ is not of this form, since a triangle
always has two vertices on the same side.
:::

```graph id=t01-bipartite-examples widget=figure
caption: Left, $K_{2,3}$ with $V_2 = \set{1, 2}$ on top and $V_3 = \set{1', 2', 3'}$ below: $2 \cdot 3 = 6$ edges, one between every top and every bottom vertex. Right, the same sides without the edge $2\,3'$: still bipartite, but with 5 edges it is not complete.
intent: New figure. Example and non-example for $K_{m,n}$; the layout (the two sides $V_m$ and $V_n$ stacked, primes on the lower side) follows the lecture drawing on p3.
layout: fixed
panel: $K_{2,3}$
1 @(0.5, 1) [class=color1]; 2 @(1.5, 1) [class=color1]; 1' @(0, 0) [class=color2]; 2' @(1, 0) [class=color2]; 3' @(2, 0) [class=color2]
1 -- 1'; 1 -- 2'; 1 -- 3'; 2 -- 1'; 2 -- 2'; 2 -- 3'
panel: not complete
1 @(0.5, 1) [class=color1]; 2 @(1.5, 1) [class=color1]; 1' @(0, 0) [class=color2]; 2' @(1, 0) [class=color2]; 3' @(2, 0) [class=color2]
1 -- 1'; 1 -- 2'; 1 -- 3'; 2 -- 1'; 2 -- 2'
```

```graph id=t01-graph-classes widget=figure
caption: The basic graph classes: the path $P_4$ (5 vertices!), the cycle $C_6$, the complete graph $K_5$ and the complete bipartite graph $K_{3,3}$.
intent: Visual dictionary of the four families. Vertex ids follow the definitions so students see the conventions (P_n starts at 0; K_{m,n} uses primes on one side).
height: small
panel: $P_4$
use: P(4)
panel: $C_6$
use: C(6)
panel: $K_5$
use: K(5)
panel: $K_{3,3}$
use: K(3,3)
```

::: pitfall
$P_n$ has $n + 1$ vertices, but $C_n$ and $K_n$ have $n$ vertices. Some textbooks use $P_n$ for
the path on $n$ vertices; in this course the index of $P_n$ is always the **length**.
:::
