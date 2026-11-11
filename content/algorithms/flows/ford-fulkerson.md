---
title: "The Ford–Fulkerson algorithm"
course: algorithms
chapter: flows
order: 8
lectures: [a02]
stage: split
status: draft
---

::: algorithm {#alg:ford-fulkerson title="Ford–Fulkerson algorithm (1955)" source="algorithms/02 p14"}
```pseudo
FORD-FULKERSON(G, s, t, c):
    foreach e ∈ E do f(e) ← 0                          // @init
    G_f ← the residual graph for f                      // @residual
    while there is an augmenting s–t path in G_f do      // @loop
        P ← an augmenting s–t path in G_f                // @path
        f ← AUGMENT(f, c, P)                             // @augment
        update G_f                                       // @update
    return f                                             // @return
```
:::

**Correctness:** the [[def:flow|flow]] $f$ has a maximum value iff $G_f$ contains no [[def:augmenting-path|augmenting path]]
([[thm:maxflow-characterisation]], which follows from the max-flow min-cut theorem); so if the algorithm terminates, it returns a maximum flow.

::: intuition {for=alg:ford-fulkerson}
Start with nothing and keep improving: find any route in the [[def:residual-network|residual graph]] with spare room, push as much as it allows,
repeat. Every step keeps $f$ a flow ([[lem:augment]]) and increases its value, and when no route is left, the reachable set is a minimum cut.
The method leaves open **which** augmenting path to take; this choice decides the running time (see below). Example: [[ex:ford-fulkerson-demo]]
reaches the maximum $19$ after four augmentations.
:::

::: pitfall
Ford–Fulkerson may increase the flow on an edge and later decrease it again (step 4 of the demo cancels the flow on $(a, b)$). A greedy method
that never uses reverse edges is not Ford–Fulkerson and does not always find a maximum flow.
:::

```graph id=a02-ford-fulkerson-player widget=player
caption: Ford–Fulkerson on the lecture network. The residual network is shown next to the flow; at the end, the reachable set gives a minimum cut. (The player finds paths by depth-first search, so its sequence of augmentations may differ from the demo below; the final value 19 is the same.)
intent: Algorithm player; path choice by DFS (any augmenting path); show residual panel.
type: directed
algo: ford-fulkerson
params: source=s sink=t choice=dfs
show: pseudocode state residual
layout: fixed
s [class=source] @(0, 0); a @(1.5, 1); b @(1.5, 0); c @(3, 1); d @(3, 0); t [class=sink] @(4.5, 0)
s -> a [c=10]; s -> b [c=10]; a -> b [c=2]; a -> c [c=4]; a -> d [c=8]; b -> d [c=9]; d -> c [c=9]; c -> t [c=10]; d -> t [c=10]
```

::: example {#ex:ford-fulkerson-demo title="The lecture demo" source="algorithms/02 p15–21"}
On the network above, starting from $f_0 = 0$:

1. Augment along $s \to a \to d \to t$ with bottleneck $8$ (edge $ad$): $\abs{f_1} = 8$.
2. In $G_{f_1}$, augment along $s \to a \to b \to d \to t$ with bottleneck $2$ (residual capacities $2, 2, 9, 2$): $\abs{f_2} = 10$.
3. In $G_{f_2}$, augment along $s \to b \to d \to c \to t$ with bottleneck $7$ (edge $bd$ has residual capacity $9 - 2 = 7$): $\abs{f_3} = 17$.
4. In $G_{f_3}$, augment along $s \to b \to a \to c \to t$, where $b \to a$ is the **reverse** of the edge $(a, b)$ carrying $2$ units; bottleneck $2$: $\abs{f_4} = 19$.
   The augmentation cancels the flow on $(a, b)$.

Now the vertices reachable from $s$ in the residual graph are $S = \set{s, b}$ ($(s, a)$ and $(b, d)$ are saturated, and $(a, b)$ carries no flow), so the algorithm
stops. The cut $(\set{s, b}, \set{a, c, d, t})$ has capacity $c(s, a) + c(b, d) = 10 + 9 = 19 = \abs{f_4}$, so the flow is maximum.
:::
