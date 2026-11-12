---
title: Minimum spanning trees
course: algorithms
lecture: 1
slug: a01
summary: The MST problem, cut and cycle properties, the generalized greedy algorithm, Kruskal, Jarník (Prim), Borůvka, contractions, Fredman–Tarjan, Gabow et al., the randomized Karger–Klein–Tarjan algorithm, and minimum-cost arborescences (Edmonds).
prerequisites: [theory/03-trees]
sources:
  - resources/graph-algorithms/01-mst.pdf
status: draft
---

You must connect $n$ cities by a network (roads, cables, pipes) and you know the cost of building each
possible direct link. What is the cheapest way to connect all the cities? The cheapest network never
contains a cycle, since one link of the cycle could be dropped. So it is a spanning tree, and we want one of
minimum total cost. This **minimum spanning tree** problem is one of the oldest problems of combinatorial
optimisation (Borůvka, 1926), it has elegant greedy algorithms, and its exact complexity is still a research
topic. This lesson follows its story from the classical algorithms to the randomized linear-time algorithm,
and ends with the much harder directed version.

## Summary

- MST: spanning tree of minimum weight ([[def:mst]]). Cut property: the lightest edge across a cut ([[def:cut]]) is in $M$; cycle property: the heaviest edge on a cycle is not
  ([[thm:cut-property]], [[thm:cycle-property]]); with distinct weights both become characterisations ([[thm:strong-cut-cycle]]).
- Generalized greedy: blue and red rules in any order.
- Kruskal $\O(m \log n)$ with union-find ([[alg:kruskal]]); Jarník $\O(n^2)$, $\O(m \log n)$, or $\O(m + n \log n)$ with Fibonacci heaps ([[alg:jarnik]]); Borůvka $\O(m \log n)$
  ([[alg:boruvka]]), naturally expressed with [[def:edge-contraction|contractions]] ([[lem:contraction-mst]]).
- Fredman–Tarjan $\O(m \beta(m, n))$ by limiting heap sizes; packets give $\O(m \log \beta(m, n))$.
- [[def:f-heavy|F-heavy]] edges are never in the MST ([[lem:f-heavy-not-in-mst]]); MST verification is linear ([[cor:mst-verification]]); the sampling lemma ([[lem:sampling]]) for the
  [[def:msf|MSF]] of a random sample gives the randomized
  Karger–Klein–Tarjan algorithm in expected $\O(m + n)$ ([[thm:kkt-complexity]]).
- Directed version: min-cost [[def:arborescence|arborescences]]; [[def:reduced-weights|reduced weights]] and cycle contraction (Edmonds, $\O(mn)$, [[alg:edmonds-branching]]).

## Exercises

```graph id=a01-ex-mst widget=exercise
task: select-edges
prompt: Select the edges of the minimum spanning tree.
check: is-mst
hint: Kruskal: take the edges in increasing order of weight and skip those that would close a cycle.
solution: Kruskal accepts $ef$ (1), $bc$ (2), $de$ (3), $ab$ (4), $cf$ (5), $dg$ (6) and $ch$ (7); then all 8 vertices are connected. The MST has weight $28$; the edges $cd$ (8), $gh$ (9), $ad$ (10) and $fg$ (11) are not in it.
a -- b [w=4]; b -- c [w=2]; c -- d [w=8]; a -- d [w=10]; d -- e [w=3]; e -- f [w=1]; c -- f [w=5]; d -- g [w=6]; g -- h [w=9]; c -- h [w=7]; f -- g [w=11]
```

```graph id=a01-ex-kruskal-simulate widget=exercise
task: simulate
algo: kruskal
prompt: Perform Kruskal's algorithm yourself: click the edges in the order in which Kruskal accepts them.
hint: Rejected edges are skipped; only click accepted edges.
solution: Accepted in this order: $cf$ (1), $de$ (2), $fh$ (3), $ab$ (4), $ef$ (5), $dg$ (6), $ac$ (8). The edge $ce$ (7) is rejected because $c$ and $e$ are already connected.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

```graph id=a01-ex-arborescence widget=exercise
task: select-edges
type: directed
prompt: Select a minimum-cost arborescence rooted at $r$.
check: is-min-arborescence root=r
hint: First pick the cheapest arc entering each vertex. Is the result an arborescence?
solution: The cheapest entering arcs are $(r, a)$ 3, $(a, b)$ 1, $(b, c)$ 2 and $(c, d)$ 2; they form an arborescence of cost $8$, which is therefore optimal by [[prop:arborescence-sufficient]].
r [class=source]
r -> a [w=3]; r -> b [w=6]; a -> b [w=1]; b -> c [w=2]; a -> c [w=4]; c -> d [w=2]; b -> d [w=5]; d -> a [w=7]
```

:::: exercise {#exr:a01-max-spanning-tree title="Maximum spanning trees" difficulty=1}
How can you find a spanning tree of **maximum** weight? Does Kruskal's algorithm work with negative weights?

::: solution
Negate all weights (or sort in decreasing order) and run any MST algorithm: a maximum spanning tree for $w$ is a [[def:mst|minimum spanning tree]] for $-w$. All MST algorithms
in this lesson only **compare** weights (none of the proofs uses positivity), so negative weights are fine; equivalently, adding a constant to all weights changes the
weight of every spanning tree by the same amount $(n-1) \cdot c$.
:::
::::

:::: exercise {#exr:a01-bottleneck title="Bottleneck paths" difficulty=2}
Show that for any two vertices $u, v$, the path between them in the MST minimizes the maximum edge weight over all $u$–$v$ paths in $G$ (a **minimum bottleneck path**).

::: solution
Let $P$ be the $u$–$v$ path in $M$ and $e$ its heaviest edge. Removing $e$ from $M$ gives a cut $(S, V \setminus S)$ with $u$ and $v$ on different sides. Every $u$–$v$ path $Q$ in $G$
crosses this cut at some edge $f$. By the strong cut property, $e \in M$ is the lightest edge across this cut (it is the only $M$-edge across it, and the argument of
[[thm:strong-cut-cycle]] shows $w(f) \ge w(e)$). So the maximum weight on $Q$ is at least $w(f) \ge w(e)$, the maximum on $P$.
:::
::::

:::: exercise {#exr:a01-boruvka-phases title="Borůvka phases" difficulty=2}
Give a family of graphs on which Borůvka's algorithm really needs $\Theta(\log n)$ phases.

::: solution
Take the path $P_{n-1}$ on vertices $1, \dots, n$ with $n = 2^k$, and weights chosen such that in every phase each component is merged with exactly one other component: e.g.
give the edge $\set{i, i+1}$ the weight $t(i)$, where $t(i)$ is the number of trailing zeros of $i$ (ties broken by $i$). In phase 1 vertex pairs $\set{2j-1, 2j}$ merge (their edge has
weight $0$); in phase 2 the pairs of pairs merge (weight $1$), and so on. The number of components halves exactly in each phase, so there are $k = \log n$ phases.
:::
::::

:::: exercise {#exr:a01-second-best title="Second-best spanning tree" difficulty=3}
Show that (with distinct weights) a second-best spanning tree (minimum weight among spanning trees different from $M$) can be obtained from $M$ by a single exchange
$M + e - f$.

::: solution
Let $T \ne M$ be a spanning tree of minimum weight among those different from $M$, and let $g$ be the lightest edge in the symmetric difference of $E(T)$ and
$E(M)$.

*$g$ cannot lie in $T \setminus M$.* Otherwise, by the strong cycle property ([[thm:strong-cut-cycle]]), $g$ would be the heaviest edge of the cycle $C$ in $M + g$. This cycle is not
contained in $T$ (as $T$ is acyclic), so it has an edge $h \in M \setminus T$; then $h$ is in the symmetric difference and $w(h) < w(g)$, contradicting the choice of $g$.

*So $g \in M \setminus T$.* The cycle in $T + g$ is not contained in $M$, so it has an edge $h \in T \setminus M$, and $w(h) > w(g)$ by the choice of $g$ and distinctness. Then
$T' = T + g - h$ is a spanning tree with $w(T') < w(T)$. By the choice of $T$, this is only possible if $T' = M$. Hence $T = M - g + h$ is obtained from $M$ by a single exchange.
:::
::::

:::: quiz {#q:a01-kruskal-complexity}
What dominates the running time of Kruskal's algorithm?

- [x] Sorting the edges
- [ ] The union-find operations
- [ ] Reading the input

::: explanation
Sorting takes $\O(m \log n)$; the union-find operations take only $\O(m \alpha(n))$ in total ([[prop:kruskal-complexity]]).
:::
::::

:::: quiz {#q:a01-boruvka-phases}
At most how many phases does Borůvka's algorithm need on a graph with $1024$ vertices?

answer: 10

::: explanation
Each phase at least halves the number of components, so after $\log_2 1024 = 10$ phases one component remains ([[prop:boruvka-complexity]]).
:::
::::

:::: quiz {#q:a01-jarnik-fib}
What is the running time of Jarník's algorithm with Fibonacci heaps?

- [ ] $\O(m \log n)$
- [x] $\O(m + n \log n)$
- [ ] $\O(n^2)$
- [ ] $\O(m \beta(m, n))$

::: explanation
$m$ `DECREASE-KEY` operations in $\O(1)$ amortised and $n$ `EXTRACT-MIN` operations in $\O(\log n)$ amortised.
:::
::::

:::: quiz {#q:a01-f-light-count}
Edges of a graph with $n = 1000$ vertices are sampled with probability $p = 1/2$, and $F$ is the [[def:msf|MSF]] of the sample. At most how many $F$-light edges are expected?

answer: 2000

::: explanation
By the sampling lemma ([[lem:sampling]]), at most $n/p = 2000$.
:::
::::
