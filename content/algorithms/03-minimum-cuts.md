---
title: Minimum cuts
course: algorithms
lecture: 3
slug: a03
summary: Minimum cuts in undirected networks. Gomory–Hu trees answer all pairs with n − 1 flow computations; node identification, the Stoer–Wagner algorithm and Karger's random contractions (with the Karger–Stein speed-up) find the global minimum cut.
prerequisites: [algorithms/02-maximum-flow, algorithms/01-minimum-spanning-trees]
sources:
  - resources/graph-algorithms/03-cuts.pdf
status: draft
---

The previous lecture computed a minimum cut between **one** source and **one** sink. This lecture asks two broader questions about an
undirected network. First, how well is **every pair** of vertices connected? With $n$ vertices there are $\binom{n}{2}$ pairs, but the
answer to all of them fits into a single tree with $n - 1$ edges, and $n - 1$ maximum-flow computations suffice to build it (Gomory and Hu).
Second, where is the **weakest spot of the whole network**, the cheapest set of edges whose removal disconnects it? Such cuts happen in practice:
a 75-year-old woman cut off the internet in Georgia (and parts of Armenia) for about 12 hours with a garden spade, sharks have been biting
undersea internet cables, and states worry about sabotage of the cables under the sea. The global minimum cut can be found without
computing any flow (Stoer and Wagner), or by contracting random edges and trusting probability (Karger).

## Summary

- Undirected cuts $\delta(U) = \delta(V \setminus U)$; $f_G(s, t)$ is the minimum [[def:flow-network|capacity]] of an $s$–$t$ cut, one max [[def:flow|flow]] with two opposite arcs per edge
  ([[def:undirected-cut]]). [[def:node-identification|Identifying]] $v$ and $w$ keeps exactly the cuts not separating them ([[obs:identification-cuts]]).
- A [[def:gomory-hu-tree|Gomory–Hu tree]] encodes all $f_G(s, t)$: the minimum on the tree path ([[prop:gomory-hu-path]]), and each tree edge gives a
  minimum cut ([[obs:gomory-hu-edge]]). It exists and is built with $n - 1$ minimum cut computations ([[alg:gomory-hu]], [[thm:gomory-hu]]).
- Key tools: uncrossing ([[lem:cut-submodular]]), the Gomory–Hu lemma ([[lem:gomory-hu]]) and contracting one side of a minimum cut
  ([[cor:gomory-hu-contraction]]), the triangle inequalities ([[lem:flow-triangle]], [[lem:flow-triangle-path]]).
- [[def:global-min-cut|Global minimum cut]] $\lambda(G)$: $n - 1$ flows give $\O(n^4)$ ([[prop:global-cut-flows]]);
  $\lambda(G) = \min(\lambda(G_{vw}), \lambda(G; v, w))$ ([[cor:identification-mincut]]).
- Stoer–Wagner: the last vertex $t$ of a "most tightly connected" order gives a minimum $s$–$t$ cut $\delta(t)$ ([[thm:mincut-phase]]); identify $s, t$ and
  repeat; $\O(nm + n^2 \log n)$ ([[alg:stoer-wagner]], [[prop:stoer-wagner-time]]).
- Karger: random [[def:edge-contraction|contraction]] finds a fixed minimum cut with probability $\ge 2/(n(n-1))$ ([[lem:karger-success]]), so there are at most $\binom{n}{2}$
  minimum cuts ([[cor:number-min-cuts]]); $\O(n^2 \log n)$ runs give $\O(n^4 \log n)$ [[def:whp|WHP]] ([[thm:karger-whp]]).
- Karger–Stein: contract to $\lceil 1 + n/\sqrt{2} \rceil$ vertices and recurse twice; success $\Omega(1/\log n)$ per run, $\O(n^2 \log^3 n)$ for one or all minimum
  cuts WHP ([[thm:karger-stein]], [[thm:karger-stein-all]]).

## Exercises

```graph id=a03-ex-gomory-hu-value widget=exercise
task: answer
prompt: This is a [[def:gomory-hu-tree|Gomory–Hu tree]] of some network $G$. What is the capacity of a minimum $x$–$z$ cut in $G$?
answer: 6
hint: Use [[prop:gomory-hu-path]]: look at the path from $x$ to $z$ in the tree.
solution: The $x$–$z$ path in the tree is $x, u, v, z$ with capacities $9, 6, 11$, so $f_G(x, z) = \min(9, 6, 11) = 6$. A minimum cut is given by the component $\set{x, u, y}$ of the tree minus the edge $uv$.
layout: fixed
x @(0, 0); u @(1.5, 0); y @(1.5, 1.3); v @(3, 0); z @(4.5, 0); q @(3, -1.3)
x -- u [w=9]; u -- y [w=4]; u -- v [w=6]; v -- z [w=11]; v -- q [w=7]
```

```graph id=a03-ex-global-cut widget=exercise
task: select-vertices
prompt: Select one side $S$ of a [[def:global-min-cut|global minimum cut]] $\delta(S)$ of this network (edge labels are capacities).
check: is-global-min-cut-side
hint: Single vertices are cheap to cut off in many graphs, but compute $c(\delta(v))$ here: every vertex has at least $9$.
hint: Look for two dense groups that are joined by light edges.
solution: $S = \set{a, b, c}$ (or its complement $\set{d, e, f}$): $\delta(S) = \set{ad, cf, be}$ has capacity $2 + 1 + 1 = 4 = \lambda(G)$.
layout: fixed
a @(0, 1); b @(-1, 0); c @(0, -1); d @(2, 1); e @(3, 0); f @(2, -1)
a -- b [c=4]; b -- c [c=5]; a -- c [c=3]; d -- e [c=4]; e -- f [c=3]; d -- f [c=5]; a -- d [c=2]; c -- f [c=1]; b -- e [c=1 bend=-0.9]
```

```graph id=a03-ex-mincut-phase widget=exercise
task: simulate
algo: stoer-wagner
params: start=a phases=1
prompt: Perform one $\textsf{MINCUTPHASE}$ starting from $U = \set{a}$: click the vertices in the order in which they are added to $U$.
hint: The next vertex is the one with the largest total capacity of edges into the current $U$ ([[def:tightly-connected]]); edges to vertices outside $U$ do not count.
solution: The order is $a, b, c, d, e$, with keys $c(U, b) = 3$, $c(U, c) = 1 + 4 = 5$, $c(U, d) = 2 + 5 = 7$, $c(U, e) = 2 + 3 + 1 = 6$. So $s = d$, $t = e$, and $\delta(e)$ of capacity $6$ is a minimum $d$–$e$ cut.
layout: fixed
a @(0, 0); b @(1.5, 1); c @(1.5, -0.2); d @(3, 0.4); e @(1.5, -1.4)
a -- b [c=3]; a -- c [c=1]; a -- e [c=2]; b -- c [c=4]; b -- d [c=2]; c -- d [c=5]; d -- e [c=1]; c -- e [c=3]
```

:::: exercise {#exr:a03-distinct-values title="Few distinct values" difficulty=1}
Show that among the $\binom{n}{2}$ values $f_G(s, t)$, $s \ne t$, of an [[def:undirected-cut|undirected network]] there are at most $n - 1$ different ones.

::: solution
By [[thm:gomory-hu]], $G$ has a [[def:gomory-hu-tree|Gomory–Hu tree]] $T$, and by [[prop:gomory-hu-path]] every $f_G(s, t)$ equals the [[def:flow-network|capacity]] of some
edge of $T$. A tree on $n$ vertices has $n - 1$ edges.
:::
::::

:::: exercise {#exr:a03-lambda-from-tree title="Global minimum cut from the tree" difficulty=1}
Let $T$ be a [[def:gomory-hu-tree|Gomory–Hu tree]] of $G$. Show that $\lambda(G)$ is the minimum capacity of an edge of $T$, and that removing a
lightest edge of $T$ yields a global minimum cut.

::: solution
By [[prop:global-cut-flows]], $\lambda(G) = \min_{s \ne t} f_G(s, t)$ (the minimum over all pairs is at most the minimum over the pairs containing a fixed
$s$, and at least $\lambda(G)$). By [[prop:gomory-hu-path]] each $f_G(s, t)$ is the minimum over a tree path, so the overall minimum is the lightest edge $e = uv$
of $T$ (the pair $u, v$ attains it). By [[obs:gomory-hu-edge]], a component $U$ of $T - e$ gives a minimum $u$–$v$ cut $\delta_G(U)$ of capacity
$w(e) = \lambda(G)$, which is a global minimum cut.
:::
::::

:::: exercise {#exr:a03-tree-not-subgraph title="Tree edges need not be edges" difficulty=1}
Find a network $G$ and a [[def:gomory-hu-tree|Gomory–Hu tree]] of it that contains an edge which is not an edge of $G$.

::: solution
Let $G = C_4$ with vertices $1, 2, 3, 4$ in this order and all capacities $1$. Every pair $s, t$ is joined by two edge-disjoint paths, and every
$\delta(v)$ has capacity $2$, so $f_G(s, t) = 2$ for all pairs. The star with centre $1$ and capacities $2$ is a Gomory–Hu tree: the path minima are $2$,
and removing the edge $1v$ cuts off $\set{v}$, whose cut $\delta(v)$ is a minimum cut for every pair separated by it. Its edge $13$ is not an edge of $C_4$.
:::
::::

:::: exercise {#exr:a03-cycle-min-cuts title="The bound is tight" difficulty=2}
Show that the cycle $C_n$ ($n \ge 3$, all capacities $1$) has exactly $\binom{n}{2}$ [[def:global-min-cut|minimum cuts]], so the bound of
[[cor:number-min-cuts]] is tight.

::: solution
Every cut of $C_n$ contains at least $2$ edges: deleting a single edge leaves a path, which is connected. Deleting any $2$ of the $n$ edges leaves two
non-empty paths, i.e. the edge sets of size $2$ are exactly $\delta(S)$ for the vertex sets $S$ of the two arcs. So the minimum cuts are exactly the
$\binom{n}{2}$ pairs of edges, and different pairs are different cuts.
:::
::::

:::: exercise {#exr:a03-uniform-weighted title="Weights matter" difficulty=2}
Let $0 < \varepsilon < 1/k$. The graph $G_k$ has the path $b_1 b_2 \dots b_k$ with capacity $1$ on each edge, and a vertex $a$ joined to every $b_i$
by an edge of capacity $\varepsilon$. Suppose $\textsf{CONTRACT}$ chooses edges **uniformly**, ignoring the capacities (and keeps parallel edges). Show
that it returns the minimum cut of $G_k$ with probability $\frac{(k-1)!\,k!}{(2k-1)!}$, which for $k \ge 3$ is below the bound $2/(n(n-1))$ of
[[lem:karger-success]] ($n = k + 1$).

::: hint
Which cut is the minimum cut, and which edges must never be contracted? Count the edges of each kind while the path shrinks.
:::

::: solution
Every cut other than $\delta(a)$ separates two vertices of the path, so it contains a path edge of capacity $1 > k\varepsilon = c(\delta(a))$. So
$\delta(a)$ is the unique [[def:global-min-cut|minimum cut]], and it is returned iff no edge at $a$ is ever contracted, i.e. iff all $k - 1$ path edges
are contracted first. Contracting a path edge merges two consecutive groups of $b$'s; the edges at $a$ stay ($k$ of them, some becoming parallel),
and the groups still form a path. When $j$ path edges are left, a uniform choice takes a path edge with probability $j/(j + k)$, so the
success probability is
$$\prod_{j=1}^{k-1} \frac{j}{j + k} = \frac{(k-1)!\,k!}{(2k-1)!}.$$
For $k = 3$ this is $\frac{2}{5} \cdot \frac{1}{4} = \frac{1}{10} < \frac{1}{6} = \frac{2}{4 \cdot 3}$, and it decreases roughly like $4^{-k}$, while
$2/(n(n-1))$ decreases only polynomially. The lemma fails because its proof needs $c(E) \ge nk/2$ in the same units in which edges are chosen; choosing
with probability $c(e)/c(E)$, as the lecture prescribes, makes the light edges at $a$ unlikely to be contracted.
:::
::::

:::: quiz {#q:a03-gh-flows}
How many minimum $s$–$t$ cut (maximum [[def:flow|flow]]) computations does the Gomory–Hu construction perform on a network with $n = 10$ vertices?

answer: 9

::: explanation
One per round, and there are $n - 1 = 9$ rounds ([[alg:gomory-hu]], [[thm:gomory-hu]]), instead of $\binom{10}{2} = 45$ for all pairs separately.
:::
::::

:::: quiz {#q:a03-karger-prob}
A lower bound on the probability that one run of $\textsf{CONTRACT}$ returns a fixed minimum cut of a graph with $n = 5$ vertices is $2/(n(n-1))$. What
is its value?

answer: 0.1
tolerance: 0.001

::: explanation
$2/(5 \cdot 4) = 1/10$ ([[lem:karger-success]]); as a product, $\frac{3}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} = \frac{1}{10}$.
:::
::::

:::: quiz {#q:a03-phase-global}
Is the cut of a phase, $\delta(t)$, always a global minimum cut of the current graph?

- [ ] Yes
- [x] No

::: explanation
It is a minimum $s$–$t$ cut for the last two vertices $s, t$ of the phase ([[thm:mincut-phase]]), not necessarily a global minimum cut. In the lecture
network, phase 1 gives $\delta(d)$ of capacity $14$, while $\lambda(G) = 13$.
:::
::::

:::: quiz {#q:a03-sw-time}
What is the running time of the Stoer–Wagner algorithm with Fibonacci heaps?

- [ ] $\O(n^4)$
- [ ] $\O(n^2 m)$
- [x] $\O(nm + n^2 \log n)$
- [ ] $\O(n^2 \log^3 n)$

::: explanation
$n - 1$ phases, each $\O(m + n \log n)$ with a Fibonacci heap ([[prop:stoer-wagner-time]]). $\O(n^4)$ is the $n - 1$ max-flow method, and
$\O(n^2 \log^3 n)$ is Karger–Stein.
:::
::::
