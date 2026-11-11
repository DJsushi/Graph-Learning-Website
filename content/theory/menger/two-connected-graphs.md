---
title: "2-connected graphs and cycles"
course: theory
chapter: menger
order: 9
lectures: [t05]
stage: split
status: draft
---

::: theorem {#thm:two-connected-cycles title="2-connected graphs and cycles" source="theory/2026-10-13 p3"}
Let $G$ be a graph with at least $3$ vertices. Then

a) $G$ is $2$-connected $\iff$ every two vertices of $G$ lie on a common cycle;

b) $G$ is $2$-connected $\iff$ every two edges of $G$ lie on a common cycle (and $G$ has no isolated vertex).
<!-- REVIEW: "at least 3 vertices" and "no isolated vertex" are not on the board (p3). Both needed: K_2 is not 2-connected; a triangle plus an isolated vertex satisfies "every two edges lie on a common cycle". -->
:::

::: intuition
A [[def:cycle-graph|cycle]] is the simplest $2$-connected graph: it offers two routes between any two of its vertices. The theorem
says that $2$-connected graphs are exactly the graphs that are "covered by cycles" in this strong sense. Example: in $K_4$ any two
vertices, and any two edges, lie on a common $4$-cycle or triangle. Non-example: two triangles sharing one vertex: a non-shared vertex of one
triangle and a non-shared vertex of the other lie on no common cycle, as such a cycle would pass the shared vertex twice. The side condition
in b) excludes graphs like a triangle plus an [[def:degree|isolated vertex]].
:::

::: proof
**a)** This is Menger's theorem a) for $k = 2$: two internally disjoint $u$–$v$ paths form a cycle through $u$ and $v$ (if one of them is the edge $uv$,
the other has length at least $2$, as $G$ is simple), and conversely a cycle through $u$ and $v$ splits into two internally disjoint $u$–$v$ paths.

**b)** ($\Rightarrow$) Let $e = ab$ and $f = cd$ be edges. Apply the set version ([[thm:total-menger]]) with $k = 2$, $S = \set{a, b}$, $T = \set{c, d}$: there are
two disjoint paths $P_1, P_2$, each containing exactly one vertex of $S$ and one of $T$ (as in the previous proof). Then $e$, $P_1$, $f$, $P_2$ form a [[def:walk|closed
walk]] in which no vertex repeats, i.e. a cycle containing $e$ and $f$. (If $e$ and $f$ share a vertex, say $b = c$, then one of the paths is the trivial
path $b$, and the cycle is $e$, $f$ plus a $d$–$a$ path avoiding $b$; if $e = f$, take any cycle through $e$ and another edge.)

($\Leftarrow$) Given vertices $u \ne v$, choose distinct edges $e \ni u$ and $f \ni v$ (no vertex is isolated; if $uv$ is the only edge at both $u$ and $v$,
take $e = uv$ and $f$ any other edge, which exists as $G$ has at least $3$ vertices and none is isolated). A cycle through $e$ and $f$ passes through $u$
and $v$, so a) applies.
<!-- REVIEW: gap filled: e and f must be distinct for "two edges". -->
:::

```graph id=t05-two-edges-cycle widget=figure
caption: In a 2-connected graph, two disjoint paths between the ends of $e$ and the ends of $f$ close a cycle through both edges.
intent: Transcription of the lecture sketch for 2b.
layout: fixed
a @(0, 1); b @(1, 1); c @(0, -1); d @(1, -1); x @(-0.6, 0); y @(1.6, 0); z @(0.5, 0)
a -- b [class=highlight label="$e$"]; c -- d [class=highlight label="$f$"]
a -- x [class=cycle]; x -- c [class=cycle]; b -- y [class=cycle]; y -- d [class=cycle]; z -- a; z -- d
```
