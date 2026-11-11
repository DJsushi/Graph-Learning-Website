---
title: "Maximum-flow algorithms compared"
course: algorithms
chapter: fast-flows
order: 7
lectures: [a02]
stage: split
status: draft
---

| year | method | authors | complexity |
|------|--------|---------|------------|
| 1955 | augmenting path | Ford, Fulkerson | $\O(mnC)$ |
| 1970 | blocking flow | Dinitz | $\O(mn^2)$ |
| 1972 | shortest augmenting path | Edmonds, Karp | $\O(m^2 n)$ |
| 1978 | blocking flow | MPM | $\O(n^3)$ |
| 1983 | dynamic trees | Sleator, Tarjan | $\O(mn \log n)$ |
| 1986 | push-relabel | Goldberg, Tarjan | $\O(mn^2)$, $\O(\sqrt{m}\, n^2)$, $\O(mn \log(n^2/m))$ |
| 1997 | binary blocking flow | Goldberg, Rao | $\tilde{\O}(\min(m^{2/3}, n^{1/2}) \cdot m)$ |
| 2012 | compact networks | Orlin | $\O(mn)$ |

The first four rows are the algorithms of this lesson: Ford–Fulkerson and Edmonds–Karp augment along single
[[def:augmenting-path|augmenting paths]], Dinic and MPM compute [[def:blocking-flow|blocking flows]] in
[[def:level-graph|level graphs]].
