---
title: "Paths and cuts between two vertices"
course: theory
chapter: menger
order: 3
lectures: [t05]
stage: split
status: reviewed
---

::: definition {#def:st-cut title="s–t paths and cuts" defines="s-t path, s-t cut, s-t edge cut, internally disjoint, edge-disjoint" source="theory/2026-10-13 p1"}
Let $G$ be a (possibly directed) multigraph and $s \ne t$ vertices.

- An **$s$–$t$ path** is a path between $s$ and $t$ in $G$ (in a directed graph: a directed path from $s$ to $t$).
- An **$s$–$t$ cut** (or directed cut) is a set $X \subseteq V(G) \setminus \set{s, t}$ such that $G - X$ contains **no** $s$–$t$ path.
- An **$s$–$t$ edge cut** is a set $F \subseteq E(G)$ such that $G - F$ contains no $s$–$t$ path.

Paths are **internally disjoint** if they share no vertices other than their ends, and **edge-disjoint** if they share no
edges.
:::

::: intuition
An $s$–$t$ cut is a set of checkpoints that every route from $s$ to $t$ must pass. It is the vertex cut of [[def:minimal-cut]]
without the minimality: any set of vertices other than $s, t$ that contains a cut is again a cut, and the minimal cuts are
the inclusion-minimal ones. Example: in $C_4 = (1, 2, 3, 4)$ with $s = 1$, $t = 3$, the set $\set{2, 4}$ is an $s$–$t$ cut, and
the paths $1\,2\,3$ and $1\,4\,3$ are internally disjoint (and edge-disjoint). Non-example: the three paths in
[[fig:t05-edge-disjoint-paths]] are edge-disjoint but not internally disjoint, as they share $a$ and $b$.
:::

```graph id=t05-st-cut-example widget=figure
caption: Left, the set $\set{a, b}$ is an $s$–$t$ cut, since $G - \set{a, b}$ has no $s$–$t$ path. Middle, the edges $at$ and $bt$ form an $s$–$t$ edge cut. Right, $\set{a}$ is not an $s$–$t$ cut, because the path $s\,b\,t$ survives.
intent: New example for the definition (the lecture, theory/2026-10-13 p1, only draws a cut crossing a route); the right panel is the non-example.
layout: fixed
panel: cut $\set{a, b}$
s [class=source] @(0, 0.5); a [class=cut] @(1, 1); b [class=cut] @(1, 0); t [class=sink] @(2, 0.5)
s -- a; s -- b; a -- t; b -- t
panel: edge cut $\set{at, bt}$
s [class=source] @(0, 0.5); a @(1, 1); b @(1, 0); t [class=sink] @(2, 0.5)
s -- a; s -- b; a -- t [class=cut]; b -- t [class=cut]
panel: $\set{a}$ is no cut
s [class=source] @(0, 0.5); a [class=cut] @(1, 1); b @(1, 0); t [class=sink] @(2, 0.5)
s -- a; a -- t; s -- b [class=path]; b -- t [class=path]
```

If $G$ has an edge ([[def:mixed-multigraph|arc]]) from $s$ to $t$, there is no $s$–$t$ (vertex) cut at all, since deleting vertices other than $s, t$ never
destroys that edge.
