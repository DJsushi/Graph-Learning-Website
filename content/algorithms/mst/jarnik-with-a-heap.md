---
title: "Jarník's algorithm with a priority queue"
course: algorithms
chapter: mst
order: 9
lectures: [a01]
stage: split
status: draft
---

**Correctness:** the chosen edge is the lightest edge across the cut $(V(T), V \setminus V(T))$, which no blue edge crosses: blue rule.

The question is how to find the lightest edge leaving $T$. With an **adjacency matrix**, maintain for every vertex not in $T$ its closest neighbour
in $T$ and the distance to it; in each of the $n - 1$ iterations choose the closest vertex in $\O(n)$ and update the distances of its neighbours in
$\O(n)$. Overall $\O(n^2)$, which is optimal for dense graphs given as matrices. With a **priority queue**:

::: algorithm {#alg:jarnik-heap title="Jarník's algorithm with a priority queue" source="algorithms/01 p14"}
```pseudo
INIT(Q)                                         // @init
foreach v ∈ V(G) do                             // @initloop
    key[v] ← ∞; pred[v] ← Nil                   // @initkey
    INSERT(Q, v)                                // @insert
key[s] ← 0                                      // @source
while not IS-EMPTY(Q) do                        // @loop
    u ← EXTRACT-MIN(Q)                          // @extract
    foreach edge {u, v} such that v is in Q do  // @scan
        if w(u, v) < key[v] then                // @test
            DECREASE-KEY(Q, v, w(u, v))         // @decrease
            pred[v] ← u                         // @pred
```
:::

::: intuition
Every vertex outside the tree waits in the priority queue with the weight of its cheapest known connection to the tree as its key.
`EXTRACT-MIN` takes the vertex with the cheapest connection, i.e. the lightest edge leaving the tree. When $u$ joins the tree, only
the edges at $u$ can give cheaper connections, so only they are scanned. Example: starting from $a$ in the running example, the keys
of $b$ and $c$ become $4$ and $8$; after $b$ is extracted, $d$ gets key $9$, while $c$ keeps $8$, as $w(bc) = 11$ is no improvement.
:::

::: pitfall
Jarník's algorithm looks like Dijkstra's shortest-path algorithm, but the keys differ. Jarník sets $\mathrm{key}[v] \leftarrow w(u, v)$,
the weight of a single edge; Dijkstra sets it to the length of the path from $s$ through $u$ to $v$. With Dijkstra's keys the tree is a
shortest-path tree, which in general is not an MST.
:::

Here `key[v]` is the weight of the lightest edge from $v$ to the current tree, and the MST consists of the edges $\set{v, \mathrm{pred}[v]}$.
`DECREASE-KEY` is called at most $m$ times and `EXTRACT-MIN` $n$ times, so the running time is
$\O(m \cdot t_{\text{DECREASE-KEY}} + n \cdot t_{\text{EXTRACT-MIN}})$:

| operation | array | binary heap | binomial heap | Fibonacci heap |
|-----------|-------|-------------|---------------|----------------|
| `INSERT` | $1$ | $\log n$ | $\log n$ | $1$ |
<!-- REVIEW: slide p15 lists INSERT on an array as n; an array indexed by vertex inserts in O(1). Kept 1; the O(n^2) total is the same either way. -->
| `EXTRACT-MIN` | $n$ | $\log n$ | $\log n$ | $\log n$ (amortised) |
| `DECREASE-KEY` | $1$ | $\log n$ | $\log n$ | $1$ (amortised) |
| `IS-EMPTY` | $1$ | $1$ | $1$ | $1$ |
| **Jarník total** | $\O(n^2)$ | $\O(m \log n)$ | $\O(m \log n)$ | $\O(m + n \log n)$ |

```graph id=a01-jarnik-player widget=player
caption: Jarník's algorithm from $a$. The state panel shows the priority queue with the current keys.
intent: Algorithm player with heap state.
algo: jarnik
params: source=a
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```

::: definition {#def:dense-sparse title="Dense and sparse graphs" defines="dense graph, sparse graph" source="algorithms/01 p16"}
A **dense** graph is a graph where the number of edges is close to the maximum possible number of edges; a **sparse** graph has only few edges.
:::

::: intuition
A connected graph has between $n - 1$ and $\binom{n}{2}$ edges, and the notion is informal: there is no sharp threshold between these
extremes. As a rule of thumb, $m = \Theta(n^2)$ is dense (for example $K_n$) and $m = \O(n)$ is sparse (trees, grids, road networks). The
distinction decides which algorithm to use: for $m = \Theta(n^2)$ the $\O(n^2)$ array version of Jarník is already linear in the input size,
while sparse graphs are where the extra $\log n$ factors hurt.
:::

For dense graphs, where $m = \Omega(n \log n)$, Jarník's algorithm with Fibonacci heaps runs in time $\O(m)$, which is asymptotically optimal (every
edge must be looked at). **Therefore we mostly focus on the performance on sparse graphs.**
