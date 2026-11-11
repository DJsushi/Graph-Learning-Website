---
title: "The Havel–Hakimi theorem"
course: theory
chapter: degrees
order: 3
lectures: [t01]
stage: split
status: draft
---

The following theorem reduces the question for a sequence of $n$ numbers to the same question for
a sequence of $n - 1$ numbers. Applying it repeatedly gives an efficient algorithm.

::: theorem {#thm:havel-hakimi title="Havel–Hakimi" source="theory/2026-09-15 p7; theory/2026-09-22 p1–2"}
Let $(d_1, d_2, \dots, d_n)$ be a non-increasing sequence of non-negative integers with
$d_1 \le n - 1$. Then there exists a graph with degree sequence $(d_1, \dots, d_n)$ if and only if
$$\varphi_1 = \bigl(d_2 - 1,\ d_3 - 1,\ \dots,\ d_{d_1 + 1} - 1,\ d_{d_1 + 2},\ \dots,\ d_n\bigr)$$
is a degree sequence of a graph.
:::

In words: remove the largest entry $d_1$ and subtract $1$ from the next $d_1$ entries. The new
sequence $\varphi_1$ need not be non-increasing; that does not matter, because whether a sequence
is graphic does not depend on the order of its entries (simply rename the vertices). Before the
next step we sort it again.

::: intuition
The vertex with the largest demand $d_1$ should take its neighbours among the vertices with the
largest remaining demands, because those are the hardest to satisfy later. The theorem says that
this greedy choice never hurts: if the sequence has any realisation, it has one in which $v_1$ is
adjacent exactly to $v_2, \dots, v_{d_1+1}$. Examples: $(3, 3, 2, 2, 2) \to (2, 1, 1, 2)$, which is
graphic, so $(3, 3, 2, 2, 2)$ is graphic too; $(3, 3, 1, 1) \to (2, 0, 0)$, which is not graphic,
so neither is $(3, 3, 1, 1)$.
:::

::: remark
The lecture states the theorem without the hypothesis $d_1 \le n - 1$. It is needed for
$\varphi_1$ to make sense: there must be $d_1$ entries after $d_1$ to decrease. It costs nothing,
since a sequence with $d_1 > n - 1$ is never graphic (a vertex has at most $n - 1$ neighbours);
[[alg:havel-hakimi|the Havel–Hakimi test]] rejects such sequences in its line `@too-big`.
:::

```graph id=t01-havel-hakimi-idea widget=figure
caption: The idea of the theorem: the vertex $v_1$ of the largest degree $d_1$ is joined to the $d_1$ vertices of the next largest degrees.
intent: Transcription of the lecture sketch. Show v1 joined to v2..v_{d1+1} and not to the rest; removing v1 lowers exactly those degrees by one.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_{d_1+1}$"] @(0.6, 1.3)
v5 [label="$v_{d_1+2}$" class=muted] @(1.6, 1.3); v6 [label="$v_n$" class=muted] @(2.6, 1.3)
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]
```

The proof has two directions. Direction ($\Leftarrow$) is a direct **construction**. Direction ($\Rightarrow$) is an **extremal argument**: we choose the best realisation by two rules, and an **exchange** of two names or two edges shows that the best one already has the shape we need.

Direction ($\Leftarrow$): from a graph for $\varphi_1$ we build a graph for $\varphi$.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-back widget=stepper
caption: Direction $\Leftarrow$ for the sequence $(3, 2, 2, 2, 2, 1)$: a graph $H$ with degree sequence $\varphi_1 = (1, 1, 1, 2, 1)$ gets a new vertex $v_1$.
intent: New example; the lecture (theory/2026-09-22 p1) only says "add a new vertex of degree d1 adjacent to the degrees d2-1, ..., d_{d1+1}-1". Positions from t01-havel-hakimi-idea. Adding v1 raises exactly the degrees of v2, v3, v4 by one and leaves v5, v6 alone.
layout: fixed
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v2 -- v3; v4 -- v5; v5 -- v6
mark H: v2 v3 v4 v5 v6 v2--v3 v4--v5 v5--v6
step: $H$ has degree sequence $\varphi_1$.
step: Add $v_1$, joined to $v_2$, $v_3$, $v_4$.
v1 [label="$v_1$" class=current] @(0, 0)
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]
mark new: v1--v2 v1--v3 v1--v4
step: $v_2$, $v_3$, $v_4$ each gain one edge.
class highlight: v2 v3 v4
step: $v_5$ and $v_6$ keep their degrees.
unclass highlight: v2 v3 v4
class highlight: v5 v6
```

::: step
We assume that some graph [[fig:t01-havel-hakimi-back#H|$H$]] has degree sequence $\varphi_1$. We name its vertices $v_2$ up to $v_n$ after their entries. Here the sequence is (3, 2, 2, 2, 2, 1), $d_1$ is 3, and $\varphi_1$ is (1, 1, 1, 2, 1). So $v_2$, $v_3$, $v_4$ have degree 1, $v_5$ has 2, $v_6$ has 1.
:::

::: step
We add a new vertex $v_1$ and join it to [[fig:t01-havel-hakimi-back#new|$v_2$ up to $v_{d_1+1}$]]. These $d_1$ vertices exist because $d_1 \le n - 1$: here we use that hypothesis. The new edges go to different old vertices and none is a loop, so the graph stays simple. The vertex $v_1$ has degree $d_1$. Here: 3.
:::

::: step
Each of $v_2$ up to $v_{d_1+1}$ gets exactly one new edge, the one to $v_1$. So its degree grows from $d_i - 1$ to $d_i$. Here $v_2$, $v_3$, $v_4$ go from 1 to 2, their entries in the sequence.
:::

::: step
The vertices $v_{d_1+2}$ up to $v_n$ get no new edge, so they keep degree $d_i$. Here $v_5$ keeps 2 and $v_6$ keeps 1. Now every $v_i$ has degree $d_i$. So the new graph is a simple graph with degree sequence $(d_1, \dots, d_n)$. Here: (3, 2, 2, 2, 2, 1).
:::
::::

Direction ($\Rightarrow$), the set-up: which realisation we choose, and why we may choose it.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-choice widget=stepper
caption: A realisation $G$ of $(3, 2, 2, 2, 2, 1)$ in which $v_1$ has the wrong neighbours, and the two numbers that the rules of the proof look at.
intent: New example; the layout follows the lecture sketch (theory/2026-09-22 p2: v1 at the bottom, v2 ... v_n in a row) and t01-havel-hakimi-idea. Colour 1 is the set v2..v4 that should be the neighbours of v1, colour 2 the rest v5, v6. The same graph is the start of the three case figures below.
layout: fixed
v1 [label="$v_1$"] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v1 -- v2; v1 -- v5; v1 -- v6; v2 -- v3; v3 -- v4; v4 -- v5
mark G: v1 v2 v3 v4 v5 v6 v1--v2 v1--v5 v1--v6 v2--v3 v3--v4 v4--v5
step: A graph $G$ with degree sequence $(3, 2, 2, 2, 2, 1)$.
step: The neighbours of $v_1$ should be $v_2$, $v_3$, $v_4$; they are $v_2$, $v_5$, $v_6$.
class color1: v2 v3 v4
class highlight: v1--v2 v1--v5 v1--v6
mark N: v2 v5 v6
mark front: v2 v3 v4
step: A pair: the graph and a numbering, which fixes $v_1$.
class current: v1
step: Rule 1: the degrees of the neighbours of $v_1$ add up to 5.
class highlight: v2 v5 v6
step: Rule 2: $v_1$ has 2 neighbours among $v_5$, $v_6$.
unclass highlight: v2 v5 v6 v1--v2
class color2: v5 v6
mark back: v5 v6
```

::: step
Now let [[fig:t01-havel-hakimi-choice#G|$G$]] be a graph with degree sequence $\varphi$, its vertices numbered so that $v_i$ has degree $d_i$. We want a graph $H$ with degree sequence $\varphi_1$. Here $G$ has 6 vertices and 6 edges, and its sequence is (3, 2, 2, 2, 2, 1).
:::

::: step
Deleting a vertex lowers the degree of each of its neighbours by one. So it would be enough that the neighbours of $v_1$ are $v_2$ up to $v_{d_1+1}$: these must drop by one, the rest must stay. In this $G$ that fails. [[fig:t01-havel-hakimi-choice#N|The neighbours of $v_1$]] are $v_2$, $v_5$, $v_6$, not [[fig:t01-havel-hakimi-choice#front|$v_2$, $v_3$, $v_4$]].
:::

::: step
Not every realisation has this shape, so we choose a good one. We look at all pairs of a graph and a numbering in which $v_i$ has degree $d_i$. The numbering decides which vertex is $v_1$. At least one pair exists, because $\varphi$ is a degree sequence. There are finitely many graphs on $n$ vertices, each with finitely many numberings.
:::

::: step
Rule 1: among all pairs we keep those in which the degrees of the neighbours of $v_1$ have the largest sum. There are finitely many sums, so a largest one exists. Here the sum is 2 + 2 + 1, which is 5, from [[fig:t01-havel-hakimi-choice#N|$v_2$, $v_5$, $v_6$]].
:::

::: step
Rule 2: among those we take one in which $v_1$ has the fewest neighbours in [[fig:t01-havel-hakimi-choice#back|$v_{d_1+2}$ up to $v_n$]]. Here that number is 2. We show that for this chosen pair, the neighbours of $v_1$ are exactly $v_2$ up to $v_{d_1+1}$. Our $G$ is only an example: we will see that it is not the chosen pair.
:::
::::

Case (a): $v_1$ already has the right neighbours.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-case-a widget=stepper
caption: Case (a) for $(3, 2, 2, 2, 2, 1)$: the neighbours of $v_1$ are $v_2$, $v_3$, $v_4$, and $G - v_1$ has degree sequence $(1, 1, 1, 2, 1)$.
intent: New example in the layout of t01-havel-hakimi-choice. It is the graph that the exchange and the renaming of the case figures below reach.
layout: fixed
v1 [label="$v_1$"] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v1 -- v2; v1 -- v3; v1 -- v4; v2 -- v3; v4 -- v5; v5 -- v6
step: The neighbours of $v_1$ are $v_2$, $v_3$, $v_4$.
class current: v1
class highlight: v1--v2 v1--v3 v1--v4
mark N: v2 v3 v4
step: $G - v_1$ has degree sequence $(1, 1, 1, 2, 1)$.
remove v1
class highlight: v2 v3 v4
mark H: v2 v3 v4 v5 v6 v2--v3 v4--v5 v5--v6
```

::: step
Case (a): the neighbours of $v_1$ are exactly $v_2$ up to $v_{d_1+1}$. This is the shape we wanted. Here we show another graph with the same sequence (3, 2, 2, 2, 2, 1), in which [[fig:t01-havel-hakimi-case-a#N|the neighbours of $v_1$]] are $v_2$, $v_3$, $v_4$.
:::

::: step
We delete $v_1$ and its $d_1$ edges. Each of $v_2$ up to $v_{d_1+1}$ loses exactly one edge, so its degree drops from $d_i$ to $d_i - 1$. All other vertices keep $d_i$. So [[fig:t01-havel-hakimi-case-a#H|$H$]], which is $G - v_1$, has degree sequence $\varphi_1$. Here: (1, 1, 1, 2, 1).
:::
::::

Case (b), the set-up: $v_1$ has a wrong neighbour $v_j$ and misses a right one, $v_i$.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-case-b widget=stepper
caption: Case (b) on the graph $G$ from above: $v_1$ is adjacent to $v_6$ but not to $v_3$, and $v_3$ has at least the degree of $v_6$.
intent: New example, the graph of t01-havel-hakimi-choice; the lecture sketch of case (b) (theory/2026-09-22 p2) shows the same situation with abstract v_i and v_j.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v1 -- v2; v1 -- v5; v1 -- v6; v2 -- v3; v3 -- v4; v4 -- v5
step: $v_1$ has the neighbour $v_6$ outside $v_2$, $v_3$, $v_4$.
class color1: v2 v3 v4
class highlight: v6 v1--v6
mark j: v6
step: $v_3$ is not a neighbour of $v_1$.
class highlight: v3
mark i: v3
step: $v_3$ has 2 edges, $v_6$ has 1.
class bold: v2--v3 v3--v4 v1--v6
mark deg: v2--v3 v3--v4 v1--v6
```

::: step
Case (b): the neighbours of $v_1$ are not exactly $v_2$ up to $v_{d_1+1}$. These are $d_1$ vertices, and $v_1$ has $d_1$ neighbours. If all neighbours were among them, they would be all of them: case (a). So $v_1$ has a neighbour $v_j$ with $j \ge d_1 + 2$. Here [[fig:t01-havel-hakimi-case-b#j|$v_j$]] is $v_6$.
:::

::: step
The neighbour $v_j$ uses up one of the $d_1$ neighbours of $v_1$. So at most $d_1 - 1$ of $v_2$ up to $v_{d_1+1}$ are neighbours of $v_1$, and at least one is not. We call it $v_i$, with $i \le d_1 + 1$. Here only $v_2$ is a neighbour, and we take [[fig:t01-havel-hakimi-case-b#i|$v_i$]] to be $v_3$.
:::

::: step
The index $i$ is at most $d_1 + 1$ and $j$ is at least $d_1 + 2$, so $v_i$ comes before $v_j$. The sequence is non-increasing, so $d_i \ge d_j$: here we use that hypothesis. So in $G$, $v_i$ has at least the degree of $v_j$. Here [[fig:t01-havel-hakimi-case-b#deg|their edges]]: 2 against 1. Two cases remain: equal or greater.
:::
::::

The first case of (b): equal degrees. Renaming two vertices contradicts rule 2.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-rename widget=stepper
caption: Equal degrees: swapping the names of $v_4$ and $v_5$ keeps every degree right and leaves $v_1$ with one neighbour fewer among $v_5$, $v_6$.
intent: New example, the graph of t01-havel-hakimi-choice with the pair v_i = v4, v_j = v5 (both of degree 2). The vertex ids stay; only the labels swap.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v1 -- v2; v1 -- v5; v1 -- v6; v2 -- v3; v3 -- v4; v4 -- v5
step: $v_4$ is not a neighbour of $v_1$, $v_5$ is; both have degree 2.
class highlight: v4 v5 v1--v5
mark i: v4
mark j: v5
step: Swap the names $v_4$ and $v_5$.
set v4 [label="$v_5$"]
set v5 [label="$v_4$"]
step: Now $v_1$ has one neighbour among $v_5$, $v_6$, not two.
unclass highlight: v4 v5 v1--v5
class color2: v4 v6
class highlight: v1--v6
mark back: v4 v6
```

::: step
First case: $v_i$ and $v_j$ have the same degree. The pair $v_3$, $v_6$ is not of this kind, so here we take another pair of case (b). [[fig:t01-havel-hakimi-rename#i|$v_i$]] is $v_4$, not a neighbour of $v_1$, and [[fig:t01-havel-hakimi-rename#j|$v_j$]] is $v_5$, a neighbour. Both have degree 2.
:::

::: step
We swap the two names. The graph stays the same, and every vertex still has the degree its name asks for, because the two degrees are equal. So this is again one of our pairs. The vertex $v_1$ keeps its neighbours, so their degree sum is unchanged (here 5). So it is still the largest for the chosen pair.
:::

::: step
But the old $v_j$, a neighbour of $v_1$, now has index $i$, which is at most $d_1 + 1$. The old $v_i$, now at index $j$, is not a neighbour. So $v_1$ has one neighbour fewer in [[fig:t01-havel-hakimi-rename#back|$v_{d_1+2}$ up to $v_n$]]. Here: 1 instead of 2. Rule 2 chose the fewest, so the chosen pair is not in this case.
:::
::::

The second case of (b): $v_i$ has the larger degree. Exchanging two edges contradicts rule 1.

:::: walkthrough {for=thm:havel-hakimi}
```graph id=t01-havel-hakimi-greater widget=stepper
caption: Larger degree: with $v_i = v_3$, $v_j = v_6$ and $v_k = v_4$, the exchange of two edges keeps every degree and raises the degree sum of the neighbours of $v_1$ from 5 to 6.
intent: New example, the graph of t01-havel-hakimi-choice; the lecture sketch (theory/2026-09-22 p2, the red and green edges) and t01-havel-hakimi-switch show the same exchange with abstract vertices. The last step swaps the labels of v4 and v5 as in the equal case and reaches the graph of t01-havel-hakimi-case-a.
layout: fixed
v1 [label="$v_1$" class=current] @(0, 0)
v2 [label="$v_2$"] @(-1, 1.3); v3 [label="$v_3$"] @(-0.3, 1.3); v4 [label="$v_4$"] @(0.6, 1.3)
v5 [label="$v_5$"] @(1.6, 1.3); v6 [label="$v_6$"] @(2.6, 1.3)
v1 -- v2; v1 -- v5; v1 -- v6; v2 -- v3; v3 -- v4; v4 -- v5
step: $v_3$ has degree 2, $v_6$ has degree 1.
class highlight: v3 v6
mark i: v3
mark j: v6
step: $v_3$ has the neighbours $v_2$ and $v_4$, neither of them $v_6$.
class bold: v2--v3 v3--v4
mark Ni: v2 v4
step: $v_6$ has no neighbour besides $v_1$, so $v_4$ will do.
class color3: v4
mark k: v4
step: Out: $v_1 v_6$ and $v_3 v_4$. In: $v_1 v_3$ and $v_4 v_6$.
remove v1--v6 v3--v4
unclass bold: v2--v3
v1 -- v3 [class=highlight]; v4 -- v6 [class=highlight bend=0.4]
mark switch: v1--v3 v4--v6
step: $v_1$, $v_3$, $v_4$, $v_6$ each lost one edge and gained one.
unclass highlight: v3 v6
unclass color3: v4
class highlight: v1 v3 v4 v6
step: The neighbours $v_2$, $v_3$, $v_5$ of $v_1$ have degree sum 6.
unclass highlight: v1 v3 v4 v6 v1--v3 v4--v6
class highlight: v2 v3 v5 v1--v2 v1--v3 v1--v5
mark N: v2 v3 v5
step: Swapping the names $v_4$ and $v_5$ reaches case (a).
set v4 [label="$v_5$"]
set v5 [label="$v_4$"]
unclass highlight: v2 v3 v5
mark N2: v2 v3 v5
```

::: step
Second case: $v_i$ has a larger degree than $v_j$. Here [[fig:t01-havel-hakimi-greater#i|$v_i$]] is $v_3$ with degree 2, and [[fig:t01-havel-hakimi-greater#j|$v_j$]] is $v_6$ with degree 1. We look for a vertex $v_k$ that is adjacent to $v_i$ but not to $v_j$.
:::

::: step
Degrees are integers, so the degree of $v_i$ is at least the degree of $v_j$ plus 1. One neighbour of $v_i$ may be $v_j$. Without it, $v_i$ still has at least as many neighbours as the degree of $v_j$. None of them is $v_1$, since $v_1$ and $v_i$ are not adjacent. Here: [[fig:t01-havel-hakimi-greater#Ni|$v_2$ and $v_4$]], 2 against 1.
:::

::: step
The vertex $v_j$ is adjacent to $v_1$, so it has at most its degree minus 1 other neighbours. The neighbours of $v_i$ from step 2 are more than that, and none of them is $v_1$. So one of them, [[fig:t01-havel-hakimi-greater#k|$v_k$]], is not adjacent to $v_j$. Here $v_6$ has no neighbour besides $v_1$, and we take $v_4$.
:::

::: step
We build $G'$. We delete the edges from $v_1$ to $v_j$ and from $v_i$ to $v_k$, and add [[fig:t01-havel-hakimi-greater#switch|the edges]] from $v_1$ to $v_i$ and from $v_j$ to $v_k$. Both added pairs were non-edges: $v_1$ and $v_i$ by the choice of $i$, $v_j$ and $v_k$ by the choice of $k$. So $G'$ is simple.
:::

::: step
The four vertices $v_1$, $v_i$, $v_j$, $v_k$ are different, and each loses one incident edge and gains one. All other vertices are untouched. So every vertex keeps its degree, and $G'$ with the same numbering is again one of our pairs. Here the sequence is still (3, 2, 2, 2, 2, 1).
:::

::: step
In $G'$ the neighbour $v_j$ of $v_1$ is replaced by $v_i$. So the degree sum of the neighbours of $v_1$ grows by $d_i - d_j$, which is positive. Here: from 5 to 6, with [[fig:t01-havel-hakimi-greater#N|$v_2$, $v_3$, $v_5$]]. Rule 1 chose the largest sum, so the chosen pair is not in this case either.
:::

::: step
Both cases contradict the choice, so the chosen pair is in case (a), and deleting $v_1$ gives $H$. Our example was not the chosen pair: $G'$ is still in case (b), with $v_4$ and $v_5$ of equal degree. Swapping their names, as in the first case, reaches case (a): [[fig:t01-havel-hakimi-greater#N2|the neighbours]] are now $v_2$, $v_3$, $v_4$.
:::
::::

:::: proof
**($\Leftarrow$)** This direction is easy. Let $H$ be a graph with degree sequence $\varphi_1$, on
vertices $v_2, \dots, v_n$ where $v_i$ has degree $d_i - 1$ for $2 \le i \le d_1 + 1$ and degree
$d_i$ for $i \ge d_1 + 2$. Add a new vertex $v_1$ adjacent to exactly $v_2, \dots, v_{d_1+1}$. The
new vertex has degree $d_1$, the degree of each of $v_2, \dots, v_{d_1+1}$ grows by one to $d_i$,
and all other degrees stay $d_i$. The result is a simple graph with degree sequence
$(d_1, \dots, d_n)$.

**($\Rightarrow$)** We want: from a graph $G$ with degree sequence $\varphi = (d_1, \dots, d_n)$,
construct a graph $H$ with degree sequence $\varphi_1$. It would be enough to find a realisation
$G$ of $\varphi$ in which the vertex of degree $d_1$ is adjacent exactly to the vertices of the
degrees $d_2, \dots, d_{d_1+1}$; then deleting this vertex gives $H$. Not every realisation has
this property, so we choose a good one.

Consider all pairs consisting of a graph $G$ and a numbering $V(G) = \set{v_1, \dots, v_n}$ with
$d_G(v_i) = d_i$ for every $i$ (by assumption there is at least one). Among them choose one such
that

1. the sum of the degrees of the neighbours of $v_1$ is **maximum**, and, among those,
2. the number of neighbours of $v_1$ in the set $\set{v_{d_1+2}, \dots, v_n}$ is **minimum**.

There are only finitely many such pairs, so the choice is possible. We show that the neighbours
of $v_1$ are then exactly $v_2, \dots, v_{d_1+1}$.

**(a)** If the neighbours of $v_1$ are $\set{v_2, \dots, v_{d_1+1}}$, then $H = G - v_1$ has degree
sequence $\varphi_1$, and we are done.

**(b)** Otherwise, $v_1$ has a neighbour $v_j$ with $j \ge d_1 + 2$. Since $v_1$ has exactly $d_1$
neighbours and one of them lies outside $\set{v_2, \dots, v_{d_1+1}}$, at most $d_1 - 1$ of the
$d_1$ vertices $v_2, \dots, v_{d_1+1}$ are neighbours of $v_1$. So there is an index
$i \le d_1 + 1$ with $\set{v_1, v_i} \notin E(G)$. Because $i < j$ and the sequence is
non-increasing, $d_G(v_i) = d_i \ge d_j = d_G(v_j)$. There are two cases.

- **$d_G(v_i) = d_G(v_j)$.** Exchange the names of $v_i$ and $v_j$. The numbering still satisfies
  $d_G(v_k) = d_k$ for all $k$ (the two vertices have the same degree), the graph and hence the
  neighbour degree sum of $v_1$ are unchanged, but $v_1$ now has one neighbour fewer in
  $\set{v_{d_1+2}, \dots, v_n}$ (the old $v_j$ is now called $v_i$, with $i \le d_1 + 1$, and the
  old $v_i$, which now has index $j$, is not a neighbour of $v_1$). This contradicts the
  minimality in rule 2.

- **$d_G(v_i) > d_G(v_j)$.** We find a vertex $v_k$ with $\set{v_i, v_k} \in E(G)$ and
  $\set{v_j, v_k} \notin E(G)$. Indeed, $v_i$ has $d_G(v_i)$ neighbours, so at least
  $d_G(v_i) - 1 \ge d_G(v_j)$ neighbours other than $v_j$. The vertex $v_j$ has at most
  $d_G(v_j) - 1$ neighbours other than $v_1$ (one of its neighbours is $v_1$). So some neighbour
  $v_k \ne v_j$ of $v_i$ is not a neighbour of $v_j$ and is not $v_1$. (We also know
  $v_k \ne v_1$ directly, since $v_1$ and $v_i$ are not adjacent.) Now take the graph
  $$G' = \bigl(G - \set{v_1, v_j} - \set{v_i, v_k}\bigr) + \set{v_1, v_i} + \set{v_j, v_k}.$$
  The two added pairs were non-edges, so $G'$ is a simple graph. Each of $v_1, v_i, v_j, v_k$ loses
  one incident edge and gains one, so $G'$ has the same degree sequence $\varphi$, with the same
  numbering. But in $G'$ the neighbour $v_j$ of $v_1$ has been replaced by $v_i$, so the sum of
  the degrees of the neighbours of $v_1$ grew by $d_i - d_j > 0$. This contradicts the
  maximality in rule 1.

Both cases are impossible, so case (a) holds, and $G - v_1$ is a graph with degree sequence
$\varphi_1$.
::::

```graph id=t01-havel-hakimi-switch widget=stepper
caption: The exchange in case (b): replace $v_1v_j$ and $v_iv_k$ by $v_1v_i$ and $v_jv_k$. No degree changes, but $v_1$ gets a neighbour of larger degree.
intent: Illustrate the 2-switch from the proof. Degrees of all four vertices are preserved.
layout: fixed
v1 [label="$v_1$"] @(0, 0); vi [label="$v_i$"] @(1, 1.2); vj [label="$v_j$"] @(2.6, 1.2); vk [label="$v_k$"] @(1.8, 2.2)
x1 [class=muted label=""] @(0.4, 2.2); x2 [class=muted label=""] @(3.2, 2.2); x3 [class=muted label=""] @(0.2, 1.3)
v1 -- vj; vi -- vk; vi -- x1 [class=muted]; vi -- x3 [class=muted]; vj -- x2 [class=muted]
step: Situation in case (b): $v_1 v_j \in E$, $v_1 v_i \notin E$, $v_i v_k \in E$, $v_j v_k \notin E$.
class highlight: v1--vj vi--vk
step: Remove the edges $v_1 v_j$ and $v_i v_k$.
remove v1--vj vi--vk
step: Add the edges $v_1 v_i$ and $v_j v_k$. Every one of the four vertices kept its degree.
v1 -- vi [class=highlight]; vj -- vk [class=highlight]
```

::: remark
This exchange of two edges for two others, keeping all degrees, is called a **2-switch**. One can
show that any two realisations of the same degree sequence can be transformed into each other by
a sequence of 2-switches.
:::
