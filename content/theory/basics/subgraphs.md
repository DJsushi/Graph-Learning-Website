---
title: "Subgraphs"
course: theory
chapter: basics
order: 6
lectures: [t02]
stage: split
status: reviewed
---

::: definition {#def:subgraph title="Subgraph, induced subgraph" defines="subgraph, induced subgraph" source="theory/2026-09-22 p3"}
A graph $G_1$ is a **subgraph** of a graph $G$, written $G_1 \subseteq G$, if
$V(G_1) \subseteq V(G)$, $E(G_1) \subseteq E(G)$ (and $G_1$ is a graph, i.e. every edge of $G_1$ has
both endpoints in $V(G_1)$).

$G_1$ is an **induced subgraph** of $G$, written $G_1 \subseteq_i G$, if $G_1 \subseteq G$ and for all
$u, v \in V(G_1)$:
$$\set{u, v} \in E(G_1) \iff \set{u, v} \in E(G).$$
:::

::: intuition
A subgraph is what is left after deleting some vertices (together with their edges) and then
possibly some further edges. An induced subgraph allows only the first step: choose the vertices,
and every edge of $G$ among them stays. Example: in the triangle with vertices $a, b, c$, the [[def:path-graph|path]]
$a - b - c$ is a subgraph but not an induced one, because the edge $ac$ is missing although both its
ends are present. Non-example: a "subgraph" with vertices $a, b$ and the edge $ac$ is not a graph at all.
:::

An induced subgraph is determined by its vertex set alone: it keeps **all** edges of $G$ among
the chosen vertices. For $X \subseteq V(G)$ we write $G[X]$ for the subgraph **induced** on $X$, and
$G - X = G[V(G) \setminus X]$ for the graph obtained by **deleting** the vertices of $X$ (with all
their edges). For a set $F$ of edges, $G - F$ deletes the edges (and keeps all vertices), and
$G + e$ adds an edge $e$. We write $G - v$ and $G - e$ for single elements.

::: pitfall
Deleting a vertex also deletes its edges, so $G - v$ is always an induced subgraph. Deleting an edge
keeps both its ends, so $G - e$ is **never** an induced subgraph of $G$: it has all vertices of $G$ but
misses the edge $e$ between two of them.
:::

```graph id=t02-subgraphs widget=figure
caption: A graph $G$, a subgraph of $G$ that is not induced (the edge $bd$ is missing), and the induced subgraph $G[\set{a,b,c,d}]$.
intent: Contrast subgraph vs induced subgraph on the same vertex set.
layout-sync: true
height: small
panel: $G$
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0); e @(2, 0.5)
a -- b -- c -- d -- a; b -- d; b -- e; c -- e
panel: subgraph
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
a -- b -- c -- d -- a
panel: $G[\set{a,b,c,d}]$
a @(0, 1); b @(1, 1); c @(1, 0); d @(0, 0)
a -- b -- c -- d -- a; b -- d
```

For [[def:mixed-multigraph|multigraphs]] the definition must also keep the endpoint map:

::: definition {#def:submultigraph title="Submultigraph" source="theory/2026-09-22 p3"}
$G_1 = (V_1, E_1, \varepsilon_1)$ is a **submultigraph** of $G = (V, E, \varepsilon)$ if
$V_1 \subseteq V$, $E_1 \subseteq E$, and $\varepsilon_1(e) = \varepsilon(e)$ for all $e \in E_1$.
:::

The condition $\varepsilon_1(e) = \varepsilon(e)$ says that an edge keeps its endpoints when we pass
to the submultigraph (and implicitly that those endpoints lie in $V_1$).

::: intuition {for=def:submultigraph}
In a multigraph the edges are objects in their own right, so a submultigraph chooses *which*
edges to keep, not just which pairs of vertices stay joined. Example: if $e$ and $f$ are two parallel
edges between $u$ and $v$, keeping $e$ and keeping $f$ give two different submultigraphs. What is not
allowed is to move an edge: $\varepsilon_1(e) = \varepsilon(e)$ fixes its endpoints and its kind (loop,
arc or edge).
:::

```graph id=t02-submultigraph widget=figure
caption: Left, a multigraph $G$ with the parallel edges $e, f$ between $u$ and $v$, the edge $g$ and a loop $h$ at $w$. Middle, a submultigraph that keeps $f$ and $g$ and drops $e$ and $h$; each kept edge has the same ends as in $G$. Right, not a submultigraph, because $e$ now joins $u$ and $w$ instead of $u$ and $v$.
intent: New figure (the lecture shows no drawing for the submultigraph on p3). Example and non-example for the definition; the right panel moves the edge $e$, which $\varepsilon_1(e) = \varepsilon(e)$ forbids.
layout: fixed
panel: $G$
u @(0, 0.5); v @(1.2, 0.5); w @(2.4, 0.5)
u -- v [label="$e$" bend=0.5]; u -- v [label="$f$" bend=-0.5]; v -- w [label="$g$"]; w -- w [label="$h$" side=top]
panel: submultigraph
u @(0, 0.5); v @(1.2, 0.5); w @(2.4, 0.5)
u -- v [label="$f$"]; v -- w [label="$g$"]
panel: not a submultigraph
u @(0, 0.5); v @(1.2, 0.5); w @(2.4, 0.5)
u -- w [label="$e$" bend=0.6 class=rejected]; v -- w [label="$g$"]
```
