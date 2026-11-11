---
title: "Degrees and the handshake lemma"
course: theory
chapter: degrees
order: 1
lectures: [t01]
stage: split
status: draft
---

::: definition {#def:degree title="Degree" defines="degree, d_G(v), isolated vertex" source="theory/2026-09-15 p5"}
The **degree** of a vertex $v \in V(G)$ is
$$d_G(v) := \text{the number of edges incident with } v,$$
where **loops are counted twice**. A vertex of degree $0$ is **isolated**.
:::

::: intuition
The degree counts the *ends* of edges at $v$. In a simple graph this is just the number of
neighbours. Examples: every vertex of $C_n$ has degree $2$, every vertex of $K_n$ has degree
$n - 1$, and in $K_{m,n}$ the vertices on the side of size $m$ have degree $n$. In $P_n$ with
$n \ge 1$, the two ends have degree $1$ and the inner vertices degree $2$.
:::

In a simple graph, $d_G(v) = \abs{N_G(v)}$. Many texts write $\deg(v)$ or $\deg_G(v)$; the lectures
use $d_G(v)$, and we drop the index $G$ when the graph is clear.

Why count a loop twice? Because a loop has *two ends* at $v$: if you go around a small circle
centred at $v$, you cross the loop twice. With this convention the next statement holds for all
[[def:mixed-multigraph|multigraphs]], not only for simple graphs.

```graph id=t01-loop-degree widget=figure
caption: $d(a) = 4$: the loop contributes $2$, the edges $ab$ and $ac$ contribute $1$ each. Also $d(b) = d(c) = 3$.
intent: Show that a loop contributes 2 to the degree, and that parallel edges each count.
height: small
a -- a; a -- b; a -- c; b -- c; b -- c
```

::: pitfall
In a multigraph the degree is **not** the number of neighbours. In the figure above, $a$ has
two neighbours but degree $4$, and $b$ has two neighbours but degree $3$. The formula
$d_G(v) = \abs{N_G(v)}$ holds only in simple graphs.
:::

::: lemma {#lem:handshake title="Handshake lemma" aka="degree sum formula" source="theory/2026-09-15 p5"}
For every (multi)graph $G$:
$$\sum_{v \in V(G)} d_G(v) = 2 \cdot \abs{E(G)}.$$
:::

::: proof
We count the **incidences**, the pairs (vertex, end of an edge at that vertex), in two ways.
Every edge has exactly two ends: an edge $uv$ with $u \ne v$ has one end at $u$ and one at $v$,
and a loop at $v$ has both ends at $v$. So the number of incidences is $2 \abs{E(G)}$. On the
other hand, the number of ends at a vertex $v$ is exactly $d_G(v)$ (this is where loops must be
counted twice), so the number of incidences is also $\sum_{v} d_G(v)$.

In the words of the lecture: going over all edges of $G$, every edge contributes exactly $+2$ to
the degree sum.
:::

::: intuition
Summing the degrees counts every edge once from each end, so every edge is counted twice. The
name comes from the situation at a party: if every handshake involves two hands, then the total
number of hands shaken is twice the number of handshakes. Example: $K_4$ has degree sum
$4 \cdot 3 = 12 = 2 \cdot 6$, and a single loop has degree sum $2 = 2 \cdot 1$.
:::

::: corollary {#cor:odd-degree-count title="Odd-degree vertices" extra=true}
Every (multi)graph has an even number of vertices of odd degree.
:::

::: proof
Split the degree sum into the vertices of even degree and those of odd degree:
$$2\abs{E(G)} = \sum_{d(v) \text{ even}} d(v) + \sum_{d(v) \text{ odd}} d(v).$$
The left-hand side and the first sum on the right are even, hence the second sum is even. A sum
of odd numbers is even exactly when the number of summands is even.
:::

::: intuition
The degree sum is even, and a sum of integers is even exactly when it has an even number of odd
terms. This gives a quick impossibility test: there is no graph with degrees $3, 2, 2$, and no
graph on $5$ vertices in which every vertex has degree $3$. Example: the star $K_{1,3}$ has four
odd-degree vertices, an even number.
:::

::: remark
For a digraph $D$ one distinguishes the **out-degree** $d^+(v)$ (number of arcs leaving $v$)
and the **in-degree** $d^-(v)$ (number of arcs entering $v$). Every arc has exactly one tail and
one head, so $\sum_v d^+(v) = \sum_v d^-(v) = \abs{E(D)}$.
:::

```graph id=t01-handshake-sandbox widget=editable
caption: Try it: add, remove and move vertices and edges (including loops and parallel edges). The degree sum is always twice the number of edges.
intent: Let students convince themselves of the handshake lemma and of the corollary by experiment.
live: degree-sequence, degree-sum, edge-count
1 -- 2 -- 3 -- 1; 3 -- 4
```
