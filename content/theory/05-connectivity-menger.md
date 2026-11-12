---
title: Higher connectivity and Menger's theorem
course: theory
lecture: 5
slug: t05
summary: k-connected and k-edge-connected graphs, s–t cuts, Menger's theorem in its directed, undirected, vertex and edge versions, the set version, 2-connected graphs and ear decompositions.
prerequisites: [theory/04-chordal-hamiltonian]
sources:
  - resources/graph-theory/2026-10-13-13_44_03-join.pdf
status: draft
---

A connected graph can be fragile: deleting a single vertex or edge may disconnect it. Networks that must
survive failures should be **highly connected**. There are two natural ways to measure this: how many vertices
(or edges) must be removed to disconnect the graph, and how many independent routes exist between two vertices.
**Menger's theorem**, one of the central theorems of graph theory, says that these two measures agree. It is
also the combinatorial heart of the [[thm:maxflow-mincut|max-flow min-cut theorem]] of the algorithms course.

## Summary

- $k$-connected: removing $< k$ vertices keeps $G$ [[def:component|connected]]; $k$-edge-connected: removing $< k$ edges does
  ([[def:k-connected]]).
- Menger: maximum number of [[def:st-cut|internally disjoint]] (edge-disjoint) $s$–$t$ [[def:path-graph|paths]] $=$ minimum size of an
  $s$–$t$ cut (edge cut) ([[thm:menger-directed]]); globally, $k$-connected iff $k$ internally disjoint paths between every two
  vertices ([[thm:menger]]).
- Proof strategy: vertex version via vertex splitting; edge version via [[def:d-flow|d-flows]]
  ([[claim:d-flow-paths]]).
- In flow terms: Menger B is max-flow min-cut with unit capacities ([[thm:maxflow-mincut]]), and A follows by
  splitting vertices ([[exr:a02-vertex-capacities]]).
- Set version: $k$ disjoint paths between any two $k$-sets ([[thm:total-menger]]).
- $2$-connected iff every two vertices (edges) lie on a common [[def:cycle-graph|cycle]] ([[thm:two-connected-cycles]]) iff it has an ear decomposition
  ([[thm:ear-decomposition]]).

## Exercises

```graph id=t05-ex-edge-disjoint widget=exercise
task: select-edges
prompt: Select the edges of $3$ edge-disjoint $s$–$t$ paths.
check: contains-edge-disjoint-paths k=3 from=s to=t
hint: $s$ and $t$ both have degree 3, so every edge at $s$ and at $t$ must be used.
solution: For example $s\,a\,d\,t$, $s\,b\,e\,t$ and $s\,c\,f\,t$. Any three paths that share no edge are correct.
s -- a; s -- b; s -- c; a -- d; b -- e; c -- f; d -- t; e -- t; f -- t; a -- b; d -- e; e -- f
```

:::: exercise {#exr:t05-whitney title="Whitney's inequalities" difficulty=2}
Let $\kappa(G)$ be the largest $k$ such that $G$ is $k$-connected, $\lambda(G)$ the largest $k$ such that $G$ is $k$-edge-connected, and $\delta(G)$ the
[[def:minimum-degree|minimum degree]]. Show that $\kappa(G) \le \lambda(G) \le \delta(G)$ for every simple [[def:component|connected]] graph $G$ with at least $2$ vertices.
<!-- REVIEW: the vertex-count hypothesis now covers λ ≤ δ too (for K_1, λ is unbounded while δ = 0). -->

::: hint
For the inequality $\kappa \le \lambda$, use Menger: [[def:st-cut|edge-disjoint]] [[def:path-graph|paths]] versus internally disjoint paths.
<!-- REVIEW: was "for the second inequality"; Menger gives the first one, κ ≤ λ (λ ≤ δ is direct; κ ≤ λ also has a direct proof). -->
:::

::: solution
Removing the $\delta(G)$ edges at a vertex of minimum degree isolates it (if $G$ has another vertex), so $\lambda(G) \le \delta(G)$. For
$\kappa \le \lambda$: let $k = \kappa(G)$. By [[thm:menger]] a), every two vertices are joined by $k$ internally disjoint paths. Internally disjoint
paths are also edge-disjoint (in a simple graph two paths sharing an edge share its ends; if that edge is not $st$ itself, one of its ends is an inner
vertex of both paths; and only one of the paths can be the edge $st$). By [[thm:menger]] b), $G$ is $k$-edge-connected, so $\lambda(G) \ge k$.
:::
::::

:::: exercise {#exr:t05-hypercube-connectivity title="Connectivity of the cube" difficulty=2}
The cube $Q_3$ has the $8$ strings $x_1 x_2 x_3 \in \set{0, 1}^3$ as vertices, two of them adjacent iff they differ in exactly one position
(the vertices and edges of an ordinary cube). Show that $Q_3$ is $3$-connected by exhibiting, for the two vertices $000$ and $111$, three internally disjoint paths. (By symmetry, together with a
similar check for adjacent and distance-2 pairs, this proves $3$-connectivity.)

::: solution
$000 \to 100 \to 110 \to 111$, $\ 000 \to 010 \to 011 \to 111$, $\ 000 \to 001 \to 101 \to 111$. The inner vertices $100, 110$, $010, 011$ and $001, 101$
are pairwise different. ($Q_3$ cannot be $4$-connected since it is $3$-regular, see [[exr:t05-whitney]].)
:::
::::

:::: quiz {#q:t05-kn-connectivity}
What is the largest $k$ such that $K_6$ is $k$-connected?

answer: 5

::: explanation
By convention $K_n$ is $(n-1)$-connected and not $n$-connected ([[def:k-connected]]).
:::
::::

:::: quiz {#q:t05-tree-connectivity}
Which [[def:forest-tree|trees]] on at least 3 vertices are 2-connected?

- [ ] All of them
- [ ] Only paths
- [x] None

::: explanation
A tree on $\ge 3$ vertices has a vertex of [[def:degree|degree]] $\ge 2$, which is a cut vertex: removing it disconnects its neighbours (they are joined only through
it, by uniqueness of paths). Also, trees have no [[def:cycle-graph|cycles]], so [[thm:two-connected-cycles]] fails.
:::
::::

:::: quiz {#q:t05-menger-count}
In a graph, the minimum size of an $s$–$t$ edge cut is 4. How many edge-disjoint $s$–$t$ paths are there at most?

answer: 4

::: explanation
By Menger's theorem the maximum number of edge-disjoint $s$–$t$ paths equals the minimum size of an $s$–$t$ edge cut.
:::
::::
