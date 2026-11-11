---
title: "Analysis of Edmonds–Karp"
course: algorithms
chapter: fast-flows
order: 3
lectures: [a02]
stage: split
status: draft
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

::: proof
There are $\O(m)$ augmentations for paths of each length $k$ (Lemma 2), and the length of an augmenting path is at most $n - 1$ and never decreases (Lemma 1). So there are
$\O(mn)$ iterations, each taking $\O(m)$. Note that this bound does not depend on the capacities, which may even be real numbers.
:::
