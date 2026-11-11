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
two neighbours besides itself but degree $4$, and $b$ has two neighbours but degree $3$. The formula
$d_G(v) = \abs{N_G(v)}$ holds only in simple graphs.
:::

::: lemma {#lem:handshake title="Handshake lemma" aka="degree sum formula" source="theory/2026-09-15 p5"}
For every (multi)graph $G$:
$$\sum_{v \in V(G)} d_G(v) = 2 \cdot \abs{E(G)}.$$
:::

This is **double counting**: we count one set, the incidences, edge by edge and vertex by vertex.

:::: walkthrough {for=lem:handshake}
```graph id=t01-handshake-count widget=stepper
caption: Counting the incidences of the lecture graph, then of the same graph with a loop added at $x$.
intent: Walkthrough of the handshake lemma on the lecture graph (theory/2026-09-15 p5, degree sequence (4,4,3,3,1,1,0)); a loop at x is added in step 3 and is new.
layout: fixed
vertex-label: "{id}: {d}"
x [d=0] @(1, 1.6)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
l -- r [bend=0.5]; l -- mt; mt -- r; l -- mb; mt -- mb; r -- mb; l -- p; r -- q
mark e: l--r
mark v: l
step: The lecture graph: 7 vertices, 8 edges.
step: An edge between two different vertices has two ends.
class highlight: l--r
step: A loop has two ends too, both at the same vertex.
set x [d=2]
x -- x [class=highlight side=top]
mark loop: x--x
step: Edge by edge, every edge gives 2 incidences.
unclass highlight: l--r x--x
class bold: l--r l--mt mt--r l--mb mt--mb r--mb l--p r--q x--x
step: Vertex by vertex, the ends at a vertex are its degree.
unclass bold: l--r l--mt mt--r l--mb mt--mb r--mb l--p r--q x--x
class highlight: l l--r l--mt l--mb l--p
step: Both counts are the same number, so they are equal.
unclass highlight: l l--r l--mt l--mb l--p
class highlight: x l r mt mb p q
```

::: step
We count the **incidences**: the pairs (vertex, end of an edge at that vertex). We count them
twice, once edge by edge and once vertex by vertex. Both counts give the size of the same set,
so they must agree. The picture is the lecture graph, each vertex labelled with its degree. It
has 8 edges.
:::

::: step
Edge by edge: take an edge $uv$ with $u \ne v$, here [[fig:t01-handshake-count#e|the edge $lr$]].
It has one end at $u$ and one at $v$. So it gives exactly 2 incidences: one at each of its two
vertices.
:::

::: step
A loop at $v$ has both ends at $v$. Here we add [[fig:t01-handshake-count#loop|a loop]] at $x$.
So a loop also gives exactly 2 incidences, both at $v$. This is why the definition counts loops
twice: the degree of $x$ goes from 0 to 2. The lemma covers every multigraph, so loops are allowed.
:::

::: step
Every edge, loop or not, gives exactly 2 incidences. Every incidence is one end of one edge, and
an end belongs to only one edge. So no incidence is counted twice or missed. The total is twice the number
of edges. Here: 2 times 9 is 18. The lecture says: every edge contributes $+2$ to the degree sum.
:::

::: step
Vertex by vertex: the number of ends at [[fig:t01-handshake-count#v|a vertex $v$]] is exactly its
degree $d(v)$. For loops this is the definition, which counts them twice. Here: $l$ has 4 ends,
one for each of its 4 edges.
:::

::: step
Every incidence belongs to exactly one vertex. So adding up the ends at all vertices counts
every incidence once, and the total is the degree sum. Both counts are the same set, so
$\sum_{v} d(v) = 2\abs{E(G)}$. Here: 2 + 4 + 4 + 3 + 3 + 1 + 1 is 18, which is 2 times the 9 edges.
:::
::::

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

This is a **parity argument**: the handshake lemma makes the degree sum even, and we read off how many odd terms it can have.

:::: walkthrough {for=cor:odd-degree-count}
```graph id=t01-odd-count widget=stepper
caption: Even-degree and odd-degree vertices of the lecture graph; both degree sums are even.
intent: Walkthrough of the odd-degree corollary on the lecture graph (theory/2026-09-15 p5, degree sequence (4,4,3,3,1,1,0)); the colouring is new.
layout: fixed
vertex-label: "{id}: {d}"
x [d=0] @(1, 1.6)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
l -- r [bend=0.5]; l -- mt; mt -- r; l -- mb; mt -- mb; r -- mb; l -- p; r -- q
mark even: x l r
mark odd: mt mb p q
step: Split the vertices by the parity of the degree.
class color1: x l r
class color2: mt mb p q
step: The left side is 2 times the number of edges.
class bold: l--r l--mt mt--r l--mb mt--mb r--mb l--p r--q
step: The sum over the even vertices is even.
class muted: mt mb p q
step: So the sum over the odd vertices is even.
unclass muted: mt mb p q
class muted: x l r
step: An even sum of odd numbers has an even number of terms.
unclass muted: x l r
class highlight: mt mb p q
```

::: step
We split the vertices into [[fig:t01-odd-count#even|those of even degree]] and
[[fig:t01-odd-count#odd|those of odd degree]]. Every vertex is in exactly one group. So the degree sum
is the sum over the first group plus the sum over the second. Here: the graph has 8 edges, and
the two sums are 8 and 8.
:::

::: step
The left side is $2\abs{E(G)}$. It is even, because it is 2 times a whole number. By
[[lem:handshake|the handshake lemma]] it equals the degree sum. Here: 16.
:::

::: step
The first sum has only even terms. A sum of even numbers is even. So the first sum is even.
Here: 0 + 4 + 4, which is 8.
:::

::: step
The second sum is the even left side minus the even first sum, and an even number minus an
even number is even. So the sum of the odd degrees is even. Here: $16 - 8 = 8$.
:::

::: step
Every odd number is an even number plus 1. So a sum of $k$ odd numbers is an even number plus
$k$. It is even exactly when $k$ is even. The sum of the odd degrees is even, so the number of
odd-degree vertices is even. Here: $k = 4$, and $3 + 3 + 1 + 1 = 8$.
:::
::::

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
