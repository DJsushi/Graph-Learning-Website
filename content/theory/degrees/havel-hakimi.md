---
title: "The Havel–Hakimi theorem"
course: theory
chapter: degrees
order: 3
lectures: [t01]
stage: split
status: draft
---

The following theorem reduces the question for a sequence of $n$ numbers to the same question for
a sequence of $n - 1$ numbers. Applying it repeatedly gives an efficient algorithm.

::: theorem {#thm:havel-hakimi title="Havel–Hakimi" source="theory/2026-09-15 p7; theory/2026-09-22 p1–2"}
Let $(d_1, d_2, \dots, d_n)$ be a non-increasing sequence of non-negative integers with
$d_1 \le n - 1$. Then there exists a graph with degree sequence $(d_1, \dots, d_n)$ if and only if
$$\varphi_1 = \bigl(d_2 - 1,\ d_3 - 1,\ \dots,\ d_{d_1 + 1} - 1,\ d_{d_1 + 2},\ \dots,\ d_n\bigr)$$
is a degree sequence of a graph.
:::

In words: remove the largest entry $d_1$ and subtract $1$ from the next $d_1$ entries. The new
sequence $\varphi_1$ need not be non-increasing; that does not matter, because whether a sequence
is graphic does not depend on the order of its entries (simply rename the vertices). Before the
next step we sort it again.

::: intuition
The vertex with the largest demand $d_1$ should take its neighbours among the vertices with the
largest remaining demands, because those are the hardest to satisfy later. The theorem says that
this greedy choice never hurts: if the sequence has any realisation, it has one in which $v_1$ is
adjacent exactly to $v_2, \dots, v_{d_1+1}$. Examples: $(3, 3, 2, 2, 2) \to (2, 1, 1, 2)$, which is
graphic, so $(3, 3, 2, 2, 2)$ is graphic too; $(3, 3, 1, 1) \to (2, 0, 0)$, which is not graphic,
so neither is $(3, 3, 1, 1)$.
:::

::: remark
The lecture states the theorem without the hypothesis $d_1 \le n - 1$. It is needed for
$\varphi_1$ to make sense: there must be $d_1$ entries after $d_1$ to decrease. It costs nothing,
since a sequence with $d_1 > n - 1$ is never graphic (a vertex has at most $n - 1$ neighbours);
the test below rejects such sequences in line `@too-big`.
:::

```graph id=t01-havel-hakimi-idea widget=figure
caption: The idea of the theorem: the vertex $v_1$ of the largest degree $d_1$ is joined to the $d_1$ vertices of the next largest degrees.
intent: Transcription of the lecture sketch. Show v1 joined to v2..v_{d1+1} and not to the rest; removing v1 lowers exactly those degrees by one.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_{d_1+1}$"] @(0.6, 1.3)
v5 [label="$v_{d_1+2}$" class=muted] @(1.6, 1.3); v6 [label="$v_n$" class=muted] @(2.6, 1.3)
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]
```

:::: proof
**($\Leftarrow$)** This direction is easy. Let $H$ be a graph with degree sequence $\varphi_1$, on
vertices $v_2, \dots, v_n$ where $v_i$ has degree $d_i - 1$ for $2 \le i \le d_1 + 1$ and degree
$d_i$ for $i \ge d_1 + 2$. Add a new vertex $v_1$ adjacent to exactly $v_2, \dots, v_{d_1+1}$. The
new vertex has degree $d_1$, the degree of each of $v_2, \dots, v_{d_1+1}$ grows by one to $d_i$,
and all other degrees stay $d_i$. The result is a simple graph with degree sequence
$(d_1, \dots, d_n)$.

**($\Rightarrow$)** We want: from a graph $G$ with degree sequence $\varphi = (d_1, \dots, d_n)$,
construct a graph $H$ with degree sequence $\varphi_1$. It would be enough to find a realisation
$G$ of $\varphi$ in which the vertex of degree $d_1$ is adjacent exactly to the vertices of the
degrees $d_2, \dots, d_{d_1+1}$; then deleting this vertex gives $H$. Not every realisation has
this property, so we choose a good one.

Consider all pairs consisting of a graph $G$ and a numbering $V(G) = \set{v_1, \dots, v_n}$ with
$d_G(v_i) = d_i$ for every $i$ (by assumption there is at least one). Among them choose one such
that

1. the sum of the degrees of the neighbours of $v_1$ is **maximum**, and, among those,
2. the number of neighbours of $v_1$ in the set $\set{v_{d_1+2}, \dots, v_n}$ is **minimum**.

There are only finitely many such pairs, so the choice is possible. We show that the neighbours
of $v_1$ are then exactly $v_2, \dots, v_{d_1+1}$.

**(a)** If the neighbours of $v_1$ are $\set{v_2, \dots, v_{d_1+1}}$, then $H = G - v_1$ has degree
sequence $\varphi_1$, and we are done.

**(b)** Otherwise, $v_1$ has a neighbour $v_j$ with $j \ge d_1 + 2$. Since $v_1$ has exactly $d_1$
neighbours and one of them lies outside $\set{v_2, \dots, v_{d_1+1}}$, at most $d_1 - 1$ of the
$d_1$ vertices $v_2, \dots, v_{d_1+1}$ are neighbours of $v_1$. So there is an index
$i \le d_1 + 1$ with $\set{v_1, v_i} \notin E(G)$. Because $i < j$ and the sequence is
non-increasing, $d_G(v_i) = d_i \ge d_j = d_G(v_j)$. There are two cases.

- **$d_G(v_i) = d_G(v_j)$.** Exchange the names of $v_i$ and $v_j$. The numbering still satisfies
  $d_G(v_k) = d_k$ for all $k$ (the two vertices have the same degree), the graph and hence the
  neighbour degree sum of $v_1$ are unchanged, but $v_1$ now has one neighbour fewer in
  $\set{v_{d_1+2}, \dots, v_n}$ (the old $v_j$ is now called $v_i$, with $i \le d_1 + 1$, and the
  old $v_i$, which now has index $j$, is not a neighbour of $v_1$). This contradicts the
  minimality in rule 2.

- **$d_G(v_i) > d_G(v_j)$.** We find a vertex $v_k$ with $\set{v_i, v_k} \in E(G)$ and
  $\set{v_j, v_k} \notin E(G)$. Indeed, $v_i$ has $d_G(v_i)$ neighbours, so at least
  $d_G(v_i) - 1 \ge d_G(v_j)$ neighbours other than $v_j$. The vertex $v_j$ has at most
  $d_G(v_j) - 1$ neighbours other than $v_1$ (one of its neighbours is $v_1$). So some neighbour
  $v_k \ne v_j$ of $v_i$ is not a neighbour of $v_j$ and is not $v_1$. (We also know
  $v_k \ne v_1$ directly, since $v_1$ and $v_i$ are not adjacent.) Now take the graph
  $$G' = \bigl(G - \set{v_1, v_j} - \set{v_i, v_k}\bigr) + \set{v_1, v_i} + \set{v_j, v_k}.$$
  The two added pairs were non-edges, so $G'$ is a simple graph. Each of $v_1, v_i, v_j, v_k$ loses
  one incident edge and gains one, so $G'$ has the same degree sequence $\varphi$, with the same
  numbering. But in $G'$ the neighbour $v_j$ of $v_1$ has been replaced by $v_i$, so the sum of
  the degrees of the neighbours of $v_1$ grew by $d_i - d_j > 0$. This contradicts the
  maximality in rule 1.

Both cases are impossible, so case (a) holds, and $G - v_1$ is a graph with degree sequence
$\varphi_1$.
::::

```graph id=t01-havel-hakimi-switch widget=stepper
caption: The exchange in case (b): replace $v_1v_j$ and $v_iv_k$ by $v_1v_i$ and $v_jv_k$. No degree changes, but $v_1$ gets a neighbour of larger degree.
intent: Illustrate the 2-switch from the proof. Degrees of all four vertices are preserved.
layout: fixed
v1 [label="$v_1$"] @(0, 0); vi [label="$v_i$"] @(1, 1.2); vj [label="$v_j$"] @(2.6, 1.2); vk [label="$v_k$"] @(1.8, 2.2)
x1 [class=muted label=""] @(0.4, 2.2); x2 [class=muted label=""] @(3.2, 2.2)
v1 -- vj; vi -- vk; vi -- x1 [class=muted]; vj -- x2 [class=muted]
step: Situation in case (b): $v_1 v_j \in E$, $v_1 v_i \notin E$, $v_i v_k \in E$, $v_j v_k \notin E$.
class highlight: v1--vj vi--vk
step: Remove the edges $v_1 v_j$ and $v_i v_k$.
remove v1--vj vi--vk
step: Add the edges $v_1 v_i$ and $v_j v_k$. Every one of the four vertices kept its degree.
v1 -- vi [class=highlight]; vj -- vk [class=highlight]
```

::: remark
This exchange of two edges for two others, keeping all degrees, is called a **2-switch**. One can
show that any two realisations of the same degree sequence can be transformed into each other by
a sequence of 2-switches.
:::
