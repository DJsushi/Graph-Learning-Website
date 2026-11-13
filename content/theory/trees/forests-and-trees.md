---
title: "Forests and trees"
course: theory
chapter: trees
order: 1
lectures: [t03]
goal: Recognise forests, graphs without a cycle, and trees, the forests that are connected.
needs: [theory/basics/graph-families, theory/walks-connectivity/connected-components, theory/basics/multigraphs-and-digraphs]
stage: taught
status: reviewed
---

The lecturer drew three small graphs next to the definition. In which of them can we get from
every vertex to every other vertex, and yet never walk around in a circle?

```graph id=t03-tree-question widget=figure
caption: Three small graphs from the board: two vertices, one edge, and a triangle. Only one of them is connected and has no cycle.
intent: The three sketches the lecturer drew next to the definition (theory/2026-09-29 p1), with vertex names added.
layout: fixed
panel: two vertices
p @(0, 0); q @(1.2, 0)
panel: one edge
u @(0, 0); v @(1.2, 0)
u -- v
panel: triangle
x @(0, 0); y @(0.6, 1); z @(1.2, 0)
x -- y; y -- z; z -- x
```

Only the single edge does both. The two vertices have no edge between them, so there is no way
from $p$ to $q$. The triangle has a way between any two vertices, but its three edges lead
around and back to the start: they form a cycle.

A graph with no cycle is a **forest**. A forest that is also connected is a **tree**. So the
single edge is a tree, the two lonely vertices form a forest but not a tree, and the triangle
is not even a forest.

::: definition {#def:forest-tree title="Forest, tree" defines="acyclic, forest, tree" source="theory/2026-09-29 p1"}
A graph $G$ is **acyclic**, or a **forest**, if $G$ contains no [[def:cycle-graph|cycle]]. $G$ is a **tree** if $G$ is acyclic
and [[def:component|connected]].
:::

::: intuition
A tree joins its vertices with no redundancy. There is a way between any two vertices, but no
cycle, so never a second way around. A forest may fall apart into pieces, and each piece is a
tree.
:::

Every [[def:path-graph|path]] $P_n$ and every star $K_{1,n}$ is a tree. The cycle $C_3$ is
connected but not acyclic. Two disjoint edges form a forest but not a tree.

The lecturer crossed out one edge of the triangle. Here is what that does, on a slightly larger
graph. We check the two conditions of the definition after each change.

```graph id=t03-forest-steps widget=stepper
caption: Deleting edges from a graph with one cycle: first a tree, then a forest of two trees.
intent: New worked example, built on the lecturer's sketch of a triangle with one edge crossed out (theory/2026-09-29 p1); the triangle a, b, c gets a star d, e, f attached.
layout: fixed
a @(0, 0); b @(0.6, 1.2); c @(1.2, 0); d @(2.1, 0.6); e @(3, 1.2); f @(3, 0)
a -- b; b -- c; c -- a; c -- d; d -- e; d -- f
step: The graph is connected, but a, b, c is a cycle. It is not a tree.
class cycle: a--b b--c c--a
step: Delete the edge ac. No cycle is left, and the graph is still connected: a tree.
remove a--c
unclass cycle: a--b b--c
class tree: a--b b--c c--d d--e d--f
step: Delete the edge cd as well. Still no cycle, but now two pieces: a forest, not a tree.
remove c--d
class color1: a b c
class color2: d e f
```

In the first step the cycle is the only problem. Deleting $ac$ breaks it, and $b$ still leads
from $a$ to $c$, so nothing falls apart. In the last step we lose connectivity instead: no edge
joins the piece $a, b, c$ to the piece $d, e, f$.

Each piece of a forest is connected and has no cycle, so each [[def:component|component]] of a
forest is a tree. A forest is a collection of trees side by side, which explains the name.

```graph id=t03-forest widget=figure
caption: A forest with three components: each component is a tree. The isolated vertex is a tree with one vertex.
intent: First picture of trees and forests.
height: small
1 -- 2; 2 -- 3; 2 -- 4; 4 -- 5; 4 -- 6
a -- b; b -- c; c -- d
z
```

::: pitfall
For [[def:mixed-multigraph|multigraphs]], a loop is a cycle of length $1$ and two parallel edges
form a cycle of length $2$. So an acyclic multigraph has neither: **an acyclic multigraph is
simple**.
:::

::: pitfall
A tree must be connected. The forest above has three components, so it is not a tree, although
each of its components is one.
:::

## Check yourself

:::: quiz {#q:t03-forest-add-edge}
Add an edge between the vertices $3$ and $a$ of the forest above. What do we get?

- [ ] A tree.
- [x] A forest with two components, not a tree.
- [ ] A forest with three components.
- [ ] A graph with a cycle.

::: explanation
A cycle through the new edge would need a second way from $3$ to $a$, and there was none, so
there is still no cycle. The new edge joins the first two components into one. The vertex $z$
stays alone, so two components remain, and the graph is not connected.
:::
::::

:::: quiz {#q:t03-forest-parallel}
A multigraph has the vertices $u$, $v$, $w$, two parallel edges between $u$ and $v$, and one
edge between $v$ and $w$. Is it a forest?

- [ ] Yes, and it is a tree, because it is connected.
- [ ] Yes, but not a tree.
- [x] No: the two parallel edges form a cycle of length 2.

::: explanation
In a multigraph two parallel edges count as a cycle of length $2$. So the graph has a cycle and
is not a forest. An acyclic multigraph is always simple, and this one is not.
:::
::::
