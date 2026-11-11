---
title: "Hamiltonian completion"
course: theory
chapter: hamiltonian
order: 3
lectures: [t04]
stage: split
status: draft
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
x -- w3 [bend=0.5]; x -- wj1 [bend=0.6]; wj -- y [bend=-0.6]; w2 -- y [bend=-0.7]
step: A Hamiltonian path from $x$ to $y$ in $H_1$; $xy$ is not an edge.
step: Black: the neighbours of $y$, i.e. $w_2$, $w_j$ and $w_6$.
class color1: w2 wj w6
step: Red: the predecessors of the neighbours $w_2, w_3, w_{j+1}$ of $x$, i.e. $x$, $w_2$ and $w_j$.
class color2: x w2 wj
step: $w_j$ is both black and red (and so is $w_2$): $w_j y \in E$ and $x w_{j+1} \in E$.
class current: wj
class highlight: wj--y x--wj1
step: The Hamiltonian cycle $x, w_2, w_3, w_j, y, w_6, w_{j+1}, x$.
unclass path: wj--wj1
class cycle: x--w2 w2--w3 w3--wj wj--y y--w6 w6--wj1 wj1--x
```

::: proof {title="Proof of the theorem" for=thm:dirac-ore}
As noted, a) implies b), so assume b). We show that $K_n$ is a Hamiltonian completion of $G$. Starting from
$H = G$, as long as $H \ne K_n$, pick any non-adjacent pair $u, v$ of $H$. They are non-adjacent in $G$ as well, so
$d_H(u) + d_H(v) \ge d_G(u) + d_G(v) \ge n$ by b), and $H + uv$ is a one-step Hamiltonian completion of $H$. After
finitely many steps we reach $K_n$, which is Hamiltonian for $n \ge 3$. By [[lem:hamiltonian-completion]], $G$ is
Hamiltonian.
:::

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
