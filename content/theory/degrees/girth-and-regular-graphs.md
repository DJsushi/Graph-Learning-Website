---
title: "Girth and regular graphs"
course: theory
chapter: degrees
order: 6
lectures: [t03]
stage: split
status: draft
---

::: definition {#def:girth title="Girth, regular graph" defines="girth, regular, d-regular" source="theory/2026-09-29 p8"}
The **girth** of a graph $G$ is the length of the shortest [[def:cycle-graph|cycle]] in $G$ ($\infty$ if $G$ is [[def:forest-tree|acyclic]]). A
graph is **$d$-regular** if every vertex has [[def:degree|degree]] $d$.
:::

::: intuition
Large girth means that the graph looks like a tree nearby: if the girth is at least $k$, two different
[[def:path-graph|paths]] from a vertex $v$ of length less than $k/2$ never meet again, since together they would close a
cycle shorter than $k$. Regularity means every vertex looks the same as far as degrees go. Examples:
$C_n$ is $2$-regular with girth $n$; $K_4$ is $3$-regular with girth $3$; a tree has girth $\infty$.
:::

::: pitfall
A simple graph has girth at least $3$: [[def:mixed-multigraph|loops and parallel edges]] (cycles of length $1$ and $2$) only
exist in multigraphs. And the girth is the **shortest** cycle, not the longest: $K_4$ has a $4$-cycle
but girth $3$.
:::

For example $K_n$ ($n \ge 3$) has girth $3$, $K_{m,n}$ ($m, n \ge 2$) has girth $4$, $C_n$ has girth $n$, and the
Petersen graph is $3$-regular with girth $5$.

```graph id=t03-petersen widget=figure
caption: The Petersen graph is 3-regular and has girth 5.
intent: The example drawn in the lecture next to the theorem.
height: small
use: Petersen
```
