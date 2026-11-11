---
title: "Acyclic graphs and small degrees"
course: theory
chapter: trees
order: 3
lectures: [t03]
stage: split
status: draft
---

::: corollary {#cor:acyclic-subgraph-small-degree title="Acyclicity via small degrees" source="theory/2026-09-29 p3"}
For every (multi)graph $G$: $G$ is acyclic $\iff$ every (non-empty) [[def:subgraph|subgraph]] of $G$ contains a vertex of degree
at most $1$.
:::

::: intuition
A cycle is a subgraph in which every vertex has degree $2$, so it is exactly the kind of subgraph with
no vertex of small degree. The corollary says that cycles are the only obstruction. It gives a
"peeling" test: keep deleting vertices of degree at most $1$; the graph is acyclic if and only if
everything gets deleted. Example: in a triangle with a pendant edge, peeling removes the pendant
vertex and then gets stuck at the triangle.
:::

::: pitfall
"Every vertex of $G$ has degree at most $1$" is much stronger than acyclicity, and "$G$ has a vertex of
degree $1$" is much weaker. The corollary quantifies over **all subgraphs**: a triangle with a pendant
edge has a vertex of degree $1$ but contains a cycle.
:::

::: proof
($\Rightarrow$) A subgraph of an acyclic graph is acyclic. If it has at least two vertices, apply
[[thm:two-leaves]]; if it has one vertex, that vertex has degree $0$ (an acyclic multigraph has no loops).

($\Leftarrow$) By contraposition: if $C \subseteq G$ is a cycle, then $C$ is a subgraph in which every vertex
has degree $2$ (for a loop, the single vertex has degree $2$; for two parallel edges, both vertices have
degree $2$), so $C$ has **no** vertex of degree at most $1$.
:::
