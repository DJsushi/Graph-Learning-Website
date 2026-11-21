---
title: Graph colouring
course: theory
lecture: 8
slug: t08
summary: Proper colourings and the chromatic number, two-colourable graphs, 3-colouring and SAT, bounds, and Mycielski graphs.
prerequisites: [theory/07-planarity-combinatorial]
sources:
  - resources/graph-theory/2026-11-03-13_40_43-join.pdf
status: reviewed
---

This lecture starts **graph colouring**. A colouring gives each vertex one of the colours
$1, 2, \dots, k$, and it is proper if the two ends of every edge get different colours. The
**chromatic number** $\chi(G)$ is the least number of colours that a proper colouring of $G$ needs. We see
which graphs need at most two colours, build for every 3-SAT formula a graph that is 3-colourable
exactly when the formula is satisfiable, bound $\chi(G)$ from below by cliques and from above by
vertices of small degree, and end with **Mycielski graphs**: graphs without triangles that need many colours.

## Summary

- A [[def:colouring|$k$-colouring]] of $G$ is any mapping $c : V(G) \to \set{1, 2, \dots, k}$. It is
  proper if $c(x) \ne c(y)$ for every edge $xy$. The [[def:chromatic-number|chromatic number]] $\chi(G)$ is the least $k$
  such that $G$ has a proper $k$-colouring.
- $\chi(G)$ is defined iff $G$ has no [[def:mixed-multigraph|loops]], and $\chi(G) = 1$ iff $G$ has a vertex and no edge
  ([[obs:chromatic-number-facts]]).
- $\chi(G) \le 2$ iff $G$ has no odd [[def:cycle-graph|cycle]] ([[prop:two-colourable]]). Proof: $\chi(G) \le 2$ means that $G$ is
  [[def:bipartite|bipartite]], and an earlier lecture showed that a graph is bipartite iff it has no odd cycle ([[thm:bipartite-odd-cycle]]).
- "3-COL solves SAT": for every 3-SAT formula $\Phi$ there is a graph $G_\Phi$ that is 3-colourable iff $\Phi$ is
  satisfiable ([[thm:three-colouring-sat]]). $G_\Phi$ has a triangle $(s, f, t)$, a triangle $(s, x_k, \neg x_k)$ for each
  variable and a small gadget for each clause. A satisfying valuation gives a proper 3-colouring, and a proper
  3-colouring gives a satisfying valuation.
- (a) If $G$ contains a [[def:clique|$k$-clique]], then $\chi(G) \ge k$. (b) If every non-empty [[def:subgraph|subgraph]] of $G$ has a vertex of
  [[def:degree|degree]] at most $k$, then $\chi(G) \le k + 1$ ([[prop:chromatic-bounds]]). The board ticks (a) without proof and proves (b) by
  induction on $\abs{V(G)}$: remove such a vertex, colour the rest, and give the vertex a leftover colour.
- An upper bound can be far off: $\chi(K_{m,m}) = 2$ for $m \ge 1$ ([[obs:chromatic-kmm]]), while every vertex of $K_{m,m}$ has $m$ neighbours, so (b) gives only $m + 1$.
- For every $k$ there is a graph $G_k$ with $\chi(G_k) = k$ and no triangle ([[thm:mycielski]]). The notes start with
  $G_3 = C_5$ and build $G_{k+1}$ from two copies of $V(G_k)$ and one new vertex $m$ joined to the second copy.
