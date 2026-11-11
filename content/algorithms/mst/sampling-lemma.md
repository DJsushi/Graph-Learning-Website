---
title: "The sampling lemma"
course: algorithms
chapter: mst
order: 17
lectures: [a01]
stage: split
status: draft
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
edges, where $c$ is the number of components ([[cor:forest-edges]]). Kruskal's algorithm computes it without any change, since it never uses
connectivity. Example: for two disjoint triangles with weights $1, 2, 3$ each, the MSF consists of the four edges of weights $1$ and $2$.
:::

::: lemma {#lem:sampling title="Sampling lemma" aka="Karger–Klein–Tarjan sampling lemma" source="algorithms/01 p40, p45"}
**(Karger, Klein, Tarjan 1995)** Let $H \subseteq G$ be a subgraph obtained from $G$ by including each edge independently with probability $p$, where $0 < p < 1$, and let $F$
be the minimum spanning forest of $H$. The expected number of $F$-light edges in $G$ is at most $n/p$.
:::

::: intuition
A random sample of the edges already knows most of the MST: whatever $m$ is, on average at most $n/p$ edges of $G$ survive the $F$-light test.
The reason is in the proof: run Kruskal on $G$ and flip the coin for an edge only when it reaches it. Every $F$-light edge gets a coin flip that, with
probability $p$, adds an edge to $F$, and $F$ can never get more than $n - 1$ edges. Example: $n = 100$, $m = 5000$, $p = 1/2$: in expectation at most
$200$ edges are $F$-light, so at least $4800$ edges are discarded.
:::

::: pitfall
The $F$-light edges are counted in all of $G$, not only in $H$. And the bound is on the **expected** number; a single unlucky sample may leave many
more light edges.
:::

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
