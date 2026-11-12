---
title: "Hamiltonian cycles and paths"
course: theory
chapter: hamiltonian
order: 1
lectures: [t04]
stage: split
status: draft
---

::: definition {#def:hamiltonian title="Hamiltonian cycle, path and graph" defines="Hamiltonian cycle, Hamiltonian path, Hamiltonian graph" source="theory/2026-10-06 p5"}
A [[def:cycle-graph|cycle]] $C \subseteq G$ is **Hamiltonian** if $V(C) = V(G)$. A [[def:path-graph|path]] $P \subseteq G$ is **Hamiltonian** if
$V(P) = V(G)$. A graph $G$ is **Hamiltonian** if $G$ contains a Hamiltonian cycle.
:::

::: intuition
A Hamiltonian cycle is a round trip that visits every vertex exactly once, the shape of a travelling salesman's
tour. Examples: $C_n$ and $K_n$ ($n \ge 3$) are Hamiltonian; the cube $Q_3$ is too (see the exercises). Non-examples: a [[def:forest-tree|tree]]
on at least $2$ vertices has no cycle at all, though a path $P_n$ has a Hamiltonian path; $K_{1,3}$ has neither. Deleting one
edge from a Hamiltonian cycle gives a Hamiltonian path, which is a [[def:spanning-tree|spanning tree]]; so with non-negative weights an optimal
tour costs at least a [[def:mst|minimum spanning tree]].
:::

::: pitfall
Do not confuse Hamiltonian cycles with Euler tours: a Hamiltonian cycle visits every **vertex** once and may skip
edges; an Euler tour uses every **edge** once and may revisit vertices. $K_4$ is Hamiltonian but has no Euler tour
(all degrees are odd), and two triangles sharing a vertex have an Euler tour but no Hamiltonian cycle.
:::
