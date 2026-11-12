---
title: "Leaves"
course: theory
chapter: trees
order: 2
lectures: [t03]
stage: split
status: reviewed
---

::: theorem {#thm:two-leaves title="Acyclic graphs have two vertices of small degree" source="theory/2026-09-29 p1–2"}
Every acyclic graph $G$ on at least $2$ vertices contains at least two vertices of [[def:degree|degree]] at most $1$.
:::

::: intuition
Travel through a forest without turning back. Since there is no cycle, you never return to a vertex
you have seen, so in a finite graph you get stuck, and you can only get stuck at a vertex with no
other way out. Doing this in both directions gives the two ends of a maximal path: two dead ends.
Starting at an isolated vertex, both directions stop at once, so there is only one dead end. The proof
takes a longest path to get this cleanly: that path has a single vertex only when $G$ has no edges
at all, which is case (a), and then any two vertices will do.
Example: in the star $K_{1,3}$ the three outer vertices have degree $1$. Non-example: in $C_4$
every vertex has degree $2$, and indeed $C_4$ has a cycle.
:::

The proof picks an extremal object, a longest path $P$, and splits into two cases by its number of vertices. This is case (a).

:::: walkthrough {for=thm:two-leaves}
```graph id=t03-two-leaves-case-a widget=stepper
caption: Case (a): when a longest path has one vertex, the graph has no edges, so every vertex has degree 0.
intent: New. Extends the lecture's margin example of two isolated vertices (theory/2026-09-29 p1) to five vertices, to show case (a).
layout: fixed
a @(0, 0); b @(1, 0.4); c @(2, 0); d @(3, 0.4); e @(4, 0)
mark P: a
step: Choose a longest path $P$.
class current: a
step: An edge would be a longer path.
a -- b [class="rejected dashed"]
step: No edges: every vertex has degree $0$.
remove a--b
unclass current: a
class highlight: a b
mark two: a b
```

::: step
We choose a longest path [[fig:t03-two-leaves-case-a#P|$P$]] in $G$. It exists: $G$ is finite, so it has finitely many paths, and a single vertex is a path of length $0$, so there is at least one path. Here $G$ has no edges, so every path is a single vertex, and we take $P = a$.
:::

::: step
Case (a): $P$ has exactly one vertex. Then $G$ has no edge at all. Why: an edge, like the dashed one from $a$ to $b$, would be a path with two vertices. That path is longer than $P$, against our choice of $P$ as a longest path.
:::

::: step
So every vertex of $G$ has degree $0$, which is at most $1$. Now we use the hypothesis that $G$ has at least $2$ vertices: it gives two such vertices, for example [[fig:t03-two-leaves-case-a#two|$a$ and $b$]]. Here: all $5$ vertices have degree $0$. Case (a) does not need that $G$ is acyclic.
:::
::::

Case (b) is a proof by contradiction: a second neighbour of an end of $P$ would either make $P$ longer or close a cycle.

:::: walkthrough {for=thm:two-leaves}
```graph id=t03-two-leaves-case-b widget=stepper
caption: Case (b): an end $u$ of a longest path $P$ has no neighbour besides the next vertex on $P$.
intent: From the lecture sketch of cases (b1) and (b2) (theory/2026-09-29 p1), with the names and positions of t03-longest-path. The vertices w and y are new, so that G is a concrete forest that is more than the path.
layout: fixed
u @(0, 0); p1 [label="$p_1$"] @(1, -0.3); p2 [label="$p_2$"] @(2, 0); p3 [label="$p_3$"] @(3, -0.3); v @(4, 0)
w @(1.5, -1.2); y @(2.5, -1.2)
u -- p1 -- p2 -- p3 -- v; p2 -- w; p2 -- y
mark P: u p1 p2 p3 v u--p1 p1--p2 p2--p3 p3--v
mark u: u
step: A longest path $P$ with ends $u$ and $v$.
class path: u--p1 p1--p2 p2--p3 p3--v
class current: u v
step: $u$ has degree at least $1$.
class highlight: u--p1
step: Suppose $u$ has another neighbour $x$, not on $P$.
x1 [label="$x$" class=muted] @(-0.8, 0.8)
u -- x1 [class="rejected dashed"]
mark x: x1
step: (b1) Then $P$ gets longer: a contradiction.
class path: u--x1
step: (b2) Suppose instead that $x$ lies on $P$.
remove x1
u -- p2 [class="rejected dashed" bend=0.4]
mark x: p2
step: (b2) Then the edge to $x$ closes a cycle: a contradiction.
class cycle: u--p1 p1--p2 u--p2
step: So $u$ and $v$ have degree $1$.
remove u--p2
unclass cycle: u--p1 p1--p2
class highlight: p3--v
```

::: step
Case (b): [[fig:t03-two-leaves-case-b#P|$P$]] has more than one vertex. Then $P$ has two different ends, $u$ and $v$. We claim both have degree exactly $1$. The argument for $v$ is the same as for $u$ with the ends swapped, so we treat only $u$. Here $P$ runs from $u$ to $v$ with $4$ edges, the most in this $G$.
:::

::: step
First, [[fig:t03-two-leaves-case-b#u|$u$]] has degree at least $1$: the next vertex along $P$ is a neighbour of $u$. Here that is $p_1$. It remains to show that $u$ has no other neighbour. Since $G$ is a [[def:graph|graph]] (no loops and no parallel edges), the degree of $u$ is its number of neighbours.
:::

::: step
We argue by contradiction. Suppose $G$ has an edge $\set{u, x}$, where [[fig:t03-two-leaves-case-b#x|$x$]] is not the neighbour of $u$ on $P$. Either $x$ lies outside $P$ or on $P$, and we rule out both. Case (b1): $x$ is not a vertex of $P$, as the dashed edge shows.
:::

::: step
(b1) We prolong $P$ beyond $u$ by the edge $\set{u, x}$. Since $x$ is not on $P$, no vertex repeats, so $P + \set{u, x}$ is a path in $G$. It has one edge more than $P$. This contradicts the choice of $P$ as a longest path. Here: $5$ edges against $4$.
:::

::: step
(b2) Now let [[fig:t03-two-leaves-case-b#x|$x$]] lie on $P$. It is not $u$ itself, and it is not the neighbour of $u$ on $P$. So the part of $P$ between $u$ and $x$ has at least two edges. Here $x$ is $p_2$, and that part is $u, p_1, p_2$ with $2$ edges.
:::

::: step
This part of $P$ and the edge $\set{u, x}$ together form a cycle: the part is a path with at least three vertices, and the edge joins its two ends. The cycle lies in $G$. Here we use the hypothesis that $G$ is [[def:forest-tree|acyclic]]: a contradiction. Here: the cycle $u, p_1, p_2$ of length $3$.
:::

::: step
Both cases are impossible, so $u$ has no neighbour besides the next vertex on $P$. Hence $d_G(u) = 1$. The same argument at the other end gives $d_G(v) = 1$. So $u$ and $v$ are two vertices of degree at most $1$. Here: [[fig:t03-two-leaves-case-b#u|$u$]] and $v$ have degree $1$.
:::
::::

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

```graph id=t03-leaf-example widget=figure
caption: In this forest the leaves are $a$, $e$, $f$ and $g$: each hangs on a single edge. The isolated vertex $z$ has degree $0$, so it is not a leaf; neither is $d$, which has degree $2$.
intent: New; the lecture defines leaves without a figure. Example and non-examples in one forest.
layout: fixed
a [class=highlight] @(0, 0); b @(1, 0); c @(2, 0); d @(3, 0); g [class=highlight] @(4, 0.6); e [class=highlight] @(1, -1); f [class=highlight] @(2, -1)
z [class=muted] @(5, -0.6)
a -- b -- c -- d -- g; b -- e; c -- f
```

::: corollary {#cor:tree-leaf title="Trees have leaves" source="theory/2026-09-29 p3"}
Every tree on at least $2$ vertices has a vertex of degree $1$. (In fact it has at least two.)
:::

::: intuition
The two vertices of degree at most $1$ from [[thm:two-leaves]] cannot have degree $0$, because a
connected graph with an edge has no isolated vertex. So a tree on $n \ge 2$ vertices always has a
[[def:leaf|leaf]] to remove, which is what makes induction on trees work. Example: $K_2$ is a
tree whose two vertices are both leaves.
:::

The lecture states this without proof.
