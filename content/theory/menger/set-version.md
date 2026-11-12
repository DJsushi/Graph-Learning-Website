---
title: "The set version of Menger's theorem"
course: theory
chapter: menger
order: 8
lectures: [t05]
stage: split
status: draft
---

::: theorem {#thm:total-menger title="Set version of Menger's theorem" aka="total Menger" source="theory/2026-10-13 p2"}
A graph $G$ with at least $k + 1$ vertices is $k$-connected $\iff$ for all $S, T \subseteq V(G)$ with $\abs{S} = \abs{T} = k$ there exist $k$ (vertex-)disjoint
paths, each with one end in $S$ and the other end in $T$.
<!-- REVIEW: "at least k + 1 vertices" added (not on the board, p2): K_k satisfies the right side (trivial paths for S = T = V) but is not k-connected. -->
:::

::: intuition
Instead of two vertices we connect two whole sets of $k$ terminals: in a $k$-connected graph any $k$ sources can be routed to any
$k$ targets along disjoint [[def:path-graph|paths]]. The proof glues a new vertex to all of $S$ and another to all of $T$
([[fig:t05-total-menger]]), the same trick as a super-source and super-sink in flow problems. Example: in $C_4 = (1, 2, 3, 4)$ with
$S = \set{1, 2}$, $T = \set{3, 4}$, take the paths $1\,4$ and $2\,3$. Non-example: in the bowtie graph (two triangles sharing one vertex),
which is not $2$-connected, let $S$ be the two outer vertices of the left triangle and $T$ those of the right one: every $S$–$T$ path
passes through the middle vertex, so no two of them are disjoint.
:::

::: pitfall
The $S$–$T$ paths are disjoint **including their ends**, unlike the internally disjoint $s$–$t$ paths of [[thm:menger]], which all
share $s$ and $t$. $S$ and $T$ may overlap.
:::

Paths of [[def:path-graph|length]] $0$ are allowed: a vertex of $S \cap T$ is a path from $S$ to $T$ on its own. (This answers the question "$S = T$?" on the board:
then the $k$ trivial paths do the job.)

```graph id=t05-total-menger widget=figure
caption: The proof of the set version: add a new vertex $s$ adjacent to all of $S$ and a new vertex $t$ adjacent to all of $T$, then apply Menger's theorem to $s$ and $t$.
intent: Transcription of the lecture construction.
layout: fixed
s [class=source] @(-1.5, 0); s1 @(0, 1); s2 @(0, 0); s3 @(0, -1); t1 @(3, 1); t2 @(3, 0); t3 @(3, -1); t [class=sink] @(4.5, 0); m1 @(1.5, 0.6); m2 @(1.5, -0.6)
s -- s1 [class=dashed]; s -- s2 [class=dashed]; s -- s3 [class=dashed]; t -- t1 [class=dashed]; t -- t2 [class=dashed]; t -- t3 [class=dashed]
s1 -- m1 [class=path]; m1 -- t2 [class=path]; s2 -- t1 [class=path]; s3 -- m2 [class=path]; m2 -- t3 [class=path]; m1 -- m2; s2 -- m2
group S: s1 s2 s3 [label="$S$"]
group T: t1 t2 t3 [label="$T$"]
```

::: proof
($\Rightarrow$) Add a new vertex $s$ adjacent to all vertices of $S$ and a new vertex $t$ adjacent to all vertices of $T$; call the result $G^*$. The
vertices $s, t$ are not adjacent. Every $s$–$t$ cut $X$ of $G^*$ with $\abs{X} \le k - 1$ is a set of vertices of $G$; then $G - X$ is [[def:component|connected]], and
$S \setminus X$, $T \setminus X$ are non-empty (as $\abs{S} = \abs{T} = k > \abs{X}$), so $G^* - X$ contains an $s$–$t$ path through $S \setminus X$, $G - X$ and
$T \setminus X$. So there is no $s$–$t$ cut of size $\le k - 1$, and by Menger ([[thm:menger-directed]] A, via the directed version of $G^*$) there are $k$
[[def:st-cut|internally disjoint]] $s$–$t$ paths in $G^*$. Removing $s$ and $t$ from them leaves $k$ disjoint paths in $G$, each starting at a vertex of $S$ and
ending at a vertex of $T$.

($\Leftarrow$) Suppose $X$ with $\abs{X} \le k - 1$ disconnects $G$, with $u$ and $v$ in different components of $G - X$. Since $\abs{V(G)} \ge k + 1$ we can
choose a set $Y \subseteq V(G) \setminus (X \cup \set{u, v})$ with $\abs{X \cup Y} = k - 1$. Let $S = X \cup Y \cup \set{u}$ and $T = X \cup Y \cup \set{v}$. Take $k$ disjoint
$S$–$T$ paths. Each contains a vertex of $S$, the paths are disjoint and $\abs{S} = k$, so each path contains exactly one vertex of $S$, and likewise
exactly one vertex of $T$. The path containing $u$ thus contains no vertex of $X \cup Y \subseteq S$, so its vertex in $T$ is $v$. It is a $u$–$v$ path
in $G - X$, a contradiction.
:::
