---
title: "2-connected graphs and cycles"
course: theory
chapter: menger
order: 9
lectures: [t05]
stage: split
status: reviewed
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

Part a), direction ($\Rightarrow$): Menger's theorem gives two disjoint routes, and the two routes together form the cycle.

:::: walkthrough {for=thm:two-connected-cycles}
```graph id=t05-two-cycles-a-forward widget=stepper
caption: A $2$-connected grid; two adjacent vertices $u$, $v$ and the two disjoint $u$–$v$ paths that Menger gives.
intent: New. The lecture (theory/2026-10-13 p3) only says "actually Menger for k = 2" and draws no figure for a). The grid is small and has the edge case (adjacent $u$, $v$).
layout: fixed
u @(0, 0.65); v @(1.5, 0.65); p @(3, 0.65); q @(0, -0.65); r @(1.5, -0.65); s @(3, -0.65)
u -- v; v -- p; q -- r; r -- s; u -- q; v -- r; p -- s
mark uv: u v
step: Fix two vertices $u$ and $v$.
class color1: u
class color2: v
step: Menger gives two internally disjoint $u$–$v$ paths.
class color3: u--v
class color4: u--q q--r v--r
mark P1: u--v
mark P2: u--q q--r v--r
step: One path has an inner vertex.
class bold: q r
step: Both paths together form a cycle.
unclass color3: u--v
unclass color4: u--q q--r v--r
unclass bold: q r
class cycle: u--v u--q q--r v--r
```

::: step
Let $G$ be [[def:k-connected|2-connected]] with at least $3$ vertices. Fix two vertices [[fig:t05-two-cycles-a-forward#uv|$u$ and $v$]]. We need a cycle through both, so we look for two routes from $u$ to $v$ that do not meet. Here: $u$ and $v$ are adjacent.
:::

::: step
This is where we use the hypothesis. [[thm:menger|Menger's theorem]] a) with $k = 2$ says that a $2$-connected graph has two [[def:st-cut|internally disjoint]] $u$–$v$ paths for every pair $u \ne v$. Call them [[fig:t05-two-cycles-a-forward#P1|$P_1$]] and [[fig:t05-two-cycles-a-forward#P2|$P_2$]]. Here: $P_1$ is the edge $uv$, and $P_2$ is $u, q, r, v$.
:::

::: step
The paths are different, and a simple graph has only one edge between $u$ and $v$. So at most one path is the edge $uv$. The other has an inner vertex, hence length at least $2$. Here: $P_2$ has the inner vertices $q$ and $r$.
:::

::: step
Walk along $P_1$ from $u$ to $v$, then back along $P_2$ to $u$. Only $u$ appears twice, at both ends: a path repeats no vertex, and the two paths share no inner vertex. The length is at least $1 + 2 = 3$, so this closed walk is a cycle through $u$ and $v$. Here: $u, v, r, q$.
:::
::::

Part a), direction ($\Leftarrow$): a common cycle, cut at the two vertices, gives the two disjoint paths that Menger's theorem asks for.

:::: walkthrough {for=thm:two-connected-cycles}
```graph id=t05-two-cycles-a-backward widget=stepper
caption: A cycle through $u$ and $v$ splits into two internally disjoint $u$–$v$ paths.
intent: New. The lecture (theory/2026-10-13 p3) draws no figure for a). The grid is the same shape as in the other walkthrough of a), with $u$ and $v$ at opposite corners.
layout: fixed
u @(0, 0.65); a @(1.5, 0.65); b @(3, 0.65); c @(0, -0.65); d @(1.5, -0.65); v @(3, -0.65)
u -- a; a -- b; c -- d; d -- v; u -- c; a -- d; b -- v
mark uv: u v
step: Fix $u$ and $v$; they lie on a cycle.
class color1: u
class color2: v
class cycle: u--a a--b b--v d--v c--d u--c
mark C: u--a a--b b--v d--v c--d u--c
step: Cutting the cycle at $u$ and $v$ gives two paths.
unclass cycle: u--a a--b b--v d--v c--d u--c
class color3: u--a a--b b--v
class color4: u--c c--d d--v
mark P1: u--a a--b b--v
mark P2: u--c c--d d--v
step: The two paths meet only at $u$ and $v$.
class highlight: a b c d
step: All pairs work, so Menger applies.
unclass highlight: a b c d
class visited: u a b c d v
```

::: step
Assume every two vertices lie on a common cycle, and fix two vertices [[fig:t05-two-cycles-a-backward#uv|$u$ and $v$]]. By the hypothesis, some cycle [[fig:t05-two-cycles-a-backward#C|$C$]] contains both. We want two internally disjoint $u$–$v$ paths. Here: $C$ is the outer $6$-cycle.
:::

::: step
Remove $u$ and $v$ from $C$. A cycle minus two of its vertices falls into two pieces, one on each side. Adding $u$ and $v$ back to each piece gives two $u$–$v$ paths, [[fig:t05-two-cycles-a-backward#P1|$P_1$]] and [[fig:t05-two-cycles-a-backward#P2|$P_2$]]. A piece may be empty: then that path is the edge $uv$.
:::

::: step
A cycle repeats no vertex. So a vertex of $C$ other than $u$ and $v$ lies on exactly one of the two pieces. Hence $P_1$ and $P_2$ have no common inner vertex: they are internally disjoint. Here: the inner vertices are $a, b$ and $c, d$.
:::

::: step
We fixed $u$ and $v$ arbitrarily, so every pair of vertices has two internally disjoint paths. $G$ has at least $3$ vertices, so [[thm:menger|Menger's theorem]] a) with $k = 2$ applies and says that $G$ is $2$-connected. This is where the assumption on the number of vertices is used.
:::
::::

Part b), direction ($\Rightarrow$), edges that do not meet: the set version of Menger's theorem gives two disjoint paths from the ends of $e$ to the ends of $f$, and $e$, $f$ close them up.

:::: walkthrough {for=thm:two-connected-cycles}
```graph id=t05-two-cycles-b-forward widget=stepper
caption: The lecture's picture for 2b on a small grid: the paths $a, x, c$ and $b, y, d$ together with $e$ and $f$ form a cycle.
intent: Taken from the lecture (theory/2026-10-13 p3: two edges as vertex pairs with two paths between them, as in figure t05-two-edges-cycle), on a concrete $2$-connected grid.
layout: fixed
a @(0, 0.65); b @(1.5, 0.65); y @(3, 0.65); x @(0, -0.65); c @(1.5, -0.65); d @(3, -0.65)
a -- b; b -- y; x -- c; c -- d; a -- x; b -- c; y -- d
step: Two edges $e$ and $f$ without a common vertex.
class highlight: a--b c--d
mark e: a--b
mark f: c--d
step: Take the ends of $e$ as $S$ and the ends of $f$ as $T$.
class color1: a b
class color2: c d
mark S: a b
mark T: c d
step: Menger gives two disjoint $S$–$T$ paths.
class color3: a--x x--c
class color4: b--y y--d
mark P1: a--x x--c
mark P2: b--y y--d
step: Each path has one vertex of $S$ and one of $T$.
class muted: x y
step: Join $e$, $P_2$, $f$ and $P_1$ into a closed walk.
unclass color3: a--x x--c
unclass color4: b--y y--d
unclass highlight: a--b c--d
class cycle: a--b b--y y--d c--d x--c a--x
step: No vertex repeats, so it is a cycle.
unclass muted: x y
```

::: step
Let $G$ be $2$-connected and let [[fig:t05-two-cycles-b-forward#e|$e$]] and [[fig:t05-two-cycles-b-forward#f|$f$]] be two edges. We first assume they have no common vertex; the other cases come next. We want a cycle through both. Here: $e = ab$ and $f = cd$.
:::

::: step
We put $S$ and $T$ equal to the end sets of the two edges. Both have exactly $2$ vertices, the same number as $k = 2$ in the set version. Here: [[fig:t05-two-cycles-b-forward#S|$S = \{a, b\}$]] and [[fig:t05-two-cycles-b-forward#T|$T = \{c, d\}$]].
:::

::: step
$G$ is $2$-connected and $S$, $T$ have $2$ vertices. So the set version ([[thm:total-menger]]) with $k = 2$ gives two disjoint $S$–$T$ paths [[fig:t05-two-cycles-b-forward#P1|$P_1$]] and [[fig:t05-two-cycles-b-forward#P2|$P_2$]]. Here: $a, x, c$ and $b, y, d$.
:::

::: step
The paths are disjoint and each starts in $S$, so they start at the two different vertices of $S$. A path with a second vertex of $S$ would meet the other path. The same holds for $T$. Hence each path has exactly one vertex of $S$ and one of $T$.
:::

::: step
Name the ends of $f$ so that $P_1$ joins $a$ to $c$ and $P_2$ joins $b$ to $d$. Go from $a$ to $b$ along $e$, from $b$ to $d$ along $P_2$, from $d$ to $c$ along $f$, and from $c$ back to $a$ along $P_1$. This is a closed walk.
:::

::: step
The paths are disjoint, and each repeats no vertex. The edges $e$ and $f$ only join end vertices of the paths and add none. So the closed walk repeats no vertex, and it has length at least $3$. Hence it is a cycle, and it contains $e$ and $f$ by construction.
:::
::::

Part b), direction ($\Rightarrow$), the special cases: if $e$ and $f$ share a vertex, one of the two paths is a single vertex; if $e = f$, we use another edge.

:::: walkthrough {for=thm:two-connected-cycles}
```graph id=t05-two-cycles-b-forward-shared widget=stepper
caption: Two edges $e = ab$ and $f = bd$ with the common vertex $b$: the trivial path $b$ and a path from $a$ to $d$ avoiding $b$ close up to a cycle.
intent: New. The lecture (theory/2026-10-13 p3) does not discuss these cases; the written proof does.
layout: fixed
a @(0, 0.65); b @(1.5, 0.65); z @(3, 0.65); x @(0, -0.65); d @(1.5, -0.65); w @(3, -0.65)
a -- b; b -- z; x -- d; d -- w; a -- x; b -- d; z -- w
step: Two edges $e$ and $f$ with a common vertex $b$.
class highlight: a--b b--d
mark e: a--b
mark f: b--d
step: $S$ and $T$ now share the vertex $b$.
class color1: a
class color2: d
class color3: b
mark S: a b
mark T: b d
step: The path through $b$ is the single vertex $b$.
class current: b
step: The other path joins $a$ to $d$ and avoids $b$.
class color4: a--x x--d
mark Q: a--x x--d
step: $e$, $f$ and this path form a cycle.
unclass color4: a--x x--d
unclass current: b
class cycle: a--b b--d x--d a--x
step: If $e = f$, use a second edge.
unclass highlight: b--d
class bold: a--b
```

::: step
Let [[fig:t05-two-cycles-b-forward-shared#e|$e$]] and [[fig:t05-two-cycles-b-forward-shared#f|$f$]] be two different edges with a common vertex $b$. Say $e$ joins $a$ to $b$ and $f$ joins $b$ to $d$. We repeat the construction. Here: $e = ab$ and $f = bd$.
:::

::: step
We take $S = \{a, b\}$ and $T = \{b, d\}$ as before. A vertex of $S \cap T$ counts as a path of length $0$, so the set version ([[thm:total-menger]]) with $k = 2$ still gives two disjoint $S$–$T$ paths. Here: [[fig:t05-two-cycles-b-forward-shared#S|$S$]] and [[fig:t05-two-cycles-b-forward-shared#T|$T$]] share $b$.
:::

::: step
The vertex $b$ lies on one of the two paths. That path has exactly one vertex of $S$ and one of $T$, as in the main case, and $b$ is both. So its start and its end are $b$: it is the trivial path $b$.
:::

::: step
The other path, [[fig:t05-two-cycles-b-forward-shared#Q|$Q$]], is disjoint from the path $b$, so it avoids $b$. It goes from the other vertex of $S$ to the other vertex of $T$. Here: $Q$ is $a, x, d$.
:::

::: step
Go along $e$ from $a$ to $b$, along $f$ from $b$ to $d$, and back along $Q$ to $a$. The path $Q$ avoids $b$ and repeats no vertex, so no vertex repeats. The length is at least $3$. So this is a cycle containing $e$ and $f$.
:::

::: step
Suppose $e = f$. $G$ is connected and has at least $3$ vertices, so it has an edge $f'$ different from $e$. The cases above give a cycle through $e$ and $f'$. This cycle contains $e$. Here: $f'$ is the edge $bd$, and the cycle is the one from the last step.
:::
::::

Part b), direction ($\Leftarrow$): two suitable edges, one at each vertex, give a cycle through both vertices, and then part a) applies.

:::: walkthrough {for=thm:two-connected-cycles}
```graph id=t05-two-cycles-b-backward widget=stepper
caption: From two vertices $u$, $v$ to an edge at each of them and a common cycle through these edges.
intent: New. The lecture (theory/2026-10-13 p3) only says that b) is the total Menger for k = 2 and draws no figure for this direction.
layout: fixed
u @(0, 0.65); p @(1.5, 0.65); q @(3, 0.65); r @(0, -0.65); s @(1.5, -0.65); v @(3, -0.65)
u -- p; p -- q; r -- s; s -- v; u -- r; p -- s; q -- v
mark uv: u v
step: Fix two vertices $u$ and $v$.
class color1: u
class color2: v
step: Choose an edge $e$ at $u$ and a different edge $f$ at $v$.
class highlight: u--p s--v
mark e: u--p
mark f: s--v
step: Some cycle contains $e$ and $f$.
unclass highlight: u--p s--v
class cycle: u--p p--q q--v s--v r--s u--r
step: This cycle passes through $u$ and $v$.
class visited: u v
```

::: step
Assume every two edges lie on a common cycle and no vertex is isolated. Fix two vertices [[fig:t05-two-cycles-b-backward#uv|$u$ and $v$]]. By part a) it is enough to find a cycle through both. We look for one through an edge at each.
:::

::: step
No vertex is isolated, so $u$ and $v$ each have an edge. We choose [[fig:t05-two-cycles-b-backward#e|$e$]] at $u$ and [[fig:t05-two-cycles-b-backward#f|$f$]] at $v$ with $e \ne f$. This fails only if $uv$ is the only edge at both. Then $e = uv$ and $f$ is an edge at a third vertex, which has one. Here: $up$ and $sv$.
:::

::: step
The hypothesis applies to the two different edges $e$ and $f$: some cycle contains both. This is where we use the hypothesis. Here: the outer $6$-cycle.
:::

::: step
The cycle contains the ends of $e$ and of $f$, and $u$ and $v$ are among these ends, so it contains $u$ and $v$. So $u$ and $v$ lie on a common cycle. We chose them arbitrarily, and $G$ has at least $3$ vertices. Hence part a) shows that $G$ is $2$-connected.
:::
::::

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
