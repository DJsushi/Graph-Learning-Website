---
title: "The max-flow min-cut theorem"
course: algorithms
chapter: flows
order: 4
lectures: [a02]
stage: split
status: draft
---

So **every flow value is at most every cut capacity** (weak duality). The theorem says that the bound is tight:

::: theorem {#thm:maxflow-mincut title="Max-flow min-cut theorem" aka="Ford–Fulkerson theorem" source="algorithms/02 p6"}
**(Ford, Fulkerson 1956)** In every flow network, the value of a maximum flow equals the capacity of a minimum $s$–$t$ cut.
:::

::: intuition
Weak duality ([[lem:flow-across-cut]]) says $\abs{f} \le \mathrm{cap}(S, T)$ for every flow and every cut. The theorem says that the smallest bottleneck is
always reached: the maximum flow fills the narrowest cut exactly. So a flow and a cut of the same value certify each other: both are optimal.
Example: in [[fig:a02-network]], the maximum flow has value $19$ ([[ex:ford-fulkerson-demo]]) and the cut $(\set{s, b}, \set{a, c, d, t})$ has capacity $19$.
With capacity $1$ on every arc, an integral flow is a d-flow ([[def:d-flow]]), which contains as many arc-disjoint $s$–$t$ paths as its value
([[claim:d-flow-paths]]), and a minimum cut corresponds to a minimum edge cut. So the theorem together with integrality ([[cor:integrality]]) gives the edge version of Menger's theorem ([[thm:menger-directed]] B;
[[exr:a02-menger-from-flow]]).
:::
The proof is given below, after [[def:residual-network|residual networks]]. (Historically, the problem was studied by Harris and Ross in 1955 for the U.S. Air Force, who
wanted to find the minimum cut of the Soviet railway network to Eastern Europe; the report was declassified in 1999.)
