---
title: "Leaves"
course: theory
chapter: trees
order: 2
lectures: [t03]
stage: split
status: draft
---

::: theorem {#thm:two-leaves title="Acyclic graphs have two vertices of small degree" source="theory/2026-09-29 p1–2"}
Every acyclic graph $G$ on at least $2$ vertices contains at least two vertices of [[def:degree|degree]] at most $1$.
:::

::: intuition
Travel through a forest without turning back. Since there is no cycle, you never return to a vertex
you have seen, so in a finite graph you get stuck, and you can only get stuck at a vertex with no
other way out. Doing this in both directions gives two such dead ends: the two ends of a longest path.
Example: in the star $K_{1,3}$ the three outer vertices have degree $1$. Non-example: in $C_4$
every vertex has degree $2$, and indeed $C_4$ has a cycle.
:::

::: proof
Let $P \subseteq G$ be a [[def:path-graph|path]] of maximum length in $G$ (there are finitely many paths, and single vertices
are paths of length $0$, so a longest path exists).

**(a)** If $\abs{V(P)} = 1$, then $G$ has no edges at all (an edge would be a path with two vertices). So
every vertex of $G$ has degree $0$, and there are at least two vertices.

**(b)** If $\abs{V(P)} > 1$, then $P$ has two ends $u \ne v$. We claim $d_G(u) = d_G(v) = 1$; by symmetry we
treat $u$. It has degree at least $1$, since it has a neighbour on $P$. Suppose for a contradiction that
$\set{u, x} \in E(G)$, where $x$ is **not** the neighbour of $u$ on $P$.

- (b1) If $x \notin V(P)$, then $P + \set{u, x}$ (prolong $P$ beyond $u$ to $x$) is a longer path, a
  contradiction with the choice of $P$.
- (b2) If $x \in V(P)$, then $x$ is not the neighbour of $u$ on $P$, and $P + \set{u, x}$ contains a cycle
  (the edge $ux$ together with the part of $P$ between $u$ and $x$, which has at least two edges), a
  contradiction with $G$ acyclic.

So indeed $d_G(u) = d_G(v) = 1$.
:::

```graph id=t03-longest-path widget=figure
caption: The end $u$ of a longest path $P$ cannot have another neighbour $x$: outside $P$ it would prolong $P$, on $P$ it would close a cycle.
intent: Transcription of the lecture sketch of the two cases (b1), (b2).
layout: fixed
u [class=current] @(0, 0); p1 @(1, -0.3); p2 @(2, 0); p3 @(3, -0.3); v [class=current] @(4, 0)
x1 [label="$x$" class=muted] @(-0.8, 0.8)
u -- p1 -- p2 -- p3 -- v [class=path]
u -- x1 [class="rejected dashed"]; u -- p2 [class="rejected dashed" bend=0.4]
```

::: definition {#def:leaf title="Leaf" defines="leaf"}
A vertex of degree $1$ is called a **leaf**.
:::

::: intuition
In a drawing of a tree the leaves are the tips of the branches: vertices hanging on a single edge.
Example: the path $P_n$ ($n \ge 1$) has exactly two leaves, its ends, and the star $K_{1,n}$ ($n \ge 2$) has $n$.
Non-example: an isolated vertex has degree $0$, so it is not a leaf, although it is a tree on its own.
:::

::: corollary {#cor:tree-leaf title="Trees have leaves" source="theory/2026-09-29 p3"}
Every tree on at least $2$ vertices has a vertex of degree $1$. (In fact it has at least two.)
:::

::: intuition
The two vertices of degree at most $1$ from [[thm:two-leaves]] cannot have degree $0$, because a
connected graph with an edge has no isolated vertex. So a tree on $n \ge 2$ vertices always has a
[[def:leaf|leaf]] to remove, which is what makes induction on trees work ([[lem:leaf-removal]]). Example: $K_2$ is a
tree whose two vertices are both leaves.
:::

::: proof
By [[thm:two-leaves]] there are two vertices of degree at most $1$. A connected graph on at least two
vertices has no vertex of degree $0$, so both have degree exactly $1$.
:::
