---
title: "Analysis of Ford–Fulkerson"
course: algorithms
chapter: flows
order: 9
lectures: [a02]
stage: split
status: reviewed
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

Part 1 of the proof, induction on the iterations: integers stay integers, so each gain is a whole number of at least $1$.

:::: walkthrough {for=thm:ford-fulkerson-analysis}
```graph id=a02-ffa-integral widget=stepper
caption: The lecture network with the labels $f/c$ at the start and after iterations 1, 2 and 4: every label is a whole number and the value grows by a whole number each time.
intent: From the lecture (algorithms/02 p15-21, the Ford-Fulkerson demo network; same names as a02-ford-fulkerson-player, positions squeezed to 0.8 of its width to fit the walkthrough box). The flows are those of ex:ford-fulkerson-demo; the lecture does not draw them on p23.
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
s -> a [f=0 c=10]; s -> b [f=0 c=10]; a -> b [f=0 c=2]; a -> c [f=0 c=4]; a -> d [f=0 c=8]; b -> d [f=0 c=9]; d -> c [f=0 c=9]; c -> t [f=0 c=10]; d -> t [f=0 c=10]
step: Start: $f(e) = 0$ on every edge.
step: Iteration 1: the path $P$ has residual capacities 10, 8, 10.
class path: s->a a->d d->t
mark P: s->a a->d d->t
step: After iteration 1, $f$ is integral with value 8.
set s->a [f=8]
set a->d [f=8]
set d->t [f=8]
step: Iteration 2 adds 2 along $s, a, b, d, t$: value 10.
unclass path: s->a a->d d->t
class path: s->a a->b b->d d->t
set s->a [f=10]
set a->b [f=2]
set b->d [f=2]
set d->t [f=10]
step: Iterations 3 and 4 add 7 and 2: the returned flow has value 19.
unclass path: s->a a->b b->d d->t
set s->b [f=9]
set a->b [f=0]
set a->c [f=2]
set b->d [f=9]
set d->c [f=7]
set c->t [f=9]
```

::: step
We show by induction over the iterations that all $f(e)$ and all residual capacities are integers. At the start every edge carries 0. The [[def:residual-network|residual capacities]] are then the capacities $c(e)$, which are integers by the hypothesis (first use). Here: nine labels $0/c$.
:::

::: step
Assume $f$ is integral before an iteration. A residual capacity is $c(e) - f(e)$ or $f(e)$, an integer (second use: $c(e)$ is an integer), and positive on $G_f$, so at least 1. The bottleneck $\delta$ of [[fig:a02-ffa-integral#P|$P$]] is a minimum of such integers, so an integer of at least 1. Here: 10, 8, 10, so $\delta = 8$.
:::

::: step
[[alg:augment|AUGMENT]] adds $\delta$ to $f(e)$ on the edges of $P$ in $E$, and subtracts it from $f(e)$ when $e^R$ lies on $P$. Sums and differences of integers are integers, so the new $f$ is integral, and so are the new residual capacities. The induction is complete. Here: 0 becomes 8 on $sa$, $ad$, $dt$.
:::

::: step
By [[lem:augment]] the value grows from $\abs{f}$ to $\abs{f} + \delta$. Since $\delta$ is an integer of at least 1, every iteration raises the value by at least 1. Here: iteration 2 takes the path through $a$, $b$ and $d$ with $\delta = 2$, and the value goes from 8 to 10.
:::

::: step
The loop ends only when $G_f$ has no augmenting path, and it returns the current $f$. That $f$ is integral by the induction, so the returned flow is integral. Here: iterations 3 and 4 raise the value by 7 and 2, both at least 1. The final value is 19, and every label is a whole number.
:::
::::

Part 2 of the proof, a bound from above: the value is at most the capacity of one small cut, and each iteration gains at least $1$.

:::: walkthrough {for=thm:ford-fulkerson-analysis}
```graph id=a02-ffa-bound widget=stepper
caption: The final flow of the lecture demo (value 19) and the cut around $s$: the two thick edges leave $s$, and the ringed vertices are the other $n - 1 = 5$ vertices.
intent: From the lecture (algorithms/02 p21, the Ford-Fulkerson demo network with its final flow f4); the cut around s is the one of the notes (a02-network example in def:flow-cut). New figure for the proof on p23.
type: directed
layout: fixed
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
s -> a [f=10 c=10]; s -> b [f=9 c=10]; a -> b [f=0 c=2]; a -> c [f=2 c=4]; a -> d [f=8 c=8]; b -> d [f=9 c=9]; d -> c [f=7 c=9]; c -> t [f=9 c=10]; d -> t [f=10 c=10]
step: The cut: $S = \set{s}$, $T$ the five other vertices.
class color1: a b c d t
mark T: a b c d t
step: Its capacity is the sum over the edges leaving $s$: 20.
class cut: s->a s->b
mark cross: s->a s->b
step: The value 19 is at most 20.
class bold: s->a s->b
step: At most $n - 1$ edges leave $s$, each of capacity at most $C$.
unclass cut: s->a s->b
unclass bold: s->a s->b
class highlight: a b c d t
step: After $k$ iterations the value is at least $k$ and at most $(n-1) C$.
unclass highlight: a b c d t
class current: s t
```

::: step
The maximum flow is bounded by the capacity of one particular cut. We take the $s$–$t$ cut with $S = \set{s}$ and $T = V \setminus \set{s}$ ([[def:flow-cut|definition]]). It is a cut because $s$ lies in $S$ and $t$ lies in $T$. Here: [[fig:a02-ffa-bound#T|$T$]] has the five vertices $a$, $b$, $c$, $d$, $t$.
:::

::: step
The capacity of this cut is the sum of $c(e)$ over the edges $e$ that go from $S$ to $T$. These are exactly the [[fig:a02-ffa-bound#cross|edges that leave $s$]], since $S$ has no other vertex. Here: $(s, a)$ and $(s, b)$ give 10 + 10 = 20.
:::

::: step
Every flow value is at most every cut capacity (weak duality): all flow must cross the cut from $S$ to $T$, and an edge carries at most its capacity. This holds for every flow the algorithm holds, and for a maximum flow. Here: the final flow has value 19, which is at most 20.
:::

::: step
The network has no parallel edges, so at most one edge leaves $s$ towards each vertex of $T$. So at most $n - 1$ edges leave $s$, each of capacity at most $C$. The cut has capacity at most $(n-1) \cdot C$. Here: 2 edges leave $s$ instead of 5, and $5 \cdot 10 = 50$.
:::

::: step
The value starts at 0 and each iteration raises it by at least 1 (part 1). After $k$ iterations it is at least $k$. It never passes $(n-1) \cdot C$, so $k \le (n-1) \cdot C$, which is at most $nC$. Here: 4 iterations, bound 50, and $nC = 60$. The hypothesis enters through part 1.
:::
::::

Part 3 of the proof, counting the work: one iteration costs $\O(m)$, and we multiply by the number of iterations.

:::: walkthrough {for=thm:ford-fulkerson-analysis}
```graph id=a02-ffa-time widget=stepper
caption: The residual graph $G_{f_2}$ of the lecture demo after iteration 2 (edge labels are residual capacities) and the update after iteration 3: thick edges lie on the path $P$.
intent: From the lecture (algorithms/02 p21: the residual graph G_f2 with its residual capacities, and p15-21 for iteration 3). The update to G_f3 is new.
type: directed
layout: fixed
edge-label: "{c}"
s [class=source] @(0, 0); a @(1.2, 1); b @(1.2, 0); c @(2.4, 1); d @(2.4, 0); t [class=sink] @(3.6, 0)
a -> s [c=10 class=back bend=0.3]; s -> b [c=10]; b -> a [c=2 class=back]; a -> c [c=4]; d -> a [c=8 class=back]; b -> d [c=7 bend=0.3]; d -> b [c=2 class=back bend=0.3]; d -> c [c=9]; c -> t [c=10]; t -> d [c=10 class=back bend=0.3]
step: $G_{f_2}$ has 10 edges; BFS or DFS scans them.
step: The path $P$ has 4 edges and bottleneck 7.
class path: s->b b->d d->c c->t
mark P: s->b b->d d->c c->t
step: The update changes only edges of $P$ and their reverses.
set s->b [c=3]
remove b->d
set d->b [c=9]
set d->c [c=2]
c -> d [c=7 class=back]; b -> s [c=7 class=back bend=0.3]; t -> c [c=7 class=back bend=0.3]
set c->t [c=3]
step: The other edges stay as they are: one iteration costs $\O(m)$.
unclass path: s->b d->c c->t
class muted: a->s b->a a->c d->a t->d
```

::: step
We search $G_f$ for an augmenting path by [[alg:bfs|BFS]] or DFS. Each edge $e$ of $G$ gives at most the edges $e$ and $e^R$ of $G_f$: at most twice as many as $G$ has. The search scans each edge once and reaches only vertices that an edge enters. So it takes $\O(m)$ time. Here: 10 edges, at most 18.
:::

::: step
A path has no repeated vertices, so [[fig:a02-ffa-time#P|$P$]] has at most $n - 1$ edges. The bottleneck is a minimum over its edges, and [[alg:augment|AUGMENT]] changes $f$ once per edge. Each costs $\O(1)$ per edge, so $\O(n)$ in total. Here: 4 edges (at most 5), residual capacities 10, 7, 9, 10, so $\delta = 7$.
:::

::: step
AUGMENT changes $f$ only on the edges of $P$, and $c_f(e)$ depends on $f(e)$ alone. So only the edges $e$ of $P$ and their reverses $e^R$ change. For each pair we update two entries, or create or delete an edge, in $\O(1)$ time. So the update takes $\O(n)$. Here: $(b, d)$ becomes saturated and disappears, and three reverse edges appear.
:::

::: step
An iteration is a search, an augmentation and an update. The path $P$ has at most twice $m$ edges, since it uses edges of $G_f$, so the work on $P$ is linear in $m$. One iteration takes $\O(m)$. By part 2 there are at most $n$ times $C$ iterations, so the total is $\O(nm \cdot C)$.
:::
::::

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
