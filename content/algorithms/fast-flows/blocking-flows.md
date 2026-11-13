---
title: "Finding a blocking flow"
course: algorithms
chapter: fast-flows
order: 5
lectures: [a02]
stage: split
status: reviewed
---

The **input** is the [[def:residual-network|residual graph]] $G_f$ and its level graph $L$. The **idea** is a modified depth-first search: start at $s$ and advance along edges of $L$ until either

- (a) we reach $t$: augment along the path found, update $L$ (remove saturated edges), and start advancing from $s$ again; or
- (b) we get stuck at some vertex $v$ (no outgoing edges in $L$): remove $v$ from $L$ and **retreat** to the previous vertex.

::: algorithm {#alg:dinic-blocking title="Finding a blocking flow (Dinic)" source="algorithms/02 p43"}
```pseudo
v ← s                                                   // the current vertex       @init
P ← []                                                  // path being constructed
while true do                                           // @loop
    if v = t then                                       // @reached
        AUGMENT(f, c, P)                                // augment                  @augment
        remove saturated edges from L                   // @remove
        v ← s; P ← []                                   // @restart
    else if there exists (v, w) ∈ E(L) then             // @canadvance
        append (v, w) to P; v ← w                       // advance                  @advance
    else
        if v = s then break                             // @stop
        remove v and its incident edges from L          // retreat                  @retreat
        remove the last edge (u, v) from P; v ← u       // @back
```
:::

::: intuition {for=alg:dinic-blocking}
A depth-first search that never looks at anything twice in vain: a full edge is deleted when it is saturated, and a dead end is deleted when we retreat from it,
so later searches skip both. Since $L$ only has edges going one level up, every advance goes one level further from $s$, so the search cannot run in circles.
Example: in the first phase on [[fig:a02-blocking-flow]], the search advances $s \to p \to r \to t$, augments by $3$, deletes $(r, t)$, then advances
$s \to p \to r$, finds no edge of $L$ leaving $r$, deletes $r$ and retreats to $p$, deletes $p$ as well, and finally finds $s \to q \to x \to t$.
:::
<!-- REVIEW: was "every advance gets one step closer to $t$"; false, since L keeps dead ends and vertices at or beyond the level of t. Every advance goes one level further from s. -->

::: proposition {#prop:dinic-blocking-time title="A blocking flow in time $\O(mn)$" source="algorithms/02 p44"}
The procedure finds a blocking flow in $L$ in time $\O(mn)$.
:::

::: intuition
Charge every step to something that disappears: each augmentation deletes an edge, each retreat deletes a vertex, and between two such events there are at
most $n$ advances, because a path in $L$ has at most $n - 1$ edges. So the total work is about $(m + n) \cdot n$. Compare: running a fresh search from $s$
for every path would cost $\O(m)$ per path instead of $\O(n)$.
:::

Proof by invariant: the algorithm deletes only parts of $L$ that lie on no open path, so when it stops, no open path is left.

:::: walkthrough {for=prop:dinic-blocking-time}
```graph id=a02-blk-correct widget=stepper
caption: The level graph $L$ of the lecture network with $f = 0$, labels $f/c$. Thick edges are the path of the current search; faded edges and vertices are deleted from $L$.
intent: New figure. It uses the network of the lecture example of a blocking flow (algorithms/02 p36) and the search described in the intuition above; the lecture does not draw this proof on p43-44.
type: directed
layout: fixed
edge-label: "{f}/{c}"
s [class=source] @(0, 0); p @(1, 1.6); q @(1, 0); r @(2, 1.6); x @(2, 0); t [class=sink] @(3, 0)
s -> p [f=0 c=9]; s -> q [f=0 c=4]; p -> r [f=0 c=5]; r -> t [f=0 c=3]; q -> x [f=0 c=5]; x -> t [f=0 c=9]
mark open: s->p p->r r->t s->q q->x x->t
step: $L$ has two paths from $s$ to $t$.
step: Augment along $s, p, r, t$ by 3; the bottleneck edge is saturated and deleted.
set s->p [f=3]
set p->r [f=3]
set r->t [f=3]
class bold: s->p p->r r->t
class muted: r->t
mark sat: r->t
step: At $r$ nothing leaves $L$: delete $r$ and retreat to $p$.
unclass bold: p->r
class muted: r p->r
mark dead: r
step: Now $p$ is stuck too: delete $p$ and retreat to $s$.
unclass bold: s->p
class muted: p s->p
step: Augment along $s, q, x, t$ by 4; the bottleneck edge is saturated and deleted.
set s->q [f=4]
set q->x [f=4]
set x->t [f=4]
class bold: s->q q->x x->t
class muted: s->q
mark sat2: s->q
step: Stuck at $s$: the loop stops.
unclass bold: q->x x->t
class current: s
```

::: step
Call an $s$–$t$ path of $L$ *open* when all its edges are unsaturated. A flow in $L$ is [[def:blocking-flow|blocking]] exactly when no open path is left. So we show: the algorithm deletes only what lies on no open path, and at the stop no open path is left. Here: [[fig:a02-blk-correct#open|two open paths]], $s,p,r,t$ and $s,q,x,t$.
:::

::: step
The search reaches $t$, and [[alg:augment|AUGMENT]] pushes the bottleneck amount along the path $P$. The flow changes only on $P$, and the bottleneck edge becomes saturated. So no open path uses it any more, and deleting it loses no open path. Here: 3 units along $s,p,r,t$; the bottleneck is [[fig:a02-blk-correct#sat|the edge from $r$ to $t$]].
:::

::: step
We restart at $s$ and advance until we are stuck at a vertex $v$: no edge of $L$ leaves $v$, and $v$ is not $t$. An open path through $v$ is still in $L$, since we deleted no open path, so it leaves $v$ by an edge of $L$. There is none. So we delete $v$. Here: [[fig:a02-blk-correct#dead|$v = r$]].
:::

::: step
We retreat to the previous vertex $u$. Deleting $v$ removed the edge from $u$ to $v$. If no edge of $L$ leaves $u$ now, the argument of the last step applies to $u$: we delete it and retreat again. Here: $u = p$ is stuck, since its only edge led to $r$; we delete $p$ and retreat to $s$.
:::

::: step
The search reaches $t$ again and we augment. As in the second step, the bottleneck edge is now saturated, lies on no open path, and is deleted. Here: 4 units along $s,q,x,t$, and the bottleneck is [[fig:a02-blk-correct#sat2|the edge from $s$ to $q$]].
:::

::: step
Now no edge of $L$ leaves $s$, so the loop stops. An open path would start with an edge out of $s$. We deleted only parts on no open path, so it would still be in $L$. No such edge exists, so the flow is blocking. Here: value 7; each path of $L$ has a saturated edge.
:::
::::

Proof by counting: bound the number of augmentations, retreats and advances, then multiply each by its cost.

:::: walkthrough {for=prop:dinic-blocking-time}
```graph id=a02-blk-time widget=stepper
caption: The same level graph $L$ as before. Faded parts are the edges and vertices deleted in the run; the thick path is the one the search follows.
intent: New figure. It uses the lecture network of the blocking flow example (algorithms/02 p36) and the run described in the intuition above; the lecture does not draw this proof on p43-44.
type: directed
layout: fixed
edge-label: "{c}"
s [class=source] @(0, 0); p @(1, 1.6); q @(1, 0); r @(2, 1.6); x @(2, 0); t [class=sink] @(3, 0)
s -> p [c=9]; s -> q [c=4]; p -> r [c=5]; r -> t [c=3]; q -> x [c=5]; x -> t [c=9]
step: Each augmentation deletes an edge.
class muted: r->t s->q
mark aug: r->t s->q
step: Each retreat deletes a vertex.
class muted: p r s->p p->r
mark dead: p r
step: Runs of advances are short.
unclass muted: p r s->p p->r r->t s->q
class bold: s->p p->r r->t
mark run: s->p p->r r->t
step: Augment and retreat cost one path.
unclass bold: s->p p->r r->t
class bold: s->q q->x x->t
mark P: s->q q->x x->t
step: Add up the costs.
unclass bold: s->q q->x x->t
class visited: s p q r x t
```

::: step
Each augmentation saturates its bottleneck edge, and the algorithm deletes it from $L$. Edges are only deleted, never added. $L$ has at most $m$ edges: of an edge and its reverse, at most one climbs a level. So there are at most $m$ augmentations. Here: 2, deleting [[fig:a02-blk-time#aug|the edges from $r$ to $t$ and from $s$ to $q$]].
:::

::: step
Each retreat deletes a vertex, and a deleted vertex never returns. $L$ has $n$ vertices, so there are at most $n$ retreats. Here: 2, deleting [[fig:a02-blk-time#dead|$p$ and $r$]], out of 6 vertices.
:::

::: step
The path $P$ starts at $s$ and each advance climbs one level, so $P$ has at most $n - 1$ edges. Between two augmentations or retreats $P$ only grows, so at most $n$ advances happen in a row. With at most $m + n$ such events, that is at most $(m + n)\,n$ advances. Here: [[fig:a02-blk-time#run|3 in the first run]].
:::

::: step
An advance follows one edge: $\O(1)$. An augmentation walks along [[fig:a02-blk-time#P|$P$]], which has at most $n - 1$ edges: $\O(n)$. A retreat deletes a vertex with no outgoing edge in $L$ and at most two incoming edges per other vertex ($G_f$ may hold an edge and a reverse one; $G$ has no parallel edges, [[algorithms/flows/flow-networks|convention]]): $\O(n)$. Here: $P$ has 3.
:::

::: step
Augmentations cost at most $m$ times $n$, retreats at most $n$ times $n$, advances at most $(m + n)\,n$ in total. The network is connected, so $n$ is at most a constant times $m$ ([[algorithms/flows/flow-networks|convention]]). Then all three costs are at most a constant times $m$ times $n$: the total is $\O(mn)$. Here: 2 augmentations, 2 retreats, 8 advances.
:::
::::

<!-- REVIEW: steps 2-5 of a02-blk-correct stated example facts as general ("no open path uses the edge from r to t", "advance to r", "retreat to p"); now general sentences first, example after "Here:". Step 4 of a02-blk-time: L is a subgraph of G_f, which may hold an edge and a reverse edge between two vertices, so a retreat deletes at most 2(n-1) edges, still O(n); was "at most n-1 edges, since G has no parallel edges". -->

::: proof
*Correctness:* edges and vertices are removed from $L$ only when they cannot be on any $s$–$t$ path of unsaturated edges of $L$ any more (a saturated edge; a vertex from which
$t$ cannot be reached). When the loop stops at $s$, no $s$–$t$ path of unsaturated edges remains in $L$, so the flow is blocking.

*Time:* there are at most $m$ augmentation steps, since each deletes at least one edge from $L$; and at most $n$ retreat steps, since each deletes a vertex. Each advance step
moves one level further, so after at most $n$ advance steps we augment or retreat; hence there are at most $(m + n) \cdot n = \O(mn)$ advance steps. Augment and retreat can be
implemented in $\O(n)$ (the path has at most $n$ edges), advance in $\O(1)$. In total $\O(mn)$.
:::

::: theorem {#thm:dinic title="Running time of Dinic's algorithm" source="algorithms/02 p45"}
Dinic's algorithm runs in time $\O(mn^2)$.
:::

::: intuition
At most $n$ phases times $\O(mn)$ per blocking flow. Compared with Edmonds–Karp's $\O(m^2 n)$, a factor $m$ becomes a factor $n$, which matters for dense
networks where $m$ is close to $n^2$. Like Edmonds–Karp, the bound does not depend on the capacities.
:::

Proof by counting: the number of phases times the cost of one phase.

:::: walkthrough {for=thm:dinic}
```graph id=a02-blk-dinic widget=stepper
caption: Dinic's algorithm on the lecture network of the blocking flow example, labels $f/c$. Faded edges are not in the level graph of the phase; thick edges carry the blocking flow of the phase. Phase 1 reaches value 7, phase 2 value 8.
intent: New figure. It uses the network of the lecture example of a blocking flow (algorithms/02 p36) and runs Dinic's algorithm on it; the lecture does not draw this proof on p45.
type: directed
layout: fixed
edge-label: "{f}/{c}"
s [class=source] @(0, 0); p @(1, 1.6); q @(1, 0); r @(2, 1.6); x @(2, 0); t [class=sink] @(3, 0)
s -> p [f=0 c=9]; s -> q [f=0 c=4]; p -> r [f=0 c=5]; r -> q [f=0 c=9 class=muted]; r -> t [f=0 c=3]; q -> x [f=0 c=5]; x -> t [f=0 c=9]
step: Phase 1 finds a blocking flow in $L$.
set s->p [f=3]
set p->r [f=3]
set r->t [f=3]
set s->q [f=4]
set q->x [f=4]
set x->t [f=4]
class bold: s->p p->r r->t s->q q->x x->t
step: The rest of the phase touches each edge a few times.
unclass bold: s->p p->r r->t s->q q->x x->t
class visited: s p q r x t
step: Phase 2 has a longer shortest path.
unclass visited: s p q r x t
unclass muted: r->q
class muted: s->q r->t
set s->p [f=4]
set p->r [f=4]
set r->q [f=1]
set q->x [f=5]
set x->t [f=5]
class bold: s->p p->r r->q q->x x->t
mark P2: s->p p->r r->q q->x x->t
step: Phases times cost per phase.
unclass muted: s->q r->t
class bold: s->q r->t
```

::: step
Phase 1 builds the level graph $L$ of $G_f$ and finds a blocking flow in it. By [[prop:dinic-blocking-time]] this takes $\O(mn)$. Here: $L$ has the six edges that climb a level, and $(r,q)$ is not one of them. The blocking flow sends 3 along $s,p,r,t$ and 4 along $s,q,x,t$.
:::

::: step
The other operations of a phase each take $\O(m)$. The BFS that builds $L$ takes $\O(n + m)$ ([[alg:bfs]]), which is $\O(m)$ as $n = \O(m)$ ([[algorithms/flows/flow-networks|convention]]). Adding the blocking flow to $f$ and updating $G_f$ change each edge once. So a phase costs $\O(mn)$.
:::

::: step
By [[lem:dinic-phases]] the distance from $s$ to $t$ grows in every phase and is at most $n - 1$, so there are at most $n$ phases. Here: the distance is 3 in phase 1 and 5 in phase 2, along [[fig:a02-blk-dinic#P2|$s,p,r,q,x,t$]]. Then $f$ has value 8, no augmenting path is left, and we stop after 2 phases.
:::

::: step
There are at most $n$ phases, and each costs $\O(mn)$. We multiply: $\O(mn^2)$ in total, which is the claim. Here: $n$ is 6, so up to 6 phases were allowed, and 2 were needed. The capacities appear nowhere in the count.
:::
::::

<!-- REVIEW: BFS takes O(n+m), which is O(m) only with n = O(m) (convention); was "scans each edge once". -->

::: proof
Finding a blocking flow takes $\O(mn)$, all other operations of a phase take $\O(m)$, and by [[lem:dinic-phases]] there are at most $n$ phases.
:::
