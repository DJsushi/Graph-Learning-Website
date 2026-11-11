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

::: proposition {#prop:distance-metric title="Distance is a metric" extra=true}
For all vertices $u, v, w$ of a graph $G$: $\mathrm{dist}(u, v) \ge 0$ with equality iff $u = v$;
$\mathrm{dist}(u, v) = \mathrm{dist}(v, u)$; and
$\mathrm{dist}(u, w) \le \mathrm{dist}(u, v) + \mathrm{dist}(v, w)$. In particular, if
$uv \in E(G)$, then $\abs{\mathrm{dist}(x, u) - \mathrm{dist}(x, v)} \le 1$ for every vertex $x$ in the
component of $u$ (for $x$ in another component both distances are $\infty$).
<!-- REVIEW: restricted the last claim to x in the component of u; for other x the difference is ∞ − ∞. -->
:::

::: proof
A walk of length $0$ stays at its start, which gives the first property; reversing walks gives the
second; concatenating a shortest $u$–$v$ walk with a shortest $v$–$w$ walk gives a $u$–$w$ walk of
length $\mathrm{dist}(u,v) + \mathrm{dist}(v,w)$, which gives the triangle inequality (with the usual
rules for $\infty$). If $uv$ is an edge, then $\mathrm{dist}(u, v) = 1$, so the triangle inequality
gives $\mathrm{dist}(x, u) \le \mathrm{dist}(x, v) + 1$ and $\mathrm{dist}(x, v) \le \mathrm{dist}(x, u) + 1$.
:::

::: intuition {for=prop:distance-metric}
Graph distance behaves like distance in the plane: the direct way is never longer than a detour
through $v$. The last statement says that one step along an edge changes the distance from a fixed
vertex $x$ by at most $1$. Example: on $C_5$ the distances from $x$ read $0, 1, 2, 2, 1$ around the
cycle. Neighbours differ by $1$, except the two vertices at distance $2$, which differ by $0$; this edge
inside one distance class is where the odd cycle shows up.
:::
