---
title: "Karger's contraction algorithm"
course: algorithms
chapter: global-min-cut
order: 4
lectures: [a03]
stage: split
status: draft
---

A completely different idea: contract random edges. An edge of a minimum cut is unlikely to be chosen, since there are few of them.

::: algorithm {#alg:karger title="CONTRACT (Karger 1993)" source="algorithms/03 p41"}
```pseudo
CONTRACT(G)
    while |V| > 2 do                                                    // @loop
        e ← a random edge, Pr[e] = 1/|E|                            // @choose
        G ← G_e                                                         // @contract
    return the unique cut of G                                          // @return
```
:::

- The probability that we get a correct result is "small", but the algorithm can be **iterated** and the best cut kept.
- It works for **unweighted multigraphs**: parallel edges are kept, and an edge with $k$ parallel copies is chosen with probability $k/\abs{E}$.
- For **weighted** graphs, choose the edge $e$ with probability $c(e)/c(E)$. (Merging parallel edges into one edge with the summed [[def:flow-network|capacity]] is then
  equivalent, which is what the player below does.)
- **Complexity:** $n - 2$ iterations of the main loop, each [[def:edge-contraction|contraction]] in time $\O(n)$ (with a matrix of capacities); total time $\O(n^2)$.

The returned cut is the set of edges between the two remaining vertices; as a cut of the original graph it is $\delta(S)$ for the set $S$ of
vertices merged into one of them ([[obs:identification-cuts]]).

::: intuition {for=alg:karger}
Contracting an edge glues its ends, so it can never destroy a cut that does not contain this edge. A minimum cut has few (or light) edges, so most
random contractions miss it, and if they all miss it, it is what remains at the end. Example: in [[fig:a03-karger-good]], two $K_4$'s are joined by
two edges; the run contracts only edges inside the $K_4$'s and returns the minimum cut of size $2$. In [[fig:a03-karger-bad]], an edge between the
$K_4$'s is contracted and the run returns a cut of size $4$.
:::

```graph id=a03-karger-good widget=player
caption: One run of CONTRACT on two copies of $K_4$ joined by the edges $15$ and $48$ (unweighted; labels show how many original edges a merged edge stands for). This run (seed 5) never contracts $15$ or $48$ and returns the minimum cut of size $2$.
intent: Karger's algorithm player on an unweighted multigraph with a unique minimum cut; successful run. Seed chosen so that the run succeeds.
algo: karger
params: seed=5
layout: fixed
1 @(0, 1); 2 @(-1, 0); 3 @(0, -1); 4 @(1, 0); 5 @(2.5, 1); 6 @(4.5, 1); 7 @(4.5, -1); 8 @(2.5, -1)
1 -- 2; 1 -- 3; 1 -- 4; 2 -- 3; 2 -- 4; 3 -- 4; 5 -- 6; 5 -- 7; 5 -- 8; 6 -- 7; 6 -- 8; 7 -- 8; 1 -- 5; 4 -- 8
```

```graph id=a03-karger-bad widget=player
caption: Another run of CONTRACT on the same graph (seed 1). It contracts an edge of the minimum cut, and returns a cut of size $4$.
intent: Karger's algorithm player; unsuccessful run, to show that a single run may fail.
algo: karger
params: seed=1
layout: fixed
1 @(0, 1); 2 @(-1, 0); 3 @(0, -1); 4 @(1, 0); 5 @(2.5, 1); 6 @(4.5, 1); 7 @(4.5, -1); 8 @(2.5, -1)
1 -- 2; 1 -- 3; 1 -- 4; 2 -- 3; 2 -- 4; 3 -- 4; 5 -- 6; 5 -- 7; 5 -- 8; 6 -- 7; 6 -- 8; 7 -- 8; 1 -- 5; 4 -- 8
```
