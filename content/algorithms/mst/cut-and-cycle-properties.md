---
title: "The cut and cycle properties"
course: algorithms
chapter: mst
order: 3
lectures: [a01]
stage: split
status: draft
---

We use two facts about cuts many times:

- every [[def:cycle-graph|cycle]] crosses every cut an **even** number of times (walking around the cycle, every crossing switches the side,
  and we end on the side where we started);
- for a [[def:spanning-tree|spanning tree]] $T$ and an edge $e \in E(T)$, the graph $T - e$ is disconnected, as trees are minimally
  connected ([[thm:tree-characterisations]]), and it is a forest with $n - 2$ edges, so it has exactly two
  [[def:component|components]] ([[cor:forest-edges]]). They form a cut, and $e$ is the only edge of $T$ across it.

Also, for a spanning tree $T$ and an edge $e \notin E(T)$, $T + e$ contains exactly one cycle: the unique $T$-path between the ends
of $e$ ([[cor:tree-unique-path]]), plus $e$. For every edge $f$ of this cycle, $T + e - f$ is again a spanning tree: it is connected,
since $f$ lies on a cycle, and has $n - 1$ edges ([[thm:tree-characterisations]], 5). This **exchange** of $f$ for $e$
([[fig:t03-tree-plus-edge]]) is the basic move of all proofs below.

::: theorem {#thm:cut-property title="Cut property" source="algorithms/01 p5"}
If $e$ is the lightest edge across some cut of $G$, then $e \in M$ for every [[def:mst|minimum spanning tree]] $M$.
:::

::: theorem {#thm:cycle-property title="Cycle property" source="algorithms/01 p5"}
If $e$ is the heaviest edge on some cycle of $G$, then $e \notin M$ for every minimum spanning tree $M$.
:::

Here "the lightest" and "the heaviest" mean strictly lighter (heavier) than all other edges in question.

::: intuition {for=thm:cut-property}
Every spanning tree has to cross the cut somewhere. If an MST crossed it only with heavier edges, we could swap one of them for
the lightest crossing edge $e$ and save weight. Example: in [[fig:a01-cut-property]], $cf$ (weight $1$) beats $bd$ ($9$) and $ce$ ($7$).
Taking the cut $(\set{v}, V \setminus \set{v})$ shows that the lightest edge at any vertex $v$ is in the MST: in the running example,
$ab$ ($4$) is lighter than $ac$ ($8$), so $ab \in M$. This is the idea of Borůvka's algorithm below.
:::

::: intuition {for=thm:cycle-property}
A cycle offers two routes between the ends of each of its edges. If the MST used the heaviest edge $e$ of a cycle, the rest of the
cycle would provide a lighter edge to reconnect the two halves of $M - e$. Example: in [[fig:a01-cycle-property]], $bc$ (weight $11$)
is the heaviest edge of the cycle $b\,d\,e\,c$, so $bc \notin M$. Consequence: the strictly heaviest edge of the whole graph is in no MST,
unless it lies on no cycle at all, i.e. it is a [[def:cut-vertex-bridge|bridge]] (then every spanning tree contains it).
:::

::: pitfall
Strictness matters. In a triangle with all weights $1$, every edge is a lightest edge at each of its ends, yet every MST omits
one of the three edges. Also, the cut property is about **one** cut: an MST edge need not be the lightest across every cut it
crosses. In the running example $ac \in M$, but across the cut $(\set{a}, V \setminus \set{a})$ the edge $ab$ is lighter.
:::

::: proof {title="Proof of the cut property" for=thm:cut-property}
Let $e = uv$ be the strictly lightest edge across the cut $(S, V \setminus S)$ and suppose $e \notin M$. Then $M + e$ contains a cycle $C$
through $e$ ([[thm:tree-characterisations]]: trees are maximally acyclic). Since $C$ crosses the cut at $e$, it crosses it at least once more, at an edge $f \ne e$, $f \in E(M)$. As $e$ is the lightest
crossing edge, $w(f) > w(e)$. Then $M + e - f$ is a spanning tree of weight $w(M) + w(e) - w(f) < w(M)$, a contradiction.
:::

::: proof {title="Proof of the cycle property" for=thm:cycle-property}
Let $e$ be the strictly heaviest edge on a cycle $C$ and suppose $e \in M$. The two components of $M - e$ (see the facts above) form a cut, and $e$ is the only edge
of $M$ across it. The path $C - e$ joins the two ends of $e$, so it crosses this cut at some edge $f \ne e$; then $f \notin E(M)$. As $e$ is the
heaviest edge of $C$, $w(f) < w(e)$, and $M - e + f$ is a spanning tree of smaller weight, a contradiction.
:::

```graph id=a01-cut-property widget=figure
caption: The cut property. The edge $cf$ (weight 1) is the lightest edge across the cut $(S, V \setminus S)$, so it belongs to the MST.
intent: Show a cut as two groups and the crossing edges; the lightest crossing edge highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9 class=cut]; c -- e [w=7 class=cut]; c -- f [w=1 class="cut highlight"]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
group S: a b c [label="$S$"]
```

```graph id=a01-cycle-property widget=figure
caption: The cycle property. The edge $bc$ (weight 11) is the heaviest edge of the cycle $b\,d\,e\,c$, so it is in no MST.
intent: Show a cycle in the running example; its heaviest edge highlighted.
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11 class="cycle highlight"]; b -- d [w=9 class=cycle]; c -- e [w=7 class=cycle]; c -- f [w=1]
d -- e [w=2 class=cycle]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```
