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

First part: a construction with an invariant, kept by induction over the steps.

:::: walkthrough {for=thm:cayley}
```graph id=t03-cayley-invariant widget=stepper
caption: The construction for $n = 5$ with the choices of the lecture's drawing: $x_3 = y_1$ and $y_3 = x_2$. Roots are marked as sources.
intent: From the lecture (theory/2026-09-29 p6, the drawing in the box $K_n$): $x_1 \to y_1$, $x_2 \to y_2$, then $x_3 = y_1$ and $y_3 = x_2$. The vertex numbers are new; names and positions follow t03-cayley-construction. Shows the invariant and why each step keeps it.
type: directed
layout: fixed
1 @(0, 0.94); 2 @(0.89, 0.29); 3 @(0.55, -0.76); 4 @(-0.55, -0.76); 5 @(-0.89, 0.29)
step: No arcs: 5 components, 5 roots.
class source: 1 2 3 4 5
mark roots: 1 2 3 4 5
step: Step 1: $x_1 = 1$, $y_1 = 2$.
1 -> 2 [class=highlight]
unclass source: 2
mark x: 1
mark y: 2
step: Step 2: $x_2 = 4$, $y_2 = 5$. Now 3 components.
unclass highlight: 1->2
4 -> 5 [class=highlight]
unclass source: 5
mark roots: 1 3 4
step: Step 3: $x_3 = 2$ and $y_3 = 4$ lie in different components.
unclass highlight: 4->5
2 -> 4 [class=highlight]
mark x: 2
mark y: 4
step: $y_3 = 4$ was a root; now it has in-degree 1.
unclass source: 4
class current: 4
step: The merged tree is oriented away from the root 1.
unclass current: 4
unclass highlight: 2->4
class path: 1->2 2->4 4->5
mark away: 1->2 2->4 4->5
```

::: step
We build a [[def:mixed-multigraph|digraph]] on the $n$ vertices of $K_n$ in $n - 1$ steps, one arc per step. At the start there are no arcs. Each vertex is a component of its own and has in-degree 0, so each vertex is the [[fig:t03-cayley-invariant#roots|root]] of its component. Here $n = 5$: five roots.
:::

::: step
In step $k$ we choose [[fig:t03-cayley-invariant#x|$x_k$]] freely. We choose [[fig:t03-cayley-invariant#y|$y_k$]] with two conditions: it has in-degree 0 now, and it lies in another weak [[def:component|component]] than $x_k$. Weak means that we ignore directions. Then we add the arc $(x_k, y_k)$. In step 1 every vertex other than $x_1$ qualifies. Here $x_1$ is 1 and $y_1$ is 2.
:::

::: step
The invariant: after step $k$ we have a [[def:forest-tree|forest]] with $n - k$ components. Each is a tree oriented away from its root, the only vertex of in-degree 0 in it. All in-degrees are at most 1. At the start this holds: $n$ single vertices. Here, after step 2 (4 to 5), three components with [[fig:t03-cayley-invariant#roots|roots]] 1, 3 and 4.
:::

::: step
One step keeps the invariant. Here $x_3$ is 2 and $y_3$ is 4, as in the lecture. They lie in different components, so no path joined them before. A new cycle would need the new edge plus such a path. So no cycle appears. Two components become one, the others stay: $n - k$ remain. Here 2.
:::

::: step
Why does the in-degree stay at most 1? The vertex $y_k$ had in-degree 0. By the invariant the only such vertex in its component is the root, so $y_k$ was a root. Now its in-degree is 1. No other in-degree changes. Here vertex 4 gets its first incoming arc, from 2.
:::

::: step
The merged tree is oriented away from the root of the component of $x_k$. From that root the arcs lead to $x_k$, the new arc leads on to $y_k$, and the old tree of $y_k$ leads away from $y_k$. That root is the only vertex left with in-degree 0. Here [[fig:t03-cayley-invariant#away|1 to 2 to 4 to 5]].
:::
::::

First count: the multiplication rule, one factor per step.

:::: walkthrough {for=thm:cayley}
```graph id=t03-cayley-first-count widget=stepper
caption: Step 3 for $n = 5$: whichever $x_3$ we pick, exactly two roots are allowed as $y_3$.
intent: New. The state after the first two steps of t03-cayley-invariant (lecture p6), with the allowed and the excluded choices of step 3.
type: directed
layout: fixed
1 @(0, 0.94); 2 @(0.89, 0.29); 3 @(0.55, -0.76); 4 @(-0.55, -0.76); 5 @(-0.89, 0.29)
1 -> 2; 4 -> 5
step: Before step 3: 3 components, 3 roots.
class source: 1 3 4
mark roots: 1 3 4
step: $x_3$ is any of the 5 vertices; here 2.
class current: 2
mark x: 2
step: $y_3$ is a root of another component: 3 or 4.
2 -> 3 [class=dashed]
2 -> 4 [class=dashed]
class rejected: 1
mark y: 3 4
mark own: 1
step: With $x_3 = 5$ again 2 choices: 1 or 3.
remove 2->3 2->4
unclass current: 2
unclass rejected: 1
class current: 5
class rejected: 4
5 -> 1 [class=dashed]
5 -> 3 [class=dashed]
step: Multiply over all steps: $5^4 \cdot 4! = 15000$.
remove 5->1 5->3
unclass current: 5
unclass rejected: 4
2 -> 4 [class=highlight]
```

::: step
Before step $k$, $k - 1$ arcs are in place. By the invariant there are $n - k + 1$ components, each with exactly one vertex of in-degree 0, its root. So there are that many [[fig:t03-cayley-first-count#roots|roots]]. Here, before step 3, the arcs 1 to 2 and 4 to 5 are in place: roots 1, 3 and 4.
:::

::: step
The vertex [[fig:t03-cayley-first-count#x|$x_k$]] has no condition, so there are $n$ ways to choose it. Here 5 ways; we take 2.
:::

::: step
The vertex [[fig:t03-cayley-first-count#y|$y_k$]] needs in-degree 0, so it is a root. It must lie outside the component of $x_k$, so it is not the root of that component. One of the $n - k + 1$ roots drops out: $n - k$ ways. Here 3 or 4, and 1 is [[fig:t03-cayley-first-count#own|excluded]]: 2 ways.
:::

::: step
The number $n - k$ does not depend on which $x_k$ we took. Every component has one root, and only the component of $x_k$ is excluded. So the two choices are independent, and step $k$ offers $n \cdot (n - k)$ pairs. Here $x_3$ as 5 allows 1 or 3: again 2.
:::

::: step
The count of each step is the same whatever happened before, so the multiplication rule gives the total. The factor $n$ appears $n - 1$ times. The factors $n - k$ count down from $n - 1$ to 1, so their product is $(n-1)!$. Total: $n^{n-1} \cdot (n-1)!$ choice sequences. Here 625 times 24, that is 15000.
:::
::::

What we constructed: each choice sequence gives one triple (tree, root, order), and different sequences give different triples.

:::: walkthrough {for=thm:cayley}
```graph id=t03-cayley-result widget=stepper
caption: The construction above, finished: a spanning tree of $K_5$, its root $1$ and the order of its arcs.
intent: New. Continues the lecture's example (p6) by step 4 with $x_4 = 2$, $y_4 = 3$; the order labels show the triple.
type: directed
layout: fixed
1 @(0, 0.94); 2 @(0.89, 0.29); 3 @(0.55, -0.76); 4 @(-0.55, -0.76); 5 @(-0.89, 0.29)
1 -> 2; 4 -> 5; 2 -> 4
class source: 1 3
step: Step 4: $x_4 = 2$, $y_4 = 3$. One component, root 1.
2 -> 3 [class=highlight]
unclass source: 3
mark tree: 1->2 4->5 2->4 2->3
mark root: 1
step: Each arc is numbered by its step.
unclass highlight: 2->3
set 1->2 [label="1st"]
set 4->5 [label="2nd"]
set 2->4 [label="3rd"]
set 2->3 [label="4th"]
mark order: 1->2 4->5 2->4 2->3
step: The 3rd arc gives back $x_3 = 2$ and $y_3 = 4$.
class current: 2->4
mark arc3: 2->4
```

::: step
Step 4 here: $x_4$ is 2 and $y_4$ is 3. After $n - 1$ steps the invariant leaves one component: a tree on all $n$ vertices, oriented away from its [[fig:t03-cayley-result#root|root]]. $K_n$ is complete, so it contains every edge of this tree. That is where we use $K_n$: we get [[fig:t03-cayley-result#tree|a spanning tree]] of $K_n$. Here root 1.
:::

::: step
We also keep the [[fig:t03-cayley-result#order|order]] in which the arcs came: arc number $k$ is $(x_k, y_k)$. So each choice sequence gives a triple: a [[def:spanning-tree|spanning tree]], a root, and an order of its $n - 1$ edges. Here the arcs came from 1 to 2, 4 to 5, 2 to 4, then 2 to 3.
:::

::: step
Different sequences give different triples. A tree has [[cor:tree-unique-path|one path]] from the root to each vertex, and every arc points along it. So tree and root fix all directions, and with the order we get back the arcs. Arc $k$ gives back $x_k$ (its tail) and $y_k$ (its head). Here the [[fig:t03-cayley-result#arc3|3rd arc]] gives 2 and 4.
:::
::::

Second count and conclusion: every triple comes from a choice sequence, so we count triples instead and compare the two counts.

:::: walkthrough {for=thm:cayley}
```graph id=t03-cayley-second-count widget=stepper
caption: The tree built above, rooted at $4$ instead, with a new order: replaying the arcs obeys both rules of the construction.
intent: New. The tree shape (a root with two children, one of which has children) follows the rooted tree drawn in the lecture (p6, under the box $K_n$), with one leaf fewer so that $n = 5$.
type: mixed
layout: fixed
1 @(0, 0.94); 2 @(0.89, 0.29); 3 @(0.55, -0.76); 4 @(-0.55, -0.76); 5 @(-0.89, 0.29)
1 -- 2; 2 -- 4; 4 -- 5; 2 -- 3
step: A spanning tree $T$ of $K_5$, without directions.
mark T: 1--2 2--4 4--5 2--3
step: Root 4: every edge points away from 4.
remove 1--2 2--4 4--5 2--3
4 -> 2; 4 -> 5; 2 -> 1; 2 -> 3
class source: 4
mark root: 4
step: An order of the 4 edges, one of 24.
set 2->3 [label="1st"]
set 4->5 [label="2nd"]
set 2->1 [label="3rd"]
set 4->2 [label="4th"]
step: Replay: at the 3rd arc, vertex 1 still has in-degree 0.
class tree: 2->3 4->5
class highlight: 2->1
class muted: 4->2
mark xy: 2->1
step: 2 and 1 lie in different components.
class color1: 2 3
class color2: 1
class color3: 4 5
mark comp: 2 3
step: All 4 arcs replayed: one tree gives $5 \cdot 24 = 120$ sequences.
unclass color1: 2 3
unclass color2: 1
unclass color3: 4 5
unclass highlight: 2->1
unclass muted: 4->2
class tree: 2->1 4->2
step: $15000 = C(5) \cdot 120$, so $C(5) = 125 = 5^3$.
class bold: 2->3 4->5 2->1 4->2
```

::: step
Now we count the same choice sequences from the other side. Let [[fig:t03-cayley-second-count#T|$T$]] be any spanning tree of $K_n$. Since $K_n$ is complete, any tree on its $n$ vertices is one. Here $T$ is the tree we just built, with the directions forgotten.
:::

::: step
Choose any of the $n$ vertices as the [[fig:t03-cayley-second-count#root|root]]. This fixes every direction: each vertex has one path from the root, and we direct each edge along it, away from the root. Here root 4: arcs from 4 to 2 and 5, and from 2 to 1 and 3.
:::

::: step
Order the $n - 1$ edges in any of the $(n-1)!$ ways. Root and order are chosen independently. Here there are 24 orders; we take the arcs from 2 to 3, 4 to 5, 2 to 1, then 4 to 2.
:::

::: step
Every triple arises: add the arcs in this order. When the arc [[fig:t03-cayley-second-count#xy|$(x, y)$]] comes, the arcs so far are other arcs of the oriented tree. There $y$ has one incoming arc, the last arc of its path from the root: $(x, y)$. So $y$ still has in-degree 0. Here the 3rd arc ends at 1, which has none yet.
:::

::: step
Also $x$ and $y$ lie in different components. Otherwise the arcs so far, all edges of $T$, would already join $x$ to $y$ by a path. With the edge $xy$ this path closes a cycle in $T$, but $T$ is a tree. The choice is allowed. Here 1 lies alone, and 2 in the [[fig:t03-cayley-second-count#comp|component]] of 2 and 3.
:::

::: step
So every triple comes from a choice sequence, and by the part above different sequences give different triples. Let $C(n)$ be the number of spanning trees of $K_n$. Then the sequences are exactly as many as the triples: $C(n) \cdot n \cdot (n-1)!$. Here one tree gives 5 times 24, that is 120, sequences.
:::

::: step
Both counts count the same set of choice sequences, so the results are equal. Divide both by $n \cdot (n-1)!$, which is not 0. On the right only the number of trees remains. On the left one factor $n$ goes, leaving $n^{n-2}$. Here 15000 divided by 120 gives 125, that is 5 cubed.
:::
::::

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
