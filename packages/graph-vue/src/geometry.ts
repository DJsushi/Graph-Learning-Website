// Edge routing and shapes in screen coordinates (px, y down). Shared by the renderer and exporters.
import { ends, type Edge, type GraphData, type Id } from '@core/model'

export const UNIT = 64        // px per layout unit
export const R = 13           // vertex radius

export interface Pt { x: number; y: number }
export interface EdgeGeom {
  id: Id
  d: string
  /** hit path (same as d) */
  label: Pt
  arrow?: string
  midArrow?: string
  loop?: boolean
  /** points the drawing must fit besides the label: the `via` points */
  extent?: Pt[]
}

export const toScreen = (x: number, y: number): Pt => ({ x: x * UNIT, y: -y * UNIT })

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k })
const len = (a: Pt) => Math.hypot(a.x, a.y) || 1
const unit = (a: Pt): Pt => mul(a, 1 / len(a))
const perp = (a: Pt): Pt => ({ x: -a.y, y: a.x })
const f = (n: number) => Math.round(n * 10) / 10

const ARROW = 9
// the line of an arrowed edge stops under the arrowhead; otherwise it shows beside the thin tip
const TUCK = ARROW * 0.6

function arrowHead(tip: Pt, dir: Pt, size = ARROW): string {
  const u = unit(dir), n = perp(u)
  const base = sub(tip, mul(u, size))
  const a = add(base, mul(n, size * 0.45)), b = sub(base, mul(n, size * 0.45))
  return `M${f(tip.x)},${f(tip.y)} L${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)} Z`
}

/** Points an edge is routed through, `via="(x,y) (x,y)"` in layout units (GRAPH_DSL.md §5.2), in screen coordinates. */
export function viaPoints(e: Edge): Pt[] {
  if (e.data.via === undefined) return []
  return [...String(e.data.via).matchAll(/\(\s*([-+0-9.eE]+)\s*,\s*([-+0-9.eE]+)\s*\)/g)].map(m => toScreen(Number(m[1]), Number(m[2])))
}

/** Catmull–Rom curve through the points as cubic Bézier segments [control 1, control 2, end]. */
function smooth(pts: Pt[]): [Pt, Pt, Pt][] {
  const out: [Pt, Pt, Pt][] = []
  for (let i = 0; i + 1 < pts.length; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    out.push([add(p1, mul(sub(p2, p0), 1 / 6)), sub(p2, mul(sub(p3, p1), 1 / 6)), p2])
  }
  return out
}

/** Control point of a bent edge (quadratic Bézier). */
const bendControl = (P: Pt, Q: Pt, bend: number): Pt => add(mul(add(P, Q), 0.5), mul(perp(unit(sub(Q, P))), -bend * len(sub(Q, P))))

function viaGeom(e: Edge, P: Pt, Q: Pt, via: Pt[], rad: number, midArrows?: boolean): EdgeGeom {
  const L = [P, ...via, Q], segs = smooth(L), last = segs[segs.length - 1]
  const tEnd = unit(sub(Q, last[1]))
  const end = e.directed ? sub(Q, mul(tEnd, rad + 1)) : Q
  if (e.directed && !midArrows) last[2] = sub(end, mul(tEnd, TUCK))
  else last[2] = end
  const k = via.length, i = (k + 1) >> 1
  const mid = k % 2 ? L[i] : mul(add(L[i], L[i + 1]), 0.5)
  const tan = k % 2 ? sub(L[i + 1], L[i - 1]) : sub(L[i + 1], L[i])
  const geom: EdgeGeom = {
    id: e.id,
    d: `M${f(P.x)},${f(P.y)} ${segs.map(([a, b, c]) => `C${f(a.x)},${f(a.y)} ${f(b.x)},${f(b.y)} ${f(c.x)},${f(c.y)}`).join(' ')}`,
    label: add(mid, mul(perp(unit(tan)), -11)),
    extent: via,
  }
  if (e.directed) {
    if (midArrows) geom.midArrow = arrowHead(add(mid, mul(unit(tan), 5)), tan)
    else geom.arrow = arrowHead(end, tEnd)
  }
  return geom
}

/** Points along the centre line of an ordinary edge from its tail at P to its head at Q, as drawn (faces follow it). */
export function centerline(e: Edge, P: Pt, Q: Pt, bend: number): Pt[] {
  const via = viaPoints(e)
  if (via.length) {
    const out = [P]
    let s = P
    for (const [a, b, c] of smooth([P, ...via, Q])) {
      for (let i = 1; i <= 8; i++) {
        const t = i / 8, u = 1 - t
        out.push(add(add(mul(s, u * u * u), mul(a, 3 * u * u * t)), add(mul(b, 3 * u * t * t), mul(c, t * t * t))))
      }
      s = c
    }
    return out
  }
  if (Math.abs(bend) < 1e-6 || ends(e)[0] === ends(e)[1]) return [P, Q]
  const C = bendControl(P, Q, bend)
  return Array.from({ length: 13 }, (_, i) => { const t = i / 12, u = 1 - t; return add(add(mul(P, u * u), mul(C, 2 * u * t)), mul(Q, t * t)) })
}

/** The boundary of a face along its walk, following bent and routed edges (the k-th pass over a pair uses its k-th parallel edge). */
export function facePolygon(g: GraphData, walk: Id[], pos: Map<Id, Pt>): Pt[] {
  const bends = defaultBends(g), used = new Map<string, number>(), out: Pt[] = []
  walk.forEach((u, i) => {
    const v = walk[(i + 1) % walk.length], P = pos.get(u), Q = pos.get(v)
    if (!P || !Q) return
    const k = u < v ? `${u}\u0000${v}` : `${v}\u0000${u}`
    const es = g.edges.filter(e => !e.hyper && ((e.tail[0] === u && e.head[0] === v) || (e.tail[0] === v && e.head[0] === u)))
    const n = used.get(k) ?? 0
    used.set(k, n + 1)
    const e = es[n % Math.max(1, es.length)]
    const line = !e ? [P, Q] : e.tail[0] === u ? centerline(e, P, Q, bends.get(e.id) ?? 0) : centerline(e, Q, P, bends.get(e.id) ?? 0).reverse()
    out.push(...line.slice(0, -1))
  })
  return out
}

/** Bend of every ordinary non-loop edge: parallel edges fan out around the straight line; `data.bend` overrides. */
export function defaultBends(g: GraphData): Map<Id, number> {
  const groups = new Map<string, Edge[]>()
  for (const e of g.edges) {
    if (e.hyper) continue
    const [a, b] = ends(e)
    if (a === b) continue
    const key = a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`
    groups.set(key, [...(groups.get(key) ?? []), e])
  }
  const out = new Map<Id, number>()
  for (const [key, es] of groups) {
    const [ca] = key.split('\u0000')
    es.forEach((e, i) => {
      // canonical orientation so that antiparallel arcs separate
      const canon = ends(e)[0] === ca ? 1 : -1
      const k = es.length
      out.set(e.id, e.data.bend !== undefined ? Number(e.data.bend) : k > 1 ? (i - (k - 1) / 2) * 0.32 * canon : 0)
    })
  }
  return out
}

export function routeEdges(g: GraphData, pos: Map<Id, Pt>, opts: { midArrows?: boolean; radius?: (id: Id) => number } = {}): EdgeGeom[] {
  const rad = opts.radius ?? (() => R)
  const bends = defaultBends(g)
  const groups = new Map<string, Edge[]>()
  const loops = new Map<Id, Edge[]>()
  for (const e of g.edges) {
    if (e.hyper) continue
    const [a, b] = ends(e)
    if (a === b) { loops.set(a, [...(loops.get(a) ?? []), e]); continue }
    const key = a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`
    groups.set(key, [...(groups.get(key) ?? []), e])
  }
  const out: EdgeGeom[] = []
  for (const es of groups.values()) {
    es.forEach(e => {
      const [a, b] = ends(e)
      const P = pos.get(a), Q = pos.get(b)
      if (!P || !Q) return
      const bend = bends.get(e.id) ?? 0
      const via = viaPoints(e)
      if (via.length) { out.push(viaGeom(e, P, Q, via, rad(b), opts.midArrows)); return }
      const v = sub(Q, P), L = len(v), n = perp(unit(v))
      if (Math.abs(bend) < 1e-6) {
        const u = unit(v)
        const start = add(P, mul(u, e.directed ? rad(a) * 0.2 : 0))
        const end = e.directed ? sub(Q, mul(u, rad(b) + 1)) : Q
        const lineEnd = e.directed && !opts.midArrows ? sub(end, mul(u, TUCK)) : end
        const mid = mul(add(P, Q), 0.5)
        const geom: EdgeGeom = { id: e.id, d: `M${f(start.x)},${f(start.y)} L${f(lineEnd.x)},${f(lineEnd.y)}`, label: add(mid, mul(n, -11)) }
        if (e.directed) {
          if (opts.midArrows) geom.midArrow = arrowHead(add(mid, mul(u, 5)), u)
          else geom.arrow = arrowHead(end, u)
        }
        out.push(geom)
        return
      }
      const C = bendControl(P, Q, bend)
      const tEnd = unit(sub(Q, C)), tStart = unit(sub(C, P))
      const end = e.directed ? sub(Q, mul(tEnd, rad(b) + 1)) : Q
      const lineEnd = e.directed && !opts.midArrows ? sub(end, mul(tEnd, TUCK)) : end
      const start = P
      const mid = add(add(mul(P, 0.25), mul(C, 0.5)), mul(Q, 0.25))
      const geom: EdgeGeom = {
        id: e.id,
        d: `M${f(start.x)},${f(start.y)} Q${f(C.x)},${f(C.y)} ${f(lineEnd.x)},${f(lineEnd.y)}`,
        label: add(mid, mul(unit(sub(mid, mul(add(P, Q), 0.5))), 11)),
      }
      if (e.directed) {
        if (opts.midArrows) geom.midArrow = arrowHead(add(mid, mul(unit(sub(Q, P)), 5)), sub(Q, P))
        else geom.arrow = arrowHead(end, tEnd)
      }
      void tStart
      out.push(geom)
    })
  }
  for (const [v, es] of loops) {
    const P = pos.get(v)
    if (!P) continue
    // direction: away from the neighbours' centroid
    const nb = g.edges.filter(e => !e.hyper).flatMap(e => {
      const [a, b] = ends(e)
      return a === v && b !== v ? [b] : b === v && a !== v ? [a] : []
    }).map(id => pos.get(id)).filter(Boolean) as Pt[]
    let dir: Pt = { x: 0, y: -1 }
    if (nb.length) {
      const c = mul(nb.reduce(add, { x: 0, y: 0 }), 1 / nb.length)
      const away = sub(P, c)
      if (len(away) > 1) dir = unit(away)
    }
    es.forEach((e, i) => {
      const via = viaPoints(e)
      if (via.length) { out.push({ ...viaGeom(e, P, P, via, rad(v), opts.midArrows), loop: true }); return }
      const side = e.data.side
      let d = dir
      if (side !== undefined) {
        const ang = typeof side === 'number' ? side : ({ top: 90, bottom: 270, left: 180, right: 0 } as Record<string, number>)[String(side)] ?? 90
        d = { x: Math.cos((ang * Math.PI) / 180), y: -Math.sin((ang * Math.PI) / 180) }
      }
      const size = 40 + i * 12
      const spread = 0.55
      const c1 = add(P, mul(add(d, mul(perp(d), spread)), size))
      const c2 = add(P, mul(sub(d, mul(perp(d), spread)), size))
      const tip = add(P, mul(unit(sub(c2, P)), rad(v) + 1))
      const lineEnd = add(tip, mul(unit(sub(c2, tip)), TUCK))
      const geom: EdgeGeom = {
        id: e.id, loop: true,
        d: `M${f(P.x)},${f(P.y)} C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(e.directed ? lineEnd.x : P.x)},${f(e.directed ? lineEnd.y : P.y)}`,
        label: add(P, mul(d, size * 0.85 + 8)),
      }
      if (e.directed) geom.arrow = arrowHead(tip, sub(tip, c2))
      out.push(geom)
    })
  }
  return out
}

/** Convex hull (monotone chain). */
export function hull(points: Pt[]): Pt[] {
  const p = [...points].sort((a, b) => a.x - b.x || a.y - b.y)
  if (p.length <= 2) return p
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const lower: Pt[] = [], upper: Pt[] = []
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q) }
  for (const q of [...p].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q) }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}

/** Path for a rounded blob around points (drawn with a thick round stroke). */
export function blobPath(points: Pt[]): string {
  const h = hull(points)
  if (!h.length) return ''
  if (h.length === 1) return `M${f(h[0].x)},${f(h[0].y)} l0.01,0`
  return `M${h.map(q => `${f(q.x)},${f(q.y)}`).join(' L')} Z`
}

export function centroid(points: Pt[]): Pt {
  return mul(points.reduce(add, { x: 0, y: 0 }), 1 / Math.max(1, points.length))
}

/**
 * Metaball bridge between two circles (after Hiroyuki Sato): a closed path that pinches into a neck when the circles are
 * close and snaps off when they are further than r1 + 2.5 r2 apart. Undefined when there is no neck to draw.
 */
export function bridgePath(c1: Pt, r1: number, c2: Pt, r2: number, v = 0.5, handleSize = 2.4): string | undefined {
  const dx = c2.x - c1.x, dy = c2.y - c1.y, d = Math.hypot(dx, dy)
  if (d > r1 + r2 * 2.5 || d <= Math.abs(r1 - r2) + 0.01) return undefined
  const at = (c: Pt, a: number, r: number): Pt => ({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r })
  const u1 = d < r1 + r2 ? Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d)) : 0
  const u2 = d < r1 + r2 ? Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d)) : 0
  const th = Math.atan2(dy, dx), spread = Math.acos((r1 - r2) / d)
  const a1 = th + u1 + (spread - u1) * v, a2 = th - u1 - (spread - u1) * v
  const a3 = th + Math.PI - u2 - (Math.PI - u2 - spread) * v, a4 = th - Math.PI + u2 + (Math.PI - u2 - spread) * v
  const p1 = at(c1, a1, r1), p2 = at(c1, a2, r1), p3 = at(c2, a3, r2), p4 = at(c2, a4, r2)
  const total = r1 + r2
  const k = Math.min(v * handleSize, Math.hypot(p1.x - p3.x, p1.y - p3.y) / total) * Math.min(1, (d * 2) / total)
  const h1 = at(p1, a1 - Math.PI / 2, r1 * k), h2 = at(p2, a2 + Math.PI / 2, r1 * k)
  const h3 = at(p3, a3 + Math.PI / 2, r2 * k), h4 = at(p4, a4 - Math.PI / 2, r2 * k)
  const fmt = (p: Pt) => `${f(p.x)},${f(p.y)}`
  return `M${fmt(p1)} C${fmt(h1)} ${fmt(h3)} ${fmt(p3)} A${r2},${r2} 0 1 0 ${fmt(p4)} C${fmt(h4)} ${fmt(h2)} ${fmt(p2)} A${r1},${r1} 0 1 0 ${fmt(p1)}Z`
}
