---
title: "The generalized greedy algorithm"
course: algorithms
chapter: mst
order: 5
lectures: [a01]
stage: split
status: draft
---

All classical [[def:mst|MST]] algorithms are special cases of one edge-colouring process (due to Tarjan). Initially, all edges are uncoloured.

- **Blue rule:** given a [[def:cut|cut]] with no blue edges across it, select the minimum uncoloured [[def:cut|crossing edge]] and colour it **blue**. (Uses the
  cut property.)
- **Red rule:** given a cycle containing no red edges, select the maximum uncoloured edge on it and colour it **red**. (Uses the
  cycle property.)

Repeatedly apply the two rules, in any order, until all edges are coloured. (We may stop as soon as there are $n - 1$ blue edges.)

::: theorem {#thm:generalized-greedy title="Correctness of the generalized greedy algorithm" extra=true}
In any execution of the colouring process, (1) the MST $M$ contains all blue edges and no red edge; (2) as long as some edge is
uncoloured, one of the rules can be applied. Consequently, when all edges are coloured, the blue edges are exactly $M$.
:::

::: intuition
Blue means "certified to be in $M$", red means "certified not to be in $M$". The certificates are the cut and cycle properties,
applied to the edges that are still undecided, and a certificate never expires, so the rules can be applied in any order. Example:
a triangle $abc$ with $w(ab) = 1$, $w(bc) = 2$, $w(ca) = 3$. The red rule on the triangle colours $ca$ red; the blue rule on the
cut $(\set{b}, \set{a, c})$ colours $ab$ blue; the blue rule on the cut $(\set{c}, \set{a, b})$, which no blue edge crosses, colours
$bc$ blue. The blue edges $ab, bc$ form the MST. Kruskal, Jarník and Borůvka below differ only in which cut or cycle they pick next.
:::

::: pitfall
The side conditions are needed. In the triangle with $w(ab) = 1$, $w(ac) = 2$, $w(bc) = 3$, once $ab$ is blue, the cut
$(\set{b}, \set{a, c})$ is crossed by the blue edge $ab$; ignoring this and colouring its minimum uncoloured crossing edge $bc$
blue would be wrong, as the MST is $\set{ab, ac}$.
:::

::: proof
**(1)** By induction over the colouring steps: we show that every step keeps the invariant "blue $\subseteq M$, red $\cap\, M = \emptyset$".

*Blue rule*, colouring $e$ blue across a cut with no blue crossing edge. Suppose $e \notin M$. The cycle in $M + e$ crosses the cut at $e$ and at
another edge $f \in M$. Then $f$ is not blue (no blue edge crosses the cut) and not red (it is in $M$), so $f$ is uncoloured, and $w(f) > w(e)$ as $e$ is
the minimum uncoloured crossing edge. $M + e - f$ is lighter than $M$, a contradiction.

*Red rule*, colouring $e$ red on a cycle $C$ with no red edge. Suppose $e \in M$. The path $C - e$ crosses the cut given by the two components of
$M - e$ at an edge $f \ne e$ with $f \notin M$. Then $f$ is not blue (blue edges lie in $M$) and not red ($C$ has none), so $f$ is uncoloured and
$w(f) < w(e)$. $M - e + f$ is lighter than $M$, a contradiction.

**(2)** Let $e = uv$ be uncoloured. If $u$ and $v$ lie in the same component of the blue forest, the blue path between them plus $e$ is a cycle
without red edges, and the red rule applies to it. Otherwise let $S$ be the blue component containing $u$: no blue edge crosses the cut
$(S, V \setminus S)$, and $e$ is an uncoloured crossing edge, so the blue rule applies.

Finally, if all edges are coloured, then blue $\subseteq M$ and every edge of $M$ is blue (it is not red by (1)), so blue $= M$.
:::

The rules leave a lot of freedom, and the questions are **how to find** a cut or cycle to which a rule applies, and **how fast**. The
classical algorithms answer this in different ways.
