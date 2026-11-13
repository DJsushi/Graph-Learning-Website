---
title: "Uncrossing cuts"
course: algorithms
chapter: gomory-hu
order: 5
lectures: [a03]
stage: split
status: reviewed
---

### Correctness

The key fact is that minimum cuts do not cross each other in a harmful way. It rests on an inequality between cut capacities, which the lecture proves
"by picture".

::: lemma {#lem:cut-submodular title="Uncrossing cuts" aka="submodularity of cuts" source="algorithms/03 p17"}
For all $X, Y \subseteq V$:
$$c(\delta(X \cup Y)) + c(\delta(X \cap Y)) \le c(\delta(X)) + c(\delta(Y)),$$
$$c(\delta(X \setminus Y)) + c(\delta(Y \setminus X)) \le c(\delta(X)) + c(\delta(Y)).$$
:::

Part 1 of the proof, the first inequality, is a double count: we count every edge on both sides and compare, edge by edge.

:::: walkthrough {for=lem:cut-submodular}
```graph id=a03-uc-count widget=stepper
caption: The network of a03-uncrossing with one extra vertex $s$, and $X = \set{p, q}$, $Y = \set{q, r}$: the thick edge in each step is the kind of edge being counted.
intent: From the lecture (algorithms/03 p17 only says "proof by picture"); the graph is the figure a03-uncrossing with a new vertex s and edge os, so that one edge lies inside a region. The cuts of X, Y, the union and the intersection are those of a03-uncrossing, since os crosses none of them.
layout: fixed
p @(0, 0); q @(1.2, 0); r @(2.4, 0); o @(1.2, -1.4); s @(2.4, -1.4)
p -- q; q -- r; p -- r [bend=0.5]; p -- o; q -- o; r -- o; o -- s
mark both: q
mark onlyX: p
mark onlyY: r
mark out: o s
mark inside: o--s
mark twice: q--o
mark diagonal: p--r
mark once: p--q q--r p--o r--o
step: Four regions: each vertex in exactly one.
class color1: q
class color2: p
class color3: r
class color4: o s
step: An edge inside one region is counted nowhere.
class bold: o--s
step: An edge between the common and the outside region is counted twice on each side.
unclass bold: o--s
class bold: q--o
step: A diagonal edge is counted twice on the right, never on the left.
unclass bold: q--o
class bold: p--r
step: Every other edge is counted once on each side.
unclass bold: p--r
class bold: p--q q--r p--o r--o
step: Edge by edge left is at most right, so the sums compare.
unclass bold: p--q q--r p--o r--o
class bold: p--r
```

::: step
We ask two questions of every vertex: is it in $X$, is it in $Y$? The answers put it in one of four regions: the common region $X \cap Y$, $X \setminus Y$, the part of $Y$ outside $X$, and the outside region. Here: [[fig:a03-uc-count#both|$q$]] is common, [[fig:a03-uc-count#onlyX|$p$]] is in $X$ only, [[fig:a03-uc-count#onlyY|$r$]] in $Y$ only, [[fig:a03-uc-count#out|$o$ and $s$]] outside.
:::

::: step
Count an edge $e$ once for each cut that contains it: the cuts of the union $X \cup Y$ and the intersection on the left, of $X$ and $Y$ on the right. If both ends lie in one region, each of the four sets contains both ends or neither, so $e$ is counted nowhere. Here: [[fig:a03-uc-count#inside|$os$]] is such an edge.
:::

::: step
Let $e$ join the common region to the outside region. One end lies in $X$ and in $Y$, the other in neither, so all four sets separate the ends. Then $e$ is counted twice on the left (union, intersection) and twice on the right ($X$, $Y$). Here: [[fig:a03-uc-count#twice|$qo$]] is counted 2 against 2.
:::

::: step
Let $e$ join the region of $X$ only to the region of $Y$ only. Both $X$ and $Y$ separate the ends: twice on the right. Both ends lie in the union and neither in the intersection, so neither separates them: zero on the left. Here: [[fig:a03-uc-count#diagonal|$pr$]] is counted 0 against 2.
:::

::: step
Every other edge joins two regions that differ in one question only, say $X$. Then $X$ separates the ends and $Y$ does not: once on the right. On the left, if both ends lie in $Y$, only the intersection separates them; if both lie outside $Y$, only the union does. Once again. Here: [[fig:a03-uc-count#once|$pq$, $qr$, $po$, $ro$]]: 1 against 1.
:::

::: step
By [[def:undirected-cut|cut capacity]], each side sums $c(e)$ times the count of $e$. The counts give left at most right on every edge (0:0, 2:2, 1:1, 0:2). Capacities are positive, so the left sum is at most the right sum. The gap is twice the capacity of edges between $X \setminus Y$ and $Y \setminus X$. Here: 6 against 8.
:::
::::

Part 2 of the proof, the second inequality, is a reduction: we replace $Y$ by its complement and rewrite three of the four cuts of the first inequality.

:::: walkthrough {for=lem:cut-submodular}
```graph id=a03-uc-reduce widget=stepper
caption: The graph of the previous figure, with $X = \set{p, q}$ and $Y = \set{q, r}$: in each step the filled vertices form the set under discussion and the thick edges are its cut.
intent: New (the lecture only says "proof by picture"); same graph and vertex names as a03-uc-count, to show which sets and cuts appear when the first inequality is applied to X and V minus Y.
layout: fixed
p @(0, 0); q @(1.2, 0); r @(2.4, 0); o @(1.2, -1.4); s @(2.4, -1.4)
p -- q; q -- r; p -- r [bend=0.5]; p -- o; q -- o; r -- o; o -- s
mark X: p q
mark Yc: p o s
mark inter: p
mark union: p q o s
mark r: r
step: Apply the first inequality to $X$ and $V \setminus Y$.
class color1: p q
class color2: p o s
step: The cut of $V \setminus Y$ is the cut of $Y$.
class bold: p--q p--r q--o r--o
step: The intersection is $X \setminus Y$.
unclass color1: q
unclass color2: o s
unclass bold: p--q p--r q--o r--o
class bold: p--q p--r p--o
step: The union is $V \setminus (Y \setminus X)$, whose cut is that of $Y \setminus X$.
unclass color1: p
unclass color2: p
unclass bold: p--q p--r p--o
class color3: p q o s
class bold: q--r p--r r--o
step: Substituting gives the second inequality.
unclass color3: p q o s
unclass bold: q--r p--r r--o
class color4: p
class color5: r
class bold: p--q p--r p--o q--r r--o
```

::: step
The first inequality holds for all subsets of $V$, so we may apply it to $X$ and [[fig:a03-uc-reduce#Yc|the complement of $Y$]]. The cut of $X$ stays as it is. We rewrite the other three one at a time, starting on the right. Here: $Y = \set{q, r}$, so $V \setminus Y = \set{p, o, s}$.
:::

::: step
The right side contains the cut of $V \setminus Y$. By [[def:undirected-cut|the definition of a cut]], $\delta(V \setminus Y) = \delta(Y)$: a cut does not depend on which side we name. So this term is the cut capacity of $Y$. Here: both cuts are $\set{pq, pr, qo, ro}$, of capacity 4.
:::

::: step
A vertex lies in $X$ and in the complement of $Y$ exactly when it lies in $X$ and not in $Y$. So $X \cap (V \setminus Y) = X \setminus Y$, and the second left term is the cut capacity of $X \setminus Y$. Here: only [[fig:a03-uc-reduce#inter|$p$]] is in $X$ and outside $Y$; its cut has capacity 3.
:::

::: step
The union of $X$ and the complement of $Y$ misses exactly the vertices in $Y$ but not in $X$, so it equals $V \setminus (Y \setminus X)$. A cut does not depend on the side we name, so its cut is $\delta(Y \setminus X)$. Here: the union misses only [[fig:a03-uc-reduce#r|$r$]], whose cut has capacity 3.
:::

::: step
The three rewrites turn the first inequality, applied to $X$ and $V \setminus Y$, into the second inequality: the cuts of $X \setminus Y$ and $Y \setminus X$ on the left, those of $X$ and $Y$ on the right. We used nothing about $X$ and $Y$ beyond the first inequality. Here: $3 + 3 \le 4 + 4$.
:::
::::

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
