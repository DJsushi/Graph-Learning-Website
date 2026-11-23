---
title: Midterm cheat sheet
aside: false
---

# Midterm cheat sheet

A list to copy by hand onto the one A4 side allowed in the MA010 midterm. The midterm covers
everything up to colourings. Planarity, connectivity and colouring come first, because the
sample midterm (15.12.2025) tests them.

<span class="cs-star">★</span> appeared in the sample midterm ·
<span class="cs-dag">†</span> not stated in the lectures: give a one-line justification if you use it.

<div class="cs-sheet">

## <span class="cs-star">★</span> Planarity

- **Euler:** $n - e + f = 2$ (connected plane multigraph) · $c$ components: $n - e + f = 1 + c$
- $\sum$ **face lengths** $= 2e$ (a bridge counts twice in its face)
- simple, $n \ge 3$: $\boldsymbol{e \le 3n - 6}$ (faces $\ge 3$; $=$ ⟺ triangulation) · no $K_3$: $\boldsymbol{e \le 2n - 4}$
- girth $g$: $e \le \frac{g}{g-2}(n-2)$<span class="cs-dag">†</span> ($g f \le 2e$ + Euler)
- planar ⇒ $\boldsymbol{\delta \le 5}$ ($\delta \ge 6 \Rightarrow 2e \ge 6n > 6n-12$) · bipartite planar ⇒ $\boldsymbol{\delta \le 3}$
- $K_5$: $10 > 9$ · $K_{3,3}$: $9 > 8$ ⇒ non-planar
- **Kuratowski:** planar ⟺ no subdivision of $K_5$ or $K_{3,3}$ (subdivision: edges → paths with new inner vertices)
- 3-connected $\ne K_4$ ⇒ $\exists e$: $G/e$ 3-connected (used in the Kuratowski proof)
- **Dual** $G^*$: $V$ = faces, $E = E$ (joins the 2 faces at $e$) · $|V^*| = f$, $|E^*| = e$, $\deg^*$ = face length · $(G^*)^* = G$ if connected
- Euler proof: spanning tree $T$ of $G$ ($n-1$ edges); $E \setminus T$ = spanning tree of $G^*$ ($f-1$ edges)

<div class="cs-box">

**Faces all of length $L$, $e$ edges:** $f = 2e/L$, $n = e - f + 2$. E.g. $L=4$, $e=10$: $f=5$, $n=7$, so $K_{2,5}$. $K_{2,m}$: $m+2$ vertices, $2m$ edges, $m$ faces of length 4. All faces even ⇒ bipartite<span class="cs-dag">†</span>.

</div>

<div class="cs-figs">
<figure><svg viewBox="0 0 60 60" role="img" aria-label="K5"><g class="e"><polygon points="30,4 55,22 46,53 14,53 5,22"/><polyline points="30,4 46,53 5,22 55,22 14,53 30,4"/></g><g class="v"><circle cx="30" cy="4" r="2.6"/><circle cx="55" cy="22" r="2.6"/><circle cx="46" cy="53" r="2.6"/><circle cx="14" cy="53" r="2.6"/><circle cx="5" cy="22" r="2.6"/></g></svg><figcaption>K₅</figcaption></figure>
<figure><svg viewBox="0 0 60 60" role="img" aria-label="K3,3"><g class="e"><path d="M8 8L8 52M8 8L30 52M8 8L52 52M30 8L8 52M30 8L30 52M30 8L52 52M52 8L8 52M52 8L30 52M52 8L52 52"/></g><g class="v"><circle cx="8" cy="8" r="2.6"/><circle cx="30" cy="8" r="2.6"/><circle cx="52" cy="8" r="2.6"/><circle cx="8" cy="52" r="2.6"/><circle cx="30" cy="52" r="2.6"/><circle cx="52" cy="52" r="2.6"/></g></svg><figcaption>K₃,₃</figcaption></figure>
<figure><svg viewBox="0 0 60 60" role="img" aria-label="K2,5"><g class="e"><path d="M30 4L4 30L30 56M30 4L17 30L30 56M30 4L30 30L30 56M30 4L43 30L30 56M30 4L56 30L30 56"/></g><g class="v"><circle cx="30" cy="4" r="2.6"/><circle cx="30" cy="56" r="2.6"/><circle cx="4" cy="30" r="2.4"/><circle cx="17" cy="30" r="2.4"/><circle cx="30" cy="30" r="2.4"/><circle cx="43" cy="30" r="2.4"/><circle cx="56" cy="30" r="2.4"/></g></svg><figcaption>K₂,₅: 4-faces</figcaption></figure>
<figure><svg viewBox="0 0 60 60" role="img" aria-label="odd wheel W5"><g class="e"><polygon points="30,5 54,22 45,52 15,52 6,22"/><path d="M30 30L30 5M30 30L54 22M30 30L45 52M30 30L15 52M30 30L6 22"/></g><g class="v"><circle cx="30" cy="5" r="2.6"/><circle cx="54" cy="22" r="2.6"/><circle cx="45" cy="52" r="2.6"/><circle cx="15" cy="52" r="2.6"/><circle cx="6" cy="22" r="2.6"/><circle cx="30" cy="30" r="3"/></g></svg><figcaption>odd wheel: χ = 4</figcaption></figure>
</div>

## <span class="cs-star">★</span> Connectivity

- **$k$-connected:** $\ge k+1$ vertices, deleting $\le k-1$ vertices leaves it connected · $\kappa(K_n) = n-1$ · $k$-edge-connected: same with edges
- $\boldsymbol{\kappa \le \lambda \le \delta}$<span class="cs-dag">†</span> ($\kappa \le \delta$: delete $N(v)$ for $v$ of minimum degree)
- planar ⇒ $\kappa \le \delta \le 5$ ⇒ **no 6-connected planar graph** · icosahedron 5-connected, octahedron 4-connected
- **Separating cycle**<span class="cs-dag">†</span> (Jordan): a cycle with vertices inside and outside ⇒ $V(C)$ is a cut
- $K_4 \subseteq G$ planar: $K_4$ drawn = 4 triangular faces · $n \ge 5$ ⇒ some $w$ inside a face, the 4th $K_4$ vertex outside ⇒ the triangle is a 3-cut ⇒ **4-connected planar ⇒ no $K_4$**
- **Menger:** $k$-connected ⟺ $\forall s \ne t$: $k$ internally disjoint $s$–$t$ paths · $k$-edge-connected ⟺ $k$ edge-disjoint $s$–$t$ paths
- **local:** $s \not\sim t$: max # internally disjoint $s$–$t$ paths = min $s$–$t$ vertex cut · edges: max edge-disjoint = min edge cut · also directed
- **set version** ($n \ge k+1$): $k$-connected ⟺ $\forall\, |S| = |T| = k$: $k$ disjoint $S$–$T$ paths
- **2-connected** ($n \ge 3$) ⟺ any 2 vertices on a common cycle ⟺ any 2 edges on a common cycle ⟺ **ear decomposition** (cycle + ears = paths between 2 distinct old vertices, new inner vertices)
- d-flow: $\mathrm{in}(s)=0$, $\mathrm{out}(t)=0$, in = out elsewhere; size $k$ ⇒ $k$ edge-disjoint $s \to t$ paths

## <span class="cs-star">★</span> Colouring

- **proper $k$-colouring** $c: V \to \{1, \dots, k\}$, $c(x) \ne c(y)\ \forall xy \in E$ · $\chi$ defined ⟺ no loops · $\chi = 1$ ⟺ $V \ne \emptyset$, $E = \emptyset$
- $\boldsymbol{\chi \le 2}$ **⟺ no odd cycle ⟺ bipartite** · $K_k \subseteq G \Rightarrow \chi \ge k$ (but $\chi(K_{n,n}) = 2$)
- **degeneracy:** every subgraph has a vertex of degree $\le k$ ⇒ $\boldsymbol{\chi \le k+1}$ (induction: colour $G - v$, $|N(v)| \le k$ leaves a free colour)
- ⇒ $\chi \le \Delta + 1$ · forests $\le 2$ · **planar $\le 6$** · four colour theorem: planar $\le 4$<span class="cs-dag">†</span>
- **Mycielski:** $\forall k\ \exists$ triangle-free $G_k$ with $\chi = k$ · $G_3 = C_5$ · $G_{k+1}$: $(u,0), (u,1), m$ · $(u,0)(v,0)$, $(u,1)(v,0)$, $(u,0)(v,1)$ $\forall uv \in E$ · $m(u,1)\ \forall u$ · $G_4$ = Grötzsch (11 vertices)
- proof: $\chi \le k$ ⇒ $c(m)=k$; give each $(u,0)$ of colour $k$ the colour $c(u,1)$ ⇒ $G_k$ is $(k-1)$-colourable ✗
- **3-COL is NP-hard** (from 3-SAT): $\triangle(s,f,t)$ · $\triangle(s,x_i,\neg x_i)$ · clause: $a^j l^j$, $a^j t$, $a^j b^j$, $\triangle b^1 b^2 b^3$ · all literals F ⇒ all $a^j = S$ ⇒ the $b$-triangle has only T, F ✗

<div class="cs-box">

**Find $\chi$ and argue:** ① a colouring with $k$ colours (numbers on the vertices) ② $k-1$ is impossible: $K_k$ · odd cycle ($\ge 3$) · odd wheel ($\ge 4$) · $\boldsymbol{\chi \ge n/\alpha}$<span class="cs-dag">†</span> (colour classes are independent) · fix the colours of a triangle and propagate until a clash

</div>

- <span class="cs-dag">†</span> $\chi(C_n) = 2/3$ (even/odd) · $\chi(K_n) = n$ · wheel $3/4$ (rim even/odd) · Petersen $3$
- <span class="cs-dag">†</span> $\boldsymbol{C_n^2}$ (+ chords to distance 2), $n \ge 6$: $\alpha = \lfloor n/3 \rfloor$, $\chi = 3$ if $3 \mid n$, else $4$ · $C_5^2 = K_5$ · chordal: $\chi = \omega$

## Basics, degrees

- $\boldsymbol{\sum_v d(v) = 2e}$ (a loop counts 2) ⇒ the number of odd-degree vertices is even · $|E(K_n)| = \binom{n}{2}$ · $|E(K_{m,n})| = mn$
- induced subgraph: all edges of $G$ among its vertices · $\omega$ = max clique, $\alpha$ = max independent set
- isomorphism invariants: $n$, $e$, degree sequence, cycle lengths, bipartite, $\chi$, planar, $\kappa$
- **Havel–Hakimi** ($d_1 \ge \dots \ge d_n$, $d_1 \le n-1$): graphic ⟺ $(d_2-1, \dots, d_{d_1+1}-1, d_{d_1+2}, \dots, d_n)$ graphic · test: sort, drop $d_1$, subtract 1 from the next $d_1$, repeat; negative ⇒ no; all 0 ⇒ yes
- **Erdős–Gallai:** $\sum d_i$ even and $\forall k$: $\sum_{i \le k} d_i \le k(k-1) + \sum_{i > k} \min(d_i, k)$
- girth = shortest cycle · $\forall d, k\ \exists$ a $d$-regular graph of girth $\ge k$

## Walks, bipartite, trees

- a shortest walk is a path · a closed walk contains a cycle or uses every edge an even number of times · an odd closed walk contains an odd cycle<span class="cs-dag">†</span>
- **bipartite** ⟺ $\subseteq K_{m,n}$ ⟺ **no odd cycle** (König) · BFS layers by parity give the two parts
- **tree** = acyclic + connected ⟺ unique $u$–$v$ paths ⟺ connected and $e = n-1$ ⟺ acyclic and $e = n-1$<span class="cs-dag">†</span> · forest: $e = n - c$
- acyclic, $n \ge 2$ ⇒ $\ge 2$ vertices of degree $\le 1$ · acyclic ⟺ every subgraph has a vertex of degree $\le 1$
- **Cayley:** $K_n$ has $\boldsymbol{n^{n-2}}$ spanning trees · a spanning tree exists ⟺ connected

## Chordal, Hamiltonian

- **chordal:** every cycle of length $\ge 4$ has a chord · induced subgraphs stay chordal · interval ⇒ chordal · not chordal: an induced $C_k$, $k \ge 4$
- simplicial $v$: $N(v)$ is a clique · chordal ⇒ one exists; not complete ⇒ 2 non-adjacent ones · a minimal $u$–$v$ cut is a clique
- **chordal ⟺ simplicial decomposition** ($v_1, \dots, v_n$: the earlier neighbours of $v_i$ form a clique; build it by removing simplicial vertices, then reverse)
- **Dirac:** $n \ge 3$, $\delta \ge n/2$ ⇒ Hamiltonian · **Ore:** $d(u)+d(v) \ge n\ \forall u \not\sim v$ ⇒ Hamiltonian
- **closure:** add $uv$ while $d(u)+d(v) \ge n$; $G$ Hamiltonian ⟺ closure Hamiltonian · closure $= K_n$ ⇒ Hamiltonian
- <span class="cs-dag">†</span> not Hamiltonian: a cut vertex · deleting $k$ vertices leaves $> k$ components · bipartite with $|A| \ne |B|$

</div>
