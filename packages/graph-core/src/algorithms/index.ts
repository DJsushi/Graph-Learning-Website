import { bfs, dfs, havelHakimi } from './basic'
import { kruskal, jarnik, boruvka } from './mst'
import { fordFulkerson, edmondsKarp, dinic, mpm } from './flow'
import { edmondsBranching } from './arborescence'
import { stoerWagner, gomoryHu, karger } from './cuts'
import type { AlgorithmDef } from './types'

export * from './types'
export { mstEdges, edgeOrder } from './mst'
export { maxFlowValue, FlowState } from './flow'
export { minArborescenceCost } from './arborescence'
export { capacity, cutCapacity, minSTCut, globalMinCut, gomoryHuTree } from './cuts'

export const ALGORITHMS: Record<string, AlgorithmDef> = Object.fromEntries(
  [bfs, dfs, havelHakimi, kruskal, jarnik, boruvka, fordFulkerson, edmondsKarp, dinic, mpm, edmondsBranching, stoerWagner, gomoryHu, karger].map(a => [a.id, a]),
)
