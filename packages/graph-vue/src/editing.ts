// Pure editing helpers for the graph editor: clipboard subgraphs, pasting with fresh ids, box selection, grid snapping.
import { cloneGraph, emptyGraph, type GraphData, type Id } from '@core/model'
import type { Pt } from './geometry'
import { nextVertexId } from './positions'

export function nextEdgeId(g: GraphData): Id {
  const ids = new Set(g.edges.map(e => e.id))
  for (let i = g.edges.length + 1; ; i++) if (!ids.has(`e${i}`)) return `e${i}`
}

/** The selected vertices with every non-hyper edge among them (what Ctrl+C copies). */
export function subgraph(g: GraphData, vertices: Id[]): GraphData {
  const vs = new Set(vertices)
  const out = emptyGraph(g.type)
  out.vertices = cloneGraph(g).vertices.filter(v => vs.has(v.id))
  out.edges = cloneGraph(g).edges.filter(e => !e.hyper && vs.has(e.tail[0]) && vs.has(e.head[0]))
  return out
}

/** g plus a copy of clip moved by `offset`, with fresh vertex and edge ids. Returns the new ids for selecting them. */
export function paste(g: GraphData, clip: GraphData, offset: Pt): { graph: GraphData; vertices: Id[]; edges: Id[] } {
  const n = cloneGraph(g)
  const ren = new Map<Id, Id>()
  for (const v of cloneGraph(clip).vertices) {
    const id = nextVertexId(n)
    ren.set(v.id, id)
    n.vertices.push({ ...v, id, x: (v.x ?? 0) + offset.x, y: (v.y ?? 0) + offset.y, pinned: true })
  }
  const edges: Id[] = []
  for (const e of cloneGraph(clip).edges) {
    const id = nextEdgeId(n)
    edges.push(id)
    n.edges.push({ ...e, id, tail: e.tail.map(x => ren.get(x)!), head: e.head.map(x => ren.get(x)!), directed: n.type === 'directed' ? true : e.directed })
  }
  return { graph: n, vertices: [...ren.values()], edges }
}

/** Vertices inside the box spanned by a and b, and the edges with both ends inside. */
export function inBox(g: GraphData, a: Pt, b: Pt): { vertices: Id[]; edges: Id[] } {
  const [x0, x1] = [Math.min(a.x, b.x), Math.max(a.x, b.x)], [y0, y1] = [Math.min(a.y, b.y), Math.max(a.y, b.y)]
  const vs = new Set(g.vertices.filter(v => (v.x ?? 0) >= x0 && (v.x ?? 0) <= x1 && (v.y ?? 0) >= y0 && (v.y ?? 0) <= y1).map(v => v.id))
  return { vertices: [...vs], edges: g.edges.filter(e => [...e.tail, ...e.head].every(x => vs.has(x))).map(e => e.id) }
}

export const GRID = 0.5
export const snap = (p: Pt, on: boolean): Pt => (on ? { x: Math.round(p.x / GRID) * GRID, y: Math.round(p.y / GRID) * GRID } : p)
