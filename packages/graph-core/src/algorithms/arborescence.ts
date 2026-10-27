import { emptyGraph, num, type GraphData, type Id } from '../model'
import { Recorder, fmt, vname, type AlgorithmDef, type Step } from './types'

interface Arc { id: string; from: Id; to: Id; w: number; orig: string; order: number }

interface LevelResult { arcs: Arc[]; steps: Step[] }

/** Edmonds' (Chu–Liu) branching algorithm with step recording. */
export const edmondsBranching: AlgorithmDef = {
  id: 'edmonds-branching',
  name: "Edmonds' branching algorithm",
  labels: ['select', 'reduce', 'test', 'done', 'contract', 'recurse', 'expand'],
  params: ['root'],
  directed: true,
  *run(g, params) {
    const r = params.root ?? g.vertices.find(v => v.classes.includes('source'))?.id ?? g.vertices[0]?.id
    if (!r || !g.vertices.some(v => v.id === r)) throw new Error(`edmonds-branching: unknown root "${r}"`)
    const pos = new Map(g.vertices.map(v => [v.id, { x: v.x, y: v.y }]))
    const labels = new Map(g.vertices.map(v => [v.id, v.label]))
    const arcs: Arc[] = g.edges.filter(e => e.directed && !e.hyper && e.head[0] !== r && e.tail[0] !== e.head[0])
      .map((e, i) => ({ id: e.id, from: e.tail[0], to: e.head[0], w: num(e.data.w, 1), orig: e.id, order: i }))
    const res = solve(g.vertices.map(v => v.id), arcs, r, 0, pos, labels, g)
    if (!res) {
      yield new Recorder().snap('Some vertex has no entering arc: there is no arborescence rooted at the root.')
      return { cost: Infinity }
    }
    yield* res.steps
    const R = new Recorder()
    let cost = 0
    const chosen = new Set(res.arcs.map(a => a.orig))
    for (const e of g.edges) if (chosen.has(e.id)) { R.addE(e.id, 'tree'); cost += num(e.data.w, 1) }
    yield R.snap(`Result: a min-cost arborescence rooted at $${vname(g, r)}$ of cost $${fmt(cost)}$.`, { line: 'return', graph: g, state: { cost: fmt(cost) } })
    return { cost, arcs: chosen }
  },
}

function display(vertices: Id[], arcs: Arc[], members: Map<Id, Id[]>, pos: Map<Id, { x?: number; y?: number }>, labels: Map<Id, string | undefined>, orig: GraphData): GraphData {
  const d = emptyGraph('directed')
  d.vertices = vertices.map(v => {
    const ms = members.get(v) ?? [v]
    const ps = ms.map(m => pos.get(m)).filter(p => p?.x !== undefined) as { x: number; y: number }[]
    const label = members.has(v) ? `$\\{${ms.map(m => vname(orig, m)).join(',')}\\}$` : labels.get(v)
    const base = orig.vertices.find(x => x.id === v)
    return {
      id: v, label, classes: members.has(v) ? ['highlight'] : [...(base?.classes ?? [])], data: {},
      ...(ps.length ? { x: ps.reduce((z, p) => z + p.x, 0) / ps.length, y: ps.reduce((z, p) => z + p.y, 0) / ps.length, pinned: true } : {}),
    }
  })
  d.edges = arcs.map(a => ({ id: a.id, tail: [a.from], head: [a.to], directed: true, hyper: false, classes: [], data: { w: a.w } }))
  return d
}

function solve(V: Id[], A: Arc[], r: Id, depth: number, pos: Map<Id, { x?: number; y?: number }>, labels: Map<Id, string | undefined>, orig: GraphData, members = new Map<Id, Id[]>()): LevelResult | undefined {
  const steps: Step[] = []
  const graph = display(V, A, members, pos, labels, orig)
  const R = new Recorder()
  const ev = new Map<Id, Arc>()
  for (const v of V) {
    if (v === r) continue
    let best: Arc | undefined
    for (const a of A) if (a.to === v && (!best || a.w < best.w || (a.w === best.w && a.order < best.order))) best = a
    if (!best) return undefined
    ev.set(v, best)
  }
  for (const a of ev.values()) R.addE(a.id, 'current')
  const lvl = depth ? ` (in the contracted graph, level ${depth})` : ''
  steps.push(R.snap(`For every vertex except the root choose the cheapest entering arc $e_v$${lvl}.`, { line: 'select', graph }))
  // find cycles in the functional graph v -> parent
  const cycles: Id[][] = []
  const state = new Map<Id, number>() // 0 unvisited, 1 on stack, 2 done
  for (const v of V) {
    if (state.get(v)) continue
    const path: Id[] = []
    let x: Id | undefined = v
    while (x !== undefined && !state.get(x)) { state.set(x, 1); path.push(x); x = x === r ? undefined : ev.get(x)?.from }
    if (x !== undefined && state.get(x) === 1) cycles.push(path.slice(path.indexOf(x)))
    for (const p of path) state.set(p, 2)
  }
  if (!cycles.length) {
    R.clearClass('current')
    for (const a of ev.values()) R.addE(a.id, 'tree')
    steps.push(R.snap('The chosen arcs form an arborescence, so it is optimal (sufficient condition).', { line: 'done', graph }))
    return { arcs: [...ev.values()], steps }
  }
  const inCycle = new Map<Id, number>()
  cycles.forEach((c, i) => c.forEach(v => inCycle.set(v, i)))
  for (const c of cycles) for (const v of c) { R.addE(ev.get(v)!.id, 'cycle'); R.addV(v, 'cycle') }
  steps.push(R.snap(`The chosen arcs contain ${cycles.length === 1 ? 'a directed cycle' : `${cycles.length} directed cycles`}, so they do not form an arborescence.`, { line: 'test', graph }))
  const reduced = A.map(a => ({ ...a, w: a.w - ev.get(a.to)!.w }))
  for (const a of reduced) R.o.edgeLabels[a.id] = fmt(a.w)
  steps.push(R.snap('Replace the weights by the reduced weights $w\'(e) = w(e) - w(e_v)$; the chosen arcs now have weight $0$.', { line: 'reduce', graph }))
  // contract
  const name = (i: number) => `C${depth + 1}_${i + 1}`
  const map = (v: Id) => (inCycle.has(v) ? name(inCycle.get(v)!) : v)
  const V2 = [...V.filter(v => !inCycle.has(v)), ...cycles.map((_, i) => name(i))]
  const A2: Arc[] = []
  const back = new Map<string, Arc>()
  for (const a of reduced) {
    const x = map(a.from), y = map(a.to)
    if (x === y) continue
    const na: Arc = { id: `${a.id}~${depth + 1}`, from: x, to: y, w: a.w, orig: a.orig, order: a.order }
    back.set(na.id, a)
    A2.push(na)
  }
  const members2 = new Map(members)
  cycles.forEach((c, i) => members2.set(name(i), c.flatMap(v => members.get(v) ?? [v])))
  const graph2 = display(V2, A2, members2, pos, labels, orig)
  steps.push(new Recorder().snap('Contract every cycle to a single vertex and solve the smaller instance recursively.', { line: 'contract', graph: graph2, merges: cycles.map((c, i) => ({ from: c, to: name(i) })) }))
  const sub = solve(V2, A2, r, depth + 1, pos, labels, orig, members2)
  if (!sub) return undefined
  steps.push(...sub.steps)
  // expand
  const result: Arc[] = sub.arcs.map(a => back.get(a.id)!)
  for (let i = 0; i < cycles.length; i++) {
    const entering = result.find(a => inCycle.get(a.to) === i && inCycle.get(a.from) !== i)
    for (const v of cycles[i]) if (!entering || v !== entering.to) result.push(ev.get(v)!)
  }
  const R2 = new Recorder()
  for (const a of result) R2.addE(a.id, 'tree')
  for (const a of reduced) R2.o.edgeLabels[a.id] = fmt(a.w)
  steps.push(R2.snap(`Expand the contracted cycle${cycles.length > 1 ? 's' : ''}: keep the arc entering each cycle and all cycle arcs except the one entering the same vertex.`, { line: 'expand', graph, split: true, merges: cycles.map((c, i) => ({ from: c, to: name(i) })) }))
  return { arcs: result, steps }
}

/** Minimum arborescence cost (for predicates and tests). */
export function minArborescenceCost(g: GraphData, root: Id): number {
  const it = edmondsBranching.run(g, { root })
  let r = it.next()
  while (!r.done) r = it.next()
  return (r.value as { cost: number }).cost
}
