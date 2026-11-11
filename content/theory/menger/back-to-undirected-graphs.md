---
title: "Back to undirected graphs"
course: theory
chapter: menger
order: 7
lectures: [t05]
stage: split
status: draft
---

::: proof {title="Proof of Menger's theorem (undirected)" for=thm:menger}
Replace every undirected edge $uv$ of $G$ by the two arcs $(u, v)$ and $(v, u)$, obtaining a digraph $D$. Directed $s$–$t$ paths of $D$ correspond to
$s$–$t$ paths of $G$; a set of at most $k - 1$ arcs (vertices) whose removal destroys all directed $s$–$t$ paths of $D$ gives a set of at most $k - 1$
edges (the same vertices) whose removal destroys all $s$–$t$ paths of $G$.

**b)** Let $G$ be $k$-edge-connected and $s \ne t$. Then $G$ has no $s$–$t$ edge cut of size $\le k - 1$, hence neither does $D$, and by
[[thm:menger-directed]] B, $D$ has $k$ edge-disjoint directed $s$–$t$ paths; their arcs form an $s$–$t$ d-flow $F$ of size $k$ (no path enters $s$
or leaves $t$, and each path enters and leaves each of its inner vertices once). <!-- REVIEW: was "by B and its proof D has a d-flow of size k"; the proof gives a maximum d-flow of size ≥ k, so take the union of k paths instead. --> If $F$ contains both arcs $(u, v), (v, u)$ coming from one edge,
remove both: $F$ stays a d-flow of the same size (both $u$ and $v$ lose one in- and one out-arc). Now the $k$ edge-disjoint paths in $F$
([[claim:d-flow-paths]]) use every undirected edge of $G$ at most once, so they are $k$ edge-disjoint $s$–$t$ paths in $G$.

**a)** Let $G$ be a simple $k$-connected graph and $s \ne t$. For $k = 1$, $G$ is connected and one $s$–$t$ path suffices; let $k \ge 2$. <!-- REVIEW: case k = 1 added; the case st ∈ E(G) below uses (k−1)-connectivity, defined only for k−1 ≥ 1. --> If $st \notin E(G)$, every $s$–$t$ cut has at least $k$ vertices (deleting fewer leaves
$G$ connected), so by A applied to $D$ there are $k$ internally disjoint $s$–$t$ paths. If $st \in E(G)$, consider $G - st$. It is
$(k-1)$-connected: otherwise some $X$ with $\abs{X} \le k - 2$ disconnects $G - st$ but not $G$, so $st$ is a [[def:cut-vertex-bridge|bridge]] of $G - X$ with sides $S \ni s$
and $T \ni t$. As $G$ has at least $k + 1$ vertices, $G - X$ has at least $3$, so one side, say $S$, has another vertex besides $s$; then
$X \cup \set{s}$, of size $\le k - 1$, separates $S \setminus \set{s}$ from $T$ in $G$, a contradiction. By the first case applied to $G - st$, there are
$k - 1$ internally disjoint $s$–$t$ paths in $G - st$; together with the edge $st$ we get $k$.
:::

::: remark
For multigraphs (as on the board), vertex connectivity does not see [[def:mixed-multigraph|parallel edges or loops]]: a multigraph is $k$-connected iff its
underlying simple graph is (with the convention for $K_n$ applied to the underlying simple graph). So a) holds for multigraphs if all
parallel $s$–$t$ edges together count as **one** path. Counting them separately would fail: $K_2$ with $3$ parallel edges has $3$ internally
disjoint paths but is only $1$-connected.
<!-- REVIEW: was "a) holds if we also count parallel s–t edges as separate paths", which contradicts the K_n convention (counterexample above). --> Note also that b) gives an efficient way to compute [[def:k-connected|edge connectivity]]: it is the minimum, over pairs,
of the maximum number of edge-disjoint paths, which is a maximum-flow computation ([[alg:ford-fulkerson]] with unit capacities).
:::
