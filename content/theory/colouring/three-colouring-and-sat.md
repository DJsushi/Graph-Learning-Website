---
title: 3-colouring and SAT
course: theory
chapter: colouring
order: 3
lectures: [t08]
goal: Turn every 3-SAT formula into a graph that is 3-colourable exactly when the formula is satisfiable.
needs: [theory/colouring/colourings]
stage: taught
long: true # the proof has three parts (construction and two directions), so three walkthroughs with 17 steps
status: reviewed
---

The lecture drew the part of a graph below. We have three colours, called S, F and T. The top
vertex has colour T, and the three vertices on the left have colour F. Can we colour the six
vertices on the right so that the two ends of every edge get different colours?

```graph id=t08-clause-gadget widget=figure
caption: The lecture's clause part. Each label is a colour, and the same filling means the same colour. "three times F": every middle vertex sees F and T, so it must take S, and the marked triangle has only F and T left. "one T": the top left vertex has T, and the colouring shown is proper.
intent: From the lecture (theory/2026-11-03 p2, right drawing; repeated on p4), where the board first writes F, F, F on the left, gets stuck at the triangle (the cross), then changes the top literal to T. Labels are the board's colours; the ids t, l1 to l3, a1 to a3, b1 to b3 are new and used only for marks. Colour classes: S color1, F color2, T color3.
layout: fixed
panel: three times F
t @(0, 1.9) [label="T" class=color3]
l1 @(0, 1.2) [label="F" class=color2]; l2 @(0, 0.6) [label="F" class=color2]; l3 @(0, 0) [label="F" class=color2]
a1 @(1.1, 1.2) [label="S" class=color1]; a2 @(1.1, 0.6) [label="S" class=color1]; a3 @(1.1, 0) [label="S" class=color1]
b1 @(2.4, 1.2) [label="?"]; b2 @(1.9, 0.6) [label="?"]; b3 @(2.4, 0) [label="?"]
t -- a1; t -- a2; t -- a3; l1 -- a1; l2 -- a2; l3 -- a3; a1 -- b1; a2 -- b2; a3 -- b3
b1 -- b2 [class=rejected]; b2 -- b3 [class=rejected]; b1 -- b3 [class=rejected]
mark middle: a1 a2 a3
mark triangle: b1 b2 b3 b1--b2 b2--b3 b1--b3
panel: one T
t @(0, 1.9) [label="T" class=color3]
l1 @(0, 1.2) [label="T" class=color3]; l2 @(0, 0.6) [label="F" class=color2]; l3 @(0, 0) [label="F" class=color2]
a1 @(1.1, 1.2) [label="F" class=color2]; a2 @(1.1, 0.6) [label="S" class=color1]; a3 @(1.1, 0) [label="S" class=color1]
b1 @(2.4, 1.2) [label="S" class=color1]; b2 @(1.9, 0.6) [label="T" class=color3]; b3 @(2.4, 0) [label="F" class=color2]
t -- a1; t -- a2; t -- a3; l1 -- a1; l2 -- a2; l3 -- a3; a1 -- b1; a2 -- b2; a3 -- b3
b1 -- b2; b2 -- b3; b1 -- b3
```

No. Each of [[fig:t08-clause-gadget#middle|the three middle vertices]] has a neighbour of colour
F and a neighbour of colour T, so it must take S. Then
[[fig:t08-clause-gadget#triangle|the triangle on the right]] has only F and T left, and a
triangle needs three colours. In "one T" the top left vertex has colour T, and a proper
colouring exists.

Read T as true and F as false. Then this small part says: at least one of the three left
vertices is true. That is a clause of a formula, and the lecture uses it to turn formulas
into graphs.

A formula of 3-SAT is built from variables $x_1$, $x_2$, and so on. A literal is a variable or
its negation. A clause joins three literals by "or", and the formula joins its clauses by
"and". A valuation $\nu$ gives every variable the value T or F. The formula is satisfiable when
some valuation makes every clause true. The theorem builds a graph that has a
[[def:colouring|proper 3-colouring]] exactly when the formula is satisfiable.

## The theorem

::: theorem {#thm:three-colouring-sat title="3-COL solves SAT" aka="3-colouring and 3-SAT, reduction from 3-SAT to 3-colouring" source="theory/2026-11-03 p2"}
For every instance of 3-SAT, i.e., a formula
$\Phi \equiv \bigwedge_{i=1}^{m} \left(\ell_i^1 \lor \ell_i^2 \lor \ell_i^3\right)$, where
$\ell_i^j \in \set{x_k, \neg x_k : k \in \N}$, there is a graph $G_\Phi$ such that $G_\Phi$ is
3-colourable if and only if $\Phi$ is satisfiable.
:::

::: intuition
The three colours play three roles: T for true, F for false, and S for neither. Every literal
becomes a vertex of colour T or F. Every clause becomes a small part that can be coloured
exactly when at least one of its three literals has colour T.
:::

The lecture's example has one clause: the negation of $x_1$, or $x_2$, or $x_8$. Its graph has
three parts: [[fig:t08-g-phi#sft|the triangle of s, f and t]],
[[fig:t08-g-phi#lit|a triangle at s for each variable]] and
[[fig:t08-g-phi#clause|six vertices for the clause]]. The clause part is the one from the
question above.

```graph id=t08-g-phi widget=figure
caption: The graph $G_\Phi$ for the lecture's formula $\Phi \equiv (\neg x_1 \lor x_2 \lor x_8)$: the triangle $s f t$, one triangle at $s$ for each variable, and the six vertices of the clause, joined to $t$ and to the vertices of the literals $\neg x_1$, $x_2$, $x_8$.
intent: From the lecture (theory/2026-11-03 p2, left drawing; repeated on p4), with its vertex names. The board elides the triangle of x_8 with dots; it is drawn here. The names a and b of the clause vertices come from p3. The same positions are used in the three walkthroughs below.
layout: fixed
f @(0, 2.1); t @(1.1, 2.1); s @(0, 1.15)
x1 @(0.95, 1.5) [label="$x_1$"]; n1 @(1.45, 1.15) [label="¬$x_1$"]
x2 @(1.85, 0.7) [label="$x_2$"]; n2 @(0.85, 0.6) [label="¬$x_2$"]
x8 @(0.9, 0) [label="$x_8$"]; n8 @(0.3, 0) [label="¬$x_8$"]
a1 @(2.6, 1.55) [label="$a_1^1$"]; a2 @(2.6, 0.95) [label="$a_1^2$"]; a3 @(2.6, 0.35) [label="$a_1^3$"]
b1 @(3.6, 1.55) [label="$b_1^1$"]; b2 @(3.2, 0.95) [label="$b_1^2$"]; b3 @(3.6, 0.3) [label="$b_1^3$"]
s -- f; f -- t; s -- t
s -- x1; s -- n1; x1 -- n1; s -- x2; s -- n2; x2 -- n2; s -- x8; s -- n8; x8 -- n8
a1 -- b1; a2 -- b2; a3 -- b3; b1 -- b2; b2 -- b3; b1 -- b3
t -- a1; t -- a2; t -- a3
n1 -- a1; x2 -- a2; x8 -- a3
mark sft: s f t s--f f--t s--t
mark lit: x1 n1 x2 n2 x8 n8 s--x1 s--n1 x1--n1 s--x2 s--n2 x2--n2 s--x8 s--n8 x8--n8
mark clause: a1 a2 a3 b1 b2 b3 a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
```

## Why it is true

The proof is a **construction**: we build the graph $G_{\Phi}$ from the formula. Then we prove
the two directions of "if and only if" one at a time. The colours T and F stand for true and
false, and S is the third colour.

:::: walkthrough {for=thm:three-colouring-sat}
```graph id=t08-g-phi-build widget=stepper
caption: The construction of $G_\Phi$ for $\Phi \equiv (\neg x_1 \lor x_2 \lor x_8)$, one part per step.
intent: From the lecture (theory/2026-11-03 p3 for the construction, p2 left for the example), with the positions of t08-g-phi. Later parts are hidden until their step, so the drawing keeps its size.
layout: fixed
f @(0, 2.1); t @(1.1, 2.1); s @(0, 1.15)
x1 @(0.95, 1.5) [label="$x_1$"]; n1 @(1.45, 1.15) [label="¬$x_1$"]
x2 @(1.85, 0.7) [label="$x_2$"]; n2 @(0.85, 0.6) [label="¬$x_2$"]
x8 @(0.9, 0) [label="$x_8$"]; n8 @(0.3, 0) [label="¬$x_8$"]
a1 @(2.6, 1.55) [label="$a_1^1$"]; a2 @(2.6, 0.95) [label="$a_1^2$"]; a3 @(2.6, 0.35) [label="$a_1^3$"]
b1 @(3.6, 1.55) [label="$b_1^1$"]; b2 @(3.2, 0.95) [label="$b_1^2$"]; b3 @(3.6, 0.3) [label="$b_1^3$"]
s -- f; f -- t; s -- t
s -- x1; s -- n1; x1 -- n1; s -- x2; s -- n2; x2 -- n2; s -- x8; s -- n8; x8 -- n8
a1 -- b1; a2 -- b2; a3 -- b3; b1 -- b2; b2 -- b3; b1 -- b3
t -- a1; t -- a2; t -- a3
n1 -- a1; x2 -- a2; x8 -- a3
class hidden: x1 n1 x2 n2 x8 n8 s--x1 s--n1 x1--n1 s--x2 s--n2 x2--n2 s--x8 s--n8 x8--n8
class hidden: a1 a2 a3 b1 b2 b3 a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
class hidden: t--a1 t--a2 t--a3 n1--a1 x2--a2 x8--a3
mark sft: s f t s--f f--t s--t
mark lit: x1 n1 x2 n2 x8 n8
mark a: a1 a2 a3
mark b: b1 b2 b3 b1--b2 b2--b3 b1--b3
mark at: t--a1 t--a2 t--a3
mark al: n1--a1 x2--a2 x8--a3
step: (1) The triangle $s f t$.
class bold: s--f f--t s--t
step: (2) A triangle $s$, $x_k$, $\neg x_k$ for every variable.
unclass bold: s--f f--t s--t
unclass hidden: x1 n1 x2 n2 x8 n8 s--x1 s--n1 x1--n1 s--x2 s--n2 x2--n2 s--x8 s--n8 x8--n8
step: (3) Six vertices for every clause; the vertices $b$ form a triangle.
unclass hidden: a1 a2 a3 b1 b2 b3 a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
step: Every $a$ is joined to $t$.
unclass hidden: t--a1 t--a2 t--a3
class bold: t--a1 t--a2 t--a3
step: Every $a$ is joined to the vertex of its literal.
unclass bold: t--a1 t--a2 t--a3
unclass hidden: n1--a1 x2--a2 x8--a3
class bold: n1--a1 x2--a2 x8--a3
```

::: step
We build $G_{\Phi}$ from the formula in three parts. Part (1) is a triangle on three new
vertices $s$, $f$ and $t$. Later these three vertices will give the three colours their
names. Here: [[fig:t08-g-phi-build#sft|the triangle at the top left]].
:::

::: step
Part (2): for every variable $x_k$ of the formula we add two new vertices, $x_k$ and
$\neg x_k$. We join them to each other and to $s$, so they form a triangle with $s$. Now every
literal has its own vertex. Here: three variables, so
[[fig:t08-g-phi-build#lit|six literal vertices]] in three triangles at $s$.
:::

::: step
Part (3): for the clause number $i$ we add six new vertices,
$a_i^1, a_i^2, a_i^3$ and $b_i^1, b_i^2, b_i^3$. The three vertices $b$ form a triangle, and
each $a$ is joined to the $b$ with the same upper index. Here the only clause has number 1:
[[fig:t08-g-phi-build#a|three vertices $a$]] and [[fig:t08-g-phi-build#b|three vertices $b$]].
:::

::: step
Each of the three vertices $a$ is joined to $t$. Later $t$ will carry the colour T, so these
edges forbid the colour T at every $a$. Here: [[fig:t08-g-phi-build#at|three edges]] from $t$
to the clause part.
:::

::: step
Last, each $a$ is joined to the vertex of its literal: $a_i^j$ to the vertex $\ell_i^j$, which is
$x_k$ or the negation of $x_k$. Here the literals are the negation of $x_1$, then $x_2$, then
$x_8$: [[fig:t08-g-phi-build#al|three edges]] from the literal vertices to the clause part.
This completes $G_{\Phi}$.
:::
::::

:::: walkthrough {for=thm:three-colouring-sat}
```graph id=t08-g-phi-forward widget=stepper
caption: Satisfiable, so 3-colourable: the valuation with $x_1$, $x_2$, $x_8$ false makes $\neg x_1$ true, and the colouring is built from it. The same filling as $s$, $f$, $t$ means colour S, F, T.
intent: From the lecture (theory/2026-11-03 p3 for the argument; p2 right drawing for the clause part, whose corrected version has F at the top a and S at the top b). The graph and positions of t08-g-phi. The valuation is new. Colour classes: S color1, F color2, T color3.
layout: fixed
f @(0, 2.1); t @(1.1, 2.1); s @(0, 1.15)
x1 @(0.95, 1.5) [label="$x_1$"]; n1 @(1.45, 1.15) [label="¬$x_1$"]
x2 @(1.85, 0.7) [label="$x_2$"]; n2 @(0.85, 0.6) [label="¬$x_2$"]
x8 @(0.9, 0) [label="$x_8$"]; n8 @(0.3, 0) [label="¬$x_8$"]
a1 @(2.6, 1.55) [label="$a_1^1$"]; a2 @(2.6, 0.95) [label="$a_1^2$"]; a3 @(2.6, 0.35) [label="$a_1^3$"]
b1 @(3.6, 1.55) [label="$b_1^1$"]; b2 @(3.2, 0.95) [label="$b_1^2$"]; b3 @(3.6, 0.3) [label="$b_1^3$"]
s -- f; f -- t; s -- t
s -- x1; s -- n1; x1 -- n1; s -- x2; s -- n2; x2 -- n2; s -- x8; s -- n8; x8 -- n8
a1 -- b1; a2 -- b2; a3 -- b3; b1 -- b2; b2 -- b3; b1 -- b3
t -- a1; t -- a2; t -- a3
n1 -- a1; x2 -- a2; x8 -- a3
mark sft: s f t
mark lit: x1 n1 x2 n2 x8 n8
mark true: n1 a1 b1 n1--a1 a1--b1
mark rest: a2 a3 b2 b3
mark inside: a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
mark c: f t s x1 n1 x2 n2 x8 n8 a1 a2 a3 b1 b2 b3
step: $s$, $f$, $t$ get the colours S, F, T.
class color1: s
class color2: f
class color3: t
step: Each literal vertex gets the value of its literal.
class color2: x1 x2 x8
class color3: n1 n2 n8
step: A true literal of the clause: its $a$ gets F, its $b$ gets S.
class color2: a1
class color1: b1
class bold: n1--a1 a1--b1
step: The other two $a$ get S, their $b$ get T and F.
unclass bold: n1--a1 a1--b1
class color1: a2 a3
class color3: b2
class color2: b3
step: The edges inside the clause part are fine.
class bold: a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
step: The edges to $t$ and to the literals are fine.
unclass bold: a1--b1 a2--b2 a3--b3 b1--b2 b2--b3 b1--b3
class bold: t--a1 t--a2 t--a3 n1--a1 x2--a2 x8--a3
```

::: step
First direction: if the formula is satisfiable, then $G_{\Phi}$ is 3-colourable. This is the
hypothesis: a valuation $\nu$ makes every clause true. We build a colouring $c$ and give
[[fig:t08-g-phi-forward#sft|$s$, $f$, $t$]] the colours S, F, T. They differ, so the triangle
is fine. Here $\nu$ gives F to $x_1$, $x_2$ and $x_8$.
:::

::: step
Each literal vertex gets the value of its literal: $c(x_k) = \nu(x_k)$, and the negation of
$x_k$ gets the other value. In each variable triangle, $s$ has S and the other two have T and
F: three different colours. Here [[fig:t08-g-phi-forward#lit|the literal vertices]]: F on $x_1$,
$x_2$, $x_8$ and T on their negations.
:::

::: step
Now take a clause $i$. Here we use that $\nu$ satisfies the formula: some literal of the clause
is true, $\nu(\ell_i^j) = T$ for some $j$. Its $a$ gets the colour F and its $b$ the colour S.
Here $j$ is 1, because the negation of $x_1$ is true:
[[fig:t08-g-phi-forward#true|the true literal and its row]].
:::

::: step
The other two $a$ get S. The $b$ after $j$ gets T, and the next one F, counting
1, 2, 3, 1, 2. Every vertex now has one of three colours. Here
[[fig:t08-g-phi-forward#rest|the second and third rows]]: both $a$ get S, the second $b$ gets
T and the third $b$ gets F.
:::

::: step
We check the edges inside the clause part. The three $b$ have S, T and F, all different. An
edge from an $a$ to its $b$ has the ends F and S, or S and T, or S and F. Here
[[fig:t08-g-phi-forward#inside|all six edges]] have two different colours.
:::

::: step
Last, the edges at the $a$. No $a$ has T, so the edges to $t$ are fine. An $a$ with S meets a
literal vertex, which has T or F. The $a$ with F meets the true literal, colour T. So
[[fig:t08-g-phi-forward#c|$c$]] is a proper colouring with three colours, and $G_{\Phi}$ is
3-colourable.
:::
::::

:::: walkthrough {for=thm:three-colouring-sat}
```graph id=t08-g-phi-backward widget=stepper
caption: 3-colourable, so satisfiable: we suppose a colouring that makes the clause false and find a triangle with only two colours left. The same filling as $s$, $f$, $t$ means colour S, F, T.
intent: From the lecture (theory/2026-11-03 p4 for the argument; p2 right drawing, first version with F, F, F and the cross at the triangle). The graph and positions of t08-g-phi. The colours on the literal vertices are chosen so that the clause is false; the walkthrough shows that they cannot be completed. Colour classes: S color1, F color2, T color3.
layout: fixed
f @(0, 2.1); t @(1.1, 2.1); s @(0, 1.15)
x1 @(0.95, 1.5) [label="$x_1$"]; n1 @(1.45, 1.15) [label="¬$x_1$"]
x2 @(1.85, 0.7) [label="$x_2$"]; n2 @(0.85, 0.6) [label="¬$x_2$"]
x8 @(0.9, 0) [label="$x_8$"]; n8 @(0.3, 0) [label="¬$x_8$"]
a1 @(2.6, 1.55) [label="$a_1^1$"]; a2 @(2.6, 0.95) [label="$a_1^2$"]; a3 @(2.6, 0.35) [label="$a_1^3$"]
b1 @(3.6, 1.55) [label="$b_1^1$"]; b2 @(3.2, 0.95) [label="$b_1^2$"]; b3 @(3.6, 0.3) [label="$b_1^3$"]
s -- f; f -- t; s -- t
s -- x1; s -- n1; x1 -- n1; s -- x2; s -- n2; x2 -- n2; s -- x8; s -- n8; x8 -- n8
a1 -- b1; a2 -- b2; a3 -- b3; b1 -- b2; b2 -- b3; b1 -- b3
t -- a1; t -- a2; t -- a3
n1 -- a1; x2 -- a2; x8 -- a3
mark var: x1 x2 x8
mark neg: n1 n2 n8
mark lits: n1 x2 x8
mark a: a1 a2 a3
mark b: b1 b2 b3 b1--b2 b2--b3 b1--b3
step: $s$, $f$, $t$ have three different colours: S, F, T.
class color1: s
class color2: f
class color3: t
class bold: s--f f--t s--t
step: Each $x_k$ is joined to $s$, so it has T or F.
unclass bold: s--f f--t s--t
class color3: x1
class color2: x2 x8
class bold: s--x1 s--x2 s--x8
step: Each $\neg x_k$ gets the other one of T and F.
unclass bold: s--x1 s--x2 s--x8
class color2: n1
class color3: n2 n8
class bold: x1--n1 x2--n2 x8--n8
step: Suppose a clause is false: its literal vertices all have F.
unclass bold: x1--n1 x2--n2 x8--n8
class bold: n1--a1 x2--a2 x8--a3
step: Each $a$ sees F and T, so it has S.
class color1: a1 a2 a3
class bold: t--a1 t--a2 t--a3
step: The triangle of the $b$ has only T and F left.
unclass bold: n1--a1 x2--a2 x8--a3 t--a1 t--a2 t--a3
class rejected: b1--b2 b2--b3 b1--b3
```

::: step
Second direction: if $G_{\Phi}$ is 3-colourable, the formula is satisfiable. Let $c$ be a
proper 3-colouring. The vertices $s$, $f$, $t$ form a triangle, so they get three different
colours. There are only three colours, so we name them after these vertices: S, F and T. Every
vertex has one of them.
:::

::: step
Each variable vertex $x_k$ is joined to $s$, and $c$ is proper, so its colour is not S: it is T
or F. This colour defines the valuation: $\nu(x_k) = c(x_k)$. Here we suppose that $c$ gives T
to [[fig:t08-g-phi-backward#var|$x_1$]] and F to $x_2$ and $x_8$.
:::

::: step
The vertex $\neg x_k$ is joined to $s$ and to $x_k$, so it gets the one colour left: the
opposite of the value of $x_k$. That is the value of the literal "not $x_k$". So every literal
vertex has the colour of its literal's value. Here
[[fig:t08-g-phi-backward#neg|the negations]] get F, T, T.
:::

::: step
Suppose, for a contradiction, that $\nu$ makes some clause $i$ false. Then all three of its
literals have the value F, so the three literal vertices joined to its vertices $a$ all have
colour F. Here the clause is false: [[fig:t08-g-phi-backward#lits|its three literal vertices]]
all have F.
:::

::: step
Each $a$ of that clause has a neighbour of colour F, its literal vertex, and a neighbour of
colour T, the vertex $t$. The colouring is proper and has only three colours, so the one left
is S. Here [[fig:t08-g-phi-backward#a|all three vertices $a$]] get S.
:::

::: step
Each $b$ is joined to its $a$, so no $b$ has S. But [[fig:t08-g-phi-backward#b|the three $b$]]
form a triangle and need three different colours, and only T and F remain. This contradicts
that $c$ is proper. So every clause has a true literal, and $\nu$ satisfies the formula. Here:
no proper 3-colouring gives these colours to the literal vertices.
:::
::::

::: proof
**Construction.** Write $\ell_i^j$ also for the vertex of that literal ($x_k$ or $\neg x_k$).
$G_\Phi$ consists of:

1. a triangle $(s, f, t)$;
2. for every variable $x_k$ of $\Phi$, a triangle $(s, x_k, \neg x_k)$;
3. for every clause $(\ell_i^1 \lor \ell_i^2 \lor \ell_i^3)$, new vertices
   $a_i^1, a_i^2, a_i^3, b_i^1, b_i^2, b_i^3$ with the triangle $(b_i^1, b_i^2, b_i^3)$ and the
   edges $\set{a_i^j, b_i^j}$ and $\set{a_i^j, t}$ for $j = 1, 2, 3$, and the edges
   $\set{a_i^1, \ell_i^1}$, $\set{a_i^2, \ell_i^2}$, $\set{a_i^3, \ell_i^3}$.

($\Leftarrow$) Let $\Phi$ be satisfiable by a valuation $\nu$. Take three colours $S$, $F$, $T$,
and identify the colours $T$, $F$ with the truth values. Colour $c(s) = S$, $c(f) = F$, $c(t) = T$, and for every $k$: $c(x_k) = \nu(x_k)$,
$c(\neg x_k) = \neg \nu(x_k)$. Then $c(\ell) = \nu(\ell)$ for every literal $\ell$. For every
clause $(\ell_i^1 \lor \ell_i^2 \lor \ell_i^3)$, let $\nu(\ell_i^j) = T$ for some
$j \in \set{1, 2, 3}$; such $j$ exists because $\nu$ satisfies the clause. Colour
$c(a_i^j) = F$, $c(b_i^j) = S$, and $c(a_i^{j+1}) = c(a_i^{j+2}) = S$, $c(b_i^{j+1}) = T$,
$c(b_i^{j+2}) = F$, with upper indices counted modulo 3 in $\set{1, 2, 3}$. This is a proper
3-colouring:

- the triangles $(s, f, t)$ and $(b_i^1, b_i^2, b_i^3)$ get $S$, $F$, $T$ in some order;
- the triangle $(s, x_k, \neg x_k)$ gets $S$, $\nu(x_k)$ and $\neg \nu(x_k)$, which are $S$,
  $T$, $F$ in some order;
- the edges $a_i^j b_i^j$, $a_i^{j+1} b_i^{j+1}$, $a_i^{j+2} b_i^{j+2}$ have the colours
  $F, S$ and $S, T$ and $S, F$;
- every $a_i^{j'}$ has colour $S$ or $F$, and $c(t) = T$;
- for $j' \ne j$, $c(a_i^{j'}) = S$, while $c(\ell_i^{j'}) \in \set{T, F}$; and
  $c(a_i^j) = F \ne T = \nu(\ell_i^j) = c(\ell_i^j)$.

So $G_\Phi$ is 3-colourable.

($\Rightarrow$) Let $c$ be a proper 3-colouring of $G_\Phi$. The vertices $s$, $f$, $t$ are
pairwise adjacent, so they have three different colours; let the colours of $(s, f, t)$ be
named $S$, $F$, $T$, respectively. As $x_k$ is adjacent to $s$, $c(x_k) \in \set{T, F}$; put
$\nu(x_k) = c(x_k)$. As $\neg x_k$ is adjacent to $s$ and $x_k$,
$c(\neg x_k) = \neg \nu(x_k) = \nu(\neg x_k)$. Hence $c(\ell) = \nu(\ell)$ for every literal
$\ell$.

For a contradiction, assume a clause $(\ell_i^1 \lor \ell_i^2 \lor \ell_i^3)$ of $\Phi$ such
that $\nu(\ell_i^1) = \nu(\ell_i^2) = \nu(\ell_i^3) = F$. Then each $a_i^j$,
$j \in \set{1, 2, 3}$, has a neighbour of colour $F$ in $\ell_i^j$ and of colour $T$ in $t$,
and so $c(a_i^j) = S$. Then the triangle $(b_i^1, b_i^2, b_i^3)$ cannot use the colour $S$,
because $b_i^j$ is adjacent to $a_i^j$, and the two colours $T$, $F$ are insufficient for a
triangle. So every clause has a literal with value $T$, and $\nu$ satisfies $\Phi$.
:::

::: pitfall
In the second direction the colours are not given to us. We name them after $s$, $f$ and $t$.
This works only because the triangle forces three different colours, so every colour appears
exactly once on it.
:::

## Check yourself

:::: quiz {#q:t08-g-phi-size}
A 3-SAT formula $\Phi$ has 4 variables and 5 clauses. How many vertices does $G_\Phi$ have?

answer: 41

::: explanation
The triangle $s f t$ has 3 vertices. Each variable adds 2 vertices, $x_k$ and $\neg x_k$: 8 in
all. Each clause adds 6 vertices, $a_i^1, a_i^2, a_i^3, b_i^1, b_i^2, b_i^3$: 30 in all. So
$3 + 8 + 30 = 41$.
:::
::::

:::: quiz {#q:t08-g-phi-a-colour}
Let $c$ be a proper 3-colouring of $G_\Phi$. Which colour can a vertex $a_i^j$ never have?

- [ ] the colour of $s$
- [ ] the colour of $f$
- [x] the colour of $t$

::: explanation
Every $a_i^j$ is joined to $t$, so it never has the colour of $t$. The other two are possible:
in the first direction the $a$ of a true literal gets the colour of $f$, the others the colour
of $s$.
:::
::::
