---
title: "Dirac's and Ore's theorem"
course: theory
chapter: hamiltonian
order: 2
lectures: [t04]
stage: split
status: reviewed
---

Unlike Euler tours (which traverse every *edge* once and have a simple characterisation), deciding whether a
graph is Hamiltonian is NP-complete. So we look for **sufficient** conditions. Intuitively, a graph with many
edges should be Hamiltonian.

::: definition {#def:minimum-degree title="Minimum degree" defines="minimum degree, δ(G)" source="theory/2026-10-06 p5"}
The **minimum degree** of a graph $G$ with at least one vertex is $\delta(G) := \min_{v \in V(G)} d_G(v)$.
<!-- REVIEW: was prose ("We write δ(G) for the minimum degree of G"); made a definition so that search finds it. -->
:::

::: intuition
$\delta(G) \ge k$ says that **every** vertex has at least $k$ [[def:adjacent|neighbours]], a uniform lower bound on the
[[def:degree|degrees]]. Examples: $\delta(C_n) = 2$, $\delta(K_n) = n - 1$, $\delta(K_{m,n}) = \min(m, n)$. A graph with an
isolated vertex has $\delta = 0$, however many edges the rest has.
:::

```graph id=t04-minimum-degree-example widget=figure
caption: Left, $K_4$ minus the edge $cd$ has $\delta = 2$, reached by $c$ and $d$. Right, $K_4$ plus an isolated vertex $e$ has $\delta = 0$ although six of its edges form a complete graph.
intent: New figure. Example and non-example for the minimum degree; labels show the degrees, the yellow vertices reach the minimum.
layout: fixed
vertex-label: "{id}: {d}"
panel: $\delta = 2$
a [d=3] @(1, 1); b [d=3] @(1, 0); c [d=2 class=current] @(0, 0.5); d [d=2 class=current] @(2, 0.5)
a -- b; a -- c; b -- c; a -- d; b -- d
panel: $\delta = 0$
a [d=3] @(0, 1); b [d=3] @(1, 1); c [d=3] @(0, 0); d [d=3] @(1, 0); e [d=0 class=current] @(2, 0.5)
a -- b; a -- c; a -- d; b -- c; b -- d; c -- d
```

::: theorem {#thm:dirac-ore title="Dirac's and Ore's theorem" source="theory/2026-10-06 p5"}
Let $G$ be a graph with $n = \abs{V(G)} \ge 3$ vertices, and assume

a) **(Dirac)** $\delta(G) \ge \frac{1}{2}\abs{V(G)}$, or

b) **(Ore)** for all $u \ne v \in V(G)$: $uv \notin E(G) \implies d_G(u) + d_G(v) \ge \abs{V(G)}$.

Then $G$ is Hamiltonian.
:::

The lecture states this without proof.

::: intuition
If every vertex has many neighbours, there is no bottleneck that a round trip could get stuck at. The proof keeps adding
edges between non-adjacent pairs whose degrees sum to at least $n$; such an edge can always be "rerouted" around
([[lem:hamiltonian-completion]]), until the graph is $K_n$. Example: $K_{k,k}$ ($k \ge 2$) has $\delta = k = n/2$, so it is
Hamiltonian by Dirac. Ore is more flexible: add to $K_4$ a vertex $w$ adjacent to two of its vertices. Then $n = 5$ and $d_G(w) = 2 < 5/2$, so
Dirac fails, but each non-adjacent pair is $w$ and a vertex of degree $3$, with degree sum $5 \ge n$.
:::

```graph id=t04-ore-example widget=figure
caption: $K_4$ on $a, b, c, d$ plus a vertex $w$ adjacent to $a$ and $b$. Here $n = 5$ and $d(w) = 2 < \frac{5}{2}$, so Dirac fails. The non-adjacent pairs $wc$ and $wd$ have degree sum $5 \ge n$, so Ore applies; the green edges are a Hamiltonian cycle.
intent: New figure. The Ore example of the intuition block: Dirac fails at the yellow vertex, Ore holds, and a Hamiltonian cycle exists.
layout: fixed
vertex-label: "{id}: {d}"
w [d=2 class=current] @(0, 0.5); a [d=4] @(1, 1); b [d=4] @(1, 0); c [d=3] @(2, 1); d [d=3] @(2, 0)
w -- a [class=cycle]; w -- b [class=cycle]; a -- b; a -- c [class=cycle]; a -- d; b -- c; b -- d [class=cycle]; c -- d [class=cycle]
```

::: pitfall
Both conditions are **sufficient, not necessary**. The cycle $C_n$ ($n \ge 5$) is Hamiltonian although $\delta(C_n) = 2 < n/2$
and non-adjacent degree sums are $4 < n$. So failing Dirac's or Ore's condition says nothing (see also the [[theory/04-chordal-hamiltonian|Petersen quiz on the lecture page]]).
<!-- REVIEW: the quiz q:t04-petersen-ore lives on the lecture page, not here; the link replaces "below". -->
Ore's condition is required only for **non-adjacent** pairs.
:::

The assumption $n \ge 3$ is needed: $K_2$ satisfies both conditions but has no cycle at all. Dirac's condition
implies Ore's (if every [[def:degree|degree]] is at least $n/2$, every two degrees sum to at least $n$). The bound is **tight**:

::: example {#ex:dirac-tight title="The bound $n/2$ is tight" source="theory/2026-10-06 p5"}
$K_{k, k+1}$ has $n = 2k + 1$ vertices and minimum degree $k = \frac{n-1}{2}$, just below $\frac{n}{2}$. It is not
Hamiltonian: a cycle in a [[def:bipartite|bipartite]] graph alternates between the two sides, so it has as many vertices on each
side, while a Hamiltonian cycle would have to contain all $k$ vertices of one side and all $k + 1$ of the other.
:::

```graph id=t04-dirac-tight widget=figure
caption: $K_{3,4}$: minimum degree $3 = \frac{n-1}{2}$, and no Hamiltonian cycle.
intent: Tightness example from the lecture.
height: small
use: K(3,4)
```
