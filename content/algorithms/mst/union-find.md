---
title: "Union-find and the running time of Kruskal"
course: algorithms
chapter: mst
order: 7
lectures: [a01]
stage: split
status: draft
---

To decide quickly whether $u$ and $v$ lie in the same component, Kruskal's algorithm uses the **disjoint-set** data structure (Galler and
Fischer, 1954), which maintains a partition of a set into disjoint classes with the operations

- `MAKE-SET(x)`: create a new class $\set{x}$, in time $\O(1)$;
- `UNION(x, y)`: merge the classes containing $x$ and $y$;
- `FIND-SET(x)`: return the representative of the class of $x$.

Each class is stored as a tree rooted at its representative. With **union by rank** (make the representative of the shallower tree a child of
the representative of the deeper one), all trees have depth $\O(\log n)$, so `FIND-SET` and `UNION` take $\O(\log n)$. Adding **path compression**
(make every vertex visited by `FIND-SET` a child of the representative) gives total time $\O(m \cdot \alpha(n))$ for any sequence of $m$ operations of which $n$ are `MAKE-SET`;
here $\alpha$ is the inverse Ackermann function, which is at most $4$ for any conceivable input.

::: proposition {#prop:kruskal-complexity title="Complexity of Kruskal's algorithm" source="algorithms/01 p11"}
Kruskal's algorithm runs in time $\O(m \log n)$.
:::

::: proof
Initialisation takes $\O(n)$, sorting $\O(m \log m)$. The loop has $m$ iterations; each calls `FIND-SET` twice, and over all iterations there are at
most $n - 1$ calls of `UNION`. Even the simple union-by-rank implementation gives $\O(m \log n)$ for the loop, and the sophisticated one
$\O(m \cdot \alpha(n))$. Altogether $\O(m \log m) = \O(m \log n)$, since $m \le n^2$ gives $\log m \le 2 \log n$. The sorting dominates.
:::

::: intuition
Kruskal is "sort, then almost linear": the loop with union-find costs only $\O(m \cdot \alpha(n))$, so the bottleneck is the comparison
sort. For $m = 10^6$ edges, sorting needs about $\log_2 m \approx 20$ comparisons per edge, whereas $\alpha(n) \le 4$. If the edges come
already sorted, or the weights are small integers that can be sorted in linear time, Kruskal runs in $\O(m \cdot \alpha(n))$.
:::
