---
title: "Forests and trees"
course: theory
chapter: trees
order: 1
lectures: [t03]
stage: split
status: draft
---

::: definition {#def:forest-tree title="Forest, tree" defines="acyclic, forest, tree" source="theory/2026-09-29 p1"}
A graph $G$ is **acyclic**, or a **forest**, if $G$ contains no [[def:cycle-graph|cycle]]. $G$ is a **tree** if $G$ is acyclic
and [[def:component|connected]].
:::

::: intuition
A tree connects its vertices with no redundancy: there is a way between any two vertices, but no
detour, because a cycle would give a second way around. A forest is a collection of trees side by side.
Example: every [[def:path-graph|path]] $P_n$ and every star $K_{1,n}$ is a tree. Non-examples: $C_3$ is connected but
not acyclic; two disjoint edges form a forest but not a tree.
:::

For [[def:mixed-multigraph|multigraphs]], a loop is a cycle of length $1$ and two parallel edges form a cycle of length $2$; so an
acyclic multigraph has neither, i.e. **an acyclic multigraph is simple**. The components of a forest are
trees, which explains the name.

```graph id=t03-forest widget=figure
caption: A forest with three components: each component is a tree. The isolated vertex is a tree with one vertex.
intent: First picture of trees and forests.
height: small
1 -- 2; 2 -- 3; 2 -- 4; 4 -- 5; 4 -- 6
a -- b; b -- c; c -- d
z
```
