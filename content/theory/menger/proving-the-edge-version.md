---
title: "Proving the edge version"
course: theory
chapter: menger
order: 6
lectures: [t05]
goal: Check whether a set of arcs is a d-flow, and find the edge-disjoint paths that a d-flow contains.
needs: [theory/menger/mengers-theorem]
stage: taught
status: reviewed
---

The lecturer drew this picture next to the definition below. All its arcs belong to $F$. Count,
at every vertex, how many arcs come in and how many go out. What do you notice, and how many arcs
reach $t$?

```graph id=t05-d-flow widget=figure
caption: A d-flow $F$ of size 3 with 14 arcs (thick): balanced at every vertex except $s$ (3 out) and $t$ (3 in); the three dots at the top touch no arc.
intent: Transcription of the lecture picture of a d-flow (theory/2026-10-13 p6): the same 11 joined vertices, 14 arcs and 3 isolated dots, at about the board's positions. The board names only s and t; the other names are new.
type: directed
layout: fixed
s [class=source] @(0, 0.5); a @(0.55, 0.78); b @(0.55, 0.48); c @(0.55, 0.18); d @(1.15, 0.72); e @(1.2, 0.25)
f @(1.85, 0.97); g @(1.7, 0.55); h @(2.25, 0.57); i @(2, 0.17); t [class=sink] @(3, 0.62)
x @(1.1, 1.3); y @(2.05, 1.38); z @(2.7, 1.3)
s -> a [class=path]; s -> b [class=path]; s -> c [class=path]; a -> d [class=path]; b -> d [class=path]; c -> e [class=path]
d -> f [class=path]; d -> g [class=path]; e -> g [class=path]; g -> h [class=path]; g -> i [class=path]
f -> t [class=path]; h -> t [class=path]; i -> t [class=path]
mark F: s->a s->b s->c a->d b->d c->e d->f d->g e->g g->h g->i f->t h->t i->t
mark inner: a b c d e f g h i
mark two: d g
mark dots: x y z
```

Three [[fig:t05-d-flow#F|thick arcs]] leave $s$, and none come in. At
[[fig:t05-d-flow#inner|each of the vertices in between]], as many arcs come in as go out:
two and two at [[fig:t05-d-flow#two|the vertices $d$ and $g$]], one and one at the other seven.
[[fig:t05-d-flow#dots|The three dots]] have no arc at all: zero in and zero out, so they are
balanced too. Three arcs arrive at $t$, and none leave it.

Think of one unit of water on each thick arc. It starts at $s$, never piles up on the way, and
ends at $t$. Such a set of arcs is a d-flow. The lecture plans to prove the edge version of
Menger's theorem with d-flows. The key fact: a d-flow of size $k$ contains $k$ paths from $s$
to $t$ that share no arc.

::: definition {#def:d-flow title="d-flow" defines="d-flow" source="theory/2026-10-13 p6"}
A set $F \subseteq E(G)$ of arcs of a directed multigraph is an **$s$–$t$ d-flow** if, counting only arcs of $F$, the in-degree of $s$ is $0$,
the out-degree of $t$ is $0$, and every other vertex has in-degree equal to its out-degree. The **size** of $F$ is the out-degree of $s$ in
$F$.
:::

::: intuition
Look only at the arcs of $F$. No arc enters $s$, no arc leaves $t$, and every other vertex
passes on exactly as many arcs as it receives. The size counts the arcs that leave $s$.
:::

We check the definition on the lecturer's graph, vertex by vertex. Then we change $F$ twice:
once so that it breaks, and once so that it stays a d-flow.

```graph id=t05-d-flow-check widget=stepper
caption: Checking the definition at every vertex, then adding one arc (breaks it) or a separate cycle (keeps it).
intent: New worked example on the lecture's d-flow (t05-d-flow, theory/2026-10-13 p6), same vertex names and positions. The arc a→b and the arcs between the dots y and z are new.
type: directed
layout: fixed
s [class=source] @(0, 0.5); a @(0.55, 0.78); b @(0.55, 0.48); c @(0.55, 0.18); d @(1.15, 0.72); e @(1.2, 0.25)
f @(1.85, 0.97); g @(1.7, 0.55); h @(2.25, 0.57); i @(2, 0.17); t [class=sink] @(3, 0.62)
x @(1.1, 1.3); y @(2.05, 1.38); z @(2.7, 1.3)
s -> a [class=path]; s -> b [class=path]; s -> c [class=path]; a -> d [class=path]; b -> d [class=path]; c -> e [class=path]
d -> f [class=path]; d -> g [class=path]; e -> g [class=path]; g -> h [class=path]; g -> i [class=path]
f -> t [class=path]; h -> t [class=path]; i -> t [class=path]
a -> b [class=hidden]; y -> z [class=hidden]; z -> y [class=hidden]
mark ab: a->b
mark cycle: y->z z->y
step: The 14 arcs of F are thick.
step: At s: 0 arcs in, 3 out. At t: 3 in, 0 out.
class current: s t
step: At a, b, c, e, f, h and i: one arc in, one arc out.
unclass current: s t
class current: a b c e f h i
step: At d and g: two in, two out. At x, y and z: none. F is a d-flow of size 3.
unclass current: a b c e f h i
class current: d g x y z
step: Add the arc a→b to F. Now a sends 2 and b receives 2: not a d-flow.
unclass current: d g x y z
unclass hidden: a->b
class path: a->b
class rejected: a b
step: Remove a→b again and add the two arcs y→z and z→y. Still a d-flow of size 3.
unclass path: a->b
class hidden: a->b
unclass rejected: a b
unclass hidden: y->z z->y
class path: y->z z->y
class current: y z
```

The first four steps go through the vertices. No arc of $F$ enters $s$, no arc of $F$ leaves
$t$, and every other vertex is balanced. So $F$ is a d-flow from $s$ to $t$. Its size is 3,
the number of its arcs that leave $s$.

In step 5 we add [[fig:t05-d-flow-check#ab|the arc from $a$ to $b$]]. Now two arcs leave $a$
but only one comes in, and $b$ has the opposite problem. One extra arc is enough to break the
balance at both of its ends.

In step 6 we add [[fig:t05-d-flow-check#cycle|the arcs from $y$ to $z$ and back]] instead.
Both vertices get one arc in and one arc out, so both are balanced. Nothing changes
at the start vertex, so the size is still 3.

The size can also be read off at $t$. Every arc of $F$ leaves one vertex and enters one vertex.
So, over all vertices together, the arcs going out and the arcs coming in are the same number.
The vertices other than $s$ and $t$ cancel, $s$ only sends and $t$ only receives. So the arcs
leaving $s$ and the arcs entering $t$ are the same number. Here: 3 and 3.

::: claim {#claim:d-flow-paths title="d-flows contain disjoint paths" source="theory/2026-10-13 p6"}
If $F$ is an $s$–$t$ d-flow of size $k$, then $F$ contains $k$ edge-disjoint directed $s$–$t$ paths.
:::

::: intuition {for=claim:d-flow-paths}
A d-flow of size $k$ carries $k$ units from $s$ to $t$. The claim says that we can find $k$
separate routes for them inside $F$, and that no two routes use the same arc.
:::

The lecture states this without proof. We check it on the lecturer's d-flow, which has size 3.

```graph id=t05-d-flow-paths widget=stepper
caption: The d-flow of size 3 from the lecture contains 3 directed paths from s to t that share no arc.
intent: New figure. The d-flow of t05-d-flow (theory/2026-10-13 p6) with the same positions; it shows the claim on that example.
type: directed
layout: fixed
s [class=source] @(0, 0.5); a @(0.55, 0.78); b @(0.55, 0.48); c @(0.55, 0.18); d @(1.15, 0.72); e @(1.2, 0.25)
f @(1.85, 0.97); g @(1.7, 0.55); h @(2.25, 0.57); i @(2, 0.17); t [class=sink] @(3, 0.62)
x @(1.1, 1.3); y @(2.05, 1.38); z @(2.7, 1.3)
s -> a [class=bold]; s -> b [class=bold]; s -> c [class=bold]; a -> d [class=bold]; b -> d [class=bold]; c -> e [class=bold]
d -> f [class=bold]; d -> g [class=bold]; e -> g [class=bold]; g -> h [class=bold]; g -> i [class=bold]
f -> t [class=bold]; h -> t [class=bold]; i -> t [class=bold]
mark P1: s->a a->d d->f f->t
mark P2: s->b b->d d->g g->h h->t
mark P3: s->c c->e e->g g->i i->t
step: The d-flow F of size 3: its 14 arcs are thick.
step: The first path s, a, d, f, t.
class color1: s->a a->d d->f f->t
step: The second path s, b, d, g, h, t, drawn dashed.
class color2: s->b b->d d->g g->h h->t
class dashed: s->b b->d d->g g->h h->t
step: The third path s, c, e, g, i, t.
class color3: s->c c->e e->g g->i i->t
```

The [[fig:t05-d-flow-paths#P1|first path]] is $s\,a\,d\,f\,t$, the
[[fig:t05-d-flow-paths#P2|second path]] is $s\,b\,d\,g\,h\,t$, and the
[[fig:t05-d-flow-paths#P3|third path]] is $s\,c\,e\,g\,i\,t$. Each of the 14 arcs of $F$ lies on
exactly one of them. So the 3 paths are edge-disjoint, as the claim says for size 3.

The first two paths both pass through the vertex $d$, and the last two through $g$. That is
allowed: edge-disjoint paths may share vertices, they only may not share arcs.

Why the lecture needs the claim: the edge version of
[[thm:menger-directed|Menger's theorem]] (part B) asks for $k$ edge-disjoint directed paths
from $s$ to $t$ when there is no directed edge cut of size at most $k - 1$. The lecture plans
the proof in two parts. First, no such small edge cut gives an $s$–$t$ d-flow of size $k$.
Second, the claim turns that d-flow into the $k$ paths. The board stops after this plan with a
question mark: the lecture states the edge version (B) without proof either.

::: pitfall
A d-flow need not be made of paths only. In step 6 of the worked example, the d-flow also
contains the cycle through $y$ and $z$. No arc of the d-flow leads from $s$ into this cycle, so
no path from $s$ to $t$ uses it. That is why the claim says that $F$ **contains** $k$ paths, and
not that it is the union of them.
:::

::: pitfall
The size is the number of arcs of $F$ that leave $s$, not the number of all arcs of $F$. The
lecturer's d-flow has 14 arcs and size 3.
:::

## Check yourself

:::: quiz {#q:t05-d-flow-remove}
Take the d-flow $F$ of the first figure and remove the arc from $d$ to $g$. How many vertices
other than $s$ and $t$ are now unbalanced?

answer: 2

::: explanation
$d$ still receives two arcs, from $a$ and $b$, but now sends only one, to $f$. $g$ now receives
only one arc, from $e$, and still sends two, to $h$ and $i$. The other vertices do not touch the
removed arc and stay balanced.
:::
::::

:::: quiz {#q:t05-d-flow-pick}
Which set of arcs of the first figure is an $s$–$t$ d-flow of size 2? Write $xy$ for the arc
from $x$ to $y$.

- [ ] $sa, sb, ad, bd, df, ft$
- [x] $sa, sb, ad, bd, df, dg, ft, gh, ht$
- [ ] $sb, bd, dg, gi, it$
- [ ] $sa, ad, df, ft, eg, gh, ht$

::: explanation
In the second set, $s$ sends two arcs and receives none, and $t$ receives two and sends none.
$d$ has two arcs in and two out; $a$, $b$, $f$, $g$, $h$ each have one in and one out. The first
set is not balanced at $d$: two in, one out. The third set is a d-flow, but of size 1. In the
fourth set, $e$ sends an arc but receives none.
:::
::::

## More

A d-flow is a [[def:flow|flow]] in which every arc carries $0$ or $1$ units: $F$ is the set of
arcs carrying one unit, the balance condition is flow conservation, and the size is the value of
the flow. A directed $s$–$t$ path is a d-flow of size $1$, and the union of $k$ edge-disjoint
ones is a d-flow of size $k$. A directed cycle through $s$ is never part of a d-flow, since then
an arc of $F$ enters $s$.

In symbols, the size is also the in-degree of $t$: summing (out-degree $-$ in-degree) over all
vertices counts every arc once with $+1$ and once with $-1$, so the total is $0$; all vertices
except $s$ and $t$ contribute $0$, so $d^+_F(s) - 0 + 0 - d^-_F(t) = 0$.

The first part of the lecture's plan is what the flow algorithms of the algorithms course do.
With capacity 1 on every arc, Ford–Fulkerson finds a largest d-flow, and when it stops, the
arcs leaving the set of vertices it can still reach form a smallest edge cut.

```graph id=t05-augmenting-player widget=player
caption: Ford–Fulkerson with all capacities 1 finds a maximum d-flow and, at the end, the cut $D$ leaving the set $R$ of reachable vertices.
intent: Connect Menger B with the flow algorithm of the algorithms course. Unit capacities.
type: directed
layout: layered
algo: ford-fulkerson
params: source=s sink=t
s [class=source]; t [class=sink]
s -> a [c=1]; s -> b [c=1]; s -> c [c=1]; a -> d [c=1]; b -> d [c=1]; c -> e [c=1]; d -> t [c=1]; d -> e [c=1]; e -> t [c=1]; a -> b [c=1]
```
