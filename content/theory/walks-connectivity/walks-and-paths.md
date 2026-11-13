---
title: "Walks and paths"
course: theory
chapter: walks-connectivity
order: 1
lectures: [t02]
goal: Write down a walk step by step, count its length, and tell a walk apart from the path it traces.
needs: [theory/basics/graphs, theory/basics/graph-families, theory/basics/isomorphism, theory/basics/subgraphs]
stage: taught
status: reviewed
---

A walker starts at $a$ in the graph $G$ below. She goes to $b$, around the triangle through $c$
and $d$ back to $b$, and on to $e$. How many steps does she take? Is there a shorter route from
$a$ to $e$?

```graph id=t02-walk-route widget=figure
caption: A small graph $G$. The walker starts at the ringed vertex $a$ and ends at the ringed vertex $e$.
intent: New figure (the lecture has no drawing for walks). The opening question; same graph and positions as t02-shortcut further down.
layout: fixed
a @(0, 0) [class=highlight]; b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9) [class=highlight]
a -- b; b -- c; c -- d; d -- b; b -- e
mark route: a--b b--c c--d d--b b--e
mark twice: b
mark short: a b e a--b b--e
```

She takes five steps and uses [[fig:t02-walk-route#route|every edge of the graph]] once. On
the way she [[fig:t02-walk-route#twice|passes $b$ twice]]. A route written down step by step
like this is a walk. Its length is the number of steps, here 5.

[[fig:t02-walk-route#short|The direct route through $b$]] takes only two steps and visits no
vertex twice. A walk like that traces a path. At the end of the page we see that a shortest
walk always does.

::: definition {#def:walk title="Walk" defines="walk, closed walk, length of a walk" source="theory/2026-09-22 p3"}
A **walk** in a (multi)graph $G$ is a sequence
$$W = (v_0, e_0, v_1, e_1, v_2, \dots, e_{k-1}, v_k)$$
of vertices $v_i$ and edges $e_i$ of $G$ such that $e_i$ has the endpoints $v_i$ and $v_{i+1}$ for all
$i \in \set{0, \dots, k-1}$ (in a simple graph: $e_i = \set{v_i, v_{i+1}} \in E(G)$). The walk goes
**from $v_0$ to $v_k$**, and its **length** is $k$, the number of edge steps. It is **closed** if
$v_0 = v_k$.
:::

::: intuition {for=def:walk}
A walk is a route that records every step, like the list of streets a pedestrian takes.
Streets and crossings may be used again. The length counts the steps, not the vertices.
:::

In a walk, vertices and edges may repeat. In simple graphs the edges are determined by the
vertices, so we often list only the vertices, from $v_0$ to $v_k$.

Here is a walk in $G$ that turns back. We follow it one step at a time and count.

```graph id=t02-walk-steps widget=stepper
caption: The closed walk $(a, b, e, b, a)$ in $G$, one step at a time.
intent: New figure (the lecture has none). Worked example of the definition: the length counts steps, an edge may be used twice, and a walk that ends where it started is closed.
layout: fixed
a @(0, 0); b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9)
a -- b; b -- c; c -- d; d -- b; b -- e
step: Start at $a$ (ringed). No step yet, so the length is 0.
class current: a
step: Along the edge $ab$ to $b$: length 1. A walked edge is thick and dashed.
unclass current: a
class visited: a
class current: b
class path: a--b
step: Along $be$ to $e$: length 2.
unclass current: b
class visited: b
class current: e
class path: b--e
step: Back along $be$ to $b$: length 3. An edge walked twice turns thick and solid.
unclass current: e
class visited: e
unclass visited: b
class current: b
unclass path: b--e
class highlight: b--e
step: Back along $ab$ to $a$: length 4. The walk ends where it started, so it is closed.
unclass current: b
class visited: b
unclass visited: a
class current: a
unclass path: a--b
class highlight: a--b
```

We write this walk as $(a, b, e, b, a)$. It lists five vertices but has length 4, because the
length counts steps. Both edges are used twice, and that is allowed.

A non-example: going straight from $a$ to $c$ is not a walk in $G$. The vertices $a$ and $c$
are not [[def:adjacent|adjacent]], so there is no step from one to the other.

A walk is a list of steps. A path or a cycle is a piece of the graph, a
[[def:subgraph|subgraph]]. A **path** in $G$ is a subgraph of $G$
[[def:isomorphism|isomorphic]] to some [[def:path-graph|path graph]] $P_k$. A **cycle** in $G$
is a subgraph isomorphic to some [[def:cycle-graph|cycle graph]] $C_k$. A **$u$–$v$ path** is a
path whose two ends are $u$ and $v$.

```graph id=t02-path-cycle widget=figure
caption: In $G$, the thick dashed edges form an $a$–$e$ path, a copy of $P_2$. The thick solid triangle on $b$, $c$, $d$ is a cycle, a copy of $C_3$.
intent: New figure (the lecture has none). A path and a cycle as subgraphs of the running graph; the path is the one the walk (a, b, e) traces.
layout: fixed
a @(0, 0); b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9)
a -- b [class=path]; b -- c [class=cycle]; c -- d [class=cycle]; d -- b [class=cycle]; b -- e [class=path]
mark path: a b e a--b b--e
mark cycle: b c d b--c c--d d--b
```

A walk whose vertices are all distinct traces a path: its vertices and edges form a path from
$v_0$ to $v_k$. The walk from $a$ through $b$ to $e$ has distinct vertices, and it traces
[[fig:t02-path-cycle#path|the path from $a$ to $e$]]. Its three vertices and two edges form a
copy of $P_2$. [[fig:t02-path-cycle#cycle|The triangle]] is a cycle in $G$.

::: pitfall
A walk is a *sequence*, a path or a cycle is a *subgraph*. A walk of length $k$ with distinct
vertices traces a path $P_k$, which has $k + 1$ vertices. A closed walk of length $k$, at least 3,
whose vertices $v_0$ to $v_{k-1}$ are distinct traces a cycle $C_k$. But not every closed walk
traces a cycle: $(a, b, a)$ goes along one edge and back, and there is no cycle of length $2$ in a
graph.
:::

Back to the opening question. The walker's route had length 5. The direct route had length 2,
and it was a path.

::: claim {#claim:shortest-walk-path title="Shortest walks are paths" source="theory/2026-09-22 p4"}
A shortest walk between vertices $v_0$ and $v_k$ in a graph is a path.
:::

::: intuition {for=claim:shortest-walk-path}
If a walk visits a vertex twice, the part between the two visits is a detour. Cutting it out
leaves a shorter walk between the same ends. A shortest walk has no detour, so its vertices are
distinct, and it traces a path.
:::

The lecture states this without proof.

The figure cuts the detour out of the walker's route. The part to remove is
[[fig:t02-shortcut#detour|the round trip from $b$ back to $b$]].

```graph id=t02-shortcut widget=stepper
caption: Shortening a walk: when a walk revisits a vertex, the part between the two visits can be cut out.
intent: Illustrates the claim: walk a-b-c-d-b-e repeats b; cutting gives the path a-b-e.
layout: fixed
a @(0, 0); b @(1, 0); c @(1.6, 0.9); d @(2.2, 0); e @(2, -0.9)
a -- b; b -- c; c -- d; d -- b; b -- e
mark detour: b--c c--d d--b
step: The walk $(a, b, c, d, b, e)$ from $a$ to $e$ visits $b$ twice.
class path: a--b b--c c--d d--b b--e
step: The closed part $(b, c, d, b)$ between the two visits can be removed.
class muted: b--c c--d d--b
unclass path: b--c c--d d--b
step: What remains, $(a, b, e)$, is a shorter walk from $a$ to $e$; here it is already a path.
```

## Check yourself

:::: quiz {#q:t02-walks-from-a}
How many walks of length 2 in $G$ start at $a$?

answer: 4

::: explanation
The first step must go to $b$, the only neighbour of $a$. The second step goes from $b$ to any
neighbour of $b$: $a$, $c$, $d$ or $e$. So the walks are $(a, b, a)$, $(a, b, c)$, $(a, b, d)$
and $(a, b, e)$. The walk $(a, b, a)$ counts too: a walk may go back along the edge it came by.
:::
::::

:::: quiz {#q:t02-shortest-a-d}
What is the length of a shortest walk from $a$ to $d$ in $G$?

answer: 2

::: explanation
$a$ and $d$ are not adjacent, so no walk of length 1 goes from $a$ to $d$. The walk
$(a, b, d)$ has length 2. Its vertices are distinct, so it traces a path, as the claim says.
:::
::::
