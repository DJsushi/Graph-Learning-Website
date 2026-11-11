---
title: "The Erdős–Gallai theorem"
course: theory
chapter: degrees
order: 5
lectures: [t01]
stage: split
status: draft
---

The lecture closes with a second characterisation of degree sequences. It does not need to be
applied repeatedly; it is a list of inequalities to check.

::: theorem {#thm:erdos-gallai title="Erdős–Gallai" source="theory/2026-09-15 p7"}
There exists a graph with a non-increasing degree sequence $(d_1, d_2, \dots, d_n)$ of
non-negative integers if and only if $d_1 + \dots + d_n$ is even and, for every
$k \in \set{1, \dots, n}$,
$$\sum_{i=1}^{k} d_i \ \le\ k(k-1) + \sum_{i=k+1}^{n} \min(d_i, k).$$
:::

::: intuition
Fix the $k$ vertices of the largest degrees, $A = \set{v_1, \dots, v_k}$. Their degrees are paid
by edges inside $A$ (at most $k(k-1)$ in total, since each of the $k$ vertices has at most $k-1$
neighbours in $A$) and by edges going to the other vertices. A vertex $v_i$ outside $A$ can
"absorb" at most $\min(d_i, k)$ of those edges: at most $d_i$ because that is its degree, and at
most $k$ because it can be adjacent to each vertex of $A$ only once.
:::

::: pitfall
The inequalities are for the **non-increasing** order, and they must hold for **every** $k$.
For $(3, 3, 1, 1)$ the case $k = 1$ holds ($3 \le 0 + 1 + 1 + 1$), but $k = 2$ fails
($6 > 2 + 1 + 1$), so the sequence is not graphic. Written in the wrong order as $(1, 1, 3, 3)$,
the same numbers pass all four inequalities.
:::

The lecture states this theorem without proof. Necessity is exactly the intuition above;
sufficiency is harder. We give a complete proof following the constructive argument of Tripathi,
Venugopalan and West (2010).

:::: proof {title="Proof (not covered in the lecture)"}
**Necessity.** Let $G$ realise the sequence with $d_G(v_i) = d_i$, and fix $k$. The sum is even by
[[lem:handshake]]. Let $A = \set{v_1, \dots, v_k}$ and $B = V(G) \setminus A$. Counting each edge by
its endpoints in $A$,
$$\sum_{i=1}^{k} d_i = 2\abs{E(G[A])} + \sum_{v \in B} \abs{N(v) \cap A},$$
where $E(G[A])$ are the edges with both endpoints in $A$. There are at most $\binom{k}{2}$ of those,
so the first term is at most $k(k-1)$. For $v_i \in B$ we have $\abs{N(v_i) \cap A} \le \abs{A} = k$ and
$\abs{N(v_i) \cap A} \le d_i$. This proves the inequality.

**Sufficiency.** Let the sequence satisfy the conditions. Call a simple graph $G$ on
$\set{v_1, \dots, v_n}$ a **subrealisation** if $d_G(v_i) \le d_i$ for all $i$, and call
$e_i = d_i - d_G(v_i) \ge 0$ the **deficiency** of $v_i$. The edgeless graph is a subrealisation.
A subrealisation with all deficiencies $0$ is a realisation.

Given a subrealisation that is not a realisation, let $r$ be the smallest index with $e_r > 0$.
So $v_1, \dots, v_{r-1}$ have their full degrees, and $d_G(v_r) < d_r$. We show how to change $G$ into
another subrealisation in which $v_1, \dots, v_{r-1}$ still have full degree and **the degree of
$v_r$ is larger**. Repeating this, $d_G(v_r)$ grows until it reaches $d_r$; then the smallest
deficient index moves to the right. It never moves left, and the degree of $v_r$ is bounded by
$d_r$, so after finitely many steps we reach a realisation.

Two facts are used repeatedly.

- *(Parity.)* $\sum_i d_i$ is even by assumption and $\sum_i d_G(v_i)$ is even by [[lem:handshake]],
  so the total deficiency $\sum_i e_i$ is even. Hence, **if $e_r = 1$**, some other vertex is
  deficient, and since $v_1, \dots, v_{r-1}$ are not, there is a deficient $v_k$ with $k > r$.
- *(Full vertices have many neighbours.)* If $i < r$, then $d_G(v_i) = d_i \ge d_r > d_G(v_r)$.

We write $N(x)$ for the neighbourhood in the current graph $G$. Every operation below removes
some edges and adds some non-edges; for each one we list how the degrees change, and every degree
not listed is unchanged. One checks directly that no degree exceeds its target and that
$v_1, \dots, v_{r-1}$ keep their degrees.

*Case 1: $v_r$ is not adjacent to some $v_k$ with $k > r$ and $e_k > 0$.* Add the edge $v_r v_k$.
($v_r$ and $v_k$ gain one; both were deficient.)

*Case 2: $v_r$ is not adjacent to some $v_i$ with $i < r$.* Since
$d_G(v_i) > d_G(v_r)$ and $v_r \notin N(v_i)$, there is $u \in N(v_i) \setminus N(v_r)$, $u \ne v_r$.

- If $e_r \ge 2$: remove $v_i u$, add $v_i v_r$ and $u v_r$. ($v_i$ and $u$ lose one and gain one;
  $v_r$ gains two, which is allowed since $e_r \ge 2$.)
- If $e_r = 1$: by parity there is a deficient $v_k$ with $k > r$. If $v_k \notin N(v_r)$, Case 1
  applies, so assume $v_k \in N(v_r)$. We have $d_G(v_i) = d_i \ge d_k > d_G(v_k)$, so $v_i$ has a
  neighbour $w$ with $w \ne v_k$ and $w \notin N(v_k)$: if $v_i \notin N(v_k)$, this follows from
  $d_G(v_i) > d_G(v_k)$; if $v_i \in N(v_k)$, then $v_i$ has $d_G(v_i) - 1$ neighbours other than
  $v_k$, and at most $d_G(v_k) - 1$ of them are neighbours of $v_k$ (as $v_i$ itself is one), and
  $d_G(v_i) - 1 > d_G(v_k) - 1$. Also $w \ne v_r$ because $v_r \notin N(v_i)$. Remove $v_i w$, add
  $v_i v_r$ and $w v_k$. ($v_i$, $w$ unchanged; $v_r$ and $v_k$ gain one.)

*Case 3: neither Case 1 nor Case 2 applies.* Then $v_r$ is adjacent to all of $v_1, \dots, v_{r-1}$,
and every $v_k$ with $k > r$ that is not adjacent to $v_r$ has full degree. Let
$A = \set{v_1, \dots, v_r}$ and $B$ the rest. As in the necessity part,
$$\sum_{i=1}^{r} d_i - e_r = \sum_{i=1}^{r} d_G(v_i) = 2\abs{E(G[A])} + \sum_{v \in B}\abs{N(v) \cap A}.$$
The condition for $k = r$ says the left-hand side plus $e_r \ge 1$ is at most
$r(r-1) + \sum_{v_i \in B}\min(d_i, r)$. Since always $2\abs{E(G[A])} \le r(r-1)$ and
$\abs{N(v_i) \cap A} \le \min(d_G(v_i), r) \le \min(d_i, r)$, at least one of these inequalities
is strict:

- **(3a)** some two vertices $v_i, v_j \in A$ are non-adjacent, or
- **(3b)** some $v_k \in B$ satisfies $\abs{N(v_k) \cap A} < \min(d_k, r)$.

*Case 3a.* As $v_r$ is adjacent to all of $A$, we have $i, j < r$, so both are full. For
$x \in \set{v_i, v_j}$ let $X_x = N(x) \setminus (N(v_r) \cup \set{v_r})$. Since $x \in N(v_r)$
and $v_r \in N(x)$, we get $\abs{X_x} \ge (d_G(x) - 1) - (d_G(v_r) - 1) \ge d_r - d_G(v_r) = e_r \ge 1$.

- If $e_r \ge 2$: then $\abs{X_{v_i}}, \abs{X_{v_j}} \ge 2$, so we can pick $u \in X_{v_i}$ and
  $u' \in X_{v_j}$ with $u \ne u'$. Remove $v_i u$ and $v_j u'$, add $v_i v_j$, $v_r u$ and
  $v_r u'$. ($v_i, v_j, u, u'$ unchanged; $v_r$ gains two.) The added pairs are non-edges: $v_iv_j$
  by assumption, and $u, u' \notin N(v_r)$.
- If $e_r = 1$: by parity there is a deficient $v_k$, $k > r$; as Case 1 does not apply,
  $v_k \in N(v_r)$. Pick $w \in N(v_i) \setminus (N(v_k) \cup \set{v_k})$, which exists as shown in
  Case 2, and $u' \in X_{v_j}$. Remove $v_i w$ and $v_j u'$, add $v_i v_j$, $w v_k$ and $u' v_r$.
  Here $w \ne v_r$ (since $v_r \in N(v_k)$) and $u' \ne v_k$ (since $v_k \in N(v_r)$). If $w = u'$,
  this vertex loses two edges and gains the two edges $wv_k$, $wv_r$, which are different and both
  new; otherwise $w$ and $u'$ each lose one and gain one. Altogether $v_i, v_j, w, u'$ are unchanged,
  and $v_r$ and $v_k$ gain one.

*Case 3b.* Since $\abs{N(v_k) \cap A} < r$, some vertex of $A$ is not adjacent to $v_k$, and
$\abs{N(v_k) \cap A} < d_k$.

- If $v_k \notin N(v_r)$: then $v_k$ is full (Case 1 does not apply), so
  $d_G(v_k) = d_k > \abs{N(v_k) \cap A}$, and $v_k$ has a neighbour $x \in B$. Remove $v_k x$, add
  $v_k v_r$. ($v_k$ unchanged, $x \in B$ loses one, which is allowed since $x$ has index $> r$;
  $v_r$ gains one.)
- If $v_k \in N(v_r)$: let $v_i \in A$ be a vertex not adjacent to $v_k$; then $i < r$. Pick
  $u \in X_{v_i}$ as in Case 3a; $u \ne v_k$ since $v_k \in N(v_r)$, and $u \in B$ since $v_r$ is
  adjacent to all other vertices of $A$.
  - If $v_k$ is deficient: remove $v_i u$, add $v_i v_k$ and $u v_r$. ($v_i, u$ unchanged;
    $v_k, v_r$ gain one.)
  - If $v_k$ is full: it has a neighbour $x \in B$ as before. Remove $v_i u$ and $v_k x$, add
    $v_i v_k$ and $u v_r$. ($v_i$ and $v_k$ unchanged; $v_r$ gains one.) If $u \ne x$, then $u$ is
    unchanged and $x$ loses one. If $u = x$, this vertex loses two edges and gains one, so it
    loses one. Either way the only vertex that loses degree lies in $B$.

In every case the degree of $v_r$ grows, the first $r - 1$ vertices stay full, and no target is
exceeded. This completes the proof.
::::

::: remark
Some operations in Case 3b lower the degree of a vertex of $B$. This
is allowed: a vertex of $B$ has index larger than $r$, a subrealisation only bounds degrees from
above, and only the vertices before $v_r$ must stay full.
:::
