---
title: "Paths, cycles and complete graphs"
course: theory
chapter: basics
order: 3
lectures: [t01]
stage: split
status: draft
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

::: observation {#obs:edge-counts-classes title="Edge counts" extra=true}
$\abs{E(P_n)} = n$, $\abs{E(C_n)} = n$, $\abs{E(K_n)} = \binom{n}{2} = \frac{n(n-1)}{2}$ and
$\abs{E(K_{m,n})} = m \cdot n$.
:::

::: proof
The first two counts are read off the definitions: $P_n$ has one edge $\set{i-1,i}$ for each
$i \in \set{1, \dots, n}$, and $C_n$ has the $n - 1$ edges $\set{i, i+1}$ plus the edge
$\set{n, 1}$. For $K_n$, the edge set is the set of all 2-element subsets of an $n$-element set,
of which there are $\binom{n}{2} = n(n-1)/2$. For $K_{m,n}$, an edge is determined by choosing its
endpoint in $V_m$ ($m$ ways) and its endpoint in $V_n$ ($n$ ways), independently; different
choices give different edges, so there are $mn$ edges.
:::

::: intuition
Each count is a count of pairs: $K_n$ has an edge for every pair of vertices, and $K_{m,n}$ one
for every choice of one vertex from each side. Examples: $K_4$ has $6$ edges, $K_{3,3}$ has $9$,
$K_6$ has $15$. A quick sanity check: $K_{m,n}$ is $K_{m+n}$ minus the edges inside the two sides,
and indeed $\binom{m+n}{2} - \binom{m}{2} - \binom{n}{2} = mn$.
:::

::: pitfall
$P_n$ has $n + 1$ vertices, but $C_n$ and $K_n$ have $n$ vertices. Some textbooks use $P_n$ for
the path on $n$ vertices; in this course the index of $P_n$ is always the **length**.
:::
