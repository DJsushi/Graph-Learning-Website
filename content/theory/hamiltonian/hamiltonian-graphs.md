---
title: "Hamiltonian cycles and paths"
course: theory
chapter: hamiltonian
order: 1
lectures: [t04]
stage: split
status: reviewed
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

```graph id=t04-hamiltonian-example widget=figure
caption: Left, a hexagon $1, \dots, 6$ with the chords $14$ and $25$; the green edges form a Hamiltonian cycle, so the graph is Hamiltonian. Right, two triangles sharing the vertex $c$ have a Hamiltonian path (blue) but no Hamiltonian cycle: a cycle through $c$ cannot enter and leave both triangles.
intent: New figure. Example and non-example for the definition on theory/2026-10-06 p5; the lecture draws no example. Cycle edges are green, path edges blue.
layout: fixed
panel: Hamiltonian cycle
1 @(0, 0.5); 2 @(0.7, 1); 3 @(1.5, 1); 4 @(2.2, 0.5); 5 @(1.5, 0); 6 @(0.7, 0)
1 -- 2 [class=cycle]; 2 -- 3 [class=cycle]; 3 -- 4 [class=cycle]; 4 -- 5 [class=cycle]; 5 -- 6 [class=cycle]; 6 -- 1 [class=cycle]; 1 -- 4; 2 -- 5
panel: Hamiltonian path, no cycle
a @(0, 1); b @(0, 0); c @(1, 0.5); d @(2, 1); e @(2, 0)
a -- b [class=path]; a -- c; b -- c [class=path]; c -- d [class=path]; c -- e; d -- e [class=path]
```

::: pitfall
Do not confuse Hamiltonian cycles with Euler tours: a Hamiltonian cycle visits every **vertex** once and may skip
edges; an Euler tour uses every **edge** once and may revisit vertices. $K_4$ is Hamiltonian but has no Euler tour
(all degrees are odd), and two triangles sharing a vertex have an Euler tour but no Hamiltonian cycle.
:::
