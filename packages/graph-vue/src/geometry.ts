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
}

export const toScreen = (x: number, y: number): Pt => ({ x: x * UNIT, y: -y * UNIT })

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k })
const len = (a: Pt) => Math.hypot(a.x, a.y) || 1
const unit = (a: Pt): Pt => mul(a, 1 / len(a))
const perp = (a: Pt): Pt => ({ x: -a.y, y: a.x })
const f = (n: number) => Math.round(n * 10) / 10

function arrowHead(tip: Pt, dir: Pt, size = 9): string {
  const u = unit(dir), n = perp(u)
  const base = sub(tip, mul(u, size))
  const a = add(base, mul(n, size * 0.45)), b = sub(base, mul(n, size * 0.45))
  return `M${f(tip.x)},${f(tip.y)} L${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)} Z`
}

export function routeEdges(g: GraphData, pos: Map<Id, Pt>, opts: { midArrows?: boolean; radius?: (id: Id) => number } = {}): EdgeGeom[] {
  const rad = opts.radius ?? (() => R)
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
  for (const [key, es] of groups) {
    const [ca] = key.split('\u0000')
    es.forEach((e, i) => {
      const [a, b] = ends(e)
      const P = pos.get(a), Q = pos.get(b)
      if (!P || !Q) return
      // canonical orientation so that antiparallel arcs separate
      const canon = a === ca ? 1 : -1
      const k = es.length
      let bend = k > 1 ? (i - (k - 1) / 2) * 0.32 * canon : 0
      if (e.data.bend !== undefined) bend = Number(e.data.bend)
      const v = sub(Q, P), L = len(v), n = perp(unit(v))
      if (Math.abs(bend) < 1e-6) {
        const u = unit(v)
        const start = add(P, mul(u, e.directed ? rad(a) * 0.2 : 0))
        const end = e.directed ? sub(Q, mul(u, rad(b) + 1)) : Q
        const mid = mul(add(P, Q), 0.5)
        const geom: EdgeGeom = { id: e.id, d: `M${f(start.x)},${f(start.y)} L${f(end.x)},${f(end.y)}`, label: add(mid, mul(n, -11)) }
        if (e.directed) {
          if (opts.midArrows) geom.midArrow = arrowHead(add(mid, mul(u, 5)), u)
          else geom.arrow = arrowHead(end, u)
        }
        out.push(geom)
        return
      }
      const C = add(mul(add(P, Q), 0.5), mul(n, -bend * L))
      const tEnd = unit(sub(Q, C)), tStart = unit(sub(C, P))
      const end = e.directed ? sub(Q, mul(tEnd, rad(b) + 1)) : Q
      const start = P
      const mid = add(add(mul(P, 0.25), mul(C, 0.5)), mul(Q, 0.25))
      const geom: EdgeGeom = {
        id: e.id,
        d: `M${f(start.x)},${f(start.y)} Q${f(C.x)},${f(C.y)} ${f(end.x)},${f(end.y)}`,
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
      const geom: EdgeGeom = {
        id: e.id, loop: true,
        d: `M${f(P.x)},${f(P.y)} C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(e.directed ? tip.x : P.x)},${f(e.directed ? tip.y : P.y)}`,
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
