---
title: Bounds on the chromatic number
course: theory
chapter: colouring
order: 4
lectures: [t08]
goal: Bound the chromatic number from below by a clique and from above by vertices of small degree.
needs: [theory/colouring/colourings, theory/colouring/two-colourable, theory/basics/cliques-and-independent-sets, theory/basics/subgraphs, theory/basics/graph-families, theory/degrees/degrees-and-handshake]
stage: taught
status: reviewed
---

The lecture's graph again. The [[fig:t08-bounds-board#triangle|three top vertices]] are
pairwise adjacent, a [[def:clique|clique]], so they need three different colours. Can we also see, without trying
colourings, that three colours are enough?

```graph id=t08-bounds-board widget=figure
caption: The lecture's graph. The marked triangle $abc$ needs three colours. The vertex $a$ has only the two neighbours $b$ and $c$.
intent: From the lecture (theory/2026-11-03 p1, right), with the vertex names and positions of t08-board-colouring and no colours yet. It asks for the two bounds of this page on a graph the students know.
layout: fixed
a @(0.4, 1.6); b @(0, 0.95); c @(1.1, 1); d @(0, 0.1); e @(1.1, 0)
a -- b; a -- c; b -- c; b -- d; c -- d; c -- e; d -- e
mark triangle: a b c a--b a--c b--c
mark few: a a--b a--c
```

Look at [[fig:t08-bounds-board#few|the vertex $a$ and its two edges]]. Colour the other four
vertices first. Then the two neighbours of $a$ block at most two of three colours, and the third
colour is free for $a$.

This works when every part of the graph has such a vertex with few neighbours. Then a clique
gives a lower bound and small degrees give an upper bound. For the lecture's graph both bounds
are 3.

## Two bounds

::: proposition {#prop:chromatic-bounds title="Cliques and small degrees bound the chromatic number" source="theory/2026-11-03 p5"}
(a) If $G$ contains a $k$-clique ($K_k \subseteq G$), then $\chi(G) \ge k$.

(b) If every non-empty subgraph of $G$ contains a vertex of degree $\le k$, then
$\chi(G) \le k + 1$.
:::

<!-- REVIEW: the board says "every subgraph". On this site a graph may have no vertices (def:graph; the colourings page uses chi of the empty graph), and the empty subgraph contains no vertex, so "every subgraph" would make (b) never apply. "non-empty" is the minimal fix. -->

::: intuition
(a): the vertices of a clique are pairwise adjacent, so they need pairwise different colours.
(b): a vertex with at most $k$ neighbours can always wait until last. Its neighbours then block
at most $k$ of the $k + 1$ colours.
:::

The lecture marks (a) with a tick and states it without proof.

In (b) the condition is about every non-empty [[def:subgraph|subgraph]], not only about $G$ itself. With $k = 2$
the two graphs below show the difference.

```graph id=t08-every-subgraph widget=figure
caption: Take $k = 2$. "holds": every non-empty subgraph of the lecture's graph has a vertex with at most 2 neighbours, so $\chi \le 3$. "fails": $t$ has only 1 neighbour, but in the marked subgraph on $p$, $q$, $r$, $s$ every vertex has 3 neighbours. This graph contains $K_4$, so it needs 4 colours.
intent: New figure: an example and a non-example of the hypothesis of (b) for k = 2. "holds" is the lecture's graph (theory/2026-11-03 p1) with the names and positions of t08-board-colouring; "fails" is new.
layout: fixed
panel: holds
a @(0.4, 1.6); b @(0, 0.95); c @(1.1, 1); d @(0, 0.1); e @(1.1, 0)
a -- b; a -- c; b -- c; b -- d; c -- d; c -- e; d -- e
panel: fails
p @(0, 1.4); q @(1.2, 1.4); r @(0, 0.2); s @(1.2, 0.2); t @(2.2, 0.8)
p -- q [class=highlight]; p -- r [class=highlight]; p -- s [class=highlight]; q -- r [class=highlight]; q -- s [class=highlight]; r -- s [class=highlight]; q -- t
mark k4: p q r s p--q p--r p--s q--r q--s r--s
```

In "fails", [[fig:t08-every-subgraph#k4|the subgraph $K_4$]] has no vertex with at most 2
neighbours. So (b) does not apply with $k = 2$, and it must not: by (a) this graph needs 4
colours.

## An upper bound can be far off

Next to (b) the lecture wrote a warning, with the word "BUT".

::: observation {#obs:chromatic-kmm title="The chromatic number of $K_{m,m}$" source="theory/2026-11-03 p5"}
$\chi(K_{m,m}) = 2$ for $m \ge 1$.
:::

<!-- REVIEW: the board writes chi(K_{m,m}) = 2 without a condition on m. K_{0,0} has no vertices and chromatic number 0, so "m >= 1" is added. -->

::: intuition
Colour one side of the [[def:complete-bipartite|complete bipartite graph]] 1 and the other side 2. Every edge joins the two sides, so this is proper. One
edge already needs two colours. Yet every vertex has $m$ neighbours, so (b) gives only
$m + 1$.
:::

The lecture states this without proof.

```graph id=t08-kmm-bound widget=figure
caption: $K_{3,3}$. Every vertex has 3 neighbours, so (b) applies only from $k = 3$ on and gives at most 4 colours. Two colours, one for each row, are proper: $\chi = 2$.
intent: New figure for the lecture's remark "BUT chi(K_{m,m}) = 2" (theory/2026-11-03 p5), with m = 3 and the vertex names of def:complete-bipartite.
layout: fixed
1 @(0, 1.2) [class=color1]; 2 @(1.2, 1.2) [class=color1]; 3 @(2.4, 1.2) [class=color1]; 1' @(0, 0) [class=color2]; 2' @(1.2, 0) [class=color2]; 3' @(2.4, 0) [class=color2]
1 -- 1'; 1 -- 2'; 1 -- 3'; 2 -- 1'; 2 -- 2'; 2 -- 3'; 3 -- 1'; 3 -- 2'; 3 -- 3'
mark edge: 1 1' 1--1'
```

Here (a) is exact: [[fig:t08-kmm-bound#edge|one edge]] is a clique $K_2$, so at least 2
colours. The upper bound 4 from (b) is far off.

## Why it is true

The proof of (b) is an **induction on the number of vertices**: remove a vertex with few
neighbours, colour the rest, and put the vertex back with a colour its neighbours do not use.

:::: walkthrough {for=prop:chromatic-bounds}
```graph id=t08-degree-induction widget=stepper
caption: The induction step of (b) with $k = 2$: remove $v$, colour the rest, give $v$ a leftover colour.
intent: Built on the lecture's sketch for this proof (theory/2026-11-03 p5: a vertex v with at most k neighbours, crossed out) and on the lecture's graph of p1, redrawn wide. The removed vertex is v (a in t08-board-colouring); b, c, d, e keep their names. The final colouring is the lecture's colouring of p1.
layout: fixed
v @(0, 0.65); b @(1.2, 1.3); c @(1.2, 0); d @(2.8, 1.3); e @(2.8, 0)
v -- b; v -- c; b -- c; b -- d; c -- d; c -- e; d -- e
mark G: v b c d e
mark v: v
mark N: b c
mark Gp: b c d e
mark cp: b c d e
mark free: v
step: Induction on the number of vertices. Here $G$ has 5 vertices and $k = 2$.
step: The assumption gives $v$ with at most $k$ neighbours.
class current: v
class highlight: b c
step: Remove $v$: the graph $G'$ satisfies the same assumption.
unclass current: v
unclass highlight: b c
class muted: v v--b v--c
class dashed: v--b v--c
step: By induction, $G'$ has a proper colouring with colours 1 to $k + 1$.
class color2: b e
class color3: c
class color1: d
step: The neighbours of $v$ carry at most $k$ colours.
class highlight: b c
step: A colour is left over, and $v$ gets it.
unclass muted: v v--b v--c
unclass dashed: v--b v--c
unclass highlight: b c
class color1: v
step: The colouring of $G$ is proper.
class bold: v--b v--c b--c b--d c--d c--e d--e
```

::: step
We use induction on the number of vertices; $k$ stays fixed. Base case: $G$ has at most one
vertex. An edge needs two different ends, so $G$ has no edge. Then colour 1 on every vertex is
proper, and 1 is at most $k + 1$. Here [[fig:t08-degree-induction#G|$G$]] has 5 vertices, so
we are in the induction step.
:::

::: step
Now $G$ has at least two vertices. $G$ is a non-empty subgraph of itself, so the assumption
gives a vertex [[fig:t08-degree-induction#v|$v$]] of [[def:degree|degree]] at most $k$: the
first use of the assumption. A [[def:graph|graph]] has no loops and no parallel edges, so this degree is the number of
neighbours of $v$. Here $v$ has the 2 neighbours [[fig:t08-degree-induction#N|$b$ and $c$]].
:::

::: step
We remove $v$ with its edges and call the result [[fig:t08-degree-induction#Gp|$G'$]]. It
satisfies the same assumption: a non-empty subgraph of $G'$ is also a non-empty subgraph of $G$,
so it has a vertex of degree at most $k$. This is the second use of the assumption. Here $G'$
has the 4 vertices $b$, $c$, $d$, $e$.
:::

::: step
$G'$ has one vertex fewer than $G$, so the induction hypothesis applies: $\chi(G')$ is at most
$k + 1$. So $G'$ has a proper colouring $c'$ whose colours all lie among 1 to $k + 1$. The
induction does not say which one. Here we take
[[fig:t08-degree-induction#cp|colour 2 on $b$ and $e$, 3 on $c$, 1 on $d$]].
:::

::: step
Look at the neighbours of $v$ under $c'$. Each neighbour carries one colour, so together they
carry at most as many colours as $v$ has neighbours. That is at most $k$ colours. Here $b$ and
$c$ carry the 2 colours 2 and 3.
:::

::: step
There are $k + 1$ colours, and the neighbours of $v$ use at most $k$ of them. So at least one
colour is left over. We put $v$ back, give it this colour, and keep $c'$ on all other vertices.
Here colour 1 is left over, and [[fig:t08-degree-induction#free|$v$]] gets colour 1.
:::

::: step
The new colouring is proper. An edge not at $v$ lies in $G'$, where $c'$ is proper.
An edge at $v$ goes to a neighbour, and no neighbour has the leftover colour. So $G$ has a
proper colouring with colours 1 to $k + 1$, and $\chi(G)$ is at most $k + 1$. Here this is the
lecture's colouring.
:::
::::

::: proof {title="Proof of (b)" for=prop:chromatic-bounds}
By induction on $|V(G)|$, for a fixed $k$.

(1) $|V(G)| \le 1$: then $G$ has no edge, since every edge has two distinct ends. Colour $1$ on
every vertex is a proper colouring, so $\chi(G) \le 1 \le k + 1$.

(2) $|V(G)| \ge 2$: $G$ is a non-empty subgraph of itself, so by the assumption $G$ contains a
vertex $v \in V(G)$ of degree at most $k$, that is, with at most $k$ neighbours $N(v)$. The graph
$G' := G - v$ satisfies the same assumption, because every non-empty subgraph of $G'$ is a
non-empty subgraph of $G$. Since $|V(G')| < |V(G)|$, by induction $G'$ can be properly
$(k+1)$-coloured: there is a proper colouring $c'$ of $G'$ with $c'(x) \in \set{1, \dots, k+1}$
for all $x \in V(G')$. The set $N(v)$ receives at most $|N(v)| \le k$ colours under $c'$. Hence
there is a "leftover" colour $\alpha \in \set{1, \dots, k+1}$ with $c'(x) \ne \alpha$ for all
$x \in N(v)$, to be used on $v$ in $G$: let $c(v) = \alpha$ and $c(x) = c'(x)$ for $x \ne v$.
An edge of $G$ not incident with $v$ is an edge of $G'$, so its ends get different colours. An
edge $vx$ has $x \in N(v)$, so $c(x) \ne \alpha = c(v)$. Hence $c$ is a proper
$(k+1)$-colouring of $G$, and $\chi(G) \le k + 1$.
:::

::: pitfall
(a) gives only a lower bound. A graph without a large clique can still need many colours: the
5-cycle has no triangle. It is an odd cycle, so by the
[[prop:two-colourable|two-colour criterion]] it needs at least 3 colours.
:::

## Check yourself

:::: quiz {#q:t08-bounds-degree}
Every non-empty subgraph of a graph $G$ has a vertex of degree at most 3. What do you know for
sure?

- [ ] $\chi(G) = 4$
- [x] $\chi(G) \le 4$
- [ ] $\chi(G) \ge 4$

::: explanation
This is (b) with $k = 3$: it gives the upper bound $\chi(G) \le 4$ and nothing more. Fewer
colours may be enough: $K_{3,3}$ satisfies the assumption with $k = 3$, and $\chi(K_{3,3}) = 2$.
:::
::::

:::: quiz {#q:t08-bounds-both}
A graph $G$ contains $K_5$, and every non-empty subgraph of $G$ has a vertex of degree at most
4. What is $\chi(G)$?

- [ ] 4
- [x] 5
- [ ] 6

::: explanation
By (a), the clique $K_5$ gives $\chi(G) \ge 5$. By (b) with $k = 4$, $\chi(G) \le 5$. The two
bounds meet, so $\chi(G) = 5$. For example, $K_5$ itself is such a graph.
:::
::::
