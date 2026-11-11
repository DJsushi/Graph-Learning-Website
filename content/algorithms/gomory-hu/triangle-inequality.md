---
title: "The triangle inequality for minimum cuts"
course: algorithms
chapter: gomory-hu
order: 7
lectures: [a03]
stage: split
status: draft
---

The proof of the construction also needs two simple facts about minimum cut values, which hold in every undirected network (write $f = f_G$).

::: lemma {#lem:flow-triangle title="Triangle inequality" aka="Lemma A" source="algorithms/03 p19"}
For distinct $u, v, w \in V$: $\quad f(u, w) \ge \min(f(u, v), f(v, w))$.
:::

::: lemma {#lem:flow-triangle-path title="Transitive triangle inequality" aka="Lemma B" source="algorithms/03 p19"}
For $u = v_0, v_1, \dots, v_k = w \in V$ with $u \ne w$ and $v_{i-1} \ne v_i$ for all $i$:
$$f(u, w) \ge \min(f(v_0, v_1), f(v_1, v_2), \dots, f(v_{k-1}, v_k)).$$
:::

::: proof {title="Proof of both lemmas" for=lem:flow-triangle-path}
Let $\delta(U)$ be a minimum $u$–$w$ cut with $u \in U$, $w \notin U$. The sequence $v_0, \dots, v_k$ starts in $U$ and ends outside $U$, so for some
$i$, $v_{i-1} \in U$ and $v_i \notin U$. Then $\delta(U)$ separates $v_{i-1}$ and $v_i$, and
$f(v_{i-1}, v_i) \le c(\delta(U)) = f(u, w)$. Lemma A is the case $k = 2$, $v_1 = v$.
:::

::: intuition {for=lem:flow-triangle}
Any cut separating $u$ from $w$ must also separate $v$ from one of them, so it is at least as expensive as one of the two cheaper separations.
Example: in [[fig:a03-network]], $f(a, d) = 13 \ge \min(f(a, f), f(f, d)) = \min(17, 13)$. Non-example: the inequality is no "$\le$": $f(a, b) = 18$, but
$\min(f(a, d), f(d, b)) = 13$.
:::

::: intuition {for=lem:flow-triangle-path}
Along any route of intermediate vertices from $u$ to $w$, the cheapest $u$–$w$ cut has to break some step of the route, so it is at least the weakest
step. [[prop:gomory-hu-path]] is the case where the route is a tree path and equality holds. Example: along $a, b, f, e, d$ in
[[fig:a03-network]], the minimum of $18, 17, 13, 14$ is $13 = f(a, d)$.
:::
