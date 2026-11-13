---
title: "Global minimum cuts"
course: algorithms
chapter: global-min-cut
order: 1
lectures: [a03]
stage: split
status: reviewed
---

So far we looked for minimum $s$–$t$ cuts between a **given** pair of vertices, which correspond to maximum [[def:flow|flows]] between them
([[thm:maxflow-mincut]]). Now we want the cheapest [[def:undirected-cut|cut]] of the whole network.

::: definition {#def:global-min-cut title="Minimum cut" defines="global minimum cut" source="algorithms/03 p25"}
Let $G = (V, E)$ be a connected undirected graph with a [[def:flow-network|capacity]] function $c : E \to \R^+$. A **minimum cut** (global minimum cut) of $G$ is a set
$A = \delta(S)$ with $\emptyset \ne S \ne V$ such that $c(A)$ is minimum. We write

- $\lambda(G)$ for the capacity of a minimum cut of $G$, and
- $\lambda(G; v, w)$ for the capacity of a minimum $v$–$w$ cut of $G$ (so $\lambda(G; v, w) = f_G(v, w)$).
:::

::: intuition
The global minimum cut is the cheapest way to break the network into two pieces, wherever the break happens. With all capacities $1$, $\lambda(G)$ is
the edge connectivity from the theory course: the largest $k$ such that $G$ is [[def:k-connected|$k$-edge-connected]].
Example: in [[fig:a03-network]], $\lambda(G) = 13$, attained by $\delta(\set{c, d, e})$; every single vertex has $c(\delta(v)) \ge 14$. Non-example:
$\delta(\emptyset) = \emptyset$ has capacity $0$, but it does not split $G$ and is not a cut.
:::

::: proposition {#prop:global-cut-flows title="Global minimum cut by n − 1 flows" source="algorithms/03 p29"}
Fix a vertex $s$ of $G$. Then $\lambda(G) = \min_{t \ne s} \lambda(G; s, t)$. So a minimum cut can be found by solving $n - 1$ maximum-flow problems,
in time $\O(n^4)$ with an $\O(n^3)$ maximum-flow algorithm.
:::

The proof shows two inequalities, one for each direction, and then counts the flows: every $s$–$t$ cut is a cut (so $\lambda(G)$ is the smaller number), and the minimum cut separates $s$ from some $t$ (so the minimum over $t$ is reached).

Part 1, the easy direction: $\lambda(G)$ is at most every $\lambda(G; s, t)$.

:::: walkthrough {for=prop:global-cut-flows}
```graph id=a03-gmc-lower widget=stepper
caption: The network $G$ from the lecture; the numbers are capacities. A cut that separates $s$ from $t$ is compared with the minimum cut of $G$.
intent: New (the lecture's p29 has no example). The lecture's running example network (algorithms/03 p5, p9–13), same vertex names and capacities; the positions are changed to fit the figure box.
layout: fixed
a @(0, 0.45); b @(0.85, 0.65); c @(2.65, 0.65); d @(3.6, -0.75); e @(2.45, -0.3); f @(0.4, -0.75)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
step: Fix $s$ and take any other vertex $t$.
class source: a
class sink: f
mark s: a
mark t: f
step: A minimum $s$–$t$ cut $\delta(U)$.
class color1: a b
class bold: a--f b--f b--c b--e
mark U: a b
step: $\delta(U)$ is a cut.
unclass bold: a--f b--f b--c b--e
class cut: a--f b--f b--c b--e
step: The minimum cut is at most as expensive.
unclass cut: a--f b--f b--c b--e
unclass color1: a b
class color2: c d e
class cut: b--c b--e c--f f--e f--d
mark M: c d e
```

::: step
Let $s$ be the fixed vertex of the statement and $t$ any other vertex. We show $\lambda(G) \le \lambda(G; s, t)$ for this $t$. We need $t$ different from $s$, because an $s$–$t$ cut separates two different vertices. Here: [[fig:a03-gmc-lower#s|$s$]] is $a$ and [[fig:a03-gmc-lower#t|$t$]] is $f$.
:::

::: step
Take a minimum $s$–$t$ cut. By [[def:undirected-cut|the definition of an $s$–$t$ cut]] it is $\delta(U)$ for a set $U$ that contains exactly one of $s$ and $t$. Its capacity is $\lambda(G; s, t)$. Here: [[fig:a03-gmc-lower#U|$U$]] consists of $a$ and $b$, and the thick edges have capacities 8, 3, 4 and 2, together 17.
:::

::: step
We check that $\delta(U)$ is a cut in the sense of [[def:global-min-cut|the definition]], that is $\emptyset \ne U \ne V$. The set $U$ is not empty, because it contains $s$ or $t$. It is not all of $V$, because it misses the other one. Here: $U$ contains $a$ but not $f$.
:::

::: step
A minimum cut has the least capacity of all cuts, and $\delta(U)$ is a cut. So the minimum capacity is at most that of $\delta(U)$, which is $\lambda(G; s, t)$. Here: [[fig:a03-gmc-lower#M|the minimum cut]] has capacity 13, against 17. As $t$ was arbitrary, this holds for every $t$ other than $s$.
:::
::::

Part 2, the hard direction: some $t$ reaches $\lambda(G)$.

:::: walkthrough {for=prop:global-cut-flows}
```graph id=a03-gmc-upper widget=stepper
caption: The network $G$ from the lecture; the numbers are capacities. The minimum cut of $G$ separates $s$ from some vertex $t$.
intent: New (the lecture's p29 has no example). Same network and positions as a03-gmc-lower.
layout: fixed
a @(0, 0.45); b @(0.85, 0.65); c @(2.65, 0.65); d @(3.6, -0.75); e @(2.45, -0.3); f @(0.4, -0.75)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
step: A minimum cut $\delta(S)$.
class color1: c d e
class cut: b--c b--e c--f f--e f--d
mark S: c d e
step: The far side of $s$.
class source: a
mark s: a
mark far: c d e
step: Pick $t$ on the far side.
class sink: d
mark t: d
step: $\delta(S)$ is an $s$–$t$ cut.
class bold: b--c b--e c--f f--e f--d
step: The minimum over all $t$.
class highlight: c e
```

::: step
Take a minimum cut of $G$, written $\delta(S)$ with $\emptyset \ne S \ne V$ as in [[def:global-min-cut|the definition]]. Its capacity is $\lambda(G)$. Here: [[fig:a03-gmc-upper#S|$S$]] consists of $c$, $d$ and $e$, and the capacity is 13.
:::

::: step
The vertex $s$ lies in $S$ or outside $S$. The far side is the one of $S$ and its complement that does not contain $s$. It is not empty: here we use that $S$ is neither empty nor all of $V$. Here: [[fig:a03-gmc-upper#s|$s$]] is $a$ and lies outside $S$, so [[fig:a03-gmc-upper#far|the far side]] is $S$.
:::

::: step
Pick a vertex $t$ in the far side. Then $t$ is different from $s$, and exactly one of $s$ and $t$ lies in $S$, because they are on different sides. Here: [[fig:a03-gmc-upper#t|$t$]] is $d$; $c$ or $e$ would work as well.
:::

::: step
By the last step $\delta(S)$ is an $s$–$t$ cut ([[def:undirected-cut|definition]]). The minimum over all $s$–$t$ cuts is at most the capacity of any one of them, so $\lambda(G; s, t) \le c(\delta(S))$. The right side is $\lambda(G)$ by the choice of $S$. Here: both sides are 13.
:::

::: step
The minimum over all $t$ is at most the value for our $t$, hence at most $\lambda(G)$. By Part 1 it is also at least $\lambda(G)$. So they are equal: $\lambda(G) = \min_{t \ne s} \lambda(G; s, t)$. Here: the values for $b$ to $f$ are 18, 13, 13, 13, 17; the minimum 13 is reached at $c$, $d$, $e$.
:::
::::

Part 3, the running time: one maximum flow for each $t$.

:::: walkthrough {for=prop:global-cut-flows}
```graph id=a03-gmc-time widget=stepper
caption: The network $G$ from the lecture; the numbers are capacities. Each edge is replaced by two opposite arcs; one edge is drawn that way.
intent: New (the lecture's p29 has no example). Same network and positions as a03-gmc-lower; the arcs construction is that of algorithms/03 p3–4.
type: mixed
layout: fixed
a @(0, 0.45); b @(0.85, 0.65); c @(2.65, 0.65); d @(3.6, -0.75); e @(2.45, -0.3); f @(0.4, -0.75)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
step: Each edge becomes two opposite arcs.
remove a--f
a -> f [c=8]; f -> a [c=8]
mark af: a->f f->a
step: Arcs that leave $U$ match the edges of $\delta(U)$.
class color1: a b
class bold: a->f
class muted: f->a
mark U: a b
step: Every $s$–$t$ cut arises this way.
class color2: c d e f
mark W: c d e f
step: One flow for each $t$ other than $s$.
unclass color1: a b
unclass color2: c d e f
unclass bold: a->f
unclass muted: f->a
class source: a
class sink: b c d e f
step: The time of $n - 1$ flows.
unclass sink: b c d e f
class visited: b c d e f
```

::: step
A flow algorithm needs a flow network. Replace every edge $uv$ by an arc from $u$ to $v$ and an arc from $v$ to $u$, each of capacity $c(uv)$ ([[algorithms/gomory-hu/cuts-in-undirected-networks|the construction for undirected networks]]). Here: the edge [[fig:a03-gmc-time#af|$af$]] of capacity 8 becomes two arcs of capacity 8. We draw only this one; the others are replaced the same way.
:::

::: step
Let $U$ contain $s$ but not $t$. The arcs that leave $U$ are exactly one arc for each edge of $\delta(U)$, with the capacity of that edge. So the directed cut given by $U$ has capacity $c(\delta(U))$. Here: [[fig:a03-gmc-time#U|$U$]] consists of $a$ and $b$; the arc from $a$ to $f$ leaves it, the arc from $f$ to $a$ does not.
:::

::: step
Every $s$–$t$ cut comes from such a $U$: take the one of the two sets with $s$; a set and its complement give the same edges. So a minimum directed $s$–$t$ cut has capacity $\lambda(G; s, t)$, and by [[thm:maxflow-mincut|the max-flow min-cut theorem]] one maximum-flow computation returns it. Here: [[fig:a03-gmc-time#W|the complement of $U$]] gives the same edges.
:::

::: step
We need one such computation for each vertex $t$ other than $s$. The fixed vertex $s$ is the same in all of them, so there are $n - 1$ computations. Here: $n$ is 6, and $t$ runs over $b$, $c$, $d$, $e$ and $f$, so there are 5 computations.
:::

::: step
Each computation takes time $\O(n^3)$ with MPM ([[thm:mpm-time]]); the network has the vertices of $G$, so $n$ is the same. Altogether the $n - 1$ computations cost $\O(n^4)$, because $n - 1$ is less than $n$. Taking the minimum of the $n - 1$ values costs only linear time more. Here: 5 runs of MPM.
:::
::::

::: proof
Every $s$–$t$ cut is a cut, so $\lambda(G) \le \lambda(G; s, t)$ for all $t$. Conversely, let $\delta(S)$ be a minimum cut; as $\emptyset \ne S \ne V$,
it separates $s$ from some vertex $t$ (any vertex on the other side), so $\lambda(G; s, t) \le \lambda(G)$. Each $\lambda(G; s, t)$ is one maximum-flow
computation in the network with two opposite arcs per edge (see [[def:undirected-cut]]); with MPM ([[thm:mpm-time]]), $\O(n^3)$ each.
:::

::: intuition
Whatever the minimum cut is, the fixed vertex $s$ lies on one side and some $t$ on the other; trying every $t$ cannot miss it. Example: in
[[fig:a03-network]] with $s = a$, the values $f(a, t)$ for $t = b, c, d, e, f$ are $18, 13, 13, 13, 17$, and their minimum is $\lambda(G) = 13$.
A [[def:gomory-hu-tree|Gomory–Hu tree]] gives the same with its $n - 1$ flows: $\lambda(G)$ is its lightest edge ([[exr:a03-lambda-from-tree]]).
:::

The rest of the lecture finds $\lambda(G)$ **without** maximum flows.
