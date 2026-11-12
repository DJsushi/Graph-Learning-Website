---
title: "Finding a blocking flow"
course: algorithms
chapter: fast-flows
order: 5
lectures: [a02]
stage: split
status: draft
---

The **input** is the [[def:residual-network|residual graph]] $G_f$ and its level graph $L$. The **idea** is a modified depth-first search: start at $s$ and advance along edges of $L$ until either

- (a) we reach $t$: augment along the path found, update $L$ (remove saturated edges), and start advancing from $s$ again; or
- (b) we get stuck at some vertex $v$ (no outgoing edges in $L$): remove $v$ from $L$ and **retreat** to the previous vertex.

::: algorithm {#alg:dinic-blocking title="Finding a blocking flow (Dinic)" source="algorithms/02 p43"}
```pseudo
v ← s                                                   // the current vertex       @init
P ← []                                                  // path being constructed
while true do                                           // @loop
    if v = t then                                       // @reached
        AUGMENT(f, c, P)                                // augment                  @augment
        remove saturated edges from L                   // @remove
        v ← s; P ← []                                   // @restart
    else if there exists (v, w) ∈ E(L) then             // @canadvance
        append (v, w) to P; v ← w                       // advance                  @advance
    else
        if v = s then break                             // @stop
        remove v and its incident edges from L          // retreat                  @retreat
        remove the last edge (u, v) from P; v ← u       // @back
```
:::

::: intuition {for=alg:dinic-blocking}
A depth-first search that never looks at anything twice in vain: a full edge is deleted when it is saturated, and a dead end is deleted when we retreat from it,
so later searches skip both. Since $L$ only has edges going one level up, every advance gets one step closer to $t$ and the search cannot run in circles.
Example: in the first phase on [[fig:a02-blocking-flow]], the search advances $s \to p \to r \to t$, augments by $3$, deletes $(r, t)$, then advances
$s \to p \to r$, finds no edge of $L$ leaving $r$, deletes $r$ and retreats to $p$, deletes $p$ as well, and finally finds $s \to q \to x \to t$.
:::

::: proposition {#prop:dinic-blocking-time title="A blocking flow in time $\O(mn)$" source="algorithms/02 p44"}
The procedure finds a blocking flow in $L$ in time $\O(mn)$.
:::

::: intuition
Charge every step to something that disappears: each augmentation deletes an edge, each retreat deletes a vertex, and between two such events there are at
most $n$ advances, because a path in $L$ has at most $n - 1$ edges. So the total work is about $(m + n) \cdot n$. Compare: running a fresh search from $s$
for every path would cost $\O(m)$ per path instead of $\O(n)$.
:::

::: proof
*Correctness:* edges and vertices are removed from $L$ only when they cannot be on any $s$–$t$ path of unsaturated edges of $L$ any more (a saturated edge; a vertex from which
$t$ cannot be reached). When the loop stops at $s$, no $s$–$t$ path of unsaturated edges remains in $L$, so the flow is blocking.

*Time:* there are at most $m$ augmentation steps, since each deletes at least one edge from $L$; and at most $n$ retreat steps, since each deletes a vertex. Each advance step
moves one level further, so after at most $n$ advance steps we augment or retreat; hence there are at most $(m + n) \cdot n = \O(mn)$ advance steps. Augment and retreat can be
implemented in $\O(n)$ (the path has at most $n$ edges), advance in $\O(1)$. In total $\O(mn)$.
:::

::: theorem {#thm:dinic title="Running time of Dinic's algorithm" source="algorithms/02 p45"}
Dinic's algorithm runs in time $\O(mn^2)$.
:::

::: intuition
At most $n$ phases times $\O(mn)$ per blocking flow. Compared with Edmonds–Karp's $\O(m^2 n)$, a factor $m$ becomes a factor $n$, which matters for dense
networks where $m$ is close to $n^2$. Like Edmonds–Karp, the bound does not depend on the capacities.
:::

::: proof
Finding a blocking flow takes $\O(mn)$, all other operations of a phase take $\O(m)$, and by [[lem:dinic-phases]] there are at most $n$ phases.
:::
