---
title: "Node identification"
course: algorithms
chapter: gomory-hu
order: 2
lectures: [a03]
stage: split
status: draft
---

Several algorithms below glue vertices together. The operation is the same as edge contraction, except that the two vertices need not be adjacent.

::: definition {#def:node-identification title="Node identification" defines="node identification" source="algorithms/03 p31"}
Let $u \ne v$ be vertices of $G$. The graph $G_{uv}$ obtained from $G$ by **identifying** $u$ and $v$ ("merging" the two nodes into a new vertex
$w_{uv} \notin V(G)$) is
$$V(G_{uv}) = (V(G) \setminus \set{u, v}) \cup \set{w_{uv}},$$
$$E(G_{uv}) = \set{ab \in E(G) \mid \set{a, b} \cap \set{u, v} = \emptyset} \ \cup\ \set{w_{uv}x \mid ux \in E(G) \lor vx \in E(G)},$$
where each edge $ux$ or $vx$ with $x \notin \set{u, v}$ becomes its own edge $w_{uv}x$, and the edges between $u$ and $v$ disappear. The capacities
are the same as in $G$. **Identifying a set** $X \subseteq V$ means identifying its vertices one by one into a single vertex $v_X$; the result $G_X$
does not depend on the order (an edge survives iff it has an end outside $X$, and its ends in $X$ become $v_X$).
:::

- [[def:edge-contraction|Edge contraction]] is the special case of node identification with $uv \in E$.
- $G_{uv}$ can have parallel edges between two vertices (an $x$ adjacent to both $u$ and $v$), but no new loops.
- For flow and cut algorithms, parallel edges can be replaced by a single edge whose capacity is the **sum** of their capacities: a cut contains
  either all or none of a bundle of parallel edges, so no cut capacity changes.

::: intuition
Identifying $u$ and $v$ forces them onto the same side of every cut and keeps everything else. Example: in [[fig:a03-identification]], $u$ and $v$ are
not adjacent; after identification, $x$ and $q$ are joined to $w_{uv}$ by two parallel edges each, which merge into single edges of capacities $3 + 2 = 5$
and $2 + 6 = 8$. Non-example: deleting $v$ is not identification, since the edges at $v$ would be lost.
:::

```graph id=a03-identification widget=stepper
caption: Identifying the non-adjacent vertices $u$ and $v$ into $w_{uv}$. Parallel edges are then merged and their capacities added.
intent: Node identification as a generalisation of edge contraction (u, v non-adjacent); parallel edges appear and are merged with summed capacities.
layout: fixed
u @(0, 0); v @(2, 0); x @(1, 1.1); q @(1, -1.1); y @(-1, 0.8); z @(3, 0.8)
u -- x [id=ux c=3]; v -- x [id=vx c=2]; u -- q [id=uq c=2]; v -- q [id=vq c=6]; u -- y [c=4]; v -- z [c=1]
step: The vertices $u$ and $v$ are not adjacent.
class highlight: u v
step: Identify $u$ and $v$ into the new vertex $w_{uv}$. Every edge keeps its capacity, so $x$ and $q$ now have two parallel edges each.
merge u v -> w [label="$w_{uv}$" class=color1]
step: Replace each bundle of parallel edges by one edge with the summed capacity: $c(w_{uv}x) = 5$, $c(w_{uv}q) = 8$.
remove @ux @vx @uq @vq
w -- x [c=5]; w -- q [c=8]
```

::: observation {#obs:identification-cuts title="Cuts after identification" source="algorithms/03 p32"}
Let $v, w \in V(G)$, $v \ne w$. Then

1. every cut of $G_{vw}$ is a cut of $G$;
2. every cut of $G$ which does not separate $v$ from $w$ is a cut of $G_{vw}$.

More precisely, for $U' \subseteq V(G_{vw})$ let $U$ be $U'$ with $w_{vw}$ replaced by $v$ and $w$ (if $w_{vw} \in U'$). Then $c(\delta_{G_{vw}}(U')) = c(\delta_G(U))$,
and $U' \mapsto U$ is a bijection onto the sets $U$ that contain both or none of $v, w$. The same holds for identifying a set $X$, with the sets $U$
that contain $X$ or are disjoint from it.
:::

::: proof
The edges of $G_{vw}$ correspond one-to-one to the edges of $G$ that do not join $v$ and $w$, with the same capacities (before parallel edges are
merged; merging does not change cut capacities, as noted above). An edge $ab$ with $a, b \notin \set{v, w}$ keeps its ends. An edge $vx$ or $wx$
becomes $w_{vw}x$, and $w_{vw} \in U'$ iff $v, w \in U$; so in both cases the edge crosses $U'$ in $G_{vw}$ iff it crosses $U$ in $G$. The edges
between $v$ and $w$ do not exist in $G_{vw}$ and do not cross $U$ in $G$, since $v$ and $w$ lie on the same side. So $\delta_G(U)$ consists of the
edges of $\delta_{G_{vw}}(U')$, and the capacities agree. The map $U' \mapsto U$ is clearly a bijection onto the sets containing both or none of
$v, w$, and $\emptyset \ne U' \ne V(G_{vw})$ iff $\emptyset \ne U \ne V(G)$. For a set $X$, apply this to the identifications one by one.
:::

::: intuition
Identification removes exactly the cuts that separate $v$ from $w$, and every other cut survives unchanged, with the same capacity. Example: in
[[fig:a03-identification]], the cut $\delta(\set{u, v, y})$ of $G$ ($c = 3 + 2 + 2 + 6 + 1 = 14$) is the cut $\delta(\set{w_{uv}, y})$ of $G_{uv}$
($c = 5 + 8 + 1 = 14$). Non-example: $\delta(\set{u})$ separates $u$ from $v$ and has no counterpart in $G_{uv}$.
:::
