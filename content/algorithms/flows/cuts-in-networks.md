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
