import { emptyGraph, num, type Edge, type GraphData, type Id } from '../model'
import { Recorder, fmt, vname, type AlgorithmDef, type Step, type StepPanel } from './types'

/** A residual arc: forward along e (f < c) or backward against e (f > 0). */
export interface ResArc { e: Edge; forward: boolean; from: Id; to: Id; cap: number }

export class FlowState {
  f = new Map<Id, number>()
  constructor(public g: GraphData) {
    for (const e of g.edges) if (!e.hyper) this.f.set(e.id, num(e.data.f, 0))
  }
  c(e: Edge) { return num(e.data.c, Infinity) }
  edges() { return this.g.edges.filter(e => !e.hyper && e.directed) }
  /** Residual arcs leaving u, in edge declaration order. */
  out(u: Id): ResArc[] {
    const out: ResArc[] = []
    for (const e of this.edges()) {
      const f = this.f.get(e.id)!
      if (e.tail[0] === u && f < this.c(e)) out.push({ e, forward: true, from: u, to: e.head[0], cap: this.c(e) - f })
      if (e.head[0] === u && f > 0) out.push({ e, forward: false, from: u, to: e.tail[0], cap: f })
    }
    return out
  }
  value(s: Id) {
    let v = 0
    for (const e of this.edges()) {
      if (e.tail[0] === s) v += this.f.get(e.id)!
      if (e.head[0] === s) v -= this.f.get(e.id)!
    }
    return v
  }
  augment(path: ResArc[], delta: number) {
    for (const a of path) this.f.set(a.e.id, this.f.get(a.e.id)! + (a.forward ? delta : -delta))
  }
  /** Vertices reachable from s in the residual graph. */
  reachable(s: Id): Set<Id> {
    const seen = new Set([s]), st = [s]
    while (st.length) for (const a of this.out(st.pop()!)) if (!seen.has(a.to)) { seen.add(a.to); st.push(a.to) }
    return seen
  }
  distances(s: Id): Map<Id, number> {
    const d = new Map([[s, 0]]), q = [s]
    while (q.length) {
      const u = q.shift()!
      for (const a of this.out(u)) if (!d.has(a.to)) { d.set(a.to, d.get(u)! + 1); q.push(a.to) }
    }
    return d
  }
  /** The residual network as a graph (for display). */
  residualGraph(filter?: (a: ResArc) => boolean): GraphData {
    const r = emptyGraph('directed')
    r.vertices = this.g.vertices.map(v => ({ ...v, classes: [...v.classes], data: {} }))
    r.meta['edge-label'] = '{c}'
    for (const v of this.g.vertices) for (const a of this.out(v.id)) {
      if (filter && !filter(a)) continue
      r.edges.push({
        id: `${a.e.id}${a.forward ? '+' : '-'}`, tail: [a.from], head: [a.to], directed: true, hyper: false,
        classes: a.forward ? [] : ['back'], data: { c: a.cap },
      })
    }
    return r
  }
}

function params2(g: GraphData, params: Record<string, string>) {
  const s = params.source ?? g.vertices.find(v => v.classes.includes('source'))?.id ?? 's'
  const t = params.sink ?? g.vertices.find(v => v.classes.includes('sink'))?.id ?? 't'
  if (!g.vertices.some(v => v.id === s)) throw new Error(`unknown source "${s}"`)
  if (!g.vertices.some(v => v.id === t)) throw new Error(`unknown sink "${t}"`)
  return { s, t }
}

function paint(R: Recorder, F: FlowState) {
  for (const e of F.edges()) {
    const f = F.f.get(e.id)!
    R.o.edgeData[e.id] = { f }
    if (f >= F.c(e)) R.addE(e.id, 'saturated'); else R.delE(e.id, 'saturated')
  }
}

const arcName = (g: GraphData, path: ResArc[]) => [path[0].from, ...path.map(a => a.to)].map(v => vname(g, v)).join(' \\to ')

function residualPanel(F: FlowState, path?: ResArc[], title = 'residual network $G_f$'): StepPanel {
  const graph = F.residualGraph()
  const R = new Recorder()
  for (const a of path ?? []) R.addE(`${a.e.id}${a.forward ? '+' : '-'}`, 'path')
  return { title, graph, overlay: R.o }
}

function findPath(F: FlowState, s: Id, t: Id, choice: string): ResArc[] | undefined {
  if (choice === 'bfs') {
    const prev = new Map<Id, ResArc>(), q = [s], seen = new Set([s])
    while (q.length) {
      const u = q.shift()!
      for (const a of F.out(u)) if (!seen.has(a.to)) { seen.add(a.to); prev.set(a.to, a); q.push(a.to) }
    }
    if (!seen.has(t)) return undefined
    const path: ResArc[] = []
    for (let v = t; v !== s; v = prev.get(v)!.from) path.unshift(prev.get(v)!)
    return path
  }
  if (choice === 'widest') {
    // maximum bottleneck path (Dijkstra-like)
    const best = new Map<Id, number>([[s, Infinity]]), prev = new Map<Id, ResArc>(), done = new Set<Id>()
    for (;;) {
      let u: Id | undefined
      for (const [v, w] of best) if (!done.has(v) && (u === undefined || w > best.get(u)!)) u = v
      if (u === undefined) break
      done.add(u)
      for (const a of F.out(u)) {
        const w = Math.min(best.get(u)!, a.cap)
        if (!done.has(a.to) && w > (best.get(a.to) ?? 0)) { best.set(a.to, w); prev.set(a.to, a) }
      }
    }
    if (!prev.has(t)) return undefined
    const path: ResArc[] = []
    for (let v = t; v !== s; v = prev.get(v)!.from) path.unshift(prev.get(v)!)
    return path
  }
  // dfs in declaration order
  const seen = new Set([s])
  const go = (u: Id): ResArc[] | undefined => {
    if (u === t) return []
    for (const a of F.out(u)) {
      if (seen.has(a.to)) continue
      seen.add(a.to)
      const rest = go(a.to)
      if (rest) return [a, ...rest]
    }
    return undefined
  }
  return go(s)
}

function* augmentingPathAlgorithm(g: GraphData, params: Record<string, string>, choice: string): Generator<Step, unknown> {
  const { s, t } = params2(g, params)
  const F = new FlowState(g)
  const R = new Recorder()
  paint(R, F)
  yield R.snap('Start with the zero flow (or the given flow).', { line: 'init', panels: [residualPanel(F)], state: { '|f|': fmt(F.value(s)) } })
  for (let it = 1; it < 1000; it++) {
    const path = findPath(F, s, t, choice)
    if (!path) break
    const delta = Math.min(...path.map(a => a.cap))
    if (choice === 'bfs') {
      const d = F.distances(s)
      for (const v of g.vertices) R.badge(v.id, d.has(v.id) ? String(d.get(v.id)) : '\\infty')
    }
    for (const a of path) R.addE(a.e.id, 'path')
    const back = path.some(a => !a.forward)
    yield R.snap(`Augmenting path $${arcName(g, path)}$ with bottleneck capacity $\\delta = ${fmt(delta)}$${back ? ' (it uses a reverse edge, cancelling some flow)' : ''}.`,
      { line: 'path', panels: [residualPanel(F, path)], state: { '|f|': fmt(F.value(s)), δ: fmt(delta) } })
    F.augment(path, delta)
    paint(R, F)
    yield R.snap(`Augment: the flow value grows to $${fmt(F.value(s))}$.`, { line: 'augment', panels: [residualPanel(F)], state: { '|f|': fmt(F.value(s)) } })
    R.clearClass('path')
  }
  for (const v of g.vertices) R.badge(v.id, undefined)
  const S = F.reachable(s)
  R.o.groups = [{ id: 'S', members: [...S], label: '$S$', classes: ['highlight'] }]
  let cap = 0
  for (const e of F.edges()) if (S.has(e.tail[0]) && !S.has(e.head[0])) { R.addE(e.id, 'cut'); cap += F.c(e) }
  yield R.snap(`No augmenting path is left: the flow is maximum, $|f| = ${fmt(F.value(s))}$. The vertices reachable from $${vname(g, s)}$ in $G_f$ form a minimum cut of capacity $${fmt(cap)}$.`,
    { line: 'return', panels: [residualPanel(F)], state: { '|f|': fmt(F.value(s)), 'cap(S,T)': fmt(cap) } })
  return { value: F.value(s), flow: F.f, cut: S }
}

export const fordFulkerson: AlgorithmDef = {
  id: 'ford-fulkerson',
  name: 'Ford–Fulkerson algorithm',
  labels: ['init', 'path', 'augment', 'return'],
  params: ['source', 'sink', 'choice'],
  directed: true,
  run: (g, p) => augmentingPathAlgorithm(g, p, p.choice ?? 'dfs'),
}

export const edmondsKarp: AlgorithmDef = {
  id: 'edmonds-karp',
  name: 'Edmonds–Karp algorithm',
  labels: ['init', 'path', 'augment', 'return'],
  params: ['source', 'sink'],
  directed: true,
  run: (g, p) => augmentingPathAlgorithm(g, p, 'bfs'),
}

function levelPanel(F: FlowState, level: Map<Id, number>, dead: Set<Id> = new Set(), path?: ResArc[]): StepPanel {
  const graph = F.residualGraph(a => level.get(a.to) === (level.get(a.from) ?? -9) + 1 && !dead.has(a.from) && !dead.has(a.to))
  const R = new Recorder()
  for (const [v, l] of level) R.badge(v, `L_{${l}}`)
  for (const v of dead) R.addV(v, 'muted')
  for (const a of path ?? []) R.addE(`${a.e.id}${a.forward ? '+' : '-'}`, 'path')
  return { title: 'level graph $L$', graph, overlay: R.o }
}

export const dinic: AlgorithmDef = {
  id: 'dinic',
  name: "Dinic's algorithm",
  labels: ['init', 'phase', 'level', 'blocking', 'augment', 'return'],
  params: ['source', 'sink'],
  directed: true,
  *run(g, params) {
    const { s, t } = params2(g, params)
    const F = new FlowState(g)
    const R = new Recorder()
    paint(R, F)
    yield R.snap('Start with the zero flow.', { line: 'init', state: { '|f|': fmt(F.value(s)) } })
    for (let phase = 1; phase <= g.vertices.length + 1; phase++) {
      const level = F.distances(s)
      if (!level.has(t)) break
      const inL = (a: ResArc) => level.get(a.to) === level.get(a.from)! + 1
      yield R.snap(`Phase ${phase}: compute the level graph of $G_f$ (distance from $${vname(g, s)}$ is $${level.get(t)}$).`,
        { line: 'level', panels: [levelPanel(F, level)], state: { phase: String(phase), '|f|': fmt(F.value(s)) } })
      // blocking flow by advance / retreat
      const dead = new Set<Id>()
      let blocked = 0
      for (let guard = 0; guard < 10000; guard++) {
        const path: ResArc[] = []
        let v = s
        while (v !== t) {
          const a = F.out(v).find(x => inL(x) && !dead.has(x.to))
          if (!a) {
            if (v === s) break
            dead.add(v)
            path.pop()
            v = path.length ? path[path.length - 1].to : s
            continue
          }
          path.push(a)
          v = a.to
        }
        if (v !== t) break
        const delta = Math.min(...path.map(a => a.cap))
        for (const a of path) R.addE(a.e.id, 'path')
        yield R.snap(`Advance along $${arcName(g, path)}$ in the level graph and augment by $${fmt(delta)}$.`,
          { line: 'blocking', panels: [levelPanel(F, level, dead, path)], state: { phase: String(phase), '|f|': fmt(F.value(s)), δ: fmt(delta) } })
        F.augment(path, delta)
        blocked += delta
        paint(R, F)
        R.clearClass('path')
      }
      yield R.snap(`The flow found in phase ${phase} is blocking (every path of the level graph has a saturated edge). After the phase, $|f| = ${fmt(F.value(s))}$.`,
        { line: 'augment', panels: [residualPanel(F)], state: { phase: String(phase), '|f|': fmt(F.value(s)), 'blocking flow': fmt(blocked) } })
    }
    const S = F.reachable(s)
    R.o.groups = [{ id: 'S', members: [...S], label: '$S$', classes: ['highlight'] }]
    for (const e of F.edges()) if (S.has(e.tail[0]) && !S.has(e.head[0])) R.addE(e.id, 'cut')
    yield R.snap(`$${vname(g, t)}$ is no longer reachable from $${vname(g, s)}$ in $G_f$: the flow of value $${fmt(F.value(s))}$ is maximum.`, { line: 'return', state: { '|f|': fmt(F.value(s)) } })
    return { value: F.value(s), flow: F.f }
  },
}

export const mpm: AlgorithmDef = {
  id: 'mpm',
  name: 'MPM algorithm',
  labels: ['min', 'push', 'pull', 'erase'],
  params: ['source', 'sink'],
  directed: true,
  *run(g, params) {
    const { s, t } = params2(g, params)
    const F = new FlowState(g)
    const R = new Recorder()
    paint(R, F)
    yield R.snap('Start with the zero flow.', { state: { '|f|': fmt(F.value(s)) } })
    for (let phase = 1; phase <= g.vertices.length + 1; phase++) {
      const level = F.distances(s)
      if (!level.has(t)) break
      // level graph arcs with residual capacities, frozen for this phase; then work on them
      type A = { a: ResArc; cap: number }
      let arcs: A[] = []
      for (const v of g.vertices) for (const a of F.out(v.id)) if (level.get(a.to) === (level.get(a.from) ?? -9) + 1) arcs.push({ a, cap: a.cap })
      const alive = new Set(g.vertices.map(v => v.id).filter(v => level.has(v)))
      const prune = () => {
        for (let changed = true; changed;) {
          changed = false
          for (const v of [...alive]) {
            if (v === s || v === t) continue
            const hasIn = arcs.some(x => x.cap > 0 && x.a.to === v && alive.has(x.a.from))
            const hasOut = arcs.some(x => x.cap > 0 && x.a.from === v && alive.has(x.a.to))
            if (!hasIn || !hasOut) { alive.delete(v); changed = true }
          }
        }
        arcs = arcs.filter(x => x.cap > 0 && alive.has(x.a.from) && alive.has(x.a.to))
      }
      const capOf = (v: Id) => {
        const inn = arcs.filter(x => x.a.to === v).reduce((z, x) => z + x.cap, 0)
        const out = arcs.filter(x => x.a.from === v).reduce((z, x) => z + x.cap, 0)
        return v === s ? out : v === t ? inn : Math.min(inn, out)
      }
      prune()
      yield R.snap(`Phase ${phase}: level graph of $G_f$; vertices not on an $s$–$t$ path are removed.`, { line: 'min', panels: [levelPanel(F, level, new Set(g.vertices.map(v => v.id).filter(v => !alive.has(v))))], state: { phase: String(phase), '|f|': fmt(F.value(s)) } })
      for (let guard = 0; guard < 1000 && alive.has(s) && alive.has(t); guard++) {
        const caps = new Map([...alive].map(v => [v, capOf(v)]))
        for (const v of g.vertices) R.badge(v.id, caps.has(v.id) ? fmt(caps.get(v.id)!) : undefined)
        let v = [...alive][0]
        for (const x of alive) if (caps.get(x)! < caps.get(v)!) v = x
        const d = caps.get(v)!
        R.addV(v, 'current')
        yield R.snap(`The vertex $${vname(g, v)}$ has minimal capacity $${fmt(d)}$. Push $${fmt(d)}$ units from it towards $${vname(g, t)}$ and pull them from $${vname(g, s)}$.`,
          { line: 'min', state: { phase: String(phase), '|f|': fmt(F.value(s)) } })
        if (d > 0) {
          const move = (start: Id, dir: 1 | -1) => {
            const excess = new Map<Id, number>([[start, d]])
            const order = [...alive].sort((a, b) => dir * (level.get(a)! - level.get(b)!))
            for (const u of order) {
              let x = excess.get(u) ?? 0
              if (x <= 0 || (dir === 1 && u === t) || (dir === -1 && u === s)) continue
              for (const arc of arcs) {
                if (x <= 0) break
                const from = dir === 1 ? arc.a.from : arc.a.to
                const to = dir === 1 ? arc.a.to : arc.a.from
                if (from !== u || arc.cap <= 0) continue
                const amt = Math.min(x, arc.cap)
                arc.cap -= amt
                x -= amt
                F.f.set(arc.a.e.id, F.f.get(arc.a.e.id)! + (arc.a.forward ? amt : -amt))
                excess.set(to, (excess.get(to) ?? 0) + amt)
              }
              excess.set(u, 0)
            }
          }
          move(v, 1)
          move(v, -1)
        }
        paint(R, F)
        R.delV(v, 'current')
        alive.delete(v)
        if (v === s || v === t) alive.clear()
        prune()
        yield R.snap(`After pushing and pulling, $|f| = ${fmt(F.value(s))}$. Erase $${vname(g, v)}$ and update the capacities.`,
          { line: 'erase', state: { phase: String(phase), '|f|': fmt(F.value(s)) } })
      }
      for (const v of g.vertices) R.badge(v.id, undefined)
    }
    yield R.snap(`No augmenting path is left: the maximum flow has value $${fmt(F.value(s))}$.`, { state: { '|f|': fmt(F.value(s)) } })
    return { value: F.value(s), flow: F.f }
  },
}

/** Maximum flow value (Edmonds–Karp), for predicates, properties and tests. */
export function maxFlowValue(g: GraphData, s: Id, t: Id): { value: number; cut: Set<Id>; flow: Map<Id, number> } {
  const F = new FlowState(g)
  for (;;) {
    const p = findPath(F, s, t, 'bfs')
    if (!p) break
    F.augment(p, Math.min(...p.map(a => a.cap)))
  }
  return { value: F.value(s), cut: F.reachable(s), flow: F.f }
}
