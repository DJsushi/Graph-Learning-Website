---
title: "Packets"
course: algorithms
chapter: mst
order: 14
lectures: [a01]
stage: split
status: draft
---

Each Fredman–Tarjan phase still does up to $\Theta(m)$ `DECREASE-KEY` operations, one for every edge scanned from a newly added vertex. Their cost is already
$\O(1)$, so we must decrease their **number**. Observation: from the edges incident with a vertex $u$ added to the tree, we are interested only in the lightest
ones; the heavy ones may not even be needed before the algorithm finishes. **Idea:** avoid processing heavy edges before light ones by putting edges into
**packets**.

::: algorithm {#alg:gabow-packets title="Packets (Gabow, Galil, Spencer, Tarjan)" source="algorithms/01 p34–35"}
1. For each vertex $v$, split its incident edges into packets of $p$ edges each (one packet may be smaller): about $2m/p$ packets in total.
2. Sort each packet internally ($\O(m \log p)$ in total); the weight of a packet is the weight of its lightest edge.
3. Run Fredman–Tarjan on packets instead of edges: put only the lightest remaining edge of each packet into the heap; once it is used, take the next one
   from the same packet.
:::

::: intuition
Most `DECREASE-KEY` operations come from heavy edges that turn out to be useless, because a lighter edge reaches the same vertex first. A sorted
packet hides its heavier edges behind its lightest one, and they enter the heap only when needed. Example: a vertex with $12$ incident edges and
$p = 3$ has $4$ packets, so it first puts only $4$ edges into the heap instead of $12$.
:::

Choosing $p = \beta(m, n)$, there are still at most $\beta(m, n)$ phases, the heap work per phase drops to $\O(m/p)$, and packet manipulation costs
$\O(m \log \beta(m, n))$ in total. **Total time: $\O(m \log \beta(m, n))$.**
