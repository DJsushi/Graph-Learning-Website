---
title: Maximum flow
course: algorithms
lecture: 2
slug: a02
summary: Flow networks, cuts and the max-flow min-cut theorem, residual networks and augmenting paths, Ford–Fulkerson, Edmonds–Karp, level graphs and blocking flows (Dinic), the MPM algorithm, and unit-capacity networks with bipartite matchings.
prerequisites: [theory/05-connectivity-menger, algorithms/01-minimum-spanning-trees]
sources:
  - resources/graph-algorithms/02-flows.pdf
status: draft
---

How much water can be pumped from a source to a sink through a network of pipes of limited capacity? How many trains
can travel from one city to another per hour, how much data can be routed between two servers? These are **maximum
flow** problems. Their theory is beautiful (the max-flow min-cut theorem is a far-reaching generalization of Menger's
theorem, [[thm:menger-directed]]), and their algorithms are among the most widely used in combinatorial optimisation:
many problems that do not look like flows at all (matchings, scheduling, image segmentation, project selection) reduce
to them.

## Flow networks

::: definition {#def:flow-network title="Flow network" defines="flow network, source, sink, capacity" source="algorithms/02 p3"}
A **flow network** is a quadruple $(G, s, t, c)$ where

- $G = (V, E)$ is a directed graph,
- $s \in V$ is the **source**,
- $t \in V$ is the **sink**, $s \ne t$,
- $c : E \to \R^+$ is a **capacity** function.
:::

We assume that $G$ is connected (which implies $n + m = \O(m)$) and that there are no parallel edges. We also assume, as the
examples do, that no edge enters $s$ and no edge leaves $t$ (such edges could carry flow that does not count towards the
value, and they can be removed without changing the maximum flow value).

```graph id=a02-network widget=figure
caption: A flow network. Edge labels are capacities.
intent: The network from the lecture, used for the Ford–Fulkerson demo. Vertex names a..d are ours (unnamed on the slides).
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

::: definition {#def:flow title="Flow" defines="flow, capacity constraints, conservation, value of a flow" source="algorithms/02 p4"}
A **flow** is a function $f : E \to \R^+$ satisfying

- the **capacity constraints**: $\forall e \in E : 0 \le f(e) \le c(e)$,
- the **conservation constraints**: $\forall v \in V \setminus \set{s, t} : \displaystyle\sum_{(u,v) \in E} f(u, v) = \sum_{(v,w) \in E} f(v, w)$.

The **value** of a flow $f$ is $\abs{f} = \sum_{(s,v) \in E} f(s, v) = \sum_{(w,t) \in E} f(w, t)$.
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

**Applications of network flows** include disjoint paths and network connectivity, bipartite matchings, circulations with
upper and lower bounds, matrix rounding (census tabulation), airline scheduling, image segmentation, project selection
(maximum weight closure), open-pit mining, distributed computing, network intrusion detection, multi-camera scene
reconstruction, gene function prediction and quantitative food webs in ecology (see Ahuja, Magnanti, Orlin: *Network
Flows*, 1993).

## Cuts and the max-flow min-cut theorem

::: definition {#def:flow-cut title="s–t cut, capacity" defines="s-t cut, capacity of a cut, MaxFlow, MinCut" source="algorithms/02 p6"}
An **$s$–$t$ cut** in a flow network $(G, s, t, c)$ is a bipartition $S \cup T = V$ of the vertices such that $s \in S$ and $t \in T$.
The **capacity** of the cut is
$$\mathrm{cap}(S, T) = \sum_{(u,v) \in E,\ u \in S,\ v \in T} c(u, v).$$
**MaxFlow:** given a flow network, compute a maximum flow. **MinCut:** given a flow network, compute a minimum $s$–$t$ cut.
:::

Only edges from $S$ to $T$ count in the capacity; edges from $T$ back to $S$ do not. (These cuts are partitions of the vertex set,
while the edge cuts of [[def:st-cut]] are sets of edges; the edges from $S$ to $T$ of an $s$–$t$ cut form an edge cut.)

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

So **every flow value is at most every cut capacity** (weak duality). The theorem says that the bound is tight:

::: theorem {#thm:maxflow-mincut title="Max-flow min-cut theorem" aka="Ford–Fulkerson theorem" source="algorithms/02 p6"}
**(Ford, Fulkerson 1956)** In every flow network, the value of a maximum flow equals the capacity of a minimum $s$–$t$ cut.
:::

The proof is given below, after residual networks. (Historically, the problem was studied by Harris and Ross in 1955 for the U.S. Air Force, who
wanted to find the minimum cut of the Soviet railway network to Eastern Europe; the report was declassified in 1999.)

## Residual networks and augmenting paths

::: definition {#def:residual-network title="Residual network" defines="residual graph, residual capacity, residual network" source="algorithms/02 p10"}
The **residual network** for a flow $f$ consists of

1. the **residual graph** $G_f = (V, E_f)$, where $E_f$ contains, for each edge $e = (u, v) \in E$,
   - the edge $e = (u, v)$ if $f(e) < c(e)$, and
   - the **reverse** edge $e^R = (v, u)$ if $f(e) > 0$;
2. the **residual capacities**
$$c_f(e) = c(e) - f(e) \ \text{ for } e \in E_f \cap E, \qquad c_f(e^R) = f(e) \ \text{ for } e^R \in E_f.$$
:::

The residual capacity says how much more flow can be pushed along $e$ (forward), or how much of the existing flow on $e$ can be cancelled
(backward, along $e^R$).

```graph id=a02-residual-example widget=figure
caption: A flow of value 8 (left) and its residual network (right). Saturated edges disappear forward; edges with flow get a reverse edge.
intent: Transcription of the lecture's residual graph example.
type: directed
layout: fixed
layout-sync: true
panel: network $G$ with flow $f$
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [f=8 c=10]; s -> b [f=0 c=10]; a -> b [f=0 c=2]; a -> c [f=0 c=4]; a -> d [f=8 c=8]; b -> d [f=0 c=9]; d -> c [f=0 c=9]; c -> t [f=0 c=10]; d -> t [f=8 c=10]
panel: residual network $G_f$
edge-label: "{c}"
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=2]; a -> s [c=8 class=back bend=0.3]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; d -> a [c=8 class=back]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=2]; t -> d [c=8 class=back bend=0.3]
```

::: definition {#def:augmenting-path title="Augmenting path, bottleneck capacity" defines="augmenting path, bottleneck capacity" source="algorithms/02 p12"}
An **augmenting path** is a path $P$ from $s$ to $t$ in $G_f$. The **bottleneck capacity** $\delta$ of $P$ is the minimum residual capacity among the
edges of $P$.
:::

For an augmenting path $P$ with bottleneck capacity $\delta$, define
$$f'(e) = \begin{cases} f(e) + \delta & \text{if } e \in P, \\ f(e) - \delta & \text{if } e^R \in P, \\ f(e) & \text{otherwise.} \end{cases}$$

::: lemma {#lem:augment title="Augmenting increases the flow" source="algorithms/02 p12"}
$f'$ is a flow with $\abs{f'} = \abs{f} + \delta$.
:::

::: proof
*Capacities:* if $e \in P$, then $\delta \le c_f(e) = c(e) - f(e)$, so $f'(e) \le c(e)$; if $e^R \in P$, then $\delta \le c_f(e^R) = f(e)$, so $f'(e) \ge 0$. (Since $P$ is a path, it
visits every vertex at most once, so it cannot contain both $e = (u, v)$ and $e^R = (v, u)$; hence every $e \in E$ is changed at most once.)

*Conservation:* consider an inner vertex $v$ of $P$, entered by a residual edge and left by a residual edge. A forward residual edge $(u, v) = e$ increases the
inflow of $v$ by $\delta$; a backward residual edge $(u, v) = e^R$ with $e = (v, u)$ decreases the outflow of $v$ by $\delta$. Similarly, leaving $v$ forward increases
the outflow, and leaving backward decreases the inflow. In all four combinations, inflow $-$ outflow of $v$ is unchanged.

*Value:* the first edge of $P$ leaves $s$; since no edge of $G$ enters $s$, it is a forward edge $(s, v)$, so the outflow of $s$ grows by $\delta$, and $s$ is not visited
again.
:::

::: algorithm {#alg:augment title="AUGMENT" source="algorithms/02 p13"}
```pseudo
AUGMENT(f, c, P):
    b ← bottleneck capacity of P        // @bottleneck
    foreach edge e ∈ P do               // @loop
        if e ∈ E then                   // @forward
            f(e) ← f(e) + b             // @increase
        else                            // e = (e')^R for an edge e' ∈ E
            f(e^R) ← f(e^R) − b         // @decrease
    return f                            // @return
```
:::

Now we can prove the main theorem, together with the correctness criterion for augmenting path algorithms.

::: theorem {#thm:maxflow-characterisation title="Characterisation of maximum flows" extra=true}
For a flow $f$ the following are equivalent:

1. $f$ is a maximum flow;
2. $G_f$ contains no augmenting path;
3. there is an $s$–$t$ cut $(S, T)$ with $\abs{f} = \mathrm{cap}(S, T)$.
:::

::: proof
**1 ⇒ 2:** if there were an augmenting path, [[lem:augment]] would give a larger flow.

**2 ⇒ 3:** let $S$ be the set of vertices reachable from $s$ in $G_f$, and $T = V \setminus S$. Then $s \in S$ and $t \in T$ (no augmenting path). Every edge $(u, v) \in E$ with
$u \in S$, $v \in T$ is saturated, $f(u, v) = c(u, v)$, since otherwise $(u, v) \in E_f$ and $v$ would be reachable. Every edge $(u, v) \in E$ with $u \in T$, $v \in S$ has
$f(u, v) = 0$, since otherwise $(v, u) \in E_f$ and $u$ would be reachable. By [[lem:flow-across-cut]], $\abs{f} = \mathrm{cap}(S, T)$.

**3 ⇒ 1:** by [[lem:flow-across-cut]], every flow $g$ satisfies $\abs{g} \le \mathrm{cap}(S, T) = \abs{f}$.
:::

::: proof {title="Proof of the max-flow min-cut theorem" for=thm:maxflow-mincut}
A maximum flow exists: the set of flows is a compact subset of $\R^E$ (closed and bounded, defined by finitely many non-strict linear inequalities and equalities),
and $\abs{f}$ is a continuous function on it. For a maximum flow $f$, [[thm:maxflow-characterisation]] gives a cut with $\mathrm{cap}(S, T) = \abs{f}$, and by
[[lem:flow-across-cut]] no cut has smaller capacity. So the maximum flow value equals the minimum cut capacity.
:::

The proof of 2 ⇒ 3 is constructive: **after a maximum flow is found, a minimum cut is the set of vertices reachable from $s$ in the residual graph.**

## The Ford–Fulkerson algorithm

::: algorithm {#alg:ford-fulkerson title="Ford–Fulkerson algorithm (1955)" source="algorithms/02 p14"}
```pseudo
FORD-FULKERSON(G, s, t, c):
    foreach e ∈ E do f(e) ← 0                          // @init
    G_f ← the residual graph for f                      // @residual
    while there is an augmenting s–t path in G_f do      // @loop
        P ← an augmenting s–t path in G_f                // @path
        f ← AUGMENT(f, c, P)                             // @augment
        update G_f                                       // @update
    return f                                             // @return
```
:::

**Correctness:** the flow $f$ has a maximum value iff $G_f$ contains no augmenting path ([[thm:maxflow-characterisation]], which follows from the max-flow
min-cut theorem); so if the algorithm terminates, it returns a maximum flow.

```graph id=a02-ford-fulkerson-player widget=player
caption: Ford–Fulkerson on the lecture network. The residual network is shown next to the flow; at the end, the reachable set gives a minimum cut. (The player finds paths by depth-first search, so its sequence of augmentations may differ from the demo below; the final value 19 is the same.)
intent: Algorithm player; path choice by DFS (any augmenting path); show residual panel.
type: directed
algo: ford-fulkerson
params: source=s sink=t choice=dfs
show: pseudocode state residual
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

::: example {#ex:ford-fulkerson-demo title="The lecture demo" source="algorithms/02 p15–21"}
On the network above, starting from $f_0 = 0$:

1. Augment along $s \to a \to d \to t$ with bottleneck $8$ (edge $ad$): $\abs{f_1} = 8$.
2. In $G_{f_1}$, augment along $s \to a \to b \to d \to t$ with bottleneck $2$ (residual capacities $2, 2, 9, 2$): $\abs{f_2} = 10$.
3. In $G_{f_2}$, augment along $s \to b \to d \to c \to t$ with bottleneck $7$ (edge $bd$ has residual capacity $9 - 2 = 7$): $\abs{f_3} = 17$.
4. In $G_{f_3}$, augment along $s \to b \to a \to c \to t$, where $b \to a$ is the **reverse** of the edge $(a, b)$ carrying $2$ units; bottleneck $2$: $\abs{f_4} = 19$.
   The augmentation cancels the flow on $(a, b)$.

Now the vertices reachable from $s$ in the residual graph are $S = \set{s, b}$ ($(s, a)$ and $(b, d)$ are saturated, and $(a, b)$ carries no flow), so the algorithm
stops. The cut $(\set{s, b}, \set{a, c, d, t})$ has capacity $c(s, a) + c(b, d) = 10 + 9 = 19 = \abs{f_4}$, so the flow is maximum.
:::

::: theorem {#thm:ford-fulkerson-analysis title="Analysis of Ford–Fulkerson" source="algorithms/02 p23"}
Assume that all capacities are integers, and let $C$ be the highest capacity. Then Ford–Fulkerson terminates after at most $n \cdot C$ iterations and runs in time
$\O(nm \cdot C)$ (pseudo-polynomial). Moreover, the maximum flow it returns is **integral** (all $f(e)$ are integers).
:::

::: proof
By induction, all flow values and residual capacities stay integers (they start at $0$ and change by integral bottlenecks). Hence each iteration increases $\abs{f}$
by at least $1$. The maximum flow is bounded by the capacity of the cut $(\set{s}, V \setminus \set{s})$, which is at most $(n - 1) \cdot C$. So there are at most $n \cdot C$
iterations. Finding an augmenting path takes $\O(m)$ by BFS or DFS in $G_f$; augmentation takes $\O(n)$ and updating $G_f$ takes $\O(n)$ (only edges of $P$ change). So
each iteration takes $\O(m)$, and the total time is $\O(nm \cdot C)$.
:::

::: corollary {#cor:integrality title="Integrality theorem" extra=true}
If all capacities are integers, there is a maximum flow in which every $f(e)$ is an integer.
:::

### How to choose augmenting paths

```graph id=a02-bad-example widget=figure
caption: With bad choices, Ford–Fulkerson alternately augments along $s \to a \to b \to t$ and $s \to b \to a \to t$ (using the reverse of $ab$), increasing the flow by $1$ each time: $2 \cdot 10^6$ iterations instead of $2$.
intent: The classic example from the lecture showing the pseudo-polynomial behaviour.
type: directed
layout: fixed
s [class=source] @(1, 2); a @(0, 1); b @(2, 1); t [class=sink] @(1, 0)
s -> a [c=1000000 label="$10^6$"]; s -> b [c=1000000 label="$10^6$"]; a -> b [c=1]; a -> t [c=1000000 label="$10^6$"]; b -> t [c=1000000 label="$10^6$"]
```

Some choices of augmenting paths lead to exponential running times (the example above is exponential in the input size, since $C = 10^6$ is written with only about
$20$ bits), others lead to polynomial algorithms. **For real-valued capacities, Ford–Fulkerson is not even guaranteed to terminate** (and it may converge to a
non-maximum value). **Goal:** find an efficient way of choosing good augmenting paths.

## The Edmonds–Karp algorithm

Edmonds and Karp (1972) limit the number of steps of Ford–Fulkerson with a simple rule: **always choose a shortest augmenting path**, where the length of every edge is $1$.

::: algorithm {#alg:edmonds-karp title="Edmonds–Karp algorithm" source="algorithms/02 p25"}
```pseudo
EDMONDS-KARP(G, s, t, c):
    foreach e ∈ E do f(e) ← 0                                          // @init
    G_f ← the residual graph for f                                      // @residual
    while there is an augmenting s–t path in G_f do                      // @loop
        P ← the augmenting s–t path in G_f with the minimum number of edges // @path
        f ← AUGMENT(f, c, P)                                             // @augment
        update G_f                                                       // @update
    return f                                                             // @return
```
:::

Such a path can be found by BFS in $\O(m)$ ([[alg:bfs]]), and the remaining steps of an iteration take $\O(n)$, so each iteration takes $\O(m)$. **How many iterations are needed?**

```graph id=a02-edmonds-karp-player widget=player
caption: Edmonds–Karp: every augmenting path is a shortest path in the residual graph (found by BFS).
intent: Algorithm player; the state panel shows the BFS distances/levels.
type: directed
algo: edmonds-karp
params: source=s sink=t
show: pseudocode state residual
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

### Level graphs

::: definition {#def:level-graph title="Level graph" defines="level graph, layer" source="algorithms/02 p28–29"}
Let $L_i = \set{v \in V \mid \mathrm{dist}(s, v) = i}$ be the set of vertices at distance $i$ from $s$. The **level graph** $L_G = (V, E_G)$ is the subgraph of $G$ with
$$E_G = \set{(u, v) \in E \mid \exists i \in \N : u \in L_i \land v \in L_{i+1}}.$$
:::

```graph id=a02-level-graph widget=figure
caption: A graph $G$ and its level graph $L_G$: only edges going exactly one level further from $s$ are kept.
intent: Transcription of the lecture example.
type: directed
layout: fixed
layout-sync: true
panel: graph $G$
s @(0, 0); a @(1.5, 1); c @(1.5, 0); b @(3, 1); d @(3, 0); t @(4.5, 0)
s -> a; s -> c; a -> c; a -> b; a -> d; b -> c; c -> d; d -> b; b -> t; d -> t
panel: level graph $L_G$
s @(0, 0); a @(1.5, 1); c @(1.5, 0); b @(3, 1); d @(3, 0); t @(4.5, 0)
s -> a; s -> c; a -> b; a -> d; c -> d; b -> t; d -> t
```

**Properties.** The level graph can be computed in time $\O(m)$ by a modified BFS from $s$ that keeps all "forward" edges (those going exactly one level down). All
$s$–$v$ paths in $L_G$ have the same length, and every shortest $s$–$v$ path in $G$ is also a (shortest) $s$–$v$ path in $L_G$ and vice versa: $L_G$ is the **graph of all
shortest paths from $s$**. It is not necessarily a (BFS) tree.

Indeed, along any edge $(u, v)$ of $G$ we have $\mathrm{dist}(s, v) \le \mathrm{dist}(s, u) + 1$ (the levels can increase by at most one per edge), so a path from $s$ to $v \in L_k$ has
at least $k$ edges, with equality iff every edge goes up exactly one level.

### Analysis of Edmonds–Karp

Write $d_f(v)$ for the distance from $s$ to $v$ in $G_f$.

::: lemma {#lem:ek-monotone title="Distances never decrease" source="algorithms/02 p31"}
**(Lemma 1)** The length of the shortest augmenting path never decreases. More precisely, if $f'$ is obtained from $f$ by augmenting along a shortest augmenting path, then
$d_{f'}(v) \ge d_f(v)$ for all $v$.
:::

::: proof
Consider $G_f$ and its level graph $L$, with levels given by $d_f$. How does augmenting along a shortest path $P$ change $G_f$?

- An edge $e \in P$ may be deleted from $G_f$ (if it becomes saturated); this can only delete edges.
- For $e \in P$, the reverse edge $e^R$ may be added to $G_f$ (if it is not there yet). Since $P$ is a shortest path, its edges go from $L_i$ to $L_{i+1}$, so the newly created
  edges go from $L_{i+1}$ to $L_i$.

So every edge $(x, y)$ of $G_{f'}$ satisfies $d_f(y) \le d_f(x) + 1$: for old edges this is the BFS property, for new edges $d_f(y) = d_f(x) - 1$. Along any path of $G_{f'}$
from $s$, $d_f$ therefore grows by at most one per edge, so any $s$–$v$ path in $G_{f'}$ has at least $d_f(v)$ edges, i.e. $d_{f'}(v) \ge d_f(v)$. (Informally: the new edges point
backwards in the level graph and cannot create shortcuts.)
:::

::: lemma {#lem:ek-phase title="Augmentations of the same length" source="algorithms/02 p32"}
**(Lemma 2)** After at most $m$ shortest-path augmentations of length $k$, the length of the shortest augmenting path must increase.
:::

::: proof
Consider the moment when the shortest augmenting path first has length $k$, and fix the levels $d(v) = d_f(v)$ and the level graph $L$ of $G_f$ at this moment. As long as
the length stays $k$, the argument of Lemma 1 shows (by induction over the augmentations) that every residual edge $(x, y)$ satisfies $d(y) \le d(x) + 1$, and that the only
edges added are reverses of path edges, which go one level **down**. An augmenting path of length $k$ must go up exactly one level in each step, so it consists of edges going up
one level; these are never added, so they were present at the fixed moment, i.e. they are edges of $L$.

Each augmentation saturates at least one **bottleneck edge** $e = (u, v)$ of the path, $u \in L_i$, $v \in L_{i+1}$, which is removed from $G_f$, and it can never return (it
would have to be added as a reverse edge, but added edges go down). No new edges are added to $L$. The level graph $L$ has at most $m$ edges (for each $e \in E$ at most one
of $e, e^R$ goes up a level), so after at most $m$ such augmentations no path of length $k$ (or shorter, by Lemma 1) remains.
:::

::: theorem {#thm:edmonds-karp title="Running time of Edmonds–Karp" source="algorithms/02 p33"}
The Edmonds–Karp algorithm runs in time $\O(m^2 n)$.
:::

::: proof
There are $\O(m)$ augmentations for paths of each length $k$ (Lemma 2), and the length of an augmenting path is at most $n - 1$ and never decreases (Lemma 1). So there are
$\O(mn)$ iterations, each taking $\O(m)$. Note that this bound does not depend on the capacities, which may even be real numbers.
:::

## Dinic's algorithm

**Idea (Dinitz 1970):** saturate **all** shortest $s$–$t$ paths of $G_f$ at once. The algorithm actually predates Edmonds–Karp; the version presented here is due to Even (1974).
We need to find all shortest $s$–$t$ paths efficiently, and the level graph does exactly that.

::: definition {#def:blocking-flow title="Blocking flow" defines="blocking flow" source="algorithms/02 p36"}
A flow $f$ is **blocking** iff every $s$–$t$ path in $G$ contains at least one saturated edge.
:::

Every maximum flow is a blocking flow (otherwise some path has residual capacity on all its edges and is augmenting), but not every blocking flow is a maximum flow: a blocking
flow never "pushes flow back", so it may get stuck.

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

::: lemma {#lem:dinic-phases title="Each phase increases the distance" extra=true}
After a phase of Dinic's algorithm, the length of the shortest augmenting path strictly increases. Hence there are at most $n$ phases.
:::

::: proof
Let $k$ be the distance from $s$ to $t$ at the start of the phase, $L$ the level graph, and $f'$ the blocking flow in $L$. Augmenting $f$ by $f'$ changes $G_f$ only by
deleting saturated edges of $L$ and adding reverses of edges of $L$, which go one level down. As in [[lem:ek-phase]], every $s$–$t$ path of length at most $k$ in the new
residual graph would use only edges going up one level, i.e. edges of $L$ that were not saturated by $f'$. Such a path would be an $s$–$t$ path in $L$ without a saturated
edge, contradicting that $f'$ is blocking. So the new distance is larger than $k$. Distances are at most $n - 1$, so there are at most $n$ phases.
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

### Finding a blocking flow

The **input** is the residual graph $G_f$ and its level graph $L$. The **idea** is a modified depth-first search: start at $s$ and advance along edges of $L$ until either

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

::: proposition {#prop:dinic-blocking-time title="A blocking flow in time $\O(mn)$" source="algorithms/02 p44"}
The procedure finds a blocking flow in $L$ in time $\O(mn)$.
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

::: proof
Finding a blocking flow takes $\O(mn)$, all other operations of a phase take $\O(m)$, and by [[lem:dinic-phases]] there are at most $n$ phases.
:::

## The MPM algorithm

::: theorem {#thm:mpm title="MPM" source="algorithms/02 p47"}
**(Malhotra, Pramodh-Kumar, Maheshwari 1978)** There is an algorithm which solves the MaxFlow problem in time $\O(n^3)$.
:::

Dinic needs time $\O(mn)$ per phase to construct a blocking flow. The "three Indians" algorithm keeps the phase structure of Dinic (at most $n$ phases, each computing a blocking
flow in the level graph), but computes the blocking flow in $\O(n^2)$, using Fibonacci heaps.

::: definition {#def:vertex-capacity title="Vertex capacity" defines="vertex capacity, throughput" source="algorithms/02 p49"}
The **capacity of a vertex** $v$ is
$$c(v) = \min\Bigl(\sum_{(u,v) \in E} c(u, v),\ \sum_{(v,w) \in E} c(v, w)\Bigr),$$
the maximum flow that can pass through $v$. (For $s$ and $t$ only the outgoing, resp. incoming, sum is used.) The same definition applies to residual capacities $c_f$.
:::

::: algorithm {#alg:mpm title="Finding a blocking flow (MPM)" source="algorithms/02 p50"}
**Input:** the residual graph $G_f$ and its level graph $L$. **Initialization:** if $t$ does not appear in $L$, we are finished; remove all vertices that are not on an $s$–$t$ path in
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

::: proposition {#prop:mpm-time title="A blocking flow in time $\O(n^2)$" source="algorithms/02 p52"}
MPM finds a blocking flow in time $\O(n^2)$ (with Fibonacci heaps storing vertices by capacity).
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

## Algorithms for MaxFlow

| year | method | authors | complexity |
|------|--------|---------|------------|
| 1955 | augmenting path | Ford, Fulkerson | $\O(mnC)$ |
| 1970 | blocking flow | Dinitz | $\O(mn^2)$ |
| 1972 | shortest augmenting path | Edmonds, Karp | $\O(m^2 n)$ |
| 1978 | blocking flow | MPM | $\O(n^3)$ |
| 1983 | dynamic trees | Sleator, Tarjan | $\O(mn \log n)$ |
| 1986 | push-relabel | Goldberg, Tarjan | $\O(mn^2)$, $\O(\sqrt{m}\, n^2)$, $\O(mn \log(n^2/m))$ |
| 1997 | binary blocking flow | Goldberg, Rao | $\tilde{\O}(\min(m^{2/3}, n^{1/2}) \cdot m)$ |
| 2012 | compact networks | Orlin | $\O(mn)$ |

## Unit capacities and matchings

::: definition {#def:matching title="Matching" defines="matching, maximum matching" source="algorithms/02 p55"}
A **matching** $M$ of a graph $G$ is a subset of edges such that no two edges in $M$ share a vertex. A **maximum matching** is a matching of maximum size.
:::

```graph id=a02-bipartite-matching-flow widget=figure
caption: Bipartite matching as a flow problem: orient all edges from left to right, add a source joined to the left side and a sink joined to the right side, all capacities 1.
intent: Transcription of the lecture construction.
type: directed
layout: fixed
s [class=source] @(0, 0); l1 @(1.5, 1.5); l2 @(1.5, 0.5); l3 @(1.5, -0.5); l4 @(1.5, -1.5); r1 @(3, 1.5); r2 @(3, 0.5); r3 @(3, -0.5); r4 @(3, -1.5); t [class=sink] @(4.5, 0)
s -> l1 [c=1]; s -> l2 [c=1]; s -> l3 [c=1]; s -> l4 [c=1]
l1 -> r1 [c=1]; l1 -> r2 [c=1]; l2 -> r1 [c=1]; l3 -> r2 [c=1]; l3 -> r3 [c=1]; l4 -> r3 [c=1]; l4 -> r4 [c=1]
r1 -> t [c=1]; r2 -> t [c=1]; r3 -> t [c=1]; r4 -> t [c=1]
```

::: proposition {#prop:matching-flow title="Bipartite matchings are flows" extra=true}
Let $G$ be a bipartite graph with bipartition $(A, B)$, and let $N$ be the network with vertices $V(G) \cup \set{s, t}$, edges $(s, a)$ for $a \in A$, $(a, b)$ for every edge $ab$ of $G$
($a \in A$, $b \in B$), and $(b, t)$ for $b \in B$, all of capacity $1$. Then the maximum size of a matching in $G$ equals the maximum flow value in $N$.
:::

::: proof
A matching $M$ gives a flow of value $\abs{M}$: send one unit along $s \to a \to b \to t$ for each $ab \in M$; since the edges of $M$ are disjoint, every vertex carries at most one unit,
so the capacities are respected. Conversely, by the integrality theorem ([[cor:integrality]]) there is a maximum flow with all values in $\set{0, 1}$. Every $a \in A$ receives at most one
unit (from $s$), so at most one edge $(a, b)$ carries flow; similarly every $b \in B$ sends at most one unit to $t$. So the edges $ab$ with $f(a, b) = 1$ form a matching, of size equal to
the flow value.
:::

::: definition {#def:unit-capacity title="Unit-capacity network" defines="unit-capacity network, type 1 network" source="algorithms/02 p56"}
A network is a **unit-capacity network** (also **type 1 network**) if each edge has capacity $1$. As a technical assumption, there are no antiparallel edges (no pair $(u, v)$, $(v, u)$).
:::

In a unit-capacity network, the flow along each edge is $0$ or $1$ (for integral flows), every edge on an augmenting path is a bottleneck edge, and the residual network is again a
unit-capacity network (thanks to the technical assumption). So in Dinic's blocking-flow procedure we delete **all** edges of the path when augmenting, and an edge when retreating:
**at most $\O(m)$ steps per phase.** With at most $n$ phases this gives a **total time of $\O(mn)$**. We can do better.

::: lemma {#lem:unit-distance title="Short distance or small flow" source="algorithms/02 p59"}
**(Lemma A)** In a network $G$ with unit capacities, the distance $l$ between $s$ and $t$ is at most $\abs{E}/\abs{f^*}$, where $f^*$ is a maximum flow.
:::

::: proof
In the level graph of $G$, let $S_i = L_0 \cup \dots \cup L_i$ for $0 \le i < l$. Each $(S_i, V \setminus S_i)$ is an $s$–$t$ cut, and every edge leaving $S_i$ goes from $L_i$ to $L_{i+1}$
(edges increase the level by at most one). So the set of edges between $L_i$ and $L_{i+1}$ forms a cut, whose capacity (number of edges) is at least $\abs{f^*}$ by
[[lem:flow-across-cut]]. These $l$ edge sets are disjoint, hence
$$l \cdot \abs{f^*} \le \abs{E}.$$
:::

::: theorem {#thm:unit-dinic title="Dinic on unit-capacity networks" source="algorithms/02 p60"}
For a network with unit edge capacities, Dinic's algorithm requires at most $\O(m^{1/2})$ phases, and runs in time $\O(m^{3/2})$.
:::

::: proof
Each phase still takes time $\O(m)$, and in each phase the flow increases by at least $1$. If $\abs{f^*} \le m^{1/2}$, we find the maximum flow in $\O(m^{1/2})$ phases. Otherwise, let $f$ be
the flow after $m^{1/2}$ phases. The maximum flow $f'$ in the residual network $G_f$ has value $\abs{f'} = \abs{f^*} - \abs{f}$, and at most $\abs{f'}$ phases remain. $G_f$ is again a
unit-capacity network, and the length $l$ of its shortest augmenting path is greater than $m^{1/2}$ (each phase increased it, [[lem:dinic-phases]]). By Lemma A applied to $G_f$,
$\abs{f'} \le \abs{E(G_f)}/l \le m/m^{1/2} = m^{1/2}$ (the residual network of a unit-capacity network without antiparallel edges has at most $m$ edges). So at most $m^{1/2}$ phases remain,
the total number of phases is at most $2m^{1/2}$, and the running time is $\O(m^{3/2})$.
:::

::: remark
For bipartite matching, a refinement of this argument (each vertex other than $s, t$ has in-degree or out-degree $1$ in the network) gives $\O(\sqrt{n})$ phases, i.e. time $\O(m\sqrt{n})$:
this is the **Hopcroft–Karp** algorithm.
:::

## Summary

- A flow respects capacities and conservation; its value is the net flow out of $s$ ([[def:flow]]). For every cut, $\abs{f} \le \mathrm{cap}(S, T)$ ([[lem:flow-across-cut]]).
- Max-flow min-cut: maximum flow value $=$ minimum cut capacity ([[thm:maxflow-mincut]]); $f$ is maximum iff $G_f$ has no augmenting path, and then the vertices reachable from
  $s$ in $G_f$ form a minimum cut ([[thm:maxflow-characterisation]]).
- Ford–Fulkerson: augment along any path, $\O(nmC)$ for integer capacities; integral maximum flows exist ([[thm:ford-fulkerson-analysis]], [[cor:integrality]]).
- Edmonds–Karp: shortest augmenting paths, $\O(m^2 n)$ ([[thm:edmonds-karp]]), via level graphs ([[def:level-graph]]).
- Dinic: blocking flows in level graphs, at most $n$ phases, $\O(mn^2)$ ([[thm:dinic]]); MPM: blocking flows in $\O(n^2)$, $\O(n^3)$ total ([[thm:mpm-time]]).
- Unit capacities: Dinic in $\O(m^{3/2})$ ([[thm:unit-dinic]]); bipartite matching reduces to flow ([[prop:matching-flow]]).

## Exercises

```graph id=a02-ex-min-cut widget=exercise
task: select-vertices
type: directed
prompt: Select the source side $S$ of a minimum $s$–$t$ cut (including $s$).
check: is-min-cut-side source=s sink=t
hint: Run Ford–Fulkerson (or look at the player above); at the end, take the vertices reachable from $s$ in the residual network.
solution: $S = \set{s, b}$: the cut edges are $(s, a)$ and $(b, d)$ with total capacity $10 + 9 = 19$, which equals the maximum flow value.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

```graph id=a02-ex-max-flow-value widget=exercise
task: answer
type: directed
prompt: What is the value of a maximum flow in this network?
answer: 23
hint: Find a cut whose capacity equals the value of a flow you can construct.
solution: The cut $(\set{s, a, b, d}, \set{c, t})$ has capacity $c(a,c) + c(d,c) + c(d,t) = 12 + 7 + 4 = 23$ (the edge $(c, b)$ goes backwards and does not count). A flow of value $23$: $12$ units along $s\,a\,c\,t$, $7$ along $s\,b\,d\,c\,t$ and $4$ along $s\,b\,d\,t$. So the maximum flow value is $23$.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, -1); c @(3, 1); d @(3, -1); t [class=sink] @(4.5, 0)
s -> a [c=16]; s -> b [c=13]; a -> b [c=10]; b -> a [c=4]; a -> c [c=12]; c -> b [c=9]; b -> d [c=14]; d -> c [c=7]; c -> t [c=20]; d -> t [c=4]
```

```graph id=a02-ex-matching widget=exercise
task: select-edges
prompt: Select a maximum matching of this bipartite graph.
check: is-max-matching
hint: Each left vertex can be matched to at most one right vertex. Start greedily, then look for augmenting paths that alternate between unmatched and matched edges.
solution: A perfect matching exists: $a_1 b_2$, $a_2 b_1$, $a_3 b_3$, $a_4 b_4$.
layout: bipartite left="a1 a2 a3 a4"
a1 [label="$a_1$"]; a2 [label="$a_2$"]; a3 [label="$a_3$"]; a4 [label="$a_4$"]; b1 [label="$b_1$"]; b2 [label="$b_2$"]; b3 [label="$b_3$"]; b4 [label="$b_4$"]
a1 -- b1; a1 -- b2; a2 -- b1; a3 -- b2; a3 -- b3; a4 -- b3; a4 -- b4
```

:::: exercise {#exr:a02-menger-from-flow title="Menger from max-flow min-cut" difficulty=2}
Derive the edge version of Menger's theorem for directed graphs ([[thm:menger-directed]] B) from the max-flow min-cut theorem and the integrality theorem.

::: solution
Give every arc capacity $1$. An $s$–$t$ edge cut $F$ of size $k$ yields an $s$–$t$ cut of capacity at most $k$: take $S$ as the set of vertices reachable from $s$ in $G - F$; all arcs
from $S$ to $T$ lie in $F$. Conversely, the arcs from $S$ to $T$ of any cut $(S, T)$ form an edge cut of size $\mathrm{cap}(S, T)$. So the minimum cut capacity equals the minimum size of an
edge cut. By max-flow min-cut and integrality, there is a $0/1$ flow of that value. The arcs with flow $1$ form a d-flow in the sense of [[def:d-flow]], which decomposes into that many
edge-disjoint paths ([[claim:d-flow-paths]]).
:::
::::

:::: exercise {#exr:a02-vertex-capacities title="Vertex capacities" difficulty=2}
Suppose that, in addition to edge capacities, every vertex $v \ne s, t$ has a capacity $c(v)$ limiting the total flow through it. Reduce this problem to the ordinary max-flow problem.

::: solution
Split every vertex $v \ne s, t$ into $v^-$ and $v^+$ joined by an edge $(v^-, v^+)$ of capacity $c(v)$; edges entering $v$ now enter $v^-$, edges leaving $v$ leave $v^+$ (this is the
construction from the proof of Menger's theorem, see [[fig:t05-vertex-splitting]]). Flows in the new network correspond to flows in the old one respecting the vertex capacities, with
the same value.
:::
::::

:::: exercise {#exr:a02-min-cut-unique title="Is the minimum cut unique?" difficulty=2}
Give a network with two different minimum cuts. How can you find the minimum cut whose source side $S$ is as large as possible?

::: solution
A path $s \to a \to t$ with both capacities $1$ has minimum cuts $(\set{s}, \set{a, t})$ and $(\set{s, a}, \set{t})$. For the largest source side, take a maximum flow $f$ and let $T$ be the set
of vertices from which $t$ is reachable in $G_f$; then $(V \setminus T, T)$ is a minimum cut (by the symmetric argument of [[thm:maxflow-characterisation]]), and its source side contains
the source side of every minimum cut.
:::
::::

:::: quiz {#q:a02-residual}
An edge $e = (u, v)$ has capacity 7 and flow 3. Which residual edges does it produce?

- [ ] Only $(u, v)$ with capacity 4
- [ ] Only $(v, u)$ with capacity 3
- [x] $(u, v)$ with capacity 4 and $(v, u)$ with capacity 3
- [ ] $(u, v)$ with capacity 7

::: explanation
$f(e) < c(e)$ gives the forward edge with $c_f = 7 - 3 = 4$; $f(e) > 0$ gives the reverse edge with $c_f = 3$ ([[def:residual-network]]).
:::
::::

:::: quiz {#q:a02-blocking-max}
Is every blocking flow a maximum flow?

- [ ] Yes
- [x] No

::: explanation
Every maximum flow is blocking, but not conversely: see the example with a blocking flow of value 5 and maximum flow 8.
:::
::::

:::: quiz {#q:a02-ek-complexity}
What is the running time of the Edmonds–Karp algorithm?

- [ ] $\O(mnC)$
- [x] $\O(m^2 n)$
- [ ] $\O(mn^2)$
- [ ] $\O(n^3)$

::: explanation
$\O(mn)$ augmentations ([[lem:ek-monotone]], [[lem:ek-phase]]), each found by BFS in $\O(m)$.
:::
::::

:::: quiz {#q:a02-dinic-phases}
At most how many phases does Dinic's algorithm perform on a network with $n = 50$ vertices?

answer: 50

::: explanation
Each phase strictly increases the $s$–$t$ distance in the residual network, which is at most $n - 1$ ([[lem:dinic-phases]]); the lecture states the bound as $n$.
:::
::::
