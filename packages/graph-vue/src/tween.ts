// Frame-to-frame interpolation of two graph snapshots that share vertex/edge ids.
import type { Edge, GraphData, Id, Merge, Vertex } from '@core/model'

export interface Tweened {
  graph: GraphData
  /** opacity of entering / leaving elements, keyed `v:<id>` / `e:<id>`; absent = fully visible */
  fade: Record<string, number>
  /** vertices currently melting into / out of one another, drawn as one liquid blob */
  goo?: Id[]
  /** merged vertices waiting behind the blob: shape hidden, label fading in */
  ghost?: Id[]
}

const visible = (el: Vertex | Edge) => !el.classes.includes('hidden')
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (x: number) => { const k = clamp01(x); return k * k * (3 - 2 * k) }
// Choreography: leaving edges fade first, vertices slide over the whole span, arrivals fade in last
const out = (u: number, early = 0.4) => 1 - smooth(u / early)
const inn = (u: number, late = 0.4) => smooth((u - (1 - late)) / late)

/**
 * The scene at progress t (0 = a, 1 = b). Shared vertices slide; vertices only in b fade in, vertices only in a fade out.
 * `merges` (oriented a -> b) make the `from` vertices slide into `to`; with `reverse` they are oriented b -> a (a split).
 */
export function interpolate(a: GraphData, b: GraphData, t: number, merges: Merge[] = [], reverse = false): Tweened {
  if (t <= 0) return { graph: a, fade: {} }
  if (t >= 1) return { graph: b, fade: {} }
  return reverse ? forward(b, a, 1 - t, merges, b) : forward(a, b, t, merges, b)
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
  const goo = new Set<Id>()
  const ghost: Id[] = []
  // the members finish sliding at 80%: the last stretch is a single round blob, so the hand-off to the merged vertex is invisible
  const pm = clamp01(u / 0.8)
  for (const [to, from] of sources) for (const f of from) { goo.add(f); if (f !== to) fade[`l:${f}`] = out(u, 0.35) }
  const place = (v: Vertex, p: { x: number; y: number }, f: number) => {
    vertices.push({ ...v, x: p.x, y: p.y })
    if (f < 1) fade[`v:${v.id}`] = f
  }
  const destOf = (id: Id, v: Vertex) => (dest.vertices.find(x => x.id === id) ?? v)
  for (const [id, v] of sv) {
    const to = target.get(id)
    const dt = to && dv.get(to)
    if (dt) place(v, { x: lerp(v.x ?? 0, dt.x ?? 0, pm), y: lerp(v.y ?? 0, dt.y ?? 0, pm) }, 1)
    else if (dv.has(id)) {
      const w = dv.get(id)!
      { const k = sources.has(id) ? pm : u; place(destOf(id, w), { x: lerp(v.x ?? 0, w.x ?? 0, k), y: lerp(v.y ?? 0, w.y ?? 0, k) }, 1) }
    } else place(v, pt(v), out(u, 0.5))
  }
  for (const [id, w] of dv) {
    if (sv.has(id)) continue
    const from = (sources.get(id) ?? []).map(f => sv.get(f)!)
    // a merged vertex grows out of the centroid of its members
    const c = from.length ? { x: from.reduce((n, v) => n + (v.x ?? 0), 0) / from.length, y: from.reduce((n, v) => n + (v.y ?? 0), 0) / from.length } : pt(w)
    if (from.length) {
      place(w, { x: lerp(c.x, w.x ?? 0, pm), y: lerp(c.y, w.y ?? 0, pm) }, 1)
      ghost.push(id)
      fade[`l:${id}`] = inn(u, 0.2)
    } else place(w, pt(w), inn(u, 0.5))
  }

  const se = new Map(s.edges.filter(visible).map(e => [e.id, e]))
  const de = new Map(d.edges.filter(visible).map(e => [e.id, e]))
  const edges: Edge[] = []
  const lone = [...de.values()].filter(f => !se.has(f.id))
  const key = (e: Edge, map: (x: Id) => Id) => {
    const ends = [...e.tail, ...e.head].map(map)
    return (e.directed ? ends : [...ends].sort()).join('>')
  }
  // arcs renamed by the step (e.g. after a contraction) still slide: pair them up by their (merged) endpoints
  const waiting = new Map<string, Edge[]>()
  for (const f of lone) { const k = key(f, x => x); waiting.set(k, [...(waiting.get(k) ?? []), f]) }
  const paired = new Set<Id>()
  for (const [id, e] of se) {
    if (de.has(id)) {
      // shared edge: dest classes, but s endpoints, so it follows the sliding vertices
      edges.push({ ...(dest.edges.find(x => x.id === id) ?? de.get(id)!), tail: e.tail, head: e.head })
      continue
    }
    const f = waiting.get(key(e, x => target.get(x) ?? x))?.shift()
    if (f) { paired.add(f.id); edges.push({ ...(dest === d ? f : e), id: e.id, tail: e.tail, head: e.head }); continue }
    edges.push(e)
    fade[`e:${id}`] = out(u)
  }
  for (const f of lone) if (!paired.has(f.id)) { edges.push(f); fade[`e:${f.id}`] = inn(u) }
  const base = u < 0.5 ? s : d
  return { graph: { ...base, vertices, edges }, fade, goo: goo.size ? [...goo] : undefined, ghost: ghost.length ? ghost : undefined }
}
