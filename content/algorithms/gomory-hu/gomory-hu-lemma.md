---
title: "The Gomory–Hu lemma"
course: algorithms
chapter: gomory-hu
order: 6
lectures: [a03]
stage: split
status: draft
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

::: intuition
Everything beyond a minimum cut may be squashed into one point without changing any minimum cut on this side. This justifies the [[def:edge-contraction|contraction]] step
of [[alg:gomory-hu]]: it makes $H$ smaller but keeps $f_H(a, b) = f_G(a, b)$. Example: in round 2 of [[ex:gomory-hu-lecture]], $\set{c, d, e, f}$ is a
side of the minimum $b$–$f$ cut, and contracting it keeps $f(a, b) = 18$. Non-example: contracting a set that is not the side of a minimum cut can
increase $f$; contracting $\set{a, b, c}$ hides every $a$–$b$ cut.
:::
