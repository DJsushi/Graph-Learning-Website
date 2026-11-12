---
title: "Residual networks"
course: algorithms
chapter: flows
order: 5
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:residual-network title="Residual network" defines="residual graph, residual capacity, residual network" source="algorithms/02 p10"}
The **residual network** for a [[def:flow|flow]] $f$ consists of

1. the **residual graph** $G_f = (V, E_f)$, where $E_f$ contains, for each edge $e = (u, v) \in E$,
   - the edge $e = (u, v)$ if $f(e) < c(e)$, and
   - the **reverse** edge $e^R = (v, u)$ if $f(e) > 0$;
2. the **residual capacities**
$$c_f(e) = c(e) - f(e) \ \text{ for } e \in E_f \cap E, \qquad c_f(e^R) = f(e) \ \text{ for } e^R \in E_f.$$
:::

The residual capacity says how much more flow can be pushed along $e$ (forward) without exceeding its [[def:flow-network|capacity]], or how
much of the existing flow on $e$ can be cancelled (backward, along $e^R$).
<!-- REVIEW: added the antiparallel-edge remark. Slides forbid only parallel edges, so G may contain (u,v) and (v,u) (e.g. exr a02-ex-max-flow-value); then G_f may contain two copies of (v,u), which must be kept apart. -->
If $G$ contains both $e = (u, v)$ and $e' = (v, u)$, then $G_f$ may contain two edges from $v$ to $u$: the forward edge $e'$ and the
reverse edge $e^R$. They are kept as two distinct residual edges with their own residual capacities ($G_f$ is then a
[[def:mixed-multigraph|multigraph]]).

::: intuition {for=def:residual-network}
$G_f$ lists every way the current flow can still be changed by one step: push more along $e$ where it is not full, or take back some of
what $e$ already carries by going along $e^R$. Undoing flow is essential, since an early bad choice may have to be corrected later.
Example: an edge with $c(e) = 7$ and $f(e) = 3$ gives the residual edges $e$ with $c_f(e) = 4$ and $e^R$ with $c_f(e^R) = 3$; a saturated
edge ($f = c$) gives only $e^R$, an unused one ($f = 0$) only $e$. In [[fig:a02-residual-example]] the saturated edge $(a, d)$ is replaced by
$(d, a)$ with residual capacity $8$.
:::

```graph id=a02-residual-example widget=figure
caption: A flow of value 8 (left) and its residual network (right). Saturated edges disappear forward; edges with flow get a reverse edge.
intent: Transcription of the lecture's residual graph example.
type: directed
layout: fixed
layout-sync: true
panel: network $G$ with flow $f$
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [f=8 c=10]; s -> b [f=0 c=10]; a -> b [f=0 c=2]; a -> c [f=0 c=4]; a -> d [f=8 c=8]; b -> d [f=0 c=9]; d -> c [f=0 c=9]; c -> t [f=0 c=10]; d -> t [f=8 c=10]
panel: residual network $G_f$
edge-label: "{c}"
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=2]; a -> s [c=8 class=back bend=0.3]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; d -> a [c=8 class=back]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=2]; t -> d [c=8 class=back bend=0.3]
```
