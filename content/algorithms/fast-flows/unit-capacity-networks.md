---
title: "Unit-capacity networks"
course: algorithms
chapter: fast-flows
order: 8
lectures: [a02]
stage: split
status: reviewed
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
[[def:level-graph|level graph]] there are $l$ disjoint cuts, so the network needs at least $l \cdot \abs{f^*}$ arcs. Example: $k$ internally disjoint $s$–$t$ paths of
length $l \ge 2$ (or $k = 1$) have $\abs{E} = kl$, $\abs{f^*} = k$ and distance $l = \abs{E}/\abs{f^*}$, so the bound is tight.
:::
<!-- REVIEW: example restricted to l >= 2 or k = 1: for l = 1 and k >= 2 the k paths would be parallel s-t arcs, which a unit-capacity network does not allow. -->

Proof by counting: the layers of the level graph give $l$ disjoint cuts, and every cut is at least as large as the maximum flow.

:::: walkthrough {for=lem:unit-distance}
```graph id=a02-unit-levels widget=stepper
caption: A unit-capacity network and the layers of its level graph. Vertices of one layer share a marking; $s$ and $t$ keep their own.
intent: New figure. The lecture proves Lemma A on algorithms/02 p59 without a drawing. This network has 6 vertices, 9 edges, distance 3 and maximum flow 2.
type: directed
layout: fixed
s [class=source] @(0, 0.5); a @(1, 1); b @(1, 0); c @(2, 1); d @(2, 0); t [class=sink] @(3, 0.5)
s -> a; s -> b; a -> c; a -> d; b -> d; c -> t; d -> t; c -> b; a -> b
class color2: a b
class color3: c d
mark L1: a b
mark L2: c d
mark S1: s a b
mark cut1: a->c a->d b->d
mark flow: s->a a->c c->t s->b b->d d->t
mark set0: s->a s->b
mark set2: c->t d->t
mark extra: c->b a->b
step: The cut $S_1$ between the first two layers and the rest.
class highlight: s a b
step: The edges leaving $S_1$ all go from layer 1 to layer 2.
class cut: a->c a->d b->d
class muted: c->b a->b
step: The maximum flow crosses the cut; the cut has at least as many edges.
class path: s->a a->c c->t s->b b->d d->t
step: The three edge sets, one per cut, share no edge.
unclass highlight: s a b
unclass cut: a->c a->d b->d
unclass path: s->a a->c c->t s->b b->d d->t
unclass muted: c->b a->b
class color5: s->a s->b
class color6: a->c a->d b->d
class color7: c->t d->t
step: Three disjoint sets of at least $\abs{f^*}$ edges fit into $E$.
class dashed: c->b a->b
```

::: step
Let $l$ be the distance from $s$ to $t$; $t$ lies in layer $L_l$ of the [[def:level-graph|level graph]]. For $i$ from 0 to $l - 1$ let $S_i$ hold the layers $L_0$ to $L_i$. It contains $s$ and misses $t$, because $i$ is below $l$. So it is an [[def:flow-cut|$s$–$t$ cut]]. Here: $l$ is 3; [[fig:a02-unit-levels#S1|$S_1$]] is $s$, $a$, $b$.
:::

::: step
Take an edge from $u$ to $v$ leaving $S_i$. An edge raises the distance by at most one: a shortest path to $u$ plus the edge reaches $v$. Now $u$ is at distance at most $i$ and $v$ at least $i + 1$, so $u$ is in $L_i$ and $v$ in $L_{i+1}$. Here: [[fig:a02-unit-levels#cut1|three edges]] leave $S_1$.
:::

::: step
Every edge from $L_i$ to $L_{i+1}$ starts in $S_i$ and ends outside, so these edges are exactly the edges leaving $S_i$. All capacities are 1, so the cut capacity is their number. By [[algorithms/flows/max-flow-min-cut|weak duality]] it is at least the value of $f^*$. Here: 3 edges, and $f^*$ has value 2, along [[fig:a02-unit-levels#flow|two paths]].
:::

::: step
For different $i$ these edge sets share no edge: an edge from $L_i$ to $L_{i+1}$ has its tail in $L_i$, and the layers are disjoint. So we get $l$ pairwise disjoint sets, one for each $i$ from 0 to $l - 1$. Here: three sets with 2, 3 and 2 edges.
:::

::: step
Each of the $l$ disjoint sets has at least the value of $f^*$ edges, and all lie in $E$. Adding up gives $$l \cdot \abs{f^*} \le \abs{E}.$$ As $t$ is reachable, $f^*$ has value at least 1, so dividing gives $l \le \abs{E}/\abs{f^*}$. Here: 3 times 2 is 6, at most 9; dashed edges lie in no set.
:::
::::

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

Proof by counting: bound the phases before and after the distance passes $m^{1/2}$, and use Lemma A for the flow that is still missing. First part: the cost of a phase and the case of a small maximum flow.

:::: walkthrough {for=thm:unit-dinic}
```graph id=a02-unit-phases widget=stepper
caption: A unit-capacity network with $m = 9$ edges. Edges that carry flow at the end share a marking when the same phase of Dinic's algorithm filled them.
intent: New figure. The lecture states the theorem on algorithms/02 p60 without a drawing. This network has 6 vertices and 9 edges; Dinic needs 3 phases (distance 1, 2, 4) and ends with value 4.
type: directed
layout: fixed
s [class=source] @(0, 1.2); a @(1.8, 2); b @(0.9, 0); c @(1.8, 0); d @(2.7, 0); t [class=sink] @(3.6, 1.2)
s -> t; s -> a; a -> t; s -> b; s -> c; b -> c; c -> t; c -> d; d -> t
mark ph1: s->t
mark ph2: s->a a->t s->c c->t
mark ph3: s->b b->c c->d d->t
mark fstar: s->t s->a s->b s->c
step: The network: 9 edges, all of capacity 1.
step: Three phases fill the edges: 1, 2 and 1 units.
class color1: s->t
class color2: s->a a->t s->c c->t
class color3: s->b b->c c->d d->t
step: The final flow has value 4: one unit on each edge leaving $s$.
unclass color1: s->t
unclass color2: s->a a->t s->c c->t
unclass color3: s->b b->c c->d d->t
class bold: s->t s->a s->b s->c
```

::: step
Each phase takes time $\O(m)$. A BFS builds the [[def:level-graph|level graph]] in time linear in $m$, since $G$ is connected ([[algorithms/flows/flow-networks|convention]]). Unit capacities make every edge of an augmenting path a bottleneck, so we delete all of them at once, and a retreat deletes one edge. That is $\O(m)$ steps. Here: $m$ is 9.
:::

::: step
Each phase raises the flow value by at least 1. A phase runs only while $t$ is reachable in the [[def:residual-network|residual network]], so the level graph has an $s$–$t$ path. A zero flow is not [[def:blocking-flow|blocking]], as that path stays open. The flow is integral, so it adds at least 1. Here: [[fig:a02-unit-phases#ph1|1]], [[fig:a02-unit-phases#ph2|2]] and [[fig:a02-unit-phases#ph3|1]] units.
:::

::: step
Suppose the maximum flow $f^*$ has value at most $m^{1/2}$. Our flow starts at value 0, gains at least 1 per phase, and never exceeds the value of $f^*$. So Dinic needs at most that many phases, which is $\O(m^{1/2})$. Here: [[fig:a02-unit-phases#fstar|$f^*$]] has value 4 and the square root of $m$ is 3, so this is the other case.
:::
::::

The other case: the flow $f$ after $m^{1/2}$ phases is large, so we bound what is missing.

:::: walkthrough {for=thm:unit-dinic}
```graph id=a02-unit-residual widget=stepper
caption: The network of the previous figure after two phases. Thick edges carry the flow $f$; the residual network $G_f$ replaces them by reverse edges.
intent: New figure. It continues the network of the previous figure; the lecture shows no drawing for this proof (algorithms/02 p60).
type: directed
layout: fixed
s [class=source] @(0, 1.2); a @(1.8, 2); b @(0.9, 0); c @(1.8, 0); d @(2.7, 0); t [class=sink] @(3.6, 1.2)
s -> t; s -> a; a -> t; s -> b; s -> c; b -> c; c -> t; c -> d; d -> t
class path: s->t s->a a->t s->c c->t
mark f: s->t s->a a->t s->c c->t
mark fwd: s->b b->c c->d d->t
step: The flow $f$ after two phases has value 3.
step: The residual network $G_f$: five edges turn around, four stay.
remove s->t
remove s->a
remove a->t
remove s->c
remove c->t
t -> s [class=back]; a -> s [class=back]; t -> a [class=back]; c -> s [class=back]; t -> c [class=back]
mark rev: t->s a->s t->a c->s t->c
step: A flow $g$ in $G_f$ gives a flow in $G$ of value $\abs{f} + \abs{g}$.
class highlight: s->b b->c c->d d->t
step: From $f^*$ and $f$ we get a flow in $G_f$ of value $\abs{f^*} - \abs{f}$.
class bold: s->b b->c c->d d->t
step: At most $\abs{f'}$ phases remain: here one, along $s, b, c, d, t$.
unclass highlight: s->b b->c c->d d->t
unclass bold: s->b b->c c->d d->t
class path: s->b b->c c->d d->t
step: $G_f$ is a unit-capacity network with one edge for each edge of $G$.
class color1: s->b b->c c->d d->t t->s a->s t->a c->s t->c
step: The shortest augmenting path in $G_f$ has length 4, more than 3.
unclass color1: s->b b->c c->d d->t t->s a->s t->a c->s t->c
class bold: s->b b->c c->d d->t
mark short: s->b b->c c->d d->t
step: Lemma A bounds $\abs{f'}$ by the 9 edges of $G_f$ divided by the length 4.
unclass bold: s->b b->c c->d d->t
class color2: s->b b->c c->d d->t t->s a->s t->a c->s t->c
step: The phases before and after add up: 2 done, at most 1 to come.
unclass color2: s->b b->c c->d d->t t->s a->s t->a c->s t->c
unclass path: s->b b->c c->d d->t
class current: s t
```

::: step
Otherwise the value of $f^*$ is above $m^{1/2}$. Let $f$ be the flow after the first $m^{1/2}$ phases. We bound the flow still missing, using the [[def:residual-network|residual network]] $G_f$. Here: Dinic is done after 3 phases and the square root of $m$ is 3, so we take $f$ after 2 phases: [[fig:a02-unit-residual#f|its five edges]] carry 3 of the 4 units.
:::

::: step
$G_f$ keeps an edge $e$ where $e$ carries no flow, and has the reverse edge $e^R$ where $e$ carries one unit; the flow is integral and at most 1. Let $f'$ be a maximum flow in $G_f$. Here: the five edges with flow disappear, their [[fig:a02-unit-residual#rev|reverse edges]] appear, and the [[fig:a02-unit-residual#fwd|four others]] stay.
:::

::: step
Take a flow $g$ in $G_f$. Add to $f$ what $g$ sends along each edge, and subtract what it sends along the reverse edge. As $g$ respects the residual capacities, this is a flow in $G$ of value $\abs{f} + \abs{g}$. Since $f^*$ is maximum, $\abs{g} \le \abs{f^*} - \abs{f}$. Here: a unit along $s,b,c,d,t$ gives 3 + 1.
:::

::: step
Conversely, where $f^*$ exceeds $f$, put the excess on that edge; where it falls short, put the shortfall on the reverse edge. This fits the residual capacities (both flows lie between 0 and 1) and conserves flow (a difference of flows). So $G_f$ has a flow of value $\abs{f^*} - \abs{f}$, equal to $\abs{f'}$. Here: 1 on [[fig:a02-unit-residual#fwd|the four edges]].
:::

::: step
Every phase still to come raises the flow value by at least 1, and the value cannot pass the maximum. So at most as many phases remain as the value of $f'$. Here: one phase remains, along [[fig:a02-unit-residual#fwd|$s, b, c, d, t$]], and $f'$ has value 1.
:::

::: step
$G_f$ is a unit-capacity network. An edge of $G$ carries 0 or 1 units, so it gives exactly one edge of $G_f$, itself or its reverse, of capacity 1. Two antiparallel edges in $G_f$ would need two edges of $G$ on the same two vertices; the no-antiparallel assumption and the [[algorithms/flows/flow-networks|no-parallel convention]] exclude that. Here: 9 edges give 9.
:::

::: step
By [[lem:dinic-phases]] each phase lengthens the shortest augmenting path, a whole number that starts at 1 or more. So after $k$ phases it is at least $k + 1$. After the first $m^{1/2}$ phases the length $l$ in $G_f$ is above $m^{1/2}$. Here: the length is 1, then 2, then 4, along [[fig:a02-unit-residual#short|$s, b, c, d, t$]].
:::

::: step
[[lem:unit-distance|Lemma A]] applies to $G_f$ and $f'$: $l$ times the value of $f'$ is at most the number of edges of $G_f$, which is $m$. As $l$ exceeds $m^{1/2}$, $$\abs{f'} \le m/l \le m/m^{1/2} = m^{1/2}.$$ (Nothing to show if $f'$ is 0.) Here: 4 times 1 is at most 9; the bound is 9 over 3.
:::

::: step
So at most the same number of phases remain: at most twice $m^{1/2}$ in total, which also covers the first case. Each phase takes time linear in $m$, so Dinic runs in $\O(m^{3/2})$. Here: 2 phases done and at most 1 to come, against the allowed 6.
:::
::::

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
