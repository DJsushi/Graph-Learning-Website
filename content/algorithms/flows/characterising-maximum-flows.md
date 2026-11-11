---
title: "When is a flow maximum?"
course: algorithms
chapter: flows
order: 7
lectures: [a02]
stage: split
status: draft
---

Now we can prove the main theorem, together with the correctness criterion for augmenting path algorithms.

::: theorem {#thm:maxflow-characterisation title="Characterisation of maximum flows" extra=true}
For a flow $f$ the following are equivalent:

1. $f$ is a maximum flow;
2. $G_f$ contains no augmenting path;
3. there is an $s$–$t$ cut $(S, T)$ with $\abs{f} = \mathrm{cap}(S, T)$.
:::

::: intuition
This is the stopping rule of every augmenting-path algorithm: as long as some augmenting path exists we can improve, and once none exists the
search itself produces a certificate of optimality, the cut between the vertices we can still reach from $s$ in $G_f$ and the rest. Example: at
the end of [[ex:ford-fulkerson-demo]], only $s$ and $b$ are reachable, and the cut $(\set{s, b}, \set{a, c, d, t})$ has capacity $19 = \abs{f}$.
Non-example: for the flow of value $8$ in [[fig:a02-residual-example]], $t$ is reachable via $s \to b \to d \to t$, so the flow is not maximum.
:::

::: proof
**1 ⇒ 2:** if there were an augmenting path, [[lem:augment]] would give a larger flow.

**2 ⇒ 3:** let $S$ be the set of vertices reachable from $s$ in $G_f$, and $T = V \setminus S$. Then $s \in S$ and $t \in T$ (no augmenting path). Every edge $(u, v) \in E$ with
$u \in S$, $v \in T$ is saturated, $f(u, v) = c(u, v)$, since otherwise $(u, v) \in E_f$ and $v$ would be reachable. Every edge $(u, v) \in E$ with $u \in T$, $v \in S$ has
$f(u, v) = 0$, since otherwise $(v, u) \in E_f$ and $u$ would be reachable. By [[lem:flow-across-cut]], $\abs{f} = \mathrm{cap}(S, T)$.

**3 ⇒ 1:** by [[lem:flow-across-cut]], every flow $g$ satisfies $\abs{g} \le \mathrm{cap}(S, T) = \abs{f}$.
:::

::: proof {title="Proof of the max-flow min-cut theorem" for=thm:maxflow-mincut}
A maximum flow exists: the set of flows is a compact subset of $\R^E$ (closed and bounded, defined by finitely many non-strict linear inequalities and equalities),
and $\abs{f}$ is a continuous function on it. For a maximum flow $f$, [[thm:maxflow-characterisation]] gives a cut with $\mathrm{cap}(S, T) = \abs{f}$, and by
[[lem:flow-across-cut]] no cut has smaller capacity. So the maximum flow value equals the minimum cut capacity.
:::

The proof of 2 ⇒ 3 is constructive: **after a maximum flow is found, a minimum cut is the set of vertices reachable from $s$ in the residual graph.**
