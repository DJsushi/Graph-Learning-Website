---
title: "Hamiltonian completion"
course: theory
chapter: hamiltonian
order: 3
lectures: [t04]
stage: split
status: reviewed
---

The proof works by adding edges that do not change Hamiltonicity.

::: definition {#def:hamiltonian-completion title="Hamiltonian completion" defines="Hamiltonian completion, closure" source="theory/2026-10-06 p6"}
If $u \ne v \in V(G)$, $uv \notin E(G)$, and $d_G(u) + d_G(v) \ge \abs{V(G)}$, then the graph $G + uv$ is called a
**(one-step) Hamiltonian completion** of $G$. In general, $H$ is a **Hamiltonian completion** of $G$ if $H$ is
obtained from $G$ by any sequence of one-step Hamiltonian completions. A Hamiltonian completion to which no further
one-step completion applies is called the **closure** of $G$.
<!-- REVIEW: closure sentence added (it is in `defines`; not in the lecture). It is well defined by the argument in the remark at the end of this section. -->
:::

::: intuition
A completion step adds only edges that are "safe": an edge whose endpoints have degree sum at least $n$
can be rerouted out of any Hamiltonian cycle ([[lem:hamiltonian-completion]]). Example: in the path $P_3 = (a, b, c, d)$ with
$n = 4$, the pair $a, d$ has degree sum $2 < 4$, so $ad$ may **not** be added, and rightly so: $P_3$ is not Hamiltonian, while $P_3 + ad = C_4$ is.
:::

```graph id=t04-completion-closure widget=stepper
caption: Completing a graph $G$ with $n = 5$. The pair $b, y$ fails at the start and passes after two other steps. The closure is $K_5$.
intent: New. The lecture (theory/2026-10-06 p6) only sketches $G$ with the added edges. This shows single steps, a pair that fails first and passes later, and the closure.
layout: fixed
b @(0, 0.9); x @(1, 0); c @(2.2, 0); y @(3.2, 0.9); a @(1.6, 1.6)
a -- b -- x -- c -- y -- a; a -- x; a -- c
step: $b, y$: degree sum $2 + 2 = 4 < 5$. We may not add $by$ yet.
class rejected: b y
step: $b, c$: degree sum $2 + 3 = 5$. We add $bc$.
unclass rejected: b y
class current: b c
b -- c [class=highlight]
step: $x, y$: degree sum $3 + 2 = 5$ in the current graph. We add $xy$.
unclass current: b c
class current: x y
x -- y [class=highlight]
step: $b, y$ again: now $3 + 3 = 6 \ge 5$. We add $by$.
unclass current: x y
class current: b y
b -- y [class=highlight]
step: No non-adjacent pair is left: the closure is $K_5$.
unclass current: b y
```

Note that each step uses the degrees in the *current* graph, which only grow as edges are added.

::: pitfall
The threshold is $n = \abs{V(G)}$, the number of vertices, not $n - 1$ or the number of edges, and the degrees are those of
the current graph. A pair that fails the test now may pass later, after other steps have raised its degrees; so to
compute the closure, keep re-checking all non-adjacent pairs until none qualifies.
:::

::: lemma {#lem:hamiltonian-completion title="Completions preserve Hamiltonicity" source="theory/2026-10-06 p6, p5"}
If $H$ is a [[def:hamiltonian-completion|Hamiltonian completion]] of $G$, then $H$ is Hamiltonian $\iff$ $G$ is Hamiltonian.
:::

::: intuition
Adding edges can only help, so one direction is free. For the other, suppose the new edge $xy$ is used by a Hamiltonian cycle.
Removing it leaves a Hamiltonian path from $x$ to $y$, and since the degrees of $x$ and $y$ sum to at least $n$ on a path of
$n$ vertices, by pigeonhole some neighbour of $y$ is followed on the path by a neighbour of $x$; that lets us close the path into a cycle
without $xy$ (the figure below). Example: $C_4 = (a, b, c, d)$ plus the [[def:chordal|chord]] $ac$ is a completion of $C_4$ (as $d_{C_4}(a) + d_{C_4}(c) = 4$),
and both are Hamiltonian.
:::

The direction ($\Leftarrow$) is a direct argument: a cycle of a graph is also a cycle of every larger graph on the same vertices.

:::: walkthrough {for=lem:hamiltonian-completion}
```graph id=t04-completion-easy widget=stepper
caption: A graph $G$ on $7$ vertices with a Hamiltonian cycle $C$, and the completion $H = G + xy$. The same cycle is Hamiltonian in $H$.
intent: New. The lecture (theory/2026-10-06 p6) calls this direction trivial and draws nothing for it. Same vertices and layout as the figures of the other direction, which follow the lecture's drawing of $H_1$.
layout: fixed
x @(0, 1.3); w2 [label="$w_2$"] @(0.15, 0.45); w3 [label="$w_3$"] @(0.9, 0); wj [label="$w_j$"] @(1.8, -0.15); wj1 [label="$w_{j+1}$"] @(2.7, 0); w6 [label="$w_6$"] @(3.45, 0.45); y @(3.6, 1.3)
x -- w2 -- w3 -- wj -- wj1 -- w6 -- y; x -- w3; x -- wj1; x -- w6; w2 -- y; wj -- y
mark C: x--w3 w3--w2 w2--y y--wj wj--wj1 wj1--w6 w6--x
step: A Hamiltonian cycle $C$ of $G$.
class cycle: x--w3 w3--w2 w2--y y--wj wj--wj1 wj1--w6 w6--x
step: $H = G + xy$: the same vertices, one more edge. $C$ is still there.
x -- y [class=highlight]
```

::: step
Assume $G$ is Hamiltonian, and let $C$ be a Hamiltonian cycle of $G$: a cycle that passes through every vertex of $G$. Here: [[fig:t04-completion-easy#C|$C$]] is $x$, $w_3$, $w_2$, $y$, $w_j$, $w_{j+1}$, $w_6$ and back to $x$, through all $7$ vertices.
:::

::: step
A completion only adds edges; it never adds or removes a vertex. So $G \subseteq H$ and both have the same vertices. Every edge of $C$ is an edge of $H$, and $C$ passes through every vertex of $H$. So $C$ is a Hamiltonian cycle of $H$. This direction does not use the degree condition.
:::
::::

The direction ($\Rightarrow$) is an induction on the number of completion steps. Its first part reduces the claim to a single step.

:::: walkthrough {for=lem:hamiltonian-completion}
```graph id=t04-completion-induction widget=stepper
caption: Two completion steps lead from $G$ to $H$: first $bc$, then $xy$. The graph between them is $H_1$.
intent: New. The lecture (theory/2026-10-06 p6) writes $H := H_1 + xy$ and draws no sequence. Same graph as the closure figure above.
layout: fixed
b @(0, 0.9); x @(1, 0); c @(2.2, 0); y @(3.2, 0.9); a @(1.6, 1.6)
a -- b -- x -- c -- y -- a; a -- x; a -- c
step: $G$, before any completion step.
step: The steps before the last one give $H_1 = G + bc$.
b -- c [class=color1]
mark H1: a b c x y a--b b--x x--c c--y y--a a--x a--c b--c
step: The last step adds $xy$ to $H_1$ and gives $H$.
x -- y [class=highlight]
class current: x y
mark xy: x--y
step: If $H_1$ is Hamiltonian, then so is $G$, by induction.
unclass current: x y
class dashed: x--y
step: It remains: if $H$ is Hamiltonian, then so is $H_1$.
unclass dashed: x--y
class current: x y
```

::: step
We show by induction on the number of one-step completions from $G$ to $H$: if $H$ is Hamiltonian, then so is $G$. With zero steps, $H$ is $G$ itself, and there is nothing to prove. Here: two steps.
:::

::: step
Now let there be at least one step. All steps but the last one turn $G$ into a graph $H_1$. It is a Hamiltonian completion of $G$ with one step fewer. Here: [[fig:t04-completion-induction#H1|$H_1$]] is $G$ plus $bc$. This step is allowed: $b$ and $c$ have degrees $2$ and $3$ in $G$, sum $5$, and $n$ is $5$.
:::

::: step
The last step adds an edge $xy$ to $H_1$, and $H$ is the result. By the definition of a one-step completion, this edge is not in $H_1$, and $d_{H_1}(x) + d_{H_1}(y) \ge n$. Here: [[fig:t04-completion-induction#xy|the new edge]] joins $x$ and $y$, with degrees $3$ and $2$ in $H_1$, sum $5$.
:::

::: step
Suppose $H_1$ is Hamiltonian. It is a completion of $G$ with fewer steps than $H$, so the induction hypothesis applies to it: $G$ is Hamiltonian.
:::

::: step
So it is enough to prove one claim: if $H$ is Hamiltonian, then so is $H_1$. This claim is about a single step. Its proof, in the next two walkthroughs, is where the degree condition of that step is used.
:::
::::

The claim is proved by cases: a Hamiltonian cycle of $H$ either avoids the new edge $xy$ or uses it. The first case needs no work.

:::: walkthrough {for=lem:hamiltonian-completion}
```graph id=t04-completion-avoid widget=stepper
caption: $H = H_1 + xy$ on $7$ vertices, and a Hamiltonian cycle $C$ of $H$ that avoids $xy$. It is also a Hamiltonian cycle of $H_1$.
intent: New. The lecture (theory/2026-10-06 p6) settles this case in half a line. Same graph and layout as the next figure.
layout: fixed
x @(0, 1.3); w2 [label="$w_2$"] @(0.15, 0.45); w3 [label="$w_3$"] @(0.9, 0); wj [label="$w_j$"] @(1.8, -0.15); wj1 [label="$w_{j+1}$"] @(2.7, 0); w6 [label="$w_6$"] @(3.45, 0.45); y @(3.6, 1.3)
x -- w2 -- w3 -- wj -- wj1 -- w6 -- y; x -- w3; x -- wj1; x -- w6; w2 -- y; wj -- y
x -- y [class=highlight]
mark C: x--w6 w6--y y--w2 w2--w3 w3--wj wj--wj1 wj1--x
step: A Hamiltonian cycle $C$ of $H$ that does not use $xy$.
class cycle: x--w6 w6--y y--w2 w2--w3 w3--wj wj--wj1 wj1--x
step: Delete $xy$: $C$ lies in $H_1$.
remove x--y
```

::: step
Let $C$ be a Hamiltonian cycle of $H$. In the first case, $C$ does not use the edge $xy$. Here: [[fig:t04-completion-avoid#C|$C$]] is $x$, $w_6$, $y$, $w_2$, $w_3$, $w_j$, $w_{j+1}$ and back to $x$.
:::

::: step
$H$ and $H_1$ differ only in the edge $xy$. Every edge of $C$ is an edge of $H$ other than $xy$, so it is an edge of $H_1$. And $H_1$ has the same vertices as $H$. So $C$ is a Hamiltonian cycle of $H_1$, and we are done.
:::
::::

The second case is the heart of the proof: a count with the pigeonhole principle, and then a switch of two edges.

:::: walkthrough {for=lem:hamiltonian-completion}
```graph id=t04-completion-switch widget=stepper
caption: $H = H_1 + xy$ on $7$ vertices, with $d_{H_1}(x) + d_{H_1}(y) = 4 + 3 = 7$. Black vertices are filled, red ones have a red ring; $w_2$ and $w_j$ get both.
intent: From the lecture (theory/2026-10-06 p6): the drawing of $H_1$ with $x$ and $y$ on top, the path below, and the black and red circles. The lecture names the double-coloured vertex $u$ and its successor $v$; we use the proof's $w_j$ and $w_{j+1}$, and the vertex names of the figure after the proof.
layout: fixed
x @(0, 1.3); w2 [label="$w_2$"] @(0.15, 0.45); w3 [label="$w_3$"] @(0.9, 0); wj [label="$w_j$"] @(1.8, -0.15); wj1 [label="$w_{j+1}$"] @(2.7, 0); w6 [label="$w_6$"] @(3.45, 0.45); y @(3.6, 1.3)
x -- w2 -- w3 -- wj -- wj1 -- w6 -- y; x -- w3; x -- wj1; x -- w6; w2 -- y; wj -- y
x -- y
mark C: x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y x--y
mark P: x w2 w3 wj wj1 w6 y x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y
mark black: w2 wj w6
mark red: x w2 wj wj1
mark both: w2 wj
mark jumps: wj--y x--wj1
mark new: x--w2 w2--w3 w3--wj wj--y y--w6 w6--wj1 wj1--x
step: A Hamiltonian cycle $C$ of $H$ that uses $xy$.
class cycle: x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y x--y
step: Delete $xy$: a Hamiltonian path of $H_1$ from $x$ to $y$.
remove x--y
unclass cycle: x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y
class path: x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y
step: Black (filled): the neighbours $w_2, w_j, w_6$ of $y$.
class color1: w2 wj w6
step: Red (ring): $x, w_2, w_j, w_{j+1}$, each just before a neighbour of $x$.
class rejected: x w2 wj wj1
step: $7$ colourings on $6$ vertices: $w_2$ and $w_j$ are black and red.
class muted: x w3 wj1 w6 y
step: For $w_j$: the edges $w_j y$ and $x w_{j+1}$.
unclass muted: x w3 wj1 w6 y
class highlight: wj--y x--wj1
step: The Hamiltonian cycle $x, w_2, w_3, w_j, y, w_6, w_{j+1}, x$ of $H_1$.
unclass path: x--w2 w2--w3 w3--wj wj--wj1 wj1--w6 w6--y
unclass highlight: wj--y x--wj1
class cycle: x--w2 w2--w3 w3--wj wj--y y--w6 w6--wj1 wj1--x
class dashed: wj--wj1
```

::: step
In the second case, $C$ uses the edge $xy$. Here: [[fig:t04-completion-switch#C|$C$]] is $x$, $w_2$, $w_3$, $w_j$, $w_{j+1}$, $w_6$, $y$ and back to $x$ along that edge.
:::

::: step
Delete $xy$ from $C$. What is left still passes through all $n$ vertices and runs from $x$ to $y$: a Hamiltonian path. Its edges are edges of $H$ other than $xy$, so they lie in $H_1$. We number [[fig:t04-completion-switch#P|the path]] $w_1$ to $w_n$, with $x$ as $w_1$ and $y$ as $w_n$. Here: $n$ is $7$, and $w_j$ is $w_4$.
:::

::: step
Colour **black** every neighbour of $y$ in $H_1$; there are $d_{H_1}(y)$ of them. None is $y$ itself, and none is $x$, because $xy$ is not an edge of $H_1$. So all black vertices lie among $w_2$ to $w_{n-1}$. Here: [[fig:t04-completion-switch#black|$w_2$, $w_j$ and $w_6$]], so $3$.
:::

::: step
Colour **red** each vertex $w_{i-1}$ whose successor $w_i$ is a neighbour of $x$. The neighbours of $x$ are neither $x$ nor $y$, so they lie among $w_2$ to $w_{n-1}$. Different neighbours give different red vertices: there are $d_{H_1}(x)$ of them, among $w_1$ to $w_{n-2}$. Here: [[fig:t04-completion-switch#red|$x$, $w_2$, $w_j$, $w_{j+1}$]], so $4$.
:::

::: step
Neither colour reaches $y$, so all colourings fall on the $n - 1$ vertices $w_1$ to $w_{n-1}$. The degree condition of the last step gives $d_{H_1}(x) + d_{H_1}(y) \ge n$ colourings. A vertex gets at most one of each colour. So, by the pigeonhole principle, some vertex is black and red. Here: $7$ against $6$; [[fig:t04-completion-switch#both|$w_2$ and $w_j$]].
:::

::: step
Call such a vertex $w_j$. Black means that $w_j y$ is an edge of $H_1$. Red means that its successor $w_{j+1}$ is a neighbour of $x$, so $x w_{j+1}$ is an edge of $H_1$. Here: we take $w_j$, the fourth vertex, with [[fig:t04-completion-switch#jumps|these two edges]]; $w_2$ would work too.
:::

::: step
Walk along the path from $x$ to $w_j$, jump to $y$, walk back along the path to $w_{j+1}$, and jump back to $x$. This visits $w_1$ to $w_j$, then $w_n$ down to $w_{j+1}$: every vertex once. Its edges are path edges and the two edges above, all in $H_1$. So [[fig:t04-completion-switch#new|this cycle]] is Hamiltonian in $H_1$.
:::
::::

:::: proof
($\Leftarrow$) is trivial: a Hamiltonian cycle of $G$ is also one of $H \supseteq G$ (same vertex set).

($\Rightarrow$) By induction on the number of completion steps; zero steps is trivial. Let $H := H_1 + xy$ be the
last step, where $H_1$ is a Hamiltonian completion of $G$ (with fewer steps), $xy \notin E(H_1)$, and
$d_{H_1}(x) + d_{H_1}(y) \ge n$. If $H_1$ is Hamiltonian, then so is $G$ by induction. So it remains to show:
**if $H$ is Hamiltonian, then so is $H_1$.**

Let $C \subseteq H$ be a Hamiltonian cycle. If $xy \notin E(C)$, then $C \subseteq H_1$ and we are done. Otherwise
$C - xy$ is a Hamiltonian path in $H_1$ from $x$ to $y$; write it as
$$x = w_1, w_2, \dots, w_n = y.$$

- Colour **black** every neighbour of $y$ (in $H_1$). These are among $w_2, \dots, w_{n-1}$ (as $xy \notin E(H_1)$), so
  there are $d_{H_1}(y)$ black vertices, all in $\set{w_1, \dots, w_{n-1}}$.
- Colour **red** every vertex $w_{i-1}$ whose successor $w_i$ (on the path, towards $y$) is a neighbour of $x$; i.e. the
  predecessors (towards $x$) of the neighbours of $x$. The neighbours of $x$ are among $w_2, \dots, w_{n-1}$, so the
  red vertices are among $w_1, \dots, w_{n-2}$, and there are $d_{H_1}(x)$ of them.

So the vertex $y = w_n$ has no colour, and the $d_{H_1}(x) + d_{H_1}(y) \ge n$ colourings fall into the $n - 1$
vertices $w_1, \dots, w_{n-1}$. By the pigeonhole principle **some vertex is black and red**, say $w_j$. That means
$w_j y \in E(H_1)$ and $x w_{j+1} \in E(H_1)$. Now
$$(x = w_1, w_2, \dots, w_j, \; y = w_n, w_{n-1}, \dots, w_{j+1}, \; x)$$
is a Hamiltonian cycle in $H_1$: it follows the path from $x$ to $w_j$, jumps to $y$, goes back along the path to
$w_{j+1}$, and jumps back to $x$.
::::

```graph id=t04-hamiltonian-switch widget=stepper
caption: The key step: a Hamiltonian path from $x$ to $y$ and a vertex $w_j$ adjacent to $y$ whose successor $w_{j+1}$ is adjacent to $x$ give a Hamiltonian cycle.
intent: Visualise the black/red colouring argument and the resulting cycle.
layout: fixed
x [label="$x = w_1$"] @(0, 0); w2 [label="$w_2$"] @(1, 0); w3 [label="$w_3$"] @(2, 0); wj [label="$w_j$"] @(3, 0); wj1 [label="$w_{j+1}$"] @(4, 0); w6 [label="$w_6$"] @(5, 0); y [label="$y = w_7$"] @(6, 0)
x -- w2 -- w3 -- wj -- wj1 -- w6 -- y [class=path]
x -- w3 [bend=0.5]; x -- wj1 [bend=0.6]; wj -- y [bend=-0.6]; w2 -- y [bend=-0.7]; w3 -- y [bend=-0.65]
step: A Hamiltonian path from $x$ to $y$ in $H_1$; $xy$ is not an edge.
step: Black: the neighbours of $y$, i.e. $w_2$, $w_3$, $w_j$ and $w_6$.
class color1: w2 w3 wj w6
step: Red: the predecessors of the neighbours $w_2, w_3, w_{j+1}$ of $x$, i.e. $x$, $w_2$ and $w_j$.
class color2: x w2 wj
step: $w_j$ is both black and red (and so is $w_2$): $w_j y \in E$ and $x w_{j+1} \in E$.
class current: wj
class highlight: wj--y x--wj1
step: The Hamiltonian cycle $x, w_2, w_3, w_j, y, w_6, w_{j+1}, x$.
unclass path: wj--wj1
class cycle: x--w2 w2--w3 w3--wj wj--y y--w6 w6--wj1 wj1--x
```
<!-- REVIEW: added the edge w3--y so that d(x) + d(y) = 3 + 4 = 7 = n; before, the sum was 6 < 7 and the figure broke the lemma's hypothesis. -->

::: remark
The graph obtained by adding edges as long as possible (it does not depend on the order) is the
**Bondy–Chvátal closure** of $G$. The lemma shows: $G$ is Hamiltonian iff its closure is. Dirac's and Ore's conditions
are special cases in which the closure is complete; the closure can be complete also when neither condition holds.
<!-- REVIEW: "Dirac and Ore are the cases where the closure is complete" overstated it (complete closure is strictly more general). -->

*Why the order does not matter* (not in the lecture). Let $H$ and $H'$ be obtained from $G$ by two sequences of one-step
completions that cannot be continued, and let $e_1, \dots, e_s$ be the edges added on the way to $H'$, in order. We show
$e_i \in E(H)$ by induction on $i$. If $e_1, \dots, e_{i-1} \in E(H)$, then the graph $G + e_1 + \dots + e_{i-1}$, in which
$e_i = uv$ was added, is a [[def:subgraph|subgraph]] of $H$ on the same vertices, so $d_H(u) + d_H(v) \ge n$. If $uv \notin E(H)$, then $H + uv$
would be a further one-step completion of $H$, which is impossible. Hence $E(H') \subseteq E(H)$, and by symmetry $H = H'$.
<!-- REVIEW: added the standard order-independence argument for the closure (W t04). -->

:::
