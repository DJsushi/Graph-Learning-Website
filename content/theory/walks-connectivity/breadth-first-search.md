---
title: "Breadth-first search"
course: theory
chapter: walks-connectivity
order: 4
lectures: [t02]
stage: split
status: draft
---

The distances from one vertex to all others are computed by **breadth-first search** (BFS), which
also appears in the proof of the main theorem of this lesson.

::: algorithm {#alg:bfs title="Breadth-first search (BFS)"}
**Input:** a graph $G$ and a start vertex $x$. **Output:** $\mathrm{dist}(x, v)$ for all $v$ and a BFS [[def:forest-tree|tree]].

```pseudo
dist(x) ← 0; mark x; Q ← queue containing x            // @init
while Q is not empty:                                  // @loop
    u ← remove the first vertex of Q                   // @dequeue
    for each neighbour w of u:                         // @scan
        if w is not marked:                            // @test
            mark w; dist(w) ← dist(u) + 1; parent(w) ← u // @discover
            append w to Q                              // @enqueue
```
:::

::: intuition
BFS spreads out from $x$ like a ripple on water: first $x$, then all neighbours of $x$, then all new
neighbours of those, and so on. The first-in-first-out queue makes it finish one distance class before
it starts the next, so the first time a vertex is seen is along a shortest route. Example: on the path
$x - a - b$ it sets $\mathrm{dist}(x) = 0$, $\mathrm{dist}(a) = 1$, $\mathrm{dist}(b) = 2$. Each vertex
enters the queue at most once and each edge is scanned from both ends, so BFS runs in time
$O(n + m)$ with adjacency lists. In the algorithms course, Edmonds–Karp ([[alg:edmonds-karp]]) uses
BFS to find shortest augmenting paths, and the BFS layers are the levels of the level graph
([[def:level-graph]]).
:::

::: pitfall
Mark a vertex when it is **discovered** (appended to the queue), not when it leaves the queue.
Otherwise a vertex can be appended once for each of its neighbours that is processed before it
leaves. And the order matters: depth-first search, which follows one route as far as possible
before backing up, builds a tree whose paths need not be shortest. In the triangle on $x, a, b$ it
may go $x, a, b$ and put $b$ at depth $2$, although $\mathrm{dist}(x, b) = 1$.
:::

BFS discovers the vertices in order of their distance from $x$. The **layer** $i$ is the set
$L_i = \set{v : \mathrm{dist}(x, v) = i}$; the edges $\set{\mathrm{parent}(w), w}$ form the **BFS tree**,
in which the path from any $w \in L_i$ up to $x$ has length exactly $i$ and visits one vertex of each
layer $L_{i-1}, L_{i-2}, \dots, L_0$. By [[prop:distance-metric]], every edge of $G$ joins two vertices in the
same layer or in consecutive layers.

::: remark {title="Why BFS computes distances"}
The queue always holds some vertices with value $i$ followed by some with value $i + 1$, so vertices
leave the queue in non-decreasing order of value.

Each value $\mathrm{dist}(w) = \mathrm{dist}(u) + 1$ is the length of a walk (the tree path) from $x$
to $w$, so it is at least $\mathrm{dist}(x, w)$.

Conversely, by induction on $d = \mathrm{dist}(x, w)$: a vertex $w$ at distance $d \ge 1$ has a
neighbour $u$ at distance $d - 1$, which by induction is reached with value $d - 1$. When $u$ leaves
the queue, $w$ is either marked now with value $d$, or it was marked earlier from a vertex that left
the queue before $u$, hence with value at most $d$.

So BFS reaches exactly the component of $x$, and the value of $w$ is $\mathrm{dist}(x, w)$.
:::
<!-- REVIEW: added the BFS correctness argument; the theorem proof below relies on BFS values being the true distances. -->

```graph id=t02-bfs-player widget=player
caption: Breadth-first search from $x$. Vertices are discovered layer by layer; the BFS tree edges are highlighted.
intent: Show BFS layers (distance classes) and the BFS tree; prepares the proof of the bipartite theorem.
algo: bfs
params: source=x
x -- a; x -- b; x -- c; a -- d; b -- d; b -- e; c -- e; c -- f; d -- g; e -- g; f -- h; g -- h; e -- f
```
