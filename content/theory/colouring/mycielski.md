---
title: Mycielski graphs
course: theory
chapter: colouring
order: 5
lectures: [t08]
goal: Build, for every k, a graph without triangles that needs exactly k colours.
needs: [theory/colouring/colourings, theory/colouring/two-colourable, theory/colouring/chromatic-bounds, theory/basics/graph-families]
stage: taught
long: true # the proof has four parts (base, construction, no triangle, the two bounds on chi), so five walkthroughs with 21 steps
status: reviewed
---

The 5-cycle has no triangle, and still it needs 3 colours. The graph below has no triangle
either: no three of its vertices are pairwise adjacent. How many colours does it need?

```graph id=t08-myc-grotzsch widget=figure
caption: 11 vertices: the outer 5-cycle, the inner ring of five and the centre $m$. Each inner vertex is joined to the two outer neighbours of the outer vertex beside it, and to $m$. No three vertices are pairwise adjacent, and the graph needs 4 colours.
intent: New figure: $G_4$, the lecture's construction (theory/2026-11-03 p6) applied to $G_3 = C_5$. Row 0 of the board is the outer ring, row 1 the inner ring, $m$ the centre. The opening question of the page.
layout: fixed
a0 @(0, 1.6) [label="$a_0$"]; b0 @(1.52, 0.49) [label="$b_0$"]; c0 @(0.94, -1.29) [label="$c_0$"]; d0 @(-0.94, -1.29) [label="$d_0$"]; e0 @(-1.52, 0.49) [label="$e_0$"]
a1 @(0, 0.8) [label="$a_1$"]; b1 @(0.76, 0.25) [label="$b_1$"]; c1 @(0.47, -0.65) [label="$c_1$"]; d1 @(-0.47, -0.65) [label="$d_1$"]; e1 @(-0.76, 0.25) [label="$e_1$"]
m @(0, 0)
a0 -- b0; b0 -- c0; c0 -- d0; d0 -- e0; e0 -- a0
a1 -- b0; a1 -- e0; b1 -- a0; b1 -- c0; c1 -- b0; c1 -- d0; d1 -- c0; d1 -- e0; e1 -- d0; e1 -- a0
m -- a1; m -- b1; m -- c1; m -- d1; m -- e1
mark outer: a0 b0 c0 d0 e0 a0--b0 b0--c0 c0--d0 d0--e0 e0--a0
mark inner: a1 b1 c1 d1 e1
mark copy: a1 b0 e0 a1--b0 a1--e0
mark m: m m--a1 m--b1 m--c1 m--d1 m--e1
```

It needs 4. The lecture builds this graph from the 5-cycle, which is
[[fig:t08-myc-grotzsch#outer|the outer ring]]. Each inner vertex copies the neighbours of the
outer vertex beside it: [[fig:t08-myc-grotzsch#copy|$a_1$ is joined to $b_0$ and $e_0$]], as
$a_0$ is. [[fig:t08-myc-grotzsch#m|The centre $m$]] is joined to the whole inner ring. Apply
the same construction again and again, and the graphs need more and more colours, without a
triangle.

## Graphs without triangles that need many colours

::: theorem {#thm:mycielski title="Mycielski graphs" source="theory/2026-11-03 p6"}
For every $k \in \N$ there is a graph $G_k$ such that $\chi(G_k) = k$ and $G_k$ has no
triangles.
:::

::: intuition
Name any number of colours. Some graph needs exactly that many, and still no three of its
vertices are pairwise adjacent. So a graph can need many colours without a large clique.
:::

A triangle is a [[def:complete-graph|complete graph]] $K_3$ inside the graph. Without one, the
[[prop:chromatic-bounds|clique bound]] gives at most 2 colours as a lower bound. The theorem
says that the true number of colours can be any amount above it.

## Why it is true

The proof is an **induction on $k$ with a construction**: from $G_k$ we build a larger graph
$G_{k+1}$ that still has no triangle and needs one colour more. The first walkthrough is the
start of the induction.

:::: walkthrough {for=thm:mycielski}
```graph id=t08-myc-base widget=stepper
caption: The start of the induction: the 5-cycle has no triangle and needs 3 colours.
intent: Base case G_3 = C_5 of the lecture (theory/2026-11-03 p6, first line of the proof). New drawing, with the names and positions of t08-odd-five.
layout: fixed
a @(1.5, 1.3); b @(3, 0.8); c @(2.3, 0); d @(0.7, 0); e @(0, 0.8)
a -- b; b -- c; c -- d; d -- e; e -- a
mark c5: a b c d e a--b b--c c--d d--e e--a
mark a: a
mark nb: b e
mark col: a b c d e
step: For $k$ up to 2 the complete graph works; the induction starts with $C_5$.
step: The two neighbours of $a$ are not adjacent, so no triangle.
class current: a
class highlight: b e
step: An odd cycle needs 3 colours, and 3 are enough.
unclass current: a
unclass highlight: b e
class color1: a c
class color2: b d
class color3: e
```

::: step
Small $k$ first. For $k$ up to 2 the complete graph $K_k$ works: it has at most one edge, so
no triangle, and it needs exactly $k$ colours. For 0 colours this is the empty graph. The
lecture starts the induction at 3, with [[fig:t08-myc-base#c5|the 5-cycle as $G_3$]].
:::

::: step
The 5-cycle has no triangle. The two neighbours of [[fig:t08-myc-base#a|$a$]] are
[[fig:t08-myc-base#nb|$b$ and $e$]], and they are not adjacent. So no triangle contains $a$.
Every vertex of the cycle has the same situation: its two neighbours are two steps apart on the
cycle. So there is no triangle at all.
:::

::: step
The 5-cycle is an odd cycle, so two colours are not enough, by
[[prop:two-colourable|the two-colour criterion]]. Three colours are enough:
[[fig:t08-myc-base#col|1, 2, 1, 2, 3 around the cycle]] is proper. So its chromatic number is
3, and the base case holds.
:::
::::

The induction step builds the next graph from $G_k$. Its vertices are pairs, and we write $v_0$
for the pair $(v, 0)$ and $v_1$ for $(v, 1)$. In the figures the old graph is a path on three
vertices, which needs 2 colours. The proof starts at 3 colours, but then the new graph has 11
vertices, too many for a figure. Every step works the same.

:::: walkthrough {for=thm:mycielski}
```graph id=t08-myc-construction widget=stepper
caption: The construction of $G_{k+1}$: two rows of copies of $G_k$ and one new vertex $m$.
intent: From the lecture's drawing (theory/2026-11-03 p6, right): row x0 on top, row x1 below it, m at the bottom, with (u,0) and (u,1) as on the board. The board's G_k is generic; here G_k is the path a u b (k = 2, below the proof's k >= 3), because G_4 from C_5 has 11 vertices.
layout: fixed
a0 @(0, 1.3) [label="$a$"]; u0 @(1.5, 1.3) [label="$u$"]; b0 @(3, 1.3) [label="$b$"]
a1 @(0, 0.65) [label="$a_1$" class=hidden]; u1 @(1.5, 0.65) [label="$u_1$" class=hidden]; b1 @(3, 0.65) [label="$b_1$" class=hidden]
m @(1.5, 0) [class=hidden]
a0 -- u0; u0 -- b0
a1 -- u0 [class=hidden]; u1 -- a0 [class=hidden]; u1 -- b0 [class=hidden]; b1 -- u0 [class=hidden]
m -- a1 [class=hidden]; m -- u1 [class=hidden]; m -- b1 [class=hidden]
mark Gk: a0 u0 b0 a0--u0 u0--b0
mark row0: a0 u0 b0
mark row1: a1 u1 b1
mark m: m
mark row0e: a0--u0 u0--b0
mark cross: a1--u0 u1--a0 u1--b0 b1--u0
step: $G_k$: no triangle, and $k$ colours. Here a path, $k = 2$.
step: Every vertex $v$ gets two copies, and $m$ is new.
set a0 [label="$a_0$"]
set u0 [label="$u_0$"]
set b0 [label="$b_0$"]
unclass hidden: a1 u1 b1 m
step: Row 0 gets the edges of $G_k$.
class highlight: a0--u0 u0--b0
step: Each $v_1$ gets the row-0 neighbours of $v_0$.
unclass highlight: a0--u0 u0--b0
unclass hidden: a1--u0 u1--a0 u1--b0 b1--u0
class highlight: a1--u0 u1--a0 u1--b0 b1--u0
step: $m$ is joined to all of row 1.
unclass highlight: a1--u0 u1--a0 u1--b0 b1--u0
unclass hidden: m--a1 m--u1 m--b1
class highlight: m--a1 m--u1 m--b1
```

::: step
The induction hypothesis: [[fig:t08-myc-construction#Gk|$G_k$]] has no triangle and needs
exactly $k$ colours, for some $k$ of at least 3. From it we build $G_{k+1}$. Here the old graph
is a path on three vertices, which needs 2 colours.
:::

::: step
The vertices first. Every vertex $v$ of $G_k$ gets two copies: $v_0$ in
[[fig:t08-myc-construction#row0|row 0]] and $v_1$ in
[[fig:t08-myc-construction#row1|row 1]]. One new vertex [[fig:t08-myc-construction#m|$m$]]
comes on top. Here: 3 vertices in each row and $m$, so 7 vertices.
:::

::: step
Now the edges. For each edge $uv$ of $G_k$ we join $u_0$ and $v_0$. So row 0 is a copy of
$G_k$. Here these are [[fig:t08-myc-construction#row0e|the 2 edges of row 0]].
:::

::: step
For each edge $uv$ we also join $u_1$ to $v_0$, and $u_0$ to $v_1$. So each copy in row 1 has
the same neighbours in row 0 as its original. Row 1 gets no edge inside, and no copy is joined
to its original. Here [[fig:t08-myc-construction#cross|4 edges between the rows]].
:::

::: step
Last, we join $m$ to every vertex of row 1, and to nothing else. Here: 3 edges. In total
$G_{k+1}$ has 9 edges here: 2 in row 0, 4 between the rows and 3 at $m$.
:::
::::

Two things remain: $G_{k+1}$ has no triangle, and it needs exactly $k + 1$ colours.

:::: walkthrough {for=thm:mycielski}
```graph id=t08-myc-no-triangle widget=stepper
caption: Why $G_{k+1}$ has no triangle: row 1 and $m$ give none, and row 0 would give one in $G_k$.
intent: New figure on the graph of t08-myc-construction (the lecture's rows x0, x1 and m, theory/2026-11-03 p6). The board states "K_3 is not a subgraph of G_{k+1}" without a reason; the steps give it.
layout: fixed
a0 @(0, 1.3) [label="$a_0$"]; u0 @(1.5, 1.3) [label="$u_0$"]; b0 @(3, 1.3) [label="$b_0$"]
a1 @(0, 0.65) [label="$a_1$"]; u1 @(1.5, 0.65) [label="$u_1$"]; b1 @(3, 0.65) [label="$b_1$"]
m @(1.5, 0)
a0 -- u0; u0 -- b0
a1 -- u0; u1 -- a0; u1 -- b0; b1 -- u0
m -- a1; m -- u1; m -- b1
mark row1: a1 u1 b1
mark m: m m--a1 m--u1 m--b1
mark row0: a0 u0 b0 a0--u0 u0--b0
mark u1: u1 u1--a0 u1--b0
step: Row 1 has no edge inside: at most one triangle vertex there.
class highlight: a1 u1 b1
step: The neighbours of $m$ are not adjacent, so $m$ is in no triangle.
unclass highlight: a1 u1 b1
class current: m
class highlight: m--a1 m--u1 m--b1
step: Three vertices in row 0 would be a triangle of $G_k$.
unclass current: m
unclass highlight: m--a1 m--u1 m--b1
class highlight: a0 u0 b0 a0--u0 u0--b0
step: One vertex $u_1$ in row 1 would give a triangle of $G_k$ too.
unclass highlight: a0 u0 b0 a0--u0 u0--b0
class current: u1
class highlight: a0 b0 u1--a0 u1--b0
```

::: step
We show that $G_{k+1}$ has no triangle, three pairwise adjacent vertices. No edge joins two
vertices of [[fig:t08-myc-no-triangle#row1|row 1]]. So a triangle has at most one vertex in
row 1: two of them would have to be adjacent.
:::

::: step
All neighbours of [[fig:t08-myc-no-triangle#m|$m$]] lie in row 1, so no two of them are
adjacent. A triangle through $m$ would need two adjacent neighbours of $m$. So $m$ lies in no
triangle, and a triangle has all its vertices in the two rows.
:::

::: step
Suppose all three vertices lie in [[fig:t08-myc-no-triangle#row0|row 0]]. Row 0 is a copy of
$G_k$, so $G_k$ would contain a triangle. Here we use that $G_k$ has none. So this case is
impossible.
:::

::: step
The last case: [[fig:t08-myc-no-triangle#u1|$u_1$]] in row 1, and $v_0$, $w_0$ in row 0. Each
of the three edges was built from an edge of $G_k$, so $uv, uw, vw$ are edges there. An edge has
two different ends, so $u, v, w$ form a triangle in $G_k$, which has none. Here the two row-0
neighbours of $u_1$ are not adjacent.
:::
::::

:::: walkthrough {for=thm:mycielski}
```graph id=t08-myc-upper widget=stepper
caption: A proper colouring of $G_{k+1}$ with $k + 1$ colours: copy a colouring of $G_k$ to both rows and give $m$ a new colour.
intent: From the lecture's drawing (theory/2026-11-03 p6, right), where m is labelled c = k+1. The board writes only "chi(G_{k+1}) <= k+1"; the colouring of the rows is filled in. Here k = 2, so m gets colour 3.
layout: fixed
a0 @(0, 1.3) [label="$a_0$"]; u0 @(1.5, 1.3) [label="$u_0$"]; b0 @(3, 1.3) [label="$b_0$"]
a1 @(0, 0.65) [label="$a_1$"]; u1 @(1.5, 0.65) [label="$u_1$"]; b1 @(3, 0.65) [label="$b_1$"]
m @(1.5, 0)
a0 -- u0; u0 -- b0
a1 -- u0; u1 -- a0; u1 -- b0; b1 -- u0
m -- a1; m -- u1; m -- b1
mark row0: a0 u0 b0
mark row1: a1 u1 b1
mark m: m
step: A proper colouring of $G_k$ with $k$ colours, on row 0.
class color1: a0 b0
class color2: u0
step: Each $v_1$ gets the colour of $v_0$.
class color1: a1 b1
class color2: u1
step: $m$ gets the new colour $k + 1$.
class color3: m
```

::: step
Next, $k + 1$ colours are enough for $G_{k+1}$. Here we use that $G_k$ needs only $k$: it has a
proper colouring $c_k$ with the colours 1 to $k$. We put it on
[[fig:t08-myc-upper#row0|row 0]]. Here the ends of the path get colour 1, the middle colour 2.
:::

::: step
Each copy in [[fig:t08-myc-upper#row1|row 1]] gets the colour of its original too. Every edge
in row 0 or between the rows comes from an edge $uv$ of $G_k$. Its two ends get the colours of
$u$ and $v$, which differ because $c_k$ is proper.
:::

::: step
Then [[fig:t08-myc-upper#m|$m$]] gets the new colour $k + 1$. Its neighbours lie in row 1 and
have colours from 1 to $k$. So this is a proper colouring with $k + 1$ colours, and
$\chi(G_{k+1}) \le k + 1$. Here $m$ gets colour 3.
:::
::::

The last part is a **proof by contradiction**. No colouring with only $k$ colours exists, so the
figure cannot show one. It shows which edges each step uses.

:::: walkthrough {for=thm:mycielski}
```graph id=t08-myc-lower widget=stepper
caption: Why $k$ colours are not enough: a $k$-colouring of $G_{k+1}$ would give a colouring of $G_k$ with $k - 1$ colours.
intent: From the lecture's drawing (theory/2026-11-03 p6, right): rows x0, x1 and m, with c = k at (u,0) and (u,1) ringed; the board labels m with c = k+1 (the k is overwritten). The figure shows no colouring with k colours (none exists) and copies none of these labels; it marks the edges each step uses. The last step shows the real 3-colouring of t08-myc-upper.
layout: fixed
a0 @(0, 1.3) [label="$a_0$"]; u0 @(1.5, 1.3) [label="$u_0$"]; b0 @(3, 1.3) [label="$b_0$"]
a1 @(0, 0.65) [label="$a_1$"]; u1 @(1.5, 0.65) [label="$u_1$"]; b1 @(3, 0.65) [label="$b_1$"]
m @(1.5, 0)
a0 -- u0; u0 -- b0
a1 -- u0; u1 -- a0; u1 -- b0; b1 -- u0
m -- a1; m -- u1; m -- b1
mark m: m
mark row1: a1 u1 b1 m--a1 m--u1 m--b1
mark u0: u0
mark w: a0 b0 u1--a0 u1--b0
mark row0: a0 u0 b0 a0--u0 u0--b0
step: Suppose $k$ colours are enough, with colour $k$ at $m$.
class current: m
step: Row 1 is joined to $m$, so it has no vertex of colour $k$.
class highlight: a1 u1 b1 m--a1 m--u1 m--b1
step: A neighbour $w_0$ of $u_0$ in row 0 is also joined to $u_1$.
unclass current: m
unclass highlight: a1 u1 b1 m--a1 m--u1 m--b1
class current: u0
class highlight: u1 a0 b0 u1--a0 u1--b0
step: Every $u_0$ of colour $k$ takes the colour of $u_1$.
unclass current: u0
unclass highlight: u1 a0 b0 u1--a0 u1--b0
class color1: u0 u1
step: Row 0 now has a colouring of $G_k$ with $k - 1$ colours.
unclass color1: u0 u1
class muted: a1 u1 b1 m a1--u0 u1--a0 u1--b0 b1--u0 m--a1 m--u1 m--b1
class highlight: a0 u0 b0 a0--u0 u0--b0
step: So $G_{k+1}$ needs exactly $k + 1$ colours. Here 3.
unclass muted: a1 u1 b1 m a1--u0 u1--a0 u1--b0 b1--u0 m--a1 m--u1 m--b1
unclass highlight: a0 u0 b0 a0--u0 u0--b0
class color1: a0 b0 a1 b1
class color2: u0 u1
class color3: m
```

::: step
Suppose $\chi(G_{k+1}) \le k$. A colouring need not use all its colours, so $G_{k+1}$ has a
proper colouring $c$ with the colours 1 to $k$. Renaming two colours keeps it proper, so we may
assume that [[fig:t08-myc-lower#m|$m$]] has colour $k$.
:::

::: step
Every vertex $v_1$ of [[fig:t08-myc-lower#row1|row 1]] is adjacent to $m$. The colouring $c$ is
proper, so no vertex of row 1 has colour $k$.
:::

::: step
Take a vertex [[fig:t08-myc-lower#u0|$u_0$]] of colour $k$. A neighbour $w_0$ of it in row 0
comes from an edge $uw$ of $G_k$. For this edge the construction also joined $u_1$ to $w_0$. So
[[fig:t08-myc-lower#w|no such neighbour]] has the colour of $u_1$. Here the neighbours are the
two other vertices of row 0.
:::

::: step
We give every $u_0$ of colour $k$ the colour of $u_1$, all at once. Row 0 stays proper. Every
unchanged neighbour avoids the new colour, by the last step. Two changed vertices both had
colour $k$, so they are not adjacent. In the picture both copies of $u$ now have the same filling.
:::

::: step
Row 0 no longer uses colour $k$: the new colours come from row 1, which avoids $k$. So
[[fig:t08-myc-lower#row0|row 0]], a copy of $G_k$, has a proper colouring with $k - 1$
colours. This contradicts $\chi(G_k) = k$, the induction hypothesis.
:::

::: step
So $\chi(G_{k+1}) \ge k + 1$, and with the colouring of the previous walkthrough,
$\chi(G_{k+1}) = k + 1$. With no triangle, $G_{k+1}$ is the graph the theorem asks for at
$k + 1$, and the induction is complete. Here 3 colours are needed.
:::
::::

::: proof {for=thm:mycielski}
<!-- REVIEW: the board starts at G_3 := C_5, so k = 0, 1, 2 (N includes 0 on this site) are not covered. The first sentence covers them with K_k. -->
For $k \le 2$ take $G_k := K_k$: it has at most one edge, hence no triangle, and
$\chi(K_k) = k$ (for $k = 0$, $K_0$ is the empty graph).

For $k \ge 3$: $G_3 := C_5$, then induction by $k$. $C_5$ has no triangle, since the two
neighbours of each vertex are not adjacent. It is an odd cycle, so $\chi(C_5) \ge 3$ by
[[prop:two-colourable]], and the colours $1, 2, 1, 2, 3$ around the cycle are proper, so
$\chi(C_5) = 3$.

So, let $G_k$ have no triangle and $\chi(G_k) = k$, and construct $G_{k+1}$ as follows:
$$V(G_{k+1}) := \big(V(G_k) \times \set{0, 1}\big) \cup \set{m},$$
$$E(G_{k+1}) := \Big\{ \set{(u,0),(v,0)},\ \set{(u,1),(v,0)},\ \set{(u,0),(v,1)} : uv \in E(G_k) \Big\} \cup \Big\{ \set{m,(v,1)} : v \in V(G_k) \Big\}.$$

Then $K_3 \not\subseteq G_{k+1}$ (if $K_3 \not\subseteq G_k$): no edge joins two vertices
$(u,1), (v,1)$, so a triangle has at most one vertex in $V(G_k) \times \set{1}$, and $m$, whose
neighbours all lie there, is in no triangle. A triangle in $V(G_k) \times \set{0}$ would give a
triangle in $G_k$. A triangle $(u,1), (v,0), (w,0)$ would give edges $uv, uw, vw \in E(G_k)$,
again a triangle in $G_k$.

And $\chi(G_{k+1}) \le k+1$: take a proper colouring $c_k$ of $G_k$ with colours
$1, \dots, k$, give $(v,0)$ and $(v,1)$ the colour $c_k(v)$, and give $m$ the colour $k+1$.
Every edge within $V(G_k) \times \set{0,1}$ joins $(u,i)$ and $(v,j)$ with $uv \in E(G_k)$, so
its ends get $c_k(u) \ne c_k(v)$; the neighbours of $m$ get colours $\le k$.

Assume, for a contradiction, that $\chi(G_{k+1}) \le k$, and take a proper $k$-colouring $c$ of
$G_{k+1}$, where $c(m) = k$ (after renaming colours). So $c((v,1)) \ne k$ for $v \in V(G_k)$,
since $(v,1)$ is adjacent to $m$. For any $u \in V(G_k)$ s.t. $c((u,0)) = k$ we observe that no
neighbour $(w,0)$ of $(u,0)$ can get colour $c((u,1))$, since $uw \in E(G_k)$ and so
$(u,1)(w,0) \in E(G_{k+1})$. Thus we can change the colour of $(u,0)$ to $c((u,1))$, for all
such $u$ at once (two vertices $(u,0)$ of colour $k$ are not adjacent). Then
$u \mapsto c((u,0))$ is a proper colouring of $G_k$ with colours $1, \dots, k-1$, and so $G_k$ is
$(k-1)$-colourable, a contradiction. Hence $\chi(G_{k+1}) = k+1$.
:::

## Check yourself

:::: quiz {#q:t08-mycielski-size}
The construction is applied to $G_3 = C_5$, with 5 vertices and 5 edges. How many vertices
does $G_4$ have?

- [ ] 10
- [x] 11
- [ ] 15

::: explanation
Every vertex of $C_5$ gets two copies, one in each row, and $m$ is one new vertex:
$2 \cdot 5 + 1 = 11$. This is the graph at the top of the page. It has $5 + 10 + 5 = 20$
edges: 5 in row 0, two for each edge of $C_5$ between the rows, and 5 at $m$.
:::
::::

:::: quiz {#q:t08-mycielski-recolour}
In the proof by contradiction, $u_0$ has colour $k$. Why may it take the colour of $u_1$?

- [ ] Because the two copies of $u$ are adjacent.
- [x] Because every neighbour of $u_0$ in row 0 is also a neighbour of $u_1$.
- [ ] Because $u_1$ has colour $k$ too.

::: explanation
For an edge $uw$ of $G_k$ the construction joins $u_0$ to $w_0$ and also $u_1$ to $w_0$. So
$w_0$ has a colour different from that of $u_1$. The vertices $u_0$ and $u_1$ are not adjacent,
and $u_1$ cannot have colour $k$, because it is adjacent to $m$.
:::
::::
