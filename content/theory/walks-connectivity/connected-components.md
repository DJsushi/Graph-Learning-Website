---
title: "Connected components"
course: theory
chapter: walks-connectivity
order: 2
lectures: [t02]
stage: split
status: draft
---

The relation "$u$ and $v$ are connected by a [[def:walk|walk]]" on $V(G)$ is an **equivalence relation**:

- it is reflexive: $(v)$ is a walk of length $0$ from $v$ to $v$;
- it is symmetric: reversing a walk from $u$ to $v$ gives a walk from $v$ to $u$;
- it is transitive: a walk from $u$ to $v$ followed by a walk from $v$ to $w$ is a walk from $u$ to $w$.

::: definition {#def:component title="Connected components" defines="component, connected" source="theory/2026-09-22 p4"}
The equivalence classes of the relation "connected by a walk" on $V(G)$ are called the
**(connected) components** of $G$. (Often the [[def:subgraph|subgraphs induced]] on these classes are also called
components.) A graph is **connected** if it has exactly one component, that is, if every two
vertices are connected by a walk.
:::

::: intuition
The components are the separate pieces you see in a drawing: inside a piece you can walk from any
vertex to any other, and no edge leaves a piece. Example: two disjoint triangles form a graph with
$2$ components, and a graph on $n$ vertices without edges has $n$ components. $C_6$ and $K_1$ are
connected.
:::

By [[claim:shortest-walk-path]], "connected by a walk" is the same as "connected by a [[def:path-graph|path]]".

::: pitfall
"Exactly one component" excludes the graph with no vertices: it has no components, so it is not
connected. Also, a component is a *maximal* connected piece; a connected subgraph of $G$ need not be
a component, it may be only part of one.
:::
