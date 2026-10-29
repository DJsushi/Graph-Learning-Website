// Minimum-cut algorithms against brute force over all vertex subsets, on seeded random graphs.
import { describe, expect, it } from 'vitest'
import { ALGORITHMS, collect, cutCapacity, globalMinCut, gomoryHuTree, minSTCut } from '../src/algorithms'
import { emptyGraph, type GraphData, type Id } from '../src/model'
import { rng } from '../src/random'

function randomGraph(seed: number, n: number, p: number): GraphData {
  const r = rng(seed)
  const g = emptyGraph('undirected')
  g.vertices = Array.from({ length: n }, (_, i) => ({ id: `v${i}`, classes: [], data: {} }))
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (j === i + 1 || r() < p) g.edges.push({ id: `e${g.edges.length}`, tail: [`v${i}`], head: [`v${j}`], directed: false, hyper: false, classes: [], data: { c: 1 + Math.floor(r() * 9) } })
  }
  return g
}

/** All cuts δ(S) with v0 ∈ S ≠ V. */
function* cuts(g: GraphData): Generator<Set<Id>> {
  const ids = g.vertices.map(v => v.id)
  for (let mask = 0; mask < 1 << (ids.length - 1); mask++) {
    const S = new Set([ids[0], ...ids.slice(1).filter((_, i) => mask & (1 << i))])
    if (S.size < ids.length) yield S
  }
}
const bruteGlobal = (g: GraphData) => Math.min(...[...cuts(g)].map(S => cutCapacity(g, S)))
const bruteST = (g: GraphData, s: Id, t: Id) => Math.min(...[...cuts(g)].filter(S => S.has(s) !== S.has(t)).map(S => cutCapacity(g, S)))

/** Minimum edge weight on the tree path from s to t. */
function pathMin(tree: { u: Id; v: Id; w: number }[], s: Id, t: Id): number {
  const best = new Map<Id, number>([[s, Infinity]]), st = [s]
  while (st.length) {
    const x = st.pop()!
    for (const e of tree) for (const [p, q] of [[e.u, e.v], [e.v, e.u]]) if (p === x && !best.has(q)) { best.set(q, Math.min(best.get(x)!, e.w)); st.push(q) }
  }
  return best.get(t)!
}

const graphs = Array.from({ length: 25 }, (_, i) => randomGraph(100 + i, 4 + (i % 5), 0.3 + (i % 3) * 0.2))

describe('minimum cuts', () => {
  it('minimum s–t cuts by max flow agree with brute force', () => {
    for (const g of graphs.slice(0, 8)) {
      const [s, t] = [g.vertices[0].id, g.vertices.at(-1)!.id]
      const r = minSTCut(g, s, t)
      expect(r.value).toBe(bruteST(g, s, t))
      expect(cutCapacity(g, r.side)).toBe(r.value)
    }
  })
  it('Stoer–Wagner finds λ(G) and a cut of that capacity', () => {
    for (const g of graphs) {
      const r = globalMinCut(g)
      expect(r.value).toBe(bruteGlobal(g))
      expect(r.side.size).toBeGreaterThan(0)
      expect(r.side.size).toBeLessThan(g.vertices.length)
      expect(cutCapacity(g, r.side)).toBe(r.value)
    }
  })
  it('every cut of a phase is a minimum s–t cut (lecture theorem)', () => {
    for (const g of graphs.slice(0, 10)) {
      const { steps } = collect(ALGORITHMS['stoer-wagner'], g, { phases: '1' })
      const order = steps.filter(s => s.action).map(s => s.action!.id)
      const [s, t] = order.slice(-2)
      expect(cutCapacity(g, new Set([t]))).toBe(bruteST(g, s, t))
    }
  })
  it('Gomory–Hu trees: path minima equal all pairwise minimum cuts, tree edges are minimum cuts', () => {
    for (const g of graphs) {
      const tree = gomoryHuTree(g)
      expect(tree.length).toBe(g.vertices.length - 1)
      const ids = g.vertices.map(v => v.id)
      for (const s of ids) for (const t of ids) if (s < t) expect(pathMin(tree, s, t)).toBe(bruteST(g, s, t))
      // cut property: a component of T − e is a minimum cut between the ends of e
      for (const e of tree) {
        const side = new Set([e.u]), st = [e.u]
        while (st.length) { const x = st.pop()!; for (const f of tree) if (f !== e) for (const [p, q] of [[f.u, f.v], [f.v, f.u]]) if (p === x && !side.has(q)) { side.add(q); st.push(q) } }
        expect(cutCapacity(g, side)).toBe(e.w)
      }
      expect(Math.min(...tree.map(e => e.w))).toBe(bruteGlobal(g))
    }
  })
  it('Karger returns a cut; enough runs find a minimum one', () => {
    for (const g of graphs.slice(0, 10)) {
      const lambda = bruteGlobal(g)
      const vals = Array.from({ length: 40 }, (_, seed) => collect(ALGORITHMS.karger, g, { seed: String(seed) }).result as { value: number; side: Set<Id> })
      for (const r of vals) {
        expect(r.value).toBe(cutCapacity(g, r.side))
        expect(r.value).toBeGreaterThanOrEqual(lambda)
        expect(r.side.size).toBeGreaterThan(0)
        expect(r.side.size).toBeLessThan(g.vertices.length)
      }
      expect(Math.min(...vals.map(r => r.value))).toBe(lambda)
    }
  })
  it('contraction merges parallel edges: the last two vertices are joined by one edge of the cut capacity', () => {
    for (const g of graphs.slice(0, 10)) {
      const { steps, result } = collect(ALGORITHMS.karger, g, { seed: '5' })
      const last = steps.filter(s => s.merges).at(-1)!.graph!
      expect(last.vertices.length).toBe(2)
      expect(last.edges.map(e => e.data.c)).toEqual([(result as { value: number }).value])
    }
  })
})
