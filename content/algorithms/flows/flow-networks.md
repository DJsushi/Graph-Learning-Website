---
title: "Flow networks"
course: algorithms
chapter: flows
order: 1
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:flow-network title="Flow network" defines="flow network, source, sink, capacity" source="algorithms/02 p3"}
A **flow network** is a quadruple $(G, s, t, c)$ where

- $G = (V, E)$ is a directed graph,
- $s \in V$ is the **source**,
- $t \in V$ is the **sink**, $s \ne t$,
- $c : E \to \R^+$ is a **capacity** function.
:::

::: intuition
A flow network is a road map with one-way roads ([[def:mixed-multigraph|arcs]]), a start $s$, a destination $t$, and on every arc a
limit $c(e)$ on how much can pass per unit of time. Example: [[fig:a02-network]], where $s$ has two outgoing pipes of capacity $10$
each, so at most $20$ units can ever leave $s$. Nothing is said yet about what actually flows; that is the flow
([[def:flow]]). With all capacities $1$, the maximum flow value of a network is the maximum number of arc-disjoint
$s$–$t$ paths, as in Menger's theorem ([[thm:menger-directed]]).
:::

We assume that $G$ is connected (which implies $n + m = \O(m)$) and that there are no parallel edges. We also assume, as the
examples do, that no edge enters $s$ and no edge leaves $t$. Such edges could carry flow that does not count towards the
value, and they can be removed without changing the maximum flow value.

<!-- REVIEW: added that for networks with edges into s or out of t (residual networks G_f always have such edges once |f| > 0, and Lemma A / thm:unit-dinic apply max-flow arguments to G_f) the value is the net flow; the two sums in def:flow then agree and lem:flow-across-cut holds with the same proof. -->
Sometimes such edges cannot be avoided: a [[def:residual-network|residual network]] $G_f$ has them as soon as $\abs{f} > 0$, and
[[thm:unit-dinic]] uses $G_f$ as a network. Then the value of a flow is the **net** flow out of $s$,
$\sum_{(s,v) \in E} f(s, v) - \sum_{(u,s) \in E} f(u, s)$, which equals the net flow into $t$; weak duality and its proof
remain valid.

```graph id=a02-network widget=figure
caption: A flow network. Edge labels are capacities.
intent: The network from the lecture, used for the Ford–Fulkerson demo. Vertex names a..d are ours (unnamed on the slides).
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```
