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

```graph id=t02-odd-cycle-certificates widget=figure
caption: $C_6$ has a bipartition: the colours alternate and every edge joins two colours. $C_5$ has none: it is itself an odd cycle, and after colouring 1 to 4 alternately, vertex 5 has a neighbour of each colour.
intent: New (the lecture has no example here). The two certificates of the theorem side by side: a bipartition for $C_6$, an odd cycle for $C_5$. The intuition names both graphs.
layout: fixed
panel: bipartite: $C_6$
1 @(0, 1) [class=color1]; 2 @(0.87, 0.5) [class=color2]; 3 @(0.87, -0.5) [class=color1]; 4 @(0, -1) [class=color2]; 5 @(-0.87, -0.5) [class=color1]; 6 @(-0.87, 0.5) [class=color2]
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
panel: not bipartite: $C_5$
1 @(0, 1) [class=color1]; 2 @(0.95, 0.31) [class=color2]; 3 @(0.59, -0.81) [class=color1]; 4 @(-0.59, -0.81) [class=color2]; 5 @(-0.95, 0.31) [class=rejected]
1 -- 2 [class=cycle]; 2 -- 3 [class=cycle]; 3 -- 4 [class=cycle]; 4 -- 5 [class=cycle]; 5 -- 1 [class=cycle]
```

::: pitfall
Excluding triangles is not enough: $C_5$ has no triangle and is still not bipartite. The theorem
excludes cycles of **every** odd length.
:::

The forward direction is a parity count around the cycle; the backward direction is a proof by contraposition that builds an odd cycle from BFS layers and a least common ancestor.

Part 1 ($\Rightarrow$): a cycle in a bipartite graph alternates between the two sides, so its length is even.

:::: walkthrough {for=thm:bipartite-odd-cycle}
```graph id=t02-odd-cycle-alternate widget=stepper
caption: In a bipartite graph the vertices of a cycle alternate between $A$ and $B$, so the cycle has even length.
intent: From the lecture (theory/2026-09-22 p5, the sketch of $A$ with four vertices above $B$ with three). The lecture's edges are not readable, so the edges and the 6-cycle are new.
layout: fixed
c1 @(0, 1) [label="$c_1$"]; c3 @(1.2, 1) [label="$c_3$"]; c5 @(2.4, 1) [label="$c_5$"]; u @(3.6, 1)
c2 @(0.6, 0) [label="$c_2$"]; c4 @(1.8, 0) [label="$c_4$"]; c6 @(3, 0) [label="$c_6$"]
c1 -- c2; c2 -- c3; c3 -- c4; c4 -- c5; c5 -- c6; c6 -- c1; u -- c4; u -- c6
group A: c1 c3 c5 u [label="$A$"]
group B: c2 c4 c6 [label="$B$"]
mark C: c1 c2 c3 c4 c5 c6 c1--c2 c2--c3 c3--c4 c4--c5 c5--c6 c6--c1
step: A bipartition $(A, B)$ and a cycle $C$ on $c_1, \dots, c_6$.
class cycle: c1--c2 c2--c3 c3--c4 c4--c5 c5--c6 c6--c1
step: The edge $c_1c_2$ joins $A$ and $B$.
class current: c1 c2
step: Going around, the vertices alternate between $A$ and $B$.
unclass current: c1 c2
class color1: c1 c3 c5
class color2: c2 c4 c6
step: After $6$ steps we are back at $c_1$, in $A$.
class highlight: c6--c1
class current: c1
```

::: step
We assume that $G$ is bipartite: this is the hypothesis of this direction. So $G$ has a [[def:bipartite|bipartition]] $(A, B)$. Let [[fig:t02-odd-cycle-alternate#C|$C$]] be any cycle of $G$, with vertices $c_1$, $c_2$ up to $c_\ell$ in cyclic order. We must show that its length $\ell$ is even. Here $\ell = 6$.
:::

::: step
Take an edge of $C$ from $c_i$ to the next vertex $c_{i+1}$. Its ends are not both in $A$, because $A$ is independent, and not both in $B$, for the same reason. Every vertex lies in exactly one of the two sets. So one end is in $A$ and the other in $B$. Here: $c_1$ in $A$, $c_2$ in $B$.
:::

::: step
So each step along $C$ switches the side. Here $c_1$, $c_3$, $c_5$ lie on one side and $c_2$, $c_4$, $c_6$ on the other. After $k$ steps from $c_1$ we are on the side of $c_1$ exactly when $k$ is even, because every step switches once.
:::

::: step
Going once around $C$ takes $\ell$ steps: the last edge leads from $c_\ell$ back to $c_1$. We end at $c_1$, in the set where we started. So the number of steps $\ell$ is even. Here: $6$ steps, and the last one goes from $c_6$ in $B$ back to $c_1$ in $A$.
:::
::::

Part 2 ($\Leftarrow$), the reduction: if $G$ is not bipartite, one of its components is not bipartite.

:::: walkthrough {for=thm:bipartite-odd-cycle}
```graph id=t02-odd-cycle-components widget=stepper
caption: A graph with two components: $H_1$ is bipartite, the triangle $H_2$ is not. Bipartitions of all components would combine into one of $G$.
intent: New. The lecture (theory/2026-09-22 p5) has no picture for the step to one component; this figure shows why bipartitions of the components combine.
layout: fixed
s @(0, 1); t @(1, 1); u @(1, 0); w @(0, 0)
y @(2.4, 1); z @(3.4, 1); v @(2.9, 0)
s -- t -- u -- w -- s; y -- z -- v -- y
group K1: s t u w [label="$H_1$"]
group K2: y z v [label="$H_2$"]
mark G: s t u w y z v s--t t--u u--w w--s y--z z--v v--y
step: A graph $G$ that is not bipartite.
step: A bipartition of the component $H_1$.
class color1: s u
class color2: t w
step: Every edge lies inside one component.
class bold: s--t t--u u--w w--s
step: So some component $K$ is not bipartite: here the triangle $H_2$.
unclass bold: s--t t--u u--w w--s
class muted: s t u w s--t t--u u--w w--s
class cycle: y z v y--z z--v v--y
```

::: step
We prove the contrapositive: if $G$ is not bipartite, then $G$ has an odd cycle. A statement and its contrapositive are equivalent, so this proves "no odd cycle, then bipartite". From now on [[fig:t02-odd-cycle-components#G|$G$]] is not bipartite. Here it has two components, and the triangle on $y$, $z$, $v$ already blocks a bipartition.
:::

::: step
First a claim: if every [[def:component|component]] has a bipartition $(A_j, B_j)$, then $G$ has one. Put all the sets $A_j$ together into $A$ and all $B_j$ into $B$. Each vertex lies in exactly one component, so in exactly one of $A$ and $B$. Here $H_1$ has one: $s$, $u$ in $A_1$ and $t$, $w$ in $B_1$.
:::

::: step
Why are $A$ and $B$ independent? An edge is a walk of length 1, so its two ends lie in the same component: no edge joins different components. Inside its component the edge joins $A_j$ to $B_j$, so it joins $A$ to $B$. Here each of the four edges of $H_1$ joins the two colours.
:::

::: step
So "all components bipartite" gives "$G$ bipartite". Our $G$ is not bipartite, which is the hypothesis, so some component $K$ is not. Here $K$ is $H_2$: any split of its three vertices puts two neighbours on one side. An odd cycle of $K$ is also one of $G$, so we search inside $K$.
:::
::::

Part 3 ($\Leftarrow$), the layers: BFS splits $K$ by parity, and some edge lies inside one layer.

:::: walkthrough {for=thm:bipartite-odd-cycle}
```graph id=t02-odd-cycle-layers widget=stepper
caption: BFS layers from $x$ split $K$ into even layers ($A$) and odd layers ($B$); three edges lie inside a layer.
intent: The graph of the page figure t02-odd-cycle-bfs (a transcription of the lecture sketch, theory/2026-09-22 p5), same names and positions. Like the lecture sketch, its edge $a_1a_2$ lies in the odd layer $L_3$, so it shows the case $B$ of the "without loss of generality".
layout: fixed
x @(0, 3); b @(-1, 2); p @(1, 2); c1 @(-1.6, 1) [label="$c_1$"]; c2 @(-0.4, 1) [label="$c_2$"]; q @(1, 1); a1 @(-1.6, 0) [label="$a_1$"]; a2 @(-0.4, 0) [label="$a_2$"]; r @(1, 0)
x -- b [class=tree]; x -- p [class=tree]; b -- c1 [class=tree]; b -- c2 [class=tree]; p -- q [class=tree]
c1 -- a1 [class=tree]; c2 -- a2 [class=tree]; q -- r [class=tree]; c2 -- q; a2 -- r
a1 -- a2
group L0: x [label="$L_0$"]
group L1: b p [label="$L_1$"]
group L2: c1 c2 q [label="$L_2$"]
group L3: a1 a2 r [label="$L_3$"]
mark A: x c1 c2 q
mark B: b p a1 a2 r
mark inside: c2--q a1--a2 a2--r
step: BFS from $x$ sorts all of $K$ into the layers $L_0$ to $L_3$.
class current: x
step: Even layers form $A$, odd layers form $B$.
unclass current: x
class color1: x c1 c2 q
class color2: b p a1 a2 r
step: Three edges lie inside a layer, so $A$ or $B$ is not independent.
class highlight: c2--q a1--a2 a2--r
step: We pick the edge $a_1a_2$.
unclass highlight: c2--q a2--r
class current: a1 a2
step: Its ends lie in one layer $L_i$; here $i = 3$.
class bold: a1--a2
step: That layer is not $L_0$, which holds only $x$.
class highlight: x
```

::: step
We work in the component $K$ that is not bipartite. Run [[alg:bfs|BFS]] from any vertex $x$ of $K$. BFS reaches exactly the component of $x$, so every vertex of $K$ lands in a layer: $L_i$ holds the vertices at distance $i$ from $x$. Here $K$ has the layers $L_0$ to $L_3$.
:::

::: step
We split $K$ by the parity of the layer: [[fig:t02-odd-cycle-layers#A|$A$]] is the union of the even layers, [[fig:t02-odd-cycle-layers#B|$B$]] the union of the odd ones. Each vertex has one distance from $x$, so it lies in exactly one layer, and in exactly one of $A$ and $B$. Here $A$ holds $x$, $c_1$, $c_2$, $q$.
:::

::: step
If $A$ and $B$ were both independent, $(A, B)$ would be a bipartition of $K$. But $K$ is not bipartite: here the hypothesis is used. So $A$ or $B$ contains an edge with both ends inside it. Here three [[fig:t02-odd-cycle-layers#inside|edges]] do: one in $L_2$, part of $A$, and two in $L_3$, part of $B$.
:::

::: step
The proof takes an edge inside $A$ and calls its ends $a_1$ and $a_2$. For an edge inside $B$ the argument is word for word the same, with odd layers instead of even ones. That is what "without loss of generality" means here. Our picture, like the lecture's, shows the case $B$: the edge between $a_1$ and $a_2$ in $L_3$.
:::

::: step
Why one layer? Neighbours differ in distance from $x$ by at most 1, so every edge joins the same or consecutive layers. Two different even layers differ by at least 2, so they are never consecutive. Hence $a_1$ and $a_2$ lie in one layer $L_i$. Here $i = 3$; two odd layers also differ by at least 2.
:::

::: step
Last, $i$ is at least 1. The layer $L_0$ holds only $x$, and an edge has two different ends, so no edge lies inside $L_0$. In the case $B$ this is automatic, because the odd layers start at $L_1$. Here $i = 3$.
:::
::::

Part 4 ($\Leftarrow$), the cycle: the two tree paths up to the least common ancestor and the edge $a_1a_2$ form a cycle of odd length.

:::: walkthrough {for=thm:bipartite-odd-cycle}
```graph id=t02-odd-cycle-lca widget=stepper
caption: The tree paths from $a_1$ and $a_2$ meet at their least common ancestor $b$; with the edge $a_1a_2$ they close a cycle of length $2 + 2 + 1 = 5$.
intent: The graph of the page figure t02-odd-cycle-bfs (a transcription of the lecture sketch, theory/2026-09-22 p5), same names and positions; this walkthrough fills in the reasons for each step of that figure.
layout: fixed
x @(0, 3); b @(-1, 2); p @(1, 2); c1 @(-1.6, 1) [label="$c_1$"]; c2 @(-0.4, 1) [label="$c_2$"]; q @(1, 1); a1 @(-1.6, 0) [label="$a_1$"]; a2 @(-0.4, 0) [label="$a_2$"]; r @(1, 0)
x -- b [class=tree]; x -- p [class=tree]; b -- c1 [class=tree]; b -- c2 [class=tree]; p -- q [class=tree]
c1 -- a1 [class=tree]; c2 -- a2 [class=tree]; q -- r [class=tree]; c2 -- q; a2 -- r
a1 -- a2 [class=highlight]
group L0: x [label="$L_0$"]
group L1: b p [label="$L_1$"]
group L2: c1 c2 q [label="$L_2$"]
group L3: a1 a2 r [label="$L_3$"]
mark P1: a1 c1 b a1--c1 c1--b
mark P2: a2 c2 b a2--c2 c2--b
mark shared: b x b--x
step: The tree paths from $a_1$ and $a_2$ up to $x$.
class path: a1--c1 c1--b b--x a2--c2 c2--b
step: They meet at $b$ and go on together.
class current: b
step: $b$ lies in $L_j$ with $j < i$; here $j = 1$.
unclass path: b--x
class muted: b--x x
step: Each path from $a_1$ or $a_2$ to $b$ has $i - j = 2$ edges.
unclass path: a1--c1 c1--b a2--c2 c2--b
class color1: a1--c1 c1--b
class color2: a2--c2 c2--b
step: The two paths share only $b$.
class visited: a1 c1 a2 c2
step: With the edge $a_1a_2$ they form a cycle of length $5$.
unclass color1: a1--c1 c1--b
unclass color2: a2--c2 c2--b
class cycle: a1 a2 c1 c2 b a1--a2 a1--c1 c1--b a2--c2 c2--b
```

::: step
Follow the path from $a_1$ up to $x$ in the BFS [[def:forest-tree|tree]], and the same from $a_2$. A tree edge joins a vertex to its parent, one layer higher. So the path from a vertex of $L_i$ has $i$ edges and one vertex in each layer. Here: $a_1$, $c_1$, $b$, $x$ and $a_2$, $c_2$, $b$, $x$.
:::

::: step
Both paths end at $x$, so they meet. From a shared vertex on they coincide: every vertex except $x$ has exactly one parent. Let $b$ be the first vertex where they meet, the least common ancestor of $a_1$ and $a_2$. Here they meet at $b$ and then [[fig:t02-odd-cycle-lca#shared|share the edge to $x$]].
:::

::: step
Say $b$ lies in $L_j$. The path up from $a_1$ starts in $L_i$ and only climbs, so $j$ is at most $i$. Its only vertex in $L_i$ is $a_1$, and likewise for $a_2$. If $b$ were in $L_i$, it would equal both $a_1$ and $a_2$, which differ. Hence $j < i$. Here $j = 1$.
:::

::: step
The [[fig:t02-odd-cycle-lca#P1|path from $a_1$ to $b$]] climbs one layer per edge, from $L_i$ to $L_j$, so it has $i - j$ edges. The same holds for the [[fig:t02-odd-cycle-lca#P2|path from $a_2$ to $b$]]. Here both have $3 - 1 = 2$ edges.
:::

::: step
The two paths share only $b$. Both start in $L_i$ and climb one layer per edge, so a common vertex below $b$ would sit in the same layer on both. The paths would meet there, before $b$, against the choice of $b$. Here $a_1$, $c_1$, $a_2$, $c_2$ are four different vertices.
:::

::: step
Now add the edge between $a_1$ and $a_2$. It is not on the paths, because tree edges join consecutive layers. So we get a closed walk without repeated vertices: a cycle in $K$, hence in $G$. Its length is $2(i - j) + 1$, at least 3 and odd. Here $2 + 2 + 1 = 5$.
:::
::::

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
