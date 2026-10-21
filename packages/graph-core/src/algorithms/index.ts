import { bfs, dfs, havelHakimi } from './basic'
import { kruskal, jarnik, boruvka } from './mst'
import { fordFulkerson, edmondsKarp, dinic, mpm } from './flow'
import { edmondsBranching } from './arborescence'
import type { AlgorithmDef } from './types'

export * from './types'
export { mstEdges, edgeOrder } from './mst'
export { maxFlowValue, FlowState } from './flow'
export { minArborescenceCost } from './arborescence'

export const ALGORITHMS: Record<string, AlgorithmDef> = Object.fromEntries(
  [bfs, dfs, havelHakimi, kruskal, jarnik, boruvka, fordFulkerson, edmondsKarp, dinic, mpm, edmondsBranching].map(a => [a.id, a]),
)
