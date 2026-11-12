---
title: "Chordal graphs"
course: theory
chapter: chordal
order: 1
lectures: [t04]
stage: split
status: reviewed
---

::: definition {#def:chordal title="Chord, chordal graph" defines="chord, chordal graph" source="theory/2026-10-06 p1"}
A **chord** of a [[def:cycle-graph|cycle]] $C \subseteq G$ is an edge of $G$ between two vertices of $C$ that are not consecutive on
$C$. A graph $G$ is **chordal** if every cycle $C \subseteq G$ of [[def:path-graph|length]] at least $4$ has a chord.
<!-- REVIEW: lecture writes "every cycle C ⊆ G has a chord"; "of length at least 4" added, since a triangle can never have a chord. -->
:::

::: intuition
A chord is a shortcut across a cycle: it splits the cycle into two shorter ones. In a chordal graph you can keep
cutting until only triangles are left, so every long cycle is "triangulated". Example: $K_4$ contains $4$-cycles,
but each of them has both diagonals as chords, so $K_4$ is chordal. Non-example: $C_4$, a $4$-cycle with no
diagonal.
:::

(A triangle has no pair of non-consecutive vertices, so the condition is only about cycles of length at least $4$.)
Equivalently: $G$ is chordal iff it has no **induced** cycle of length at least $4$.

::: pitfall
Chordal does not mean "contains no $4$-cycle": $K_4$ is full of $4$-cycles and is chordal. What is forbidden is a
long cycle **without** a chord, i.e. an induced $C_k$ with $k \ge 4$. Also, one chord is enough: in $C_6$ with the single
chord $14$ the $6$-cycle has a chord, but the two $4$-cycles $1\,2\,3\,4$ and $1\,4\,5\,6$ have none, so that graph is not chordal.
:::

```graph id=t04-chord widget=figure
caption: The cycle $C_6$ has the chord $14$. The graph on the right is not chordal: the 4-cycle $1\,2\,3\,4$ has no chord.
intent: Show a chord, and the smallest non-chordal graph C_4.
height: small
panel: a chord
use: C(6)
1 -- 4 [class=highlight]
panel: $C_4$, not chordal
use: C(4)
```

Every [[def:complete-graph|complete graph]] and every [[def:forest-tree|forest]] is chordal (forests have no cycles at all). Removing vertices keeps a
graph chordal:

::: observation {#obs:chordal-induced title="Induced subgraphs of chordal graphs"}
Every [[def:subgraph|induced subgraph]] of a chordal graph is chordal.
:::

::: intuition
Deleting vertices cannot create a cycle, and an induced subgraph keeps every edge among the remaining
vertices, so every chord of a surviving cycle survives too. This is what makes induction on chordal graphs
work: delete a vertex, and the rest is still chordal. Non-example: for **non-induced** subgraphs it fails;
deleting the diagonal of $K_4 - e$ (a $4$-cycle plus one chord) leaves $C_4$.
:::

```graph id=t04-chordal-induced-subgraph widget=figure
caption: The triangulated pentagon $G$ (left) is chordal. Deleting vertex $2$ leaves the induced subgraph on $\set{1, 3, 4, 5}$ (middle), which is chordal: its only $4$-cycle $1\,3\,4\,5$ keeps the chord $14$. Dropping the edge $14$ as well leaves the non-induced subgraph $C_4$ (right), which is not chordal.
intent: New figure (the lecture shows no drawing for this entry; p3 only uses the fact). Deleting a vertex keeps the chords, deleting an edge does not.
layout: fixed
panel: $G$
1 @(1, 1.2); 2 @(0, 0.7); 3 @(0.3, 0); 4 @(1.7, 0); 5 @(2, 0.7)
1 -- 2 -- 3 -- 4 -- 5 -- 1
1 -- 3 [class=bold]; 1 -- 4 [class=bold]
panel: $G - 2$ (induced)
1 @(1, 1.2); 3 @(0.3, 0); 4 @(1.7, 0); 5 @(2, 0.7)
1 -- 3 [class=bold]; 3 -- 4; 4 -- 5; 5 -- 1; 1 -- 4 [class=bold]
panel: not induced
1 @(1, 1.2); 3 @(0.3, 0); 4 @(1.7, 0); 5 @(2, 0.7)
1 -- 3; 3 -- 4; 4 -- 5; 5 -- 1; 1 -- 4 [class=dashed]
```

The lecture states this without proof.
