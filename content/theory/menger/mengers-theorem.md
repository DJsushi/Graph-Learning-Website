---
title: "Menger's theorem"
course: theory
chapter: menger
order: 4
lectures: [t05]
stage: split
status: reviewed
---

::: theorem {#thm:menger title="Menger's theorem (undirected, vertex and edge versions)" source="theory/2026-10-13 p2"}
a) An undirected (simple) graph $G$ with at least $2$ vertices is $k$-connected $\iff$ for all $s \ne t \in V(G)$ there exist $k$ internally
disjoint $s$–$t$ paths.
<!-- REVIEW: board says "undirected multigraph" in a); restricted to simple graphs (multigraphs: see the remark after the proof). "At least 2 vertices" added: for K_1 the right side is vacuous, but K_1 is not 2-connected. -->


b) An undirected [[def:mixed-multigraph|multigraph]] $G$ is $k$-edge-connected $\iff$ for all $s \ne t \in V(G)$ there exist $k$ edge-disjoint $s$–$t$ paths.
:::

::: intuition
Checking $k$-connectivity directly means trying every small set of deleted vertices (or edges). Menger replaces this by a
certificate one can show: $k$ independent routes between every two vertices, [[def:st-cut|internally disjoint]] for vertex
failures and edge-disjoint for edge failures. Robustness against $k - 1$ failures is the same as having $k$ such
[[def:path-graph|paths]]. Example: in $K_4$, any $s, t$ are joined by the edge $st$ and the two paths through the other two vertices,
which matches $3$-connectivity ([[def:k-connected]]). Non-example: in the bowtie graph (two triangles sharing one vertex), every path
from the left triangle to the right one passes through the middle vertex, so there is only one internally disjoint path between
such vertices, but there are two edge-disjoint ones: the graph is $2$-edge-connected but not $2$-connected.
:::

```graph id=t05-edge-disjoint-paths widget=figure
caption: Three edge-disjoint $s$–$t$ paths (in different colours). They share vertices, but no edges.
intent: Transcription of the lecture example of 3 edge-disjoint paths through common vertices.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 0); b @(3, 0); t [class=sink] @(4.5, 0)
s -- a [class=color1 bend=0.5]; s -- a [class=color2]; s -- a [class=color3 bend=-0.5]
a -- b [class=color1 bend=0.5]; a -- b [class=color2]; a -- b [class=color3 bend=-0.5]
b -- t [class=color1 bend=0.5]; b -- t [class=color2]; b -- t [class=color3 bend=-0.5]
```

The direction "$\Leftarrow$" is easy in both cases: let $X$ be a set of at most $k - 1$ vertices (resp. $F$ a set of at most $k - 1$ edges)
and $s \ne t$ two vertices not in $X$. Of the $k$ internally disjoint (resp. edge-disjoint) $s$–$t$ paths, $X$ (resp. $F$) destroys at most $k - 1$,
so $s$ and $t$ remain [[def:component|connected]]. In a), $G - X$ is also non-empty: a simple graph has at most $1 + (n - 2)$ internally disjoint $s$–$t$ paths
(at most one is the edge $st$, the others have distinct inner vertices), so $n \ge k + 1$.
<!-- REVIEW: gap filled: s, t range over vertices outside X, and G − X ≠ ∅ (empty graph is not connected). --> The
direction "$\Rightarrow$" is the deep part. As the lecture puts it, **this is better done in digraphs**: we prove a directed,
local version (for one fixed pair $s, t$), and derive everything else from it.

::: theorem {#thm:menger-directed title="Menger's theorem (directed, local)" source="theory/2026-10-13 p5"}
Let $G$ be a directed multigraph and $s \ne t \in V(G)$, and let $k \ge 1$.

A) If $G$ has no arc from $s$ to $t$: $G$ contains $k$ internally disjoint directed $s$–$t$ paths $\iff$ $G$ has no directed $s$–$t$ cut of
size $\le k - 1$.

B) $G$ contains $k$ edge-disjoint directed $s$–$t$ paths $\iff$ $G$ has no directed $s$–$t$ edge cut of size $\le k - 1$.
:::

::: intuition
This is a min–max theorem: paths are certificates that $s$ and $t$ are well connected, cuts are certificates that they are not,
and the obvious obstacle (a small cut) is the only one. B is the max-flow min-cut theorem ([[thm:maxflow-mincut]]) after a reduction: delete the arcs into $s$ and out of $t$, and
merge parallel arcs into one arc whose capacity is their number ([[exr:a02-menger-from-flow]]). By the integrality theorem there is an
integral maximum flow of some value $k$; sharing the flow on a merged arc among its copies (at most $1$ each) gives a d-flow, which contains $k$ edge-disjoint $s$–$t$ paths ([[claim:d-flow-paths]]). <!-- REVIEW: the old text said capacity 1 on every arc as in unit-capacity networks and that the arcs of value 1 form the paths; neither fits directed multigraphs (parallel arcs, possible directed cycles in the flow), so the reduction is named and "contain" is used. -->
A is the same after splitting
every vertex $x \ne s, t$ into $x^- \to x^+$, i.e. giving it capacity $1$ ([[exr:a02-vertex-capacities]]). Example: direct all edges
of [[fig:t05-edge-disjoint-paths]] from left to right. The $3$ parallel arcs from $s$ to $a$ form an edge cut of size $3$, and there
are $3$ edge-disjoint paths; but $\set{a}$ is an $s$–$t$ cut of size $1$, so no two paths are internally disjoint.
:::

```graph id=t05-menger-directed-example widget=figure
caption: Left (A), no arc $s \to t$: the vertices $a, b$ form an $s$–$t$ cut of size $2$, and there are $2$ internally disjoint paths $s a t$ and $s b t$; no single vertex is a cut. Right (B), the three arcs leaving $s$ form an edge cut of size $3$, and there are $3$ edge-disjoint paths (they share the vertices $a$ and $b$).
intent: Lecture drawings (theory/2026-10-13 p5): the cut crossing the paths in A and in B. The concrete graphs are new; the lecture draws no vertex names.
type: directed
layout: fixed
panel: A) internally disjoint paths, cut $\{a, b\}$
s [class=source] @(0, 0.5); c @(0.6, 0.5); a [class=cut] @(1.4, 1); b [class=cut] @(1.4, 0); t [class=sink] @(2, 0.5)
s -> a [class=color1]; a -> t [class=color1]; s -> b [class=color2]; b -> t [class=color2]; s -> c; c -> a
panel: B) edge-disjoint paths, cut of $3$ arcs
s [class=source] @(0, 0.5); a @(1, 1); b @(1, 0); t [class=sink] @(2, 0.5)
s -> a [class=color1 bend=0.3]; s -> a [class=color2 bend=-0.3]; s -> b [class=color3]
a -> t [class=color1]; a -> b [class=color2]; b -> t [class=color2 bend=0.3]; b -> t [class=color3 bend=-0.3]
```

<!-- REVIEW: hypothesis "no arc from s to t" in A) added; not on the board (p5). -->
The assumption "no arc from $s$ to $t$" in A) is necessary (and missing on the board): with a single arc $(s, t)$ there is no cut of any
size, but only one path. Equivalently, the maximum number of internally disjoint (edge-disjoint) $s$–$t$ paths equals the minimum
size of an $s$–$t$ cut (edge cut).

**"$\Rightarrow$" is trivial in both A) and B):** a cut must contain a vertex (an edge) of each of the $k$ disjoint paths, and these are
pairwise different.

::: pitfall
The theorem is about the **minimum** size of a cut. An inclusion-minimal cut ([[def:minimal-cut]]) can be larger than the
number of disjoint paths, so finding one minimal cut of size $k$ does not show that there are $k$ paths. Also, the theorem
is **local** (one pair $s, t$); $k$-connectivity ([[thm:menger]]) needs $k$ paths between **every** pair.
:::
