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

```graph id=t01-erdos-gallai-check widget=stepper
caption: The graph has degree sequence $(3, 3, 3, 2, 1)$. Each step checks the inequality for one $k$; the vertices of $A = \set{v_1, \dots, v_k}$ are coloured, edges inside $A$ are highlighted and edges from $A$ to the rest are bold.
intent: New; the lecture (theory/2026-09-15 p7) states the theorem without an example. Shows that the inequality must be checked for every k, and that it can hold with equality (k = 3).
layout: fixed
v1 [label="$v_1$"] @(-0.8, 1); v2 [label="$v_2$"] @(0.8, 1); v3 [label="$v_3$"] @(0, 0)
v4 [label="$v_4$"] @(-1.4, 0); v5 [label="$v_5$"] @(1.4, 0)
v1 -- v2; v1 -- v3; v1 -- v4; v2 -- v3; v2 -- v5; v3 -- v4
step: $k = 1$: $3 \le 0 + 1 + 1 + 1 + 1$.
class color1: v1
class bold: v1--v2 v1--v3 v1--v4
step: $k = 2$: $6 \le 2 + 2 + 2 + 1$.
class color1: v2
unclass bold: v1--v2
class highlight: v1--v2
class bold: v2--v3 v2--v5
step: $k = 3$: $9 \le 6 + 2 + 1$, with equality.
class color1: v3
unclass bold: v1--v3 v2--v3
class highlight: v1--v3 v2--v3
class bold: v3--v4
step: $k = 4$: $11 \le 12 + 1$.
class color1: v4
unclass bold: v1--v4 v3--v4
class highlight: v1--v4 v3--v4
step: $k = 5$: $12 \le 20$; no vertex is left outside $A$.
class color1: v5
unclass bold: v2--v5
class highlight: v2--v5
```

::: pitfall
The inequalities are for the **non-increasing** order, and they must hold for **every** $k$.
For $(3, 3, 1, 1)$ the case $k = 1$ holds ($3 \le 0 + 1 + 1 + 1$), but $k = 2$ fails
($6 > 2 + 1 + 1$), so the sequence is not graphic. Written in the wrong order as $(1, 1, 3, 3)$,
the same numbers pass all four inequalities.
:::

The lecture states this theorem without proof. Necessity is exactly the intuition above;
sufficiency is harder. We give a complete proof following the constructive argument of Tripathi,
Venugopalan and West (2010).

Necessity is a double count: we count the degrees of the first $k$ vertices edge by edge and
bound each part.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-necessity widget=stepper
caption: Necessity for $k = 2$ on a graph with degree sequence $(3, 3, 3, 2, 1)$: the degree sum of $A$ is $6$, the right side is $7$.
intent: New; the lecture (theory/2026-09-15 p7) states the theorem without proof or picture. Same graph and positions as t01-erdos-gallai-check. Edges inside A count twice (highlight), edges from A to B once (bold), edges inside B not at all (muted). v3 shows the bound k, v5 the bound d_i.
layout: fixed
v1 [label="$v_1$"] @(-0.8, 1); v2 [label="$v_2$"] @(0.8, 1); v3 [label="$v_3$"] @(0, 0)
v4 [label="$v_4$"] @(-1.4, 0); v5 [label="$v_5$"] @(1.4, 0)
v1 -- v2; v1 -- v3; v1 -- v4; v2 -- v3; v2 -- v5; v3 -- v4
mark G: v1 v2 v3 v4 v5 v1--v2 v1--v3 v1--v4 v2--v3 v2--v5 v3--v4
step: A graph $G$ with degree sequence $(3, 3, 3, 2, 1)$.
step: $k = 2$: $A = \set{v_1, v_2}$, $B$ is the rest.
class color1: v1 v2
mark A: v1 v2
mark B: v3 v4 v5
step: Each edge counts once per end in $A$: $6 = 2 \cdot 1 + 2 + 1 + 1$.
class highlight: v1--v2
class bold: v1--v3 v1--v4 v2--v3 v2--v5
class muted: v3--v4
mark inside: v1--v2
step: Inside $A$: at most $\binom{2}{2} = 1$ edge.
unclass bold: v1--v3 v1--v4 v2--v3 v2--v5
step: Each vertex of $B$: at most $\min(d_i, 2)$ neighbours in $A$.
class bold: v1--v3 v1--v4 v2--v3 v2--v5
class highlight: v3 v5
mark v3A: v1--v3 v2--v3
mark v5A: v2--v5
step: Together: $6 \le 2 + 2 + 2 + 1$.
unclass highlight: v3 v5
class highlight: v4
```

::: step
We assume that a graph [[fig:t01-erdos-gallai-necessity#G|$G$]] realises the sequence: $v_i$ has degree $d_i$ for every $i$. The degree sum is twice the number of edges by [[lem:handshake|the handshake lemma]], so it is even. Here the sum is 12 and $G$ has 6 edges.
:::

::: step
We fix $k$. Let [[fig:t01-erdos-gallai-necessity#A|$A$]] hold $v_1$ to $v_k$, and [[fig:t01-erdos-gallai-necessity#B|$B$]] the other vertices. The left side of the inequality is the degree sum of $A$. Here $k$ is 2, $A$ is $v_1$, $v_2$, and the left side is 3 + 3, which is 6.
:::

::: step
We count this sum edge by edge: an edge inside $A$ adds 2, an edge from $A$ to $B$ adds 1, an edge inside $B$ adds 0. So the sum is twice the edges inside $A$, plus the neighbours in $A$ of each vertex of $B$. Here: $6 = 2 \cdot 1 + 2 + 1 + 1$.
:::

::: step
$G$ is simple, so each pair of vertices of $A$ carries at most one edge. There are $\binom{k}{2}$ pairs, so twice the number of [[fig:t01-erdos-gallai-necessity#inside|edges inside $A$]] is at most $k(k-1)$, the first term on the right. Here 1 edge, and 2 is at most 2.
:::

::: step
Take $v_i$ in $B$. Its neighbours in $A$ are distinct vertices of $A$, so there are at most $k$. They are among its $d_i$ neighbours, so at most $d_i$. Hence at most $\min(d_i, k)$. Here $v_3$ has [[fig:t01-erdos-gallai-necessity#v3A|2 neighbours]] in $A$, the bound $k$; $v_5$ has [[fig:t01-erdos-gallai-necessity#v5A|1]], the bound $d_5$.
:::

::: step
Adding the bounds of the last two steps gives the inequality for $k$, and $k$ was any index. Here: 6 is at most 2 + 2 + 2 + 1, which is 7. This part never uses that the sequence is non-increasing: the count works for any $k$ vertices.
:::
::::

Sufficiency is a construction: we start from the edgeless graph and add degree to the first
vertex that still misses some, until none does.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-run widget=stepper
caption: A run for $(4, 4, 4, 4, 2, 2)$ from the edgeless graph to a realisation; full vertices are filled, $v_r$ is marked.
intent: New; the lecture has no proof of this theorem. Hexagon positions shared by all sufficiency figures. Every change in this run happens to be Case 1 (add one edge from v_r to a deficient non-neighbour).
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
mark G: v1 v2 v3 v4 v5 v6
step: The edgeless graph: every deficiency $e_i$ is $d_i$.
step: $r = 1$: the first deficient vertex is $v_1$.
class current: v1
step: The degree of $v_1$ grows to 4; now $r = 2$.
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]; v1 -- v5 [class=highlight]
unclass current: v1
class visited: v1
class current: v2
step: More changes: $v_1$, $v_2$, $v_3$ are full, $r = 4$.
unclass highlight: v1--v2 v1--v3 v1--v4 v1--v5
v2 -- v3 [class=highlight]; v2 -- v4 [class=highlight]; v2 -- v5 [class=highlight]; v3 -- v4 [class=highlight]; v3 -- v6 [class=highlight]
unclass current: v2
class visited: v2 v3 v5
class current: v4
mark before: v1 v2 v3
step: No vertex is deficient: a realisation.
unclass highlight: v2--v3 v2--v4 v2--v5 v3--v4 v3--v6
v4 -- v6 [class=highlight]
unclass current: v4
class visited: v4 v6
```

::: step
A simple graph [[fig:t01-erdos-gallai-run#G|$G$]] on $v_1$ to $v_n$ is a subrealisation if each $v_i$ has degree at most $d_i$. The deficiency $e_i$ is $d_i$ minus the degree of $v_i$: the edges it still misses. In the edgeless graph every degree is 0, so it is a subrealisation and $e_i$ is $d_i$. Here: (4, 4, 4, 4, 2, 2).
:::

::: step
If every deficiency is 0, each $v_i$ has degree $d_i$: $G$ is a realisation and we are done. Otherwise let $r$ be the smallest index with $e_r > 0$. So $v_1$ to $v_{r-1}$ are full: they have their target degree. Here $r$ is 1, and no vertex comes before $v_1$.
:::

::: step
The cases below change $G$ into a new subrealisation: $v_1$ to $v_{r-1}$ stay full, and $v_r$ gets a larger degree. Repeating this, the degree of $v_r$ reaches $d_r$; then $v_r$ is full too, and the smallest deficient index moves right. Here $v_1$ gets four edges and $r$ becomes 2.
:::

::: step
The index $r$ never moves left, because every change keeps [[fig:t01-erdos-gallai-run#before|the vertices before $v_r$]] full. Here, after five more edges, $v_1$, $v_2$, $v_3$ are full and $r$ is 4. A vertex after $v_r$ may be full already, like $v_5$ here.
:::

::: step
Each change raises the degree of $v_r$, which cannot pass $d_r$, so after finitely many changes $r$ moves right. And $r$ cannot pass $n$. So the process stops, and it stops only when no vertex is deficient, at a realisation. Here one more edge, from $v_4$ to $v_6$, gives (4, 4, 4, 4, 2, 2).
:::
::::

Two facts that the cases use: a parity count, and a comparison of degrees that uses the order
of the sequence.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-facts widget=stepper
caption: A subrealisation of $(4, 4, 4, 4, 2, 2)$ with degrees $(4, 3, 4, 3, 2, 2)$: the total deficiency is $2$, and $v_1$ has more neighbours than $v_2$.
intent: New; same graph as t01-erdos-gallai-case-2-one, where these facts are used.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v2 -- v6; v3 -- v4; v3 -- v5
mark G: v1 v2 v3 v4 v5 v6 v1--v3 v1--v4 v1--v5 v1--v6 v2--v3 v2--v4 v2--v6 v3--v4 v3--v5
step: Degrees $(4, 3, 4, 3, 2, 2)$; $r = 2$.
class current: v2
step: The deficient vertices: total deficiency 2.
class color2: v2 v4
mark def: v2 v4
step: $e_2 = 1$, so another vertex is deficient: $v_4$.
class highlight: v4
mark vk: v4
step: $v_1$ is full: 4 neighbours against 3.
unclass highlight: v4
class highlight: v1--v3 v1--v4 v1--v5 v1--v6
class bold: v2--v3 v2--v4 v2--v6
mark vi: v1 v1--v3 v1--v4 v1--v5 v1--v6
mark vr: v2 v2--v3 v2--v4 v2--v6
```

::: step
Here [[fig:t01-erdos-gallai-facts#G|$G$]] is a subrealisation for the targets (4, 4, 4, 4, 2, 2). Its degrees are (4, 3, 4, 3, 2, 2), so the deficiencies are (0, 1, 0, 1, 0, 0). The first deficient vertex is $v_2$, so $r$ is 2 and $e_r$ is 1.
:::

::: step
Parity. The targets add up to an even number: that is a hypothesis of the theorem. The degrees of $G$ add up to an even number by [[lem:handshake|the handshake lemma]]. The total deficiency is the first sum minus the second, so it is even. Here 20 minus 18 is 2, from [[fig:t01-erdos-gallai-facts#def|$v_2$ and $v_4$]].
:::

::: step
Suppose $e_r$ is 1. The other deficiencies then add up to an odd number, so at least one of them is positive. It does not belong to $v_1$ to $v_{r-1}$, which are full. So some $v_k$ with $k > r$ is deficient. Here [[fig:t01-erdos-gallai-facts#vk|$v_k$]] is $v_4$.
:::

::: step
Take $v_i$ with $i < r$. It is full, so its degree is $d_i$. The sequence is non-increasing, so $d_i$ is at least $d_r$: here we use the order. And $d_r$ is more than the degree of the deficient $v_r$. So [[fig:t01-erdos-gallai-facts#vi|$v_i$]] has more neighbours than [[fig:t01-erdos-gallai-facts#vr|$v_r$]]. Here 4 against 3.
:::
::::

Case 1 adds a single edge. From here on, every change removes some edges and adds some
non-edges, so the graph stays simple; we then check each degree that changes.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-1 widget=stepper
caption: Case 1 for $(4, 4, 4, 4, 2, 2)$: $v_4$ is deficient and not adjacent to $v_2 = v_r$, so we add the edge $v_2 v_4$.
intent: New; the lecture has no proof of this theorem. v6 would also do as v_k.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v2; v1 -- v3; v1 -- v4; v1 -- v5; v2 -- v3; v3 -- v5; v3 -- v6
mark G: v1 v2 v3 v4 v5 v6 v1--v2 v1--v3 v1--v4 v1--v5 v2--v3 v3--v5 v3--v6
step: Degrees $(4, 2, 4, 1, 2, 1)$; $r = 2$.
class current: v2
step: $v_4$ is deficient and not adjacent to $v_2$.
class highlight: v4
mark vk: v4
step: Add the edge $v_2 v_4$.
v2 -- v4 [class=highlight]
```

::: step
Each case starts from a subrealisation [[fig:t01-erdos-gallai-case-1#G|$G$]] and its first deficient vertex $v_r$. Here the targets are (4, 4, 4, 4, 2, 2) and the degrees are (4, 2, 4, 1, 2, 1). So $v_1$ is full and $r$ is 2.
:::

::: step
Case 1: some [[fig:t01-erdos-gallai-case-1#vk|$v_k$]] with $k > r$ is deficient and not adjacent to $v_r$. Here $v_4$ has degree 1 of 4 and is not adjacent to $v_2$. The vertex $v_6$ would do as well.
:::

::: step
We add the edge from $v_r$ to $v_k$. It was a non-edge, so $G$ stays simple. Only $v_r$ and $v_k$ change: each gains one. Both were deficient, so neither passes its target, and the vertices before $v_r$ keep their degree. Here $v_2$ goes from 2 to 3.
:::
::::

Case 2 is an exchange at a full vertex $v_i$ that is not adjacent to $v_r$: it gives up one
edge and gets an edge to $v_r$ in return. First the subcase $e_r \ge 2$.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-2-two widget=stepper
caption: Case 2 with $e_r = 2$ for $(4, 4, 4, 4, 2, 2)$: $v_1$ trades its edge to $v_5$ for an edge to $v_2$, and $v_5$ gets one to $v_2$ too.
intent: New; the lecture has no proof of this theorem. u = v6 would do as well.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v3 -- v5; v3 -- v6
step: Degrees $(4, 2, 4, 2, 2, 2)$; $v_1$ is not adjacent to $v_2$.
class current: v2
class highlight: v1
mark vi: v1
step: $u = v_5$: a neighbour of $v_1$, not of $v_2$.
unclass highlight: v1
class color1: v3 v4 v5 v6
class highlight: v5
mark N1: v3 v4 v5 v6
mark N2: v3 v4
mark u: v5
step: Remove $v_1 v_5$; add $v_1 v_2$ and $v_5 v_2$.
unclass color1: v3 v4 v5 v6
class rejected: v1--v5
v1 -- v2 [class=highlight]; v5 -- v2 [class=highlight]
step: $v_1$, $v_5$ keep their degree; $v_2$ gains two.
remove v1--v5
unclass highlight: v5
```

::: step
Case 2: $v_r$ is not adjacent to some [[fig:t01-erdos-gallai-case-2-two#vi|$v_i$]] with $i < r$. Here the targets are (4, 4, 4, 4, 2, 2), the degrees are (4, 2, 4, 2, 2, 2), so $r$ is 2 and $e_r$ is 2. The vertex $v_1$ is not adjacent to $v_2$.
:::

::: step
By the second fact, $v_i$ has more neighbours than $v_r$. So [[fig:t01-erdos-gallai-case-2-two#N1|$N(v_i)$]] is not inside [[fig:t01-erdos-gallai-case-2-two#N2|$N(v_r)$]]: some [[fig:t01-erdos-gallai-case-2-two#u|$u$]] is a neighbour of $v_i$ but not of $v_r$. And $u$ is not $v_r$, since $v_r$ is not a neighbour of $v_i$. Here 4 against 2, and $u$ is $v_5$.
:::

::: step
Subcase $e_r \ge 2$. We remove the edge $v_i$–$u$ and add the edges $v_i$–$v_r$ and $u$–$v_r$. Both added pairs were non-edges: $v_i$–$v_r$ by the case, $u$–$v_r$ by the choice of $u$. Here we remove $v_1$–$v_5$ and add $v_1$–$v_2$ and $v_5$–$v_2$.
:::

::: step
Now the degrees. $v_i$ and $u$ each lose one edge and gain one, so they keep their degree, and $v_i$ stays full. $v_r$ gains two, which fits because its deficiency was at least 2. Here $v_2$ goes from 2 to 4.
:::
::::

When $e_r = 1$, two new edges at $v_r$ would be one too many. The exchange sends the second new
edge to another deficient vertex $v_k$ instead.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-2-one widget=stepper
caption: Case 2 with $e_r = 1$ for $(4, 4, 4, 4, 2, 2)$: $v_1$ trades its edge to $v_5$ for an edge to $v_2$, and $v_5$ gets an edge to the deficient $v_4$.
intent: New; the lecture has no proof of this theorem. Same graph as t01-erdos-gallai-facts. Here v_i is adjacent to v_k, the harder of the two ways to find w; w = v6 would do as well. The result is a realisation.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v2 -- v6; v3 -- v4; v3 -- v5
step: $e_2 = 1$; parity gives the deficient $v_4$.
class current: v2
class highlight: v4
mark vk: v4
step: $v_4$ is a neighbour of $v_2$.
class highlight: v2--v4
mark rk: v2--v4
step: $v_1$ has more neighbours than $v_4$: 4 against 3.
unclass highlight: v2--v4
class bold: v1--v3 v1--v4 v1--v5 v1--v6
mark vi: v1
step: We need a neighbour $w$ of $v_1$ that is not $v_4$ and not adjacent to $v_4$.
class color1: v1 v2 v3
mark N4: v1 v2 v3
step: $v_1$ has 3 other neighbours, and only $v_3$ is adjacent to $v_4$: $w = v_5$.
unclass highlight: v4
class highlight: v5
mark w: v5
step: Remove $v_1 v_5$; add $v_1 v_2$ and $v_5 v_4$.
unclass color1: v1 v2 v3
unclass bold: v1--v3 v1--v4 v1--v5 v1--v6
class rejected: v1--v5
v1 -- v2 [class=highlight]; v5 -- v4 [class=highlight]
step: Every degree now meets its target.
remove v1--v5
unclass highlight: v5
```

::: step
Subcase $e_r$ is 1, on the graph of the two facts: $v_1$ is not adjacent to $v_2$, and $v_2$ misses one edge. By the parity fact, some [[fig:t01-erdos-gallai-case-2-one#vk|$v_k$]] with $k > r$ is deficient. Here $v_k$ is $v_4$, with degree 3 of 4.
:::

::: step
If $v_k$ were not adjacent to $v_r$, Case 1 would apply: we would add that edge. So we may assume $v_k$ is a neighbour of $v_r$. Here [[fig:t01-erdos-gallai-case-2-one#rk|the edge $v_2$–$v_4$]] is there.
:::

::: step
[[fig:t01-erdos-gallai-case-2-one#vi|$v_i$]] is full, so its degree is $d_i$. As $i < k$ and the sequence is non-increasing, $d_i$ is at least $d_k$. And $d_k$ is more than the degree of $v_k$, which is deficient. So $v_i$ has more neighbours than $v_k$. Here 4 against 3.
:::

::: step
We want a neighbour $w$ of $v_i$ that is not $v_k$ and not in [[fig:t01-erdos-gallai-case-2-one#N4|$N(v_k)$]]. If $v_i$ is not adjacent to $v_k$, the last step gives one: not all neighbours of $v_i$ are neighbours of $v_k$, and $v_k$ is not a neighbour of $v_i$. Our example has the other situation.
:::

::: step
If $v_i$ is adjacent to $v_k$, then $v_i$ has its degree minus 1 neighbours other than $v_k$. At most the degree of $v_k$ minus 1 of them are adjacent to $v_k$, since $v_i$ itself is one neighbour of $v_k$. The first number is larger, so [[fig:t01-erdos-gallai-case-2-one#w|$w$]] exists. Here 3 against 2; only $v_3$ is shared, and $w$ is $v_5$.
:::

::: step
$w$ is not $v_r$, because $v_r$ is not a neighbour of $v_i$. We remove $v_i$–$w$ and add $v_i$–$v_r$ and $w$–$v_k$. Both were non-edges: the first by Case 2, the second by the choice of $w$. Here we remove $v_1$–$v_5$ and add $v_1$–$v_2$ and $v_5$–$v_4$.
:::

::: step
$v_i$ and $w$ each lose one edge and gain one. $v_r$ and $v_k$ gain one each: that fits, since $e_r$ is 1 and $v_k$ was deficient. Here every vertex now has its target, so the graph realises (4, 4, 4, 4, 2, 2).
:::
::::

Case 3 uses the hypothesis for $k = r$. The double count of the necessity part shows that
somewhere there is room for one more edge.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3 widget=stepper
caption: Case 3 for $(4, 4, 4, 4, 2, 2)$ with $r = 3$: the count for $A = \set{v_1, v_2, v_3}$ is $11$, below the bound $13$, because $v_1$ and $v_2$ are not adjacent.
intent: New; the lecture has no proof of this theorem. Edges inside A are highlighted, edges from A to B bold. Only the bound inside A is strict here, so this is Case 3a; t01-erdos-gallai-case-3a-one continues on this graph.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v2 -- v5; v2 -- v6; v3 -- v4
step: Degrees $(4, 4, 3, 3, 2, 2)$; neither Case 1 nor Case 2.
class current: v3
mark far: v5 v6
step: $A = \set{v_1, v_2, v_3}$: $11 = 2 \cdot 2 + 3 + 2 + 2$.
class color1: v1 v2 v3
class highlight: v1--v3 v2--v3
class bold: v1--v4 v1--v5 v1--v6 v2--v4 v2--v5 v2--v6 v3--v4
mark A: v1 v2 v3
mark B: v4 v5 v6
step: The hypothesis for $k = 3$: $11 + 1 \le 6 + 3 + 2 + 2$.
class highlight: v3
step: The bounds: $4 \le 6$, $3 \le 3$, $2 \le 2$, $2 \le 2$.
unclass highlight: v3
class highlight: v4 v5 v6
step: The bound inside $A$ is strict: $v_1$, $v_2$ are not adjacent.
unclass highlight: v4 v5 v6
class highlight: v1 v2
mark pair: v1 v2
```

::: step
Case 3: neither case applies. As Case 2 fails, $v_r$ is adjacent to all of $v_1$ to $v_{r-1}$. As Case 1 fails, each $v_k$ after $v_r$ that is not adjacent to $v_r$ is full. Here the degrees are (4, 4, 3, 3, 2, 2), $r$ is 3, [[fig:t01-erdos-gallai-case-3#far|$v_5$ and $v_6$]] are not adjacent to $v_3$, and both are full.
:::

::: step
Let [[fig:t01-erdos-gallai-case-3#A|$A$]] be $v_1$ to $v_r$ and [[fig:t01-erdos-gallai-case-3#B|$B$]] the rest. Only $v_r$ in $A$ misses edges, so the degree sum of $A$ is its target sum minus $e_r$. As in the necessity part, it is twice the edges inside $A$ plus, over $B$, the neighbours in $A$. Here: $11 = 2 \cdot 2 + 3 + 2 + 2$.
:::

::: step
The hypothesis, for $k$ equal to $r$, bounds the target sum of $A$ by $r(r-1)$ plus the sum of $\min(d_i, r)$ over $B$. The target sum is our count plus $e_r$, which is at least 1. So the count is strictly below it. Here 11 plus 1 is at most 6 + 3 + 2 + 2, which is 13.
:::

::: step
Each part of the count has its bound, as in the necessity part. Twice the edges inside $A$ is at most $r(r-1)$. A vertex $v_i$ of $B$ has at most $r$ neighbours in $A$, and at most $d_i$, as $d_i$ bounds its degree. Here: 4 against 6 inside $A$, and 3 against 3, 2 against 2, 2 against 2.
:::

::: step
If every part met its bound exactly, the count would equal the bound. It is smaller, so some part is strictly below its bound. Either two vertices of $A$ are not adjacent (Case 3a), or some $v_k$ in $B$ has fewer than $\min(d_k, r)$ neighbours in $A$ (Case 3b). Here [[fig:t01-erdos-gallai-case-3#pair|$v_1$ and $v_2$]] are not adjacent: Case 3a.
:::
::::

Case 3a fills the missing pair inside $A$ and pays for it by removing one edge at each vertex of the pair. First the
subcase $e_r \ge 2$, on a different sequence.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3a-two widget=stepper
caption: Case 3a with $e_r = 2$ for $(4, 4, 4, 2, 2, 2)$: $v_1$ and $v_2$ each give up an edge, and the edges $v_1 v_2$, $v_3 v_4$, $v_3 v_5$ come in. The result is a realisation.
intent: New; the lecture has no proof of this theorem. X_{v1} and X_{v2} are both {v4, v5, v6}; this is the only subrealisation of this sequence in Case 3a with e_r = 2.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v2 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v4; v2 -- v5; v2 -- v6
step: Degrees $(4, 4, 2, 2, 2, 2)$; $v_1$, $v_2$ in $A$ are not adjacent.
class color1: v1 v2 v3
class current: v3
class highlight: v1 v2
mark pair: v1 v2
step: $X_{v_1}$: neighbours of $v_1$ that are neither $v_3$ nor adjacent to $v_3$.
unclass highlight: v1 v2
class color2: v4 v5 v6
mark X1: v4 v5 v6
step: $v_1$ has 3 neighbours besides $v_3$; $v_3$ has 1 besides $v_1$.
class bold: v1--v4 v1--v5 v1--v6 v2--v3
mark other1: v1--v4 v1--v5 v1--v6
mark other3: v2--v3
step: So $X_{v_1}$ and $X_{v_2}$ have at least $4 - 2 = 2$ elements.
unclass bold: v1--v4 v1--v5 v1--v6 v2--v3
class bold: v2--v4 v2--v5 v2--v6
mark X2: v4 v5 v6
step: $u = v_4$ in $X_{v_1}$, $u' = v_5$ in $X_{v_2}$.
unclass bold: v2--v4 v2--v5 v2--v6
unclass color2: v4 v5 v6
class highlight: v4 v5
mark u: v4
mark u2: v5
step: Remove $v_1 v_4$, $v_2 v_5$; add $v_1 v_2$, $v_3 v_4$, $v_3 v_5$.
class rejected: v1--v4 v2--v5
v1 -- v2 [class=highlight]; v3 -- v4 [class=highlight]; v3 -- v5 [class=highlight]
step: Only $v_3$ changes degree: from 2 to 4.
remove v1--v4
remove v2--v5
unclass highlight: v4 v5
```

::: step
Case 3a: two vertices [[fig:t01-erdos-gallai-case-3a-two#pair|$v_i$ and $v_j$]] of $A$ are not adjacent. Neither is $v_r$, which is adjacent to all of $A$ in Case 3. So both come before $v_r$ and are full. Here the targets are (4, 4, 4, 2, 2, 2), the degrees (4, 4, 2, 2, 2, 2), $r$ is 3, and the pair is $v_1$, $v_2$.
:::

::: step
For $x$ one of the two, let [[fig:t01-erdos-gallai-case-3a-two#X1|$X_x$]] be the neighbours of $x$ that are neither $v_r$ nor adjacent to $v_r$. These are the vertices that we can move from $x$ to $v_r$. Here $X_{v_1}$ is $v_4$, $v_5$, $v_6$, and so is $X_{v_2}$.
:::

::: step
Why $X_x$ is large. $x$ is adjacent to $v_r$, so $x$ has its degree minus 1 [[fig:t01-erdos-gallai-case-3a-two#other1|neighbours other than $v_r$]]. At most the degree of $v_r$ minus 1 of them are adjacent to $v_r$: $x$ is a neighbour of $v_r$ but not of itself. Here 3 neighbours, against [[fig:t01-erdos-gallai-case-3a-two#other3|1]].
:::

::: step
So $X_x$ has at least the degree of $x$ minus the degree of $v_r$ elements. $x$ is full and comes before $v_r$, so its degree is $d_x$, at least $d_r$ by the order. So the bound is at least $d_r$ minus the degree of $v_r$, which is $e_r$. Here at least 4 − 2, which is 2, for [[fig:t01-erdos-gallai-case-3a-two#X2|$X_{v_2}$]] too.
:::

::: step
Subcase $e_r \ge 2$: both sets have at least 2 elements. We pick [[fig:t01-erdos-gallai-case-3a-two#u|$u$]] in $X_{v_i}$, then [[fig:t01-erdos-gallai-case-3a-two#u2|$u'$]] in $X_{v_j}$ other than $u$, which is possible because $X_{v_j}$ has a second element. Here $u$ is $v_4$ and $u'$ is $v_5$.
:::

::: step
We remove $v_i$–$u$ and $v_j$–$u'$ and add $v_i$–$v_j$, $u$–$v_r$, $u'$–$v_r$. All three were non-edges: by the case, and as $u$, $u'$ are not adjacent to $v_r$. Also $u \ne v_j$, as $v_j$ is not a neighbour of $v_i$; likewise $u' \ne v_i$. So no edge is removed and added at once.
:::

::: step
$v_i$, $v_j$, $u$ and $u'$ each lose one edge and gain one, so they keep their degree. $v_r$ gains two, which fits since $e_r \ge 2$. Here $v_3$ goes from 2 to 4, and the graph now realises (4, 4, 4, 2, 2, 2).
:::
::::

With $e_r = 1$, Case 3a sends one of the two freed edges to the deficient $v_k$ instead of to
$v_r$.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3a-one widget=stepper
caption: Case 3a with $e_r = 1$ for $(4, 4, 4, 4, 2, 2)$: with $w = v_5$ and $u' = v_6$, and again with $w = u' = v_5$; both choices give a realisation.
intent: New; the lecture has no proof of this theorem. Same graph as t01-erdos-gallai-case-3. The last step shows the choice w = u', which the proof treats separately.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v3; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v2 -- v5; v2 -- v6; v3 -- v4
step: $e_3 = 1$; $v_4$ is deficient and adjacent to $v_3$.
class color1: v1 v2 v3
class current: v3
class highlight: v4
mark vk: v4
step: $w = v_5$: a neighbour of $v_1$, not $v_4$, not adjacent to $v_4$.
unclass highlight: v4
class color2: v5 v6
class highlight: v5
mark N4: v1 v2 v3
mark w: v5
step: $u' = v_6$ in $X_{v_2} = \set{v_5, v_6}$.
class highlight: v6
mark X2: v5 v6
mark u2: v6
step: Remove $v_1 v_5$, $v_2 v_6$; add $v_1 v_2$, $v_5 v_4$, $v_6 v_3$.
unclass color2: v5 v6
class rejected: v1--v5 v2--v6
v1 -- v2 [class=highlight]; v5 -- v4 [class=highlight]; v6 -- v3 [class=highlight]
step: $v_3$ and $v_4$ gain one: a realisation.
remove v1--v5
remove v2--v6
unclass highlight: v5 v6
step: The other choice $w = u' = v_5$: remove $v_1 v_5$, $v_2 v_5$; add $v_1 v_2$, $v_5 v_4$, $v_5 v_3$.
remove v6--v3
v2 -- v6
remove v2--v5
v5 -- v3 [class=highlight]
class highlight: v5
mark same: v5
```

::: step
Subcase $e_r$ is 1, on the graph of the Case 3 figure: $v_1$, $v_2$ are the pair. By parity some [[fig:t01-erdos-gallai-case-3a-one#vk|$v_k$]] with $k > r$ is deficient. Case 1 does not apply, so $v_k$ is adjacent to $v_r$. Here $v_k$ is $v_4$, with degree 3 of 4.
:::

::: step
$v_i$ is full and comes before $v_k$, so as in Case 2 it has more neighbours than $v_k$, and it has a neighbour [[fig:t01-erdos-gallai-case-3a-one#w|$w$]] that is not $v_k$ and not in [[fig:t01-erdos-gallai-case-3a-one#N4|$N(v_k)$]]. Here the neighbours of $v_4$ are $v_1$, $v_2$, $v_3$; of the neighbours of $v_1$, $v_5$ and $v_6$ qualify. We take $v_5$ as $w$.
:::

::: step
We pick [[fig:t01-erdos-gallai-case-3a-one#u2|$u'$]] in [[fig:t01-erdos-gallai-case-3a-one#X2|$X_{v_j}$]], which is not empty by the bound of Case 3a. Here $X_{v_2}$ is $v_5$, $v_6$. We take $u'$ is $v_6$; the last step shows the other choice.
:::

::: step
We remove $v_i$–$w$ and $v_j$–$u'$ and add $v_i$–$v_j$, $w$–$v_k$, $u'$–$v_r$. These were non-edges by the case and by the choices of $w$ and $u'$. And $w \ne v_r$, as $v_r$ is adjacent to $v_k$ and $w$ is not; $u' \ne v_k$, as $v_k$ is adjacent to $v_r$ and $u'$ is not.
:::

::: step
When $w$ and $u'$ differ, each of $v_i$, $v_j$, $w$ and $u'$ loses one edge and gains one. $v_r$ and $v_k$ gain one each, which fits: $e_r$ is 1, and $v_k$ was deficient. Here every vertex now has its target: the graph realises (4, 4, 4, 4, 2, 2).
:::

::: step
The proof allows $w$ is $u'$. Then [[fig:t01-erdos-gallai-case-3a-one#same|this vertex]] loses two edges and gains the edges to $v_k$ and to $v_r$. These are two different edges, as $v_k \ne v_r$, and both are new by the choices. So its degree stays. Here $w = u' = v_5$, and we again reach (4, 4, 4, 4, 2, 2).
:::
::::

Case 3b looks at a vertex $v_k$ of $B$ with fewer neighbours in $A$ than the bound allows. First
the situation where $v_k$ is not adjacent to $v_r$: it moves one of its edges over to $v_r$.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3b-far widget=stepper
caption: Case 3b for $(4, 4, 4, 4, 2, 2)$ with $v_k = v_5$ not adjacent to $v_3 = v_r$: $v_5$ moves its edge from $v_6$ to $v_3$.
intent: New; the lecture has no proof of this theorem. v6 would serve as v_k as well, with x = v5.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v2; v1 -- v3; v1 -- v4; v1 -- v6; v2 -- v3; v2 -- v4; v2 -- v5; v3 -- v4; v5 -- v6
step: Degrees $(4, 4, 3, 3, 2, 2)$; $v_5$ has 1 neighbour in $A$.
class color1: v1 v2 v3
class current: v3
class highlight: v5 v2--v5
mark A: v1 v2 v3
mark vk: v5
step: $v_5$ is full; it has the neighbour $x = v_6$ in $B$.
unclass highlight: v2--v5
class highlight: v5--v6
mark x: v6
step: Remove $v_5 v_6$; add $v_5 v_3$.
unclass highlight: v5--v6
class rejected: v5--v6
v5 -- v3 [class=highlight]
step: $v_3$ gains one, $v_6$ loses one.
remove v5--v6
class highlight: v6
```

::: step
Case 3b: some [[fig:t01-erdos-gallai-case-3b-far#vk|$v_k$]] in $B$ has fewer than $\min(d_k, r)$ neighbours in [[fig:t01-erdos-gallai-case-3b-far#A|$A$]]. So fewer than $r$: some vertex of $A$ is not adjacent to $v_k$. And fewer than $d_k$. Here the degrees are (4, 4, 3, 3, 2, 2), $r$ is 3, and $v_5$ has 1 neighbour in $A$, against $\min(2, 3) = 2$.
:::

::: step
First situation: $v_k$ is not adjacent to $v_r$. Case 1 does not apply, so $v_k$ is full: its degree is $d_k$. That is more than its number of neighbours in $A$, so it has a neighbour [[fig:t01-erdos-gallai-case-3b-far#x|$x$]] in $B$. Here $v_5$ has degree 2 and 1 neighbour in $A$, and $x$ is $v_6$.
:::

::: step
We remove the edge $v_k$–$x$ and add the edge $v_k$–$v_r$, a non-edge in this situation. The vertex $x$ is not $v_r$, because $x$ lies in $B$. Here we remove $v_5$–$v_6$ and add $v_5$–$v_3$.
:::

::: step
$v_k$ loses one and gains one. $v_r$ gains one, which fits as it was deficient. $x$ loses one. That is allowed: $x$ comes after $v_r$, and a subrealisation only bounds degrees from above. Here $v_3$ reaches 4 and $v_6$ drops to 1.
:::
::::

Next, $v_k$ is adjacent to $v_r$ and still deficient: one exchange at a full vertex $v_i$
gives an edge to $v_k$ and one to $v_r$.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3b-deficient widget=stepper
caption: Case 3b for $(4, 4, 4, 4, 2, 2)$ with the deficient $v_k = v_4$ adjacent to $v_3 = v_r$: $v_1$ trades its edge to $v_5$ for one to $v_4$, and $v_5$ gets one to $v_3$.
intent: New; the lecture has no proof of this theorem. v_i = v2 or u = v6 would do as well.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v2; v1 -- v3; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v5; v2 -- v6; v3 -- v4
step: Degrees $(4, 4, 3, 1, 2, 2)$; $v_4$ has 1 neighbour in $A$, $v_3$.
class color1: v1 v2 v3
class current: v3
class highlight: v4
mark A: v1 v2 v3
mark vk: v4
step: $v_1$ is not adjacent to $v_4$.
unclass highlight: v4
class highlight: v1
mark vi: v1
step: $u = v_5$ in $X_{v_1} = \set{v_5, v_6}$.
unclass highlight: v1
class color2: v5 v6
class highlight: v5
mark X1: v5 v6
mark u: v5
step: Remove $v_1 v_5$; add $v_1 v_4$ and $v_5 v_3$.
unclass color2: v5 v6
class rejected: v1--v5
v1 -- v4 [class=highlight]; v5 -- v3 [class=highlight]
step: $v_3$ and $v_4$ gain one.
remove v1--v5
unclass highlight: v5
```

::: step
Second situation: [[fig:t01-erdos-gallai-case-3b-deficient#vk|$v_k$]] is adjacent to $v_r$. Here the degrees are (4, 4, 3, 1, 2, 2) and $r$ is 3. The vertex $v_4$ has 1 neighbour in [[fig:t01-erdos-gallai-case-3b-deficient#A|$A$]], namely $v_3$, against $\min(4, 3) = 3$.
:::

::: step
$v_k$ has fewer than $r$ neighbours in $A$, so some [[fig:t01-erdos-gallai-case-3b-deficient#vi|$v_i$]] in $A$ is not adjacent to $v_k$. It is not $v_r$, which is adjacent to $v_k$. So $i < r$: $v_i$ is full, and adjacent to $v_r$ by Case 3. Here $v_i$ is $v_1$; $v_2$ would also do.
:::

::: step
We pick [[fig:t01-erdos-gallai-case-3b-deficient#u|$u$]] in [[fig:t01-erdos-gallai-case-3b-deficient#X1|$X_{v_i}$]], not empty by the bound of Case 3a. $u \ne v_k$, as $v_k$ is adjacent to $v_r$ and $u$ is not. $u$ lies in $B$, as $v_r$ is adjacent to all other vertices of $A$. Here $X_{v_1}$ is $v_5$, $v_6$, and $u$ is $v_5$.
:::

::: step
$v_k$ is deficient. We remove $v_i$–$u$ and add $v_i$–$v_k$ and $u$–$v_r$. Both were non-edges: $v_i$ was chosen not adjacent to $v_k$, and $u$ not adjacent to $v_r$. Here we remove $v_1$–$v_5$ and add $v_1$–$v_4$ and $v_5$–$v_3$.
:::

::: step
$v_i$ and $u$ each lose one edge and gain one. $v_k$ and $v_r$ gain one each, which fits since both were deficient. Here $v_3$ reaches 4 and $v_4$ goes from 1 to 2.
:::
::::

Last, $v_k$ is adjacent to $v_r$ and already full: it gives up an edge into $B$ to make room.

:::: walkthrough {for=thm:erdos-gallai}
```graph id=t01-erdos-gallai-case-3b-full widget=stepper
caption: Case 3b for $(4, 4, 4, 4, 2, 2)$ with $r = 2$ and the full $v_k = v_3$: two edges go, $v_1 v_3$ and $v_5 v_2$ come in, and only $v_6$ (or $v_5$) in $B$ loses degree.
intent: New; the lecture has no proof of this theorem. Here r = 2, so A = {v1, v2}. Steps 4-5 take x = v6, step 6 the choice x = u = v5.
layout: fixed
v1 [label="$v_1$"] @(-1.2, 0.6); v2 [label="$v_2$"] @(0, 1.1); v3 [label="$v_3$"] @(1.2, 0.6)
v4 [label="$v_4$"] @(1.2, -0.6); v5 [label="$v_5$"] @(0, -1.1); v6 [label="$v_6$"] @(-1.2, -0.6)
v1 -- v2; v1 -- v4; v1 -- v5; v1 -- v6; v2 -- v3; v2 -- v4; v3 -- v4; v3 -- v5; v3 -- v6
step: Degrees $(4, 3, 4, 3, 2, 2)$; $v_3$ is full with 1 neighbour in $A$.
class color1: v1 v2
class current: v2
class highlight: v3
mark A: v1 v2
mark vk: v3
step: $v_i = v_1$, $u = v_5$ in $X_{v_1} = \set{v_5, v_6}$.
unclass highlight: v3
class color2: v5 v6
class highlight: v1 v5
mark vi: v1
mark X1: v5 v6
mark u: v5
step: $x = v_6$: a neighbour of $v_3$ in $B$.
unclass color2: v5 v6
unclass highlight: v1
class bold: v3--v4 v3--v5 v3--v6
class highlight: v6
mark xB: v3--v4 v3--v5 v3--v6
mark x: v6
step: Remove $v_1 v_5$, $v_3 v_6$; add $v_1 v_3$, $v_5 v_2$.
unclass bold: v3--v4 v3--v5 v3--v6
class rejected: v1--v5 v3--v6
v1 -- v3 [class=highlight]; v5 -- v2 [class=highlight]
step: $v_2$ gains one, $v_6$ loses one.
remove v1--v5
remove v3--v6
unclass highlight: v5
step: The other choice $x = u = v_5$: $v_5$ loses one, $v_6$ keeps 2.
unclass highlight: v6
v3 -- v6
remove v3--v5
class highlight: v5
mark same: v5
step: $v_2$ is full; $r$ moves on to 4.
unclass highlight: v5
unclass current: v2
class visited: v2
class current: v4
```

::: step
Third situation: [[fig:t01-erdos-gallai-case-3b-full#vk|$v_k$]] is adjacent to $v_r$ and full. Here the targets are (4, 4, 4, 4, 2, 2), the degrees (4, 3, 4, 3, 2, 2), so $r$ is 2 and [[fig:t01-erdos-gallai-case-3b-full#A|$A$]] is $v_1$, $v_2$. The vertex $v_3$ is full, adjacent to $v_2$, with 1 neighbour in $A$, against $\min(4, 2) = 2$.
:::

::: step
We choose [[fig:t01-erdos-gallai-case-3b-full#vi|$v_i$]] and [[fig:t01-erdos-gallai-case-3b-full#u|$u$]] as in the second situation: $v_i$ in $A$ not adjacent to $v_k$, and $u$ in [[fig:t01-erdos-gallai-case-3b-full#X1|$X_{v_i}$]], a vertex of $B$. Here $v_i$ is $v_1$, $X_{v_1}$ is $v_5$, $v_6$, and $u$ is $v_5$.
:::

::: step
$v_k$ is full, so its degree is $d_k$, which is more than its number of neighbours in $A$. So $v_k$ has a neighbour [[fig:t01-erdos-gallai-case-3b-full#x|$x$]] in $B$. Here $v_3$ has degree 4 and 1 neighbour in $A$; [[fig:t01-erdos-gallai-case-3b-full#xB|its neighbours in $B$]] are $v_4$, $v_5$, $v_6$. We take $v_6$ as $x$.
:::

::: step
We remove $v_i$–$u$ and $v_k$–$x$, and add $v_i$–$v_k$ and $u$–$v_r$. Both were non-edges: $v_i$ was chosen not adjacent to $v_k$, and $u$ not adjacent to $v_r$. Here we remove $v_1$–$v_5$ and $v_3$–$v_6$, and add $v_1$–$v_3$ and $v_5$–$v_2$.
:::

::: step
$v_i$ and $v_k$ each lose one edge and gain one. $v_r$ gains one, which fits as it was deficient. If $u \ne x$, then $u$ keeps its degree and $x$ loses one. That is allowed: $x$ lies in $B$, after $v_r$. Here $v_2$ reaches 4 and $v_6$ drops to 1.
:::

::: step
If we take $u$ itself as $x$, [[fig:t01-erdos-gallai-case-3b-full#same|this vertex]] loses two edges and gains one, so it loses one. Again the only vertex that loses degree lies in $B$. Here, with $x = u = v_5$, $v_5$ drops to 1 and $v_6$ keeps 2.
:::

::: step
In every case the degree of $v_r$ grows, $v_1$ to $v_{r-1}$ stay full, and no target is exceeded. That is the change the set-up asked for, so repeating it reaches a realisation. Here $v_2$ is full now, and the next deficient vertex is $v_4$: $r$ moves on to 4.
:::
::::

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
