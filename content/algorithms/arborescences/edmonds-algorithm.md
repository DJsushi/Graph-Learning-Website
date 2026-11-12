---
title: "Edmonds' branching algorithm"
course: algorithms
chapter: arborescences
order: 3
lectures: [a01]
stage: split
status: draft
---

**Idea.** (1) Compute the cheapest edge $e_v$ for each $v$, obtaining a subgraph $F$. (2) If $F$ is an arborescence, return it. (3) Otherwise compute the reduced weights (the edges of
$F$ get weight $0$), (4) contract all cycles of $F$, obtaining $D'$, (5) solve recursively on $D'$ with the reduced weights, (6) expand the contracted cycles, removing one edge of each,
and (7) return the arborescence.

::: algorithm {#alg:edmonds-branching title="Edmonds' branching algorithm (Chu–Liu 1965, Edmonds 1967)" source="algorithms/01 p54"}
```pseudo
EdmondsBranching(D, r, w):
    F ← ∅                                                  // @init
    foreach v ∈ V(D) \ {r} do                              // @loop
        e_v ← edge of minimum weight entering v            // @select
        add e_v to F                                       // @add
        foreach e = (u, v) ∈ E(D) do w'(e) ← w(e) − w(e_v)  // @reduce
    if (V, F) is an arborescence then                      // @test
        return T = (V, F)                                  // @done
    else
        contract directed cycles in (V, F)                 // @contract
        let D' be the resulting graph                      // @newgraph
        T' ← EdmondsBranching(D', r, w')                   // @recurse
        T ← T' with cycles expanded back (minus one edge)  // @expand
        return T                                           // @return
```
:::

When a cycle $C$ is contracted to a vertex $v_C$, an arc $(x, y)$ with $x \notin C$, $y \in C$ becomes an arc $(x, v_C)$ with weight $w'(x, y)$, an arc leaving $C$ keeps its weight, and arcs
inside $C$ disappear. When expanding, if $T'$ enters $v_C$ by the arc coming from $(x, y)$, we add $(x, y)$ and all arcs of $C$ except the one entering $y$.

::: intuition {for=alg:edmonds-branching}
Either the cheapest incoming arcs already form an arborescence, and we are done by [[prop:arborescence-sufficient]], or they contain a cycle of reduced
weight $0$. Inside such a cycle everything is free, so the only real decision is where to enter it, and contracting it to one vertex asks exactly
that question. Example: in [[fig:a01-reduced-weights]], contracting $C = a \to d \to c \to a$ to $v_C$ leaves two arcs $r \to v_C$ of reduced weight $1$
(from $(r, a)$ and $(r, c)$) and arcs $v_C \to b$, $v_C \to e$ of reduced weight $0$ (from $(a, b)$ and $(d, e)$). The cheapest entering arcs now form
an arborescence of reduced cost $1$. Expanding with $(r, a)$ adds $a \to d \to c$ and gives $ra, ab, ad, dc, de$ of cost $22$; expanding with $(r, c)$
gives the other optimum $rc, ca, ad, ab, de$.
:::

```graph id=a01-edmonds-player widget=player
caption: Edmonds' algorithm on the example: the cheapest incoming arcs form a cycle, which is contracted; the recursive solution is expanded back. (Either of the two optimal arborescences of cost 22 may come out.)
intent: Algorithm player with contraction (structure changes between steps).
type: directed
algo: edmonds-branching
params: root=r
layout: fixed
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=2]; a -> b [w=6]; r -> c [w=5]; c -> a [w=1]; a -> d [w=3]
a -> e [w=8]; b -> e [w=9]; d -> c [w=4]; d -> e [w=7]
```

**Complexity.** There are at most $n$ [[def:edge-contraction|contractions]] in total (each reduces the number of vertices); finding and contracting cycles takes time $\O(m)$, and expanding $T'$ to $T$ takes $\O(m)$.
**Total time: $\O(m \cdot n)$.**

::: theorem {#thm:ggst-arborescence title="Faster min-cost arborescences" source="algorithms/01 p56"}
**(Gabow, Galil, Spencer, Tarjan 1985)** There exists an $\O(m + n \log n)$ time algorithm to compute a min-cost arborescence.
:::

::: intuition
The straightforward implementation of Edmonds' algorithm rebuilds the graph after every contraction, which costs $\O(m)$ up to $n$ times. A more careful
implementation avoids this and reaches the same bound as Jarník's algorithm with Fibonacci heaps, $\O(m + n \log n)$; so the directed problem can be
solved as fast as Jarník solves the undirected one. Example: for $m = n^2$ this is $\O(n^2)$ instead of $\O(n^3)$.
:::
