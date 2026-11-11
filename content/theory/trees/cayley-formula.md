---
title: "Cayley's formula"
course: theory
chapter: trees
order: 8
lectures: [t03]
stage: split
status: draft
---

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

::: intuition
The trees are labelled: two trees on $\set{1, \dots, n}$ count as different when their edge sets differ,
even if they have the same shape. So the count is much larger than the number of shapes; for $n = 4$ there
are only two shapes but $16$ trees ([[fig:t03-k4-spanning-trees]]). The proof below counts trees with extra
data that is easy to count, a root ($n$ choices) and an order of the edges ($(n-1)!$ choices), and then
divides out. Example: $K_3$ has $3^1 = 3$ spanning trees, one for each edge left out.
:::

::: pitfall
$n^{n-2}$ counts spanning trees of the **complete** graph $K_n$, i.e. labelled trees on $n$ vertices. It is
not the number of non-isomorphic trees ($2$ for $n = 4$), and it is not the number of spanning trees of an
arbitrary graph on $n$ vertices ($C_n$ has only $n$).
:::

The proof (due to Pitman) counts the same set of objects in two ways (**double counting**).

:::: proof
We build directed graphs on $V(K_n)$ in $n - 1$ steps $k = 1, 2, \dots, n - 1$, adding one [[def:mixed-multigraph|arc]] per step,
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
