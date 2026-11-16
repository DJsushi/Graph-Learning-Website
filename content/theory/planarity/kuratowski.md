---
title: Kuratowski's theorem
course: theory
chapter: planarity
order: 8
lectures: [t07]
goal: Recognise non-planar graphs by subdivisions of K5 and K3,3, and follow the lecture's proof sketch of Kuratowski's theorem.
needs: [theory/planarity/k5-not-planar, theory/planarity/planar-drawings, theory/planarity/faces, theory/menger/k-connectivity, theory/basics/graph-families]
stage: taught
long: true # the proof sketch has five parts, so five walkthroughs with 28 steps
status: reviewed
---

The lecture drew $K_5$ again, with three extra vertices on one edge. The graph below has 8
vertices and 13 edges. Can we draw it without crossings?

```graph id=t07-kuratowski-board widget=figure
caption: $K_5$ with the edge 5 4 replaced by the path 5 a b c 4: 8 vertices and 13 edges.
intent: From the lecture (theory/2026-10-27 p5, top right, the black K5 with three small vertices on its left edge). The board has no names; the names are new and the positions are those of t07-k5-board. Opening question: the extra vertices do not help.
layout: fixed
1 @(1.6, 3.15); 2 @(3.07, 2.08); 3 @(2.51, 0.35); 4 @(0.69, 0.35); 5 @(0.13, 2.08)
a @(0.27, 1.65); b @(0.41, 1.21); c @(0.55, 0.78)
1 -- 2 -- 3 -- 4; 5 -- 1
5 -- a -- b -- c -- 4
1 -- 3; 1 -- 4; 2 -- 4; 2 -- 5; 3 -- 5
mark path: 5--a a--b b--c c--4
mark corners: 1 2 3 4 5
```

No. Forget a, b and c, and [[fig:t07-kuratowski-board#path|the path 5 a b c 4]] becomes one
curve. That is a drawing of $K_5$ without crossings, and
[[prop:k5-not-planar|$K_5$ is not planar]]. Kuratowski's theorem says that this is the only
obstacle: a graph is planar unless a $K_5$ or a $K_{3,3}$ hides in it, with extra vertices on
its edges.

::: definition {#def:subdivision title="Subdivision" defines="subdivision, contains a subdivision" source="theory/2026-10-27 p5"}
A **subdivision** of a graph $H$ is a graph obtained from $H$ by replacing edges with paths:
an edge $uv$ is replaced by a path from $u$ to $v$ whose inner vertices are new. A graph $G$
**contains a subdivision** of $H$ if a subgraph of $G$ is a subdivision of $H$.
:::

::: intuition
Put new vertices on some edges of $H$. The picture stays the same: the edges only get stops
on the way.
:::

The lecture's example subdivides three edges of $K_{3,3}$.

```graph id=t07-subdivision-k33 widget=stepper
caption: The lecture's subdivision of $K_{3,3}$, one edge at a time. Each thick path replaces one edge. At the end: 12 vertices and 15 edges.
intent: From the lecture (theory/2026-10-27 p5, top right, the black K_{3,3}: three new vertices on the top edge, one on the edge from the top left to the middle right, two on the edge from the middle left to the top right). The board has no names; u1 to w3 are the names of t03-girth-question, p1 to r2 are new. Worked example for the definition.
layout: fixed
u1 @(0, 2); u2 @(0, 1); u3 @(0, 0); w1 @(3, 2); w2 @(3, 1); w3 @(3, 0)
u1 -- w1; u1 -- w2; u1 -- w3; u2 -- w1; u2 -- w2; u2 -- w3; u3 -- w1; u3 -- w2; u3 -- w3
step: $K_{3,3}$: 6 vertices and 9 edges.
step: The edge u1 w1 becomes a path through three new vertices.
remove u1--w1
p1 @(0.75, 2); p2 @(1.5, 2); p3 @(2.25, 2)
u1 -- p1 [class=bold]; p1 -- p2 [class=bold]; p2 -- p3 [class=bold]; p3 -- w1 [class=bold]
step: The edge u1 w2 becomes a path through one new vertex.
remove u1--w2
q1 @(0.9, 1.7)
u1 -- q1 [class=bold]; q1 -- w2 [class=bold]
step: The edge u2 w1 becomes a path through two new vertices.
remove u2--w1
r1 @(0.9, 1.3); r2 @(2.1, 1.7)
u2 -- r1 [class=bold]; r1 -- r2 [class=bold]; r2 -- w1 [class=bold]
```

::: theorem {#thm:kuratowski title="Kuratowski's theorem" source="theory/2026-10-27 p5"}
A graph $G$ is planar $\iff$ $G$ contains no subdivision of $K_5$ or $K_{3,3}$.
:::

::: intuition
Two small graphs are the only obstacles. A graph can be drawn without crossings exactly when
no $K_5$ and no $K_{3,3}$ hides in it, possibly with extra vertices on its edges.
:::

So the graph of the opening is not planar: it is a subdivision of $K_5$ with
[[fig:t07-kuratowski-board#corners|the corners 1 to 5]].

The proof uses one more theorem. To **contract** an edge $e$ means to merge its two ends into
one new vertex $v_e$, joined to every neighbour of either end. The result is $G/e$.

::: theorem {#thm:contractible-edge title="Contractible edges" source="theory/2026-10-27 p6"}
If $G$ is 3-connected and $G \ne K_4$, then there exists $e \in E(G)$ such that after
contracting $e$, the graph $G/e$ is 3-connected again.
:::

::: intuition
In a 3-connected graph we can shrink some edge to a point and stay 3-connected. $K_4$ is the
exception: shrinking any of its edges leaves a triangle.
:::

The lecture states this without proof and refers to Diestel's book.

```graph id=t07-contract-wheel widget=stepper
caption: The wheel with hub h and rim 1 2 3 4 5 is 3-connected. Contracting the rim edge 1 2 gives the wheel with rim $v_e$ 3 4 5, again 3-connected. A spoke would not do: after contracting h 1, deleting the new vertex and 3 cuts off 2.
intent: New figure; the lecture draws only a contraction sketch next to the theorem (theory/2026-10-27 p6, the green drawing: two vertices joined by e become one vertex v_e). An example of the theorem: a 3-connected graph other than K4 and a good edge.
layout: fixed
1 @(0.6, 1.3); 2 @(2.4, 1.3); 3 @(3, 0.3); 4 @(1.5, 0); 5 @(0, 0.3); h @(1.5, 0.7)
1 -- 2 -- 3 -- 4 -- 5 -- 1
h -- 1; h -- 2 [id=s2]; h -- 3; h -- 4; h -- 5
mark e: 1--2
step: A 3-connected wheel and the rim edge $e$ = 1 2.
class highlight: 1--2
step: Contract $e$: the ends 1 and 2 merge into $v_e$.
merge 1 2 -> ve [label="$v_e$"]
step: Keep one edge from $v_e$ to h. The result is a wheel again.
remove @s2
```

## Why it is true

The easy direction turns a drawing into one of $K_5$ or $K_{3,3}$. The hard direction takes a
**smallest counterexample** and shows, part by part, that it cannot exist. The lecture gives a
sketch, and the walkthroughs fill in its steps.

:::: walkthrough {for=thm:kuratowski}
```graph id=t07-kuratowski-easy widget=stepper
caption: A stand-in for the direction from left to right: a subdivision of $K_{3,3}$ with the inner vertex s, plus the edge u1 u2. No planar graph contains such a subdivision, so this drawing has crossings.
intent: New figure; the lecture only says "easy" (theory/2026-10-27 p5). Vertex names and the K_{3,3} layout follow t03-girth-question. Each step is one step of the written proof.
layout: fixed
u1 @(0, 1.3); u2 @(1.5, 1.3); u3 @(3, 1.3); w1 @(0, 0); w2 @(1.5, 0); w3 @(3, 0); s @(0, 0.65)
u1 -- s -- w1; u1 -- w2; u1 -- w3; u2 -- w1; u2 -- w2; u2 -- w3; u3 -- w1; u3 -- w2; u3 -- w3
u1 -- u2
mark S: u1 u2 u3 w1 w2 w3 s u1--s s--w1 u1--w2 u1--w3 u2--w1 u2--w2 u2--w3 u3--w1 u3--w2 u3--w3
mark extra: u1--u2
mark path: u1--s s--w1
step: $G$ is planar and contains a subdivision $S$.
step: Keep only $S$.
class muted: u1--u2
step: Erase the inner vertex s: the path becomes one edge.
remove u1--u2
remove s
u1 -- w1 [class=highlight]
step: No face of $K_{3,3}$ has length 1, 2 or 3.
unclass highlight: u1--w1
class cycle: u1--w2 w2--u2 u2--w1 w1--u1
step: The edge bound allows 8 edges, and there are 9.
unclass cycle: u1--w2 w2--u2 u2--w1 w1--u1
class rejected: u1--w1 u1--w2 u1--w3 u2--w1 u2--w2 u2--w3 u3--w1 u3--w2 u3--w3
```

::: step
From left to right, by contradiction. Let $G$ be [[def:planar-graph|planar]] and contain a
subdivision $S$ of $K_5$ or $K_{3,3}$, here [[fig:t07-kuratowski-easy#S|of $K_{3,3}$]]. Such a
graph does not exist, so the picture is a stand-in with crossings.
:::

::: step
Fix a drawing of $G$ without crossings. Delete everything outside $S$, here
[[fig:t07-kuratowski-easy#extra|the edge u1 u2]]. Deleting creates no crossing, so $S$ is
drawn without crossings.
:::

::: step
Erase the inner vertices of the paths of $S$. Each path becomes one curve between its ends,
still without crossings: [[fig:t07-kuratowski-easy#path|u1 s w1]] becomes the edge u1 w1. So
$K_5$ or $K_{3,3}$ is drawn without crossings.
:::

::: step
$K_5$ cannot be: [[prop:k5-not-planar|it is not planar]]. For $K_{3,3}$, look at the faces.
Every edge joins the two sides, so closed walks have even length: no face of length 1 or 3.
Length 2 needs parallel edges or a vertex of degree 1, but all degrees are 3.
:::

::: step
$K_{3,3}$ is connected, so the [[exr:t07-edge-bounds|edge bound]] for faces of length at least
4 allows at most $2 \cdot 6 - 4 = 8$ edges. It has 9: a contradiction.
:::
::::

:::: walkthrough {for=thm:kuratowski}
```graph id=t07-kuratowski-cut-vertex widget=stepper
caption: A stand-in for the first two parts of the other direction: two copies of $K_4$ that share the vertex x. This graph is planar; a smallest counterexample does not exist, and the proof shows why.
intent: New figure after the lecture's sketch (theory/2026-10-27 p5, part 2: two blobs that share the vertex x, then G_1 and G_2 drawn apart). Each step is one step of the written proof.
layout: fixed
a @(0, 1.3); b @(0, 0); c @(0.65, 0.65); x @(1.5, 0.65); d @(3, 1.3); g @(3, 0); f @(2.35, 0.65)
a -- b; a -- c; b -- c; a -- x; b -- x; c -- x
d -- g; d -- f; g -- f; d -- x; g -- x; f -- x
mark x: x
mark G1: a b c x a--b a--c b--c a--x b--x c--x
mark G2: d f g x d--g d--f g--f d--x g--x f--x
step: A smallest counterexample $G_0$.
step: $G_0$ is connected.
class bold: a--b a--c b--c a--x b--x c--x d--g d--f g--f d--x g--x f--x
step: Suppose deleting x disconnects $G_0$.
unclass bold: a--b a--c b--c a--x b--x c--x d--g d--f g--f d--x g--x f--x
class current: x
step: Split $G_0$ at x into $G_1$ and $G_2$.
class color1: a b c a--b a--c b--c a--x b--x c--x
class color2: d f g d--g d--f g--f d--x g--x f--x
step: Both are planar; put them together at x.
unclass current: x
class highlight: x
```

::: step
From right to left. Suppose it fails, and take a counterexample $G_0$ with the fewest
vertices: not planar, and no subdivision of $K_5$ or $K_{3,3}$. So every graph with fewer
vertices and no such subdivision is planar.
:::

::: step
First, $G_0$ is [[def:component|connected]]. Otherwise each component has fewer vertices and,
as a subgraph, no subdivision. By minimality it is planar. The components side by side would
draw $G_0$ without crossings.
:::

::: step
Second, $G_0$ is [[def:k-connected|2-connected]]. Suppose not. Graphs on at most 2 vertices
are planar, so $G_0$ has at least 3. Then deleting one vertex
[[fig:t07-kuratowski-cut-vertex#x|$x$]] disconnects it.
:::

::: step
Let [[fig:t07-kuratowski-cut-vertex#G1|$G_1$]] be one component of what remains and
[[fig:t07-kuratowski-cut-vertex#G2|$G_2$]] the rest, each together with $x$. Here both are
copies of $K_4$. Each misses a vertex of $G_0$.
:::

::: step
Both are subgraphs, so by minimality both are planar. Draw each with $x$ on the outer face: a
drawing can be changed so that any face is the outer one (used without proof). Joining the two
copies of $x$ draws $G_0$ without crossings.
:::
::::

:::: walkthrough {for=thm:kuratowski}
```graph id=t07-kuratowski-two-cut widget=stepper
caption: A stand-in for the third part: a 2-connected graph in which deleting x and y leaves two pieces. The dashed line is the added edge from x to y.
intent: New figure after the lecture's sketch (theory/2026-10-27 p5, part 3: two blobs that share two vertices, and each blob with the red edge between them). Each step is one step of the written proof.
layout: fixed
x @(1.5, 1.3); y @(1.5, 0); a @(0, 1); b @(0, 0.3); c @(3, 1); d @(3, 0.3)
x -- a -- b -- y; a -- y
x -- c -- d -- y; c -- y
mark xy: x y
mark G1: a b x y x--a a--b b--y a--y
mark G2: c d x y x--c c--d d--y c--y
mark path: x--c c--y
step: Two vertices x and y whose deletion disconnects $G_0$.
class current: x y
step: Split $G_0$ at x and y into $G_1$ and $G_2$.
class color1: a b x--a a--b b--y a--y
class color2: c d x--c c--d d--y c--y
step: Add the edge from x to y to both.
x -- y [class=dashed]
step: A path through $G_2$ could replace that edge.
class path: x--c c--y
step: The path exists: c reaches x and y inside $G_2$.
class highlight: c
step: Both are planar; glue them along the new edge.
unclass highlight: c
unclass path: x--c c--y
unclass color1: a b x--a a--b b--y a--y
unclass color2: c d x--c c--d d--y c--y
class highlight: x--y
```

::: step
Third, $G_0$ is 3-connected. Suppose not. Graphs on at most 4 vertices lie in the planar $K_4$,
so $G_0$ has at least 5. Then deleting
[[fig:t07-kuratowski-two-cut#xy|two vertices $x$ and $y$]] disconnects it. One is not enough,
by the second part.
:::

::: step
Split as before: [[fig:t07-kuratowski-two-cut#G1|$G_1$]] is one component of what remains and
[[fig:t07-kuratowski-two-cut#G2|$G_2$]] the rest, each together with both deleted vertices.
Each has fewer vertices than $G_0$.
:::

::: step
Add an edge from $x$ to $y$ to both, unless it is there: the red edge on the board. The new
graphs still have fewer vertices, but they may no longer be subgraphs of $G_0$.
:::

::: step
So we check that the first new graph has no subdivision of $K_5$ or $K_{3,3}$. If it had one,
a path through $G_2$, here [[fig:t07-kuratowski-two-cut#path|x c y]], could replace the new
edge, giving one in $G_0$. The same holds for the second.
:::

::: step
The path exists. Take a vertex of $G_2$ other than $x$ and $y$, here c. Deleting one vertex
leaves $G_0$ connected, so c reaches each of the two while avoiding the other. These walks stay
in $G_2$, which meets the rest only at the two.
:::

::: step
By minimality both new graphs are planar. Draw each with the new edge on the outer face, glue
the drawings along it, and delete it if $G_0$ lacks it. This draws $G_0$ without crossings.
:::
::::

:::: walkthrough {for=thm:kuratowski}
```graph id=t07-kuratowski-contract widget=stepper
caption: The lecture's drawing for the contraction step stands in for G. Contracting e gives $K_5$. Undoing it, u leads to a and b, and v to c and d. Then the filled vertices u, c, d and the ringed vertices v, a, b are the two sides of a $K_{3,3}$.
intent: From the lecture (theory/2026-10-27 p6, the red drawing "G/e and K5 ... has K3,3!": K5 with one vertex drawn as the edge e). The board has no vertex names; they are new. The drawing is flattened to fit.
layout: fixed
u @(1.1, 1.3); v @(1.9, 1.3); a @(0, 0.75); d @(3, 0.75); b @(0.7, 0); c @(2.3, 0)
u -- v; u -- a [id=ua]; u -- b; v -- a [id=va]; v -- c; v -- d
a -- b; a -- c; a -- d; b -- c; b -- d; c -- d
mark e: u--v
mark K33: u v a b c d u--v @ua u--b v--c v--d a--c a--d b--c b--d
step: An edge $e$ = u v whose contraction is 3-connected.
class highlight: u--v
step: Contract $e$ into the new vertex $v_e$.
merge u v -> ve [label="$v_e$"]
step: A subdivision $S$ in $G/e$; here all of $K_5$.
remove @va
class bold: @ua ve--b ve--c ve--d a--b a--c a--d b--c b--d c--d
mark S: ve a b c d @ua ve--b ve--c ve--d a--b a--c a--d b--c b--d c--d
step: Undo the contraction: u and v share the paths at $v_e$.
remove ve
u @(1.1, 1.3); v @(1.9, 1.3)
u -- v; u -- a [class=bold]; u -- b [class=bold]; v -- a; v -- c [class=bold]; v -- d [class=bold]
step: Two paths each: $G$ contains a subdivided $K_{3,3}$.
class color1: u c d
class cycle: v a b
class muted: v--a a--b c--d
step: So $G/e$ contains no such subdivision.
unclass color1: u c d
unclass cycle: v a b
class rejected: u--v u--a u--b v--c v--d a--c a--d b--c b--d
```

::: step
Now $G_0$ is 3-connected; the board calls it $G$ from here on. It is not $K_4$, which is planar.
So [[thm:contractible-edge|the theorem on contractible edges]] gives an edge
[[fig:t07-kuratowski-contract#e|$e$]] whose contraction is again 3-connected. Its ends are $u$
and $v$.
:::

::: step
Contract $e$ into the new vertex $v_e$. The contracted graph has one vertex fewer. We show that
it has no subdivision of $K_5$ or $K_{3,3}$. Then minimality makes it planar: this is the
board's induction on the number of vertices.
:::

::: step
Suppose it contains such a subdivision $S$. One that avoids $v_e$ would lie in $G$ too, which
is impossible. So $S$ passes through $v_e$; here
[[fig:t07-kuratowski-contract#S|it is the whole $K_5$]].
:::

::: step
Undo the contraction. Each path of $S$ at $v_e$ now starts at an end of $e$. If one end starts
at most one path, the other end takes the place of $v_e$, and $e$ lengthens that path. Then $G$
contains a subdivision of the same graph: impossible.
:::

::: step
Otherwise at most four paths meet at $v_e$ ($K_5$ and $K_{3,3}$ have degrees $\le 4$), so
each end starts two: $v_e$ is a $K_5$ vertex.
Here u leads to a, b and v to c, d: with $e$ and the paths of $S$ between a, b and c, d, a
subdivided [[fig:t07-kuratowski-contract#K33|$K_{3,3}$]], sides u, c, d and v, a, b.
:::

::: step
Each case gives $G$ a subdivision of $K_5$ or $K_{3,3}$, which it does not have. So the
contracted graph has none, and by minimality it is planar.
:::
::::

:::: walkthrough {for=thm:kuratowski}
```graph id=t07-kuratowski-cases widget=stepper
caption: The lecture's three cases. The contracted graph is a wheel; deleting $v_e$ leaves the cycle C = 1 2 3 4 5. Then u and v come back with three different sets of neighbours: planar, a $K_{3,3}$, a $K_5$. In the $K_{3,3}$ the filled and the ringed vertices are the two sides.
intent: From the lecture (theory/2026-10-27 p6, the four blue circles: the contracted graph with v_e inside a circle, then the cases "planar", "K3,3" and "K5"). The board has no vertex names; they are new, and the circle has 5 vertices in all cases.
layout: fixed
1 @(1.5, 1.3); 2 @(3, 0.75); 3 @(2.2, 0); 4 @(0.8, 0); 5 @(0, 0.75); ve @(1.5, 0.6) [label="$v_e$"]
1 -- 2 -- 3 -- 4 -- 5 -- 1
ve -- 1; ve -- 2; ve -- 3; ve -- 4; ve -- 5
mark C: 1--2 2--3 3--4 4--5 5--1
step: A planar drawing of the contracted graph.
step: Delete $v_e$: its face is bounded by the cycle C.
remove ve
class cycle: 1--2 2--3 3--4 4--5 5--1
step: Case 1: the neighbours of v lie in one segment. Planar.
u @(1.15, 0.6); v @(1.85, 0.6)
u -- v [id=e class=highlight]
u -- 5 [id=c1a]; u -- 1 [id=c1b]; u -- 4 [id=c1c]; v -- 1 [id=c1d]; v -- 2 [id=c1e]; v -- 3 [id=c1f]
mark seg: 1--2 2--3 3--4
step: Case 2: neighbours of u and v alternate around C. $K_{3,3}$.
unclass cycle: 1--2 2--3 3--4 4--5 5--1
remove @c1a
remove @c1b
remove @c1c
remove @c1d
remove @c1e
remove @c1f
u -- 5 [id=c2a]; u -- 3 [id=c2b]; v -- 1 [id=c2c]; v -- 2 [id=c2d]; v -- 4 [id=c2e]
class color1: u 1 4
class cycle: v 3 5
class muted: @c2d
mark alt: 3 4 5 1
step: Case 3: u and v have three common neighbours. $K_5$.
unclass color1: u 1 4
unclass cycle: v 3 5
remove @c2a
remove @c2b
remove @c2c
remove @c2d
remove @c2e
u -- 1 [id=c3a]; u -- 3 [id=c3b]; u -- 4 [id=c3c]; u -- 5 [id=c3d]; v -- 1 [id=c3e]; v -- 2 [id=c3f]; v -- 3 [id=c3g]; v -- 4 [id=c3h]
class color1: u v 1 3 4
class muted: @c3d @c3f
mark common: 1 3 4
step: No other case: every case contradicts the choice of $G$.
unclass color1: u v 1 3 4
unclass muted: @c3d @c3f
class rejected: @e
```

::: step
By minimality the contracted graph is planar. We fix a drawing of it; here it is a wheel with
hub $v_e$. Remember that it is 3-connected.
:::

::: step
Delete $v_e$. What remains is $G$ without the ends of $e$. It is 2-connected, since the
contracted graph is 3-connected and we deleted one vertex. So the face
that held $v_e$ is bounded by a cycle [[fig:t07-kuratowski-cases#C|$C$]], a circle on the
board (used without proof). The other neighbours of both ends lie on $C$.
:::

::: step
The neighbours of $u$ cut $C$ into segments. Case 1: the neighbours of $v$ lie in one segment,
here [[fig:t07-kuratowski-cases#seg|1 2 3 4]]. Draw $u$ where $v_e$ was and $v$ next to that
segment. Nothing crosses, so $G$ is planar: a contradiction.
:::

::: step
Case 2: two neighbours of $u$ and two of $v$ alternate around $C$, here
[[fig:t07-kuratowski-cases#alt|3, 4, 5, 1]]. Then $e$, the four edges to them and four arcs of
$C$ form a subdivided $K_{3,3}$. Each end of $e$, with the two neighbours of the other end, is
one side.
:::

::: step
Case 3: $u$ and $v$ have three common neighbours on $C$, here
[[fig:t07-kuratowski-cases#common|1, 3 and 4]]. These five vertices carry a subdivided $K_5$:
$e$, six edges from its ends and three arcs of $C$. A contradiction.
:::

::: step
No other case is possible. $G$ is 3-connected, so $v$ has degree at least 3 and two
neighbours on $C$. If case 1 fails and one lies inside a segment, another lies outside it: case
2. Otherwise all are neighbours of $u$: three give case 3, two in no common segment case 2.
:::
::::

:::: proof {title="Proof sketch" for=thm:kuratowski}
$\Rightarrow$: Let $G$ be planar and suppose that $G$ contains a subdivision $S$ of $K_5$ or
$K_{3,3}$. A planar drawing of $G$ contains a planar drawing of $S$. Erasing the inner vertices
of the paths of $S$ turns each path into one curve, so we get a planar drawing of $K_5$ or of
$K_{3,3}$. But $K_5$ is not planar ([[prop:k5-not-planar]]), and neither is $K_{3,3}$: it is
connected and bipartite, so every closed walk has even length, and it has no parallel edges and
no vertex of degree 1. So a plane drawing of it has no face of length 1, 2 or 3, and the edge
bound ([[exr:t07-edge-bounds]]) would give $9 \le 2 \cdot 6 - 4 = 8$.

$\Leftarrow$: Suppose not, and let $G_0$ be a smallest counterexample: a non-planar graph with
no subdivision of $K_5$ or $K_{3,3}$, with as few vertices as possible. Then every graph with
fewer vertices and no such subdivision is planar. First, $G_0$ is 3-connected:

1. $G_0$ is connected. Otherwise its components are subgraphs with fewer vertices, so they are
   planar, and we draw them side by side.
2. $G_0$ is 2-connected. Graphs on at most 2 vertices are planar, so $G_0$ has at least 3
   vertices, and if it is not 2-connected, deleting a vertex $x$ disconnects $G_0$.
   <!-- REVIEW: added "at most 2 vertices are planar": a graph on at most 2 vertices is not 2-connected but has no cut vertex (math check). --> Let $G_1$ be one
   component of $G_0 - x$ together with $x$, and $G_2$ the rest together with $x$. Then $G_1$
   and $G_2$ are planar, by minimality. We draw both with $x$ on the outer face and put them
   together to make $G_0$, which is then planar.
3. $G_0$ is 3-connected, similarly. Graphs on at most 4 vertices are subgraphs of $K_4$, so they
   are planar, and $G_0$ has at least 5 vertices. If it is not 3-connected, deleting two vertices
   $x$, $y$ disconnects it. Let $G_1$ be one component of $G_0 - x - y$ with $x$ and $y$, and
   $G_2$ the rest with $x$ and $y$, and add the edge $xy$ to both. If $G_1 + xy$ contained a
   subdivision of $K_5$ or $K_{3,3}$, replacing $xy$ by an $x$–$y$ path through $G_2$ would give
   one in $G_0$. So $G_1 + xy$ is planar by minimality, and so is $G_2 + xy$. We draw both with
   $xy$ on the outer face, glue them along $xy$, and delete $xy$ if $G_0$ does not have it.

Now let $G = G_0$ be 3-connected, and we use [[thm:contractible-edge]]: $G \ne K_4$, since $K_4$
is planar, so there is an edge $e = uv$ such that $G/e$ is 3-connected. Let $v_e$ be the new
vertex of the contraction of $e$. We continue by induction on $\abs{V(G)}$. The graph $G/e$
contains no subdivision $S$ of $K_5$ or $K_{3,3}$: otherwise $v_e$ is in $S$, since else $S$ lies in
$G$. If one of $u$, $v$ starts at most one of the paths of $S$ at $v_e$, the other one takes the
place of $v_e$ and $G$ contains a subdivision of the same graph. If both start two, $v_e$ is a
vertex of a $K_5$, and $G$ contains a subdivision of $K_{3,3}$ (the red drawing). So, by the
induction assumption, $G/e$ is planar.

Fix a planar drawing of $G/e$. Since $G/e$ is 3-connected, $G/e - v_e = G - u - v$ is
2-connected, and the face of its drawing that contains $v_e$ is bounded by a cycle $C$. All
neighbours of $u$ and $v$ other than $u$ and $v$ lie on $C$, and the neighbours of $u$ cut $C$
into segments. In $G$ we have one of three cases:

- All neighbours of $v$ on $C$ lie in one segment. We draw $u$ in place of $v_e$ and $v$ next
  to that segment, so $G$ is planar.
- $u$ has neighbours $u_1, u_2$ and $v$ has neighbours $v_1, v_2$ on $C$, in the order
  $u_1, v_1, u_2, v_2$ around $C$. Then $C$, $u$, $v$ and $e$ contain a subdivision of $K_{3,3}$
  with the sides $\set{u, v_1, v_2}$ and $\set{v, u_1, u_2}$.
- $u$ and $v$ have three common neighbours on $C$. Then $C$, $u$, $v$ and $e$ contain a
  subdivision of $K_5$.

If the first case fails, then $v$ has at least two neighbours on $C$, and either a neighbour
of $v$ lies inside a segment and another lies outside it (second case), or all neighbours of $v$
on $C$ are neighbours of $u$ (third case if there are three, second case if there are two).
Each case contradicts the choice of $G$.
<!-- REVIEW: was "has two neighbours that do not lie in one segment", false when u and v share three neighbours on C (math check); now the case split of the walkthrough. -->
::::

::: pitfall
"Contains a subdivision" is weaker than "contains $K_5$ as a subgraph". The graph of the opening
has no $K_5$ inside it: 4 and 5 are not adjacent, and a, b and c have degree 2. It is still not
planar.
:::

## Check yourself

:::: quiz {#q:t07-subdivide-k5}
Replace every edge of $K_5$ by a path with one inner vertex. How many vertices does this
subdivision of $K_5$ have?

answer: 15

::: explanation
$K_5$ has 5 vertices and 10 edges. Each edge gets one new vertex, so there are $5 + 10 = 15$
vertices. Each edge becomes two edges, so there are 20 edges.
:::
::::
