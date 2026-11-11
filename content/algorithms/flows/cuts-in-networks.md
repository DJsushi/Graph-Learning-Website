---
title: "Cuts in a flow network"
course: algorithms
chapter: flows
order: 3
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:flow-cut title="s–t cut, capacity" defines="s-t cut, capacity of a cut, MaxFlow, MinCut" source="algorithms/02 p6"}
An **$s$–$t$ cut** in a [[def:flow-network|flow network]] $(G, s, t, c)$ is a bipartition $S \cup T = V$ of the vertices such that $s \in S$ and $t \in T$.
The **capacity** of the cut is
$$\mathrm{cap}(S, T) = \sum_{(u,v) \in E,\ u \in S,\ v \in T} c(u, v).$$
**MaxFlow:** given a flow network, compute a maximum flow. **MinCut:** given a flow network, compute a minimum $s$–$t$ cut.
:::

::: intuition
A cut draws a line between $s$ and $t$; every unit of [[def:flow|flow]] has to cross that line from the $S$ side to the $T$ side, so the arcs
from $S$ to $T$ form a bottleneck. Example: in [[fig:a02-network]], the cut $(\set{s}, V \setminus \set{s})$ has capacity $10 + 10 = 20$, and
the cut $(\set{s, b}, \set{a, c, d, t})$ has capacity $c(s, a) + c(b, d) = 10 + 9 = 19$; the arc $(a, b)$ goes from $T$ to $S$ and does not count.
It is a cut in the sense of [[def:cut]] (a vertex partition) with the extra condition that $s$ and $t$ lie on different sides.
:::

Only edges from $S$ to $T$ count in the capacity; edges from $T$ back to $S$ do not. These cuts are partitions of the vertex set,
while the edge cuts of [[def:st-cut]] are sets of edges; the edges from $S$ to $T$ of an $s$–$t$ cut form an edge cut.

::: pitfall
Three different things are called a "cut" in these courses:

- a **cut** $(S, V \setminus S)$ of [[def:cut]] and the $s$–$t$ cut $(S, T)$ here are partitions of the **vertices**; what crosses them are edges;
- an **$s$–$t$ cut** $X$ and an **$s$–$t$ edge cut** $F$ in Menger's theorem ([[def:st-cut]]) are sets of vertices, resp. edges, whose deletion separates $s$ from $t$;
- a **minimal cut** ([[def:minimal-cut]]) is such a separating vertex set that is minimal under inclusion.

Even the name "$s$–$t$ cut" is used twice: here a vertex partition, in Menger's theorem a set of deleted vertices. An $s$–$t$ cut $(S, T)$
gives an edge cut (its arcs from $S$ to $T$; the arcs from $T$ to $S$ need not be deleted), but it never gives a vertex cut directly.
:::

::: lemma {#lem:flow-across-cut title="Flow across a cut" extra=true}
For every flow $f$ and every $s$–$t$ cut $(S, T)$:
$$\abs{f} = \sum_{(u,v) \in E,\ u \in S,\ v \in T} f(u, v) \ -\ \sum_{(u,v) \in E,\ u \in T,\ v \in S} f(u, v) \ \le\ \mathrm{cap}(S, T).$$
:::

::: proof
Sum the quantity (outflow $-$ inflow) over all $v \in S$. Conservation makes the contribution of every $v \in S \setminus \set{s}$ zero, and $s$
contributes $\abs{f}$ (no edge enters $s$). On the other hand, an edge with both ends in $S$ contributes $+f(e) - f(e) = 0$, an edge from $S$ to $T$
contributes $+f(e)$, and an edge from $T$ to $S$ contributes $-f(e)$. This proves the equality. The inequality follows from $f(e) \le c(e)$ on the
edges from $S$ to $T$ and $f(e) \ge 0$ on the edges from $T$ to $S$.
:::

::: intuition {for=lem:flow-across-cut}
Whatever leaves $s$ must cross from $S$ to $T$ at some point; if it crosses back from $T$ to $S$, it must cross forward once more. So the
net crossing equals the value, and it cannot exceed what the forward arcs can carry. Example: in [[fig:a02-cut-crossing]], $\abs{f} = 4$
and the cut $S = \set{s, a}$ is crossed forward by $f(s, b) + f(a, t) = 2 + 3 = 5$ units and backward by $f(b, a) = 1$ unit, so the net
is $4 = \abs{f}$, while $\mathrm{cap}(S, T) = c(s, b) + c(a, t) = 2 + 3 = 5$. Taking $S = \set{s}$ gives the definition of $\abs{f}$ itself.
:::

```graph id=a02-cut-crossing widget=figure
caption: A flow of value $4$ and the cut $S = \set{s, a}$. Forward arcs $(s, b)$, $(a, t)$ carry $5$ units, the backward arc $(b, a)$ carries $1$ unit back; net $4$. The capacity of the cut is $5$.
intent: Illustrates lem:flow-across-cut, including an arc from T to S that carries flow.
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, -1); t [class=sink] @(3, 0)
s -> a [f=2 c=3]; s -> b [f=2 c=2 class="saturated cut"]; b -> a [f=1 c=1]; a -> t [f=3 c=3 class="saturated cut"]; b -> t [f=1 c=2]
group S: s a [label="$S$"]
group T: b t [label="$T$" class=muted]
```
