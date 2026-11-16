---
title: Euler's formula
course: theory
chapter: planarity
order: 5
lectures: [t07]
goal: Prove that vertices plus faces minus edges is 2 for every connected plane multigraph.
needs: [theory/planarity/geometric-dual, theory/trees/spanning-trees, theory/trees/leaves]
stage: taught
status: reviewed
---

The lecture drew the plane graph below. Count its vertices, its edges and its faces, with the
outer face. Then take vertices plus faces minus edges. Do the same for the pentagon inside a
pentagon on the page on the [[def:geometric-dual|geometric dual]]. Do we always get the same
number?

```graph id=t07-euler-board widget=stepper
caption: The lecture's plane graph: 8 vertices, 16 edges and 10 faces, with a letter in each face. The 7 thick edges form a spanning tree. Each of the other 9 edges is crossed by a dashed edge, and the dashed edges form a tree that joins all 10 faces.
intent: From the lecture (theory/2026-10-27 p2, the drawing on the right: the graph in green with a spanning tree drawn wavy, and in red the tree of the dual formed by the other edges, with the outer vertex on the right). The board has no vertex or face names; the numbers and letters are new. Positions follow the board, made symmetric.
layout: fixed
1 @(0, 4); 2 @(4, 4); 3 @(4, 0); 4 @(0, 0); 5 @(2, 3.1); 6 @(3.1, 2); 7 @(2, 0.9); 8 @(0.9, 2)
1 -- 2 -- 3 -- 4 -- 1
5 -- 8; 1 -- 8; 4 -- 8; 2 -- 6; 3 -- 6
1 -- 5; 2 -- 5; 5 -- 6; 6 -- 7; 7 -- 8; 3 -- 7; 4 -- 7
A @(2, 3.7) [class=dual]; B @(3.03, 3.03) [class=dual]; C @(3.7, 2) [class=dual]; D @(3.03, 0.97) [class=dual]; E @(2, 0.3) [class=dual]
F @(0.97, 0.97) [class=dual]; K @(0.3, 2) [class=dual]; L @(0.97, 3.03) [class=dual]; M @(2, 2) [class=dual]; O @(4.9, 2) [class=dual]
mark faces: A B C D E F K L M O
step: The plane graph: 8 vertices, 16 edges, and a letter in each of its 10 faces.
step: A spanning tree: the 7 thick edges.
class tree: 1--5 2--5 5--6 6--7 7--8 3--7 4--7
mark T: 1--5 2--5 5--6 6--7 7--8 3--7 4--7
step: Each of the other 9 edges is crossed by a dashed edge of the dual. The dashed edges form a tree on the 10 faces.
A -- O [class=dual via="(2, 4.45) (4.45, 4.45)"]
C -- O [class=dual]
E -- O [class=dual via="(2, -0.45) (4.45, -0.45)"]
K -- O [class=dual via="(-0.45, 2) (-0.45, 4.9) (5.35, 4.9) (5.35, 2.4)"]
L -- M [class=dual]; L -- K [class=dual]; K -- F [class=dual]; B -- C [class=dual]; D -- C [class=dual]
mark rest: A--O C--O E--O K--O L--M L--K K--F B--C D--C
```

Here we count 8 vertices, 16 edges and [[fig:t07-euler-board#faces|10 faces]]. Then 8 plus 10
minus 16 is 2. The pentagons give 10 plus 7 minus 15, which is 2 again.

The answer is always 2, as long as the graph is connected. The lecture's proof splits the edges
into two trees. [[fig:t07-euler-board#T|The 7 thick edges]] form a spanning tree of the graph:
one edge fewer than its 8 vertices. [[fig:t07-euler-board#rest|The other 9 edges]], seen in
the dual, form a tree that joins all 10 faces: one edge fewer than the faces. So the 16 edges
are 7 plus 9.

## The formula

::: theorem {#thm:euler-formula title="Euler's formula" source="theory/2026-10-27 p2"}
Let $G$ be a connected plane multigraph and $F(G)$ its set of facial walks, one for each face
of $G$. Then
$$\abs{V(G)} + \abs{F(G)} - \abs{E(G)} = 2.$$
:::

<!-- REVIEW: the board says "F(G) its set of facial walks". The inside and the outside of a cycle have the same facial walk, so as a set they would count once and a cycle would give n + 1 - n = 1. Changed to "one for each face of G", as in the definition of the geometric dual. The board adds "connected!" above the statement; it is kept. -->

::: intuition
Count the vertices, add the faces and subtract the edges. For a connected graph drawn without
crossings, the result is always 2. It does not depend on the graph's size or on how it is
drawn.
:::

## Why it is true

The proof **counts the edges of two spanning trees**: one tree in $G$, and one in the dual
formed by the edges that the first tree leaves out.

:::: walkthrough {for=thm:euler-formula}
```graph id=t07-euler-proof widget=stepper
caption: The proof on a small plane graph with the faces P, Q, R, S and the outer face O: 5 edges in the thick spanning tree, 4 dashed edges in the tree of the dual, 9 edges in all.
intent: New figure; the lecture's graph (t07-euler-board) is too large for a walkthrough. Each step is one step of the written proof; step 2 is the starred step, which the lecture states without proof.
layout: fixed
1 @(0, 1.3); 2 @(1.5, 1.3); 3 @(3, 1.3); 4 @(0, 0); 5 @(1.5, 0); 6 @(3, 0)
1 -- 2 [class=tree]; 2 -- 3 [class=tree]; 1 -- 4 [class=tree]; 3 -- 6 [class=tree]; 2 -- 5 [class=tree]
4 -- 5; 5 -- 6; 1 -- 5; 3 -- 5
mark T: 1--2 2--3 1--4 3--6 2--5
step: A spanning tree $T$ of $G$: the five thick edges.
step: The four edges not in $T$, dashed in the dual, form a spanning tree $H$ of the dual.
P @(0.5, 0.43) [class=dual]; Q @(1, 0.87) [class=dual]; R @(2, 0.87) [class=dual]; S @(2.5, 0.43) [class=dual]; O @(1.5, -0.6) [class=dual]
P -- O [class=dual]; P -- Q [class=dual]; R -- S [class=dual]; S -- O [class=dual]
mark H: P--O P--Q R--S S--O
step: The tree $T$: 6 vertices, 5 edges.
class muted: P Q R S O P--O P--Q R--S S--O 4--5 5--6 1--5 3--5
step: The tree $H$: 5 faces, 4 edges.
unclass muted: P Q R S O P--O P--Q R--S S--O
class muted: 1--2 2--3 1--4 3--6 2--5
step: Each edge of $G$ is thick or crossed by a dashed edge, never both: 9 = 5 + 4.
unclass muted: 1--2 2--3 1--4 3--6 2--5 4--5 5--6 1--5 3--5
class highlight: 4--5 5--6 1--5 3--5
mark rest: 4--5 5--6 1--5 3--5
```

::: step
Let [[fig:t07-euler-proof#T|$T$]] be a [[def:spanning-tree|spanning tree]] of $G$. It exists
because $G$ is connected: while a cycle is left, delete one of its edges. The rest of the cycle
still joins its ends, so the graph stays connected and ends as a tree. This is where we use
that $G$ is connected. Here $T$ has 5 edges.
:::

::: step
The starred step of the lecture: the edges not in $T$ form a spanning tree
[[fig:t07-euler-proof#H|$H$]] of the dual. Its vertices are all the faces, and its edges are
the edges not in $T$. The lecture states this step without proof. Here $H$ joins P, Q, R, S
and O with 4 edges.
:::

::: step
$T$ is a tree with all vertices of $G$. A tree with $k$ vertices has $k - 1$ edges: deleting a
[[cor:tree-leaf|leaf]] removes one vertex and one edge and leaves a tree, until one vertex and
no edge are left. So $T$ has $\abs{V(G)} - 1$ edges. Here 6 vertices and 5 edges.
:::

::: step
$H$ is a tree whose vertices are the faces of $G$. By the same count, it has
$\abs{F(G)} - 1$ edges. Here 5 faces and 4 edges.
:::

::: step
Every edge of $G$ is in $T$ or [[fig:t07-euler-proof#rest|not in $T$]], never both. So
$\abs{E(G)} = \abs{V(G)} - 1 + \abs{F(G)} - 1$. Moving the terms to one side gives Euler's
formula. Here 9 is 5 plus 4, and 6 plus 5 minus 9 is 2.
:::
::::

:::: proof {title="Proof of Euler's formula"}
Let $T \subseteq G$ be any spanning tree of $G$. It exists because $G$ is connected: as long as
some cycle is left, we delete one of its edges. The graph stays connected, since the rest of the
cycle joins the ends of the deleted edge, and when no cycle is left it is a tree.

::: claim {#claim:euler-dual-tree title="The other edges form a spanning tree of the dual" source="theory/2026-10-27 p2"}
$E(G) \setminus E(T)$ induces a spanning tree of $G^*$.
:::

The lecture states this step without proof.

A tree on $k$ vertices has $k - 1$ edges: deleting a leaf removes one vertex and one edge and
leaves a tree, and after $k - 1$ such steps one vertex and no edge are left. $T$ has the
$\abs{V(G)}$ vertices of $G$, and the tree of the claim has the $\abs{V(G^*)} = \abs{F(G)}$
vertices of $G^*$. So
$$\abs{E(G)} = \abs{E(T)} + \abs{E(G) \setminus E(T)} = \abs{V(G)} - 1 + \abs{F(G)} - 1,$$
which is $\abs{V(G)} + \abs{F(G)} - \abs{E(G)} = 2$.
::::

::: intuition {for=claim:euler-dual-tree}
The edges that a spanning tree of $G$ leaves out are again a tree, now in the dual: they join
all the faces, and they form no cycle.
:::

## The starred step on the board

The lecture states the starred step without proof. Next to it the board draws a cycle of the
dual around a single vertex and crosses it out. The figure shows such a cycle on the small
graph.

```graph id=t07-euler-claim widget=stepper
caption: The tree H of the dual for the thick spanning tree, and a cycle of the dual around the vertex 5. The cycle uses the dashed edge across 2 5, a thick edge, so it is not a cycle of H.
intent: Illustrates the starred step, not a proof of it. The cycle around a vertex comes from the lecture (theory/2026-10-27 p2, bottom right: a dual cycle around a vertex, crossed out); the graph is that of t07-euler-proof.
layout: fixed
1 @(0, 1.3); 2 @(1.5, 1.3); 3 @(3, 1.3); 4 @(0, 0); 5 @(1.5, 0); 6 @(3, 0)
1 -- 2 [class=tree]; 2 -- 3 [class=tree]; 1 -- 4 [class=tree]; 3 -- 6 [class=tree]; 2 -- 5 [class=tree]
4 -- 5; 5 -- 6; 1 -- 5; 3 -- 5
P @(0.5, 0.43) [class=dual]; Q @(1, 0.87) [class=dual]; R @(2, 0.87) [class=dual]; S @(2.5, 0.43) [class=dual]; O @(1.5, -0.6) [class=dual]
P -- O [class=dual]; P -- Q [class=dual]; R -- S [class=dual]; S -- O [class=dual]
step: The tree $H$ of the dual: 4 dashed edges, no cycle, all 5 faces.
step: Adding the dashed edge across the thick edge 2 5 closes a cycle around the vertex 5.
Q -- R [class=dual]
class cycle: P--O P--Q Q--R R--S S--O
class highlight: 2--5
mark C: P--O P--Q Q--R R--S S--O
mark f: 2--5 Q--R
```

The [[fig:t07-euler-claim#C|cycle around 5]] crosses all five edges at 5. One of them is
[[fig:t07-euler-claim#f|the thick edge 2 5]], so the cycle is not made of edges outside $T$.

::: pitfall
The formula needs $G$ connected: the proof starts from a spanning tree. Draw two triangles side
by side. There are 6 vertices and 6 edges, and 3 faces: the two insides and one common outside.
Then 6 plus 3 minus 6 is 3, not 2.
:::

## Check yourself

:::: quiz {#q:t07-euler-faces}
A connected plane graph has 7 vertices and 12 edges. How many faces does it have?

answer: 7

::: explanation
By Euler's formula, 7 plus the number of faces minus 12 is 2, so there are 7 faces. An example
is a hexagon with one more vertex in the middle, joined to all six corners: six triangles and
the outer face.
:::
::::

:::: quiz {#q:t07-euler-connected}
Where does the proof of Euler's formula use that $G$ is connected?

- [x] To choose the spanning tree $T$ of $G$.
- [ ] To show that a tree with $k$ vertices has $k - 1$ edges.
- [ ] To show that every edge of $G$ is in $T$ or not in $T$.

::: explanation
Only a connected graph has a spanning tree. Counting the edges of a tree uses only that every
tree on two or more vertices has a leaf, and the last option holds for any set of edges $T$.
:::
::::
