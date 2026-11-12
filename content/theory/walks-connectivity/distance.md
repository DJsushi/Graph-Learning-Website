---
title: "Distance"
course: theory
chapter: walks-connectivity
order: 3
lectures: [t02]
stage: split
status: draft
---

::: definition {#def:distance title="Graph distance" defines="distance, dist" source="theory/2026-09-22 p4"}
The **distance** of vertices $u, v$ in $G$ is
$$\mathrm{dist}_G(u, v) := \min\set{\text{length of a walk from } u \text{ to } v},$$
with $\mathrm{dist}_G(u, v) = \infty$ if $u$ and $v$ lie in different components.
:::

::: intuition
The distance is the least number of edges needed to get from $u$ to $v$. The minimum exists
because walk lengths are non-negative integers, and by [[claim:shortest-walk-path]] it is attained
by a path. Example: in the [[def:cycle-graph|cycle]] $C_6$ opposite vertices have distance $3$ and neighbours distance
$1$; every vertex has distance $0$ to itself.
:::
