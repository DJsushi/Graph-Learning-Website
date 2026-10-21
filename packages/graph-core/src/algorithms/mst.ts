import { GraphIndex, ends, num, type Edge, type GraphData, type Id } from '../model'
import { Recorder, fmt, vname, type AlgorithmDef } from './types'

const weight = (e: Edge) => num(e.data.w, 1)
/** Total order on edges: weight, then declaration order (consistent tie-breaking). */
export function edgeOrder(g: GraphData): Edge[] {
  const pos = new Map(g.edges.map((e, i) => [e.id, i]))
  return g.edges.filter(e => !e.hyper).slice().sort((a, b) => weight(a) - weight(b) || pos.get(a.id)! - pos.get(b.id)!)
}
const ename = (g: GraphData, e: Edge) => { const [a, b] = ends(e); return `${vname(g, a)}${vname(g, b)}` }

class UnionFind {
  parent = new Map<Id, Id>()
  constructor(ids: Id[]) { for (const v of ids) this.parent.set(v, v) }
  find(x: Id): Id { let r = x; while (this.parent.get(r) !== r) r = this.parent.get(r)!; this.parent.set(x, r); return r }
  union(a: Id, b: Id) { this.parent.set(this.find(a), this.find(b)) }
}

export const kruskal: AlgorithmDef = {
  id: 'kruskal',
  name: "Kruskal's algorithm",
  labels: ['init', 'sort', 'loop', 'test', 'accept'],
  *run(g) {
    const R = new Recorder()
    const uf = new UnionFind(g.vertices.map(v => v.id))
    const sorted = edgeOrder(g)
    const comps = () => {
      const groups = new Map<Id, Id[]>()
      for (const v of g.vertices) { const r = uf.find(v.id); groups.set(r, [...(groups.get(r) ?? []), v.id]) }
      return [...groups.values()].map(c => `\\{${c.map(v => vname(g, v)).join(',')}\\}`).join('\\ ')
    }
    const list = (i: number) => sorted.slice(i).map(e => `${ename(g, e)}\\,(${fmt(weight(e))})`).join(',\\ ') || '\\emptyset'
    yield R.snap('Start with the forest $F = (V, \\emptyset)$: every vertex is its own component.', { line: 'init', state: { components: comps() } })
    yield R.snap('Sort the edges by weight.', { line: 'sort', state: { 'edges left': list(0), components: comps() } })
    let total = 0, count = 0
    for (let i = 0; i < sorted.length && count < g.vertices.length - 1; i++) {
      const e = sorted[i]
      const [u, v] = ends(e)
      R.addE(e.id, 'current')
      yield R.snap(`Next edge: $${ename(g, e)}$ of weight $${fmt(weight(e))}$. Are $${vname(g, u)}$ and $${vname(g, v)}$ in different components?`, { line: 'test', state: { 'edges left': list(i), components: comps() } })
      R.delE(e.id, 'current')
      if (uf.find(u) !== uf.find(v)) {
        uf.union(u, v)
        R.addE(e.id, 'tree')
        total += weight(e); count++
        yield R.snap(`Yes: accept $${ename(g, e)}$ (blue rule). It is the lightest edge leaving the component of $${vname(g, u)}$.`, { line: 'accept', state: { 'edges left': list(i + 1), components: comps(), 'weight of F': fmt(total) }, action: { kind: 'edge', id: e.id } })
      } else {
        R.addE(e.id, 'rejected')
        yield R.snap(`No: $${ename(g, e)}$ would close a cycle, discard it (red rule).`, { line: 'loop', state: { 'edges left': list(i + 1), components: comps(), 'weight of F': fmt(total) } })
      }
    }
    yield R.snap(`Done: the minimum spanning tree has weight $${fmt(total)}$.`, { state: { 'weight of F': fmt(total) } })
    return { weight: total }
  },
}

export const jarnik: AlgorithmDef = {
  id: 'jarnik',
  name: "Jarník's (Prim's) algorithm",
  pseudocode: 'alg:jarnik-heap',
  labels: ['source', 'extract', 'scan', 'decrease'],
  params: ['source'],
  *run(g, params) {
    const ix = new GraphIndex(g)
    const s = params.source ?? g.vertices[0]?.id
    if (!s || !ix.hasVertex(s)) throw new Error(`jarnik: unknown source "${s}"`)
    const R = new Recorder()
    const key = new Map<Id, number>(g.vertices.map(v => [v.id, Infinity]))
    const pred = new Map<Id, Edge>()
    const inQ = new Set(g.vertices.map(v => v.id))
    key.set(s, 0)
    const heap = () => [...inQ].filter(v => isFinite(key.get(v)!)).sort((a, b) => key.get(a)! - key.get(b)!).map(v => `${vname(g, v)}{:}${fmt(key.get(v)!)}`).join(',\\ ') || '\\emptyset'
    for (const v of g.vertices) R.badge(v.id, v.id === s ? '0' : '\\infty')
    let total = 0
    yield R.snap(`All keys are $\\infty$ except $\\mathrm{key}[${vname(g, s)}] = 0$.`, { line: 'source', state: { Q: heap() } })
    while (inQ.size) {
      let u: Id | undefined
      for (const v of inQ) if (u === undefined || key.get(v)! < key.get(u)!) u = v
      if (u === undefined || !isFinite(key.get(u)!)) break
      inQ.delete(u)
      R.addV(u, 'done')
      R.badge(u, undefined)
      const pe = pred.get(u)
      if (pe) { R.delE(pe.id, 'frontier'); R.addE(pe.id, 'tree'); total += weight(pe) }
      yield R.snap(pe ? `Extract $${vname(g, u)}$ (key $${fmt(key.get(u)!)}$) and add the edge $${ename(g, pe)}$ to $T$.` : `Extract $${vname(g, u)}$.`,
        { line: 'extract', state: { Q: heap(), 'weight of T': fmt(total) }, action: pe ? { kind: 'edge', id: pe.id } : undefined })
      let changed = false
      for (const e of ix.incident(u)) {
        const v = ix.other(e, u)
        if (!inQ.has(v) || weight(e) >= key.get(v)!) continue
        const old = pred.get(v)
        if (old) R.delE(old.id, 'frontier')
        key.set(v, weight(e)); pred.set(v, e)
        R.addE(e.id, 'frontier')
        R.badge(v, fmt(weight(e)))
        changed = true
      }
      if (changed) yield R.snap(`Decrease the keys of the neighbours of $${vname(g, u)}$ that got closer to $T$.`, { line: 'decrease', state: { Q: heap(), 'weight of T': fmt(total) } })
    }
    yield R.snap(`Done: the minimum spanning tree has weight $${fmt(total)}$.`, { state: { 'weight of T': fmt(total) } })
    return { weight: total }
  },
}

export const boruvka: AlgorithmDef = {
  id: 'boruvka',
  name: "Borůvka's algorithm",
  labels: ['init', 'phase', 'add'],
  *run(g) {
    const ix = new GraphIndex(g)
    const R = new Recorder()
    const uf = new UnionFind(g.vertices.map(v => v.id))
    const pos = new Map(g.edges.map((e, i) => [e.id, i]))
    const lighter = (a: Edge, b: Edge) => weight(a) - weight(b) || pos.get(a.id)! - pos.get(b.id)!
    const colour = () => {
      const roots = [...new Set(g.vertices.map(v => uf.find(v.id)))]
      for (const v of g.vertices) {
        R.o.vertexClasses[v.id] = (R.o.vertexClasses[v.id] ?? []).filter(c => !/^color\d$/.test(c))
        R.addV(v.id, `color${(roots.indexOf(uf.find(v.id)) % 8) + 1}`)
      }
      return roots.length
    }
    let total = 0
    yield R.snap(`Phase 0: every vertex is a one-vertex tree (${colour()} components).`, { line: 'init' })
    for (let phase = 1; ; phase++) {
      const roots = [...new Set(g.vertices.map(v => uf.find(v.id)))]
      if (roots.length <= 1) break
      const best = new Map<Id, Edge>()
      for (const e of ix.edges()) {
        const [a, b] = ends(e)
        const ra = uf.find(a), rb = uf.find(b)
        if (ra === rb) continue
        for (const r of [ra, rb]) if (!best.has(r) || lighter(e, best.get(r)!) < 0) best.set(r, e)
      }
      if (!best.size) break
      const chosen = [...new Set(best.values())]
      for (const e of chosen) R.addE(e.id, 'current')
      yield R.snap(`Phase ${phase}: every component selects the lightest edge leaving it: $${chosen.map(e => ename(g, e)).join(', ')}$.`, { line: 'phase' })
      for (const e of chosen) {
        R.delE(e.id, 'current')
        const [a, b] = ends(e)
        if (uf.find(a) !== uf.find(b)) { uf.union(a, b); total += weight(e) }
        R.addE(e.id, 'tree')
      }
      const k = colour()
      yield R.snap(`Add all selected edges and merge the trees: ${k} component${k === 1 ? '' : 's'} left.`, { line: 'add', state: { components: String(k), 'weight so far': fmt(total) } })
    }
    yield R.snap(`Done: the minimum spanning tree has weight $${fmt(total)}$.`, { state: { weight: fmt(total) } })
    return { weight: total }
  },
}

/** MST (or minimum spanning forest) edge ids by Kruskal; used by predicates and tests. */
export function mstEdges(g: GraphData): Set<Id> {
  const uf = new UnionFind(g.vertices.map(v => v.id))
  const out = new Set<Id>()
  for (const e of edgeOrder(g)) {
    const [u, v] = ends(e)
    if (u !== v && uf.find(u) !== uf.find(v)) { uf.union(u, v); out.add(e.id) }
  }
  return out
}
