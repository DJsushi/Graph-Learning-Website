---
title: "From the edge version to the vertex version"
course: theory
chapter: menger
order: 5
lectures: [t05]
stage: split
status: draft
---

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
