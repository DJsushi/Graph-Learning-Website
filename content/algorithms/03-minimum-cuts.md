---
title: Minimum cuts
course: algorithms
lecture: 3
slug: a03
summary: Minimum cuts in undirected networks. Gomory–Hu trees answer all pairs with n − 1 flow computations; node identification, the Stoer–Wagner algorithm and Karger's random contractions (with the Karger–Stein speed-up) find the global minimum cut.
prerequisites: [algorithms/02-maximum-flow, algorithms/01-minimum-spanning-trees]
sources:
  - resources/graph-algorithms/03-cuts.pdf
status: draft
---

The previous lecture computed a minimum cut between **one** source and **one** sink. This lecture asks two broader questions about an
undirected network. First, how well is **every pair** of vertices connected? With $n$ vertices there are $\binom{n}{2}$ pairs, but the
answer to all of them fits into a single tree with $n - 1$ edges, and $n - 1$ maximum-flow computations suffice to build it (Gomory and Hu).
Second, where is the **weakest spot of the whole network**, the cheapest set of edges whose removal disconnects it? Such cuts happen in practice:
a 75-year-old woman cut off the internet in Georgia (and parts of Armenia) for about 12 hours with a garden spade, sharks have been biting
undersea internet cables, and states worry about sabotage of the cables under the sea. The global minimum cut can be found without
computing any flow (Stoer and Wagner), or by contracting random edges and trusting probability (Karger).

## Cuts in undirected networks

<!-- REVIEW: the lecture says "G an undirected network" without "connected"; connectivity is assumed here (as in the global minimum cut section, p25) so that all f_G(s, t) > 0, which the cut property of thm:gomory-hu needs. Parallel edges are allowed because node identification creates them. -->
::: definition {#def:undirected-cut title="Cuts in an undirected network" defines="undirected network" source="algorithms/03 p3–4"}
An **undirected network** is a connected undirected graph $G = (V, E)$, possibly with parallel edges but without loops, together with a
capacity function $c : E \to \R^+$. For $U \subseteq V$ let
$$\delta(U) = \delta(V \setminus U) = \set{e \in E \mid e \text{ has one end in } U \text{ and the other in } V \setminus U}$$
be the **cut given by $U$**, and $\delta(v) = \delta(\set{v})$ for a vertex $v$. For $A \subseteq E$ let $c(A) = \sum_{e \in A} c(e)$. The cut
$\delta(U)$ **separates** $s$ and $t$, or is an **$s$–$t$ cut**, if exactly one of $s, t$ lies in $U$; we write
$$f_G(s, t) = \min\set{c(\delta(U)) \mid \delta(U) \text{ separates } s \text{ and } t}$$
for the minimum capacity of an $s$–$t$ cut in $G$. An $s$–$t$ cut of capacity $f_G(s, t)$ is a **minimum $s$–$t$ cut**.
:::

::: intuition
$\delta(U)$ is the set of edges you have to cut to separate $U$ from the rest, and $c(\delta(U))$ is the price. For $\emptyset \ne U \ne V$
these are the crossing edges of the [[def:cut|cut]] $(U, V \setminus U)$ from [[algorithms/01-minimum-spanning-trees]]. Example: in the network of [[fig:a03-network]],
$\delta(\set{a}) = \set{ab, af}$ has capacity $10 + 8 = 18$, and $\delta(\set{a, b}) = \set{af, bc, bf, be}$ has capacity $8 + 4 + 3 + 2 = 17$; it
separates $b$ and $f$, so $f_G(b, f) \le 17$ (in fact $f_G(b, f) = 17$). Non-example: $\delta(\set{a, b})$ does not separate $a$ and $b$.
:::

::: pitfall
An undirected cut has no direction: $\delta(U) = \delta(V \setminus U)$, and every crossing edge counts. In a directed
[[def:flow-cut|$s$–$t$ cut]] $(S, T)$ only the arcs from $S$ to $T$ count. The two agree after replacing each undirected edge by two opposite arcs, see below.
:::

The letter $f$ is chosen because $f_G(s, t)$ is a maximum flow value. Replace every edge $uv$ by the two arcs $(u, v)$ and $(v, u)$, both of
[[def:flow-network|capacity]] $c(uv)$. For every $U$ with $s \in U \not\ni t$, the arcs from $U$ to $V \setminus U$ are exactly one arc per edge of
$\delta(U)$, so the directed cut $(U, V \setminus U)$ has capacity $c(\delta(U))$. By the max-flow min-cut theorem ([[thm:maxflow-mincut]]),
$f_G(s, t)$ is the value of a maximum [[def:flow|flow]] from $s$ to $t$ in this network, and one max-flow computation finds a minimum $s$–$t$ cut, e.g.
in time $\tau = \O(n^2 m)$ with Dinic's algorithm ([[thm:dinic]]).

```graph id=a03-network widget=figure
caption: The network $G$ from the lecture (left; edge labels are capacities) and its Gomory–Hu tree $T$ (right). For example $f_G(a, d) = \min(18, 17, 13, 14) = 13$.
intent: The lecture's running example (slides p5, p9–13). Vertex names and capacities as on the slides; the tree is the one built in the construction example.
layout: fixed
panel: network $G$
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
panel: Gomory–Hu tree $T$
a @(0, 0); b @(1.3, 0); f @(2.6, 0); e @(3.9, 0); c @(5.2, 0); d @(3.9, 1)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
```

### Node identification

Several algorithms below glue vertices together. The operation is the same as edge contraction, except that the two vertices need not be adjacent.

::: definition {#def:node-identification title="Node identification" defines="node identification" source="algorithms/03 p31"}
Let $u \ne v$ be vertices of $G$. The graph $G_{uv}$ obtained from $G$ by **identifying** $u$ and $v$ ("merging" the two nodes into a new vertex
$w_{uv} \notin V(G)$) is
$$V(G_{uv}) = (V(G) \setminus \set{u, v}) \cup \set{w_{uv}},$$
$$E(G_{uv}) = \set{ab \in E(G) \mid \set{a, b} \cap \set{u, v} = \emptyset} \ \cup\ \set{w_{uv}x \mid ux \in E(G) \lor vx \in E(G)},$$
where each edge $ux$ or $vx$ with $x \notin \set{u, v}$ becomes its own edge $w_{uv}x$, and the edges between $u$ and $v$ disappear. The capacities
are the same as in $G$. **Identifying a set** $X \subseteq V$ means identifying its vertices one by one into a single vertex $v_X$; the result $G_X$
does not depend on the order (an edge survives iff it has an end outside $X$, and its ends in $X$ become $v_X$).
:::

- [[def:edge-contraction|Edge contraction]] is the special case of node identification with $uv \in E$.
- $G_{uv}$ can have parallel edges between two vertices (an $x$ adjacent to both $u$ and $v$), but no new loops.
- For flow and cut algorithms, parallel edges can be replaced by a single edge whose capacity is the **sum** of their capacities: a cut contains
  either all or none of a bundle of parallel edges, so no cut capacity changes.

::: intuition
Identifying $u$ and $v$ forces them onto the same side of every cut and keeps everything else. Example: in [[fig:a03-identification]], $u$ and $v$ are
not adjacent; after identification, $x$ and $q$ are joined to $w_{uv}$ by two parallel edges each, which merge into single edges of capacities $3 + 2 = 5$
and $2 + 6 = 8$. Non-example: deleting $v$ is not identification, since the edges at $v$ would be lost.
:::

```graph id=a03-identification widget=stepper
caption: Identifying the non-adjacent vertices $u$ and $v$ into $w_{uv}$. Parallel edges are then merged and their capacities added.
intent: Node identification as a generalisation of edge contraction (u, v non-adjacent); parallel edges appear and are merged with summed capacities.
layout: fixed
u @(0, 0); v @(2, 0); x @(1, 1.1); q @(1, -1.1); y @(-1, 0.8); z @(3, 0.8)
u -- x [id=ux c=3]; v -- x [id=vx c=2]; u -- q [id=uq c=2]; v -- q [id=vq c=6]; u -- y [c=4]; v -- z [c=1]
step: The vertices $u$ and $v$ are not adjacent.
class highlight: u v
step: Identify $u$ and $v$ into the new vertex $w_{uv}$. Every edge keeps its capacity, so $x$ and $q$ now have two parallel edges each.
merge u v -> w [label="$w_{uv}$" class=color1]
step: Replace each bundle of parallel edges by one edge with the summed capacity: $c(w_{uv}x) = 5$, $c(w_{uv}q) = 8$.
remove @ux @vx @uq @vq
w -- x [c=5]; w -- q [c=8]
```

::: observation {#obs:identification-cuts title="Cuts after identification" source="algorithms/03 p32"}
Let $v, w \in V(G)$, $v \ne w$. Then

1. every cut of $G_{vw}$ is a cut of $G$;
2. every cut of $G$ which does not separate $v$ from $w$ is a cut of $G_{vw}$.

More precisely, for $U' \subseteq V(G_{vw})$ let $U$ be $U'$ with $w_{vw}$ replaced by $v$ and $w$ (if $w_{vw} \in U'$). Then $c(\delta_{G_{vw}}(U')) = c(\delta_G(U))$,
and $U' \mapsto U$ is a bijection onto the sets $U$ that contain both or none of $v, w$. The same holds for identifying a set $X$, with the sets $U$
that contain $X$ or are disjoint from it.
:::

::: proof
The edges of $G_{vw}$ correspond one-to-one to the edges of $G$ that do not join $v$ and $w$, with the same capacities (before parallel edges are
merged; merging does not change cut capacities, as noted above). An edge $ab$ with $a, b \notin \set{v, w}$ keeps its ends. An edge $vx$ or $wx$
becomes $w_{vw}x$, and $w_{vw} \in U'$ iff $v, w \in U$; so in both cases the edge crosses $U'$ in $G_{vw}$ iff it crosses $U$ in $G$. The edges
between $v$ and $w$ do not exist in $G_{vw}$ and do not cross $U$ in $G$, since $v$ and $w$ lie on the same side. So $\delta_G(U)$ consists of the
edges of $\delta_{G_{vw}}(U')$, and the capacities agree. The map $U' \mapsto U$ is clearly a bijection onto the sets containing both or none of
$v, w$, and $\emptyset \ne U' \ne V(G_{vw})$ iff $\emptyset \ne U \ne V(G)$. For a set $X$, apply this to the identifications one by one.
:::

::: intuition
Identification removes exactly the cuts that separate $v$ from $w$, and every other cut survives unchanged, with the same capacity. Example: in
[[fig:a03-identification]], the cut $\delta(\set{u, v, y})$ of $G$ ($c = 3 + 2 + 2 + 6 + 1 = 14$) is the cut $\delta(\set{w_{uv}, y})$ of $G_{uv}$
($c = 5 + 8 + 1 = 14$). Non-example: $\delta(\set{u})$ separates $u$ from $v$ and has no counterpart in $G_{uv}$.
:::

## Gomory–Hu trees

How long does it take to find the minimum $s$–$t$ cut for **all** pairs $s, t \in V$? One pair costs one maximum [[def:flow|flow]], time $\tau$, so the obvious
method needs $\O(n^2 \cdot \tau)$. It can be done with $n - 1$ maximum-flow computations.

::: definition {#def:gomory-hu-tree title="Gomory–Hu tree" defines="Gomory–Hu tree, equivalent flow graph" source="algorithms/03 p4"}
Let $G = (V, E)$ be an [[def:undirected-cut|undirected network]] with capacities $c$. A **Gomory–Hu tree** for $G$ is a tree $T = (V, F)$ on the same
vertex set with capacities $w : F \to \R^+$ such that for all $s \ne t \in V$:

1. $f_G(s, t) = f_T(s, t)$ ($T$ is an **equivalent flow graph**), and
2. a minimum $s$–$t$ cut in $T$ is also a minimum $s$–$t$ cut in $G$ (the **cut property**): if $\delta_T(U)$ is a minimum $s$–$t$ cut of $T$,
   then $\delta_G(U)$ is a minimum $s$–$t$ cut of $G$.

Here $f_T$ is computed with the capacities $w$.
:::

::: intuition
The tree stores all $\binom{n}{2}$ minimum cut values of $G$ in only $n - 1$ numbers, and each tree edge also tells you **where** a minimum cut is.
$T$ need not be a [[def:subgraph|subgraph]] of $G$: its edges are pairs with a known minimum cut, not edges of the network.
Example: the tree $T$ of [[fig:a03-network]]; $f_G(b, f) = 17 = f_T(b, f)$, and removing the edge $bf$ from $T$ leaves the component $\set{a, b}$,
whose cut $\delta_G(\set{a, b})$ has [[def:flow-network|capacity]] $17$. Non-example: a maximum spanning tree of $G$ is no Gomory–Hu tree in general; here it contains
$ab$ of capacity $10$, but $f_G(a, b) = 18$.
:::

::: observation {#obs:gomory-hu-edge title="Tree edges are minimum cuts" source="algorithms/03 p4"}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] for $G$ and $e = st$ an edge of $T$. If $U$ is the vertex set of either of the two components of
$T - e$, then $\delta_G(U)$ is a minimum $s$–$t$ cut of $G$, of capacity $w(e) = f_G(s, t)$.
:::

::: proof
The only $s$–$t$ path in the tree $T$ is the edge $e$ itself, and $s$, $t$ lie in different components of $T - e$. So every $s$–$t$ cut of $T$
contains $e$, while $\delta_T(U) = \set{e}$. Hence $\delta_T(U)$ is a minimum $s$–$t$ cut of $T$ and $f_T(s, t) = w(e)$. By the cut property,
$\delta_G(U)$ is a minimum $s$–$t$ cut of $G$, and its capacity is $f_G(s, t) = f_T(s, t) = w(e)$ by flow equivalence.
:::

::: intuition
Cutting one tree edge splits the vertices into two groups, and that split is a cheapest way to separate the two ends of the edge in $G$. Example: in
[[fig:a03-network]], removing $fe$ from $T$ leaves $\set{a, b, f}$ and $\set{c, d, e}$, and $\delta_G(\set{c, d, e}) = \set{bc, be, cf, fe, fd}$ has
capacity $4 + 2 + 2 + 3 + 2 = 13 = f_G(f, e)$. Non-example: for the non-adjacent pair $a, e$ of $T$, the component of $T - ab$ containing $a$
gives $\delta_G(\set{a})$ of capacity $18$, which is not a minimum $a$–$e$ cut ($f_G(a, e) = 13$).
:::

::: proposition {#prop:gomory-hu-path title="Minimum cuts from the tree" source="algorithms/03 p6"}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] for $G$. Then for all $s \ne t \in V(G)$, $f_G(s, t)$ is the minimum of $w(e)$ over the edges
$e$ of the unique $s$–$t$ path in $T$.
:::

::: proof
By flow equivalence it suffices to show this for $f_T(s, t)$. Let $P$ be the $s$–$t$ path in $T$. Every $s$–$t$ cut $\delta_T(U)$ contains an edge
of $P$, because $P$ starts on one side of $U$ and ends on the other; so $c(\delta_T(U)) \ge \min_{e \in P} w(e)$. Conversely, let $e \in P$ have
minimum capacity $w(e)$. $T - e$ has two components, and $s$, $t$ lie in different ones ($P$ is their only connecting path in $T$, and it uses $e$). For the
component $U$ of $s$, $\delta_T(U) = \set{e}$ is an $s$–$t$ cut of capacity $\min_{e \in P} w(e)$.
:::

::: intuition
The minimum cut between two vertices is the **bottleneck** of their tree path: a chain is as strong as its weakest link. Example: in
[[fig:a03-network]], $f_G(a, c) = \min(18, 17, 13, 15) = 13$ and $f_G(d, c) = \min(14, 15) = 14$. A consequence: among the $\binom{n}{2}$ values
$f_G(s, t)$ there are at most $n - 1$ different ones ([[exr:a03-distinct-values]]).
:::

Two questions remain: does a Gomory–Hu tree always exist, and can it be computed efficiently? The answer to both is **yes**.

### The construction

The algorithm maintains a partition of $V$ into sets $S_1, \dots, S_k$ and a spanning tree $T$ on the **nodes** $S_1, \dots, S_k$. It starts with
the single node $S_1 = V$ and performs $n - 1$ **split operations** (rounds). In each round it chooses a node $S_i$ with $\abs{S_i} \ge 2$, splits it
into two non-empty parts $S_a$, $S_b$, replaces $S_i$ in $T$ by the edge $S_aS_b$, and reconnects the former neighbours of $S_i$ to $S_a$ or $S_b$
according to the minimum cut found. After $n - 1$ rounds all nodes are single vertices, and $T$ is a Gomory–Hu tree.

::: algorithm {#alg:gomory-hu title="Gomory–Hu tree construction" source="algorithms/03 p7–8"}
**Input:** an undirected network $G = (V, E)$ with capacities $c$. **Output:** a Gomory–Hu tree $T$ with capacities $w$.

```pseudo
S_1 ← V; T ← the single node S_1             // @init
repeat n − 1 times
    pick S_i with |S_i| ≥ 2 and a, b ∈ S_i    // @choose
    H ← G, components of T − S_i contracted   // @contract
    δ(A) ← min a–b cut in H (a ∈ A, b ∈ B)    // @mincut
    S_a ← S_i ∩ A; S_b ← S_i ∩ B              // @split
    in T, replace S_i by the edge S_aS_b
        of capacity c(δ_H(A))
    in T, replace each edge S_iS_j by
        S_aS_j if S_j ⊆ A, S_bS_j if S_j ⊆ B
return T                                      // @return
```
:::

Contracting a component $C$ of $T - S_i$ means [[def:node-identification|identifying]] the union of the node sets in $C$ into one vertex $v_C$;
these vertices need not be connected in $G$. In the last two lines, $A$ and $B$ are read as sets of vertices of $G$ (each $v_C$ stands for its
vertices), so every node $S_j \ne S_i$ lies entirely in $A$ or entirely in $B$. The edge capacities of $T$ other than the new one do not change.

::: intuition {for=alg:gomory-hu}
Each round settles one more pair: it separates two vertices $a, b$ that still share a node, and remembers the cheapest cut between them as a tree
edge. The parts of $G$ that are already separated from $S_i$ by earlier cuts are squashed into single vertices, since by the lemmas below they
cannot make the $a$–$b$ cut cheaper. Example: in round 3 of [[ex:gomory-hu-lecture]], $\set{a, b}$ is contracted to one vertex, and the $c$–$f$
cut of capacity $13$ splits $\set{c, d, e, f}$ into $\set{c, d, e}$ and $\set{f}$.
:::

```graph id=a03-gomory-hu-player widget=player
caption: The Gomory–Hu construction on the lecture network, with the lecture's choice of the vertices $a, b$ in each round. The tree $T$ is drawn on the right, each node at the centre of its vertices.
intent: Algorithm player reproducing slides p9–13 (pairs b–f, a–b, c–f, d–e, c–e; cuts 17, 18, 13, 14, 15); contraction of the components of T − S_i is animated as merges.
algo: gomory-hu
params: pairs="b f, a b, c f, d e, c e"
layout: fixed
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
```

::: example {#ex:gomory-hu-lecture title="The lecture example" source="algorithms/03 p9–13"}
On the network $G$ of [[fig:a03-network]]:

1. Partition $\set{a, b, c, d, e, f}$. Choose $b$ and $f$; $H = G$. A minimum $b$–$f$ cut is $\delta(\set{a, b})$ of capacity $17$. New partition
   $\set{a, b}, \set{c, d, e, f}$, tree $\set{a, b} \overset{17}{\text{—}} \set{c, d, e, f}$.
2. Choose $a$ and $b$. $H$: contract $\set{c, d, e, f}$; then $c(ab) = 10$, $c(a\,cdef) = 8$, $c(b\,cdef) = 4 + 3 + 2 = 9$. A minimum $a$–$b$ cut is
   $\delta(\set{a})$ of capacity $18$; $\set{c, d, e, f}$ lies on the side of $b$. Tree $a \overset{18}{\text{—}} b \overset{17}{\text{—}} \set{c, d, e, f}$.
3. Choose $c$ and $f$. $H$: contract $\set{a, b}$ (edges $11$ to $f$, $4$ to $c$, $2$ to $e$). A minimum $c$–$f$ cut is $\delta(\set{c, d, e})$
   of capacity $13$. Tree $a \overset{18}{\text{—}} b \overset{17}{\text{—}} f \overset{13}{\text{—}} \set{c, d, e}$.
4. Choose $d$ and $e$. $H$: contract $\set{a, b, f}$ (edges $6$ to $c$, $5$ to $e$, $2$ to $d$). A minimum $d$–$e$ cut is $\delta(\set{d})$ of
   capacity $14$. New partition $\set{a}, \set{b}, \set{c, e}, \set{d}, \set{f}$; $d$ hangs off $\set{c, e}$ with capacity $14$.
5. Choose $c$ and $e$. $H$: contract $\set{a, b, f}$ (and $\set{d}$ is a single vertex). A minimum $c$–$e$ cut is $\delta(\set{c})$ of capacity
   $15$; $f$ and $d$ lie on the side of $e$. The result is the tree $T$ of [[fig:a03-network]].
:::

### Correctness

The key fact is that minimum cuts do not cross each other in a harmful way. It rests on an inequality between cut capacities, which the lecture proves
"by picture".

::: lemma {#lem:cut-submodular title="Uncrossing cuts" aka="submodularity of cuts" source="algorithms/03 p17"}
For all $X, Y \subseteq V$:
$$c(\delta(X \cup Y)) + c(\delta(X \cap Y)) \le c(\delta(X)) + c(\delta(Y)),$$
$$c(\delta(X \setminus Y)) + c(\delta(Y \setminus X)) \le c(\delta(X)) + c(\delta(Y)).$$
:::

::: proof
Split $V$ into the four regions $X \cap Y$, $X \setminus Y$, $Y \setminus X$ and $V \setminus (X \cup Y)$, and count how often each edge $e$ is
counted on each side of the first inequality, according to the regions of its ends. An edge inside one region is counted nowhere. An edge between
$X \cap Y$ and the outside region is counted twice on both sides. An edge between $X \setminus Y$ and $Y \setminus X$ is counted twice on the right
(it crosses $X$ and $Y$) and never on the left (both ends lie in $X \cup Y$ and neither in $X \cap Y$). Every other edge, between two regions that
differ in exactly one of the memberships "in $X$", "in $Y$", is counted once on each side. Since capacities are positive, the first inequality
follows; the difference of the two sides is twice the capacity of the edges between $X \setminus Y$ and $Y \setminus X$.

For the second inequality, apply the first to $X$ and $V \setminus Y$: we have $\delta(V \setminus Y) = \delta(Y)$,
$X \cap (V \setminus Y) = X \setminus Y$, and $X \cup (V \setminus Y) = V \setminus (Y \setminus X)$, whose cut is $\delta(Y \setminus X)$.
:::

::: intuition
Two overlapping cuts can be "uncrossed" into two other cuts that cost no more in total. Only the edges going diagonally, from $X \setminus Y$ to
$Y \setminus X$, make a difference, and they are counted on the right only. Example: in [[fig:a03-uncrossing]], with all capacities $1$,
$c(\delta(X)) + c(\delta(Y)) = 4 + 4 = 8$, while $c(\delta(X \cup Y)) + c(\delta(X \cap Y)) = 3 + 3 = 6$; the difference $2$ is twice the
diagonal edge $pr$.
:::

```graph id=a03-uncrossing widget=figure
caption: Two crossing sets $X = \set{p, q}$ and $Y = \set{q, r}$ (all capacities $1$). The diagonal edge $pr$ (highlighted) crosses both $X$ and $Y$ but neither $X \cup Y$ nor $X \cap Y$.
intent: Illustrates lem:cut-submodular ("proof by picture" on slide p17): the only edges counted differently are those between X∖Y and Y∖X.
layout: fixed
p @(0, 0); q @(1.2, 0); r @(2.4, 0); o @(1.2, -1.4)
p -- q; q -- r; p -- r [class=highlight bend=0.5]; p -- o; q -- o; r -- o
group X: p q [label="$X$"]
group Y: q r [label="$Y$" class=muted]
```

::: lemma {#lem:gomory-hu title="Gomory–Hu lemma" aka="G-H lemma" source="algorithms/03 p14–17"}
Let $\delta(S)$ be a minimum $s$–$t$ cut for some vertices $s, t \in V$ with $s \in S$, and let $v, w \in S$, $v \ne w$. Then there is a minimum
$v$–$w$ cut $\delta(W)$ with $W \subseteq S$.
:::

```graph id=a03-gh-lemma widget=figure
caption: The Gomory–Hu lemma: $\delta(S)$ is a minimum $s$–$t$ cut and $v, w \in S$. Some minimum $v$–$w$ cut $\delta(W)$ has $W$ inside $S$.
intent: Transcription of the hand-drawn statement illustration (slide p15), as nested groups without edges.
layout: fixed
t @(1.2, 1.6); v @(0, 0); s @(0.8, 0); w @(2.2, 0.35)
group S: v s w [label="$S$"]
group W: v s [label="$W$" class=highlight]
```

<!-- REVIEW: the lecture argues "by contradiction" starting from a minimum v–w cut δ(X) that crosses S; the case analysis below works for every minimum v–w cut, so the proof is written directly. -->
::: proof
Let $\delta(X)$ be any minimum $v$–$w$ cut. Since $\delta(X) = \delta(V \setminus X)$, we may assume $s \in X$ (otherwise replace $X$ by
$V \setminus X$), and by swapping the names $v$ and $w$ we may assume $v \in X$, $w \notin X$. Both $\delta(S \cap X)$ and $\delta(S \setminus X)$
are $v$–$w$ cuts given by subsets of $S$: $v \in S \cap X$, $w \notin S \cap X$, and $w \in S \setminus X$, $v \notin S \setminus X$. We show that one
of them is a minimum $v$–$w$ cut.

**Case $t \notin X$.** The set $X \cup S$ contains $s$ but not $t$, so $\delta(X \cup S)$ is an $s$–$t$ cut and $c(\delta(X \cup S)) \ge c(\delta(S))$.
By [[lem:cut-submodular]],
$$c(\delta(X \cup S)) + c(\delta(S \cap X)) \le c(\delta(S)) + c(\delta(X)),$$
hence $c(\delta(S \cap X)) \le c(\delta(X))$, and $\delta(S \cap X)$ is a minimum $v$–$w$ cut.

**Case $t \in X$.** The set $X \setminus S$ contains $t$ but not $s$, so $\delta(X \setminus S)$ is an $s$–$t$ cut and
$c(\delta(X \setminus S)) \ge c(\delta(S))$. By the second inequality of [[lem:cut-submodular]],
$$c(\delta(X \setminus S)) + c(\delta(S \setminus X)) \le c(\delta(S)) + c(\delta(X)),$$
hence $c(\delta(S \setminus X)) \le c(\delta(X))$, and $\delta(S \setminus X)$ is a minimum $v$–$w$ cut.

In both cases we found a minimum $v$–$w$ cut $\delta(W)$ with $W \subseteq S$.
:::

::: intuition
A cheapest cut between $s$ and $t$ is a "wall" that the cheapest cuts between vertices on one side never need to cross: if one did, uncrossing it
with the wall would give a cut that is no more expensive and stays on its side. Example: in [[fig:a03-network]], $\delta(\set{a, b})$ is a minimum
$b$–$f$ cut, and $\delta(\set{a})$, a minimum $a$–$b$ cut, stays inside $\set{a, b}$. Non-example: the lemma does not say that **every** minimum
$v$–$w$ cut stays inside $S$, only that one does.
:::

::: corollary {#cor:gomory-hu-contraction title="Contracting one side of a minimum cut" source="algorithms/03 p14"}
Let $\delta(X)$ be a minimum $p$–$q$ cut of $G$ for some vertices $p, q$, and let $G_X$ be obtained from $G$ by
[[def:node-identification|identifying]] $X$ into a single vertex. Then $f_G(s, t) = f_{G_X}(s, t)$ for all $s, t \in V \setminus X$, $s \ne t$.
:::

::: proof
By [[obs:identification-cuts]], the cuts of $G_X$ are exactly the cuts $\delta(U)$ of $G$ with $X \subseteq U$ or $X \cap U = \emptyset$, with the
same capacities. So $f_{G_X}(s, t) \ge f_G(s, t)$. Conversely, $\delta(V \setminus X) = \delta(X)$ is a minimum $p$–$q$ cut and $s, t \in V \setminus X$;
by [[lem:gomory-hu]] (with $S = V \setminus X$ and the one of $p, q$ in $S$ as $s$) there is a minimum $s$–$t$ cut $\delta(W)$ with
$W \subseteq V \setminus X$. Then $W \cap X = \emptyset$, so $\delta(W)$ is also a cut of $G_X$, and $f_{G_X}(s, t) \le f_G(s, t)$.
:::

::: intuition
Everything beyond a minimum cut may be squashed into one point without changing any minimum cut on this side. This justifies the [[def:edge-contraction|contraction]] step
of [[alg:gomory-hu]]: it makes $H$ smaller but keeps $f_H(a, b) = f_G(a, b)$. Example: in round 2 of [[ex:gomory-hu-lecture]], $\set{c, d, e, f}$ is a
side of the minimum $b$–$f$ cut, and contracting it keeps $f(a, b) = 18$. Non-example: contracting a set that is not the side of a minimum cut can
increase $f$; contracting $\set{a, b, c}$ hides every $a$–$b$ cut.
:::

The proof of the construction also needs two simple facts about minimum cut values, which hold in every undirected network (write $f = f_G$).

::: lemma {#lem:flow-triangle title="Triangle inequality" aka="Lemma A" source="algorithms/03 p19"}
For distinct $u, v, w \in V$: $\quad f(u, w) \ge \min(f(u, v), f(v, w))$.
:::

::: lemma {#lem:flow-triangle-path title="Transitive triangle inequality" aka="Lemma B" source="algorithms/03 p19"}
For $u = v_0, v_1, \dots, v_k = w \in V$ with $u \ne w$ and $v_{i-1} \ne v_i$ for all $i$:
$$f(u, w) \ge \min(f(v_0, v_1), f(v_1, v_2), \dots, f(v_{k-1}, v_k)).$$
:::

::: proof {title="Proof of both lemmas" for=lem:flow-triangle-path}
Let $\delta(U)$ be a minimum $u$–$w$ cut with $u \in U$, $w \notin U$. The sequence $v_0, \dots, v_k$ starts in $U$ and ends outside $U$, so for some
$i$, $v_{i-1} \in U$ and $v_i \notin U$. Then $\delta(U)$ separates $v_{i-1}$ and $v_i$, and
$f(v_{i-1}, v_i) \le c(\delta(U)) = f(u, w)$. Lemma A is the case $k = 2$, $v_1 = v$.
:::

::: intuition {for=lem:flow-triangle}
Any cut separating $u$ from $w$ must also separate $v$ from one of them, so it is at least as expensive as one of the two cheaper separations.
Example: in [[fig:a03-network]], $f(a, d) = 13 \ge \min(f(a, f), f(f, d)) = \min(17, 13)$. Non-example: the inequality is no "$\le$": $f(a, b) = 18$, but
$\min(f(a, d), f(d, b)) = 13$.
:::

::: intuition {for=lem:flow-triangle-path}
Along any route of intermediate vertices from $u$ to $w$, the cheapest $u$–$w$ cut has to break some step of the route, so it is at least the weakest
step. [[prop:gomory-hu-path]] is the case where the route is a tree path and equality holds. Example: along $a, b, f, e, d$ in
[[fig:a03-network]], the minimum of $18, 17, 13, 14$ is $13 = f(a, d)$.
:::

::: lemma {#lem:gomory-hu-invariant title="Existence of representatives" aka="tree construction invariant" source="algorithms/03 p18, p20–21"}
Let $T$ be an intermediate tree of [[alg:gomory-hu]] with nodes $S_i$. After each round: for every edge $S_iS_j$ of $T$ there are vertices
$a \in S_i$ and $b \in S_j$ such that $w(S_iS_j) = f_G(a, b)$ and the cut defined by the edge $S_iS_j$ is a minimum $a$–$b$ cut in $G$. (The cut
defined by $S_iS_j$ is $\delta(U)$, where $U$ is the union of the node sets in the component of $T - S_iS_j$ that contains $S_i$.)
:::

:::: proof
At the beginning $T$ has a single node and no edges, so the invariant holds. Assume it holds before a round that splits the node $S$ with the vertices
$a, b \in S$ into $S_a \ni a$ and $S_b \ni b$. Let $H$ be the contracted graph and $\delta_H(A)$ the minimum $a$–$b$ cut found, and read $A$, $B$ as
vertex sets of $G$. By [[obs:identification-cuts]], $\delta_G(A)$ has the same capacity as $\delta_H(A)$.

**The new edge $S_aS_b$, with representatives $a$ and $b$.** Let $C$ be a component of $T - S$, $U_C$ the union of its node sets, and $XS$ the edge of
$T$ joining $C$ to $S$. The cut defined by $XS$ is $\delta(U_C)$, and by the invariant it is a minimum $x$–$s$ cut for some $x \in X$, $s \in S$.
Since $a, b \in S \subseteq V \setminus U_C$, [[cor:gomory-hu-contraction]] says that contracting $U_C$ does not change $f(a, b)$. The other
components remain sides of minimum cuts after this contraction (their cuts are unchanged, and by the same corollary the values $f(x', s')$ of
their representatives do not change), so we may contract them one after the other. Hence $f_H(a, b) = f_G(a, b)$, and
$\delta_G(A)$ is a minimum $a$–$b$ cut of $G$ of capacity $w(S_aS_b) = f_G(a, b)$. The cut defined by the new edge $S_aS_b$ is $\delta(A)$:
the component of $S_a$ consists of $S_a$ and the components attached to it, whose vertices form exactly $A$.

**Edges not incident to $S$.** The split happens on one side of such an edge, so the vertex sets of its two sides do not change, nor does its
capacity. Keep the old representatives.

**An edge $XS$ that becomes $XS_a$** (the case $XS_b$ is symmetric). The sides of the cut defined by the edge do not change: one side is still $U_C$
for the component $C$ of $T - S$ containing $X$, and $U_C \subseteq A$ by the reconnection rule. Let $x \in X$, $s \in S$ be the old representatives,
so $w(XS) = f_G(x, s)$ and $\delta(U_C)$ is a minimum $x$–$s$ cut.

- If $s \in S_a$, keep $x$ and $s$.
- If $s \in S_b$, choose $x$ and $a$ as the new representatives. Since $\delta(U_C)$ separates $x$ from $a \in S$ and has capacity $f_G(x, s)$, it
  suffices to show $f_G(x, a) = f_G(x, s)$. First, $f_G(x, a) \le c(\delta(U_C)) = f_G(x, s)$. For the opposite inequality, let $B$ be the side of
  $b$ of the minimum $a$–$b$ cut $\delta(A)$; then $s \in S_b \subseteq B$ and $x \in U_C \subseteq A$. Identify $B$ into a vertex $v_B$, obtaining
  $G_B$. Then
  - $f_G(x, a) = f_{G_B}(x, a)$ by [[cor:gomory-hu-contraction]], as $x, a \notin B$;
  - $f_{G_B}(x, a) \ge \min(f_{G_B}(x, v_B), f_{G_B}(v_B, a))$ by [[lem:flow-triangle]];
  - $f_{G_B}(x, v_B) \ge f_G(x, s)$: by [[obs:identification-cuts]], an $x$–$v_B$ cut of $G_B$ is a cut of $G$ separating $x$ from all of $B \ni s$;
  - $f_{G_B}(v_B, a) \ge f_G(b, a)$ in the same way, as $b \in B$; and $f_G(b, a) = c(\delta(A)) \ge f_G(x, s)$, because $\delta(A)$ also separates
    $x \in A$ from $s \in B$.

  Together $f_G(x, a) \ge \min(f_G(x, s), f_G(x, s)) = f_G(x, s)$.

So the invariant holds after the round.
::::

::: intuition
Each tree edge "remembers" a pair of vertices, one on each side, for which it records the exact minimum cut. Splitting a node may move a
representative to the wrong part; the proof shows that the new splitting vertex $a$ can then take its place, because the old cut is still cheapest
for it. Example: in round 2 of [[ex:gomory-hu-lecture]], the edge $\set{a, b}\,\set{c, d, e, f}$ (representatives $b$, $f$) becomes the edge
$b\,\set{c, d, e, f}$, and $b$ stays a representative. In round 5, the edge $\set{c, e}\,d$ (representatives $e$, $d$) becomes $e\,d$.
:::

::: theorem {#thm:gomory-hu title="Correctness of the construction" source="algorithms/03 p22"}
The tree $T$ produced by [[alg:gomory-hu]] (with each final node $\set{v}$ identified with the vertex $v$) is a
[[def:gomory-hu-tree|Gomory–Hu tree]] for $G$. In particular, every undirected network has a Gomory–Hu tree, and it can be computed with $n - 1$
minimum $s$–$t$ cut (maximum flow) computations.
:::

:::: proof
Each round replaces one node by two and one tree edge between them, and reattaches the other neighbours, so $T$ stays a tree and the number of nodes
grows by one. Every round can be performed while some node has at least two vertices, so after $n - 1$ rounds all nodes are single vertices and
$T$ is a tree on $V$. By [[lem:gomory-hu-invariant]] with singleton nodes, every edge $uv$ of $T$ has $w(uv) = f_G(u, v)$, and the cut defined by
$uv$ is a minimum $u$–$v$ cut of $G$.

**Flow equivalence.** Let $s = v_0, v_1, \dots, v_k = t$ be the $s$–$t$ path in $T$. By [[prop:gomory-hu-path]]'s argument (which uses only that
$T$ is a tree), $f_T(s, t) = \min_i w(v_{i-1}v_i) = \min_i f_G(v_{i-1}, v_i)$, which is at most $f_G(s, t)$ by [[lem:flow-triangle-path]].
Conversely, the cut defined by each path edge $v_{i-1}v_i$ separates $s$ and $t$ (the path crosses this edge once), so
$f_G(s, t) \le \min_i w(v_{i-1}v_i) = f_T(s, t)$.

**Cut property.** Let $\delta_T(U)$ be a minimum $s$–$t$ cut of $T$. It contains an edge of the path, and its capacity is $f_T(s, t)$, the minimum
capacity on the path. All capacities are positive ($G$ is connected), so $\delta_T(U)$ consists of a single path edge $e$ of minimum capacity, and $U$ is a
component of $T - e$. So $\delta_G(U)$ is the cut defined by $e$; it separates $s$ and $t$, and its capacity is $w(e) = f_T(s, t) = f_G(s, t)$.
Hence it is a minimum $s$–$t$ cut of $G$.
::::

<!-- REVIEW: the lecture proves the cut property first ("by the invariant") and flow equivalence second; here the cut property uses flow equivalence (the capacity of the cut equals f_T(s, t) = f_G(s, t)) and positivity of the tree weights, so the order is swapped. -->

::: intuition
The invariant says every tree edge is a correct minimum cut for its own two ends; the triangle inequality then spreads this to all pairs along the
tree paths. Example: the tree of [[fig:a03-network]] was built by [[ex:gomory-hu-lecture]], and all $15$ pairs can be checked against
[[prop:gomory-hu-path]]. With Dinic's algorithm the construction takes $\O((n - 1) \cdot n^2 m)$ time, instead of $\O(n^2 \cdot n^2 m)$ for all pairs separately.
:::

::: remark
**In practice** the algorithm works well, with some problems once the graph has more than a few thousand nodes. The overhead is the alternating
contraction and expansion; an optimisation is not to expand a set until it is split. **Gusfield (1990)** gave a version without any vertex
contraction, which saves this overhead and has the same running time; experimental evaluations are available. (Gusfield's trees are equivalent
flow trees; a modification also gives the cut property.)
:::

## Global minimum cuts

So far we looked for minimum $s$–$t$ cuts between a **given** pair of vertices, which correspond to maximum [[def:flow|flows]] between them
([[thm:maxflow-mincut]]). Now we want the cheapest [[def:undirected-cut|cut]] of the whole network.

::: definition {#def:global-min-cut title="Minimum cut" defines="global minimum cut" source="algorithms/03 p25"}
Let $G = (V, E)$ be a connected undirected graph with a [[def:flow-network|capacity]] function $c : E \to \R^+$. A **minimum cut** (global minimum cut) of $G$ is a set
$A = \delta(S)$ with $\emptyset \ne S \ne V$ such that $c(A)$ is minimum. We write

- $\lambda(G)$ for the capacity of a minimum cut of $G$, and
- $\lambda(G; v, w)$ for the capacity of a minimum $v$–$w$ cut of $G$ (so $\lambda(G; v, w) = f_G(v, w)$).
:::

::: intuition
The global minimum cut is the cheapest way to break the network into two pieces, wherever the break happens. With all capacities $1$, $\lambda(G)$ is
the edge connectivity from the theory course: the largest $k$ such that $G$ is [[def:k-connected|$k$-edge-connected]].
Example: in [[fig:a03-network]], $\lambda(G) = 13$, attained by $\delta(\set{c, d, e})$; every single vertex has $c(\delta(v)) \ge 14$. Non-example:
$\delta(\emptyset) = \emptyset$ has capacity $0$, but it does not split $G$ and is not a cut.
:::

::: proposition {#prop:global-cut-flows title="Global minimum cut by n − 1 flows" source="algorithms/03 p29"}
Fix a vertex $s$ of $G$. Then $\lambda(G) = \min_{t \ne s} \lambda(G; s, t)$. So a minimum cut can be found by solving $n - 1$ maximum-flow problems,
in time $\O(n^4)$ with an $\O(n^3)$ maximum-flow algorithm.
:::

::: proof
Every $s$–$t$ cut is a cut, so $\lambda(G) \le \lambda(G; s, t)$ for all $t$. Conversely, let $\delta(S)$ be a minimum cut; as $\emptyset \ne S \ne V$,
it separates $s$ from some vertex $t$ (any vertex on the other side), so $\lambda(G; s, t) \le \lambda(G)$. Each $\lambda(G; s, t)$ is one maximum-flow
computation in the network with two opposite arcs per edge (see [[def:undirected-cut]]); with MPM ([[thm:mpm-time]]), $\O(n^3)$ each.
:::

::: intuition
Whatever the minimum cut is, the fixed vertex $s$ lies on one side and some $t$ on the other; trying every $t$ cannot miss it. Example: in
[[fig:a03-network]] with $s = a$, the values $f(a, t)$ for $t = b, c, d, e, f$ are $18, 13, 13, 13, 17$, and their minimum is $\lambda(G) = 13$.
A [[def:gomory-hu-tree|Gomory–Hu tree]] gives the same with its $n - 1$ flows: $\lambda(G)$ is its lightest edge ([[exr:a03-lambda-from-tree]]).
:::

The rest of the lecture finds $\lambda(G)$ **without** maximum flows.

## The Stoer–Wagner algorithm

[[def:node-identification|Node identification]] gives a recursive view of the [[def:global-min-cut|global minimum cut]]. All [[def:flow-network|capacities]] are positive, as before.

::: corollary {#cor:identification-mincut title="Minimum cut by identification" source="algorithms/03 p32"}
For all $v \ne w \in V(G)$:
$$\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w)),$$
where $\lambda(G_{vw}) = \infty$ if $G_{vw}$ has only one vertex.
:::

::: proof
By [[obs:identification-cuts]], every cut of $G_{vw}$ is a cut of $G$, so $\lambda(G_{vw}) \ge \lambda(G)$, and clearly $\lambda(G; v, w) \ge \lambda(G)$.
A minimum cut of $G$ either separates $v$ and $w$, and then $\lambda(G) = \lambda(G; v, w)$, or it does not, and then it is a cut of $G_{vw}$ with the
same capacity, so $\lambda(G) = \lambda(G_{vw})$.
:::

::: intuition
The minimum cut either separates $v$ from $w$ or it does not. In the first case one $v$–$w$ cut computation finds it; in the second, gluing $v$ and $w$
together loses nothing. Example: for $v = c$, $w = e$ in [[fig:a03-network]], $\lambda(G; c, e) = 15$, and $G_{ce}$ still has the cut
$\delta(\set{c, d, e})$ of capacity $13$, so $\lambda(G) = \min(13, 15) = 13$.
:::

::: algorithm {#alg:simple-min-cut title="Simple algorithm for minimum cut" source="algorithms/03 p32"}
```pseudo
repeat n − 2 times                                            // @loop
    choose two vertices v, w                                  // @choose
    compute a minimum v–w cut of G       // can be expensive! @cut
    G ← G_vw                                                  // @identify
the last graph has two vertices and a single (trivial) cut    // @last
return the best of these n − 1 cuts                           // @return
```
:::

By [[cor:identification-mincut]] and induction, the best of the cuts found is a minimum cut of $G$ (and by [[obs:identification-cuts]] each of them
is a cut of the original $G$).

::: intuition {for=alg:simple-min-cut}
Unroll the corollary: $\lambda(G) = \min(\lambda(G; v_1, w_1), \lambda(G_{v_1w_1}))$, and so on, until two vertices are left. Each step shrinks the
graph by one vertex. Example: on [[fig:a03-network]], choosing the pairs that Stoer–Wagner chooses below gives the cuts $14, 15, 13, 17, 18$, with
minimum $13$. As written, the algorithm still needs $n - 2$ minimum $v$–$w$ cuts, which is no better than [[prop:global-cut-flows]].
:::

**Node identification algorithm (Nagamochi–Ibaraki 1992, Stoer–Wagner 1994).** It does not use any maximum-flow computation. It was first
discovered by Nagamochi and Ibaraki; Stoer and Wagner gave a simpler description and proof. The main idea: in
$\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w))$, choose $v$ and $w$ **so that the minimum $v$–$w$ cut is easy to find**.

::: definition {#def:tightly-connected title="Most tightly connected vertex" defines="most tightly connected vertex" source="algorithms/03 p35"}
For $U \subseteq V$ and $v \notin U$ let
$$c(U, v) = c(\delta(U) \cap \delta(v)) = \sum_{u \in U,\ uv \in E} c(uv)$$
be the sum of the capacities of all edges between $U$ and $v$. A vertex $v \notin U$ is **most tightly connected** to $U$ if
$c(U, v) = \max\set{c(U, w) \mid w \notin U}$.
:::

::: intuition
The most tightly connected vertex is the outside vertex that would be hardest to cut off from $U$. Growing $U$ by always taking it is like
[[alg:jarnik|Jarník's algorithm]], but with the **sum** of the edges into $U$ as the key instead of the lightest single edge. Example: in
[[fig:a03-network]] with $U = \set{a, b}$, $c(U, f) = 8 + 3 = 11$, $c(U, c) = 4$, $c(U, e) = 2$, $c(U, d) = 0$, so $f$ is most tightly connected.
Non-example: $c(U, v)$ is not $c(\delta(v))$: the edges from $v$ to other outside vertices do not count.
:::

::: algorithm {#alg:stoer-wagner title="Stoer–Wagner algorithm" source="algorithms/03 p34–35"}
```pseudo
MINIMUMCUT(G, c)
    A ← ∅            // minimum cut so far     @init
    M ← ∞            // its capacity
    while |V| > 1 do                           // @loop
        (s, t) ← MINCUTPHASE(G, c)             // @phase
        if c(δ(t)) < M then                    // @compare
            M ← c(δ(t)); A ← δ(t)              // @record
        G ← G_st                               // @identify
    return A                                   // @return

MINCUTPHASE(G, c)
    u ← some vertex of G; U ← {u}              // @start
    while U ≠ V do
        v ← most tightly connected to U        // @add
        U ← U ∪ {v}
    // v_1, …, v_n: the order of adding to U
    return (v_{n−1}, v_n)                      // @end
```
:::

The idea: repeatedly find two vertices $s, t$ such that $\delta(t)$ is a minimum $s$–$t$ cut ([[thm:mincut-phase]]), identify $s$ and $t$, and
remember the smallest cut so far. In the identified graph, $t$ may stand for a set $T$ of original vertices; then $\delta(t)$ is the cut
$\delta(T)$ of the original graph, with the same capacity ([[obs:identification-cuts]]). The cut $\delta(t)$ is called the **cut of the phase**;
its capacity is $c(V \setminus \set{t}, t)$, the key of $t$ when it is added.

::: intuition {for=alg:stoer-wagner}
Each phase orders the vertices by "growing a blob" from an arbitrary start, always swallowing the vertex most attached to the blob. The last vertex
$t$ is the one least attached when it joins, and the theorem below shows that cutting it off alone is the best way to separate it from the
second-to-last vertex $s$. So $s$ and $t$ can be glued together, as in [[alg:simple-min-cut]], but the $s$–$t$ cut came for free. Example: in
[[fig:a03-stoer-wagner-player]], phase 3 adds $a, b, f, \set{c, d, e}$ and finds the cut $\delta(\set{c, d, e})$ of capacity $13 = \lambda(G)$.
:::

```graph id=a03-stoer-wagner-player widget=player
caption: The Stoer–Wagner algorithm on the lecture network, starting every phase from $a$. Badges show the keys $c(U, v)$. The cuts of the phases have capacities $14, 15, 13, 17, 18$; the minimum $13$ is found in phase 3.
intent: Algorithm player; identification of s and t is animated as a merge (parallel edges merged with summed capacities). The lecture's demonstration (slide p36) is not in the PDF, so the lecture network is used.
algo: stoer-wagner
params: start=a
layout: fixed
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
```

### Correctness

::: theorem {#thm:mincut-phase title="The cut of the phase" source="algorithms/03 p38–39"}
If $\textsf{MINCUTPHASE}(G, c) = (s, t)$, then $\delta(t)$ is a minimum $s$–$t$ cut of $G$.
:::

Let $v_1, \dots, v_n$ be the order in which the vertices were added to $U$ during $\textsf{MINCUTPHASE}$ (so $s = v_{n-1}$, $t = v_n$), and fix any
$s$–$t$ cut $C$ of $G$. A vertex $v = v_i$ ($i \ge 2$) is **active** (with respect to $C$) if $v_{i-1}$ and $v_i$ lie on different sides of $C$. For an
active vertex $v = v_i$ let $U_v = \set{v_1, \dots, v_{i-1}}$, and let $C_v$ be the cut of the induced subgraph $G[U_v \cup \set{v}]$ induced by $C$
(the edges of $C$ with both ends in $U_v \cup \set{v}$).

:::: proof
We know that $\delta(t)$ is an $s$–$t$ cut. It remains to show $c(\delta(t)) \le c(C)$ for every $s$–$t$ cut $C$. We prove a claim by induction on
the active vertices.

::: claim {#claim:active-vertex title="Active vertices"}
For every active vertex $v$: $\quad c(U_v, v) \le c(C_v)$.
:::

**Base case:** $v = v_i$ is the first active vertex. Then $v_1, \dots, v_{i-1}$ all lie on the same side of $C$ (no vertex before $v$ is active) and
$v$ lies on the other side. So the edges of $C$ inside $U_v \cup \set{v}$ are exactly the edges between $U_v$ and $v$, and $c(U_v, v) = c(C_v)$.

**Inductive step:** assume the claim for all active vertices up to $v$, and let $u$ be the next active vertex. Then
$$c(U_u, u) = c(U_v, u) + c(U_u \setminus U_v, u).$$
When $v$ was added, $u$ was outside $U = U_v$ too, and $v$ was the most tightly connected vertex, so $c(U_v, u) \le c(U_v, v) \le c(C_v)$, the latter by
the induction hypothesis. The vertices of $U_u \setminus U_v$ are $v$ and the vertices added after $v$ and before $u$. None of them except $v$ is
active, so they all lie on the side of $v$; and $u$, being active, lies on the other side of its predecessor, hence on the other side of all of them.
So every edge between $U_u \setminus U_v$ and $u$ belongs to $C_u$, but not to $C_v$ (it has the end $u \notin U_v \cup \set{v}$). Since
$C_v \subseteq C_u$,
$$c(U_u, u) \le c(C_v) + c(U_u \setminus U_v, u) \le c(C_u).$$

To complete the proof of the theorem, note that $t = v_n$ is always active, because $C$ separates $s = v_{n-1}$ and $t$. Moreover
$U_t \cup \set{t} = V$, so $C_t = C$, and $c(U_t, t) = c(\delta(t))$. The claim gives $c(\delta(t)) \le c(C)$.
::::

::: intuition
Think of the order $v_1, \dots, v_n$ as a race: each vertex joins when it is the most attached. Walking along the order, every time the order jumps
across $C$, the jumping vertex's attachment is paid for by edges of $C$ seen so far, because otherwise it would not have been preferred. The last
jump is $t$, and its whole attachment $c(\delta(t))$ is paid for by $C$. Example: in phase 1 of [[fig:a03-stoer-wagner-player]], the order is
$a, b, f, c, e, d$, so $\delta(d)$ of capacity $14$ is a minimum $e$–$d$ cut; indeed $f_G(e, d) = 14$ in [[fig:a03-network]]. Non-example: it is
**not** claimed to be a global minimum cut ($\lambda(G) = 13$).
:::

::: corollary {#cor:stoer-wagner title="Correctness of Stoer–Wagner" source="algorithms/03 p34"}
$\textsf{MINIMUMCUT}(G, c)$ returns a minimum cut of $G$.
:::

::: proof
By induction on $n$; for $n = 1$ there is no cut and nothing to show (the loop does not run). For $n \ge 2$, the first phase returns $s, t$ with
$c(\delta(t)) = \lambda(G; s, t)$ by [[thm:mincut-phase]], and the algorithm continues on $G_{st}$, finding $\lambda(G_{st})$ by induction (each cut of
$G_{st}$ being a cut of $G$ with the same capacity, [[obs:identification-cuts]]). The result is $\min(\lambda(G; s, t), \lambda(G_{st})) = \lambda(G)$ by
[[cor:identification-mincut]].
:::

::: intuition
Each phase settles one pair $s, t$ for free and then glues it; [[cor:identification-mincut]] guarantees that the minimum over the $n - 1$ cuts of the
phases is the answer. Example: the phases on [[fig:a03-network]] give $14, 15, 13, 17, 18$, and the answer is $13$.
:::

::: proposition {#prop:stoer-wagner-time title="Running time of Stoer–Wagner" source="algorithms/03 p37"}
The Stoer–Wagner algorithm runs in time $\O(nm + n^2 \log n)$.
:::

::: proof
The main loop of $\textsf{MINIMUMCUT}$ is executed $n - 1$ times. In $\textsf{MINCUTPHASE}$, the bottleneck is choosing the most tightly
connected vertex. The vertices not in $U$ are kept in a priority queue with the key $c(U, v)$. Adding a vertex $v$ to $U$ is an
$\textsf{EXTRACT-MAX}$, and increases the keys of its neighbours outside $U$; so a phase performs $\abs{V}$ $\textsf{EXTRACT-MAX}$ and $\abs{E}$
$\textsf{INCREASE-KEY}$ operations. With Fibonacci heaps a phase takes $\O(m + n \log n)$. Two vertices can be identified in time $\O(n)$ (merge
their rows of capacities, adding the capacities of parallel edges). In total $\O(n(m + n \log n)) = \O(nm + n^2 \log n)$.
:::

::: intuition
Each phase is essentially one run of Prim's algorithm with a max-heap, and there are $n - 1$ phases. Compared with $n - 1$ maximum [[def:flow|flows]]
([[prop:global-cut-flows]], $\O(n^4)$), this is much faster: for $m = \O(n^2)$ it is $\O(n^3)$. Example: for $n = 1000$ and $m = 10\,000$, about
$10^7 + 10^6 \cdot 10$ elementary steps instead of $10^{12}$.
:::

## Random contractions: Karger's algorithm

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

### Probability of an error

::: lemma {#lem:karger-success title="One run finds a fixed minimum cut" source="algorithms/03 p43"}
Let $C$ be a minimum cut of $G$, $n \ge 2$. Then $\textsf{CONTRACT}(G)$ returns $C$ with probability at least
$$\prod_{i=0}^{n-3} \left(1 - \frac{2}{n - i}\right) = \prod_{i=0}^{n-3} \frac{n - i - 2}{n - i} = \binom{n}{2}^{-1} = \frac{2}{n(n - 1)}.$$
:::

::: proof
We write it for unweighted multigraphs; for capacities, replace "number of edges" by "capacity" throughout. Suppose $C$ has exactly $k$ edges.
Every $\delta(v)$ is a cut, so the minimum degree of $G$ is at least $k$, and $\abs{E} \ge nk/2$. The probability that the first contraction
chooses an edge of $C$ is therefore
$$\frac{k}{\abs{E}} \le \frac{k}{nk/2} = \frac{2}{n}.$$
If no edge of $C$ has been contracted so far, then after $i$ contractions the graph has $n - i$ vertices, $C$ is still a cut of it (no edge of $C$
lies inside a merged vertex), and every cut of it is a cut of $G$ ([[obs:identification-cuts]]); so its minimum cut still has $k$ edges and the same
argument bounds the probability that the $(i + 1)$-th contraction chooses an edge of $C$ by $2/(n - i)$. Multiplying the conditional probabilities of
avoiding $C$ in the contractions $1, \dots, n - 2$ gives the product, which telescopes:
$$\prod_{i=0}^{n-3} \frac{n - i - 2}{n - i} = \frac{(n-2)(n-3)\cdots 1}{n(n-1)\cdots 3} = \frac{2}{n(n-1)}.$$
Finally, if no edge of $C$ was ever contracted, each of the two remaining vertices consists of vertices of one side of $C$; both sides are
non-empty, so the two vertices are exactly the two sides and the returned cut is $C$.
:::

::: intuition
Early contractions are very safe: an edge of a minimum cut is a small fraction of all edges, because every vertex has at least as many edges as the
minimum cut. The danger grows as the graph shrinks, and the product of the survival chances is $1 / \binom{n}{2}$. Example: for $n = 5$ the bound is
$\frac{3}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} = \frac{1}{10}$. For the graph of [[fig:a03-karger-good]] the true probability is much higher than the
bound $1/28$, since the minimum cut has only $2$ of the $14$ edges.
:::

::: corollary {#cor:number-min-cuts title="Number of minimum cuts" source="algorithms/03 p49"}
A graph with $n$ vertices has at most $\binom{n}{2}$ minimum cuts.
:::

::: proof
The events "$\textsf{CONTRACT}(G)$ returns $C$" for different minimum cuts $C$ are disjoint, and each has probability at least $1/\binom{n}{2}$ by
[[lem:karger-success]]. The probabilities sum to at most $1$.
:::

::: intuition
A probabilistic algorithm proves a purely combinatorial fact: since each minimum cut has a fair chance of being the single output, there cannot be
many of them. The bound is tight for the cycle $C_n$ ([[exr:a03-cycle-min-cuts]]). Example: the graph of [[fig:a03-karger-good]] has exactly one
minimum cut, far below $\binom{8}{2} = 28$.
:::

So a single run succeeds with probability at least $2/(n(n-1))$, which is small. But we can run the algorithm many times and take the smallest cut.
How many times?

::: theorem {#thm:karger-iterate title="Iterating CONTRACT" source="algorithms/03 p44"}
Let $C$ be a minimum cut of $G$ and $k \in \N$. The probability that $\textsf{CONTRACT}$ does not return $C$ in any of $kn^2$ independent runs is at
most $e^{-2k}$.
:::

::: proof
By [[lem:karger-success]] and independence, using $1 - x \le e^{-x}$:
$$\left(1 - \frac{2}{n(n-1)}\right)^{kn^2} \le \left(1 - \frac{2}{n^2}\right)^{kn^2} \le e^{-\frac{2}{n^2} \cdot kn^2} = e^{-2k}.$$
:::

::: intuition
Each run is a lottery ticket with a chance of about $2/n^2$; with $kn^2$ tickets you expect about $2k$ wins, and the chance of none decays
exponentially in $k$. Example: for $n = 10$, $10 n^2 = 1000$ runs miss a given minimum cut with probability at most $e^{-20} \approx 2 \cdot 10^{-9}$.
:::

<!-- REVIEW: the lecture writes "n² times: correct with probability more than 1 − 1/e"; the theorem with k = 1 gives the stronger 1 − e^{−2} ≈ 0.86, which is stated here (1 − e^{−2} > 1 − 1/e). -->
Practical consequences ($\log$ is the natural logarithm here):

- $10n^2$ runs: correct with probability at least $1 - e^{-20} > 0.99999999$;
- $n^2$ runs: correct with probability at least $1 - e^{-2} \approx 0.86$ (in particular more than $1 - 1/e$);
- $n^2 \log n$ runs ($k = \log n$): correct with probability at least $1 - 1/n^2$.

::: definition {#def:whp title="With high probability" defines="with high probability, WHP" source="algorithms/03 p45"}
An event depending on the input size $n$ happens **with high probability** (WHP) if its probability is at least $1 - 1/n$.
:::

::: intuition
"With high probability" means the failure probability shrinks with the input size, not just that it is small for one $n$. Example: $n^2 \log n$ runs of
$\textsf{CONTRACT}$ fail with probability at most $1/n^2 \le 1/n$, so they find a minimum cut WHP. Non-example: a fixed success probability $0.99$ is not
WHP, since $1 - 1/n > 0.99$ for $n > 100$.
:::

::: theorem {#thm:karger-whp title="Karger's algorithm" source="algorithms/03 p45"}
Running Karger's algorithm $\O(n^2 \log n)$ times gives a minimum cut [[def:whp|with high probability]] and takes time $\O(n^4 \log n)$.
:::

::: proof
Take $k = \lceil (\log n) / 2 \rceil$ in [[thm:karger-iterate]]: $kn^2 = \O(n^2 \log n)$ runs miss a fixed minimum cut with probability at most
$e^{-2k} \le e^{-\log n} = 1/n$. Each run takes $\O(n^2)$, which gives $\O(n^4 \log n)$ in total.
:::

::: intuition
Polynomially many repetitions turn a tiny success probability into near certainty, but the price is high: $\O(n^4 \log n)$ is slower than
Stoer–Wagner's $\O(nm + n^2 \log n)$ ([[prop:stoer-wagner-time]]). The next section fixes this. Example: for $n = 100$ this is about $100^4 \cdot 4.6 \approx 5 \cdot 10^8$ steps.
:::

## The Karger–Stein algorithm

(Karger–Stein 1996; Clifford Stein is the "S" in the textbook [CLRS].) By the proof of [[lem:karger-success]], the probability of contracting an edge of
a minimum cut in step $i + 1$ is at most $2/(n - i)$, and it **increases with each step**: $2/n$ in the first step, but $2/3$ in the last. So most
of the risk is at the end. Solution: an algorithm $\textsf{CONTRACT}(G, t)$, which works exactly as $\textsf{CONTRACT}(G)$ but stops when $t$
vertices are left, and is called recursively, twice.

<!-- REVIEW: slide p46 says CONTRACT(G, t) "stops when t edges are left". The product over i = 0, …, n − t − 1 (n − t contractions) and the sizes n/2^{i/2} in the analysis show that t vertices are meant. -->
::: lemma {#lem:contract-t title="Contracting down to t vertices" source="algorithms/03 p46"}
Let $C$ be a minimum cut of $G$ and $2 \le t \le n$. $\textsf{CONTRACT}(G, t)$ contracts no edge of $C$ with probability at least
$$\prod_{i=0}^{n-t-1} \left(1 - \frac{2}{n - i}\right) = \binom{t}{2} \cdot \binom{n}{2}^{-1}.$$
For $t = \lceil 1 + n/\sqrt{2} \rceil$ (and $n \ge 7$) this is still at least $1/2$.
:::

::: proof
The first part is the argument of [[lem:karger-success]] for the first $n - t$ [[def:edge-contraction|contractions]]; the product telescopes to
$\frac{(n-2)(n-3)\cdots(t-1)}{n(n-1)\cdots(t+1)} = \frac{t(t-1)}{n(n-1)}$. For $t \ge 1 + n/\sqrt{2}$ we have $t - 1 \ge n/\sqrt{2}$ and
$t \ge n/\sqrt{2}$, so $t(t-1) \ge n^2/2 \ge n(n-1)/2$, and the probability is at least $1/2$. For $n \ge 7$, $t = \lceil 1 + n/\sqrt{2} \rceil < n$, so
at least one contraction is made.
:::

::: intuition
Stopping early avoids the risky last steps: contracting from $n$ down to about $0.7 n$ vertices keeps a given minimum cut with probability at least a
half. Example: for $n = 10$, $t = \lceil 1 + 7.07 \rceil = 9$, and the bound is $\binom{9}{2}/\binom{10}{2} = 36/45 = 0.8$. For $n = 100$, $t = 72$ and
the bound is $\frac{72 \cdot 71}{100 \cdot 99} \approx 0.52$.
:::

::: algorithm {#alg:fast-mincut title="FASTMINCUT (Karger–Stein)" source="algorithms/03 p47"}
```pseudo
FASTMINCUT(G)
    if |V| ≤ 6 then                                    // @small
        return MINIMUMCUT(G)                           // @exact
    else
        t ← ⌈1 + n/√2⌉                                 // @size
        C_1 ← FASTMINCUT(CONTRACT(G, t))               // @first
        C_2 ← FASTMINCUT(CONTRACT(G, t))               // @second
        return min(C_1, C_2)                           // @return
```
:::

Here $\textsf{MINIMUMCUT}$ is any exact algorithm, e.g. [[alg:stoer-wagner]]; both recursive calls use independent random choices.

::: intuition {for=alg:fast-mincut}
Do the safe part of the contraction once per branch, and spend the effort where the risk is: each half-sized problem is solved twice, independently,
so a failure in one branch is likely repaired by the other. Example: for $n = 1000$, each call contracts to $t = 709$ vertices, then each of the two
recursive calls to $503$ vertices, and so on: $19$ levels until at most $6$ vertices are left.
:::

::: proposition {#prop:fast-mincut-time title="Running time of FASTMINCUT" source="algorithms/03 p47"}
$\textsf{FASTMINCUT}$ runs in time $\O(n^2 \log n)$.
:::

::: proof
In each recursion level the size decreases by a factor of $\sqrt{2}$ (up to the additive $1$ and rounding), so there are $\O(2 \log n) = \O(\log n)$
levels. In the $i$-th level there are $2^i$ subproblems, of size about $n / 2^{i/2}$ each; each calls $\textsf{CONTRACT}$ twice, in time
$\O((n/2^{i/2})^2) = \O(n^2/2^i)$ per call. So every level costs $2^i \cdot \O(n^2 / 2^i) = \O(n^2)$, and the total time is $\O(n^2 \log n)$.
:::

::: intuition
The recursion tree doubles in width while the problem area $n^2$ halves, so every level costs the same $\O(n^2)$. Example: $T(n) = 2\,T(n/\sqrt{2}) + \O(n^2)$
is the "balanced" case of the master theorem, like merge sort's $T(n) = 2\,T(n/2) + \O(n)$.
:::

::: theorem {#thm:fast-mincut-probability title="Success probability of FASTMINCUT" source="algorithms/03 p48"}
Let $P(n)$ be a lower bound on the probability that $\textsf{FASTMINCUT}$ returns a fixed minimum cut $C$ of a graph with $n$ vertices. For $n \ge 7$:
$$P(n) \ge 1 - \left(1 - \frac{1}{2} P\left(\left\lceil 1 + \frac{n}{\sqrt{2}} \right\rceil\right)\right)^2,$$
and the solution of this recurrence is $P(n) = \Omega(1 / \log n)$.
:::

::: proof
A branch returns $C$ if $\textsf{CONTRACT}(G, t)$ keeps $C$ (probability at least $1/2$ by [[lem:contract-t]]) and the recursive call on the
contracted graph, of size $t$, returns $C$ (probability at least $P(t)$). So a branch fails with probability at most $1 - \frac{1}{2}P(t)$, and the
two independent branches both fail with probability at most $(1 - \frac{1}{2}P(t))^2$. This gives the recurrence.

<!-- REVIEW: the lecture only says "solving this recurrence we get P(n) = Ω(1/log n)"; the induction below fills this in. -->
For the solution, write $x = P(t)$; the recurrence reads $P(n) \ge 1 - (1 - x/2)^2 = x - x^2/4$. The function $g(x) = x - x^2/4$ is increasing on
$[0, 1]$. Number the recursion levels from the bottom: graphs with at most $6$ vertices are solved exactly, $P = 1$ at depth $0$. We show
$p_d \ge 1/(d + 1)$ for the success probability $p_d$ at depth $d$, by induction: $p_{d+1} \ge g(p_d) \ge g(1/(d+1))$, and
$$g\!\left(\frac{1}{d+1}\right) = \frac{1}{d+1} - \frac{1}{4(d+1)^2} \ge \frac{1}{d+2} \iff \frac{1}{(d+1)(d+2)} \ge \frac{1}{4(d+1)^2} \iff 4(d+1) \ge d+2,$$
which holds. The depth of the recursion is $\O(\log n)$ ([[prop:fast-mincut-time]]), so $P(n) = \Omega(1/\log n)$.
:::

::: intuition
Each level of the recursion loses at most a little success probability: with chance $\ge 1/2$ a branch keeps the cut, and two branches back each other
up. The loss per level is only quadratic in the current probability, so after $\O(\log n)$ levels the success probability is still about
$1/\log n$, much more than Karger's $2/n^2$. Example: at depth $1$, $p_1 \ge 1 - 1/4 = 3/4$, at depth $2$, $p_2 \ge 3/4 - 9/64 \approx 0.61$.
:::

::: theorem {#thm:karger-stein title="Karger–Stein" source="algorithms/03 p48"}
There is an algorithm which finds a specific minimum cut $C$ [[def:whp|with high probability]] in time $\O(n^2 \log^3 n)$.
:::

::: proof
Run $\textsf{FASTMINCUT}$ $r = \lceil \log n / P(n) \rceil = \O(\log^2 n)$ times independently and keep the best cut. All runs miss $C$ with
probability at most $(1 - P(n))^r \le e^{-r P(n)} \le e^{-\log n} = 1/n$. The time is $r \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$ by
[[prop:fast-mincut-time]].
:::

::: intuition
$\O(\log^2 n)$ repetitions of an $\O(n^2 \log n)$ algorithm with success probability $\Omega(1/\log n)$: compared with $\O(n^2 \log n)$ repetitions of
Karger's $\O(n^2)$ algorithm, the speed-up is a factor of about $n^2 / \log^2 n$. Example: for $n = 1000$, about $1000^2 \cdot 7^3 \approx 3 \cdot 10^8$ steps
instead of $1000^4 \cdot 7 = 7 \cdot 10^{12}$.
:::

::: theorem {#thm:karger-stein-all title="All minimum cuts" source="algorithms/03 p49"}
All minimum cuts of a weighted graph with $n$ vertices can be found [[def:whp|with high probability]] in time $\O(n^2 \log^3 n)$.
:::

::: proof
The probability of missing a specific minimum cut in one run of $\textsf{FASTMINCUT}$ is at most $1 - P(n)$ with $P(n) \ge a/\log n$ for some
constant $a > 0$ ([[thm:fast-mincut-probability]]). Run it $r = \lceil 4 \log^2 n / a \rceil = \O(\log^2 n)$ times and collect all cuts of the minimum
[[def:flow-network|capacity]] found. A specific minimum cut $C$ is missed with probability at most
$$(1 - P(n))^{r} \le e^{-r a / \log n} \le e^{-4 \log n} = \frac{1}{n^4}.$$
There are at most $\binom{n}{2}$ minimum cuts ([[cor:number-min-cuts]]), so by the union bound
$$\Pr[\text{missing any minimum cut}] \le \binom{n}{2} \cdot \frac{1}{n^4} = \O\!\left(\frac{1}{n^2}\right).$$
The running time is $\O(\log^2 n) \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$.
:::

::: intuition
The same number of runs, only with a larger constant, pushes the failure probability for each single cut down to $1/n^4$, small enough to survive a
union bound over all (at most $\binom{n}{2}$) minimum cuts. Example: for the cycle $C_n$, which has $\binom{n}{2}$ minimum cuts
([[exr:a03-cycle-min-cuts]]), the algorithm lists all of them with probability $1 - \O(1/n^2)$.
:::

## Summary

- Undirected cuts $\delta(U) = \delta(V \setminus U)$; $f_G(s, t)$ is the minimum [[def:flow-network|capacity]] of an $s$–$t$ cut, one max [[def:flow|flow]] with two opposite arcs per edge
  ([[def:undirected-cut]]). [[def:node-identification|Identifying]] $v$ and $w$ keeps exactly the cuts not separating them ([[obs:identification-cuts]]).
- A [[def:gomory-hu-tree|Gomory–Hu tree]] encodes all $f_G(s, t)$: the minimum on the tree path ([[prop:gomory-hu-path]]), and each tree edge gives a
  minimum cut ([[obs:gomory-hu-edge]]). It exists and is built with $n - 1$ minimum cut computations ([[alg:gomory-hu]], [[thm:gomory-hu]]).
- Key tools: uncrossing ([[lem:cut-submodular]]), the Gomory–Hu lemma ([[lem:gomory-hu]]) and contracting one side of a minimum cut
  ([[cor:gomory-hu-contraction]]), the triangle inequalities ([[lem:flow-triangle]], [[lem:flow-triangle-path]]).
- [[def:global-min-cut|Global minimum cut]] $\lambda(G)$: $n - 1$ flows give $\O(n^4)$ ([[prop:global-cut-flows]]);
  $\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w))$ ([[cor:identification-mincut]]).
- Stoer–Wagner: the last vertex $t$ of a "most tightly connected" order gives a minimum $s$–$t$ cut $\delta(t)$ ([[thm:mincut-phase]]); identify $s, t$ and
  repeat; $\O(nm + n^2 \log n)$ ([[alg:stoer-wagner]], [[prop:stoer-wagner-time]]).
- Karger: random [[def:edge-contraction|contraction]] finds a fixed minimum cut with probability $\ge 2/(n(n-1))$ ([[lem:karger-success]]), so there are at most $\binom{n}{2}$
  minimum cuts ([[cor:number-min-cuts]]); $\O(n^2 \log n)$ runs give $\O(n^4 \log n)$ [[def:whp|WHP]] ([[thm:karger-whp]]).
- Karger–Stein: contract to $\lceil 1 + n/\sqrt{2} \rceil$ vertices and recurse twice; success $\Omega(1/\log n)$ per run, $\O(n^2 \log^3 n)$ for one or all minimum
  cuts WHP ([[thm:karger-stein]], [[thm:karger-stein-all]]).

## Exercises

```graph id=a03-ex-gomory-hu-value widget=exercise
task: answer
prompt: This is a [[def:gomory-hu-tree|Gomory–Hu tree]] of some network $G$. What is the capacity of a minimum $x$–$z$ cut in $G$?
answer: 6
hint: Use [[prop:gomory-hu-path]]: look at the path from $x$ to $z$ in the tree.
solution: The $x$–$z$ path in the tree is $x, u, v, z$ with capacities $9, 6, 11$, so $f_G(x, z) = \min(9, 6, 11) = 6$. A minimum cut is given by the component $\set{x, u, y}$ of the tree minus the edge $uv$.
layout: fixed
x @(0, 0); u @(1.5, 0); y @(1.5, 1.3); v @(3, 0); z @(4.5, 0); q @(3, -1.3)
x -- u [w=9]; u -- y [w=4]; u -- v [w=6]; v -- z [w=11]; v -- q [w=7]
```

```graph id=a03-ex-global-cut widget=exercise
task: select-vertices
prompt: Select one side $S$ of a [[def:global-min-cut|global minimum cut]] $\delta(S)$ of this network (edge labels are capacities).
check: is-global-min-cut-side
hint: Single vertices are cheap to cut off in many graphs, but compute $c(\delta(v))$ here: every vertex has at least $9$.
hint: Look for two dense groups that are joined by light edges.
solution: $S = \set{a, b, c}$ (or its complement $\set{d, e, f}$): $\delta(S) = \set{ad, cf, be}$ has capacity $2 + 1 + 1 = 4 = \lambda(G)$.
layout: fixed
a @(0, 1); b @(-1, 0); c @(0, -1); d @(2, 1); e @(3, 0); f @(2, -1)
a -- b [c=4]; b -- c [c=5]; a -- c [c=3]; d -- e [c=4]; e -- f [c=3]; d -- f [c=5]; a -- d [c=2]; c -- f [c=1]; b -- e [c=1 bend=-0.9]
```

```graph id=a03-ex-mincut-phase widget=exercise
task: simulate
algo: stoer-wagner
params: start=a phases=1
prompt: Perform one $\textsf{MINCUTPHASE}$ starting from $U = \set{a}$: click the vertices in the order in which they are added to $U$.
hint: The next vertex is the one with the largest total capacity of edges into the current $U$ ([[def:tightly-connected]]); edges to vertices outside $U$ do not count.
solution: The order is $a, b, c, d, e$, with keys $c(U, b) = 3$, $c(U, c) = 1 + 4 = 5$, $c(U, d) = 2 + 5 = 7$, $c(U, e) = 2 + 3 + 1 = 6$. So $s = d$, $t = e$, and $\delta(e)$ of capacity $6$ is a minimum $d$–$e$ cut.
layout: fixed
a @(0, 0); b @(1.5, 1); c @(1.5, -0.2); d @(3, 0.4); e @(1.5, -1.4)
a -- b [c=3]; a -- c [c=1]; a -- e [c=2]; b -- c [c=4]; b -- d [c=2]; c -- d [c=5]; d -- e [c=1]; c -- e [c=3]
```

:::: exercise {#exr:a03-distinct-values title="Few distinct values" difficulty=1}
Show that among the $\binom{n}{2}$ values $f_G(s, t)$, $s \ne t$, of an [[def:undirected-cut|undirected network]] there are at most $n - 1$ different ones.

::: solution
By [[thm:gomory-hu]], $G$ has a [[def:gomory-hu-tree|Gomory–Hu tree]] $T$, and by [[prop:gomory-hu-path]] every $f_G(s, t)$ equals the [[def:flow-network|capacity]] of some
edge of $T$. A tree on $n$ vertices has $n - 1$ edges.
:::
::::

:::: exercise {#exr:a03-lambda-from-tree title="Global minimum cut from the tree" difficulty=1}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] of $G$. Show that $\lambda(G)$ is the minimum capacity of an edge of $T$, and that removing a
lightest edge of $T$ yields a global minimum cut.

::: solution
By [[prop:global-cut-flows]], $\lambda(G) = \min_{s \ne t} f_G(s, t)$ (the minimum over all pairs is at most the minimum over the pairs containing a fixed
$s$, and at least $\lambda(G)$). By [[prop:gomory-hu-path]] each $f_G(s, t)$ is the minimum over a tree path, so the overall minimum is the lightest edge $e = uv$
of $T$ (the pair $u, v$ attains it). By [[obs:gomory-hu-edge]], a component $U$ of $T - e$ gives a minimum $u$–$v$ cut $\delta_G(U)$ of capacity
$w(e) = \lambda(G)$, which is a global minimum cut.
:::
::::

:::: exercise {#exr:a03-tree-not-subgraph title="Tree edges need not be edges" difficulty=1}
Find a network $G$ and a [[def:gomory-hu-tree|Gomory–Hu tree]] of it that contains an edge which is not an edge of $G$.

::: solution
Let $G = C_4$ with vertices $1, 2, 3, 4$ in this order and all capacities $1$. Every pair $s, t$ is joined by two edge-disjoint paths, and every
$\delta(v)$ has capacity $2$, so $f_G(s, t) = 2$ for all pairs. The star with centre $1$ and capacities $2$ is a Gomory–Hu tree: the path minima are $2$,
and removing the edge $1v$ cuts off $\set{v}$, whose cut $\delta(v)$ is a minimum cut for every pair separated by it. Its edge $13$ is not an edge of $C_4$.
:::
::::

:::: exercise {#exr:a03-cycle-min-cuts title="The bound is tight" difficulty=2}
Show that the cycle $C_n$ ($n \ge 3$, all capacities $1$) has exactly $\binom{n}{2}$ [[def:global-min-cut|minimum cuts]], so the bound of
[[cor:number-min-cuts]] is tight.

::: solution
Every cut of $C_n$ contains at least $2$ edges: deleting a single edge leaves a path, which is connected. Deleting any $2$ of the $n$ edges leaves two
non-empty paths, i.e. the edge sets of size $2$ are exactly $\delta(S)$ for the vertex sets $S$ of the two arcs. So the minimum cuts are exactly the
$\binom{n}{2}$ pairs of edges, and different pairs are different cuts.
:::
::::

:::: exercise {#exr:a03-uniform-weighted title="Weights matter" difficulty=2}
Let $0 < \varepsilon < 1/k$. The graph $G_k$ has the path $b_1 b_2 \dots b_k$ with capacity $1$ on each edge, and a vertex $a$ joined to every $b_i$
by an edge of capacity $\varepsilon$. Suppose $\textsf{CONTRACT}$ chooses edges **uniformly**, ignoring the capacities (and keeps parallel edges). Show
that it returns the minimum cut of $G_k$ with probability $\frac{(k-1)!\,k!}{(2k-1)!}$, which for $k \ge 3$ is below the bound $2/(n(n-1))$ of
[[lem:karger-success]] ($n = k + 1$).

::: hint
Which cut is the minimum cut, and which edges must never be contracted? Count the edges of each kind while the path shrinks.
:::

::: solution
Every cut other than $\delta(a)$ separates two vertices of the path, so it contains a path edge of capacity $1 > k\varepsilon = c(\delta(a))$. So
$\delta(a)$ is the unique [[def:global-min-cut|minimum cut]], and it is returned iff no edge at $a$ is ever contracted, i.e. iff all $k - 1$ path edges
are contracted first. Contracting a path edge merges two consecutive groups of $b$'s; the edges at $a$ stay ($k$ of them, some becoming parallel),
and the groups still form a path. When $j$ path edges are left, a uniform choice takes a path edge with probability $j/(j + k)$, so the
success probability is
$$\prod_{j=1}^{k-1} \frac{j}{j + k} = \frac{(k-1)!\,k!}{(2k-1)!}.$$
For $k = 3$ this is $\frac{2}{5} \cdot \frac{1}{4} = \frac{1}{10} < \frac{1}{6} = \frac{2}{4 \cdot 3}$, and it decreases roughly like $4^{-k}$, while
$2/(n(n-1))$ decreases only polynomially. The lemma fails because its proof needs $c(E) \ge nk/2$ in the same units in which edges are chosen; choosing
with probability $c(e)/c(E)$, as the lecture prescribes, makes the light edges at $a$ unlikely to be contracted.
:::
::::

:::: quiz {#q:a03-gh-flows}
How many minimum $s$–$t$ cut (maximum [[def:flow|flow]]) computations does the Gomory–Hu construction perform on a network with $n = 10$ vertices?

answer: 9

::: explanation
One per round, and there are $n - 1 = 9$ rounds ([[alg:gomory-hu]], [[thm:gomory-hu]]), instead of $\binom{10}{2} = 45$ for all pairs separately.
:::
::::

:::: quiz {#q:a03-karger-prob}
A lower bound on the probability that one run of $\textsf{CONTRACT}$ returns a fixed minimum cut of a graph with $n = 5$ vertices is $2/(n(n-1))$. What
is its value?

answer: 0.1
tolerance: 0.001

::: explanation
$2/(5 \cdot 4) = 1/10$ ([[lem:karger-success]]); as a product, $\frac{3}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} = \frac{1}{10}$.
:::
::::

:::: quiz {#q:a03-phase-global}
Is the cut of a phase, $\delta(t)$, always a global minimum cut of the current graph?

- [ ] Yes
- [x] No

::: explanation
It is a minimum $s$–$t$ cut for the last two vertices $s, t$ of the phase ([[thm:mincut-phase]]), not necessarily a global minimum cut. In the lecture
network, phase 1 gives $\delta(d)$ of capacity $14$, while $\lambda(G) = 13$.
:::
::::

:::: quiz {#q:a03-sw-time}
What is the running time of the Stoer–Wagner algorithm with Fibonacci heaps?

- [ ] $\O(n^4)$
- [ ] $\O(n^2 m)$
- [x] $\O(nm + n^2 \log n)$
- [ ] $\O(n^2 \log^3 n)$

::: explanation
$n - 1$ phases, each $\O(m + n \log n)$ with a Fibonacci heap ([[prop:stoer-wagner-time]]). $\O(n^4)$ is the $n - 1$ max-flow method, and
$\O(n^2 \log^3 n)$ is Karger–Stein.
:::
::::
