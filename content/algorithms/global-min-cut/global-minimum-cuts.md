---
title: "Global minimum cuts"
course: algorithms
chapter: global-min-cut
order: 1
lectures: [a03]
stage: split
status: draft
---

So far we looked for minimum $s$–$t$ cuts between a **given** pair of vertices, which correspond to maximum [[def:flow|flows]] between them
([[thm:maxflow-mincut]]). Now we want the cheapest [[def:undirected-cut|cut]] of the whole network.

::: definition {#def:global-min-cut title="Minimum cut" defines="global minimum cut" source="algorithms/03 p25"}
Let $G = (V, E)$ be a connected undirected graph with a [[def:flow-network|capacity]] function $c : E \to \R^+$. A **minimum cut** (global minimum cut) of $G$ is a set
$A = \delta(S)$ with $\emptyset \ne S \ne V$ such that $c(A)$ is minimum. We write

- $\lambda(G)$ for the capacity of a minimum cut of $G$, and
- $\lambda(G; v, w)$ for the capacity of a minimum $v$–$w$ cut of $G$ (so $\lambda(G; v, w) = f_G(v, w)$).
:::

::: intuition
The global minimum cut is the cheapest way to break the network into two pieces, wherever the break happens. With all capacities $1$, $\lambda(G)$ is
the edge connectivity from the theory course: the largest $k$ such that $G$ is [[def:k-connected|$k$-edge-connected]].
Example: in [[fig:a03-network]], $\lambda(G) = 13$, attained by $\delta(\set{c, d, e})$; every single vertex has $c(\delta(v)) \ge 14$. Non-example:
$\delta(\emptyset) = \emptyset$ has capacity $0$, but it does not split $G$ and is not a cut.
:::

::: proposition {#prop:global-cut-flows title="Global minimum cut by n − 1 flows" source="algorithms/03 p29"}
Fix a vertex $s$ of $G$. Then $\lambda(G) = \min_{t \ne s} \lambda(G; s, t)$. So a minimum cut can be found by solving $n - 1$ maximum-flow problems,
in time $\O(n^4)$ with an $\O(n^3)$ maximum-flow algorithm.
:::

::: proof
Every $s$–$t$ cut is a cut, so $\lambda(G) \le \lambda(G; s, t)$ for all $t$. Conversely, let $\delta(S)$ be a minimum cut; as $\emptyset \ne S \ne V$,
it separates $s$ from some vertex $t$ (any vertex on the other side), so $\lambda(G; s, t) \le \lambda(G)$. Each $\lambda(G; s, t)$ is one maximum-flow
computation in the network with two opposite arcs per edge (see [[def:undirected-cut]]); with MPM ([[thm:mpm-time]]), $\O(n^3)$ each.
:::

::: intuition
Whatever the minimum cut is, the fixed vertex $s$ lies on one side and some $t$ on the other; trying every $t$ cannot miss it. Example: in
[[fig:a03-network]] with $s = a$, the values $f(a, t)$ for $t = b, c, d, e, f$ are $18, 13, 13, 13, 17$, and their minimum is $\lambda(G) = 13$.
A [[def:gomory-hu-tree|Gomory–Hu tree]] gives the same with its $n - 1$ flows: $\lambda(G)$ is its lightest edge ([[exr:a03-lambda-from-tree]]).
:::

The rest of the lecture finds $\lambda(G)$ **without** maximum flows.
