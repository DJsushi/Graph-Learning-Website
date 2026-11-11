---
title: "Augmenting paths"
course: algorithms
chapter: flows
order: 6
lectures: [a02]
stage: split
status: draft
---

::: definition {#def:augmenting-path title="Augmenting path, bottleneck capacity" defines="augmenting path, bottleneck capacity" source="algorithms/02 p12"}
An **augmenting path** is a path $P$ from $s$ to $t$ in $G_f$. The **bottleneck capacity** $\delta$ of $P$ is the minimum residual capacity among the
edges of $P$.
:::

::: intuition
An augmenting path is a route along which every step can take $\delta > 0$ more units: forward edges that are not full and reverse edges
that cancel existing flow. Example: in [[fig:a02-residual-example]], $s \to a \to b \to d \to t$ is an augmenting path with residual capacities
$2, 2, 9, 2$, so $\delta = 2$. Non-example: $s \to a \to d \to t$ is no longer one, since $(a, d)$ is saturated and not in $G_f$.
:::

::: pitfall
Augmenting paths live in the residual graph $G_f$, not in $G$, and they may use reverse edges $e^R$. An algorithm that only looks for
$s$–$t$ paths of unsaturated edges of $G$ can get stuck below the maximum; see the [[def:blocking-flow|blocking flow]] in [[fig:a02-blocking-flow]].
:::

For an augmenting path $P$ with bottleneck capacity $\delta$, define
$$f'(e) = \begin{cases} f(e) + \delta & \text{if } e \in P, \\ f(e) - \delta & \text{if } e^R \in P, \\ f(e) & \text{otherwise.} \end{cases}$$

::: lemma {#lem:augment title="Augmenting increases the flow" source="algorithms/02 p12"}
$f'$ is a flow with $\abs{f'} = \abs{f} + \delta$.
:::

::: intuition
Along the path, each inner vertex receives $\delta$ more (or gives back $\delta$ less) on one side and passes on $\delta$ more (or takes back
$\delta$ less) on the other, so conservation survives, and $\delta$ never exceeds what any edge allows. Only $s$ gains: $\delta$ more leaves it.
Example: step 4 of [[ex:ford-fulkerson-demo]] goes $s \to b \to a \to c \to t$; at $b$, the $2$ units that used to go $a \to b$ are cancelled and
replaced by $2$ units from $s$, and at $a$ those $2$ units now go to $c$ instead of $b$.
:::

::: proof
*Capacities:* if $e \in P$, then $\delta \le c_f(e) = c(e) - f(e)$, so $f'(e) \le c(e)$; if $e^R \in P$, then $\delta \le c_f(e^R) = f(e)$, so $f'(e) \ge 0$. (Since $P$ is a path, it
visits every vertex at most once, so it cannot contain both $e = (u, v)$ and $e^R = (v, u)$; hence every $e \in E$ is changed at most once.)

*Conservation:* consider an inner vertex $v$ of $P$, entered by a residual edge and left by a residual edge. A forward residual edge $(u, v) = e$ increases the
inflow of $v$ by $\delta$; a backward residual edge $(u, v) = e^R$ with $e = (v, u)$ decreases the outflow of $v$ by $\delta$. Similarly, leaving $v$ forward increases
the outflow, and leaving backward decreases the inflow. In all four combinations, inflow $-$ outflow of $v$ is unchanged.

*Value:* the first edge of $P$ leaves $s$; since no edge of $G$ enters $s$, it is a forward edge $(s, v)$, so the outflow of $s$ grows by $\delta$, and $s$ is not visited
again.
:::

::: algorithm {#alg:augment title="AUGMENT" source="algorithms/02 p13"}
```pseudo
AUGMENT(f, c, P):
    b ← bottleneck capacity of P        // @bottleneck
    foreach edge e ∈ P do               // @loop
        if e ∈ E then                   // @forward
            f(e) ← f(e) + b             // @increase
        else                            // e = (e')^R for an edge e' ∈ E
            f(e^R) ← f(e^R) − b         // @decrease
    return f                            // @return
```
:::
<!-- REVIEW: slide p13 line 6 reads "f(e^R) ← f(e) − b" (typo); the lesson's f(e^R) ← f(e^R) − b is the intended update. -->

::: intuition {for=alg:augment}
AUGMENT is [[lem:augment]] as code: a residual edge that exists in $G$ gets $b$ more units; a reverse edge $e^R$ stands for cancelling
$b$ units on the original edge, so the flow of that original edge decreases. Example: with $P = s \to b \to a \to c \to t$ and $b = 2$, the edges
$(s, b)$, $(a, c)$, $(c, t)$ gain $2$ and the edge $(a, b)$, traversed backwards as $(b, a)$, loses $2$.
:::
