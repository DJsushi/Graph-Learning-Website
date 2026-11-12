---
title: "The Edmonds–Karp algorithm"
course: algorithms
chapter: fast-flows
order: 1
lectures: [a02]
stage: split
status: draft
---

Edmonds and Karp (1972) limit the number of steps of Ford–Fulkerson with a simple rule: **always choose a shortest
[[def:augmenting-path|augmenting path]]**, where the length of every edge is $1$.

::: algorithm {#alg:edmonds-karp title="Edmonds–Karp algorithm" source="algorithms/02 p26"}
```pseudo
EDMONDS-KARP(G, s, t, c):
    foreach e ∈ E do f(e) ← 0                                          // @init
    G_f ← the residual graph for f                                      // @residual
    while there is an augmenting s–t path in G_f do                      // @loop
        P ← the augmenting s–t path in G_f with the minimum number of edges // @path
        f ← AUGMENT(f, c, P)                                             // @augment
        update G_f                                                       // @update
    return f                                                             // @return
```
:::

Such a path can be found by BFS in $\O(m)$ ([[alg:bfs]]), and the remaining steps of an iteration take $\O(n)$, so each iteration takes $\O(m)$. **How many iterations are needed?**

::: intuition {for=alg:edmonds-karp}
Edmonds–Karp is Ford–Fulkerson with one fixed rule: take the augmenting path with the fewest edges, found by BFS from $s$ in $G_f$. Short paths
avoid the zigzag of [[fig:a02-bad-example]]: there the shortest augmenting paths are $s \to a \to t$ and $s \to b \to t$ (two edges each), so
Edmonds–Karp finishes after $2$ augmentations instead of $2 \cdot 10^6$, and it never uses the edge $(a, b)$.
:::

::: pitfall
"Shortest" counts **edges**, not capacities: Edmonds–Karp does not look for the path with the largest bottleneck, and the edge lengths have nothing to do with
the capacities.
:::

```graph id=a02-edmonds-karp-player widget=player
caption: Edmonds–Karp: every augmenting path is a shortest path in the residual graph (found by BFS).
intent: Algorithm player; the state panel shows the BFS distances/levels.
type: directed
algo: edmonds-karp
params: source=s sink=t
show: pseudocode state residual
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```
