---
title: "Cliques and independent sets"
course: theory
chapter: basics
order: 7
lectures: [t02]
stage: split
status: draft
---

::: definition {#def:clique title="Clique, independent set" defines="clique, independent set" source="theory/2026-09-22 p3"}
A **clique** in $G$ is a subgraph of $G$ [[def:isomorphism|isomorphic]] to a [[def:complete-graph|complete graph]] $K_m$. (Equivalently, a set
of pairwise adjacent vertices.)

An **independent set** in $G$ is a set $X \subseteq V(G)$ such that no edge of $G$ has both ends in
$X$.
:::

```graph id=t02-clique-independent widget=figure
caption: The highlighted vertices form a clique $K_4$; the four vertices on the right form an independent set.
intent: Transcription of the lecture picture: a dense blob and a set of pairwise non-adjacent vertices.
layout: fixed
a @(0, 1) [class=highlight]; b @(1, 1) [class=highlight]; c @(1, 0) [class=highlight]; d @(0, 0) [class=highlight]
p @(2.4, 1) [class=color2]; q @(3.2, 1) [class=color2]; r @(2.4, 0) [class=color2]; s @(3.2, 0) [class=color2]
a -- b -- c -- d -- a [class=highlight]; a -- c [class=highlight]; b -- d [class=highlight]
c -- r; b -- p; d -- r; c -- s
```

A set $X$ is independent in $G$ exactly when it is a clique in the complement $\ol{G}$.

::: intuition {for=def:clique}
Read "adjacent" as "know each other": a clique is a group in which everybody knows everybody, an
independent set a group in which nobody knows anybody. A single vertex is both. Example: in $K_n$ the
whole vertex set is a clique, but every independent set has at most one vertex. In the [[def:cycle-graph|cycle]] $C_5$
the largest cliques are the edges ($K_2$) and the largest independent sets have two vertices.
:::
