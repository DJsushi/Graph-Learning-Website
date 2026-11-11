---
title: "How often Karger's algorithm succeeds"
course: algorithms
chapter: global-min-cut
order: 5
lectures: [a03]
stage: split
status: draft
---

::: lemma {#lem:karger-success title="One run finds a fixed minimum cut" source="algorithms/03 p43"}
Let $C$ be a minimum cut of $G$, $n \ge 2$. Then $\textsf{CONTRACT}(G)$ returns $C$ with probability at least
$$\prod_{i=0}^{n-3} \left(1 - \frac{2}{n - i}\right) = \prod_{i=0}^{n-3} \frac{n - i - 2}{n - i} = \binom{n}{2}^{-1} = \frac{2}{n(n - 1)}.$$
:::

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

::: proof
The events "$\textsf{CONTRACT}(G)$ returns $C$" for different minimum cuts $C$ are disjoint, and each has probability at least $1/\binom{n}{2}$ by
[[lem:karger-success]]. The probabilities sum to at most $1$.
:::

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
- $n^2 \log n$ runs ($k = \log n$): correct with probability at least $1 - 1/n^2$.

::: definition {#def:whp title="With high probability" defines="with high probability, WHP" source="algorithms/03 p45"}
An event depending on the input size $n$ happens **with high probability** (WHP) if its probability is at least $1 - 1/n$.
:::

::: intuition
"With high probability" means the failure probability shrinks with the input size, not just that it is small for one $n$. Example: $n^2 \log n$ runs of
$\textsf{CONTRACT}$ fail with probability at most $1/n^2 \le 1/n$, so they find a minimum cut WHP. Non-example: a fixed success probability $0.99$ is not
WHP, since $1 - 1/n > 0.99$ for $n > 100$.
:::

::: theorem {#thm:karger-whp title="Karger's algorithm" source="algorithms/03 p45"}
Running Karger's algorithm $\O(n^2 \log n)$ times gives a minimum cut [[def:whp|with high probability]] and takes time $\O(n^4 \log n)$.
:::

::: proof
Take $k = \lceil (\log n) / 2 \rceil$ in [[thm:karger-iterate]]: $kn^2 = \O(n^2 \log n)$ runs miss a fixed minimum cut with probability at most
$e^{-2k} \le e^{-\log n} = 1/n$. Each run takes $\O(n^2)$, which gives $\O(n^4 \log n)$ in total.
:::

::: intuition
Polynomially many repetitions turn a tiny success probability into near certainty, but the price is high: $\O(n^4 \log n)$ is slower than
Stoer–Wagner's $\O(nm + n^2 \log n)$ ([[prop:stoer-wagner-time]]). The next section fixes this. Example: for $n = 100$ this is about $100^4 \cdot 4.6 \approx 5 \cdot 10^8$ steps.
:::
