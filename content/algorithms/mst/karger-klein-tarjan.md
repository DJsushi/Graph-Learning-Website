---
title: "The Karger–Klein–Tarjan algorithm"
course: algorithms
chapter: mst
order: 18
lectures: [a01]
stage: split
status: draft
---

**A first attempt.** (1) Construct $H$ by selecting each edge of $G$ with probability $1/2$. (2) Recursively find the MSF $F$ of $H$. (3) Find the $F$-heavy edges of $G$: they
cannot be in the MST. (4) Remove them, leaving an expected $2n$ or fewer edges. (5) Recursively find the MSF of the pruned graph. **Problems:** termination is unclear, the
second recursive call works on a graph with $m \simeq 2n$ edges and possibly no fewer vertices, and the algorithm never actually returns any edges. The fix is to shrink the
vertex set first, using Borůvka phases.

::: algorithm {#alg:kkt title="Karger–Klein–Tarjan algorithm" source="algorithms/01 p42"}
```pseudo
RandomizedMSF(G):
    if E = ∅ then return ∅                                   // @base
    (G1, F1) ← BoruvkaPhase(G)                               // @boruvka1
    (G2, F2) ← BoruvkaPhase(G1)                              // @boruvka2
    H ← random subgraph of G2, each edge with probability 1/2 // @sample
    F' ← RandomizedMSF(H)                                    // @recurse1
    E' ← F'-light edges of G2                                // @light
    H' ← G2[E']                                              // @prune
    F3 ← RandomizedMSF(H')                                   // @recurse2
    return F1 ∪ F2 ∪ F3                                      // @return
```
Here `BoruvkaPhase` performs one phase of Borůvka's algorithm with [[def:edge-contraction|contractions]], returning the contracted graph (with isolated vertices deleted)
and the selected edges.
<!-- REVIEW: added "isolated vertices deleted": the sample H may have isolated vertices, which do not merge, and |V(G2)| <= n/4 needs them gone. Implicit on slides. -->
:::

**Correctness** follows easily from the colour rules: the edge sets $F_1$ and $F_2$ are correct by the blue rule, the edges of $E(G_2) \setminus E'$ (the $F'$-heavy ones) can be
removed by the red rule ([[lem:f-heavy-not-in-mst]]), and the rest follows by induction and [[lem:contraction-mst]].

::: intuition {for=alg:kkt}
Each ingredient shrinks one parameter. The two Borůvka phases divide the number of vertices by at least $4$; sampling halves the number of edges for
the first recursive call; and the light-edge filter, by the sampling lemma, leaves only about $2 \abs{V(G_2)} \le n/2$ edges for the second call. The
first recursive call only serves to find a good forest $F'$ for the filter; the second one finds the actual [[def:msf|MSF]] of what survives. The
Borůvka phases also contribute real MST edges, which fixes the "never returns any edges" problem of the first attempt.
:::

::: theorem {#thm:kkt-complexity title="Expected linear time" source="algorithms/01 p44"}
The Karger–Klein–Tarjan algorithm runs in expected time $\O(n + m)$.
:::

::: proof
Let $T(n, m)$ be (an upper bound on) the expected running time on a graph with $n$ vertices and $m$ edges. One Borůvka phase runs in $\O(n + m)$ and at least halves the number
of vertices, so $G_2$ has at most $n/4$ vertices and at most $m$ edges. $H$ contains each edge of $G_2$ with probability $1/2$, so in expectation $\abs{E(H)} \le m/2$: the first
recursive call takes $T(n/4, m/2)$. The $F'$-light edges of $G_2$ are computed in time $\O(\abs{V(G_2)} + \abs{E(G_2)}) \le \O(n + m)$ ([[thm:mst-verification]]). By the
sampling lemma, the expected number of $F'$-light edges is at most $\abs{V(G_2)}/(1/2) = 2\abs{V(G_2)} \le n/2$, so the second recursive call takes $T(n/4, n/2)$. Hence
$$T(n, m) \le c \cdot (n + m) + T(n/4, m/2) + T(n/4, n/2).$$
We verify $T(n, m) \le 2c \cdot (2n + m)$ by induction: the right-hand side is at most
$$c(n + m) + 2c\left(\tfrac{2n}{4} + \tfrac{m}{2}\right) + 2c\left(\tfrac{2n}{4} + \tfrac{n}{2}\right) = c(n + m) + c(n + m) + 2cn = 2c(2n + m).$$
(Making this fully rigorous requires care with expectations of random sizes, using linearity of expectation and the fact that the bound is linear in its arguments.)
:::

::: intuition
Measure a subproblem by $2n + m$. The two recursive calls get, in expectation, $2 \cdot \tfrac{n}{4} + \tfrac{m}{2}$ and $2 \cdot \tfrac{n}{4} + \tfrac{n}{2}$,
together $\tfrac{3n}{2} + \tfrac{m}{2} \le \tfrac{3}{4}(2n + m)$. So the total size of all subproblems shrinks by a factor $\tfrac{3}{4}$ from one recursion
level to the next, and the linear work summed over all levels is a geometric series: $\O(n + m)$ in total. Example: for $n = 1000$ and $m = 4000$, the
measure $6000$ drops to at most $3500$ on the next level.
:::

::: remark
[[def:whp|With high probability]] the algorithm runs in time $\O(m)$: for a connected graph, the probability is $1 - e^{-\Omega(m)}$ (by Chernoff bounds). In the worst case it takes
$\O(\min\set{n^2, m \log n})$, the same bound as Borůvka.
:::
