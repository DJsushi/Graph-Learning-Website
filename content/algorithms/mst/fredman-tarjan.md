---
title: "The Fredman–Tarjan algorithm"
course: algorithms
chapter: mst
order: 13
lectures: [a01]
stage: split
status: draft
---

### Going beyond Jarník: Fredman–Tarjan

Jarník's algorithm takes $\O(m \cdot t_{\text{DECREASE-KEY}} + n \cdot t_{\text{EXTRACT-MIN}})$; with Fibonacci heaps this is $\O(m + n \log n)$. Can we get rid of
the $n \log n$ term and reach $\O(m)$? The $\log n$ comes from `EXTRACT-MIN` on a heap that may accumulate $\Theta(n)$ neighbouring vertices. **If the heap
size never exceeded $k$, we would get $\O(m + n \log k)$.** So: limit the heap size, and never do `EXTRACT-MIN` on a large heap.

::: algorithm {#alg:fredman-tarjan title="Fredman–Tarjan algorithm (one phase)" source="algorithms/01 p28–29"}
```pseudo
fix the heap size limit k                                          // @limit
while some vertex is not in any tree of this phase do              // @loop
    start Jarník's algorithm from such a vertex, growing a tree T   // @start
    stop growing T as soon as                                      // @stop
        its heap holds more than k neighbours (overflow), or
        T reaches a vertex of an earlier tree T_i (T is attached to T_i), or
        T spans its whole component (T is finished)
contract every tree to a single vertex, obtaining G'               // @contract
```
The algorithm repeats such phases on $G'$, with an increasing limit $k$, until one vertex remains.
:::

::: intuition
Jarník with a Fibonacci heap pays $\log n$ only for `EXTRACT-MIN` on large heaps. So cap the heap at $k$: instead of one big tree we get many
small ones, each a correct piece of the [[def:mst|MST]] (blue rule), and contracting them leaves a much smaller graph, on which the cap can be raised
exponentially. Example: for $m = 2n$ the first limit is $k_1 = 2^{4} = 16$; at most $2m/16 = n/4$ vertices remain, so $k_2 \ge 2^{16} = 65536$,
then $k_3 \ge 2^{65536}$, far more than any real $n$. Three phases suffice in practice.
:::

So the trees $T_1, T_2, \dots$ of a phase grow by Jarník's algorithm until their heap overflows; a tree that runs into an earlier tree is attached to it
(and also stops). Then all trees are contracted (Borůvka-like phases), and the next phase works on a smaller graph. All added edges are correct by the
blue rule: each is the lightest edge leaving the current tree. The insight is that after each phase the graph gets smaller, which allows a larger $k$:
even a small reduction of $n$ allows an exponential increase of $k$, which gives even fewer trees in the next phase.

**A single phase.** Let $n_i$ be the number of vertices before phase $i$ and set the limit $k_i = 2^{2m/n_i}$. The phase takes
$$\O(m + n_i \log k_i) = \O(m + n_i \cdot 2m/n_i) = \O(m).$$
**How many trees are produced?** When a tree stops because of an overflow, it "touches" more than $k_i$ edges (it contains at least one endpoint of each of
the more than $k_i$ edges to its heap neighbours); a tree that is attached to an earlier tree contributes to that tree, and the touched edges only grow. Each
edge touches at most two trees, so at most $2m/k_i$ trees remain: $n_{i+1} \le 2m/k_i$, and therefore
$$k_{i+1} = 2^{2m/n_{i+1}} \ \ge\ 2^{k_i}.$$
Once $k_i \ge n_i$, the heap cannot overflow, a single tree is built, and the algorithm ends.

**Counting the phases.** Write $\log^{(i)} n = \log(\log(\cdots \log(n) \cdots))$ ($i$ times). Starting with $k_1 = 2^{2m/n}$ and $k_{i+1} \ge 2^{k_i}$, after $j$
phases $k_j$ is at least a tower of $j$ twos topped by $2m/n$, so $\log^{(j)} k_j \ge 2m/n$. Hence $k_j \ge n \ge n_j$, and phase $j$ is the last one, as soon as
$\log^{(j)} n \le 2m/n$, which certainly holds for
<!-- REVIEW: "we stop as soon as" read as an equivalence; it is only a sufficient condition (k_j >= n implies k_j >= n_j). Spelled out the step. -->
$$j = \beta(m, n) := \min\set{j \mid \log^{(j)} n \le m/n}.$$
So there are at most $\beta(m, n)$ phases, each taking $\O(m)$ ([[def:edge-contraction|contraction]] can be done in time $\O(m)$ per phase). **Overall complexity:
$\O(m \cdot \beta(m, n))$.**

::: remark
$\log^* n$ is the number of times one has to apply $\log$ to get to at most $1$. Since $\beta(m, n) \le \log^* n$ for $m \ge n$ (and
$\beta(m, n) \le \log^* n + 1$ always, as one more $\log$ gives a value $\le 0$), Fredman–Tarjan
<!-- REVIEW: beta(m,n) <= log* n needs m/n >= 1; a tree has m/n < 1, then the bound is log* n + 1. Slide p32 is garbled here ("β(m/n) ⩽ log*(m/n)"). --> runs in $\O(m \log^* n)$, which is
clearly better than Jarník on [[def:dense-sparse|sparse graphs]]. On dense graphs $\beta(m, n)$ gets smaller; for $m = \Theta(n^2)$ we have $\beta(m, n) = 1$. One can prove that
$m \cdot \beta(m, n) \le m + n \log n$ for $n \ge 16$, so Fredman–Tarjan is at least as good as Jarník everywhere.
:::
