---
title: Higher connectivity and Menger's theorem
course: theory
lecture: 5
slug: t05
summary: k-connected and k-edge-connected graphs, s–t cuts, Menger's theorem in its directed, undirected, vertex and edge versions, the set version, 2-connected graphs and ear decompositions.
prerequisites: [theory/04-chordal-hamiltonian]
sources:
  - resources/graph-theory/2026-10-13-13_44_03-join.pdf
status: draft
---

A connected graph can be fragile: deleting a single vertex or edge may disconnect it. Networks that must
survive failures should be **highly connected**. There are two natural ways to measure this: how many vertices
(or edges) must be removed to disconnect the graph, and how many independent routes exist between two vertices.
**Menger's theorem**, one of the central theorems of graph theory, says that these two measures agree. It is
also the combinatorial heart of the max-flow min-cut theorem of the algorithms course.

## k-connectivity

::: definition {#def:k-connected title="k-connected, k-edge-connected" defines="k-connected k-edge-connected vertex connectivity edge connectivity" source="theory/2026-10-13 p1"}
Let $k \ge 1$. An undirected multigraph $G$ is **$k$-connected** if after deleting any at most $k - 1$ vertices of $G$, the
rest stays connected. By convention, $K_1$ is $1$-connected, and $K_n$ for $n \ge 2$ is $(n-1)$-connected (but not
$n$-connected); in general a $k$-connected graph must have at least $k + 1$ vertices, unless it is $K_1$ and $k = 1$.

$G$ is **$k$-edge-connected** if after deleting any at most $k - 1$ edges of $G$, the rest stays connected.
:::

So "$1$-connected" and "$1$-edge-connected" both mean connected. A vertex whose removal disconnects a connected graph is a
**cut vertex**, and an edge whose removal disconnects it is a **bridge**. The convention for complete graphs is needed because
deleting vertices from $K_n$ never disconnects it; without the convention $K_n$ would be "infinitely connected".

```graph id=t05-connectivity-examples widget=figure
caption: Left: a cut vertex in the middle; the graph is connected and even 2-edge-connected, but not 2-connected. Right: $K_4$ is 3-connected.
intent: Transcription of the lecture examples; distinguish vertex and edge connectivity.
height: small
panel: bowtie
layout: fixed
a @(0, 1); b @(0, 0); m [class=current] @(1, 0.5); c @(2, 1); d @(2, 0)
a -- b; a -- m; b -- m; m -- c; m -- d; c -- d
panel: $K_4$
use: K(4)
```

::: definition {#def:st-cut title="s–t paths and cuts" defines="s-t path s-t cut s-t edge cut internally disjoint edge-disjoint" source="theory/2026-10-13 p1"}
Let $G$ be a (possibly directed) multigraph and $s \ne t$ vertices.

- An **$s$–$t$ path** is a path between $s$ and $t$ in $G$ (in a directed graph: a directed path from $s$ to $t$).
- An **$s$–$t$ cut** (or directed cut) is a set $X \subseteq V(G) \setminus \set{s, t}$ such that $G - X$ contains **no** $s$–$t$ path.
- An **$s$–$t$ edge cut** is a set $F \subseteq E(G)$ such that $G - F$ contains no $s$–$t$ path.

Paths are **internally disjoint** if they share no vertices other than their ends, and **edge-disjoint** if they share no
edges.
:::

If $G$ has an edge (arc) from $s$ to $t$, there is no $s$–$t$ (vertex) cut at all, since deleting vertices other than $s, t$ never
destroys that edge.

## Menger's theorem

::: theorem {#thm:menger title="Menger's theorem (undirected, vertex and edge versions)" source="theory/2026-10-13 p2"}
a) An undirected (simple) graph $G$ is $k$-connected $\iff$ for all $s \ne t \in V(G)$ there exist $k$ internally disjoint $s$–$t$
paths.

b) An undirected multigraph $G$ is $k$-edge-connected $\iff$ for all $s \ne t \in V(G)$ there exist $k$ edge-disjoint $s$–$t$ paths.
:::

```graph id=t05-edge-disjoint-paths widget=figure
caption: Three edge-disjoint $s$–$t$ paths (in different colours). They share vertices, but no edges.
intent: Transcription of the lecture example of 3 edge-disjoint paths through common vertices.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 0); b @(3, 0); t [class=sink] @(4.5, 0)
s -- a [class=color1 bend=0.5]; s -- a [class=color2]; s -- a [class=color3 bend=-0.5]
a -- b [class=color1 bend=0.5]; a -- b [class=color2]; a -- b [class=color3 bend=-0.5]
b -- t [class=color1 bend=0.5]; b -- t [class=color2]; b -- t [class=color3 bend=-0.5]
```

The direction "$\Leftarrow$" is easy in both cases: if $k$ internally disjoint (resp. edge-disjoint) $s$–$t$ paths exist, deleting
$k - 1$ vertices other than $s, t$ (resp. $k - 1$ edges) destroys at most $k - 1$ of them, so $s$ and $t$ remain connected. The
direction "$\Rightarrow$" is the deep part. As the lecture puts it, **this is better done in digraphs**: we prove a directed,
local version (for one fixed pair $s, t$), and derive everything else from it.

::: theorem {#thm:menger-directed title="Menger's theorem (directed, local)" source="theory/2026-10-13 p5"}
Let $G$ be a directed multigraph and $s \ne t \in V(G)$, and let $k \ge 1$.

A) If $G$ has no arc from $s$ to $t$: $G$ contains $k$ internally disjoint directed $s$–$t$ paths $\iff$ $G$ has no directed $s$–$t$ cut of
size $\le k - 1$.

B) $G$ contains $k$ edge-disjoint directed $s$–$t$ paths $\iff$ $G$ has no directed $s$–$t$ edge cut of size $\le k - 1$.
:::

The assumption "no arc from $s$ to $t$" in A) is necessary (and missing on the board): with a single arc $(s, t)$ there is no cut of any
size, but only one path. Equivalently, the maximum number of internally disjoint (edge-disjoint) $s$–$t$ paths equals the minimum
size of an $s$–$t$ cut (edge cut).

**"$\Rightarrow$" is trivial in both A) and B):** a cut must contain a vertex (an edge) of each of the $k$ disjoint paths, and these are
pairwise different.

### Step 1: B implies A

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

```graph id=t05-vertex-splitting widget=figure
caption: Splitting a vertex $x$ into $x^- \to x^+$: all arcs into $x$ enter $x^-$, all arcs out of $x$ leave $x^+$. A path through $x$ must use the arc $e_x$, so edge-disjoint paths in the new graph visit $x$ at most once in total.
intent: Transcription of the lecture construction for the reduction from vertex to edge version.
type: directed
layout: fixed
panel: before
a1 @(0, 1); a2 @(0, 0); a3 @(0, -1); x [class=current] @(1, 0); b1 @(2, 1); b2 @(2, -1)
a1 -> x; a2 -> x; a3 -> x; x -> b1; x -> b2
panel: after
a1 @(0, 1); a2 @(0, 0); a3 @(0, -1); xm [label="$x^-$"] @(1, 0); xp [label="$x^+$"] @(2, 0); b1 @(3, 1); b2 @(3, -1)
a1 -> xm; a2 -> xm; a3 -> xm; xm -> xp [class=highlight label="$e_x$"]; xp -> b1; xp -> b2
```

### Step 2: proving B

The lecture introduces the following notion, a set of arcs that "flows" from $s$ to $t$ with one unit on each arc.

::: definition {#def:d-flow title="d-flow" defines="d-flow" source="theory/2026-10-13 p6"}
A set $F \subseteq E(G)$ of arcs of a directed multigraph is an **$s$–$t$ d-flow** if, counting only arcs of $F$, the in-degree of $s$ is $0$,
the out-degree of $t$ is $0$, and every other vertex has in-degree equal to its out-degree. The **size** of $F$ is the out-degree of $s$ in
$F$.
:::

The size is also the in-degree of $t$ in $F$: summing (out-degree $-$ in-degree) over all vertices counts every arc once with $+1$ and once
with $-1$, so the total is $0$; all vertices except $s$ and $t$ contribute $0$, so $d^+_F(s) - 0 + 0 - d^-_F(t) = 0$.

```graph id=t05-d-flow widget=figure
caption: A d-flow $F$ of size 3 (bold arcs): balanced at every vertex except $s$ (3 out) and $t$ (3 in).
intent: Transcription of the lecture example of a d-flow; non-flow arcs muted.
type: directed
layout: layered
s [class=source]; t [class=sink]
s -> a [class=path]; s -> b [class=path]; s -> c [class=path]
a -> d [class=path]; b -> d [class=path]; d -> t [class=path]; d -> e [class=path]; c -> e [class=muted]
e -> t [class=path]; c -> t [class=path]; a -> b [class=muted]; e -> c [class=muted]
```

::: claim {#claim:d-flow-paths title="d-flows contain disjoint paths" source="theory/2026-10-13 p6"}
If $F$ is an $s$–$t$ d-flow of size $k$, then $F$ contains $k$ edge-disjoint directed $s$–$t$ paths.
:::

::: proof
By induction on $k$; for $k = 0$ there is nothing to show. Let $k \ge 1$. Walk from $s$ along arcs of $F$, never using an arc twice, as long
as possible. Whenever the walk is at a vertex $v \ne s, t$, it has entered $v$ one more time than it has left it, so it has used one more
$F$-arc into $v$ than out of $v$; as in- and out-degree of $v$ in $F$ are equal, an unused out-arc of $v$ remains and the walk can continue.
The walk never returns to $s$ (no $F$-arc enters $s$). Since $F$ is finite, the walk stops, and it can only stop at $t$. Shortcutting all
closed parts (as in [[claim:shortest-walk-path]]) gives a directed $s$–$t$ path $P$ with $E(P) \subseteq F$.

Now $F - E(P)$ is an $s$–$t$ d-flow of size $k - 1$: $s$ loses one out-arc, $t$ loses one in-arc, and every inner vertex of $P$ loses one
in-arc and one out-arc. By induction it contains $k - 1$ edge-disjoint $s$–$t$ paths, which are also edge-disjoint from $P$.
:::

So it suffices to prove: **if $G$ has no directed $s$–$t$ edge cut of size $\le k - 1$, then $G$ has an $s$–$t$ d-flow of size $k$.** The lecture
stops here; we complete the argument with the **augmenting path** method (which is exactly the Ford–Fulkerson algorithm with unit
capacities, see [[algorithms/02-maximum-flow]]).

:::: proof {title="Proof of B (completed beyond the lecture)" for=thm:menger-directed}
Let $F$ be an $s$–$t$ d-flow of maximum size $\ell$ (the empty set is a d-flow, so one exists). We show that there is an $s$–$t$ edge cut of size
$\ell$; by assumption then $\ell \ge k$, and $F$ contains $k$ edge-disjoint paths by [[claim:d-flow-paths]].

Call a sequence $s = x_0, x_1, \dots, x_r$ of distinct vertices an **augmenting path** if every step $x_{i-1} \to x_i$ is
- **forward**: along an arc $(x_{i-1}, x_i) \notin F$, or
- **backward**: against an arc $(x_i, x_{i-1}) \in F$.

Let $R$ be the set of vertices reachable from $s$ by augmenting paths.

*Case $t \in R$.* Take an augmenting path from $s$ to $t$ and let $F'$ be $F$ with all forward arcs of the path added and all backward arcs
removed. Check the balance at each vertex of the path:

- at an inner vertex $x_i$, the step into $x_i$ adds an in-arc (forward) or removes an out-arc (backward), and the step out of $x_i$ adds an
  out-arc (forward) or removes an in-arc (backward); in all four combinations, in-degree minus out-degree is unchanged;
- the first step leaves $s$ forward (a backward step would need an $F$-arc into $s$), so the out-degree of $s$ grows by one; the last step enters
  $t$ forward (a backward step would need an $F$-arc out of $t$); $s$ and $t$ are not visited otherwise.

So $F'$ is an $s$–$t$ d-flow of size $\ell + 1$, contradicting maximality. Hence this case does not occur.

*Case $t \notin R$.* Let $D$ be the set of arcs from $R$ to $V(G) \setminus R$. Every $s$–$t$ path starts in $R$ and ends outside, so it uses an arc
of $D$: $D$ is an $s$–$t$ edge cut. Moreover:

- every arc $(u, v) \in D$ lies in $F$ (otherwise $v$ would be reachable by a forward step), and
- no arc from $V(G) \setminus R$ into $R$ lies in $F$ (otherwise its tail would be reachable by a backward step).

Sum (out-degree $-$ in-degree in $F$) over $u \in R$. Each vertex of $R$ other than $s$ contributes $0$ ($t \notin R$), and $s$ contributes $\ell$.
Arcs of $F$ with both ends in $R$ contribute $+1 - 1 = 0$, so the sum also equals (number of $F$-arcs leaving $R$) $-$ (number of $F$-arcs entering
$R$) $= \abs{D} - 0$. Hence $\abs{D} = \ell$, and $D$ is an $s$–$t$ edge cut of size $\ell$.
::::

```graph id=t05-augmenting-player widget=player
caption: The augmenting-path proof as an algorithm: Ford–Fulkerson with all capacities 1 finds a maximum d-flow and, at the end, the cut $D$ leaving the reachable set $R$.
intent: Connect the proof of Menger B with the flow algorithm of the algorithms course. Unit capacities.
type: directed
layout: layered
algo: ford-fulkerson
params: source=s sink=t
s [class=source]; t [class=sink]
s -> a [c=1]; s -> b [c=1]; s -> c [c=1]; a -> d [c=1]; b -> d [c=1]; c -> e [c=1]; d -> t [c=1]; d -> e [c=1]; e -> t [c=1]; a -> b [c=1]
```

### Step 3: back to undirected graphs

::: proof {title="Proof of Menger's theorem (undirected)" for=thm:menger}
Replace every undirected edge $uv$ of $G$ by the two arcs $(u, v)$ and $(v, u)$, obtaining a digraph $D$. Directed $s$–$t$ paths of $D$ correspond to
$s$–$t$ paths of $G$; a set of at most $k - 1$ arcs (vertices) whose removal destroys all directed $s$–$t$ paths of $D$ gives a set of at most $k - 1$
edges (the same vertices) whose removal destroys all $s$–$t$ paths of $G$.

**b)** Let $G$ be $k$-edge-connected and $s \ne t$. Then $G$ has no $s$–$t$ edge cut of size $\le k - 1$, hence neither does $D$, and by
[[thm:menger-directed]] B and its proof $D$ has an $s$–$t$ d-flow $F$ of size $k$. If $F$ contains both arcs $(u, v), (v, u)$ coming from one edge,
remove both: $F$ stays a d-flow of the same size (both $u$ and $v$ lose one in- and one out-arc). Now the $k$ edge-disjoint paths in $F$
([[claim:d-flow-paths]]) use every undirected edge of $G$ at most once, so they are $k$ edge-disjoint $s$–$t$ paths in $G$.

**a)** Let $G$ be a simple $k$-connected graph and $s \ne t$. If $st \notin E(G)$, every $s$–$t$ cut has at least $k$ vertices (deleting fewer leaves
$G$ connected), so by A applied to $D$ there are $k$ internally disjoint $s$–$t$ paths. If $st \in E(G)$, consider $G - st$. It is
$(k-1)$-connected: otherwise some $X$ with $\abs{X} \le k - 2$ disconnects $G - st$ but not $G$, so $st$ is a bridge of $G - X$ with sides $S \ni s$
and $T \ni t$. As $G$ has at least $k + 1$ vertices, $G - X$ has at least $3$, so one side, say $S$, has another vertex besides $s$; then
$X \cup \set{s}$, of size $\le k - 1$, separates $S \setminus \set{s}$ from $T$ in $G$, a contradiction. By the first case applied to $G - st$, there are
$k - 1$ internally disjoint $s$–$t$ paths in $G - st$; together with the edge $st$ we get $k$.
:::

::: remark
For multigraphs, a) holds if we also count parallel $s$–$t$ edges as separate (internally disjoint) paths; vertex connectivity itself does
not change when edges are duplicated. Note also that b) gives an efficient way to compute edge connectivity: it is the minimum, over pairs,
of the maximum number of edge-disjoint paths, which is a maximum-flow computation.
:::

## Variants of Menger's theorem

::: theorem {#thm:total-menger title="Set version of Menger's theorem" aka="total Menger" source="theory/2026-10-13 p2"}
A graph $G$ with at least $k + 1$ vertices is $k$-connected $\iff$ for all $S, T \subseteq V(G)$ with $\abs{S} = \abs{T} = k$ there exist $k$ (vertex-)disjoint
paths, each with one end in $S$ and the other end in $T$.
:::

Paths of length $0$ are allowed: a vertex of $S \cap T$ is a path from $S$ to $T$ on its own. (This answers the question "$S = T$?" on the board:
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
vertices $s, t$ are not adjacent. Every $s$–$t$ cut $X$ of $G^*$ with $\abs{X} \le k - 1$ is a set of vertices of $G$; then $G - X$ is connected, and
$S \setminus X$, $T \setminus X$ are non-empty (as $\abs{S} = \abs{T} = k > \abs{X}$), so $G^* - X$ contains an $s$–$t$ path through $S \setminus X$, $G - X$ and
$T \setminus X$. So there is no $s$–$t$ cut of size $\le k - 1$, and by Menger ([[thm:menger-directed]] A, via the directed version of $G^*$) there are $k$
internally disjoint $s$–$t$ paths in $G^*$. Removing $s$ and $t$ from them leaves $k$ disjoint paths in $G$, each starting at a vertex of $S$ and
ending at a vertex of $T$.

($\Leftarrow$) Suppose $X$ with $\abs{X} \le k - 1$ disconnects $G$, with $u$ and $v$ in different components of $G - X$. Since $\abs{V(G)} \ge k + 1$ we can
choose a set $Y \subseteq V(G) \setminus (X \cup \set{u, v})$ with $\abs{X \cup Y} = k - 1$. Let $S = X \cup Y \cup \set{u}$ and $T = X \cup Y \cup \set{v}$. Take $k$ disjoint
$S$–$T$ paths. Each contains a vertex of $S$, the paths are disjoint and $\abs{S} = k$, so each path contains exactly one vertex of $S$, and likewise
exactly one vertex of $T$. The path containing $u$ thus contains no vertex of $X \cup Y \subseteq S$, so its vertex in $T$ is $v$. It is a $u$–$v$ path
in $G - X$, a contradiction.
:::

::: theorem {#thm:two-connected-cycles title="2-connected graphs and cycles" source="theory/2026-10-13 p3"}
Let $G$ be a graph with at least $3$ vertices. Then

a) $G$ is $2$-connected $\iff$ every two vertices of $G$ lie on a common cycle;

b) $G$ is $2$-connected $\iff$ every two edges of $G$ lie on a common cycle (and $G$ has no isolated vertex).
:::

::: proof
**a)** This is Menger's theorem a) for $k = 2$: two internally disjoint $u$–$v$ paths form a cycle through $u$ and $v$ (if one of them is the edge $uv$,
the other has length at least $2$, as $G$ is simple), and conversely a cycle through $u$ and $v$ splits into two internally disjoint $u$–$v$ paths.

**b)** ($\Rightarrow$) Let $e = ab$ and $f = cd$ be edges. Apply the set version ([[thm:total-menger]]) with $k = 2$, $S = \set{a, b}$, $T = \set{c, d}$: there are
two disjoint paths $P_1, P_2$, each containing exactly one vertex of $S$ and one of $T$ (as in the previous proof). Then $e$, $P_1$, $f$, $P_2$ form a closed
walk in which no vertex repeats, i.e. a cycle containing $e$ and $f$. (If $e$ and $f$ share a vertex, say $b = c$, then one of the paths is the trivial
path $b$, and the cycle is $e$, $f$ plus a $d$–$a$ path avoiding $b$; if $e = f$, take any cycle through $e$ and another edge.)

($\Leftarrow$) Given vertices $u \ne v$, choose edges $e \ni u$ and $f \ni v$ (no vertex is isolated). A cycle through $e$ and $f$ passes through $u$ and $v$, so a)
applies.
:::

```graph id=t05-two-edges-cycle widget=figure
caption: In a 2-connected graph, two disjoint paths between the ends of $e$ and the ends of $f$ close a cycle through both edges.
intent: Transcription of the lecture sketch for 2b.
layout: fixed
a @(0, 1); b @(1, 1); c @(0, -1); d @(1, -1); x @(-0.6, 0); y @(1.6, 0); z @(0.5, 0)
a -- b [class=highlight label="$e$"]; c -- d [class=highlight label="$f$"]
a -- x [class=cycle]; x -- c [class=cycle]; b -- y [class=cycle]; y -- d [class=cycle]; z -- a; z -- d
```

### Ear decompositions

::: theorem {#thm:ear-decomposition title="Ear decomposition" defines="ear ear decomposition" source="theory/2026-10-13 p3–4"}
A graph $G$ is $2$-connected $\iff$ $G$ has an **ear decomposition**, i.e. $G$ can be built from a cycle by repeatedly adding new paths (**ears**)
between two distinct existing vertices, whose inner vertices are new. (An ear may have no inner vertices, i.e. be a single new edge.)
:::

```graph id=t05-ear-decomposition widget=stepper
caption: An ear decomposition: start with a cycle, then add paths between two existing vertices.
intent: Show the constructive characterisation of 2-connected graphs.
layout: fixed
1 @(0, 0); 2 @(1, 0.9); 3 @(2.2, 0.9); 4 @(3, 0); 5 @(2.2, -0.9); 6 @(1, -0.9); 7 @(1.6, 0.25); 8 @(1.6, -0.35); 9 @(3.8, 0.6)
1 -- 2 -- 3 -- 4 -- 5 -- 6 -- 1
step: Start with a cycle.
class cycle: 1--2 2--3 3--4 4--5 5--6 6--1
step: Ear 1: the path $2, 7, 8, 5$ with new inner vertices $7, 8$.
2 -- 7 [class=highlight]; 7 -- 8 [class=highlight]; 8 -- 5 [class=highlight]
step: Ear 2: the path $3, 9, 4$.
unclass highlight: 2--7 7--8 8--5
3 -- 9 [class=highlight]; 9 -- 4 [class=highlight]
step: Ear 3: a single edge $1\,8$ between existing vertices. The result is 2-connected.
unclass highlight: 3--9 9--4
1 -- 8 [class=highlight]
```

::: proof
($\Leftarrow$) A cycle is $2$-connected. We show: if $G$ is $2$-connected and $H$ is $G$ plus an ear $P$ between $x \ne y$, then $H$ is $2$-connected. Delete one
vertex $z$ from $H$. If $z \in V(G)$, then $G - z$ is connected, and every inner vertex of $P$ is still connected along $P$ to $x$ or to $y$, at least one of which
survives. If $z$ is an inner vertex of $P$, then $G$ is intact and the two parts of $P - z$ are attached to $x$ and to $y$ respectively.

($\Rightarrow$) Let $G$ be $2$-connected. Then $G$ contains a cycle (by a), any two vertices lie on one). Choose $H \subseteq G$ maximal (with respect to inclusion)
such that $H$ has an ear decomposition; it exists since a cycle has one.

i. If $V(H) = V(G)$, then $H = G$: an edge of $G$ missing in $H$ would be an ear (without inner vertices) that could be added, contradicting maximality.

ii. If there is $x \in V(G) \setminus V(H)$, choose any $e \in E(H)$ and an edge $f$ incident with $x$ (so $f \notin E(H)$); since $G$ is connected, we may choose $x$ to
be adjacent to $V(H)$, but this is not even needed. By [[thm:two-connected-cycles]] b) there is a cycle $C$ through $e$ and $f$. Starting at $x$, walk along $C$ in
both directions until the first vertex of $H$ is met. This gives a path $Q \subseteq C$ through $x$ whose two ends lie in $V(H)$ and whose inner vertices do not. The
two ends are distinct, because $C$ contains both ends of $e$, i.e. at least two vertices of $H$. So $Q$ is an ear for $H$, and $H \cup Q$ has an ear decomposition,
contradicting the maximality of $H$.
:::

## Summary

- $k$-connected: removing $< k$ vertices keeps $G$ connected; $k$-edge-connected: removing $< k$ edges does ([[def:k-connected]]).
- Menger: maximum number of internally disjoint (edge-disjoint) $s$–$t$ paths $=$ minimum size of an $s$–$t$ cut (edge cut)
  ([[thm:menger-directed]]); globally, $k$-connected iff $k$ internally disjoint paths between every two vertices ([[thm:menger]]).
- Proof strategy: vertex version via vertex splitting; edge version via d-flows and augmenting paths ([[claim:d-flow-paths]]).
- Set version: $k$ disjoint paths between any two $k$-sets ([[thm:total-menger]]).
- $2$-connected iff every two vertices (edges) lie on a common cycle ([[thm:two-connected-cycles]]) iff it has an ear decomposition
  ([[thm:ear-decomposition]]).

## Exercises

```graph id=t05-ex-edge-disjoint widget=exercise
task: select-edges
prompt: Select the edges of $3$ edge-disjoint $s$–$t$ paths.
check: contains-edge-disjoint-paths k=3 from=s to=t
hint: $s$ and $t$ both have degree 3, so every edge at $s$ and at $t$ must be used.
solution: For example $s\,a\,d\,t$, $s\,b\,e\,t$ and $s\,c\,f\,t$. Any three paths that share no edge are correct.
s -- a; s -- b; s -- c; a -- d; b -- e; c -- f; d -- t; e -- t; f -- t; a -- b; d -- e; e -- f
```

:::: exercise {#exr:t05-whitney title="Whitney's inequalities" difficulty=2}
Let $\kappa(G)$ be the largest $k$ such that $G$ is $k$-connected, $\lambda(G)$ the largest $k$ such that $G$ is $k$-edge-connected, and $\delta(G)$ the minimum
degree. Show that $\lambda(G) \le \delta(G)$, and that $\kappa(G) \le \lambda(G)$ for every simple connected graph with at least $2$ vertices.

::: hint
For the second inequality, use Menger: edge-disjoint paths versus internally disjoint paths.
:::

::: solution
Removing the $\delta(G)$ edges at a vertex of minimum degree isolates it (if $G$ has another vertex), so $\lambda(G) \le \delta(G)$. For
$\kappa \le \lambda$: let $k = \kappa(G)$. By [[thm:menger]] a), every two vertices are joined by $k$ internally disjoint paths. Internally disjoint
paths are also edge-disjoint (in a simple graph two paths sharing an edge share its ends; if that edge is not $st$ itself, one of its ends is an inner
vertex of both paths; and only one of the paths can be the edge $st$). By [[thm:menger]] b), $G$ is $k$-edge-connected, so $\lambda(G) \ge k$.
:::
::::

:::: exercise {#exr:t05-bridge-cycle title="Bridges" difficulty=1}
Show that an edge $e$ of a connected graph is a bridge if and only if $e$ lies on no cycle.

::: solution
If $e = uv$ lies on a cycle $C$, then after deleting $e$ the rest of $C$ is still a $u$–$v$ path, and every walk that used $e$ can be rerouted, so $G - e$ is
connected. If $e$ lies on no cycle, then $G - e$ has no $u$–$v$ path (such a path plus $e$ would be a cycle), so $G - e$ is disconnected.
:::
::::

:::: exercise {#exr:t05-hypercube-connectivity title="Connectivity of the cube" difficulty=2}
Show that the cube $Q_3$ is $3$-connected by exhibiting, for the two vertices $000$ and $111$, three internally disjoint paths. (By symmetry, together with a
similar check for adjacent and distance-2 pairs, this proves $3$-connectivity.)

::: solution
$000 \to 100 \to 110 \to 111$, $\ 000 \to 010 \to 011 \to 111$, $\ 000 \to 001 \to 101 \to 111$. The inner vertices $100, 110$, $010, 011$ and $001, 101$
are pairwise different. ($Q_3$ cannot be $4$-connected since it is $3$-regular, see [[exr:t05-whitney]].)
:::
::::

:::: quiz {#q:t05-kn-connectivity}
What is the largest $k$ such that $K_6$ is $k$-connected?

answer: 5

::: explanation
By convention $K_n$ is $(n-1)$-connected and not $n$-connected ([[def:k-connected]]).
:::
::::

:::: quiz {#q:t05-tree-connectivity}
Which trees on at least 3 vertices are 2-connected?

- [ ] All of them
- [ ] Only paths
- [x] None

::: explanation
A tree on $\ge 3$ vertices has a vertex of degree $\ge 2$, which is a cut vertex: removing it disconnects its neighbours (they are joined only through
it, by uniqueness of paths). Also, trees have no cycles, so [[thm:two-connected-cycles]] fails.
:::
::::

:::: quiz {#q:t05-menger-count}
In a graph, the minimum size of an $s$–$t$ edge cut is 4. How many edge-disjoint $s$–$t$ paths are there at most?

answer: 4

::: explanation
By Menger's theorem the maximum number of edge-disjoint $s$–$t$ paths equals the minimum size of an $s$–$t$ edge cut.
:::
::::
