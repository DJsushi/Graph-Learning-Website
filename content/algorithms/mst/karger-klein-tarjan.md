---
title: "The Karger–Klein–Tarjan algorithm"
course: algorithms
chapter: mst
order: 18
lectures: [a01]
stage: split
status: reviewed
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

The proof adds up the cost of every line of the algorithm and of its two recursive calls. This gives a recurrence for the expected running time.

:::: walkthrough {for=thm:kkt-complexity}
```graph id=a01-kkt-recurrence widget=stepper
caption: One run of the algorithm on a graph with 12 vertices and 14 edges. Thick edges are chosen by a Borůvka phase, dashed edges lost the sampling, and the faded edge is $F'$-heavy.
intent: New figure (the lecture, algorithms/01 p42 to p44, has no picture). A graph on which two Borůvka phases with contractions leave 3 vertices, after removing parallel edges. It has 12 vertices because 3 vertices need n of at least 12. Marks show the edges of the two phases, the removed parallel edges, the three edges of G2 and the forest F'.
layout: fixed
a @(0, 0.6); b @(0, 0); c @(0.6, 0); d @(0.6, 0.6); e @(1.4, 1.4); f @(1.4, 0.8); g @(2, 0.8); h @(2, 1.4); i @(2.8, 0.6); j @(2.8, 0); k @(3.4, 0); l @(3.4, 0.6)
a -- b [id=ab w=1]; c -- d [id=cd w=2]; e -- f [id=ef w=3]; g -- h [id=gh w=4]; i -- j [id=ij w=5]; k -- l [id=kl w=6]
b -- c [id=bc w=7]; f -- g [id=fg w=8]; j -- k [id=jk w=9]; d -- e [id=de w=10]; h -- i [id=hi w=11]; c -- j [id=cj w=12]; c -- f [id=cf w=13]; a -- c [id=ac w=14]
mark V: a b c d e f g h i j k l
mark F1: a--b c--d e--f g--h i--j k--l
mark D1: a--c c--f
mark F2: b--c f--g j--k
mark G2: d--e h--i c--j
mark Fp: d--e h--i
step: Run the algorithm on $G$.
class highlight: a b c d e f g h i j k l
step: Phase 1: every vertex chooses its lightest edge.
class tree: a--b c--d e--f g--h i--j k--l
step: Contract the chosen edges: $G_1$ has 6 vertices.
merge a b -> p
merge c d -> q
merge e f -> r
merge g h -> s
merge i j -> t
merge k l -> u
step: Keep only the lightest of parallel edges.
remove @ac @cf
step: Phase 2 on $G_1$ chooses three more edges.
class tree: @bc @fg @jk
step: Contract them: $G_2$ has 3 vertices.
merge p q -> x
merge r s -> y
merge t u -> z
step: $G_2$ has three edges.
class bold: @de @hi @cj
step: Sample $H$: only $de$ and $hi$ survive.
class dashed: @cj
step: The first recursive call returns $F'$.
unclass bold: @de @hi
class tree: @de @hi
step: Make $F'$ a spanning tree $T$ with dummy edges.
class path: @de @hi
step: The theorem gives $w_T(e)$ for every edge.
class highlight: x y z
step: An edge is light when it is not above its $F'$-path.
unclass dashed: @cj
class muted: @cj
step: Sampling lemma: few edges are $F'$-light.
unclass highlight: x y z
class bold: @de @hi
step: Second recursive call on $H'$.
remove @cj
step: Add up the costs.
class current: x y z
```

::: step
We write $T(n, m)$ for an upper bound on the expected time on a graph with $n$ vertices and $m$ edges, and we take a graph with at least one edge. We add up the cost of two Borůvka phases, of sampling and filtering, and of two recursive calls. Here: [[fig:a01-kkt-recurrence#V|$G$]] has 12 vertices and 14 edges.
:::

::: step
First we run one Borůvka phase on $G$. Finding the lightest edge of every vertex takes time $\O(n + m)$: one scan over the edges, as in [[prop:boruvka-complexity|the analysis of Borůvka's algorithm]]. Here: each vertex chooses its lightest edge, and [[fig:a01-kkt-recurrence#F1|six edges]] (weights 1 to 6) are chosen.
:::

::: step
We contract the chosen edges. Every vertex with an edge chooses one, so every new vertex contains at least two old ones. (A vertex without edges would not merge, so the phase deletes it.) Hence $G_1$ has at most $n/2$ vertices. Here: 6 vertices, and 12 divided by 2 is 6.
:::

::: step
Contraction can leave parallel edges. We keep only the lightest of them, which keeps the MST by [[lem:contraction-mst]]. Relabelling the ends of the edges and removing the duplicates takes time $\O(n + m)$, by two passes of bucket sort (see [[alg:boruvka-contract]]). Here: [[fig:a01-kkt-recurrence#D1|$ac$ and $cf$]] go: $bc$ (7) beats $ac$ (14), and $de$ (10) beats $cf$ (13).
:::

::: step
The second phase runs on $G_1$. This graph has at most $n/2$ vertices and at most $m$ edges, because contraction and clean-up only delete edges. So choosing, contracting and cleaning up take time $\O(n + m)$ again. Here: [[fig:a01-kkt-recurrence#F2|$bc$, $fg$ and $jk$]] (7, 8 and 9) are chosen.
:::

::: step
We contract and clean up again. The same argument halves the vertex count once more, so $G_2$ has at most $n/4$ vertices. Here: 3 vertices, and 12 divided by 4 is 3. No parallel edges appear this time.
:::

::: step
Contraction and clean-up only delete edges and never create them. So $G_2$ has at most $m$ edges. Here: [[fig:a01-kkt-recurrence#G2|3 edges]] are left, against 14.
:::

::: step
Now we build $H$: we flip one coin per edge of $G_2$ and keep the edge with probability one half. This takes time linear in the size of $G_2$, so at most $\O(n + m)$. Here: $de$ and $hi$ survive, and $cj$ loses its flip.
:::

::: step
$H$ has the vertices of $G_2$: at most a quarter of $n$. Each edge survives with probability one half, so by linearity of expectation $H$ has at most half of $m$ edges in expectation. The first recursive call therefore takes time $T(n/4, m/2)$. Here: expected 3/2 edges; [[fig:a01-kkt-recurrence#Fp|$F'$]] is $\set{de, hi}$.
:::

::: step
Next we compute the $F'$-light edges. [[thm:mst-verification]] needs a spanning tree, but $F'$ is only a forest. So we add dummy edges of weight infinity, to $G_2$ and to $F'$, which join the trees of $F'$ into a spanning tree $T$. There are fewer than $\abs{V(G_2)}$ of them. Here: $F'$ already spans $x$, $y$ and $z$: no dummy edge.
:::

::: step
The theorem gives $w_T$ for every edge $e$ of $G_2$ in time linear in the size of the graph. This graph has at most a quarter of $n$ vertices, at most $m$ edges, and fewer dummy edges than vertices. So the time is $\O(n + m)$.
:::

::: step
Two cases. If the ends of $e$ lie in one tree of $F'$, the $T$-path stays in $F'$, so its heaviest edge defines $w_{F'}(e)$. If they lie in two trees, the path uses a dummy edge of weight infinity, and $w_{F'}(e)$ is infinite by definition: $e$ is light. Here: $cj$ (12) is above the path weight 11: heavy.
:::

::: step
The algorithm samples $G_2$ with probability one half, and $F'$ is the MSF of the sample. This is the setting of [[lem:sampling|the sampling lemma]]. So the expected number of $F'$-light edges is at most $2\abs{V(G_2)} \le n/2$. Here: the bound is 6. This sample has 2 light edges; averaged over all 8 samples, 2.75.
:::

::: step
$H'$ has the vertices of $G_2$, at most a quarter of $n$. Its edges are the $F'$-light edges, at most half of $n$ in expectation. So the second recursive call takes time $T(n/4, n/2)$. Here: $H'$ has the 2 edges $de$ and $hi$, and the heavy edge $cj$ is gone.
:::

::: step
We choose one constant $c$ so that all work outside the recursive calls costs at most $c(n + m)$. Adding the two calls gives, for every graph with an edge, $T(n, m) \le c(n + m) + T(n/4, m/2) + T(n/4, n/2)$. Here: $G$ has 12 vertices and 14 edges, and the calls are on $H$ and $H'$.
:::
::::

We now check that this recurrence has a linear solution. The check is an induction on the size of the input, where the two calls are smaller subproblems.

:::: walkthrough {for=thm:kkt-complexity}
```graph id=a01-kkt-recursion widget=stepper
caption: The recursion tree of a call with $n = 64$ and $m = 256$. Each vertex shows the size $2n + m$ of its call. The faded vertices stand for calls on graphs without edges, one with a vertex and one empty.
intent: New figure (the lecture, algorithms/01 p44, has no picture). A recursion tree with the numbers n = 64, m = 256, where the sizes stay whole numbers. Marks show the root, the two calls of the root, the calls below them, a call on one vertex and a call on the empty graph.
layout: fixed
r @(1.5, 1.2) [label=384]
mark root: r
step: The call on $G$: size $2n + m$.
class highlight: r
step: Base case: no edges, at least one vertex.
o @(0.2, 1.2) [label=2]
class muted: o
mark base: o
step: Base case: the empty graph.
z @(2.8, 1.2) [label=0]
class muted: z
mark empty: z
step: Its two recursive calls are smaller.
l @(0.75, 0.6) [label=160]; k @(2.25, 0.6) [label=64]
l -- r; k -- r
mark calls: l k
class current: l k
step: Take expectations: bound by size.
class bold: l k
unclass current: l k
step: Simplify the two bounds.
class highlight: l k
step: Add the three terms.
class path: r l k
step: The same holds below.
l1 @(0.375, 0) [label=72]; l2 @(1.125, 0) [label=16]; k1 @(1.875, 0) [label=24]; k2 @(2.625, 0) [label=16]
l -- l1; l -- l2; k -- k1; k -- k2
mark below: l1 l2 k1 k2
class muted: l1 l2 k1 k2
```

::: step
We prove $T(n, m) \le 2c(2n + m)$ by induction on the size of the input, which is $2n + m$. We assume the bound for all smaller inputs and show it for this one. Here: [[fig:a01-kkt-recursion#root|the top call]] has $n$ equal to 64 and $m$ equal to 256, so its size is 384.
:::

::: step
Base case, first kind: no edges, at least one vertex. Line 1 returns in constant time. For $m$ equal to 0 the bound is $4cn$. As $n$ is at least 1, this is at least 4c, which covers the constant once $c$ is large. Here: [[fig:a01-kkt-recursion#base|a call on one vertex]] has size 2 and bound 4c.
:::

::: step
Base case, second kind: no vertices. If $G$ is one edge, then $G_2$ and $H$ are empty. The bound is 0, but the call costs a constant. The caller's own term $c(n + m)$ pays it: the caller has an edge, so $n$ is at least 2 and the term is at least 3c. Here: [[fig:a01-kkt-recursion#empty|the empty call]]: size 0.
:::

::: step
Now the graph has an edge, so the recurrence holds. Each call has at most a quarter of $n$ vertices and at most $m$ edges, as $H$ and $H'$ lie in $G_2$. Its size is at most $n/2 + m$, below $2n + m$: the hypothesis applies to the actual, random sizes. Here: expected sizes 160 and 64, against 384.
:::

::: step
The bound is linear in the size, and expectation is linear, so a call costs at most 2c times its expected size. Expected: the first call has a quarter of $n$ vertices and half of $m$ edges; the second has a quarter of $n$ and half of $n$ ([[lem:sampling|sampling lemma]]). Here: [[fig:a01-kkt-recursion#calls|the calls]] cost at most 320c and 128c.
:::

::: step
We simplify each bound. The first call has expected size half of $n$ plus half of $m$, so twice that is $n$ plus $m$, and its bound is $c(n + m)$. The second call has expected size $n$, so its bound is $2cn$. Here: 320c is c times 320, and 128c is 2c times 64.
:::

::: step
The recurrence now gives at most $c(n + m) + c(n + m) + 2cn$. These terms add up to $4cn + 2cm = 2c(2n + m)$, the claimed bound, so the induction step is done. Here: 320c, 320c and 128c add up to 768c, and twice c times 384 is 768c.
:::

::: step
Each call below is smaller than its parent, so every path ends in a call without edges, the base case. Hence $T(n, m) \le 2c(2n + m)$ for all inputs with at least one vertex. The empty top-level input costs $\O(1)$. Both are within $\O(n + m)$. Here: [[fig:a01-kkt-recursion#below|the calls below]] have sizes 72, 16, 24 and 16.
:::
::::

<!-- REVIEW: proof applies thm:mst-verification to a forest; walkthrough supplies the dummy-edge argument -->

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
