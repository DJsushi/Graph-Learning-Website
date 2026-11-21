---
title: Colourings and the chromatic number
course: theory
chapter: colouring
order: 1
lectures: [t08]
goal: Say when a colouring of a graph is proper, and find the chromatic number, the fewest colours a proper colouring needs.
needs: [theory/basics/graphs, theory/basics/multigraphs-and-digraphs]
stage: taught
status: reviewed
---

The lecture wrote a number at every vertex of the graph below. Look at any edge: its two ends
carry different numbers. Could we do the same with only the numbers 1 and 2?

```graph id=t08-board-colouring widget=figure
caption: The lecture's graph. The label of each vertex is its colour, and vertices with the same colour have the same filling. The two ends of every edge have different colours.
intent: From the lecture (theory/2026-11-03 p1, right). Labels are the lecture's colours; the ids a to e are new and used only for marks.
layout: fixed
a @(0.4, 1.6) [label="1" class=color1]; b @(0, 0.95) [label="2" class=color2]; c @(1.1, 1) [label="3" class=color3]; d @(0, 0.1) [label="1" class=color1]; e @(1.1, 0) [label="2" class=color2]
a -- b; a -- c; b -- c; b -- d; c -- d; c -- e; d -- e
mark triangle: a b c a--b a--c b--c
```

Point at the words to find them in the picture:
[[fig:t08-board-colouring#triangle|the three top vertices]] are joined in pairs. With only two
numbers, two of them would get the same number, and an edge joins them. So the answer is no.

A colouring gives every vertex a colour. It is proper when the two ends of every edge get
different colours. The chromatic number is the fewest colours a proper colouring needs. For
the lecture's graph it is 3.

## Colourings

::: definition {#def:colouring title="Colouring" defines="k-colouring, colouring, colour, proper colouring" source="theory/2026-11-03 p1"}
A **$k$-colouring** of a graph $G$ is any mapping $c : V(G) \to \set{1, 2, \dots, k}$,
$k \in \N$. The numbers $1, 2, \dots, k$ are the **colours**.

A $k$-colouring is **proper** if $c(x) \ne c(y)$ for every edge $xy \in E(G)$.

(Typically, a "colouring" is considered proper.)
:::

::: intuition
Colours are just the numbers 1 to $k$. A $k$-colouring writes one of them at each vertex, with
no rule at all. It is proper when no edge has two ends with the same number.
:::

The same graph twice, now with names. In "proper" every edge is fine. In "not proper" we use
only two colours, and [[fig:t08-proper-or-not#clash|two edges]] have both ends in colour 2.

```graph id=t08-proper-or-not widget=figure
caption: Two colourings of the lecture's graph; the same filling means the same colour. "proper" is the lecture's 3-colouring. "not proper" is a 2-colouring with colour 1 on $a$, $d$ and colour 2 on $b$, $c$, $e$: the marked edges $bc$ and $ce$ have two ends of colour 2.
intent: New figure on the lecture's graph (theory/2026-11-03 p1). An example and a non-example of a proper colouring; a 2-colouring is still a colouring, just not a proper one.
layout: fixed
panel: proper
a @(0.4, 1.6) [class=color1]; b @(0, 0.95) [class=color2]; c @(1.1, 1) [class=color3]; d @(0, 0.1) [class=color1]; e @(1.1, 0) [class=color2]
a -- b; a -- c; b -- c; b -- d; c -- d; c -- e; d -- e
panel: not proper
a @(0.4, 1.6) [class=color1]; b @(0, 0.95) [class=color2]; c @(1.1, 1) [class=color2]; d @(0, 0.1) [class=color1]; e @(1.1, 0) [class=color2]
a -- b; a -- c; b -- c [class=rejected]; b -- d; c -- d; c -- e [class=rejected]; d -- e
mark clash: b--c c--e
```

## The chromatic number

::: definition {#def:chromatic-number title="Chromatic number" defines="chromatic number, chi" source="theory/2026-11-03 p1"}
The **chromatic number** of $G$, denoted by $\chi(G)$, is the least $k$ such that $G$ has a
proper $k$-colouring.
:::

::: intuition
Try one colour, then two, then three, and so on. The first number of colours that allows a
proper colouring is $\chi(G)$, read "chi of $G$".
:::

To show $\chi(G) = 3$ we need two things: a proper 3-colouring, and a reason why fewer colours
fail. The stepper does this for the lecture's graph.

```graph id=t08-chromatic-three widget=stepper
caption: Why the lecture's graph has chromatic number 3: one and two colours fail, three are enough.
intent: New figure on the lecture's graph (theory/2026-11-03 p1, where the board states χ = 3). Worked example of "least k": rule out k = 1 and k = 2, then give a proper 3-colouring.
layout: fixed
a @(0.4, 1.6); b @(0, 0.95); c @(1.1, 1); d @(0, 0.1); e @(1.1, 0)
a -- b; a -- c; b -- c; b -- d; c -- d; c -- e; d -- e
mark colour1: a d
mark colour2: b e
mark colour3: c
step: The graph has 5 vertices and 7 edges. How few colours does a proper colouring need?
step: One colour: every vertex gets colour 1, and every edge has two ends of the same colour.
class color1: a b c d e
class rejected: a--b a--c b--c b--d c--d c--e d--e
step: Two colours: $a$, $b$, $c$ are pairwise adjacent. Two of the three get the same colour, and an edge joins them.
unclass color1: a b c d e
unclass rejected: a--b a--c b--c b--d c--d c--e d--e
class highlight: a b c a--b a--c b--c
step: Three colours: the lecture's colouring is proper. So $\chi = 3$.
unclass highlight: a b c a--b a--c b--c
class color1: a d
class color2: b e
class color3: c
```

The last step is the lecture's colouring:
[[fig:t08-chromatic-three#colour1|colour 1 on $a$ and $d$]],
[[fig:t08-chromatic-three#colour2|colour 2 on $b$ and $e$]] and
[[fig:t08-chromatic-three#colour3|colour 3 on $c$]]. The two failed tries give "least".

## When is χ(G) defined?

::: observation {#obs:chromatic-number-facts title="When $\chi(G)$ is defined, and when it is 1" source="theory/2026-11-03 p1"}
(a) $\chi(G)$ is defined if and only if $G$ has no loops.

(b) $\chi(G) = 1$ if and only if $G \ne \emptyset$ and $E(G) = \emptyset$.
:::

::: intuition
A [[def:mixed-multigraph|loop]] at $x$ has both ends at $x$. A proper colouring would need
$x$ to differ from itself, so no proper colouring exists. Without edges, colour 1 everywhere is
proper.
:::

```graph id=t08-loop-and-edgeless widget=figure
caption: "a loop": the loop at $x$ joins $x$ to itself, so no colouring is proper and $\chi$ is not defined. "no edges": colour 1 on all four vertices is proper, so $\chi = 1$. "one edge": the ends of $pq$ need two colours, so $\chi = 2$.
intent: "a loop" is from the lecture (theory/2026-11-03 p1, the small drawing under the graph); the vertex name x is new. "no edges" and "one edge" are new: an example and a non-example of (b).
layout: fixed
panel: a loop
x @(0, 0)
x -- x [class=rejected via="(-0.1, 0.9) (0.8, 1.2) (1.1, 0.4)"]
panel: no edges
p @(0, 1) [class=color1]; q @(1, 1) [class=color1]; r @(0, 0) [class=color1]; s @(1, 0) [class=color1]
panel: one edge
p @(0, 1) [class=color1]; q @(1, 1) [class=color2]; r @(0, 0) [class=color1]; s @(1, 0) [class=color1]
p -- q
```

The lecture states this without proof.

<!-- REVIEW: (b) holds when k = 0 is allowed (0 ∈ N): the empty graph then has the empty map as a proper 0-colouring and χ(∅) = 0. With N starting at 1, χ(∅) would be 1 and (b) would fail for G = ∅. The page reads N with 0, as (b) needs. -->
Why does (b) say $G \ne \emptyset$? The empty graph has no vertices. Here $\N$ includes $0$, so $k = 0$ is allowed: the
empty map colours it with no colours at all, and its chromatic number is 0, not 1.

::: pitfall
One proper colouring with $k$ colours shows only $\chi(G) \le k$. For $\chi(G) = k$ you also
need a reason why $k - 1$ colours fail, as in the stepper above.
:::

::: pitfall
A $k$-colouring need not use all $k$ colours. The lecture's colouring is also a proper
4-colouring, with colour 4 unused. That is why the definition asks for the *least* $k$.
:::

## Check yourself

```graph id=t08-ex-colour-prism widget=exercise
task: color-vertices
colors: 3
prompt: Click a vertex to change its colour. Give every vertex one of 3 colours so that the colouring is proper.
check: is-proper-coloring k=3
hint: The triangle $1\,2\,3$ needs all three colours. Then look at each vertex of the other triangle.
solution: For example colour 1 on 1 and 6, colour 2 on 2 and 4, colour 3 on 3 and 5. Each triangle needs three colours, so 3 is also the least number: $\chi = 3$.
layout: fixed
1 @(0, 0); 2 @(2.1, 2.6); 3 @(4.2, 0); 4 @(1.16, 0.48); 5 @(2.1, 1.65); 6 @(3.04, 0.48)
1 -- 2 -- 3 -- 1
4 -- 5 -- 6 -- 4
1 -- 4; 2 -- 5; 3 -- 6
```

:::: quiz {#q:t08-chi-one}
Which graph has chromatic number 1?

- [ ] One vertex with a loop.
- [x] Four vertices and no edges.
- [ ] Two vertices joined by one edge.

::: explanation
With a loop no colouring is proper, so $\chi$ is not defined. With one edge, its two ends need
different colours, so $\chi = 2$. Four vertices without edges can all get colour 1: by (b) of
the fact, $\chi = 1$.
:::
::::

:::: quiz {#q:t08-found-colouring}
You found a proper 4-colouring of a graph $G$. What do you know for sure?

- [ ] $\chi(G) = 4$
- [x] $\chi(G) \le 4$
- [ ] $\chi(G) \ge 4$

::: explanation
$\chi(G)$ is the least $k$ with a proper $k$-colouring, and $k = 4$ is one such $k$. So the
least one is at most 4. A colouring with fewer colours may exist: the lecture's graph has a
proper 4-colouring and $\chi = 3$.
:::
::::
