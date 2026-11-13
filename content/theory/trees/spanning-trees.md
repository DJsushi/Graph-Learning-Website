---
title: "Spanning trees"
course: theory
chapter: trees
order: 7
lectures: [t03]
goal: Recognise a spanning tree, a tree inside a graph that keeps every vertex of the graph.
needs: [theory/trees/forests-and-trees]
stage: taught
status: reviewed
---

Next to the definition, the lecturer drew a triangle. Keep all three of its vertices and delete
some edges. Which edges can we delete so that what is left is a [[def:forest-tree|tree]]?

```graph id=t03-spanning-question widget=figure
caption: The triangle from the board: three vertices and three edges that form a cycle.
intent: From the lecture (theory/2026-09-29 p6, the triangle next to K_3 in the margin), with the vertex names and positions of t03-tree-question.
layout: fixed
x @(0, 0); y @(0.6, 1); z @(1.2, 0)
x -- y; y -- z; z -- x
mark cycle: x--y y--z z--x
```

The three edges form [[fig:t03-spanning-question#cycle|a cycle]], so the triangle is not a tree.
Deleting one edge breaks the cycle. The other two edges still join all three vertices, so what
is left is a tree. Deleting two edges is too many: one vertex is cut off.

So we delete exactly one edge, and any one will do. The triangle has three such trees, one for
each deleted edge.

```graph id=t03-spanning-triangle widget=figure
caption: The three trees that keep all vertices of the triangle. Each one leaves out one edge, drawn dashed.
intent: From the lecture (theory/2026-09-29 p6): the lecturer counts 3 spanning trees of K_3 in the margin. Drawing the three trees is new.
layout: fixed
panel: without xy
x @(0, 0); y @(0.6, 1); z @(1.2, 0)
x -- y [class="dashed muted"]; y -- z [class=tree]; z -- x [class=tree]
panel: without yz
x @(0, 0); y @(0.6, 1); z @(1.2, 0)
x -- y [class=tree]; y -- z [class="dashed muted"]; z -- x [class=tree]
panel: without zx
x @(0, 0); y @(0.6, 1); z @(1.2, 0)
x -- y [class=tree]; y -- z [class=tree]; z -- x [class="dashed muted"]
```

::: definition {#def:spanning-tree title="Spanning tree" defines="spanning tree" source="theory/2026-09-29 p6"}
A [[def:forest-tree|tree]] $T \subseteq G$ is **spanning** in $G$ if $V(T) = V(G)$.
:::

::: intuition
A spanning tree is a tree inside $G$ that reaches every vertex of $G$. It keeps all the
vertices, but only enough edges to stay connected without a cycle.
:::

Here is the same on a larger graph. We delete edges until no cycle is left, and check after
each step that the graph is still connected.

```graph id=t03-spanning-steps widget=stepper
caption: Deleting one edge from each cycle gives a spanning tree; dropping a vertex spoils it.
intent: New worked example. The graph extends t03-forest-steps (same names and positions) by the edge ef, so that it has two cycles.
layout: fixed
a @(0, 0); b @(0.6, 1.2); c @(1.2, 0); d @(2.1, 0.6); e @(3, 1.2); f @(3, 0)
a -- b; b -- c; c -- a; c -- d; d -- e; d -- f; e -- f
mark abc: a--b b--c c--a
mark def: d--e d--f e--f
mark T: a--b b--c c--d d--e d--f
step: Six vertices, seven edges, two cycles.
class cycle: a--b b--c c--a d--e d--f e--f
step: Delete ac. The cycle a, b, c is gone, and b still joins a to c.
remove a--c
unclass cycle: a--b b--c
step: Delete ef. No cycle is left, and all six vertices are connected: a spanning tree.
remove e--f
unclass cycle: d--e d--f
class tree: a--b b--c c--d d--e d--f
step: Leave out f and its edge. Still a tree, but no longer spanning.
class muted: f d--f
unclass tree: d--f
```

The graph is connected, but it has two cycles,
[[fig:t03-spanning-steps#abc|the triangle $a$, $b$, $c$]] and
[[fig:t03-spanning-steps#def|the triangle $d$, $e$, $f$]]. Deleting
an edge of a cycle never disconnects the graph: the rest of the cycle still leads around the
gap. After two deletions we have [[fig:t03-spanning-steps#T|a spanning tree]] with all 6
vertices and 5 edges.

The last step shows the boundary of the definition. The four edges that are left still form a
tree, but it misses $f$, so it is not spanning. A tree in $G$ is spanning only when it contains
every vertex of $G$.

The same works for every cycle $C_n$. Deleting any one of its edges leaves a
[[def:path-graph|path]] through all $n$ vertices, and that path is a spanning tree.

::: pitfall
A spanning tree has to contain **every** vertex of $G$ but only **some** of its edges; it is not an
induced subgraph in general. Also, $G$ usually has many spanning trees, not a single one: the
triangle above already has three.
:::

## Check yourself

```graph id=t03-spanning-tree-exercise widget=exercise
task: select-edges
prompt: Select the edges of a spanning tree of this graph.
check: is-spanning-tree
hint: You need exactly $n - 1 = 6$ edges and no cycle.
solution: For example the BFS tree from $a$: $ab, ac, ad, be, cf, eg$. Any acyclic set of 6 edges is correct.
a -- b; a -- c; a -- d; b -- c; b -- e; c -- f; d -- f; e -- f; e -- g; f -- g
```

:::: quiz {#q:t03-spanning-pick}
Take the graph of the worked example, with all seven edges. Which set of edges forms a spanning
tree of it?

- [ ] $ab, bc, ca, de, ef$
- [ ] $ab, bc, cd, de$
- [x] $ac, bc, cd, de, ef$
- [ ] $ab, bc, cd, de, df, ef$

::: explanation
The third set reaches all six vertices: $a$ and $b$ through $c$, then $d$, $e$, $f$ in a row.
It has no cycle. The first set contains the cycle $a, b, c$ and never reaches $d$ from $c$. The
second set is a tree but misses $f$. The fourth set contains the cycle $d, e, f$.
:::
::::

## More

The lecturer counts the spanning trees of the complete graph: $K_1$ and $K_2$ have one, $K_3$
has three (the triangle above), $K_4$ has 16. In general $K_n$ has $n^{n-2}$ of them, which is
[[thm:cayley|Cayley's formula]].

With edge weights, finding the lightest spanning tree is the [[def:mst|minimum spanning tree]]
problem of the algorithms course.
