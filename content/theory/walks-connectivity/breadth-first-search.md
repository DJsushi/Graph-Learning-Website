---
title: "Breadth-first search"
course: theory
chapter: walks-connectivity
order: 4
lectures: [t02]
goal: Run breadth-first search by hand, read the distances off it, and find its layers and its tree.
needs: [theory/walks-connectivity/walks-and-paths, theory/walks-connectivity/connected-components, theory/walks-connectivity/distance]
stage: taught
status: reviewed
---

Start at the ringed vertex $x$ in the graph $G$ below. How many edges do you have to walk to
reach each other vertex? Trying all walks takes long, even in this small graph. Breadth-first
search finds every answer in one sweep.

```graph id=t02-bfs-question widget=figure
caption: A graph $G$ with nine vertices. How far is each vertex from the ringed vertex $x$?
intent: New figure (BFS is not in the lecture scan). The opening question. Same graph as t02-bfs-player, drawn in columns by distance from x like the layer sketch of theory/2026-09-22 p5 (there the layers are rows). Same positions as t02-bfs-layers.
layout: fixed
x @(0, 0) [class=highlight]; a @(1.2, 0.7); b @(1.2, 0); c @(1.2, -0.7); d @(2.4, 0.7); e @(2.4, 0); f @(2.4, -0.7); g @(3.6, 0.35); h @(3.6, -0.35)
x -- a; x -- b; x -- c; a -- d; b -- d; b -- e; c -- e; c -- f; d -- g; e -- g; f -- h; g -- h; e -- f
mark L1: a b c
mark L2: d e f
mark L3: g h
mark route: x c f h x--c c--f f--h
```

The neighbours of $x$ are [[fig:t02-bfs-question#L1|$a$, $b$ and $c$]]. They are at
[[def:distance|distance]] 1. Their neighbours that we have not seen yet are
[[fig:t02-bfs-question#L2|$d$, $e$ and $f$]], at distance 2. Their new neighbours are
[[fig:t02-bfs-question#L3|$g$ and $h$]], at distance 3. For example,
[[fig:t02-bfs-question#route|the route $x, c, f, h$]] shows that $h$ is three steps away.

Breadth-first search (BFS) does exactly this. It keeps a queue, a waiting line: a vertex joins
at the back when it is first seen, and it leaves at the front. So all vertices at distance 1
leave the queue before any vertex at distance 2, and so on.

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

::: intuition {for=alg:bfs}
BFS spreads out from $x$ like a ripple on water: first $x$, then its neighbours, then their new
neighbours. The queue makes it finish one distance before it starts the next. So a vertex is
first seen along a shortest route, and the value it gets is its distance.
:::

Step through BFS on $G$. A vertex gets a badge with its value when it is discovered, and the
edge it is discovered along turns thick. The player also shows the queue at each step.

```graph id=t02-bfs-player widget=player
caption: Breadth-first search from $x$. Vertices are discovered layer by layer; the BFS tree edges are highlighted.
intent: Show BFS layers (distance classes) and the BFS tree; prepares the proof of the bipartite theorem.
algo: bfs
params: source=x
x -- a; x -- b; x -- c; a -- d; b -- d; b -- e; c -- e; c -- f; d -- g; e -- g; f -- h; g -- h; e -- f
```

The player scans the neighbours in one fixed order. Another order can give another tree, but
the values are always the distances.

BFS sorts the vertices by distance. The **layer** $L_i$ is the set of vertices at distance $i$
from $x$. Here [[fig:t02-bfs-layers#L2|the layer $L_2$]] is the third column of the figure below.

```graph id=t02-bfs-layers widget=figure
caption: The layers of $G$ from $x$ are the columns $L_0$ to $L_3$, from left to right. The thick edges form the BFS tree, the dashed edges are the other edges of $G$.
intent: New figure. The result of t02-bfs-player (same parents) on the positions of t02-bfs-question; layers as columns, as in the layer sketch of theory/2026-09-22 p5.
layout: fixed
x @(0, 0) [class=highlight]; a @(1.2, 0.7); b @(1.2, 0); c @(1.2, -0.7); d @(2.4, 0.7); e @(2.4, 0); f @(2.4, -0.7); g @(3.6, 0.35); h @(3.6, -0.35)
x -- a [class=tree]; x -- b [class=tree]; x -- c [class=tree]; a -- d [class=tree]; b -- d [class=dashed]; b -- e [class=tree]; c -- e [class=dashed]
c -- f [class=tree]; d -- g [class=tree]; e -- g [class=dashed]; f -- h [class=tree]; g -- h [class=dashed]; e -- f [class=dashed]
mark L2: d e f
mark up: g d a x g--d d--a a--x
mark inside: e--f g--h
mark between: b--d c--e e--g
```

The edges from each vertex to its parent form the **BFS tree**. Follow
[[fig:t02-bfs-layers#up|the tree path from $g$ up to $x$]] in the figure: it has length 3, the
distance of $g$. On the way it visits one vertex in each earlier layer.

An edge never skips a layer. Let $u$ be at distance $i$. A shortest walk to $u$ plus one more
edge reaches each neighbour of $u$, so that neighbour is at distance at most $i + 1$. The same holds the other way round. So every edge
joins two vertices in one layer, like [[fig:t02-bfs-layers#inside|$ef$ and $gh$]], or in
neighbouring layers, like [[fig:t02-bfs-layers#between|$bd$, $ce$ and $eg$]].

::: pitfall
Mark a vertex when it is **discovered** (appended to the queue), not when it leaves the queue.
Otherwise a vertex can be appended once for each of its neighbours that is processed before it
leaves. In $G$, $d$ would enter the queue twice: from $a$ and from $b$.
:::

::: pitfall
The queue matters. Depth-first search follows one route as far as possible before it backs up.
Its tree need not contain shortest paths. In the triangle below it may go along $x, a, b$ and put
$b$ at depth 2, although $b$ is a neighbour of $x$, at distance 1.
:::

```graph id=t02-bfs-dfs-triangle widget=figure
caption: A depth-first tree in a triangle. The thick path $x, a, b$ puts $b$ at depth 2, but the dashed edge $xb$ shows that $b$ is at distance 1 from $x$.
intent: New figure for the second pitfall: a search that is not breadth-first does not give distances.
layout: fixed
x @(0, 0) [class=highlight]; a @(1, 0.6); b @(2, 0)
x -- a [class=tree]; a -- b [class=tree]; x -- b [class=dashed]
```

## Check yourself

```graph id=t02-ex-bfs-order widget=exercise
task: simulate
algo: bfs
params: source=x
prompt: Run BFS from $x$ and scan the neighbours of each vertex in alphabetical order. Click the vertices in the order in which BFS discovers them.
hint: First come the neighbours of $x$. Then the new neighbours of the first of them, then those of the second.
solution: The order is $c, e, a, f, b, d$. From $x$ we discover $c$ and $e$. From $c$ we discover $a$ and $f$. From $e$ only $b$ is new, because $f$ is already marked. From $a$ we discover $d$. The distances are 1 for $c$ and $e$, 2 for $a$, $f$ and $b$, and 3 for $d$.
layout: fixed
x @(0, 0); c @(1.2, 0.6); e @(1.2, -0.6); a @(2.4, 0.8); f @(2.4, 0); b @(2.4, -0.8); d @(3.6, 0)
x -- c; x -- e; c -- a; c -- f; e -- b; e -- f; a -- d; f -- d; b -- d
```

:::: quiz {#q:t02-bfs-skip-layer}
BFS from $x$ puts a vertex $u$ in the layer $L_1$ and a vertex $w$ in the layer $L_3$. Can $uw$
be an edge of the graph?

- [ ] Yes, if BFS discovers $w$ late.
- [ ] Yes, but only if $u$ is the parent of $w$.
- [x] No, because then $w$ would be at distance at most 2 from $x$.

::: explanation
A walk of length 1 goes from $x$ to $u$. Add the edge $uw$ and we get a walk of length 2 from
$x$ to $w$. So $w$ is at distance at most 2 and lies in $L_0$, $L_1$ or $L_2$, not in $L_3$.
:::
::::

:::: quiz {#q:t02-bfs-tree-edges}
How many edges does the BFS tree of $G$ from $x$ have?

answer: 8

::: explanation
Every vertex except $x$ is discovered exactly once and gets one parent, so it adds one tree
edge. $G$ has 9 vertices, so the tree has 8 edges. The other 5 of the 13 edges of $G$ are the
dashed edges in the layers figure.
:::
::::

## More

Each vertex enters the queue at most once and each edge is scanned at most twice, once from each end, so BFS runs
in time $O(n + m)$ with adjacency lists.

The proof of [[thm:bipartite-odd-cycle|König's characterisation of bipartite graphs]] runs BFS
and puts the even layers on one side and the odd layers on the other.

In the algorithms course, Edmonds–Karp ([[alg:edmonds-karp]]) uses BFS to find shortest
augmenting paths, and the BFS layers are the levels of the level graph ([[def:level-graph]]).

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
