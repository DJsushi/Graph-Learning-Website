---
title: "Removing a leaf"
course: theory
chapter: trees
order: 5
lectures: [t03]
stage: split
status: draft
---

The following facts are used constantly, in particular in the algorithms course. The key tool is that
deleting a [[def:leaf|leaf]] keeps a [[def:forest-tree|tree]] a tree.

::: lemma {#lem:leaf-removal title="Removing a leaf" extra=true}
Let $T$ be a tree with at least two vertices and $v$ a leaf of $T$. Then $T - v$ is a tree. Conversely,
adding a new vertex joined by one edge to a vertex of a tree gives a tree.
:::

::: intuition
A leaf is a dead end, so no route between two other vertices passes through it; cutting it off
disconnects nothing. Attaching a new vertex by a single edge cannot close a cycle, since a cycle needs
two edges at each of its vertices. Together with [[cor:tree-leaf]] this gives the standard induction
on trees: remove a leaf, use the induction hypothesis, put the leaf back. Non-example: removing the
centre of the star $K_{1,3}$ (not a leaf) leaves three isolated vertices.
:::

::: proof
$T - v$ is acyclic as a [[def:subgraph|subgraph]] of $T$. It is [[def:component|connected]]: for $x, y \ne v$, the unique $x$–$y$ [[def:path-graph|path]] in $T$
does not pass through $v$, because an inner vertex of a path has [[def:degree|degree]] at least $2$ in the path, while
$d_T(v) = 1$. So the path lies in $T - v$.

Conversely, if $v$ is added to a tree $T'$ with one edge $vw$, the result is connected ($v$ is reached via
$w$), and a [[def:cycle-graph|cycle]] through $v$ would need two edges at $v$; so every cycle would lie in $T'$, which has none.
:::

```graph id=t03-leaf-removal widget=stepper
caption: Removing a leaf keeps a tree a tree.
intent: Illustrate leaf removal, the induction step behind almost every proof about trees.
1 -- 2 -- 3; 2 -- 4; 4 -- 5
step: A tree $T$ with a leaf $v = 5$.
class highlight: 5 4--5
step: Remove $v$ and its edge: $T - v$ is still connected and acyclic.
remove 5
step: Adding $v$ back cannot create a cycle, since $v$ gets only one edge.
4 -- 5 [class=highlight]
```
