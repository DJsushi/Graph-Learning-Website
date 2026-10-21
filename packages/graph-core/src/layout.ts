// Deterministic, synchronous layouts (GRAPH_DSL.md §12). Coordinates are in abstract units, y up.
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force'
import { GraphIndex, type GraphData, type Id } from './model'
import { parseKV } from './dsl/parser'
import { bipartition } from './analysis'
import { rng } from './random'

export type Positions = Map<Id, { x: number; y: number }>

export function parseLayout(spec: string | undefined): { name: string; opts: Record<string, string> } {
  const s = (spec ?? 'auto').trim()
  const sp = s.search(/\s/)
  return sp < 0 ? { name: s, opts: {} } : { name: s.slice(0, sp), opts: parseKV(s.slice(sp + 1)) }
}

/** Compute positions for all vertices; pinned vertices keep their coordinates. */
export function computeLayout(g: GraphData, hint?: Positions): Positions {
  let { name, opts } = parseLayout(g.meta.layout)
  if (name === 'auto') name = autoName(g)
  const ids = g.vertices.map(v => v.id)
  let pos: Positions
  switch (name) {
    case 'circle': pos = circle(ids, opts.start); break
    case 'line': pos = new Map(ids.map((v, i) => [v, { x: i, y: 0 }])); break
    case 'grid': pos = gridLayout(ids, Number(opts.cols ?? g.meta.gridCols ?? Math.ceil(Math.sqrt(ids.length)))); break
    case 'tree': pos = tree(g, opts.root ?? g.meta.treeRoot, opts.direction); break
    case 'layered': pos = layered(g, opts.direction); break
    case 'bipartite': pos = bipartite(g, opts.left ?? g.meta.bipartiteLeft); break
    case 'star': case 'wheel': pos = star(ids); break
    case 'hypercube': pos = hypercube(ids); break
    case 'petersen': pos = petersen(ids); break
    case 'fixed': case 'force': case 'planar': default:
      pos = force(g, Number(opts.seed ?? 1), hint)
  }
  for (const v of g.vertices) if (v.pinned && v.x !== undefined && v.y !== undefined) pos.set(v.id, { x: v.x, y: v.y })
  if (name !== 'fixed' && name !== 'force' && g.vertices.some(v => v.pinned)) {
    // structured layout plus some pins: re-run force for the unpinned ones, seeded from the structure
    const anyFree = g.vertices.some(v => !v.pinned)
    if (anyFree && g.vertices.filter(v => v.pinned).length < g.vertices.length) pos = force(g, 1, pos)
  }
  return pos
}

/** Copy computed positions into the graph (x, y) without pinning. */
export function applyLayout(g: GraphData, hint?: Positions): GraphData {
  const pos = computeLayout(g, hint)
  for (const v of g.vertices) {
    const p = pos.get(v.id)
    if (p && !v.pinned) { v.x = p.x; v.y = p.y }
  }
  return g
}

function autoName(g: GraphData): string {
  if (g.meta.defaultLayout) return g.meta.defaultLayout
  if (g.vertices.length && g.vertices.every(v => v.pinned)) return 'fixed'
  const ix = new GraphIndex(g)
  const n = ix.n, m = ix.edges().length
  if (n > 1 && m === n - 1) {
    // connected acyclic?
    const seen = new Set([ix.vertexIds[0]]), st = [ix.vertexIds[0]]
    while (st.length) for (const w of ix.neighbors(st.pop()!)) if (!seen.has(w)) { seen.add(w); st.push(w) }
    if (seen.size === n) return 'tree'
  }
  if (g.type === 'directed' && g.vertices.some(v => v.classes.includes('source'))) return 'layered'
  return 'force'
}

function circle(ids: Id[], start?: Id): Positions {
  const n = ids.length
  const order = start && ids.includes(start) ? [...ids.slice(ids.indexOf(start)), ...ids.slice(0, ids.indexOf(start))] : ids
  if (n === 1) return new Map([[ids[0], { x: 0, y: 0 }]])
  if (n === 2) return new Map([[order[0], { x: 0, y: 0 }], [order[1], { x: 1.2, y: 0 }]])
  const r = 1.1 / (2 * Math.sin(Math.PI / n))
  return new Map(order.map((v, i) => {
    const a = Math.PI / 2 - (2 * Math.PI * i) / n
    return [v, { x: r * Math.cos(a), y: r * Math.sin(a) }]
  }))
}

function gridLayout(ids: Id[], cols: number): Positions {
  return new Map(ids.map((v, i) => [v, { x: i % cols, y: -Math.floor(i / cols) }]))
}

function star(ids: Id[]): Positions {
  const [c, ...rest] = ids
  const out: Positions = new Map([[c, { x: 0, y: 0 }]])
  circle(rest).forEach((p, v) => {
    const len = Math.hypot(p.x, p.y) || 1
    const r = Math.max(1.2, len)
    out.set(v, { x: (p.x / len) * r, y: (p.y / len) * r })
  })
  return out
}

function hypercube(ids: Id[]): Positions {
  const basis = [[2.2, 0], [0, 2.2], [0.9, 0.7], [4.6, 0.4], [0.3, 4.4]]
  return new Map(ids.map(v => {
    let x = 0, y = 0
    ;[...v].forEach((b, i) => { if (b === '1') { const k = basis[(v.length - 1 - i) % basis.length]; x += k[0]; y += k[1] } })
    return [v, { x, y }]
  }))
}

function petersen(ids: Id[]): Positions {
  return new Map(ids.map(v => {
    const k = Number(v)
    const r = k < 5 ? 2 : 1
    const a = Math.PI / 2 + (2 * Math.PI * (k % 5)) / 5
    return [v, { x: r * Math.cos(a), y: r * Math.sin(a) }]
  }))
}

function tree(g: GraphData, root?: Id, direction?: string): Positions {
  const ix = new GraphIndex(g)
  const pos: Positions = new Map()
  const seen = new Set<Id>()
  let nextX = 0
  const roots = root && ix.hasVertex(root) ? [root, ...ix.vertexIds] : ix.vertexIds
  for (const r of roots) {
    if (seen.has(r)) continue
    seen.add(r)
    const children = new Map<Id, Id[]>()
    const depth = new Map([[r, 0]])
    const q = [r]
    while (q.length) {
      const u = q.shift()!
      const cs: Id[] = []
      for (const w of ix.neighbors(u)) if (!seen.has(w)) { seen.add(w); cs.push(w); depth.set(w, depth.get(u)! + 1); q.push(w) }
      children.set(u, cs)
    }
    const place = (u: Id): number => {
      const cs = children.get(u) ?? []
      let x: number
      if (!cs.length) x = nextX++
      else { const xs = cs.map(place); x = (xs[0] + xs[xs.length - 1]) / 2 }
      pos.set(u, { x, y: -depth.get(u)! })
      return x
    }
    place(r)
    nextX += 0.5
  }
  if (direction === 'right') for (const [v, p] of pos) pos.set(v, { x: -p.y, y: -p.x })
  return pos
}

function layered(g: GraphData, direction?: string): Positions {
  const ix = new GraphIndex(g)
  const ids = ix.vertexIds
  const src = g.vertices.find(v => v.classes.includes('source'))?.id
    ?? ids.find(v => !ix.edges().some(e => e.directed && e.head[0] === v)) ?? ids[0]
  const level = new Map<Id, number>()
  // BFS distances give a stable layering that respects most arcs
  const dist = new Map([[src, 0]]), q = [src]
  while (q.length) {
    const u = q.shift()!
    for (const e of ix.incident(u)) {
      const w = ix.other(e, u)
      if (e.directed && e.tail[0] !== u) continue
      if (!dist.has(w)) { dist.set(w, dist.get(u)! + 1); q.push(w) }
    }
  }
  const sink = g.vertices.find(v => v.classes.includes('sink'))?.id
  let maxL = Math.max(0, ...dist.values())
  for (const v of ids) level.set(v, dist.get(v) ?? maxL + 1)
  if (sink && level.get(sink)! < Math.max(...level.values())) level.set(sink, Math.max(...level.values()))
  maxL = Math.max(...level.values())
  const layers: Id[][] = Array.from({ length: maxL + 1 }, () => [])
  for (const v of ids) layers[level.get(v)!].push(v)
  // barycenter ordering sweeps
  const order = new Map<Id, number>()
  layers.forEach(L => L.forEach((v, i) => order.set(v, i)))
  for (let sweep = 0; sweep < 6; sweep++) {
    const range = sweep % 2 === 0 ? layers.map((_, i) => i).slice(1) : layers.map((_, i) => i).slice(0, -1).reverse()
    for (const li of range) {
      const nb = sweep % 2 === 0 ? li - 1 : li + 1
      const bary = (v: Id) => {
        const ns = ix.neighbors(v).filter(w => level.get(w) === nb)
        return ns.length ? ns.reduce((z, w) => z + order.get(w)!, 0) / ns.length : order.get(v)!
      }
      layers[li].sort((a, b) => bary(a) - bary(b))
      layers[li].forEach((v, i) => order.set(v, i))
    }
  }
  const pos: Positions = new Map()
  layers.forEach((L, li) => L.forEach((v, i) => {
    const y = (L.length - 1) / 2 - i
    pos.set(v, direction === 'down' ? { x: -y * 1.4, y: -li * 1.2 } : { x: li * 1.5, y: y * 1.2 })
  }))
  return pos
}

function bipartite(g: GraphData, left?: string): Positions {
  const ix = new GraphIndex(g)
  let L: Set<Id>
  if (left) L = new Set(left.split(/\s+/).filter(Boolean))
  else {
    const bp = bipartition(ix)
    L = new Set(ix.vertexIds.filter(v => (bp ? bp.get(v) === 0 : ix.vertexIds.indexOf(v) % 2 === 0)))
  }
  const ls = ix.vertexIds.filter(v => L.has(v)), rs = ix.vertexIds.filter(v => !L.has(v))
  const pos: Positions = new Map()
  ls.forEach((v, i) => pos.set(v, { x: 0, y: (ls.length - 1) / 2 - i }))
  rs.forEach((v, i) => pos.set(v, { x: 2, y: (rs.length - 1) / 2 - i }))
  return pos
}

interface Node extends SimulationNodeDatum { id: Id }

function force(g: GraphData, seed: number, hint?: Positions): Positions {
  const S = 60
  const r = rng(seed)
  const init = circle(g.vertices.map(v => v.id))
  const nodes: Node[] = g.vertices.map(v => {
    const h = v.pinned && v.x !== undefined ? { x: v.x, y: v.y! } : hint?.get(v.id) ?? init.get(v.id)!
    const n: Node = { id: v.id, x: h.x * S + r() * 0.01, y: -h.y * S + r() * 0.01 }
    if (v.pinned && v.x !== undefined && v.y !== undefined) { n.fx = v.x * S; n.fy = -v.y * S }
    return n
  })
  const byId = new Map(nodes.map(n => [n.id, n]))
  const links = g.edges.filter(e => !e.hyper && e.tail[0] !== e.head[0]).map(e => ({ source: byId.get(e.tail[0])!, target: byId.get(e.head[0])! }))
  const sim = forceSimulation(nodes)
    .randomSource(r)
    .force('link', forceLink(links).distance(S).strength(0.7))
    .force('charge', forceManyBody().strength(-S * 4).distanceMax(S * 6))
    .force('collide', forceCollide(S * 0.4))
    .force('x', forceX(0).strength(0.03))
    .force('y', forceY(0).strength(0.03))
    .stop()
  for (let i = 0; i < 300; i++) sim.tick()
  return new Map(nodes.map(n => [n.id, { x: n.x! / S, y: -n.y! / S }]))
}
