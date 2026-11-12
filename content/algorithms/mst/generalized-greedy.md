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

::: pitfall
The side conditions are needed. In the triangle with $w(ab) = 1$, $w(ac) = 2$, $w(bc) = 3$, once $ab$ is blue, the cut
$(\set{b}, \set{a, c})$ is crossed by the blue edge $ab$; ignoring this and colouring its minimum uncoloured crossing edge $bc$
blue would be wrong, as the MST is $\set{ab, ac}$.
:::

The rules leave a lot of freedom, and the questions are **how to find** a cut or cycle to which a rule applies, and **how fast**. The
classical algorithms answer this in different ways.
