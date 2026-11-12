---
title: "Building a Gomory–Hu tree"
course: algorithms
chapter: gomory-hu
order: 4
lectures: [a03]
stage: split
status: draft
---

The algorithm maintains a partition of $V$ into sets $S_1, \dots, S_k$ and a spanning tree $T$ on the **nodes** $S_1, \dots, S_k$. It starts with
the single node $S_1 = V$ and performs $n - 1$ **split operations** (rounds). In each round it chooses a node $S_i$ with $\abs{S_i} \ge 2$, splits it
into two non-empty parts $S_a$, $S_b$, replaces $S_i$ in $T$ by the edge $S_aS_b$, and reconnects the former neighbours of $S_i$ to $S_a$ or $S_b$
according to the minimum cut found. After $n - 1$ rounds all nodes are single vertices, and $T$ is a Gomory–Hu tree.

::: algorithm {#alg:gomory-hu title="Gomory–Hu tree construction" source="algorithms/03 p7–8"}
**Input:** an undirected network $G = (V, E)$ with capacities $c$. **Output:** a Gomory–Hu tree $T$ with capacities $w$.

```pseudo
S_1 ← V; T ← the single node S_1             // @init
repeat n − 1 times
    pick S_i with |S_i| ≥ 2 and a, b ∈ S_i    // @choose
    H ← G, components of T − S_i contracted   // @contract
    δ(A) ← min a–b cut in H (a ∈ A, b ∈ B)    // @mincut
    S_a ← S_i ∩ A; S_b ← S_i ∩ B              // @split
    in T, replace S_i by the edge S_aS_b
        of capacity c(δ_H(A))
    in T, replace each edge S_iS_j by
        S_aS_j if S_j ⊆ A, S_bS_j if S_j ⊆ B
return T                                      // @return
```
:::

Contracting a component $C$ of $T - S_i$ means [[def:node-identification|identifying]] the union of the node sets in $C$ into one vertex $v_C$;
these vertices need not be connected in $G$. In the last two lines, $A$ and $B$ are read as sets of vertices of $G$ (each $v_C$ stands for its
vertices), so every node $S_j \ne S_i$ lies entirely in $A$ or entirely in $B$. The edge capacities of $T$ other than the new one do not change.

::: intuition {for=alg:gomory-hu}
Each round settles one more pair: it separates two vertices $a, b$ that still share a node, and remembers the cheapest cut between them as a tree
edge. The parts of $G$ that are already separated from $S_i$ by earlier cuts are squashed into single vertices, since by the lemmas below they
cannot make the $a$–$b$ cut cheaper. Example: in round 3 of [[ex:gomory-hu-lecture]], $\set{a, b}$ is contracted to one vertex, and the $c$–$f$
cut of capacity $13$ splits $\set{c, d, e, f}$ into $\set{c, d, e}$ and $\set{f}$.
:::

```graph id=a03-gomory-hu-player widget=player
caption: The Gomory–Hu construction on the lecture network, with the lecture's choice of the vertices $a, b$ in each round. The tree $T$ is drawn on the right, each node at the centre of its vertices.
intent: Algorithm player reproducing slides p9–13 (pairs b–f, a–b, c–f, d–e, c–e; cuts 17, 18, 13, 14, 15); contraction of the components of T − S_i is animated as merges.
algo: gomory-hu
params: pairs="b f, a b, c f, d e, c e"
layout: fixed
a @(0, 0); b @(1.5, 1); c @(3.5, 1); d @(5, 0); e @(3.5, -1); f @(1.5, -1)
a -- b [c=10]; a -- f [c=8]; b -- c [c=4]; b -- f [c=3]; b -- e [c=2]; c -- f [c=2]; c -- e [c=4]; c -- d [c=5]; f -- e [c=3]; f -- d [c=2]; e -- d [c=7]
```

::: example {#ex:gomory-hu-lecture title="The lecture example" source="algorithms/03 p9–13"}
On the network $G$ of [[fig:a03-network]]:

1. Partition $\set{a, b, c, d, e, f}$. Choose $b$ and $f$; $H = G$. A minimum $b$–$f$ cut is $\delta(\set{a, b})$ of capacity $17$. New partition
   $\set{a, b}, \set{c, d, e, f}$, tree $\set{a, b} \overset{17}{\text{—}} \set{c, d, e, f}$.
2. Choose $a$ and $b$. $H$: contract $\set{c, d, e, f}$; then $c(ab) = 10$, $c(a\,cdef) = 8$, $c(b\,cdef) = 4 + 3 + 2 = 9$. A minimum $a$–$b$ cut is
   $\delta(\set{a})$ of capacity $18$; $\set{c, d, e, f}$ lies on the side of $b$. Tree $a \overset{18}{\text{—}} b \overset{17}{\text{—}} \set{c, d, e, f}$.
3. Choose $c$ and $f$. $H$: contract $\set{a, b}$ (edges $11$ to $f$, $4$ to $c$, $2$ to $e$). A minimum $c$–$f$ cut is $\delta(\set{c, d, e})$
   of capacity $13$. Tree $a \overset{18}{\text{—}} b \overset{17}{\text{—}} f \overset{13}{\text{—}} \set{c, d, e}$.
4. Choose $d$ and $e$. $H$: contract $\set{a, b, f}$ (edges $6$ to $c$, $5$ to $e$, $2$ to $d$). A minimum $d$–$e$ cut is $\delta(\set{d})$ of
   capacity $14$. New partition $\set{a}, \set{b}, \set{c, e}, \set{d}, \set{f}$; $d$ hangs off $\set{c, e}$ with capacity $14$.
5. Choose $c$ and $e$. $H$: contract $\set{a, b, f}$ (and $\set{d}$ is a single vertex). A minimum $c$–$e$ cut is $\delta(\set{c})$ of capacity
   $15$; $f$ and $d$ lie on the side of $e$. The result is the tree $T$ of [[fig:a03-network]].
:::
