---
title: Polygonal drawings
course: theory
chapter: planarity
order: 2
lectures: [t06]
goal: Show that every planar graph has a planar drawing in which every edge is a polygonal line.
needs: [theory/planarity/planar-drawings]
stage: taught
long: true # the proof has a construction and a check, so two walkthroughs with 14 steps
status: reviewed
---

The lecture drew planar drawings with curved edges. Curves are hard to work with, straight
segments are easy. Can we always trade the curves for straight pieces?

```graph id=t06-polygonal-board widget=figure
caption: The same graph drawn twice. In "curves" the two parallel edges between 1 and 3 are curves. In "polygonal lines" they bend at a few points and are straight in between; the other five edges are single segments. Neither drawing has a crossing.
intent: The left panel is the lecture drawing of theory/2026-10-20 p1 with the vertex names and positions of t06-board-drawing. The right panel is new: the same drawing with every edge a polygonal line (bend points are hidden vertices). Shows what the lemma promises before it is stated.
layout: fixed
panel: curves
1 @(0.76, 2.32); 2 @(2.02, 2.6); 3 @(2.78, 1.7); 4 @(1.04, 0.92); 5 @(2.06, 0.9)
1 -- 2; 1 -- 4; 1 -- 5; 2 -- 5; 2 -- 3
1 -- 3 [via="(1.4, 2.88) (2.1, 3.1) (2.82, 2.66)"]
1 -- 3 [via="(0.3, 1.7) (0.45, 0.6) (1.5, 0.28) (2.7, 0.5) (3.18, 1.25)"]
panel: polygonal lines
1 @(0.76, 2.32); 2 @(2.02, 2.6); 3 @(2.78, 1.7); 4 @(1.04, 0.92); 5 @(2.06, 0.9)
t1 [class=hidden] @(1.25, 2.95); t2 [class=hidden] @(2.75, 2.95)
u1 [class=hidden] @(0.3, 1.3); u2 [class=hidden] @(0.55, 0.35); u3 [class=hidden] @(2.65, 0.4)
1 -- 2; 1 -- 4; 1 -- 5; 2 -- 5; 2 -- 3
1 -- t1 -- t2 -- 3
1 -- u1 -- u2 -- u3 -- 3
mark parallel: 1--t1 t1--t2 t2--3 1--u1 u1--u2 u2--u3 u3--3
```

In the second drawing [[fig:t06-polygonal-board#parallel|the two parallel edges]] are made of
straight segments, and the drawing is still planar.

The answer is yes, and no vertex has to move. Near each vertex we replace the edges by straight
segments that end at the vertex. Away from the vertices we replace each edge by many short
segments that stay so close to the old curve that they cannot touch anything else.

A **polygonal line** is a curve made of finitely many straight segments, one after the other.
The lecture drew this one:

```graph id=t06-polygonal-line widget=figure
caption: A polygonal line from $u$ to $v$: four straight segments that meet at three bends.
intent: From the lecture (theory/2026-10-20 p2, top right: a zigzag between two dots). The names u and v are new; the bends are hidden vertices.
layout: fixed
u @(0, 0.9); v @(1.95, 0.85)
z1 [class=hidden] @(0.45, 0); z2 [class=hidden] @(0.95, 0.75); z3 [class=hidden] @(1.45, 0)
u -- z1 -- z2 -- z3 -- v
```

::: lemma {#lem:polygonal-drawing title="Polygonal drawings" source="theory/2026-10-20 p2"}
If $G$ is planar, then $G$ has a planar drawing using polygonal lines.
:::

::: intuition
A graph that can be drawn without crossings can also be drawn without crossings using only
straight pieces. Each edge becomes a chain of finitely many segments, and the vertices stay
where they are.
:::

## Why it is true

The proof is a **construction by approximation**: compactness gives safe distances, and within
them we replace each curve by a polygonal line that runs close to it.

:::: walkthrough {for=lem:polygonal-drawing}
```graph id=t06-poly-construction widget=stepper
caption: The construction on a drawing with five vertices. The dashed circles bound the disks around the vertices. Faded curves are the parts of the edges that we throw away, thick lines are the polygonal lines.
intent: From the lecture (theory/2026-10-20 p2, the drawings on the right): a vertex x with a disk of radius δ' around it, an edge that leaves the disk and comes back (here xc), the cut where an edge leaves the disk, and a polygonal line along the rest of the edge. New: this graph, its vertex names and the numbers. The disks are drawn as dashed 16-gons through hidden points; cut points and bend points are hidden vertices. The board's strips of width ε/3 and its chain of small disks are not drawn.
layout: fixed
a @(0, 1.3); b @(0, 0); x @(1.2, 0.65); c @(2.2, 0); y @(3.15, 0.9)
x -- y [via="(1.31, 0.71) (1.42, 0.77) (1.53, 0.83) (1.65, 0.85) (1.77, 0.8) (1.86, 0.71) (1.95, 0.63) (2.06, 0.6) (2.18, 0.66) (2.27, 0.75) (2.36, 0.84) (2.47, 0.91) (2.59, 0.91) (2.69, 0.84) (2.79, 0.77) (2.91, 0.76) (3.02, 0.81)"]
x -- a [via="(1.08, 0.69) (0.96, 0.73) (0.85, 0.77) (0.73, 0.79) (0.61, 0.81) (0.49, 0.83) (0.37, 0.86) (0.25, 0.91) (0.15, 0.97) (0.08, 1.07) (0.03, 1.19)"]
x -- b [via="(1.1, 0.59) (0.99, 0.52) (0.88, 0.45) (0.77, 0.38) (0.67, 0.3) (0.58, 0.22) (0.48, 0.15) (0.37, 0.09) (0.25, 0.05) (0.13, 0.02)"]
x -- c [via="(1.32, 0.64) (1.44, 0.61) (1.55, 0.57) (1.66, 0.51) (1.73, 0.41) (1.71, 0.29) (1.59, 0.26) (1.49, 0.33) (1.38, 0.39) (1.27, 0.34) (1.2, 0.24) (1.24, 0.12) (1.35, 0.08) (1.48, 0.04) (1.6, 0.02) (1.73, 0) (1.85, -0.01) (1.97, -0.01) (2.09, 0)"]
a -- y [via="(0.1, 1.37) (0.21, 1.44) (0.32, 1.5) (0.44, 1.53) (0.57, 1.55) (0.69, 1.56) (0.82, 1.57) (0.95, 1.57) (1.08, 1.58) (1.22, 1.58) (1.34, 1.58) (1.48, 1.58) (1.6, 1.58) (1.73, 1.58) (1.85, 1.58) (1.99, 1.57) (2.11, 1.56) (2.24, 1.55) (2.37, 1.53) (2.49, 1.51) (2.61, 1.48) (2.73, 1.44) (2.84, 1.39) (2.94, 1.3) (3.01, 1.19) (3.07, 1.07) (3.12, 0.96)"]
mark D: x--y x--a x--b x--c a--y
step: A planar drawing $D$ of $G$.
step: The closest vertex and edge not incident with it.
class highlight: c x--y
mark delta: c x--y
step: The two closest vertices.
unclass highlight: c x--y
class highlight: x c
mark nu: x c
step: A disk of radius $\delta'$ around every vertex.
unclass highlight: x c
a0 [class=hidden] @(0.4, 1.3); a1 [class=hidden] @(0.37, 1.45); a2 [class=hidden] @(0.28, 1.58); a3 [class=hidden] @(0.15, 1.67); a4 [class=hidden] @(0, 1.7); a5 [class=hidden] @(-0.15, 1.67); a6 [class=hidden] @(-0.28, 1.58); a7 [class=hidden] @(-0.37, 1.45); a8 [class=hidden] @(-0.4, 1.3); a9 [class=hidden] @(-0.37, 1.15); a10 [class=hidden] @(-0.28, 1.02); a11 [class=hidden] @(-0.15, 0.93); a12 [class=hidden] @(0, 0.9); a13 [class=hidden] @(0.15, 0.93); a14 [class=hidden] @(0.28, 1.02); a15 [class=hidden] @(0.37, 1.15)
b0 [class=hidden] @(0.4, 0); b1 [class=hidden] @(0.37, 0.15); b2 [class=hidden] @(0.28, 0.28); b3 [class=hidden] @(0.15, 0.37); b4 [class=hidden] @(0, 0.4); b5 [class=hidden] @(-0.15, 0.37); b6 [class=hidden] @(-0.28, 0.28); b7 [class=hidden] @(-0.37, 0.15); b8 [class=hidden] @(-0.4, 0); b9 [class=hidden] @(-0.37, -0.15); b10 [class=hidden] @(-0.28, -0.28); b11 [class=hidden] @(-0.15, -0.37); b12 [class=hidden] @(0, -0.4); b13 [class=hidden] @(0.15, -0.37); b14 [class=hidden] @(0.28, -0.28); b15 [class=hidden] @(0.37, -0.15)
x0 [class=hidden] @(1.6, 0.65); x1 [class=hidden] @(1.57, 0.8); x2 [class=hidden] @(1.48, 0.93); x3 [class=hidden] @(1.35, 1.02); x4 [class=hidden] @(1.2, 1.05); x5 [class=hidden] @(1.05, 1.02); x6 [class=hidden] @(0.92, 0.93); x7 [class=hidden] @(0.83, 0.8); x8 [class=hidden] @(0.8, 0.65); x9 [class=hidden] @(0.83, 0.5); x10 [class=hidden] @(0.92, 0.37); x11 [class=hidden] @(1.05, 0.28); x12 [class=hidden] @(1.2, 0.25); x13 [class=hidden] @(1.35, 0.28); x14 [class=hidden] @(1.48, 0.37); x15 [class=hidden] @(1.57, 0.5)
c0 [class=hidden] @(2.6, 0); c1 [class=hidden] @(2.57, 0.15); c2 [class=hidden] @(2.48, 0.28); c3 [class=hidden] @(2.35, 0.37); c4 [class=hidden] @(2.2, 0.4); c5 [class=hidden] @(2.05, 0.37); c6 [class=hidden] @(1.92, 0.28); c7 [class=hidden] @(1.83, 0.15); c8 [class=hidden] @(1.8, 0); c9 [class=hidden] @(1.83, -0.15); c10 [class=hidden] @(1.92, -0.28); c11 [class=hidden] @(2.05, -0.37); c12 [class=hidden] @(2.2, -0.4); c13 [class=hidden] @(2.35, -0.37); c14 [class=hidden] @(2.48, -0.28); c15 [class=hidden] @(2.57, -0.15)
y0 [class=hidden] @(3.55, 0.9); y1 [class=hidden] @(3.52, 1.05); y2 [class=hidden] @(3.43, 1.18); y3 [class=hidden] @(3.3, 1.27); y4 [class=hidden] @(3.15, 1.3); y5 [class=hidden] @(3, 1.27); y6 [class=hidden] @(2.87, 1.18); y7 [class=hidden] @(2.78, 1.05); y8 [class=hidden] @(2.75, 0.9); y9 [class=hidden] @(2.78, 0.75); y10 [class=hidden] @(2.87, 0.62); y11 [class=hidden] @(3, 0.53); y12 [class=hidden] @(3.15, 0.5); y13 [class=hidden] @(3.3, 0.53); y14 [class=hidden] @(3.43, 0.62); y15 [class=hidden] @(3.52, 0.75)
a0 -- a1 -- a2 -- a3 -- a4 -- a5 -- a6 -- a7 -- a8 -- a9 -- a10 -- a11 -- a12 -- a13 -- a14 -- a15 -- a0 [class=dashed]
b0 -- b1 -- b2 -- b3 -- b4 -- b5 -- b6 -- b7 -- b8 -- b9 -- b10 -- b11 -- b12 -- b13 -- b14 -- b15 -- b0 [class=dashed]
x0 -- x1 -- x2 -- x3 -- x4 -- x5 -- x6 -- x7 -- x8 -- x9 -- x10 -- x11 -- x12 -- x13 -- x14 -- x15 -- x0 [class=dashed]
c0 -- c1 -- c2 -- c3 -- c4 -- c5 -- c6 -- c7 -- c8 -- c9 -- c10 -- c11 -- c12 -- c13 -- c14 -- c15 -- c0 [class=dashed]
y0 -- y1 -- y2 -- y3 -- y4 -- y5 -- y6 -- y7 -- y8 -- y9 -- y10 -- y11 -- y12 -- y13 -- y14 -- y15 -- y0 [class=dashed]
mark Bx: x0--x1 x1--x2 x2--x3 x3--x4 x4--x5 x5--x6 x6--x7 x7--x8 x8--x9 x9--x10 x10--x11 x11--x12 x12--x13 x13--x14 x14--x15 x15--x0
step: Each edge is cut at the boundaries of the disks of its ends.
remove x--y x--a x--b x--c a--y
pe [class=hidden] @(1.55, 0.83); qe [class=hidden] @(2.77, 0.78)
pf [class=hidden] @(0.82, 0.77); qf [class=hidden] @(0.18, 0.95)
pg [class=hidden] @(0.86, 0.44); qg [class=hidden] @(0.39, 0.09)
ph [class=hidden] @(1.2, 0.25); qh [class=hidden] @(1.8, -0.01)
pk [class=hidden] @(0.34, 1.5); qk [class=hidden] @(2.97, 1.25)
x -- pe [via="(1.31, 0.71) (1.42, 0.77)" class=muted]
pe -- qe [via="(1.68, 0.85) (1.79, 0.78) (1.88, 0.69) (1.97, 0.62) (2.1, 0.61) (2.2, 0.68) (2.29, 0.77) (2.39, 0.85) (2.49, 0.92) (2.61, 0.89) (2.71, 0.82)"]
qe -- y [via="(2.89, 0.75) (3.01, 0.8)" class=muted]
x -- pf [via="(1.08, 0.69) (0.96, 0.73)" class=muted]
pf -- qf [via="(0.7, 0.8) (0.58, 0.82) (0.46, 0.83) (0.34, 0.87) (0.23, 0.92)"]
qf -- a [via="(0.1, 1.03) (0.05, 1.15)" class=muted]
x -- pg [via="(1.1, 0.59) (0.99, 0.52)" class=muted]
pg -- qg [via="(0.76, 0.37) (0.66, 0.29) (0.57, 0.21) (0.47, 0.14)"]
qg -- b [via="(0.27, 0.05) (0.15, 0.03)" class=muted]
x -- ph [via="(1.32, 0.64) (1.44, 0.61) (1.55, 0.57) (1.66, 0.51) (1.73, 0.41) (1.71, 0.29) (1.59, 0.26) (1.49, 0.33) (1.38, 0.39) (1.27, 0.34)" class=muted]
ph -- qh [via="(1.22, 0.13) (1.34, 0.08) (1.46, 0.05) (1.58, 0.02) (1.7, 0)"]
qh -- c [via="(1.92, -0.01) (2.04, -0.01)" class=muted]
a -- pk [via="(0.1, 1.37) (0.21, 1.44)" class=muted]
pk -- qk [via="(0.46, 1.53) (0.59, 1.55) (0.72, 1.56) (0.85, 1.57) (0.98, 1.58) (1.11, 1.58) (1.23, 1.58) (1.36, 1.58) (1.5, 1.58) (1.62, 1.58) (1.74, 1.58) (1.87, 1.57) (2, 1.57) (2.13, 1.56) (2.25, 1.54) (2.38, 1.53) (2.5, 1.51) (2.62, 1.48) (2.74, 1.44) (2.85, 1.38)"]
qk -- y [via="(3.03, 1.15) (3.09, 1.04)" class=muted]
mark me: pe--qe
mark wiggle: x--ph
step: The two closest middle pieces.
class highlight: pf--qf pg--qg
mark eps: pf--qf pg--qg
step: A polygonal line along each middle piece.
unclass highlight: pf--qf pg--qg
remove pe--qe pf--qf pg--qg ph--qh pk--qk
E1 [class=hidden] @(1.64, 0.85); E2 [class=hidden] @(1.73, 0.82); E3 [class=hidden] @(1.8, 0.76); E4 [class=hidden] @(1.87, 0.7); E5 [class=hidden] @(1.94, 0.64); E6 [class=hidden] @(2.02, 0.6); E7 [class=hidden] @(2.11, 0.62); E8 [class=hidden] @(2.18, 0.67); E9 [class=hidden] @(2.25, 0.73); E10 [class=hidden] @(2.32, 0.79); E11 [class=hidden] @(2.39, 0.85); E12 [class=hidden] @(2.46, 0.91); E13 [class=hidden] @(2.55, 0.92); E14 [class=hidden] @(2.64, 0.88); E15 [class=hidden] @(2.71, 0.82)
pe -- E1 -- E2 -- E3 -- E4 -- E5 -- E6 -- E7 -- E8 -- E9 -- E10 -- E11 -- E12 -- E13 -- E14 -- E15 -- qe [class=bold]
F1 [class=hidden] @(0.73, 0.79); F2 [class=hidden] @(0.64, 0.81); F3 [class=hidden] @(0.55, 0.82); F4 [class=hidden] @(0.46, 0.83); F5 [class=hidden] @(0.37, 0.86); F6 [class=hidden] @(0.29, 0.89); F7 [class=hidden] @(0.21, 0.93)
pf -- F1 -- F2 -- F3 -- F4 -- F5 -- F6 -- F7 -- qf [class=bold]
G1 [class=hidden] @(0.79, 0.39); G2 [class=hidden] @(0.71, 0.33); G3 [class=hidden] @(0.65, 0.28); G4 [class=hidden] @(0.58, 0.22); G5 [class=hidden] @(0.51, 0.17); G6 [class=hidden] @(0.43, 0.12)
pg -- G1 -- G2 -- G3 -- G4 -- G5 -- G6 -- qg [class=bold]
H1 [class=hidden] @(1.19, 0.16); H2 [class=hidden] @(1.27, 0.11); H3 [class=hidden] @(1.35, 0.08); H4 [class=hidden] @(1.44, 0.05); H5 [class=hidden] @(1.53, 0.03); H6 [class=hidden] @(1.62, 0.01); H7 [class=hidden] @(1.71, 0)
ph -- H1 -- H2 -- H3 -- H4 -- H5 -- H6 -- H7 -- qh [class=bold]
K1 [class=hidden] @(0.43, 1.53); K2 [class=hidden] @(0.52, 1.54); K3 [class=hidden] @(0.6, 1.55); K4 [class=hidden] @(0.69, 1.56); K5 [class=hidden] @(0.78, 1.57); K6 [class=hidden] @(0.86, 1.57); K7 [class=hidden] @(0.95, 1.57); K8 [class=hidden] @(1.04, 1.58); K9 [class=hidden] @(1.13, 1.58); K10 [class=hidden] @(1.22, 1.58); K11 [class=hidden] @(1.31, 1.58); K12 [class=hidden] @(1.39, 1.58); K13 [class=hidden] @(1.48, 1.58); K14 [class=hidden] @(1.57, 1.58); K15 [class=hidden] @(1.66, 1.58); K16 [class=hidden] @(1.74, 1.58); K17 [class=hidden] @(1.83, 1.58); K18 [class=hidden] @(1.92, 1.57); K19 [class=hidden] @(2, 1.57); K20 [class=hidden] @(2.08, 1.56); K21 [class=hidden] @(2.17, 1.55); K22 [class=hidden] @(2.25, 1.54); K23 [class=hidden] @(2.35, 1.53); K24 [class=hidden] @(2.43, 1.52); K25 [class=hidden] @(2.52, 1.5); K26 [class=hidden] @(2.61, 1.48); K27 [class=hidden] @(2.7, 1.45); K28 [class=hidden] @(2.78, 1.42); K29 [class=hidden] @(2.86, 1.37); K30 [class=hidden] @(2.92, 1.31)
pk -- K1 -- K2 -- K3 -- K4 -- K5 -- K6 -- K7 -- K8 -- K9 -- K10 -- K11 -- K12 -- K13 -- K14 -- K15 -- K16 -- K17 -- K18 -- K19 -- K20 -- K21 -- K22 -- K23 -- K24 -- K25 -- K26 -- K27 -- K28 -- K29 -- K30 -- qk [class=bold]
mark Pe: pe--E1 E1--E2 E2--E3 E3--E4 E4--E5 E5--E6 E6--E7 E7--E8 E8--E9 E9--E10 E10--E11 E11--E12 E12--E13 E13--E14 E14--E15 E15--qe
step: Straight segments from each vertex to the cut points.
remove x--pe qe--y x--pf qf--a x--pg qg--b x--ph qh--c a--pk qk--y
x -- pe; qe -- y
x -- pf; qf -- a
x -- pg; qg -- b
x -- ph; qh -- c
a -- pk; qk -- y
mark eprime: x--pe pe--E1 E1--E2 E2--E3 E3--E4 E4--E5 E5--E6 E6--E7 E7--E8 E8--E9 E9--E10 E10--E11 E11--E12 E12--E13 E13--E14 E14--E15 E15--qe qe--y
```

::: step
We take any planar drawing [[fig:t06-poly-construction#D|$D$]] of $G$; it exists because the
lemma assumes that $G$ is planar. A loop has the same point at both ends, so we first put a new
vertex in the middle of each loop's arc. That gives two edges with different ends. We remove the
new vertex at the end.
:::

::: step
Each edge with its ends is a continuous image of $[0,1]$, so it is compact. A vertex that is
not an end of an edge is not on it, so it has a positive distance from it. There are finitely
many pairs, so the smallest distance $\delta$ exists and is positive. Here:
[[fig:t06-poly-construction#delta|$c$ and the wavy edge]], about 0.62 apart.
:::

::: step
Different vertices sit at different points, so the smallest distance $\nu$ between two
vertices is positive. We choose $\delta' = \min(\delta, \nu/3)$. Here
[[fig:t06-poly-construction#nu|$x$ and $c$]] are the closest, about 1.19 apart. A third of that
is about 0.40, less than $\delta$, so $\delta'$ is about 0.40.
:::

::: step
Around every vertex $x$ we take the closed disk [[fig:t06-poly-construction#Bx|$B_x$]] of
radius $\delta'$. Centres are at least $\nu$ apart, radii at most a third of that, so the
disks are disjoint. An edge that does not end at the centre stays at least $\delta$ away,
and $\delta$ is at least the radius, so it misses the inside of the disk.
:::

::: step
We cut each edge $e$ twice: at $p_e$, its last point in the disk of its first end, and at
$q_e$, its first point after that in the disk of its other end. The
[[fig:t06-poly-construction#me|middle piece $m_e$]] between them meets the two disks only
there. With the previous step, all of it is at least $\delta'$ away from every vertex.
:::

::: step
The cut points are not the ends of the edge, so $m_e$ lies inside its arc. Arcs of different
edges are disjoint and the pieces are compact, so two pieces have a positive distance. Let
$\varepsilon$ be the smallest one, or $\delta'$ if that is smaller. Here:
[[fig:t06-poly-construction#eps|the two closest pieces]], about 0.33 apart.
:::

::: step
The edge's map is uniformly continuous on a closed interval, so we can pick points along
$m_e$, cut point to cut point, with neighbours less than a third of $\varepsilon$ apart.
[[fig:t06-poly-construction#Pe|$P_e$]] is the polygonal line through them. Each segment is that
short and starts on $m_e$, so all of $P_e$ stays that close to $m_e$. Here: 16 segments.
:::

::: step
The new edge [[fig:t06-poly-construction#eprime|$e'$]] is the straight segment from one end to
the first cut point, then $P_e$, then the segment from the second cut point to the other end.
It may pass a point twice. But a polygonal line between two points contains a polygonal line
between the same points that passes no point twice; we keep that.
:::
::::

Then we **check** that the new edges form a planar drawing: a meeting point of two new edges
other than a common end would put two old pieces closer than $\varepsilon$.

:::: walkthrough {for=lem:polygonal-drawing}
```graph id=t06-poly-check widget=stepper
caption: Checking the new drawing. In each step the marked parts are the ones that might meet; at the end the dashed circles go away.
intent: New figure: the end state of t06-poly-construction (same vertices, disks, cut points and polygonal lines). Each step marks the parts that one case of the check compares.
layout: fixed
a @(0, 1.3); b @(0, 0); x @(1.2, 0.65); c @(2.2, 0); y @(3.15, 0.9)
a0 [class=hidden] @(0.4, 1.3); a1 [class=hidden] @(0.37, 1.45); a2 [class=hidden] @(0.28, 1.58); a3 [class=hidden] @(0.15, 1.67); a4 [class=hidden] @(0, 1.7); a5 [class=hidden] @(-0.15, 1.67); a6 [class=hidden] @(-0.28, 1.58); a7 [class=hidden] @(-0.37, 1.45); a8 [class=hidden] @(-0.4, 1.3); a9 [class=hidden] @(-0.37, 1.15); a10 [class=hidden] @(-0.28, 1.02); a11 [class=hidden] @(-0.15, 0.93); a12 [class=hidden] @(0, 0.9); a13 [class=hidden] @(0.15, 0.93); a14 [class=hidden] @(0.28, 1.02); a15 [class=hidden] @(0.37, 1.15)
b0 [class=hidden] @(0.4, 0); b1 [class=hidden] @(0.37, 0.15); b2 [class=hidden] @(0.28, 0.28); b3 [class=hidden] @(0.15, 0.37); b4 [class=hidden] @(0, 0.4); b5 [class=hidden] @(-0.15, 0.37); b6 [class=hidden] @(-0.28, 0.28); b7 [class=hidden] @(-0.37, 0.15); b8 [class=hidden] @(-0.4, 0); b9 [class=hidden] @(-0.37, -0.15); b10 [class=hidden] @(-0.28, -0.28); b11 [class=hidden] @(-0.15, -0.37); b12 [class=hidden] @(0, -0.4); b13 [class=hidden] @(0.15, -0.37); b14 [class=hidden] @(0.28, -0.28); b15 [class=hidden] @(0.37, -0.15)
x0 [class=hidden] @(1.6, 0.65); x1 [class=hidden] @(1.57, 0.8); x2 [class=hidden] @(1.48, 0.93); x3 [class=hidden] @(1.35, 1.02); x4 [class=hidden] @(1.2, 1.05); x5 [class=hidden] @(1.05, 1.02); x6 [class=hidden] @(0.92, 0.93); x7 [class=hidden] @(0.83, 0.8); x8 [class=hidden] @(0.8, 0.65); x9 [class=hidden] @(0.83, 0.5); x10 [class=hidden] @(0.92, 0.37); x11 [class=hidden] @(1.05, 0.28); x12 [class=hidden] @(1.2, 0.25); x13 [class=hidden] @(1.35, 0.28); x14 [class=hidden] @(1.48, 0.37); x15 [class=hidden] @(1.57, 0.5)
c0 [class=hidden] @(2.6, 0); c1 [class=hidden] @(2.57, 0.15); c2 [class=hidden] @(2.48, 0.28); c3 [class=hidden] @(2.35, 0.37); c4 [class=hidden] @(2.2, 0.4); c5 [class=hidden] @(2.05, 0.37); c6 [class=hidden] @(1.92, 0.28); c7 [class=hidden] @(1.83, 0.15); c8 [class=hidden] @(1.8, 0); c9 [class=hidden] @(1.83, -0.15); c10 [class=hidden] @(1.92, -0.28); c11 [class=hidden] @(2.05, -0.37); c12 [class=hidden] @(2.2, -0.4); c13 [class=hidden] @(2.35, -0.37); c14 [class=hidden] @(2.48, -0.28); c15 [class=hidden] @(2.57, -0.15)
y0 [class=hidden] @(3.55, 0.9); y1 [class=hidden] @(3.52, 1.05); y2 [class=hidden] @(3.43, 1.18); y3 [class=hidden] @(3.3, 1.27); y4 [class=hidden] @(3.15, 1.3); y5 [class=hidden] @(3, 1.27); y6 [class=hidden] @(2.87, 1.18); y7 [class=hidden] @(2.78, 1.05); y8 [class=hidden] @(2.75, 0.9); y9 [class=hidden] @(2.78, 0.75); y10 [class=hidden] @(2.87, 0.62); y11 [class=hidden] @(3, 0.53); y12 [class=hidden] @(3.15, 0.5); y13 [class=hidden] @(3.3, 0.53); y14 [class=hidden] @(3.43, 0.62); y15 [class=hidden] @(3.52, 0.75)
a0 -- a1 -- a2 -- a3 -- a4 -- a5 -- a6 -- a7 -- a8 -- a9 -- a10 -- a11 -- a12 -- a13 -- a14 -- a15 -- a0 [class=dashed]
b0 -- b1 -- b2 -- b3 -- b4 -- b5 -- b6 -- b7 -- b8 -- b9 -- b10 -- b11 -- b12 -- b13 -- b14 -- b15 -- b0 [class=dashed]
x0 -- x1 -- x2 -- x3 -- x4 -- x5 -- x6 -- x7 -- x8 -- x9 -- x10 -- x11 -- x12 -- x13 -- x14 -- x15 -- x0 [class=dashed]
c0 -- c1 -- c2 -- c3 -- c4 -- c5 -- c6 -- c7 -- c8 -- c9 -- c10 -- c11 -- c12 -- c13 -- c14 -- c15 -- c0 [class=dashed]
y0 -- y1 -- y2 -- y3 -- y4 -- y5 -- y6 -- y7 -- y8 -- y9 -- y10 -- y11 -- y12 -- y13 -- y14 -- y15 -- y0 [class=dashed]
pe [class=hidden] @(1.55, 0.83); qe [class=hidden] @(2.77, 0.78)
pf [class=hidden] @(0.82, 0.77); qf [class=hidden] @(0.18, 0.95)
pg [class=hidden] @(0.86, 0.44); qg [class=hidden] @(0.39, 0.09)
ph [class=hidden] @(1.2, 0.25); qh [class=hidden] @(1.8, -0.01)
pk [class=hidden] @(0.34, 1.5); qk [class=hidden] @(2.97, 1.25)
E1 [class=hidden] @(1.64, 0.85); E2 [class=hidden] @(1.73, 0.82); E3 [class=hidden] @(1.8, 0.76); E4 [class=hidden] @(1.87, 0.7); E5 [class=hidden] @(1.94, 0.64); E6 [class=hidden] @(2.02, 0.6); E7 [class=hidden] @(2.11, 0.62); E8 [class=hidden] @(2.18, 0.67); E9 [class=hidden] @(2.25, 0.73); E10 [class=hidden] @(2.32, 0.79); E11 [class=hidden] @(2.39, 0.85); E12 [class=hidden] @(2.46, 0.91); E13 [class=hidden] @(2.55, 0.92); E14 [class=hidden] @(2.64, 0.88); E15 [class=hidden] @(2.71, 0.82)
pe -- E1 -- E2 -- E3 -- E4 -- E5 -- E6 -- E7 -- E8 -- E9 -- E10 -- E11 -- E12 -- E13 -- E14 -- E15 -- qe
F1 [class=hidden] @(0.73, 0.79); F2 [class=hidden] @(0.64, 0.81); F3 [class=hidden] @(0.55, 0.82); F4 [class=hidden] @(0.46, 0.83); F5 [class=hidden] @(0.37, 0.86); F6 [class=hidden] @(0.29, 0.89); F7 [class=hidden] @(0.21, 0.93)
pf -- F1 -- F2 -- F3 -- F4 -- F5 -- F6 -- F7 -- qf
G1 [class=hidden] @(0.79, 0.39); G2 [class=hidden] @(0.71, 0.33); G3 [class=hidden] @(0.65, 0.28); G4 [class=hidden] @(0.58, 0.22); G5 [class=hidden] @(0.51, 0.17); G6 [class=hidden] @(0.43, 0.12)
pg -- G1 -- G2 -- G3 -- G4 -- G5 -- G6 -- qg
H1 [class=hidden] @(1.19, 0.16); H2 [class=hidden] @(1.27, 0.11); H3 [class=hidden] @(1.35, 0.08); H4 [class=hidden] @(1.44, 0.05); H5 [class=hidden] @(1.53, 0.03); H6 [class=hidden] @(1.62, 0.01); H7 [class=hidden] @(1.71, 0)
ph -- H1 -- H2 -- H3 -- H4 -- H5 -- H6 -- H7 -- qh
K1 [class=hidden] @(0.43, 1.53); K2 [class=hidden] @(0.52, 1.54); K3 [class=hidden] @(0.6, 1.55); K4 [class=hidden] @(0.69, 1.56); K5 [class=hidden] @(0.78, 1.57); K6 [class=hidden] @(0.86, 1.57); K7 [class=hidden] @(0.95, 1.57); K8 [class=hidden] @(1.04, 1.58); K9 [class=hidden] @(1.13, 1.58); K10 [class=hidden] @(1.22, 1.58); K11 [class=hidden] @(1.31, 1.58); K12 [class=hidden] @(1.39, 1.58); K13 [class=hidden] @(1.48, 1.58); K14 [class=hidden] @(1.57, 1.58); K15 [class=hidden] @(1.66, 1.58); K16 [class=hidden] @(1.74, 1.58); K17 [class=hidden] @(1.83, 1.58); K18 [class=hidden] @(1.92, 1.57); K19 [class=hidden] @(2, 1.57); K20 [class=hidden] @(2.08, 1.56); K21 [class=hidden] @(2.17, 1.55); K22 [class=hidden] @(2.25, 1.54); K23 [class=hidden] @(2.35, 1.53); K24 [class=hidden] @(2.43, 1.52); K25 [class=hidden] @(2.52, 1.5); K26 [class=hidden] @(2.61, 1.48); K27 [class=hidden] @(2.7, 1.45); K28 [class=hidden] @(2.78, 1.42); K29 [class=hidden] @(2.86, 1.37); K30 [class=hidden] @(2.92, 1.31)
pk -- K1 -- K2 -- K3 -- K4 -- K5 -- K6 -- K7 -- K8 -- K9 -- K10 -- K11 -- K12 -- K13 -- K14 -- K15 -- K16 -- K17 -- K18 -- K19 -- K20 -- K21 -- K22 -- K23 -- K24 -- K25 -- K26 -- K27 -- K28 -- K29 -- K30 -- qk
x -- pe; qe -- y
x -- pf; qf -- a
x -- pg; qg -- b
x -- ph; qh -- c
a -- pk; qk -- y
mark eprime: x--pe pe--E1 E1--E2 E2--E3 E3--E4 E4--E5 E5--E6 E6--E7 E7--E8 E8--E9 E9--E10 E10--E11 E11--E12 E12--E13 E13--E14 E14--E15 E15--qe qe--y
step: The new edge $e'$ of $xy$.
class highlight: x--pe pe--E1 E1--E2 E2--E3 E3--E4 E4--E5 E5--E6 E6--E7 E7--E8 E8--E9 E9--E10 E10--E11 E11--E12 E12--E13 E13--E14 E14--E15 E15--qe qe--y
class current: a b c
mark others: a b c
step: The polygonal lines of two edges.
unclass highlight: x--pe pe--E1 E1--E2 E2--E3 E3--E4 E4--E5 E5--E6 E6--E7 E7--E8 E8--E9 E9--E10 E10--E11 E11--E12 E12--E13 E13--E14 E14--E15 E15--qe qe--y
unclass current: a b c
class highlight: pf--F1 F1--F2 F2--F3 F3--F4 F4--F5 F5--F6 F6--F7 F7--qf pg--G1 G1--G2 G2--G3 G3--G4 G4--G5 G5--G6 G6--qg
mark Pe: pf--F1 F1--F2 F2--F3 F3--F4 F4--F5 F5--F6 F6--F7 F7--qf
mark Pf: pg--G1 G1--G2 G2--G3 G3--G4 G4--G5 G5--G6 G6--qg
step: The straight segments at $x$.
unclass highlight: pf--F1 F1--F2 F2--F3 F3--F4 F4--F5 F5--F6 F6--F7 F7--qf pg--G1 G1--G2 G2--G3 G3--G4 G4--G5 G5--G6 G6--qg
class highlight: x--pe x--pf x--pg x--ph
mark radii: x--pe x--pf x--pg x--ph
step: A segment at $x$ and the polygonal line of another edge.
unclass highlight: x--pe x--pf x--ph
class highlight: pf--F1 F1--F2 F2--F3 F3--F4 F4--F5 F5--F6 F6--F7 F7--qf
mark xpf: x--pg
step: The far end of the segment lies on another piece.
class highlight: pg--G1 G1--G2 G2--G3 G3--G4 G4--G5 G5--G6 G6--qg
step: The finished drawing with polygonal lines.
unclass highlight: x--pg pf--F1 F1--F2 F2--F3 F3--F4 F4--F5 F5--F6 F6--F7 F7--qf pg--G1 G1--G2 G2--G3 G3--G4 G4--G5 G5--G6 G6--qg
remove a0 a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12 a13 a14 a15 b0 b1 b2 b3 b4 b5 b6 b7 b8 b9 b10 b11 b12 b13 b14 b15 x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 y0 y1 y2 y3 y4 y5 y6 y7 y8 y9 y10 y11 y12 y13 y14 y15
```

::: step
First, [[fig:t06-poly-check#eprime|$e'$]] meets no vertex except its ends. Its straight
segments lie in the disks of its ends, which hold no other vertex. Every point of $P_e$ is
closer than a third of $\varepsilon$ to $m_e$, and $\varepsilon$ is at most $\delta'$; every
vertex is at least $\delta'$ from the piece. So
[[fig:t06-poly-check#others|$a$, $b$ and $c$]] stay off.
:::

::: step
Take two different edges $e$ and $f$; here $e$ goes to $a$ and $f$ to $b$. A common point of
[[fig:t06-poly-check#Pe|$P_e$]] and [[fig:t06-poly-check#Pf|$P_f$]] would be closer than a third
of $\varepsilon$ to both pieces. Then the pieces would be closer than two thirds of
$\varepsilon$, but by the choice of $\varepsilon$ they are at least $\varepsilon$ apart.
:::

::: step
Now the [[fig:t06-poly-check#radii|straight segments at $x$]]. Segments in different disks are
disjoint, because the disks are. Two segments in one disk end at $p_e$ and $p_f$ on its circle.
These points differ, since they lie on the disjoint pieces $m_e$ and $m_f$. So the two segments
meet only in the centre, a common end.
:::

::: step
Last, the [[fig:t06-poly-check#xpf|segment from $x$ to $p_f$]] and $P_e$. Suppose a point $r$
lies on both. It is closer than a third of $\varepsilon$ to $m_e$, and every point of $m_e$ is
at least $\delta'$ away from $x$. So $r$ is farther than $\delta'$ minus a third of
$\varepsilon$ from $x$.
:::

::: step
The segment has length $\delta'$, so $r$ is closer than a third of $\varepsilon$ to its far end
$p_f$. Then $p_f$ is closer than two thirds of $\varepsilon$ to $m_e$. But $p_f$ is the first
point of [[fig:t06-poly-check#Pf|$P_f$]] and lies on $m_f$, which is at least $\varepsilon$
away from $m_e$. This is a contradiction.
:::

::: step
So two new edges meet at most in common ends, and no new edge runs through another vertex: we
have a planar drawing in which every edge is a polygonal line. If we split a loop, its two
halves meet only in the two vertices. We join them into one closed polygonal line and remove the
new vertex.
:::
::::

::: proof
Take any planar drawing $D$ of $G$. For an edge $e$ with ends $u$ and $v$, let
$\alpha_e : [0,1] \to \R^2$ be the map of its arc, with $\alpha_e(0) = u$ and $\alpha_e(1) = v$,
and let $\bar e = \alpha_e([0,1])$ be the arc together with its ends. If $G$ has no edges,
there is nothing to prove.

*Loops.* If $e$ is a loop, we add a new vertex at the point $\alpha_e(\frac12)$. This splits $e$
into two edges with different ends, drawn by $\alpha_e$ on $[0, \frac12]$ and on $[\frac12, 1]$.
The drawing stays planar, because $\alpha_e$ is injective on $(0,1)$ and the arc of $e$ is
disjoint from all other arcs. We remove these new vertices at the end. So we may assume that
$G$ has no loops; as $G$ has an edge, it has at least two vertices.

*The numbers $\delta$ and $\delta'$.* Each $\bar e$ is compact, as a continuous image of
$[0,1]$, and $G$ is finite, so $D$ is compact. Let $x$ be a vertex and $e$ an edge not incident
with $x$. Then $x \notin \bar e$: the arc of $e$ is disjoint from all vertices, and the ends of
$e$ are other vertices. As $\bar e$ is closed, the distance from $x$ to $\bar e$ is positive.
There are finitely many such pairs, so there is a minimum $\delta$ of these distances, and
$\delta > 0$ (if there is no such pair, let $\delta = 1$). So the distance from any vertex $x$
to an edge not incident with $x$ is at least $\delta$. Let $\nu > 0$ be the minimum distance
between two vertices; it is positive because the vertices are mapped to different points. We
choose $\delta' = \min(\delta, \nu/3)$.

*Disks.* For a vertex $x$, let $B_x$ be the closed disk of radius $\delta'$ around $x$. Two such
disks are disjoint, as their centres are at least $\nu$ apart and their radii are at most
$\nu/3$. So $B_x$ contains no vertex other than $x$. An edge not incident with $x$ has distance
at least $\delta \ge \delta'$ from $x$, so it has no point in the interior of $B_x$.

*Cutting the edges.* Let $e$ be an edge with ends $x$ and $y$. Let $s_e$ be the largest
$t \in [0,1]$ with $\alpha_e(t) \in B_x$, and $t_e$ the smallest $t \ge s_e$ with
$\alpha_e(t) \in B_y$; they exist as $B_x$ and $B_y$ are closed and $\alpha_e$ is continuous.
Since $\alpha_e(1) = y \notin B_x$, we have $s_e < 1$, and since $\alpha_e(s_e) \notin B_y$, we
have $s_e < t_e$. As $\alpha_e(t)$ tends to $x$ for $t \to 0$ and to $y$ for $t \to 1$, we get
$0 < s_e$ and $t_e < 1$. Let $p_e = \alpha_e(s_e)$, $q_e = \alpha_e(t_e)$ and
$m_e = \alpha_e([s_e, t_e])$. By the choice of $s_e$ and $t_e$, $m_e$ meets $B_x$ only in $p_e$
and $B_y$ only in $q_e$, so $p_e$ and $q_e$ lie on the boundary circles of $B_x$ and $B_y$.
With the previous paragraph, every point of $m_e$ has distance at least $\delta'$ from every
vertex. As $0 < s_e < t_e < 1$, $m_e$ lies in the arc of $e$, so the pieces $m_e$ and $m_f$ of
two different edges are disjoint.

*The number $\varepsilon$.* The pieces $m_e$ are compact and pairwise disjoint, so any two of
them have a positive distance. Let $\varepsilon > 0$ be the minimum of $\delta'$ and of the
distances between the pieces of two different edges.

*Polygonal lines.* $\alpha_e$ is uniformly continuous on $[s_e, t_e]$, so there are
$s_e = \tau_0 < \tau_1 < \dots < \tau_k = t_e$ such that $\alpha_e(\tau_{i-1})$ and
$\alpha_e(\tau_i)$ are less than $\varepsilon/3$ apart for every $i$. Let $P_e$ be the polygonal
line through $\alpha_e(\tau_0), \dots, \alpha_e(\tau_k)$; it goes from $p_e$ to $q_e$. Each of
its segments is shorter than $\varepsilon/3$ and starts at a point of $m_e$, so every point of
$P_e$ has distance less than $\varepsilon/3$ from $m_e$. The segment $x p_e$, then $P_e$, then the
segment $q_e y$ form a polygonal walk from $x$ to $y$. A polygonal walk from $x$ to $y$ contains
a polygonal path from $x$ to $y$, that is, a polygonal line from $x$ to $y$ that passes no point
twice. Let $e'$ be such a path; it is contained in $x p_e \cup P_e \cup q_e y$.

*The new drawing is planar.* We keep every vertex where $D$ puts it and draw every edge $e$ as
$e'$.

(a) $e'$ contains no vertex other than its ends, and each end only once. The segment $x p_e$
lies in $B_x$, which contains no vertex other than $x$, and contains $x$ only as its end; the
same holds for $q_e y$. A point of $P_e$ has distance less than $\varepsilon/3 < \delta'$ from
$m_e$, while every vertex has distance at least $\delta'$ from $m_e$; so $P_e$ contains no
vertex.

(b) Let $e \ne f$ be edges. Then $P_e \cap P_f = \emptyset$: a common point would have distance
less than $\varepsilon/3$ from both $m_e$ and $m_f$, so the distance of $m_e$ and $m_f$ would be
less than $2\varepsilon/3 < \varepsilon$.

(c) The segments at the ends of $e$ and $f$ meet at most in a common end of $e$ and $f$.
Segments in different disks are disjoint. Two segments $x p_e$ and $x p_f$ in the same disk
$B_x$ end at the points $p_e \ne p_f$ of its boundary circle ($p_e \in m_e$, $p_f \in m_f$, and
these pieces are disjoint), so they meet only in the centre $x$.

(d) A segment $x p_f$ and $P_e$ are disjoint. Suppose $r$ is a common point. Every point of
$m_e$ has distance at least $\delta'$ from $x$, and $r$ has distance less than $\varepsilon/3$
from $m_e$, so $|r x| > \delta' - \varepsilon/3$. As $r$ lies on the segment $x p_f$ of length
$\delta'$, we get $|r p_f| = \delta' - |r x| < \varepsilon/3$. Then the distance of $p_f$ from
$m_e$ is less than $2\varepsilon/3$; but $p_f \in m_f$, which has distance at least
$\varepsilon$ from $m_e$, a contradiction.

By (a) to (d), each $e'$ is an open arc with ends $x$ and $y$ that is disjoint from all
vertices, and $e'$ and $f'$ are disjoint for $e \ne f$, apart from common ends. So this is a
planar drawing of $G$ in which every edge is a polygonal line.

*Back to loops.* If we split a loop $e$ at $x$ with a new vertex $w$, its two halves are now
polygonal lines from $x$ to $w$ and from $w$ to $x$ that meet only in $x$ and $w$. Together
they form a closed polygonal line through $x$ that passes every other point once. We remove
$w$ and draw $e$ as this line: it is an open arc with both ends $x$, it is disjoint from all
vertices, and it is disjoint from the other arcs, as its two halves were.
:::

<!-- SOURCE UNCLEAR: resources/graph-theory/2026-10-20-13_44_38-join.pdf p.2 — the board defines δ, ν and δ' in words; ε appears only in the drawings (an arrow between two edges just outside the disk around x, and strips around an edge labelled ε/3). Read here as the minimum distance between the middle pieces of two edges, taken at most δ'. The cutting, the polygonal lines and the check are filled in from those drawings. -->

::: pitfall
The cut point $p_e$ is the **last** point of the edge in $B_x$, not the first. An edge may leave
the disk and come back, as [[fig:t06-poly-construction#wiggle|the edge $xc$]] does. Cutting at
the first exit would keep a piece that runs back into $B_x$. Then not every point of $m_e$ is
at least $\delta'$ from $x$, and two checks use that: $P_e$ avoids the end $x$ (check (a)),
and a segment at $x$ misses the polygonal line of another edge (check (d)).
:::

## Check yourself

:::: quiz {#q:t06-delta-prime}
Why does the proof take $\delta'$ at most a third of $\nu$?

- [ ] So that no edge enters the disk around a vertex that is not one of its ends.
- [x] So that the disks around two different vertices are disjoint.
- [ ] So that the polygonal lines of two different edges are disjoint.

::: explanation
Two vertices are at least $\nu$ apart, and two disks of radius at most $\nu/3$ around them
cannot meet. The first answer is what $\delta' \le \delta$ is for, and the third is what the
choice of $\varepsilon$ is for.
:::
::::
