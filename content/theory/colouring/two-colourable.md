---
title: Two-colourable graphs
course: theory
chapter: colouring
order: 2
lectures: [t08]
goal: Show that a graph has chromatic number at most 2 exactly when it has no cycle of odd length.
needs: [theory/colouring/colourings, theory/bipartite/bipartite-graphs, theory/bipartite/odd-cycles]
stage: taught
status: reviewed
---

The lecture's graph needed three colours. Which graphs can we colour properly with only two
colours? Compare the two graphs below.

```graph id=t08-two-or-three widget=figure
caption: "two colours": a 6-cycle with the chord $ps$. Colour 1 on $p$, $r$, $t$ and colour 2 on $q$, $s$, $u$ is proper, and its three cycles have even length 4, 4 and 6. "the lecture's graph": the marked triangle $abc$ is a cycle of length 3, and it already needs three colours.
intent: "two colours" is new; the same graph and positions are used in both walkthroughs below. "the lecture's graph" is from the lecture (theory/2026-11-03 p1, right), with the vertex names and positions of t08-board-colouring.
layout: fixed
panel: two colours
p @(0, 0.65) [class=color1]; q @(0.75, 1.3) [class=color2]; r @(2.25, 1.3) [class=color1]; s @(3, 0.65) [class=color2]; t @(2.25, 0) [class=color1]; u @(0.75, 0) [class=color2]
p -- q; q -- r; r -- s; s -- t; t -- u; u -- p; p -- s
panel: the lecture's graph
a @(0.4, 1.6); b @(0, 0.95); c @(1.1, 1); d @(0, 0.1); e @(1.1, 0)
a -- b [class=cycle]; a -- c [class=cycle]; b -- c [class=cycle]; b -- d; c -- d; c -- e; d -- e
mark triangle: a b c a--b a--c b--c
```

In "the lecture's graph", [[fig:t08-two-or-three#triangle|the triangle]] is a cycle of odd
length 3. In "two colours" every cycle has even length, and two colours are enough.

The answer: two colours suffice exactly when the graph has no cycle of odd length. These are
exactly the bipartite graphs. Two colours give the two sides of a bipartition, and König's
theorem says when a bipartition exists.

## The proposition

::: proposition {#prop:two-colourable title="Graphs with chromatic number at most 2" aka="2-colourable iff no odd cycle" source="theory/2026-11-03 p2"}
$\chi(G) \le 2$ if and only if $G$ has no odd cycle.
:::

::: intuition
Two colours split the vertices into two groups with no edge inside a group. That is a
bipartition. So "two colours suffice" means "bipartite", and
[[thm:bipartite-odd-cycle|König's theorem]] says when a graph is bipartite: when it has no cycle
of odd length.
:::

An odd cycle need not be a triangle. The 5-cycle has no triangle, and still two colours fail.

```graph id=t08-odd-five widget=stepper
caption: Two colours on the 5-cycle: along the path $abcd$ the colours must alternate, and then $e$ has a neighbour of each colour.
intent: New figure (the lecture has no example for the proposition, theory/2026-11-03 p2). Shows the direction "odd cycle, so not two colours" on an odd cycle without a triangle.
layout: fixed
a @(1.5, 1.3); b @(3, 0.8); c @(2.3, 0); d @(0.7, 0); e @(0, 0.8)
a -- b; b -- c; c -- d; d -- e; e -- a
step: The 5-cycle has no triangle. Can two colours work?
step: Colour 1 at $a$. Along the path $abcd$ each colour forces the next one.
class color1: a c
class color2: b d
class path: a--b b--c c--d
step: $e$ has the neighbour $a$ in colour 1 and $d$ in colour 2. No colour is left.
unclass path: a--b b--c c--d
class rejected: e d--e e--a
```

## Why it is true

The proof goes **through bipartite graphs**. A proper colouring with colours 1 and 2 is the
same thing as a bipartition, and König's theorem turns bipartitions into "no odd cycle". The
two directions are separate, so each gets its own walkthrough.

:::: walkthrough {for=prop:two-colourable}
```graph id=t08-two-colour-forward widget=stepper
caption: Direction from left to right: the two colour classes of a proper colouring are the two sides of a bipartition.
intent: New figure (the lecture draws nothing for the proposition, theory/2026-11-03 p2). The graph of t08-two-or-three, panel "two colours". The redrawing in two rows makes the bipartition visible.
layout: fixed
p @(0, 0.65); q @(0.75, 1.3); r @(2.25, 1.3); s @(3, 0.65); t @(2.25, 0); u @(0.75, 0)
p -- q; q -- r; r -- s; s -- t; t -- u; u -- p; p -- s
mark c: p q r s t u
mark A: p r t
mark B: q s u
mark square: p--q q--r r--s p--s
step: A proper colouring $c$ with colours 1 and 2.
class color1: p r t
class color2: q s u
step: $A$ gets colour 1, $B$ colour 2. Redrawn: $A$ on top, $B$ below.
r @(0, 1.3); p @(1.5, 1.3); t @(3, 1.3); q @(0, 0); s @(1.5, 0); u @(3, 0)
step: No edge stays inside a row.
class bold: p--q q--r r--s s--t t--u u--p p--s
step: So $G$ is bipartite and has no odd cycle.
unclass bold: p--q q--r r--s s--t t--u u--p p--s
class cycle: p--q q--r r--s p--s
```

::: step
First the direction from left to right. The hypothesis: the
[[def:chromatic-number|chromatic number]] is at most 2. So $G$ has a
[[def:colouring|proper $k$-colouring]] $c$ with $k$ at most 2. Its colours are 1 to $k$, so
every colour is 1 or 2. Here [[fig:t08-two-colour-forward#c|$c$]] gives colour 1 to $p$, $r$, $t$
and 2 to $q$, $s$, $u$.
:::

::: step
Let $A$ be the vertices of colour 1 and $B$ the vertices of colour 2. Each vertex has exactly
one colour, 1 or 2, so it lies in exactly one of the two sets. When $k$ is 0 or 1, $B$ is
empty; that is allowed. Here [[fig:t08-two-colour-forward#A|$A$]] is the top
row and [[fig:t08-two-colour-forward#B|$B$]] the bottom row.
:::

::: step
Suppose an edge had both ends in $A$. Then both ends have colour 1. But $c$ is proper, so the
two ends of every edge have different colours. This is impossible, so $A$ is independent. The
same argument with colour 2 shows that $B$ is independent. Here all 7 edges run between the
rows.
:::

::: step
So $(A, B)$ is a [[def:bipartite|bipartition]], and $G$ is bipartite. König's theorem says that a
bipartite graph has no odd cycle, so $G$ has none. Here the three cycles have length 4, 4 and 6,
for example [[fig:t08-two-colour-forward#square|the cycle $pqrs$]].
:::
::::

:::: walkthrough {for=prop:two-colourable}
```graph id=t08-two-colour-backward widget=stepper
caption: Direction from right to left: no odd cycle gives a bipartition, and the two sides get the two colours.
intent: New figure (the lecture draws nothing for the proposition, theory/2026-11-03 p2). The same graph and positions as t08-two-colour-forward, now read in the other direction.
layout: fixed
p @(0, 0.65); q @(0.75, 1.3); r @(2.25, 1.3); s @(3, 0.65); t @(2.25, 0); u @(0.75, 0)
p -- q; q -- r; r -- s; s -- t; t -- u; u -- p; p -- s
mark outer: p--q q--r r--s s--t t--u u--p
mark A: p r t
mark B: q s u
mark c: p q r s t u
step: $G$ has no odd cycle.
class cycle: p--q q--r r--s s--t t--u u--p
step: König's theorem gives a bipartition $(A, B)$: $A$ on top, $B$ below.
unclass cycle: p--q q--r r--s s--t t--u u--p
r @(0, 1.3); p @(1.5, 1.3); t @(3, 1.3); q @(0, 0); s @(1.5, 0); u @(3, 0)
step: Colour 1 on $A$, colour 2 on $B$.
class color1: p r t
class color2: q s u
step: Every edge joins $A$ and $B$, so the colouring is proper.
class bold: p--q q--r r--s s--t t--u u--p p--s
```

::: step
Now the direction from right to left. We assume that $G$ has no odd cycle: that is the
hypothesis. Here [[fig:t08-two-colour-backward#outer|the outer cycle]] has length 6, and the
other two cycles, $pqrs$ and $pstu$, have length 4.
:::

::: step
König's theorem applies, because $G$ has no odd cycle, and it says that $G$ is bipartite. So $G$
has a bipartition $(A, B)$: two disjoint independent sets that together contain every vertex.
Here [[fig:t08-two-colour-backward#A|$A$]] is the top row and
[[fig:t08-two-colour-backward#B|$B$]] the bottom row.
:::

::: step
We define a colouring [[fig:t08-two-colour-backward#c|$c$]]: colour 1 for every vertex of $A$,
colour 2 for every vertex of $B$. Each vertex lies in exactly one of the two sets, so it gets
exactly one colour. So $c$ is a 2-colouring.
:::

::: step
Take any edge. Each end lies in $A$ or in $B$. Not both ends are in $A$, because $A$ is
independent, and not both in $B$. So the ends get colours 1 and 2, and $c$ is proper. The
chromatic number is the least such number of colours, so it is at most 2. Here every edge joins
both rows.
:::
::::

::: proof
The lecture's proof is one line: $\chi(G) \le 2$ holds if and only if $G$ is bipartite, and $G$
is bipartite if and only if $G$ has no odd cycle, by
[[thm:bipartite-odd-cycle|König's theorem]]. We write out the first equivalence.

($\Rightarrow$) Suppose $\chi(G) \le 2$. Then $G$ has a proper $k$-colouring $c$ with $k \le 2$,
so $c(x) \in \set{1, 2}$ for every vertex $x$. Let $A = \set{x \in V(G) : c(x) = 1}$ and
$B = \set{x \in V(G) : c(x) = 2}$. Then $A \cup B = V(G)$ and $A \cap B = \emptyset$. If an edge
$xy$ had both ends in $A$, then $c(x) = c(y) = 1$, which contradicts that $c$ is proper. So $A$
is independent, and in the same way $B$ is independent. Hence $(A, B)$ is a bipartition, $G$ is
bipartite, and by König's theorem $G$ has no odd cycle.

($\Leftarrow$) Suppose $G$ has no odd cycle. By König's theorem $G$ is bipartite; let $(A, B)$ be
a bipartition. Define $c(x) = 1$ for $x \in A$ and $c(x) = 2$ for $x \in B$. Since $A$ and $B$
are disjoint and cover $V(G)$, this is a 2-colouring. An edge $xy$ has neither both ends in $A$
nor both ends in $B$, because both sets are independent. So $c(x) \ne c(y)$, and $c$ is proper.
Hence $\chi(G) \le 2$.
:::

::: pitfall
An odd cycle shows only that two colours fail, so $\chi(G) \ge 3$. It does not show
$\chi(G) = 3$: the complete graph $K_4$ contains triangles and needs 4 colours.
:::

## Check yourself

```graph id=t08-ex-two-colour-cube widget=exercise
task: color-vertices
colors: 2
prompt: Click a vertex to change its colour. Give every vertex one of 2 colours so that the colouring is proper.
check: is-proper-coloring k=2
hint: Start at any vertex. Each of its neighbours must get the other colour, and so on.
solution: Colour 1 on 1, 3, 6, 8 and colour 2 on 2, 4, 5, 7. Every edge joins the two groups. The graph has no odd cycle, so two colours had to work.
layout: fixed
1 @(0, 0); 2 @(2.4, 0); 3 @(2.4, 2.4); 4 @(0, 2.4); 5 @(0.8, 0.8); 6 @(1.6, 0.8); 7 @(1.6, 1.6); 8 @(0.8, 1.6)
1 -- 2 -- 3 -- 4 -- 1
5 -- 6 -- 7 -- 8 -- 5
1 -- 5; 2 -- 6; 3 -- 7; 4 -- 8
```

:::: quiz {#q:t08-odd-cycle-chi}
A graph $G$ contains a cycle of length 7. What do you know for sure?

- [ ] $\chi(G) = 3$
- [x] $\chi(G) \ge 3$
- [ ] $\chi(G) \le 2$

::: explanation
7 is odd, so $G$ has an odd cycle. By the proposition, $\chi(G) \le 2$ is false, so
$\chi(G) \ge 3$. It can be larger: the complete graph $K_7$ contains a cycle of length 7 and
needs 7 colours.
:::
::::
