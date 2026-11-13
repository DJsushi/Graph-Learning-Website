---
title: "Union-find and the running time of Kruskal"
course: algorithms
chapter: mst
order: 7
lectures: [a01]
stage: split
status: reviewed
---

To decide quickly whether $u$ and $v$ lie in the same component, Kruskal's algorithm uses the **disjoint-set** data structure (Galler and
Fischer, 1964)<!-- REVIEW: year corrected from 1954; Galler and Fischer, "An improved equivalence algorithm", CACM 7(5), 1964. Lecture slide 10 (algorithms/01 p10) also says 1954, which is a slip. -->, which maintains a partition of a set into disjoint classes with the operations

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

This proof is a cost count: we price each phase of Kruskal's algorithm, then add the prices.

:::: walkthrough {for=prop:kruskal-complexity}
```graph id=a01-complexity-loop widget=stepper
caption: Kruskal's algorithm on the running example, $n = 8$ vertices and $m = 12$ edges: what each phase costs.
intent: New figure (the lecture, algorithms/01 p11, has no picture). Same graph and vertex names as a01-example-graph, squeezed flat. Marks show the vertices (initialisation), the edges (sorting, loop), the pair e, f (two FIND-SET calls) and the seven accepted edges (UNION calls).
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark V: a b c d e f g h
mark E: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: Initialisation: one MAKE-SET per vertex.
class color1: a b c d e f g h
step: Sorting the edges by weight.
class color2: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: The loop looks at every edge once.
class bold: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: Each iteration calls FIND-SET twice.
mark ef: e f e--f
class current: e--f
class highlight: e f
step: UNION is called only for accepted edges.
mark T: c--f d--e f--h a--b e--f d--g a--c
unclass current: e--f
unclass highlight: e f
class tree: c--f d--e f--h a--b e--f d--g a--c
class rejected: c--e b--d g--h b--c e--g
step: With union by rank, the loop costs $\O(m \log n)$.
class highlight: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: With path compression, the loop costs $\O(m \cdot \alpha(n))$.
class highlight: a b c d e f g h
```

::: step
Lines 1 and 2 of [[alg:kruskal]] create the empty forest $F$ and call `MAKE-SET` once for each of the [[fig:a01-complexity-loop#V|vertices]]. One call takes constant time and there are $n$ calls. So the initialisation takes $\O(n)$. Here: 8 calls.
:::

::: step
Line 3 sorts the [[fig:a01-complexity-loop#E|edges]] by weight. A comparison sort, for example merge sort, orders $m$ items in $\O(m \log m)$ time. We use this known bound. Here: 12 edges, in the order cf, de, fh, ab, ef, dg, ce, ac, bd, gh, bc, eg.
:::

::: step
The loop on line 4 takes the edges one by one in the sorted order, and each edge exactly once. It does not stop early, even when $F$ is already a tree. So it has exactly $m$ iterations. Here: 12 iterations.
:::

::: step
In one iteration, line 5 tests the two ends of the edge: it calls `FIND-SET` once for each end. That is two calls in every iteration, whatever the edge. Here the edge [[fig:a01-complexity-loop#ef|$ef$]] calls it for e and for f. Over the whole loop that is $2m$ calls. Here: 24.
:::

::: step
`UNION` is called on line 7, only for an accepted edge. An accepted edge joins two different components of $F$ and lowers their number by one. We start with $n$ components and never go below 1. So at most $n - 1$ edges are accepted: at most $n - 1$ `UNION` calls. Here: [[fig:a01-complexity-loop#T|7 accepted edges]] and 5 rejected.
:::

::: step
Union by rank keeps every tree of depth $\O(\log n)$, so each `FIND-SET` and `UNION` costs that much. The loop makes $2m$ finds and at most $n - 1$ unions. The graph is connected ([[alg:kruskal]] assumes it), so $m$ is at least $n - 1$: at most three times $m$ operations. So the loop costs $\O(m \log n)$. Here: 31.
:::

::: step
Path compression makes every vertex visited by `FIND-SET` a child of the representative. With union by rank, any sequence of $k$ operations, $n$ of them `MAKE-SET`, takes $\O(k \cdot \alpha(n))$. Ours: 8 `MAKE-SET`, 24 finds, 7 unions: 39. The graph is connected, so $k$ is at most a constant times $m$. So the loop costs $\O(m \cdot \alpha(n))$.
:::
::::

Now the three prices are added, and the sorting term is shown to dominate.

:::: walkthrough {for=prop:kruskal-complexity}
```graph id=a01-complexity-sum widget=stepper
caption: The same example. The vertices pay the initialisation, the edges pay the sorting and the loop.
intent: New figure, same graph as a01-complexity-loop. It shows which part of the graph each term counts, and that the seven tree edges (n - 1) are fewer than the twelve edges (m).
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark V: a b c d e f g h
mark E: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
mark T: c--f d--e f--h a--b e--f d--g a--c
step: Three terms: initialisation, sorting, loop.
class color1: a b c d e f g h
class color2: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: Loop and initialisation are not larger than the sorting.
class tree: c--f d--e f--h a--b e--f d--g a--c
step: The sorting dominates, and $m \le n^2$ turns $\log m$ into $\log n$.
unclass tree: c--f d--e f--h a--b e--f d--g a--c
class bold: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
```

::: step
We add the costs of the three phases from above: $\O(n) + \O(m \log m) + \O(m \log n)$. They count the [[fig:a01-complexity-sum#V|vertices]], the [[fig:a01-complexity-sum#E|edges]] and again the edges. We now show that the middle term, the sorting, is the largest.
:::

::: step
A connected graph has at least $n - 1$ edges, so $n$ is at most $m + 1$. For $m$ at least 2 that is at most $m$ squared, so $\log n$ is at most twice $\log m$. Hence the loop costs $\O(m \log m)$, and $\O(n)$ is no larger. Here: [[fig:a01-complexity-sum#T|7 tree edges]] of 12.
:::

::: step
Now we compare $\log m$ with $\log n$. By [[algorithms/mst/minimum-spanning-tree|the course convention]] $G$ is simple: at most one edge per pair of vertices, so $m \le n^2$. Taking logarithms, $\log m$ is at most twice $\log n$. Hence $\O(m \log m) = \O(m \log n)$: the sorting is the largest term. Here: 12 against 64; 3.58 against 6.
:::
::::

<!-- REVIEW: this proof (and the page) says the loop costs O(m log n) with union by rank, which is correct (2m finds, each O(log n)). Lecture slide 11 (algorithms/01 p11) says O(n log n), a lecture slip; the proof is left as typed. -->

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
