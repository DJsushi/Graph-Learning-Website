---
title: "Two non-adjacent simplicial vertices"
course: theory
chapter: chordal
order: 5
lectures: [t04]
stage: split
status: draft
---

::: lemma {#lem:two-simplicial title="Two non-adjacent simplicial vertices" source="theory/2026-10-06 p3"}
If $G$ is chordal, then $G$ is complete or $G$ contains two non-adjacent simplicial vertices.
:::

::: intuition
Asking for **two non-adjacent** simplicial vertices is a stronger statement than [[thm:chordal-simplicial]], and that is what makes the
induction work. A clique cut $X$ splits $G$ into two sides; each side, together with $X$, is smaller and chordal, so it has a
simplicial vertex away from $X$. Because $X$ is a clique, at most one of the two vertices promised for a side can lie in $X$,
so the other lies off $X$, and it stays simplicial in $G$. Example: a path $P_n$ ($n \ge 2$) has its two ends.
Non-example: $K_n$ is the exception, as any two vertices are adjacent.
:::

:::: proof
By induction on $n = \abs{V(G)}$. If $G$ is complete there is nothing to prove (this covers $n \le 1$). Assume $G$ is
not complete, and let $u \ne v \in V(G)$ with $uv \notin E(G)$. As $u, v$ are non-adjacent, there is a minimal cut
$X$ between $u$ and $v$, and by [[lem:minimal-cut-clique]] $X$ is a clique. Let $A$ be the
component of $G - X$ containing $u$. Note that **no edge joins $A$ to $V(G) \setminus (A \cup X)$**, because $A$ is a component of $G - X$.
<!-- REVIEW: existence of the minimal cut comes from non-adjacency (remark after the definition), not from the lemma. -->

Both $G[A \cup X]$ and $G - A$ are induced subgraphs of $G$, so they are chordal ([[obs:chordal-induced]]), and they
have fewer vertices than $G$ ($v \notin A \cup X$ and $u \in A$). So the lemma holds for them by induction.

*A simplicial vertex $x \in A$.* If $G[A \cup X]$ is complete, take $x = u$. Otherwise $G[A \cup X]$ has two non-adjacent
simplicial vertices; they cannot both lie in the clique $X$, so one of them, $x$, lies in $A$. In either case
$x \in A$ is simplicial in $G[A \cup X]$. All neighbours of $x$ in $G$ lie in $A \cup X$, so $x$ is simplicial in $G$.

*A simplicial vertex $y \notin A \cup X$.* If $G - A$ is complete, take $y = v$. Otherwise $G - A$ has two non-adjacent
simplicial vertices, and one of them, $y$, is not in the clique $X$. In either case $y \in V(G) \setminus (A \cup X)$ is
simplicial in $G - A$. Since $y$ has no neighbours in $A$, its neighbours in $G$ and in $G - A$ are the same, so
$y$ is simplicial in $G$.

Finally $xy \notin E(G)$, since $x \in A$ and $y \notin A \cup X$. This proves the claim.
::::

::: proof {title="Proof of the theorem" for=thm:chordal-simplicial}
By [[lem:two-simplicial]], a chordal graph is complete (and then every vertex is simplicial) or it has two
simplicial vertices.
:::
