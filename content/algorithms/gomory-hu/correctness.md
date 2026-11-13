---
title: "Why the construction works"
course: algorithms
chapter: gomory-hu
order: 8
lectures: [a03]
stage: split
status: reviewed
---

::: lemma {#lem:gomory-hu-invariant title="Existence of representatives" aka="tree construction invariant" source="algorithms/03 p18, p20–21"}
Let $T$ be an intermediate tree of [[alg:gomory-hu]] with nodes $S_i$. After each round: for every edge $S_iS_j$ of $T$ there are vertices
$a \in S_i$ and $b \in S_j$ such that $w(S_iS_j) = f_G(a, b)$ and the cut defined by the edge $S_iS_j$ is a minimum $a$–$b$ cut in $G$. (The cut
defined by $S_iS_j$ is $\delta(U)$, where $U$ is the union of the node sets in the component of $T - S_iS_j$ that contains $S_i$.)
:::

The proof is an induction over the rounds of the construction: the invariant holds at the start, and in one round we choose representatives for every edge of the new tree, one kind of edge at a time.

Part 1, the start and the round: what the round computes.

:::: walkthrough {for=lem:gomory-hu-invariant}
```graph id=a03-ghc-round widget=stepper
caption: A network $G$; the numbers are capacities. Filled vertices form the node $S$ that the round splits; thick edges form the cut that the round finds.
intent: New (the lecture proves the invariant on p18 and p20–21 without an example). One network for all walkthroughs of the invariant. Its tree before round 4 comes from the rounds with the pairs x–s, y–x and z–a; round 4 splits S = {a, b, s} with a and b. The proof text is algorithms/03 p20.
layout: fixed
y @(0, 0.6); x @(1, 0.6); a @(2, 0.6); z @(3, 0); s @(1, -0.6); b @(2, -0.6)
y -- x [c=6]; y -- s [id=ys c=1]; x -- a [id=xa c=3]; x -- s [id=xs c=1]; a -- b [c=2]; a -- s [c=3]; b -- s [c=6]; a -- z [c=4]; b -- z [c=2]
mark V: y x a z s b
step: At the start, $T$ is one node and has no edges.
step: Before the round: the node $S$ with $a$ and $b$.
class color1: a b s
mark S: a b s
step: Contract the components of $T - S$: the graph $H$.
merge x y -> vC [label="$v_C$"]
mark vC: vC
step: A minimum $a$–$b$ cut $\delta_H(A)$ of $H$.
class bold: a--b a--s @ys @xs b--z
mark A: a vC z
step: Read $A$ in $G$: the cut keeps its capacity.
remove vC
y @(0, 0.6); x @(1, 0.6)
y -- x [c=6]; y -- s [id=ys2 c=1 class=bold]; x -- a [c=3]; x -- s [id=xs2 c=1 class=bold]
mark AG: a x y z
mark B: b s
```

::: step
We prove the invariant by induction over the rounds. At the beginning, $T$ has the single node $V$ and no edges. The invariant speaks only about edges of $T$, so there is nothing to check, and it holds. Here: [[fig:a03-ghc-round#V|the node $V$]] contains all six vertices.
:::

::: step
Assume that the invariant holds before some round. The round picks a node $S$ with two vertices $a$ and $b$ and splits it into a part $S_a$ with $a$ and a part $S_b$ with $b$. Here: before round 4, $T$ is the path $\set{y}$, $\set{x}$, [[fig:a03-ghc-round#S|$S$]], $\set{z}$ with capacities 7, 5, 6, and $S = \set{a, b, s}$.
:::

::: step
The round builds the graph $H$: it contracts each component of $T - S$ into a single vertex ([[alg:gomory-hu]]). Here: the nodes $\set{y}$ and $\set{x}$ form one component, which becomes [[fig:a03-ghc-round#vC|$v_C$]] with two parallel edges to $s$, and the component $\set{z}$ is a single vertex, which stays as it is.
:::

::: step
The round finds a minimum $a$–$b$ cut $\delta_H(A)$ of $H$, where $A$ is the side of $a$. Its capacity becomes the capacity of the new tree edge. Here: [[fig:a03-ghc-round#A|$A$]] consists of $a$, $v_C$ and $z$, and the cut (thick edges) has capacity $2 + 3 + 1 + 1 + 2 = 9$.
:::

::: step
We read $A$ and the other side $B$ as vertex sets of $G$: $v_C$ stands for $x$ and $y$ ([[algorithms/gomory-hu/construction|the convention of the construction]]). A contracted set lies wholly in $A$ or wholly in $B$, so by [[obs:identification-cuts]] the cut $\delta_G(A)$ has the same capacity as $\delta_H(A)$. Here: [[fig:a03-ghc-round#AG|$A$]] is $\set{a, x, y, z}$, [[fig:a03-ghc-round#B|$B$]] is $\set{b, s}$, capacity 9.
:::
::::

Part 2, the new edge $S_aS_b$: its representatives are $a$ and $b$.

:::: walkthrough {for=lem:gomory-hu-invariant}
```graph id=a03-ghc-new-edge widget=stepper
caption: The network of the first figure. Filled vertices show the node $S$, the component under discussion and finally the parts $S_a$ and $S_b$, each in its own shade; ringed vertices are representatives; thick edges form the cut under discussion.
intent: New; the network and round of a03-ghc-round. It shows the repeated use of the contraction corollary (algorithms/03 p20, "by repeated application of G-H Lemma").
layout: fixed
y @(0, 0.6); x @(1, 0.6); a @(2, 0.6); z @(3, 0); s @(1, -0.6); b @(2, -0.6)
y -- x [c=6]; y -- s [id=ys c=1]; x -- a [id=xa c=3]; x -- s [id=xs c=1]; a -- b [id=ab c=2]; a -- s [id=as c=3]; b -- s [c=6]; a -- z [id=az c=4]; b -- z [id=bz c=2]
class color1: a b s
step: The cut of the edge $XS$ is $\delta(U_C)$.
class color2: x y
class path: x s
class bold: @ys @xa @xs
mark UC: x y
step: Contracting $U_C$ keeps $f(a, b)$.
merge x y -> vC [label="$v_C$" class=color2]
unclass path: s
step: The other component $\set{z}$ stays a side of a minimum cut.
unclass bold: @ys @xa @xs
class color5: z
class path: z a
class bold: @az @bz
mark Z: z
step: So $f_H(a, b) = f_G(a, b)$.
unclass path: z
class path: b
unclass bold: @az @bz
class bold: @ab @as @ys @xs @bz
step: $\delta_G(A)$ is a minimum $a$–$b$ cut of $G$.
remove vC
y @(0, 0.6); x @(1, 0.6)
y -- x [c=6]; y -- s [id=ys2 c=1 class=bold]; x -- a [c=3]; x -- s [id=xs2 c=1 class=bold]
class color2: x y
step: The cut of the new edge $S_aS_b$ is $\delta(A)$.
unclass color1: a b s
class color3: a
class color4: b s
mark A: a x y z
```

::: step
Let $C$ be a component of $T - S$, $U_C$ the union of its node sets, and $XS$ the tree edge from $C$ to $S$. Removing $XS$ from the tree cuts off exactly $C$: its cut is $\delta(U_C)$. By the invariant, it is a minimum $x$–$s$ cut for some $x$ in $X$, $s$ in $S$. Here: [[fig:a03-ghc-new-edge#UC|$U_C$]] is $\set{x, y}$.
:::

::: step
The vertices $a$ and $b$ lie in $S$, and $S$ shares no vertex with $U_C$, because the nodes partition $V$. So [[cor:gomory-hu-contraction]], applied to the minimum $x$–$s$ cut $\delta(U_C)$, says that identifying $U_C$ into one vertex does not change $f(a, b)$. Here: $f(a, b)$ is 9 before and after.
:::

::: step
Every other component $C'$ stays a side of a minimum cut. Its cut does not separate two vertices of $U_C$, so it survives the contraction with its capacity ([[obs:identification-cuts]]). Its representatives lie outside $U_C$, so their value $f(x', s')$ does not change ([[cor:gomory-hu-contraction]]). Here: $C'$ is [[fig:a03-ghc-new-edge#Z|$\set{z}$]], whose cut has capacity 6, and $f(z, a)$ stays 6.
:::

::: step
So we may contract the components one after the other, and each contraction keeps $f(a, b)$. After the last one we have $H$, so $f_H(a, b) = f_G(a, b)$. Here: contracting the single vertex $z$ changes nothing, and $f_H(a, b) = 9$; the thick edges are the cut $\delta_H(A)$ of part 1.
:::

::: step
The cut $\delta_G(A)$ separates $a$ and $b$, and by part 1 and the last step its capacity is $c(\delta_H(A)) = f_H(a, b) = f_G(a, b)$. No $a$–$b$ cut of $G$ is cheaper, so it is a minimum $a$–$b$ cut, and the new tree edge gets the capacity $w(S_aS_b) = f_G(a, b)$. Here: 9.
:::

::: step
The cut of $S_aS_b$ is $\delta(A)$: removing this edge leaves $S_a$ with its reattached components, those inside $A$ ([[alg:gomory-hu|the reconnection rule]]). Each vertex lies in $S$ or in a component, and $S_a$ is the part of $S$ in $A$, so these vertices form $A$. So $a$, $b$ are valid representatives. Here: [[fig:a03-ghc-new-edge#A|$A$]] is $\set{a, x, y, z}$.
:::
::::

Part 3, the edges not incident to $S$: nothing changes for them.

:::: walkthrough {for=lem:gomory-hu-invariant}
```graph id=a03-ghc-far-edge widget=stepper
caption: The network of the first figure. Filled vertices show the node $S$ and then the parts $S_a$ and $S_b$, each in its own shade; ringed vertices are the representatives of the tree edge between $\set{y}$ and $\set{x}$; thick edges form its cut.
intent: New; the network and round of a03-ghc-round, for the edges of T away from S (algorithms/03 p20).
layout: fixed
y @(0, 0.6); x @(1, 0.6); a @(2, 0.6); z @(3, 0); s @(1, -0.6); b @(2, -0.6)
y -- x [c=6]; y -- s [c=1]; x -- a [c=3]; x -- s [c=1]; a -- b [c=2]; a -- s [c=3]; b -- s [c=6]; a -- z [c=4]; b -- z [c=2]
class color1: a b s
step: An edge of $T$ that is not incident to $S$.
class path: y x
class bold: y--x y--s
mark Y: y
step: After the split, its two sides are the same.
unclass color1: a b s
class color3: a
class color4: b s
unclass path: y x
step: Same capacity, same $G$: keep $y$ and $x$.
class path: y x
```

::: step
Take an edge of $T$ that is not incident to $S$. Removing it splits $T$ into two components, and $S$, a node other than its two ends, lies in one of them. Here: the edge between $\set{y}$ and $\set{x}$, with representatives $y$ and $x$, capacity 7 and the cut of [[fig:a03-ghc-far-edge#Y|$\set{y}$]]; $S$ lies on the side of $x$.
:::

::: step
The round replaces $S$ by $S_a$, $S_b$ and their edge, and reattaches each neighbour of $S$. A neighbour is joined to $S$ by an edge other than this one, so it lies on the side of $S$. So the two sides keep their vertex sets. Here: $S_a$, $S_b$ and the reattached $\set{x}$ lie on the side of $x$.
:::

::: step
The capacity of the edge does not change either ([[algorithms/gomory-hu/construction|the construction]] changes no other capacity), and neither does $G$. So the old representatives still satisfy the invariant, and we keep them. Here: the cut is still the cut of $\set{y}$, and $7 = f_G(y, x)$.
:::
::::

Part 4, an edge $XS$ that becomes $XS_a$: its cut stays, and in the first case its representatives stay too.

:::: walkthrough {for=lem:gomory-hu-invariant}
```graph id=a03-ghc-reattach widget=stepper
caption: The network of the first figure after the split. Filled vertices show $S_a$, $S_b$ and the component $U_C$ under discussion, each in its own shade; ringed vertices are the old representatives; thick edges form the cut.
intent: New; the network and round of a03-ghc-round, for the reattached edges and the case s in S_a (algorithms/03 p20).
layout: fixed
y @(0, 0.6); x @(1, 0.6); a @(2, 0.6); z @(3, 0); s @(1, -0.6); b @(2, -0.6)
y -- x [c=6]; y -- s [c=1]; x -- a [c=3]; x -- s [c=1]; a -- b [c=2]; a -- s [c=3]; b -- s [c=6]; a -- z [c=4]; b -- z [c=2]
class color3: a
class color4: b s
mark Sa: a
mark Sb: b s
step: The edge $XS$ becomes $XS_a$; one side is still $U_C$.
class color2: x y
class bold: y--s x--a x--s
mark UC: x y
mark A: a x y z
step: The old representatives $x$ and $s$.
class path: x s
step: Case $s \in S_a$: keep $x$ and $s$.
unclass path: x s
unclass color2: x y
unclass bold: y--s x--a x--s
class color2: z
class path: z a
class bold: a--z b--z
mark Z: z
```

::: step
Take an edge $XS$ that becomes $XS_a$; the case $XS_b$ is symmetric. Let $C$ be the component of $T - S$ that contains $X$. Removing $XS_a$ still cuts off exactly $C$, so one side of its cut is still $U_C$. By [[alg:gomory-hu|the reconnection rule]], $U_C$ lies in $A$. Here: [[fig:a03-ghc-reattach#UC|$U_C$]] is $\set{x, y}$, inside [[fig:a03-ghc-reattach#A|$A$]].
:::

::: step
Let $x$ in $X$ and $s$ in $S$ be the old representatives, so $w(XS) = f_G(x, s)$ and $\delta(U_C)$ is a minimum $x$–$s$ cut. The round changes neither $G$, nor this cut, nor the capacity of the edge, so these facts still hold. Here: the ringed $x$ and $s$, capacity 5.
:::

::: step
If $s$ lies in [[fig:a03-ghc-reattach#Sa|$S_a$]], we keep $x$ and $s$: they are at the two ends of $XS_a$, the capacity is still $f_G(x, s)$, and the cut is still a minimum $x$–$s$ cut. Here: for the edge of $\set{x}$, $s$ lies in [[fig:a03-ghc-reattach#Sb|$S_b$]]; the case applies to the edge of [[fig:a03-ghc-reattach#Z|$\set{z}$]], with $z$ as $x$ and $a$ as $s$.
:::
::::

Part 5, the case $s \in S_b$: the new representatives are $x$ and $a$, and the triangle inequality shows that $f$ does not change.

:::: walkthrough {for=lem:gomory-hu-invariant}
```graph id=a03-ghc-swap widget=stepper
caption: The network of the first figure after the split. Filled vertices show $S_a$, $S_b$ and the component $U_C$, each in its own shade; ringed vertices are $x$ and $a$ and later $v_B$; thick edges form the cut under discussion.
intent: New; the network and round of a03-ghc-round, for the case s in S_b (algorithms/03 p21). The identification of B is animated as a merge.
layout: fixed
y @(0, 0.6); x @(1, 0.6); a @(2, 0.6); z @(3, 0); s @(1, -0.6); b @(2, -0.6)
y -- x [c=6]; y -- s [id=ys c=1]; x -- a [id=xa c=3]; x -- s [id=xs c=1]; a -- b [id=ab c=2]; a -- s [id=as c=3]; b -- s [c=6]; a -- z [c=4]; b -- z [id=bz c=2]
class color2: x y
class color3: a
class color4: b s
mark Sb: b s
mark UC: x y
step: Case $s \in S_b$: choose $x$ and $a$.
class path: x a
step: First, $f_G(x, a) \le f_G(x, s)$.
class bold: @ys @xa @xs
step: The side $B$ of $b$ in the cut $\delta(A)$.
unclass bold: @xa
class bold: @ab @as @bz
mark B: b s
step: Identify $B$ into $v_B$: the graph $G_B$.
merge b s -> vB [label="$v_B$" class=color4]
remove @ab @as
a -- vB [id=avB c=5 class=bold]
mark vB: vB
step: The triangle inequality in $G_B$.
unclass bold: @avB @bz @ys @xs
class path: vB
step: $f_{G_B}(x, v_B) \ge f_G(x, s)$.
class bold: @ys @xs @xa
step: $f_{G_B}(v_B, a) \ge f_G(b, a)$.
unclass bold: @xa
class bold: @avB @bz
step: $f_G(b, a) \ge f_G(x, s)$.
remove vB
s @(1, -0.6); b @(2, -0.6)
y -- s [id=ys2 c=1 class=bold]; x -- s [id=xs2 c=1 class=bold]; a -- b [id=ab2 c=2 class=bold]; a -- s [id=as2 c=3 class=bold]; b -- s [c=6]; b -- z [id=bz2 c=2 class=bold]
class color4: b s
mark A: a x y z
step: Together, $f_G(x, a) = f_G(x, s)$.
unclass bold: @ab2 @as2 @bz2
class bold: @xa
```

::: step
Now let $s$ lie in [[fig:a03-ghc-swap#Sb|$S_b$]]. We choose $x$ and $a$, the ends of $XS_a$, as the new representatives. The cut $\delta(U_C)$ separates $x$ from $a$, because $a$ lies in $S$, outside $U_C$, and its capacity is $f_G(x, s)$. So it suffices to show $f_G(x, a) = f_G(x, s)$. Here: $s$ lies in $S_b$, and $f_G(x, s) = 5$.
:::

::: step
The cut $\delta(U_C)$ is an $x$–$a$ cut, and $f_G(x, a)$ is the smallest capacity of an $x$–$a$ cut. So $f_G(x, a) \le c(\delta(U_C)) = f_G(x, s)$. Here: the thick edges are the cut of [[fig:a03-ghc-swap#UC|$U_C$]], and $f_G(x, a) \le 5$.
:::

::: step
For the opposite inequality, let $B$ be the side of $b$ of the minimum $a$–$b$ cut $\delta(A)$. Then $s$ lies in $B$, because $S_b$ is the part of $S$ in $B$, and $x$ lies in $A$, because $U_C$ does (part 4). Here: [[fig:a03-ghc-swap#B|$B$]] is $\set{b, s}$, and the thick edges are $\delta(A)$.
:::

::: step
Identifying $B$ into one vertex [[fig:a03-ghc-swap#vB|$v_B$]] gives $G_B$. The cut $\delta(B)$ is the minimum $a$–$b$ cut $\delta(A)$, and neither $x$ nor $a$ lies in $B$. So [[cor:gomory-hu-contraction]] gives $f_G(x, a) = f_{G_B}(x, a)$. Here: both values are 5; the parallel edges from $a$ to $v_B$ are drawn as one, of capacity $2 + 3$ ([[algorithms/gomory-hu/node-identification|parallel edges add up]]).
:::

::: step
$G_B$ is again an undirected network: identification keeps it connected, and parallel edges are allowed. So [[lem:flow-triangle|the triangle inequality]] holds in $G_B$ for the three distinct vertices $x$, $v_B$ and $a$:
$$f_{G_B}(x, a) \ge \min(f_{G_B}(x, v_B), f_{G_B}(v_B, a)).$$
Here: $5 \ge \min(5, 9)$.
:::

::: step
Next, $f_{G_B}(x, v_B) \ge f_G(x, s)$. By [[obs:identification-cuts]], every $x$–$v_B$ cut of $G_B$ is a cut of $G$ with the same capacity, and it separates $x$ from all of $B$, so in particular from $s$. So its capacity is at least $f_G(x, s)$. Here: the cheapest one (thick) costs $1 + 1 + 3 = 5$.
:::

::: step
In the same way, $f_{G_B}(v_B, a) \ge f_G(b, a)$: every $v_B$–$a$ cut of $G_B$ is a cut of $G$ with the same capacity that separates $b$, which lies in $B$, from $a$. Here: the cheapest one (thick) is the cut of $v_B$ with capacity 9, and $f_G(b, a)$ is 9 as well.
:::

::: step
Also $f_G(b, a) \ge f_G(x, s)$. The cut $\delta(A)$ has capacity $f_G(b, a)$, as it is a minimum $a$–$b$ cut. It also separates $x$, which lies in $A$, from $s$, which lies in $B$, so its capacity is at least $f_G(x, s)$. Here: $9 \ge 5$, and the thick edges are $\delta(A)$ in $G$ again.
:::

::: step
Both terms of the minimum are at least $f_G(x, s)$ (the last three steps), so $f_G(x, a) = f_{G_B}(x, a) \ge f_G(x, s)$. With the first inequality, $f_G(x, a) = f_G(x, s)$, and $x$, $a$ are valid representatives. Every edge of the new tree is now treated, so the invariant holds after the round. Here: both values are 5.
:::
::::

:::: proof
At the beginning $T$ has a single node and no edges, so the invariant holds. Assume it holds before a round that splits the node $S$ with the vertices
$a, b \in S$ into $S_a \ni a$ and $S_b \ni b$. Let $H$ be the contracted graph and $\delta_H(A)$ the minimum $a$–$b$ cut found, and read $A$, $B$ as
vertex sets of $G$. By [[obs:identification-cuts]], $\delta_G(A)$ has the same capacity as $\delta_H(A)$.

**The new edge $S_aS_b$, with representatives $a$ and $b$.** Let $C$ be a component of $T - S$, $U_C$ the union of its node sets, and $XS$ the edge of
$T$ joining $C$ to $S$. The cut defined by $XS$ is $\delta(U_C)$, and by the invariant it is a minimum $x$–$s$ cut for some $x \in X$, $s \in S$.
Since $a, b \in S \subseteq V \setminus U_C$, [[cor:gomory-hu-contraction]] says that contracting $U_C$ does not change $f(a, b)$. The other
components remain sides of minimum cuts after this contraction (their cuts are unchanged, and by the same corollary the values $f(x', s')$ of
their representatives do not change), so we may contract them one after the other. Hence $f_H(a, b) = f_G(a, b)$, and
$\delta_G(A)$ is a minimum $a$–$b$ cut of $G$ of capacity $w(S_aS_b) = f_G(a, b)$. The cut defined by the new edge $S_aS_b$ is $\delta(A)$:
the component of $S_a$ consists of $S_a$ and the components attached to it, whose vertices form exactly $A$.

**Edges not incident to $S$.** The split happens on one side of such an edge, so the vertex sets of its two sides do not change, nor does its
capacity. Keep the old representatives.

**An edge $XS$ that becomes $XS_a$** (the case $XS_b$ is symmetric). The sides of the cut defined by the edge do not change: one side is still $U_C$
for the component $C$ of $T - S$ containing $X$, and $U_C \subseteq A$ by the reconnection rule. Let $x \in X$, $s \in S$ be the old representatives,
so $w(XS) = f_G(x, s)$ and $\delta(U_C)$ is a minimum $x$–$s$ cut.

- If $s \in S_a$, keep $x$ and $s$.
- If $s \in S_b$, choose $x$ and $a$ as the new representatives. Since $\delta(U_C)$ separates $x$ from $a \in S$ and has capacity $f_G(x, s)$, it
  suffices to show $f_G(x, a) = f_G(x, s)$. First, $f_G(x, a) \le c(\delta(U_C)) = f_G(x, s)$. For the opposite inequality, let $B$ be the side of
  $b$ of the minimum $a$–$b$ cut $\delta(A)$; then $s \in S_b \subseteq B$ and $x \in U_C \subseteq A$. Identify $B$ into a vertex $v_B$, obtaining
  $G_B$. Then
  - $f_G(x, a) = f_{G_B}(x, a)$ by [[cor:gomory-hu-contraction]], as $x, a \notin B$;
  - $f_{G_B}(x, a) \ge \min(f_{G_B}(x, v_B), f_{G_B}(v_B, a))$ by [[lem:flow-triangle]];
  - $f_{G_B}(x, v_B) \ge f_G(x, s)$: by [[obs:identification-cuts]], an $x$–$v_B$ cut of $G_B$ is a cut of $G$ separating $x$ from all of $B \ni s$;
  - $f_{G_B}(v_B, a) \ge f_G(b, a)$ in the same way, as $b \in B$; and $f_G(b, a) = c(\delta(A)) \ge f_G(x, s)$, because $\delta(A)$ also separates
    $x \in A$ from $s \in B$.

  Together $f_G(x, a) \ge \min(f_G(x, s), f_G(x, s)) = f_G(x, s)$.

So the invariant holds after the round.
::::

::: intuition
Each tree edge "remembers" a pair of vertices, one on each side, for which it records the exact minimum cut. Splitting a node may move a
representative to the wrong part; the proof shows that the new splitting vertex $a$ can then take its place, because the old cut is still cheapest
for it. Example: in round 2 of [[ex:gomory-hu-lecture]], the edge $\set{a, b}\,\set{c, d, e, f}$ (representatives $b$, $f$) becomes the edge
$b\,\set{c, d, e, f}$, and $b$ stays a representative. In round 5, the edge $\set{c, e}\,d$ (representatives $e$, $d$) becomes $e\,d$.
:::

::: theorem {#thm:gomory-hu title="Correctness of the construction" source="algorithms/03 p22"}
The tree $T$ produced by [[alg:gomory-hu]] (with each final node $\set{v}$ identified with the vertex $v$) is a
[[def:gomory-hu-tree|Gomory–Hu tree]] for $G$. In particular, every undirected network has a Gomory–Hu tree, and it can be computed with $n - 1$
minimum $s$–$t$ cut (maximum flow) computations.
:::

The proof first shows that the construction ends with a tree on $V$ whose edges satisfy the invariant, and then derives the two properties of a Gomory–Hu tree from it: flow equivalence with the transitive triangle inequality, and the cut property from flow equivalence.

Part 1, the final tree: a tree on $V$ in which every edge is a minimum cut for its two ends.

:::: walkthrough {for=thm:gomory-hu}
```graph id=a03-ghc-final-tree widget=stepper
caption: The tree $T$ that the construction builds for the lecture network; the numbers are the capacities $w$. Filled vertices show a node and later a side of a cut; thick edges are new or under discussion; ringed vertices are the two ends of an edge.
intent: From the lecture: the tree of the lecture example (algorithms/03 p9–13, drawn as in fig:a03-network, slightly compressed); the steps follow the proof on p22.
layout: fixed
a @(0, 0); b @(0.95, 0); f @(1.9, 0); e @(2.85, 0); c @(3.8, 0); d @(2.85, 0.9)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
step: A round replaces a node by two nodes and an edge.
class color1: c e
class highlight: c--e
mark ce: c e
step: After $n - 1$ rounds, $T$ is a tree on $V$.
unclass color1: c e
unclass highlight: c--e
class tree: a--b b--f f--e e--c e--d
step: Every edge $uv$ has $w(uv) = f_G(u, v)$.
unclass tree: a--b b--f f--e e--c e--d
class bold: f--e
class path: f e
class color6: a b f
mark U: a b f
```

::: step
Each round replaces a node by two nodes and a new edge between them, and attaches each other neighbour to one of the two. So nodes and edges both grow by one: $T$ stays connected with one edge fewer than nodes, hence a tree. Here: round 5 replaces [[fig:a03-ghc-final-tree#ce|$\set{c, e}$]] by $c$ and $e$ and attaches $f$, $d$ to $e$.
:::

::: step
While there are fewer than $n$ nodes, some node has two vertices, as the nodes partition $V$; so a round can be performed, and it adds one node. After $n - 1$ rounds there are $n$ nodes, all single vertices, and $T$ is a tree on $V$. Here: 6 vertices, 5 rounds, 5 edges.
:::

::: step
Every node is now a single vertex, so in [[lem:gomory-hu-invariant]] the representatives of an edge $uv$ are $u$ and $v$. Thus $w(uv) = f_G(u, v)$, and the cut defined by $uv$ is a minimum $u$–$v$ cut of $G$. Here: $w(fe) = 13 = f_G(f, e)$; the cut of $fe$ is the cut of [[fig:a03-ghc-final-tree#U|$\set{a, b, f}$]] in $G$.
:::
::::

Part 2, flow equivalence, first half: $f_T(s, t)$ is the smallest capacity on the tree path, and the transitive triangle inequality bounds it by $f_G(s, t)$.

:::: walkthrough {for=thm:gomory-hu}
```graph id=a03-ghc-ft widget=stepper
caption: The tree $T$ of the lecture network with $s = a$ and $t = d$ (ringed). The dashed thick edges form the $s$–$t$ path; plain thick edges form a cut of $T$, whose side is filled.
intent: From the lecture: the tree of the lecture example (algorithms/03 p9–13) with the path a, b, f, e, d; the steps follow p22 (flow equivalence, first inequality).
layout: fixed
a @(0, 0); b @(0.95, 0); f @(1.9, 0); e @(2.85, 0); c @(3.8, 0); d @(2.85, 0.9)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
mark s: a
mark t: d
step: The $s$–$t$ path in $T$.
class path: a d a--b b--f f--e e--d
mark P: a--b b--f f--e e--d
step: Cutting a lightest path edge separates $s$ and $t$.
class bold: f--e
class color6: a b f
step: Every $s$–$t$ cut of $T$ contains a path edge.
unclass bold: f--e
unclass color6: a b f
class bold: a--b
class color6: a
step: Each path capacity is a value of $f_G$.
unclass bold: a--b
unclass color6: a
class path: b f e
step: The transitive triangle inequality: $f_G(s, t) \ge f_T(s, t)$.
unclass path: b f e
class highlight: a d
```

::: step
Let $s$ and $t$ be two different vertices, and let $s = v_0, v_1, \dots, v_k = t$ be the path between them in $T$; it is unique because $T$ is a tree ([[cor:tree-unique-path]]). Here: [[fig:a03-ghc-ft#s|$s$]] is $a$, [[fig:a03-ghc-ft#t|$t$]] is $d$, and [[fig:a03-ghc-ft#P|the path]] is $a, b, f, e, d$ with capacities 18, 17, 13 and 14.
:::

::: step
We follow the argument of [[prop:gomory-hu-path]], which uses only that $T$ is a tree. Removing a lightest path edge breaks the only $s$–$t$ path, so $s$ and $t$ lie in different components. Only this edge joins them, so it alone is an $s$–$t$ cut of $T$: $f_T(s, t)$ is at most its capacity. Here: the edge $fe$, capacity 13.
:::

::: step
Conversely, every $s$–$t$ cut of $T$ contains a path edge, as the path starts on the side of $s$ and ends on the other. Capacities are not negative, so every such cut costs at least the smallest path capacity: $f_T(s, t) = \min_i w(v_{i-1}v_i)$. Here: the cut of $\set{a}$ is the edge $ab$, cost 18; $f_T(a, d) = 13$.
:::

::: step
By part 1, every tree edge $uv$ has $w(uv) = f_G(u, v)$. Applied to the path edges, this gives $f_T(s, t) = \min_i f_G(v_{i-1}, v_i)$. Here: 18, 17, 13 and 14 are the values $f_G(a, b)$, $f_G(b, f)$, $f_G(f, e)$ and $f_G(e, d)$.
:::

::: step
The path vertices meet the hypotheses of [[lem:flow-triangle-path|the transitive triangle inequality]]: the two ends differ, and so do consecutive vertices. It gives $f_G(s, t) \ge \min_i f_G(v_{i-1}, v_i)$, which is $f_T(s, t)$ by the last step. Here: $f_G(a, d)$ and $f_T(a, d)$ are both 13.
:::
::::

Part 3, flow equivalence, second half: each path edge defines an $s$–$t$ cut of $G$.

:::: walkthrough {for=thm:gomory-hu}
```graph id=a03-ghc-fg widget=stepper
caption: The tree $T$ of the lecture network with $s = a$ and $t = d$. The dashed thick edges form the $s$–$t$ path; plain thick edges define cuts of $G$, and the filled vertices form one side.
intent: From the lecture: the tree of the lecture example (algorithms/03 p9–13); the steps follow p22 (flow equivalence, second inequality).
layout: fixed
a @(0, 0); b @(0.95, 0); f @(1.9, 0); e @(2.85, 0); c @(3.8, 0); d @(2.85, 0.9)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
class path: a--b b--f f--e e--d
mark s: a
mark t: d
step: The cut defined by a path edge.
class bold: b--f
class color6: a b
mark U: a b
step: It separates $s$ and $t$.
class path: a d
step: So $f_G(s, t) \le f_T(s, t)$.
unclass color6: a b
class bold: a--b f--e e--d
```

::: step
Conversely, take any path edge $v_{i-1}v_i$. By part 1, the cut it defines is a minimum $v_{i-1}$–$v_i$ cut of $G$ with capacity $w(v_{i-1}v_i)$. Here: for the edge $bf$ the cut is the cut of [[fig:a03-ghc-fg#U|$\set{a, b}$]] in $G$, with capacity $8 + 4 + 3 + 2 = 17$.
:::

::: step
This cut separates $s$ and $t$. The path uses the edge once, so its part from $s$ to $v_{i-1}$ avoids the edge, and $s$ lies in the component of $v_{i-1}$ when the edge is removed. In the same way $t$ lies in the component of $v_i$. Here: [[fig:a03-ghc-fg#s|$s$]] lies in $\set{a, b}$ and [[fig:a03-ghc-fg#t|$t$]] does not.
:::

::: step
A minimum $s$–$t$ cut costs at most any $s$–$t$ cut, so $f_G(s, t) \le w(v_{i-1}v_i)$ for every $i$. Taking the smallest, $f_G(s, t) \le f_T(s, t)$, and with part 2 the two are equal. Here: $f_G(a, d)$ is 13, at most each of 18, 17, 13 and 14 (the four thick edges define the four cuts).
:::
::::

Part 4, the cut property: a minimum cut of $T$ is a single lightest path edge, and the cut it defines in $G$ has the right capacity.

:::: walkthrough {for=thm:gomory-hu}
```graph id=a03-ghc-cut widget=stepper
caption: The tree $T$ of the lecture network with $s = a$ and $t = d$ (ringed). The dashed thick edges form the $s$–$t$ path; the filled vertices form the side $U$ of a minimum $s$–$t$ cut of $T$; plain thick edges are in that cut.
intent: From the lecture: the tree of the lecture example (algorithms/03 p9–13); the steps follow the cut property of thm:gomory-hu, which the lecture (p22) covers with "by the invariant".
layout: fixed
a @(0, 0); b @(0.95, 0); f @(1.9, 0); e @(2.85, 0); c @(3.8, 0); d @(2.85, 0.9)
a -- b [w=18]; b -- f [w=17]; f -- e [w=13]; e -- c [w=15]; e -- d [w=14]
class path: a d a--b b--f f--e e--d
mark s: a
mark t: d
step: A minimum $s$–$t$ cut $\delta_T(U)$ contains a path edge.
class color6: a b f
mark U: a b f
step: Its capacity is $f_T(s, t)$.
class bold: f--e
step: Positive capacities: the cut is one edge $e$.
unclass path: a--b b--f e--d
mark e: f--e
step: $U$ is a component of $T - e$.
unclass bold: f--e
unclass path: f--e
class muted: f--e
step: $\delta_G(U)$ is a minimum $s$–$t$ cut of $G$.
unclass muted: f--e
class bold: f--e
```

::: step
Let $\delta_T(U)$ be a minimum $s$–$t$ cut of $T$. A cut does not depend on the side we name, so we may assume that $s$ lies in $U$. The path from $s$ to $t$ starts in $U$ and ends outside, so one of its edges leaves $U$: the cut contains a path edge. Here: [[fig:a03-ghc-cut#U|$U$]] is $\set{a, b, f}$.
:::

::: step
The capacity of $\delta_T(U)$ is $f_T(s, t)$, because it is a minimum $s$–$t$ cut of $T$. By part 2, this is the smallest capacity on the path. Here: 13, the capacity of the thick edge.
:::

::: step
All capacities of $T$ are positive: $w(uv) = f_G(u, v)$, and as $G$ is connected, each $u$–$v$ cut of $G$ contains an edge, of positive capacity ([[def:undirected-cut]]). The path edge in the cut costs at least the minimum, and any further edge would add more. So the cut is one path edge $e$ of minimum capacity. Here: [[fig:a03-ghc-cut#e|$e$]] is $fe$.
:::

::: step
Removing $e$ from $T$ leaves exactly two components, as $T$ is a tree. No other edge leaves $U$, so $U$ is a union of these components. It contains $s$ but not $t$, so $U$ is the component of $s$. Here: the components are $\set{a, b, f}$ and $\set{c, d, e}$; the faded edge is $e$.
:::

::: step
So $\delta_G(U)$ is the cut defined by $e$. It separates $s$ and $t$, and by part 1 its capacity is $w(e)$, that is, $f_T(s, t) = f_G(s, t)$ by flow equivalence. So it is minimum. Here: the cut of $\set{a, b, f}$ in $G$ costs $4 + 2 + 2 + 3 + 2 = 13 = f_G(a, d)$.
:::
::::

:::: proof
Each round replaces one node by two and one tree edge between them, and reattaches the other neighbours, so $T$ stays a tree and the number of nodes
grows by one. Every round can be performed while some node has at least two vertices, so after $n - 1$ rounds all nodes are single vertices and
$T$ is a tree on $V$. By [[lem:gomory-hu-invariant]] with singleton nodes, every edge $uv$ of $T$ has $w(uv) = f_G(u, v)$, and the cut defined by
$uv$ is a minimum $u$–$v$ cut of $G$.

**Flow equivalence.** Let $s = v_0, v_1, \dots, v_k = t$ be the $s$–$t$ path in $T$. By [[prop:gomory-hu-path]]'s argument (which uses only that
$T$ is a tree), $f_T(s, t) = \min_i w(v_{i-1}v_i) = \min_i f_G(v_{i-1}, v_i)$, which is at most $f_G(s, t)$ by [[lem:flow-triangle-path]].
Conversely, the cut defined by each path edge $v_{i-1}v_i$ separates $s$ and $t$ (the path crosses this edge once), so
$f_G(s, t) \le \min_i w(v_{i-1}v_i) = f_T(s, t)$.

**Cut property.** Let $\delta_T(U)$ be a minimum $s$–$t$ cut of $T$. It contains an edge of the path, and its capacity is $f_T(s, t)$, the minimum
capacity on the path. All capacities are positive ($G$ is connected), so $\delta_T(U)$ consists of a single path edge $e$ of minimum capacity, and $U$ is a
component of $T - e$. So $\delta_G(U)$ is the cut defined by $e$; it separates $s$ and $t$, and its capacity is $w(e) = f_T(s, t) = f_G(s, t)$.
Hence it is a minimum $s$–$t$ cut of $G$.
::::

<!-- REVIEW: the lecture proves the cut property first ("by the invariant") and flow equivalence second; here the cut property uses flow equivalence (the capacity of the cut equals f_T(s, t) = f_G(s, t)) and positivity of the tree weights, so the order is swapped. -->

::: intuition
The invariant says every tree edge is a correct minimum cut for its own two ends; the triangle inequality then spreads this to all pairs along the
tree paths. Example: the tree of [[fig:a03-network]] was built by [[ex:gomory-hu-lecture]], and all $15$ pairs can be checked against
[[prop:gomory-hu-path]]. With Dinic's algorithm the construction takes $\O((n - 1) \cdot n^2 m)$ time, instead of $\O(n^2 \cdot n^2 m)$ for all pairs separately.
:::

::: remark
**In practice** the algorithm works well, with some problems once the graph has more than a few thousand nodes. The overhead is the alternating
contraction and expansion; an optimisation is not to expand a set until it is split. **Gusfield (1990)** gave a version without any vertex
contraction, which saves this overhead and has the same running time; experimental evaluations are available. (Gusfield's trees are equivalent
flow trees; a modification also gives the cut property.)
:::
