---
title: "Closed walks contain cycles"
course: theory
chapter: walks-connectivity
order: 5
lectures: [t03]
stage: split
status: draft
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
acyclic graphs: two different routes between the same vertices combine into a closed walk that
does not double back everywhere, so they create a cycle.
:::

::: pitfall
The lemma does not say that the closed walk **is** a cycle, nor that a closed walk using some edge
twice has no cycle: going around a triangle twice uses every edge twice **and** contains a cycle.
:::

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
