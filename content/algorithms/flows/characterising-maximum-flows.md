---
title: "When is a flow maximum?"
course: algorithms
chapter: flows
order: 7
lectures: [a02]
stage: split
status: draft
---

::: theorem {#thm:maxflow-characterisation title="Characterisation of maximum flows"}
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

The lecture states this without proof.

**After a maximum flow is found, a minimum cut is the set of vertices reachable from $s$ in the residual graph.**
