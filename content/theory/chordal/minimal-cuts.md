---
title: "Minimal cuts in chordal graphs"
course: theory
chapter: chordal
order: 4
lectures: [t04]
stage: split
status: draft
---

The proof needs two lemmas. The first one is about how chordal graphs can be cut apart.

::: definition {#def:minimal-cut title="Minimal vertex cut between two vertices" defines="vertex cut, separator, minimal cut" source="theory/2026-10-06 p2"}
Let $u \ne v$ be vertices of $G$. A set $X \subseteq V(G) \setminus \set{u, v}$ is a **cut between $u$ and $v$** if $u$ and
$v$ lie in different [[def:component|components]] of $G - X$. It is a **minimal cut** if no proper subset of $X$ is a cut
between $u$ and $v$.
:::

::: intuition
A cut between $u$ and $v$ is a set of "checkpoints": every way from $u$ to $v$ passes through one of them. It is
minimal if every checkpoint is needed, so putting any single one back reopens a way. Example: in $C_4 = (u, a, v, b)$
the set $\set{a, b}$ is a minimal cut between $u$ and $v$, while $\set{a}$ is not a cut at all. Adjacent $u, v$ have no cut,
since deleting other vertices never removes the edge $uv$.
:::

If $u, v$ are non-adjacent, then $V(G) \setminus \set{u, v}$ is a cut between them, so a minimal cut exists (take an
inclusion-minimal subset that is still a cut).

::: pitfall
**Minimal** (no proper subset is a cut) is not **minimum** (smallest possible size). In the graph below,
$\set{y}$ is a minimum cut between $u$ and $v$, but $\set{x_1, x_2}$ is also a minimal cut: removing only $x_1$ or only $x_2$
leaves a $u$–$v$ path. The lemmas below are about **all** minimal cuts, not only the smallest ones.
:::

```graph id=t04-minimal-not-minimum widget=figure
caption: Both $\set{x_1, x_2}$ and $\set{y}$ are minimal cuts between $u$ and $v$; only $\set{y}$ is a minimum one.
intent: Minimal versus minimum vertex cuts.
height: small
layout: fixed
u @(0, 0); x1 [label="$x_1$" class=highlight] @(1, 0.6); x2 [label="$x_2$" class=highlight] @(1, -0.6); y [class=current] @(2, 0); v @(3, 0)
u -- x1; u -- x2; x1 -- y; x2 -- y; y -- v
```

::: lemma {#lem:minimal-cut-clique title="Minimal cuts in chordal graphs are cliques" source="theory/2026-10-06 p2"}
Let $G$ be a graph, $u \ne v \in V(G)$, and $X \subseteq V(G)$ a minimal cut between $u$ and $v$. If $G$ is chordal, then
$X$ is a clique.
:::

::: intuition
Each vertex of a minimal cut is reachable from both sides. If two of them, $x$ and $y$, were non-adjacent, you could go
from $x$ to $y$ through the $u$-side and come back through the $v$-side, and the shortest such round trip would be a
long cycle with no shortcut. Chordality forbids this, so the cut vertices must be pairwise adjacent. Example: $C_6 = (1, \dots, 6)$ with the
chords $13, 14, 15$ is chordal, and the only minimal cut between $2$ and $4$ is $\set{1, 3}$, an edge. Non-example: in $C_4 = (u, a, v, b)$ the minimal cut
$\set{a, b}$ is not a clique.
:::

:::: proof
Let $C_u$ and $C_v$ be the components of $G - X$ containing $u$ and $v$.

First, **every $x \in X$ has a neighbour in $C_u$ and a neighbour in $C_v$.** Indeed, by minimality $X \setminus \set{x}$
is not a cut, so there is a $u$–$v$ [[def:path-graph|path]] $P$ in $G - (X \setminus \set{x})$. As $X$ is a cut, $P$ passes through $x$. Follow
$P$ from $u$ to its first vertex in $X$, which must be $x$; the part before $x$ lies in $G - X$ and starts at $u$,
hence in $C_u$, so the predecessor of $x$ on $P$ is a neighbour of $x$ in $C_u$. Symmetrically (follow $P$ from $v$)
$x$ has a neighbour in $C_v$.

Now suppose, for a contradiction, that $x \ne y \in X$ with $xy \notin E(G)$. Since $C_u$ is [[def:component|connected]] and both $x$ and
$y$ have neighbours in $C_u$, there are $x$–$y$ paths whose inner vertices all lie in $C_u$. Let $Q_u$ be a
**shortest** such path, and similarly $Q_v$ a shortest $x$–$y$ path with all inner vertices in $C_v$. Then
$C := Q_u \cup Q_v$ is a cycle (the two paths share only $x$ and $y$, since $C_u \cap C_v = \emptyset$).

- $C$ has length at least $4$: $xy \notin E(G)$, so each of $Q_u, Q_v$ has at least one inner vertex, i.e. at least
  $2$ edges.
- $C$ has no chord. A chord between an inner vertex of $Q_u$ and an inner vertex of $Q_v$ is impossible, as
  $C_u$ and $C_v$ are different components of $G - X$. The pair $x, y$ is not an edge. A chord joining two
  vertices of $Q_u$ would give a shorter $x$–$y$ path with inner vertices in $C_u$, contradicting the choice of
  $Q_u$; similarly for $Q_v$.

So $C$ is a chordless cycle of length at least $4$ in the chordal graph $G$, a contradiction. Hence $xy \in E(G)$
for all $x, y \in X$.
::::

```graph id=t04-minimal-cut widget=figure
caption: If two vertices $x, y$ of a minimal cut $X$ were non-adjacent, shortest $x$–$y$ paths through $C_u$ and through $C_v$ would form a chordless cycle of length at least 4.
intent: Transcription of the lecture sketch.
layout: fixed
u @(-2, 0); p1 @(-1, 0.8); p2 @(-1, -0.8); x @(0, 1) ; y @(0, -1); q1 @(1, 0.8); q2 @(1, -0.8); v @(2, 0)
u -- p1; u -- p2
v -- q1; v -- q2
x -- p1 [class=cycle]; p1 -- p2 [class=cycle]; p2 -- y [class=cycle]; x -- q1 [class=cycle]; q1 -- v [class=cycle]; v -- q2 [class=cycle]; q2 -- y [class=cycle]
x -- y [class="rejected dashed"]
group X: x y [label="$X$"]
group Cu: u p1 p2 [label="$C_u$"]
group Cv: v q1 q2 [label="$C_v$"]
```
