---
title: "Unit-capacity networks"
course: algorithms
chapter: fast-flows
order: 8
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:unit-capacity title="Unit-capacity network" defines="unit-capacity network, type 1 network" source="algorithms/02 p57"}
A network is a **unit-capacity network** (also **type 1 network**) if each edge has capacity $1$. As a technical assumption, there are no antiparallel edges (no pair $(u, v)$, $(v, u)$).
:::

::: intuition
Unit capacities turn flow into counting: an integral flow of value $k$ is a set of arcs carrying one unit each, containing $k$ arc-disjoint $s$–$t$ paths
([[def:d-flow]], [[claim:d-flow-paths]]), and a cut capacity is a number of arcs. So the maximum flow value is the maximum number of arc-disjoint $s$–$t$ paths, and
max-flow min-cut becomes Menger's theorem ([[thm:menger-directed]] B; for undirected graphs [[thm:menger]] b)). The network of [[prop:matching-flow]] is a
unit-capacity network. Without the technical assumption, $(u, v)$ and $(v, u)$ with flow $1$ on $(u, v)$ would give two residual edges from $v$ to $u$.
:::

::: pitfall
Menger's theorem allows parallel arcs, a unit-capacity network allows neither parallel nor antiparallel edges. To apply the results below to an arbitrary
digraph, first reduce it as in [[exr:a02-menger-from-flow]] (parallel arcs become one arc of higher capacity, so the network is then no longer of unit capacity), or
subdivide every parallel or antiparallel arc by a new vertex, which keeps all capacities $1$ and does not change the number of arc-disjoint $s$–$t$ paths.
:::

In a unit-capacity network, the flow along each edge is $0$ or $1$ (for integral flows), every edge on an [[def:augmenting-path|augmenting path]] is a bottleneck
edge, and the [[def:residual-network|residual network]] is again a unit-capacity network (thanks to the technical assumption). So in Dinic's blocking-flow procedure we delete **all** edges of the path when augmenting, and an edge when retreating:
**at most $\O(m)$ steps per phase.** With at most $n$ phases this gives a **total time of $\O(mn)$**. We can do better.

::: lemma {#lem:unit-distance title="Short distance or small flow" source="algorithms/02 p59"}
**(Lemma A)** In a network $G$ with unit capacities, the distance $l$ between $s$ and $t$ is at most $\abs{E}/\abs{f^*}$, where $f^*$ is a maximum flow.
:::

::: intuition
Long distance and large flow do not go together. A large maximum flow means every cut has many arcs; between consecutive layers of the
[[def:level-graph|level graph]] there are $l$ disjoint cuts, so the network needs at least $l \cdot \abs{f^*}$ arcs. Example: $k$ disjoint $s$–$t$ paths of
length $l$ have $\abs{E} = kl$, $\abs{f^*} = k$ and distance $l = \abs{E}/\abs{f^*}$, so the bound is tight.
:::

::: proof
In the level graph of $G$, let $S_i = L_0 \cup \dots \cup L_i$ for $0 \le i < l$. Each $(S_i, V \setminus S_i)$ is an $s$–$t$ cut, and every edge leaving $S_i$ goes from $L_i$ to $L_{i+1}$
(edges increase the level by at most one). So the set of edges between $L_i$ and $L_{i+1}$ forms a cut, whose capacity (number of edges) is at least $\abs{f^*}$ by
weak duality. These $l$ edge sets are disjoint, hence
$$l \cdot \abs{f^*} \le \abs{E}.$$
:::

::: theorem {#thm:unit-dinic title="Dinic on unit-capacity networks" source="algorithms/02 p60"}
For a network with unit edge capacities, Dinic's algorithm requires at most $\O(m^{1/2})$ phases, and runs in time $\O(m^{3/2})$.
:::

::: intuition
Balance two bounds. Each phase raises the distance from $s$ to $t$, so after $\sqrt{m}$ phases the distance exceeds $\sqrt{m}$; by Lemma A the flow still
missing is then at most $m / \sqrt{m} = \sqrt{m}$, and each further phase adds at least one unit. So $\sqrt{m} + \sqrt{m}$ phases of $\O(m)$ each. Example: for
$m = 10^6$ arcs, at most $2000$ phases instead of the general bound $n$.
:::

::: proof
Each phase still takes time $\O(m)$, and in each phase the flow increases by at least $1$. If $\abs{f^*} \le m^{1/2}$, we find the maximum flow in $\O(m^{1/2})$ phases. Otherwise, let $f$ be
the flow after $m^{1/2}$ phases. The maximum flow $f'$ in the residual network $G_f$ has value $\abs{f'} = \abs{f^*} - \abs{f}$, and at most $\abs{f'}$ phases remain.
<!-- REVIEW: justification of |f'| = |f*| − |f| added (slide states it without proof); values in G_f are net values, see the assumption after def:flow-network. -->
(A flow $g$ in $G_f$ gives the flow $e \mapsto f(e) + g(e) - g(e^R)$ in $G$ of value $\abs{f} + \abs{g}$, so $\abs{g} \le \abs{f^*} - \abs{f}$; conversely, putting
$f^*(e) - f(e)$ on $e$ where it is positive and $f(e) - f^*(e)$ on $e^R$ where it is positive gives a flow in $G_f$ of value $\abs{f^*} - \abs{f}$.) $G_f$ is again a
unit-capacity network, and the length $l$ of its shortest augmenting path is greater than $m^{1/2}$ (each phase increased it, [[lem:dinic-phases]]). By Lemma A applied to $G_f$,
$\abs{f'} \le \abs{E(G_f)}/l \le m/m^{1/2} = m^{1/2}$ (the residual network of a unit-capacity network without antiparallel edges has at most $m$ edges). So at most $m^{1/2}$ phases remain,
the total number of phases is at most $2m^{1/2}$, and the running time is $\O(m^{3/2})$.
:::

::: remark
For bipartite matching, a refinement of this argument (each vertex other than $s, t$ has in-degree or out-degree $1$ in the network) gives $\O(\sqrt{n})$ phases, i.e. time $\O(m\sqrt{n})$:
this is the **Hopcroft–Karp** algorithm.
:::
