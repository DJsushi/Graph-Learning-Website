---
title: "Uncrossing cuts"
course: algorithms
chapter: gomory-hu
order: 5
lectures: [a03]
stage: split
status: draft
---

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
