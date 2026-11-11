---
title: "Walks and paths"
course: theory
chapter: walks-connectivity
order: 1
lectures: [t02]
stage: split
status: draft
---

::: definition {#def:walk title="Walk" defines="walk, closed walk, length of a walk" source="theory/2026-09-22 p3"}
A **walk** in a (multi)graph $G$ is a sequence
$$W = (v_0, e_0, v_1, e_1, v_2, \dots, e_{k-1}, v_k)$$
of vertices $v_i$ and edges $e_i$ of $G$ such that $e_i$ has the endpoints $v_i$ and $v_{i+1}$ for all
$i \in \set{0, \dots, k-1}$ (in a simple graph: $e_i = \set{v_i, v_{i+1}} \in E(G)$). The walk goes
**from $v_0$ to $v_k$**, and its **length** is $k$, the number of edge steps. It is **closed** if
$v_0 = v_k$.
:::

In a walk, vertices and edges may repeat. In simple graphs the edges are determined by the
vertices, so we often write just $(v_0, v_1, \dots, v_k)$.

::: intuition {for=def:walk}
A walk is a route through the graph that records every step, like a list of the streets a
pedestrian takes; streets and crossings may be used again. Its length counts the steps, not the
vertices. Example: in the triangle on $a, b, c$, the sequence $(a, b, c, a, b)$ is a walk of length
$4$, and $(a)$ is a closed walk of length $0$. Non-example: in the path $a - b - c$, the sequence
$(a, c)$ is not a walk, since $ac$ is not an edge.
:::

A **path** in $G$ is a [[def:subgraph|subgraph]] of $G$ [[def:isomorphism|isomorphic]] to some $P_k$ ([[def:path-graph]]); a **cycle** in
$G$ is a subgraph isomorphic to some $C_k$ ([[def:cycle-graph]]). A walk whose vertices are all
distinct "traces" a path: its vertices and edges form a path from $v_0$ to $v_k$. A **$u$–$v$ path** is
a path whose two ends are $u$ and $v$.

::: pitfall
A walk is a *sequence*, a path or a cycle is a *subgraph*. A walk of length $k$ with distinct
vertices traces a path $P_k$, which has $k + 1$ vertices. A closed walk of length $k \ge 3$ whose
vertices $v_0, \dots, v_{k-1}$ are distinct traces a cycle $C_k$. But not every closed walk traces a
cycle: $(a, b, a)$ goes along the edge $ab$ and back, and there is no cycle of length $2$ in a graph.
:::

::: claim {#claim:shortest-walk-path title="Shortest walks are paths" source="theory/2026-09-22 p4"}
A shortest walk between vertices $v_0$ and $v_k$ in a graph is a path.
:::

::: proof
Let $W = (v_0, e_0, v_1, \dots, e_{k-1}, v_k)$ be a walk from $v_0$ to $v_k$ of minimum length. If
some vertex repeats, say $v_i = v_j$ with $i < j$, then
$$W' = (v_0, e_0, \dots, v_i, e_j, v_{j+1}, \dots, v_k)$$
(we skip the closed part between the two visits) is again a walk from $v_0$ to $v_k$, of length
$k - (j - i) < k$. This contradicts minimality. So all vertices of $W$ are distinct, and its vertices
and edges form a path from $v_0$ to $v_k$.
:::

The proof is a "shortcut" argument that is used all the time: whenever a walk visits a vertex
twice, cut out the closed part between the two visits.

```graph id=t02-shortcut widget=stepper
caption: Shortening a walk: when a walk revisits a vertex, the part between the two visits can be cut out.
intent: Visualise the proof of the claim: walk a-b-c-d-b-e repeats b; cutting gives the path a-b-e.
layout: fixed
a @(0, 0); b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9)
a -- b; b -- c; c -- d; d -- b; b -- e
step: The walk $(a, b, c, d, b, e)$ from $a$ to $e$ visits $b$ twice.
class path: a--b b--c c--d d--b b--e
step: The closed part $(b, c, d, b)$ between the two visits can be removed.
class muted: b--c c--d d--b
unclass path: b--c c--d d--b
step: What remains, $(a, b, e)$, is a shorter walk from $a$ to $e$; here it is already a path.
```
