---
title: "Unique paths in trees"
course: theory
chapter: trees
order: 4
lectures: [t03]
stage: split
status: draft
---

::: corollary {#cor:tree-unique-path title="Unique paths in trees" source="theory/2026-09-29 p5"}
In every [[def:forest-tree|tree]] $T$, every two vertices $u, v \in V(T)$ are [[def:component|connected]] by exactly one [[def:path-graph|path]].
:::

::: intuition
Connectivity gives at least one path, and acyclicity forbids a second: two different $u$–$v$ paths
would together run around a cycle. This is why a tree is a good "routing table": the way from $u$ to
$v$ is determined. Example: in the star $K_{1,3}$ with centre $c$, the only path between two outer
vertices $a, b$ is $a - c - b$. Non-example: in $C_4$ opposite vertices are joined by two paths.
:::

::: proof
There is some $u$–$v$ path by connectivity of $T$ and [[claim:shortest-walk-path]]. Suppose $P_1, P_2 \subseteq T$
are two $u$–$v$ paths. Walking along $P_1$ from $u$ to $v$ and then back along $P_2$ from $v$ to $u$ gives a
closed walk $W = P_1 \cdot P_2^{-1}$ in $T$. Since $T$ has no cycle, by [[lem:closed-walk-cycle]] $W$ traverses
every edge an even number of times. A path traverses each of its edges once, so every edge of $P_1$ is
traversed once by the $P_1$-part and must be traversed again, i.e. it is an edge of $P_2$; and vice
versa. Hence $E(P_1) = E(P_2)$. Two paths with the same ends and the same edge set are equal (if
$u = v$ both are the single vertex $u$; otherwise the vertices of a path are the ends of its edges and
the edges determine the order). So $P_1 = P_2$.
:::
