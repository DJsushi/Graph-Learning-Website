---
title: "The Havel–Hakimi test"
course: theory
chapter: degrees
order: 4
lectures: [t01]
stage: split
status: draft
---

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
Each round settles one vertex for good: it is given its neighbours, and the remaining sequence
records what the other vertices still need. So the test is [[thm:havel-hakimi]] applied at most
$n$ times, each round a sort and at most $n$ subtractions. Example:
$(2, 2, 2) \to (1, 1) \to (0)$, so the sequence is graphic, and running the rounds backwards gives
the triangle. Non-example: $(4, 4, 2, 2, 0) \to (3, 1, 1, -1)$ stops at `@negative`.
:::

::: pitfall
Always **re-sort** before the next round, and always remove the **largest** entry. Working on
an unsorted sequence gives wrong answers: treating $(1, 1, 2, 2)$ as if $1$ were the largest
entry gives $(0, 2, 2)$, which is not graphic, although $(2, 2, 1, 1)$ is realised by $P_3$
(compare [[exr:t01-havel-hakimi-ties]]).
:::

Each round shortens the sequence by one, so the test finishes after at most $n$ rounds. By
[[thm:havel-hakimi]], every round preserves graphicness (the conditions in lines `@too-big` and
`@negative` detect sequences that are obviously not graphic), and the all-zero sequence is
realised by a graph without edges. Running the rounds backwards and adding the removed vertex
each time, as in the ($\Leftarrow$) part of the proof, builds a realisation.

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

::: example {#ex:havel-hakimi-fail title="Sequences that are not graphic" source="theory/2026-09-15 p6"}
1. $(4, 4, 2, 2, 0) \xrightarrow{-4} (3, 1, 1, -1)$. A negative entry appears, so the sequence is
   not graphic. (Directly: two vertices of degree 4 among five vertices would both be adjacent to
   every other vertex, including the vertex of degree 0.)
2. $(7, 2, 2, 1, 1, 1)$: here $d_1 = 7 > 5 = n - 1$, so there are not even enough other vertices
   for the first one, although the sum $14$ is even. Not graphic.
:::

```graph id=t01-havel-hakimi-player widget=player
caption: Run the Havel–Hakimi test step by step on the degree sequence of the example graph above.
intent: Algorithm player for the sequence test; the state panel shows the current sequence and the graph is built backwards at the end.
algo: havel-hakimi
params: seq="4,4,3,3,1,1,0"
```
