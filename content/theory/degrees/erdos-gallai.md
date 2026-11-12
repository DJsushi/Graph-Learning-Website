---
title: "The Erdős–Gallai theorem"
course: theory
chapter: degrees
order: 5
lectures: [t01]
stage: split
status: draft
---

The lecture closes with a second characterisation of degree sequences. It does not need to be
applied repeatedly; it is a list of inequalities to check.

::: theorem {#thm:erdos-gallai title="Erdős–Gallai" source="theory/2026-09-15 p7"}
There exists a graph with a non-increasing degree sequence $(d_1, d_2, \dots, d_n)$ of
non-negative integers if and only if $d_1 + \dots + d_n$ is even and, for every
$k \in \set{1, \dots, n}$,
$$\sum_{i=1}^{k} d_i \ \le\ k(k-1) + \sum_{i=k+1}^{n} \min(d_i, k).$$
:::

::: intuition
Fix the $k$ vertices of the largest degrees, $A = \set{v_1, \dots, v_k}$. Their degrees are paid
by edges inside $A$ (at most $k(k-1)$ in total, since each of the $k$ vertices has at most $k-1$
neighbours in $A$) and by edges going to the other vertices. A vertex $v_i$ outside $A$ can
"absorb" at most $\min(d_i, k)$ of those edges: at most $d_i$ because that is its degree, and at
most $k$ because it can be adjacent to each vertex of $A$ only once.
:::

```graph id=t01-erdos-gallai-check widget=stepper
caption: The graph has degree sequence $(3, 3, 3, 2, 1)$. Each step checks the inequality for one $k$; the vertices of $A = \set{v_1, \dots, v_k}$ are coloured, edges inside $A$ are highlighted and edges from $A$ to the rest are bold.
intent: New; the lecture (theory/2026-09-15 p7) states the theorem without an example. Shows that the inequality must be checked for every k, and that it can hold with equality (k = 3).
layout: fixed
v1 [label="$v_1$"] @(-0.8, 1); v2 [label="$v_2$"] @(0.8, 1); v3 [label="$v_3$"] @(0, 0)
v4 [label="$v_4$"] @(-1.4, 0); v5 [label="$v_5$"] @(1.4, 0)
v1 -- v2; v1 -- v3; v1 -- v4; v2 -- v3; v2 -- v5; v3 -- v4
step: $k = 1$: $3 \le 0 + 1 + 1 + 1 + 1$.
class color1: v1
class bold: v1--v2 v1--v3 v1--v4
step: $k = 2$: $6 \le 2 + 2 + 2 + 1$.
class color1: v2
unclass bold: v1--v2
class highlight: v1--v2
class bold: v2--v3 v2--v5
step: $k = 3$: $9 \le 6 + 2 + 1$, with equality.
class color1: v3
unclass bold: v1--v3 v2--v3
class highlight: v1--v3 v2--v3
class bold: v3--v4
step: $k = 4$: $11 \le 12 + 1$.
class color1: v4
unclass bold: v1--v4 v3--v4
class highlight: v1--v4 v3--v4
step: $k = 5$: $12 \le 20$; no vertex is left outside $A$.
class color1: v5
unclass bold: v2--v5
class highlight: v2--v5
```

::: pitfall
The inequalities are for the **non-increasing** order, and they must hold for **every** $k$.
For $(3, 3, 1, 1)$ the case $k = 1$ holds ($3 \le 0 + 1 + 1 + 1$), but $k = 2$ fails
($6 > 2 + 1 + 1$), so the sequence is not graphic. Written in the wrong order as $(1, 1, 3, 3)$,
the same numbers pass all four inequalities.
:::

The lecture states this without proof.
