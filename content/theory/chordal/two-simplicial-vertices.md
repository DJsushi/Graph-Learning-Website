---
title: "Two non-adjacent simplicial vertices"
course: theory
chapter: chordal
order: 5
lectures: [t04]
stage: split
status: reviewed
---

::: lemma {#lem:two-simplicial title="Two non-adjacent simplicial vertices" source="theory/2026-10-06 p3"}
If $G$ is chordal, then $G$ is complete or $G$ contains two non-adjacent simplicial vertices.
:::

::: intuition
Asking for **two non-adjacent** simplicial vertices is a stronger statement than [[thm:chordal-simplicial]], and that is what makes the
induction work. A clique cut $X$ splits $G$ into two sides; each side, together with $X$, is smaller and chordal, so it has a
simplicial vertex away from $X$. Because $X$ is a clique, at most one of the two vertices promised for a side can lie in $X$,
so the other lies off $X$, and it stays simplicial in $G$. Example: a path $P_n$ ($n \ge 2$) has its two ends.
Non-example: $K_n$ is the exception, as any two vertices are adjacent.
:::

The proof is a strong induction: cut $G$ along a clique, and collect one simplicial vertex from each side. It has three parts: the set-up (the cut and the two smaller graphs), a simplicial vertex $x$ on the side of $u$, and a simplicial vertex $y$ on the other side.

:::: walkthrough {for=lem:two-simplicial}
```graph id=t04-two-simplicial-setup widget=stepper
caption: A chordal graph on $6$ vertices. Non-adjacent $u, v$; the minimal cut $X = \set{c_1, c_2}$; the side $A = \set{u, a}$ of $u$ and the rest $\set{b, v}$.
intent: New. The lecture (theory/2026-10-06 p3) draws only a sketch of the cut $X$, the side $A$, and the graphs $G[A \cup X]$ and $G - A$. This is a concrete graph for it.
layout: fixed
u @(-1.9, 0); a @(-0.95, -0.45); c1 [label="$c_1$"] @(0, 0.55); c2 [label="$c_2$"] @(0, -0.55); b @(0.95, 0); v @(1.9, 0)
u -- a; u -- c1; a -- c1; a -- c2; c1 -- c2; c1 -- b; c2 -- b; b -- v
mark X: c1 c2 c1--c2
mark A: u a
mark rest: b v
mark AX: u a c1 c2 u--a u--c1 a--c1 a--c2 c1--c2
mark GA: c1 c2 b v c1--c2 c1--b c2--b b--v
step: $G$ is not complete: pick non-adjacent $u, v$.
class source: u
class sink: v
step: A minimal cut $X$ between $u$ and $v$ is a clique.
class cut: c1 c2 c1--c2
step: $A$ is the component of $G - X$ that contains $u$.
class color1: u a u--a
step: No edge joins $A$ to the rest.
class color2: b v b--v
step: $G[A \cup X]$ is chordal and smaller than $G$.
class muted: b v b--v c1--b c2--b
step: $G - A$ is chordal and smaller than $G$.
unclass muted: b v b--v c1--b c2--b
class muted: u a u--a u--c1 a--c1 a--c2
```

::: step
We use induction on $n$, the number of vertices. If $G$ is complete, the first alternative of the lemma holds and there is nothing to prove. This covers $n \le 1$. So assume $G$ is not complete. Then two vertices $u \ne v$ are not adjacent. Here: $u$ and $v$, with $n = 6$.
:::

::: step
Because $u$ and $v$ are not adjacent, the set of all other vertices is a cut between them. So an inclusion-minimal cut $X$ exists, a [[def:minimal-cut|minimal cut]]. Now chordality is used: by [[lem:minimal-cut-clique]], $X$ is a clique. Here: [[fig:t04-two-simplicial-setup#X|$X$]] is the edge $c_1 c_2$.
:::

::: step
Let $A$ be the component of $G - X$ that contains $u$. The cut $X$ puts $v$ in a different component, so $v \notin A$. Here: [[fig:t04-two-simplicial-setup#A|$A$]] is $\set{u, a}$, and $v$ lies in the other component with $b$.
:::

::: step
Suppose an edge joined $A$ to a vertex $w$ that is neither in $A$ nor in $X$. Then $w$ is a vertex of $G - X$ with a neighbour in the component $A$, so $w$ lies in $A$. That is a contradiction. So no edge joins $A$ to $V(G) \setminus (A \cup X)$. Here: [[fig:t04-two-simplicial-setup#rest|the rest]] is $b$ and $v$.
:::

::: step
The graph [[fig:t04-two-simplicial-setup#AX|$G[A \cup X]$]] is an induced subgraph of the chordal graph $G$, so it is chordal ([[obs:chordal-induced]]). It misses $v$, which is neither in $A$ nor in the cut $X$ (a cut avoids $u$ and $v$). So it has fewer vertices, and the induction hypothesis applies. Here: $4$ against $6$.
:::

::: step
The graph [[fig:t04-two-simplicial-setup#GA|$G - A$]] is also an induced subgraph of $G$, so it is chordal. It misses $u \in A$, so it has fewer vertices as well. The induction hypothesis applies to it too. Here: $4$ against $6$.
:::
::::

Part 2 finds a vertex $x$ in $A$ that is simplicial in $G[A \cup X]$, and then shows that $x$ is simplicial in $G$.

:::: walkthrough {for=lem:two-simplicial}
```graph id=t04-two-simplicial-x widget=stepper
caption: The simplicial vertices of $G[A \cup X]$ are $u$ and $c_2$. Only $u$ lies in $A$, and it stays simplicial in $G$.
intent: New. Same graph as the set-up figure above. The lecture (theory/2026-10-06 p3) draws only the sketch of $G[A \cup X]$ with its simplicial vertex.
layout: fixed
u [class=color1] @(-1.9, 0); a [class=color1] @(-0.95, -0.45); c1 [label="$c_1$" class=cut] @(0, 0.55); c2 [label="$c_2$" class=cut] @(0, -0.55); b [class=color2] @(0.95, 0); v [class=color2] @(1.9, 0)
u -- a; u -- c1; a -- c1; a -- c2; c1 -- c2; c1 -- b; c2 -- b; b -- v
mark X: c1 c2 c1--c2
mark AX: u a c1 c2 u--a u--c1 a--c1 a--c2 c1--c2
mark N: u a c1 u--a u--c1 a--c1
step: Restrict to $G[A \cup X]$; it is not complete.
class muted: b v b--v c1--b c2--b
step: The lemma gives two non-adjacent simplicial vertices.
class current: u c2
step: They are not both in $X$, so one lies in $A$.
unclass current: c2
class bold: u
step: $x = u$ is simplicial in $G$ as well.
class highlight: a--c1
class bold: u--a u--c1
```

::: step
We look at [[fig:t04-two-simplicial-x#AX|$G[A \cup X]$]]. If it is complete, take $x = u$: every vertex of a complete graph is simplicial, and $u$ lies in $A$. Here we are in the other case: $u$ and $c_2$ are not adjacent.
:::

::: step
Otherwise the lemma holds for $G[A \cup X]$ by induction, as part 1 showed. It gives two non-adjacent simplicial vertices of this graph. Here: $u$ has neighbours $a, c_1$ and $c_2$ has neighbours $a, c_1$. Each pair is adjacent, so both are simplicial.
:::

::: step
The two vertices cannot both lie in [[fig:t04-two-simplicial-x#X|$X$]]: any two vertices of the clique $X$ are adjacent, and these two are not. Every vertex of $G[A \cup X]$ lies in $A$ or in $X$. So one of them, $x$, lies in $A$. In both cases $x \in A$ is simplicial in $G[A \cup X]$. Here: $x = u$.
:::

::: step
All neighbours of $x$ in $G$ lie in $A \cup X$: one outside would give an edge from $A$ to the rest, and there is none. So $x$ has the same neighbours in $G$ as in $G[A \cup X]$, and they form a clique. Here: [[fig:t04-two-simplicial-x#N|the neighbours]] $a$ and $c_1$ of $u$ are adjacent, so $x$ is simplicial in $G$.
:::
::::

Part 3 does the same on the other side, with $G - A$ in place of $G[A \cup X]$, and puts the two vertices together.

:::: walkthrough {for=lem:two-simplicial}
```graph id=t04-two-simplicial-y widget=stepper
caption: The simplicial vertices of $G - A$ are $v$, $c_1$ and $c_2$. Only $v$ lies outside $A \cup X$, and $u, v$ are non-adjacent.
intent: New. Same graph as the set-up figure above. The lecture (theory/2026-10-06 p3) draws only the sketch of $G - A$ with its simplicial vertex.
layout: fixed
u [class=color1] @(-1.9, 0); a [class=color1] @(-0.95, -0.45); c1 [label="$c_1$" class=cut] @(0, 0.55); c2 [label="$c_2$" class=cut] @(0, -0.55); b [class=color2] @(0.95, 0); v [class=color2] @(1.9, 0)
u -- a; u -- c1; a -- c1; a -- c2; c1 -- c2; c1 -- b; c2 -- b; b -- v
mark X: c1 c2 c1--c2
mark GA: c1 c2 b v c1--c2 c1--b c2--b b--v
mark N: v b b--v
step: Restrict to $G - A$; it is not complete.
class muted: u a u--a u--c1 a--c1 a--c2
step: The lemma gives two non-adjacent simplicial vertices.
class current: v c1
step: They are not both in $X$, so one lies outside $A \cup X$.
unclass current: c1
class bold: v
step: $y = v$ is simplicial in $G$ as well.
class bold: b--v
step: $x = u$ and $y = v$ are non-adjacent simplicial vertices of $G$.
unclass muted: u a u--a u--c1 a--c1 a--c2
unclass bold: v b--v
class source: u
class sink: v
```

::: step
We look at [[fig:t04-two-simplicial-y#GA|$G - A$]]. If it is complete, take $y = v$: it lies in the rest, because $v \notin A \cup X$. Here we are in the other case: $v$ and $c_1$ are not adjacent.
:::

::: step
Otherwise the lemma holds for $G - A$ by induction, as part 1 showed. It gives two non-adjacent simplicial vertices of this graph. Here: $v$ and $c_1$. The vertex $v$ has the single neighbour $b$. The vertex $c_1$ has neighbours $c_2$ and $b$, which are adjacent.
:::

::: step
The two vertices cannot both lie in [[fig:t04-two-simplicial-y#X|$X$]]: two vertices of a clique are adjacent. So one of them, $y$, is not in $X$. It is not in $A$ either, because $G - A$ has no vertex of $A$. So $y \in V(G) \setminus (A \cup X)$. Here: $y = v$.
:::

::: step
The vertex $y$ has no neighbour in $A$, since no edge joins $A$ to the rest. So $y$ has the same neighbours in $G$ as in $G - A$, and they form a clique, as $y$ is simplicial in $G - A$. So $y$ is simplicial in $G$. Here: [[fig:t04-two-simplicial-y#N|the only neighbour]] of $v$ is $b$.
:::

::: step
Now $x \in A$ and $y$ lies outside $A \cup X$, so $x \ne y$. No edge joins $A$ to the rest, so $xy$ is not an edge. Thus $x$ and $y$ are two non-adjacent simplicial vertices of $G$. Here: $u$ and $v$. The cut and the smaller graphs used that $G$ is chordal.
:::
::::

:::: proof
By induction on $n = \abs{V(G)}$. If $G$ is complete there is nothing to prove (this covers $n \le 1$). Assume $G$ is
not complete, and let $u \ne v \in V(G)$ with $uv \notin E(G)$. As $u, v$ are non-adjacent, there is a minimal cut
$X$ between $u$ and $v$, and by [[lem:minimal-cut-clique]] $X$ is a clique. Let $A$ be the
component of $G - X$ containing $u$. Note that **no edge joins $A$ to $V(G) \setminus (A \cup X)$**, because $A$ is a component of $G - X$.
<!-- REVIEW: existence of the minimal cut comes from non-adjacency (remark after the definition), not from the lemma. -->

Both $G[A \cup X]$ and $G - A$ are induced subgraphs of $G$, so they are chordal ([[obs:chordal-induced]]), and they
have fewer vertices than $G$ ($v \notin A \cup X$ and $u \in A$). So the lemma holds for them by induction.

*A simplicial vertex $x \in A$.* If $G[A \cup X]$ is complete, take $x = u$. Otherwise $G[A \cup X]$ has two non-adjacent
simplicial vertices; they cannot both lie in the clique $X$, so one of them, $x$, lies in $A$. In either case
$x \in A$ is simplicial in $G[A \cup X]$. All neighbours of $x$ in $G$ lie in $A \cup X$, so $x$ is simplicial in $G$.

*A simplicial vertex $y \notin A \cup X$.* If $G - A$ is complete, take $y = v$. Otherwise $G - A$ has two non-adjacent
simplicial vertices, and one of them, $y$, is not in the clique $X$. In either case $y \in V(G) \setminus (A \cup X)$ is
simplicial in $G - A$. Since $y$ has no neighbours in $A$, its neighbours in $G$ and in $G - A$ are the same, so
$y$ is simplicial in $G$.

Finally $xy \notin E(G)$, since $x \in A$ and $y \notin A \cup X$. This proves the claim.
::::
