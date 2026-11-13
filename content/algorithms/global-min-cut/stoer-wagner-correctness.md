---
title: "Why Stoer–Wagner works"
course: algorithms
chapter: global-min-cut
order: 3
lectures: [a03]
stage: split
status: reviewed
---

### Correctness

::: theorem {#thm:mincut-phase title="The cut of the phase" source="algorithms/03 p38–39"}
If $\textsf{MINCUTPHASE}(G, c) = (s, t)$, then $\delta(t)$ is a minimum $s$–$t$ cut of $G$.
:::

Let $v_1, \dots, v_n$ be the order in which the vertices were added to $U$ during $\textsf{MINCUTPHASE}$ (so $s = v_{n-1}$, $t = v_n$), and fix any
$s$–$t$ cut $C$ of $G$. A vertex $v = v_i$ ($i \ge 2$) is **active** (with respect to $C$) if $v_{i-1}$ and $v_i$ lie on different sides of $C$. For an
active vertex $v = v_i$ let $U_v = \set{v_1, \dots, v_{i-1}}$, and let $C_v$ be the cut of the induced subgraph $G[U_v \cup \set{v}]$ induced by $C$
(the edges of $C$ with both ends in $U_v \cup \set{v}$).

The proof is an induction along the order in which $\textsf{MINCUTPHASE}$ adds the vertices, showing that each vertex that jumps across $C$ is paid for by edges of $C$; it has four parts: the set-up, the base case, the inductive step and the end.

Part 1, the set-up: the order, the cut $C$ and the active vertices.

:::: walkthrough {for=thm:mincut-phase}
```graph id=a03-sw-setup widget=stepper
caption: Phase 1 of the Stoer–Wagner algorithm on the lecture network; the numbers are capacities. From step 2 on, the dashed edges form the cut $C$, and its two sides are the filled and the plain vertices.
intent: Proof walkthrough, set-up of the proof. From the lecture: the network (algorithms/03 p5) and the order of phase 1 (a, b, f, c, e, d). New: the cut C (the proof on p38–39 has no example). The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, -0.05); b @(0.5, 0.75); c @(1.65, 0.7); d @(3.3, 0.3); e @(2.8, -0.75); f @(0.75, -0.65)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
mark s: e
mark t: d
mark C: a--f b--f b--c c--e f--e e--d
mark act: f e d
mark Ue: a b f c
mark Ce: a--f b--f b--c c--e f--e
mark dt: c--d f--d e--d
mark into: b--e c--e f--e
step: The order, and the pair $s$, $t$.
class path: e
class frontier: d
step: Any $s$–$t$ cut $C$.
unclass path: e
unclass frontier: d
class color1: a b e
class cut: a--f b--f b--c c--e f--e e--d
step: The active vertices.
class frontier: f e d
step: $U_v$ and $C_v$ for the active vertex $e$.
unclass frontier: f d
class muted: d c--d f--d e--d
step: $\delta(t)$ is an $s$–$t$ cut.
unclass muted: d c--d f--d e--d
unclass frontier: e
class frontier: d
class highlight: c--d f--d
step: The claim, for the vertex $e$.
unclass frontier: d
unclass highlight: c--d f--d
class frontier: e
class muted: d c--d f--d e--d
class highlight: b--e c--e f--e
```

::: step
Run $\textsf{MINCUTPHASE}$ ([[alg:stoer-wagner]]) and let $v_1, \dots, v_n$ be the order in which it adds the vertices to $U$. It returns the last two vertices, so [[fig:a03-sw-setup#s|$s$]] is $v_{n-1}$ and [[fig:a03-sw-setup#t|$t$]] is $v_n$. Here: the order is $a, b, f, c, e, d$, so $s = e$ and $t = d$.
:::

::: step
Fix any $s$–$t$ cut [[fig:a03-sw-setup#C|$C$]]: its edges separate $s$ from $t$ ([[def:undirected-cut]]). We make no special choice, so everything we show holds for every $s$–$t$ cut. Here: the filled vertices $a, b, e$ against the plain vertices $f, c, d$; $C$ has six edges, of total capacity $29$.
:::

::: step
A vertex $v_i$ with $i \ge 2$ is **active** if $v_{i-1}$ and $v_i$ lie on different sides of $C$: the order jumps across $C$ at $v_i$. Here: [[fig:a03-sw-setup#act|the active vertices]] are $f$ (after $b$), $e$ (after $c$) and $d$ (after $e$); $b$ and $c$ are not active, as each lies on the side of its predecessor.
:::

::: step
For an active vertex $v$, the set $U_v$ holds the vertices before $v$ in the order. The set $C_v$ holds the edges of $C$ with both ends in $U_v \cup \set{v}$. Here: for $e$, [[fig:a03-sw-setup#Ue|$U_e$]] is $a, b, f, c$, and [[fig:a03-sw-setup#Ce|$C_e$]] has five edges, of total capacity $22$; the edge $ed$ is left out, because $d$ comes later.
:::

::: step
Now the proof. [[fig:a03-sw-setup#dt|$\delta(t)$]] is an $s$–$t$ cut: it separates $t$ from every other vertex, so also from $s$. It remains to show that no $s$–$t$ cut is cheaper, that is, $c(\delta(t)) \le c(C)$ for our arbitrary $C$. Here: $\delta(d)$ has capacity $14$, and $C$ has capacity $29$.
:::

::: step
We prove it by a claim, by induction on the active vertices: for every active vertex $v$, $c(U_v, v) \le c(C_v)$. In words: the edges from the earlier vertices to $v$ weigh at most the edges of $C_v$. Here: for $e$, the three edges [[fig:a03-sw-setup#into|into $e$]] weigh $9$ in total, and $C_e$ has capacity $22$.
:::
::::

Part 2, the base case of the claim.

:::: walkthrough {for=thm:mincut-phase}
```graph id=a03-sw-base widget=stepper
caption: The same network and order as before. From step 2 on, the filled and the plain vertices are the two sides of an $s$–$t$ cut $C$, and dashed edges belong to $C$.
intent: Proof walkthrough, base case of the claim. New (the lecture proves it on p39 without an example); the network and the order of phase 1 are from the lecture (algorithms/03 p5). The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, -0.05); b @(0.5, 0.75); c @(1.65, 0.7); d @(3.3, 0.3); e @(2.8, -0.75); f @(0.75, -0.65)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
mark v: f
mark Uv: a b
mark inside: a--b
mark Cv: a--f b--f
step: The first active vertex $v$.
class frontier: f
class muted: c d e b--c b--e c--f c--e c--d f--e f--d e--d
step: All of $U_v$ is on one side.
class color1: a b e
step: Edges inside $U_v$ are not in $C$.
class rejected: a--b
step: $C_v$ is exactly the edges from $U_v$ to $v$.
class cut: a--f b--f
```

::: step
Let [[fig:a03-sw-base#v|$v$]] be the first active vertex, $v = v_i$. Its predecessor lies on the other side of $C$, and the vertices before $v$ are all inactive. We show that $c(U_v, v)$ equals $c(C_v)$. Here: $v$ is $f$, the third vertex, and [[fig:a03-sw-base#Uv|$U_v$]] is $a, b$; the faded vertices come after $f$.
:::

::: step
No vertex before $v$ is active, so $v_2$ lies on the side of $v_1$, $v_3$ on the side of $v_2$, and so on up to $v_{i-1}$. All of $U_v$ lies on one side of $C$. As $v$ is active, it lies on the other side. Here: $a$ and $b$ are filled, and $f$ is plain.
:::

::: step
An edge with both ends in $U_v$ has both ends on the same side, so it is not in $C$. Here: [[fig:a03-sw-base#inside|the edge $ab$]] is the only such edge, and it is not in $C$.
:::

::: step
So the edges of $C$ with both ends in $U_v \cup \set{v}$ are exactly the edges between $U_v$ and $v$, and each of them crosses from one side to the other. These edges form $C_v$ and weigh $c(U_v, v)$, so the two are equal. Here: [[fig:a03-sw-base#Cv|$C_v$]] is $af$ and $bf$, and both capacities are $11$.
:::
::::

Part 3, the inductive step of the claim.

:::: walkthrough {for=thm:mincut-phase}
```graph id=a03-sw-step widget=stepper
caption: The same network, order and cut $C$ as before: filled and plain vertices are the two sides, dashed edges belong to $C$.
intent: Proof walkthrough, inductive step of the claim. New (the lecture proves it on p39 without an example); the network and the order of phase 1 are from the lecture (algorithms/03 p5). The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, -0.05); b @(0.5, 0.75); c @(1.65, 0.7); d @(3.3, 0.3); e @(2.8, -0.75); f @(0.75, -0.65)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
class color1: a b e
mark v: f
mark u: e
mark Uv: a b
mark rest: f c
mark old: b--e
mark new: c--e f--e
mark Cv: a--f b--f
mark Cu: a--f b--f b--c c--e f--e
step: The active vertices $v$ and $u$.
class frontier: f
class path: e
class muted: d c--d f--d e--d
step: Split the edges into $u$.
class highlight: b--e
class bold: c--e f--e
step: The first part: $v$ was preferred to $u$.
class highlight: a--f b--f
class muted: c--e f--e
step: The first part is at most $c(C_v)$.
class cut: a--f b--f
step: The vertices between $v$ and $u$.
unclass muted: c--e f--e
class frontier: c
step: The edges of the second part cross $C$.
class cut: c--e f--e
step: $C_u$ contains $C_v$.
class cut: b--c
step: $C_u$ contains the second part too.
unclass frontier: c
step: The claim holds for $u$.
unclass frontier: c f
unclass path: e
class frontier: e
```

::: step
Assume the claim for all active vertices up to [[fig:a03-sw-step#v|$v$]], and let [[fig:a03-sw-step#u|$u$]] be the next active vertex. Here: $v$ is $f$, and both sides of its claim are $11$; $u$ is $e$; the vertex $c$ between them is not active; the faded vertex $d$ comes after $u$.
:::

::: step
The vertices of $U_u$ are those of $U_v$ and the rest, $U_u \setminus U_v$. So the edges from $U_u$ to $u$ split into the first part, from $U_v$, and the second part, from the rest: $c(U_u,u) = c(U_v,u) + c(U_u \setminus U_v,u)$. Here: [[fig:a03-sw-step#Uv|$U_v$]] is $a,b$, and [[fig:a03-sw-step#rest|the rest]] is $f,c$; the first part weighs $2$, the second $7$.
:::

::: step
First part. Just before $v$ was added, $U$ was exactly $U_v$, and $u$ was outside it, like $v$. The algorithm took $v$ because it was the most tightly connected vertex ([[def:tightly-connected]]), so $c(U_v, u) \le c(U_v, v)$. Here: when $f$ was added, the keys were $11$ for $f$ and $2$ for $e$.
:::

::: step
By the induction hypothesis, $c(U_v, v) \le c(C_v)$, so the first part is at most $c(C_v)$. Here: [[fig:a03-sw-step#Cv|$C_v$]] is $af$ and $bf$, and $2 \le 11 \le 11$.
:::

::: step
Second part. The rest is $v$ and the vertices added between $v$ and $u$. As $u$ is the next active vertex, only $v$ among them is active, so each lies on the side of its predecessor. By induction along the order, all of them lie on the side of $v$. Here: $c$ follows $f$ and is plain, like $f$.
:::

::: step
The vertex $u$ is active, so it lies on the other side than its predecessor, which is in the rest. The whole rest is on that side, by the last step. So every edge of the second part crosses $C$; both its ends lie in $U_u \cup \set{u}$, so it belongs to $C_u$. Here: [[fig:a03-sw-step#new|$ce$ and $fe$]] are dashed.
:::

::: step
Every edge of $C_v$ is in $C_u$, since $U_u \cup \set{u}$ contains $v$ and all of $U_v$. So $C_u$ contains $C_v$, and more. Here: $C_u$ is $C_v$ together with [[fig:a03-sw-step#new|$ce$ and $fe$]] and the edge $bc$.
:::

::: step
The edges of the second part are not in $C_v$: their end $u$ is neither in $U_v$ nor equal to $v$. So $C_u$ contains $C_v$ and the second part, with no edge twice. Capacities are positive, so together they weigh at most $c(C_u)$. Here: $11$ and $7$ give $18$, against $22$; the edge $bc$ adds the rest.
:::

::: step
Put the parts together: $c(U_u, u)$ is at most $c(C_v) + c(U_u \setminus U_v, u)$ by the first part, and this is at most $c(C_u)$ by the last step. So the claim holds for $u$, and the induction goes on with $u$ in the role of $v$. Here: $9 \le 18 \le 22$.
:::
::::

Part 4, the end of the proof: the claim for $t$.

:::: walkthrough {for=thm:mincut-phase}
```graph id=a03-sw-end widget=stepper
caption: The same network, order and cut $C$ as before: filled and plain vertices are the two sides, dashed edges belong to $C$.
intent: Proof walkthrough, end of the proof. New (the lecture ends the proof on p39 in one line without an example); the network and the order of phase 1 are from the lecture (algorithms/03 p5). The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, -0.05); b @(0.5, 0.75); c @(1.65, 0.7); d @(3.3, 0.3); e @(2.8, -0.75); f @(0.75, -0.65)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
class color1: a b e
mark s: e
mark t: d
mark C: a--f b--f b--c c--e f--e e--d
mark dt: c--d f--d e--d
step: $t$ is active.
class path: e
class frontier: d
class cut: e--d
step: $C_t$ is all of $C$.
class cut: a--f b--f b--c c--e f--e
step: $c(U_t, t)$ is the capacity of $\delta(t)$.
unclass cut: a--f b--f b--c c--e f--e e--d
class highlight: c--d f--d e--d
step: The claim for $t$ finishes the proof.
class cut: a--f b--f b--c c--e f--e e--d
```

::: step
The vertex [[fig:a03-sw-end#t|$t$]] is active: $s = v_{n-1}$ and $t = v_n$ lie on different sides of $C$, because $C$ is an $s$–$t$ cut. So the claim applies to $t$. Here: [[fig:a03-sw-end#s|$s$]] is $e$ and filled, $t$ is $d$ and plain.
:::

::: step
Every vertex occurs in the order, and $t$ is the last, so $U_t$ together with $t$ is all of $V$. Every edge of $C$ has both ends there, so $C_t = C$. Here: [[fig:a03-sw-end#C|$C_t$]] has all six dashed edges, of total capacity $29$.
:::

::: step
Also $U_t$ holds every vertex except $t$, so the edges between $U_t$ and $t$ are all the edges at $t$, and $c(U_t, t) = c(\delta(t))$. This is the capacity of the cut of the phase ([[algorithms/global-min-cut/stoer-wagner|the algorithm page]]). Here: [[fig:a03-sw-end#dt|$\delta(d)$]] is $cd$, $fd$, $ed$, of capacities $5$, $2$, $7$: $14$ in total.
:::

::: step
The claim for $t$ says $c(U_t, t) \le c(C_t)$. By the last two steps this is $c(\delta(t)) \le c(C)$. As $C$ was an arbitrary $s$–$t$ cut and $\delta(t)$ is one, $\delta(t)$ is a minimum $s$–$t$ cut. Here: $14$ against $29$.
:::
::::

:::: proof
We know that $\delta(t)$ is an $s$–$t$ cut. It remains to show $c(\delta(t)) \le c(C)$ for every $s$–$t$ cut $C$. We prove a claim by induction on
the active vertices.

::: claim {#claim:active-vertex title="Active vertices"}
For every active vertex $v$: $\quad c(U_v, v) \le c(C_v)$.
:::

**Base case:** $v = v_i$ is the first active vertex. Then $v_1, \dots, v_{i-1}$ all lie on the same side of $C$ (no vertex before $v$ is active) and
$v$ lies on the other side. So the edges of $C$ inside $U_v \cup \set{v}$ are exactly the edges between $U_v$ and $v$, and $c(U_v, v) = c(C_v)$.

**Inductive step:** assume the claim for all active vertices up to $v$, and let $u$ be the next active vertex. Then
$$c(U_u, u) = c(U_v, u) + c(U_u \setminus U_v, u).$$
When $v$ was added, $u$ was outside $U = U_v$ too, and $v$ was the most tightly connected vertex, so $c(U_v, u) \le c(U_v, v) \le c(C_v)$, the latter by
the induction hypothesis. The vertices of $U_u \setminus U_v$ are $v$ and the vertices added after $v$ and before $u$. None of them except $v$ is
active, so they all lie on the side of $v$; and $u$, being active, lies on the other side of its predecessor, hence on the other side of all of them.
So every edge between $U_u \setminus U_v$ and $u$ belongs to $C_u$, but not to $C_v$ (it has the end $u \notin U_v \cup \set{v}$). Since
$C_v \subseteq C_u$,
$$c(U_u, u) \le c(C_v) + c(U_u \setminus U_v, u) \le c(C_u).$$

To complete the proof of the theorem, note that $t = v_n$ is always active, because $C$ separates $s = v_{n-1}$ and $t$. Moreover
$U_t \cup \set{t} = V$, so $C_t = C$, and $c(U_t, t) = c(\delta(t))$. The claim gives $c(\delta(t)) \le c(C)$.
::::

::: intuition
Think of the order $v_1, \dots, v_n$ as a race: each vertex joins when it is the most attached. Walking along the order, every time the order jumps
across $C$, the jumping vertex's attachment is paid for by edges of $C$ seen so far, because otherwise it would not have been preferred. The last
jump is $t$, and its whole attachment $c(\delta(t))$ is paid for by $C$. Example: in phase 1 of [[fig:a03-stoer-wagner-player]], the order is
$a, b, f, c, e, d$, so $\delta(d)$ of capacity $14$ is a minimum $e$–$d$ cut; indeed $f_G(e, d) = 14$ in [[fig:a03-network]]. Non-example: it is
**not** claimed to be a global minimum cut ($\lambda(G) = 13$).
:::

::: corollary {#cor:stoer-wagner title="Correctness of Stoer–Wagner" source="algorithms/03 p34"}
$\textsf{MINIMUMCUT}(G, c)$ returns a minimum cut of $G$.
:::

The lecture states this without proof.

::: intuition
Each phase settles one pair $s, t$ for free and then glues it; [[cor:identification-mincut]] guarantees that the minimum over the $n - 1$ cuts of the
phases is the answer. Example: the phases on [[fig:a03-network]] give $14, 15, 13, 17, 18$, and the answer is $13$.
:::

::: proposition {#prop:stoer-wagner-time title="Running time of Stoer–Wagner" source="algorithms/03 p37"}
The Stoer–Wagner algorithm runs in time $\O(nm + n^2 \log n)$.
:::

The proof counts the cost of one phase plus one identification and multiplies it by the number of passes of the main loop; it has two parts: one phase, then the identification and the total.

Part 1, the number of passes and the cost of one phase.

:::: walkthrough {for=prop:stoer-wagner-time}
```graph id=a03-sw-phase-time widget=stepper
caption: Phase 1 of the Stoer–Wagner algorithm on the lecture network; the numbers are capacities. It adds $a, b, f, c, e, d$ in this order.
intent: Proof walkthrough, cost of one phase. From the lecture: the network (algorithms/03 p5) and the order of phase 1. New: the counting of the heap operations (the lecture gives the running time on p37 without an example). The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, -0.05); b @(0.5, 0.75); c @(1.65, 0.7); d @(3.3, 0.3); e @(2.8, -0.75); f @(0.75, -0.65)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
mark st: e d
mark start: a
mark keys: b f
mark all: a b f c e d
mark edges: a--b a--f b--c b--f b--e c--f c--e c--d f--e f--d e--d
step: The pair $s$, $t$ at the end of a phase.
class path: e
class frontier: d
step: The start vertex and the keys.
unclass path: e
unclass frontier: d
class visited: a
class frontier: b f
step: Every vertex is extracted once.
unclass frontier: b f
class visited: b f c e d
step: Every edge raises one key.
class highlight: a--b a--f b--c b--f b--e c--f c--e c--d f--e f--d e--d
step: The cost of a phase with Fibonacci heaps.
class frontier: a b f c e d
```

::: step
Each pass of the main loop of $\textsf{MINIMUMCUT}$ runs one phase and then identifies the pair $s$, $t$ ([[alg:stoer-wagner]]), which leaves one vertex fewer. The loop stops at one vertex, so it runs $n - 1$ times. Here: $n = 6$, so there are $5$ phases, and [[fig:a03-sw-phase-time#st|the pair $e$, $d$]] is identified at the end of phase 1.
:::

::: step
In a phase the bottleneck is choosing the most tightly connected vertex ([[def:tightly-connected]]). We keep the vertices outside $U$ in a priority queue, with the key $c(U, v)$ for each vertex $v$. Here: after the start vertex [[fig:a03-sw-phase-time#start|$a$]], the keys are $10$ for $b$, $8$ for $f$ and $0$ for $c$, $e$, $d$.
:::

::: step
Adding a vertex to $U$ is one $\textsf{EXTRACT-MAX}$: the vertex with the largest key is the most tightly connected one. The start vertex is the first one taken, when all keys are $0$. A phase adds every vertex once, so it performs $\abs{V}$ extractions. Here: six, for [[fig:a03-sw-phase-time#all|$a, b, f, c, e, d$]].
:::

::: step
When a vertex joins $U$, each neighbour outside $U$ gets a larger key: one $\textsf{INCREASE-KEY}$ per such edge. An edge causes one only when its first end joins $U$; when its second end joins, the first is already in $U$. So a phase does at most $\abs{E}$ of them. Here: $2,3,3,2,1,0$ for $a,b,f,c,e,d$, together all $11$ [[fig:a03-sw-phase-time#edges|edges]].
:::

::: step
With Fibonacci heaps, $\textsf{EXTRACT-MAX}$ takes $\O(\log n)$ and $\textsf{INCREASE-KEY}$ takes $\O(1)$, both amortised ([[algorithms/mst/jarnik-with-a-heap|the table of heap costs]] is for min-heaps; a max-heap behaves the same). So a phase takes $\O(m + n \log n)$. Here: $6$ extractions and $11$ key increases.
:::
::::

Part 2, the identification and the total.

:::: walkthrough {for=prop:stoer-wagner-time}
```graph id=a03-sw-glue widget=stepper
caption: The lecture network; the numbers are capacities. At the end of phase 1 the vertices $e$ and $d$ are identified.
intent: Proof walkthrough, cost of the identification and the total. From the lecture: the network (algorithms/03 p5) and the pair $e$, $d$ of phase 1. New: the identification as a figure. The positions differ from the lecture to fit the figure box.
layout: fixed
a @(0, 0.55); b @(0.7, 0.65); c @(2.1, 0.8); d @(3.25, 0.05); e @(3, -0.8); f @(0.25, -0.8)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [id=be c=2]; c -- f [c=2]; c -- e [id=ce c=4]; c -- d [id=cd c=5]; f -- e [id=fe c=3]; f -- d [id=fd c=2]; e -- d [c=7]
mark st: e d
mark glued: @be @cd @fd
step: The pair $s$, $t$ to identify.
class path: e
class frontier: d
step: Identify $s$ and $t$.
unclass path: e
unclass frontier: d
merge e d -> d
d @(2.85, -0.8)
step: One edge for each pair.
remove @ce @fe
set @cd [c=9]
set @fd [c=5]
step: The cost is the size of the rows.
class highlight: @be @cd @fd
step: The graph gets smaller, and the total.
unclass highlight: @be @cd @fd
```

::: step
Each pass ends by identifying the pair $s$, $t$ that its phase returned ([[def:node-identification]]). Here: the pair of phase 1 is [[fig:a03-sw-glue#st|$e$ and $d$]].
:::

::: step
The new vertex replaces $s$ and $t$. The edges between $s$ and $t$ disappear; every other edge keeps its capacity and ends at the new vertex. So a vertex adjacent to both $s$ and $t$ gets two parallel edges. Here: $ed$, of capacity $7$, disappears, and $c$ and $f$ get two parallel edges each.
:::

::: step
We replace parallel edges by one edge whose capacity is the sum. Every cut crosses both edges or neither, so no cut capacity changes. Here: the two edges at $c$ become one of capacity $4 + 5 = 9$, the two at $f$ one of capacity $3 + 2 = 5$, and $b$ keeps its edge of capacity $2$.
:::

::: step
Merge the rows of capacities of $s$ and $t$: the new vertex gets, for each other vertex, the sum of the two capacities. Each row lists at most $n-1$ neighbours, and an array indexed by vertex adds parallel edges, so this takes $\O(n)$ time. Here: the new row has [[fig:a03-sw-glue#glued|three edges]] with capacities $2$, $9$ and $5$.
:::

::: step
A pass costs $\O(m+n\log n)$ for the phase and $\O(n)$ for the identification, which the phase term dominates. Later passes run on smaller graphs: an identification removes a vertex and adds no edge, so $n$ and $m$ stay upper bounds. So $n-1$ passes cost $\O(nm+n^2\log n)$. Here: pass 1 leaves $5$ vertices and $8$ edges, from $6$ and $11$.
:::
::::

::: proof
The main loop of $\textsf{MINIMUMCUT}$ is executed $n - 1$ times. In $\textsf{MINCUTPHASE}$, the bottleneck is choosing the most tightly
connected vertex. The vertices not in $U$ are kept in a priority queue with the key $c(U, v)$. Adding a vertex $v$ to $U$ is an
$\textsf{EXTRACT-MAX}$, and increases the keys of its neighbours outside $U$; so a phase performs $\abs{V}$ $\textsf{EXTRACT-MAX}$ and $\abs{E}$
$\textsf{INCREASE-KEY}$ operations. With Fibonacci heaps a phase takes $\O(m + n \log n)$. Two vertices can be identified in time $\O(n)$ (merge
their rows of capacities, adding the capacities of parallel edges). In total $\O(n(m + n \log n)) = \O(nm + n^2 \log n)$.
:::

::: intuition
Each phase is essentially one run of Prim's algorithm with a max-heap, and there are $n - 1$ phases. Compared with $n - 1$ maximum [[def:flow|flows]]
([[prop:global-cut-flows]], $\O(n^4)$), this is much faster: for $m = \O(n^2)$ it is $\O(n^3)$. Example: for $n = 1000$ and $m = 10\,000$, about
$10^7 + 10^6 \cdot 10$ elementary steps instead of $10^{12}$.
:::
