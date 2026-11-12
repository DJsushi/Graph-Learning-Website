---
title: "Borůvka's algorithm"
course: algorithms
chapter: mst
order: 10
lectures: [a01]
stage: split
status: draft
---

Borůvka (1926), designing the electrical network of Moravia, grew **blue trees everywhere at once**: start with each vertex as a one-vertex blue
tree; for each tree choose the lightest edge leaving it (it belongs to the [[def:mst|MST]] by the cut property); merge the trees joined by the
selected edges; repeat until a single tree remains. Each
iteration of the outer loop is called a **phase**.

::: algorithm {#alg:boruvka title="Borůvka's algorithm" source="algorithms/01 p17–18"}
**Assumption:** all edge weights are distinct.

```pseudo
F ← (V, ∅)                                        // forest of one-vertex trees     @init
while F has more than one component do            // one phase                      @phase
    foreach component C of F do                   //                                @component
        S ← ∅                                     // lightest edges leaving C       @collect
        foreach v ∈ V(C) do
            e_v ← the lightest edge {v, w} with w ∉ C
            S ← S ∪ {e_v}
        F ← F ∪ (the lightest edge in S)          //                                @add
```
:::

::: intuition
Kruskal and Jarník add one edge at a time; Borůvka lets every component pick its own lightest exit, all at once. Each pick is safe by the
cut property for the cut around that component, so all picks can be added together. On the running example, phase 1 picks $ab$, $cf$, $de$,
$dg$ and $fh$ (each vertex its lightest edge, with repetitions), leaving the components $\set{a, b}$, $\set{c, f, h}$, $\set{d, e, g}$. In
phase 2, $\set{a, b}$ picks $ac$ ($8$), and both $\set{c, f, h}$ and $\set{d, e, g}$ pick $ef$ ($5$): one tree remains. The components work
independently, which makes the algorithm easy to parallelise.
:::

In a phase, all components choose their edges with respect to the **same** forest $F$ (from the beginning of the phase), and then all chosen
edges are added. Each chosen edge is the lightest edge across the cut $(C, V \setminus C)$, so by the cut property **all chosen edges belong to
$M$**; in particular they form a forest, and adding them all is safe.

::: pitfall
The assumption of distinct weights is essential here. In a triangle with all weights equal to $1$, each vertex might choose a different edge, and
the three chosen edges form a cycle. (With a consistent tie-breaking rule, as described above, the problem disappears.)
:::

::: proposition {#prop:boruvka-complexity title="Complexity of Borůvka's algorithm" source="algorithms/01 p19"}
Borůvka's algorithm has at most $\log n$ phases, each taking time $\O(m)$; in total $\O(m \log n)$.
:::

::: proof
At the beginning there are $n$ components. In a phase every component chooses an edge and is merged with at least one other component, so the
number of components at least halves: at most $n/2^i$ components remain after phase $i$, and after at most $\log n$ phases only one is left. In
each phase, computing the components and cycling through all edges to select the lightest edge leaving each component takes $\O(m)$ (label each
vertex by its component, e.g. by a DFS of $F$, then scan all edges once).
:::

::: intuition
Every component merges with at least one other, so each new component consists of at least two old ones, and their number at least halves.
Often it drops much faster, as several components may merge into one. Example: with $8$ vertices there are at most $3$ phases
($8 \to 4 \to 2 \to 1$ components); the running example needs only $2$. Each phase is one pass over all edges, hence $\O(m)$ per phase.
:::

```graph id=a01-boruvka-player widget=player
caption: Borůvka's algorithm: in phase 1 every vertex picks its lightest edge; in phase 2 the three resulting trees pick theirs.
intent: Algorithm player showing phases; components coloured with color1..color8.
algo: boruvka
layout: fixed
a @(0, 0.5); b @(1, 1.6); c @(1, -0.6); d @(2.6, 1.6); e @(2.6, 0.3); f @(2.1, -1.1); g @(4.1, 1.3); h @(3.7, -1.1)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
```
