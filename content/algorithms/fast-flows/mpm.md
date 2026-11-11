---
title: "The MPM algorithm"
course: algorithms
chapter: fast-flows
order: 6
lectures: [a02]
stage: split
status: draft
---

::: theorem {#thm:mpm title="MPM" source="algorithms/02 p47"}
**(Malhotra, Pramodh-Kumar, Maheshwari 1978)** There is an algorithm which solves the [[def:flow-cut|MaxFlow]] problem in time $\O(n^3)$.
:::

::: intuition
$\O(n^3)$ beats Dinic's $\O(mn^2)$ whenever $m$ is much larger than $n$, and it does not depend on $m$ at all: for a dense network with $m \approx n^2$ edges, Dinic's bound
is $\O(n^4)$. The improvement is entirely in the inner step, the blocking flow; the outer loop is Dinic's.
:::

Dinic needs time $\O(mn)$ per phase to construct a [[def:blocking-flow|blocking flow]]. The "three Indians" algorithm keeps the phase structure of Dinic (at most $n$
phases, each computing a blocking [[def:flow|flow]] in the [[def:level-graph|level graph]]), but computes the blocking flow in $\O(n^2)$, using Fibonacci heaps.

::: definition {#def:vertex-capacity title="Vertex capacity" defines="vertex capacity, throughput" source="algorithms/02 p49"}
The **capacity of a vertex** $v$ is
$$c(v) = \min\Bigl(\sum_{(u,v) \in E} c(u, v),\ \sum_{(v,w) \in E} c(v, w)\Bigr),$$
the maximum flow that can pass through $v$. (For $s$ and $t$ only the outgoing, resp. incoming, sum is used.) The same definition applies to residual capacities $c_f$.
:::

::: intuition
A vertex is a junction: it cannot pass on more than arrives through its incoming edges, nor more than its outgoing edges can take away. The smaller of the two
sums is its throughput. Example: in [[fig:a02-network]], $a$ has incoming capacity $10$ and outgoing capacity $2 + 4 + 8 = 14$, so $c(a) = 10$; $d$ has
incoming $8 + 9 = 17$ and outgoing $9 + 10 = 19$, so $c(d) = 17$.
:::

::: pitfall
Here $c(v)$ is **computed** from the [[def:flow-network|edge capacities]]; it is not an extra constraint. A network in which vertices have their own prescribed
capacities is a different problem ([[exr:a02-vertex-capacities]]). It is reduced to edge capacities by splitting each vertex $v$ into $v^-$ and $v^+$, the
same trick that derives the vertex version A of Menger's theorem from the edge version B ([[thm:menger-directed]]).
:::

::: algorithm {#alg:mpm title="Finding a blocking flow (MPM)" source="algorithms/02 p50"}
**Input:** the [[def:residual-network|residual graph]] $G_f$ and its level graph $L$. **Initialization:** if $t$ does not appear in $L$, we are finished; remove all vertices that are not on an $s$–$t$ path in
$L$; compute the vertex capacities.

```pseudo
repeat                                                  // @loop
    find a vertex v of minimal capacity d               // @min
    push d units of flow from v towards the sink t      // @push
    pull d units of flow from the source s to v         // @pull
    erase v together with its incident edges            // @erase
    update the capacities of v's former neighbours      // @update
until a blocking flow is found                          // @until
```
:::

**Pushing the flow:** saturate the outgoing edges of $v \in L_i$ in order (one edge may be saturated only partially), remove all edges saturated in this step, and update the
capacity of $v$; then repeat with each vertex in layer $L_{i+1}$ which has received some flow from $v$, and so on with the following layers. **Pulling** is the same process
backwards along incoming edges, towards $s$.

It is always possible to push all $d$ units through every vertex on the way, because $v$ was chosen with **minimal** capacity: every vertex can pass at least $d$ units, and since
the flow moves layer by layer, each vertex receives at most $d$ units in this push. The extra flow from $v$ eventually reaches $t$. Similarly for pulling. After this, $v$ has
either all its incoming or all its outgoing edges saturated, so it can be erased.

::: intuition {for=alg:mpm}
Instead of searching for paths, MPM works with whole vertices. The vertex $v$ with the smallest throughput $d$ is the tightest spot of the level graph, so $d$ units
can certainly be routed through it to $t$ and from $s$ without overloading any other vertex. After that, $v$ is full and disappears, and each iteration removes
a vertex. Example: in the level graph of [[fig:a02-network]] at $f = 0$ ($L_1 = \set{a, b}$, $L_2 = \set{c, d}$; the edges $(a, b)$ and $(d, c)$ are dropped),
the throughputs are $c(a) = 10$, $c(b) = 9$, $c(c) = 4$, $c(d) = \min(17, 10) = 10$ (and $20$ for $s$ and $t$); MPM starts with $c$ and sends $4$ units along $s \to a \to c \to t$.
:::

::: pitfall
The vertex of minimal throughput must be chosen afresh in every iteration, with the throughputs **updated**: pushing and pulling lowers the throughput of
other vertices. Starting with a vertex that is not of minimal throughput can get stuck, as a later vertex on the way may not be able to pass all $d$ units.
:::

::: proposition {#prop:mpm-time title="A blocking flow in time $\O(n^2)$" source="algorithms/02 p52"}
MPM finds a blocking flow in time $\O(n^2)$ (with Fibonacci heaps storing vertices by capacity).
:::

::: intuition
There are fewer than $n$ iterations, one per erased vertex. A fully saturated edge is deleted once and for all, so those cost $\O(m)$ altogether; the remaining work
per iteration is at most one partially used edge per vertex, $\O(n)$ per iteration and $\O(n^2)$ in total. Dinic's search instead may walk the same path prefix
again for every augmentation, which is where its extra factor comes from.
:::

::: proof
Initialization (vertex capacities etc.) takes $\O(m)$. Each iteration deletes at least one vertex, so there are at most $n - 1$ iterations. Over all iterations: finding and deleting
vertices of minimum capacity takes $\O(n \log n)$ (`EXTRACT-MIN` in $\O(\log n)$); deleting fully saturated edges takes $\O(m)$ in total (each edge is deleted once); handling the
partial saturations takes $\O(n^2)$: during a single push (pull) there is at most one partially saturated outgoing (incoming) edge per vertex, so $\O(1)$ per vertex and iteration,
and the resulting capacity decreases are handled by $\O(1)$ `DECREASE-KEY` operations. Since $m \le n^2$, the total is $\O(n^2)$.
:::

::: theorem {#thm:mpm-time title="Running time of MPM" source="algorithms/02 p53"}
The MPM algorithm runs in time $\O(n^3)$.
:::

::: intuition
The same count as for Dinic ([[thm:dinic]]) with a cheaper inner step: at most $n$ phases, each a blocking flow in $\O(n^2)$ instead of $\O(mn)$.
This proves [[thm:mpm]].
:::

::: proof
A blocking flow takes $\O(n^2)$, the other operations of a phase $\O(m) \subseteq \O(n^2)$, and there are at most $n$ phases, as for Dinic.
:::

```graph id=a02-mpm-player widget=player
caption: MPM: in each phase, repeatedly pick the vertex of minimal throughput, push its capacity to $t$ and pull it from $s$.
intent: Algorithm player; vertex labels show current vertex capacities.
type: directed
algo: mpm
params: source=s sink=t
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, -1); c @(3, 1); d @(3, -1); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=6]; c -> t [c=10]; d -> t [c=10]
```
