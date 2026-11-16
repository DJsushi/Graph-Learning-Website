---
title: "The Karger–Stein algorithm"
course: algorithms
chapter: global-min-cut
order: 6
lectures: [a03]
stage: split
status: reviewed
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

The proof multiplies the survival chances of the first $n - t$ contractions, as in [[lem:karger-success]], and then bounds the product. Part 1: the product and its telescoping.

:::: walkthrough {for=lem:contract-t}
```graph id=a03-ct-product widget=stepper
caption: The graph of [[fig:a03-karger-good]]: two copies of $K_4$ joined by the edges $15$ and $48$. Dashed: the minimum cut $C$. Step 2 thickens four contracted edges, steps 3 and 4 mark them, step 5 contracts them, step 6 fills the four vertices left.
intent: Proof walkthrough, part 1 of the lemma (the product). New (algorithms/03 p46 has no example); the graph and the vertex names are those of a03-karger-good (algorithms/03 p41), with target t = 4.
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14]; 2 -- 3 [id=e23]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58]; 6 -- 7 [id=e67]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark run: @e67 @e78 @e14 @e23
step: The cut $C$ and $n - t$ contractions.
class cut: @e15 @e48
step: One contraction avoids $C$.
class tree: @e67 @e78 @e14 @e23
step: All contractions avoid $C$.
class current: @e67 @e78 @e14 @e23
step: Write each factor as a fraction.
unclass current: @e67 @e78 @e14 @e23
class highlight: @e67 @e78 @e14 @e23
step: Most factors cancel.
unclass highlight: @e67 @e78 @e14 @e23
merge 6 7 -> 67
merge 67 8 -> 678
merge 1 4 -> 14
merge 2 3 -> 23
mark done: 14 23 5 678
step: The ratio of binomial coefficients.
class color1: 14 23 5 678
```


::: step
Let [[fig:a03-ct-product#C|$C$]] be a minimum cut of $G$. The algorithm makes exactly $n - t$ contractions and then stops. We want the probability that none of them picks an edge of $C$. Here: $n$ is 8 and $t$ is 4, so there are 4 contractions; $C$ is the two dashed edges 15 and 48.
:::

::: step
Fix a step $i$ and suppose the earlier contractions avoided $C$. This is the situation of [[lem:karger-success]]; it applies because $n - i$ is at least 3, as $t$ is at least 2. So the next contraction avoids $C$ with probability at least $1 - 2/(n-i)$. Here: the [[fig:a03-ct-product#run|four thick edges]] avoid $C$.
:::

::: step
The probability that all $n - t$ contractions avoid $C$ is a product of conditional probabilities: the first avoids $C$, then the second given the first, and so on. Each factor is at least the bound of step 2. So the product is at least the product of these bounds over all steps $i$. Here: 4 factors.
:::

::: step
Write each factor as one fraction: $1 - 2/(n-i)$ is $(n-i-2)/(n-i)$. The numerators count down from $n - 2$ and the denominators from $n$, by one per factor. Here: 6/8, 5/7, 4/6, 3/5.
:::

::: step
Cancel. The numerator of each factor except the last two is the denominator of the factor two places later. What remains is the last two numerators, $t$ and $t - 1$, over the first two denominators, $n$ and $n - 1$: the ratio $t(t-1)/(n(n-1))$. Here: 6 and 5 cancel, leaving (4 times 3) over (8 times 7).
:::

::: step
Divide top and bottom by 2: the top becomes the number of pairs among $t$ vertices, the bottom the number of pairs among $n$ vertices. So the product is $\binom{t}{2} / \binom{n}{2}$. Here: 6 pairs among the [[fig:a03-ct-product#done|four remaining vertices]], 28 among 8; and 6/28 is 3/14.
:::

::::

Part 2: the ratio is at least $1/2$ for this $t$, by comparing two products of consecutive integers; the hypothesis $n \ge 7$ makes sure that a contraction happens.

:::: walkthrough {for=lem:contract-t}
```graph id=a03-ct-half widget=stepper
caption: The graph of part 1 with $n = 8$, so $t = 7$ and one contraction. Dashed: the minimum cut $C$. Step 2 fills seven vertices (the number to be left), step 3 thickens the edge 67, step 4 makes it bold, step 5 contracts it, step 6 fills the seven vertices left.
intent: Proof walkthrough, part 2 of the lemma (the bound 1/2). New (algorithms/03 p46 has no example); the graph is the one of part 1 (algorithms/03 p41).
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14]; 2 -- 3 [id=e23]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58]; 6 -- 7 [id=e67]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark kept: 1 2 3 4 5 6 8
step: The ratio for $t = \lceil 1 + n/\sqrt{2} \rceil$.
class cut: @e15 @e48
step: Both $t - 1$ and $t$ are at least $n/\sqrt{2}$.
class color1: 1 2 3 4 5 6 8
step: Multiply the two bounds.
class highlight: @e67
step: Compare with $n(n-1)/2$.
class bold: @e67
step: The probability is at least $1/2$.
unclass color1: 1 2 3 4 5 6 8
merge 6 7 -> 67
step: At least one contraction is made.
class color1: 1 2 3 4 5 8 67
```


::: step
Take $t = \lceil 1 + n/\sqrt{2} \rceil$ with $n$ at least 7. Part 1 says that [[fig:a03-ct-half#C|$C$]] survives with probability at least $t(t-1)/(n(n-1))$. We show this is at least a half. Here: $n$ is 8, so $t$ is 7 and the ratio is 42/56.
:::

::: step
Let $s$ be $n$ over the square root of 2. A ceiling is never below its argument, so $t$ is at least $1 + s$. Subtract 1: $t - 1$ is at least $s$. So is $t$, being larger. Here: $s$ is 5.66, and $t$ is 7, the number of [[fig:a03-ct-half#kept|vertices to be left]].
:::

::: step
Both numbers are positive, so we may multiply the two inequalities. The product of $t$ and $t - 1$ is at least the square of $s$, which is $n^2/2$. So $t(t-1) \ge n^2/2$. Here: 42 against 32.
:::

::: step
The square of $n$ is at least $n$ times $n - 1$, as $n$ is at least $n - 1$. Halving, $n^2/2$ is at least half of $n$ times $n - 1$. With step 3, $t(t-1)$ is also at least half of $n$ times $n - 1$. Here: 32 against 28, and 42 is at least 28.
:::

::: step
Divide by $n(n-1)$: the survival probability of part 1 is at least a half. This is the claim. Here: the one contraction merges 6 and 7, and avoids $C$ with probability at least 42/56, which is 3/4.
:::

::: step
Since $n$ is at least 7, $n(1 - 1/\sqrt{2})$ is at least 2 (2.05 at 7, and it grows). So $1 + s$ is at most $n - 1$, and so is its ceiling $t$, as $n - 1$ is an integer. Hence $t$ is smaller than $n$: a contraction is made. Here: 7 gives 6; 6 would give 6.
:::

::::

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

The proof counts the levels of the recursion tree and shows that every level costs the same.

:::: walkthrough {for=prop:fast-mincut-time}
```graph id=a03-fm-levels widget=stepper
caption: The top three levels of the recursion tree of FASTMINCUT on a graph with $n = 1000$ vertices: each vertex is one recursive call, and the edges go to the two calls it makes. Step 1 thickens the leftmost branch, step 2 fills its three calls, step 3 fills each level in its own way, steps 4 and 6 ring the four calls of the bottom row, step 5 rings one of them, step 7 adds below them four calls of the last level (the dashed edges stand for the levels in between) and makes them bold, step 8 thickens all edges.
intent: Proof walkthrough of the running time. New (algorithms/03 p47 has no figure); the sizes 1000, 709, 503 are those of the example in the intuition of the algorithm.
layout: fixed
r @(1.5, 0.6); a @(0.5, 0); b @(2.5, 0); c @(0, -0.6); d @(1, -0.6); e @(2, -0.6); f @(3, -0.6)
r -- a [id=ra]; r -- b [id=rb]; a -- c [id=ac]; a -- d [id=ad]; b -- e [id=be]; b -- f [id=bf]
mark chain: @ra @ac
mark lv1: a b
mark lv2: c d e f
step: The size shrinks level by level.
class path: @ra @ac
step: The number of levels.
class visited: r a c
step: Every call makes two calls.
unclass path: @ra @ac
unclass visited: r a c
class color1: r
class color2: a b
class color3: c d e f
step: The size at level $i$.
class current: c d e f
step: The cost of one call.
unclass current: d e f
step: The cost of one level.
class current: d e f
step: The base cases at the bottom.
unclass current: c d e f
1 @(0, -1.2); 2 @(1, -1.2); 3 @(2, -1.2); 4 @(3, -1.2)
c -- 1 [id=c1]; d -- 2 [id=d2]; e -- 3 [id=e3]; f -- 4 [id=f4]
class dashed: @c1 @d2 @e3 @f4
class bold: 1 2 3 4
step: The total cost.
class path: @ra @rb @ac @ad @be @bf
```


::: step
A call on $n$ vertices contracts to $t$ vertices, where $t$ is about $n/\sqrt{2}$ (the plus 1 and the rounding are small), and recurses. So each level divides the size by about the same factor, and after $j$ levels the size is about $n/2^{j/2}$. Here: [[fig:a03-fm-levels#chain|one branch]] has sizes 1000, 709, 503, ...
:::

::: step
The calls stop at 6 vertices, a constant. The size is about $n/2^{j/2}$ after $j$ levels, so it reaches a constant when $j$ is about twice the logarithm of $n$. That is $\O(\log n)$ levels. Here: from 1000 vertices down to at most 6 takes 19 levels.
:::

::: step
Every call makes two recursive calls, so the number of calls doubles from one level to the next. Level 0 has one call, so level $i$ has $2^i$ calls. Here: 1 call at the top, [[fig:a03-fm-levels#lv1|2 calls]] at level 1, [[fig:a03-fm-levels#lv2|4 calls]] at level 2.
:::

::: step
A call at level $i$ comes after $i$ levels, each dividing the size by the same factor. These factors multiply to $2^{i/2}$. So a call at level $i$ works on about $n/2^{i/2}$ vertices. Here: level 2 has about 1000/2 = 500 vertices per call (503 exactly).
:::

::: step
A call at level $i$ runs [[alg:karger|CONTRACT]] twice. One run makes at most one contraction per vertex, each in time linear in the size, so it takes time quadratic in the size: $\O(n^2/2^i)$, the square of $n/2^{i/2}$. Two runs only double the constant. Here: about 500 squared, 250 000 steps per run.
:::

::: step
Level $i$ has $2^i$ calls of this cost, so the level costs $2^i \cdot \O(n^2/2^i) = \O(n^2)$: the powers of 2 cancel. Here: level 2 has 4 calls of 250 000 steps, which is 1 000 000, the square of 1000.
:::

::: step
The calls at the bottom, below the dashed edges, are the base cases: 6 vertices, MINIMUMCUT, constant time each. There are $2^L$ of them for $L$ levels. Their size $n/2^{L/2}$ is constant, so $2^L$ is a constant times $n^2$. They cost $\O(n^2)$ in total, like one level, and the bound stands. Here: 524 288 calls, against $n^2 = 1\,000\,000$.
:::

::: step
There are logarithmically many levels (step 2), each costing $\O(n^2)$, the last one too (step 7), so the total time is $\O(n^2 \log n)$. Here: 19 levels of about a million steps each.
:::

::::

::: proof
In each recursion level the size decreases by a factor of $\sqrt{2}$ (up to the additive $1$ and rounding), so there are $\O(2 \log n) = \O(\log n)$
levels. In the $i$-th level there are $2^i$ subproblems, of size about $n / 2^{i/2}$ each; each calls $\textsf{CONTRACT}$ twice, in time
$\O((n/2^{i/2})^2) = \O(n^2/2^i)$ per call. So every level costs $2^i \cdot \O(n^2 / 2^i) = \O(n^2)$, and the total time is $\O(n^2 \log n)$.
:::

::: intuition
The recursion tree doubles in width while the problem area $n^2$ halves, so every level costs the same $\O(n^2)$. Example: $T(n) = 2\,T(n/\sqrt{2}) + \O(n^2)$
is the "balanced" case of the master theorem, like merge sort's $T(n) = 2\,T(n/2) + \O(n)$.
:::

<!-- REVIEW: the lecture says "returns C"; with ties FASTMINCUT can miss a fixed C for ever (C_7, tie rule toward the side without vertex 1), so P(n) bounds the survival of C, which makes the run return a minimum cut -->
::: theorem {#thm:fast-mincut-probability title="Success probability of FASTMINCUT" source="algorithms/03 p48"}
Let $P(n)$ be a lower bound on the probability that a fixed minimum cut $C$ of a graph with $n$ vertices survives every contraction on some root–leaf path of the recursion of $\textsf{FASTMINCUT}$ (then the run returns a minimum cut). For $n \ge 7$:
$$P(n) \ge 1 - \left(1 - \frac{1}{2} P\left(\left\lceil 1 + \frac{n}{\sqrt{2}} \right\rceil\right)\right)^2,$$
and the solution of this recurrence is $P(n) = \Omega(1 / \log n)$.
:::

Part 1, the recurrence: we multiply the chances of the two events that make one branch succeed, and then combine the two independent branches.

:::: walkthrough {for=thm:fast-mincut-probability}
```graph id=a03-fm-branch widget=stepper
caption: One call of FASTMINCUT on a graph $G$ with $n = 7$ vertices. Each edge from $G$ is a contraction to $t = 6$ vertices, giving $H_1$ and $H_2$; each edge below is a recursive call returning the cut $C_1$ or $C_2$. Step 1 rings $G$, step 2 thickens branch 1, steps 3 and 4 mark one edge of it, step 5 rings the cut $C_1$, step 6 makes the branch bold, step 7 thickens branch 2, step 8 fills $G$.
intent: Proof walkthrough, part 1 of the theorem (the recurrence). New (algorithms/03 p48 has no figure); n = 7 is the smallest size for which the recursion makes a call.
layout: fixed
G @(1.5, 0.6); H1 @(0.5, 0); H2 @(2.5, 0); C1 @(0.5, -0.6); C2 @(2.5, -0.6)
G -- H1 [id=k1]; H1 -- C1 [id=f1]; G -- H2 [id=k2]; H2 -- C2 [id=f2]
mark keep: @k1
mark call: @f1
step: $C$ survives in a call.
class current: G
step: A branch has two events.
unclass current: G
class path: @k1 @f1
step: The contraction keeps $C$.
class highlight: @k1
step: $C$ survives in the recursive call.
unclass highlight: @k1
class highlight: @f1
step: Survival gives a minimum cut.
unclass highlight: @f1
class current: C1
step: A branch fails with probability at most $1 - P(t)/2$.
unclass current: C1
class bold: @k1 @f1
step: The second branch is independent.
unclass path: @k1 @f1
class path: @k2 @f2
step: Both branches fail.
class color1: G
```


::: step
Fix a minimum cut $C$ of $G$. We say $C$ survives in a call if some path from it down to a leaf contracts no edge of $C$. A leaf is a call on at most 6 vertices; it contracts nothing. The theorem bounds the chance of survival in a call on $n$ vertices by $P(n)$. Here: call on $G$.
:::

::: step
A branch is one line of [[alg:fast-mincut|FASTMINCUT]]: contract to $t$ vertices, then call the algorithm on the result. $C$ survives in the branch when two events happen: the contraction keeps $C$, and $C$ survives in the call on the result. Here: [[fig:a03-fm-branch#keep|the contraction]] from $G$ to $H_1$, then [[fig:a03-fm-branch#call|the call]] returning $C_1$.
:::

::: step
The contraction keeps $C$ with probability at least a half, by [[lem:contract-t]]. The lemma needs $n$ at least 7, and so does the algorithm: it recurses only above 6 vertices. Here: 7 vertices give $t$ equal to 6, and the lemma gives at least 30/42, which is 5/7.
:::

::: step
Suppose the contraction kept $C$. Then $C$ is still a cut of $H_1$ with the same capacity, and none is smaller ([[obs:identification-cuts]]). So $C$ is a minimum cut of $H_1$, which has $t$ vertices, and survives in the call on it with probability at least $P(t)$. Here: $H_1$ has 6 vertices, a leaf, so the probability is 1.
:::

::: step
Survival suffices. If $C$ survives, the leaf on that path still has $C$ as a cut, so its MINIMUMCUT returns a cut of capacity at most that of $C$. Each smaller of two cuts above keeps that bound. So the call returns a minimum cut, perhaps another one of the same capacity. Here: $C_1$ may differ from $C$.
:::

::: step
$C$ survives in the branch if the first event happens and then the second, which uses its own random choices. So this has probability at least $P(t)/2$, the product of the two bounds, and the branch fails with probability at most $1 - P(t)/2$. Here: it fails with probability at most a half.
:::

::: step
The second branch is the same, with the same bound. The two calls use independent random choices, so the two branches fail independently and the failure probabilities multiply: both fail with probability at most $(1 - P(t)/2)^2$. Here: a half squared, a quarter.
:::

::: step
If $C$ survives in one branch, it survives in the call on $G$: the path of that branch extends to a path from $G$. So the call fails only if both branches fail, and $P(n) \ge 1 - (1 - P(t)/2)^2$ with $t$ as in the algorithm: the recurrence. Here: for 7 vertices the bound is 3/4.
:::

::::

Part 2, solving the recurrence: induction on the depth of the recursion, with a monotone function that turns the recurrence into a one-step update.

:::: walkthrough {for=thm:fast-mincut-probability}
```graph id=a03-fm-depth widget=stepper
caption: The depths of the recursion, one vertex per depth: depth $0$ is a graph with at most 6 vertices, and an edge joins depth $d + 1$ to depth $d$, the depth of the graph its calls work on. Step 1 thickens all edges, step 2 rings one edge, step 3 fills depth 0, steps 4 to 8 fill more depths and thicken the edges used, and step 9 thickens all edges.
intent: Proof walkthrough, part 2 of the theorem (solving the recurrence). New (algorithms/03 p48 only states the solution); the depths 0 to 5 are the bottom of a recursion that has 19 levels for n = 1000.
layout: fixed
0 @(0, 0); 1 @(0.7, 0); 2 @(1.4, 0); 3 @(2.1, 0); 4 @(2.8, 0); 5 @(3.5, 0)
0 -- 1 [id=e01]; 1 -- 2 [id=e12]; 2 -- 3 [id=e23]; 3 -- 4 [id=e34]; 4 -- 5 [id=e45]
mark link: @e01 @e12 @e23 @e34 @e45
mark bottom: 0
step: One step of the recurrence.
class highlight: @e01 @e12 @e23 @e34 @e45
step: The step function increases.
unclass highlight: @e01 @e12 @e23 @e34 @e45
class current: @e01
step: The bottom: exact solution.
unclass current: @e01
class source: 0
step: The claim for every depth.
class visited: 0
step: The induction step.
class visited: 1
class path: @e01
step: The value of the step function.
class path: @e12
step: Compare the two fractions.
class bold: @e12
step: Multiply out.
class visited: 2 3 4 5
class path: @e23 @e34 @e45
step: The depth is logarithmic.
class highlight: @e01 @e12 @e23 @e34 @e45
```


::: step
Write $x$ for $P(t)$. Expanding the square gives $1 - (1 - x/2)^2 = x - x^2/4$. Call the right side $g$ of $x$. So the survival probability at one level is $g$ of the one below. Here: [[fig:a03-fm-depth#link|every edge]] is one such step.
:::

::: step
The function $g$ is increasing on the interval from 0 to 1: its derivative $1 - x/2$ is positive there. So a lower bound on $x$ gives a lower bound on $g$ of $x$. We use this to replace true values by bounds. Here: $g$ of 1 is 3/4, above $g$ of one half, which is 7/16.
:::

::: step
A graph with at most 6 vertices is a leaf: it contracts nothing, so $C$ survives with probability 1. These are the graphs at depth 0. Let $p_d$ be the survival probability at depth $d$. Then $p_0 = 1$. Here: [[fig:a03-fm-depth#bottom|depth 0]]. The recurrence applies from depth 1 on, as it needs $n$ at least 7.
:::

::: step
We show $p_d \ge 1/(d+1)$ for every depth $d$, by induction. At depth 0 the claim says $p_0 \ge 1$: true, because $p_0$ is 1. Here: depth 0 is the filled vertex; the claim says a half for depth 1 and a third for depth 2.
:::

::: step
Assume the claim for depth $d$; write $q$ for one over $d + 1$. A call at depth $d + 1$ works on a graph of depth $d$, so $p_{d+1} \ge g(p_d) \ge g(q)$, by the claim and since $g$ increases. It remains to compare $g(q)$ with the next bound. Here: depth 1 gives 3/4.
:::

::: step
By the definition of $g$, the value $g(q)$ equals one over $d+1$ minus $1/(4(d+1)^2)$. We want it to be at least one over $d+2$. Here: for $d$ equal to 1, it is 1/2 minus 1/16, which is 7/16; and 7/16 is more than 1/3.
:::

::: step
Move one over $d+2$ to the left. The claim is that one over $d+1$ minus one over $d+2$ is at least $1/(4(d+1)^2)$. Over a common denominator the difference is $1/((d+1)(d+2))$. Here: 1/2 minus 1/3 is 1/6, against 1/16.
:::

::: step
Multiply both sides by the positive number 4 times the square of $d+1$ times $d+2$. The claim becomes $4(d+1) \ge d+2$, which holds since the left side exceeds the right by $3d+2$, not negative. So the bound for depth $d+1$ holds and the induction is complete. Here: depths 3, 4, 5 follow the same way.
:::

::: step
The depth $d$ of the recursion for $n$ vertices is $\O(\log n)$ ([[prop:fast-mincut-time]]), and the survival probability is at least one over $d+1$. So it is $\Omega(1/\log n)$. Here: 1000 vertices have 19 levels, so the bound is 1/20.
:::

::::

<!-- REVIEW: "returns C" replaced by "C survives": with ties a run may always return another minimum cut of the same capacity and never C -->
::: proof
$C$ survives in a branch if $\textsf{CONTRACT}(G, t)$ keeps $C$ (probability at least $1/2$ by [[lem:contract-t]]) and $C$ survives in the recursive call on the
contracted graph, of size $t$ (probability at least $P(t)$). So a branch fails with probability at most $1 - \frac{1}{2}P(t)$, and the
two independent branches both fail with probability at most $(1 - \frac{1}{2}P(t))^2$. This gives the recurrence.

<!-- REVIEW: the lecture only says "solving this recurrence we get P(n) = Ω(1/log n)"; the induction below fills this in. -->
For the solution, write $x = P(t)$; the recurrence reads $P(n) \ge 1 - (1 - x/2)^2 = x - x^2/4$. The function $g(x) = x - x^2/4$ is increasing on
$[0, 1]$. Number the recursion levels from the bottom: graphs with at most $6$ vertices contract nothing, so $C$ survives, $P = 1$ at depth $0$. We show
$p_d \ge 1/(d + 1)$ for the success probability $p_d$ at depth $d$, by induction: $p_{d+1} \ge g(p_d) \ge g(1/(d+1))$, and
$$g\!\left(\frac{1}{d+1}\right) = \frac{1}{d+1} - \frac{1}{4(d+1)^2} \ge \frac{1}{d+2} \iff \frac{1}{(d+1)(d+2)} \ge \frac{1}{4(d+1)^2} \iff 4(d+1) \ge d+2,$$
which holds. The depth of the recursion is $\O(\log n)$ ([[prop:fast-mincut-time]]), so $P(n) = \Omega(1/\log n)$.
:::

::: intuition
Each level of the recursion loses at most a little success probability: with chance $\ge 1/2$ a branch keeps the cut, and two branches back each other
up. The loss per level is only quadratic in the current probability, so after $\O(\log n)$ levels the success probability is still about
$1/\log n$, much more than Karger's $2/n^2$. Example: at depth $1$, $p_1 \ge 1 - 1/4 = 3/4$, at depth $2$, $p_2 \ge 3/4 - 9/64 \approx 0.61$.
:::

<!-- REVIEW: the lecture says "a specific minimum cut C"; with ties repeated FASTMINCUT can miss a fixed C for ever, so the statement and proof claim a minimum cut -->
::: theorem {#thm:karger-stein title="Karger–Stein" source="algorithms/03 p48"}
There is an algorithm which finds a minimum cut [[def:whp|with high probability]] in time $\O(n^2 \log^3 n)$.
:::

The proof repeats an experiment with success probability at least $P(n)$ until a success is very likely.

:::: walkthrough {for=thm:karger-stein}
```graph id=a03-ks-runs widget=stepper
caption: The repetition for $n = 1000$ and $P(n) = 1/20$: the vertex $B$ keeps the best cut of the runs; of the $r = 139$ runs, six are drawn. Step 1 fills all runs, step 2 rings one, step 3 the other five, step 4 fades the edges, step 5 fills $B$, step 6 rings $B$, steps 7 and 8 thicken all edges.
intent: Proof walkthrough of the theorem. New (algorithms/03 p48 has no figure); the size n = 1000 is that of the intuitions, and P = 1/20 is the bound of the induction at 19 levels.
layout: fixed
1 @(0, 0.65); 2 @(1.5, 0.65); 3 @(3, 0.65); 4 @(0, -0.65); 5 @(1.5, -0.65); 6 @(3, -0.65); B @(1.5, 0)
B -- 1 [id=b1]; B -- 2 [id=b2]; B -- 3 [id=b3]; B -- 4 [id=b4]; B -- 5 [id=b5]; B -- 6 [id=b6]
mark runs: 1 2 3 4 5 6
mark one: 1
step: Repeat the algorithm $r$ times.
class color1: 1 2 3 4 5 6
step: One run fails.
class rejected: 1
step: All runs fail.
class rejected: 2 3 4 5 6
step: A convenient upper bound.
unclass rejected: 1 2 3 4 5 6
class muted: @b1 @b2 @b3 @b4 @b5 @b6
step: The choice of $r$.
unclass muted: @b1 @b2 @b3 @b4 @b5 @b6
class highlight: B
step: The best cut is a minimum cut.
class current: B
step: The number of runs.
unclass current: B
class bold: @b1 @b2 @b3 @b4 @b5 @b6
step: The running time.
class path: @b1 @b2 @b3 @b4 @b5 @b6
```


::: step
Run [[alg:fast-mincut|FASTMINCUT]] $r = \lceil \log n / P(n) \rceil$ times, with independent random choices, and keep the best cut. The logarithm is natural. Here: for $n$ equal to 1000 and $P(n)$ equal to 1/20, $r$ is 139; [[fig:a03-ks-runs#runs|six runs]] are drawn.
:::

::: step
Fix a minimum cut $C$. A run fails when $C$ does not survive in it. $P(n)$ is a lower bound on the probability that $C$ survives, so one run fails with probability at most $1 - P(n)$. Here: [[fig:a03-ks-runs#one|a run]] fails with probability at most 19/20.
:::

::: step
All $r$ runs fail only if each one does. The runs are independent, so the probabilities multiply: all fail with probability at most $(1 - P(n))^r$. Here: 19/20 to the power 139 is about 0.0008.
:::

::: step
For every real $x$ we have $1 - x \le e^{-x}$, since the curve of the exponential lies above its tangent line at 0. Taking $x$ as the survival bound and raising both sides to the power $r$ (both sides are non-negative) gives $(1 - P(n))^r \le e^{-rP(n)}$. Here: $e$ to the minus 6.95 is about 0.00096.
:::

::: step
By the choice of $r$, we get $rP(n) \ge \log n$. Hence all runs fail with probability at most $e^{-\log n} = 1/n$, so $C$ survives in some run [[def:whp|with high probability]]. Here: 6.95 is at least 6.91, so the bound is 1/1000.
:::

::: step
If $C$ survives in a run, the leaf on its path has $C$ as a cut, so MINIMUMCUT there returns a cut of capacity at most that of $C$; each smaller of two cuts above keeps that. So the run returns a minimum cut, and so does the best cut kept: $C$ or another one. Here: $B$ holds one.
:::

::: step
By [[thm:fast-mincut-probability]] the survival probability is $\Omega(1/\log n)$, so its inverse is logarithmic in $n$. Then $r$, which is the logarithm times that inverse (rounded up), is $\O(\log^2 n)$. Here: the inverse is at most 20, and $r$ is 139.
:::

::: step
One run takes time $\O(n^2 \log n)$ by [[prop:fast-mincut-time]]. So $r$ runs take $r \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$. Comparing the best cuts costs less than the runs. Here: 139 runs.
:::

::::

::: proof
Run $\textsf{FASTMINCUT}$ $r = \lceil \log n / P(n) \rceil = \O(\log^2 n)$ times independently and keep the best cut. A fixed minimum cut $C$ survives in none of the runs with
probability at most $(1 - P(n))^r \le e^{-r P(n)} \le e^{-\log n} = 1/n$, and a run in which it survives returns a minimum cut. The time is $r \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$ by
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

The proof makes the failure probability of one cut so small that a union bound over all minimum cuts still leaves a small total.

:::: walkthrough {for=thm:karger-stein-all}
```graph id=a03-ks-all widget=stepper
caption: The cycle $C_6$, whose minimum cuts are the 15 pairs of its edges. Step 1 dashes the pair $12$, $45$ as the cut $C$. Steps 2 to 6 mark $C$ again, each time in a new way. Step 7 colours two more pairs, step 8 fills all vertices, step 9 thickens all edges, step 10 makes them bold, step 11 fills the vertices.
intent: Proof walkthrough of the theorem. New (algorithms/03 p49 has no figure); the cycle is the tight example for the number of minimum cuts, as in exr:a03-cycle-min-cuts.
layout: fixed
1 @(0.6, 0.65); 2 @(1.8, 0.65); 3 @(2.4, 0); 4 @(1.8, -0.65); 5 @(0.6, -0.65); 6 @(0, 0)
1 -- 2 [id=e12]; 2 -- 3 [id=e23]; 3 -- 4 [id=e34]; 4 -- 5 [id=e45]; 5 -- 6 [id=e56]; 6 -- 1 [id=e61]
mark C: @e12 @e45
mark others: @e23 @e56 @e34 @e61
step: Run the algorithm $r$ times.
class cut: @e12 @e45
step: A run in which $C$ survives lists $C$.
class bold: @e12 @e45
step: One run fails to list $C$.
class highlight: @e12 @e45
step: All runs fail.
class current: @e12 @e45
step: A convenient upper bound.
class path: @e12 @e45
step: The choice of $r$.
class color3: @e12 @e45
step: The number of minimum cuts.
class color1: @e23 @e56
class color2: @e34 @e61
step: The union bound.
class color1: 1 2 3 4 5 6
step: All minimum cuts are listed.
unclass color1: 1 2 3 4 5 6
class tree: @e12 @e23 @e34 @e45 @e56 @e61
step: The number of runs.
class bold: @e12 @e23 @e34 @e45 @e56 @e61
step: The total time.
class highlight: 1 2 3 4 5 6
```


::: step
By [[thm:fast-mincut-probability]] there is a positive constant $a$ with $P(n) \ge a/\log n$. We run [[alg:fast-mincut|FASTMINCUT]] $r = \lceil 4 \log^2 n / a \rceil$ times, independently. A leaf reports all its minimum cuts; each call keeps all cuts of the smallest capacity it gets. Here: in the cycle, [[fig:a03-ks-all#C|the pair 12, 45]] is one minimum cut $C$.
:::

::: step
Suppose $C$ survives in a run. The leaf on its path has $C$ as a cut, of capacity $c(C)$; none is smaller, as it would be a smaller cut of $G$. So the leaf reports $C$, and no call above drops it: each keeps all cuts of smallest capacity. Here: the run lists the pair 12, 45.
:::

::: step
One run fails to list $C$ only if $C$ does not survive in it. The bound $P(n)$ is a lower bound on survival, so this has probability at most $1 - P(n)$. Here: $C$ is the pair 12, 45.
:::

::: step
All $r$ runs fail to list $C$ only if every run does. The runs are independent, so the probabilities multiply: all fail with probability at most $(1 - P(n))^r$. Here: this is the chance that no run lists the pair 12, 45.
:::

::: step
For every real $x$ we have $1 - x \le e^{-x}$, because the curve of the exponential lies above its tangent line at 0. Taking $x$ as the survival bound, we get $(1 - P(n))^r \le e^{-rP(n)}$.
:::

::: step
The bounds on $r$ and on the survival probability multiply to $rP(n) \ge 4 \log n$: the factor $a$ and the logarithm cancel. So $e^{-rP(n)} \le e^{-4\log n} = 1/n^4$. Here: for $n$ equal to 6 the bound is 1/1296 for each cut.
:::

::: step
We do not know which minimum cut we miss, so we count them. A graph with $n$ vertices has at most $\binom{n}{2}$ minimum cuts ([[cor:number-min-cuts]]). Here: every pair of the 6 edges is a cut, so $C_6$ has $\binom{6}{2} = 15$; the [[fig:a03-ks-all#others|other four edges]] show two more pairs.
:::

::: step
The union bound: the probability that at least one of several events happens is at most the sum of their probabilities. Each minimum cut is missed with probability at most $1/n^4$, so any is missed with probability at most $\binom{n}{2}/n^4 = \O(1/n^2)$. Here: 15/1296, about 0.012.
:::

::: step
If no minimum cut is missed, every entry of the list is a minimum cut, and every minimum cut appears at least once: no cut is smaller than a minimum cut, so the smallest capacity seen is the minimum, and all cuts of that capacity were found.
:::

::: step
The number of runs $r$ is $\O(\log^2 n)$, since $a$ is a constant. Without the lists, each run takes time $\O(n^2 \log n)$ by [[prop:fast-mincut-time]]. A run makes $\O(n^2)$ calls, so constant time per call for the lists keeps this bound. Here: for 1000 vertices a run makes about a million calls, 1 048 575.
:::

::: step
Store each cut as a pointer to its leaf plus a split of that leaf's at most 6 vertices. Each call keeps its list as a linked list headed by its capacity, so keeping the smaller list, or joining both on a tie, takes constant time. The times of the $r$ runs add up to $\O(n^2 \log^3 n)$.
:::

::::

<!-- REVIEW: plain FASTMINCUT returns one cut and with ties can miss a fixed C for ever; the run must list cuts, and the listing must not cost more than prop:fast-mincut-time -->
::: proof
Let each leaf of $\textsf{FASTMINCUT}$ list all its minimum cuts, and each call keep all cuts of the smallest capacity it gets; then a run lists every
minimum cut that survives in it. The probability of missing a specific minimum cut in one run is at most $1 - P(n)$ with $P(n) \ge a/\log n$ for some
constant $a > 0$ ([[thm:fast-mincut-probability]]). Run it $r = \lceil 4 \log^2 n / a \rceil = \O(\log^2 n)$ times and collect all cuts of the minimum
[[def:flow-network|capacity]] found. A specific minimum cut $C$ is missed with probability at most
$$(1 - P(n))^{r} \le e^{-r a / \log n} \le e^{-4 \log n} = \frac{1}{n^4}.$$
There are at most $\binom{n}{2}$ minimum cuts ([[cor:number-min-cuts]]), so by the union bound
$$\Pr[\text{missing any minimum cut}] \le \binom{n}{2} \cdot \frac{1}{n^4} = \O\!\left(\frac{1}{n^2}\right).$$
Store each cut as a pointer to its leaf plus a split of that leaf's at most $6$ vertices; each call keeps its list as a linked list headed by its
capacity, so keeping the smaller list, or joining both on a tie, takes constant time. The running time is $\O(\log^2 n) \cdot \O(n^2 \log n) = \O(n^2 \log^3 n)$.
:::

::: intuition
The same number of runs, only with a larger constant, pushes the failure probability for each single cut down to $1/n^4$, small enough to survive a
union bound over all (at most $\binom{n}{2}$) minimum cuts. Example: for the cycle $C_n$, which has $\binom{n}{2}$ minimum cuts
([[exr:a03-cycle-min-cuts]]), the algorithm lists all of them with probability $1 - \O(1/n^2)$.
:::
