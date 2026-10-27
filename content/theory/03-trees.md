---
title: Trees
course: theory
lecture: 3
slug: t03
summary: Forests and trees, leaves, closed walks and cycles, unique paths in trees, the equivalent characterisations of trees, spanning trees, Cayley's formula, and regular graphs of large girth.
prerequisites: [theory/02-walks-connectivity-bipartite]
sources:
  - resources/graph-theory/2026-09-29-13_47_15-join.pdf
status: draft
---

Trees are the simplest connected graphs: connected, but with no redundancy at all. They are
everywhere in computer science (search trees, parse trees, spanning trees of networks) and they are
the main object of the first lecture of the algorithms course (minimum spanning trees). In this
lesson we prove the basic structural facts about trees, count the spanning trees of $K_n$, and end with
a surprising existence theorem about graphs without short cycles.

## Forests and trees

::: definition {#def:forest-tree title="Forest, tree" defines="acyclic, forest, tree" source="theory/2026-09-29 p1"}
A graph $G$ is **acyclic**, or a **forest**, if $G$ contains no cycle. $G$ is a **tree** if $G$ is acyclic
and connected.
:::

For multigraphs, a loop is a cycle of length $1$ and two parallel edges form a cycle of length $2$; so an
acyclic multigraph has neither, i.e. **an acyclic multigraph is simple**. The components of a forest are
trees, which explains the name.

```graph id=t03-forest widget=figure
caption: A forest with three components: each component is a tree. The isolated vertex is a tree with one vertex.
intent: First picture of trees and forests.
height: small
1 -- 2; 2 -- 3; 2 -- 4; 4 -- 5; 4 -- 6
a -- b; b -- c; c -- d
z
```

::: theorem {#thm:two-leaves title="Acyclic graphs have two vertices of small degree" source="theory/2026-09-29 p1–2"}
Every acyclic graph $G$ on at least $2$ vertices contains at least two vertices of degree at most $1$.
:::

::: proof
Let $P \subseteq G$ be a path of maximum length in $G$ (there are finitely many paths, and single vertices
are paths of length $0$, so a longest path exists).

**(a)** If $\abs{V(P)} = 1$, then $G$ has no edges at all (an edge would be a path with two vertices). So
every vertex of $G$ has degree $0$, and there are at least two vertices.

**(b)** If $\abs{V(P)} > 1$, then $P$ has two ends $u \ne v$. We claim $d_G(u) = d_G(v) = 1$; by symmetry we
treat $u$. It has degree at least $1$, since it has a neighbour on $P$. Suppose for a contradiction that
$\set{u, x} \in E(G)$, where $x$ is **not** the neighbour of $u$ on $P$.

- (b1) If $x \notin V(P)$, then $P + \set{u, x}$ (prolong $P$ beyond $u$ to $x$) is a longer path, a
  contradiction with the choice of $P$.
- (b2) If $x \in V(P)$, then $x$ is not the neighbour of $u$ on $P$, and $P + \set{u, x}$ contains a cycle
  (the edge $ux$ together with the part of $P$ between $u$ and $x$, which has at least two edges), a
  contradiction with $G$ acyclic.

So indeed $d_G(u) = d_G(v) = 1$.
:::

```graph id=t03-longest-path widget=figure
caption: The end $u$ of a longest path $P$ cannot have another neighbour $x$: outside $P$ it would prolong $P$, on $P$ it would close a cycle.
intent: Transcription of the lecture sketch of the two cases (b1), (b2).
layout: fixed
u [class=current] @(0, 0); p1 @(1, 0.3); p2 @(2, 0); p3 @(3, 0.3); v [class=current] @(4, 0)
x1 [label="$x$" class=muted] @(-0.8, 0.8)
u -- p1 -- p2 -- p3 -- v [class=path]
u -- x1 [class="rejected dashed"]; u -- p2 [class="rejected dashed" bend=0.4]
```

A vertex of degree $1$ is called a **leaf**.

::: corollary {#cor:tree-leaf title="Trees have leaves" source="theory/2026-09-29 p3"}
Every tree on at least $2$ vertices has a vertex of degree $1$. (In fact it has at least two.)
:::

::: proof
By [[thm:two-leaves]] there are two vertices of degree at most $1$. A connected graph on at least two
vertices has no vertex of degree $0$, so both have degree exactly $1$.
:::

::: corollary {#cor:acyclic-subgraph-small-degree title="Acyclicity via small degrees" source="theory/2026-09-29 p3"}
For every (multi)graph $G$: $G$ is acyclic $\iff$ every (non-empty) subgraph of $G$ contains a vertex of degree
at most $1$.
:::

::: proof
($\Rightarrow$) A subgraph of an acyclic graph is acyclic. If it has at least two vertices, apply
[[thm:two-leaves]]; if it has one vertex, that vertex has degree $0$ (an acyclic multigraph has no loops).

($\Leftarrow$) By contraposition: if $C \subseteq G$ is a cycle, then $C$ is a subgraph in which every vertex
has degree $2$ (for a loop, the single vertex has degree $2$; for two parallel edges, both vertices have
degree $2$), so $C$ has **no** vertex of degree at most $1$.
:::

## Closed walks and cycles

Recall that a walk may repeat vertices and edges, and a closed walk returns to its start
([[def:walk]]).

::: lemma {#lem:closed-walk-cycle title="Closed walks contain cycles or double back" source="theory/2026-09-29 p3–4"}
For every (multi)graph $G$ and every closed walk $W$ in $G$: either (the edges of) $W$ contain a cycle,
or every edge of $G$ is traversed by $W$ an even number of times.
:::

::: proof
By induction on the length $k$ of $W = (v_0, e_0, v_1, \dots, e_{k-1}, v_k = v_0)$.

**(a) Base cases, $k \le 2$.** If $k = 0$, no edge is traversed ($0$ is even). If $k = 1$, the edge
$e_0$ joins $v_0$ to itself, so it is a loop, which is a cycle. If $k = 2$, either $e_0 = e_1$ (the walk
goes along an edge and back; that edge is traversed twice and all others zero times), or $e_0 \ne e_1$
both join $v_0$ and $v_1$; then they are two loops (if $v_0 = v_1$) or two parallel edges, and either way
$W$ contains a cycle.

**(b) $k \ge 3$.**

- (b1) If no vertex is repeated in $W$, i.e. $v_0, \dots, v_{k-1}$ are distinct, then the edges $e_i$ join
  distinct pairs of consecutive vertices, so they are distinct, and $W$ traces a cycle of length $k$.
- (b2) If $W$ repeats a vertex $x = v_i = v_j$ with $0 \le i < j \le k - 1$, we "split" $W$ at $x$ into two
  closed walks
  $$W_2 = (v_i, e_i, \dots, e_{j-1}, v_j) \quad\text{and}\quad W_1 = (v_0, e_0, \dots, v_i, e_j, v_{j+1}, \dots, v_k),$$
  of lengths $j - i \ge 1$ and $k - (j - i) \ge 1$, both less than $k$. Every edge is traversed by $W$ as
  many times as by $W_1$ and $W_2$ together. By the induction assumption, $W_1$ or $W_2$ contains a cycle
  (then so does $W$), or every edge is traversed an even number of times by each of $W_1, W_2$, and so
  an even number of times by $W$.
:::

```graph id=t03-split-walk widget=figure
caption: Splitting a closed walk $W$ at a repeated vertex $x$ into two shorter closed walks $W_1$ and $W_2$.
intent: Transcription of the lecture sketch for case (b2).
layout: fixed
v0 [label="$v_0$"] @(0, 0); a @(1, 0.8); x [class=current] @(2, 0); b @(3, 0.8); c @(3.4, -0.4); d @(1, -0.8)
v0 -- a [class=color1]; a -- x [class=color1]; x -- b [class=color2]; b -- c [class=color2]; c -- x [class=color2]; x -- d [class=color1]; d -- v0 [class=color1]
group W1: v0 a d [label="$W_1$"]
group W2: b c [label="$W_2$"]
```

::: corollary {#cor:tree-unique-path title="Unique paths in trees" source="theory/2026-09-29 p5"}
In every tree $T$, every two vertices $u, v \in V(T)$ are connected by exactly one path.
:::

::: proof
There is some $u$–$v$ path by connectivity of $T$ and [[claim:shortest-walk-path]]. Suppose $P_1, P_2 \subseteq T$
are two $u$–$v$ paths. Walking along $P_1$ from $u$ to $v$ and then back along $P_2$ from $v$ to $u$ gives a
closed walk $W = P_1 \cdot P_2^{-1}$ in $T$. Since $T$ has no cycle, by [[lem:closed-walk-cycle]] $W$ traverses
every edge an even number of times. A path traverses each of its edges once, so every edge of $P_1$ is
traversed once by the $P_1$-part and must be traversed again, i.e. it is an edge of $P_2$; and vice
versa. Hence $E(P_1) = E(P_2)$. Two paths with the same ends and the same edge set are equal (if
$u = v$ both are the single vertex $u$; otherwise the vertices of a path are the ends of its edges and
the edges determine the order). So $P_1 = P_2$.
:::

## Characterisations of trees

The following facts are used constantly, in particular in the algorithms course. The key tool is that
deleting a leaf keeps a tree a tree.

::: lemma {#lem:leaf-removal title="Removing a leaf" extra=true}
Let $T$ be a tree with at least two vertices and $v$ a leaf of $T$. Then $T - v$ is a tree. Conversely,
adding a new vertex joined by one edge to a vertex of a tree gives a tree.
:::

::: proof
$T - v$ is acyclic as a subgraph of $T$. It is connected: for $x, y \ne v$, the unique $x$–$y$ path in $T$
does not pass through $v$, because an inner vertex of a path has degree at least $2$ in the path, while
$d_T(v) = 1$. So the path lies in $T - v$.

Conversely, if $v$ is added to a tree $T'$ with one edge $vw$, the result is connected ($v$ is reached via
$w$), and a cycle through $v$ would need two edges at $v$; so every cycle would lie in $T'$, which has none.
:::

```graph id=t03-leaf-removal widget=stepper
caption: Removing a leaf keeps a tree a tree.
intent: Illustrate leaf removal, the induction step behind almost every proof about trees.
1 -- 2 -- 3; 2 -- 4; 4 -- 5
step: A tree $T$ with a leaf $v = 5$.
class highlight: 5 4--5
step: Remove $v$ and its edge: $T - v$ is still connected and acyclic.
remove 5
step: Adding $v$ back cannot create a cycle, since $\deg v = 1$.
4 -- 5 [class=highlight]
```

::: theorem {#thm:tree-characterisations title="Equivalent definitions of a tree" extra=true}
For a graph $G$ with $n \ge 1$ vertices, the following are equivalent:

1. $G$ is a tree (connected and acyclic);
2. every two vertices of $G$ are connected by exactly one path;
3. $G$ is connected, and $G - e$ is disconnected for every edge $e$ (**minimally connected**);
4. $G$ is acyclic, and $G + e$ contains a cycle for every new edge $e \in \binom{V(G)}{2} \setminus E(G)$
   (**maximally acyclic**);
5. $G$ is connected and has $n - 1$ edges;
6. $G$ is acyclic and has $n - 1$ edges.
:::

:::: proof
First we show that **every tree on $n$ vertices has $n - 1$ edges**, by induction on $n$: for $n = 1$ there
are no edges; for $n \ge 2$ remove a leaf ([[cor:tree-leaf]]); by [[lem:leaf-removal]] the rest is a tree on
$n - 1$ vertices with $n - 2$ edges by induction, and we removed one edge. This gives 1 ⇒ 5 and 1 ⇒ 6.

**1 ⇒ 2** is [[cor:tree-unique-path]]. **2 ⇒ 1:** $G$ is connected; if $G$ had a cycle, two vertices $u, v$
adjacent on the cycle would be connected by two paths (the edge $uv$, and the rest of the cycle).

**1 ⇒ 3:** if $e = uv$ and $G - e$ were connected, a $u$–$v$ path in $G - e$ would be a second $u$–$v$ path
besides $e$ itself, contradicting 2. **3 ⇒ 1:** if $G$ had a cycle $C$, removing an edge $e = uv$ of $C$ keeps
$G$ connected (any walk using $e$ can use the rest of $C$ from $u$ to $v$ instead), contradicting 3.

**1 ⇒ 4:** for a non-edge $uv$, the unique $u$–$v$ path in $G$ plus the edge $uv$ is a cycle. **4 ⇒ 1:** if $G$
were disconnected, joining vertices $u, v$ from different components would create no cycle (a cycle through
the new edge would need a $u$–$v$ path in $G$).

**5 ⇒ 1:** $G$ is connected. Repeatedly remove edges lying on cycles; this keeps the graph connected (as in
3 ⇒ 1) and ends with a connected acyclic spanning subgraph, a tree, which has $n - 1$ edges. Since $G$ had
$n - 1$ edges already, nothing was removed, so $G$ was acyclic.

**6 ⇒ 1:** let $G$ be acyclic with $c$ components $T_1, \dots, T_c$, of sizes $n_1, \dots, n_c$. Each is a tree,
so $\abs{E(G)} = \sum_j (n_j - 1) = n - c$. From $\abs{E(G)} = n - 1$ we get $c = 1$, so $G$ is connected.
::::

::: corollary {#cor:forest-edges title="Edges of a forest" extra=true}
A forest with $n$ vertices and $c$ components has exactly $n - c$ edges.
:::

::: proof
This was shown in the step 6 ⇒ 1 above.
:::

## Spanning trees

::: definition {#def:spanning-tree title="Spanning tree" defines="spanning tree" source="theory/2026-09-29 p6"}
A tree $T \subseteq G$ is **spanning** in $G$ if $V(T) = V(G)$.
:::

::: proposition {#prop:spanning-tree-exists title="Connected graphs have spanning trees" extra=true}
A graph has a spanning tree if and only if it is connected.
:::

::: proof
A spanning tree is connected and contains all vertices, so $G$ is connected. Conversely, as long as a
connected graph has a cycle, delete an edge of a cycle; the graph stays connected. When no cycle is left
we have a connected acyclic spanning subgraph, a spanning tree. (A BFS tree, [[alg:bfs]], is another
spanning tree of a connected graph.)
:::

```graph id=t03-spanning-tree-exercise widget=exercise
task: select-edges
prompt: Select the edges of a spanning tree of this graph.
check: is-spanning-tree
hint: You need exactly $n - 1 = 6$ edges and no cycle.
solution: For example the BFS tree from $a$: $ab, ac, ad, be, cf, eg$. Any acyclic set of 6 edges is correct.
a -- b; a -- c; a -- d; b -- c; b -- e; c -- f; d -- f; e -- f; e -- g; f -- g
```

### Cayley's formula

How many spanning trees does $K_n$ have? Equivalently: how many trees are there on the vertex set
$\set{1, \dots, n}$ (different edge sets count as different trees)? Small cases:

| $n$ | 1 | 2 | 3 | 4 |
|-----|---|---|---|---|
| trees | 1 | 1 | 3 | 16 |
| $n^{n-2}$ | $1^{-1} = 1$ | $2^0 = 1$ | $3^1 = 3$ | $4^2 = 16$ |

```graph id=t03-k4-spanning-trees widget=figure
caption: The 16 spanning trees of $K_4$ come in two shapes: 12 paths $P_3$ and 4 stars $K_{1,3}$.
intent: Check of Cayley's formula for n = 4. Show one representative of each shape; the counts 4!/2 = 12 paths and 4 stars are in the caption.
height: small
panel: a path (12 such)
layout: fixed
1 @(0, 1); 2 @(1, 1); 3 @(1, 0); 4 @(0, 0)
1 -- 2 -- 3 -- 4
panel: a star (4 such)
layout: fixed
1 @(0, 1); 2 @(1, 1); 3 @(1, 0); 4 @(0, 0)
1 -- 2; 1 -- 3; 1 -- 4
```

::: theorem {#thm:cayley title="Cayley's formula" source="theory/2026-09-29 p6–7"}
The number of distinct spanning trees of $K_n$ is $n^{n-2}$.
:::

The proof (due to Pitman) counts the same set of objects in two ways (**double counting**).

:::: proof
We build directed graphs on $V(K_n)$ in $n - 1$ steps $k = 1, 2, \dots, n - 1$, adding one arc per step,
and count the total number of ways to make the choices.

**Construction.** Start with no arcs. In step $k$, choose any vertex $x_k \in V(K_n)$, and any vertex
$y_k \in V(K_n)$ such that

- $y_k$ has in-degree $0$ in the current digraph, and
- $y_k$ is **not in the same (weak) component** as $x_k$ (components of the underlying undirected graph),

and add the arc $(x_k, y_k)$.

**Invariant.** After step $k$, the digraph is a forest of $n - k$ components, each of which is a tree
oriented away from a unique **root**, the only vertex of in-degree $0$ in that component; all in-degrees
are at most $1$. This holds at the start ($n$ isolated roots). Adding the arc $(x_k, y_k)$ joins two
different components (so no cycle appears and the number of components drops by one); $y_k$ was the root of
its component and now has in-degree $1$, and the merged component is oriented away from the root of
$x_k$'s component.

**First count.** Before step $k$ there are $n - k + 1$ components, hence $n - k + 1$ roots. The choice of
$x_k$ is free ($n$ ways), and $y_k$ can be the root of any component other than that of $x_k$ ($n - k$
ways), independently. So the total number of choice sequences is
$$\prod_{k=1}^{n-1} n \cdot (n - k) = n^{n-1} \cdot (n-1)!.$$

**What we constructed.** After $n - 1$ steps there is $1$ component: a spanning tree of $K_n$ oriented away
from a root, together with an ordering of its $n - 1$ arcs (the order in which they were added). Different
choice sequences give different (tree, root, order) triples, since the sequence of arcs determines the
choices.

**Second count.** Conversely, let $T \subseteq K_n$ be any spanning tree. Choose any of the $n$ vertices as the
root; this determines the orientation of every edge away from the root. Order the $n - 1$ edges in any of
the $(n-1)!$ ways. Every such triple arises from the construction: when the arc $(x, y)$ of the oriented
tree is added, the arcs added so far are other arcs of the same oriented tree, so $y$ (whose only incoming
arc is $(x, y)$) still has in-degree $0$, and $x, y$ are in different components (otherwise the tree would
contain a cycle). So if $C(n)$ denotes the number of spanning trees of $K_n$, the number of choice
sequences is $C(n) \cdot n \cdot (n-1)!$.

**Conclusion.** $n^{n-1} \cdot (n-1)! = C(n) \cdot n \cdot (n-1)!$, hence $C(n) = n^{n-2}$.
::::

::: pitfall
In the construction it is not enough to require $y_k \ne x_k$ (as in a first attempt in the lecture,
later corrected). The vertex $y_k$ must lie in a **different component** than $x_k$: otherwise adding
$(x_k, y_k)$ could close a cycle, and the count $n - k$ of choices would be wrong.
:::

```graph id=t03-cayley-construction widget=stepper
caption: Pitman's construction for $n = 5$: each step adds an arc from any vertex to the root of another component.
intent: Make the double-counting construction concrete; show components merging and roots (in-degree 0) highlighted.
type: directed
layout: circle
1; 2; 3; 4; 5
step: Start: 5 components, every vertex is a root. Step 1 has $5 \cdot 4$ choices.
class source: 1 2 3 4 5
step: Step 1: $x_1 = 2$, $y_1 = 4$. Now 4 components; $4$ is no longer a root. Step 2 has $5 \cdot 3$ choices.
2 -> 4 [class=highlight]; unclass source: 4
step: Step 2: $x_2 = 4$, $y_2 = 1$ (the root of another component). Step 3 has $5 \cdot 2$ choices.
unclass highlight: 2->4
4 -> 1 [class=highlight]; unclass source: 1
step: Step 3: $x_3 = 5$, $y_3 = 2$, the root of the component $\set{2, 4, 1}$. Step 4 has $5 \cdot 1$ choices.
unclass highlight: 4->1
5 -> 2 [class=highlight]; unclass source: 2
step: Step 4: $x_4 = 1$, $y_4 = 3$. One component remains: a spanning tree oriented away from the root $5$.
unclass highlight: 5->2
1 -> 3 [class=highlight]; unclass source: 3
```

## Girth and regular graphs

::: definition {#def:girth title="Girth, regular graph" defines="girth, regular, d-regular" source="theory/2026-09-29 p8"}
The **girth** of a graph $G$ is the length of the shortest cycle in $G$ ($\infty$ if $G$ is acyclic). A
graph is **$d$-regular** if every vertex has degree $d$.
:::

For example $K_n$ ($n \ge 3$) has girth $3$, $K_{m,n}$ ($m, n \ge 2$) has girth $4$, $C_n$ has girth $n$, and the
Petersen graph is $3$-regular with girth $5$.

```graph id=t03-petersen widget=figure
caption: The Petersen graph is 3-regular and has girth 5.
intent: The example drawn in the lecture next to the theorem.
height: small
use: Petersen
```

Can a graph have **many** edges at every vertex and still no short cycles? Locally, around every vertex,
such a graph looks like a tree branching $d$ ways, for $k/2$ levels. Surprisingly, this is always possible:

::: theorem {#thm:regular-large-girth title="Regular graphs of large girth" source="theory/2026-09-29 p8"}
For all $d \ge 0$ and $k \ge 1$ there exists a $d$-regular graph of girth at least $k$.
:::

:::: proof
Call a graph **good for $(k, d)$** if it is $d$-regular with girth at least $k$. We proceed by induction,
primarily on $k$ and secondarily on $d$.

**(a) Base cases.**

- $d = 0$: $K_1$; $d = 1$: $K_2$ (both acyclic, girth $\infty$). $d = 2$: the cycle $C_{\max(k,3)}$.
- $k \le 3$: $K_{d+1}$ (every simple graph has girth at least $3$). $k = 4$: $K_{d,d}$, which is
  $d$-regular and bipartite, hence has no triangle ([[thm:bipartite-odd-cycle]]).

**(b) Induction step.** Let $k \ge 5$ and $d \ge 3$, and assume we have graphs

- $G$ good for $(k, d-1)$ (by induction on $d$), with $N := \abs{V(G)}$, and
- $H$ good for $(\lceil k/2 \rceil, N)$ (by induction on $k$, since $\lceil k/2 \rceil < k$).

Then the following graph $F$ is good for $(k, d)$. Take one copy $G_h$ of $G$ for every vertex $h \in V(H)$.
Every vertex $h$ of $H$ has exactly $N$ incident edges, and $G_h$ has exactly $N$ vertices; fix a bijection
$\beta_h$ from the edges of $H$ at $h$ to the vertices of $G_h$. For every edge $hh' \in E(H)$ add to $F$ an
edge joining $\beta_h(hh') \in V(G_h)$ and $\beta_{h'}(hh') \in V(G_{h'})$. Call these the **$H$-edges** of $F$.

*$F$ is a simple $d$-regular graph.* Every vertex of every copy $G_h$ had degree $d - 1$ and receives exactly
one $H$-edge (as $\beta_h$ is a bijection), so it has degree $d$. $H$-edges join different copies, and two
$H$-edges come from different edges of $H$, so they cannot join the same pair of vertices.

*$F$ has girth at least $k$.* Let $C$ be a cycle in $F$. If $C$ uses no $H$-edge, it lies inside one copy of $G$
and has length at least $k$. Otherwise let $f_1, \dots, f_t$ be the $H$-edges of $C$ in cyclic order. Between
$f_i$ and $f_{i+1}$ the cycle stays inside one copy $G_h$, so the copies visited, $h_1, h_2, \dots, h_t, h_1$,
form a closed walk in $H$ that uses the edges of $H$ corresponding to $f_1, \dots, f_t$, each exactly once.
(A single $H$-edge cannot close a walk, so $t \ge 2$.) By [[lem:closed-walk-cycle]], since no edge is traversed
an even number of times, this closed walk contains a cycle of $H$, which has length at least
$\lceil k/2 \rceil$; so $t \ge \lceil k/2 \rceil$. Moreover, $C$ enters $G_h$ through $f_i$ at the vertex
$\beta_h(f_i)$ and leaves through $f_{i+1}$ at $\beta_h(f_{i+1})$; these are different vertices because $f_i$ and
$f_{i+1}$ correspond to different edges of $H$ at $h$. So between any two consecutive $H$-edges, $C$ uses at
least one edge of a copy of $G$. Therefore
$$\abs{E(C)} \ \ge\ 2t\ \ge\ 2\lceil k/2 \rceil\ \ge\ k.$$
::::

```graph id=t03-girth-construction widget=figure
caption: The construction: one copy of $G$ for each vertex of $H$; each edge of $H$ becomes one edge between the corresponding copies, and every vertex of every copy gets exactly one such edge.
intent: Schematic version of the lecture drawing. Groups are the copies of G (here G = C_4 is good for (4, 2)); H-edges are highlighted. Purely illustrative, not an actual instance of the theorem's parameters.
layout: fixed
a1 @(0, 1); a2 @(0.6, 1); a3 @(0.6, 0.4); a4 @(0, 0.4)
b1 @(3, 1); b2 @(3.6, 1); b3 @(3.6, 0.4); b4 @(3, 0.4)
c1 @(1.5, -1); c2 @(2.1, -1); c3 @(2.1, -1.6); c4 @(1.5, -1.6)
a1 -- a2 -- a3 -- a4 -- a1; b1 -- b2 -- b3 -- b4 -- b1; c1 -- c2 -- c3 -- c4 -- c1
a2 -- b1 [class=highlight]; a3 -- c1 [class=highlight]; b4 -- c2 [class=highlight]
group G1: a1 a2 a3 a4 [label="$G_{h_1}$"]
group G2: b1 b2 b3 b4 [label="$G_{h_2}$"]
group G3: c1 c2 c3 c4 [label="$G_{h_3}$"]
```

::: remark
The graphs produced by this construction are huge. How small a $d$-regular graph of girth $k$ can be is a
famous open problem (the "cage problem"); the Petersen graph is the smallest $3$-regular graph of girth $5$.
:::

## Summary

- Forests are acyclic graphs, trees are connected forests ([[def:forest-tree]]). Every acyclic graph on
  $\ge 2$ vertices has two vertices of degree $\le 1$ ([[thm:two-leaves]]); trees have leaves.
- A closed walk contains a cycle or traverses every edge an even number of times
  ([[lem:closed-walk-cycle]]); hence paths in trees are unique ([[cor:tree-unique-path]]).
- Trees: connected + acyclic ⟺ unique paths ⟺ minimally connected ⟺ maximally acyclic ⟺ connected
  with $n-1$ edges ⟺ acyclic with $n-1$ edges ([[thm:tree-characterisations]]).
- Every connected graph has a spanning tree; $K_n$ has $n^{n-2}$ of them ([[thm:cayley]]).
- For all $d, k$ there is a $d$-regular graph of girth $\ge k$ ([[thm:regular-large-girth]]).

## Exercises

:::: exercise {#exr:t03-leaves-count title="Many leaves" difficulty=2}
Let $T$ be a tree with a vertex of degree $\Delta$. Show that $T$ has at least $\Delta$ leaves.

::: hint
Use the handshake lemma together with $\abs{E(T)} = n - 1$, or look at the paths starting at the
vertex of degree $\Delta$.
:::

::: solution
Let $v$ have degree $\Delta$ with neighbours $u_1, \dots, u_\Delta$. For each $i$, start at $v$, step to $u_i$,
and keep walking to a not yet visited neighbour as long as possible. The walk never revisits a vertex
(that would create a cycle), so it stops at a leaf $\ell_i$. The leaves $\ell_i$ are distinct: if
$\ell_i = \ell_j$ for $i \ne j$, the two paths from $v$ to $\ell_i$ (one through $u_i$, the other through $u_j$)
would be different, contradicting [[cor:tree-unique-path]]. (If $\Delta = 1$, $v$ itself is a leaf.)
:::
::::

:::: exercise {#exr:t03-degree-sequence-tree title="Degree sequences of trees" difficulty=2}
Let $n \ge 2$ and $d_1, \dots, d_n \ge 1$ be integers with $d_1 + \dots + d_n = 2n - 2$. Prove that there is a tree
with degree sequence $(d_1, \dots, d_n)$.

::: hint
Induction on $n$: some $d_i$ must equal $1$, and some $d_j$ must be at least $2$ (if $n \ge 3$).
:::

::: solution
For $n = 2$: $d_1 = d_2 = 1$, and $K_2$ works. Let $n \ge 3$. Since the sum is $2n - 2 < 2n$, some $d_i = 1$;
since the sum is $2n - 2 > n$, some $d_j \ge 2$. Remove $d_i$ and decrease $d_j$ by one: the new sequence has
$n - 1$ entries, all at least $1$, with sum $2n - 4 = 2(n-1) - 2$. By induction there is a tree on $n - 1$
vertices with these degrees; attach a new leaf (of degree $1$) to the vertex with degree $d_j - 1$. By
[[lem:leaf-removal]] the result is a tree, with the required degrees.
:::
::::

:::: exercise {#exr:t03-spanning-trees-cycle title="Spanning trees of a cycle" difficulty=1}
How many spanning trees does $C_n$ have? And $K_{2,3}$?

::: solution
A spanning tree of $C_n$ has $n - 1$ of the $n$ edges, and removing any single edge of $C_n$ leaves a path,
which is a tree: $n$ spanning trees. For $K_{2,3}$ ($5$ vertices, $6$ edges) a spanning tree has $4$ edges,
so we remove $2$ edges. $K_{2,3}$ has vertices $1, 2$ and $1', 2', 3'$; its cycles are the three
$4$-cycles $1\,a'\,2\,b'\,1$. Removing two edges at the same vertex $c'$ isolates $c'$ ($3$ ways, bad);
removing two edges at the same vertex $1$ or $2$ (say $1a'$ and $1b'$) leaves the tree ($3 + 3 = 6$ ways);
removing $1a'$ and $2b'$ with $a' \ne b'$ breaks all three $4$-cycles and leaves a tree ($3 \cdot 2 = 6$ ways).
Total $\binom{6}{2} - 3 = 12$.
:::
::::

```graph id=t03-ex-tree-edges widget=exercise
task: build
prompt: Add edges to make this graph a tree. How many edges must you add?
check: is-tree
hint: A tree on $8$ vertices has exactly $7$ edges, and this graph has $4$ edges in $4$ components.
solution: The graph is a forest with $4$ components, so it has $8 - 4 = 4$ edges ([[cor:forest-edges]]). Add $3$ edges, each joining two different components.
1 -- 2; 2 -- 3; 4 -- 5; 6 -- 7
8
```

:::: quiz {#q:t03-cayley-5}
How many spanning trees does $K_5$ have?

answer: 125

::: explanation
By [[thm:cayley]], $5^{5-2} = 125$.
:::
::::

:::: quiz {#q:t03-forest-edges}
A forest has 20 vertices and 3 components. How many edges does it have?

answer: 17

::: explanation
By [[cor:forest-edges]], $n - c = 20 - 3 = 17$.
:::
::::

:::: quiz {#q:t03-tree-leaves}
Which statement is true for every tree with at least 2 vertices?

- [ ] It has exactly 2 leaves.
- [x] It has at least 2 leaves.
- [ ] It has at most $n/2$ leaves.

::: explanation
[[thm:two-leaves]] gives at least two; a star $K_{1,n-1}$ has $n - 1$ leaves.
:::
::::

:::: quiz {#q:t03-girth-kmn}
What is the girth of $K_{3,3}$?

answer: 4

::: explanation
$K_{3,3}$ is bipartite, so it has no triangles (no odd cycles at all), and $1\,1'\,2\,2'\,1$ is a 4-cycle.
:::
::::
