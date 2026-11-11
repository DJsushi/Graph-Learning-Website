---
title: "Bipartite graphs and odd cycles"
course: theory
chapter: bipartite
order: 2
lectures: [t02]
stage: split
status: draft
---

::: theorem {#thm:bipartite-odd-cycle title="König's characterisation of bipartite graphs" aka="bipartite iff no odd cycle" source="theory/2026-09-22 p5"}
A graph $G$ is bipartite if and only if $G$ contains no [[def:cycle-graph|cycle]] of odd length.
:::

::: intuition
Walking around a cycle in a bipartite graph switches sides at every step, and an odd number of
switches cannot bring you back to the side you started on. So odd cycles are an obvious obstruction;
the theorem says they are the **only** one. It also gives a short certificate either way: a
bipartition proves that $G$ is bipartite, an odd cycle proves that it is not. Example: $C_6$ is
bipartite, while $C_5$ and every graph containing a triangle, such as $K_4$, are not.
:::

::: pitfall
Excluding triangles is not enough: $C_5$ has no triangle and is still not bipartite. The theorem
excludes cycles of **every** odd length.
:::

:::: proof
**($\Rightarrow$)** Let $(A, B)$ be a bipartition of $G$ and let $C \subseteq G$ be a cycle with vertices
$c_1, c_2, \dots, c_\ell$ in cyclic order. Every edge $c_i c_{i+1}$ joins $A$ and $B$, so the vertices of $C$
alternate between $A$ and $B$ as we go around. Going once around the cycle we return to $c_1$, which
lies in the same set it started in. So the number of steps, $\ell$, is even.

**($\Leftarrow$)** We show the contrapositive: if $G$ is not bipartite, then $G$ has an odd cycle.

First, a graph is bipartite iff each of its [[def:component|components]] is: given bipartitions $(A_j, B_j)$ of all
the components, $(\bigcup A_j, \bigcup B_j)$ is a bipartition of $G$, because there are no edges between
different components. So if $G$ is not bipartite, some component $K$ is not bipartite; we find an odd
cycle in $K$.

Run BFS from any vertex $x \in K$. It reaches all of $K$. Let
$$A := L_0 \cup L_2 \cup L_4 \cup \dots \quad (\text{even layers}), \qquad B := L_1 \cup L_3 \cup \dots \quad (\text{odd layers}).$$
Since $K$ is not bipartite, one of $A, B$ is not independent; without loss of generality (the argument
is the same for $B$) there is an edge $a_1a_2 \in E(G)$ with $a_1, a_2 \in A$. Every edge joins
vertices in the same or consecutive layers, and $a_1, a_2$ both lie in even layers, so they lie in
the **same** layer $L_i$, $i \ge 1$ (layer $L_0 = \set{x}$ has only one vertex).

Consider the [[def:path-graph|paths]] from $a_1$ and from $a_2$ to $x$ in the BFS [[def:forest-tree|tree]] ([[alg:bfs]]). Once these two paths meet, they
continue identically (each vertex has a unique parent). Let $b$ be the first vertex where they meet,
the **least common ancestor** of $a_1$ and $a_2$; say $b \in L_j$ with $j < i$ (as $a_1 \ne a_2$ are in the
same layer, $b$ is neither of them). The tree path from $a_1$ to $b$ and the tree path from $a_2$ to $b$
both have length $i - j$, and they share only the vertex $b$. Together with the edge $a_1a_2$ they form a
cycle of length
$$(i - j) + (i - j) + 1 = 2(i - j) + 1,$$
which is odd.
::::

```graph id=t02-odd-cycle-bfs widget=stepper
caption: The proof in action: BFS layers from $x$, an edge $a_1a_2$ inside one layer, and the odd cycle through their least common ancestor $b$.
intent: Transcription of the lecture sketch with layers 0..3; show how the edge inside a layer closes an odd cycle with the two tree paths.
layout: fixed
x @(0, 3); b @(-1, 2); p @(1, 2); c1 @(-1.6, 1); c2 @(-0.4, 1); q @(1, 1); a1 @(-1.6, 0) [label="$a_1$"]; a2 @(-0.4, 0) [label="$a_2$"]; r @(1, 0)
x -- b [class=tree]; x -- p [class=tree]; b -- c1 [class=tree]; b -- c2 [class=tree]; p -- q [class=tree]
c1 -- a1 [class=tree]; c2 -- a2 [class=tree]; q -- r [class=tree]; c2 -- q; a2 -- r
a1 -- a2
group L0: x [label="$L_0$"]
group L1: b p [label="$L_1$"]
group L2: c1 c2 q [label="$L_2$"]
group L3: a1 a2 r [label="$L_3$"]
step: BFS layers from $x$; tree edges are drawn bold. Even layers form $A$, odd layers form $B$.
step: The edge $a_1a_2$ has both ends in layer $L_3$, so $A$ or $B$ is not independent.
class highlight: a1--a2
step: Follow the tree paths from $a_1$ and $a_2$ upwards until they meet at $b$, their least common ancestor in layer $L_1$.
class path: a1--c1 c1--b a2--c2 c2--b
step: Both tree paths have length $3 - 1 = 2$; with the edge $a_1a_2$ they form a cycle of length $2 \cdot 2 + 1 = 5$.
class cycle: a1 a2 c1 c2 b a1--a2 a1--c1 c1--b a2--c2 c2--b
```

::: remark
The proof gives an efficient algorithm: run BFS in every component and 2-colour the vertices by the
parity of their layer. Either this colouring is a bipartition, or an edge inside a layer exhibits an
odd cycle, a short **certificate** that the graph is not bipartite.
:::

```graph id=t02-bipartite-sandbox widget=editable
caption: Experiment: the graph is bipartite exactly when it has no odd cycle. Add an edge that closes an odd cycle and watch the property change.
intent: Let students test the theorem; live properties show bipartiteness and girth.
live: bipartite, girth, components
use: C(6)
```
