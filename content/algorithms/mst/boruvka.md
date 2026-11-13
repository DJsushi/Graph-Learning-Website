---
title: "Borůvka's algorithm"
course: algorithms
chapter: mst
order: 10
lectures: [a01]
stage: split
status: reviewed
---

Borůvka (1926), designing the electrical network of Moravia, grew **trees everywhere at once**: start with each vertex as a one-vertex
tree; for each tree choose the lightest edge leaving it (it belongs to the [[def:mst|MST]] by the cut property); merge the trees joined by the
selected edges; repeat until a single tree remains. Each
iteration of the outer loop is called a **phase**.<!-- REVIEW: removed "blue" from the intro (the lecture's colour); the player draws each component in its own colour. -->

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
the three chosen edges form a cycle. (With a consistent tie-breaking rule, as described in [[algorithms/mst/distinct-weights|the page on distinct weights]], the problem disappears.)<!-- REVIEW: "as described above" pointed at nothing on this page; the rule (compare pairs of weight and edge index) is on the distinct-weights page. -->
:::

::: proposition {#prop:boruvka-complexity title="Complexity of Borůvka's algorithm" source="algorithms/01 p19"}
Borůvka's algorithm has at most $\log n$ phases, each taking time $\O(m)$; in total $\O(m \log n)$.
:::

This proof has two parts. First we count the phases: a halving argument. Then we price one phase and multiply.

:::: walkthrough {for=prop:boruvka-complexity}
```graph id=a01-boruvka-halving widget=stepper
caption: Borůvka's algorithm on the running example: 8 one-vertex components become 3 after phase 1 and 1 after phase 2.
intent: New figure (the lecture, algorithms/01 p19, has no picture). Same graph and vertex names as a01-example-graph, squeezed flat. Marks show the vertices, the five edges chosen in phase 1 and the two edges chosen in phase 2.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark V: a b c d e f g h
mark P1: a--b c--f d--e d--g f--h
mark P2: a--c e--f
step: Start: every vertex is one component.
class color1: a
class color2: b
class color3: c
class color4: d
class color5: e
class color6: f
class color7: g
class color8: h
step: Phase 1: every component chooses its lightest leaving edge.
class current: a--b c--f d--e d--g f--h
step: Adding the chosen edges merges each component with another one.
unclass color2: b
class color1: b
unclass color6: f
unclass color8: h
class color3: f h
unclass color5: e
unclass color7: g
class color4: e g
unclass current: a--b c--f d--e d--g f--h
class tree: a--b c--f d--e d--g f--h
step: Each new component holds at least two old ones: at most half as many.
class bold: a--b c--f d--e d--g f--h
step: Phase 2 halves again, and so on after every phase.
class current: a--c e--f
unclass color3: c f h
unclass color4: d e g
class color1: c d e f g h
unclass current: a--c e--f
class tree: a--c e--f
step: Few components are left, so few phases are needed.
class highlight: a b c d e f g h
```

::: step
At the start $F$ has no edges, so each of the [[fig:a01-boruvka-halving#V|vertices]] is its own component: we have $n$ components. Here: 8.
:::

::: step
In a phase, every component $C$ chooses the lightest edge leaving it. Such an edge exists: $G$ is connected, so while two or more components remain, an edge joins $C$ to the rest. Here: phase 1 chooses [[fig:a01-boruvka-halving#P1|five edges]], some of them twice.
:::

::: step
The other end of a chosen edge lies in a different component. When we add the edge, $C$ and that component become one. So every component is merged with at least one other. Here: the five edges join the vertices into the three trees $\set{a, b}$, $\set{c, f, h}$ and $\set{d, e, g}$.
:::

::: step
Every new component consists of at least two old components, and each old component lies in exactly one new one. So the old number is at least twice the new number: the count at least halves. Here: 3 new components against 8 old, and $3 \le 8/2$.
:::

::: step
Claim: after phase $i$ at most $n/2^i$ components remain. For $i = 0$ there are $n$. If phase $i$ leaves at most $n/2^i$, phase $i + 1$ halves that, by the last step. Here: phase 2 chooses [[fig:a01-boruvka-halving#P2|$ac$ and $ef$]] and leaves 1 component, against a bound of 2.
:::

::: step
Component counts are whole numbers, so a phase leaves at most half the old count, rounded down. For $i = \lfloor \log n \rfloor$ the bound $n/2^i$ is below 2, so one component is left and the loop stops. Hence at most $\lfloor \log n \rfloor \le \log n$ phases. Here: $\log 8 = 3$; 2 phases are needed.
:::
::::

Now we price one phase. We use that $G$ is connected, so $n - 1 \le m$.

:::: walkthrough {for=prop:boruvka-complexity}
```graph id=a01-boruvka-phase-cost widget=stepper
caption: The start of phase 2 on the running example: 3 components, 5 edges of the forest $F$, 6 edges inside components and 6 edges between them.
intent: New figure (the lecture, algorithms/01 p19, has no picture). Same graph as a01-boruvka-halving, at the start of phase 2. Marks show the forest edges, the edges between components and the two edges chosen in this phase.
layout: fixed
a @(0, 0.7); b @(0.8, 1.4); c @(0.8, 0); d @(2, 1.4); e @(2, 0.7); f @(2, 0); g @(3.2, 1.4); h @(3.2, 0)
a -- b [w=4]; a -- c [w=8]; b -- c [w=11]; b -- d [w=9]; c -- e [w=7]; c -- f [w=1]
d -- e [w=2]; d -- g [w=6]; e -- f [w=5]; e -- g [w=12]; f -- h [w=3]; g -- h [w=10]
mark F: a--b c--f f--h d--e d--g
mark I: a--b c--f f--h d--e d--g e--g
mark X: a--c b--c b--d c--e e--f g--h
mark P: a--c e--f
step: Label every vertex with its component.
class color1: a b
class color2: c f h
class color3: d e g
class tree: a--b c--f f--h d--e d--g
step: Scan all edges: skip those inside a component.
class muted: a--b c--f f--h d--e d--g e--g
step: An edge between components updates two stored minima.
class current: a--c b--c b--d c--e e--f g--h
step: Each component keeps its lightest leaving edge.
unclass current: b--c b--d c--e g--h
class highlight: a--c e--f
step: We add the chosen edges to F and merge the components.
unclass current: a--c e--f
unclass highlight: a--c e--f
class tree: a--c e--f
unclass color2: c f h
unclass color3: d e g
class color1: c d e f g h
step: All parts of a phase cost O(n) or O(m), hence O(m) in total.
class bold: a--b a--c b--c b--d c--e c--f d--e d--g e--f e--g f--h g--h
step: At most log n phases of cost O(m) each.
class highlight: a b c d e f g h
```

::: step
First we label each vertex with its component. A depth-first search of $F$ does this: it visits each vertex and each edge of $F$ once. A forest has fewer than $n$ edges, so the search takes time $\O(n)$. Here: at the start of phase 2, 8 vertices and [[fig:a01-boruvka-phase-cost#F|5 forest edges]], giving 3 labels.
:::

::: step
Now we scan all edges once. An edge with the same label at both ends lies inside a component. It cannot leave any component, so we skip it. We spend constant time on it. Here: [[fig:a01-boruvka-phase-cost#I|6 of the 12 edges]] are skipped.
:::

::: step
An edge with two different labels leaves both of its components. We compare its weight with the lightest edge stored so far for each of the two components, and keep the lighter one. That is constant work, so the whole scan takes time $\O(m)$. Here: [[fig:a01-boruvka-phase-cost#X|6 edges]] update stored minima.
:::

::: step
After the scan, each component stores the lightest edge leaving it: the edge that lines 4 to 8 of [[alg:boruvka]] compute: the lightest edge in $S$. The weights are distinct, so this edge is unique. Choosing one per component takes $\O(n)$. Here: $\set{a, b}$ stores $ac$ (8), and the other two store $ef$ (5).
:::

::: step
We add the chosen edges to $F$: at most one per component, so at most $n$ edges and time $\O(n)$. By the cut property all chosen edges lie in the MST, so $F$ stays a forest, and each tree is one new component. Here: 2 distinct edges, and 1 component remains.
:::

::: step
One phase costs $\O(n) + \O(m) + \O(n)$. The graph is connected, so $n \le m + 1$, and $\O(n)$ is no larger than $\O(m)$. Hence a phase takes time $\O(m)$. Here: 8 vertices and 12 edges, and every part is bounded by these.
:::

::: step
The first part gave at most $\log n$ phases, and each phase takes $\O(m)$. So the total time is $\O(m \log n)$. Here: $\log 8 = 3$ phases at most, each scanning 12 edges; the example needs 2 phases.
:::
::::

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
