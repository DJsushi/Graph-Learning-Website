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

## Notation and the problem

The algorithms course uses the following conventions:

- $G = (V, E)$ is a simple undirected graph, $E \subseteq \binom{V}{2}$; $D = (V, E)$ is a simple directed graph,
  $E \subseteq V \times V$.
- $n = \abs{V(G)}$, $m = \abs{E(G)}$; $\log n$ is the logarithm to base $2$.
- The **length** of a path is the number of its edges ([[def:path-graph]]); the **height** (depth) of a rooted tree is
  the length of its longest root-to-leaf path.
- $P$ denotes a path, $T$ a tree, $F$ a forest; $P_n, C_n, K_n, K_{m,n}$ are as in [[theory/01-basic-notions]], and
  $S_n$ is the star $K_{1,n}$.

Throughout, $G = (V, E)$ is an undirected **connected** graph with a **weight function** $w : E(G) \to \R^+$. The
**weight** of a subgraph $H$ is $w(H) = \sum_{e \in E(H)} w(e)$.

::: definition {#def:mst title="Minimum spanning tree" defines="minimum spanning tree, MST, weight" source="algorithms/01 p3"}
A **spanning tree** of $G$ is a subgraph $T \subseteq G$ such that $V(T) = V(G)$ and $T$ is a tree
([[def:spanning-tree]]). A **minimum spanning tree (MST)** of $G$ is a spanning tree $M$ such that $w(M) \le w(T)$ for
all spanning trees $T$ of $G$.
:::

::: intuition
Among the many spanning trees of $G$ we want the cheapest one. Why a tree at all: if a connected spanning subgraph
contained a [[def:cycle-graph|cycle]], deleting one edge of the cycle would keep it connected and, as weights are positive,
make it cheaper; so the cheapest connected spanning subgraph is acyclic, i.e. a spanning tree
([[prop:spanning-tree-exists]], [[thm:tree-characterisations]]). Example: a triangle with weights $1, 2, 3$ has three
spanning trees (any two of its edges), of weights $3$, $4$ and $5$; the MST consists of the edges of weight $1$ and $2$.
:::

::: pitfall
An MST minimises the **total** weight, not the distances between vertices. In a triangle $abc$ with $w(ab) = w(ac) = 2$
and $w(bc) = 3$, the MST is $\set{ab, ac}$ of weight $4$, but the path from $b$ to $c$ in it has weight $4$, while the
edge $bc$ alone has weight $3$. An MST is not a shortest-path tree.
:::

By Cayley's formula ([[thm:cayley]]), $K_n$ has $n^{n-2}$ spanning trees: **the brute-force approach is far too
expensive.** MSTs have a remarkable range of applications: network design (communication, electrical, hydraulic,
road), approximation algorithms for NP-hard problems such as the travelling salesman and Steiner tree problems,
cluster analysis, image segmentation and registration, error-correcting codes, avoiding cycles in Ethernet
bridging, and many more.

```graph id=a01-example-graph widget=figure
caption: Our running example. All weights are distinct. Its minimum spanning tree (highlighted) has weight $1+2+3+4+5+6+8 = 29$.
intent: The weighted graph used by all MST players in this lesson; MST edges highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4 class=tree]; a -- c [w=8 class=tree]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1 class=tree]
d -- e [w=2 class=tree]; d -- g [w=6 class=tree]; e -- f [w=5 class=tree]; e -- g [w=12]; f -- h [w=3 class=tree]; g -- h [w=10]
```

## Cut and cycle properties

::: definition {#def:cut title="Cut" defines="cut (vertex partition), crossing edge" source="algorithms/01 p5"}
A **cut** in $G$ is a partition $(S, V \setminus S)$ of the vertex set with $\emptyset \ne S \ne V$; an edge **crosses** the cut
(goes **across** it, is a **crossing edge**) if it has one end in $S$ and the other in $V \setminus S$.
:::

::: intuition
A cut splits the vertices into two non-empty sides, and the crossing edges are the only connections between them. Every spanning
tree must use **at least one** crossing edge of every cut, otherwise it could not connect the two sides. The cut property below
says which crossing edge the MST uses. Example: in [[fig:a01-cut-property]], $S = \set{a, b, c}$ and the crossing edges are $bd$,
$ce$ and $cf$. The simplest cuts are $(\set{v}, V \setminus \set{v})$, crossed exactly by the edges at $v$. In a [[def:flow-network|flow network]], an
$s$–$t$ cut ([[def:flow-cut]]) is a cut with $s \in S$ and $t \notin S$; in an undirected graph, the crossing edges of such a cut
form an $s$–$t$ edge cut ([[def:st-cut]]).
:::

::: pitfall
Here a cut is a partition of the **vertices**, and what crosses it are edges. This is not the vertex cut (separator) of
[[def:minimal-cut]], which is a set of vertices whose deletion disconnects the graph.
:::

We use two facts about cuts many times:

- every [[def:cycle-graph|cycle]] crosses every cut an **even** number of times (walking around the cycle, every crossing switches the side,
  and we end on the side where we started);
- for a [[def:spanning-tree|spanning tree]] $T$ and an edge $e \in E(T)$, the graph $T - e$ is disconnected, as trees are minimally
  connected ([[thm:tree-characterisations]]), and it is a forest with $n - 2$ edges, so it has exactly two
  [[def:component|components]] ([[cor:forest-edges]]). They form a cut, and $e$ is the only edge of $T$ across it.

Also, for a spanning tree $T$ and an edge $e \notin E(T)$, $T + e$ contains exactly one cycle: the unique $T$-path between the ends
of $e$ ([[cor:tree-unique-path]]), plus $e$. For every edge $f$ of this cycle, $T + e - f$ is again a spanning tree: it is connected,
since $f$ lies on a cycle, and has $n - 1$ edges ([[thm:tree-characterisations]], 5). This **exchange** of $f$ for $e$
([[fig:t03-tree-plus-edge]]) is the basic move of all proofs below.

::: theorem {#thm:cut-property title="Cut property" source="algorithms/01 p5"}
If $e$ is the lightest edge across some cut of $G$, then $e \in M$ for every [[def:mst|minimum spanning tree]] $M$.
:::

::: theorem {#thm:cycle-property title="Cycle property" source="algorithms/01 p5"}
If $e$ is the heaviest edge on some cycle of $G$, then $e \notin M$ for every minimum spanning tree $M$.
:::

Here "the lightest" and "the heaviest" mean strictly lighter (heavier) than all other edges in question.

::: intuition {for=thm:cut-property}
Every spanning tree has to cross the cut somewhere. If an MST crossed it only with heavier edges, we could swap one of them for
the lightest crossing edge $e$ and save weight. Example: in [[fig:a01-cut-property]], $cf$ (weight $1$) beats $bd$ ($9$) and $ce$ ($7$).
Taking the cut $(\set{v}, V \setminus \set{v})$ shows that the lightest edge at any vertex $v$ is in the MST: in the running example,
$ab$ ($4$) is lighter than $ac$ ($8$), so $ab \in M$. This is the idea of Borůvka's algorithm below.
:::

::: intuition {for=thm:cycle-property}
A cycle offers two routes between the ends of each of its edges. If the MST used the heaviest edge $e$ of a cycle, the rest of the
cycle would provide a lighter edge to reconnect the two halves of $M - e$. Example: in [[fig:a01-cycle-property]], $bc$ (weight $11$)
is the heaviest edge of the cycle $b\,d\,e\,c$, so $bc \notin M$. Consequence: the strictly heaviest edge of the whole graph is in no MST,
unless it lies on no cycle at all, i.e. it is a [[def:cut-vertex-bridge|bridge]] (then every spanning tree contains it).
:::

::: pitfall
Strictness matters. In a triangle with all weights $1$, every edge is a lightest edge at each of its ends, yet every MST omits
one of the three edges. Also, the cut property is about **one** cut: an MST edge need not be the lightest across every cut it
crosses. In the running example $ac \in M$, but across the cut $(\set{a}, V \setminus \set{a})$ the edge $ab$ is lighter.
:::

::: proof {title="Proof of the cut property" for=thm:cut-property}
Let $e = uv$ be the strictly lightest edge across the cut $(S, V \setminus S)$ and suppose $e \notin M$. Then $M + e$ contains a cycle $C$
through $e$ ([[thm:tree-characterisations]]: trees are maximally acyclic). Since $C$ crosses the cut at $e$, it crosses it at least once more, at an edge $f \ne e$, $f \in E(M)$. As $e$ is the lightest
crossing edge, $w(f) > w(e)$. Then $M + e - f$ is a spanning tree of weight $w(M) + w(e) - w(f) < w(M)$, a contradiction.
:::

::: proof {title="Proof of the cycle property" for=thm:cycle-property}
Let $e$ be the strictly heaviest edge on a cycle $C$ and suppose $e \in M$. The two components of $M - e$ (see the facts above) form a cut, and $e$ is the only edge
of $M$ across it. The path $C - e$ joins the two ends of $e$, so it crosses this cut at some edge $f \ne e$; then $f \notin E(M)$. As $e$ is the
heaviest edge of $C$, $w(f) < w(e)$, and $M - e + f$ is a spanning tree of smaller weight, a contradiction.
:::

```graph id=a01-cut-property widget=figure
caption: The cut property. The edge $cf$ (weight 1) is the lightest edge across the cut $(S, V \setminus S)$, so it belongs to the MST.
intent: Show a cut as two groups and the crossing edges; the lightest crossing edge highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9 class=cut]; c -- e [w=7 class=cut]; c -- f [w=1 class="cut highlight"]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
group S: a b c [label="$S$"]
```

```graph id=a01-cycle-property widget=figure
caption: The cycle property. The edge $bc$ (weight 11) is the heaviest edge of the cycle $b\,d\,e\,c$, so it is in no MST.
intent: Show a cycle in the running example; its heaviest edge highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11 class="cycle highlight"]; b -- d [w=9 class=cycle]; c -- e [w=7 class=cycle]; c -- f [w=1]
d -- e [w=2 class=cycle]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

If all weights are distinct, the converse statements hold as well:

::: theorem {#thm:strong-cut-cycle title="Strong cut and cycle properties" source="algorithms/01 p5"}
Assume all edge weights are distinct, and let $M$ be a minimum spanning tree. Then

- **(strong cut property)** $e \in M \iff e$ is the lightest edge across some cut of $G$;
- **(strong cycle property)** $e \notin M \iff e$ is the heaviest edge on some cycle of $G$.
:::

::: proof
The directions "$\Leftarrow$" of the cut property and "$\Leftarrow$" of the cycle property are [[thm:cut-property]] and [[thm:cycle-property]].

Cut, "$\Rightarrow$": let $e \in M$, and let $(S, V \setminus S)$ be the cut formed by the two components of $M - e$. For any other edge $f$ across
this cut, $M - e + f$ is a spanning tree, so $w(M) - w(e) + w(f) \ge w(M)$, i.e. $w(f) \ge w(e)$, and by distinctness $w(f) > w(e)$.

Cycle, "$\Rightarrow$": let $e \notin M$, and let $C$ be the cycle in $M + e$. For any other edge $f$ of $C$, $M + e - f$ is a spanning tree, so
$w(e) \ge w(f)$, and by distinctness $w(e) > w(f)$.
:::

::: intuition {for=thm:strong-cut-cycle}
With distinct weights every edge carries a certificate of its status. An edge $e \in M$ is certified by the cut that $M - e$
defines, and an edge $e \notin M$ by the cycle it closes with $M$. Example (running example): $ac \in M$, and $M - ac$ splits
off $\set{a, b}$; across this cut go $ac$ ($8$), $bd$ ($9$) and $bc$ ($11$), and $ac$ is the lightest. The edge $ce \notin M$
closes the cycle $c\,f\,e$ with $M$, on which $ce$ ($7$) is heavier than $cf$ ($1$) and $fe$ ($5$). Checking such cycle
certificates for all non-tree edges at once is MST verification ([[cor:mst-verification]]).
:::

::: pitfall
The directions "$\Rightarrow$" need distinct weights. In a triangle with all weights $1$, an MST edge is not the strictly lightest
edge across any cut, and a non-tree edge is not the strictly heaviest edge on any cycle.
:::

::: corollary {#cor:mst-unique title="Uniqueness of the MST" extra=true}
If all edge weights are distinct, the minimum spanning tree is unique.
:::

::: intuition
The strong cut property describes the MST without referring to any particular MST: it is the set of edges that are the lightest
across some cut. So two MSTs consist of the same edges. With ties, uniqueness fails: a triangle with weights $1, 2, 2$ has two
MSTs, each containing the edge of weight $1$ and one of the two edges of weight $2$.
:::

::: proof
Let $M, M'$ be two different MSTs and let $e$ be the lightest edge in their symmetric difference, say $e \in M \setminus M'$. The cycle $C$ in
$M' + e$ is not contained in $M$ (as $M$ is acyclic), so $C$ has an edge $f \notin M$; then $f \in M' \setminus M$ and $f \ne e$, so $w(f) > w(e)$ by
the choice of $e$. Now $M' + e - f$ is a spanning tree lighter than $M'$, a contradiction.
:::

**We will always assume that all weights are distinct.** This is no real restriction: ties can be broken consistently, for example by
comparing pairs $(w(e), \text{index of } e)$ lexicographically. With this convention we can speak of **the** MST $M$.

## The generalized greedy algorithm

All classical [[def:mst|MST]] algorithms are special cases of one edge-colouring process (due to Tarjan). Initially, all edges are uncoloured.

- **Blue rule:** given a [[def:cut|cut]] with no blue edges across it, select the minimum uncoloured [[def:cut|crossing edge]] and colour it **blue**. (Uses the
  cut property.)
- **Red rule:** given a cycle containing no red edges, select the maximum uncoloured edge on it and colour it **red**. (Uses the
  cycle property.)

Repeatedly apply the two rules, in any order, until all edges are coloured. (We may stop as soon as there are $n - 1$ blue edges.)

::: theorem {#thm:generalized-greedy title="Correctness of the generalized greedy algorithm" extra=true}
In any execution of the colouring process, (1) the MST $M$ contains all blue edges and no red edge; (2) as long as some edge is
uncoloured, one of the rules can be applied. Consequently, when all edges are coloured, the blue edges are exactly $M$.
:::

::: intuition
Blue means "certified to be in $M$", red means "certified not to be in $M$". The certificates are the cut and cycle properties,
applied to the edges that are still undecided, and a certificate never expires, so the rules can be applied in any order. Example:
a triangle $abc$ with $w(ab) = 1$, $w(bc) = 2$, $w(ca) = 3$. The red rule on the triangle colours $ca$ red; the blue rule on the
cut $(\set{b}, \set{a, c})$ colours $ab$ blue; the blue rule on the cut $(\set{c}, \set{a, b})$, which no blue edge crosses, colours
$bc$ blue. The blue edges $ab, bc$ form the MST. Kruskal, Jarník and Borůvka below differ only in which cut or cycle they pick next.
:::

::: pitfall
The side conditions are needed. In the triangle with $w(ab) = 1$, $w(ac) = 2$, $w(bc) = 3$, once $ab$ is blue, the cut
$(\set{b}, \set{a, c})$ is crossed by the blue edge $ab$; ignoring this and colouring its minimum uncoloured crossing edge $bc$
blue would be wrong, as the MST is $\set{ab, ac}$.
:::

::: proof
**(1)** By induction over the colouring steps: we show that every step keeps the invariant "blue $\subseteq M$, red $\cap\, M = \emptyset$".

*Blue rule*, colouring $e$ blue across a cut with no blue crossing edge. Suppose $e \notin M$. The cycle in $M + e$ crosses the cut at $e$ and at
another edge $f \in M$. Then $f$ is not blue (no blue edge crosses the cut) and not red (it is in $M$), so $f$ is uncoloured, and $w(f) > w(e)$ as $e$ is
the minimum uncoloured crossing edge. $M + e - f$ is lighter than $M$, a contradiction.

*Red rule*, colouring $e$ red on a cycle $C$ with no red edge. Suppose $e \in M$. The path $C - e$ crosses the cut given by the two components of
$M - e$ at an edge $f \ne e$ with $f \notin M$. Then $f$ is not blue (blue edges lie in $M$) and not red ($C$ has none), so $f$ is uncoloured and
$w(f) < w(e)$. $M - e + f$ is lighter than $M$, a contradiction.

**(2)** Let $e = uv$ be uncoloured. If $u$ and $v$ lie in the same component of the blue forest, the blue path between them plus $e$ is a cycle
without red edges, and the red rule applies to it. Otherwise let $S$ be the blue component containing $u$: no blue edge crosses the cut
$(S, V \setminus S)$, and $e$ is an uncoloured crossing edge, so the blue rule applies.

Finally, if all edges are coloured, then blue $\subseteq M$ and every edge of $M$ is blue (it is not red by (1)), so blue $= M$.
:::

The rules leave a lot of freedom, and the questions are **how to find** a cut or cycle to which a rule applies, and **how fast**. The
classical algorithms answer this in different ways.

## Kruskal's algorithm

Kruskal (1956) grows a **blue [[def:forest-tree|forest]]**: sort the edges by [[def:mst|weight]]; take the lightest unprocessed edge $e$ and colour it blue if it connects
two different blue [[def:component|components]], discard it (colour it red) otherwise; repeat until all edges are processed.

::: algorithm {#alg:kruskal title="Kruskal's algorithm" source="algorithms/01 p8–9"}
**Input:** a connected graph $G$ with weights $w$. **Output:** the MST $F$.

```pseudo
F ← (V, ∅)                                               // @init
foreach v ∈ V(G) do MAKE-SET(v)                          // @makeset
sort edges according to w into a non-decreasing sequence // @sort
foreach e = {u, v} in this order do                      // @loop
    if FIND-SET(u) ≠ FIND-SET(v) then                    // @test
        F ← F ∪ e                                        // @accept
        UNION(u, v)                                      // @union
```
:::

::: intuition
Be greedy: take the cheapest edges first and skip every edge that would close a cycle with the edges already taken. The forest
$F$ starts as $n$ single vertices and every accepted edge merges two of its components, so after $n - 1$ acceptances it is a
spanning tree ([[cor:forest-edges]]). Example: a 4-cycle $a\,b\,c\,d$ with $w(ab) = 1$, $w(bc) = 2$, $w(cd) = 3$, $w(da) = 4$ and a
chord $ac$ of weight $5$. Kruskal accepts $ab$, $bc$, $cd$ and rejects $da$ and $ac$, as both ends of each already lie in one
component.
:::

::: pitfall
An edge is rejected only if its ends lie in the **same** component, not whenever both ends are already touched by $F$. On the
running example, after $cf$, $de$, $fh$ and $ab$ the edge $ef$ joins two vertices that both have an edge of $F$, but they lie in
different components $\set{c, f, h}$ and $\set{d, e}$, so $ef$ is accepted.
:::

**Correctness.** Since the edges are processed in increasing order: if $e = uv$ is accepted, it is the first processed edge across the [[def:cut|cut]]
$(S, V \setminus S)$, where $S$ is the blue component of $u$ (any earlier crossing edge would have been accepted and would have merged $S$ with
another component), hence the lightest such edge: **blue rule**. If $e$ is rejected, its ends are joined by a blue path of earlier, hence
lighter, edges, so $e$ is the last and heaviest edge of a cycle: **red rule**.

```graph id=a01-kruskal-player widget=player
caption: Kruskal's algorithm on the running example. Watch the union-find components merge.
intent: Algorithm player; state panel shows the sorted edge list and the components.
algo: kruskal
show: pseudocode state
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

### The disjoint-set (union-find) data structure

To decide quickly whether $u$ and $v$ lie in the same component, Kruskal's algorithm uses the **disjoint-set** data structure (Galler and
Fischer, 1954), which maintains a partition of a set into disjoint classes with the operations

- `MAKE-SET(x)`: create a new class $\set{x}$, in time $\O(1)$;
- `UNION(x, y)`: merge the classes containing $x$ and $y$;
- `FIND-SET(x)`: return the representative of the class of $x$.

Each class is stored as a tree rooted at its representative. With **union by rank** (make the representative of the shallower tree a child of
the representative of the deeper one), all trees have depth $\O(\log n)$, so `FIND-SET` and `UNION` take $\O(\log n)$. Adding **path compression**
(make every vertex visited by `FIND-SET` a child of the representative) gives total time $\O(m \cdot \alpha(n))$ for any sequence of $m$ operations of which $n$ are `MAKE-SET`;
here $\alpha$ is the inverse Ackermann function, which is at most $4$ for any conceivable input.

::: proposition {#prop:kruskal-complexity title="Complexity of Kruskal's algorithm" source="algorithms/01 p11"}
Kruskal's algorithm runs in time $\O(m \log n)$.
:::

::: proof
Initialisation takes $\O(n)$, sorting $\O(m \log m)$. The loop has $m$ iterations; each calls `FIND-SET` twice, and over all iterations there are at
most $n - 1$ calls of `UNION`. Even the simple union-by-rank implementation gives $\O(m \log n)$ for the loop, and the sophisticated one
$\O(m \cdot \alpha(n))$. Altogether $\O(m \log m) = \O(m \log n)$, since $m \le n^2$ gives $\log m \le 2 \log n$. The sorting dominates.
:::

::: intuition
Kruskal is "sort, then almost linear": the loop with union-find costs only $\O(m \cdot \alpha(n))$, so the bottleneck is the comparison
sort. For $m = 10^6$ edges, sorting needs about $\log_2 m \approx 20$ comparisons per edge, whereas $\alpha(n) \le 4$. If the edges come
already sorted, or the weights are small integers that can be sorted in linear time, Kruskal runs in $\O(m \cdot \alpha(n))$.
:::

## Jarník's (Prim's) algorithm

Jarník (1930), rediscovered by Prim (1957) and Dijkstra (1959), grows a single **blue tree**: start with any vertex $s$, creating the tree
$T = (\set{s}, \emptyset)$; repeatedly find a minimum-weight edge with exactly one end in $T$ and add it to $T$, until $T$ spans $G$.

::: algorithm {#alg:jarnik title="Jarník's (Prim's) algorithm" source="algorithms/01 p12"}
**Input:** a connected graph $G$ with weights $w$. **Output:** the [[def:mst|MST]] $T$.

```pseudo
choose some s ∈ V(G)                 // @start
T ← ({s}, ∅)                         // @init
for n − 1 times do                   // @loop
    e ← the lightest edge of G leaving T   // @select
    T ← T ∪ {e}                      // @add
```
:::

::: intuition
One tree grows from $s$, like the BFS tree ([[alg:bfs]]), but the next vertex is the one reachable by the **cheapest** edge
leaving the tree, not the one discovered first. Each step is the cut property for the cut between the tree and the rest. On the
running example from $a$, the edges are added in the order $ab$ ($4$), $ac$ ($8$), $cf$ ($1$), $fh$ ($3$), $ef$ ($5$), $de$ ($2$),
$dg$ ($6$): the edge of weight $8$ comes before the edge of weight $1$, because $cf$ does not leave the tree until $c$ is in it.
The result is the same tree as Kruskal's, of weight $29$.
:::

**Correctness:** the chosen edge is the lightest edge across the cut $(V(T), V \setminus V(T))$, which no blue edge crosses: blue rule.

The question is how to find the lightest edge leaving $T$. With an **adjacency matrix**, maintain for every vertex not in $T$ its closest neighbour
in $T$ and the distance to it; in each of the $n - 1$ iterations choose the closest vertex in $\O(n)$ and update the distances of its neighbours in
$\O(n)$. Overall $\O(n^2)$, which is optimal for dense graphs given as matrices. With a **priority queue**:

::: algorithm {#alg:jarnik-heap title="Jarník's algorithm with a priority queue" source="algorithms/01 p14"}
```pseudo
INIT(Q)                                         // @init
foreach v ∈ V(G) do                             // @initloop
    key[v] ← ∞; pred[v] ← Nil                   // @initkey
    INSERT(Q, v)                                // @insert
key[s] ← 0                                      // @source
while not IS-EMPTY(Q) do                        // @loop
    u ← EXTRACT-MIN(Q)                          // @extract
    foreach edge {u, v} such that v is in Q do  // @scan
        if w(u, v) < key[v] then                // @test
            DECREASE-KEY(Q, v, w(u, v))         // @decrease
            pred[v] ← u                         // @pred
```
:::

::: intuition
Every vertex outside the tree waits in the priority queue with the weight of its cheapest known connection to the tree as its key.
`EXTRACT-MIN` takes the vertex with the cheapest connection, i.e. the lightest edge leaving the tree. When $u$ joins the tree, only
the edges at $u$ can give cheaper connections, so only they are scanned. Example: starting from $a$ in the running example, the keys
of $b$ and $c$ become $4$ and $8$; after $b$ is extracted, $d$ gets key $9$, while $c$ keeps $8$, as $w(bc) = 11$ is no improvement.
:::

::: pitfall
Jarník's algorithm looks like Dijkstra's shortest-path algorithm, but the keys differ. Jarník sets $\mathrm{key}[v] \leftarrow w(u, v)$,
the weight of a single edge; Dijkstra sets it to the length of the path from $s$ through $u$ to $v$. With Dijkstra's keys the tree is a
shortest-path tree, which in general is not an MST.
:::

Here `key[v]` is the weight of the lightest edge from $v$ to the current tree, and the MST consists of the edges $\set{v, \mathrm{pred}[v]}$.
`DECREASE-KEY` is called at most $m$ times and `EXTRACT-MIN` $n$ times, so the running time is
$\O(m \cdot t_{\text{DECREASE-KEY}} + n \cdot t_{\text{EXTRACT-MIN}})$:

| operation | array | binary heap | binomial heap | Fibonacci heap |
|-----------|-------|-------------|---------------|----------------|
| `INSERT` | $1$ | $\log n$ | $\log n$ | $1$ |
<!-- REVIEW: slide p15 lists INSERT on an array as n; an array indexed by vertex inserts in O(1). Kept 1; the O(n^2) total is the same either way. -->
| `EXTRACT-MIN` | $n$ | $\log n$ | $\log n$ | $\log n$ (amortised) |
| `DECREASE-KEY` | $1$ | $\log n$ | $\log n$ | $1$ (amortised) |
| `IS-EMPTY` | $1$ | $1$ | $1$ | $1$ |
| **Jarník total** | $\O(n^2)$ | $\O(m \log n)$ | $\O(m \log n)$ | $\O(m + n \log n)$ |

```graph id=a01-jarnik-player widget=player
caption: Jarník's algorithm from $a$. The state panel shows the priority queue with the current keys.
intent: Algorithm player with heap state.
algo: jarnik
params: source=a
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

::: definition {#def:dense-sparse title="Dense and sparse graphs" defines="dense graph, sparse graph" source="algorithms/01 p16"}
A **dense** graph is a graph where the number of edges is close to the maximum possible number of edges; a **sparse** graph has only few edges.
:::

::: intuition
A connected graph has between $n - 1$ and $\binom{n}{2}$ edges, and the notion is informal: there is no sharp threshold between these
extremes. As a rule of thumb, $m = \Theta(n^2)$ is dense (for example $K_n$) and $m = \O(n)$ is sparse (trees, grids, road networks). The
distinction decides which algorithm to use: for $m = \Theta(n^2)$ the $\O(n^2)$ array version of Jarník is already linear in the input size,
while sparse graphs are where the extra $\log n$ factors hurt.
:::

For dense graphs, where $m = \Omega(n \log n)$, Jarník's algorithm with Fibonacci heaps runs in time $\O(m)$, which is asymptotically optimal (every
edge must be looked at). **Therefore we mostly focus on the performance on sparse graphs.**

## Borůvka's algorithm

Borůvka (1926), designing the electrical network of Moravia, grew **blue trees everywhere at once**: start with each vertex as a one-vertex blue
tree; for each tree choose the lightest edge leaving it (it belongs to the [[def:mst|MST]] by the cut property); merge the trees joined by the
selected edges; repeat until a single tree remains. Each
iteration of the outer loop is called a **phase**.

::: algorithm {#alg:boruvka title="Borůvka's algorithm" source="algorithms/01 p17–18"}
**Assumption:** all edge weights are distinct.

```pseudo
F ← (V, ∅)                                        // forest of one-vertex trees     @init
while F has more than one component do            // one phase                      @phase
    foreach component C of F do                   //                                @component
        S ← ∅                                     // lightest edges leaving C       @collect
        foreach v ∈ V(C) do
            e_v ← the lightest edge {v, w} with w ∉ C
            S ← S ∪ {e_v}
        F ← F ∪ (the lightest edge in S)          //                                @add
```
:::

::: intuition
Kruskal and Jarník add one edge at a time; Borůvka lets every component pick its own lightest exit, all at once. Each pick is safe by the
cut property for the cut around that component, so all picks can be added together. On the running example, phase 1 picks $ab$, $cf$, $de$,
$dg$ and $fh$ (each vertex its lightest edge, with repetitions), leaving the components $\set{a, b}$, $\set{c, f, h}$, $\set{d, e, g}$. In
phase 2, $\set{a, b}$ picks $ac$ ($8$), and both $\set{c, f, h}$ and $\set{d, e, g}$ pick $ef$ ($5$): one tree remains. The components work
independently, which makes the algorithm easy to parallelise.
:::

In a phase, all components choose their edges with respect to the **same** forest $F$ (from the beginning of the phase), and then all chosen
edges are added. Each chosen edge is the lightest edge across the cut $(C, V \setminus C)$, so by the cut property **all chosen edges belong to
$M$**; in particular they form a forest, and adding them all is safe.

::: pitfall
The assumption of distinct weights is essential here. In a triangle with all weights equal to $1$, each vertex might choose a different edge, and
the three chosen edges form a cycle. (With a consistent tie-breaking rule, as described above, the problem disappears.)
:::

::: proposition {#prop:boruvka-complexity title="Complexity of Borůvka's algorithm" source="algorithms/01 p19"}
Borůvka's algorithm has at most $\log n$ phases, each taking time $\O(m)$; in total $\O(m \log n)$.
:::

::: proof
At the beginning there are $n$ components. In a phase every component chooses an edge and is merged with at least one other component, so the
number of components at least halves: at most $n/2^i$ components remain after phase $i$, and after at most $\log n$ phases only one is left. In
each phase, computing the components and cycling through all edges to select the lightest edge leaving each component takes $\O(m)$ (label each
vertex by its component, e.g. by a DFS of $F$, then scan all edges once).
:::

::: intuition
Every component merges with at least one other, so each new component consists of at least two old ones, and their number at least halves.
Often it drops much faster, as several components may merge into one. Example: with $8$ vertices there are at most $3$ phases
($8 \to 4 \to 2 \to 1$ components); the running example needs only $2$. Each phase is one pass over all edges, hence $\O(m)$ per phase.
:::

```graph id=a01-boruvka-player widget=player
caption: Borůvka's algorithm: in phase 1 every vertex picks its lightest edge; in phase 2 the three resulting trees pick theirs.
intent: Algorithm player showing phases; components coloured with color1..color8.
algo: boruvka
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

### Contractions

Borůvka's algorithm is naturally expressed with **contractions**.

::: definition {#def:edge-contraction title="Edge and subgraph contraction" defines="contraction, edge contraction" source="algorithms/01 p21"}
Let $e = uv$ be an edge of $G$. The graph $G_{uv} = G_e$ obtained from $G$ by **contracting** $e$ is defined by
$$V(G_{uv}) = (V(G) \setminus \set{u, v}) \cup \set{w_{uv}}, \quad w_{uv} \notin V(G),$$
$$E(G_{uv}) = \set{ab \in E(G) \mid \set{a, b} \cap \set{u, v} = \emptyset} \ \cup\ \set{w_{uv}x \mid ux \in E(G) \lor vx \in E(G)},$$
with the edge weights inherited from $G$. **Contracting a connected subgraph** $H$ of $G$ means replacing the whole $H$ by a single new vertex
$v_H$; it can be implemented by contracting the edges of (a spanning tree of) $H$ one by one.
:::

::: intuition
Contracting shrinks an edge to a point: its two ends merge, and the new vertex inherits all their other edges. Each contraction removes one
vertex, so contracting a connected subgraph $H$ removes $\abs{V(H)} - 1$ vertices. Example: in [[fig:a01-contraction]], contracting $uv$ gives
a vertex $w_{uv}$ adjacent to $x$, $y$ and $z$. Non-example: merging two **non-adjacent** vertices is not a contraction. Merging the two ends of
the path $P_3$ turns it into a triangle, whereas contracting an edge of a tree always leaves a tree.
:::

When contracting, parallel edges and loops can appear (an edge from $x$ to both $u$ and $v$ gives two edges $w_{uv}x$). There are two solutions:
keep all multigraph edges (then the MST algorithm must be aware of this), or remove loops and replace parallel edges by the lightest one. For
MSTs the second is safe: a loop is never in a spanning tree, and of two parallel edges the heavier one is the heaviest edge of a 2-cycle (cycle
property). In the formula above, the weight of $w_{uv}x$ is the smaller of $w(ux)$ and $w(vx)$.

```graph id=a01-contraction widget=stepper
caption: Contracting the edge $uv$: $u$ and $v$ merge into $w_{uv}$; the two edges to $x$ become parallel, and the lighter one is kept.
intent: Illustrate edge contraction and removal of parallel edges.
layout: fixed
u @(0, 0); v @(1, 0); x @(0.5, 1); y @(-0.8, 0.6); z @(1.8, 0.6)
u -- v [w=1 class=highlight]; u -- x [w=4]; v -- x [w=3]; u -- y [w=2]; v -- z [w=5]
step: Contract the edge $uv$.
step: $u$ and $v$ become one vertex $w_{uv}$; $x$ now has two parallel edges to it.
remove u--v
class color1: u v
step: Keep only the lighter parallel edge (weight 3).
remove u--x
```

::: lemma {#lem:contraction-mst title="Contractions and MST" source="algorithms/01 p20"}
Let $H$ be a connected subgraph of the MST $M$ of $G$, and let $G'$ be obtained from $G$ by contracting $H$ to a single vertex $v_H$ (removing loops,
keeping the lightest of parallel edges). Then the MST $M'$ of $G'$, with $v_H$ replaced by $H$ (i.e. each edge of $M'$ replaced by the edge of $G$ it
came from, plus the edges of $H$), is the MST of $G$.
:::

::: proof
Edges of $G'$ correspond to edges of $G$ not inside $H$. As a connected subgraph of the tree $M$, $H$ is a tree, so $\abs{E(H)} = \abs{V(H)} - 1$.
<!-- REVIEW: added that H is a tree; the edge count below needs |E(H)| = |V(H)| - 1. -->
Spanning trees $T$ of $G$ containing $H$ correspond bijectively to spanning trees of the
multigraph obtained by contracting $H$ (keep $E(T) \setminus E(H)$; a set of edges forms a spanning tree together with $H$ iff it forms a spanning tree
after contracting $H$, since contraction preserves connectivity and the edge count works out: $(n - 1) - (\abs{V(H)} - 1) = \abs{V(G')} - 1$). Under
this correspondence $w(T) = w(T') + w(H)$. So minimizing over spanning trees of $G$ containing $H$ is the same as minimizing over spanning trees of
the contracted multigraph; removing loops and heavier parallel edges does not change the minimum (cycle property). The MST $M$ contains $H$, so it is
the minimum among the trees containing $H$, and it corresponds to $M'$.
:::

::: intuition
Once we know that the edges of $H$ belong to $M$, the only remaining question is how to connect $H$ cheaply to the rest, and for that the
inner structure of $H$ is irrelevant: $H$ behaves like a single vertex. Example: in the running example $cf \in M$; contract it to $v_{cf}$,
which keeps the lighter of $ce$ ($7$) and $fe$ ($5$) as its edge to $e$. The MST of the contracted graph has weight $29 - 1 = 28$, and adding
$cf$ back gives $M$.
:::

::: pitfall
$H$ must be part of the MST. Contracting an edge that is not in $M$ forces it into the result: contracting $bc$ ($11$) in the running example and
adding it back to the MST of the contracted graph yields a spanning tree containing $bc$; it is not $M$, so it is heavier than $M$.
:::

::: algorithm {#alg:boruvka-contract title="Borůvka's algorithm with contractions" source="algorithms/01 p22"}
```pseudo
while G has more than one vertex do               // @phase
    foreach vertex v ∈ V(G) do                    // @loop
        e_v ← the lightest edge incident to v     // @select
        add e_v to the MST                        // @add
    contract all edges e_v                        // @contract
    eliminate parallel edges and loops            // @clean
```
:::

::: intuition
After contracting, every component of the blue forest is a single vertex, so "the lightest edge leaving a component" becomes simply "the
lightest edge at a vertex". On the running example, phase 1 leaves three vertices $\set{a, b}$, $\set{c, f, h}$, $\set{d, e, g}$ joined by the
lightest edges between the groups: $ac$ ($8$), $bd$ ($9$) and $ef$ ($5$). Phase 2 picks $ac$ and $ef$, and one vertex remains. The edges $e_v$
belong to the MST by the cut property, and the contracted graph still has the right MST by [[lem:contraction-mst]].
:::

Let $n_i$ and $m_i$ be the numbers of vertices and edges at the beginning of phase $i$. In phase $i$ we need time $\O(m_i)$ to find all edges $e_v$, and
again $\O(m_i)$ to relabel the endpoints of contracted edges and remove multiplicities (this is not straightforward: it can be done by two passes of
bucket sort on the pairs of new endpoints). Since $n_{i+1} \le n_i / 2$ and $m_i \le \min(m, n_i^2)$, a more detailed analysis gives
$\O\bigl(\min(m \log n, n^2)\bigr)$: the sum $\sum_i \min(m, n^2/4^{i})$ is $\O(m \log n)$, and also $\O(n^2)$ as a geometric series.

## The MST timeline

| year | authors | time | idea |
|------|---------|------|------|
| 1926 | Borůvka | $\O(m \log n)$ | $\O(\log n)$ phases, each $\O(m)$ |
| 1930 | Jarník | $\O(n^2)$ | arrays; heaps not yet invented |
| 1956 | Kruskal | $\O(m \log n)$ | dominated by the sort |
| 1957, 1959 | Prim, Dijkstra | | rediscover Jarník |
| 1960s | Jarník + binary heap | $\O(m \log n)$ | no faster than Borůvka |
| 1975–76 | Yao; Cheriton–Tarjan | $\O(m \log \log n)$ | improvements of Borůvka |
| 1987 | Fredman–Tarjan | $\O(m + n \log n)$ | Jarník with Fibonacci heaps |
| 1987 | Fredman–Tarjan | $\O(m \beta(m, n))$ | limiting the heap size |
| 1986/89 | Gabow, Galil, Spencer, Tarjan | $\O(m \log \beta(m, n))$ | packets |
| 1995 | Karger, Klein, Tarjan | $\O(m)$ expected | randomization |
| 1997 | Chazelle | $\O(m \alpha(m, n) \log \alpha(m, n))$ | soft heaps |
| 1999 | Chazelle; Pettie | $\O(m \alpha(m, n))$ | |
| 2000 | Pettie, Ramachandran | $\O(T^*(m, n))$ | provably optimal (decision trees); at most $\O(m\alpha(m,n))$, exact complexity unknown |

<!-- REVIEW: slide p25 writes O(m T*(m,n)); T*(m,n) (decision-tree complexity) is already the total time, so O(T*(m,n)) kept. -->

## Faster deterministic algorithms

### Going beyond Jarník: Fredman–Tarjan

Jarník's algorithm takes $\O(m \cdot t_{\text{DECREASE-KEY}} + n \cdot t_{\text{EXTRACT-MIN}})$; with Fibonacci heaps this is $\O(m + n \log n)$. Can we get rid of
the $n \log n$ term and reach $\O(m)$? The $\log n$ comes from `EXTRACT-MIN` on a heap that may accumulate $\Theta(n)$ neighbouring vertices. **If the heap
size never exceeded $k$, we would get $\O(m + n \log k)$.** So: limit the heap size, and never do `EXTRACT-MIN` on a large heap.

::: algorithm {#alg:fredman-tarjan title="Fredman–Tarjan algorithm (one phase)" source="algorithms/01 p28–29"}
```pseudo
fix the heap size limit k                                          // @limit
while some vertex is not in any tree of this phase do              // @loop
    start Jarník's algorithm from such a vertex, growing a tree T   // @start
    stop growing T as soon as                                      // @stop
        its heap holds more than k neighbours (overflow), or
        T reaches a vertex of an earlier tree T_i (T is attached to T_i), or
        T spans its whole component (T is finished)
contract every tree to a single vertex, obtaining G'               // @contract
```
The algorithm repeats such phases on $G'$, with an increasing limit $k$, until one vertex remains.
:::

::: intuition
Jarník with a Fibonacci heap pays $\log n$ only for `EXTRACT-MIN` on large heaps. So cap the heap at $k$: instead of one big tree we get many
small ones, each a correct piece of the [[def:mst|MST]] (blue rule), and contracting them leaves a much smaller graph, on which the cap can be raised
exponentially. Example: for $m = 2n$ the first limit is $k_1 = 2^{4} = 16$; at most $2m/16 = n/4$ vertices remain, so $k_2 \ge 2^{16} = 65536$,
then $k_3 \ge 2^{65536}$, far more than any real $n$. Three phases suffice in practice.
:::

So the trees $T_1, T_2, \dots$ of a phase grow by Jarník's algorithm until their heap overflows; a tree that runs into an earlier tree is attached to it
(and also stops). Then all trees are contracted (Borůvka-like phases), and the next phase works on a smaller graph. All added edges are correct by the
blue rule: each is the lightest edge leaving the current tree. The insight is that after each phase the graph gets smaller, which allows a larger $k$:
even a small reduction of $n$ allows an exponential increase of $k$, which gives even fewer trees in the next phase.

**A single phase.** Let $n_i$ be the number of vertices before phase $i$ and set the limit $k_i = 2^{2m/n_i}$. The phase takes
$$\O(m + n_i \log k_i) = \O(m + n_i \cdot 2m/n_i) = \O(m).$$
**How many trees are produced?** When a tree stops because of an overflow, it "touches" more than $k_i$ edges (it contains at least one endpoint of each of
the more than $k_i$ edges to its heap neighbours); a tree that is attached to an earlier tree contributes to that tree, and the touched edges only grow. Each
edge touches at most two trees, so at most $2m/k_i$ trees remain: $n_{i+1} \le 2m/k_i$, and therefore
$$k_{i+1} = 2^{2m/n_{i+1}} \ \ge\ 2^{k_i}.$$
Once $k_i \ge n_i$, the heap cannot overflow, a single tree is built, and the algorithm ends.

**Counting the phases.** Write $\log^{(i)} n = \log(\log(\cdots \log(n) \cdots))$ ($i$ times). Starting with $k_1 = 2^{2m/n}$ and $k_{i+1} \ge 2^{k_i}$, after $j$
phases $k_j$ is at least a tower of $j$ twos topped by $2m/n$, so $\log^{(j)} k_j \ge 2m/n$. Hence $k_j \ge n \ge n_j$, and phase $j$ is the last one, as soon as
$\log^{(j)} n \le 2m/n$, which certainly holds for
<!-- REVIEW: "we stop as soon as" read as an equivalence; it is only a sufficient condition (k_j >= n implies k_j >= n_j). Spelled out the step. -->
$$j = \beta(m, n) := \min\set{j \mid \log^{(j)} n \le m/n}.$$
So there are at most $\beta(m, n)$ phases, each taking $\O(m)$ ([[def:edge-contraction|contraction]] can be done in time $\O(m)$ per phase). **Overall complexity:
$\O(m \cdot \beta(m, n))$.**

::: remark
$\log^* n$ is the number of times one has to apply $\log$ to get to at most $1$. Since $\beta(m, n) \le \log^* n$ for $m \ge n$ (and
$\beta(m, n) \le \log^* n + 1$ always, as one more $\log$ gives a value $\le 0$), Fredman–Tarjan
<!-- REVIEW: beta(m,n) <= log* n needs m/n >= 1; a tree has m/n < 1, then the bound is log* n + 1. Slide p32 is garbled here ("β(m/n) ⩽ log*(m/n)"). --> runs in $\O(m \log^* n)$, which is
clearly better than Jarník on [[def:dense-sparse|sparse graphs]]. On dense graphs $\beta(m, n)$ gets smaller; for $m = \Theta(n^2)$ we have $\beta(m, n) = 1$. One can prove that
$m \cdot \beta(m, n) \le m + n \log n$ for $n \ge 16$, so Fredman–Tarjan is at least as good as Jarník everywhere.
:::

### Going beyond Fredman–Tarjan: packets

Each Fredman–Tarjan phase still does up to $\Theta(m)$ `DECREASE-KEY` operations, one for every edge scanned from a newly added vertex. Their cost is already
$\O(1)$, so we must decrease their **number**. Observation: from the edges incident with a vertex $u$ added to the tree, we are interested only in the lightest
ones; the heavy ones may not even be needed before the algorithm finishes. **Idea:** avoid processing heavy edges before light ones by putting edges into
**packets**.

::: algorithm {#alg:gabow-packets title="Packets (Gabow, Galil, Spencer, Tarjan)" source="algorithms/01 p34–35"}
1. For each vertex $v$, split its incident edges into packets of $p$ edges each (one packet may be smaller): about $2m/p$ packets in total.
2. Sort each packet internally ($\O(m \log p)$ in total); the weight of a packet is the weight of its lightest edge.
3. Run Fredman–Tarjan on packets instead of edges: put only the lightest remaining edge of each packet into the heap; once it is used, take the next one
   from the same packet.
:::

::: intuition
Most `DECREASE-KEY` operations come from heavy edges that turn out to be useless, because a lighter edge reaches the same vertex first. A sorted
packet hides its heavier edges behind its lightest one, and they enter the heap only when needed. Example: a vertex with $12$ incident edges and
$p = 3$ has $4$ packets, so it first puts only $4$ edges into the heap instead of $12$.
:::

Choosing $p = \beta(m, n)$, there are still at most $\beta(m, n)$ phases, the heap work per phase drops to $\O(m/p)$, and packet manipulation costs
$\O(m \log \beta(m, n))$ in total. **Total time: $\O(m \log \beta(m, n))$.**

## A randomized linear-time algorithm

### F-heavy and F-light edges

::: definition {#def:f-heavy title="F-heavy and F-light edges" defines="subforest, F-heavy, F-light" source="algorithms/01 p37"}
A **subforest** $F$ of a graph $G = (V, E)$ is a subgraph of $G$ which is a forest. For $e \in E$, let $w_F(e)$ be the weight of the heaviest edge on the unique
path in $F$ between the endpoints of $e$, and $w_F(e) = \infty$ if $e$ joins two different components of $F$. The edge $e$ is **$F$-heavy** if $w(e) > w_F(e)$,
and **$F$-light** otherwise.
:::

All edges of $F$ are $F$-light (for $e \in F$, the path is $e$ itself, so $w_F(e) = w(e)$).

::: intuition
$w_F(e)$ is the weight of the worst edge one must use to travel between the ends of $e$ inside $F$. An $F$-heavy edge $e$ is the heaviest edge of
the cycle it closes with $F$. Example: let $F$ be the path $a\,b\,c$ with $w(ab) = 1$, $w(bc) = 3$. Then $w_F(ac) = 3$, so an edge $ac$ of weight
$5$ is $F$-heavy, and one of weight $2$ is $F$-light. An edge from $a$ to a vertex outside the component of $F$ containing $a$ has $w_F = \infty$
and is always $F$-light.
:::

::: pitfall
"$F$-light" is not "in the MST". It only means that the forest $F$ does not rule the edge out: the edges of $F$, the edges between different
components of $F$ and many other edges are $F$-light, and most of them may still be missing from the MST.
:::

::: lemma {#lem:f-heavy-not-in-mst title="F-heavy edges are not in the MST" source="algorithms/01 p37"}
Let $F$ be an arbitrary subforest of $G$. Then the [[def:mst|MST]] of $G$ does not include any $F$-heavy edge.
:::

::: intuition
The forest $F$ need not have anything to do with the MST; any forest works, and its paths serve only as witnesses for the cycle property. A
better $F$ rules out more edges: for $F = M$, every edge outside $M$ is $M$-heavy ([[cor:mst-verification]]), while for the empty forest no
edge is heavy. Example: if $F$ is the path $a\,b\,c$ with weights $1$ and $3$, an edge $ac$ of weight $5$ is the heaviest on the triangle
$a\,b\,c$ and cannot be in the MST.
:::

::: proof
If $e$ is $F$-heavy, its ends are joined by a path in $F$ all of whose edges are lighter than $e$. Together with $e$ this path is a cycle on which $e$ is the
heaviest edge, so $e \notin M$ by the cycle property ([[thm:cycle-property]]).
:::

```graph id=a01-f-heavy widget=exercise
task: select-edges
prompt: The highlighted edges form a forest $F$. Select all $F$-heavy edges.
check: f-heavy-edges forest="class:tree"
solution: $bd$ ($9 > 8$), $ce$ ($7 > 5$) and $bc$ ($11 > 8$) are $F$-heavy: each is heavier than every edge on the $F$-path between its ends. $eg$ and $gh$ join different components of $F$, so $w_F = \infty$ and they are $F$-light.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4 class=tree]; a -- c [w=8 class=tree]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1 class=tree]
d -- e [w=2 class=tree]; e -- f [w=5 class=tree]; e -- g [w=12]; f -- h [w=3 class=tree]; g -- h [w=10]
```

### MST verification

The $T$-heavy and $T$-light edges can be computed efficiently:

::: theorem {#thm:mst-verification title="MST verification in linear time" source="algorithms/01 p38"}
**(Dixon–Rauch–Tarjan 1992, King 1995, Hagerup 2009)** There is a deterministic algorithm which, given a graph $G$ and a spanning tree $T$, computes $w_T(e)$ for
each edge $e \in E(G)$ in time $\O(m + n)$.
:::

::: intuition
Computing $w_T(e)$ is a "maximum on a tree path" query, one per edge of $G$. Walking each path takes up to $\O(n)$, so the naive method needs
$\O(mn)$; the theorem answers all $m$ queries together in linear time. Example: if $T$ is the path $1\,2\,3\,4$ with weights $5, 1, 7$, then
$w_T(13) = 5$, $w_T(24) = 7$ and $w_T(14) = 7$.
:::

The proof is beyond the scope of the course. It gives a linear-time solution of the **MST verification** problem (input: a weighted graph $G$ and a spanning tree
$T \subseteq G$; question: is $T$ the MST of $G$?):

::: corollary {#cor:mst-verification title="Verifying an MST" source="algorithms/01 p38"}
There is a deterministic algorithm which, given $G$ and a spanning tree $T$, checks in time $\O(m + n)$ whether $T$ is the minimum spanning tree of $G$: it is iff all
edges of $G \setminus T$ are $T$-heavy.
:::

::: intuition
Checking an MST is easier than finding one: this check is deterministic and linear, while no deterministic linear-time MST algorithm is known.
Example: in the running example with $T = M$, the edge $bc$ ($11$) is $T$-heavy, as $w_T(bc) = \max(4, 8) = 8$. If instead $T = M - ac + bc$, then
$w_T(ac) = \max(4, 11) = 11 > 8$, so $ac$ is $T$-light and the test reports that $T$ is not the MST.
:::

::: proof
If every non-tree edge is $T$-heavy, it is the heaviest edge of the cycle it closes with $T$, so by the strong cycle property ([[thm:strong-cut-cycle]]) no non-tree edge
is in $M$; as $M$ has $n - 1$ edges, $M = T$. Conversely, if $T = M$, every non-tree edge $e$ is not in $M$, so it is the heaviest edge on some cycle; it is in particular
heavier than all edges of the cycle in $T + e$ (by the proof of [[thm:strong-cut-cycle]]), i.e. $T$-heavy.
:::

### Randomizing the MST construction

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
With high probability the algorithm runs in time $\O(m)$: for a connected graph, the probability is $1 - e^{-\Omega(m)}$ (by Chernoff bounds). In the worst case it takes
$\O(\min\set{n^2, m \log n})$, the same bound as Borůvka.
:::

## Directed graphs: arborescences

How do we generalize spanning trees to directed graphs?

::: definition {#def:arborescence title="Arborescence" defines="arborescence, root" source="algorithms/01 p48"}
For a digraph $D = (V, E)$ and a **root** $r \in V$, an **arborescence** (rooted at $r$) is a subgraph $T = (V, F)$ such that

1. $T$ is a spanning tree (if we forget the edge orientations), and
2. there is a directed path in $T$ from $r$ to each other vertex.
:::

::: intuition
An arborescence is a [[def:spanning-tree|spanning tree]] whose arcs all point away from the root, like the parent pointers of a BFS tree read from parent
to child: each vertex other than $r$ has exactly one incoming arc, from its parent. It is the directed analogue of a spanning tree, and the min-cost
version below is the directed analogue of the [[def:mst|MST]]. Example: in [[fig:a01-arborescence-example]] the highlighted arcs form an arborescence
rooted at $r$. Non-example: the arcs $a \to b$ and $c \to b$ form a spanning tree of $\set{a, b, c}$ if we forget orientations, but no vertex reaches
both others, so it is an arborescence for no root.
:::

::: pitfall
Orientation and root matter. The same underlying spanning tree may be an arborescence for one root and not for another (the path
$r \to a \to b$ is one for $r$, not for $a$), and only a vertex from which every vertex is reachable in $D$ can be the root of an arborescence.
:::

Equivalently: every vertex other than $r$ has exactly one incoming arc in $T$, $r$ has none, and $T$ has no directed cycle (or: every vertex is reachable from $r$). It is
trivial to find **some** arborescence: just use BFS or DFS from $r$ ([[alg:bfs]]). Our problem is to find a cheapest one.

::: definition {#def:min-cost-arborescence title="Min-cost arborescence problem" defines="optimal arborescence" source="algorithms/01 p49"}
Given a digraph $D$, a root $r \in V(D)$ and a weight function $w : E(D) \to \R^+$, find an arborescence of minimum cost (an **optimal arborescence**).
:::

::: intuition
The task is the MST problem with directions: connect everything as cheaply as possible, but now every vertex must be **reachable from $r$** along the
chosen arcs. This changes the problem considerably: the greedy cut and cycle arguments break down, as the example below shows, so Kruskal's and
Jarník's algorithms do not apply. Example: with arcs $r \to a$ ($1$), $r \to b$ ($3$) and $a \to b$ ($1$), the optimal arborescence is $r \to a \to b$ of
cost $2$.
:::

We assume that $D$ has an arborescence rooted at $r$ (this can be checked by BFS/DFS) and that no edges enter $r$ (such edges, if any, can safely be deleted, as no
arborescence uses them).

**Unlike in undirected graphs, a min-cost arborescence may not include the lightest edge across some cut, and it may include the heaviest edge on some cycle.** In the example
below, an optimal arborescence (weight $22$; there are two optimal ones) does not use the arc $(c, a)$ of weight $1$, the lightest arc across the cut $(\set{r, c}, \text{rest})$, but it uses the arc
$(d, c)$ of weight $4$, the heaviest arc of the directed cycle $a \to d \to c \to a$.

```graph id=a01-arborescence-example widget=figure
caption: A min-cost arborescence rooted at $r$ (highlighted, weight $2+6+3+4+7 = 22$). Another optimal one is $rc, ca, ad, ab, de$ (also 22). The greedy cut and cycle properties fail for arborescences.
intent: Transcription of the lecture example; vertices named a..e (unnamed on the slides).
type: directed
layout: fixed
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=2 class=tree]; a -> b [w=6 class=tree]; r -> c [w=5]; c -> a [w=1]; a -> d [w=3 class=tree]
a -> e [w=8]; b -> e [w=9]; d -> c [w=4 class=tree]; d -> e [w=7 class=tree]
```

### A sufficient condition and reduced weights

::: proposition {#prop:arborescence-sufficient title="Sufficient condition" source="algorithms/01 p51"}
For each $v \in V \setminus \set{r}$ choose the lightest edge $e_v$ with head $v$, and let $F^* = \set{e_v \mid v \in V \setminus \set{r}}$. If $T^* = (V, F^*)$ is an arborescence,
then it is a min-cost arborescence.
:::

::: proof
Every arborescence contains exactly one arc entering each $v \ne r$, and that arc costs at least $w(e_v)$. So every arborescence costs at least
$\sum_{v \ne r} w(e_v) = w(T^*)$.
:::

::: intuition
Every vertex other than $r$ must pay for exactly one incoming arc, and it cannot pay less than its cheapest one. So the sum of the cheapest incoming
arcs is a lower bound on every arborescence, and if these arcs happen to form an arborescence, the bound is reached. Example: with arcs $r \to a$ ($1$),
$r \to b$ ($3$), $a \to b$ ($1$), the cheapest arcs entering $a$ and $b$ are $r \to a$ and $a \to b$, an arborescence of cost $2$. Non-example: in
[[fig:a01-arborescence-example]] the cheapest arcs entering $a$, $c$ and $d$ form the cycle $a \to d \to c \to a$.
:::

::: pitfall
Choose by **entering** arcs (heads), not leaving ones. Choosing for each vertex its cheapest outgoing arc, as Borůvka does for undirected edges, gives
no lower bound, because an arborescence may use several arcs leaving one vertex and none leaving another.
:::

Can we use this as an algorithm? The problem is that $T^*$ need not be an arborescence: it may contain **directed cycles** (in the example: $a \to d \to c \to a$).

::: definition {#def:reduced-weights title="Reduced weights" defines="reduced weight" source="algorithms/01 p52"}
The **reduced weight function** $w'$ for $D$ and $w$ is defined for each edge $e = (u, v) \in E$ as
$$w'(e) = w(e) - w(e_v),$$
where $e_v$ is the lightest edge with head $v$.
:::

::: intuition
Every vertex $v \ne r$ has to pay $w(e_v)$ anyway; the reduced weight of an arc into $v$ is the **extra** price of entering $v$ by this arc instead of the
cheapest one. Example: in [[fig:a01-reduced-weights]], the arcs entering $c$ are $r \to c$ ($5$) and $d \to c$ ($4$), so their reduced weights are $1$
and $0$.
:::

```graph id=a01-reduced-weights widget=figure
caption: Original weights (left) and reduced weights (right). The lightest arcs entering each vertex get reduced weight 0; they form the directed cycle $a \to d \to c \to a$ plus the arcs $(a, b)$ and $(d, e)$.
intent: Transcription of the lecture slide on reduced weights.
type: directed
layout: fixed
layout-sync: true
panel: $w$
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=2]; a -> b [w=6 class=highlight]; r -> c [w=5]; c -> a [w=1 class=highlight]; a -> d [w=3 class=highlight]
a -> e [w=8]; b -> e [w=9]; d -> c [w=4 class=highlight]; d -> e [w=7 class=highlight]
panel: $w'$
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=1]; a -> b [w=0 class=highlight]; r -> c [w=1]; c -> a [w=0 class=highlight]; a -> d [w=0 class=highlight]
a -> e [w=1]; b -> e [w=2]; d -> c [w=0 class=highlight]; d -> e [w=0 class=highlight]
```

::: observation {#obs:reduced-weights title="Properties of reduced weights" source="algorithms/01 p52"}
1. $T$ is a min-cost arborescence in $D$ with weights $w$ iff it is a min-cost arborescence with weights $w'$.
2. All reduced weights are non-negative, and the arcs $e_v$ have reduced weight $0$; in particular every directed cycle formed by such arcs has total reduced weight $0$, so it
   is a min-cost cycle.
:::

::: proof
1. Every arborescence $T$ has exactly one arc entering each $v \ne r$, so $w(T) - w'(T) = \sum_{v \ne r} w(e_v)$, a constant independent of $T$. Minimizing $w$ and minimizing
   $w'$ is therefore the same.
2. $w'(e) \ge 0$ because $e_v$ is the lightest arc entering $v$, and $w'(e_v) = 0$ by definition.
:::

::: intuition
Subtracting the same amount from all arcs entering $v$ changes the cost of every arborescence by that amount, since each arborescence uses exactly
one of these arcs. So all costs shift by the same constant and the optimum stays where it is. Example: in [[fig:a01-reduced-weights]] the constant is
$w(e_a) + w(e_b) + w(e_c) + w(e_d) + w(e_e) = 1 + 6 + 4 + 3 + 7 = 21$, and the optimal arborescence of cost $22$ has reduced cost $22 - 21 = 1$.
:::

### Edmonds' branching algorithm

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

## Summary

- MST: spanning tree of minimum weight ([[def:mst]]). Cut property: the lightest edge across a cut ([[def:cut]]) is in $M$; cycle property: the heaviest edge on a cycle is not
  ([[thm:cut-property]], [[thm:cycle-property]]); with distinct weights both become characterisations and $M$ is unique ([[thm:strong-cut-cycle]], [[cor:mst-unique]]).
  All proofs exchange edges along the unique cycle of $T + e$ or the cut of $T - e$ ([[thm:tree-characterisations]]).
- Generalized greedy: blue and red rules in any order ([[thm:generalized-greedy]]).
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
