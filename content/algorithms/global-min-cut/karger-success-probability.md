---
title: "How often Karger's algorithm succeeds"
course: algorithms
chapter: global-min-cut
order: 5
lectures: [a03]
stage: split
status: reviewed
---

::: lemma {#lem:karger-success title="One run finds a fixed minimum cut" source="algorithms/03 p43"}
Let $C$ be a minimum cut of $G$, $n \ge 2$. Then $\textsf{CONTRACT}(G)$ returns $C$ with probability at least
$$\prod_{i=0}^{n-3} \left(1 - \frac{2}{n - i}\right) = \prod_{i=0}^{n-3} \frac{n - i - 2}{n - i} = \binom{n}{2}^{-1} = \frac{2}{n(n - 1)}.$$
:::

The proof multiplies, over the $n - 2$ contractions, the chance that a contraction avoids $C$; each chance is bounded by counting edges. It has four parts: the first contraction, a later contraction, the product, and the end of the run.

Part 1, the first contraction: it picks an edge of $C$ with probability at most $2/n$.

:::: walkthrough {for=lem:karger-success}
```graph id=a03-ks-first widget=stepper
caption: Two copies of $K_4$ joined by the edges $15$ and $48$, the graph of [[fig:a03-karger-good]]. The dashed edges are the minimum cut $C$. Step 2 thickens the three edges at vertex $2$, step 3 all 14 edges, and step 4 fades every edge outside $C$.
intent: Proof walkthrough, part 1 of the lemma. New (the proof on algorithms/03 p43 has no example); the graph is the one of a03-karger-good (algorithms/03 p41 algorithm, own example), redrawn flatter to fit the figure box.
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14]; 2 -- 3 [id=e23]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58]; 6 -- 7 [id=e67]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark dv: @e12 @e23 @e24
mark all: @e12 @e13 @e14 @e23 @e24 @e34 @e56 @e57 @e58 @e67 @e68 @e78 @e15 @e48
step: The minimum cut $C$.
class cut: @e15 @e48
step: The edges at a vertex form a cut.
class bold: @e12 @e23 @e24
step: All the edges.
unclass bold: @e12 @e23 @e24
class highlight: @e12 @e13 @e14 @e23 @e24 @e34 @e56 @e57 @e58 @e67 @e68 @e78 @e15 @e48
step: The first contraction picks one edge.
unclass highlight: @e12 @e13 @e14 @e23 @e24 @e34 @e56 @e57 @e58 @e67 @e68 @e78
class muted: @e12 @e13 @e14 @e23 @e24 @e34 @e56 @e57 @e58 @e67 @e68 @e78
```

::: step
Let [[fig:a03-ks-first#C|$C$]] be a minimum cut of $G$ and suppose it has exactly $k$ edges. We write the proof for unweighted multigraphs; for capacities, we replace "number of edges" by "capacity" throughout. Here: $C$ is the two dashed edges $15$ and $48$, so $k$ is 2, and $n$ is 8.
:::

::: step
Take any vertex $v$. Its edges, [[fig:a03-ks-first#dv|$\delta(v)$]], separate $v$ from the other $n - 1$ vertices; both sides are non-empty because $n$ is at least 2. They form a cut. $C$ is minimum, so no cut has fewer than $k$ edges. Every $v$ has degree at least $k$. Here: vertex 2 has 3 edges; degrees are 3 or 4.
:::

::: step
Add the degrees. [[lem:handshake|The handshake lemma]] says the sum is twice the number of edges, also with parallel edges. Each of the $n$ degrees is at least $k$, so the sum is at least $n$ times $k$. Hence $\abs{E} \ge nk/2$. Here: the degrees add up to 28, twice [[fig:a03-ks-first#all|the 14 edges]], and 28 is at least 16.
:::

::: step
[[algorithms/global-min-cut/karger|The algorithm]] picks the first edge uniformly at random; parallel copies count separately. So it picks an edge of $C$ with probability $k/\abs{E}$. This is at most $2/n$: $\abs{E}$ is at least half of $n$ times $k$, and a larger denominator gives a smaller fraction. Here: 2 of 14 edges, 1 in 7, against the bound 1 in 4.
:::
::::

Part 2, a later contraction: if no edge of $C$ was contracted so far, the next one picks an edge of $C$ with probability at most $2/(n - i)$.

:::: walkthrough {for=lem:karger-success}
```graph id=a03-ks-later widget=stepper
caption: The graph of part 1 after three contractions of a run that avoided $C$: $6$ with $7$, then $8$ into them, then $1$ with $4$. Step 2 fills one side of $C$ and dashes $C$. Step 3 thickens the four edges at the vertex $678$. Step 4 fades every edge outside $C$.
intent: Proof walkthrough, part 2 of the lemma. New (the lecture's proof on algorithms/03 p43 has no example); the first three contractions are those of the run in the player of a03-karger-good (seed 5, algorithms/03 p41 algorithm).
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14]; 2 -- 3 [id=e23]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58]; 6 -- 7 [id=e67]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark dv: @e56 @e57 @e58 @e48
step: Three contractions avoided $C$.
merge 6 7 -> 67
merge 67 8 -> 678
merge 1 4 -> 14
mark merged: 14 678
step: $C$ is still a cut.
class cut: @e15 @e48
class color1: 14 2 3
step: A cut of $G_i$ is a cut of $G$.
class highlight: @e56 @e57 @e58 @e48
step: The next contraction.
unclass highlight: @e56 @e57 @e58 @e48
class muted: @e12 @e13 @e23 @e24 @e34 @e56 @e57 @e58
```

::: step
Fix $i$ with $i \le n - 3$; suppose none of the first $i$ contractions chose an edge of $C$. Each contraction removes one vertex, so $G_i$ has $n - i$ vertices, at least 3. Here: $i$ is 3; 6 with 7, then 8, then 1 with 4 are merged into [[fig:a03-ks-later#merged|the vertices 678 and 14]]; 5 vertices remain.
:::

::: step
$C$ is still a cut of $G_i$. Contracted edges lie outside $C$, so their ends are on one side; each merged vertex lies on one side. No edge of $C$ lay inside a merged vertex, so all $k$ edges of $C$ remain, joining the two non-empty sides. Here: 14, 2, 3 (filled) against 5, 678; both dashed edges remain.
:::

::: step
The minimum cut of $G_i$ has exactly $k$ edges. Each cut of $G_i$ is a cut of $G$ with as many edges ([[obs:identification-cuts]], once per contraction). $G$ has no cut with fewer than $k$ edges, so neither has $G_i$. $C$ has $k$. Here: [[fig:a03-ks-later#dv|the four edges at 678]] are a cut of $G$ too; 4 is at least 2.
:::

::: step
Repeat part 1 for $G_i$: each vertex has at least $k$ edges, as its edges form a cut. By [[lem:handshake|the handshake lemma]] $G_i$ has at least $(n-i)k/2$ edges. The next contraction picks a uniform random edge, so it hits $C$ with probability at most $2/(n-i)$. Here: $G_3$ has 10 edges, 2 in $C$: 1 in 5, below 2 in 5.
:::
::::

Part 3, the product: we multiply these bounds over all contractions.

:::: walkthrough {for=lem:karger-success}
```graph id=a03-ks-product widget=stepper
caption: The graph of part 1 with the six edges that one run contracts, numbered in the order of contraction (when a contraction joins merged vertices, one of the parallel edges it stands for is drawn). The dashed edges are $C$. Step 2 marks the first contraction, step 3 all six, and step 4 recolours the six thick edges. Step 5 fades them, step 6 thickens $C$.
intent: Proof walkthrough, part 3 of the lemma (the product). New (the proof on algorithms/03 p43 has no example); the contractions are those of the run in the player of a03-karger-good (seed 5, algorithms/03 p41).
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12 label=5]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14 label=3]; 2 -- 3 [id=e23 label=6]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58 label=4]; 6 -- 7 [id=e67 label=1]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78 label=2]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark run: @e67 @e78 @e14 @e58 @e12 @e23
mark first: @e67
step: Six contractions, none in $C$.
class cut: @e15 @e48
class tree: @e67 @e78 @e14 @e58 @e12 @e23
step: The first factor has no condition.
class current: @e67
step: Every factor is bounded.
class current: @e78 @e14 @e58 @e12 @e23
step: Multiply the bounds.
unclass current: @e67 @e78 @e14 @e58 @e12 @e23
unclass tree: @e67 @e78 @e14 @e58 @e12 @e23
class highlight: @e67 @e78 @e14 @e58 @e12 @e23
step: The product telescopes.
unclass highlight: @e67 @e78 @e14 @e58 @e12 @e23
class muted: @e67 @e78 @e14 @e58 @e12 @e23
step: The bound is $1/\binom{n}{2}$.
class bold: @e15 @e48
```

::: step
The loop of [[alg:karger|CONTRACT]] runs while at least 3 vertices are left, and each contraction removes one vertex: $n - 2$ contractions. Let $A_j$ be the event that the $j$-th contraction avoids $C$. We bound the probability that $A_1, \dots, A_{n-2}$ all happen. Here: [[fig:a03-ks-product#run|six edges]] are contracted; none is dashed.
:::

::: step
By the chain rule, the probability of all events is a product of conditional probabilities: $\Pr[A_1 \cap \dots \cap A_{n-2}] = \prod_{i=0}^{n-3} \Pr[A_{i+1} \mid A_1 \cap \dots \cap A_i]$. The factor for $i = 0$ has no condition. Here: [[fig:a03-ks-product#first|the first contraction]] gives the first factor.
:::

::: step
By part 2, given that the first $i$ contractions avoided $C$, the next one avoids $C$ with probability at least $1 - 2/(n-i)$. This equals $(n-i-2)/(n-i)$, which is positive because $n - i$ is at least 3. Here: the six bounds are 6/8, 5/7, 4/6, 3/5, 2/4 and 1/3.
:::

::: step
All factors are non-negative, and we replace each by a smaller number, so the product can only decrease. Hence $\Pr[A_1 \cap \dots \cap A_{n-2}] \ge \prod_{i=0}^{n-3} \frac{n-i-2}{n-i}$. Here: the six bounds multiply to 720 over 20160.
:::

::: step
The numerator is the factorial of $n - 2$. The denominator, the product of 3 up to $n$, is half of the factorial of $n$: it lacks the factors 2 and 1. The factorial of $n$ is $n(n-1)$ times the factorial of $n - 2$, so the quotient is $2/(n(n-1))$. Here: 720 over 20160 is 1 in 28.
:::

::: step
Since $\binom{n}{2} = n(n-1)/2$, this is $1/\binom{n}{2}$, the number of the lemma. So no edge of $C$ is contracted with at least this probability. Part 4 shows that the run then returns $C$. Here: $\binom{8}{2}$ is 28, so $C$ survives with probability at least 1 in 28.
:::
::::

Part 4, the end of the run: if no edge of $C$ was contracted, the returned cut is $C$.

:::: walkthrough {for=lem:karger-success}
```graph id=a03-ks-end widget=stepper
caption: The run of part 3. Thick edges are contracted. Step 2 fills the vertices of one side of $C$ and dashes $C$. Step 3 merges each side into one vertex. Step 4 rings the two remaining vertices.
intent: Proof walkthrough, part 4 of the lemma (the end of the run). New (the proof on algorithms/03 p43 has no example); the contractions are those of the run in the player of a03-karger-good (seed 5, algorithms/03 p41).
layout: fixed
2 @(0, 0.65); 1 @(1.2, 0.65); 3 @(0, -0.65); 4 @(1.2, -0.65); 5 @(2.6, 0.65); 6 @(3.8, 0.65); 8 @(2.6, -0.65); 7 @(3.8, -0.65)
1 -- 2 [id=e12]; 1 -- 3 [id=e13]; 1 -- 4 [id=e14]; 2 -- 3 [id=e23]; 2 -- 4 [id=e24]; 3 -- 4 [id=e34]; 5 -- 6 [id=e56]; 5 -- 7 [id=e57]; 5 -- 8 [id=e58]; 6 -- 7 [id=e67]; 6 -- 8 [id=e68]; 7 -- 8 [id=e78]; 1 -- 5 [id=e15]; 4 -- 8 [id=e48]
mark C: @e15 @e48
mark run: @e67 @e78 @e14 @e58 @e12 @e23
step: Six contractions, none in $C$.
class tree: @e67 @e78 @e14 @e58 @e12 @e23
step: Each remaining vertex lies on one side.
class color1: 1 2 3 4
class cut: @e15 @e48
step: The two vertices are the two sides.
merge 1 2 3 4 -> A [class=color1]
merge 5 6 7 8 -> B
step: The returned cut is $C$.
class highlight: A B
```

::: step
Suppose that no contraction chose an edge of $C$. The run makes $n - 2$ contractions, and each removes one vertex, so $n - (n - 2) = 2$ vertices remain. Here: [[fig:a03-ks-end#run|the six thick edges]] are contracted; none belongs to $C$. What are the two remaining vertices?
:::

::: step
Let $A$ and $B$ be the two sides of $C$. Each contracted edge lies outside $C$, so its ends are on the same side. A remaining vertex is a set of original vertices joined by contracted edges, so all lie on one side. Here: $A$ is 1, 2, 3, 4 (filled), $B$ is 5, 6, 7, 8; [[fig:a03-ks-end#C|$C$]] is dashed.
:::

::: step
$A$ and $B$ are both non-empty, because $C$ is a cut. The remaining vertices contain all vertices, and each lies on one side. If both lay in $A$, then $B$ would be empty. So one lies in $A$ and one in $B$, and each is a whole side. Here: the run ends with the vertices $A$ and $B$.
:::

::: step
[[algorithms/global-min-cut/karger|The algorithm]] returns the edges between the two remaining vertices: the edges between $A$ and $B$, that is, $C$. So this event implies that the run returns $C$, and the probability of returning $C$ is at least that of the event, which part 3 bounds. Here: the edges $15$ and $48$.
:::
::::

::: proof
We write it for unweighted multigraphs; for capacities, replace "number of edges" by "capacity" throughout. Suppose $C$ has exactly $k$ edges.
Every $\delta(v)$ is a cut, so the minimum degree of $G$ is at least $k$, and $\abs{E} \ge nk/2$. The probability that the first contraction
chooses an edge of $C$ is therefore
$$\frac{k}{\abs{E}} \le \frac{k}{nk/2} = \frac{2}{n}.$$
If no edge of $C$ has been contracted so far, then after $i$ contractions the graph has $n - i$ vertices, $C$ is still a cut of it (no edge of $C$
lies inside a merged vertex), and every cut of it is a cut of $G$ ([[obs:identification-cuts]]); so its minimum cut still has $k$ edges and the same
argument bounds the probability that the $(i + 1)$-th contraction chooses an edge of $C$ by $2/(n - i)$. Multiplying the conditional probabilities of
avoiding $C$ in the contractions $1, \dots, n - 2$ gives the product, which telescopes:
$$\prod_{i=0}^{n-3} \frac{n - i - 2}{n - i} = \frac{(n-2)(n-3)\cdots 1}{n(n-1)\cdots 3} = \frac{2}{n(n-1)}.$$
Finally, if no edge of $C$ was ever contracted, each of the two remaining vertices consists of vertices of one side of $C$; both sides are
non-empty, so the two vertices are exactly the two sides and the returned cut is $C$.
:::

::: intuition
Early contractions are very safe: an edge of a minimum cut is a small fraction of all edges, because every vertex has at least as many edges as the
minimum cut. The danger grows as the graph shrinks, and the product of the survival chances is $1 / \binom{n}{2}$. Example: for $n = 5$ the bound is
$\frac{3}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} = \frac{1}{10}$. For the graph of [[fig:a03-karger-good]] the true probability is much higher than the
bound $1/28$, since the minimum cut has only $2$ of the $14$ edges.
:::

::: corollary {#cor:number-min-cuts title="Number of minimum cuts" source="algorithms/03 p49"}
A graph with $n$ vertices has at most $\binom{n}{2}$ minimum cuts.
:::

The lecture states this without proof.

::: intuition
A probabilistic algorithm proves a purely combinatorial fact: since each minimum cut has a fair chance of being the single output, there cannot be
many of them. The bound is tight for the cycle $C_n$ ([[exr:a03-cycle-min-cuts]]). Example: the graph of [[fig:a03-karger-good]] has exactly one
minimum cut, far below $\binom{8}{2} = 28$.
:::

So a single run succeeds with probability at least $2/(n(n-1))$, which is small. But we can run the algorithm many times and take the smallest cut.
How many times?

::: theorem {#thm:karger-iterate title="Iterating CONTRACT" source="algorithms/03 p44"}
Let $C$ be a minimum cut of $G$ and $k \in \N$. The probability that $\textsf{CONTRACT}$ does not return $C$ in any of $kn^2$ independent runs is at
most $e^{-2k}$.
:::

The proof turns the success probability of one run into a failure probability for many independent runs, in three inequalities.

:::: walkthrough {for=thm:karger-iterate}
::: step
By [[lem:karger-success]], one run misses $C$ with probability at most $1 - \frac{2}{n(n-1)}$. The runs are independent, so all $kn^2$ miss $C$ with the product of their probabilities: at most this number to the power $kn^2$. Here: $n$ is 8, $k$ is 1: 64 runs, each missing with probability at most 27/28; the product is at most 0.098.
:::

::: step
Since $n(n-1) \le n^2$, the base is at most $1 - 2/n^2$. Both bases lie between 0 and 1, because $n$ is at least 2, so raising them to the same power keeps the inequality. Here: 27/28 is about 0.964 and 31/32 is about 0.969; the product of 64 factors is at most 0.132.
:::

::: step
The inequality $1 - x \le e^{-x}$ holds for every real $x$: the line $1 - x$ is the tangent of the convex curve $e^{-x}$ at 0, and a convex curve lies above its tangent. Here: for $x$ equal to 1/32, the base 31/32 is below $e^{-x}$, which is about 0.969.
:::

::: step
Put $x = 2/n^2$. Then the base $1 - x$ is at most $e$ to the power $-x$. Both are non-negative, so raising to the power of the number of runs keeps the inequality. The exponents multiply to $2k$, since $kn^2$ times $2/n^2$ is $2k$. We get $e^{-2k}$. Here: $e^{-2}$ is about 0.135, above the bound 0.132.
:::
::::

::: proof
By [[lem:karger-success]] and independence, using $1 - x \le e^{-x}$:
$$\left(1 - \frac{2}{n(n-1)}\right)^{kn^2} \le \left(1 - \frac{2}{n^2}\right)^{kn^2} \le e^{-\frac{2}{n^2} \cdot kn^2} = e^{-2k}.$$
:::

::: intuition
Each run is a lottery ticket with a chance of about $2/n^2$; with $kn^2$ tickets you expect about $2k$ wins, and the chance of none decays
exponentially in $k$. Example: for $n = 10$, $10 n^2 = 1000$ runs miss a given minimum cut with probability at most $e^{-20} \approx 2 \cdot 10^{-9}$.
:::

<!-- REVIEW: the lecture writes "n² times: correct with probability more than 1 − 1/e"; the theorem with k = 1 gives the stronger 1 − e^{−2} ≈ 0.86, which is stated here (1 − e^{−2} > 1 − 1/e). -->
Practical consequences ($\log$ is the natural logarithm here):

- $10n^2$ runs: correct with probability at least $1 - e^{-20} > 0.99999999$;
- $n^2$ runs: correct with probability at least $1 - e^{-2} \approx 0.86$ (in particular more than $1 - 1/e$);
- $kn^2$ runs with $k = \lceil \log n \rceil$, about $n^2 \log n$: correct with probability at least $1 - 1/n^2$.

::: definition {#def:whp title="With high probability" defines="with high probability, WHP" source="algorithms/03 p45"}
An event depending on the input size $n$ happens **with high probability** (WHP) if its probability is at least $1 - 1/n$.
:::

::: intuition
"With high probability" means the failure probability shrinks with the input size, not just that it is small for one $n$. Example: $n^2 \lceil \log n \rceil$ runs of
$\textsf{CONTRACT}$ fail with probability at most $1/n^2 \le 1/n$, so they find a minimum cut WHP. Non-example: a fixed success probability $0.99$ is not
WHP, since $1 - 1/n > 0.99$ for $n > 100$.
:::

::: theorem {#thm:karger-whp title="Karger's algorithm" source="algorithms/03 p45"}
Running Karger's algorithm $\O(n^2 \log n)$ times gives a minimum cut [[def:whp|with high probability]] and takes time $\O(n^4 \log n)$.
:::

The proof chooses $k$ in the iteration theorem so that the failure probability is at most $1/n$, then counts the runs and their time.

:::: walkthrough {for=thm:karger-whp}
::: step
We choose $k = \lceil (\log n)/2 \rceil$ in [[thm:karger-iterate]]. A ceiling is at least its argument, so $2k$ is at least $\log n$. Since $e^{-x}$ decreases, $kn^2$ runs miss a fixed minimum cut with probability at most $e^{-2k} \le e^{-\log n} = 1/n$. Here: $n$ is 8, $k$ is 2: 128 runs miss with probability at most 0.019.
:::

::: step
Now we count the runs. We have $k < (\log n)/2 + 1$. For $n \ge 8$ we have $\log n \ge 2$, so $1 \le (\log n)/2$ and $k \le \log n$. Hence $kn^2 = \O(n^2 \log n)$. Here: 128 runs, against $n^2 \log n$, which is about 133.
:::

::: step
The algorithm keeps the smallest cut it has seen. As soon as one run returns the minimum cut $C$, the smallest cut is minimum. So it fails only if all runs miss $C$, which has probability at most $1/n$. The success probability is at least $1 - 1/n$, which is [[def:whp|with high probability]]. Here: failure at most 1 in 8.
:::

::: step
A run makes $n - 2$ contractions, each in time $\O(n)$ with a matrix of capacities ([[algorithms/global-min-cut/karger|the complexity of one run]]), so it takes $\O(n^2)$. Keeping the smallest cut adds at most $\O(n)$ per run. All runs take $\O(n^2 \log n) \cdot \O(n^2) = \O(n^4 \log n)$. Here: 128 runs of about 64 steps, 8192 in all.
:::
::::

::: proof
Take $k = \lceil (\log n) / 2 \rceil$ in [[thm:karger-iterate]]: $kn^2 = \O(n^2 \log n)$ runs miss a fixed minimum cut with probability at most
$e^{-2k} \le e^{-\log n} = 1/n$. Each run takes $\O(n^2)$, which gives $\O(n^4 \log n)$ in total.
:::

::: intuition
Polynomially many repetitions turn a tiny success probability into near certainty, but the price is high: $\O(n^4 \log n)$ is slower than
Stoer–Wagner's $\O(nm + n^2 \log n)$ ([[prop:stoer-wagner-time]]). The next section fixes this. Example: for $n = 100$ this is about $100^4 \cdot 4.6 \approx 5 \cdot 10^8$ steps.
:::
