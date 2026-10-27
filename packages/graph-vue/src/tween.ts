// Frame-to-frame interpolation of two graph snapshots that share vertex/edge ids.
import type { Edge, GraphData, Id, Merge, Vertex } from '@core/model'

export interface Tweened {
  graph: GraphData
  /** opacity of entering / leaving elements, keyed `v:<id>` / `e:<id>`; absent = fully visible */
  fade: Record<string, number>
}

const visible = (el: Vertex | Edge) => !el.classes.includes('hidden')
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * The scene at progress t (0 = a, 1 = b). Shared vertices slide; vertices only in b fade in, vertices only in a fade out.
 * `merges` (oriented a -> b) make the `from` vertices slide into `to`; with `reverse` they are oriented b -> a (a split).
 */
export function interpolate(a: GraphData, b: GraphData, t: number, merges: Merge[] = [], reverse = false): Tweened {
  if (t <= 0) return { graph: a, fade: {} }
  if (t >= 1) return { graph: b, fade: {} }
  return reverse ? forward(b, a, 1 - t, merges, a) : forward(a, b, t, merges, b)
}

/** s -> d at progress u; `dest` is the graph the viewer is really heading to (its classes win for shared elements). */
function forward(s: GraphData, d: GraphData, u: number, merges: Merge[], dest: GraphData): Tweened {
  const fade: Record<string, number> = {}
  const sv = new Map(s.vertices.filter(visible).map(v => [v.id, v]))
  const dv = new Map(d.vertices.filter(visible).map(v => [v.id, v]))
  const target = new Map<Id, Id>() // merged vertex -> where it goes
  const sources = new Map<Id, Id[]>()
  for (const m of merges) {
    if (!dv.has(m.to)) continue
    const from = m.from.filter(f => sv.has(f))
    for (const f of from) if (f !== m.to) target.set(f, m.to)
    sources.set(m.to, from)
  }
  const pt = (v: Vertex) => ({ x: v.x ?? 0, y: v.y ?? 0 })
  const vertices: Vertex[] = []
  const place = (v: Vertex, p: { x: number; y: number }, f: number) => {
    vertices.push({ ...v, x: p.x, y: p.y })
    if (f < 1) fade[`v:${v.id}`] = f
  }
  const destOf = (id: Id, v: Vertex) => (dest.vertices.find(x => x.id === id) ?? v)
  for (const [id, v] of sv) {
    const to = target.get(id)
    const dt = to && dv.get(to)
    if (dt) place(v, { x: lerp(v.x ?? 0, dt.x ?? 0, u), y: lerp(v.y ?? 0, dt.y ?? 0, u) }, 1 - u)
    else if (dv.has(id)) {
      const w = dv.get(id)!
      place(destOf(id, w), { x: lerp(v.x ?? 0, w.x ?? 0, u), y: lerp(v.y ?? 0, w.y ?? 0, u) }, 1)
    } else place(v, pt(v), 1 - u)
  }
  for (const [id, w] of dv) {
    if (sv.has(id)) continue
    const from = (sources.get(id) ?? []).map(f => sv.get(f)!)
    // a merged vertex grows out of the centroid of its members
    const c = from.length ? { x: from.reduce((n, v) => n + (v.x ?? 0), 0) / from.length, y: from.reduce((n, v) => n + (v.y ?? 0), 0) / from.length } : pt(w)
    place(w, from.length ? { x: lerp(c.x, w.x ?? 0, u), y: lerp(c.y, w.y ?? 0, u) } : pt(w), u)
  }

  const se = new Map(s.edges.filter(visible).map(e => [e.id, e]))
  const de = new Map(d.edges.filter(visible).map(e => [e.id, e]))
  const edges: Edge[] = []
  for (const [id, e] of se) {
    // shared edge: dest classes, but s endpoints, so it follows the sliding vertices
    if (de.has(id)) edges.push({ ...(dest.edges.find(x => x.id === id) ?? de.get(id)!), tail: e.tail, head: e.head })
    else { edges.push(e); fade[`e:${id}`] = 1 - u }
  }
  for (const [id, e] of de) if (!se.has(id)) { edges.push(e); fade[`e:${id}`] = u }
  const base = u < 0.5 ? s : d
  return { graph: { ...base, vertices, edges }, fade }
}
