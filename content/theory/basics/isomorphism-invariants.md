---
title: "Telling graphs apart"
course: theory
chapter: basics
order: 5
lectures: [t01]
stage: split
status: draft
---

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-09-15-09_45_32-join.pdf p.4 — the lecture's second drawing H of the pentagon example is hard to read; as transcribed, its doubled edges (34 and 45) would share vertex 4, which would make H non-isomorphic to G. The figure above uses a pentagram drawing that is certainly isomorphic to G. -->

How do we show that two graphs are **not** isomorphic? Trying all $n!$ bijections is hopeless
for larger graphs. Instead we look for a property that isomorphisms preserve and that the two
graphs do not share.

::: proposition {#prop:iso-invariants title="Simple isomorphism invariants" extra=true}
If $G \cong H$, then $G$ and $H$ have the same number of vertices, the same number of edges, and
the same [[def:degree-sequence|degree sequence]] up to reordering ([[def:degree|degrees]] are defined in the next section; in fact an
isomorphism $f$ satisfies $d_G(v) = d_H(f(v))$ for every vertex $v$).
:::

::: proof
Let $f$ be an isomorphism. It is a bijection $V(G) \to V(H)$, so $\abs{V(G)} = \abs{V(H)}$. The
map $\set{u, v} \mapsto \set{f(u), f(v)}$ sends $E(G)$ into $E(H)$ by the "$\Rightarrow$"
direction of the definition; it is injective because $f$ is, and it is surjective onto $E(H)$
because every edge $\set{x, y} \in E(H)$ equals $\set{f(u), f(v)}$ for $u = f^{-1}(x)$,
$v = f^{-1}(y)$, and then $\set{u, v} \in E(G)$ by the "$\Leftarrow$" direction. Hence
$\abs{E(G)} = \abs{E(H)}$. The same argument restricted to the edges incident with a fixed vertex
$v$ shows that $f$ maps the edges at $v$ bijectively onto the edges at $f(v)$, so
$d_G(v) = d_H(f(v))$.
:::

::: intuition
An isomorphism only renames vertices, and renaming cannot change anything that is counted
without looking at names. So comparing $n$, $m$ and the degrees is the first test when two graphs
are suspected to be non-isomorphic. Example: $P_3$ and the star $K_{1,3}$ both have $4$ vertices
and $3$ edges, but their degrees are $2, 2, 1, 1$ and $3, 1, 1, 1$, so
$P_3 \not\cong K_{1,3}$.
:::

::: pitfall
These invariants are **necessary but not sufficient**. The cycle $C_6$ and two disjoint
triangles both have 6 vertices, 6 edges and all degrees equal to 2, but they are not isomorphic:
one is [[def:component|connected]] and the other is not.
:::

```graph id=t01-same-degrees-not-iso widget=figure
caption: Same number of vertices, edges and the same degrees, yet not isomorphic.
intent: Counterexample to "same degree sequence implies isomorphic".
height: small
panel: $C_6$
use: C(6)
panel: $2 \times C_3$
use: C(3) prefix=a
use: C(3) prefix=b
```
