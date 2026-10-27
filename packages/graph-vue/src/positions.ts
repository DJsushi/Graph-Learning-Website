// Layout helpers for widgets: positioned copies, shared positions across panels and steps.
import { cloneGraph, type GraphData, type Id } from '@core/model'
import { applyLayout, type Positions } from '@core/layout'

/** A copy of g with x/y set for every vertex. Vertices found in `known` take those positions. */
export function positioned(g: GraphData, known?: Positions): GraphData {
  const c = cloneGraph(g)
  const missing = c.vertices.filter(v => !v.pinned && !known?.has(v.id))
  if (known) for (const v of c.vertices) {
    const p = known.get(v.id)
    if (p && !v.pinned) { v.x = p.x; v.y = p.y }
  }
  if (missing.length || c.vertices.some(v => v.x === undefined)) {
    if (known && missing.length < c.vertices.length) {
      // keep known positions fixed while placing the rest
      const tmp = cloneGraph(c)
      for (const v of tmp.vertices) if (known.has(v.id)) { v.pinned = true }
      tmp.meta.layout = 'force'
      applyLayout(tmp)
      for (const v of c.vertices) { const t = tmp.vertices.find(x => x.id === v.id)!; v.x = t.x; v.y = t.y }
    } else applyLayout(c)
  }
  return c
}

export function positionsOf(g: GraphData): Positions {
  return new Map(g.vertices.filter(v => v.x !== undefined).map(v => [v.id, { x: v.x!, y: v.y! }]))
}

/** Lay out the union of several graphs once, so that vertices do not jump between frames. */
export function unionPositions(graphs: GraphData[]): Positions {
  if (!graphs.length) return new Map()
  const u = cloneGraph(graphs[0])
  const seenV = new Set(u.vertices.map(v => v.id)), seenE = new Set(u.edges.map(e => e.id))
  for (const g of graphs.slice(1)) {
    for (const v of g.vertices) if (!seenV.has(v.id)) { u.vertices.push({ ...v, classes: [], data: { ...v.data } }); seenV.add(v.id) }
    for (const e of g.edges) if (!seenE.has(e.id) && e.tail.concat(e.head).every(x => seenV.has(x))) { u.edges.push({ ...e, classes: [] }); seenE.add(e.id) }
  }
  return positionsOf(positioned(u))
}

/** Fill in laid-out positions; vertices placed explicitly with @(x, y) keep theirs (so a step may move them). */
export function applyPositions(g: GraphData, p: Positions): GraphData {
  const c = cloneGraph(g)
  for (const v of c.vertices) { const q = p.get(v.id); if (q && !v.pinned) { v.x = q.x; v.y = q.y } }
  return c
}

export function nextVertexId(g: GraphData): Id {
  const ids = new Set(g.vertices.map(v => v.id))
  for (let i = 1; ; i++) if (!ids.has(String(i))) return String(i)
}
