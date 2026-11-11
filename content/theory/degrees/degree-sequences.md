---
title: "Degree sequences"
course: theory
chapter: degrees
order: 2
lectures: [t01]
stage: split
status: draft
---

::: definition {#def:degree-sequence title="Degree sequence" defines="degree sequence" source="theory/2026-09-15 p5"}
The **degree sequence** of a graph $G$ with $V(G) = \set{v_1, v_2, \dots, v_n}$ is the sequence
$$\bigl(d_G(v_1), d_G(v_2), \dots, d_G(v_n)\bigr).$$
:::

::: intuition
The degree sequence lists the [[def:degree|degrees]] and forgets who is adjacent to whom.
Examples: the star $K_{1,3}$ has degree sequence $(3, 1, 1, 1)$, the [[def:cycle-graph|cycle]] $C_4$ has
$(2, 2, 2, 2)$. Different graphs can share a degree sequence: $C_6$ and two disjoint triangles
both have $(2, 2, 2, 2, 2, 2)$.
:::

The sequence depends on the order of the vertices; usually we list it **non-increasingly**. Then
it is an [[def:isomorphism|isomorphism]] invariant ([[prop:iso-invariants]]).

```graph id=t01-degree-sequence-example widget=figure
caption: A graph with degree sequence $(4, 4, 3, 3, 1, 1, 0)$. Vertex labels show the degrees.
intent: Transcription of the lecture example; an isolated vertex contributes a 0 to the degree sequence.
layout: fixed
vertex-label: "{d}"
x [d=0] @(1, 1.6)
l [d=4] @(0, 1); r [d=4] @(2, 1); mt [d=3] @(1, 1); mb [d=3] @(1, 0); p [d=1] @(0, 0); q [d=1] @(2, 0)
l -- r [bend=0.5]; l -- mt; mt -- r; l -- mb; mt -- mb; r -- mb; l -- p; r -- q
```

Now the reverse question: given a sequence of numbers, **is there a (simple) graph with this
degree sequence?** This question is the subject of the rest of the lesson.

::: definition {#def:graphic-sequence title="Graphic sequence" defines="graphic sequence, realisation" extra=true}
A sequence $(d_1, \dots, d_n)$ of non-negative integers is **graphic** if there is a simple graph
$G$ with $V(G) = \set{v_1, \dots, v_n}$ and $d_G(v_i) = d_i$ for all $i$. Such a $G$ is a
**realisation** of the sequence.
:::

::: intuition
A graph gives a degree sequence; "graphic" asks the reverse question, whether some simple graph
has exactly the prescribed degrees. Realisations are usually far from unique: $(2, 2, 2, 2, 2, 2)$
is realised by $C_6$ and by two disjoint triangles ([[fig:t01-same-degrees-not-iso]]).
Non-examples: $(1, 1, 1)$ has an odd sum, and $(2, 0)$ asks for two neighbours with only one
other vertex available.
:::

Two necessary conditions are immediate: the sum $d_1 + \dots + d_n$ must be even
([[lem:handshake]]), and every $d_i \le n - 1$ (a vertex of a simple graph has at most $n-1$
neighbours). They are not sufficient: $(3, 3, 1, 1)$ has an even sum and all entries are at most
$3$, but it is not graphic. The two vertices of degree $3$ would each be adjacent to all other
vertices, so each vertex of "degree 1" would get two neighbours.
