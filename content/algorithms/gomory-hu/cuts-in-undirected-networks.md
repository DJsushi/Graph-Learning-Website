---
title: "Cuts in undirected networks"
course: algorithms
chapter: gomory-hu
order: 1
lectures: [a03]
stage: split
status: draft
---

<!-- REVIEW: the lecture says "G an undirected network" without "connected"; connectivity is assumed here (as in the global minimum cut section, p25) so that all f_G(s, t) > 0, which the cut property of thm:gomory-hu needs. Parallel edges are allowed because node identification creates them. -->
::: definition {#def:undirected-cut title="Cuts in an undirected network" defines="undirected network" source="algorithms/03 p3–4"}
An **undirected network** is a connected undirected graph $G = (V, E)$, possibly with parallel edges but without loops, together with a
capacity function $c : E \to \R^+$. For $U \subseteq V$ let
$$\delta(U) = \delta(V \setminus U) = \set{e \in E \mid e \text{ has one end in } U \text{ and the other in } V \setminus U}$$
be the **cut given by $U$**, and $\delta(v) = \delta(\set{v})$ for a vertex $v$. For $A \subseteq E$ let $c(A) = \sum_{e \in A} c(e)$. The cut
$\delta(U)$ **separates** $s$ and $t$, or is an **$s$–$t$ cut**, if exactly one of $s, t$ lies in $U$; we write
$$f_G(s, t) = \min\set{c(\delta(U)) \mid \delta(U) \text{ separates } s \text{ and } t}$$
for the minimum capacity of an $s$–$t$ cut in $G$. An $s$–$t$ cut of capacity $f_G(s, t)$ is a **minimum $s$–$t$ cut**.
:::

::: intuition
$\delta(U)$ is the set of edges you have to cut to separate $U$ from the rest, and $c(\delta(U))$ is the price. For $\emptyset \ne U \ne V$
these are the crossing edges of the [[def:cut|cut]] $(U, V \setminus U)$ from [[algorithms/01-minimum-spanning-trees]]. Example: in the network of [[fig:a03-network]],
$\delta(\set{a}) = \set{ab, af}$ has capacity $10 + 8 = 18$, and $\delta(\set{a, b}) = \set{af, bc, bf, be}$ has capacity $8 + 4 + 3 + 2 = 17$; it
separates $b$ and $f$, so $f_G(b, f) \le 17$ (in fact $f_G(b, f) = 17$). Non-example: $\delta(\set{a, b})$ does not separate $a$ and $b$.
:::

::: pitfall
An undirected cut has no direction: $\delta(U) = \delta(V \setminus U)$, and every crossing edge counts. In a directed
[[def:flow-cut|$s$–$t$ cut]] $(S, T)$ only the arcs from $S$ to $T$ count. The two agree after replacing each undirected edge by two opposite arcs, see below.
:::

The letter $f$ is chosen because $f_G(s, t)$ is a maximum flow value. Replace every edge $uv$ by the two arcs $(u, v)$ and $(v, u)$, both of
[[def:flow-network|capacity]] $c(uv)$. For every $U$ with $s \in U \not\ni t$, the arcs from $U$ to $V \setminus U$ are exactly one arc per edge of
$\delta(U)$, so the directed cut $(U, V \setminus U)$ has capacity $c(\delta(U))$. By the max-flow min-cut theorem ([[thm:maxflow-mincut]]),
$f_G(s, t)$ is the value of a maximum [[def:flow|flow]] from $s$ to $t$ in this network, and one max-flow computation finds a minimum $s$–$t$ cut, e.g.
in time $\tau = \O(n^2 m)$ with Dinic's algorithm ([[thm:dinic]]).

```graph id=a03-network widget=figure
caption: The network $G$ from the lecture (left; edge labels are capacities) and its Gomory–Hu tree $T$ (right). For example $f_G(a, d) = \min(18, 17, 13, 14) = 13$.
intent: The lecture's running example (slides p5, p9–13). Vertex names and capacities as on the slides; the tree is the one built in the construction example.
layout: fixed
panel: network $G$
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
panel: Gomory–Hu tree $T$
a @(0, 0); b @(1.3, 0); f @(2.6, 0); e @(3.9, 0); c @(5.2, 0); d @(3.9, 1)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
```
