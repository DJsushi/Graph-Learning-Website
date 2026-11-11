---
title: Trees
course: theory
lecture: 3
slug: t03
summary: Forests and trees, leaves, closed walks and cycles, unique paths in trees, the equivalent characterisations of trees, spanning trees, Cayley's formula, and regular graphs of large girth.
prerequisites: [theory/02-walks-connectivity-bipartite]
sources:
  - resources/graph-theory/2026-09-29-13_47_15-join.pdf
status: draft
---

Trees are the simplest connected graphs: connected, but with no redundancy at all. They are
everywhere in computer science (search trees, parse trees, spanning trees of networks) and they are
the main object of the first lecture of the algorithms course (minimum spanning trees). In this
lesson we prove the basic structural facts about trees, count the spanning trees of $K_n$, and end with
a surprising existence theorem about graphs without short cycles.

## Summary

- Forests are acyclic graphs, trees are [[def:component|connected]] forests ([[def:forest-tree]]). Every acyclic graph on
  $\ge 2$ vertices has two vertices of [[def:degree|degree]] $\le 1$ ([[thm:two-leaves]]); trees have [[def:leaf|leaves]] ([[cor:tree-leaf]]).
- A [[def:walk|closed walk]] contains a [[def:cycle-graph|cycle]] or traverses every edge an even number of times
  ([[lem:closed-walk-cycle]]); hence [[def:path-graph|paths]] in trees are unique ([[cor:tree-unique-path]]).
- Trees: connected + acyclic ⟺ unique paths ⟺ minimally connected ⟺ maximally acyclic ⟺ connected
  with $n-1$ edges ⟺ acyclic with $n-1$ edges ([[thm:tree-characterisations]]).
- Every connected graph has a [[def:spanning-tree|spanning tree]] ([[prop:spanning-tree-exists]]); it is the starting point
  of the [[def:mst|minimum spanning tree]] problem. $K_n$ has $n^{n-2}$ of them ([[thm:cayley]]).
- For all $d, k$ there is a $d$-regular graph of [[def:girth|girth]] $\ge k$ ([[thm:regular-large-girth]]).

## Exercises

:::: exercise {#exr:t03-leaves-count title="Many leaves" difficulty=2}
Let $T$ be a [[def:forest-tree|tree]] with a vertex of [[def:degree|degree]] $\Delta$. Show that $T$ has at least $\Delta$ leaves.

::: hint
Use the handshake lemma together with $\abs{E(T)} = n - 1$, or look at the [[def:path-graph|paths]] starting at the
vertex of degree $\Delta$.
:::

::: solution
Let $v$ have degree $\Delta$ with neighbours $u_1, \dots, u_\Delta$. For each $i$, start at $v$, step to $u_i$,
and keep walking to a not yet visited neighbour as long as possible. This is a path, so it stops (the
graph is finite) at some vertex $\ell_i \ne v$ all of whose neighbours are already on the path. A neighbour
of $\ell_i$ other than its predecessor would close a [[def:cycle-graph|cycle]] with the path, so $\ell_i$ is a [[def:leaf|leaf]].
<!-- REVIEW: filled the gap why the last vertex of the walk is a leaf. -->
The leaves $\ell_i$ are distinct: if
$\ell_i = \ell_j$ for $i \ne j$, the two paths from $v$ to $\ell_i$ (one through $u_i$, the other through $u_j$)
would be different, contradicting [[cor:tree-unique-path]]. (If $\Delta = 1$, $v$ itself is a leaf.)
:::
::::

:::: exercise {#exr:t03-degree-sequence-tree title="Degree sequences of trees" difficulty=2}
Let $n \ge 2$ and $d_1, \dots, d_n \ge 1$ be integers with $d_1 + \dots + d_n = 2n - 2$. Prove that there is a tree
with [[def:degree-sequence|degree sequence]] $(d_1, \dots, d_n)$.

::: hint
Induction on $n$: some $d_i$ must equal $1$, and some $d_j$ must be at least $2$ (if $n \ge 3$).
:::

::: solution
For $n = 2$: $d_1 = d_2 = 1$, and $K_2$ works. Let $n \ge 3$. Since the sum is $2n - 2 < 2n$, some $d_i = 1$;
since the sum is $2n - 2 > n$, some $d_j \ge 2$. Remove $d_i$ and decrease $d_j$ by one: the new sequence has
$n - 1$ entries, all at least $1$, with sum $2n - 4 = 2(n-1) - 2$. By induction there is a tree on $n - 1$
vertices with these degrees; attach a new leaf (of degree $1$) to the vertex with degree $d_j - 1$. By
[[lem:leaf-removal]] the result is a tree, with the required degrees.
:::
::::

:::: exercise {#exr:t03-spanning-trees-cycle title="Spanning trees of a cycle" difficulty=1}
How many [[def:spanning-tree|spanning trees]] does $C_n$ have? And $K_{2,3}$?

::: solution
A spanning tree of $C_n$ has $n - 1$ of the $n$ edges, and removing any single edge of $C_n$ leaves a path,
which is a tree: $n$ spanning trees. For $K_{2,3}$ ($5$ vertices, $6$ edges) a spanning tree has $4$ edges,
so we remove $2$ edges. $K_{2,3}$ has vertices $1, 2$ and $1', 2', 3'$; its cycles are the three
$4$-cycles $1\,a'\,2\,b'\,1$. Removing two edges at the same vertex $c'$ isolates $c'$ ($3$ ways, bad);
removing two edges at the same vertex $1$ or $2$ (say $1a'$ and $1b'$) leaves the tree ($3 + 3 = 6$ ways);
removing $1a'$ and $2b'$ with $a' \ne b'$ breaks all three $4$-cycles and leaves a tree ($3 \cdot 2 = 6$ ways).
Total $\binom{6}{2} - 3 = 12$.
:::
::::

```graph id=t03-ex-tree-edges widget=exercise
task: build
prompt: Add edges to make this graph a tree. How many edges must you add?
check: is-tree
hint: A tree on $8$ vertices has exactly $7$ edges, and this graph has $4$ edges in $4$ components.
solution: The graph is a forest with $4$ components, so it has $8 - 4 = 4$ edges ([[cor:forest-edges]]). Add $3$ edges, each joining two different components.
1 -- 2; 2 -- 3; 4 -- 5; 6 -- 7
8
```

:::: quiz {#q:t03-cayley-5}
How many spanning trees does $K_5$ have?

answer: 125

::: explanation
By [[thm:cayley]], $5^{5-2} = 125$.
:::
::::

:::: quiz {#q:t03-forest-edges}
A forest has 20 vertices and 3 [[def:component|components]]. How many edges does it have?

answer: 17

::: explanation
By [[cor:forest-edges]], $n - c = 20 - 3 = 17$.
:::
::::

:::: quiz {#q:t03-tree-leaves}
Which statement is true for every tree with at least 2 vertices?

- [ ] It has exactly 2 leaves.
- [x] It has at least 2 leaves.
- [ ] It has at most $n/2$ leaves.

::: explanation
[[thm:two-leaves]] gives at least two; a star $K_{1,n-1}$ has $n - 1$ leaves.
:::
::::

:::: quiz {#q:t03-girth-kmn}
What is the [[def:girth|girth]] of $K_{3,3}$?

answer: 4

::: explanation
$K_{3,3}$ is [[def:bipartite|bipartite]], so it has no triangles (no odd cycles at all), and $1\,1'\,2\,2'\,1$ is a 4-cycle.
:::
::::
