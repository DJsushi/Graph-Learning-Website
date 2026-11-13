---
title: "From the edge version to the vertex version"
course: theory
chapter: menger
order: 5
lectures: [t05]
stage: split
status: reviewed
---

The proof reduces A to B: it builds a new graph in which edge-disjoint paths are the same thing as internally disjoint paths. First part: the construction.

:::: walkthrough
```graph id=t05-b-to-a-construction widget=stepper
caption: The graph $G$ (vertices $s$, $a$, $b$, $t$) and the graph $G'$ made from it for $k = 2$: each inner vertex is split, and each arc is doubled.
intent: New. The lecture (theory/2026-10-13 p5) draws only the splitting of one vertex $x$ (see the figure below the proof). This builds all of $G'$ for a small $G$.
type: directed
layout: fixed
s @(0, 0.6); a @(1.5, 1.2); b @(1.5, 0); t @(3, 0.6)
s -> a [id=sa]; s -> b [id=sb]; a -> t [id=at]; b -> t [id=bt]; a -> b [id=ab]
mark inner: a b
step: The graph $G$ with $k = 2$.
step: Split $a$ and $b$.
split a -> am ap
split b -> bm bp
am [label="$a^-$"] @(1, 1.2); ap [label="$a^+$"] @(2, 1.2); bm [label="$b^-$"] @(1, 0); bp [label="$b^+$"] @(2, 0)
step: Join each pair by an arc $e_x$.
am -> ap [id=ea class=highlight label="$e_a$"]
bm -> bp [id=eb class=highlight label="$e_b$"]
mark ex: @ea @eb
step: Double every original arc.
unclass highlight: @ea @eb
s -> am [id=sa2 class=color1]; s -> bm [id=sb2 class=color1]; ap -> t [id=at2 class=color1]; bp -> t [id=bt2 class=color1]; ap -> bm [id=ab2 class=color1]
mark copies: @sa2 @sb2 @at2 @bt2 @ab2
```

::: step
Assume B holds for every directed multigraph. Take $G$, $s$, $t$ as in A: no arc from $s$ to $t$, and no directed $s$–$t$ cut of size at most $k - 1$. Here $k = 2$, and removing $a$ or $b$ alone leaves an $s$–$t$ path ($s, b, t$ or $s, a, t$), so no single vertex is a cut.
:::

::: step
We split every vertex $x$ other than $s$ and $t$ into $x^-$ and $x^+$. Arcs that entered $x$ now enter $x^-$. Arcs that left $x$ now leave $x^+$. Here $a$ becomes $a^-$, $a^+$ and $b$ becomes $b^-$, $b^+$. The ends $s$ and $t$ stay whole: $s^- = s^+ = s$.
:::

::: step
We join $x^-$ to $x^+$ by a new arc $e_x$. Now $e_x$ is the only arc that leaves $x^-$ and the only arc that enters $x^+$. So a path that goes through $x$ must use [[fig:t05-b-to-a-construction#ex|the arc $e_x$]]. Here: $e_a$ and $e_b$.
:::

::: step
We replace every original arc of $G$ by $k$ parallel copies. Here the 5 arcs of $G$ give 10 arcs, and with $e_a$, $e_b$ the graph $G'$ has 12 arcs. $G'$ is a multigraph, which is why B is assumed for multigraphs. The [[fig:t05-b-to-a-construction#copies|new copies]] are coloured.
:::
::::

Second part: $G'$ has no edge cut of size at most $k - 1$. We take any small set of edges and find a path that avoids it, by going back to $G$.

:::: walkthrough
```graph id=t05-b-to-a-no-cut widget=stepper
caption: In $G'$ ($k = 2$) we delete the edge set $F = \{e_a\}$ and find an $s$–$t$ path that avoids it.
intent: New. The lecture (theory/2026-10-13 p5) has no figure for this claim. Same $G'$ as the construction figure above.
type: directed
layout: fixed
s @(0, 0.6); am [label="$a^-$"] @(1, 1.2); ap [label="$a^+$"] @(2, 1.2); bm [label="$b^-$"] @(1, 0); bp [label="$b^+$"] @(2, 0); t @(3, 0.6)
s -> am [id=sa1]; s -> am [id=sa2]; s -> bm [id=sb1]; s -> bm [id=sb2]
am -> ap [id=ea label="$e_a$"]; bm -> bp [id=eb label="$e_b$"]
ap -> t [id=at1]; ap -> t [id=at2]; bp -> t [id=bt1]; bp -> t [id=bt2]
ap -> bm [id=ab1]; ap -> bm [id=ab2]
step: Take a set $F$ of at most $k - 1$ edges.
class cut: @ea
mark F: @ea
step: The vertices $x$ with $e_x$ in $F$ form $X$.
class color1: am ap
mark X: am ap
step: $X$ is not a cut of $G$: a path $P$ avoids it.
class current: s bm bp t
mark P: s bm bp t
step: Lift each arc of $P$ to a copy outside $F$.
class path: @sb1 @bt1
step: Lift each inner vertex of $P$ to its arc $e_x$.
class path: @eb
step: This path of $G'$ avoids $F$: $F$ is not a cut.
remove @ea
```

::: step
Let $F$ be any set of at most $k - 1$ edges of $G'$. We show that $F$ is not an $s$–$t$ edge cut, by finding a path that avoids it. Here: [[fig:t05-b-to-a-no-cut#F|$F$]] is the single edge $e_a$, and $k - 1 = 1$.
:::

::: step
Let $X$ be the set of vertices $x$ with $e_x$ in $F$. Different vertices have different arcs $e_x$, so $X$ has at most as many vertices as $F$ has edges. Hence $\abs{X} \le k - 1$. Here: [[fig:t05-b-to-a-no-cut#X|$X$]] is $\{a\}$.
:::

::: step
$X$ has at most $k - 1$ vertices, and $G$ has no $s$–$t$ cut of that size (the hypothesis of A). So $X$ is not an $s$–$t$ cut of $G$: $G - X$ still has a directed $s$–$t$ path $P$. Here: [[fig:t05-b-to-a-no-cut#P|$P$]] is $s, b, t$.
:::

::: step
We lift $P$ to $G'$. For every arc $(u, v)$ of $P$, we use a copy of $(u^+, v^-)$ outside $F$. Such a copy exists: the arc has $k$ copies and $F$ has at most $k - 1$ edges. Here the arcs $(s, b)$ and $(b, t)$ have 2 copies each, and $F$ contains none, so we take the first.
:::

::: step
For every inner vertex $x$ of $P$, we use $e_x$ to pass from $x^-$ to $x^+$. It is not in $F$: if it were, $x$ would be in $X$, but $P$ lives in $G - X$. Here the inner vertex is $b$, and $e_b$ is not in $F$.
:::

::: step
The lifted arcs and the arcs $e_x$ join up into an $s$–$t$ path of $G'$, and none of its edges is in $F$. So it is a path in $G' - F$. Hence $F$ is not an edge cut. As $F$ was arbitrary, $G'$ has no edge cut of size at most $k - 1$.
:::
::::

Third part: we apply B to $G'$ and translate the paths back to $G$.

:::: walkthrough
```graph id=t05-b-to-a-back widget=stepper
caption: Two edge-disjoint $s$–$t$ paths of $G'$ (drawn in two different colours: one through $a$, one through $b$) contract to two internally disjoint paths of $G$.
intent: New. The lecture (theory/2026-10-13 p5) stops before this part. Same $G'$ as the figures above.
type: directed
layout: fixed
s @(0, 0.6); am [label="$a^-$"] @(1, 1.2); ap [label="$a^+$"] @(2, 1.2); bm [label="$b^-$"] @(1, 0); bp [label="$b^+$"] @(2, 0); t @(3, 0.6)
s -> am [id=sa1]; s -> am [id=sa2]; s -> bm [id=sb1]; s -> bm [id=sb2]
am -> ap [id=ea label="$e_a$"]; bm -> bp [id=eb label="$e_b$"]
ap -> t [id=at1]; ap -> t [id=at2]; bp -> t [id=bt1]; bp -> t [id=bt2]
ap -> bm [id=ab1]; ap -> bm [id=ab2]
step: B gives $k$ edge-disjoint paths in $G'$.
class color1: @sa1 @ea @at1
class color2: @sb1 @eb @bt1
mark paths: @sa1 @ea @at1 @sb1 @eb @bt1
step: A path that enters $a^-$ must leave by $e_a$.
class current: am
step: The paths are edge-disjoint, so only one uses $e_a$.
class rejected: @sa2
step: Contract each $e_x$ back to $x$.
merge am ap -> a
merge bm bp -> b
step: Contract each copy of an arc back to the arc.
class muted: @sa2 @sb2 @at2 @bt2 @ab1 @ab2
step: The two paths share no inner vertex.
unclass current: a
class color1: a
class color2: b
step: The two paths are different.
class source: s
class sink: t
```

::: step
By B, applied to the multigraph $G'$ (it has no edge cut of size at most $k - 1$, by the second part), there are $k$ edge-disjoint directed $s$–$t$ paths in $G'$. Here $k = 2$: [[fig:t05-b-to-a-back#paths|the two paths]] are $s, a^-, a^+, t$ (red) and $s, b^-, b^+, t$ (blue).
:::

::: step
Look at a vertex $x$ other than $s$ and $t$. The only arc that leaves $x^-$ is $e_x$. So a path that visits $x^-$ must go on along $e_x$. Likewise the only arc that enters $x^+$ is $e_x$, so a path that visits $x^+$ came along $e_x$.
:::

::: step
The $k$ paths are edge-disjoint, so $e_x$ lies on at most one of them. By the last step, a path that visits $x^-$ or $x^+$ uses $e_x$. Hence at most one path visits $x$. Here: a second path entering $a^-$ by the other copy of $(s, a)$ would need $e_a$, which the red path has.
:::

::: step
We contract every $e_x$ to the vertex $x$. This is a path of $G'$ with its pair $x^-$, $x^+$ replaced by one vertex $x$. Here $a^-, a^+$ become $a$, and $b^-, b^+$ become $b$. The arcs $e_a$ and $e_b$ disappear.
:::

::: step
We contract each copy of an arc to the original arc. A path of $G'$ visits $x^-$ at most once and reaches $x^+$ only right after it, so the contracted path visits $x$ at most once. It is a directed $s$–$t$ path of $G$. Here: $s, a, t$ and $s, b, t$.
:::

::: step
For each $x$, at most one of the paths visits $x$. So no vertex other than $s$ and $t$ lies on two of the paths: they share no inner vertex. Here the red path has the inner vertex $a$ and the blue path has $b$.
:::

::: step
The $k$ paths are pairwise different. Two paths without a common inner vertex could be equal only if both were the single arc $(s, t)$, and $G$ has no such arc by the hypothesis of A. So $G$ has $k$ internally disjoint $s$–$t$ paths, which is what A claims.
:::
::::

::: proof {title="Proof that B implies A" for=thm:menger-directed}
Assume B holds for all directed multigraphs, and let $G, s, t$ satisfy the assumptions of A, with no directed $s$–$t$ cut of size
$\le k - 1$. Make a new digraph $G'$ from $G$ by the following construction (applied to every vertex $x \ne s, t$):

- **split** $x$ into two vertices $x^-$ and $x^+$ joined by a new arc $e_x = (x^-, x^+)$; arcs of $G$ entering $x$ now enter $x^-$, and
  arcs leaving $x$ now leave $x^+$;
- replace every original arc of $G$ by $k$ parallel copies. (We write $s^- = s^+ = s$ and $t^- = t^+ = t$.)

*$G'$ has no $s$–$t$ edge cut of size $\le k - 1$.* Let $F \subseteq E(G')$ with $\abs{F} \le k - 1$, and let $X = \set{x : e_x \in F}$. Then
$\abs{X} \le k - 1$, so $X$ is not an $s$–$t$ cut of $G$, and there is a directed $s$–$t$ path $P$ in $G - X$. Lift $P$ to $G'$: for every arc
$(u, v)$ of $P$ use a copy of $(u^+, v^-)$ that is not in $F$ (one of the $k$ copies is not in $F$), and for every inner vertex $x$ of $P$ use
$e_x$ (not in $F$, since $x \notin X$). This is an $s$–$t$ path in $G' - F$, so $F$ is not an edge cut.

*Translating back.* By B, $G'$ has $k$ edge-disjoint directed $s$–$t$ paths. A path of $G'$ that visits $x^-$ can leave it only through
$e_x$, and since the paths are edge-disjoint, **at most one of them visits $x$** (i.e. $x^-$ or $x^+$) for each $x \ne s, t$. Contracting
each $e_x$ back to $x$ (and each copy of an arc back to the arc) turns every path into a directed $s$–$t$ path of $G$ (it visits every
vertex at most once), and the resulting $k$ paths share no inner vertex. Two of them could only coincide if both were the single arc
$(s, t)$, which does not exist by assumption. So $G$ has $k$ internally disjoint $s$–$t$ paths.
:::

```graph id=t05-vertex-splitting widget=stepper
caption: Splitting a vertex $x$ into $x^- \to x^+$: all arcs into $x$ enter $x^-$, all arcs out of $x$ leave $x^+$. A path through $x$ must use the arc $e_x$, so edge-disjoint paths in the new graph visit $x$ at most once in total.
intent: Transcription of the lecture construction for the reduction from vertex to edge version.
type: directed
layout: fixed
a1 @(0, 1); a2 @(0, 0); a3 @(0, -1); x [class=current] @(1, 0); b1 @(2, 1); b2 @(2, -1)
a1 -> x; a2 -> x; a3 -> x; x -> b1; x -> b2
step: The vertex $x$ with its in-arcs and out-arcs.
step: Split $x$ into $x^-$ and $x^+$: all arcs into $x$ enter $x^-$, all arcs out of $x$ leave $x^+$.
split x -> xm xp
xm [label="$x^-$"] @(1, 0); xp [label="$x^+$"] @(2, 0); b1 @(3, 1); b2 @(3, -1)
step: Join them by the arc $e_x$; a path through $x$ must use it.
xm -> xp [class=highlight label="$e_x$"]
```
