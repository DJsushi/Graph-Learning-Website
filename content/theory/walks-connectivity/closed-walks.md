---
title: "Closed walks contain cycles"
course: theory
chapter: walks-connectivity
order: 5
lectures: [t03]
stage: split
status: reviewed
---

Recall that a walk may repeat vertices and edges, and a closed walk returns to its start
([[def:walk]]).

::: lemma {#lem:closed-walk-cycle title="Closed walks contain cycles or double back" source="theory/2026-09-29 p3–4"}
For every [[def:mixed-multigraph|(multi)graph]] $G$ and every closed walk $W$ in $G$: (the edges of) $W$ contain a [[def:cycle-graph|cycle]],
or every edge of $G$ is traversed by $W$ an even number of times (possibly both).
<!-- REVIEW: dropped "either" and added "(possibly both)": the "or" is inclusive (e.g. a cycle traversed twice); lecture just says "or". -->
:::

::: intuition
A closed walk that never goes around a cycle can only get back to its start by retracing its steps,
so every edge it goes out along, it must also come back along. Example: in the path $a - b - c$, the
closed walk $(a, b, c, b, a)$ uses both edges twice. The lemma is the tool for proving uniqueness in
acyclic graphs: two different paths between the same vertices combine into a closed walk that
does not double back everywhere, so they create a cycle.
:::

::: pitfall
The lemma does not say that the closed walk **is** a cycle, nor that a closed walk using some edge
twice has no cycle: going around a triangle twice uses every edge twice **and** contains a cycle.
:::

The proof is a strong induction on the length of the closed walk $W$: first the short walks, then a walk without a repeated vertex, then a walk that we cut in two at a repeated vertex.

Part (a): the base cases are checked one by one.

:::: walkthrough {for=lem:closed-walk-cycle}
```graph id=t03-closed-walk-base widget=stepper
caption: The base cases $k = 0, 1, 2$ of the closed-walk lemma, one small multigraph for all of them.
intent: New. The base cases (a) of the lecture proof (theory/2026-09-29 p4), shown on one multigraph with a loop, a single edge, two parallel edges and two loops.
layout: fixed
a @(0, 0); b @(1.6, 0); c @(3.1, 0); d @(4.7, 0); e @(6.2, 0); f @(7.8, 0)
a -- a [side=top]; b -- c; d -- e; d -- e; f -- f [side=top]; f -- f [side=bottom]
mark W: b
step: Length $k = 0$: a single vertex.
class current: b
step: Length $k = 1$: a loop.
unclass current: b
class cycle: a--a
mark W: a--a
step: Length $k = 2$ along one edge and back.
unclass cycle: a--a
class path: b--c
mark W: b--c
step: Length $k = 2$ with two different edges between two vertices.
unclass path: b--c
class cycle: d--e d--e#2
mark W: d--e d--e#2
step: Length $k = 2$ with two loops at one vertex.
unclass cycle: d--e d--e#2
class cycle: f--f f--f#2
mark W: f--f f--f#2
```

::: step
We start with the walks of length $k = 0$. Such a walk [[fig:t03-closed-walk-base#W|$W$]] is one vertex, here $b$, and has no edge. So every edge is traversed $0$ times, and $0$ is even. The second alternative of the lemma holds.
:::

::: step
Length $1$: $W$ is $(v_0, e_0, v_1)$. The walk is closed, so $v_1 = v_0$, and the edge $e_0$ joins $v_0$ to itself: it is a [[def:mixed-multigraph|loop]]. For multigraphs the lecture counts a loop as a cycle of length $1$, and two parallel edges as a cycle of length $2$. Here: the loop at $a$. So $W$ contains a cycle.
:::

::: step
Length $k = 2$, first case: $e_0 = e_1$. The walk goes along one edge and straight back. Here $W = (b, c, b)$ along the edge $bc$. This edge is traversed twice, and every other edge zero times. Both numbers are even.
:::

::: step
Second case: the edges $e_0$ and $e_1$ differ. The walk is closed, so $v_2 = v_0$, and both edges join $v_0$ and $v_1$. Suppose first that $v_0$ and $v_1$ are different vertices. Then the two edges are parallel, and together they count as a cycle of length $2$, by the same convention. Here: the two edges between $d$ and $e$.
:::

::: step
Now suppose $v_0$ and $v_1$ are the same vertex. Then both edges join this vertex to itself, so they are two loops. Each loop counts as a cycle, by the same convention. Here: the two loops at $f$. In every case of $k \le 2$, the lemma holds.
:::
::::

Part (b1): a closed walk of length at least $3$ that repeats no vertex is itself a cycle.

:::: walkthrough {for=lem:closed-walk-cycle}
```graph id=t03-closed-walk-no-repeat widget=stepper
caption: Case (b1): a closed walk on five distinct vertices traces a cycle.
intent: New. The case (b1) of the lecture proof (theory/2026-09-29 p4) on a 5-cycle with one extra vertex that the walk does not visit.
layout: fixed
v0 [label="$v_0$"] @(1.5, 1.3); v1 [label="$v_1$"] @(3.1, 0.5); v2 [label="$v_2$"] @(2.5, -0.8); v3 [label="$v_3$"] @(0.5, -0.8); v4 [label="$v_4$"] @(-0.1, 0.5); y @(4.1, -0.8)
v0 -- v1 -- v2 -- v3 -- v4 -- v0; v2 -- y
mark W: v0--v1 v1--v2 v2--v3 v3--v4 v4--v0
mark distinct: v0 v1 v2 v3 v4
step: A closed walk $W$ of length $5$ that repeats no vertex.
class visited: v0 v1 v2 v3 v4
class path: v0--v1 v1--v2 v2--v3 v3--v4 v4--v0
step: Different positions give different pairs of ends.
step: So $W$ traces a cycle.
unclass path: v0--v1 v1--v2 v2--v3 v3--v4 v4--v0
class cycle: v0--v1 v1--v2 v2--v3 v3--v4 v4--v0
```

::: step
Now $k \ge 3$, and no vertex of [[fig:t03-closed-walk-no-repeat#W|$W$]] is repeated: the vertices [[fig:t03-closed-walk-no-repeat#distinct|$v_0$ up to $v_{k-1}$]] are different. The last vertex $v_k$ is $v_0$, because $W$ is closed. Here: five different vertices, and $k = 5$.
:::

::: step
Next, the edges. The edge $e_i$ joins $v_i$ and $v_{i+1}$. The vertices form a ring, and in a ring of at least $3$ vertices two vertices are neighbours at one place only. So no two edges of $W$ have the same two ends, and they are distinct. For $k = 2$ this fails: both edges can have the same ends.
:::

::: step
So $W$ has distinct vertices and distinct edges, and it ends where it starts. That is a cycle of length $k$, and $W$ contains it. Here: the $5$-cycle $v_0 v_1 v_2 v_3 v_4$. The edge $v_2 y$ is not on $W$, so it plays no part.
:::
::::

Part (b2), the cut: a repeated vertex splits $W$ into two shorter closed walks.

:::: walkthrough {for=lem:closed-walk-cycle}
```graph id=t03-closed-walk-split widget=stepper
caption: Case (b2): splitting a closed walk at the repeated vertex $x$. Edge labels show the positions $e_i$ along $W$, later the number of traversals by $W_1$ plus $W_2$.
intent: New. The case (b2) of the lecture proof (theory/2026-09-29 p4, the sketch of $W_1$ and $W_2$), on a concrete walk that goes through a triangle. The page figure t03-split-walk shows the same split in the abstract.
layout: fixed
v0 [label="$v_0$"] @(0, 0); a @(1.3, 0); x @(2.6, 0); b @(3.6, 1); c @(3.6, -1); d @(1.3, -1.2)
v0 -- a [label="$e_0, e_6$"]; a -- x [label="$e_1, e_5$"]; x -- b [label="$e_2$"]; b -- c [label="$e_3$"]; c -- x [label="$e_4$"]; a -- d
mark W: v0--a a--x x--b b--c c--x
mark x: x
mark W2: x--b b--c c--x
mark W1: v0--a a--x
step: A closed walk $W$ of length $7$ that repeats the vertex $x$.
class path: v0--a a--x x--b b--c c--x
class current: x
step: The part between the two visits of $x$ is $W_2$.
unclass path: x--b b--c c--x
class color2: x--b b--c c--x
step: The rest is $W_1$.
unclass path: v0--a a--x
class color1: v0--a a--x
step: Both pieces are shorter than $W$.
step: Every traversal of $W$ is in $W_1$ or in $W_2$.
set v0--a [label="$2 + 0$"]
set a--x [label="$2 + 0$"]
set x--b [label="$0 + 1$"]
set b--c [label="$0 + 1$"]
set c--x [label="$0 + 1$"]
step: $W_2$ contains a cycle, so $W$ does.
class cycle: x--b b--c c--x
```

::: step
Case (b2): (b1) fails, so two of $v_0$ up to $v_{k-1}$ are equal. We ignore $v_k$, which is $v_0$ again. So a vertex [[fig:t03-closed-walk-split#x|$x$]] equals $v_i$ and $v_j$ with $0 \le i < j \le k - 1$. Here $W$ is $(v_0, a, x, b, c, x, a, v_0)$, and $x$ sits at positions $2$ and $5$.
:::

::: step
The first piece [[fig:t03-closed-walk-split#W2|$W_2$]] is the part of $W$ from the visit of $x$ at position $i$ to the visit at position $j$: $(v_i, e_i, \dots, e_{j-1}, v_j)$. It is closed: it starts and ends at $x$. Here $W_2 = (x, b, c, x)$, the triangle $xbc$, with $j - i = 3$ edges.
:::

::: step
The second piece [[fig:t03-closed-walk-split#W1|$W_1$]] is the rest of $W$. It follows $W$ from $v_0$ to $x$, skips $W_2$, and continues with $e_j$ from the second visit of $x$. This is allowed because both visits are the same vertex. It starts and ends where $W$ does, so it is closed. Here $W_1 = (v_0, a, x, a, v_0)$.
:::

::: step
Both pieces are shorter than $W$. $W_2$ has $j - i$ edges, at least one because $i$ is smaller than $j$. $W_1$ has the other edges, at least one because $j$ is at most $k - 1$. The lengths add up to $k$, so both are smaller, and the induction assumption applies. Here: $3$ and $4$, against $7$.
:::

::: step
The lemma counts traversals. We only cut $W$ in two and glued the ends, so every traversal of $W$ lies in exactly one of $W_1$ and $W_2$. Hence $W$ traverses each edge as often as $W_1$ and $W_2$ together. Here: $v_0a$ and $ax$ get $2 + 0$ traversals, and $xb$, $bc$, $cx$ get $0 + 1$.
:::

::: step
By the induction assumption, $W_1$ or $W_2$ contains a cycle, or every edge is traversed an even number of times by each. Take the first alternative. The edges of that cycle are edges of $W_1$ or $W_2$, so $W$ traverses them, and $W$ contains the cycle. Here $W_2$ is the triangle $xbc$. The second alternative is the next walkthrough.
:::
::::

Part (b2), the count: when neither piece contains a cycle, the even numbers add up.

:::: walkthrough {for=lem:closed-walk-cycle}
```graph id=t03-closed-walk-split-even widget=stepper
caption: Case (b2) when no cycle exists: the edge counts of $W_1$ and $W_2$ are even, so those of $W$ are even. Edge labels show the traversals by $W_1$ plus $W_2$.
intent: New. The second alternative of case (b2) (theory/2026-09-29 p4) on a tree, where no cycle can appear.
layout: fixed
v0 [label="$v_0$"] @(0, 0); a @(1.3, 0); x @(2.6, 0); b @(3.6, 1); c @(3.6, -1)
v0 -- a; a -- x; x -- b; x -- c
mark W: v0--a a--x x--b x--c
mark W1: v0--a a--x x--c
mark W2: x--b
step: A closed walk $W$ of length $8$ in a tree.
class path: v0--a a--x x--b x--c
class current: x
step: Split at the first two visits of $x$.
unclass path: x--b
class color2: x--b
unclass path: v0--a a--x x--c
class color1: v0--a a--x x--c
step: No cycle: both pieces have even counts.
set v0--a [label="$2 + 0$"]
set a--x [label="$2 + 0$"]
set x--b [label="$0 + 2$"]
set x--c [label="$2 + 0$"]
step: Even plus even is even.
set v0--a [label="$2$"]
set a--x [label="$2$"]
set x--b [label="$2$"]
set x--c [label="$2$"]
```

::: step
Here $G$ is a tree, so it has no cycle. The walk [[fig:t03-closed-walk-split-even#W|$W$]] is $(v_0, a, x, b, x, c, x, a, v_0)$, of length $8$. The vertex $x$ occurs three times. We split at the first two visits, as in the previous walkthrough.
:::

::: step
The piece [[fig:t03-closed-walk-split-even#W2|$W_2$]] is $(x, b, x)$: out to $b$ and back. The piece [[fig:t03-closed-walk-split-even#W1|$W_1$]] is $(v_0, a, x, c, x, a, v_0)$. Their lengths are $2$ and $6$, both smaller than $8$, so the induction assumption applies to each.
:::

::: step
Suppose neither $W_1$ nor $W_2$ contains a cycle. The induction assumption then leaves the second alternative: each piece traverses every edge an even number of times. Here the tree has no cycle at all, so this is our situation: $W_1$ traverses $v_0a$, $ax$ and $xc$ twice each and $xb$ never, while $W_2$ traverses $xb$ twice and the others never.
:::

::: step
$W$ traverses each edge as often as $W_1$ and $W_2$ together, and the sum of two even numbers is even. So every edge is traversed an even number of times by $W$. That is the second alternative of the lemma, and it finishes case (b2) and the induction. Here: every edge $2$ times.
:::
::::

::: proof
By induction on the length $k$ of $W = (v_0, e_0, v_1, \dots, e_{k-1}, v_k = v_0)$.

**(a) Base cases, $k \le 2$.** If $k = 0$, no edge is traversed ($0$ is even). If $k = 1$, the edge
$e_0$ joins $v_0$ to itself, so it is a loop, which is a cycle. If $k = 2$, either $e_0 = e_1$ (the walk
goes along an edge and back; that edge is traversed twice and all others zero times), or $e_0 \ne e_1$
both join $v_0$ and $v_1$; then they are two loops (if $v_0 = v_1$) or two parallel edges, and either way
$W$ contains a cycle.

**(b) $k \ge 3$.**

- (b1) If no vertex is repeated in $W$, i.e. $v_0, \dots, v_{k-1}$ are distinct, then the edges $e_i$ join
  distinct pairs of consecutive vertices, so they are distinct, and $W$ traces a cycle of length $k$.
- (b2) If $W$ repeats a vertex $x = v_i = v_j$ with $0 \le i < j \le k - 1$, we "split" $W$ at $x$ into two
  closed walks
  $$W_2 = (v_i, e_i, \dots, e_{j-1}, v_j) \quad\text{and}\quad W_1 = (v_0, e_0, \dots, v_i, e_j, v_{j+1}, \dots, v_k),$$
  of lengths $j - i \ge 1$ and $k - (j - i) \ge 1$, both less than $k$. Every edge is traversed by $W$ as
  many times as by $W_1$ and $W_2$ together. By the induction assumption, $W_1$ or $W_2$ contains a cycle
  (then so does $W$), or every edge is traversed an even number of times by each of $W_1, W_2$, and so
  an even number of times by $W$.
:::

```graph id=t03-split-walk widget=figure
caption: Splitting a closed walk $W$ at a repeated vertex $x$ into two shorter closed walks $W_1$ and $W_2$.
intent: Transcription of the lecture sketch for case (b2).
layout: fixed
v0 [label="$v_0$"] @(0, 0); a @(1, 0.8); x [class=current] @(2, 0); b @(3, 0.8); c @(3.4, -0.4); d @(1, -0.8)
v0 -- a [class=color1]; a -- x [class=color1]; x -- b [class=color2]; b -- c [class=color2]; c -- x [class=color2]; x -- d [class=color1]; d -- v0 [class=color1]
group W1: v0 a d [label="$W_1$"]
group W2: b c [label="$W_2$"]
```
