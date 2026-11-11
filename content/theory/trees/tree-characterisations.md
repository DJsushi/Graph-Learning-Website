---
title: "Equivalent definitions of a tree"
course: theory
chapter: trees
order: 6
lectures: [t03]
stage: split
status: draft
---

::: theorem {#thm:tree-characterisations title="Equivalent definitions of a tree" extra=true}
For a graph $G$ with $n \ge 1$ vertices, the following are equivalent:

1. $G$ is a tree (connected and acyclic);
2. every two vertices of $G$ are connected by exactly one path;
3. $G$ is connected, and $G - e$ is disconnected for every edge $e$ (**minimally connected**);
4. $G$ is acyclic, and $G + e$ contains a cycle for every new edge $e \in \binom{V(G)}{2} \setminus E(G)$
   (**maximally acyclic**);
5. $G$ is connected and has $n - 1$ edges;
6. $G$ is acyclic and has $n - 1$ edges.
:::

::: intuition
A tree sits exactly on the boundary between "connected" and "acyclic". Deleting any edge breaks
connectivity (3), adding any edge creates a cycle (4), and $n - 1$ is both the fewest edges a connected
graph can have and the most an acyclic one can have (5, 6). So any two of "connected", "acyclic",
"$n - 1$ edges" imply the third. In practice, 5 and 6 are the quickest test: a connected graph with
$7$ vertices and $6$ edges is a tree, with no need to search for cycles.

The MST algorithms rely on these facts. By 4, adding an edge $e$ to a [[def:spanning-tree|spanning tree]] creates a cycle
(exactly one, through $e$, by unique paths); exchanging $e$ for another edge of that cycle gives a
spanning tree again, which is the argument behind the [[thm:cycle-property|cycle property]] and
[[thm:cut-property|cut property]]. By 3, deleting an edge of a tree disconnects it, into exactly two
components by [[cor:forest-edges]], i.e. it defines a [[def:cut|cut]].
:::

```graph id=t03-tree-plus-edge widget=figure
caption: Adding the edge $e = 3\,6$ to a tree creates exactly one cycle, the unique $3$–$6$ path in the tree plus $e$. Deleting any edge of that cycle gives a tree again.
intent: Maximally acyclic and the exchange argument used by the MST cycle and cut properties.
height: small
1 -- 2
3 -- 2 -- 4 -- 5 -- 6 [class=path]
3 -- 6 [class="highlight dashed"]
```

::: pitfall
Counting edges alone proves nothing: $n - 1$ edges must be combined with connectivity **or**
acyclicity. A triangle plus an isolated vertex has $4$ vertices and $3$ edges, but is neither
connected nor acyclic. And "minimally connected" means that **no** edge can be deleted, not that
some edge can.
:::

:::: proof
First we show that **every tree on $n$ vertices has $n - 1$ edges**, by induction on $n$: for $n = 1$ there
are no edges; for $n \ge 2$ remove a leaf ([[cor:tree-leaf]]); by [[lem:leaf-removal]] the rest is a tree on
$n - 1$ vertices with $n - 2$ edges by induction, and we removed one edge. This gives 1 ⇒ 5 and 1 ⇒ 6.

**1 ⇒ 2** is [[cor:tree-unique-path]]. **2 ⇒ 1:** $G$ is connected; if $G$ had a cycle, two vertices $u, v$
adjacent on the cycle would be connected by two paths (the edge $uv$, and the rest of the cycle).

**1 ⇒ 3:** if $e = uv$ and $G - e$ were connected, a $u$–$v$ path in $G - e$ would be a second $u$–$v$ path
besides $e$ itself, contradicting 2. **3 ⇒ 1:** if $G$ had a cycle $C$, removing an edge $e = uv$ of $C$ keeps
$G$ connected (any [[def:walk|walk]] using $e$ can use the rest of $C$ from $u$ to $v$ instead), contradicting 3.

**1 ⇒ 4:** for a non-edge $uv$, the unique $u$–$v$ path in $G$ plus the edge $uv$ is a cycle. **4 ⇒ 1:** if $G$
were disconnected, joining vertices $u, v$ from different components would create no cycle (a cycle through
the new edge would need a $u$–$v$ path in $G$).

**5 ⇒ 1:** $G$ is connected. Repeatedly remove edges lying on cycles; this keeps the graph connected (as in
3 ⇒ 1) and ends with a connected acyclic spanning subgraph, a tree, which has $n - 1$ edges. Since $G$ had
$n - 1$ edges already, nothing was removed, so $G$ was acyclic.

**6 ⇒ 1:** let $G$ be acyclic with $c$ components $T_1, \dots, T_c$, of sizes $n_1, \dots, n_c$. Each is a tree,
so $\abs{E(G)} = \sum_j (n_j - 1) = n - c$. From $\abs{E(G)} = n - 1$ we get $c = 1$, so $G$ is connected.
::::

::: corollary {#cor:forest-edges title="Edges of a forest" extra=true}
A forest with $n$ vertices and $c$ components has exactly $n - c$ edges.
:::

::: intuition
Start with $n$ isolated vertices: $c = n$ components and $0$ edges. In a forest, every edge joins two
different components (inside a component it would close a cycle), so each edge lowers the number of
components by exactly one. Example: the forest in [[fig:t03-forest]] has $11$ vertices, $3$ components and
$8$ edges. Conversely, $n$ minus the number of edges counts the components of a forest.
:::

::: proof
This was shown in the step 6 ⇒ 1 above.
:::
