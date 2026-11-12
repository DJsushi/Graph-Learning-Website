---
title: "Distance"
course: theory
chapter: walks-connectivity
order: 3
lectures: [t02]
stage: split
status: reviewed
---

::: definition {#def:distance title="Graph distance" defines="distance, dist" source="theory/2026-09-22 p4"}
The **distance** of vertices $u, v$ in $G$ is
$$\mathrm{dist}_G(u, v) := \min\set{\text{length of a walk from } u \text{ to } v},$$
with $\mathrm{dist}_G(u, v) = \infty$ if $u$ and $v$ lie in different components.
:::

::: intuition
The distance is the least number of edges needed to get from $u$ to $v$. When $u$ and $v$ lie in the same
component, at least one walk exists; walk lengths are non-negative integers, so the minimum exists, and by [[claim:shortest-walk-path]] it is attained
by a path. Example: in the [[def:cycle-graph|cycle]] $C_6$ opposite vertices have distance $3$ and neighbours distance
$1$; every vertex has distance $0$ to itself.
<!-- REVIEW: the minimum exists only when a walk exists; the different-components case is the value infinity of the definition. -->
:::

```graph id=t02-distance-example widget=figure
caption: Left, $\mathrm{dist}(u, v) = 2$ in a 5-cycle. The walk $u, c, v$ is shortest (thick dashed edges), the walk $u, a, b, v$ of length $3$ is longer. Right, $u$ and $x$ lie in different components, so $\mathrm{dist}(u, x) = \infty$.
intent: New example, the lecture (theory/2026-09-22 p4) gives the definition without a drawing. A shortest walk against a longer one, and distance infinity between components.
layout: fixed
panel: Finite distance
u [class=source] @(0, 0.6); a [class=muted] @(0.6, 1.2); b [class=muted] @(1.6, 1.2); v [class=sink] @(2.2, 0.6); c @(1.1, 0)
u -- c [class=path]; c -- v [class=path]; u -- a [class=muted]; a -- b [class=muted]; b -- v [class=muted]
panel: Infinite distance
u [class=source] @(0, 0.6); c @(0.7, 0); v @(1.4, 0.6); x [class=sink] @(2.2, 0); y @(2.9, 0.6)
u -- c; c -- v; x -- y
```
