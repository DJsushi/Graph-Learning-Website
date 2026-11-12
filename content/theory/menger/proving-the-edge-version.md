---
title: "Proving the edge version"
course: theory
chapter: menger
order: 6
lectures: [t05]
stage: split
status: draft
---

The lecture introduces the following notion, a set of arcs that "flows" from $s$ to $t$ with one unit on each arc.

::: definition {#def:d-flow title="d-flow" defines="d-flow" source="theory/2026-10-13 p6"}
A set $F \subseteq E(G)$ of arcs of a directed multigraph is an **$s$–$t$ d-flow** if, counting only arcs of $F$, the in-degree of $s$ is $0$,
the out-degree of $t$ is $0$, and every other vertex has in-degree equal to its out-degree. The **size** of $F$ is the out-degree of $s$ in
$F$.
:::

::: intuition
A d-flow is a [[def:flow|flow]] in which every arc carries $0$ or $1$ units: $F$ is the set of arcs carrying one unit, the
balance condition is flow conservation, and the size is the value of the flow. Example: a directed $s$–$t$ path is a d-flow of
size $1$, and the union of $k$ edge-disjoint ones is a d-flow of size $k$. A directed [[def:cycle-graph|cycle]] avoiding $s$ and
$t$ is a d-flow of size $0$, so a d-flow need not be a union of paths; it only contains them ([[claim:d-flow-paths]]).
Non-example: a directed cycle through $s$, since then an arc of $F$ enters $s$.
:::

The size is also the in-degree of $t$ in $F$: summing (out-degree $-$ in-degree) over all vertices counts every arc once with $+1$ and once
with $-1$, so the total is $0$; all vertices except $s$ and $t$ contribute $0$, so $d^+_F(s) - 0 + 0 - d^-_F(t) = 0$.

```graph id=t05-d-flow widget=figure
caption: A d-flow $F$ of size 3 (bold arcs): balanced at every vertex except $s$ (3 out) and $t$ (3 in).
intent: Transcription of the lecture example of a d-flow; non-flow arcs muted.
type: directed
layout: layered
s [class=source]; t [class=sink]
s -> a [class=path]; s -> b [class=path]; s -> c [class=path]
a -> d [class=path]; b -> d [class=path]; d -> t [class=path]; d -> e [class=path]; c -> e [class=muted]
e -> t [class=path]; c -> t [class=path]; a -> b [class=muted]; e -> c [class=muted]
```

::: claim {#claim:d-flow-paths title="d-flows contain disjoint paths" source="theory/2026-10-13 p6"}
If $F$ is an $s$–$t$ d-flow of size $k$, then $F$ contains $k$ edge-disjoint directed $s$–$t$ paths.
:::

The lecture states this without proof.

The lecture states [[thm:menger-directed|the edge version (B)]] without proof either.

```graph id=t05-augmenting-player widget=player
caption: Ford–Fulkerson with all capacities 1 finds a maximum d-flow and, at the end, the cut $D$ leaving the set $R$ of reachable vertices.
intent: Connect Menger B with the flow algorithm of the algorithms course. Unit capacities.
type: directed
layout: layered
algo: ford-fulkerson
params: source=s sink=t
s [class=source]; t [class=sink]
s -> a [c=1]; s -> b [c=1]; s -> c [c=1]; a -> d [c=1]; b -> d [c=1]; c -> e [c=1]; d -> t [c=1]; d -> e [c=1]; e -> t [c=1]; a -> b [c=1]
```
