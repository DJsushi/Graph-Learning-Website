---
title: "Minimal cuts in chordal graphs"
course: theory
chapter: chordal
order: 4
lectures: [t04]
stage: split
status: reviewed
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

```graph id=t04-minimal-cut-clique-example widget=figure
caption: Left: a chordal graph; the only minimal cut between $2$ and $4$ is $\set{1, 3}$, and $1$, $3$ are adjacent. Right: $C_4$ is not chordal, and its minimal cut $\set{a, b}$ between $u$ and $v$ is not a clique.
intent: New. Draws the example and the non-example of the intuition above.
height: small
panel: chordal
use: C(6)
1 -- 3 [class=highlight]; 1 -- 4; 1 -- 5
class highlight: 1 3
class source: 2
class sink: 4
panel: $C_4$, not chordal
layout: fixed
u [class=source] @(0, 0); a [class=highlight] @(1, 0.7); v [class=sink] @(2, 0); b [class=highlight] @(1, -0.7)
u -- a; a -- v; v -- b; b -- u
```

The proof has two parts. Part 1 uses only that $X$ is a minimal cut: following a path that avoids the rest of the cut shows that every cut vertex touches both sides.

:::: walkthrough {for=lem:minimal-cut-clique}
```graph id=t04-minimal-cut-neighbours widget=stepper
caption: Each vertex of the minimal cut $X = \set{x, y}$ has a neighbour in $C_u$ and a neighbour in $C_v$.
intent: Built on the lecture sketch (theory/2026-10-06 p2: $u$ left, $v$ right, $X$ with $x$, $y$ in the middle), with the vertices and positions of the figure below the proof, flattened. The path $P$ is new.
layout: fixed
u @(-1.8, 0); p1 [label="$p_1$"] @(-0.9, 0.5); p2 [label="$p_2$"] @(-0.9, -0.5); x @(0, 0.62); y @(0, -0.62); q1 [label="$q_1$"] @(0.9, 0.5); q2 [label="$q_2$"] @(0.9, -0.5); v @(1.8, 0)
u -- p1; u -- p2; p1 -- p2; p1 -- x; p2 -- y
v -- q1; v -- q2; q1 -- x; q2 -- y
mark X: x y
mark Cu: u p1 p2
mark Cv: v q1 q2
mark P: u p1 x q1 v u--p1 p1--x x--q1 q1--v
step: $X = \set{x, y}$ leaves the components $C_u$ and $C_v$.
class highlight: x y
class color1: u p1 p2
class color2: v q1 q2
step: $\set{y}$ alone is not a cut: a $u$–$v$ path $P$ avoids $y$.
class muted: y
class path: u--p1 p1--x x--q1 q1--v
step: $P$ must go through $x$.
class current: x
step: Before $x$, $P$ stays in $C_u$: $p_1$ is a neighbour of $x$ there.
class bold: p1--x
step: From $v$ the same way: $q_1$ is a neighbour of $x$ in $C_v$.
class bold: q1--x
```

::: step
Let [[fig:t04-minimal-cut-neighbours#Cu|$C_u$]] and [[fig:t04-minimal-cut-neighbours#Cv|$C_v$]] be the [[def:component|components]] of $G - X$ that contain $u$ and $v$. They are different, because [[fig:t04-minimal-cut-neighbours#X|$X$]] is a cut. We show: every vertex of $X$ has a neighbour in $C_u$ and one in $C_v$. Here: deleting $x$ and $y$ leaves $\set{u, p_1, p_2}$ and $\set{v, q_1, q_2}$.
:::

::: step
Take a vertex $x$ of $X$ and put it back. By minimality of $X$ (a hypothesis), the smaller set $X \setminus \set{x}$ is not a cut. So $u$ and $v$ stay in one component when we delete only the other vertices of $X$. A $u$–$v$ path [[fig:t04-minimal-cut-neighbours#P|$P$]] runs there. Here: $P$ is $u p_1 x q_1 v$, avoiding $y$.
:::

::: step
$P$ avoids every vertex of $X$ except possibly $x$. If $P$ avoided $x$ too, it would be a $u$–$v$ path in $G - X$. That is impossible, because $X$ is a cut. So $P$ passes through $x$, exactly once, as $P$ is a path.
:::

::: step
Walk along $P$ from $u$. The first vertex of $X$ we meet must be $x$, the only one on $P$. The part before $x$ avoids $X$, is connected and starts at $u$, so it lies in $C_u$. Its last vertex comes right before $x$ on $P$, so it is a neighbour of $x$ in $C_u$. Here: $p_1$.
:::

::: step
Walk along $P$ from $v$ instead. The same argument, with $v$ and $C_v$ in place of $u$ and $C_u$, gives a neighbour of $x$ in $C_v$. Here: $q_1$. The same works for every vertex of $X$. Here for $y$: the path $u p_2 y q_2 v$ gives $p_2$ and $q_2$.
:::
::::

Part 2 is a proof by contradiction: two non-adjacent cut vertices would close a chordless cycle of length at least $4$ through both sides, and only here we use that $G$ is chordal.

:::: walkthrough {for=lem:minimal-cut-clique}
```graph id=t04-minimal-cut-cycle widget=stepper
caption: If $x, y \in X$ were non-adjacent, shortest paths through $C_u$ and through $C_v$ would close a chordless cycle of length $7$. So this graph is not chordal.
intent: Built on the lecture sketch (theory/2026-10-06 p2: $Q_u$ and $Q_v$ through the two sides of $X$), with the vertices and positions of the figure below the proof, flattened. The longer path through $u$ (step 7) and the impossible edge (step 6) are new.
layout: fixed
u @(-1.8, 0); p1 [label="$p_1$"] @(-0.9, 0.5); p2 [label="$p_2$"] @(-0.9, -0.5); x @(0, 0.62); y @(0, -0.62); q1 [label="$q_1$"] @(0.9, 0.5); q2 [label="$q_2$"] @(0.9, -0.5); v @(1.8, 0)
u -- p1; u -- p2; p1 -- p2; p1 -- x; p2 -- y
v -- q1; v -- q2; q1 -- x; q2 -- y
x -- y [class="rejected dashed"]
mark xy: x--y
mark Cu: u p1 p2
mark Cv: v q1 q2
mark Qu: x p1 p2 y x--p1 p1--p2 p2--y
mark Qv: x q1 v q2 y x--q1 q1--v v--q2 q2--y
mark C: x--p1 p1--p2 p2--y x--q1 q1--v v--q2 q2--y
mark long: x p1 u p2 y x--p1 p1--u u--p2 p2--y
step: Suppose $x, y \in X$ are not adjacent.
class current: x y
class color1: u p1 p2
class color2: v q1 q2
step: $Q_u$: a shortest $x$–$y$ path through $C_u$.
class path: x--p1 p1--p2 p2--y
step: $Q_v$: a shortest $x$–$y$ path through $C_v$.
class path: x--q1 q1--v v--q2 q2--y
step: Together they form a cycle $C$ of length $3 + 4 = 7$.
unclass path: x--p1 p1--p2 p2--y x--q1 q1--v v--q2 q2--y
class cycle: x--p1 p1--p2 p2--y x--q1 q1--v v--q2 q2--y
step: Each path needs an inner vertex, so $C$ has length at least $4$.
class highlight: p1 p2 q1 v q2
step: No chord between $C_u$ and $C_v$: an edge like $p_2 q_2$ cannot exist.
unclass highlight: p1 p2 q1 v q2
p2 -- q2 [class="rejected dashed"]
step: A chord inside $Q_u$ would shorten it: the longer path through $u$ has the chord $p_1 p_2$.
remove p2--q2
class bold: p1--u u--p2
step: $C$ is a chordless cycle of length at least $4$: $G$ is not chordal.
unclass bold: p1--u u--p2
class highlight: x--p1 p1--p2 p2--y x--q1 q1--v v--q2 q2--y
```

::: step
We argue by contradiction. Suppose two different vertices $x, y \in X$ are not adjacent: [[fig:t04-minimal-cut-cycle#xy|$xy$]] is not an edge. We will build a cycle that chordality forbids. $C_u$ and $C_v$ are the components of $G - X$ from part 1.
:::

::: step
By part 1, $x$ and $y$ each have a neighbour in [[fig:t04-minimal-cut-cycle#Cu|$C_u$]]. $C_u$ is a component, so it is connected, and a path inside $C_u$ joins these two neighbours. So $x$–$y$ paths with all inner vertices in $C_u$ exist. Among them we choose a shortest one, [[fig:t04-minimal-cut-cycle#Qu|$Q_u$]]. Here: $Q_u = x p_1 p_2 y$.
:::

::: step
The same argument with $C_v$ in place of $C_u$ gives a shortest $x$–$y$ path [[fig:t04-minimal-cut-cycle#Qv|$Q_v$]] with all inner vertices in [[fig:t04-minimal-cut-cycle#Cv|$C_v$]]. Again part 1 supplies the neighbours of $x$ and $y$ in $C_v$. Here: $Q_v = x q_1 v q_2 y$.
:::

::: step
The inner vertices of $Q_u$ lie in $C_u$, those of $Q_v$ in $C_v$. Different components share no vertex. So the two paths meet only in their ends $x$ and $y$. Gluing them at $x$ and $y$ gives a cycle [[fig:t04-minimal-cut-cycle#C|$C$]]. Here its length is $3 + 4 = 7$.
:::

::: step
Each of $Q_u$ and $Q_v$ goes from $x$ to $y$. A path with no inner vertex would be the single edge $xy$, and $xy$ is not an edge. So each path has at least one inner vertex and at least $2$ edges. Together, $C$ has length at least $4$. Here: $3$ and $4$ edges.
:::

::: step
Now we show $C$ has no chord. First, take an inner vertex of $Q_u$ and one of $Q_v$. An edge between them would join $C_u$ and $C_v$ into one component of $G - X$. But they are different components. So no such edge exists. Here: $p_2 q_2$ is not an edge.
:::

::: step
The pair $x, y$ is no chord: $xy$ is not an edge. Every other pair lies on $Q_u$ or on $Q_v$. A chord between two vertices of $Q_u$ is a shortcut: it gives a shorter $x$–$y$ path through $C_u$, against the choice of $Q_u$. Here the [[fig:t04-minimal-cut-cycle#long|longer path through $u$]] has the chord $p_1 p_2$. The same holds for $Q_v$.
:::

::: step
So $C$ is a cycle of length at least $4$ without a chord. Here the hypothesis is used: $G$ is [[def:chordal|chordal]], so it has no such cycle. This contradiction shows that $xy$ is an edge for all $x \ne y$ in $X$. So $X$ is a [[def:clique|clique]]. Here: $xy$ is not an edge, so the figure is not chordal.
:::
::::

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
