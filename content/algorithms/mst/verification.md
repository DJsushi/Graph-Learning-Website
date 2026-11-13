---
title: "Verifying a minimum spanning tree"
course: algorithms
chapter: mst
order: 16
lectures: [a01]
stage: split
status: reviewed
---

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

The proof has two directions, and both lean on the strong cycle property. The first direction rules out every non-tree edge with a cycle, then counts edges.

:::: walkthrough {for=cor:mst-verification}
```graph id=a01-verif-all-heavy widget=stepper
caption: The running example with $T = M$ (thick edges): each of the 5 edges outside $T$ is $T$-heavy, so none belongs to the MST.
intent: New figure (the lecture, algorithms/01 p38, has no picture). Same graph and vertex names as a01-example-graph, squeezed flat. Marks show the tree T, the edges outside it, the edge bc and the cycle it closes.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark T: a--b a--c c--f d--e d--g e--f f--h
mark N: b--c b--d c--e e--g g--h
mark e: b--c
mark C: a--b a--c b--c
step: The tree $T$ and the edges outside it.
class tree: a--b a--c c--f d--e d--g e--f f--h
step: An edge $e$ outside $T$ closes one cycle.
class cycle: a--b a--c b--c
class current: b--c
step: $e$ is heavier than the rest of its cycle.
class bold: b--c
step: So $e$ is not in $M$.
unclass cycle: a--b a--c b--c
unclass current: b--c
unclass bold: b--c
class rejected: b--c
step: The same holds for every edge outside $T$.
class rejected: b--d c--e e--g g--h
step: $M$ lies inside $T$, so $M = T$.
class muted: b--c b--d c--e e--g g--h
class bold: a--b a--c c--f d--e d--g e--f f--h
```

::: step
Assume every edge of $G \setminus T$ is $T$-heavy. Let $M$ be the minimum spanning tree. All weights are distinct (our standing convention), so $M$ is unique. We must show $M = T$. Here: [[fig:a01-verif-all-heavy#T|$T$]] is the thick tree with 7 edges, and [[fig:a01-verif-all-heavy#N|5 edges]] lie outside it.
:::

::: step
Take any edge [[fig:a01-verif-all-heavy#e|$e$]] outside $T$. In the tree $T$ there is exactly one path between the ends of $e$. This path together with $e$ is the only cycle in $T + e$; call it [[fig:a01-verif-all-heavy#C|$C$]]. Here: $e = bc$ closes the cycle through $a$, $b$ and $c$.
:::

::: step
By definition, $w_T(e)$ is the largest weight on the path $C - e$. The edge $e$ is $T$-heavy, so $w(e)$ is larger than that maximum. Hence $e$ is heavier than every other edge of $C$: it is the heaviest edge of $C$. Here: 11 against 4 and 8.
:::

::: step
Weights are distinct, so [[thm:strong-cut-cycle|the strong cycle property]] applies: an edge that is the heaviest edge on some cycle is not in $M$. Hence $e$ is not in $M$. Here: $bc$ is not in the minimum spanning tree.
:::

::: step
We chose $e$ as an arbitrary edge outside $T$, and by assumption all of them are $T$-heavy. So the same argument works for each of them, and none lies in $M$. Here: besides $bc$, the edges $bd$ (9 against 8), $ce$ (7 against 5), $eg$ (12 against 6) and $gh$ (10 against 6) are $T$-heavy.
:::

::: step
Every edge of $M$ is therefore in $T$, so $M \subseteq T$. Both are spanning trees of $G$, so each has $n - 1$ edges. A subset with as many elements as the whole set is the whole set. Hence $M = T$. Here: both have 7 edges, because $G$ has 8 vertices.
:::
::::

For the second direction we assume $T = M$ and check each edge outside $T$ directly. The key is an exchange argument: a heavier edge on the cycle could be swapped in to make a lighter tree.

:::: walkthrough {for=cor:mst-verification}
```graph id=a01-verif-converse widget=stepper
caption: The running example with $T = M$ (thick edges): the edge $ce$ is heavier than both tree edges on the cycle it closes.
intent: New figure (the lecture, algorithms/01 p38, has no picture). Same graph as a01-verif-all-heavy. Marks show the tree T, the edge ce, the cycle it closes and the tree path between its ends.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark T: a--b a--c c--f d--e d--g e--f f--h
mark N: b--c b--d c--e e--g g--h
mark e: c--e
mark C: c--e c--f e--f
mark P: c--f e--f
step: $T = M$, and an edge $e$ outside it.
class tree: a--b a--c c--f d--e d--g e--f f--h
class current: c--e
step: $e$ closes one cycle with $T$.
class cycle: c--e c--f e--f
step: Suppose a heavier edge $f$ on the cycle.
class dashed: c--f e--f
step: Swapping $f$ for $e$ gives a spanning tree.
class bold: c--e
step: That tree is lighter, so no such $f$ exists.
unclass dashed: c--f e--f
step: The rest of the cycle is the $T$-path of $e$.
unclass cycle: c--e
class path: c--f e--f
step: Every edge outside $T$ is $T$-heavy.
unclass path: c--f e--f
unclass current: c--e
unclass bold: c--e
class highlight: b--c b--d c--e e--g g--h
```

::: step
Assume $T = M$, the minimum spanning tree (weights are distinct, so it is unique). We must show that every edge outside $T$ is $T$-heavy. Take any edge [[fig:a01-verif-converse#e|$e$]] outside $T$. Here: [[fig:a01-verif-converse#T|$T$]] is the thick tree, and $e = ce$ with weight 7.
:::

::: step
The edge $e$ is not in $T = M$, so by [[thm:strong-cut-cycle|the strong cycle property]] it is the heaviest edge on some cycle of $G$. We need this for the cycle in $T + e$: the path in $T$ between the ends of $e$, plus $e$. Call it [[fig:a01-verif-converse#C|$C$]]. Here: the cycle $c\,f\,e$, with weights 1, 5 and 7.
:::

::: step
Suppose another edge $f$ of $C$ were heavier than $e$. Then $f$ is in $M$, since $e$ is the only edge of $C$ outside $T$. Removing $f$ from the tree $M$ splits it into exactly two parts, and the ends of $f$ lie in different parts.
:::

::: step
Now swap. The path $C - f$ joins the ends of $f$, so it must cross between the two parts. Its edges other than $e$ lie in $M - f$, so each stays inside one part. Hence the crossing edge is $e$. So $M - f + e$ is connected with $n - 1$ edges: a spanning tree.
:::

::: step
This new tree is lighter than $M$: it trades the heavier $f$ for the lighter $e$. That contradicts the minimality of $M$. So no edge of $C$ is heavier than $e$. Weights are distinct, so $e$ is the heaviest edge of $C$, the cycle we needed. Here: 7 against 1 and 5.
:::

::: step
The cycle $C$ minus $e$ is exactly the path in $T$ between the ends of $e$. So $w_T(e)$, the largest weight on that path, is the largest weight on $C$ except $e$. By the last step $e$ is heavier than that, so $e$ is $T$-heavy. Here: $w_T(ce)$ is 5, and 7 is larger.
:::

::: step
We chose $e$ as an arbitrary edge outside $T$, so the same holds for each of them: every edge of $G \setminus T$ is $T$-heavy. Here: the other four, $bc$, $bd$, $eg$ and $gh$, have $w_T$ equal to 8, 8, 6 and 6, below their weights 11, 9, 12 and 10.
:::
::::

::: proof
If every non-tree edge is $T$-heavy, it is the heaviest edge of the cycle it closes with $T$, so by the strong cycle property ([[thm:strong-cut-cycle]]) no non-tree edge
is in $M$; as $M$ has $n - 1$ edges, $M = T$. Conversely, if $T = M$, every non-tree edge $e$ is not in $M$, so it is the heaviest edge on some cycle; it is in particular
heavier than all edges of the cycle in $T + e$ (by the proof of [[thm:strong-cut-cycle]]), i.e. $T$-heavy.
:::
