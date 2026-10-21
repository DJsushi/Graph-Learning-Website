// Structural graph computations shared by properties, predicates and tests.
import { GraphIndex, ends, isLoop, type Edge, type GraphData, type Id } from './model'

export function components(ix: GraphIndex, edgeFilter?: (e: Edge) => boolean): Id[][] {
  const seen = new Set<Id>()
  const out: Id[][] = []
  for (const s of ix.vertexIds) {
    if (seen.has(s)) continue
    const comp: Id[] = []
    const st = [s]
    seen.add(s)
    while (st.length) {
      const u = st.pop()!
      comp.push(u)
      for (const e of ix.incident(u)) {
        if (edgeFilter && !edgeFilter(e)) continue
        const w = ix.other(e, u)
        if (!seen.has(w)) { seen.add(w); st.push(w) }
      }
    }
    out.push(comp)
  }
  return out
}

/** 2-colouring if bipartite (loops make it non-bipartite), else undefined. */
export function bipartition(ix: GraphIndex): Map<Id, 0 | 1> | undefined {
  const col = new Map<Id, 0 | 1>()
  for (const s of ix.vertexIds) {
    if (col.has(s)) continue
    col.set(s, 0)
    const q = [s]
    while (q.length) {
      const u = q.shift()!
      for (const e of ix.incident(u)) {
        if (isLoop(e)) return undefined
        const w = ix.other(e, u)
        if (!col.has(w)) { col.set(w, (1 - col.get(u)!) as 0 | 1); q.push(w) }
        else if (col.get(w) === col.get(u)) return undefined
      }
    }
  }
  return col
}

export function bfsDistances(ix: GraphIndex, s: Id): Map<Id, number> {
  const d = new Map([[s, 0]])
  const q = [s]
  while (q.length) {
    const u = q.shift()!
    for (const w of ix.neighbors(u)) if (!d.has(w)) { d.set(w, d.get(u)! + 1); q.push(w) }
  }
  return d
}

/** Length of a shortest cycle (multigraph aware: loop = 1, parallel edges = 2); Infinity if acyclic. */
export function girth(ix: GraphIndex): number {
  let best = Infinity
  for (const e of ix.edges()) if (isLoop(e)) return 1
  const seenPairs = new Set<string>()
  for (const e of ix.edges()) {
    const k = [...ends(e)].sort().join('\u0000')
    if (seenPairs.has(k)) best = Math.min(best, 2)
    seenPairs.add(k)
  }
  if (best === 2) return 2
  for (const s of ix.vertexIds) {
    const d = new Map([[s, 0]]), par = new Map<Id, Id>(), q = [s]
    while (q.length) {
      const u = q.shift()!
      for (const w of ix.neighbors(u)) {
        if (!d.has(w)) { d.set(w, d.get(u)! + 1); par.set(w, u); q.push(w) }
        else if (par.get(u) !== w) best = Math.min(best, d.get(u)! + d.get(w)! + 1)
      }
    }
  }
  return best
}

export function isAcyclic(ix: GraphIndex): boolean {
  return girth(ix) === Infinity
}

export function isConnected(ix: GraphIndex): boolean {
  return ix.n <= 1 || components(ix).length === 1
}

export function isTree(ix: GraphIndex): boolean {
  return ix.n >= 1 && isConnected(ix) && isAcyclic(ix)
}

export function degreeSequence(ix: GraphIndex): number[] {
  return ix.vertexIds.map(v => ix.degree(v)).sort((a, b) => b - a)
}

export function isSimple(g: GraphData): boolean {
  const seen = new Set<string>()
  for (const e of g.edges) {
    if (e.hyper) continue
    const [a, b] = ends(e)
    if (a === b) return false
    const k = e.directed ? `${a}>${b}` : [a, b].sort().join('|')
    if (seen.has(k)) return false
    seen.add(k)
  }
  return true
}

export function isSimplicial(ix: GraphIndex, v: Id): boolean {
  const N = ix.neighbors(v).filter(w => w !== v)
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) if (!ix.adjacent(N[i], N[j])) return false
  return true
}

export function diameter(ix: GraphIndex): number {
  let best = 0
  for (const v of ix.vertexIds) {
    const d = bfsDistances(ix, v)
    if (d.size < ix.n) return Infinity
    for (const x of d.values()) best = Math.max(best, x)
  }
  return best
}

/** Exact chromatic number by backtracking (small graphs only). */
export function chromaticNumber(ix: GraphIndex, limit = 12): number | undefined {
  if (ix.n > limit) return undefined
  if (ix.edges().some(isLoop)) return undefined
  const order = [...ix.vertexIds].sort((a, b) => ix.degree(b) - ix.degree(a))
  for (let k = ix.n ? 1 : 0; k <= ix.n; k++) {
    const col = new Map<Id, number>()
    const go = (i: number): boolean => {
      if (i === order.length) return true
      const v = order[i]
      for (let c = 0; c < k; c++) {
        if (ix.neighbors(v).some(w => col.get(w) === c)) continue
        col.set(v, c)
        if (go(i + 1)) return true
        col.delete(v)
      }
      return false
    }
    if (go(0)) return k
  }
  return ix.n
}

/** Maximum matching size: bipartite via augmenting paths, otherwise exhaustive search (small graphs). */
export function maxMatchingSize(ix: GraphIndex): number {
  const es = ix.edges().filter(e => !isLoop(e))
  const bp = bipartition(ix)
  if (bp) {
    const match = new Map<Id, Id>()
    const left = ix.vertexIds.filter(v => bp.get(v) === 0)
    const tryKuhn = (u: Id, seen: Set<Id>): boolean => {
      for (const w of ix.neighbors(u)) {
        if (seen.has(w)) continue
        seen.add(w)
        if (!match.has(w) || tryKuhn(match.get(w)!, seen)) { match.set(w, u); return true }
      }
      return false
    }
    let size = 0
    for (const u of left) if (tryKuhn(u, new Set())) size++
    return size
  }
  let best = 0
  const used = new Set<Id>()
  const go = (i: number, size: number) => {
    if (size + Math.floor((ix.n - used.size) / 2) <= best) return
    best = Math.max(best, size)
    for (let j = i; j < es.length; j++) {
      const [a, b] = ends(es[j])
      if (used.has(a) || used.has(b)) continue
      used.add(a); used.add(b)
      go(j + 1, size + 1)
      used.delete(a); used.delete(b)
    }
  }
  go(0, 0)
  return best
}

/** Is the edge set a single cycle? (as a subgraph) */
export function isCycleEdgeSet(g: GraphData, edgeIds: Set<Id>): boolean {
  const es = g.edges.filter(e => edgeIds.has(e.id) && !e.hyper)
  if (!es.length) return false
  const sub = subgraphOfEdges(g, edgeIds)
  const ix = new GraphIndex(sub)
  if (!ix.vertexIds.every(v => ix.degree(v) === 2)) return false
  return isConnected(ix)
}

export function subgraphOfEdges(g: GraphData, edgeIds: Set<Id>): GraphData {
  const es = g.edges.filter(e => edgeIds.has(e.id))
  const vs = new Set(es.flatMap(e => [...e.tail, ...e.head]))
  return { ...g, vertices: g.vertices.filter(v => vs.has(v.id)), edges: es, faces: [], groups: [] }
}

export function spanningSubgraph(g: GraphData, edgeIds: Set<Id>): GraphData {
  return { ...g, edges: g.edges.filter(e => edgeIds.has(e.id)), faces: [], groups: [] }
}
