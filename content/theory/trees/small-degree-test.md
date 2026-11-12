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
A cycle is a subgraph in which every vertex has degree $2$, so it is a subgraph with
no vertex of small degree. The corollary says that cycles are the only obstruction: every subgraph with no
vertex of degree at most $1$ contains a cycle. <!-- REVIEW: "exactly the kind of subgraph" was false (K_4 has no vertex of degree at most 1 and is more than a cycle); reworded minimally. --> It gives a
"peeling" test: keep deleting vertices of degree at most $1$; the graph is acyclic if and only if
everything gets deleted. Example: in a triangle with a pendant edge, peeling removes the pendant
vertex and then gets stuck at the triangle.
:::

::: pitfall
"Every vertex of $G$ has degree at most $1$" is much stronger than acyclicity, and "$G$ has a vertex of
degree at most $1$" is much weaker. <!-- REVIEW: was "degree 1"; K_1 is acyclic with no vertex of degree 1. --> The corollary quantifies over **all subgraphs**: a triangle with a pendant
edge has a vertex of degree $1$ but contains a cycle.
:::

The proof of ($\Rightarrow$) restricts to a subgraph, which stays acyclic, and then applies the theorem on two vertices of small degree.

:::: walkthrough {for=cor:acyclic-subgraph-small-degree}
```graph id=t03-small-degree-forward widget=stepper
caption: An acyclic graph $G$ and a subgraph $H$ (highlighted): $H$ has two vertices of degree at most $1$.
intent: New. The lecture draws a tree and a square with tails next to this corollary (theory/2026-09-29 p3); this tree is the T-shaped one, with names added.
layout: fixed
a @(0, 0); b @(1, 0); c @(1, -1); d @(2, 0); e @(3, 0); f @(4, 0)
a -- b; b -- c; b -- d; d -- e; e -- f
mark H: b c d e f b--c b--d d--e e--f
mark two: c f
mark one: e
step: Take a non-empty subgraph $H$ of $G$.
class highlight: b c d e f b--c b--d d--e e--f
class muted: a a--b
step: $H$ is acyclic.
class tree: b--c b--d d--e e--f
step: Two or more vertices: two vertices of degree at most $1$.
class current: c f
step: One vertex: its degree is $0$.
unclass highlight: b c d f b--c b--d d--e e--f
unclass tree: b--c b--d d--e e--f
unclass current: c f
class muted: b c d f b--c b--d d--e e--f
class current: e
```

::: step
Let $G$ be acyclic and take any non-empty [[def:subgraph|subgraph]] [[fig:t03-small-degree-forward#H|$H$]] of $G$. We must show that $H$ has a vertex of degree at most $1$. Here $G$ has $6$ vertices and $5$ edges, and $H$ has $5$ vertices and $4$ edges.
:::

::: step
$H$ is acyclic. Why: every cycle in $H$ uses only edges and vertices of $H$, and these are edges and vertices of $G$, so it would be a cycle in $G$. This is the hypothesis that $G$ is acyclic. Here $H$ is the path $c, b, d, e, f$, and it has no cycle.
:::

::: step
Suppose $H$ has at least $2$ vertices. Then [[thm:two-leaves]] applies to $H$, because $H$ is acyclic. It gives two vertices of degree at most $1$ in $H$. Degrees count only edges of $H$. Here: [[fig:t03-small-degree-forward#two|$c$ and $f$]], both of degree $1$ in $H$.
:::

::: step
Suppose $H$ has exactly one vertex, for example [[fig:t03-small-degree-forward#one|$e$]]. Then $H$ has no edge except possibly a loop, and a loop would be a cycle of $G$, against the hypothesis. So the degree of that vertex is $0$, which is at most $1$. Both cases are done.
:::
::::

The proof of ($\Leftarrow$) is a proof by contraposition: a cycle is a subgraph in which every vertex has degree $2$.

:::: walkthrough {for=cor:acyclic-subgraph-small-degree}
```graph id=t03-small-degree-backward widget=stepper
caption: A graph with a cycle $C$ on $a, b, c, d$ and two pendant vertices: $C$ has no vertex of degree at most $1$.
intent: New. Based on the lecture's square with tails, marked as a non-example (theory/2026-09-29 p3), with names added.
layout: fixed
a @(0, 0); b @(1, 0); c @(1, -1); d @(0, -1); e @(-1, 0.7); f @(2, -1.7)
a -- b; b -- c; c -- d; d -- a; a -- e; c -- f
mark C: a b c d a--b b--c c--d d--a
step: Assume $G$ contains a cycle $C$.
class cycle: a--b b--c c--d d--a
step: $C$ is a non-empty subgraph of $G$.
class highlight: a b c d
class muted: e f a--e c--f
step: Every vertex of $C$ has degree $2$ in $C$.
class current: a b c d
step: So $C$ has no vertex of degree at most $1$.
unclass current: a b c d
class rejected: a b c d
```

::: step
We prove the contrapositive: if $G$ contains a cycle, then some subgraph of $G$ has no vertex of degree at most $1$. So assume that [[fig:t03-small-degree-backward#C|$C$]] is a cycle in $G$. Here $C$ is $a, b, c, d$ with $4$ edges. So $G$ is not acyclic.
:::

::: step
$C$ is a non-empty subgraph of $G$: by assumption its vertices and edges are vertices and edges of $G$. Here $e$ and $f$, and the edges at them, are not in $C$. The statement on the right quantifies over all subgraphs, so we may test it on $C$.
:::

::: step
Every vertex of $C$ has degree $2$ in $C$. Why: a cycle is closed, so each vertex lies on exactly two consecutive edges of it. For a loop, the single vertex has degree $2$. For two parallel edges, each of the two vertices has degree $2$. Here $a$, $b$, $c$ and $d$ all have degree $2$ in $C$.
:::

::: step
Since $2$ is more than $1$, $C$ has no vertex of degree at most $1$. So the right side of the corollary fails for $G$. We showed: if the left side fails, the right side fails. That is the contrapositive of ($\Leftarrow$). Note: $a$ has degree $3$ in $G$, but only the degree in $C$ matters here.
:::
::::

::: proof
($\Rightarrow$) A subgraph of an acyclic graph is acyclic. If it has at least two vertices, apply
[[thm:two-leaves]]; if it has one vertex, that vertex has degree $0$ (an acyclic multigraph has no loops).

($\Leftarrow$) By contraposition: if $C \subseteq G$ is a cycle, then $C$ is a subgraph in which every vertex
has degree $2$ (for a loop, the single vertex has degree $2$; for two parallel edges, both vertices have
degree $2$), so $C$ has **no** vertex of degree at most $1$.
:::
