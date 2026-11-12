---
title: "Ear decompositions"
course: theory
chapter: menger
order: 10
lectures: [t05]
stage: split
status: reviewed
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

Direction ($\Leftarrow$): induction along the ears: adding one ear to a $2$-connected graph keeps it $2$-connected.

:::: walkthrough {for=thm:ear-decomposition}
```graph id=t05-ear-back widget=stepper
caption: A $4$-cycle $G$ with an ear $P$ from $x$ to $y$ that has three new inner vertices; delete $z$ and check that what remains is connected.
intent: New. The lecture (theory/2026-10-13 p4) draws only an ellipse for $G$ with the ear $P$ and a crossed-out vertex; this is a small concrete version with both cases for $z$.
layout: fixed
x @(0, 0); s @(1.5, 0.6); y @(3, 0); t @(1.5, -0.6); p @(0.75, 0); q @(1.5, 0); r @(2.25, 0)
x -- s -- y -- t -- x
mark G: x s y t
mark z1: x
mark z2: q
step: The base of the induction: a cycle.
class cycle: x--s s--y y--t t--x
step: Add an ear $P$ between $x \ne y$; call the result $H$.
unclass cycle: x--s s--y y--t t--x
x -- p [class=highlight]; p -- q [class=highlight]; q -- r [class=highlight]; r -- y [class=highlight]
mark P: x--p p--q q--r r--y
step: Case 1: delete $z$ from $G$, here $z = x$.
class muted: x x--s x--t x--p
step: $G - z$ is connected.
class visited: s y t
step: The inner vertices stay joined to $y$.
class visited: p q r
step: Case 2: delete an inner vertex $z$ of $P$, here $z = q$.
unclass muted: x x--s x--t x--p
unclass visited: s y t p q r
class muted: q p--q q--r
step: $G$ is intact, $p$ hangs on $x$, $r$ hangs on $y$.
class visited: x s y t p r
```

::: step
A cycle is $2$-connected: deleting one vertex leaves a path, which is connected. This is the base of the induction.
It remains to show that one ear keeps $2$-connectivity. So let $G$ be $2$-connected and $H$ be $G$ plus an ear $P$.
:::

::: step
Let [[fig:t05-ear-back#P|$P$]] join $x$ and $y$, and let $x \ne y$. Its inner vertices are new. We must show that $H - z$ is connected for every vertex $z$ of $H$. A vertex of $H$ is either in $G$ (case 1) or an inner vertex of $P$ (case 2).
:::

::: step
Case 1: $z$ is a vertex of $G$. Here: [[fig:t05-ear-back#z1|$z = x$]]. We delete $z$ from $H$, so we delete it from $G$ and from $P$ (if it is an end of $P$).
:::

::: step
$G$ is $2$-connected, so $G - z$ is connected. This uses that $G$ is $2$-connected. Here: $s$, $y$, $t$ are connected.
:::

::: step
The ends $x$ and $y$ of $P$ are different, so $z$ is at most one of them. The other end survives. Walking along $P$ we reach it from any inner vertex, and it lies in $G - z$. So $H - z$ is connected. Here: $y$ survives.
:::

::: step
Case 2: $z$ is an inner vertex of $P$. Here: [[fig:t05-ear-back#z2|$z = q$]]. Then $z$ is not in $G$, so we delete only a vertex of $P$.
:::

::: step
$G$ is still whole, and connected because a $2$-connected graph is connected. Deleting $z$ cuts $P$ into two parts, one starting at $x$ and one at $y$. Both ends are in $G$, so both parts hang on $G$ and $H - z$ is connected. Here: $p$ hangs on $x$, $r$ on $y$. As $z$ was arbitrary, $H$ is $2$-connected.
:::
::::

Direction ($\Rightarrow$), first part: take a maximal $H$ that has an ear decomposition; if it already has all vertices, it has all edges.

:::: walkthrough {for=thm:ear-decomposition}
```graph id=t05-ear-max-edge widget=stepper
caption: A $2$-connected graph $G$ with a cycle and a subgraph $H$ with an ear decomposition; the edge $18$ is missing from $H$.
intent: New. The lecture (theory/2026-10-13 p4) draws only an ellipse for $G$ with $H$ inside. The graph is the one of figure t05-ear-decomposition without vertex 9.
layout: fixed
1 @(0, 0); 2 @(1, 0.9); 3 @(2.2, 0.9); 4 @(3, 0); 5 @(2.2, -0.9); 6 @(1, -0.9); 7 @(1.6, 0.25); 8 @(1.6, -0.35)
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
2 -- 7 -- 8 -- 5
1 -- 8
mark C: 1--2 2--3 3--4 4--5 5--6 6--1
mark H: 1--2 2--3 3--4 4--5 5--6 6--1 2--7 7--8 8--5
mark missing: 1--8
step: $G$ is $2$-connected, so it contains a cycle.
class cycle: 1--2 2--3 3--4 4--5 5--6 6--1
step: Take $H$ maximal with an ear decomposition.
unclass cycle: 1--2 2--3 3--4 4--5 5--6 6--1
class tree: 1--2 2--3 3--4 4--5 5--6 6--1 2--7 7--8 8--5
class tree: 1 2 3 4 5 6 7 8
step: Case i: $H$ has all vertices of $G$.
class highlight: 1--8
step: The missing edge would be an ear with no inner vertex.
class tree: 1--8
step: Then $H$ plus this ear is larger: a contradiction.
class current: 1--8
```

::: step
Let $G$ be $2$-connected. Then $G$ has a cycle: by [[thm:two-connected-cycles]] a), any two vertices lie on a common cycle, and a cycle through two vertices is a cycle in $G$. Here: $1, 2, 3, 4, 5, 6$.
:::

::: step
Look at all subgraphs of $G$ that have an ear decomposition. There is one: the cycle above. And there are only finitely many, because $G$ is finite. So we can choose a [[fig:t05-ear-max-edge#H|subgraph $H$]] that is maximal for inclusion.
:::

::: step
Case i: $V(H) = V(G)$. We claim $H = G$. We argue by contradiction: suppose an edge of $G$ is missing from $H$. Here: [[fig:t05-ear-max-edge#missing|the edge $18$]]. As an example, we use a $H$ that is the cycle and the ear $2, 7, 8, 5$.
:::

::: step
Both ends of the missing edge are vertices of $H$, because $H$ has all vertices of $G$. The ends differ, as $G$ has no loops. The edge has no inner vertices, so there is nothing new to check. So it is an ear for $H$.
:::

::: step
Adding it gives a graph with an ear decomposition: the one of $H$ plus this ear as the last step. This graph contains $H$ and one more edge, so $H$ was not maximal. This contradicts the choice of $H$. So no edge is missing: $H$ has all vertices and all edges, hence $H = G$.
:::
::::

Direction ($\Rightarrow$), second part: a vertex outside $H$ gives a cycle, and the cycle gives an ear that $H$ does not have.

:::: walkthrough {for=thm:ear-decomposition}
```graph id=t05-ear-max-vertex widget=stepper
caption: The vertices $7$ and $8$ lie outside $H$ (the cycle). A cycle $C$ through $e$ and $f$ contains the ear $Q = 2, 7, 8, 5$.
intent: New. The lecture (theory/2026-10-13 p4) draws $G \supset H$ with $x$, $e$, $f$ and a dashed cycle through them; this is a concrete version of it. The graph is the one of figure t05-ear-decomposition without vertex 9, and $Q$ is its ear 1.
layout: fixed
1 @(0, 0); 2 @(1, 0.9); 3 @(2.2, 0.9); 4 @(3, 0); 5 @(2.2, -0.9); 6 @(1, -0.9); 7 @(1.6, 0.25); 8 @(1.6, -0.35)
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
2 -- 7 -- 8 -- 5
1 -- 8
mark H: 1--2 2--3 3--4 4--5 5--6 6--1
mark x: 7
mark e: 3--4
mark f: 7--8
mark C: 7--8 8--5 5--4 4--3 3--2 2--7
mark Q: 2--7 7--8 8--5
step: $H$ is the cycle; the vertex $x = 7$ is outside it.
class tree: 1--2 2--3 3--4 4--5 5--6 6--1 1 2 3 4 5 6
class source: 7
step: Pick an edge $e$ of $H$ and an edge $f$ at $x$.
class highlight: 3--4
class current: 7--8
step: A cycle $C$ goes through $e$ and $f$.
class cycle: 7--8 8--5 5--4 4--3 3--2 2--7
step: From $x$, follow $C$ both ways to the first vertex of $H$.
unclass cycle: 5--4 4--3 3--2
class path: 2--7 7--8 8--5
step: The two ends $2$ and $5$ differ.
class color1: 2 5
step: $Q$ is an ear for $H$: a contradiction.
unclass path: 2--7 7--8 8--5
class tree: 2--7 7--8 8--5 7 8
```

::: step
Case ii: some vertex [[fig:t05-ear-max-vertex#x|$x$]] of $G$ is not in $H$. We show that this is impossible, because $H$ was maximal. Here: $H$ is the cycle $1, \dots, 6$, and $x = 7$.
:::

::: step
Take any edge [[fig:t05-ear-max-vertex#e|$e$]] of $H$, and any edge [[fig:t05-ear-max-vertex#f|$f$]] of $G$ at $x$. Such an $f$ exists, because $G$ is connected and has more than one vertex. It is not an edge of $H$, because $x$ is not a vertex of $H$. Here: $e = 34$ and $f = 78$.
:::

::: step
$G$ is $2$-connected, and $e$ and $f$ are two edges of $G$. This step uses the hypothesis again, through b). So by [[thm:two-connected-cycles]] b), they lie on a common [[fig:t05-ear-max-vertex#C|cycle $C$]]. Here: $C$ is $7, 8, 5, 4, 3, 2$.
:::

::: step
Start at $x$ and follow $C$ in both directions. Stop each walk at the first vertex of $H$. Both walks stop, because $C$ contains the ends of $e$, which are in $H$. Together they give a path [[fig:t05-ear-max-vertex#Q|$Q$]] in $C$ through $x$. Its inner vertices are not in $H$. Here: $Q$ is $2, 7, 8, 5$.
:::

::: step
The two ends of $Q$ differ. Suppose both were one vertex $u$. Then the two walks go all the way around $C$, so $u$ is the only vertex of $H$ on $C$. But $C$ contains both ends of $e$, two vertices of $H$. This is a contradiction. Here: $2 \ne 5$.
:::

::: step
The ends of $Q$ are two different vertices of $H$, and its inner vertices are new. So $Q$ is an ear for $H$. Then $H \cup Q$ has an ear decomposition (that of $H$, then $Q$). It contains $x$, so it is larger than $H$. This contradicts maximality. So case ii cannot occur.
:::
::::

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
