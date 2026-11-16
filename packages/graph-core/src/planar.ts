// Planar embeddings (GRAPH_DSL.md §6, §11, §12): planarity test, facial walks, a crossing-free straight-line drawing
// and the dual graph. Works on the underlying simple graph: no loops, parallel edges once, directions and hyperedges ignored.
import { emptyGraph, ends, type Edge, type GraphData, type Id } from './model'

type Pt = { x: number; y: number }
type Adj = Map<Id, Id[]>

export interface Embedding {
  /** facial walks, all oriented the same way: each edge is walked once in each direction */
  faces: Id[][]
  /** connected components: their vertices, their faces (indices into `faces`) and the outer one */
  comps: { vertices: Id[]; faces: number[]; outer: number }[]
  /** true when the faces are the authored `face` lines, in their order */
  authored: boolean
}

const key = (a: Id, b: Id) => `${a}\u0000${b}`

function simpleAdj(g: GraphData): Adj {
  const adj: Adj = new Map(g.vertices.map(v => [v.id, []]))
  for (const e of g.edges) {
    if (e.hyper) continue
    const [a, b] = ends(e)
    if (a === b || !adj.has(a) || !adj.has(b) || adj.get(a)!.includes(b)) continue
    adj.get(a)!.push(b)
    adj.get(b)!.push(a)
  }
  return adj
}

/** Biconnected components as edge lists (Hopcroft–Tarjan). */
function blocks(adj: Adj): [Id, Id][][] {
  const disc = new Map<Id, number>(), low = new Map<Id, number>(), stack: [Id, Id][] = [], out: [Id, Id][][] = []
  let t = 0
  const dfs = (u: Id, parent?: Id) => {
    disc.set(u, t); low.set(u, t); t++
    for (const w of adj.get(u)!) {
      if (!disc.has(w)) {
        stack.push([u, w])
        dfs(w, u)
        low.set(u, Math.min(low.get(u)!, low.get(w)!))
        if (low.get(w)! >= disc.get(u)!) {
          const b: [Id, Id][] = []
          let e: [Id, Id]
          do { e = stack.pop()!; b.push(e) } while (e[0] !== u || e[1] !== w)
          out.push(b)
        }
      } else if (w !== parent && disc.get(w)! < disc.get(u)!) {
        stack.push([u, w])
        low.set(u, Math.min(low.get(u)!, disc.get(w)!))
      }
    }
  }
  for (const v of adj.keys()) if (!disc.has(v)) dfs(v)
  return out
}

/** Faces of a biconnected block by path addition (Demoucron, Malgrange, Pertuiset); undefined if it is not planar. */
function embedBlock(edges: [Id, Id][]): Id[][] | undefined {
  const adj: Adj = new Map()
  for (const [a, b] of edges) {
    if (!adj.has(a)) adj.set(a, [])
    if (!adj.has(b)) adj.set(b, [])
    adj.get(a)!.push(b)
    adj.get(b)!.push(a)
  }
  // a first cycle: the edge a-b closed by a shortest b-a path that avoids it
  const [a, b] = edges[0]
  const prev = new Map<Id, Id>([[b, b]]), q = [b]
  while (q.length && !prev.has(a)) {
    const u = q.shift()!
    for (const w of adj.get(u)!) if (!prev.has(w) && !(u === b && w === a)) { prev.set(w, u); q.push(w) }
  }
  const cycle: Id[] = []
  for (let x = a; x !== b; x = prev.get(x)!) cycle.push(x)
  cycle.push(b)
  const inH = new Set(cycle), hE = new Set<string>()
  const addPath = (p: Id[]) => p.forEach((x, i) => {
    inH.add(x)
    const y = p[i + 1]
    if (y !== undefined) { hE.add(key(x, y)); hE.add(key(y, x)) }
  })
  addPath([...cycle, cycle[0]])
  let faces = [cycle, [...cycle].reverse()]
  let left = edges.length - cycle.length
  while (left > 0) {
    // fragments: chords of H, and components of G - V(H) with the edges that attach them
    const frags: { att: Id[]; comp?: Id[] }[] = []
    for (const [u, v] of edges) if (inH.has(u) && inH.has(v) && !hE.has(key(u, v))) frags.push({ att: [u, v] })
    const seen = new Set<Id>()
    for (const s of adj.keys()) {
      if (inH.has(s) || seen.has(s)) continue
      const comp = [s], att = new Set<Id>()
      seen.add(s)
      for (let i = 0; i < comp.length; i++) for (const w of adj.get(comp[i])!) {
        if (inH.has(w)) att.add(w)
        else if (!seen.has(w)) { seen.add(w); comp.push(w) }
      }
      frags.push({ att: [...att], comp })
    }
    let pick: (typeof frags)[number] | undefined, face: Id[] | undefined
    for (const fr of frags) {
      const ok = faces.filter(f => fr.att.every(x => f.includes(x)))
      if (!ok.length) return undefined
      if (!pick || ok.length === 1) { pick = fr; face = ok[0] }
      if (ok.length === 1) break
    }
    // a path through the fragment between two of its attachments
    let path: Id[]
    if (!pick!.comp) path = pick!.att
    else {
      const comp = new Set(pick!.comp), s = pick!.att[0]
      const start = adj.get(s)!.find(w => comp.has(w))!
      const pr = new Map<Id, Id>([[start, s]]), qq = [start]
      let end: Id | undefined, t: Id | undefined
      while (qq.length && t === undefined) {
        const u = qq.shift()!
        for (const w of adj.get(u)!) {
          if (inH.has(w) && w !== s) { end = u; t = w; break }
          if (comp.has(w) && !pr.has(w)) { pr.set(w, u); qq.push(w) }
        }
      }
      path = [t!]
      for (let x = end!; x !== s; x = pr.get(x)!) path.push(x)
      path.push(s)
      path.reverse()
    }
    const f = face!, k = f.length, i = f.indexOf(path[0]), j = f.indexOf(path[path.length - 1])
    const seg = (from: number, to: number) => {
      const out: Id[] = []
      for (let x = from; ; x = (x + 1) % k) { out.push(f[x]); if (x === to) break }
      return out
    }
    const inner = path.slice(1, -1)
    faces = faces.filter(x => x !== f)
    faces.push([...seg(i, j), ...[...inner].reverse()], [...seg(j, i), ...inner])
    addPath(path)
    left -= path.length - 1
  }
  return faces
}

/** Rotation system of oriented faces: in a walk u, v, w the neighbour after u around v is w. */
function rotationOf(faces: Id[][]): Adj | string {
  const next = new Map<Id, Map<Id, Id>>()
  for (const f of faces) for (let i = 0; i < f.length; i++) {
    const u = f[(i - 1 + f.length) % f.length], v = f[i], w = f[(i + 1) % f.length]
    const m = next.get(v) ?? new Map<Id, Id>()
    next.set(v, m)
    if (m.has(u)) return `the faces pass ${u} ${v} twice in the same direction`
    m.set(u, w)
  }
  const rot: Adj = new Map()
  for (const [v, m] of next) {
    const start = m.keys().next().value as Id, list = [start]
    for (let x = m.get(start); x !== start; x = m.get(x!)) {
      if (x === undefined || list.length > m.size) return `the faces do not close around ${v}`
      list.push(x)
    }
    if (list.length !== m.size) return `the faces do not close around ${v}`
    rot.set(v, list)
  }
  return rot
}

function trace(rot: Adj): Id[][] {
  const faces: Id[][] = [], seen = new Set<string>()
  const after = (v: Id, u: Id) => { const l = rot.get(v)!; return l[(l.indexOf(u) + 1) % l.length] }
  for (const [u, ns] of rot) for (const v of ns) {
    if (seen.has(key(u, v))) continue
    const walk: Id[] = []
    for (let a = u, b = v; !seen.has(key(a, b));) {
      seen.add(key(a, b))
      walk.push(a)
      const c = after(b, a)
      a = b; b = c
    }
    faces.push(walk)
  }
  return faces
}

/** The authored faces, each turned so that every edge is walked once in each direction. */
function orientFaces(g: GraphData, adj: Adj): Id[][] | string {
  const walks = g.faces.map(f => f.walk)
  const occ = new Map<string, { f: number; dir: number }[]>()
  for (const [i, w] of walks.entries()) for (let j = 0; j < w.length; j++) {
    const u = w[j], v = w[(j + 1) % w.length]
    if (!adj.get(u)?.includes(v)) return `face ${g.faces[i].id}: ${u} ${v} is not an edge`
    const k = u < v ? key(u, v) : key(v, u)
    occ.set(k, [...(occ.get(k) ?? []), { f: i, dir: u < v ? 1 : -1 }])
  }
  for (const [u, ns] of adj) for (const v of ns) if (u < v && (occ.get(key(u, v))?.length ?? 0) !== 2)
    return `edge ${u}--${v} lies on ${occ.get(key(u, v))?.length ?? 0} face sides, expected 2`
  // a face's sign s: faces sharing an edge must walk it in opposite directions
  const sign = new Map<number, number>()
  for (let r = 0; r < walks.length; r++) {
    if (sign.has(r)) continue
    sign.set(r, 1)
    const q = [r]
    while (q.length) {
      const f = q.shift()!
      for (const os of occ.values()) {
        const [x, y] = os
        if (x.f !== f && y.f !== f) continue
        if (x.f === y.f) { if (x.dir === y.dir) return `face ${g.faces[f].id} walks an edge twice in the same direction`; continue }
        const [me, other] = x.f === f ? [x, y] : [y, x]
        const want = -sign.get(f)! * me.dir * other.dir
        if (!sign.has(other.f)) { sign.set(other.f, want); q.push(other.f) }
        else if (sign.get(other.f) !== want) return 'the faces cannot be oriented consistently'
      }
    }
  }
  return walks.map((w, i) => (sign.get(i) === 1 ? [...w] : [...w].reverse()))
}

function components(adj: Adj): Id[][] {
  const seen = new Set<Id>(), out: Id[][] = []
  for (const s of adj.keys()) {
    if (seen.has(s)) continue
    const c = [s]
    seen.add(s)
    for (let i = 0; i < c.length; i++) for (const w of adj.get(c[i])!) if (!seen.has(w)) { seen.add(w); c.push(w) }
    out.push(c)
  }
  return out
}

/**
 * A planar embedding: the authored faces if there are any (and `useFaces`), else a computed one whose outer face is the
 * longest facial walk of each component. Returns an error message when the graph is not planar or the faces are wrong.
 */
export function embed(g: GraphData, useFaces = true): Embedding | string {
  const adj = simpleAdj(g)
  const comps = components(adj)
  const authored = useFaces && g.faces.length > 0
  let faces: Id[][]
  if (authored) {
    const o = orientFaces(g, adj)
    if (typeof o === 'string') return o
    const r = rotationOf(o)
    if (typeof r === 'string') return r
    if (comps.length > 1) return 'faces need a connected graph'
    const m = [...adj.values()].reduce((s, l) => s + l.length, 0) / 2
    if (adj.size - m + o.length !== 2) return `the faces break Euler's formula: n - m + f = ${adj.size - m + o.length}`
    faces = o
  } else {
    const rot: Adj = new Map([...adj.keys()].map(v => [v, []]))
    for (const b of blocks(adj)) {
      if (b.length === 1) { const [u, v] = b[0]; rot.get(u)!.push(v); rot.get(v)!.push(u); continue }
      const fs = embedBlock(b)
      if (!fs) return 'the graph is not planar'
      // blocks meet at cut vertices: their rotations are placed one after the other
      for (const [v, l] of rotationOf(fs) as Adj) rot.get(v)!.push(...l)
    }
    faces = trace(rot)
  }
  const compOf = new Map<Id, number>()
  comps.forEach((c, i) => c.forEach(v => compOf.set(v, i)))
  return {
    faces,
    authored,
    comps: comps.map((vertices, ci) => {
      const fs = faces.flatMap((f, i) => (compOf.get(f[0]) === ci ? [i] : []))
      const flagged = authored ? fs.find(i => g.faces[i].outer) : undefined
      const outer = flagged ?? fs.reduce((best, i) => (best < 0 || faces[i].length > faces[best].length ? i : best), -1)
      return { vertices, faces: fs, outer }
    }),
  }
}

export function isPlanar(g: GraphData): boolean {
  return typeof embed(g, false) !== 'string'
}

/**
 * Convex-combination (Tutte) drawing of one component. Every face is first triangulated with extra vertices, so the
 * drawing is crossing-free for any planar graph (Floater 2003: a triangulated disk with a strictly convex boundary).
 */
function tutte(faces: Id[][], outer: number): Map<Id, Pt> {
  const adj = new Map<Id, Set<Id>>()
  const link = (a: Id, b: Id) => {
    if (!adj.has(a)) adj.set(a, new Set())
    if (!adj.has(b)) adj.set(b, new Set())
    adj.get(a)!.add(b)
    adj.get(b)!.add(a)
  }
  let dummies = 0
  const fresh = () => `\u0000${dummies++}`
  // a walk that repeats vertices gets a ring of new vertices, d_i next to w_i and w_{i+1}, so that no edge doubles
  const ring = (w: Id[]) => {
    const ds = w.map(fresh)
    w.forEach((x, i) => { link(ds[i], x); link(ds[i], w[(i + 1) % w.length]); link(ds[i], ds[(i + 1) % w.length]) })
    return ds
  }
  const fixed = new Map<Id, Pt>()
  faces.forEach((w, fi) => {
    w.forEach((x, i) => link(x, w[(i + 1) % w.length]))
    const simple = new Set(w).size === w.length
    if (fi === outer) {
      const bd = simple ? w : ring(w)
      bd.forEach((v, j) => {
        const a = Math.PI / 2 + (2 * Math.PI * j) / bd.length
        fixed.set(v, { x: Math.cos(a), y: Math.sin(a) })
      })
    } else if (!simple || w.length > 3) {
      const c = fresh()
      for (const v of simple ? w : ring(w)) link(c, v)
    }
  })
  // each free vertex is the average of its neighbours: solve the linear system by Gaussian elimination
  const free = [...adj.keys()].filter(v => !fixed.has(v))
  const idx = new Map(free.map((v, i) => [v, i]))
  const n = free.length
  const A = free.map(v => {
    const row = new Array<number>(n + 2).fill(0)
    row[idx.get(v)!] = adj.get(v)!.size
    for (const w of adj.get(v)!) {
      const p = fixed.get(w)
      if (p) { row[n] += p.x; row[n + 1] += p.y } else row[idx.get(w)!] -= 1
    }
    return row
  })
  for (let c = 0; c < n; c++) {
    let piv = c
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r
    ;[A[c], A[piv]] = [A[piv], A[c]]
    for (let r = 0; r < n; r++) {
      if (r === c || !A[r][c]) continue
      const k = A[r][c] / A[c][c]
      for (let x = c; x < n + 2; x++) A[r][x] -= k * A[c][x]
    }
  }
  const out = new Map<Id, Pt>()
  for (const [v, p] of fixed) if (!v.startsWith('\u0000')) out.set(v, p)
  for (const v of free) if (!v.startsWith('\u0000')) { const i = idx.get(v)!; out.set(v, { x: A[i][n] / A[i][i], y: A[i][n + 1] / A[i][i] }) }
  return out
}

/** Crossing-free straight-line positions (layout units, median edge length 1), components side by side; undefined if not planar. */
export function planarLayout(g: GraphData): Map<Id, Pt> | undefined {
  const emb = embed(g)
  if (typeof emb === 'string') return undefined
  const out = new Map<Id, Pt>()
  let cursor = 0
  for (const c of emb.comps) {
    const fs = c.faces.map(i => emb.faces[i])
    const pos = c.vertices.length <= 2 ? new Map(c.vertices.map((v, i) => [v, { x: i, y: 0 }])) : tutte(fs, c.faces.indexOf(c.outer))
    const lens = fs.flatMap(w => w.map((u, i) => { const p = pos.get(u)!, q = pos.get(w[(i + 1) % w.length])!; return Math.hypot(p.x - q.x, p.y - q.y) })).sort((a, b) => a - b)
    const s = lens.length ? 1 / (lens[lens.length >> 1] || 1) : 1
    const xs = c.vertices.map(v => pos.get(v)!.x * s), ys = c.vertices.map(v => pos.get(v)!.y * s)
    const x0 = Math.min(...xs), cy = (Math.min(...ys) + Math.max(...ys)) / 2
    c.vertices.forEach((v, i) => out.set(v, { x: cursor + xs[i] - x0, y: ys[i] - cy }))
    cursor += Math.max(...xs) - x0 + 1.2
  }
  return out
}

function inside(poly: Pt[], p: Pt): boolean {
  let odd = false
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length]
    if ((a.y > p.y) !== (b.y > p.y) && p.x < a.x + ((p.y - a.y) * (b.x - a.x)) / (b.y - a.y)) odd = !odd
  })
  return odd
}

/** A point inside a polygon, for face labels and dual vertices: the centroid if it is inside, else the middle of the widest horizontal chord. */
export function interiorPoint(poly: Pt[]): Pt {
  const c = { x: poly.reduce((s, p) => s + p.x, 0) / Math.max(1, poly.length), y: poly.reduce((s, p) => s + p.y, 0) / Math.max(1, poly.length) }
  if (poly.length < 3 || inside(poly, c)) return c
  const lo = Math.min(...poly.map(p => p.y)), hi = Math.max(...poly.map(p => p.y))
  let best = c, width = -1
  for (let k = 0; k < 9; k++) {
    const y = k === 0 ? c.y : lo + ((hi - lo) * k) / 9
    const xs: number[] = []
    poly.forEach((a, i) => {
      const b = poly[(i + 1) % poly.length]
      if ((a.y > y) !== (b.y > y)) xs.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y))
    })
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > width) { width = xs[i + 1] - xs[i]; best = { x: (xs[i] + xs[i + 1]) / 2, y } }
  }
  return best
}

/** Midpoint of an edge as drawn with `bend` (layout units, y up; see geometry.ts). */
function edgeMid(e: Edge, P: Pt, Q: Pt): Pt {
  const b = Number(e.data.bend ?? 0), dx = Q.x - P.x, dy = Q.y - P.y
  return { x: (P.x + Q.x) / 2 - (b / 2) * dy, y: (P.y + Q.y) / 2 + (b / 2) * dx }
}

const fmt = (p: Pt) => `(${Math.round(p.x * 1000) / 1000},${Math.round(p.y * 1000) / 1000})`

/**
 * The dual: one vertex per face (id and label of the face; computed faces are `f0` outer, `f1`, …), one edge per edge of
 * G between the faces on its two sides, all with class `dual`. If every vertex of G has a position, the dual vertices are
 * pinned inside their faces and each dual edge is routed (`via`) through the middle of the edge it crosses.
 */
export function dual(g: GraphData): GraphData {
  const seen = new Set<string>()
  for (const e of g.edges) {
    if (e.hyper) throw new Error('dual(): hyperedges have no dual')
    const [a, b] = ends(e)
    const k = a < b ? key(a, b) : key(b, a)
    if (a === b || seen.has(k)) throw new Error('dual(): the graph must have no loops and no parallel edges')
    seen.add(k)
  }
  const emb = embed(g)
  if (typeof emb === 'string') throw new Error(`dual(): ${emb}`)
  if (emb.comps.length > 1) throw new Error('dual(): the graph must be connected')
  const { faces, comps: [c] } = emb
  const d = emptyGraph()
  let inner = 0
  const ids = faces.map((_, i) => (emb.authored ? g.faces[i].id : i === c.outer ? 'f0' : `f${++inner}`))
  faces.forEach((_, i) => d.vertices.push({ id: ids[i], label: emb.authored ? g.faces[i].label : undefined, classes: ['dual'], data: {} }))
  if (!faces.length) d.vertices.push({ id: 'f0', classes: ['dual'], data: {} })
  const sideOf = new Map<string, number>()
  faces.forEach((w, i) => w.forEach((u, j) => sideOf.set(key(u, w[(j + 1) % w.length]), i)))
  const prim = g.edges.map(e => ({ e, f: sideOf.get(key(...ends(e)))!, h: sideOf.get(key(ends(e)[1], ends(e)[0]))! }))
  prim.forEach(({ f, h }, i) => d.edges.push({ id: `e${i + 1}`, tail: [ids[f]], head: [ids[h]], directed: false, hyper: false, classes: ['dual'], data: {} }))

  const P = new Map(g.vertices.filter(v => v.x !== undefined && v.y !== undefined).map(v => [v.id, { x: v.x!, y: v.y! }]))
  if (P.size < g.vertices.length || !g.vertices.length) { d.meta.defaultLayout = 'planar'; return d }
  // the outer dual vertex sits below the drawing; its edges leave outwards and follow a circle around the drawing to it
  const all = [...P.values()]
  const ctr = { x: (Math.min(...all.map(p => p.x)) + Math.max(...all.map(p => p.x))) / 2, y: (Math.min(...all.map(p => p.y)) + Math.max(...all.map(p => p.y))) / 2 }
  const R = Math.max(...all.map(p => Math.hypot(p.x - ctr.x, p.y - ctr.y))) + 0.8
  const at = faces.map((w, i) => (i === c.outer ? { x: ctr.x, y: ctr.y - R } : interiorPoint(w.map(v => P.get(v)!))))
  d.vertices.forEach((v, i) => { if (faces.length) { v.x = at[i].x; v.y = at[i].y; v.pinned = true } })
  const turn = (m: Pt) => { let t = -Math.PI / 2 - Math.atan2(m.y - ctr.y, m.x - ctr.x); while (t > Math.PI) t -= 2 * Math.PI; while (t <= -Math.PI) t += 2 * Math.PI; return t }
  const rank = prim.map((p, i) => ({ i, t: Math.abs(turn(edgeMid(p.e, P.get(ends(p.e)[0])!, P.get(ends(p.e)[1])!))) }))
    .filter(({ i }) => (prim[i].f === c.outer) !== (prim[i].h === c.outer)).sort((a, b) => a.t - b.t).map(x => x.i)
  prim.forEach(({ e, f, h }, i) => {
    const [u, v] = ends(e), pu = P.get(u)!, pv = P.get(v)!, m = edgeMid(e, pu, pv)
    let via: Pt[]
    if (f === h) {
      // a bridge: the loop crosses it and turns around its far end (the endpoint with fewer edges)
      // shortcut: the loop only clears a pendant end, for a larger subtree it crosses its edges; route by hand with via then
      const deg = (x: Id) => g.edges.filter(y => ends(y).includes(x)).length
      const [a, b] = deg(u) <= deg(v) ? [pv, pu] : [pu, pv]
      const L = Math.hypot(b.x - a.x, b.y - a.y) || 1, dir = { x: (b.x - a.x) / L, y: (b.y - a.y) / L }
      const side = Math.sign((at[f].x - m.x) * -dir.y + (at[f].y - m.y) * dir.x) || 1
      via = [{ x: m.x + side * dir.y * 0.35, y: m.y - side * dir.x * 0.35 }, { x: b.x + dir.x * 0.45, y: b.y + dir.y * 0.45 }]
    } else if (f === c.outer || h === c.outer) {
      const t = turn(m), r = R + 0.25 * rank.indexOf(i), a0 = Math.atan2(m.y - ctr.y, m.x - ctr.x)
      const steps = Math.ceil(Math.abs(t) / (Math.PI / 5))
      via = [m]
      if (Math.abs(t) > Math.PI / 8) for (let s = 0; s < steps; s++) { const a = a0 + (t * s) / steps; via.push({ x: ctr.x + r * Math.cos(a), y: ctr.y + r * Math.sin(a) }) }
      if (f === c.outer) via.reverse()
    } else via = [m]
    d.edges[i].data.via = via.map(fmt).join(' ')
  })
  return d
}
