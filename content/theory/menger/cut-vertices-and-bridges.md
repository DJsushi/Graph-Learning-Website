---
title: "Cut vertices and bridges"
course: theory
chapter: menger
order: 2
lectures: [t05]
stage: split
status: draft
---

A single vertex or edge whose removal disconnects the graph has a name.

::: definition {#def:cut-vertex-bridge title="Cut vertex, bridge" defines="cut vertex, bridge" extra=true}
Let $G$ be a connected multigraph. A vertex $v$ is a **cut vertex** of $G$ if $G - v$ has at least two [[def:component|components]],
and an edge $e$ is a **bridge** of $G$ if $G - e$ has at least two components.
:::

::: intuition
Cut vertices and bridges are the single points of failure of a network. A connected graph with at least $3$ vertices is
$2$-connected iff it has no cut vertex, and a connected multigraph is $2$-edge-connected iff it has no bridge. Example: in the
left graph of [[fig:t05-connectivity-examples]], the middle vertex is a cut vertex, but there is no bridge. In a tree every edge is a bridge
([[exr:t05-bridge-cycle]]).
:::

::: pitfall
Neither notion implies the other. The left graph below has a cut vertex but no bridge, and in $K_2$ the only edge is a bridge,
but neither end is a cut vertex ($K_2 - v = K_1$ is connected). An end of a bridge is a cut vertex if and only if it has another neighbour.
:::


```graph id=t05-connectivity-examples widget=figure
caption: Left: a cut vertex in the middle; the graph is connected and even 2-edge-connected, but not 2-connected. Right: $K_4$ is 3-connected.
intent: Transcription of the lecture examples; distinguish vertex and edge connectivity.
height: small
panel: bowtie
layout: fixed
a @(0, 1); b @(0, 0); m [class=current] @(1, 0.5); c @(2, 1); d @(2, 0)
a -- b; a -- m; b -- m; m -- c; m -- d; c -- d
panel: $K_4$
use: K(4)
```
