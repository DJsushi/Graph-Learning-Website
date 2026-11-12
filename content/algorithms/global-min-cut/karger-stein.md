---
title: "The Karger–Stein algorithm"
course: algorithms
chapter: global-min-cut
order: 6
lectures: [a03]
stage: split
status: draft
---

(Karger–Stein 1996; Clifford Stein is the "S" in the textbook [CLRS].) By the proof of [[lem:karger-success]], the probability of contracting an edge of
a minimum cut in step $i + 1$ is at most $2/(n - i)$, and it **increases with each step**: $2/n$ in the first step, but $2/3$ in the last. So most
of the risk is at the end. Solution: an algorithm $\textsf{CONTRACT}(G, t)$, which works exactly as $\textsf{CONTRACT}(G)$ but stops when $t$
vertices are left, and is called recursively, twice.

<!-- REVIEW: slide p46 says CONTRACT(G, t) "stops when t edges are left". The product over i = 0, …, n − t − 1 (n − t contractions) and the sizes n/2^{i/2} in the analysis show that t vertices are meant. -->
::: lemma {#lem:contract-t title="Contracting down to t vertices" source="algorithms/03 p46"}
Let $C$ be a minimum cut of $G$ and $2 \le t \le n$. $\textsf{CONTRACT}(G, t)$ contracts no edge of $C$ with probability at least
$$\prod_{i=0}^{n-t-1} \left(1 - \frac{2}{n - i}\right) = \binom{t}{2} \cdot \binom{n}{2}^{-1}.$$
For $t = \lceil 1 + n/\sqrt{2} \rceil$ (and $n \ge 7$) this is still at least $1/2$.
:::

::: proof
The first part is the argument of [[lem:karger-success]] for the first $n - t$ [[def:edge-contraction|contractions]]; the product telescopes to
$\frac{(n-2)(n-3)\cdots(t-1)}{n(n-1)\cdots(t+1)} = \frac{t(t-1)}{n(n-1)}$. For $t \ge 1 + n/\sqrt{2}$ we have $t - 1 \ge n/\sqrt{2}$ and
$t \ge n/\sqrt{2}$, so $t(t-1) \ge n^2/2 \ge n(n-1)/2$, and the probability is at least $1/2$. For $n \ge 7$, $t = \lceil 1 + n/\sqrt{2} \rceil < n$, so
at least one contraction is made.
:::

::: intuition
Stopping early avoids the risky last steps: contracting from $n$ down to about $0.7 n$ vertices keeps a given minimum cut with probability at least a
half. Example: for $n = 10$, $t = \lceil 1 + 7.07 \rceil = 9$, and the bound is $\binom{9}{2}/\binom{10}{2} = 36/45 = 0.8$. For $n = 100$, $t = 72$ and
the bound is $\frac{72 \cdot 71}{100 \cdot 99} \approx 0.52$.
:::

::: algorithm {#alg:fast-mincut title="FASTMINCUT (Karger–Stein)" source="algorithms/03 p47"}
```pseudo
FASTMINCUT(G)
    if |V| ≤ 6 then                                    // @small
        return MINIMUMCUT(G)                           // @exact
    else
        t ← ⌈1 + n/√2⌉                                 // @size
        C_1 ← FASTMINCUT(CONTRACT(G, t))               // @first
        C_2 ← FASTMINCUT(CONTRACT(G, t))               // @second
        return min(C_1, C_2)                           // @return
```
:::

Here $\textsf{MINIMUMCUT}$ is any exact algorithm, e.g. [[alg:stoer-wagner]]; both recursive calls use independent random choices.

::: intuition {for=alg:fast-mincut}
Do the safe part of the contraction once per branch, and spend the effort where the risk is: each half-sized problem is solved twice, independently,
so a failure in one branch is likely repaired by the other. Example: for $n = 1000$, each call contracts to $t = 709$ vertices, then each of the two
recursive calls to $503$ vertices, and so on: $19$ levels until at most $6$ vertices are left.
:::

::: proposition {#prop:fast-mincut-time title="Running time of FASTMINCUT" source="algorithms/03 p47"}
$\textsf{FASTMINCUT}$ runs in time $\O(n^2 \log n)$.
:::

::: proof
In each recursion level the size decreases by a factor of $\sqrt{2}$ (up to the additive $1$ and rounding), so there are $\O(2 \log n) = \O(\log n)$
levels. In the $i$-th level there are $2^i$ subproblems, of size about $n / 2^{i/2}$ each; each calls $\textsf{CONTRACT}$ twice, in time
$\O((n/2^{i/2})^2) = \O(n^2/2^i)$ per call. So every level costs $2^i \cdot \O(n^2 / 2^i) = \O(n^2)$, and the total time is $\O(n^2 \log n)$.
:::

::: intuition
The recursion tree doubles in width while the problem area $n^2$ halves, so every level costs the same $\O(n^2)$. Example: $T(n) = 2\,T(n/\sqrt{2}) + \O(n^2)$
is the "balanced" case of the master theorem, like merge sort's $T(n) = 2\,T(n/2) + \O(n)$.
:::

::: theorem {#thm:fast-mincut-probability title="Success probability of FASTMINCUT" source="algorithms/03 p48"}
Let $P(n)$ be a lower bound on the probability that $\textsf{FASTMINCUT}$ returns a fixed minimum cut $C$ of a graph with $n$ vertices. For $n \ge 7$:
$$P(n) \ge 1 - \left(1 - \frac{1}{2} P\left(\left\lceil 1 + \frac{n}{\sqrt{2}} \right\rceil\right)\right)^2,$$
and the solution of this recurrence is $P(n) = \Omega(1 / \log n)$.
:::

::: proof
A branch returns $C$ if $\textsf{CONTRACT}(G, t)$ keeps $C$ (probability at least $1/2$ by [[lem:contract-t]]) and the recursive call on the
contracted graph, of size $t$, returns $C$ (probability at least $P(t)$). So a branch fails with probability at most $1 - \frac{1}{2}P(t)$, and the
two independent branches both fail with probability at most $(1 - \frac{1}{2}P(t))^2$. This gives the recurrence.

<!-- REVIEW: the lecture only says "solving this recurrence we get P(n) = Ω(1/log n)"; the induction below fills this in. -->
For the solution, write $x = P(t)$; the recurrence reads $P(n) \ge 1 - (1 - x/2)^2 = x - x^2/4$. The function $g(x) = x - x^2/4$ is increasing on
$[0, 1]$. Number the recursion levels from the bottom: graphs with at most $6$ vertices are solved exactly, $P = 1$ at depth $0$. We show
$p_d \ge 1/(d + 1)$ for the success probability $p_d$ at depth $d$, by induction: $p_{d+1} \ge g(p_d) \ge g(1/(d+1))$, and
$$g\!\left(\frac{1}{d+1}\right) = \frac{1}{d+1} - \frac{1}{4(d+1)^2} \ge \frac{1}{d+2} \iff \frac{1}{(d+1)(d+2)} \ge \frac{1}{4(d+1)^2} \iff 4(d+1) \ge d+2,$$
which holds. The depth of the recursion is $\O(\log n)$ ([[prop:fast-mincut-time]]), so $P(n) = \Omega(1/\log n)$.
:::

::: intuition
Each level of the recursion loses at most a little success probability: with chance $\ge 1/2$ a branch keeps the cut, and two branches back each other
up. The loss per level is only quadratic in the current probability, so after $\O(\log n)$ levels the success probability is still about
$1/\log n$, much more than Karger's $2/n^2$. Example: at depth $1$, $p_1 \ge 1 - 1/4 = 3/4$, at depth $2$, $p_2 \ge 3/4 - 9/64 \approx 0.61$.
:::

::: theorem {#thm:karger-stein title="Karger–Stein" source="algorithms/03 p48"}
There is an algorithm which finds a specific minimum cut $C$ [[def:whp|with high probability]] in time $\O(n^2 \log^3 n)$.
:::

::: proof
Run $\textsf{FASTMINCUT}$ $r = \lceil \log n / P(n) \rceil = \O(\log^2 n)$ times independently and keep the best cut. All runs miss $C$ with
probability at most $(1 - P(n))^r \le e^{-r P(n)} \le e^{-\log n} = 1/n$. The time is $r \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$ by
[[prop:fast-mincut-time]].
:::

::: intuition
$\O(\log^2 n)$ repetitions of an $\O(n^2 \log n)$ algorithm with success probability $\Omega(1/\log n)$: compared with $\O(n^2 \log n)$ repetitions of
Karger's $\O(n^2)$ algorithm, the speed-up is a factor of about $n^2 / \log^2 n$. Example: for $n = 1000$, about $1000^2 \cdot 7^3 \approx 3 \cdot 10^8$ steps
instead of $1000^4 \cdot 7 = 7 \cdot 10^{12}$.
:::

::: theorem {#thm:karger-stein-all title="All minimum cuts" source="algorithms/03 p49"}
All minimum cuts of a weighted graph with $n$ vertices can be found [[def:whp|with high probability]] in time $\O(n^2 \log^3 n)$.
:::

::: proof
The probability of missing a specific minimum cut in one run of $\textsf{FASTMINCUT}$ is at most $1 - P(n)$ with $P(n) \ge a/\log n$ for some
constant $a > 0$ ([[thm:fast-mincut-probability]]). Run it $r = \lceil 4 \log^2 n / a \rceil = \O(\log^2 n)$ times and collect all cuts of the minimum
[[def:flow-network|capacity]] found. A specific minimum cut $C$ is missed with probability at most
$$(1 - P(n))^{r} \le e^{-r a / \log n} \le e^{-4 \log n} = \frac{1}{n^4}.$$
There are at most $\binom{n}{2}$ minimum cuts ([[cor:number-min-cuts]]), so by the union bound
$$\Pr[\text{missing any minimum cut}] \le \binom{n}{2} \cdot \frac{1}{n^4} = \O\!\left(\frac{1}{n^2}\right).$$
The running time is $\O(\log^2 n) \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$.
:::

::: intuition
The same number of runs, only with a larger constant, pushes the failure probability for each single cut down to $1/n^4$, small enough to survive a
union bound over all (at most $\binom{n}{2}$) minimum cuts. Example: for the cycle $C_n$, which has $\binom{n}{2}$ minimum cuts
([[exr:a03-cycle-min-cuts]]), the algorithm lists all of them with probability $1 - \O(1/n^2)$.
:::
