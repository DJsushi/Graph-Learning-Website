---
title: "The Havel–Hakimi test"
course: theory
chapter: degrees
order: 4
lectures: [t01]
goal: Decide by hand whether a sequence of numbers is the degree sequence of a graph, and build such a graph.
needs: [theory/degrees/degree-sequences, theory/degrees/havel-hakimi, theory/basics/graph-families]
stage: taught
status: reviewed
---

Seven vertices carry the numbers 4, 4, 3, 3, 1, 1 and 0. Can we draw edges so that every vertex
gets exactly as many neighbours as its number says? Guessing edges takes long. The Havel–Hakimi
test answers in three rounds.

```graph id=t01-hh-question widget=figure
caption: Seven vertices and the degree each one should get. There are no edges yet.
intent: New figure for the opening question. The vertices and positions of t01-degree-sequence-example (the lecture example of theory/2026-09-15 p5) with its edges removed; the labels are the prescribed degrees.
layout: fixed
vertex-label: "{d}"
x [d=0] @(1, -0.8)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
mark big: l
mark next: r mt mb p
```

Start with [[fig:t01-hh-question#big|a vertex that wants 4 neighbours]]. It wants the most, so
it is the hardest to serve. We serve it first and give it the vertices that want the most:
[[fig:t01-hh-question#next|the other 4, both 3s and one of the 1s]]. Now this vertex is done.
Each of its four neighbours needs one neighbour less, so we lower their numbers by one.

What is left is the same question for six vertices. [[thm:havel-hakimi|The Havel–Hakimi
theorem]] says that this greedy choice never loses a solution: the old numbers can be met
exactly when the new ones can. We repeat until every number is 0, or until a number cannot be
met.

::: algorithm {#alg:havel-hakimi title="Havel–Hakimi test"}
**Input:** a sequence $(d_1, \dots, d_n)$ of non-negative integers. **Output:** whether it is
graphic (and a realisation, by reading the steps backwards).

```pseudo
repeat:                                                    // @loop
    sort the sequence non-increasingly: d_1 ≥ d_2 ≥ … ≥ d_k // @sort
    if all entries are 0: return GRAPHIC                    // @yes
    if d_1 > k − 1: return NOT GRAPHIC                      // @too-big
    remove d_1, subtract 1 from the next d_1 entries         // @reduce
    if some entry is negative: return NOT GRAPHIC           // @negative
```
:::

::: intuition
Each round settles one vertex for good: it gets its neighbours, and the shorter sequence records
what the other vertices still need. All zeros means every wish is met. A first entry larger
than the number of other vertices, or a negative entry, is a wish that cannot be met.
:::

Here is the test on the seven numbers from the start. The number on a vertex is how many
neighbours it still needs. A settled vertex is muted. We draw the new edges of a round thick.

```graph id=t01-hh-rounds widget=stepper
caption: The Havel–Hakimi test on (4, 4, 3, 3, 1, 1, 0). Each number is the degree the vertex still needs; muted vertices are settled.
intent: New figure, worked example. The vertices and positions of t01-degree-sequence-example (theory/2026-09-15 p5); the rounds draw exactly the edges of that lecture graph. The ties between the two 1s are broken towards p.
layout: fixed
vertex-label: "{d}"
x [d=0] @(1, -0.8)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
mark r1: l r mt mb p
mark r2: r mt mb q
step: The sorted sequence (4, 4, 3, 3, 1, 1, 0). No edges yet.
step: Round 1. The first 4 joins the next four vertices. It is settled, and their numbers drop by one. Left: (3, 2, 2, 0, 1, 0).
l -- r [bend=0.5 class=bold]; l -- mt [class=bold]; l -- mb [class=bold]; l -- p [class=bold]
set l [d=0 class=muted]
set r [d=3]
set mt [d=2]
set mb [d=2]
set p [d=0]
step: Round 2. Sorted: (3, 2, 2, 1, 0, 0). The 3 joins both 2s and the 1. Left: (1, 1, 0, 0, 0).
unclass bold: l--r l--mt l--mb l--p
r -- mt [class=bold]; r -- mb [class=bold]; r -- q [class=bold]
set r [d=0 class=muted]
set mt [d=1]
set mb [d=1]
set q [d=0]
step: Round 3. The first 1 joins the other 1. Left: (0, 0, 0, 0).
unclass bold: r--mt r--mb r--q
mt -- mb [class=bold]
set mt [d=0 class=muted]
set mb [d=0]
step: All entries are 0, so the answer is GRAPHIC. The labels now show the degrees of the drawn graph: (4, 4, 3, 3, 1, 1, 0).
unclass bold: mt--mb
unclass muted: l r mt
set l [d=4]
set r [d=4]
set mt [d=3]
set mb [d=3]
set p [d=1]
set q [d=1]
```

In [[fig:t01-hh-rounds#r1|round 1]] the two 1s tie, and either of them may be chosen. In
[[fig:t01-hh-rounds#r2|round 2]] we sort again first: the leftover 1 moves in front of the two
0s. The edges drawn in the rounds form a graph with exactly the wished degrees.

Now run the test yourself, one line of the algorithm at a time.

```graph id=t01-havel-hakimi-player widget=player
caption: Run the Havel–Hakimi test step by step on the degree sequence of the example graph above.
intent: Algorithm player for the sequence test; the state panel shows the current sequence and the graph is built backwards at the end.
algo: havel-hakimi
params: seq="4,4,3,3,1,1,0"
```

## Why the answer is right

The test stops. Each round removes one entry, so there are at most $n$ rounds.

Each round keeps the answer. Line `@sort` makes the sequence non-increasing, and line `@too-big`
has checked that the first entry is at most the number of other entries. These are the
hypotheses of [[thm:havel-hakimi]]. So the sequence before the round is graphic exactly when the
shorter sequence after it is.

The two NOT GRAPHIC lines are right. At `@too-big` a vertex needs more neighbours than there are
other vertices. At `@negative` the shorter sequence asks for a negative degree, so it is not
graphic, and by the theorem neither was the sequence before. The all-zero sequence is graphic:
the graph without edges realises it.

To build a realisation, run the rounds backwards. Each time, add the removed vertex and join it
to the vertices whose entries it lowered, as in the ⇐ part of the proof. These are the edges we
drew during the rounds.

The lecture ran the test on a longer sequence.

::: example {#ex:havel-hakimi-11 title="A long Havel–Hakimi run" source="theory/2026-09-15 p6"}
Is $(7, 6, 6, 5, 4, 2, 2, 2, 2, 1, 1)$ graphic? (The sum is $38$, which is even.)

$$
\begin{aligned}
&(7, 6, 6, 5, 4, 2, 2, 2, 2, 1, 1) \\
\xrightarrow{-7}\ &(5, 5, 4, 3, 1, 1, 1, 2, 1, 1) \ \sim\ (5, 5, 4, 3, 2, 1, 1, 1, 1, 1) \\
\xrightarrow{-5}\ &(4, 3, 2, 1, 0, 1, 1, 1, 1) \ \sim\ (4, 3, 2, 1, 1, 1, 1, 1, 0) \\
\xrightarrow{-4}\ &(2, 1, 0, 0, 1, 1, 1, 0) \ \sim\ (2, 1, 1, 1, 1, 0, 0, 0).
\end{aligned}
$$

The last sequence is obviously graphic: a [[def:path-graph|path]] with degrees $1, 2, 1$, one more edge (degrees
$1, 1$) and three isolated vertices. So the original sequence is graphic, and adding the removed
vertices back gives a realisation.
:::

```graph id=t01-havel-hakimi-build widget=stepper
caption: Building a realisation of $(7,6,6,5,4,2,2,2,2,1,1)$ by running the Havel–Hakimi steps backwards. $v_i$ is the vertex that ends with degree $d_i$.
intent: Turn the abstract run into a picture: each step re-inserts the removed vertex adjacent to the vertices whose entries were decreased.
layout: force seed=3
v1 [label="$v_1$" class=hidden]; v2 [label="$v_2$" class=hidden]; v3 [label="$v_3$" class=hidden]
v4 [label="$v_4$"]; v5 [label="$v_5$"]; v6 [label="$v_6$"]; v7 [label="$v_7$"]; v8 [label="$v_8$"]; v9 [label="$v_9$"]; v10 [label="$v_{10}$"]; v11 [label="$v_{11}$"]
v4 -- v5; v4 -- v8; v10 -- v11
step: Realisation of the final sequence $(2,1,1,1,1,0,0,0)$: $v_4$ has degree 2, $v_5, v_8, v_{10}, v_{11}$ degree 1, and $v_6, v_7, v_9$ are isolated.
step: Undo the third round: add $v_3$ adjacent to $v_4, v_5, v_9, v_7$ (the entries $3,2,1,1$ that were decreased).
unclass hidden: v3
v3 -- v4 [class=highlight]; v3 -- v5 [class=highlight]; v3 -- v9 [class=highlight]; v3 -- v7 [class=highlight]
step: Undo the second round: add $v_2$ adjacent to $v_3, v_4, v_5, v_9, v_6$.
unclass hidden: v2
unclass highlight: v3--v4 v3--v5 v3--v9 v3--v7
v2 -- v3 [class=highlight]; v2 -- v4 [class=highlight]; v2 -- v5 [class=highlight]; v2 -- v9 [class=highlight]; v2 -- v6 [class=highlight]
step: Undo the first round: add $v_1$ adjacent to $v_2, \dots, v_8$. The degree sequence is now $(7,6,6,5,4,2,2,2,2,1,1)$.
unclass hidden: v1
unclass highlight: v2--v3 v2--v4 v2--v5 v2--v9 v2--v6
v1 -- v2 [class=highlight]; v1 -- v3 [class=highlight]; v1 -- v4 [class=highlight]; v1 -- v5 [class=highlight]; v1 -- v6 [class=highlight]; v1 -- v7 [class=highlight]; v1 -- v8 [class=highlight]
```

Two sequences that fail, one at each NOT GRAPHIC line:

::: example {#ex:havel-hakimi-fail title="Sequences that are not graphic" source="theory/2026-09-15 p6"}
1. $(4, 4, 2, 2, 0) \xrightarrow{-4} (3, 1, 1, -1)$. A negative entry appears, so the sequence is
   not graphic. (Directly: two vertices of degree 4 among five vertices would both be adjacent to
   every other vertex, including the vertex of degree 0.)
2. $(7, 2, 2, 1, 1, 1)$: here $d_1 = 7 > 5 = n - 1$, so there are not even enough other vertices
   for the first one, although the sum $14$ is even. Not graphic.
:::

::: pitfall
Always **re-sort** before the next round, and always remove the **largest** entry. On an
unsorted sequence the test can answer wrongly. Take 1, 1, 2, 2 and treat the first 1 as the
largest entry: we get 0, 2, 2, which is not graphic. Yet 2, 2, 1, 1 is the degree sequence of
a path with three edges (compare [[exr:t01-havel-hakimi-ties]]).
:::

## Check yourself

:::: quiz {#q:t01-hh-stop}
The sequence (3, 3, 3, 1) has an even sum, and no entry is larger than 3. Where does the
Havel–Hakimi test stop?

- [ ] At `@yes`: the sequence is graphic.
- [ ] At `@too-big` in the first round.
- [x] At `@negative` in the second round.

::: explanation
Round 1 removes a 3 and lowers the next three entries: (2, 2, 0). Round 2 removes a 2 and
lowers the next two entries: (1, −1). A negative entry appears, so the sequence is not graphic.
:::
::::

:::: quiz {#q:t01-hh-edges}
The test on (3, 3, 2, 2, 2) returns GRAPHIC. How many edges does the graph built from its rounds
have?

answer: 6

::: explanation
Each round joins the removed vertex to as many vertices as its entry says. The rounds remove a
3, then a 2, then a 1, so they draw 3 + 2 + 1 = 6 edges. This agrees with the handshake lemma:
the degrees add up to 12, twice the number of edges.
:::
::::

## More

Each round of the test is one application of [[thm:havel-hakimi]]. There are at most $n$
rounds, each a sort and at most $n$ subtractions, so the test is fast.

The smallest example: $(2, 2, 2) \to (1, 1) \to (0)$, so $(2, 2, 2)$ is graphic, and running
the rounds backwards gives the triangle.
