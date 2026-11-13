---
title: "The Gomory–Hu lemma"
course: algorithms
chapter: gomory-hu
order: 6
lectures: [a03]
stage: split
status: reviewed
---

::: lemma {#lem:gomory-hu title="Gomory–Hu lemma" aka="G-H lemma" source="algorithms/03 p14–17"}
Let $\delta(S)$ be a minimum $s$–$t$ cut for some vertices $s, t \in V$ with $s \in S$, and let $v, w \in S$, $v \ne w$. Then there is a minimum
$v$–$w$ cut $\delta(W)$ with $W \subseteq S$.
:::

```graph id=a03-gh-lemma widget=figure
caption: The Gomory–Hu lemma: $\delta(S)$ is a minimum $s$–$t$ cut and $v, w \in S$. Some minimum $v$–$w$ cut $\delta(W)$ has $W$ inside $S$.
intent: Transcription of the hand-drawn statement illustration (slide p15), as nested groups without edges.
layout: fixed
t @(1.2, 1.6); v @(0, 0); s @(0.8, 0); w @(2.2, 0.35)
group S: v s w [label="$S$"]
group W: v s [label="$W$" class=highlight]
```

The proof is an exchange argument: we take any minimum $v$–$w$ cut, uncross it with the cut $\delta(S)$, and show that one of the two pieces inside $S$ is no more expensive.

Part 1 of the proof, the setup: we fix the cut $\delta(X)$ and bring it into a convenient form.

:::: walkthrough {for=lem:gomory-hu}
```graph id=a03-gh-setup widget=stepper
caption: A network with $S = \set{s, v, w}$: the dashed edges are $\delta(S)$, the numbers are capacities, and the thick edges are the cut under discussion.
intent: New (the lecture draws only the abstract nested sets on p15 and has no numbers); one small network on 6 vertices, reused by the three walkthroughs of this proof. The proof text is algorithms/03 p16.
layout: fixed
w @(0, 0.55); s @(1.1, 0.55); v @(2.2, 0.55); r @(1.1, -0.55); q @(2.2, -0.55); p @(3.3, -0.55)
w -- s [c=3]; s -- v [c=4]; w -- r [c=2]; s -- q [c=1]; v -- q [c=1]; r -- q [c=2]; q -- p [c=2]
class cut: v--q s--q w--r
mark X0: w r
mark X: s v p q
mark cutX: w--s r--q
mark pt_s: s
mark pt_v: v
mark pt_w: w
mark inter: s v
mark diff: w
step: Take a minimum $v$–$w$ cut $\delta(X)$.
class color3: w r
class bold: w--s r--q
step: Replace $X$ by its complement so that $s \in X$.
unclass color3: w r
class color3: s v p q
class path: s
step: Now $v \in X$ and $w \notin X$.
class cycle: v
class rejected: w
step: $S \cap X$ gives a $v$–$w$ cut inside $S$.
unclass color3: s v
class color1: s v
unclass bold: w--s r--q
class bold: w--s v--q s--q
step: $S \setminus X$ gives a $v$–$w$ cut inside $S$.
class color2: w
unclass bold: v--q s--q
class bold: w--r
step: One of the two must cost at most $c(\delta(X))$.
unclass bold: w--r
class bold: r--q
```

::: step
We take any minimum $v$–$w$ cut $\delta(X)$. One exists: $v \ne w$, so some cut separates them, and there are only finitely many cuts. We uncross it with $\delta(S)$, whatever it is. Here: [[fig:a03-gh-setup#X0|$X$]] is the pair of filled vertices $w$ and $r$; its cut (thick edges) has capacity 5.
:::

::: step
We may assume that $s$ lies in $X$. A cut does not depend on the side we name ([[def:undirected-cut|definition of a cut]]), so the complement of $X$ has the same cut and still separates $v$ and $w$. If $s$ is not in $X$, we replace $X$ by its complement. Here: [[fig:a03-gh-setup#X|$X$]] becomes the four filled vertices $s$, $v$, $p$, $q$.
:::

::: step
We may assume that $v$ lies in $X$ and $w$ does not. The cut separates $v$ and $w$, so exactly one of them lies in $X$. The hypotheses on $v$ and $w$ are symmetric, so if $w$ is the one in $X$, we swap the names. Here: [[fig:a03-gh-setup#pt_v|$v$]] is in $X$ and [[fig:a03-gh-setup#pt_w|$w$]] is not: no swap.
:::

::: step
The set $S \cap X$ gives a $v$–$w$ cut inside $S$. The vertex $v$ lies in $S$ (hypothesis) and in $X$, so it lies in the intersection. The vertex $w$ is not in $X$, so it is not. Here: [[fig:a03-gh-setup#inter|$S \cap X$]] is $s$ and $v$; its cut (thick edges) has capacity 5.
:::

::: step
The set $S \setminus X$ gives a $v$–$w$ cut inside $S$. The vertex $w$ lies in $S$ (hypothesis) and not in $X$, so it lies in the difference. The vertex $v$ is in $X$, so it is not. Here: [[fig:a03-gh-setup#diff|$S \setminus X$]] is the single vertex $w$; its cut has capacity 5.
:::

::: step
Both new cuts are $v$–$w$ cuts and $\delta(X)$ is a minimum one, so each costs at least as much as $\delta(X)$. So it suffices that one of them costs at most $c(\delta(X))$: it is then minimum. Which one depends on whether $t$ lies in $X$. Here: [[fig:a03-gh-setup#cutX|the cut of $X$]] and both candidates cost 5.
:::
::::

Part 2, the case $t \notin X$: the cut of $X \cup S$ is an $s$–$t$ cut, and the first inequality of uncrossing finishes the argument.

:::: walkthrough {for=lem:gomory-hu}
```graph id=a03-gh-case1 widget=stepper
caption: Case with $t$ outside $X$, on the network of the setup figure with the vertex $r$ renamed $t$; the dashed edges are $\delta(S)$, the numbers are capacities.
intent: New (the lecture has no concrete example); the network of a03-gh-setup, with t placed outside X. The argument is algorithms/03 p16 and p17, case 1.
layout: fixed
w @(0, 0.55); s @(1.1, 0.55); v @(2.2, 0.55); t @(1.1, -0.55); q @(2.2, -0.55); p @(3.3, -0.55)
w -- s [c=3]; s -- v [c=4]; w -- t [c=2]; s -- q [c=1]; v -- q [c=1]; t -- q [c=2]; q -- p [c=2]
class cut: v--q s--q w--t
mark union: s v w p q
mark pt_s: s
mark pt_t: t
mark cutU: w--t t--q
mark inter: s v
mark cutI: w--s v--q s--q
mark cutX: w--s t--q
step: $X \cup S$ contains $s$ but not $t$.
class color4: s v w p q
class path: s
class rejected: t
step: So $\delta(X \cup S)$ is an $s$–$t$ cut and costs at least $c(\delta(S))$.
class bold: w--t t--q
step: Apply the first uncrossing inequality to $X$ and $S$.
unclass color4: s v
class color1: s v
class bold: w--s v--q s--q
step: Subtract the cost of the union cut from both sides.
unclass bold: w--t t--q
step: $\delta(S \cap X)$ is a minimum $v$–$w$ cut.
unclass bold: w--s v--q s--q
class highlight: w--s v--q s--q
```

::: step
Case: $t$ is not in $X$. We look at $X \cup S$. It contains [[fig:a03-gh-case1#pt_s|$s$]], because $s$ lies in $S$. It does not contain [[fig:a03-gh-case1#pt_t|$t$]]: $t$ is not in $X$ by the case, and not in $S$, because $\delta(S)$ is an $s$–$t$ cut and $s$ lies in $S$. Here: [[fig:a03-gh-case1#union|$X \cup S$]] is every vertex except $t$.
:::

::: step
So $\delta(X \cup S)$ separates $s$ and $t$: it is an $s$–$t$ cut. By hypothesis $\delta(S)$ is a minimum $s$–$t$ cut, so no $s$–$t$ cut is cheaper: $c(\delta(X \cup S)) \ge c(\delta(S))$. Here: [[fig:a03-gh-case1#cutU|the cut of the union]] costs 4, and so does $\delta(S)$.
:::

::: step
The uncrossing lemma holds for all vertex sets, so we may apply its first inequality ([[lem:cut-submodular|uncrossing cuts]]) to $X$ and $S$:
$$c(\delta(X \cup S)) + c(\delta(S \cap X)) \le c(\delta(S)) + c(\delta(X)).$$
Here: the left side is $4 + 5$, the right side $4 + 5$. The cut of [[fig:a03-gh-case1#inter|$S \cap X$]] is drawn thick.
:::

::: step
We subtract the cost of the union cut from both sides. On the right, $c(\delta(S))$ minus this cost is at most 0, because the union cut costs at least $c(\delta(S))$ (previous inequality). What remains is $c(\delta(S \cap X)) \le c(\delta(X))$. Here: $5 \le 5$.
:::

::: step
The cut of $S \cap X$ is a $v$–$w$ cut (setup), so it costs at least $c(\delta(X))$, since $\delta(X)$ is minimum. With the last inequality it costs exactly that, so it is a minimum $v$–$w$ cut $\delta(W)$ with $W = S \cap X \subseteq S$. Here: $W = \set{s, v}$, cost 5.
:::
::::

Part 3, the case $t \in X$: now $X \setminus S$ contains $t$ but not $s$, and the second inequality of uncrossing finishes the argument.

:::: walkthrough {for=lem:gomory-hu}
```graph id=a03-gh-case2 widget=stepper
caption: Case with $t$ inside $X$, on the network of the setup figure with the vertex $q$ renamed $t$; the dashed edges are $\delta(S)$, the numbers are capacities.
intent: New (the lecture has no concrete example); the network of a03-gh-setup, with t placed inside X. The argument is algorithms/03 p16 and p17, case 2.
layout: fixed
w @(0, 0.55); s @(1.1, 0.55); v @(2.2, 0.55); r @(1.1, -0.55); t @(2.2, -0.55); p @(3.3, -0.55)
w -- s [c=3]; s -- v [c=4]; w -- r [c=2]; s -- t [c=1]; v -- t [c=1]; r -- t [c=2]; t -- p [c=2]
class cut: v--t s--t w--r
mark pt_s: s
mark pt_t: t
mark diffXS: p t
mark cutD: v--t s--t r--t
mark diffSX: w
mark cutE: w--s w--r
step: $X \setminus S$ contains $t$ but not $s$.
class color3: p t
class rejected: s
class path: t
step: So $\delta(X \setminus S)$ is an $s$–$t$ cut and costs at least $c(\delta(S))$.
class bold: v--t s--t r--t
step: Apply the second uncrossing inequality to $X$ and $S$.
class color2: w
class bold: w--s w--r
step: Subtract the cost of $\delta(X \setminus S)$ from both sides.
unclass bold: v--t s--t r--t
step: $\delta(S \setminus X)$ is a minimum $v$–$w$ cut.
unclass bold: w--s w--r
class highlight: w--s w--r
```

::: step
Case: $t$ lies in $X$. We look at $X \setminus S$. It contains [[fig:a03-gh-case2#pt_t|$t$]]: $t$ is in $X$ by the case, and not in $S$, because $\delta(S)$ is an $s$–$t$ cut and $s$ lies in $S$. It does not contain [[fig:a03-gh-case2#pt_s|$s$]], because $s$ lies in $S$. Here: [[fig:a03-gh-case2#diffXS|$X \setminus S$]] is $p$ and $t$.
:::

::: step
So the cut of $X \setminus S$ separates $s$ and $t$: it is an $s$–$t$ cut (a cut does not depend on the side we name). By hypothesis $\delta(S)$ is a minimum $s$–$t$ cut, so $c(\delta(X \setminus S)) \ge c(\delta(S))$. Here: [[fig:a03-gh-case2#cutD|this cut]] costs 4, and so does $\delta(S)$.
:::

::: step
The uncrossing lemma holds for all vertex sets, so we may apply its second inequality ([[lem:cut-submodular|uncrossing cuts]]) to $X$ and $S$:
$$c(\delta(X \setminus S)) + c(\delta(S \setminus X)) \le c(\delta(S)) + c(\delta(X)).$$
Here: $4 + 5 \le 4 + 5$. The cut of [[fig:a03-gh-case2#diffSX|$S \setminus X$]] is drawn thick.
:::

::: step
We subtract the cost of the cut of $X \setminus S$ from both sides. On the right, $c(\delta(S))$ minus this cost is at most 0, because that cut costs at least $c(\delta(S))$ (previous inequality). What remains is $c(\delta(S \setminus X)) \le c(\delta(X))$. Here: $5 \le 5$.
:::

::: step
The cut of $S \setminus X$ is a $v$–$w$ cut (setup), so it costs at least $c(\delta(X))$, since $\delta(X)$ is minimum. With the last inequality it costs exactly that, so it is a minimum $v$–$w$ cut $\delta(W)$ with $W = S \setminus X \subseteq S$. Here: $W = \set{w}$, cost 5.
:::
::::

<!-- REVIEW: the lecture argues "by contradiction" starting from a minimum v–w cut δ(X) that crosses S; the case analysis below works for every minimum v–w cut, so the proof is written directly. -->
::: proof
Let $\delta(X)$ be any minimum $v$–$w$ cut. Since $\delta(X) = \delta(V \setminus X)$, we may assume $s \in X$ (otherwise replace $X$ by
$V \setminus X$), and by swapping the names $v$ and $w$ we may assume $v \in X$, $w \notin X$. Both $\delta(S \cap X)$ and $\delta(S \setminus X)$
are $v$–$w$ cuts given by subsets of $S$: $v \in S \cap X$, $w \notin S \cap X$, and $w \in S \setminus X$, $v \notin S \setminus X$. We show that one
of them is a minimum $v$–$w$ cut.

**Case $t \notin X$.** The set $X \cup S$ contains $s$ but not $t$, so $\delta(X \cup S)$ is an $s$–$t$ cut and $c(\delta(X \cup S)) \ge c(\delta(S))$.
By [[lem:cut-submodular]],
$$c(\delta(X \cup S)) + c(\delta(S \cap X)) \le c(\delta(S)) + c(\delta(X)),$$
hence $c(\delta(S \cap X)) \le c(\delta(X))$, and $\delta(S \cap X)$ is a minimum $v$–$w$ cut.

**Case $t \in X$.** The set $X \setminus S$ contains $t$ but not $s$, so $\delta(X \setminus S)$ is an $s$–$t$ cut and
$c(\delta(X \setminus S)) \ge c(\delta(S))$. By the second inequality of [[lem:cut-submodular]],
$$c(\delta(X \setminus S)) + c(\delta(S \setminus X)) \le c(\delta(S)) + c(\delta(X)),$$
hence $c(\delta(S \setminus X)) \le c(\delta(X))$, and $\delta(S \setminus X)$ is a minimum $v$–$w$ cut.

In both cases we found a minimum $v$–$w$ cut $\delta(W)$ with $W \subseteq S$.
:::

::: intuition
A cheapest cut between $s$ and $t$ is a "wall" that the cheapest cuts between vertices on one side never need to cross: if one did, uncrossing it
with the wall would give a cut that is no more expensive and stays on its side. Example: in [[fig:a03-network]], $\delta(\set{a, b})$ is a minimum
$b$–$f$ cut, and $\delta(\set{a})$, a minimum $a$–$b$ cut, stays inside $\set{a, b}$. Non-example: the lemma does not say that **every** minimum
$v$–$w$ cut stays inside $S$, only that one does.
:::

::: corollary {#cor:gomory-hu-contraction title="Contracting one side of a minimum cut" source="algorithms/03 p14"}
Let $\delta(X)$ be a minimum $p$–$q$ cut of $G$ for some vertices $p, q$, and let $G_X$ be obtained from $G$ by
[[def:node-identification|identifying]] $X$ into a single vertex. Then $f_G(s, t) = f_{G_X}(s, t)$ for all $s, t \in V \setminus X$, $s \ne t$.
:::

The lecture states this without proof.

<!-- REVIEW: the old non-example (contracting {a, b, c} hides every a–b cut) had a, b inside the contracted set, which the corollary excludes; replaced by one with s, t outside the set. -->
::: intuition
Everything beyond a minimum cut may be squashed into one point without changing any minimum cut on this side. This justifies the [[def:edge-contraction|contraction]] step
of [[alg:gomory-hu]]: it makes $H$ smaller but keeps $f_H(a, b) = f_G(a, b)$. Example: in round 2 of [[ex:gomory-hu-lecture]], $\set{c, d, e, f}$ is a
side of the minimum $b$–$f$ cut, and contracting it keeps $f(a, b) = 18$. Non-example: contracting a set that is not the side of a minimum cut can
increase $f$ even outside the set; $\set{a, b, c}$ is not a side of any minimum cut, and contracting it raises $f(e, f)$ from 13 to 16.
:::
