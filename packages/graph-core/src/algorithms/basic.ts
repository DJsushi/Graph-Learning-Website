import { GraphIndex, emptyGraph, type GraphData, type Id } from '../model'
import { Recorder, vname, type AlgorithmDef, type Step } from './types'

export const bfs: AlgorithmDef = {
  id: 'bfs',
  name: 'Breadth-first search',
  labels: ['init', 'dequeue', 'discover'],
  params: ['source'],
  *run(g, params) {
    const ix = new GraphIndex(g)
    const s = params.source ?? g.vertices[0]?.id
    if (!s || !ix.hasVertex(s)) throw new Error(`bfs: unknown source "${s}"`)
    const R = new Recorder()
    const dist = new Map<Id, number>([[s, 0]])
    const parent = new Map<Id, Id>()
    const Q: Id[] = [s]
    const state = () => ({
      Q: Q.length ? Q.map(v => vname(g, v)).join(',\\ ') : '\\emptyset',
    })
    R.addV(s, 'frontier')
    R.badge(s, '0')
    yield R.snap(`Start at $${vname(g, s)}$ with distance $0$.`, { line: 'init', state: state() })
    while (Q.length) {
      const u = Q.shift()!
      R.delV(u, 'frontier')
      R.addV(u, 'current')
      yield R.snap(`Take $${vname(g, u)}$ from the queue and scan its neighbours.`, { line: 'dequeue', state: state() })
      for (const e of ix.outEdges(u)) {
        const w = ix.other(e, u)
        if (dist.has(w)) continue
        dist.set(w, dist.get(u)! + 1)
        parent.set(w, u)
        Q.push(w)
        R.addV(w, 'frontier')
        R.addE(e.id, 'tree')
        R.badge(w, String(dist.get(w)))
        yield R.snap(`Discover $${vname(g, w)}$: $\\mathrm{dist} = ${dist.get(w)}$, parent $${vname(g, u)}$.`, { line: 'discover', state: state(), action: { kind: 'vertex', id: w } })
      }
      R.delV(u, 'current')
      R.addV(u, 'done')
    }
    yield R.snap('The queue is empty. Badges show distances from the start; bold edges form the BFS tree.', { state: state() })
    return { dist, parent }
  },
}

export const dfs: AlgorithmDef = {
  id: 'dfs',
  name: 'Depth-first search',
  params: ['source'],
  *run(g, params) {
    const ix = new GraphIndex(g)
    const s = params.source ?? g.vertices[0]?.id
    if (!s || !ix.hasVertex(s)) throw new Error(`dfs: unknown source "${s}"`)
    const R = new Recorder()
    const seen = new Set<Id>()
    let time = 0
    const steps: Step[] = []
    const visit = (u: Id) => {
      seen.add(u)
      R.addV(u, 'current')
      R.badge(u, String(++time))
      steps.push(R.snap(`Visit $${vname(g, u)}$.`, { action: { kind: 'vertex', id: u } }))
      for (const e of ix.outEdges(u)) {
        const w = ix.other(e, u)
        if (seen.has(w)) continue
        R.addE(e.id, 'tree')
        R.delV(u, 'current')
        R.addV(u, 'frontier')
        visit(w)
        R.delV(u, 'frontier')
        R.addV(u, 'current')
      }
      R.delV(u, 'current')
      R.addV(u, 'done')
      steps.push(R.snap(`$${vname(g, u)}$ is finished.`))
    }
    visit(s)
    yield* steps
    return { order: [...seen] }
  },
}

/** Havel–Hakimi: builds a realisation forwards (each round connects the vertex of the largest remaining degree). */
export const havelHakimi: AlgorithmDef = {
  id: 'havel-hakimi',
  name: 'Havel–Hakimi test',
  labels: ['sort', 'yes', 'too-big', 'reduce', 'negative'],
  params: ['seq'],
  *run(_g, params) {
    const seq = (params.seq ?? '').split(/[\s,]+/).filter(Boolean).map(Number)
    if (seq.some(x => !Number.isInteger(x) || x < 0)) throw new Error('havel-hakimi: seq must be non-negative integers')
    const n = seq.length
    const g: GraphData = emptyGraph()
    g.vertices = seq.map((_, i) => ({ id: `v${i + 1}`, label: `$v_{${i + 1}}$`, classes: [], data: {} }))
    const rem = new Map<Id, number>(seq.map((d, i) => [`v${i + 1}`, d]))
    const R = new Recorder()
    const show = (order: Id[]) => `(${order.map(v => rem.get(v)).join(', ')})`
    const badges = () => { for (const [v, d] of rem) R.badge(v, String(d)) }
    let active = g.vertices.map(v => v.id)
    let edgeNo = 0
    for (let round = 1; ; round++) {
      active.sort((a, b) => rem.get(b)! - rem.get(a)! || Number(a.slice(1)) - Number(b.slice(1)))
      badges()
      const snapG = () => structuredClone(g)
      yield R.snap(`Sort the remaining degrees non-increasingly: $${show(active)}$.`, { line: 'sort', graph: snapG(), state: { sequence: show(active) } })
      if (active.every(v => rem.get(v) === 0)) {
        yield R.snap('All remaining entries are $0$: the sequence is **graphic**. The graph built so far realises it.', { line: 'yes', graph: snapG(), state: { result: '\\text{graphic}' } })
        return { graphic: true, graph: g }
      }
      const [v, ...others] = active
      const d = rem.get(v)!
      if (d > others.length) {
        R.addV(v, 'rejected')
        yield R.snap(`$d_1 = ${d}$ but only $${others.length}$ other vertices remain: **not graphic**.`, { line: 'too-big', graph: snapG(), state: { result: '\\text{not graphic}' } })
        return { graphic: false }
      }
      R.clearClass('highlight')
      R.clearClass('current')
      R.addV(v, 'current')
      for (const w of others.slice(0, d)) {
        rem.set(w, rem.get(w)! - 1)
        const id = `e${++edgeNo}`
        g.edges.push({ id, tail: [v], head: [w], directed: false, hyper: false, classes: [], data: {} })
        R.addE(id, 'highlight')
      }
      rem.set(v, 0)
      badges()
      active = others
      yield R.snap(`Remove $${vname(g, v)}$ (degree $${d}$) and join it to the next $${d}$ vertices, decreasing their entries by one.`, { line: 'reduce', graph: snapG(), state: { sequence: show(active) } })
      if (active.some(w => rem.get(w)! < 0)) {
        yield R.snap('A negative entry appeared: **not graphic**.', { line: 'negative', graph: snapG(), state: { result: '\\text{not graphic}' } })
        return { graphic: false }
      }
      if (round > n + 1) break
    }
    return { graphic: false }
  },
}
