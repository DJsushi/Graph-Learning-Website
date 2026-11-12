---
title: "Reduced weights"
course: algorithms
chapter: arborescences
order: 2
lectures: [a01]
stage: split
status: draft
---

::: proposition {#prop:arborescence-sufficient title="Sufficient condition" source="algorithms/01 p51"}
For each $v \in V \setminus \set{r}$ choose the lightest edge $e_v$ with head $v$, and let $F^* = \set{e_v \mid v \in V \setminus \set{r}}$. If $T^* = (V, F^*)$ is an arborescence,
then it is a min-cost arborescence.
:::

The lecture states this without proof.

::: intuition
Every vertex other than $r$ must pay for exactly one incoming arc, and it cannot pay less than its cheapest one. So the sum of the cheapest incoming
arcs is a lower bound on every arborescence, and if these arcs happen to form an arborescence, the bound is reached. Example: with arcs $r \to a$ ($1$),
$r \to b$ ($3$), $a \to b$ ($1$), the cheapest arcs entering $a$ and $b$ are $r \to a$ and $a \to b$, an arborescence of cost $2$. Non-example: in
[[fig:a01-arborescence-example]] the cheapest arcs entering $a$, $c$ and $d$ form the cycle $a \to d \to c \to a$.
:::

::: pitfall
Choose by **entering** arcs (heads), not leaving ones. Choosing for each vertex its cheapest outgoing arc, as Borůvka does for undirected edges, gives
no lower bound, because an arborescence may use several arcs leaving one vertex and none leaving another.
:::

Can we use this as an algorithm? The problem is that $T^*$ need not be an arborescence: it may contain **directed cycles** (in the example: $a \to d \to c \to a$).

::: definition {#def:reduced-weights title="Reduced weights" defines="reduced weight" source="algorithms/01 p52"}
The **reduced weight function** $w'$ for $D$ and $w$ is defined for each edge $e = (u, v) \in E$ as
$$w'(e) = w(e) - w(e_v),$$
where $e_v$ is the lightest edge with head $v$.
:::

::: intuition
Every vertex $v \ne r$ has to pay $w(e_v)$ anyway; the reduced weight of an arc into $v$ is the **extra** price of entering $v$ by this arc instead of the
cheapest one. Example: in [[fig:a01-reduced-weights]], the arcs entering $c$ are $r \to c$ ($5$) and $d \to c$ ($4$), so their reduced weights are $1$
and $0$.
:::

```graph id=a01-reduced-weights widget=figure
caption: Original weights (left) and reduced weights (right). The lightest arcs entering each vertex get reduced weight 0; they form the directed cycle $a \to d \to c \to a$ plus the arcs $(a, b)$ and $(d, e)$.
intent: Transcription of the lecture slide on reduced weights.
type: directed
layout: fixed
layout-sync: true
panel: $w$
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=2]; a -> b [w=6 class=highlight]; r -> c [w=5]; c -> a [w=1 class=highlight]; a -> d [w=3 class=highlight]
a -> e [w=8]; b -> e [w=9]; d -> c [w=4 class=highlight]; d -> e [w=7 class=highlight]
panel: $w'$
r [class=source] @(0, 1); a @(1, 1); b @(2, 1); c @(0, 0); d @(1, 0); e @(2, 0)
r -> a [w=1]; a -> b [w=0 class=highlight]; r -> c [w=1]; c -> a [w=0 class=highlight]; a -> d [w=0 class=highlight]
a -> e [w=1]; b -> e [w=2]; d -> c [w=0 class=highlight]; d -> e [w=0 class=highlight]
```

::: observation {#obs:reduced-weights title="Properties of reduced weights" source="algorithms/01 p52"}
1. $T$ is a min-cost arborescence in $D$ with weights $w$ iff it is a min-cost arborescence with weights $w'$.
2. All reduced weights are non-negative, and the arcs $e_v$ have reduced weight $0$; in particular every directed cycle formed by such arcs has total reduced weight $0$, so it
   is a min-cost cycle.
:::

The lecture states this without proof.

::: intuition
Subtracting the same amount from all arcs entering $v$ changes the cost of every arborescence by that amount, since each arborescence uses exactly
one of these arcs. So all costs shift by the same constant and the optimum stays where it is. Example: in [[fig:a01-reduced-weights]] the constant is
$w(e_a) + w(e_b) + w(e_c) + w(e_d) + w(e_e) = 1 + 6 + 4 + 3 + 7 = 21$, and the optimal arborescence of cost $22$ has reduced cost $22 - 21 = 1$.
:::
