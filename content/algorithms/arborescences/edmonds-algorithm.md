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

**Correctness** follows by induction on the number of vertices of $D$; the key part is that $T'$ can be expanded to a min-cost arborescence of $D$:

::: lemma {#lem:edmonds-one-entry title="One arc entering the cycle" extra=true}
Let $C$ be a directed cycle consisting of arcs $e_v$ (so of reduced weight $0$). Then there is an arborescence, optimal with respect to $w'$, that has exactly one arc entering $C$ (from a
vertex outside $C$) and contains all arcs of $C$ except the one entering the head of that arc.
:::
<!-- REVIEW: statement now also says which arcs inside C are used (the proof constructs exactly this); needed for the correspondence with D' below. -->

::: proof
Let $T$ be optimal for $w'$. Note $r \notin C$ (no arc enters $r$). Since $r$ reaches $C$ in $T$, choose a directed path in $T$ from $r$ to a vertex of $C$ that meets $C$ only in its last vertex $b$;
let $(a, b)$ be its last arc. Let $T'$ arise from $T$ by deleting every arc that enters a vertex of $C$, and adding $(a, b)$ back together with all arcs of $C$ except the one entering $b$.

*Cost:* we removed arcs of non-negative reduced weight and added arcs of $C$, of reduced weight $0$; so $w'(T') \le w'(T)$.

*$T'$ is an arborescence:* every vertex $v \ne r$ still has exactly one entering arc (vertices outside $C$ are unchanged; $b$ gets $(a, b)$; the other vertices of $C$ get their $C$-arc). And every
vertex is reachable from $r$: the path from $r$ to $a$ avoids $C$ and all its arcs are kept, so $r$ reaches $a$, $b$, and along $C$ all of $C$. For any other vertex $v$, follow its path from $r$ in
$T$ backwards from $v$ until the first time it hits a vertex of $C$ or $r$; this part has no arc entering $C$, so it is kept in $T'$, and its start is reachable from $r$ in $T'$. A digraph in which
every vertex except $r$ has in-degree exactly $1$ and every vertex is reachable from $r$ is an arborescence (it has $n - 1$ arcs and is connected).

So $T'$ is optimal, has exactly one arc entering $C$, and contains all arcs of $C$ except the one entering $b$.
:::

::: intuition {for=lem:edmonds-one-entry}
The arcs of $C$ cost nothing in reduced weights. Once an optimal arborescence enters $C$ somewhere, say at $b$, it can reach the rest of $C$ for free
along the cycle, so any further arcs entering $C$ can be dropped without loss. Example: in [[fig:a01-reduced-weights]], an arborescence entering
$C = a \to d \to c \to a$ at $a$ by $(r, a)$ keeps $a \to d$ and $d \to c$ and drops $c \to a$.
:::

The cycles of $F$ are vertex-disjoint (each vertex has only one arc $e_v$), and the construction of the lemma for one cycle changes only arcs entering that cycle. So we can apply it to
the cycles one after another and get an optimal arborescence of $D$ (for $w'$) that, for every contracted cycle $C$, enters $C$ by exactly one arc and contains all arcs of $C$ except one.
Such arborescences correspond bijectively to arborescences of $D'$ (contract each $C$; expand by adding $C$ minus the arc entering the head of the entering arc), and since the arcs of $C$
have reduced weight $0$, the correspondence preserves $w'$. Every arborescence of $D'$ expands, so the optimum over $D$ equals the optimum over $D'$; by induction, the recursive call finds
the latter, and expanding it gives an optimal arborescence of $D$ (for $w'$, hence for $w$ by [[obs:reduced-weights]]).
<!-- REVIEW: was "arborescences with exactly one arc entering C correspond to arborescences of D'", which fails when chords inside C are used; now uses the strengthened lemma and treats all contracted cycles at once. -->

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
