---
title: "The Stoer–Wagner algorithm"
course: algorithms
chapter: global-min-cut
order: 2
lectures: [a03]
stage: split
status: draft
---

[[def:node-identification|Node identification]] gives a recursive view of the [[def:global-min-cut|global minimum cut]]. All [[def:flow-network|capacities]] are positive, as before.

::: corollary {#cor:identification-mincut title="Minimum cut by identification" source="algorithms/03 p32"}
For all $v \ne w \in V(G)$:
$$\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w)),$$
where $\lambda(G_{vw}) = \infty$ if $G_{vw}$ has only one vertex.
:::

::: proof
By [[obs:identification-cuts]], every cut of $G_{vw}$ is a cut of $G$, so $\lambda(G_{vw}) \ge \lambda(G)$, and clearly $\lambda(G; v, w) \ge \lambda(G)$.
A minimum cut of $G$ either separates $v$ and $w$, and then $\lambda(G) = \lambda(G; v, w)$, or it does not, and then it is a cut of $G_{vw}$ with the
same capacity, so $\lambda(G) = \lambda(G_{vw})$.
:::

::: intuition
The minimum cut either separates $v$ from $w$ or it does not. In the first case one $v$–$w$ cut computation finds it; in the second, gluing $v$ and $w$
together loses nothing. Example: for $v = c$, $w = e$ in [[fig:a03-network]], $\lambda(G; c, e) = 15$, and $G_{ce}$ still has the cut
$\delta(\set{c, d, e})$ of capacity $13$, so $\lambda(G) = \min(13, 15) = 13$.
:::

::: algorithm {#alg:simple-min-cut title="Simple algorithm for minimum cut" source="algorithms/03 p32"}
```pseudo
repeat n − 2 times                                            // @loop
    choose two vertices v, w                                  // @choose
    compute a minimum v–w cut of G       // can be expensive! @cut
    G ← G_vw                                                  // @identify
the last graph has two vertices and a single (trivial) cut    // @last
return the best of these n − 1 cuts                           // @return
```
:::

By [[cor:identification-mincut]] and induction, the best of the cuts found is a minimum cut of $G$ (and by [[obs:identification-cuts]] each of them
is a cut of the original $G$).

::: intuition {for=alg:simple-min-cut}
Unroll the corollary: $\lambda(G) = \min(\lambda(G; v_1, w_1), \lambda(G_{v_1w_1}))$, and so on, until two vertices are left. Each step shrinks the
graph by one vertex. Example: on [[fig:a03-network]], choosing the pairs that Stoer–Wagner chooses below gives the cuts $14, 15, 13, 17, 18$, with
minimum $13$. As written, the algorithm still needs $n - 2$ minimum $v$–$w$ cuts, which is no better than [[prop:global-cut-flows]].
:::

**Node identification algorithm (Nagamochi–Ibaraki 1992, Stoer–Wagner 1994).** It does not use any maximum-flow computation. It was first
discovered by Nagamochi and Ibaraki; Stoer and Wagner gave a simpler description and proof. The main idea: in
$\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w))$, choose $v$ and $w$ **so that the minimum $v$–$w$ cut is easy to find**.

::: definition {#def:tightly-connected title="Most tightly connected vertex" defines="most tightly connected vertex" source="algorithms/03 p35"}
For $U \subseteq V$ and $v \notin U$ let
$$c(U, v) = c(\delta(U) \cap \delta(v)) = \sum_{u \in U,\ uv \in E} c(uv)$$
be the sum of the capacities of all edges between $U$ and $v$. A vertex $v \notin U$ is **most tightly connected** to $U$ if
$c(U, v) = \max\set{c(U, w) \mid w \notin U}$.
:::

::: intuition
The most tightly connected vertex is the outside vertex that would be hardest to cut off from $U$. Growing $U$ by always taking it is like
[[alg:jarnik|Jarník's algorithm]], but with the **sum** of the edges into $U$ as the key instead of the lightest single edge. Example: in
[[fig:a03-network]] with $U = \set{a, b}$, $c(U, f) = 8 + 3 = 11$, $c(U, c) = 4$, $c(U, e) = 2$, $c(U, d) = 0$, so $f$ is most tightly connected.
Non-example: $c(U, v)$ is not $c(\delta(v))$: the edges from $v$ to other outside vertices do not count.
:::

::: algorithm {#alg:stoer-wagner title="Stoer–Wagner algorithm" source="algorithms/03 p34–35"}
```pseudo
MINIMUMCUT(G, c)
    A ← ∅            // minimum cut so far     @init
    M ← ∞            // its capacity
    while |V| > 1 do                           // @loop
        (s, t) ← MINCUTPHASE(G, c)             // @phase
        if c(δ(t)) < M then                    // @compare
            M ← c(δ(t)); A ← δ(t)              // @record
        G ← G_st                               // @identify
    return A                                   // @return

MINCUTPHASE(G, c)
    u ← some vertex of G; U ← {u}              // @start
    while U ≠ V do
        v ← most tightly connected to U        // @add
        U ← U ∪ {v}
    // v_1, …, v_n: the order of adding to U
    return (v_{n−1}, v_n)                      // @end
```
:::

The idea: repeatedly find two vertices $s, t$ such that $\delta(t)$ is a minimum $s$–$t$ cut ([[thm:mincut-phase]]), identify $s$ and $t$, and
remember the smallest cut so far. In the identified graph, $t$ may stand for a set $T$ of original vertices; then $\delta(t)$ is the cut
$\delta(T)$ of the original graph, with the same capacity ([[obs:identification-cuts]]). The cut $\delta(t)$ is called the **cut of the phase**;
its capacity is $c(V \setminus \set{t}, t)$, the key of $t$ when it is added.

::: intuition {for=alg:stoer-wagner}
Each phase orders the vertices by "growing a blob" from an arbitrary start, always swallowing the vertex most attached to the blob. The last vertex
$t$ is the one least attached when it joins, and the theorem below shows that cutting it off alone is the best way to separate it from the
second-to-last vertex $s$. So $s$ and $t$ can be glued together, as in [[alg:simple-min-cut]], but the $s$–$t$ cut came for free. Example: in
[[fig:a03-stoer-wagner-player]], phase 3 adds $a, b, f, \set{c, d, e}$ and finds the cut $\delta(\set{c, d, e})$ of capacity $13 = \lambda(G)$.
:::

```graph id=a03-stoer-wagner-player widget=player
caption: The Stoer–Wagner algorithm on the lecture network, starting every phase from $a$. Badges show the keys $c(U, v)$. The cuts of the phases have capacities $14, 15, 13, 17, 18$; the minimum $13$ is found in phase 3.
intent: Algorithm player; identification of s and t is animated as a merge (parallel edges merged with summed capacities). The lecture's demonstration (slide p36) is not in the PDF, so the lecture network is used.
algo: stoer-wagner
params: start=a
layout: fixed
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
```
