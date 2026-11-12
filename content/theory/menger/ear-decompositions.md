---
title: "Ear decompositions"
course: theory
chapter: menger
order: 10
lectures: [t05]
stage: split
status: draft
---

::: theorem {#thm:ear-decomposition title="Ear decomposition" defines="ear, ear decomposition" source="theory/2026-10-13 p3–4"}
A graph $G$ is $2$-connected $\iff$ $G$ has an **ear decomposition**, i.e. $G$ can be built from a cycle by repeatedly adding new paths (**ears**)
between two distinct existing vertices, whose inner vertices are new. (An ear may have no inner vertices, i.e. be a single new edge.)
<!-- REVIEW: "distinct" ends and "inner vertices new" made explicit (board: "new paths between some two existing vertices", p3). A closed ear would create a cut vertex. -->
:::

::: intuition
Ear decompositions build every $2$-connected graph step by step from a cycle, keeping $2$-connectivity at every step, so
statements about $2$-connected graphs can be proved by induction on the number of ears. Example: [[fig:t05-ear-decomposition]].
Non-example: attaching a "closed ear", a cycle through a single existing vertex $x$, makes $x$ a
cut vertex; this is why the two ends of an ear must be distinct. Attaching a pendant path (only one end in
the graph) fails for the same reason.
:::

```graph id=t05-ear-decomposition widget=stepper
caption: An ear decomposition: start with a cycle, then add paths between two existing vertices.
intent: Show the constructive characterisation of 2-connected graphs.
layout: fixed
1 @(0, 0); 2 @(1, 0.9); 3 @(2.2, 0.9); 4 @(3, 0); 5 @(2.2, -0.9); 6 @(1, -0.9); 7 @(1.6, 0.25); 8 @(1.6, -0.35); 9 @(3.8, 0.6)
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
step: Start with a cycle.
class cycle: 1--2 2--3 3--4 4--5 5--6 6--1
step: Ear 1: the path $2, 7, 8, 5$ with new inner vertices $7, 8$.
2 -- 7 [class=highlight]; 7 -- 8 [class=highlight]; 8 -- 5 [class=highlight]
step: Ear 2: the path $3, 9, 4$.
unclass highlight: 2--7 7--8 8--5
3 -- 9 [class=highlight]; 9 -- 4 [class=highlight]
step: Ear 3: a single edge $1\,8$ between existing vertices. The result is 2-connected.
unclass highlight: 3--9 9--4
1 -- 8 [class=highlight]
```

::: proof
($\Leftarrow$) A cycle is $2$-connected. We show: if $G$ is $2$-connected and $H$ is $G$ plus an ear $P$ between $x \ne y$, then $H$ is $2$-connected. Delete one
vertex $z$ from $H$. If $z \in V(G)$, then $G - z$ is connected, and every inner vertex of $P$ is still connected along $P$ to $x$ or to $y$, at least one of which
survives. If $z$ is an inner vertex of $P$, then $G$ is intact and the two parts of $P - z$ are attached to $x$ and to $y$ respectively.

($\Rightarrow$) Let $G$ be $2$-connected. Then $G$ contains a cycle (by a), any two vertices lie on one). Choose $H \subseteq G$ maximal (with respect to inclusion)
such that $H$ has an ear decomposition; it exists since a cycle has one.

i. If $V(H) = V(G)$, then $H = G$: an edge of $G$ missing in $H$ would be an ear (without inner vertices) that could be added, contradicting maximality.

ii. If there is $x \in V(G) \setminus V(H)$, choose any $e \in E(H)$ and an edge $f$ incident with $x$ (so $f \notin E(H)$); since $G$ is connected, we may choose $x$ to
be adjacent to $V(H)$, but this is not even needed. By [[thm:two-connected-cycles]] b) there is a cycle $C$ through $e$ and $f$. Starting at $x$, follow $C$ in
both directions until the first vertex of $H$ is met. This gives a path $Q \subseteq C$ through $x$ whose two ends lie in $V(H)$ and whose inner vertices do not. The
two ends are distinct, because $C$ contains both ends of $e$, i.e. at least two vertices of $H$. So $Q$ is an ear for $H$, and $H \cup Q$ has an ear decomposition,
contradicting the maximality of $H$.
:::
