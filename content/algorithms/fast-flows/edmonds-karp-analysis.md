---
title: "Analysis of Edmonds–Karp"
course: algorithms
chapter: fast-flows
order: 3
lectures: [a02]
stage: split
status: reviewed
---

Write $d_f(v)$ for the distance from $s$ to $v$ in $G_f$.

::: lemma {#lem:ek-monotone title="Distances never decrease" source="algorithms/02 p31"}
**(Lemma 1)** The length of the shortest augmenting path never decreases. More precisely, if $f'$ is obtained from $f$ by augmenting along a shortest augmenting path, then
$d_{f'}(v) \ge d_f(v)$ for all $v$.
:::

::: intuition
Augmenting along a shortest path removes some edges that go one level up and adds only edges that go one level **down** (the reverses of path
edges). Deleting edges cannot make distances shorter, and edges pointing back towards $s$ cannot create a shortcut away from it. Example: in
[[ex:ford-fulkerson-demo]], after augmenting along $s \to a \to d \to t$ the new edges are $(a, s)$, $(d, a)$, $(t, d)$, all pointing towards $s$.
:::

Proof by comparison with the levels of $G_f$: every edge of the new residual graph climbs at most one level, so no path reaches a vertex early.

:::: walkthrough {for=lem:ek-monotone}
```graph id=a02-eka-monotone widget=stepper
caption: The lecture network as $G_f$ with $f = 0$ (labels are residual capacities), and the change after augmenting along $s, a, d, t$. Vertices of one level share a fill.
intent: New figure. It uses the network of the Ford-Fulkerson demo of the lecture (algorithms/02 p15-21) and the augmenting path of ex:ford-fulkerson-demo; the lecture does not draw this proof on p30.
type: directed
layout: fixed
edge-label: "{c}"
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
class color1: s
class color2: a b
class color3: c d
class color4: t
step: $G_f$ with its levels $L_0, \dots, L_3$.
step: The augmenting path $P$ is a shortest path, so it climbs one level per edge.
class path: s->a a->d d->t
mark P: s->a a->d d->t
step: Edges of $P$ may disappear.
remove a->d
set s->a [c=2]
set d->t [c=2]
step: Reverse edges of $P$ may appear, and they fall one level.
a -> s [c=8 class=dashed bend=0.3]
d -> a [c=8 class=dashed bend=0.3]
t -> d [c=8 class=dashed bend=0.3]
mark new: a->s d->a t->d
step: Every edge of $G_{f'}$ climbs at most one level of $d_f$.
unclass path: s->a d->t
class bold: a->s d->a t->d
step: So a path in $G_{f'}$ to $v$ has at least $d_f(v)$ edges.
unclass bold: a->s d->a t->d
class path: s->b b->d d->t
```

::: step
Fix the residual graph $G_f$ and the distances $d_f$ from $s$. The vertices at distance $i$ form the level $L_i$. Here $f$ is 0, so $G_f$ is the network, and the levels are $s$; $a$ and $b$; $c$ and $d$; $t$, at distances 0, 1, 2 and 3.
:::

::: step
Along every edge of $G_f$ the distance grows by at most one: we reach $x$, then take the edge to $y$. The path [[fig:a02-eka-monotone#P|$P$]] is shortest, as the lemma assumes, so it has $d_f(t)$ edges, and each edge climbs exactly one level. Here: $P$ is $s, a, d, t$, and $t$ is on level 3.
:::

::: step
Augmenting changes $G_f$ only on the edges of $P$. A saturated edge leaves the residual graph. Removing an edge removes paths and creates none, so it cannot shorten any distance. Here: augmenting by 8 saturates $(a, d)$, and $(s, a)$ and $(d, t)$ drop to residual capacity 2.
:::

::: step
For an edge of $P$, the reverse edge may be new in $G_{f'}$. Its tail lies on the level where the original edge ended. Since $P$ climbs from $L_i$ to $L_{i+1}$, the [[fig:a02-eka-monotone#new|new edges]] fall from $L_{i+1}$ to $L_i$. Here: $(a, s)$, $(d, a)$ and $(t, d)$ fall from level 1 to 0, 2 to 1, and 3 to 2.
:::

::: step
We claim $d_f(y) \le d_f(x) + 1$ for every edge $(x, y)$ of $G_{f'}$. An old edge was in $G_f$, where this holds by the first remark. For a new edge $d_f(y) = d_f(x) - 1$. Here: old $(a, b)$ stays on level 1, and new $(d, a)$ goes from level 2 to 1.
:::

::: step
Take any $s$–$v$ path in $G_{f'}$. It starts at $s$ with $d_f$ zero, and $d_f$ grows by at most one per edge. At $v$ it has the value $d_f(v)$, so the path has at least that many edges. Hence $d_{f'}(v) \ge d_f(v)$. Here: $s, b, d, t$ is a shortest path to $t$ in $G_{f'}$, with 3 edges.
:::
::::

::: proof
Consider $G_f$ and its level graph $L$, with levels given by $d_f$. How does augmenting along a shortest path $P$ change $G_f$?

- An edge $e \in P$ may be deleted from $G_f$ (if it becomes saturated); this can only delete edges.
- For $e \in P$, the reverse edge $e^R$ may be added to $G_f$ (if it is not there yet). Since $P$ is a shortest path, its edges go from $L_i$ to $L_{i+1}$, so the newly created
  edges go from $L_{i+1}$ to $L_i$.

So every edge $(x, y)$ of $G_{f'}$ satisfies $d_f(y) \le d_f(x) + 1$: for old edges this is the BFS property, for new edges $d_f(y) = d_f(x) - 1$. Along any path of $G_{f'}$
from $s$, $d_f$ therefore grows by at most one per edge, so any $s$–$v$ path in $G_{f'}$ has at least $d_f(v)$ edges, i.e. $d_{f'}(v) \ge d_f(v)$. (Informally: the new edges point
backwards in the level graph and cannot create shortcuts.)
:::

::: lemma {#lem:ek-phase title="Augmentations of the same length" source="algorithms/02 p32"}
**(Lemma 2)** After at most $m$ shortest-path augmentations of length $k$, the length of the shortest augmenting path must increase.
:::

::: intuition
While the distance stays $k$, all augmenting paths of length $k$ use edges of one fixed level graph, and every augmentation removes at least one of its
edges for good (the bottleneck edge, which cannot come back, as new edges point down). A level graph has at most $m$ edges, so these augmentations
run out after at most $m$ rounds. Example: in [[fig:a02-bad-example]], the two shortest paths of length $2$ are used up by $2$ augmentations, each saturating
both of its edges; afterwards no augmenting path is left at all.
:::

Proof by counting: while the shortest length stays $k$, only the fixed level graph matters, it loses at least one edge per augmentation, and it gains none.

:::: walkthrough {for=lem:ek-phase}
```graph id=a02-eka-phase widget=stepper
caption: The lecture network at the moment the shortest augmenting path first has length 3 (labels are residual capacities then). Muted edges are not in the level graph $L$. Only the reverse edges of the first augmentation are drawn.
intent: New figure. It uses the network of the Ford-Fulkerson demo of the lecture (algorithms/02 p15-21); the three augmentations of length 3 are chosen here. The lecture does not draw this proof on p31.
type: directed
layout: fixed
edge-label: "{c}"
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2 class=muted]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9 class=muted]; c -> t [c=10]; d -> t [c=10]
class color1: s
class color2: a b
class color3: c d
class color4: t
step: The level graph $L$ at the moment the length first is $k$.
step: New edges are reverses of path edges, so they fall.
a -> s [class=dashed bend=0.3]
d -> a [class=dashed bend=0.3]
t -> d [class=dashed bend=0.3]
mark new: a->s d->a t->d
step: A path of length $k$ uses only edges of $L$.
class path: s->b b->d d->t
mark Q: s->b b->d d->t
step: Each augmentation removes a bottleneck edge of $L$ for good.
unclass path: s->b b->d d->t
remove a->d
remove d->t
remove s->a
step: $L$ has at most $m$ edges, so at most $m$ augmentations fit.
unclass muted: d->c
class path: s->b b->d d->c c->t
```

::: step
Take the first moment when the shortest augmenting path has length $k$. Fix the distances and the level graph $L$ of $G_f$ then: the edges that climb one level. Here $k$ is 3, and $L$ has 7 of the 9 edges; the muted $(a, b)$ and $(d, c)$ stay inside a level.
:::

::: step
We induct over the augmentations of length $k$, with $d$ fixed. Each path is shortest, so Lemma 1's argument applies: new edges are reverses of path edges and fall one level of $d$. So every residual edge climbs at most one level. Here: augmenting along $s, a, d, t$ adds [[fig:a02-eka-phase#new|$(a, s)$, $(d, a)$, $(t, d)$]], all falling.
:::

::: step
A path of length $k$ reaches $t$ at level $k$ and each edge climbs at most one level, so each climbs exactly one. Climbing edges are never new, since new edges fall. So each was there at the fixed moment: it lies in $L$. Here: the next path [[fig:a02-eka-phase#Q|$s, b, d, t$]] uses edges of $L$ only.
:::

::: step
Each augmentation saturates a bottleneck edge $e = (u, v)$ of its path, with $u$ in $L_i$ and $v$ in $L_{i+1}$, and removes it. It cannot return: it would have to come back as a reverse edge, and those fall. Here: paths $s,a,d,t$, then $s,b,d,t$, then $s,a,c,t$ have bottlenecks 8, 2, 2 and remove $(a, d)$, $(d, t)$, $(s, a)$.
:::

::: step
So $L$ gains no edge and loses at least one per augmentation. $L$ has at most $m$ edges: for each $e$ in $E$, at most one of $e$, $e^R$ climbs. After at most $m$ augmentations no path of length $k$ is left, and none shorter (Lemma 1). Here: 3 suffice; then the shortest path has 4 edges.
:::
::::

::: proof
Consider the moment when the shortest augmenting path first has length $k$, and fix the levels $d(v) = d_f(v)$ and the level graph $L$ of $G_f$ at this moment. As long as
the length stays $k$, the argument of Lemma 1 shows (by induction over the augmentations) that every residual edge $(x, y)$ satisfies $d(y) \le d(x) + 1$, and that the only
edges added are reverses of path edges, which go one level **down**. An augmenting path of length $k$ must go up exactly one level in each step, so it consists of edges going up
one level; these are never added, so they were present at the fixed moment, i.e. they are edges of $L$.

Each augmentation saturates at least one **bottleneck edge** $e = (u, v)$ of the path, $u \in L_i$, $v \in L_{i+1}$, which is removed from $G_f$, and it can never return (it
would have to be added as a reverse edge, but added edges go down). No new edges are added to $L$. The level graph $L$ has at most $m$ edges (for each $e \in E$ at most one
of $e, e^R$ goes up a level), so after at most $m$ such augmentations no path of length $k$ (or shorter, by Lemma 1) remains.
:::

::: theorem {#thm:edmonds-karp title="Running time of Edmonds–Karp" source="algorithms/02 p33"}
The Edmonds–Karp algorithm runs in time $\O(m^2 n)$.
:::

::: intuition
Count in two layers: the shortest-path length takes at most $n - 1$ values and never decreases ([[lem:ek-monotone]]), and each value is used by at most $m$
augmentations ([[lem:ek-phase]]); each augmentation is a BFS. The capacities do not appear anywhere, which is the point: on [[fig:a02-bad-example]] the bound
does not grow with $C = 10^6$, unlike that of [[thm:ford-fulkerson-analysis]].
:::

Proof by counting: the number of iterations times the cost of one iteration.

:::: walkthrough {for=thm:edmonds-karp}
```graph id=a02-eka-time widget=stepper
caption: A run of Edmonds–Karp on the lecture network, labels $f/c$. Thick edges are the augmenting paths of the current length; the run needs 4 augmentations, and the flow value grows from 0 to 19.
intent: New figure. It uses the network of the Ford-Fulkerson demo of the lecture (algorithms/02 p15-21) and one possible run of Edmonds-Karp on it; the lecture does not draw this proof on p32.
type: directed
layout: fixed
edge-label: "{f}/{c}"
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
s -> a [f=0 c=10]; s -> b [f=0 c=10]; a -> b [f=0 c=2]; a -> c [f=0 c=4]; a -> d [f=0 c=8]; b -> d [f=0 c=9]; d -> c [f=0 c=9]; c -> t [f=0 c=10]; d -> t [f=0 c=10]
step: For each length $k$ at most $m$ augmentations.
class path: s->a s->b a->c a->d b->d c->t d->t
set s->a [f=10]
set s->b [f=2]
set a->c [f=2]
set a->d [f=8]
set b->d [f=2]
set c->t [f=2]
set d->t [f=10]
step: The length grows and stays at most $n - 1$.
unclass path: s->a s->b a->c a->d b->d c->t d->t
class path: s->b b->d d->c c->t
set s->b [f=9]
set b->d [f=9]
set d->c [f=7]
set c->t [f=9]
step: At most $m(n - 1)$ iterations.
unclass path: s->b b->d d->c c->t
class bold: s->a s->b a->c a->d b->d d->c c->t d->t
step: One BFS per iteration, $\O(m)$ each.
unclass bold: s->a s->b a->c a->d b->d d->c c->t d->t
class visited: s a b c d t
```

::: step
Lemma 2 says: for each fixed length $k$ there are at most $m$ augmentations. Here $m$ is 9. The first length is 3, and the thick edges are the level graph for that length: three augmentations use them, which is at most 9, and they bring the flow to value 12.
:::

::: step
A shortest path has no repeated vertex (a repeat could be cut out), so its length is at most $n - 1$ and, by Lemma 1, never decreases. So there are at most $n - 1$ lengths, one block after another. Here: $n$ is 6, so lengths 1 to 5 are possible; the run goes from 3 to 4.
:::

::: step
Multiply: at most $n - 1$ lengths, at most $m$ augmentations for each, so at most $m(n - 1)$ iterations, which is $\O(mn)$. Here: 9 times 5 is 45, and the run used 4. The thick edges carry the final flow of value 19.
:::

::: step
Each iteration finds its shortest path by BFS in $G_f$ ([[alg:bfs]]), which scans each edge once: $\O(m)$. Augmenting and updating touch at most $n - 1$ path edges, and $n = \O(m)$ as $G$ is connected ([[algorithms/flows/flow-networks|convention]]), so an iteration costs $\O(m)$. With $\O(mn)$ iterations this gives $\O(m^2 n)$. No capacity occurs in the count, so real capacities are fine.
:::
::::

::: proof
There are $\O(m)$ augmentations for paths of each length $k$ (Lemma 2), and the length of an augmenting path is at most $n - 1$ and never decreases (Lemma 1). So there are
$\O(mn)$ iterations, each taking $\O(m)$. Note that this bound does not depend on the capacities, which may even be real numbers.
:::
