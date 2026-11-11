---
title: "Proving the edge version"
course: theory
chapter: menger
order: 6
lectures: [t05]
stage: split
status: draft
---

The lecture introduces the following notion, a set of arcs that "flows" from $s$ to $t$ with one unit on each arc.

::: definition {#def:d-flow title="d-flow" defines="d-flow" source="theory/2026-10-13 p6"}
A set $F \subseteq E(G)$ of arcs of a directed multigraph is an **$s$–$t$ d-flow** if, counting only arcs of $F$, the in-degree of $s$ is $0$,
the out-degree of $t$ is $0$, and every other vertex has in-degree equal to its out-degree. The **size** of $F$ is the out-degree of $s$ in
$F$.
:::

::: intuition
A d-flow is a [[def:flow|flow]] in which every arc carries $0$ or $1$ units: $F$ is the set of arcs carrying one unit, the
balance condition is flow conservation, and the size is the value of the flow. Example: a directed $s$–$t$ path is a d-flow of
size $1$, and the union of $k$ edge-disjoint ones is a d-flow of size $k$. A directed [[def:cycle-graph|cycle]] avoiding $s$ and
$t$ is a d-flow of size $0$, so a d-flow need not be a union of paths; it only contains them ([[claim:d-flow-paths]]).
Non-example: a directed cycle through $s$, since then an arc of $F$ enters $s$.
:::

The size is also the in-degree of $t$ in $F$: summing (out-degree $-$ in-degree) over all vertices counts every arc once with $+1$ and once
with $-1$, so the total is $0$; all vertices except $s$ and $t$ contribute $0$, so $d^+_F(s) - 0 + 0 - d^-_F(t) = 0$.

```graph id=t05-d-flow widget=figure
caption: A d-flow $F$ of size 3 (bold arcs): balanced at every vertex except $s$ (3 out) and $t$ (3 in).
intent: Transcription of the lecture example of a d-flow; non-flow arcs muted.
type: directed
layout: layered
s [class=source]; t [class=sink]
s -> a [class=path]; s -> b [class=path]; s -> c [class=path]
a -> d [class=path]; b -> d [class=path]; d -> t [class=path]; d -> e [class=path]; c -> e [class=muted]
e -> t [class=path]; c -> t [class=path]; a -> b [class=muted]; e -> c [class=muted]
```

::: claim {#claim:d-flow-paths title="d-flows contain disjoint paths" source="theory/2026-10-13 p6"}
If $F$ is an $s$–$t$ d-flow of size $k$, then $F$ contains $k$ edge-disjoint directed $s$–$t$ paths.
:::

::: proof
By induction on $k$; for $k = 0$ there is nothing to show. Let $k \ge 1$. Follow a [[def:walk|walk]] from $s$ along arcs of $F$, never using an arc twice, as long
as possible. Whenever the walk is at a vertex $v \ne s, t$, it has entered $v$ one more time than it has left it, so it has used one more
$F$-arc into $v$ than out of $v$; as in- and out-degree of $v$ in $F$ are equal, an unused out-arc of $v$ remains and the walk can continue.
The walk never returns to $s$ (no $F$-arc enters $s$). Since $F$ is finite, the walk stops, and it can only stop at $t$. Shortcutting all
closed parts (as in [[claim:shortest-walk-path]]) gives a directed $s$–$t$ path $P$ with $E(P) \subseteq F$.

Now $F - E(P)$ is an $s$–$t$ d-flow of size $k - 1$: $s$ loses one out-arc, $t$ loses one in-arc, and every inner vertex of $P$ loses one
in-arc and one out-arc. By induction it contains $k - 1$ edge-disjoint $s$–$t$ paths, which are also edge-disjoint from $P$.
:::

So it suffices to prove: **if $G$ has no directed $s$–$t$ edge cut of size $\le k - 1$, then $G$ has an $s$–$t$ d-flow of size $k$.** The lecture
stops here; we complete the argument with the **augmenting path** method (which is exactly [[alg:ford-fulkerson]] with unit
capacities, see [[algorithms/02-maximum-flow]]; the augmenting paths below are the [[def:augmenting-path|augmenting paths]] of the
residual network of $F$).

:::: proof {title="Proof of B (completed beyond the lecture)" for=thm:menger-directed}
Let $F$ be an $s$–$t$ d-flow of maximum size $\ell$ (the empty set is a d-flow, so one exists). We show that there is an $s$–$t$ edge cut of size
$\ell$; by assumption then $\ell \ge k$, and $F$ contains $k$ edge-disjoint paths by [[claim:d-flow-paths]].

Call a sequence $s = x_0, x_1, \dots, x_r$ of distinct vertices an **augmenting path** if every step $x_{i-1} \to x_i$ is
- **forward**: along an arc $(x_{i-1}, x_i) \notin F$, or
- **backward**: against an arc $(x_i, x_{i-1}) \in F$.

Let $R$ be the set of vertices reachable from $s$ by augmenting paths.

*Case $t \in R$.* Take an augmenting path from $s$ to $t$ and let $F'$ be $F$ with all forward arcs of the path added and all backward arcs
removed. Check the balance at each vertex of the path:

- at an inner vertex $x_i$, the step into $x_i$ adds an in-arc (forward) or removes an out-arc (backward), and the step out of $x_i$ adds an
  out-arc (forward) or removes an in-arc (backward); in all four combinations, in-degree minus out-degree is unchanged;
- the first step leaves $s$ forward (a backward step would need an $F$-arc into $s$), so the out-degree of $s$ grows by one; the last step enters
  $t$ forward (a backward step would need an $F$-arc out of $t$); $s$ and $t$ are not visited otherwise.

So $F'$ is an $s$–$t$ d-flow of size $\ell + 1$, contradicting maximality. Hence this case does not occur.

*Case $t \notin R$.* Let $D$ be the set of arcs from $R$ to $V(G) \setminus R$. Every $s$–$t$ path starts in $R$ and ends outside, so it uses an arc
of $D$: $D$ is an $s$–$t$ edge cut. Moreover:

- every arc $(u, v) \in D$ lies in $F$ (otherwise $v$ would be reachable by a forward step), and
- no arc from $V(G) \setminus R$ into $R$ lies in $F$ (otherwise its tail would be reachable by a backward step).

Sum (out-degree $-$ in-degree in $F$) over $u \in R$. Each vertex of $R$ other than $s$ contributes $0$ ($t \notin R$), and $s$ contributes $\ell$.
Arcs of $F$ with both ends in $R$ contribute $+1 - 1 = 0$, so the sum also equals (number of $F$-arcs leaving $R$) $-$ (number of $F$-arcs entering
$R$) $= \abs{D} - 0$. Hence $\abs{D} = \ell$, and $D$ is an $s$–$t$ edge cut of size $\ell$.
::::

```graph id=t05-augmenting-player widget=player
caption: The augmenting-path proof as an algorithm: Ford–Fulkerson with all capacities 1 finds a maximum d-flow and, at the end, the cut $D$ leaving the reachable set $R$.
intent: Connect the proof of Menger B with the flow algorithm of the algorithms course. Unit capacities.
type: directed
layout: layered
algo: ford-fulkerson
params: source=s sink=t
s [class=source]; t [class=sink]
s -> a [c=1]; s -> b [c=1]; s -> c [c=1]; a -> d [c=1]; b -> d [c=1]; c -> e [c=1]; d -> t [c=1]; d -> e [c=1]; e -> t [c=1]; a -> b [c=1]
```
