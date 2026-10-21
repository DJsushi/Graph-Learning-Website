// Core graph data model. Plain serialisable data so Vue can wrap it reactively and steps can snapshot it.

export type Id = string
export type AttrValue = number | string
export type Attrs = Record<string, AttrValue>

export interface Vertex {
  id: Id
  label?: string
  x?: number
  y?: number
  pinned?: boolean
  classes: string[]
  data: Attrs
}

export interface Edge {
  id: Id
  tail: Id[]
  head: Id[]
  directed: boolean
  hyper: boolean
  label?: string
  classes: string[]
  data: Attrs
}

export interface Face {
  id: Id
  walk: Id[]
  outer: boolean
  label?: string
  classes: string[]
}

export interface Group {
  id: Id
  members: Id[]
  label?: string
  classes: string[]
}

export type GraphType = 'undirected' | 'directed' | 'mixed'

export interface GraphData {
  type: GraphType
  simple: boolean
  vertices: Vertex[]
  edges: Edge[]
  faces: Face[]
  groups: Group[]
  meta: Record<string, string>
}

export function emptyGraph(type: GraphType = 'undirected'): GraphData {
  return { type, simple: false, vertices: [], edges: [], faces: [], groups: [], meta: {} }
}

export function cloneGraph(g: GraphData): GraphData {
  return {
    type: g.type,
    simple: g.simple,
    vertices: g.vertices.map(v => ({ ...v, classes: [...v.classes], data: { ...v.data } })),
    edges: g.edges.map(e => ({ ...e, tail: [...e.tail], head: [...e.head], classes: [...e.classes], data: { ...e.data } })),
    faces: g.faces.map(f => ({ ...f, walk: [...f.walk], classes: [...f.classes] })),
    groups: g.groups.map(gr => ({ ...gr, members: [...gr.members], classes: [...gr.classes] })),
    meta: { ...g.meta },
  }
}

/** Endpoints of an ordinary (non-hyper) edge. */
export function ends(e: Edge): [Id, Id] {
  return [e.tail[0], e.head[0]]
}

export function isLoop(e: Edge): boolean {
  return !e.hyper && e.tail[0] === e.head[0]
}

export function num(v: AttrValue | undefined, fallback = 0): number {
  if (v === undefined) return fallback
  return typeof v === 'number' ? v : Number(v)
}

/** Read-only adjacency index. Algorithms, properties and predicates work on this. */
export class GraphIndex {
  readonly g: GraphData
  readonly vertexIds: Id[]
  private vmap = new Map<Id, Vertex>()
  private emap = new Map<Id, Edge>()
  /** incident ordinary edges per vertex, in edge order */
  private inc = new Map<Id, Edge[]>()

  constructor(g: GraphData) {
    this.g = g
    this.vertexIds = g.vertices.map(v => v.id)
    for (const v of g.vertices) {
      this.vmap.set(v.id, v)
      this.inc.set(v.id, [])
    }
    for (const e of g.edges) {
      this.emap.set(e.id, e)
      if (e.hyper) continue
      const [u, v] = ends(e)
      this.inc.get(u)?.push(e)
      if (v !== u) this.inc.get(v)?.push(e)
    }
  }

  get n() { return this.g.vertices.length }
  get m() { return this.g.edges.filter(e => !e.hyper).length }
  vertex(id: Id) { return this.vmap.get(id) }
  edge(id: Id) { return this.emap.get(id) }
  hasVertex(id: Id) { return this.vmap.has(id) }
  edges(): Edge[] { return this.g.edges.filter(e => !e.hyper) }
  incident(v: Id): Edge[] { return this.inc.get(v) ?? [] }

  /** The other endpoint of edge e seen from v. */
  other(e: Edge, v: Id): Id {
    const [a, b] = ends(e)
    return a === v ? b : a
  }

  /** Degree; loops count twice. For arcs both directions count (total degree). */
  degree(v: Id): number {
    let d = 0
    for (const e of this.incident(v)) d += isLoop(e) ? 2 : 1
    return d
  }

  outEdges(v: Id): Edge[] {
    return this.incident(v).filter(e => !e.directed ? true : e.tail[0] === v)
  }

  inEdges(v: Id): Edge[] {
    return this.incident(v).filter(e => !e.directed ? true : e.head[0] === v)
  }

  neighbors(v: Id): Id[] {
    const out: Id[] = []
    for (const e of this.incident(v)) {
      const w = this.other(e, v)
      if (!out.includes(w)) out.push(w)
    }
    return out
  }

  outNeighbors(v: Id): Id[] {
    const out: Id[] = []
    for (const e of this.outEdges(v)) {
      const w = this.other(e, v)
      if (!out.includes(w)) out.push(w)
    }
    return out
  }

  edgesBetween(u: Id, v: Id): Edge[] {
    return this.incident(u).filter(e => {
      const [a, b] = ends(e)
      return (a === u && b === v) || (a === v && b === u)
    })
  }

  adjacent(u: Id, v: Id): boolean {
    return this.edgesBetween(u, v).length > 0
  }
}

/** Element references, see GRAPH_DSL.md §5.4. Returns the vertex/edge/face id or undefined. */
export function resolveRef(g: GraphData, ref: string): { kind: 'vertex' | 'edge' | 'face'; id: Id } | undefined {
  if (ref.startsWith('@')) {
    const id = ref.slice(1)
    return g.edges.some(e => e.id === id) ? { kind: 'edge', id } : undefined
  }
  if (ref.startsWith('face:')) {
    const id = ref.slice(5)
    return g.faces.some(f => f.id === id) ? { kind: 'face', id } : undefined
  }
  const m = /^(.+?)(--|->)(.+?)(?:#(\d+))?$/.exec(ref)
  if (m) {
    const [, u, op, v, k] = m
    const idx = k ? Number(k) - 1 : 0
    const matches = g.edges.filter(e => {
      if (e.hyper) return false
      const [a, b] = ends(e)
      if (op === '->') return e.directed && a === u && b === v
      return (a === u && b === v) || (a === v && b === u)
    })
    const e = matches[idx]
    return e ? { kind: 'edge', id: e.id } : undefined
  }
  return g.vertices.some(v => v.id === ref) ? { kind: 'vertex', id: ref } : undefined
}
