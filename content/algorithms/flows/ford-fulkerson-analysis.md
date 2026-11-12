---
title: "Analysis of Ford–Fulkerson"
course: algorithms
chapter: flows
order: 9
lectures: [a02]
stage: split
status: draft
---

::: theorem {#thm:ford-fulkerson-analysis title="Analysis of Ford–Fulkerson" source="algorithms/02 p23"}
Assume that all capacities are integers, and let $C$ be the highest capacity. Then Ford–Fulkerson terminates after at most $n \cdot C$ iterations and runs in time
$\O(nm \cdot C)$ (pseudo-polynomial). Moreover, the maximum flow it returns is **integral** (all $f(e)$ are integers).
:::

::: intuition
With integer [[def:flow-network|capacities]], every bottleneck is a positive integer, so each round gains at least $1$, and the value cannot pass
the capacity of the cut around $s$. The bound is in terms of the size of the numbers, not just of $n$ and $m$: $C = 10^6$ is written with about $20$ bits,
yet with bad choices costs $2 \cdot 10^6$ rounds ([[fig:a02-bad-example]]). Integrality comes for free: integers in, integers out.
:::

::: proof
By induction, all flow values and residual capacities stay integers (they start at $0$ and change by integral bottlenecks). Hence each iteration increases $\abs{f}$
by at least $1$. The maximum flow is bounded by the capacity of the cut $(\set{s}, V \setminus \set{s})$, which is at most $(n - 1) \cdot C$. So there are at most $n \cdot C$
iterations. Finding an augmenting path takes $\O(m)$ by BFS or DFS in $G_f$; augmentation takes $\O(n)$ and updating $G_f$ takes $\O(n)$ (only edges of $P$ change). So
each iteration takes $\O(m)$, and the total time is $\O(nm \cdot C)$.
:::

### How to choose augmenting paths

```graph id=a02-bad-example widget=figure
caption: With bad choices, Ford–Fulkerson alternately augments along $s \to a \to b \to t$ and $s \to b \to a \to t$ (using the reverse of $ab$), increasing the flow by $1$ each time: $2 \cdot 10^6$ iterations instead of $2$.
intent: The classic example from the lecture showing the pseudo-polynomial behaviour.
type: directed
layout: fixed
s [class=source] @(1, 2); a @(0, 1); b @(2, 1); t [class=sink] @(1, 0)
s -> a [c=1000000 label="$10^6$"]; s -> b [c=1000000 label="$10^6$"]; a -> b [c=1]; a -> t [c=1000000 label="$10^6$"]; b -> t [c=1000000 label="$10^6$"]
```

Some choices of augmenting paths lead to exponential running times (the example above is exponential in the input size, since $C = 10^6$ is written with only about
$20$ bits), others lead to polynomial algorithms. **For real-valued capacities, Ford–Fulkerson is not even guaranteed to terminate** (and it may converge to a
non-maximum value). **Goal:** find an efficient way of choosing good augmenting paths.
