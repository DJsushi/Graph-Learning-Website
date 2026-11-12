---
title: "Unique paths in trees"
course: theory
chapter: trees
order: 4
lectures: [t03]
stage: split
status: reviewed
---

::: corollary {#cor:tree-unique-path title="Unique paths in trees" source="theory/2026-09-29 p5"}
In every [[def:forest-tree|tree]] $T$, every two vertices $u, v \in V(T)$ are [[def:component|connected]] by exactly one [[def:path-graph|path]].
:::

::: intuition
Connectivity gives at least one path, and acyclicity forbids a second: two different $u$–$v$ paths
would together run around a cycle. This is why a tree is a good "routing table": the way from $u$ to
$v$ is determined. Example: in the star $K_{1,3}$ with centre $c$, the only path between two outer
vertices $a, b$ is $a - c - b$. Non-example: in $C_4$ opposite vertices are joined by two paths.
:::

The proof has two parts. Existence: a shortest walk is a path.

:::: walkthrough {for=cor:tree-unique-path}
```graph id=t03-unique-path-existence widget=stepper
caption: A tree $T$ on 6 vertices. A walk from $u$ to $v$ that repeats $a$ is not the shortest one; the shortest is a path.
intent: New. The lecture draws only the two paths of the uniqueness part (theory/2026-09-29 p5); this tree shows the existence part.
layout: fixed
u @(0, 0); a @(1, 0); b @(2, 0); v @(3, 0); c @(1, -1); d @(2, 1)
u -- a; a -- b; b -- v; a -- c; b -- d
mark walk: u--a a--c a--b b--v
mark short: u--a a--b b--v
step: $u$ and $v$ lie in one component.
class source: u
class sink: v
step: A $u$–$v$ walk exists.
class path: u--a a--c a--b b--v
step: A shortest walk is a path.
unclass path: a--c
class path: u--a a--b b--v
class muted: c
```

::: step
Take two vertices $u$ and $v$ of the tree $T$. The tree is [[def:forest-tree|connected]] by definition, so $u$ and $v$ lie in the same [[def:component|component]]. This is where we use that $T$ is a tree and not just a forest.
:::

::: step
Being in the same component means that some walk joins $u$ to $v$. Here the walk [[fig:t03-unique-path-existence#walk|$(u, a, c, a, b, v)$]] has length $5$. It may repeat vertices: it visits $a$ twice.
:::

::: step
Among all $u$–$v$ walks take a shortest one. By [[claim:shortest-walk-path|the claim on shortest walks]], a shortest walk is a path. Here the shortest walk is [[fig:t03-unique-path-existence#short|$(u, a, b, v)$]] of length $3$, and it is a path. So a $u$–$v$ path exists.
:::
::::

Uniqueness: two different paths would make a closed walk, and a closed walk in an acyclic graph doubles back everywhere. The picture shows the supposed situation, so it is not a tree. That is exactly why the supposition fails.

:::: walkthrough {for=cor:tree-unique-path}
```graph id=t03-unique-path-uniqueness widget=stepper
caption: Two different $u$–$v$ paths $P_1$ and $P_2$ form a closed walk that goes once around a cycle. A tree has no such cycle.
intent: From the lecture (theory/2026-09-29 p5): the two paths $P_1$ above and $P_2$ below, from $u$ to $v$. The vertex names $a$, $b$, $c$, $d$ are new. The graph is a hypothetical situation and not a tree.
layout: fixed
u @(0, 0); a @(1, 0.8); b @(2, 0.8); v @(3, 0); c @(1, -0.8); d @(2, -0.8)
u -- a; a -- b; b -- v; u -- c; c -- d; d -- v
mark P1: u--a a--b b--v
mark P2: u--c c--d d--v
mark e: a--b
mark f: c--d
step: Suppose there are two different paths.
class path: u--a a--b b--v
class color2: u--c c--d d--v
step: Join them into a closed walk $W$.
class bold: u--a a--b b--v u--c c--d d--v
step: $T$ has no cycle, so $W$ doubles back.
class cycle: u--a a--b b--v u--c c--d d--v
step: Every edge of $P_1$ is an edge of $P_2$.
unclass cycle: u--a a--b b--v u--c c--d d--v
class current: a--b
step: Every edge of $P_2$ is an edge of $P_1$.
unclass current: a--b
class current: c--d
step: Equal edge sets give equal paths.
unclass current: c--d
class muted: u--c c--d d--v c d
```

::: step
Suppose, for a contradiction, that [[fig:t03-unique-path-uniqueness#P1|$P_1$]] and [[fig:t03-unique-path-uniqueness#P2|$P_2$]] are two different $u$–$v$ paths in $T$. Here $P_1$ is $(u, a, b, v)$ and $P_2$ is $(u, c, d, v)$. This graph is not a tree: the proof shows that the supposition cannot hold in a tree.
:::

::: step
Walk along $P_1$ from $u$ to $v$, then along $P_2$ backwards from $v$ to $u$. The second walk starts where the first one ends, so they concatenate. The result $W$ ends where it began, so it is a [[def:walk|closed walk]] in $T$. Here $W$ is $(u, a, b, v, d, c, u)$ of length $6$.
:::

::: step
$T$ has no cycle, so by [[lem:closed-walk-cycle|the lemma on closed walks]] the walk $W$ traverses every edge an even number of times. The lemma gives a cycle or even counts, and acyclicity excludes the cycle. Here each of the $6$ edges is traversed once, which is odd, and they form a cycle. So this picture is impossible in $T$.
:::

::: step
Take an edge [[fig:t03-unique-path-uniqueness#e|$e$]] of $P_1$. A path never repeats an edge, so the $P_1$-part of $W$ traverses $e$ once. The total is even, so the backwards $P_2$-part must traverse $e$ at least once more. Only edges of $P_2$ are traversed there, so $e$ is an edge of $P_2$. Here $ab$ is not, another sign of the impossible picture.
:::

::: step
Now take an edge [[fig:t03-unique-path-uniqueness#f|$f$]] of $P_2$. The backwards $P_2$-part traverses it once, and the total is even. So the $P_1$-part traverses it as well, and $f$ is an edge of $P_1$. With the last step this gives $E(P_1) = E(P_2)$: the two paths have the same edges.
:::

::: step
Paths with the same ends and the same edges are equal. If $u = v$, both are the single vertex $u$. Otherwise the vertices are the ends of the edges, and the edges fix the order: start at $u$, an end of exactly one edge, and follow them. So $P_1 = P_2$, against the supposition.
:::
::::

::: proof
There is some $u$–$v$ path by connectivity of $T$ and [[claim:shortest-walk-path]]. Suppose $P_1, P_2 \subseteq T$
are two $u$–$v$ paths. Walking along $P_1$ from $u$ to $v$ and then back along $P_2$ from $v$ to $u$ gives a
closed walk $W = P_1 \cdot P_2^{-1}$ in $T$. Since $T$ has no cycle, by [[lem:closed-walk-cycle]] $W$ traverses
every edge an even number of times. A path traverses each of its edges once, so every edge of $P_1$ is
traversed once by the $P_1$-part and must be traversed again, i.e. it is an edge of $P_2$; and vice
versa. Hence $E(P_1) = E(P_2)$. Two paths with the same ends and the same edge set are equal (if
$u = v$ both are the single vertex $u$; otherwise the vertices of a path are the ends of its edges and
the edges determine the order). So $P_1 = P_2$.
:::
