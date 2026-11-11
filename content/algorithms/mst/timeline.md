---
title: "A timeline of MST algorithms"
course: algorithms
chapter: mst
order: 12
lectures: [a01]
stage: split
status: draft
---

| year | authors | time | idea |
|------|---------|------|------|
| 1926 | Borůvka | $\O(m \log n)$ | $\O(\log n)$ phases, each $\O(m)$ |
| 1930 | Jarník | $\O(n^2)$ | arrays; heaps not yet invented |
| 1956 | Kruskal | $\O(m \log n)$ | dominated by the sort |
| 1957, 1959 | Prim, Dijkstra | | rediscover Jarník |
| 1960s | Jarník + binary heap | $\O(m \log n)$ | no faster than Borůvka |
| 1975–76 | Yao; Cheriton–Tarjan | $\O(m \log \log n)$ | improvements of Borůvka |
| 1987 | Fredman–Tarjan | $\O(m + n \log n)$ | Jarník with Fibonacci heaps |
| 1987 | Fredman–Tarjan | $\O(m \beta(m, n))$ | limiting the heap size |
| 1986/89 | Gabow, Galil, Spencer, Tarjan | $\O(m \log \beta(m, n))$ | packets |
| 1995 | Karger, Klein, Tarjan | $\O(m)$ expected | randomization |
| 1997 | Chazelle | $\O(m \alpha(m, n) \log \alpha(m, n))$ | soft heaps |
| 1999 | Chazelle; Pettie | $\O(m \alpha(m, n))$ | |
| 2000 | Pettie, Ramachandran | $\O(T^*(m, n))$ | provably optimal (decision trees); at most $\O(m\alpha(m,n))$, exact complexity unknown |

<!-- REVIEW: slide p25 writes O(m T*(m,n)); T*(m,n) (decision-tree complexity) is already the total time, so O(T*(m,n)) kept. -->
