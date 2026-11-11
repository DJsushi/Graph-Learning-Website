---
title: "Dinic's algorithm"
course: algorithms
chapter: fast-flows
order: 4
lectures: [a02]
stage: split
status: draft
---

**Idea (Dinitz 1970):** saturate **all** shortest $s$–$t$ paths of $G_f$ at once. The algorithm actually predates Edmonds–Karp; the version presented here is due to Even (1974).
We need to find all shortest $s$–$t$ paths efficiently, and the [[def:level-graph|level graph]] does exactly that.

::: definition {#def:blocking-flow title="Blocking flow" defines="blocking flow" source="algorithms/02 p36"}
A [[def:flow|flow]] $f$ is **blocking** iff every $s$–$t$ path in $G$ contains at least one saturated edge.
:::

::: intuition
A blocking flow is one that cannot be increased **without undoing** anything: every route from $s$ to $t$ in $G$ is full somewhere. It is what a greedy
procedure that only pushes forward ends with. Example: in [[fig:a02-blocking-flow]], the paths $s\,p\,r\,t$, $s\,p\,r\,q\,x\,t$ and $s\,q\,x\,t$ each contain
$(p, r)$ or $(q, x)$, both saturated, so the flow of value $5$ is blocking; yet the maximum is $8$.
:::

Every maximum flow is a blocking flow (otherwise some path has [[def:residual-network|residual capacity]] on all its edges and is augmenting), but not
every blocking flow is a maximum flow: a blocking flow never "pushes flow back", so it may get stuck.

::: pitfall
Blocking does not mean maximum: a blocking flow may still admit augmenting paths, which then use reverse edges. In Dinic's algorithm, a
blocking flow is computed in the level graph $L$, and "every path" means every $s$–$t$ path **of $L$**, not of $G_f$.
:::

```graph id=a02-blocking-flow widget=figure
caption: A blocking flow of value 5 that is not maximum: every $s$–$t$ path contains a saturated edge, but the maximum flow is 8.
intent: Transcription of the lecture example. The maximum flow uses s→p→r→t (3) and s→q→x→t together with p→r→q (5 through q→x).
type: directed
layout: fixed
s [class=source] @(0, 0); p @(1.5, 1); q @(1.5, 0); r @(3, 1); x @(3, 0); t [class=sink] @(4.5, 0)
s -> p [f=5 c=9]; s -> q [f=0 c=4]; p -> r [f=5 c=5 class=saturated]; r -> q [f=5 c=9]; r -> t [f=0 c=3]; q -> x [f=5 c=5 class=saturated]; x -> t [f=5 c=9]
```

::: algorithm {#alg:dinic title="Dinic's algorithm" source="algorithms/02 p37"}
```pseudo
DINIC(G, s, t, c):
    foreach e ∈ E do f(e) ← 0                  // @init
    G_f ← the residual graph for f              // @residual
    while there is an augmenting path in G_f do // one phase         @phase
        L ← the level graph of G_f              // @level
        f' ← blocking flow in L                 // @blocking
        f ← f augmented with f'                 // @augment
        update G_f                              // @update
    return f                                    // @return
```
:::

::: intuition {for=alg:dinic}
Edmonds–Karp augments along shortest paths one at a time and recomputes BFS after each. Dinic computes the level graph once per phase and then saturates
**all** shortest augmenting paths together with one blocking flow, so one phase does the work of many Edmonds–Karp rounds of the same length. Example: on
the lecture network ([[fig:a02-dinic-player]]), two phases suffice, giving values $14$ and $19$.
:::

::: lemma {#lem:dinic-phases title="Each phase increases the distance" extra=true}
After a phase of Dinic's algorithm, the length of the shortest [[def:augmenting-path|augmenting path]] strictly increases. Hence there are at most $n - 1$ (in particular at most $n$) phases.
:::
<!-- REVIEW: n − 1 added (distance takes values 1..n−1); lecture states n. -->

::: intuition
The blocking flow kills every shortest augmenting path of the current length $k$, and as in Edmonds–Karp, augmenting creates only edges going down a level, so
no new path of length $\le k$ can appear. Each phase therefore pushes the distance from $s$ to $t$ up by at least one, and the distance lies between $1$
and $n - 1$. Example: in [[fig:a02-blocking-flow]], with $f = 0$ the only shortest paths are $s\,p\,r\,t$ and $s\,q\,x\,t$ (length $3$); the
blocking flow of the first phase sends $3$ and $4$ units along them and saturates $(r, t)$ and $(s, q)$, and the second phase uses the longer
path $s\,p\,r\,q\,x\,t$ (length $5$, $1$ more unit), reaching the maximum $8$.
:::

::: proof
Let $k$ be the distance from $s$ to $t$ at the start of the phase, $L$ the level graph, and $f'$ the blocking flow in $L$. Augmenting $f$ by $f'$ changes $G_f$ only by
deleting saturated edges of $L$ and adding reverses of edges of $L$, which go one level down. As in [[lem:ek-phase]], every $s$–$t$ path of length at most $k$ in the new
residual graph would use only edges going up one level, i.e. edges of $L$ that were not saturated by $f'$. Such a path would be an $s$–$t$ path in $L$ without a saturated
edge, contradicting that $f'$ is blocking. So the new distance is larger than $k$. Distances lie between $1$ and $n - 1$, so there are at most $n - 1$ phases.
:::

```graph id=a02-dinic-player widget=player
caption: Dinic's algorithm on the lecture example: each phase computes the level graph of the residual network and a blocking flow in it. The flow values are 14 after phase 1 and 19 after phase 2.
intent: Algorithm player with level graph shown each phase; reproduces the lecture example (|f1| = 14, |f2| = 19).
type: directed
algo: dinic
params: source=s sink=t
show: pseudocode state residual
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, -1); c @(3, 1); d @(3, -1); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=6]; c -> t [c=10]; d -> t [c=10]
```
