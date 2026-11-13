---
title: "The sampling lemma"
course: algorithms
chapter: mst
order: 17
lectures: [a01]
stage: split
status: reviewed
---

**Idea.** (1) Guess a spanning tree $T$ of $G$. (2) Find the set $S$ of all $T$-heavy edges; they cannot be in the MST ([[lem:f-heavy-not-in-mst]]). If $T = M$, then $S$
contains all edges not in $T$. (3) Proceed recursively with $G \setminus S$. **If $T$ is sufficiently close to $M$, most edges of $G \setminus T$ are ruled out**, and if very few
edges are left, we can use brute force.

Two problems: how to guess $T$, and how many $T$-light edges will there be? **Idea:** instead of guessing $T$, guess a subgraph $H$ of $G$ by random sampling and compute
its minimum spanning forest $F$ (recursively; $H$ may be disconnected, hence a forest).

::: definition {#def:msf title="Minimum spanning forest" defines="minimum spanning forest, MSF" source="algorithms/01 p40"}
The **minimum spanning forest** (**MSF**) of a possibly disconnected graph is the union of the [[def:mst|minimum spanning trees]] of its
[[def:component|components]].
:::

::: intuition
The MSF is what an MST algorithm produces when the graph is not connected: one MST per component. It is a [[def:forest-tree|forest]] with $n - c$
edges, where $c$ is the number of components. Kruskal's algorithm computes it without any change, since it never uses
connectivity. Example: for two disjoint triangles with weights $1, 2, 3$ each, the MSF consists of the four edges of weights $1$ and $2$.
:::

```graph id=a01-msf widget=figure
caption: Two disjoint triangles. In the panel MSF the thick edges (weights 1 and 2 in each triangle) form the minimum spanning forest, of weight 6. In the panel Not an MSF the thick edges are also a spanning tree of each component, but the left one uses weights 1 and 3, so the total is 7.
intent: New figure (the lecture, algorithms/01 p40, has no picture): the two triangles of the intuition, with an MSF and a spanning forest that is not minimum.
layout: fixed
layout-sync: true
panel: MSF
a @(0, 0); b @(0.6, 0.9); c @(1.2, 0); d @(1.8, 0); e @(2.4, 0.9); f @(3, 0)
a -- b [w=1 class=tree]; b -- c [w=2 class=tree]; a -- c [w=3]
d -- e [w=1 class=tree]; e -- f [w=2 class=tree]; d -- f [w=3]
panel: Not an MSF
a @(0, 0); b @(0.6, 0.9); c @(1.2, 0); d @(1.8, 0); e @(2.4, 0.9); f @(3, 0)
a -- b [w=1 class=tree]; b -- c [w=2]; a -- c [w=3 class=tree]
d -- e [w=1 class=tree]; e -- f [w=2 class=tree]; d -- f [w=3]
```

::: lemma {#lem:sampling title="Sampling lemma" aka="Karger–Klein–Tarjan sampling lemma" source="algorithms/01 p40, p45"}
**(Karger, Klein, Tarjan 1995)** Let $H \subseteq G$ be a subgraph obtained from $G$ by including each edge independently with probability $p$, where $0 < p < 1$, and let $F$
be the minimum spanning forest of $H$. The expected number of $F$-light edges in $G$ is at most $n/p$.
:::

::: intuition
A random sample of the edges already knows most of the MST: whatever $m$ is, on average at most $n/p$ edges of $G$ survive the $F$-light test.
The reason is in the proof: run Kruskal on $G$ and flip the coin for an edge only when it reaches it. Every $F$-light edge gets a coin flip that, with
probability $p$, adds an edge to $F$, and $F$ can never get more than $n - 1$ edges. Example: $n = 100$, $m = 5000$, $p = 1/2$: in expectation at most
$200$ edges are $F$-light, so in expectation at least $4800$ edges are discarded. <!-- REVIEW: added "in expectation"; the bound n/p is on the expected number, so a single sample may discard fewer. -->
:::

```graph id=a01-sampling-example widget=figure
caption: One sample of the running example with $p = 1/2$. Dashed edges lost their coin flip, the thick edges form the MSF $F$ of the sample, and the faded edges are $F$-heavy. The other 9 edges are $F$-light. Averaged over all 4096 samples, about 10.79 edges are $F$-light, below $n/p = 16$.
intent: New figure (the lecture, algorithms/01 p40 and p45, has no picture). The running example with the flat positions of a01-verif-all-heavy and one fixed sample; the walkthroughs of the proof use the same sample.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4 class=dashed]; a -- c [w=8 class=dashed]; b -- c [w=11 class=tree]; b -- d [w=9 class=dashed]; c -- e [w=7 class=muted]; c -- f [w=1 class=tree]
d -- e [w=2 class=tree]; d -- g [w=6 class=tree]; e -- f [w=5 class=tree]; e -- g [w=12 class=muted]; f -- h [w=3 class=tree]; g -- h [w=10 class="dashed muted"]
```

::: pitfall
The $F$-light edges are counted in all of $G$, not only in $H$. And the bound is on the **expected** number; a single unlucky sample may leave many
more light edges.
:::

The proof couples the random sample with [[alg:kruskal|Kruskal's algorithm]]: one pass over the edges builds $H$, $F$ and $L$ together. First we check that the three sets are what the lemma talks about.

:::: walkthrough {for=lem:sampling}
```graph id=a01-sampling-process widget=stepper
caption: The process on the running example with $p = 1/2$ and one fixed sample: dashed edges lost their flip, thick edges are in $F$.
intent: New figure (the lecture, algorithms/01 p45, has no picture). Same graph, positions and sample as a01-sampling-example. Marks show the sample, F, L and the two test edges ce and bd with their F-paths.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark first: c--f
mark out: a--b a--c b--d g--h
mark ab: a--b
mark F: c--f d--e f--h e--f d--g b--c
mark ce: c--e
mark Pce: c--f e--f
mark bc: b--c
mark bd: b--d
mark Pbd: b--c c--f e--f d--e
mark L: c--f d--e f--h a--b e--f d--g a--c b--d b--c
mark heavy: c--e g--h e--g
step: Edges in order of weight; $F$, $E'$, $L$ empty.
class current: c--f
step: One coin flip per edge: dashed edges lost.
unclass current: c--f
class dashed: a--b a--c b--d g--h
step: $ab$ joins two trees: into $L$, not into $F$.
class tree: c--f d--e f--h
class current: a--b
step: On $H$ the loop is Kruskal: $F$ is the MSF of $H$.
unclass current: a--b
class tree: e--f d--g b--c
class muted: a--b a--c b--d g--h
step: When $ce$ comes, its ends are already joined.
unclass muted: a--b a--c b--d g--h
unclass tree: b--c
class current: c--e
class path: c--f e--f
step: That path stays in $F$: $ce$ is $F$-heavy.
unclass current: c--e
unclass path: c--f e--f
class tree: b--c
class muted: c--e
step: $bc$ joins two trees and enters $F$.
class current: b--c
step: $bd$ joins two trees but lost its flip.
unclass current: b--c
class current: b--d
class path: b--c c--f e--f d--e
step: So $L$ is the set of $F$-light edges.
unclass current: b--d
unclass path: b--c c--f e--f d--e
class highlight: a--b a--c b--d
class muted: g--h e--g
```

::: step
We sort the edges by weight and start with $F$, $E'$ and $L$ empty. Then we visit the edges one at a time in this order, as Kruskal does. Weights are distinct ([[algorithms/mst/distinct-weights|our standing convention]]), so every earlier edge is strictly lighter. Here: the order starts with [[fig:a01-sampling-process#first|$cf$]] (1), $de$ (2), $fh$ (3) and ends with $eg$ (12).
:::

::: step
Line 4 flips a coin for each edge: with probability $p$ the edge goes into $E'$. Every edge gets exactly one flip, and the flips are independent. This is the definition of $H$ in the lemma, so $(V, E')$ is exactly $H$. Here: $p = 1/2$, the [[fig:a01-sampling-process#out|4 dashed edges]] lost their flip, and the other 8 form $H$.
:::

::: step
Line 5 asks whether the ends of $e$ lie in two different trees of $(V, F)$. If yes, $e$ goes into $L$. If $e$ also won its flip, it enters $F$ too. Here: when [[fig:a01-sampling-process#ab|$ab$]] comes, $F$ has $cf$, $de$ and $fh$, so $a$ and $b$ lie in different trees. $ab$ enters $L$, but not $F$: it lost its flip.
:::

::: step
On the edges of $H$ the loop is Kruskal's algorithm: it takes them in order and adds one to $F$ when it joins two different trees. Edges outside $E'$ never enter $F$, so they change nothing. Kruskal never uses connectivity, so $F$ is the [[def:msf|MSF]] of $H$, as the lemma requires. Here: [[fig:a01-sampling-process#F|$F$]] has 6 edges, and $a$ has none.
:::

::: step
Last, we show that $L$ is the set of [[def:f-heavy|$F$-light]] edges. Suppose the ends of $e$ already lie in one tree of $F$ when $e$ comes. That tree contains a path between them. Its edges entered $F$ earlier, so each is lighter than $e$. Here: when [[fig:a01-sampling-process#ce|$ce$]] (7) comes, [[fig:a01-sampling-process#Pce|$cf$ and $ef$]] (1 and 5) already join $c$ and $e$.
:::

::: step
$F$ only grows and stays a forest. So this path is still the unique path between the ends of $e$ in the final $F$, and its largest weight is $w_F(e)$. That is less than the weight of $e$, so $e$ is $F$-heavy, and line 5 keeps it out of $L$. Here: $w_F(ce)$ is 5, against 7.
:::

::: step
Now suppose the ends of $e$ lie in different trees when $e$ comes. Then $e$ enters $L$. If $e$ also enters $F$, the path in $F$ between its ends is $e$ itself, so $w_F(e)$ equals the weight of $e$, and $e$ is $F$-light. Here: [[fig:a01-sampling-process#bc|$bc$]] (11) joins $b$ to the big tree and enters $F$.
:::

::: step
If $e$ does not enter $F$, any $F$-path between its ends uses an edge added after $e$: with only earlier edges, the ends would already be joined. Later edges are heavier. So $w_F(e)$ is larger than the weight of $e$, or infinite if no path appears: $e$ is $F$-light. Here: [[fig:a01-sampling-process#bd|$bd$]] (9) later gets [[fig:a01-sampling-process#Pbd|a path]] through $bc$ (11).
:::

::: step
The two cases cover every edge, so an edge is in $L$ exactly when it is $F$-light. Edges of $G$ outside $H$ count too: $bd$ is in $L$ although it is not in $H$. Here: [[fig:a01-sampling-process#L|9 edges]] are in $L$, and the [[fig:a01-sampling-process#heavy|3 faded edges]] $ce$, $gh$ and $eg$ are $F$-heavy.
:::
::::

The counting uses linearity of expectation: every edge of $L$ adds an edge to $F$ with probability $p$, and the forest $F$ cannot grow beyond $n - 1$ edges.

:::: walkthrough {for=lem:sampling}
```graph id=a01-sampling-count widget=stepper
caption: The same sample: thick edges are in $F$, the other edges of $L$ are highlighted, and faded edges are $F$-heavy.
intent: New figure (the lecture, algorithms/01 p45, has no picture). Same graph, positions and sample as a01-sampling-example. Marks show L, F, the edge bd and the part of F built before bd.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark L: c--f d--e f--h a--b e--f d--g a--c b--d b--c
mark F: c--f d--e f--h e--f d--g b--c
mark bd: b--d
mark before: c--f d--e f--h e--f d--g
step: $\abs{L}$ and $\abs{F}$ depend on the flips.
class tree: c--f d--e f--h e--f d--g b--c
class highlight: a--b a--c b--d
class muted: c--e g--h e--g
step: Whether $bd$ is in $L$ depends on earlier edges only.
unclass tree: b--c
unclass highlight: a--b a--c b--d
class current: b--d
step: Then $bd$ enters $F$ with probability $p$.
class dashed: b--d
step: Sum over all edges: $\mathbb{E}[\abs{F}] = p \cdot \mathbb{E}[\abs{L}]$.
unclass current: b--d
unclass dashed: b--d
class tree: b--c
class highlight: a--b a--c b--d
step: $F$ is a forest: at most $n - 1$ edges.
class muted: a--b a--c b--d
step: Divide by $p$.
unclass muted: a--b a--c b--d
class bold: c--f d--e f--h a--b e--f d--g a--c b--d b--c
```

::: step
The flips are random, so $L$ and $F$ are random sets, and their sizes are random variables. Another run of the process gives other sets. We compare the expected sizes. Here: for this one sample, [[fig:a01-sampling-count#L|$L$]] has 9 edges and [[fig:a01-sampling-count#F|$F$]] has 6.
:::

::: step
Fix an edge $e$. Line 5 looks only at the trees of $F$ at the moment $e$ comes. That $F$ was built from earlier edges, so it depends only on their flips. Hence whether $e$ is in $L$ does not depend on the flip of $e$. Here: [[fig:a01-sampling-count#bd|$bd$]] is in $L$ because of [[fig:a01-sampling-count#before|the five thick edges]] taken before it.
:::

::: step
The lemma makes the flips independent, so the flip of $e$ is independent of whether $e$ is in $L$. An edge of $L$ enters $F$ exactly when it wins its flip. So the probability that $e$ is in $F$ is $p$ times the probability that $e$ is in $L$. Here: $bd$ lost its flip, so it stays out of $F$.
:::

::: step
The size of $F$ is a sum of indicators, one per edge, and so is the size of $L$. Expectation is linear, so each expected size is the sum of the probabilities from the last step. Hence $\mathbb{E}[\abs{F}] = p \cdot \mathbb{E}[\abs{L}]$. Here: over all 4096 samples, $F$ averages about 5.39 edges and $L$ about 10.79, exactly twice as many.
:::

::: step
[[fig:a01-sampling-count#F|$F$]] is a [[def:forest-tree|forest]] on the $n$ vertices of $G$. A forest with $c$ components has $n - c$ edges, and $c$ is at least 1, so $F$ has at most $n - 1$ edges. This holds for every sample, so it holds for the average: $\mathbb{E}[\abs{F}] \le n - 1$. Here: 6 edges, and $n - 1$ is 7.
:::

::: step
The last two steps give $p \cdot \mathbb{E}[\abs{L}] \le n - 1$. The lemma assumes $p$ positive, so we may divide by $p$: the expected size of $L$ is at most $n - 1$ over $p$, below $n$ over $p$. We never need $p$ below 1. Here: $n$ is 8 and $p$ one half: bounds 14 and 16.
:::
::::

:::: proof
We generate $H$ and $F$ at the same time by the following process, which is basically Kruskal's algorithm on $G$, flipping the coin for each edge at the moment it is
processed:

```pseudo
sort edges according to w into a non-decreasing sequence
F, E', L ← ∅
foreach e = {u, v} in this order do
    with probability p: E' ← E' ∪ {e}
    if e connects two different trees of (V, F) then
        L ← L ∪ {e}
        if e ∈ E' then F ← F ∪ {e}
```

*Claims.* $(V, E')$ is exactly the random subgraph $H$ (each edge is included independently with probability $p$). $(V, F)$ is the minimum spanning forest of $H$: the
process is Kruskal's algorithm run on the edges of $H$ (edges not in $E'$ are skipped for $F$). And $L$ is the set of $F$-light edges of $G$: an edge $e$ is $F$-heavy iff its
ends are joined by an $F$-path of lighter edges, i.e. iff its ends are already in the same tree of $F$ when $e$ is processed (later edges are heavier and cannot help;
earlier edges of $F$ are lighter).

*Counting.* $\abs{L}$ and $\abs{F}$ are random variables. Whether $e \in L$ depends only on the coin flips of earlier edges, and then $e$ enters $F$ with probability $p$,
independently. Hence $\mathbb{E}[\abs{F}] = p \cdot \mathbb{E}[\abs{L}]$. Since $F$ is a forest, $\abs{F} \le n - 1$, so $\mathbb{E}[\abs{F}] \le n - 1$ and
$$\mathbb{E}[\abs{L}] \le \frac{n - 1}{p} \le \frac{n}{p}.$$
::::
