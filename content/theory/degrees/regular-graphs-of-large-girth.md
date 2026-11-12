---
title: "Regular graphs of large girth"
course: theory
chapter: degrees
order: 7
lectures: [t03]
stage: split
status: reviewed
---

Can a graph have **many** edges at every vertex and still no short cycles? Locally, around every vertex,
such a graph looks like a tree branching $d$ ways, for about $k/2$ levels. <!-- REVIEW: was "for $k/2$ levels"; false for even k (K_{3,3}, k = 4); girth >= k gives a tree only for floor((k-1)/2) levels --> Surprisingly, this is always possible:

::: theorem {#thm:regular-large-girth title="Regular graphs of large girth" source="theory/2026-09-29 p8"}
For all $d \ge 0$ and $k \ge 1$ there exists a $d$-regular graph of girth at least $k$.
:::

::: intuition
Many edges at every vertex and no short cycles pull in opposite directions, but they can be reconciled
by making the graph huge. The proof raises the degree by one at a time: take many copies of a graph
of degree $d - 1$ and add one edge at every vertex, joining the copies along the pattern of a graph $H$
whose own girth is at least $k/2$. A short cycle would have to travel through at least $k/2$ copies,
and it spends at least one edge inside each, so it is not short after all. Example: for $d = 2$ a long enough
cycle does the job; for $d = 3$, $k = 5$ the Petersen graph does ([[fig:t03-petersen]]).
:::

```graph id=t03-petersen-local-tree widget=stepper
caption: Around vertex 0 the Petersen graph ($d = 3$, girth 5) looks like a tree that branches 3 ways for 2 levels; each of the other edges closes a cycle of length 5.
intent: New example for the theorem with d = 3, k = 5. The graph is the one the lecture draws next to the theorem (theory/2026-09-29 p8, top right), numbered by the Petersen generator as in t03-petersen. Shows the picture of the intuition: locally a tree.
height: small
use: Petersen
step: The Petersen graph: every vertex has degree 3.
class current: 0
step: Vertex 0 has 3 neighbours.
class tree: 0--1 0--4 0--5
step: They have 6 further neighbours, all different: a tree of depth 2.
class tree: 1--2 1--6 4--3 4--9 5--7 5--8
step: The other 6 edges join leaves of different branches.
class highlight: 2--3 2--7 3--8 6--8 6--9 7--9
step: Each of them closes a cycle of length 5, such as 0, 1, 2, 3, 4.
unclass highlight: 2--3 2--7 3--8 6--8 6--9 7--9
unclass tree: 0--1 1--2 4--3 0--4
class cycle: 0--1 1--2 2--3 3--4 0--4
```

The proof is an **induction on the pair $(k, d)$**, first on $k$ and then on $d$: known graphs settle the base cases, and the step glues copies of one smaller good graph together along a second one.

Base cases with small $d$.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-base-d widget=stepper
caption: The base cases $d = 0, 1, 2$, here for $k = 5$: $K_1$, $K_2$ and $C_5$.
intent: New. The lecture only notes "OK for d = 2" (theory/2026-09-29 p8); the figure grows the three graphs of the written proof from one vertex, for k = 5.
layout: fixed
1 @(0, 0.75)
step: Good for $(k, d)$: induction on $k$, then on $d$.
step: $d = 0$: one vertex, $K_1$.
class highlight: 1
mark K1: 1
step: $d = 1$: one edge, $K_2$.
2 @(0.71, 0.23)
1 -- 2
class highlight: 2 1--2
mark K2: 1 2 1--2
step: $d = 2$: the cycle $C_5$, girth 5.
3 @(0.44, -0.61)
4 @(-0.44, -0.61)
5 @(-0.71, 0.23)
2 -- 3 -- 4 -- 5 -- 1
unclass highlight: 1 2 1--2
class cycle: 1--2 2--3 3--4 4--5 5--1
mark C: 1--2 2--3 3--4 4--5 5--1
```

::: step
A graph is *good for $(k, d)$* if it is $d$-regular with girth at least $k$. We prove by induction that every pair has a good graph. A pair comes earlier when its $k$ is smaller, or when $k$ is the same and $d$ is smaller. Pairs with $d$ at most 2 or $k$ at most 4 are base cases.
:::

::: step
$d = 0$: we take [[fig:t03-girth-base-d#K1|$K_1$]], a single vertex. It has degree 0, so $K_1$ is 0-regular. It has no cycle, so its girth is $\infty$, which is at least every $k$. So $K_1$ is good for every $k$.
:::

::: step
$d = 1$: we take [[fig:t03-girth-base-d#K2|$K_2$]], a single edge. Both ends have degree 1, so it is 1-regular. Again there is no cycle, so the girth is $\infty$ and $K_2$ is good for every $k$.
:::

::: step
$d = 2$: in a cycle every vertex has degree 2, and the only cycle is the whole graph, so the girth is the length. A simple cycle needs at least 3 vertices, so we take the length $\max(k, 3)$, which is at least $k$. Here $k$ is 5: [[fig:t03-girth-base-d#C|$C_5$]], girth 5.
:::
::::

Base cases with small $k$.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-base-k widget=stepper
caption: The base cases $k \le 3$ and $k = 4$, here for $d = 3$: $K_4$ has girth 3, $K_{3,3}$ has girth 4.
intent: New. The lecture only notes "OK for k in {3, 4}" (theory/2026-09-29 p8); the figure shows the graphs of the written proof for d = 3, and K_4 turns into K_{3,3}.
layout: fixed
u1 @(0, 1); u2 @(1, 1); w1 @(0, 0); w2 @(1, 0)
u1 -- u2; w1 -- w2; u1 -- w1; u1 -- w2; u2 -- w1; u2 -- w2
step: $k \le 3$: $K_{d+1}$, here $K_4$.
class cycle: u1--u2 u2--w1 u1--w1
mark K: u1 u2 w1 w2
mark tri: u1--u2 u2--w1 u1--w1
step: $k = 4$: $K_{d,d}$, here $K_{3,3}$.
remove u1--u2 w1--w2
unclass cycle: u2--w1 u1--w1
u3 @(2, 1); w3 @(2, 0)
u3 -- w1; u3 -- w2; u3 -- w3; u1 -- w3; u2 -- w3
class color1: u1 u2 u3
class color2: w1 w2 w3
mark Kdd: u1 u2 u3 w1 w2 w3
step: Bipartite, so no triangle: girth 4.
class cycle: u1--w1 w1--u2 u2--w2 w2--u1
mark sq: u1--w1 w1--u2 u2--w2 w2--u1
```

::: step
$k \le 3$: we take [[fig:t03-girth-base-k#K|$K_{d+1}$]]. Each vertex is adjacent to the $d$ others, so it is $d$-regular. A simple graph has no loops and no parallel edges, so no cycle of length 1 or 2. Its girth is at least 3, so at least $k$. Here $d$ is 3: $K_4$, [[fig:t03-girth-base-k#tri|girth 3]].
:::

::: step
$k = 4$: we take [[fig:t03-girth-base-k#Kdd|$K_{d,d}$]]: two sides of $d$ vertices, and every vertex is joined to every vertex of the other side. So each vertex has $d$ neighbours, and the graph is $d$-regular. Here $K_{3,3}$ is 3-regular.
:::

::: step
$K_{d,d}$ is [[def:bipartite|bipartite]], with its two sides as the parts. By [[thm:bipartite-odd-cycle|König's theorem]] it has no odd cycle, so no triangle. A simple graph has no cycle of length 1 or 2 either, so every cycle has length at least 4. Here the shortest cycles have [[fig:t03-girth-base-k#sq|length 4]].
:::
::::

The induction step, part 1: building $F$. The figures of the step run the construction with small numbers, $k = 5$ and $d = 2$. The proof treats that pair as a base case, but the construction works the same, and a real instance is far too large to draw.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-step-build widget=stepper
caption: The construction with $G = K_2$ and $H = C_3$: three copies of $G$, joined along the edges of $H$, give $F = C_6$. Copy $G_{h_1}$ holds $a_1$ and $a_2$, $G_{h_2}$ holds the $b$s, $G_{h_3}$ the $c$s.
intent: New; follows the lecture drawing (theory/2026-09-29 p8: copies of G in circles, joined along H) and the names of t03-girth-construction; the copies are coloured instead of drawn as labelled groups, and the layout is wide and flat, so that the figure keeps the minimum size in the walkthrough column. Toy numbers k = 5, d = 2, with G = K_2 good for (5, 1) and H = C_3 good for (3, 2); the step's real numbers (k at least 5, d at least 3) give graphs far too large to draw.
layout: fixed
a1 @(0.1, 0.25); a2 @(0.5, 0.85)
a1 -- a2
step: $G$, good for $(k, d - 1)$; here $K_2$, so $N = 2$.
class highlight: a1 a2 a1--a2
mark G: a1 a2 a1--a2
step: $H$, good for $(\lceil k/2 \rceil, N)$; here $C_3$.
class hidden: a1 a2 a1--a2
h1 [label="$h_1$"] @(0.3, 0.55)
h2 [label="$h_2$"] @(2.7, 0.55)
h3 [label="$h_3$"] @(1.5, -0.45)
h1 -- h2 -- h3 -- h1
mark H: h1 h2 h3 h1--h2 h2--h3 h1--h3
step: One copy $G_h$ of $G$ for each vertex $h$ of $H$.
remove h1 h2 h3
unclass hidden: a1 a2 a1--a2
unclass highlight: a1 a2 a1--a2
b1 @(2.5, 0.85); b2 @(2.9, 0.25); c1 @(1.15, -0.45); c2 @(1.85, -0.45)
b1 -- b2; c1 -- c2
class color1: a1 a2
class color2: b1 b2
class color3: c1 c2
mark copies: a1 a2 b1 b2 c1 c2
step: $\beta_{h_1}$ sends $h_1h_2$ to $a_2$ and $h_1h_3$ to $a_1$.
class current: a1 a2
mark beta: a1 a2
step: Each edge of $H$ becomes one $H$-edge of $F$.
unclass current: a1 a2
a2 -- b1 [class=highlight]; b2 -- c2 [class=highlight]; c1 -- a1 [class=highlight]
mark Hedges: a2--b1 b2--c2 c1--a1
```

::: step
Let $k \ge 5$ and $d \ge 3$; every other pair is a base case. The pair with the same $k$ and degree $d - 1$ comes earlier. So by induction there is a graph [[fig:t03-girth-step-build#G|$G$]] good for it. Let $N$ be its number of vertices. Here $G$ is $K_2$, good for $(5, 1)$, so $N$ is 2.
:::

::: step
Next we need a graph [[fig:t03-girth-step-build#H|$H$]] good for $(\lceil k/2 \rceil, N)$. For $k$ from 2 on, half of $k$ rounded up is less than $k$. So this pair comes earlier, however large $N$ is, because the induction is first on $k$. Here $H$ is $C_3$: 2-regular, girth 3, and 5/2 rounded up is 3.
:::

::: step
For every vertex $h$ of $H$ we take a new copy $G_h$ of $G$. The copies share no vertices. Inside its copy, each vertex has degree $d - 1$. Here the [[fig:t03-girth-step-build#copies|three copies]] of $K_2$ belong to $h_1$, $h_2$ and $h_3$.
:::

::: step
Fix a vertex $h$. Since $H$ is $N$-regular, exactly $N$ edges of $H$ meet $h$, and $G_h$ has exactly $N$ vertices. Two sets of the same size have a bijection between them, so we fix one, $\beta_h$, from these edges to these vertices. Here [[fig:t03-girth-step-build#beta|$\beta_{h_1}$]] sends $h_1h_2$ to $a_2$ and $h_1h_3$ to $a_1$.
:::

::: step
For every edge $hh'$ of $H$ we add one edge to $F$. It joins the vertex $\beta_h(hh')$ of $G_h$ to the vertex $\beta_{h'}(hh')$ of $G_{h'}$. These are the $H$-edges. Here $h_1h_2$ gives [[fig:t03-girth-step-build#Hedges|$a_2b_1$]], and the three $H$-edges close $F$ into a 6-cycle.
:::
::::

Part 2: $F$ is a simple $d$-regular graph.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-step-regular widget=stepper
caption: In $F$ every vertex has degree $d - 1$ in its copy plus one $H$-edge, here $1 + 1 = 2$, and no two edges join the same pair. Copy $G_{h_1}$ holds $a_1$ and $a_2$, $G_{h_2}$ holds the $b$s, $G_{h_3}$ the $c$s.
intent: New; the toy F of t03-girth-step-build (k = 5, d = 2), same names and positions.
layout: fixed
a1 @(0.1, 0.25); a2 @(0.5, 0.85); b1 @(2.5, 0.85); b2 @(2.9, 0.25); c1 @(1.15, -0.45); c2 @(1.85, -0.45)
a1 -- a2; b1 -- b2; c1 -- c2
class color1: a1 a2
class color2: b1 b2
class color3: c1 c2
step: Inside its copy, $a_1$ has degree $d - 1 = 1$.
class current: a1
class highlight: a1--a2
mark a1: a1
step: Exactly one $H$-edge at each vertex: degree $d$.
a2 -- b1; b2 -- c2; c1 -- a1 [class=highlight]
mark f: c1--a1
step: $H$-edges join different copies.
unclass current: a1
unclass highlight: a1--a2 c1--a1
class bold: a2--b1 b2--c2 c1--a1
mark cross: a2--b1 b2--c2 c1--a1
step: A second edge $a_2b_1$ cannot occur.
a2 -- b1 [class="rejected dashed"]
mark par: a2--b1#2
```

::: step
Take a vertex of a copy $G_h$. The copy is a copy of $G$, and $G$ is good for the pair with degree $d - 1$. So inside $G_h$ the vertex has degree $d - 1$. Here [[fig:t03-girth-step-regular#a1|$a_1$]] has one neighbour in its copy, $a_2$.
:::

::: step
The $H$-edges at $G_h$ come from the edges of $H$ at $h$, and each one ends at the image under $\beta_h$. Since $\beta_h$ is a bijection, every vertex of $G_h$ is the image of exactly one of these edges. So it gets exactly one $H$-edge, and its degree becomes $d$. Here [[fig:t03-girth-step-regular#f|$c_1a_1$]] gives $a_1$ degree 2.
:::

::: step
Now simplicity. An $H$-edge comes from an edge $hh'$ of $H$, and $h \ne h'$ because $H$ is simple. So the $H$-edge joins two different copies. It is not a loop, and no edge inside a copy joins the same two vertices. Here each $H$-edge [[fig:t03-girth-step-regular#cross|runs between two copies]].
:::

::: step
Could two $H$-edges join the same $u$ in $G_h$ and $v$ in $G_{h'}$? Both would come from an edge between $h$ and $h'$. $H$ is simple, so there is only one such edge, and it gives one $H$-edge. So $F$ has no parallel edges. Here a [[fig:t03-girth-step-regular#par|second edge]] $a_2b_1$ would need a second edge $h_1h_2$.
:::
::::

Part 3: every cycle $C$ of $F$ has length at least $k$. First we show that $C$ uses many $H$-edges: at least $\lceil k/2 \rceil$.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-step-walk widget=stepper
caption: Contracting each copy of $G$ to its vertex $h$ turns the cycle $C$ into a closed walk in $H$ that uses each edge once. Copy $G_{h_1}$ holds $a_1$ and $a_2$, $G_{h_2}$ holds the $b$s, $G_{h_3}$ the $c$s.
intent: New; the toy F of t03-girth-step-build (k = 5, d = 2). Contracting the copies turns the cycle C = F into the closed walk h_1, h_2, h_3, h_1 in H = C_3.
layout: fixed
a1 @(0.1, 0.25); a2 @(0.5, 0.85); b1 @(2.5, 0.85); b2 @(2.9, 0.25); c1 @(1.15, -0.45); c2 @(1.85, -0.45)
a1 -- a2; b1 -- b2; c1 -- c2
a2 -- b1 [id=f1]; b2 -- c2 [id=f2]; c1 -- a1 [id=f3]
class color1: a1 a2
class color2: b1 b2
class color3: c1 c2
step: A cycle without $H$-edges stays in one copy.
class highlight: a1 a2 a1--a2
class muted: @f1 @f2 @f3
mark copy: a1 a2 a1--a2
step: Otherwise its $H$-edges are $f_1, \dots, f_t$; here $t = 3$.
unclass highlight: a1 a2 a1--a2
unclass muted: @f1 @f2 @f3
class cycle: a1--a2 @f1 b1--b2 @f2 c1--c2 @f3
set @f1 [label="$f_1$"]
set @f2 [label="$f_2$"]
set @f3 [label="$f_3$"]
mark C: a1--a2 @f1 b1--b2 @f2 c1--c2 @f3
mark f: @f1 @f2 @f3
step: Contracting each copy gives a closed walk in $H$.
merge a1 a2 -> h1 [label="$h_1$"]
merge b1 b2 -> h2 [label="$h_2$"]
merge c1 c2 -> h3 [label="$h_3$"]
unclass cycle: @f1 @f2 @f3
class path: @f1 @f2 @f3
mark walk: h1 h2 h3 @f1 @f2 @f3
step: The walk uses each edge $e_i$ once, and $t \ge 2$.
set @f1 [label="$e_1$"]
set @f2 [label="$e_2$"]
set @f3 [label="$e_3$"]
mark e: @f1 @f2 @f3
step: By the lemma, the walk contains a cycle of $H$.
unclass path: @f1 @f2 @f3
class cycle: @f1 @f2 @f3
mark cyc: h1 h2 h3 @f1 @f2 @f3
step: The cycle has at least $\lceil k/2 \rceil$ edges, so $t \ge \lceil k/2 \rceil$.
class bold: @f1 @f2 @f3
```

::: step
Let $C$ be a cycle in $F$. Only $H$-edges leave a copy. So if $C$ uses no $H$-edge, it stays inside one copy and is a cycle of $G$. $G$ has girth at least $k$, so $C$ has length at least $k$. Here each [[fig:t03-girth-step-walk#copy|copy]] is $K_2$, which has no cycle at all.
:::

::: step
Otherwise $C$ uses $H$-edges. We go once around $C$ and name them $f_1, \dots, f_t$ in the order we meet them. Here $F$ itself is a 6-cycle, so [[fig:t03-girth-step-walk#C|$C$]] is all of $F$, with [[fig:t03-girth-step-walk#f|three $H$-edges]]: $t$ is 3.
:::

::: step
Between two consecutive $H$-edges, $C$ uses only edges of copies, so it stays in one copy. We list the copies as $C$ visits them: $h_1, h_2, \dots, h_t$, then $h_1$ again. Consecutive copies are joined by an $H$-edge, which comes from an edge of $H$. So the list is a [[def:walk|closed walk]] in $H$. Here [[fig:t03-girth-step-walk#walk|$h_1, h_2, h_3, h_1$]].
:::

::: step
Let $e_i$ be the edge of $H$ that $f_i$ comes from. Each edge of $H$ gives exactly one $H$-edge, so different $f_i$ give different $e_i$: the walk uses each edge once. A walk with one edge would go from $h_1$ to $h_1$, a loop, and $H$ has none. So $t \ge 2$. Here [[fig:t03-girth-step-walk#e|$e_1$, $e_2$, $e_3$]].
:::

::: step
By [[lem:closed-walk-cycle|the closed-walk lemma]], a closed walk contains a cycle, or it traverses every edge an even number of times. Our walk traverses each $e_i$ exactly once, an odd number. So the second option fails, and the walk contains a [[fig:t03-girth-step-walk#cyc|cycle of $H$]]. Here it is the triangle $h_1h_2h_3$, all of $H$.
:::

::: step
$H$ is good for the pair with $k/2$ rounded up, so its girth is at least that number, and our cycle has at least that many edges. Its edges are among the $t$ edges of the walk. So $t \ge \lceil k/2 \rceil$. Here 3 against 3: the cycle uses [[fig:t03-girth-step-walk#e|all three edges]].
:::
::::

Then we show that between two $H$-edges, $C$ also uses an edge of a copy, and we count.

:::: walkthrough {for=thm:regular-large-girth}
```graph id=t03-girth-step-count widget=stepper
caption: Between two consecutive $H$-edges the cycle uses at least one edge of a copy, so $C$ has at least $2t$ edges; here 6, against $k = 5$. Copy $G_{h_1}$ holds $a_1$ and $a_2$, $G_{h_2}$ holds the $b$s, $G_{h_3}$ the $c$s.
intent: New; the toy F of t03-girth-step-build with C = F (k = 5, d = 2, t = 3).
layout: fixed
a1 @(0.1, 0.25); a2 @(0.5, 0.85); b1 @(2.5, 0.85); b2 @(2.9, 0.25); c1 @(1.15, -0.45); c2 @(1.85, -0.45)
a1 -- a2; b1 -- b2; c1 -- c2
a2 -- b1 [label="$f_1$"]; b2 -- c2 [label="$f_2$"]; c1 -- a1 [label="$f_3$"]
class color1: a1 a2
class color2: b1 b2
class color3: c1 c2
step: $C$ enters $G_{h_2}$ at $b_1$ and leaves at $b_2$.
class current: b1 b2
mark in: b1
mark out: b2
step: $b_1$ and $b_2$ differ, so $C$ uses an edge of $G_{h_2}$.
class path: b1--b2
mark seg: b1--b2
step: The same holds in every copy: $t$ such stretches.
unclass current: b1 b2
class path: a1--a2 c1--c2
mark segs: a1--a2 b1--b2 c1--c2
step: So $C$ has at least $2t$ edges, and $2t \ge k$.
unclass path: a1--a2 b1--b2 c1--c2
class cycle: a1--a2 b1--b2 c1--c2 a2--b1 b2--c2 c1--a1
mark all: a1--a2 b1--b2 c1--c2 a2--b1 b2--c2 c1--a1
```

::: step
Say $C$ enters the copy $G_h$ through $f_i$ and leaves it through $f_{i+1}$. By the construction, $f_i$ ends in $G_h$ at the vertex $\beta_h(e_i)$, and $f_{i+1}$ starts at $\beta_h(e_{i+1})$. There $C$ enters and leaves. Here $C$ enters $G_{h_2}$ at [[fig:t03-girth-step-count#in|$b_1$]] through $f_1$ and leaves at [[fig:t03-girth-step-count#out|$b_2$]] through $f_2$.
:::

::: step
These two vertices are different. The edges $e_i$ and $e_{i+1}$ both meet $h$, and they are different edges, as we saw. $\beta_h$ is a bijection, so it sends them to different vertices. To get from one to the other inside $G_h$, $C$ needs at least one edge of $G_h$. Here [[fig:t03-girth-step-count#seg|$b_1b_2$]].
:::

::: step
This holds between any two consecutive $H$-edges, also between $f_t$ and $f_1$. So $C$ has $t$ stretches inside copies, each with at least one edge, and they share no edges. Here [[fig:t03-girth-step-count#segs|three stretches]] of one edge each.
:::

::: step
Now we count: $t$ $H$-edges plus at least $t$ edges of copies. With the bound on $t$ from above, $\abs{E(C)} \ge 2t \ge 2\lceil k/2 \rceil \ge k$. Together with the first case, every cycle of $F$ has length at least $k$, so $F$ is good for $(k, d)$. Here [[fig:t03-girth-step-count#all|6 edges]] against $k = 5$.
:::
::::

:::: proof
Call a graph **good for $(k, d)$** if it is $d$-regular with girth at least $k$. We proceed by induction,
primarily on $k$ and secondarily on $d$.

**(a) Base cases.**

- $d = 0$: $K_1$; $d = 1$: $K_2$ (both acyclic, girth $\infty$). $d = 2$: the cycle $C_{\max(k,3)}$.
- $k \le 3$: $K_{d+1}$ (every simple graph has girth at least $3$). $k = 4$: $K_{d,d}$, which is
  $d$-regular and [[def:bipartite|bipartite]], hence has no triangle ([[thm:bipartite-odd-cycle]]).

**(b) Induction step.** Let $k \ge 5$ and $d \ge 3$, and assume we have graphs

- $G$ good for $(k, d-1)$ (by induction on $d$), with $N := \abs{V(G)}$, and
- $H$ good for $(\lceil k/2 \rceil, N)$ (by induction on $k$, since $\lceil k/2 \rceil < k$).

Then the following graph $F$ is good for $(k, d)$. Take one copy $G_h$ of $G$ for every vertex $h \in V(H)$.
Every vertex $h$ of $H$ has exactly $N$ incident edges, and $G_h$ has exactly $N$ vertices; fix a bijection
$\beta_h$ from the edges of $H$ at $h$ to the vertices of $G_h$. For every edge $hh' \in E(H)$ add to $F$ an
edge joining $\beta_h(hh') \in V(G_h)$ and $\beta_{h'}(hh') \in V(G_{h'})$. Call these the **$H$-edges** of $F$.

*$F$ is a simple $d$-regular graph.* Every vertex of every copy $G_h$ had degree $d - 1$ and receives exactly
one $H$-edge (as $\beta_h$ is a bijection), so it has degree $d$. $H$-edges join different copies, and two
$H$-edges come from different edges of $H$, so they cannot join the same pair of vertices.

*$F$ has girth at least $k$.* Let $C$ be a cycle in $F$. If $C$ uses no $H$-edge, it lies inside one copy of $G$
and has length at least $k$. Otherwise let $f_1, \dots, f_t$ be the $H$-edges of $C$ in cyclic order. Between
$f_i$ and $f_{i+1}$ the cycle stays inside one copy $G_h$, so the copies visited, $h_1, h_2, \dots, h_t, h_1$,
form a [[def:walk|closed walk]] in $H$ that uses the edges of $H$ corresponding to $f_1, \dots, f_t$, each exactly once.
(A single $H$-edge cannot close a walk, so $t \ge 2$.) By [[lem:closed-walk-cycle]], since no edge is traversed
an even number of times, this closed walk contains a cycle of $H$, which has length at least
$\lceil k/2 \rceil$; its edges are among the $t$ edges of the walk, so $t \ge \lceil k/2 \rceil$. Moreover, let
$e_i \in E(H)$ be the edge corresponding to $f_i$. If $C$ enters $G_h$ through $f_i$ and leaves through
$f_{i+1}$, it enters at the vertex $\beta_h(e_i)$ and leaves at $\beta_h(e_{i+1})$; these are different vertices
because $e_i \ne e_{i+1}$ are different edges of $H$ at $h$ and $\beta_h$ is a bijection. So between any two
consecutive $H$-edges, $C$ uses at least one edge of a copy of $G$. Therefore
<!-- REVIEW: β_h is defined on edges of H, not on H-edges of F: introduced e_i and wrote β_h(e_i); made explicit why t ≥ ⌈k/2⌉ (the cycle's edges are among the t walk edges). -->

$$\abs{E(C)} \ \ge\ 2t\ \ge\ 2\lceil k/2 \rceil\ \ge\ k.$$
::::

```graph id=t03-girth-construction widget=figure
caption: The construction: one copy of $G$ for each vertex of $H$; each edge of $H$ becomes one edge between the corresponding copies (only some of these $H$-edges are drawn; in $F$ every vertex of every copy gets exactly one).
intent: Schematic version of the lecture drawing. Groups are the copies of G (here G = C_4 is good for (4, 2)); H-edges are highlighted. Purely illustrative, not an actual instance of the theorem's parameters.
layout: fixed
a1 @(0, 1); a2 @(0.6, 1); a3 @(0.6, 0.4); a4 @(0, 0.4)
b1 @(3, 1); b2 @(3.6, 1); b3 @(3.6, 0.4); b4 @(3, 0.4)
c1 @(1.5, -1); c2 @(2.1, -1); c3 @(2.1, -1.6); c4 @(1.5, -1.6)
a1 -- a2 -- a3 -- a4 -- a1; b1 -- b2 -- b3 -- b4 -- b1; c1 -- c2 -- c3 -- c4 -- c1
a2 -- b1 [class=highlight]; a3 -- c1 [class=highlight]; b4 -- c2 [class=highlight]
group G1: a1 a2 a3 a4 [label="$G_{h_1}$"]
group G2: b1 b2 b3 b4 [label="$G_{h_2}$"]
group G3: c1 c2 c3 c4 [label="$G_{h_3}$"]
```

::: remark
The graphs produced by this construction are huge. How small a $d$-regular graph of girth $k$ can be is a
famous open problem (the "cage problem"); the Petersen graph is the smallest $3$-regular graph of girth $5$.
:::
