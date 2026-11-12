---
title: "The set version of Menger's theorem"
course: theory
chapter: menger
order: 8
lectures: [t05]
stage: split
status: reviewed
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

Direction ($\Rightarrow$): we build a bigger graph $G^*$ and apply Menger's theorem to a single pair of new vertices.

:::: walkthrough {for=thm:total-menger}
```graph id=t05-total-menger-forward widget=stepper
caption: A $2$-connected grid $G$ with $k = 2$, $S = \{a, d\}$ and $T = \{c, f\}$; we build $G^*$ and find $2$ disjoint $S$–$T$ paths.
intent: New. The lecture (theory/2026-10-13 p2) draws the construction in general, with no concrete graph. This runs it on a small $2$-connected graph.
layout: fixed
a [class=color1] @(0, 1); b @(1, 1); c [class=color2] @(2, 1); d [class=color1] @(0, 0); e @(1, 0); f [class=color2] @(2, 0)
a -- b; b -- c; d -- e; e -- f; a -- d; b -- e; c -- f
mark S: a d
mark T: c f
step: Add $s$ next to $S$ and $t$ next to $T$.
s @(-0.9, 0.5); t @(2.9, 0.5)
s -- a [class=dashed]; s -- d [class=dashed]; t -- c [class=dashed]; t -- f [class=dashed]
mark Gstar: s t
step: Take an $s$–$t$ cut $X$ with fewer than $k$ vertices.
class cut: b
mark X: b
step: $G - X$ is connected.
class muted: a--b b--c b--e
step: $S \setminus X$ and $T \setminus X$ are not empty.
mark SX: a d
mark TX: c f
class highlight: a d c f
step: This gives an $s$–$t$ path avoiding $X$.
class path: s--d d--e e--f f--t
step: Menger gives $k$ internally disjoint $s$–$t$ paths.
unclass path: s--d d--e e--f f--t
unclass muted: a--b b--c b--e
unclass cut: b
unclass highlight: a d c f
class color3: s--a a--b b--c c--t
class color4: s--d d--e e--f f--t
step: Remove $s$ and $t$: disjoint $S$–$T$ paths in $G$.
remove s t
```

::: step
Let $G$ be $k$-connected. We add a new vertex $s$ joined to every vertex of [[fig:t05-total-menger-forward#S|$S$]], and a new vertex $t$ joined to every vertex of [[fig:t05-total-menger-forward#T|$T$]]. Call the result $G^*$. The vertices $s$ and $t$ are not adjacent. Here: $k = 2$, $S = \{a, d\}$, $T = \{c, f\}$.
:::

::: step
To use Menger's theorem we must show that $G^*$ has no $s$–$t$ cut of size at most $k - 1$. So suppose $X$ is such a [[def:st-cut|cut]]. A cut avoids $s$ and $t$, so $X$ is a set of vertices of $G$. Here we try [[fig:t05-total-menger-forward#X|$X$]] $= \{b\}$, one vertex.
:::

::: step
$G$ is $k$-connected, and $X$ has fewer than $k$ vertices. By the [[def:k-connected|definition]], the rest $G - X$ stays connected. This is the first use of the hypothesis. Here: after deleting $b$, the path $a, d, e, f, c$ remains.
:::

::: step
$S$ has $k$ vertices and $X$ has fewer, so $X$ cannot contain all of $S$. Hence $S \setminus X$ is not empty. The same argument works for $T \setminus X$. Here $X$ contains no vertex of $S$ or $T$: [[fig:t05-total-menger-forward#SX|$a, d$]] and [[fig:t05-total-menger-forward#TX|$c, f$]] remain.
:::

::: step
Pick $x$ in $S \setminus X$ and $y$ in $T \setminus X$. Then $s$ is adjacent to $x$ and $y$ is adjacent to $t$. As $G - X$ is connected, it has an $x$–$y$ path. Put together, they form an $s$–$t$ path in $G^* - X$. So $X$ is not a cut: contradiction. Here: $s, d, e, f, t$.
:::

::: step
So $G^*$ has no $s$–$t$ cut of size at most $k - 1$, and no arc joins $s$ and $t$. We replace each edge by two opposite arcs; deleting vertices destroys the same paths as before. [[thm:menger-directed|Menger's theorem]] (part A) gives $k$ internally disjoint $s$–$t$ paths. Here $s, a, b, c, t$ and $s, d, e, f, t$.
:::

::: step
We delete $s$ and $t$ from each path. Internally disjoint paths share only $s$ and $t$, so what remains is disjoint. The vertex after $s$ is a neighbour of $s$, so it lies in $S$. The vertex before $t$ lies in $T$. A path $s, x, t$ leaves the single vertex $x$. Here: $a, b, c$ and $d, e, f$.
:::
::::

Direction ($\Leftarrow$): we argue by contradiction. A small vertex set $X$ that disconnects $G$ gives two sets $S$ and $T$ with no good paths.

:::: walkthrough {for=thm:total-menger}
```graph id=t05-total-menger-backward widget=stepper
caption: The bowtie ($k = 3$) is not $3$-connected: $X = \{m\}$ separates $u$ from $v$. We follow the argument that $S$ and $T$ then have no $3$ disjoint paths.
intent: New. The lecture (theory/2026-10-13 p2) has no figure for this direction. The bowtie is the non-example of the page's intuition block.
layout: fixed
u @(0, 0.8); p @(0, -0.8); m @(1.5, 0); v @(3, 0.8); q @(3, -0.8)
u -- p; u -- m; p -- m; m -- v; m -- q; v -- q
step: A set $X$ disconnects $G$, with $u$ and $v$ in different components.
class cut: m
class color1: u
class color2: v
mark X: m
step: Add $Y$ so that $X \cup Y$ has $k - 1$ vertices.
class color3: p
mark Y: p
step: Define $S$ and $T$ with $k$ vertices each.
class color3: m
mark S: m p u
mark T: m p v
step: Disjoint paths use each vertex of $S$ and of $T$ once.
class bold: u m p v
step: The path $Q$ through $u$ ends at $v$.
mark Q: u v
class current: u v
step: $Q$ would be a $u$–$v$ path in $G - X$.
class rejected: u--m m--v
```

::: step
Suppose the paths exist for all $S$ and $T$, but $G$ is not $k$-connected. $G$ has at least $k + 1$ vertices, so a small set $X$ with at most $k - 1$ vertices must disconnect $G$. Choose $u$ and $v$ in different components of $G - X$. Here $k = 3$, [[fig:t05-total-menger-backward#X|$X$]] $= \{m\}$.
:::

::: step
$G$ has at least $k + 1$ vertices (hypothesis), so at least $k - 1 - \abs{X}$ vertices lie outside $X$, $u$ and $v$. We choose [[fig:t05-total-menger-backward#Y|a set $Y$]] of exactly that many vertices, so that $X \cup Y$ has $k - 1$ vertices. Here $G$ has 5 vertices, $p$ and $q$ are free, and we take $Y = \{p\}$.
:::

::: step
Let $S$ be $X \cup Y$ plus $u$, and $T$ be $X \cup Y$ plus $v$. The vertices $u$ and $v$ are outside $X \cup Y$, so $S$ and $T$ have $k$ vertices each. Here [[fig:t05-total-menger-backward#S|$S$]] is $\{m, p, u\}$ and [[fig:t05-total-menger-backward#T|$T$]] is $\{m, p, v\}$.
:::

::: step
By the assumption, there are $k$ disjoint $S$–$T$ paths. Each has an end in $S$, and disjoint paths have different ends, so the $k$ paths use $k$ different vertices of $S$. As $\abs{S} = k$, every path has exactly one vertex of $S$. The same count gives exactly one vertex of $T$ per path.
:::

::: step
Let $Q$ be the path through $u$. Its only vertex of $S$ is $u$. As $X \cup Y$ lies in $S$, $Q$ has no vertex of $X \cup Y$. But $Q$ has a vertex of $T$, and $T$ consists of $X \cup Y$ and $v$. So that vertex is $v$, and [[fig:t05-total-menger-backward#Q|$Q$]] runs from $u$ to $v$.
:::

::: step
$X$ lies in $X \cup Y$, so $Q$ avoids $X$. It is a $u$–$v$ path in $G - X$. But $u$ and $v$ lie in different components of $G - X$: contradiction. So $G$ is $k$-connected. Here every $u$–$v$ path passes through $m$.
:::
::::

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
