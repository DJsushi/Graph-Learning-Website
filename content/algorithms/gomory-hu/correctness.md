---
title: "Why the construction works"
course: algorithms
chapter: gomory-hu
order: 8
lectures: [a03]
stage: split
status: draft
---

::: lemma {#lem:gomory-hu-invariant title="Existence of representatives" aka="tree construction invariant" source="algorithms/03 p18, p20–21"}
Let $T$ be an intermediate tree of [[alg:gomory-hu]] with nodes $S_i$. After each round: for every edge $S_iS_j$ of $T$ there are vertices
$a \in S_i$ and $b \in S_j$ such that $w(S_iS_j) = f_G(a, b)$ and the cut defined by the edge $S_iS_j$ is a minimum $a$–$b$ cut in $G$. (The cut
defined by $S_iS_j$ is $\delta(U)$, where $U$ is the union of the node sets in the component of $T - S_iS_j$ that contains $S_i$.)
:::

:::: proof
At the beginning $T$ has a single node and no edges, so the invariant holds. Assume it holds before a round that splits the node $S$ with the vertices
$a, b \in S$ into $S_a \ni a$ and $S_b \ni b$. Let $H$ be the contracted graph and $\delta_H(A)$ the minimum $a$–$b$ cut found, and read $A$, $B$ as
vertex sets of $G$. By [[obs:identification-cuts]], $\delta_G(A)$ has the same capacity as $\delta_H(A)$.

**The new edge $S_aS_b$, with representatives $a$ and $b$.** Let $C$ be a component of $T - S$, $U_C$ the union of its node sets, and $XS$ the edge of
$T$ joining $C$ to $S$. The cut defined by $XS$ is $\delta(U_C)$, and by the invariant it is a minimum $x$–$s$ cut for some $x \in X$, $s \in S$.
Since $a, b \in S \subseteq V \setminus U_C$, [[cor:gomory-hu-contraction]] says that contracting $U_C$ does not change $f(a, b)$. The other
components remain sides of minimum cuts after this contraction (their cuts are unchanged, and by the same corollary the values $f(x', s')$ of
their representatives do not change), so we may contract them one after the other. Hence $f_H(a, b) = f_G(a, b)$, and
$\delta_G(A)$ is a minimum $a$–$b$ cut of $G$ of capacity $w(S_aS_b) = f_G(a, b)$. The cut defined by the new edge $S_aS_b$ is $\delta(A)$:
the component of $S_a$ consists of $S_a$ and the components attached to it, whose vertices form exactly $A$.

**Edges not incident to $S$.** The split happens on one side of such an edge, so the vertex sets of its two sides do not change, nor does its
capacity. Keep the old representatives.

**An edge $XS$ that becomes $XS_a$** (the case $XS_b$ is symmetric). The sides of the cut defined by the edge do not change: one side is still $U_C$
for the component $C$ of $T - S$ containing $X$, and $U_C \subseteq A$ by the reconnection rule. Let $x \in X$, $s \in S$ be the old representatives,
so $w(XS) = f_G(x, s)$ and $\delta(U_C)$ is a minimum $x$–$s$ cut.

- If $s \in S_a$, keep $x$ and $s$.
- If $s \in S_b$, choose $x$ and $a$ as the new representatives. Since $\delta(U_C)$ separates $x$ from $a \in S$ and has capacity $f_G(x, s)$, it
  suffices to show $f_G(x, a) = f_G(x, s)$. First, $f_G(x, a) \le c(\delta(U_C)) = f_G(x, s)$. For the opposite inequality, let $B$ be the side of
  $b$ of the minimum $a$–$b$ cut $\delta(A)$; then $s \in S_b \subseteq B$ and $x \in U_C \subseteq A$. Identify $B$ into a vertex $v_B$, obtaining
  $G_B$. Then
  - $f_G(x, a) = f_{G_B}(x, a)$ by [[cor:gomory-hu-contraction]], as $x, a \notin B$;
  - $f_{G_B}(x, a) \ge \min(f_{G_B}(x, v_B), f_{G_B}(v_B, a))$ by [[lem:flow-triangle]];
  - $f_{G_B}(x, v_B) \ge f_G(x, s)$: by [[obs:identification-cuts]], an $x$–$v_B$ cut of $G_B$ is a cut of $G$ separating $x$ from all of $B \ni s$;
  - $f_{G_B}(v_B, a) \ge f_G(b, a)$ in the same way, as $b \in B$; and $f_G(b, a) = c(\delta(A)) \ge f_G(x, s)$, because $\delta(A)$ also separates
    $x \in A$ from $s \in B$.

  Together $f_G(x, a) \ge \min(f_G(x, s), f_G(x, s)) = f_G(x, s)$.

So the invariant holds after the round.
::::

::: intuition
Each tree edge "remembers" a pair of vertices, one on each side, for which it records the exact minimum cut. Splitting a node may move a
representative to the wrong part; the proof shows that the new splitting vertex $a$ can then take its place, because the old cut is still cheapest
for it. Example: in round 2 of [[ex:gomory-hu-lecture]], the edge $\set{a, b}\,\set{c, d, e, f}$ (representatives $b$, $f$) becomes the edge
$b\,\set{c, d, e, f}$, and $b$ stays a representative. In round 5, the edge $\set{c, e}\,d$ (representatives $e$, $d$) becomes $e\,d$.
:::

::: theorem {#thm:gomory-hu title="Correctness of the construction" source="algorithms/03 p22"}
The tree $T$ produced by [[alg:gomory-hu]] (with each final node $\set{v}$ identified with the vertex $v$) is a
[[def:gomory-hu-tree|Gomory–Hu tree]] for $G$. In particular, every undirected network has a Gomory–Hu tree, and it can be computed with $n - 1$
minimum $s$–$t$ cut (maximum flow) computations.
:::

:::: proof
Each round replaces one node by two and one tree edge between them, and reattaches the other neighbours, so $T$ stays a tree and the number of nodes
grows by one. Every round can be performed while some node has at least two vertices, so after $n - 1$ rounds all nodes are single vertices and
$T$ is a tree on $V$. By [[lem:gomory-hu-invariant]] with singleton nodes, every edge $uv$ of $T$ has $w(uv) = f_G(u, v)$, and the cut defined by
$uv$ is a minimum $u$–$v$ cut of $G$.

**Flow equivalence.** Let $s = v_0, v_1, \dots, v_k = t$ be the $s$–$t$ path in $T$. By [[prop:gomory-hu-path]]'s argument (which uses only that
$T$ is a tree), $f_T(s, t) = \min_i w(v_{i-1}v_i) = \min_i f_G(v_{i-1}, v_i)$, which is at most $f_G(s, t)$ by [[lem:flow-triangle-path]].
Conversely, the cut defined by each path edge $v_{i-1}v_i$ separates $s$ and $t$ (the path crosses this edge once), so
$f_G(s, t) \le \min_i w(v_{i-1}v_i) = f_T(s, t)$.

**Cut property.** Let $\delta_T(U)$ be a minimum $s$–$t$ cut of $T$. It contains an edge of the path, and its capacity is $f_T(s, t)$, the minimum
capacity on the path. All capacities are positive ($G$ is connected), so $\delta_T(U)$ consists of a single path edge $e$ of minimum capacity, and $U$ is a
component of $T - e$. So $\delta_G(U)$ is the cut defined by $e$; it separates $s$ and $t$, and its capacity is $w(e) = f_T(s, t) = f_G(s, t)$.
Hence it is a minimum $s$–$t$ cut of $G$.
::::

<!-- REVIEW: the lecture proves the cut property first ("by the invariant") and flow equivalence second; here the cut property uses flow equivalence (the capacity of the cut equals f_T(s, t) = f_G(s, t)) and positivity of the tree weights, so the order is swapped. -->

::: intuition
The invariant says every tree edge is a correct minimum cut for its own two ends; the triangle inequality then spreads this to all pairs along the
tree paths. Example: the tree of [[fig:a03-network]] was built by [[ex:gomory-hu-lecture]], and all $15$ pairs can be checked against
[[prop:gomory-hu-path]]. With Dinic's algorithm the construction takes $\O((n - 1) \cdot n^2 m)$ time, instead of $\O(n^2 \cdot n^2 m)$ for all pairs separately.
:::

::: remark
**In practice** the algorithm works well, with some problems once the graph has more than a few thousand nodes. The overhead is the alternating
contraction and expansion; an optimisation is not to expand a set until it is split. **Gusfield (1990)** gave a version without any vertex
contraction, which saves this overhead and has the same running time; experimental evaluations are available. (Gusfield's trees are equivalent
flow trees; a modification also gives the cut property.)
:::
