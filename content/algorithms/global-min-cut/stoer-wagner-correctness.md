---
title: "Why Stoer–Wagner works"
course: algorithms
chapter: global-min-cut
order: 3
lectures: [a03]
stage: split
status: draft
---

### Correctness

::: theorem {#thm:mincut-phase title="The cut of the phase" source="algorithms/03 p38–39"}
If $\textsf{MINCUTPHASE}(G, c) = (s, t)$, then $\delta(t)$ is a minimum $s$–$t$ cut of $G$.
:::

Let $v_1, \dots, v_n$ be the order in which the vertices were added to $U$ during $\textsf{MINCUTPHASE}$ (so $s = v_{n-1}$, $t = v_n$), and fix any
$s$–$t$ cut $C$ of $G$. A vertex $v = v_i$ ($i \ge 2$) is **active** (with respect to $C$) if $v_{i-1}$ and $v_i$ lie on different sides of $C$. For an
active vertex $v = v_i$ let $U_v = \set{v_1, \dots, v_{i-1}}$, and let $C_v$ be the cut of the induced subgraph $G[U_v \cup \set{v}]$ induced by $C$
(the edges of $C$ with both ends in $U_v \cup \set{v}$).

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

::: proof
By induction on $n$; for $n = 1$ there is no cut and nothing to show (the loop does not run). For $n \ge 2$, the first phase returns $s, t$ with
$c(\delta(t)) = \lambda(G; s, t)$ by [[thm:mincut-phase]], and the algorithm continues on $G_{st}$, finding $\lambda(G_{st})$ by induction (each cut of
$G_{st}$ being a cut of $G$ with the same capacity, [[obs:identification-cuts]]). The result is $\min(\lambda(G; s, t), \lambda(G_{st})) = \lambda(G)$ by
[[cor:identification-mincut]].
:::

::: intuition
Each phase settles one pair $s, t$ for free and then glues it; [[cor:identification-mincut]] guarantees that the minimum over the $n - 1$ cuts of the
phases is the answer. Example: the phases on [[fig:a03-network]] give $14, 15, 13, 17, 18$, and the answer is $13$.
:::

::: proposition {#prop:stoer-wagner-time title="Running time of Stoer–Wagner" source="algorithms/03 p37"}
The Stoer–Wagner algorithm runs in time $\O(nm + n^2 \log n)$.
:::

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
