---
title: "Flows"
course: algorithms
chapter: flows
order: 2
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:flow title="Flow" defines="flow, capacity constraints, conservation, value of a flow" source="algorithms/02 p4"}
A **flow** is a function $f : E \to \R^+$ satisfying

- the **capacity constraints**: $\forall e \in E : 0 \le f(e) \le c(e)$,
- the **conservation constraints**: $\forall v \in V \setminus \set{s, t} : \displaystyle\sum_{(u,v) \in E} f(u, v) = \sum_{(v,w) \in E} f(v, w)$.

The **value** of a flow $f$ is $\abs{f} = \sum_{(s,v) \in E} f(s, v) = \sum_{(w,t) \in E} f(w, t)$.
:::

::: intuition
A flow says how much actually travels along each arc: never more than the capacity, and nothing is created or lost at the inner
vertices (what enters $v$ leaves $v$). The value is what arrives at $t$. Example: in [[fig:a02-flow-example]], $8$ units go along
$s \to a \to d \to t$ and all other arcs carry $0$; at $a$ and $d$, $8$ units enter and $8$ leave. Non-example: $f(s, a) = 8$,
$f(a, d) = 5$ and $0$ elsewhere violates conservation at $a$ ($8$ in, $5$ out). A flow with values $0$ and $1$ only is a
d-flow ([[def:d-flow]]).
:::

For $e = (u, v)$ we often write $f(u, v)$ instead of $f(e)$. In figures, an edge label $f/c$ shows flow and capacity.
That the flow out of $s$ equals the flow into $t$ follows from conservation: summing (outflow $-$ inflow) over all vertices
gives $0$ (each edge is counted once positively and once negatively), and only $s$ and $t$ contribute.

```graph id=a02-flow-example widget=figure
caption: A flow of value 8 (labels show $f/c$).
intent: First example of a flow, from the lecture.
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [f=8 c=10]; s -> b [f=0 c=10]; a -> b [f=0 c=2]; a -> c [f=0 c=4]; a -> d [f=8 c=8 class=saturated]; b -> d [f=0 c=9]; d -> c [f=0 c=9]; c -> t [f=0 c=10]; d -> t [f=8 c=10]
```

**Applications of network flows** include disjoint paths and network connectivity, bipartite
[[def:matching|matchings]], circulations with upper and lower bounds, matrix rounding (census tabulation), airline scheduling,
image segmentation, project selection (maximum-weight closure), open-pit mining, distributed computing, network intrusion detection, multi-camera scene
reconstruction, gene function prediction and quantitative food webs in ecology (see Ahuja, Magnanti, Orlin: *Network
Flows*, 1993).
