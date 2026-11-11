---
title: Maximum flow
course: algorithms
lecture: 2
slug: a02
summary: Flow networks, cuts and the max-flow min-cut theorem, residual networks and augmenting paths, Ford–Fulkerson, Edmonds–Karp, level graphs and blocking flows (Dinic), the MPM algorithm, and unit-capacity networks with bipartite matchings.
prerequisites: [theory/05-connectivity-menger, algorithms/01-minimum-spanning-trees]
sources:
  - resources/graph-algorithms/02-flows.pdf
status: draft
---

How much water can be pumped from a source to a sink through a network of pipes of limited capacity? How many trains
can travel from one city to another per hour, how much data can be routed between two servers? These are **maximum
flow** problems. Their theory is beautiful (the max-flow min-cut theorem is a far-reaching generalization of Menger's
theorem, [[thm:menger-directed]]), and their algorithms are among the most widely used in combinatorial optimisation:
many problems that do not look like flows at all (matchings, scheduling, image segmentation, project selection) reduce
to them.

## Summary

- A flow respects capacities and conservation; its value is the net flow out of $s$ ([[def:flow]]). For every cut, $\abs{f} \le \mathrm{cap}(S, T)$ ([[lem:flow-across-cut]]).
- Max-flow min-cut: maximum flow value $=$ minimum cut capacity ([[thm:maxflow-mincut]]); $f$ is maximum iff $G_f$ has no
  [[def:augmenting-path|augmenting path]], and then the vertices reachable from
  $s$ in $G_f$ form a minimum cut ([[thm:maxflow-characterisation]]).
- Ford–Fulkerson: augment along any path, $\O(nmC)$ for integer [[def:flow-network|capacities]]; integral maximum flows exist ([[thm:ford-fulkerson-analysis]], [[cor:integrality]]).
- Edmonds–Karp: shortest augmenting paths, $\O(m^2 n)$ ([[thm:edmonds-karp]]), via level graphs ([[def:level-graph]]).
- Dinic: [[def:blocking-flow|blocking flows]] in level graphs, at most $n$ phases, $\O(mn^2)$ ([[thm:dinic]]); MPM: blocking flows in $\O(n^2)$, $\O(n^3)$ total ([[thm:mpm-time]]).
- Unit capacities: Dinic in $\O(m^{3/2})$ ([[thm:unit-dinic]]); bipartite [[def:matching|matching]] reduces to flow ([[prop:matching-flow]]).
- With unit capacities and integrality, max-flow min-cut gives Menger's theorem ([[thm:menger-directed]]; [[exr:a02-menger-from-flow]]).

## Exercises

```graph id=a02-ex-min-cut widget=exercise
task: select-vertices
type: directed
prompt: Select the source side $S$ of a minimum $s$–$t$ cut (including $s$).
check: is-min-cut-side source=s sink=t
hint: Run Ford–Fulkerson (or look at the player above); at the end, take the vertices reachable from $s$ in the residual network.
solution: $S = \set{s, b}$: the cut edges are $(s, a)$ and $(b, d)$ with total capacity $10 + 9 = 19$, which equals the maximum flow value.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

```graph id=a02-ex-max-flow-value widget=exercise
task: answer
type: directed
prompt: What is the value of a maximum flow in this network?
answer: 23
hint: Find a cut whose capacity equals the value of a flow you can construct.
solution: The cut $(\set{s, a, b, d}, \set{c, t})$ has capacity $c(a,c) + c(d,c) + c(d,t) = 12 + 7 + 4 = 23$ (the edge $(c, b)$ goes backwards and does not count). A flow of value $23$: $12$ units along $s\,a\,c\,t$, $7$ along $s\,b\,d\,c\,t$ and $4$ along $s\,b\,d\,t$. So the maximum flow value is $23$.
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, -1); c @(3, 1); d @(3, -1); t [class=sink] @(4.5, 0)
s -> a [c=16]; s -> b [c=13]; a -> b [c=10]; b -> a [c=4]; a -> c [c=12]; c -> b [c=9]; b -> d [c=14]; d -> c [c=7]; c -> t [c=20]; d -> t [c=4]
```

```graph id=a02-ex-matching widget=exercise
task: select-edges
prompt: Select a maximum matching of this bipartite graph.
check: is-max-matching
hint: Each left vertex can be matched to at most one right vertex. Start greedily, then look for augmenting paths that alternate between unmatched and matched edges.
solution: A perfect matching exists: $a_1 b_2$, $a_2 b_1$, $a_3 b_3$, $a_4 b_4$.
layout: bipartite left="a1 a2 a3 a4"
a1 [label="$a_1$"]; a2 [label="$a_2$"]; a3 [label="$a_3$"]; a4 [label="$a_4$"]; b1 [label="$b_1$"]; b2 [label="$b_2$"]; b3 [label="$b_3$"]; b4 [label="$b_4$"]
a1 -- b1; a1 -- b2; a2 -- b1; a3 -- b2; a3 -- b3; a4 -- b3; a4 -- b4
```

:::: exercise {#exr:a02-menger-from-flow title="Menger from max-flow min-cut" difficulty=2}
Derive the edge version of Menger's theorem for directed graphs ([[thm:menger-directed]] B) from the max-flow min-cut theorem and the integrality theorem.

::: solution
<!-- REVIEW: added the reduction to a flow network (Menger's digraphs may have parallel arcs and arcs into s / out of t, which def:flow-network excludes); the 0/1 flow below then becomes an integral flow whose value on a merged arc is split among its copies. -->
First delete the arcs entering $s$ and leaving $t$: they lie on no $s$–$t$ path, and an edge cut stays an edge cut without them. Parallel arcs
are merged into one arc whose [[def:flow-network|capacity]] is their number; every other arc gets capacity $1$. An $s$–$t$ edge cut $F$ of size $k$ yields an $s$–$t$ cut of capacity at most $k$: take $S$ as the set of vertices reachable from $s$ in $G - F$; all arcs
from $S$ to $T$ lie in $F$. Conversely, the arcs from $S$ to $T$ of any cut $(S, T)$ form an edge cut of size $\mathrm{cap}(S, T)$. So the minimum cut capacity equals the minimum size of an
edge cut. By max-flow min-cut and integrality, there is an integral [[def:flow|flow]] of that value. Take every arc with flow $1$ and, for a merged arc with
flow $j$, $j$ of its parallel copies: these arcs form a d-flow in the sense of [[def:d-flow]], which decomposes into that many
edge-disjoint paths ([[claim:d-flow-paths]]).
:::
::::

:::: exercise {#exr:a02-vertex-capacities title="Vertex capacities" difficulty=2}
Suppose that, in addition to edge capacities, every vertex $v \ne s, t$ has a capacity $c(v)$ limiting the total flow through it. Reduce this problem to the ordinary max-flow problem.

::: solution
Split every vertex $v \ne s, t$ into $v^-$ and $v^+$ joined by an edge $(v^-, v^+)$ of capacity $c(v)$; edges entering $v$ now enter $v^-$, edges leaving $v$ leave $v^+$ (this is the
construction from the proof of Menger's theorem, part A of [[thm:menger-directed]], see [[fig:t05-vertex-splitting]]). Flows in the new network correspond to flows in the old one respecting the vertex capacities, with
the same value. With all edge and vertex capacities $1$, internally disjoint $s$–$t$ paths of the old graph become arc-disjoint paths of the new one:
this is how part A of Menger's theorem follows from part B.
:::
::::

:::: exercise {#exr:a02-min-cut-unique title="Is the minimum cut unique?" difficulty=2}
Give a network with two different minimum cuts. How can you find the minimum cut whose source side $S$ is as large as possible?

::: solution
A path $s \to a \to t$ with both capacities $1$ has minimum cuts $(\set{s}, \set{a, t})$ and $(\set{s, a}, \set{t})$. For the largest source side, take a maximum flow $f$ and let $T$ be the set
of vertices from which $t$ is reachable in $G_f$; then $(V \setminus T, T)$ is a minimum cut (by the symmetric argument of [[thm:maxflow-characterisation]]), and its source side contains
the source side of every minimum cut.
:::
::::

:::: quiz {#q:a02-residual}
An edge $e = (u, v)$ has capacity 7 and flow 3. Which residual edges does it produce?

- [ ] Only $(u, v)$ with capacity 4
- [ ] Only $(v, u)$ with capacity 3
- [x] $(u, v)$ with capacity 4 and $(v, u)$ with capacity 3
- [ ] $(u, v)$ with capacity 7

::: explanation
$f(e) < c(e)$ gives the forward edge with $c_f = 7 - 3 = 4$; $f(e) > 0$ gives the reverse edge with $c_f = 3$ ([[def:residual-network]]).
:::
::::

:::: quiz {#q:a02-blocking-max}
Is every blocking flow a maximum flow?

- [ ] Yes
- [x] No

::: explanation
Every maximum flow is blocking ([[def:blocking-flow]]), but not conversely: see the example with a blocking flow of value 5 and maximum flow 8.
:::
::::

:::: quiz {#q:a02-ek-complexity}
What is the running time of the Edmonds–Karp algorithm?

- [ ] $\O(mnC)$
- [x] $\O(m^2 n)$
- [ ] $\O(mn^2)$
- [ ] $\O(n^3)$

::: explanation
$\O(mn)$ augmentations ([[lem:ek-monotone]], [[lem:ek-phase]]), each found by BFS in $\O(m)$.
:::
::::

:::: quiz {#q:a02-dinic-phases}
At most how many phases does Dinic's algorithm perform on a network with $n = 50$ vertices?

answer: 49

<!-- REVIEW: answer was 50 (the lecture's bound n). The argument gives n − 1 = 49: the s–t distance takes values in {1, …, n − 1} and strictly increases each phase. -->
::: explanation
Each phase strictly increases the $s$–$t$ distance in the residual network, which is between $1$ and $n - 1$ ([[lem:dinic-phases]]), so there are at most $n - 1 = 49$ phases; the lecture states the weaker bound $n$.
:::
::::
