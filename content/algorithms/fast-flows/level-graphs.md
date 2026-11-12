---
title: "Level graphs"
course: algorithms
chapter: fast-flows
order: 2
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:level-graph title="Level graph" defines="level graph, layer" source="algorithms/02 p29–30"}
Let $L_i = \set{v \in V \mid \mathrm{dist}(s, v) = i}$ be the set of vertices at distance $i$ from $s$. The **level graph** $L_G = (V, E_G)$ is the subgraph of $G$ with
$$E_G = \set{(u, v) \in E \mid \exists i \in \N : u \in L_i \land v \in L_{i+1}}.$$
:::

::: intuition
Sort the vertices into layers by their [[def:distance|distance]] from $s$, exactly as BFS does ([[alg:bfs]]), and keep only the edges that
step one layer further. What remains is precisely the union of all shortest paths from $s$. Example: in [[fig:a02-level-graph]],
$L_0 = \set{s}$, $L_1 = \set{a, c}$, $L_2 = \set{b, d}$, $L_3 = \set{t}$; the edge $(a, c)$ stays inside $L_1$ and $(b, c)$ goes back from
$L_2$ to $L_1$, so both are dropped, as is $(d, b)$ inside $L_2$.
:::

```graph id=a02-level-graph widget=figure
caption: A graph $G$ and its level graph $L_G$: only edges going exactly one level further from $s$ are kept.
intent: Transcription of the lecture example.
type: directed
layout: fixed
layout-sync: true
panel: graph $G$
s @(0, 0); a @(1.5, 1); c @(1.5, 0); b @(3, 1); d @(3, 0); t @(4.5, 0)
s -> a; s -> c; a -> c; a -> b; a -> d; b -> c; c -> d; d -> b; b -> t; d -> t
panel: level graph $L_G$
s @(0, 0); a @(1.5, 1); c @(1.5, 0); b @(3, 1); d @(3, 0); t @(4.5, 0)
s -> a; s -> c; a -> b; a -> d; c -> d; b -> t; d -> t
```

**Properties.** The level graph can be computed in time $\O(m)$ by a modified BFS from $s$ that keeps all "forward" edges (those going exactly one level down). All
$s$–$v$ paths in $L_G$ have the same length, and every shortest $s$–$v$ path in $G$ is also a (shortest) $s$–$v$ path in $L_G$ and vice versa: $L_G$ is the **graph of all
shortest paths from $s$**. It is not necessarily a (BFS) tree.

Indeed, along any edge $(u, v)$ of $G$ we have $\mathrm{dist}(s, v) \le \mathrm{dist}(s, u) + 1$ (the levels can increase by at most one per edge), so a path from $s$ to $v \in L_k$ has
at least $k$ edges, with equality iff every edge goes up exactly one level.
