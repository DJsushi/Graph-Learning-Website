// Every number the lessons claim about their figures is checked here against the implementations.
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../../content/index'
import { parseGraph } from '../src/dsl/parser'
import { ALGORITHMS, collect, cutCapacity, edgeOrder, globalMinCut, gomoryHuTree, maxFlowValue, minArborescenceCost, minSTCut, mstEdges } from '../src/algorithms'
import { GraphIndex, ends, num, type GraphData } from '../src/model'
import { PREDICATES } from '../src/predicates'
import * as A from '../src/analysis'
import { cycle, completeBipartite, complete } from '../src/dsl/generators'

const index = loadContent(path.resolve(__dirname, '../../..'))
const fig = (id: string, panel = 0): GraphData => {
  const f = index.figureById.get(id)
  if (!f) throw new Error(`no figure ${id}`)
  const doc = parseGraph(f.source, f.info)
  expect(doc.errors).toEqual([])
  return doc.panels[panel].graph
}
const weight = (g: GraphData, ids: Set<string>) => g.edges.filter(e => ids.has(e.id)).reduce((z, e) => z + num(e.data.w), 0)
const name = (g: GraphData, id: string) => { const e = g.edges.find(x => x.id === id)!; return e.tail[0] + e.head[0] }

describe('MST lesson', () => {
  const g = fig('a01-example-graph')
  it('running example has MST weight 29 and the highlighted tree', () => {
    const m = mstEdges(g)
    expect(weight(g, m)).toBe(29)
    expect(new Set(g.edges.filter(e => e.classes.includes('tree')).map(e => e.id))).toEqual(m)
  })
  it('Kruskal accepts cf, de, fh, ab, ef, dg, ac in this order', () => {
    const { steps } = collect(ALGORITHMS.kruskal, g, {})
    const accepted = steps.filter(s => s.action).map(s => name(g, s.action!.id))
    expect(accepted).toEqual(['cf', 'de', 'fh', 'ab', 'ef', 'dg', 'ac'])
  })
  it('Jarník and Borůvka find the same tree', () => {
    expect((collect(ALGORITHMS.jarnik, g, { source: 'a' }).result as any).weight).toBe(29)
    const b = collect(ALGORITHMS.boruvka, g, {})
    expect((b.result as any).weight).toBe(29)
    expect(b.steps.some(s => s.state?.components === '3')).toBe(true)
  })
  it('MST exercise has weight 28', () => {
    const e = fig('a01-ex-mst')
    expect(weight(e, mstEdges(e))).toBe(28)
  })
  it('arborescence example costs 22, exercise costs 8', () => {
    expect(minArborescenceCost(fig('a01-arborescence-example'), 'r')).toBe(22)
    expect(minArborescenceCost(fig('a01-ex-arborescence'), 'r')).toBe(8)
    const g2 = fig('a01-arborescence-example')
    const hl = new Set(g2.edges.filter(e => e.classes.includes('tree')).map(e => e.id))
    expect(PREDICATES['is-min-arborescence']({ graph: g2, original: g2, selection: { vertices: new Set(), edges: hl }, args: { root: 'r' } }).ok).toBe(true)
  })
  it('F-heavy exercise: bd, ce, bc are F-heavy', () => {
    const g3 = fig('a01-f-heavy')
    const ids = new Set(g3.edges.filter(e => ['bd', 'ce', 'bc'].includes(e.tail[0] + e.head[0])).map(e => e.id))
    expect(PREDICATES['f-heavy-edges']({ graph: g3, original: g3, selection: { vertices: new Set(), edges: ids }, args: { forest: 'class:tree' } }).ok).toBe(true)
  })
})

describe('flow lesson', () => {
  it('lecture network: max flow 19, min cut {s,b}', () => {
    const r = maxFlowValue(fig('a02-network'), 's', 't')
    expect(r.value).toBe(19)
    expect([...r.cut].sort()).toEqual(['b', 's'])
  })
  it('Ford–Fulkerson and Edmonds–Karp reach 19', () => {
    const g = fig('a02-network')
    expect((collect(ALGORITHMS['ford-fulkerson'], g, { source: 's', sink: 't' }).result as any).value).toBe(19)
    expect((collect(ALGORITHMS['edmonds-karp'], g, { source: 's', sink: 't' }).result as any).value).toBe(19)
  })
  it('Dinic on the lecture example: 14 after phase 1, 19 after phase 2', () => {
    const { steps, result } = collect(ALGORITHMS.dinic, fig('a02-dinic-player'), { source: 's', sink: 't' })
    const ends = steps.filter(s => s.line === 'augment').map(s => s.state!['|f|'])
    expect(ends).toEqual(['14', '19'])
    expect((result as any).value).toBe(19)
  })
  it('MPM reaches 19', () => {
    expect((collect(ALGORITHMS.mpm, fig('a02-mpm-player'), { source: 's', sink: 't' }).result as any).value).toBe(19)
  })
  it('blocking flow example: 5 vs maximum 8', () => {
    const g = fig('a02-blocking-flow')
    expect(maxFlowValue(g, 's', 't').value).toBe(8)
    const f = g.edges.filter(e => e.tail[0] === 's').reduce((z, e) => z + num(e.data.f), 0)
    expect(f).toBe(5)
  })
  it('CLRS exercise network has max flow 23', () => {
    expect(maxFlowValue(fig('a02-ex-max-flow-value'), 's', 't').value).toBe(23)
  })
  it('flow example of value 19 in GRAPH_DSL-style figure is a valid flow', () => {
    const g = fig('a02-flow-example')
    expect(g.edges.filter(e => e.tail[0] === 's').reduce((z, e) => z + num(e.data.f), 0)).toBe(8)
  })
  it('matching exercise has a perfect matching', () => {
    expect(A.maxMatchingSize(new GraphIndex(fig('a02-ex-matching')))).toBe(4)
  })
})

describe('minimum cuts lesson', () => {
  const g = fig('a03-network')
  const tree = fig('a03-network', 1)
  const f = (s: string, t: string) => minSTCut(g, s, t).value
  it('the drawn tree is a Gomory–Hu tree of the lecture network (all 15 pairs, path minima)', () => {
    const w = (u: string, v: string) => num(tree.edges.find(e => (e.tail[0] === u && e.head[0] === v) || (e.tail[0] === v && e.head[0] === u))!.data.w)
    const ids = g.vertices.map(v => v.id)
    const pathMin = (s: string, t: string): number => {
      const best = new Map([[s, Infinity]]), st = [s]
      while (st.length) { const x = st.pop()!; for (const e of tree.edges) for (const [p, q] of [[e.tail[0], e.head[0]], [e.head[0], e.tail[0]]]) if (p === x && !best.has(q)) { best.set(q, Math.min(best.get(x)!, w(p, q))); st.push(q) } }
      return best.get(t)!
    }
    for (const s of ids) for (const t of ids) if (s < t) expect(pathMin(s, t)).toBe(f(s, t))
    expect([f('a', 'd'), f('a', 'c'), f('d', 'c'), f('b', 'f'), f('a', 'b'), f('e', 'd'), f('a', 'e')]).toEqual([13, 13, 14, 17, 18, 14, 13])
  })
  it('construction with the lecture pairs gives cuts 17, 18, 13, 14, 15 and the drawn tree', () => {
    const { steps } = collect(ALGORITHMS['gomory-hu'], g, { pairs: 'b f, a b, c f, d e, c e' })
    expect(steps.filter(s => s.line === 'mincut').map(s => /capacity \$(\d+)\$/.exec(s.message)![1])).toEqual(['17', '18', '13', '14', '15'])
    const key = (u: string, v: string, w: number) => [u, v].sort().join('') + w
    expect(gomoryHuTree(g, 'b f, a b, c f, d e, c e').map(e => key(e.u, e.v, e.w)).sort())
      .toEqual(tree.edges.map(e => key(e.tail[0], e.head[0], num(e.data.w))).sort())
  })
  it('cut capacities quoted in the text', () => {
    const c = (...S: string[]) => cutCapacity(g, new Set(S))
    expect([c('a'), c('a', 'b'), c('c', 'd', 'e'), c('d'), c('c')]).toEqual([18, 17, 13, 14, 15])
    expect(Math.min(...g.vertices.map(v => c(v.id)))).toBe(14)
    expect(globalMinCut(g)).toEqual({ value: 13, side: new Set(['c', 'd', 'e']) })
  })
  it('Stoer–Wagner phases: cuts 14, 15, 13, 17, 18; phase 1 order a, b, f, c, e, d', () => {
    const { steps } = collect(ALGORITHMS['stoer-wagner'], fig('a03-stoer-wagner-player'), { start: 'a' })
    expect(steps.filter(s => s.line === 'end').map(s => /= (\d+)\$; it is/.exec(s.message)![1])).toEqual(['14', '15', '13', '17', '18'])
    const phase1 = steps.slice(0, steps.findIndex(s => s.line === 'end')).filter(s => s.action).map(s => s.action!.id)
    expect(['a', ...phase1]).toEqual(['a', 'b', 'f', 'c', 'e', 'd'])
  })
  it('identification figure: δ({u,v,y}) = 14 before and after', () => {
    const fg = index.figureById.get('a03-identification')!
    const steps = parseGraph(fg.source, fg.info).panels[0].steps
    expect(cutCapacity(steps[0].graph, new Set(['u', 'v', 'y']))).toBe(14)
    expect(cutCapacity(steps.at(-1)!.graph, new Set(['w', 'y']))).toBe(14)
  })
  it('uncrossing figure: 4 + 4 vs 3 + 3', () => {
    const u = fig('a03-uncrossing')
    const c = (...S: string[]) => cutCapacity(u, new Set(S))
    expect([c('p', 'q'), c('q', 'r'), c('p', 'q', 'r'), c('q')]).toEqual([4, 4, 3, 3])
  })
  it('uncrossing walkthroughs: os is inside a region, all counts of the first and second inequality', () => {
    const u = fig('a03-uc-count')
    const c = (...S: string[]) => cutCapacity(u, new Set(S))
    expect([c('p', 'q'), c('q', 'r'), c('p', 'q', 'r'), c('q')]).toEqual([4, 4, 3, 3])
    expect([c('p'), c('r'), c('p', 'o', 's'), c('p', 'q', 'o', 's')]).toEqual([3, 3, 4, 3])
    const r = fig('a03-uc-reduce')
    expect(cutCapacity(r, new Set(['p', 'o', 's']))).toBe(cutCapacity(r, new Set(['q', 'r'])))
    expect(cutCapacity(r, new Set(['p', 'q', 'o', 's']))).toBe(cutCapacity(r, new Set(['r'])))
    expect(c('p', 'q') + c('q', 'r') - c('p', 'q', 'r') - c('q')).toBe(2)
  })
  it('Gomory–Hu lemma walkthroughs: delta(S) costs 4, X and both candidates cost 5, union and X minus S cost 4', () => {
    const set = (...S: string[]) => new Set(S)
    // setup: S = {s, v, w}, X = {s, v, p, q} (or its complement {w, r}), v–w cut
    const g = fig('a03-gh-setup')
    const c = (...S: string[]) => cutCapacity(g, set(...S))
    expect([c('s', 'v', 'w'), c('w', 'r'), c('s', 'v', 'p', 'q'), c('s', 'v'), c('w')]).toEqual([4, 5, 5, 5, 5])
    expect(minSTCut(g, 'v', 'w').value).toBe(5)
    expect(minSTCut(g, 's', 'r').value).toBe(4)
    expect(minSTCut(g, 's', 'q').value).toBe(4)
    // case t not in X (t = r of the setup figure): union cut 4, 4 + 5 <= 4 + 5
    const h = fig('a03-gh-case1')
    const ch = (...S: string[]) => cutCapacity(h, set(...S))
    expect([ch('s', 'v', 'w'), ch('s', 'v', 'w', 'p', 'q'), ch('s', 'v'), ch('s', 'v', 'p', 'q')]).toEqual([4, 4, 5, 5])
    expect(minSTCut(h, 's', 't').value).toBe(4)
    expect(minSTCut(h, 'v', 'w').value).toBe(5)
    // case t in X (t = q of the setup figure): cut of X minus S is 4, 4 + 5 <= 4 + 5
    const k = fig('a03-gh-case2')
    const ck = (...S: string[]) => cutCapacity(k, set(...S))
    expect([ck('s', 'v', 'w'), ck('p', 't'), ck('w'), ck('s', 'v', 'p', 't')]).toEqual([4, 4, 5, 5])
    expect(minSTCut(k, 's', 't').value).toBe(4)
    expect(minSTCut(k, 'v', 'w').value).toBe(5)
    // the dashed cut of each figure is delta(S)
    for (const [fg, ids] of [[g, ['vq', 'sq', 'wr']], [h, ['vq', 'sq', 'wt']], [k, ['vt', 'st', 'wr']]] as const) {
      const dashed = fg.edges.filter(e => e.classes.includes('cut')).map(e => e.tail[0] + e.head[0]).map(x => [...x].sort().join('')).sort()
      expect(dashed).toEqual(ids.map(x => [...x].sort().join('')).sort())
    }
  })
  it('contracting {a,b,c} in the lecture network raises f(e,f) from 13 to 16 and {a,b,c} is no side of a minimum cut', () => {
    const g = fig('a03-network')
    const X = new Set(['a', 'b', 'c'])
    expect(minSTCut(g, 'e', 'f').value).toBe(13)
    // contracted graph: X-f 8+3+2, X-e 2+4, X-d 5, f-e 3, f-d 2, e-d 7
    expect(Math.min(13 + 3 + 2, 6 + 3 + 7, 6 + 5 + 3 + 2)).toBe(16)
    const c = cutCapacity(g, X)
    const sides = [X, new Set(['d', 'e', 'f'])]
    for (const S of sides) for (const p of S) for (const q of g.vertices.map(v => v.id).filter(v => !S.has(v))) expect(minSTCut(g, p, q).value).toBeLessThan(c)
  })
  it('Gomory–Hu invariant walkthroughs: rounds x–s, y–x, z–a, a–b cut 5, 7, 6, 9 uniquely; f(x, a) = 5, G_B values 5 and 9', () => {
    const g = fig('a03-ghc-round')
    const sig = (h: GraphData) => h.edges.map(e => [e.tail[0], e.head[0]].sort().join('') + num(e.data.c)).sort().join()
    for (const id of ['a03-ghc-new-edge', 'a03-ghc-far-edge', 'a03-ghc-reattach', 'a03-ghc-swap']) expect(sig(fig(id))).toBe(sig(g))
    const V = g.vertices.map(v => v.id)
    const subsets: Set<string>[] = []
    for (let m = 1; m < (1 << V.length) - 1; m++) subsets.push(new Set(V.filter((_, i) => (m >> i) & 1)))
    // minimum p–q cuts of G with each block identified: [value, sides containing p]
    const mins = (p: string, q: string, blocks: string[][] = []) => {
      const ok = subsets.filter(U => U.has(p) && !U.has(q) && !blocks.some(b => b.some(v => U.has(v)) && b.some(v => !U.has(v))))
      const k = Math.min(...ok.map(U => cutCapacity(g, U)))
      return [k, ok.filter(U => cutCapacity(g, U) === k).map(U => [...U].sort().join(''))]
    }
    const { steps } = collect(ALGORITHMS['gomory-hu'], g, { pairs: 'x s, y x, z a, a b, b s' })
    expect(steps.filter(s => s.line === 'mincut').map(s => /capacity \$(\d+)\$/.exec(s.message)![1]).slice(0, 4)).toEqual(['5', '7', '6', '9'])
    // each round's minimum cut is unique: tree y–x–S–z with S = {a, b, s} before round 4, and A = {a, x, y, z}
    expect(mins('x', 's')).toEqual([5, ['xy']])
    expect(mins('y', 'x', [['a', 'b', 's', 'z']])).toEqual([7, ['y']])
    expect(mins('z', 'a', [['x', 'y']])).toEqual([6, ['z']])
    expect(mins('a', 'b', [['x', 'y']])).toEqual([9, ['axyz']])
    const f = (p: string, q: string) => minSTCut(g, p, q).value
    expect([f('y', 'x'), f('x', 's'), f('z', 'a'), f('a', 'b'), f('x', 'a')]).toEqual([7, 5, 6, 9, 5])
    const c = (...S: string[]) => cutCapacity(g, new Set(S))
    expect([c('y'), c('x', 'y'), c('z'), c('a', 'x', 'y', 'z'), 2 + 3 + 1 + 1 + 2]).toEqual([7, 5, 6, 9, 9])
    // G_B with B = {b, s}: f(x, v_B) = 5 by the cut of {x, y} (1 + 1 + 3), f(v_B, a) = 9 by the cut of v_B, f(x, a) = 5
    expect(mins('x', 'b', [['b', 's']])).toEqual([5, ['xy']])
    expect(mins('b', 'a', [['b', 's']])).toEqual([9, ['bs']])
    expect(mins('x', 'a', [['b', 's']])[0]).toBe(5)
    expect(1 + 1 + 3).toBe(5)
    // the thick edges of the steps that quote a capacity
    const thick = (id: string, step: number) => {
      const f0 = index.figureById.get(id)!
      const h = parseGraph(f0.source, f0.info).panels[0].steps[step].graph
      return h.edges.filter(e => e.classes.includes('bold')).reduce((z, e) => z + num(e.data.c ?? e.data.w), 0)
    }
    expect([thick('a03-ghc-round', 3), thick('a03-ghc-round', 4), thick('a03-ghc-new-edge', 0), thick('a03-ghc-new-edge', 2), thick('a03-ghc-new-edge', 4)]).toEqual([9, 9, 5, 6, 9])
    expect([thick('a03-ghc-far-edge', 0), thick('a03-ghc-reattach', 0), thick('a03-ghc-reattach', 2)]).toEqual([7, 5, 6])
    expect([1, 2, 5, 6, 7, 8].map(i => thick('a03-ghc-swap', i))).toEqual([5, 9, 5, 9, 9, 5])
  })
  it('Gomory–Hu correctness walkthroughs: path a, b, f, e, d with 18, 17, 13, 14; cuts {a, b} = 17 and {a, b, f} = 13', () => {
    const key = (h: GraphData) => h.edges.map(e => [e.tail[0], e.head[0]].sort().join('') + num(e.data.w)).sort().join()
    for (const id of ['a03-ghc-final-tree', 'a03-ghc-ft', 'a03-ghc-fg', 'a03-ghc-cut']) expect(key(fig(id))).toBe(key(tree))
    expect([f('a', 'b'), f('b', 'f'), f('f', 'e'), f('e', 'd'), f('a', 'd')]).toEqual([18, 17, 13, 14, 13])
    const c = (...S: string[]) => cutCapacity(g, new Set(S))
    expect([c('a', 'b'), 8 + 4 + 3 + 2, c('a', 'b', 'f'), 4 + 2 + 2 + 3 + 2]).toEqual([17, 17, 13, 13])
    expect(Math.min(18, 17, 13, 14)).toBe(13)
    // round 5 of the lecture example splits {c, e} with the cut of {c}, of capacity 15; f and d go to the side of e
    expect(minSTCut(g, 'c', 'e').value).toBe(15)
    expect(g.vertices.length - 1).toBe(5)
  })
  it('Karger players: seed 5 finds the minimum cut 2, seed 1 returns 4', () => {
    expect((collect(ALGORITHMS.karger, fig('a03-karger-good'), { seed: '5' }).result as any).value).toBe(2)
    expect((collect(ALGORITHMS.karger, fig('a03-karger-bad'), { seed: '1' }).result as any).value).toBe(4)
    expect(globalMinCut(fig('a03-karger-good')).value).toBe(2)
  })
  it('exercises: tree value 6, global cut {a,b,c} = 4, phase order a b c d e', () => {
    const t = fig('a03-ex-gomory-hu-value')
    expect(Math.min(...t.edges.filter(e => ['xu', 'uv', 'vz'].includes(e.tail[0] + e.head[0])).map(e => num(e.data.w)))).toBe(6)
    const gc = fig('a03-ex-global-cut')
    const sel = (S: string[]) => PREDICATES['is-global-min-cut-side']({ graph: gc, original: gc, selection: { vertices: new Set(S), edges: new Set() }, args: {} }).ok
    expect([sel(['a', 'b', 'c']), sel(['d', 'e', 'f']), sel(['a']), sel([])]).toEqual([true, true, false, false])
    const ph = fig('a03-ex-mincut-phase')
    expect(collect(ALGORITHMS['stoer-wagner'], ph, { start: 'a', phases: '1' }).steps.filter(s => s.action).map(s => s.action!.id)).toEqual(['b', 'c', 'd', 'e'])
  })
  it('Karger–Stein numbers: t = 9 for n = 10, t = 72 for n = 100, 19 levels for n = 1000', () => {
    const t = (n: number) => Math.ceil(1 + n / Math.SQRT2)
    expect([t(10), t(100), t(1000), t(709)]).toEqual([9, 72, 709, 503])
    let n = 1000, d = 0
    while (n > 6) { n = t(n); d++ }
    expect(d).toBe(19)
  })
})

describe('theory lessons', () => {
  it('degree sequence example is (4,4,3,3,1,1,0)', () => {
    expect(A.degreeSequence(new GraphIndex(fig('t01-degree-sequence-example')))).toEqual([4, 4, 3, 3, 1, 1, 0])
  })
  it('Havel–Hakimi build stepper ends with (7,6,6,5,4,2,2,2,2,1,1)', () => {
    const f = index.figureById.get('t01-havel-hakimi-build')!
    const doc = parseGraph(f.source, f.info)
    const last = doc.panels[0].steps.at(-1)!.graph
    expect(A.degreeSequence(new GraphIndex(last))).toEqual([7, 6, 6, 5, 4, 2, 2, 2, 2, 1, 1])
  })
  it('Havel–Hakimi player: (4,4,3,3,1,1,0) graphic; (4,4,2,2,0) and (7,2,2,1,1,1) not', () => {
    const run = (seq: string) => (collect(ALGORITHMS['havel-hakimi'], fig('t01-graph-classes'), { seq }).result as any).graphic
    expect(run('4,4,3,3,1,1,0')).toBe(true)
    expect(run('7,6,6,5,4,2,2,2,2,1,1')).toBe(true)
    expect(run('4,4,2,2,0')).toBe(false)
    expect(run('7,2,2,1,1,1')).toBe(false)
    expect(run('5,5,4,3,2,1')).toBe(false)
    expect(run('3,3,3,3,3,3')).toBe(true)
    expect(run('3,3,1,1')).toBe(false)
  })
  describe('Havel–Hakimi walkthroughs on (3,2,2,2,2,1)', () => {
    const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
    // degree and neighbours by the label $v_i$, since the renaming steps swap labels, not ids
    const byLabel = (g: GraphData) => {
      const ix = new GraphIndex(g), lab = (v: string) => Number(/v_(\d)/.exec(ix.vertex(v)!.label!)![1])
      const deg: Record<number, number> = {}, nb: Record<number, number[]> = {}
      for (const v of ix.vertexIds) { deg[lab(v)] = ix.degree(v); nb[lab(v)] = ix.neighbors(v).map(lab).sort() }
      return { deg, nb, m: ix.m, sum1: nb[1]?.reduce((z, u) => z + deg[u], 0), back1: nb[1]?.filter(u => u >= 5).length }
    }
    const seq = (g: GraphData) => Object.entries(byLabel(g).deg).sort(([a], [b]) => +a - +b).map(([, d]) => d)
    it('direction <=: H has (1,1,1,2,1); adding v1 gives (3,2,2,2,2,1)', () => {
      const s = steps('t01-havel-hakimi-back')
      expect(seq(s[0])).toEqual([1, 1, 1, 2, 1])
      expect(seq(s.at(-1)!)).toEqual([3, 2, 2, 2, 2, 1])
    })
    it('set-up: 6 edges, v1 ~ v2 v5 v6, neighbour sum 5, 2 neighbours in {v5,v6}', () => {
      const r = byLabel(steps('t01-havel-hakimi-choice')[0])
      expect([seq(steps('t01-havel-hakimi-choice')[0]), r.m, r.nb[1], r.sum1, r.back1]).toEqual([[3, 2, 2, 2, 2, 1], 6, [2, 5, 6], 5, 2])
    })
    it('case (a): v1 ~ v2 v3 v4; G - v1 has (1,1,1,2,1)', () => {
      const s = steps('t01-havel-hakimi-case-a')
      expect([seq(s[0]), byLabel(s[0]).nb[1]]).toEqual([[3, 2, 2, 2, 2, 1], [2, 3, 4]])
      expect(seq(s[1])).toEqual([1, 1, 1, 2, 1])
    })
    it('case (b): only v2 of v2..v4 is a neighbour; d(v3) = 2 > d(v6) = 1', () => {
      const r = byLabel(steps('t01-havel-hakimi-case-b')[0])
      expect([r.nb[1].filter(u => u <= 4), r.deg[3], r.deg[6]]).toEqual([[2], 2, 1])
    })
    it('equal case: v4, v5 of degree 2; after the swap degrees fit, sum 5, 1 neighbour in {v5,v6}', () => {
      const s = steps('t01-havel-hakimi-rename'), a = byLabel(s[0]), b = byLabel(s.at(-1)!)
      expect([a.deg[4], a.deg[5], a.nb[1].includes(4), a.nb[1].includes(5)]).toEqual([2, 2, false, true])
      expect([seq(s.at(-1)!), b.sum1, b.back1]).toEqual([[3, 2, 2, 2, 2, 1], 5, 1])
    })
    it('greater case: k = v4; the switch keeps (3,2,2,2,2,1), sum 5 -> 6; the swap reaches the case (a) graph', () => {
      const s = steps('t01-havel-hakimi-greater'), g = byLabel(s[0])
      expect([g.nb[3].filter(u => u !== 6), g.nb[6].filter(u => u !== 1)]).toEqual([[2, 4], []])
      const sw = byLabel(s[3])
      expect([seq(s[3]), sw.nb[1], g.sum1, sw.sum1]).toEqual([[3, 2, 2, 2, 2, 1], [2, 3, 5], 5, 6])
      const last = byLabel(s.at(-1)!), a = byLabel(steps('t01-havel-hakimi-case-a')[0])
      expect(last.nb).toEqual(a.nb)
    })
    it('2-switch figure: d(v_i) = 3 > d(v_j) = 2, and the switch keeps every degree', () => {
      const s = steps('t01-havel-hakimi-switch'), deg = (g: GraphData) => { const ix = new GraphIndex(g); return Object.fromEntries(ix.vertexIds.map(v => [v, ix.degree(v)])) }
      expect([deg(s[0]).vi, deg(s[0]).vj]).toEqual([3, 2])
      expect(deg(s.at(-1)!)).toEqual(deg(s[0]))
    })
  })
  it('handshake walkthrough: 8 edges, degree sum 16; with the loop at x 9 edges, sum 18', () => {
    const f = index.figureById.get('t01-handshake-count')!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    const steps = doc.panels[0].steps
    const sum = (g: GraphData) => { const ix = new GraphIndex(g); return ix.vertexIds.reduce((z, v) => z + ix.degree(v), 0) }
    expect([steps[0].graph.edges.length, sum(steps[0].graph)]).toEqual([8, 16])
    const last = steps.at(-1)!.graph
    expect([last.edges.length, sum(last)]).toEqual([9, 18])
    const ix = new GraphIndex(last)
    expect(ix.degree('x')).toBe(2)
    expect(ix.degree('l')).toBe(4)
    expect(ix.vertexIds.map(v => ix.degree(v)).sort()).toEqual([1, 1, 2, 3, 3, 4, 4])
  })
  it('odd-degree exercise: a, c, d, f', () => {
    const g = fig('t01-ex-odd-vertices')
    const ix = new GraphIndex(g)
    expect(ix.vertexIds.filter(v => ix.degree(v) % 2 === 1).sort()).toEqual(['a', 'c', 'd', 'f'])
  })
  it('isomorphic multigraph panels have equal degree sequences', () => {
    const a = A.degreeSequence(new GraphIndex(fig('t01-iso-multigraph', 0)))
    const b = A.degreeSequence(new GraphIndex(fig('t01-iso-multigraph', 1)))
    expect(a).toEqual(b)
  })
  it('simplicial exercise: 1, 5, 6', () => {
    const g = fig('t04-ex-simplicial')
    const ix = new GraphIndex(g)
    expect(ix.vertexIds.filter(v => A.isSimplicial(ix, v)).sort()).toEqual(['1', '5', '6'])
  })
  it('chordal stepper graph: 6, 5, 1 are simplicial in turn', () => {
    const f = index.figureById.get('t04-simplicial-decomposition')!
    const steps = parseGraph(f.source, f.info).panels[0].steps
    const simp = (g: GraphData, v: string) => A.isSimplicial(new GraphIndex(g), v)
    expect(simp(steps[0].graph, '6')).toBe(true)
    expect(simp(steps[1].graph, '5')).toBe(true)
    expect(simp(steps[2].graph, '1')).toBe(true)
  })
  it('girth facts: Petersen 5, K_{3,3} 4', () => {
    expect(A.girth(new GraphIndex(fig('t03-petersen')))).toBe(5)
    expect(A.girth(new GraphIndex(completeBipartite(3, 3)))).toBe(4)
  })
  it('spanning tree counts: K4 16, C_n n, K_{2,3} 12 (brute force)', () => {
    const count = (g: GraphData) => {
      const es = g.edges, n = g.vertices.length
      let c = 0
      const pick = (i: number, chosen: string[]) => {
        if (chosen.length === n - 1) {
          const ix = new GraphIndex(A.spanningSubgraph(g, new Set(chosen)))
          if (A.isTree(ix)) c++
          return
        }
        for (let j = i; j < es.length; j++) pick(j + 1, [...chosen, es[j].id])
      }
      pick(0, [])
      return c
    }
    expect(count(complete(4))).toBe(16)
    expect(count(complete(5))).toBe(125)
    expect(count(cycle(7))).toBe(7)
    expect(count(completeBipartite(2, 3))).toBe(12)
  })
  it('edge-disjoint paths exercise solution works', () => {
    const g = fig('t05-ex-edge-disjoint')
    const sol = new Set(g.edges.filter(e => ['sa', 'ad', 'dt', 'sb', 'be', 'et', 'sc', 'cf', 'ft'].includes(e.tail[0] + e.head[0])).map(e => e.id))
    expect(PREDICATES['contains-edge-disjoint-paths']({ graph: g, original: g, selection: { vertices: new Set(), edges: sol }, args: { k: '3', from: 's', to: 't' } }).ok).toBe(true)
  })
  it('spanning tree exercise solution is valid', () => {
    const g = fig('t03-spanning-tree-exercise')
    const sol = new Set(g.edges.filter(e => ['ab', 'ac', 'ad', 'be', 'cf', 'eg'].includes(e.tail[0] + e.head[0])).map(e => e.id))
    expect(PREDICATES['is-spanning-tree']({ graph: g, original: g, selection: { vertices: new Set(), edges: sol }, args: {} }).ok).toBe(true)
  })
  it('BFS player runs', () => {
    const { steps } = collect(ALGORITHMS.bfs, fig('t02-bfs-player'), { source: 'x' })
    expect(steps.length).toBeGreaterThan(5)
  })
})

describe('Leaves page', () => {
  // longest path length (edges) and all longest paths, by brute force
  const longest = (g: GraphData) => {
    const ix = new GraphIndex(g)
    let best = 0, paths: string[][] = []
    const go = (p: string[]) => {
      const len = p.length - 1
      if (len > best) { best = len; paths = [] }
      if (len === best) paths.push(p)
      for (const n of ix.neighbors(p[p.length - 1])) if (!p.includes(n)) go([...p, n])
    }
    for (const v of g.vertices) go([v.id])
    return { best, paths }
  }
  const deg = (g: GraphData, v: string) => new GraphIndex(g).degree(v)
  it('case (a): 5 vertices, no edges, all of degree 0', () => {
    const g = fig('t03-two-leaves-case-a')
    expect(g.vertices.length).toBe(5)
    expect(g.edges.length).toBe(0)
    expect(longest(g).best).toBe(0)
  })
  it('case (b): u..v is the unique longest path (4 edges), x prolongs it to 5, u p1 p2 is a 3-cycle', () => {
    const doc = parseGraph(index.figureById.get('t03-two-leaves-case-b')!.source)
    const g = doc.panels[0].graph, steps = doc.panels[0].steps
    expect(A.isAcyclic(new GraphIndex(g))).toBe(true)
    const { best, paths } = longest(g)
    expect(best).toBe(4)
    expect(paths.map(p => p.join(' ')).sort()).toEqual(['u p1 p2 p3 v', 'v p3 p2 p1 u'])
    expect([deg(g, 'u'), deg(g, 'v')]).toEqual([1, 1])
    expect(longest(steps[3].graph).best).toBe(5)
    const s5 = new GraphIndex(steps[5].graph)
    expect(A.isAcyclic(s5)).toBe(false)
    expect(A.girth(s5)).toBe(3)
    const last = steps[6].graph
    expect(last.edges.length).toBe(g.edges.length)
    expect([deg(last, 'u'), deg(last, 'v')]).toEqual([1, 1])
  })
  it('leaf example: leaves a e f g, d has degree 2, z degree 0', () => {
    const g = fig('t03-leaf-example'), ix = new GraphIndex(g)
    expect(g.vertices.filter(v => ix.degree(v.id) === 1).map(v => v.id).sort()).toEqual(['a', 'e', 'f', 'g'])
    expect([ix.degree('d'), ix.degree('z')]).toEqual([2, 0])
    expect(A.isAcyclic(ix)).toBe(true)
  })
})

describe('Closed walks page', () => {
  const ends = (e: { tail: string[]; head: string[] }) => [e.tail[0], e.head[0]].sort().join('')
  // traversals per edge id of a vertex walk (each consecutive pair must be an edge; simple parts only)
  const counts = (g: GraphData, walk: string[]) => {
    const c = new Map<string, number>()
    for (let i = 0; i + 1 < walk.length; i++) {
      const key = [walk[i], walk[i + 1]].sort().join('')
      const e = g.edges.filter(x => ends(x) === key)
      expect(e.length).toBe(1)
      c.set(e[0].id, (c.get(e[0].id) ?? 0) + 1)
    }
    return c
  }
  const byEnds = (g: GraphData, key: string) => g.edges.filter(e => ends(e) === key)
  it('base figure: loop at a, edge bc, two parallel edges de, two loops at f', () => {
    const g = fig('t03-closed-walk-base')
    expect(g.vertices.length).toBe(6)
    expect(g.edges.length).toBe(6)
    expect([byEnds(g, 'aa').length, byEnds(g, 'bc').length, byEnds(g, 'de').length, byEnds(g, 'ff').length]).toEqual([1, 1, 2, 2])
  })
  it('b1 figure: W = v0..v4 v0 on 5 distinct vertices is a 5-cycle, v2 y is not on W', () => {
    const g = fig('t03-closed-walk-no-repeat')
    expect(g.vertices.length).toBe(6)
    const w = ['v0', 'v1', 'v2', 'v3', 'v4', 'v0']
    expect(new Set(w.slice(0, 5)).size).toBe(5)
    const c = counts(g, w)
    expect([...c.values()]).toEqual([1, 1, 1, 1, 1])
    expect(A.isCycleEdgeSet(g, new Set(c.keys()))).toBe(true)
    expect(byEnds(g, 'v2y').length).toBe(1)
    expect(c.has(byEnds(g, 'v2y')[0].id)).toBe(false)
  })
  it('split figure: W has length 7, x = v2 = v5, W2 is the triangle x b c (3 edges), W1 has 4 edges, counts add', () => {
    const g = fig('t03-closed-walk-split')
    const W = ['v0', 'a', 'x', 'b', 'c', 'x', 'a', 'v0']
    expect(W.length - 1).toBe(7)
    expect([W[2], W[5]]).toEqual(['x', 'x'])
    const i = 2, j = 5
    const W2 = W.slice(i, j + 1), W1 = [...W.slice(0, i + 1), ...W.slice(j + 1)]
    expect([W2.length - 1, W1.length - 1]).toEqual([3, 4])
    expect(W1.join('')).toBe('v0axav0')
    expect(W2.join('')).toBe('xbcx')
    const c = counts(g, W), c1 = counts(g, W1), c2 = counts(g, W2)
    for (const e of g.edges) expect(c.get(e.id) ?? 0).toBe((c1.get(e.id) ?? 0) + (c2.get(e.id) ?? 0))
    const id = (k: string) => byEnds(g, k)[0].id
    expect([c1.get(id('av0')), c2.get(id('av0')) ?? 0, c1.get(id('ax')), c2.get(id('ax')) ?? 0]).toEqual([2, 0, 2, 0])
    expect([c2.get(id('bx')), c2.get(id('bc')), c2.get(id('cx'))]).toEqual([1, 1, 1])
    expect(A.isCycleEdgeSet(g, new Set(c2.keys()))).toBe(true)
  })
  it('even figure: tree, W of length 8, x = v2 = v4, W2 has 2 edges, W1 has 6, all counts even', () => {
    const g = fig('t03-closed-walk-split-even')
    expect(A.isTree(new GraphIndex(g))).toBe(true)
    expect(g.vertices.length).toBe(5)
    const W = ['v0', 'a', 'x', 'b', 'x', 'c', 'x', 'a', 'v0']
    expect(W.length - 1).toBe(8)
    expect([W[2], W[4], W[6]]).toEqual(['x', 'x', 'x'])
    const W2 = W.slice(2, 5), W1 = [...W.slice(0, 3), ...W.slice(5)]
    expect([W2.length - 1, W1.length - 1]).toEqual([2, 6])
    const c = counts(g, W), c1 = counts(g, W1), c2 = counts(g, W2)
    for (const e of g.edges) {
      expect(c.get(e.id)).toBe(2)
      expect((c1.get(e.id) ?? 0) + (c2.get(e.id) ?? 0)).toBe(2)
    }
    expect(c2.get(byEnds(g, 'bx')[0].id)).toBe(2)
    expect(c1.has(byEnds(g, 'bx')[0].id)).toBe(false)
  })
})

describe('Erdős–Gallai example', () => {
  const eg = (d: number[], k: number) => {
    const l = d.slice(0, k).reduce((z, x) => z + x, 0), r = k * (k - 1) + d.slice(k).reduce((z, x) => z + Math.min(x, k), 0)
    return [l, r]
  }
  it('check figure: (3,3,3,2,1), inequalities 3<=4, 6<=7, 9<=9, 11<=13, 12<=20', () => {
    const f = index.figureById.get('t01-erdos-gallai-check')!, d = parseGraph(f.source, f.info)
    expect(d.errors).toEqual([])
    expect(A.degreeSequence(new GraphIndex(d.panels[0].steps[0].graph))).toEqual([3, 3, 3, 2, 1])
    expect([1, 2, 3, 4, 5].map(k => eg([3, 3, 3, 2, 1], k))).toEqual([[3, 4], [6, 7], [9, 9], [11, 13], [12, 20]])
  })
})

describe('odd-cycles walkthroughs', () => {
  const eids = (g: GraphData, pairs: string) => new Set(pairs.split(' ').map(p => {
    const [u, v] = p.split('-')
    return g.edges.find(e => (e.tail[0] === u && e.head[0] === v) || (e.tail[0] === v && e.head[0] === u))!.id
  }))
  it('certificates: C6 coloured as a bipartition, C5 not bipartite, vertex 5 has neighbours of both colours', () => {
    const c6 = fig('t02-odd-cycle-certificates', 0), c5 = fig('t02-odd-cycle-certificates', 1)
    const col = (g: GraphData, v: string) => g.vertices.find(x => x.id === v)!.classes.find(c => c.startsWith('color'))
    expect(A.bipartition(new GraphIndex(c6))).toBeDefined()
    expect(c6.edges.every(e => col(c6, e.tail[0]) !== col(c6, e.head[0]))).toBe(true)
    expect(A.bipartition(new GraphIndex(c5))).toBeUndefined()
    expect(A.girth(new GraphIndex(c5))).toBe(5)
    expect([col(c5, '1'), col(c5, '4')].sort()).toEqual(['color1', 'color2'])
  })
  it('alternate: groups A, B form a bipartition and c1..c6 is a 6-cycle', () => {
    const g = fig('t02-odd-cycle-alternate')
    const A_ = new Set(['c1', 'c3', 'c5', 'u'])
    expect(g.edges.every(e => A_.has(e.tail[0]) !== A_.has(e.head[0]))).toBe(true)
    expect(A.isCycleEdgeSet(g, eids(g, 'c1-c2 c2-c3 c3-c4 c4-c5 c5-c6 c6-c1'))).toBe(true)
  })
  it('components: two components, K1 bipartite with s,u | t,w, G not bipartite', () => {
    const g = fig('t02-odd-cycle-components'), ix = new GraphIndex(g)
    expect(A.components(ix).length).toBe(2)
    expect(A.bipartition(ix)).toBeUndefined()
    const k1 = new Set(['s', 'u'])
    expect(g.edges.filter(e => ['s', 't', 'u', 'w'].includes(e.tail[0])).every(e => k1.has(e.tail[0]) !== k1.has(e.head[0]))).toBe(true)
  })
  for (const id of ['t02-odd-cycle-layers', 't02-odd-cycle-lca']) it(`${id}: layers, edges inside layers, LCA b, 5-cycle`, () => {
    const g = fig(id), ix = new GraphIndex(g), d = A.bfsDistances(ix, 'x')
    expect(d.size).toBe(9)
    expect(Object.fromEntries(d)).toEqual({ x: 0, b: 1, p: 1, c1: 2, c2: 2, q: 2, a1: 3, a2: 3, r: 3 })
    expect(A.bipartition(ix)).toBeUndefined()
    const inside = g.edges.filter(e => d.get(e.tail[0]) === d.get(e.head[0])).map(e => [e.tail[0], e.head[0]].sort().join('-'))
    expect(inside.sort()).toEqual(['a1-a2', 'a2-r', 'c2-q'])
    // tree edges: parent one layer up; the paths a1-c1-b and a2-c2-b meet first at b (layer 1)
    expect(g.edges.filter(e => e.classes.includes('tree')).every(e => Math.abs(d.get(e.tail[0])! - d.get(e.head[0])!) === 1)).toBe(true)
    expect(A.isCycleEdgeSet(g, eids(g, 'a1-a2 a1-c1 c1-b a2-c2 c2-b'))).toBe(true)
    const parent = new Map<string, string>()
    for (const e of g.edges.filter(e => e.classes.includes('tree'))) {
      const [u, v] = [e.tail[0], e.head[0]]
      if (d.get(u)! > d.get(v)!) parent.set(u, v); else parent.set(v, u)
    }
    const up = (v: string) => { const p = [v]; while (parent.has(p[p.length - 1])) p.push(parent.get(p[p.length - 1])!); return p }
    const p1 = up('a1'), p2 = up('a2'), lca = p1.find(v => p2.includes(v))!
    expect(lca).toBe('b')
    expect(d.get(lca)).toBe(1)
    expect([p1.indexOf(lca), p2.indexOf(lca)]).toEqual([2, 2])
    expect(p1.indexOf(lca) + p2.indexOf(lca) + 1).toBe(5)
  })
})

describe('small-degree test walkthroughs', () => {
  const eids = (g: GraphData, pairs: string) => new Set(pairs.split(' ').map(p => {
    const [u, v] = p.split('-')
    return g.edges.find(e => (e.tail[0] === u && e.head[0] === v) || (e.tail[0] === v && e.head[0] === u))!.id
  }))
  const deg = (g: GraphData, v: string) => g.edges.reduce((z, e) => z + e.tail.filter(x => x === v).length + e.head.filter(x => x === v).length, 0)
  it('forward: G is a tree on 6 vertices, 5 edges; H has 5 vertices, 4 edges, degrees c=1 f=1, e is alone with degree 0', () => {
    const g = fig('t03-small-degree-forward')
    expect([g.vertices.length, g.edges.length]).toEqual([6, 5])
    expect(A.isAcyclic(new GraphIndex(g))).toBe(true)
    const H = A.subgraphOfEdges(g, eids(g, 'b-c b-d d-e e-f'))
    expect([H.vertices.length, H.edges.length]).toEqual([5, 4])
    expect(A.isAcyclic(new GraphIndex(H))).toBe(true)
    expect(H.vertices.filter(v => deg(H, v.id) <= 1).map(v => v.id).sort()).toEqual(['c', 'f'])
    expect([deg(H, 'c'), deg(H, 'f')]).toEqual([1, 1])
  })
  it('backward: abcd is a 4-cycle, degrees 2 inside C, a has degree 3 in G', () => {
    const g = fig('t03-small-degree-backward')
    expect(A.isAcyclic(new GraphIndex(g))).toBe(false)
    const C = A.subgraphOfEdges(g, eids(g, 'a-b b-c c-d d-a'))
    expect(A.isCycleEdgeSet(g, eids(g, 'a-b b-c c-d d-a'))).toBe(true)
    expect(C.edges.length).toBe(4)
    expect(['a', 'b', 'c', 'd'].map(v => deg(C, v))).toEqual([2, 2, 2, 2])
    expect(deg(g, 'a')).toBe(3)
  })
})

describe('unique-paths walkthroughs', () => {
  it('existence: T is a tree on 6 vertices; shortest u-v walk has length 3 and the shown walk has length 5', () => {
    const g = fig('t03-unique-path-existence')
    const ix = new GraphIndex(g)
    expect([g.vertices.length, g.edges.length]).toEqual([6, 5])
    expect(A.isTree(ix)).toBe(true)
    expect(A.bfsDistances(ix, 'u').get('v')).toBe(3)
    const walk = ['u', 'a', 'c', 'a', 'b', 'v']
    expect(walk.length - 1).toBe(5)
    expect(walk.slice(1).every((x, i) => g.edges.some(e => [e.tail[0], e.head[0]].sort().join() === [walk[i], x].sort().join()))).toBe(true)
  })
  it('uniqueness: the picture is a 6-cycle, W has length 6, every edge once, P1 and P2 share no edge', () => {
    const g = fig('t03-unique-path-uniqueness')
    const ix = new GraphIndex(g)
    expect([g.vertices.length, g.edges.length]).toEqual([6, 6])
    expect(A.isAcyclic(ix)).toBe(false)
    expect(A.girth(ix)).toBe(6)
    expect(A.bfsDistances(ix, 'u').get('v')).toBe(3)
  })
})

describe('Cayley formula walkthroughs', () => {
  const steps = (id: string) => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const arcs = (g: GraphData) => g.edges.filter(e => e.directed && !e.classes.includes('dashed'))
  const indeg = (g: GraphData, v: string) => arcs(g).filter(e => e.head[0] === v).length
  const comps = (g: GraphData) => A.components(new GraphIndex({ ...g, edges: arcs(g) }))
  const roots = (g: GraphData) => g.vertices.map(v => v.id).filter(v => indeg(g, v) === 0).sort()
  // weak components of the digraph, the roots (in-degree 0) and the allowed y for a given x
  const allowedY = (g: GraphData, x: string) => { const c = comps(g).find(c => c.includes(x))!; return roots(g).filter(r => !c.includes(r)) }
  const forestInvariant = (g: GraphData) => {
    const cs = comps(g)
    expect(cs.length).toBe(g.vertices.length - arcs(g).length)
    expect(A.isAcyclic(new GraphIndex({ ...g, edges: arcs(g) }))).toBe(true)
    for (const v of g.vertices) expect(indeg(g, v.id)).toBeLessThanOrEqual(1)
    for (const c of cs) expect(c.filter(v => indeg(g, v) === 0).length).toBe(1)
  }

  it('invariant: 5 then 3 then 2 components; roots 1,3,4 after step 2; 1 reaches 2,4,5 at the end', () => {
    const s = steps('t03-cayley-invariant')
    s.forEach(forestInvariant)
    expect(comps(s[0]).length).toBe(5)
    expect(roots(s[2])).toEqual(['1', '3', '4'])
    expect(comps(s[2]).length).toBe(3)
    expect(allowedY(s[2], '2')).toContain('4')          // step 3: x3 = 2 (= y1), y3 = 4 (= x2) is allowed
    expect(comps(s[3]).length).toBe(2)
    expect(indeg(s[3], '4')).toBe(1)
    const ix = new GraphIndex({ ...s[5], edges: arcs(s[5]) })
    const reach = new Set(['1']); const st = ['1']
    while (st.length) for (const w of ix.outNeighbors(st.pop()!)) if (!reach.has(w)) { reach.add(w); st.push(w) }
    expect([...reach].sort()).toEqual(['1', '2', '4', '5'])
  })

  it('first count: y3 in {3,4} for x3 = 2 and {1,3} for x3 = 5; 5^4 * 4! = 15000 = brute-force count', () => {
    const s = steps('t03-cayley-first-count')
    expect(roots(s[0])).toEqual(['1', '3', '4'])
    expect(allowedY(s[0], '2')).toEqual(['3', '4'])
    expect(allowedY(s[0], '5')).toEqual(['1', '3'])
    for (const x of ['1', '2', '3', '4', '5']) expect(allowedY(s[0], x).length).toBe(5 - 3)
    let prod = 1
    for (let k = 1; k <= 4; k++) prod *= 5 * (5 - k)
    expect(prod).toBe(15000)
    expect(5 ** 4 * 24).toBe(15000)
    expect(625 * 24).toBe(15000)
    // brute force: run the construction on 5 vertices with every allowed choice
    const n = 5
    const count = (par: number[], head: Set<number>, k: number): number => {
      if (k === n) return 1
      const find = (v: number): number => (par[v] === v ? v : find(par[v]))
      let total = 0
      for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) {
        if (head.has(y) || find(x) === find(y)) continue
        const p2 = [...par]; p2[find(y)] = find(x)
        total += count(p2, new Set([...head, y]), k + 1)
      }
      return total
    }
    expect(count([0, 1, 2, 3, 4], new Set(), 1)).toBe(15000)
  })

  it('result: a spanning tree of K5 with root 1, arcs 1->2, 4->5, 2->4, 2->3 in this order', () => {
    const s = steps('t03-cayley-result')
    s.forEach(forestInvariant)
    const g = s[0]
    expect(A.isTree(new GraphIndex(g))).toBe(true)
    expect(roots(g)).toEqual(['1'])
    const last = s[s.length - 1]
    expect(last.edges.map(e => `${e.tail[0]}->${e.head[0]}:${e.label}`)).toEqual(['1->2:1st', '4->5:2nd', '2->4:3rd', '2->3:4th'])
  })

  it('second count: root 4 orients T away; replay 2->3, 4->5, 2->1, 4->2 is allowed; 120 per tree, C(5) = 125', () => {
    const s = steps('t03-cayley-second-count')
    const T = s[0]
    expect(A.isTree(new GraphIndex(T))).toBe(true)
    const und = (g: GraphData) => g.edges.map(e => [e.tail[0], e.head[0]].sort().join('')).sort()
    expect(und(T)).toEqual(und(steps('t03-cayley-result')[0]))
    const o = s[1]
    const d = A.bfsDistances(new GraphIndex(o), '4')
    for (const e of arcs(o)) expect(d.get(e.head[0])).toBe(d.get(e.tail[0])! + 1)
    const order = s[2].edges.slice().sort((a, b) => String(a.label).localeCompare(String(b.label)))
    expect(order.map(e => e.tail[0] + e.head[0])).toEqual(['23', '45', '21', '42'])
    let g: GraphData = { ...o, edges: [] }
    for (const e of order) {
      expect(indeg(g, e.head[0])).toBe(0)
      expect(allowedY(g, e.tail[0])).toContain(e.head[0])
      if (e.head[0] === '1') expect(comps(g).map(c => c.sort().join('')).sort()).toEqual(['1', '23', '45'])
      g = { ...g, edges: [...g.edges, e] }
    }
    expect(5 * 24).toBe(120)
    expect(15000 / 120).toBe(125)
    expect(5 ** 3).toBe(125)
    // brute force: the spanning trees of K5
    const k5 = complete(5)
    const ids = k5.edges.map(e => e.id)
    let trees = 0
    for (let m = 0; m < 1 << ids.length; m++) {
      const pick = new Set(ids.filter((_, i) => m >> i & 1))
      if (pick.size === 4 && A.isTree(new GraphIndex(A.spanningSubgraph(k5, pick)))) trees++
    }
    expect(trees).toBe(125)
  })
})

describe('regular graphs of large girth walkthroughs', () => {
  const steps = (id: string) => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  // what the reader sees: no hidden elements, no dashed (impossible) edges
  const vis = (g: GraphData): GraphIndex => {
    const vs = g.vertices.filter(v => !v.classes.includes('hidden'))
    const ids = new Set(vs.map(v => v.id))
    const es = g.edges.filter(e => !e.classes.includes('hidden') && !e.classes.includes('dashed') && e.tail.concat(e.head).every(x => ids.has(x)))
    return new GraphIndex({ ...g, vertices: vs, edges: es })
  }
  const degs = (ix: GraphIndex) => new Set(ix.vertexIds.map(v => ix.degree(v)))
  const regular = (ix: GraphIndex, d: number) => expect([...degs(ix)]).toEqual([d])

  it('Petersen local tree: 3-regular, girth 5; 3 vertices at distance 1, 6 at distance 2; the 6 other edges join distance-2 vertices; 0,1,2,3,4 is a 5-cycle', () => {
    const s = steps('t03-petersen-local-tree')
    const ix = vis(s[0])
    regular(ix, 3)
    expect(A.girth(ix)).toBe(5)
    const d = A.bfsDistances(ix, '0')
    expect(ix.vertexIds.filter(v => d.get(v) === 1).sort()).toEqual(['1', '4', '5'])
    expect(ix.vertexIds.filter(v => d.get(v) === 2).length).toBe(6)
    const tree = s[2].edges.filter(e => e.classes.includes('tree'))
    expect(tree.length).toBe(9)
    expect(A.isTree(new GraphIndex({ ...s[2], edges: tree }))).toBe(true)
    const other = s[3].edges.filter(e => e.classes.includes('highlight'))
    expect(other.length).toBe(6)
    expect(tree.length + other.length).toBe(15)
    // each other edge joins two distance-2 vertices whose parents differ, so it closes a 2 + 2 + 1 = 5 cycle
    const parent = (v: string) => tree.map(e => [e.tail[0], e.head[0]]).find(p => p.includes(v) && p.some(x => d.get(x) === 1))!.find(x => x !== v)!
    for (const e of other) {
      expect(d.get(e.tail[0])).toBe(2); expect(d.get(e.head[0])).toBe(2)
      expect(parent(e.tail[0])).not.toBe(parent(e.head[0]))
    }
    expect(A.isCycleEdgeSet(s[4], new Set(s[4].edges.filter(e => e.classes.includes('cycle')).map(e => e.id)))).toBe(true)
    expect(s[4].edges.filter(e => e.classes.includes('cycle')).length).toBe(5)
  })

  it('base cases d = 0, 1, 2 (k = 5): K_1 0-regular, K_2 1-regular, both acyclic; C_5 2-regular with girth 5', () => {
    const s = steps('t03-girth-base-d').map(vis)
    regular(s[1], 0); expect(A.girth(s[1])).toBe(Infinity)
    regular(s[2], 1); expect(A.girth(s[2])).toBe(Infinity)
    regular(s[3], 2); expect(A.girth(s[3])).toBe(5)
    expect(Math.max(5, 3)).toBe(5)
  })

  it('base cases k <= 3, k = 4 (d = 3): K_4 3-regular girth 3; K_{3,3} 3-regular, bipartite, girth 4', () => {
    const s = steps('t03-girth-base-k')
    const k4 = vis(s[0]), k33 = vis(s[2])
    regular(k4, 3); expect(k4.vertexIds.length).toBe(4); expect(A.girth(k4)).toBe(3)
    regular(k33, 3); expect(k33.vertexIds.length).toBe(6); expect(A.girth(k33)).toBe(4)
    expect(A.bipartition(k33)).toBeDefined()
    expect(A.isCycleEdgeSet(s[2], new Set(s[2].edges.filter(e => e.classes.includes('cycle')).map(e => e.id)))).toBe(true)
  })

  it('construction: G = K_2 (N = 2), H = C_3 good for (3, 2), ceil(5/2) = 3; F = C_6 is simple, 2-regular, girth 6', () => {
    const s = steps('t03-girth-step-build')
    const G = vis(s[0]), H = vis(s[1]), F = vis(s[4])
    regular(G, 1); expect(G.vertexIds.length).toBe(2)
    regular(H, 2); expect(A.girth(H)).toBe(3); expect(Math.ceil(5 / 2)).toBe(3)
    expect(H.vertexIds.length).toBe(3)
    expect(vis(s[2]).vertexIds.length).toBe(3 * 2)
    regular(F, 2); expect(A.isSimple(s[4])).toBe(true); expect(A.girth(F)).toBe(6)
    // the H-edges: one per edge of H, each joining two different copies
    const copy = (v: string) => v[0]
    const hEdges = s[4].edges.filter(e => copy(e.tail[0]) !== copy(e.head[0]))
    expect(hEdges.map(e => e.tail[0] + e.head[0]).sort()).toEqual(['a2b1', 'b2c2', 'c1a1'].sort())
  })

  it('regularity: degree 1 inside a copy, plus one H-edge each; the dashed parallel edge is excluded', () => {
    const s = steps('t03-girth-step-regular')
    regular(vis(s[0]), 1)
    regular(vis(s[1]), 2)
    expect(A.isSimple({ ...s[3], edges: s[3].edges.filter(e => !e.classes.includes('dashed')) })).toBe(true)
    expect(A.isSimple(s[3])).toBe(false)
  })

  it('closed walk: F has one cycle, t = 3 H-edges; contracting the copies gives H = C_3 with 3 edges', () => {
    const s = steps('t03-girth-step-walk')
    const F = vis(s[1])
    expect(A.girth(F)).toBe(6); expect(F.edges().length).toBe(6)
    expect(s[1].edges.filter(e => e.classes.includes('cycle')).length).toBe(6)
    expect(s[1].edges.filter(e => /^f\d$/.test(e.id)).length).toBe(3)
    const H = vis(s[2])
    expect(H.vertexIds.sort()).toEqual(['h1', 'h2', 'h3'])
    regular(H, 2); expect(A.girth(H)).toBe(3)
    expect(A.girth(H)).toBeGreaterThanOrEqual(Math.ceil(5 / 2))
  })

  it('count: C has t = 3 H-edges and 3 copy edges, 6 = 2t >= 2 ceil(5/2) = 6 >= 5', () => {
    const s = steps('t03-girth-step-count')
    const C = vis(s[3])
    expect(A.isCycleEdgeSet(s[3], new Set(s[3].edges.filter(e => e.classes.includes('cycle')).map(e => e.id)))).toBe(true)
    expect(C.edges().length).toBe(6)
    expect(s[2].edges.filter(e => e.classes.includes('path')).length).toBe(3)
    expect(2 * 3).toBeGreaterThanOrEqual(2 * Math.ceil(5 / 2)); expect(2 * Math.ceil(5 / 2)).toBeGreaterThanOrEqual(5)
  })
})

describe('minimal cuts page (t04)', () => {
  // what the reader sees as edges: dashed edges are the impossible ones
  const solid = (g: GraphData): GraphData => ({ ...g, edges: g.edges.filter(e => !e.classes.includes('dashed')) })
  const del = (g: GraphData, X: string[]): GraphData => ({ ...g, vertices: g.vertices.filter(v => !X.includes(v.id)), edges: g.edges.filter(e => !e.tail.concat(e.head).some(x => X.includes(x))) })
  const sameComp = (g: GraphData, a: string, b: string) => A.components(new GraphIndex(g)).some(c => c.includes(a) && c.includes(b))
  const isCut = (g: GraphData, X: string[], u: string, v: string) => !sameComp(del(g, X), u, v)
  const minimalCuts = (g: GraphData, u: string, v: string) => {
    const rest = g.vertices.map(x => x.id).filter(x => x !== u && x !== v)
    const cuts: string[][] = []
    for (let m = 0; m < 1 << rest.length; m++) cuts.push(rest.filter((_, i) => m >> i & 1))
    const c = cuts.filter(X => isCut(g, X, u, v))
    return c.filter(X => !c.some(Y => Y.length < X.length && Y.every(y => X.includes(y)))).map(X => X.sort().join(','))
  }
  const chordal = (g: GraphData): boolean => {
    if (!g.vertices.length) return true
    const ix = new GraphIndex(g)
    const s = ix.vertexIds.find(v => A.isSimplicial(ix, v))
    return s !== undefined && chordal(del(g, [s]))
  }
  const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const dist = (g: GraphData, a: string, b: string) => A.bfsDistances(new GraphIndex(g), a).get(b)

  it('example: the chordal panel has {1,3} as its only minimal 2-4 cut, an edge; C_4 has {a,b}, not an edge', () => {
    const g = fig('t04-minimal-cut-clique-example', 0), h = fig('t04-minimal-cut-clique-example', 1)
    expect(chordal(g)).toBe(true)
    expect(minimalCuts(g, '2', '4')).toEqual(['1,3'])
    expect(new GraphIndex(g).adjacent('1', '3')).toBe(true)
    expect(chordal(h)).toBe(false)
    expect(minimalCuts(h, 'u', 'v')).toEqual(['a,b'])
    expect(new GraphIndex(h).adjacent('a', 'b')).toBe(false)
  })

  it('part 1: {x,y} is a minimal u-v cut leaving {u,p1,p2} and {v,q1,q2}; P = u p1 x q1 v avoids y; neighbours p1,q1 of x and p2,q2 of y', () => {
    const g = steps('t04-minimal-cut-neighbours')[0]
    expect(minimalCuts(g, 'u', 'v')).toContain('x,y')
    expect(A.components(new GraphIndex(del(g, ['x', 'y']))).map(c => c.sort().join(',')).sort()).toEqual(['p1,p2,u', 'q1,q2,v'])
    expect(isCut(g, ['y'], 'u', 'v')).toBe(false)
    const ix = new GraphIndex(g)
    for (const [a, b] of [['u', 'p1'], ['p1', 'x'], ['x', 'q1'], ['q1', 'v'], ['u', 'p2'], ['p2', 'y'], ['y', 'q2'], ['q2', 'v']]) expect(ix.adjacent(a, b)).toBe(true)
  })

  it('part 2: Q_u has 3 edges, Q_v 4, both shortest; C has length 7 and no chord; no C_u-C_v edge; x p1 u p2 y has the chord p1p2; not chordal', () => {
    const s = steps('t04-minimal-cut-cycle'), g = solid(s[0])
    const ix = new GraphIndex(g)
    expect(ix.adjacent('x', 'y')).toBe(false)
    expect(dist(del(g, ['v', 'q1', 'q2']), 'x', 'y')).toBe(3)
    expect(dist(del(g, ['u', 'p1', 'p2']), 'x', 'y')).toBe(4)
    const C = new Set(s[3].edges.filter(e => e.classes.includes('cycle')).map(e => e.id))
    expect(C.size).toBe(7)
    expect(A.isCycleEdgeSet(s[3], C)).toBe(true)
    // chordless: the cycle's 7 vertices induce exactly its 7 edges
    expect(del(g, ['u']).edges.length).toBe(7)
    for (const a of ['u', 'p1', 'p2']) for (const b of ['v', 'q1', 'q2']) expect(ix.adjacent(a, b)).toBe(false)
    expect(ix.adjacent('p1', 'u') && ix.adjacent('u', 'p2') && ix.adjacent('p1', 'p2')).toBe(true)
    expect(s[5].edges.some(e => e.classes.includes('dashed') && ends(e).sort().join() === 'p2,q2')).toBe(true)
    expect(chordal(g)).toBe(false)
  })
})

describe('two simplicial vertices page (t04)', () => {
  const del = (g: GraphData, X: string[]): GraphData => ({ ...g, vertices: g.vertices.filter(v => !X.includes(v.id)), edges: g.edges.filter(e => !e.tail.concat(e.head).some(x => X.includes(x))) })
  const keep = (g: GraphData, K: string[]): GraphData => del(g, g.vertices.map(v => v.id).filter(v => !K.includes(v)))
  const chordal = (g: GraphData): boolean => {
    if (!g.vertices.length) return true
    const ix = new GraphIndex(g)
    const s = ix.vertexIds.find(v => A.isSimplicial(ix, v))
    return s !== undefined && chordal(del(g, [s]))
  }
  const simp = (g: GraphData) => { const ix = new GraphIndex(g); return ix.vertexIds.filter(v => A.isSimplicial(ix, v)).sort() }
  const nb = (g: GraphData, v: string) => { const ix = new GraphIndex(g); return ix.vertexIds.filter(w => ix.adjacent(v, w)).sort() }
  const g = fig('t04-two-simplicial-setup')
  const ix = new GraphIndex(g)

  it('set-up: G has 6 vertices, is chordal, not complete; u, v non-adjacent; X = {c1,c2} is a minimal u-v cut and a clique', () => {
    expect(g.vertices.length).toBe(6)
    expect(chordal(g)).toBe(true)
    expect(ix.adjacent('u', 'v')).toBe(false)
    expect(A.components(new GraphIndex(del(g, ['c1', 'c2']))).map(c => c.sort().join(',')).sort()).toEqual(['a,u', 'b,v'])
    for (const X of [['c1'], ['c2']]) expect(A.components(new GraphIndex(del(g, X))).some(c => c.includes('u') && c.includes('v'))).toBe(true)
    expect(ix.adjacent('c1', 'c2')).toBe(true)
  })

  it('no edge joins A = {u,a} to {b,v}; G[A u X] and G - A are chordal with 4 vertices', () => {
    for (const p of ['u', 'a']) for (const q of ['b', 'v']) expect(ix.adjacent(p, q)).toBe(false)
    const ax = keep(g, ['u', 'a', 'c1', 'c2']), ga = del(g, ['u', 'a'])
    expect(ax.vertices.length).toBe(4); expect(ga.vertices.length).toBe(4)
    expect(chordal(ax)).toBe(true); expect(chordal(ga)).toBe(true)
  })

  it('x: simplicial in G[A u X] are u and c2 (non-adjacent); u in A is simplicial in G with neighbours a, c1 (adjacent); c2 is not simplicial in G', () => {
    const ax = keep(g, ['u', 'a', 'c1', 'c2'])
    expect(simp(ax)).toContain('u'); expect(simp(ax)).toContain('c2')
    expect(ix.adjacent('u', 'c2')).toBe(false)
    expect(nb(g, 'u')).toEqual(['a', 'c1']); expect(ix.adjacent('a', 'c1')).toBe(true)
    expect(nb(ax, 'u')).toEqual(nb(g, 'u'))
    expect(A.isSimplicial(ix, 'u')).toBe(true); expect(A.isSimplicial(ix, 'c2')).toBe(false)
    expect(nb(ax, 'c2')).toEqual(['a', 'c1'])
  })

  it('y: simplicial in G - A are v, c1, c2; v, c1 non-adjacent; N(v) = {b} in G and in G - A; c1, c2 neighbours c2/c1 and b adjacent', () => {
    const ga = del(g, ['u', 'a'])
    expect(simp(ga)).toEqual(['b', 'c1', 'c2', 'v'].filter(x => simp(ga).includes(x)))
    for (const x of ['v', 'c1', 'c2']) expect(simp(ga)).toContain(x)
    expect(ix.adjacent('v', 'c1')).toBe(false)
    expect(nb(g, 'v')).toEqual(['b']); expect(nb(ga, 'v')).toEqual(['b'])
    expect(nb(ga, 'c1')).toEqual(['b', 'c2']); expect(ix.adjacent('b', 'c2')).toBe(true)
    expect(A.isSimplicial(ix, 'v')).toBe(true); expect(A.isSimplicial(ix, 'c1')).toBe(false)
  })

  it('result: u and v are the simplicial vertices of G, and they are non-adjacent', () => {
    expect(simp(g)).toEqual(['u', 'v'])
    expect(ix.adjacent('u', 'v')).toBe(false)
  })

  it('x and y figures use the same graph as the set-up figure', () => {
    for (const id of ['t04-two-simplicial-x', 't04-two-simplicial-y']) {
      const h = fig(id)
      expect(h.vertices.map(v => v.id).sort()).toEqual(g.vertices.map(v => v.id).sort())
      expect(h.edges.length).toBe(g.edges.length)
    }
  })
})

describe('simplicial decompositions page (t04)', () => {
  const del = (g: GraphData, X: string[]): GraphData => ({ ...g, vertices: g.vertices.filter(v => !X.includes(v.id)), edges: g.edges.filter(e => !e.tail.concat(e.head).some(x => X.includes(x))) })
  const isDecomp = (g: GraphData, order: string[]) => {
    const ix = new GraphIndex(g)
    return order.every((v, i) => {
      const earlier = order.slice(0, i).filter(w => ix.adjacent(v, w))
      return earlier.every((p, k) => earlier.slice(k + 1).every(q => ix.adjacent(p, q)))
    })
  }
  const chordal = (g: GraphData): boolean => {
    if (!g.vertices.length) return true
    const ix = new GraphIndex(g)
    const s = ix.vertexIds.find(v => A.isSimplicial(ix, v))
    return s !== undefined && chordal(del(g, [s]))
  }
  const base = fig('t04-simplicial-decomposition')

  it('forward: G chordal, 6 simplicial with neighbours 4, 5 adjacent; G - 6 chordal with 5 vertices and decomposition (2,3,4,1,5); appending 6 gives (2,3,4,1,5,6)', () => {
    const ix = new GraphIndex(base)
    expect(chordal(base)).toBe(true)
    expect(A.isSimplicial(ix, '6')).toBe(true)
    expect(ix.vertexIds.filter(w => ix.adjacent('6', w)).sort()).toEqual(['4', '5'])
    expect(ix.adjacent('4', '5')).toBe(true)
    const h = del(base, ['6'])
    expect(h.vertices.length).toBe(5); expect(chordal(h)).toBe(true)
    expect(isDecomp(h, ['2', '3', '4', '1', '5'])).toBe(true)
    expect(isDecomp(base, ['2', '3', '4', '1', '5', '6'])).toBe(true)
    const hx = new GraphIndex(h)
    expect(hx.vertexIds.filter(w => hx.adjacent('5', w)).sort()).toEqual(['2', '4'])
  })

  it('cycle: 1,3,4,5,2 is a 5-cycle of G, last in (2,3,4,1,5,6) is 5 at position 5, neighbours 4 and 2 (positions 3, 1) adjacent, only earlier neighbours of 5, edge 2-4 not on the cycle', () => {
    const ix = new GraphIndex(base)
    const C = ['1', '3', '4', '5', '2'], order = ['2', '3', '4', '1', '5', '6']
    C.forEach((v, i) => expect(ix.adjacent(v, C[(i + 1) % 5])).toBe(true))
    expect(C.map(v => order.indexOf(v) + 1)).toEqual([4, 2, 3, 5, 1])
    expect(C.reduce((a, v) => order.indexOf(v) > order.indexOf(a) ? v : a)).toBe('5')
    expect([order.indexOf('4') + 1, order.indexOf('2') + 1]).toEqual([3, 1])
    expect(order.slice(0, 4).filter(w => ix.adjacent('5', w)).sort()).toEqual(['2', '4'])
    expect(ix.adjacent('2', '4')).toBe(true)
    expect(C.some((v, i) => [v, C[(i + 1) % 5]].sort().join() === '2,4')).toBe(false)
  })

  it('new figures use the same graph as the stepper figure', () => {
    for (const id of ['t04-decomposition-forward', 't04-decomposition-cycle']) {
      const h = fig(id)
      expect(h.vertices.map(v => v.id).sort()).toEqual(base.vertices.map(v => v.id).sort())
      expect(h.edges.length).toBe(base.edges.length)
    }
  })
})

describe('Hamiltonian completion page (t04)', () => {
  const steps = (id: string): GraphData[] => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const deg = (g: GraphData, v: string) => new GraphIndex(g).degree(v)
  const adj = (g: GraphData, u: string, v: string) => new GraphIndex(g).adjacent(u, v)
  const nb = (g: GraphData, v: string) => { const ix = new GraphIndex(g); return ix.vertexIds.filter(w => ix.adjacent(v, w)).sort() }
  const hamCycle = (g: GraphData, C: string[]) =>
    C.length === g.vertices.length && new Set(C).size === C.length && C.every((v, i) => adj(g, v, C[(i + 1) % C.length]))

  it('closure: n = 5; b,y sum 2+2 = 4 < 5; b,c sum 2+3 = 5; then x,y sum 3+2 = 5; then b,y sum 3+3 = 6; the closure is K_5', () => {
    const [g, s2, s3, s4] = steps('t04-completion-closure')
    expect(g.vertices.length).toBe(5)
    expect(adj(g, 'b', 'y')).toBe(false); expect([deg(g, 'b'), deg(g, 'y')]).toEqual([2, 2])
    expect(adj(g, 'b', 'c')).toBe(false); expect([deg(g, 'b'), deg(g, 'c')]).toEqual([2, 3])
    expect(adj(s2, 'x', 'y')).toBe(false); expect([deg(s2, 'x'), deg(s2, 'y')]).toEqual([3, 2])
    expect(adj(s3, 'b', 'y')).toBe(false); expect([deg(s3, 'b'), deg(s3, 'y')]).toEqual([3, 3])
    expect(s4.edges.length).toBe(10)
  })

  it('induction: same graph as the closure figure; H_1 = G + bc, then xy with degrees 3 and 2 in H_1', () => {
    const [g, h1, h] = steps('t04-completion-induction')
    const [c0, c1, c2] = steps('t04-completion-closure')
    expect(g.edges.length).toBe(c0.edges.length); expect(h1.edges.length).toBe(c1.edges.length); expect(h.edges.length).toBe(c2.edges.length)
    expect(adj(h1, 'b', 'c')).toBe(true); expect(adj(h1, 'x', 'y')).toBe(false)
    expect(deg(g, 'b') + deg(g, 'c')).toBe(5)
    expect([deg(h1, 'x'), deg(h1, 'y')]).toEqual([3, 2])
  })

  const H1 = ['x', 'w2', 'w3', 'wj', 'wj1', 'w6', 'y']
  it('easy direction: G has 7 vertices, xy not an edge, degree sum 4 + 3 = 7; C = x w3 w2 y wj wj1 w6 is Hamiltonian in G and in G + xy', () => {
    const [g, h] = steps('t04-completion-easy')
    expect(g.vertices.length).toBe(7); expect(adj(g, 'x', 'y')).toBe(false)
    expect([deg(g, 'x'), deg(g, 'y')]).toEqual([4, 3])
    const C = ['x', 'w3', 'w2', 'y', 'wj', 'wj1', 'w6']
    expect(hamCycle(g, C)).toBe(true); expect(hamCycle(h, C)).toBe(true)
    expect(h.edges.length).toBe(g.edges.length + 1)
  })

  it('case xy not in C: C = x w6 y w2 w3 wj wj1 is a Hamiltonian cycle of H and of H_1 = H - xy', () => {
    const [h, h1] = steps('t04-completion-avoid')
    const C = ['x', 'w6', 'y', 'w2', 'w3', 'wj', 'wj1']
    expect(hamCycle(h, C)).toBe(true); expect(hamCycle(h1, C)).toBe(true)
    expect(adj(h, 'x', 'y')).toBe(true); expect(adj(h1, 'x', 'y')).toBe(false)
  })

  it('case xy in C: n = 7, degrees 4 + 3 = 7; black w2 wj w6; red x w2 wj wj1; both w2 wj; 7 colourings on 6 vertices; new cycle x w2 w3 wj y w6 wj1', () => {
    const [h, h1] = steps('t04-completion-switch')
    expect(h1.vertices.length).toBe(7)
    expect(hamCycle(h, H1)).toBe(true)
    H1.slice(0, -1).forEach((v, i) => expect(adj(h1, v, H1[i + 1])).toBe(true))
    expect(adj(h1, 'x', 'y')).toBe(false)
    expect([deg(h1, 'x'), deg(h1, 'y')]).toEqual([4, 3])
    const black = nb(h1, 'y'), red = nb(h1, 'x').map(v => H1[H1.indexOf(v) - 1]).sort()
    expect(black).toEqual(['w2', 'w6', 'wj'])
    expect(nb(h1, 'x')).toEqual(['w2', 'w3', 'w6', 'wj1'])
    expect(red).toEqual(['w2', 'wj', 'wj1', 'x'])
    expect(black.filter(v => red.includes(v)).sort()).toEqual(['w2', 'wj'])
    expect(black.length + red.length).toBe(7); expect(H1.indexOf('y')).toBe(6)
    expect(H1.indexOf('wj') + 1).toBe(4)
    expect(hamCycle(h1, ['x', 'w2', 'w3', 'wj', 'y', 'w6', 'wj1'])).toBe(true)
  })

  it('walkthrough figures use the same graph', () => {
    const e = steps('t04-completion-easy')[0], a = steps('t04-completion-avoid')[1], s = steps('t04-completion-switch')[1]
    for (const g of [a, s]) {
      expect(g.vertices.map(v => v.id).sort()).toEqual(e.vertices.map(v => v.id).sort())
      expect(g.edges.length).toBe(e.edges.length)
      for (const x of e.edges) expect(adj(g, x.tail[0], x.head[0])).toBe(true)
    }
  })
})

describe('Hamiltonian switch figure (t04)', () => {
  it('meets the hypothesis: d(x) + d(y) = 3 + 4 = 7 = n, xy not an edge; black w2 w3 wj w6, red x w2 wj; both w2, wj; cycle x w2 w3 wj y w6 wj1', () => {
    const g = fig('t04-hamiltonian-switch'), ix = new GraphIndex(g)
    const P = ['x', 'w2', 'w3', 'wj', 'wj1', 'w6', 'y']
    expect(g.vertices.length).toBe(7); expect(ix.adjacent('x', 'y')).toBe(false)
    expect([ix.degree('x'), ix.degree('y')]).toEqual([3, 4])
    const nb = (v: string) => ix.vertexIds.filter(w => ix.adjacent(v, w)).sort()
    expect(nb('y')).toEqual(['w2', 'w3', 'w6', 'wj'])
    expect(nb('x')).toEqual(['w2', 'w3', 'wj1'])
    const red = nb('x').map(v => P[P.indexOf(v) - 1]).sort()
    expect(red).toEqual(['w2', 'wj', 'x'])
    expect(nb('y').filter(v => red.includes(v)).sort()).toEqual(['w2', 'wj'])
    const C = ['x', 'w2', 'w3', 'wj', 'y', 'w6', 'wj1']
    C.forEach((v, i) => expect(ix.adjacent(v, C[(i + 1) % 7])).toBe(true))
  })
})

describe('Menger, vertex version from edge version (t05)', () => {
  const steps = (id: string): GraphData[] => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const reach = (g: GraphData, s: string, t: string, skipV: string[] = [], skipE: string[] = []) => {
    const seen = new Set([s]), q = [s]
    while (q.length) {
      const u = q.pop()!
      for (const e of g.edges) {
        const [a, b] = ends(e)
        if (a === u && !seen.has(b) && !skipV.includes(b) && !skipE.includes(e.id)) { seen.add(b); q.push(b) }
      }
    }
    return seen.has(t)
  }
  const arcs = (g: GraphData, cls: string) => g.edges.filter(e => e.classes.includes(cls)).map(e => ends(e).join('>')).sort()

  it('construction: G has no arc s>t and no single vertex cut (k = 2); G\' has 6 vertices and 12 arcs; e_x is the only arc out of x- and into x+', () => {
    const [g, , , h] = steps('t05-b-to-a-construction')
    expect(g.vertices.length).toBe(4); expect(g.edges.length).toBe(5)
    expect(g.edges.some(e => ends(e).join('>') === 's>t')).toBe(false)
    expect(reach(g, 's', 't', ['a'])).toBe(true); expect(reach(g, 's', 't', ['b'])).toBe(true)
    expect(h.vertices.length).toBe(6); expect(h.edges.length).toBe(2 * 5 + 2)
    for (const x of ['a', 'b']) {
      expect(h.edges.filter(e => ends(e)[0] === x + 'm').map(e => ends(e)[1])).toEqual([x + 'p'])
      expect(h.edges.filter(e => ends(e)[1] === x + 'p').map(e => ends(e)[0])).toEqual([x + 'm'])
    }
    for (const [u, v] of [['s', 'am'], ['s', 'bm'], ['ap', 't'], ['bp', 't'], ['ap', 'bm']])
      expect(h.edges.filter(e => ends(e).join('>') === `${u}>${v}`).length).toBe(2)
  })

  it('no cut: deleting any one edge of G\' leaves an s-t path, max flow is 2; F = {e_a}, X = {a}, P = s b t lifts to s b- b+ t avoiding F', () => {
    const g = steps('t05-b-to-a-no-cut')[0]
    for (const e of g.edges) expect(reach(g, 's', 't', [], [e.id])).toBe(true)
    const u = { ...g, edges: g.edges.map(e => ({ ...e, data: { ...e.data, c: 1 } })) }
    expect(maxFlowValue(u, 's', 't').value).toBe(2)
    expect(reach(steps('t05-b-to-a-no-cut')[0], 's', 't', ['am'], ['ea'])).toBe(true)
    const last = steps('t05-b-to-a-no-cut')[5]
    expect(last.edges.some(e => e.id === 'ea')).toBe(false)
    expect(arcs(last, 'path')).toEqual(['bm>bp', 'bp>t', 's>bm'])
    expect(reach({ ...last, edges: last.edges.filter(e => e.classes.includes('path')) }, 's', 't')).toBe(true)
    expect(reach(g, 's', 't', ['a'])).toBe(true) // G - a still has s b t: the same fact in G'
  })

  it('translating back: two edge-disjoint paths s a- a+ t and s b- b+ t; contracted: s a t and s b t, inner vertices a and b differ, no arc s>t', () => {
    const st = steps('t05-b-to-a-back')
    const red = st[1].edges.filter(e => e.classes.includes('color1')), blue = st[1].edges.filter(e => e.classes.includes('color2'))
    expect(red.map(e => ends(e).join('>')).sort()).toEqual(['am>ap', 'ap>t', 's>am'])
    expect(blue.map(e => ends(e).join('>')).sort()).toEqual(['bm>bp', 'bp>t', 's>bm'])
    expect(new Set([...red, ...blue].map(e => e.id)).size).toBe(6)
    expect(reach({ ...st[1], edges: red }, 's', 't')).toBe(true); expect(reach({ ...st[1], edges: blue }, 's', 't')).toBe(true)
    expect(st[1].edges.some(e => ends(e).join('>') === 's>t')).toBe(false)
    expect(st[3].vertices.map(v => v.id).sort()).toEqual(['a', 'b', 's', 't'])
    expect(st[3].edges.length).toBe(10)
    const red2 = st[3].edges.filter(e => e.classes.includes('color1')), blue2 = st[3].edges.filter(e => e.classes.includes('color2'))
    expect(red2.map(e => ends(e).join('>')).sort()).toEqual(['a>t', 's>a'])
    expect(blue2.map(e => ends(e).join('>')).sort()).toEqual(['b>t', 's>b'])
  })
})

describe('Menger, set version (t05)', () => {
  const steps = (id: string): GraphData[] => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const pair = (e: GraphData['edges'][number]) => ends(e).slice().sort().join('')
  const adj = (g: GraphData, u: string, v: string) => g.edges.some(e => pair(e) === [u, v].sort().join(''))
  // is t reachable from s in g after deleting the vertices in skip?
  const reach = (g: GraphData, s: string, t: string, skip: string[] = []) => {
    const seen = new Set([s]), q = [s]
    while (q.length) {
      const u = q.pop()!
      for (const e of g.edges) {
        const [a, b] = ends(e)
        for (const [x, y] of [[a, b], [b, a]]) if (x === u && !seen.has(y) && !skip.includes(y)) { seen.add(y); q.push(y) }
      }
    }
    return seen.has(t)
  }
  const color = (g: GraphData, c: string) => g.edges.filter(e => e.classes.includes(c)).map(pair).sort()

  it('forward: G is a 2-connected grid (6 vertices, 7 edges), G* has 8 vertices and 11 edges with s, t not adjacent; X = {b} leaves G connected', () => {
    const st = steps('t05-total-menger-forward')
    const gs = st[0]
    expect(gs.vertices.length).toBe(8); expect(gs.edges.length).toBe(11)
    const G = { ...gs, vertices: gs.vertices.filter(v => !['s', 't'].includes(v.id)), edges: gs.edges.filter(e => !ends(e).some(x => ['s', 't'].includes(x))) }
    expect(G.vertices.length).toBe(6); expect(G.edges.length).toBe(7)
    expect(adj(gs, 's', 't')).toBe(false)
    expect(['a', 'd'].every(v => adj(gs, 's', v)) && ['c', 'f'].every(v => adj(gs, 't', v))).toBe(true)
    expect(gs.edges.filter(e => ends(e).includes('s')).length).toBe(2); expect(gs.edges.filter(e => ends(e).includes('t')).length).toBe(2)
    // G is 2-connected: deleting any one vertex leaves it connected
    for (const x of G.vertices.map(v => v.id)) {
      const rest = G.vertices.map(v => v.id).filter(v => v !== x)
      for (const v of rest) expect(reach(G, rest[0], v, [x])).toBe(true)
    }
    // no s-t cut of size 1 in G*
    for (const x of ['a', 'b', 'c', 'd', 'e', 'f']) expect(reach(gs, 's', 't', [x])).toBe(true)
    // the path of step 5 and the two paths of step 6
    expect(color(st[4], 'path')).toEqual(['ds', 'de', 'ef', 'ft'].map(p => p.split('').sort().join('')).sort())
    expect(color(st[5], 'color3')).toEqual(['ab', 'as', 'bc', 'ct'])
    expect(color(st[5], 'color4')).toEqual(['ds', 'de', 'ef', 'ft'].map(p => p.split('').sort().join('')).sort())
    for (const c of ['color3', 'color4']) expect(reach({ ...st[5], edges: st[5].edges.filter(e => e.classes.includes(c)) }, 's', 't')).toBe(true)
    // internally disjoint: inner vertices {a,b,c} and {d,e,f} do not meet
    expect(st[6].vertices.map(v => v.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(color(st[6], 'color3')).toEqual(['ab', 'bc']); expect(color(st[6], 'color4')).toEqual(['de', 'ef'])
  })

  it('backward: bowtie (5 vertices, k = 3): X = {m} separates u from v; {p, q} are free so Y = {p}; every u-v path uses m', () => {
    const st = steps('t05-total-menger-backward')
    const g = st[0]
    expect(g.vertices.length).toBe(5); expect(g.edges.length).toBe(6)
    expect(reach(g, 'u', 'v')).toBe(true); expect(reach(g, 'u', 'v', ['m'])).toBe(false)
    expect(reach(g, 'u', 'p', ['m'])).toBe(true); expect(reach(g, 'v', 'q', ['m'])).toBe(true)
    const free = g.vertices.map(v => v.id).filter(v => !['m', 'u', 'v'].includes(v))
    expect(free.sort()).toEqual(['p', 'q']); expect(free.length).toBeGreaterThanOrEqual(3 - 1 - 1)
    expect(g.vertices.length).toBeGreaterThanOrEqual(3 + 1)
    // S = {m, p, u} and T = {m, p, v} have 3 = k vertices each
    expect(new Set(['m', 'p', 'u']).size).toBe(3); expect(new Set(['m', 'p', 'v']).size).toBe(3)
    // the vertex m is the only cut vertex: no other single vertex separates u from v
    for (const x of ['p', 'q']) expect(reach(g, 'u', 'v', [x])).toBe(true)
  })
})

describe('2-connected graphs and cycles walkthroughs (t05)', () => {
  const steps = (id: string): GraphData[] => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const pair = (e: GraphData['edges'][number]) => ends(e).slice().sort().join('')
  const key = (u: string, v: string) => [u, v].sort().join('')
  const cls = (g: GraphData, c: string) => g.edges.filter(e => e.classes.includes(c)).map(pair).sort()
  const ids = (g: GraphData) => g.vertices.map(v => v.id).sort()
  // vertex sets after deleting x must stay connected (2-connected grid check)
  const connected = (g: GraphData, skip: string[]) => {
    const vs = ids(g).filter(v => !skip.includes(v)), seen = new Set([vs[0]]), q = [vs[0]]
    while (q.length) { const u = q.pop()!; for (const e of g.edges) { const [a, b] = ends(e); for (const [x, y] of [[a, b], [b, a]]) if (x === u && !skip.includes(y) && !seen.has(y)) { seen.add(y); q.push(y) } } }
    return seen.size === vs.length
  }
  const twoConnected = (g: GraphData) => g.vertices.length >= 3 && connected(g, []) && ids(g).every(x => connected(g, [x]))
  // a set of edges is a cycle: every touched vertex has degree 2 and the edges are connected
  const isCycle = (g: GraphData, es: string[]) => {
    const deg = new Map<string, number>()
    for (const p of es) for (const v of g.edges.find(e => pair(e) === p)!.tail.concat(g.edges.find(e => pair(e) === p)!.head)) deg.set(v, (deg.get(v) ?? 0) + 1)
    const sub = { ...g, vertices: g.vertices.filter(v => deg.has(v.id)), edges: g.edges.filter(e => es.includes(pair(e))) }
    return es.length >= 3 && [...deg.values()].every(d => d === 2) && connected(sub, [])
  }
  const simple = (g: GraphData) => new Set(g.edges.map(pair)).size === g.edges.length && g.edges.every(e => ends(e)[0] !== ends(e)[1])
  const G = (g: GraphData) => g.edges.map(pair)

  it('a forward: the grid is 2-connected (6 vertices, 7 edges); P1 = edge uv, P2 = u q r v; union is the 4-cycle u v r q', () => {
    const st = steps('t05-two-cycles-a-forward'), g = st[0]
    expect(g.vertices.length).toBe(6); expect(g.edges.length).toBe(7); expect(simple(g)).toBe(true); expect(twoConnected(g)).toBe(true)
    expect(G(g)).toContain(key('u', 'v'))
    expect(cls(st[1], 'color3')).toEqual([key('u', 'v')])
    expect(cls(st[1], 'color4')).toEqual([key('u', 'q'), key('q', 'r'), key('r', 'v')].sort())
    expect(isCycle(st[3], cls(st[3], 'cycle'))).toBe(true); expect(cls(st[3], 'cycle').length).toBe(4)
  })

  it('a backward: outer 6-cycle through the opposite corners u, v splits into u a b v and u c d v', () => {
    const st = steps('t05-two-cycles-a-backward'), g = st[0]
    expect(g.vertices.length).toBe(6); expect(g.edges.length).toBe(7)
    expect(isCycle(st[0], cls(st[0], 'cycle'))).toBe(true); expect(cls(st[0], 'cycle').length).toBe(6)
    const c3 = cls(st[1], 'color3'), c4 = cls(st[1], 'color4')
    expect([...c3, ...c4].sort()).toEqual(cls(st[0], 'cycle'))
    expect(c3).toEqual([key('u', 'a'), key('a', 'b'), key('b', 'v')].sort()); expect(c4).toEqual([key('u', 'c'), key('c', 'd'), key('d', 'v')].sort())
  })

  // all S-T path systems (two disjoint paths, one per start) in a small graph, by brute force
  const simplePaths = (g: GraphData, s: string, t: string): string[][] => {
    const out: string[][] = [], dfs = (p: string[]) => {
      const u = p[p.length - 1]
      if (u === t) { out.push(p); return }
      for (const e of g.edges) { const [a, b] = ends(e); for (const [x, y] of [[a, b], [b, a]]) if (x === u && !p.includes(y)) dfs([...p, y]) }
    }
    dfs([s]); return out
  }
  const disjointPairs = (g: GraphData, S: string[], T: string[]) => {
    const res: string[][][] = []
    for (const [t1, t2] of [[T[0], T[1]], [T[1], T[0]]]) for (const p1 of simplePaths(g, S[0], t1)) for (const p2 of simplePaths(g, S[1], t2))
      if (p1.every(v => !p2.includes(v)) && p1.slice(0, -1).every(v => !T.includes(v)) && p2.slice(0, -1).every(v => !T.includes(v)) && p1.slice(1).every(v => !S.includes(v)) && p2.slice(1).every(v => !S.includes(v))) res.push([p1, p2])
    return res
  }

  it('b forward: e = ab, f = cd are disjoint edges of the grid; the only disjoint S-T paths are a x c and b y d; they close to the outer 6-cycle', () => {
    const st = steps('t05-two-cycles-b-forward'), g = st[0]
    expect(g.vertices.length).toBe(6); expect(g.edges.length).toBe(7); expect(twoConnected(g)).toBe(true)
    expect(G(g)).toEqual(expect.arrayContaining([key('a', 'b'), key('c', 'd')]))
    expect(new Set(['a', 'b', 'c', 'd']).size).toBe(4)
    expect(disjointPairs(g, ['a', 'b'], ['c', 'd'])).toEqual([[['a', 'x', 'c'], ['b', 'y', 'd']]])
    expect(cls(st[2], 'color3')).toEqual([key('a', 'x'), key('x', 'c')].sort()); expect(cls(st[2], 'color4')).toEqual([key('b', 'y'), key('y', 'd')].sort())
    const cyc = cls(st[4], 'cycle')
    expect(cyc.length).toBe(6); expect(isCycle(st[4], cyc)).toBe(true)
    expect(cyc).toEqual(expect.arrayContaining([key('a', 'b'), key('c', 'd')]))
  })

  it('b forward, shared vertex: e = ab, f = bd; S ∩ T = {b}; the trivial path b and a x d are the disjoint S-T paths; cycle a b d x', () => {
    const st = steps('t05-two-cycles-b-forward-shared'), g = st[0]
    expect(g.vertices.length).toBe(6); expect(g.edges.length).toBe(7); expect(twoConnected(g)).toBe(true)
    expect(G(g)).toEqual(expect.arrayContaining([key('a', 'b'), key('b', 'd')]))
    // with the trivial path b, the other path must avoid b: the only a-d path avoiding b is a x d
    const noB = { ...g, edges: g.edges.filter(e => !ends(e).includes('b')) }
    expect(simplePaths(noB, 'a', 'd')).toEqual([['a', 'x', 'd']])
    expect(cls(st[3], 'color4')).toEqual([key('a', 'x'), key('x', 'd')].sort())
    const cyc = cls(st[4], 'cycle')
    expect(cyc.length).toBe(4); expect(isCycle(st[4], cyc)).toBe(true)
    // e = f case: G has an edge other than e
    expect(g.edges.length).toBeGreaterThanOrEqual(2)
  })

  it('b backward: outer 6-cycle contains e = up, f = sv and the vertices u, v; up and sv are distinct edges at u and v', () => {
    const st = steps('t05-two-cycles-b-backward'), g = st[0]
    expect(g.vertices.length).toBe(6); expect(g.edges.length).toBe(7)
    expect(G(g)).toEqual(expect.arrayContaining([key('u', 'p'), key('s', 'v')]))
    expect(key('u', 'p')).not.toBe(key('s', 'v'))
    const cyc = cls(st[2], 'cycle')
    expect(cyc.length).toBe(6); expect(isCycle(st[2], cyc)).toBe(true)
    expect(cyc).toEqual(expect.arrayContaining([key('u', 'p'), key('s', 'v')]))
    expect(g.vertices.every(v => !(g.edges.every(e => !ends(e).includes(v.id))))).toBe(true)
  })
})

describe('Ear decomposition walkthroughs (t05)', () => {
  const steps = (id: string): GraphData[] => {
    const f = index.figureById.get(id)!
    const doc = parseGraph(f.source, f.info)
    expect(doc.errors).toEqual([])
    return doc.panels[0].steps.map(s => s.graph)
  }
  const pair = (e: GraphData['edges'][number]) => ends(e).slice().sort().join('')
  const key = (u: string, v: string) => [u, v].sort().join('')
  const cls = (g: GraphData, c: string) => g.edges.filter(e => e.classes.includes(c)).map(pair).sort()
  const vcls = (g: GraphData, c: string) => g.vertices.filter(v => v.classes.includes(c)).map(v => v.id).sort()
  const ids = (g: GraphData) => g.vertices.map(v => v.id).sort()
  const adj = (es: string[][], skip: string[]) => {
    const m = new Map<string, string[]>()
    for (const [a, b] of es) if (!skip.includes(a) && !skip.includes(b)) { m.set(a, [...(m.get(a) ?? []), b]); m.set(b, [...(m.get(b) ?? []), a]) }
    return m
  }
  const connectedOn = (vs: string[], es: string[][]) => {
    const m = adj(es, []), seen = new Set([vs[0]]), q = [vs[0]]
    while (q.length) { const u = q.pop()!; for (const w of m.get(u) ?? []) if (vs.includes(w) && !seen.has(w)) { seen.add(w); q.push(w) } }
    return seen.size === vs.length
  }
  const E = (g: GraphData) => g.edges.map(e => ends(e))
  const twoConn = (g: GraphData) => ids(g).length >= 3 && connectedOn(ids(g), E(g)) &&
    ids(g).every(z => connectedOn(ids(g).filter(v => v !== z), E(g).filter(e => !e.includes(z))))
  const isCycle = (es: string[]) => {
    const deg = new Map<string, number>()
    for (const p of es) for (const v of p.split('')) deg.set(v, (deg.get(v) ?? 0) + 1)
    return es.length >= 3 && [...deg.values()].every(d => d === 2) && connectedOn([...deg.keys()], es.map(p => p.split('')))
  }

  it('back: G is a 4-cycle on x s y t; P = x p q r y has 3 inner vertices; H is 2-connected; every deletion of z leaves H connected; G - x is connected', () => {
    const st = steps('t05-ear-back'), g = st[1]
    expect(cls(st[0], 'cycle')).toEqual([key('x', 's'), key('s', 'y'), key('y', 't'), key('t', 'x')].sort())
    expect(isCycle(cls(st[0], 'cycle'))).toBe(true)
    expect(ids(g)).toEqual(['p', 'q', 'r', 's', 't', 'x', 'y']); expect(g.edges.length).toBe(8)
    expect(cls(g, 'highlight')).toEqual([key('x', 'p'), key('p', 'q'), key('q', 'r'), key('r', 'y')].sort())
    expect(twoConn(g)).toBe(true)
    const gOnly = ['x', 's', 'y', 't'], gEdges = E(g).filter(e => e.every(v => gOnly.includes(v)))
    expect(connectedOn(['s', 'y', 't'], gEdges.filter(e => !e.includes('x')))).toBe(true) // G - x
    expect(connectedOn(gOnly, gEdges)).toBe(true) // G intact (case 2)
    // case 1 z = x: p, q, r reach y along P; case 2 z = q: p hangs on x, r on y
    expect(connectedOn(ids(g).filter(v => v !== 'x'), E(g).filter(e => !e.includes('x')))).toBe(true)
    expect(connectedOn(ids(g).filter(v => v !== 'q'), E(g).filter(e => !e.includes('q')))).toBe(true)
    expect(vcls(st[2], 'muted')).toEqual(['x']); expect(vcls(st[5], 'muted')).toEqual(['q'])
    expect(vcls(st[3], 'visited')).toEqual(['s', 't', 'y']); expect(vcls(st[4], 'visited')).toEqual(['p', 'q', 'r', 's', 't', 'y'])
    expect(vcls(st[6], 'visited')).toEqual(['p', 'r', 's', 't', 'x', 'y'])
  })

  // the figure of the two other walkthroughs: page figure without vertex 9
  const base = () => steps('t05-ear-max-edge')
  const cyc = ['12', '23', '34', '45', '56', '16']
  const ear = ['27', '78', '58']

  it('max-edge: G has 8 vertices and 10 edges, is 2-connected; cycle 1..6; H = cycle + ear 2,7,8,5 has all 8 vertices and 9 edges; only 18 is missing', () => {
    const st = base(), g = st[0]
    expect(ids(g).length).toBe(8); expect(g.edges.length).toBe(10); expect(twoConn(g)).toBe(true)
    expect(cls(st[0], 'cycle').sort()).toEqual(cyc.slice().sort()); expect(isCycle(cls(st[0], 'cycle'))).toBe(true)
    const H = cls(st[1], 'tree'); expect(H).toEqual([...cyc, ...ear].sort()); expect(H.length).toBe(9)
    expect(vcls(st[1], 'tree')).toEqual(['1', '2', '3', '4', '5', '6', '7', '8'])
    const rest = g.edges.map(pair).filter(p => !H.includes(p)); expect(rest).toEqual(['18'])
    // the ear 2,7,8,5: inner vertices 7, 8 are new after the cycle; ends 2, 5 distinct and on the cycle
    expect(['2', '5'].every(v => cyc.join('').includes(v))).toBe(true); expect(cyc.join('')).not.toMatch(/[78]/)
    expect(cls(st[3], 'tree').length).toBe(10)
  })

  it('max-vertex: H = 6-cycle, x = 7 outside; e = 34, f = 78; C = 7,8,5,4,3,2 is a cycle of G through e and f; from 7 the first H-vertices are 2 and 5; Q = 2,7,8,5; ends differ', () => {
    const st = base(), g = st[0] // same graph as max-edge
    const v = steps('t05-ear-max-vertex')
    expect(E(v[0]).map(e => key(e[0], e[1])).sort()).toEqual(E(g).map(e => key(e[0], e[1])).sort())
    expect(cls(v[0], 'tree')).toEqual(cyc.slice().sort()); expect(vcls(v[0], 'tree')).toEqual(['1', '2', '3', '4', '5', '6'])
    expect(vcls(v[0], 'source')).toEqual(['7'])
    const gEdges = new Set(g.edges.map(pair))
    const C = ['7', '8', '5', '4', '3', '2'], cEdges = C.map((c, i) => key(c, C[(i + 1) % C.length]))
    expect(cEdges.every(p => gEdges.has(p))).toBe(true); expect(isCycle(cEdges)).toBe(true)
    expect(cEdges).toContain('34'); expect(cEdges).toContain('78'); expect(cls(v[2], 'cycle').sort()).toEqual(cEdges.slice().sort())
    const Hv = new Set(['1', '2', '3', '4', '5', '6'])
    const walk = (dir: 1 | -1) => { let i = C.indexOf('7'); const p = ['7']; do { i = (i + dir + C.length) % C.length; p.push(C[i]) } while (!Hv.has(C[i])); return p }
    expect(walk(1)).toEqual(['7', '8', '5']); expect(walk(-1)).toEqual(['7', '2'])
    expect(cls(v[3], 'path')).toEqual([key('2', '7'), key('7', '8'), key('8', '5')].sort())
    expect(C.filter(c => Hv.has(c)).length).toBe(4) // at least two vertices of H on C: 5, 4, 3, 2
    expect(vcls(v[4], 'color1')).toEqual(['2', '5'])
  })
})

describe('graph families example figures', () => {
  const deg = (g: GraphData) => ids(g).map(v => g.edges.filter(e => e.tail[0] === v || e.head[0] === v).length).sort()
  const ids = (g: GraphData) => g.vertices.map(v => v.id)
  it('P_3 has 4 vertices and 3 edges; the star has 4 and 3 with a vertex of degree 3', () => {
    const p = fig('t01-path-examples', 0), s = fig('t01-path-examples', 1)
    expect([ids(p).length, p.edges.length, deg(p)]).toEqual([4, 3, [1, 1, 2, 2]])
    expect([ids(s).length, s.edges.length, deg(s)]).toEqual([4, 3, [1, 1, 1, 3]])
  })
  it('C_5 is 2-regular on 5 vertices; two triangles have 6 vertices, 6 edges and are 2-regular but disconnected', () => {
    const c = fig('t01-cycle-examples', 0), t = fig('t01-cycle-examples', 1)
    expect([ids(c).length, c.edges.length, deg(c)]).toEqual([5, 5, [2, 2, 2, 2, 2]])
    expect([ids(t).length, t.edges.length, deg(t)]).toEqual([6, 6, [2, 2, 2, 2, 2, 2]])
    expect(A.components(new GraphIndex(t)).length).toBe(2); expect(A.components(new GraphIndex(c)).length).toBe(1)
  })
  it('K_5 has 10 edges, all degrees 4; without edge 24: 9 edges and 2, 4 not adjacent', () => {
    const k = fig('t01-complete-examples', 0), n = fig('t01-complete-examples', 1)
    expect([ids(k).length, k.edges.length, deg(k)]).toEqual([5, 10, [4, 4, 4, 4, 4]])
    expect(n.edges.length).toBe(9)
    expect(n.edges.some(e => [e.tail[0], e.head[0]].sort().join('') === '24')).toBe(false)
    expect(k.edges.some(e => [e.tail[0], e.head[0]].sort().join('') === '24')).toBe(true)
  })
  it('K_{2,3} has 6 edges between sides; the second panel has 5, missing 2 3\'', () => {
    const k = fig('t01-bipartite-examples', 0), n = fig('t01-bipartite-examples', 1)
    expect([ids(k).length, k.edges.length]).toEqual([5, 6])
    expect(k.edges.every(e => (e.tail[0].endsWith("'")) !== (e.head[0].endsWith("'")))).toBe(true)
    expect(n.edges.length).toBe(5)
    expect(n.edges.some(e => [e.tail[0], e.head[0]].includes("3'") && [e.tail[0], e.head[0]].includes('2'))).toBe(false)
  })
})

describe('graphs example figures (t01)', () => {
  const key = (e: GraphData['edges'][number]) => [e.tail[0], e.head[0]].sort().join('')
  it('graph example: 5 vertices, 5 edges of 10 pairs, no loops or parallel edges; non-example has a loop at 3 and 2 edges 12', () => {
    const g = fig('t01-graph-examples', 0), b = fig('t01-graph-examples', 1)
    expect([g.vertices.length, g.edges.length, g.vertices.length * (g.vertices.length - 1) / 2]).toEqual([5, 5, 10])
    expect(g.edges.map(key).sort()).toEqual(['12', '23', '24', '34', '45'])
    expect(b.edges.filter(e => key(e) === '12').length).toBe(2)
    expect(b.edges.filter(e => e.tail[0] === e.head[0]).map(key)).toEqual(['33'])
    expect(g.edges.some(e => key(e) === '15')).toBe(false)
  })
  it('N(2) = {1,3,4}; 1 and 3 not adjacent; edge 34 has endpoints 3 and 4', () => {
    const l = fig('t01-adjacency-examples', 0), r = fig('t01-adjacency-examples', 1)
    const nb = new Set(l.edges.filter(e => key(e).includes('2')).map(e => (e.tail[0] === '2' ? e.head[0] : e.tail[0])))
    expect([...nb].sort()).toEqual(['1', '3', '4'])
    expect(vclsOf(l, 'color2')).toEqual(['1', '3', '4'])
    expect(l.edges.some(e => key(e) === '13')).toBe(false)
    expect(vclsOf(r, 'color1')).toEqual(['3', '4'])
    expect(r.edges.filter(e => e.classes.includes('highlight')).map(key)).toEqual(['34'])
  })
})
function vclsOf(g: GraphData, c: string) { return g.vertices.filter(v => v.classes.includes(c)).map(v => v.id).sort() }

describe('subgraphs example figures (t02)', () => {
  const key = (e: GraphData['edges'][number]) => [e.tail[0], e.head[0]].sort().join('')
  it('submultigraph figure: G has parallel e, f on uv, g on vw, loop h at w; submultigraph keeps f, g with the same ends; non-example moves e to uw', () => {
    const g = fig('t02-submultigraph', 0), s = fig('t02-submultigraph', 1), n = fig('t02-submultigraph', 2)
    const lab = (h: GraphData) => h.edges.map(e => `${String(e.label)}:${key(e)}`).sort()
    expect(lab(g)).toEqual(['$e$:uv', '$f$:uv', '$g$:vw', '$h$:ww'])
    expect(lab(s)).toEqual(['$f$:uv', '$g$:vw'])
    expect(s.edges.every(e => g.edges.some(f => f.label === e.label && key(f) === key(e)))).toBe(true)
    expect(lab(n)).toEqual(['$e$:uw', '$g$:vw'])
    expect(n.edges.filter(e => e.classes.includes('rejected')).map(e => e.label)).toEqual(['$e$'])
  })
})

describe('bipartite example figures (t02)', () => {
  const key = (e: GraphData['edges'][number]) => [e.tail[0], e.head[0]].sort().join('')
  it('P3 is 0-1-2-3 with parts {0,2},{1,3}; K22 has 4 edges, P3 keeps 3 (bold), 03 is dropped (dashed)', () => {
    const p = fig('t02-bipartite-subgraph-kmn', 0), k = fig('t02-bipartite-subgraph-kmn', 1)
    expect(p.edges.map(key).sort()).toEqual(['01', '12', '23'])
    expect(vclsOf(p, 'color1')).toEqual(['0', '2'])
    expect(vclsOf(p, 'color2')).toEqual(['1', '3'])
    expect(p.edges.every(e => (vclsOf(p, 'color1').includes(e.tail[0])) !== (vclsOf(p, 'color1').includes(e.head[0])))).toBe(true)
    expect(k.edges.map(key).sort()).toEqual(['01', '03', '12', '23'])
    expect(k.edges.filter(e => e.classes.includes('bold')).map(key).sort()).toEqual(['01', '12', '23'])
    expect(k.edges.filter(e => e.classes.includes('dashed')).map(key)).toEqual(['03'])
  })
})

describe('chordal-graphs example figures (t04)', () => {
  const solid = (g: GraphData): GraphData => ({ ...g, edges: g.edges.filter(e => !e.classes.includes('dashed')) })
  const del = (g: GraphData, X: string[]): GraphData => ({ ...g, vertices: g.vertices.filter(v => !X.includes(v.id)), edges: g.edges.filter(e => !e.tail.concat(e.head).some(x => X.includes(x))) })
  const chordal = (g: GraphData): boolean => {
    if (!g.vertices.length) return true
    const ix = new GraphIndex(g)
    const s = ix.vertexIds.find(v => A.isSimplicial(ix, v))
    return s !== undefined && chordal(del(g, [s]))
  }
  const key = (e: GraphData['edges'][number]) => [e.tail[0], e.head[0]].sort().join('')
  it('G is the triangulated pentagon (7 edges, chords 13, 14), chordal; G - 2 is induced, chordal, keeps chord 14; dropping 14 gives C4, not chordal', () => {
    const g = fig('t04-chordal-induced-subgraph', 0), h = fig('t04-chordal-induced-subgraph', 1), c = fig('t04-chordal-induced-subgraph', 2)
    expect(g.edges.map(key).sort()).toEqual(['12', '13', '14', '15', '23', '34', '45'])
    expect(chordal(g)).toBe(true)
    expect(h.vertices.map(v => v.id).sort()).toEqual(['1', '3', '4', '5'])
    expect(h.edges.map(key).sort()).toEqual(del(g, ['2']).edges.map(key).sort())
    expect(chordal(h)).toBe(true)
    expect(h.edges.filter(e => e.classes.includes('bold')).map(key).sort()).toEqual(['13', '14'])
    expect(c.edges.filter(e => e.classes.includes('dashed')).map(key)).toEqual(['14'])
    expect(solid(c).edges.map(key).sort()).toEqual(['13', '15', '34', '45'])
    expect(chordal(solid(c))).toBe(false)
  })
})

describe('simplicial-vertices example figures (t04)', () => {
  const key = (e: GraphData['edges'][number]) => [e.tail[0], e.head[0]].sort().join('')
  const simplicial = (g: GraphData) => { const ix = new GraphIndex(g); return ix.vertexIds.filter(v => A.isSimplicial(ix, v)).sort() }
  const chordal = (g: GraphData): boolean => {
    if (!g.vertices.length) return true
    const ix = new GraphIndex(g)
    const s = ix.vertexIds.find(v => A.isSimplicial(ix, v))
    return s !== undefined && chordal({ ...g, vertices: g.vertices.filter(v => v.id !== s), edges: g.edges.filter(e => !e.tail.concat(e.head).includes(s)) })
  }
  it('strip graph has 9 edges, is chordal, simplicial vertices are exactly 1 and 6 (marked current); C5 is not chordal and has none', () => {
    const g = fig('t04-chordal-simplicial', 0), c = fig('t04-chordal-simplicial', 1)
    expect(g.vertices.length).toBe(6)
    expect(g.edges.map(key).sort()).toEqual(['12', '13', '23', '24', '34', '35', '45', '46', '56'])
    expect(chordal(g)).toBe(true)
    expect(simplicial(g)).toEqual(['1', '6'])
    expect(vclsOf(g, 'current')).toEqual(['1', '6'])
    expect(c.vertices.length).toBe(5); expect(c.edges.length).toBe(5)
    expect(chordal(c)).toBe(false)
    expect(simplicial(c)).toEqual([])
  })
})

describe('degree-sequences example figures (t01)', () => {
  it('left panel realises (3,2,2,1); right panel forced edges give (3,3,2,2), not (3,3,1,1)', () => {
    const l = new GraphIndex(fig('t01-graphic-sequence-example', 0)), r = new GraphIndex(fig('t01-graphic-sequence-example', 1))
    expect(['a', 'b', 'c', 'd'].map(v => l.degree(v))).toEqual([3, 2, 2, 1])
    expect(['a', 'b', 'c', 'd'].map(v => r.degree(v))).toEqual([3, 3, 2, 2])
    expect(vclsOf(fig('t01-graphic-sequence-example', 1), 'rejected')).toEqual(['c', 'd'])
    for (const k of [0, 1]) { const g = fig('t01-graphic-sequence-example', k), ix = new GraphIndex(g); for (const v of g.vertices) expect(num(v.data.d)).toBe(ix.degree(v.id)) }
  })
})

describe('dirac-and-ore example figures (t04)', () => {
  it('minimum degree figure: delta 2 reached by c and d; K4 plus isolated vertex has delta 0', () => {
    for (const [k, delta, min] of [[0, 2, ['c', 'd']], [1, 0, ['e']]] as const) {
      const g = fig('t04-minimum-degree-example', k), ix = new GraphIndex(g)
      expect(Math.min(...g.vertices.map(v => ix.degree(v.id)))).toBe(delta)
      expect(g.vertices.filter(v => ix.degree(v.id) === delta).map(v => v.id).sort()).toEqual(min)
      expect(vclsOf(g, 'current')).toEqual(min)
      for (const v of g.vertices) expect(num(v.data.d)).toBe(ix.degree(v.id))
    }
  })
  it('Ore example: n=5, d(w)=2<5/2, non-adjacent pairs wc, wd sum to 5, cycle edges form a Hamiltonian cycle', () => {
    const g = fig('t04-ore-example'), ix = new GraphIndex(g)
    expect(g.vertices.length).toBe(5)
    expect(g.vertices.map(v => [v.id, ix.degree(v.id)]).sort()).toEqual([['a', 4], ['b', 4], ['c', 3], ['d', 3], ['w', 2]])
    for (const v of g.vertices) expect(num(v.data.d)).toBe(ix.degree(v.id))
    expect(ix.degree('w') < 5 / 2).toBe(true)
    const adj = (u: string, v: string) => g.edges.some(e => [e.tail[0], e.head[0]].sort().join() === [u, v].sort().join())
    const pairs = g.vertices.flatMap((u, i) => g.vertices.slice(i + 1).map(v => [u.id, v.id])).filter(([u, v]) => !adj(u, v))
    expect(pairs).toEqual([['w', 'c'], ['w', 'd']])
    for (const [u, v] of pairs) expect(ix.degree(u) + ix.degree(v)).toBe(5)
    const cyc = g.edges.filter(e => e.classes.includes('cycle'))
    expect(cyc.length).toBe(5)
    const cd = new Map<string, number>(); for (const e of cyc) for (const v of [e.tail[0], e.head[0]]) cd.set(v, (cd.get(v) ?? 0) + 1)
    expect([...cd.values()]).toEqual([2, 2, 2, 2, 2]); expect(cd.size).toBe(5)
    expect(A.isConnected(new GraphIndex({ ...g, edges: cyc }))).toBe(true)
  })
})

describe('hamiltonian-graphs example figures (t04)', () => {
  it('hexagon plus two chords has a Hamiltonian cycle (the thick solid edges); the bowtie has a Hamiltonian path (thick dashed) but no Hamiltonian cycle', () => {
    const hamCycle = (g: GraphData) => {
      const ids = g.vertices.map(v => v.id), adj = (u: string, v: string) => g.edges.some(e => [e.tail[0], e.head[0]].sort().join() === [u, v].sort().join())
      const go = (path: string[]): boolean => path.length === ids.length ? adj(path[path.length - 1], path[0]) : ids.some(v => !path.includes(v) && adj(path[path.length - 1], v) && go([...path, v]))
      return go([ids[0]])
    }
    const l = fig('t04-hamiltonian-example', 0), r = fig('t04-hamiltonian-example', 1)
    expect(l.vertices.length).toBe(6); expect(l.edges.length).toBe(8); expect(hamCycle(l)).toBe(true)
    const cyc = l.edges.filter(e => e.classes.includes('cycle'))
    expect(cyc.length).toBe(6)
    const cd = new Map<string, number>(); for (const e of cyc) for (const v of [e.tail[0], e.head[0]]) cd.set(v, (cd.get(v) ?? 0) + 1)
    expect([...cd.values()]).toEqual([2, 2, 2, 2, 2, 2]); expect(cd.size).toBe(6)
    expect(A.isConnected(new GraphIndex({ ...l, edges: cyc }))).toBe(true)
    expect(r.vertices.length).toBe(5); expect(r.edges.length).toBe(6); expect(hamCycle(r)).toBe(false)
    const pth = r.edges.filter(e => e.classes.includes('path'))
    expect(pth.length).toBe(4)
    const pd = new Map<string, number>(); for (const e of pth) for (const v of [e.tail[0], e.head[0]]) pd.set(v, (pd.get(v) ?? 0) + 1)
    expect([...pd.entries()].sort()).toEqual([['a', 1], ['b', 2], ['c', 2], ['d', 2], ['e', 1]])
    expect(A.isConnected(new GraphIndex({ ...r, edges: pth }))).toBe(true)
  })
})

describe('k-connectivity example figure (t05)', () => {
  // brute force: connectivity after deleting any vertex set / edge set of the given size
  const conn = (g: GraphData, vs: string[], es: Set<string>) => A.isConnected(new GraphIndex({ ...g, vertices: g.vertices.filter(v => !vs.includes(v.id)), edges: g.edges.filter(e => !es.has(e.id) && !vs.includes(e.tail[0]) && !vs.includes(e.head[0])) }))
  const lv = (g: GraphData) => [[] as string[], ...g.vertices.map(v => [v.id])]
  const le = (g: GraphData) => [new Set<string>(), ...g.edges.map(e => new Set([e.id]))]
  it('bowtie: 2-edge-connected, deleting c disconnects (not 2-connected); pentagon with chord is 2-connected', () => {
    const l = fig('t05-k-connected-example', 0), r = fig('t05-k-connected-example', 1)
    expect(l.vertices.length).toBe(5); expect(l.edges.length).toBe(6)
    expect(le(l).every(es => conn(l, [], es))).toBe(true)
    expect(lv(l).filter(vs => !conn(l, vs, new Set())).map(vs => vs.join())).toEqual(['c'])
    expect(A.components(new GraphIndex({ ...l, vertices: l.vertices.filter(v => v.id !== 'c'), edges: l.edges.filter(e => ![e.tail[0], e.head[0]].includes('c')) })).map(c => [...c].sort().join('')).sort()).toEqual(['ab', 'de'])
    expect(r.vertices.length).toBe(5); expect(r.edges.length).toBe(6)
    expect(lv(r).every(vs => conn(r, vs, new Set()))).toBe(true)
  })
})

describe('Menger directed example figure (t05)', () => {
  const reachable = (g: GraphData, s: string, t: string, delV: string[], delE: Set<string>) => {
    const seen = new Set([s]); const q = [s]
    while (q.length) { const x = q.pop()!; for (const e of g.edges) if (!delE.has(e.id) && e.tail[0] === x && !delV.includes(e.head[0]) && !seen.has(e.head[0])) { seen.add(e.head[0]); q.push(e.head[0]) } }
    return seen.has(t)
  }
  const subsets = <T,>(xs: T[], k: number): T[][] => k === 0 ? [[]] : xs.flatMap((x, i) => subsets(xs.slice(i + 1), k - 1).map(r => [x, ...r]))
  const unit = (g: GraphData) => ({ ...g, edges: g.edges.map(e => ({ ...e, data: { ...e.data, c: 1 } })) })
  it('A: no arc st, min vertex cut {a,b} of size 2, no single-vertex cut, 2 internally disjoint paths', () => {
    const g = fig('t05-menger-directed-example', 0)
    expect(g.edges.some(e => e.tail[0] === 's' && e.head[0] === 't')).toBe(false)
    const inner = ['a', 'b', 'c']
    expect(subsets(inner, 1).some(X => !reachable(g, 's', 't', X, new Set()))).toBe(false)
    expect(subsets(inner, 2).filter(X => !reachable(g, 's', 't', X, new Set())).map(X => X.join())).toEqual(['a,b'])
    const p = (c: string) => g.edges.filter(e => e.classes.includes(c)).map(e => e.tail[0] + e.head[0]).sort()
    expect(p('color1')).toEqual(['at', 'sa']); expect(p('color2')).toEqual(['bt', 'sb'])
    expect(g.vertices.filter(v => v.classes.includes('cut')).map(v => v.id).sort()).toEqual(['a', 'b'])
  })
  it('B: min edge cut 3 (max flow 3, no 2 arcs cut), 3 edge-disjoint paths colour 1-3', () => {
    const g = fig('t05-menger-directed-example', 1)
    expect(g.edges.length).toBe(7)
    expect(maxFlowValue(unit(g), 's', 't').value).toBe(3)
    expect(subsets(g.edges.map(e => e.id), 2).some(F => !reachable(g, 's', 't', [], new Set(F)))).toBe(false)
    expect(g.edges.filter(e => e.tail[0] === 's').length).toBe(3)
    const cols = ['color1', 'color2', 'color3'].map(c => g.edges.filter(e => e.classes.includes(c)).map(e => e.tail[0] + e.head[0]).sort())
    expect(cols).toEqual([['at', 'sa'], ['ab', 'bt', 'sa'], ['bt', 'sb']])
  })
})

describe('s-t cut example figure (t05)', () => {
  const conn = (g: GraphData, s: string, t: string, delV: string[], delE: Set<string>) => {
    const seen = new Set([s]); const q = [s]
    while (q.length) { const x = q.pop()!; for (const e of g.edges) { if (delE.has(e.id)) continue; const [u, v] = [e.tail[0], e.head[0]]; for (const [p, r] of [[u, v], [v, u]]) if (p === x && !delV.includes(r) && !seen.has(r)) { seen.add(r); q.push(r) } } }
    return seen.has(t)
  }
  const cls = (g: GraphData, c: string) => g.vertices.filter(v => v.classes.includes(c)).map(v => v.id).sort()
  it('{a,b} is a cut; {at,bt} is an edge cut; {a} is not a cut and s b t survives', () => {
    const g0 = fig('t05-st-cut-example', 0), g1 = fig('t05-st-cut-example', 1), g2 = fig('t05-st-cut-example', 2)
    expect(conn(g0, 's', 't', [], new Set())).toBe(true)
    expect(cls(g0, 'cut')).toEqual(['a', 'b'])
    expect(conn(g0, 's', 't', ['a', 'b'], new Set())).toBe(false)
    const F = g1.edges.filter(e => e.classes.includes('cut'))
    expect(F.map(e => e.tail[0] + e.head[0]).sort()).toEqual(['at', 'bt'])
    expect(conn(g1, 's', 't', [], new Set(F.map(e => e.id)))).toBe(false)
    expect(cls(g2, 'cut')).toEqual(['a'])
    expect(conn(g2, 's', 't', ['a'], new Set())).toBe(true)
    expect(g2.edges.filter(e => e.classes.includes('path')).map(e => e.tail[0] + e.head[0]).sort()).toEqual(['bt', 'sb'])
  })
})

describe('components example figure (t02)', () => {
  it('left panel has 3 components, one colour each; right panel: highlighted a,b connected but not a component', () => {
    const g = fig('t02-components-example', 0), h = fig('t02-components-example', 1)
    const comps = A.components(new GraphIndex(g)).map(c => [...c].sort().join('')).sort()
    expect(comps).toEqual(['abc', 'de', 'f'])
    for (const [c, vs] of [['color1', 'abc'], ['color2', 'de'], ['color3', 'f']])
      expect(g.vertices.filter(v => v.classes.includes(c)).map(v => v.id).sort().join('')).toBe(vs)
    const hi = new Set(h.vertices.filter(v => v.classes.includes('highlight')).map(v => v.id))
    expect([...hi].sort()).toEqual(['a', 'b'])
    const sub = A.components(new GraphIndex(h), e => hi.has(e.tail[0]) && hi.has(e.head[0]))
    expect(sub.some(c => c.length === 2 && c.every(v => hi.has(v)))).toBe(true)
    expect(A.components(new GraphIndex(h)).some(c => c.includes('a') && c.length === 3)).toBe(true)
  })
})

describe('distance example figure (t02)', () => {
  it('left: dist(u,v) = 2 via u c v, the other walk u a b v has length 3; right: u and x in different components', () => {
    const g = fig('t02-distance-example', 0), h = fig('t02-distance-example', 1)
    expect(A.bfsDistances(new GraphIndex(g), 'u').get('v')).toBe(2)
    expect(g.edges.filter(e => e.classes.includes('path')).map(e => e.tail[0] + e.head[0]).sort()).toEqual(['cv', 'uc'])
    expect(g.edges.filter(e => e.classes.includes('muted')).length).toBe(3)
    expect(A.bfsDistances(new GraphIndex(h), 'u').has('x')).toBe(false)
    expect(A.components(new GraphIndex(h)).some(c => c.includes('u') && c.includes('x'))).toBe(false)
  })
})

describe('union-find / Kruskal complexity walkthroughs (a01)', () => {
  const g = fig('a01-complexity-loop')
  const h = fig('a01-complexity-sum')
  const n = g.vertices.length, m = g.edges.length
  const sorted = [...g.edges].sort((x, y) => num(x.data.w) - num(y.data.w))
  // Kruskal with the operation counts the steps state: MAKE-SET, FIND-SET, UNION.
  const comp = new Map(g.vertices.map(v => [v.id, v.id]))
  let finds = 0, unions = 0
  const accepted: string[] = [], rejected: string[] = []
  for (const e of sorted) {
    finds += 2
    const a = comp.get(e.tail[0])!, b = comp.get(e.head[0])!
    if (a !== b) { unions++; accepted.push(name(g, e.id)); for (const [k, c] of comp) if (c === b) comp.set(k, a) } else rejected.push(name(g, e.id))
  }
  it('same graph as the running example, 8 vertices and 12 edges', () => {
    expect([n, m]).toEqual([8, 12])
    expect(h.vertices.length).toBe(8)
    expect(h.edges.length).toBe(12)
    const ex = fig('a01-example-graph')
    const ws = (x: GraphData) => x.edges.map(e => name(x, e.id) + num(e.data.w)).sort()
    expect(ws(g)).toEqual(ws(ex))
  })
  it('sorted order cf de fh ab ef dg ce ac bd gh bc eg', () => {
    expect(sorted.map(e => name(g, e.id))).toEqual(['cf', 'de', 'fh', 'ab', 'ef', 'dg', 'ce', 'ac', 'bd', 'gh', 'bc', 'eg'])
  })
  it('24 FIND-SET calls, 7 UNION calls, 5 rejected edges; 31 loop operations, 39 with MAKE-SET', () => {
    expect(finds).toBe(24)
    expect(unions).toBe(7)
    expect(unions).toBe(n - 1)
    expect(rejected.sort()).toEqual(['bc', 'bd', 'ce', 'eg', 'gh'])
    expect(finds + unions).toBe(31)
    expect(finds + unions).toBeLessThanOrEqual(3 * m)
    expect(n + finds + unions).toBe(39)
    expect(m).toBeGreaterThanOrEqual(n - 1)
  })
  it('tree class and marked edges are the accepted ones', () => {
    expect(accepted.sort()).toEqual(['ab', 'ac', 'cf', 'de', 'dg', 'ef', 'fh'])
    expect(new Set(mstEdges(g)).size).toBe(7)
    expect(weight(g, mstEdges(g))).toBe(29)
  })
  it('numbers of the sum figure: log2 8 = 3, log2 12 ~ 3.58, m <= n^2, 12 against 64, 6', () => {
    expect(Math.log2(n)).toBe(3)
    expect(Math.log2(m)).toBeCloseTo(3.585, 2)
    expect(m).toBeLessThanOrEqual(n * n)
    expect(n * n).toBe(64)
    expect(2 * Math.log2(n)).toBe(6)
    expect(Math.log2(m)).toBeLessThanOrEqual(2 * Math.log2(n))
    expect(Math.log2(n)).toBeLessThanOrEqual(2 * Math.log2(m))
  })
})

describe('Borůvka complexity walkthroughs (a01)', () => {
  const g = fig('a01-boruvka-halving')
  const h = fig('a01-boruvka-phase-cost')
  const n = g.vertices.length, m = g.edges.length
  const ids = (x: GraphData, ns: string[]) => ns.map(s => x.edges.find(e => name(x, e.id) === s[0] + s[1])!.id)
  const marked = (x: GraphData, mk: string) => (x.marks?.[mk] ?? []).map(s => s.replace(/^@/, ''))
  // Borůvka by hand, with the distinct weights of the running example.
  const comp = new Map(g.vertices.map(v => [v.id, v.id]))
  const phases: { chosen: Set<string>; count: number }[] = []
  while (new Set(comp.values()).size > 1) {
    const best = new Map<string, (typeof g.edges)[number]>()
    for (const e of g.edges) {
      const a = comp.get(e.tail[0])!, b = comp.get(e.head[0])!
      if (a === b) continue
      for (const r of [a, b]) if (!best.has(r) || num(e.data.w) < num(best.get(r)!.data.w)) best.set(r, e)
    }
    const chosen = new Set([...best.values()].map(e => name(g, e.id)))
    for (const e of best.values()) {
      const a = comp.get(e.tail[0])!, b = comp.get(e.head[0])!
      if (a !== b) for (const [k, c] of comp) if (c === b) comp.set(k, a)
    }
    phases.push({ chosen, count: new Set(comp.values()).size })
  }
  it('same graph as the running example, 8 vertices and 12 edges', () => {
    expect([n, m]).toEqual([8, 12])
    const ex = fig('a01-example-graph')
    const ws = (x: GraphData) => x.edges.map(e => name(x, e.id) + num(e.data.w)).sort()
    expect(ws(g)).toEqual(ws(ex))
    expect(ws(h)).toEqual(ws(ex))
  })
  it('phase 1 chooses ab cf de dg fh and leaves 3 components (8 -> 3 <= 4)', () => {
    expect([...phases[0].chosen].sort()).toEqual(['ab', 'cf', 'de', 'dg', 'fh'])
    expect(phases[0].count).toBe(3)
    expect(phases[0].count).toBeLessThanOrEqual(n / 2)
  })
  it('phase 2 chooses ac and ef, leaves 1 component (bound 8/4 = 2); 2 phases, log2 8 = 3', () => {
    expect([...phases[1].chosen].sort()).toEqual(['ac', 'ef'])
    expect(phases[1].count).toBe(1)
    expect(1).toBeLessThanOrEqual(n / 4)
    expect(phases.length).toBe(2)
    expect(Math.log2(n)).toBe(3)
  })
  it('the figure marks match', () => {
    expect(new Set(marked(g, 'P1'))).toEqual(new Set(ids(g, ['ab', 'cf', 'de', 'dg', 'fh'])))
    expect(new Set(marked(g, 'P2'))).toEqual(new Set(ids(g, ['ac', 'ef'])))
    expect(new Set(marked(h, 'P'))).toEqual(new Set(ids(h, ['ac', 'ef'])))
  })
  it('start of phase 2: 5 forest edges, 6 edges inside components, 6 between them, 8 vertices, 12 edges', () => {
    const forest = ['ab', 'cf', 'de', 'dg', 'fh']
    const label = new Map<string, string>()
    const cs = [['a', 'b'], ['c', 'f', 'h'], ['d', 'e', 'g']]
    cs.forEach((c, i) => c.forEach(v => label.set(v, String(i))))
    const inside = h.edges.filter(e => label.get(e.tail[0]) === label.get(e.head[0])).map(e => name(h, e.id)).sort()
    const across = h.edges.filter(e => label.get(e.tail[0]) !== label.get(e.head[0])).map(e => name(h, e.id)).sort()
    expect(forest.length).toBe(5)
    expect(inside).toEqual(['ab', 'cf', 'de', 'dg', 'eg', 'fh'])
    expect(across).toEqual(['ac', 'bc', 'bd', 'ce', 'ef', 'gh'])
    expect([h.vertices.length, h.edges.length]).toEqual([8, 12])
    expect(new Set(marked(h, 'I'))).toEqual(new Set(ids(h, inside)))
    expect(new Set(marked(h, 'X'))).toEqual(new Set(ids(h, across)))
    expect(new Set(marked(h, 'F'))).toEqual(new Set(ids(h, forest)))
  })
  it('components store ac (8), ef (5), ef (5) as lightest leaving edges', () => {
    const w = (s: string) => num(h.edges.find(e => name(h, e.id) === s)!.data.w)
    const cross = (c: string[]) => h.edges.filter(e => c.includes(e.tail[0]) !== c.includes(e.head[0]))
    const lightest = (c: string[]) => { const e = cross(c).sort((x, y) => num(x.data.w) - num(y.data.w))[0]; return name(h, e.id) + num(e.data.w) }
    expect([lightest(['a', 'b']), lightest(['c', 'f', 'h']), lightest(['d', 'e', 'g'])]).toEqual(['ac8', 'ef5', 'ef5'])
    expect([w('ac'), w('ef')]).toEqual([8, 5])
  })
})

describe('MST verification walkthroughs (a01)', () => {
  const g = fig('a01-verif-all-heavy')
  const h = fig('a01-verif-converse')
  const ex = fig('a01-example-graph')
  const marked = (x: GraphData, mk: string) => (x.marks?.[mk] ?? []).map(s => s.replace(/^@/, ''))
  const ids = (x: GraphData, ns: string[]) => ns.map(s => x.edges.find(e => name(x, e.id) === s)!.id)
  const treeNames = ['ab', 'ac', 'cf', 'de', 'dg', 'ef', 'fh']
  const outside = ['bc', 'bd', 'ce', 'eg', 'gh']
  // w_T(e): heaviest edge on the tree path between the ends of e.
  const wT = (x: GraphData, a: string, b: string) => {
    const t = x.edges.filter(e => treeNames.includes(name(x, e.id)))
    const walk = (v: string, seen: string[]): number[] | null => {
      if (v === b) return []
      for (const e of t) {
        const o = e.tail[0] === v ? e.head[0] : e.head[0] === v ? e.tail[0] : null
        if (o && !seen.includes(o)) { const r = walk(o, [...seen, o]); if (r) return [num(e.data.w), ...r] }
      }
      return null
    }
    return Math.max(...walk(a, [a])!)
  }
  const w = (x: GraphData, s: string) => num(x.edges.find(e => name(x, e.id) === s)!.data.w)
  it('same graph as the running example; T is its MST with 7 edges, n = 8, 5 edges outside', () => {
    const ws = (x: GraphData) => x.edges.map(e => name(x, e.id) + num(e.data.w)).sort()
    expect(ws(g)).toEqual(ws(ex))
    expect(ws(h)).toEqual(ws(ex))
    expect(g.vertices.length).toBe(8)
    expect(new Set(mstEdges(g))).toEqual(new Set(ids(g, treeNames)))
    expect(treeNames.length).toBe(7)
    expect(g.edges.length - treeNames.length).toBe(5)
  })
  it('w_T of the five outside edges is 8, 8, 5, 6, 6 and each edge is T-heavy', () => {
    expect(outside.map(s => wT(g, s[0], s[1]))).toEqual([8, 8, 5, 6, 6])
    expect(outside.map(s => w(g, s))).toEqual([11, 9, 7, 12, 10])
    for (const s of outside) expect(w(g, s)).toBeGreaterThan(wT(g, s[0], s[1]))
  })
  it('bc closes the cycle a b c: 11 against 4 and 8 (and w_T = max(4, 8) = 8)', () => {
    expect([w(g, 'bc'), w(g, 'ab'), w(g, 'ac')]).toEqual([11, 4, 8])
    expect(wT(g, 'b', 'c')).toBe(8)
  })
  it('ce closes the cycle c f e: 7 against 1 and 5, w_T(ce) = 5', () => {
    expect([w(h, 'ce'), w(h, 'cf'), w(h, 'ef')]).toEqual([7, 1, 5])
    expect(wT(h, 'c', 'e')).toBe(5)
  })
  it('the marks match', () => {
    for (const x of [g, h]) {
      expect(new Set(marked(x, 'T'))).toEqual(new Set(ids(x, treeNames)))
      expect(new Set(marked(x, 'N'))).toEqual(new Set(ids(x, outside)))
    }
    expect(new Set(marked(g, 'e'))).toEqual(new Set(ids(g, ['bc'])))
    expect(new Set(marked(g, 'C'))).toEqual(new Set(ids(g, ['ab', 'ac', 'bc'])))
    expect(new Set(marked(h, 'e'))).toEqual(new Set(ids(h, ['ce'])))
    expect(new Set(marked(h, 'C'))).toEqual(new Set(ids(h, ['ce', 'cf', 'ef'])))
    expect(new Set(marked(h, 'P'))).toEqual(new Set(ids(h, ['cf', 'ef'])))
  })
})

describe('sampling lemma figures (a01)', () => {
  const ex = fig('a01-example-graph')
  const s = fig('a01-sampling-example')
  const pr = fig('a01-sampling-process')
  const ct = fig('a01-sampling-count')
  const nm = (x: GraphData, ids: Iterable<string>) => [...ids].map(id => name(x, id)).sort()
  const cls = (x: GraphData, c: string) => nm(x, x.edges.filter(e => e.classes.includes(c)).map(e => e.id))
  const marked = (x: GraphData, mk: string) => nm(x, (x.marks?.[mk] ?? []).map(t => t.replace(/^@/, '')))
  const w = (x: GraphData, n: string) => num(x.edges.find(e => name(x, e.id) === n)!.data.w)
  const order = edgeOrder(s).map(e => name(s, e.id))
  const sample = new Set(s.edges.filter(e => !e.classes.includes('dashed')).map(e => name(s, e.id)))
  // The process of the proof: Kruskal on G, an edge enters L when it joins two trees, and F when it is also sampled.
  const run = (smp: Set<string>, stopAt?: string) => {
    const p = new Map(s.vertices.map(v => [v.id, v.id]))
    const find = (x: string): string => (p.get(x) === x ? x : find(p.get(x)!))
    const L: string[] = [], F: string[] = []
    for (const e of order) {
      if (e === stopAt) return { L, F, joined: find(e[0]) === find(e[1]) }
      if (find(e[0]) !== find(e[1])) { L.push(e); if (smp.has(e)) { F.push(e); p.set(find(e[0]), find(e[1])) } }
    }
    return { L, F, joined: false }
  }
  // w_F(e) by the definition: heaviest edge on the F-path, or Infinity.
  const wF = (F: string[], a: string, b: string): number => {
    const walk = (v: string, seen: string[]): number[] | null => {
      if (v === b) return []
      for (const e of F) {
        const o = e[0] === v ? e[1] : e[1] === v ? e[0] : null
        if (o && !seen.includes(o)) { const r = walk(o, [...seen, o]); if (r) return [w(s, e), ...r] }
      }
      return null
    }
    const r = walk(a, [a])
    return r ? Math.max(...r) : Infinity
  }
  const { L, F } = run(sample)
  it('the MSF panel weighs 6 and is the MSF; the other panel is a spanning forest of weight 7', () => {
    const m = fig('a01-msf', 0), o = fig('a01-msf', 1)
    const tree = (x: GraphData) => new Set(x.edges.filter(e => e.classes.includes('tree')).map(e => e.id))
    expect(tree(m)).toEqual(mstEdges(m))
    expect(weight(m, tree(m))).toBe(6)
    expect(weight(o, tree(o))).toBe(7)
    expect(nm(o, tree(o))).toEqual(['ab', 'ac', 'de', 'ef'])
  })
  it('same graph as the running example, n = 8; the sample has 8 of 12 edges and leaves a alone', () => {
    const ws = (x: GraphData) => x.edges.map(e => name(x, e.id) + num(e.data.w)).sort()
    for (const x of [s, pr, ct]) expect(ws(x)).toEqual(ws(ex))
    expect(s.vertices.length).toBe(8)
    expect(sample.size).toBe(8)
    expect(cls(s, 'dashed')).toEqual(['ab', 'ac', 'bd', 'gh'])
    expect([...sample].some(e => e.includes('a'))).toBe(false)
    expect(order[0]).toBe('cf')
    expect(order.slice(0, 3).map(e => w(s, e))).toEqual([1, 2, 3])
    expect(order[11]).toBe('eg')
  })
  it('F is the MSF of the sample (6 edges); L is the set of F-light edges (9); ce, gh, eg are F-heavy', () => {
    const H: GraphData = { ...s, edges: s.edges.filter(e => sample.has(name(s, e.id))) }
    expect(F.slice().sort()).toEqual(nm(s, mstEdges(H)))
    expect(F.slice().sort()).toEqual(cls(s, 'tree'))
    expect(F.length).toBe(6)
    const light = order.filter(e => w(s, e) <= wF(F, e[0], e[1]))
    expect(L.slice().sort()).toEqual(light.slice().sort())
    expect(L.length).toBe(9)
    expect(order.filter(e => !light.includes(e)).sort()).toEqual(['ce', 'eg', 'gh'])
    expect(cls(s, 'muted')).toEqual(['ce', 'eg', 'gh'])
  })
  it('the steps: ab, ce, bc and bd', () => {
    expect(run(sample, 'ab').F.sort()).toEqual(['cf', 'de', 'fh'])
    expect(run(sample, 'ab').joined).toBe(false)
    expect(run(sample, 'ce').joined).toBe(true)
    expect([w(s, 'ce'), w(s, 'cf'), w(s, 'ef')]).toEqual([7, 1, 5])
    expect(wF(F, 'c', 'e')).toBe(5)
    expect(run(sample, 'bc').joined).toBe(false)
    expect(F).toContain('bc')
    expect(w(s, 'bc')).toBe(11)
    const atBd = run(sample, 'bd')
    expect(atBd.joined).toBe(false)
    expect(atBd.F.sort()).toEqual(['cf', 'de', 'dg', 'ef', 'fh'])
    expect(F).not.toContain('bd')
    expect([w(s, 'bd'), wF(F, 'b', 'd')]).toEqual([9, 11])
  })
  it('over all 4096 samples E|L| = 10.79, E|F| = 5.39 = E|L| / 2, below (n - 1)/p = 14 and n/p = 16', () => {
    let sL = 0, sF = 0
    const N = 1 << order.length
    for (let m = 0; m < N; m++) {
      const r = run(new Set(order.filter((_, i) => (m >> i) & 1)))
      sL += r.L.length; sF += r.F.length
    }
    expect(N).toBe(4096)
    expect((sL / N).toFixed(2)).toBe('10.79')
    expect((sF / N).toFixed(2)).toBe('5.39')
    expect(2 * sF).toBe(sL)
    expect([(8 - 1) / 0.5, 8 / 0.5]).toEqual([14, 16])
  })
  it('the marks match', () => {
    for (const x of [pr, ct]) {
      expect(marked(x, 'L')).toEqual(L.slice().sort())
      expect(marked(x, 'F')).toEqual(F.slice().sort())
      expect(marked(x, 'bd')).toEqual(['bd'])
    }
    expect(marked(pr, 'out')).toEqual(cls(s, 'dashed'))
    expect(marked(pr, 'heavy')).toEqual(['ce', 'eg', 'gh'])
    expect(marked(pr, 'Pce')).toEqual(['cf', 'ef'])
    expect(marked(pr, 'Pbd')).toEqual(['bc', 'cf', 'de', 'ef'])
    expect(marked(pr, 'first')).toEqual(['cf'])
    expect(marked(ct, 'before')).toEqual(run(sample, 'bd').F.sort())
  })
})

describe('KKT complexity figures (a01)', () => {
  const g = fig('a01-kkt-recurrence')
  const doc = (id: string) => { const f = index.figureById.get(id)!; return parseGraph(f.source, f.info).panels[0] }
  const nm = (ids: Iterable<string>) => [...ids].map(id => name(g, id.replace(/^@/, ''))).sort()
  const marked = (mk: string) => nm(g.marks?.[mk] ?? [])
  const w = (id: string) => num(g.edges.find(e => e.id === id)!.data.w)
  type E = { id: string; u: string; v: string }
  const edges0: E[] = g.edges.map(e => ({ id: e.id, u: e.tail[0], v: e.head[0] }))
  // One Boruvka phase with contraction: every vertex with an edge picks its lightest edge; chosen edges are contracted,
  // loops vanish, of parallel edges only the lightest stays, vertices without edges are deleted.
  const phase = (vs: string[], es: E[]) => {
    const chosen = new Set<string>()
    for (const v of vs) {
      const inc = es.filter(e => e.u === v || e.v === v)
      if (inc.length) chosen.add(inc.reduce((a, b) => (w(b.id) < w(a.id) ? b : a)).id)
    }
    const p = new Map(vs.map(v => [v, v]))
    const find = (x: string): string => (p.get(x) === x ? x : find(p.get(x)!))
    for (const id of chosen) { const e = es.find(x => x.id === id)!; p.set(find(e.u), find(e.v)) }
    const rel = es.filter(e => find(e.u) !== find(e.v)).map(e => ({ id: e.id, u: find(e.u), v: find(e.v) }))
    const best = new Map<string, E>()
    for (const e of rel) { const k = [e.u, e.v].sort().join(); if (!best.has(k) || w(e.id) < w(best.get(k)!.id)) best.set(k, e) }
    const kept = [...best.values()]
    const nv = [...new Set(vs.filter(v => es.some(e => e.u === v || e.v === v)).map(find))]
    return { chosen: nm(chosen), chosenIds: [...chosen], vs: nv, before: rel, es: kept, removed: rel.filter(e => !kept.includes(e)).map(e => e.id) }
  }
  const p1 = phase(g.vertices.map(v => v.id), edges0)
  const p2 = phase(p1.vs, p1.es)
  const n = 12, m = 14
  it('G has n = 12 vertices and m = 14 edges with distinct weights 1 to 14', () => {
    expect([g.vertices.length, g.edges.length]).toEqual([n, m])
    expect(g.edges.map(e => w(e.id)).sort((a, b) => a - b)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1))
  })
  it('phase 1 chooses six edges (weights 1 to 6); G1 has 6 = n/2 vertices; two parallel edges (ac, cf) are removed, 6 edges stay', () => {
    expect(p1.chosen).toEqual(marked('F1'))
    expect(p1.chosenIds.map(w).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6])
    expect(p1.vs.length).toBe(n / 2)
    expect(p1.before.length).toBe(8)
    expect(nm(p1.removed)).toEqual(marked('D1'))
    expect(marked('D1')).toEqual(['ac', 'cf'])
    expect(p1.es.length).toBe(6)
    // bc (7) beats ac (14) and de (10) beats cf (13)
    expect([w('bc'), w('ac'), w('de'), w('cf')]).toEqual([7, 14, 10, 13])
    expect(nm(p1.es.map(e => e.id))).toEqual(['bc', 'cj', 'de', 'fg', 'hi', 'jk'])
  })
  it('phase 2 chooses bc, fg, jk (7, 8, 9); G2 has 3 = n/4 vertices and the 3 edges de, hi, cj, no parallel edges', () => {
    expect(p2.chosen).toEqual(marked('F2'))
    expect(p2.chosenIds.map(w).sort((a, b) => a - b)).toEqual([7, 8, 9])
    expect(p2.vs.length).toBe(n / 4)
    expect(p2.removed.length).toBe(0)
    expect(p2.es.length).toBe(3)
    expect(p2.es.length).toBeLessThanOrEqual(m)
    expect(nm(p2.es.map(e => e.id))).toEqual(marked('G2'))
    expect(marked('G2')).toEqual(['cj', 'de', 'hi'])
    expect(marked('G2').map(w).sort((a, b) => a - b)).toEqual([10, 11, 12])
  })
  // G2 is a triangle on x, y, z; F' is the MSF of the sample.
  const tri = p2.es.map(e => ({ id: name(g, e.id), u: e.u, v: e.v })).sort((a, b) => w(a.id) - w(b.id))
  const msf = (S: string[]) => {
    const p = new Map(p2.vs.map(v => [v, v]))
    const find = (x: string): string => (p.get(x) === x ? x : find(p.get(x)!))
    const F: string[] = []
    for (const e of tri) if (S.includes(e.id) && find(e.u) !== find(e.v)) { F.push(e.id); p.set(find(e.u), find(e.v)) }
    return { F, find }
  }
  // wF by the definition: heaviest edge on the F-path, Infinity if the ends lie in two trees.
  const light = (S: string[]) => {
    const { F, find } = msf(S)
    const wF = (e: { u: string; v: string }): number => {
      if (find(e.u) !== find(e.v)) return Infinity
      // brute force: heaviest edge on the unique path in the forest F
      const adj = (v: string) => tri.filter(t => F.includes(t.id) && (t.u === v || t.v === v))
      const walk = (v: string, seen: string[]): number[] | null => {
        if (v === e.v) return []
        for (const t of adj(v)) { const o = t.u === v ? t.v : t.u; if (!seen.includes(o)) { const r = walk(o, [...seen, o]); if (r) return [w(t.id), ...r] } }
        return null
      }
      return Math.max(...walk(e.u, [e.u])!)
    }
    return { F, light: tri.filter(e => w(e.id) <= wF(e)).map(e => e.id), wF }
  }
  it('the sample {de, hi}: F\' = {de, hi} spans x, y, z; cj (12) is F\'-heavy (path weight 11); de and hi are light; H has 2 edges, expected 3/2', () => {
    const r = light(['de', 'hi'])
    expect(r.F).toEqual(['de', 'hi'])
    expect(r.F.length).toBe(p2.vs.length - 1)
    expect(r.light).toEqual(['de', 'hi'])
    expect(r.wF(tri.find(e => e.id === 'cj')!)).toBe(11)
    expect(w('cj')).toBeGreaterThan(11)
    expect(3 * 0.5).toBe(1.5)
    expect(marked('Fp')).toEqual(['de', 'hi'])
    const st = doc('a01-kkt-recurrence').steps
    const dashed = (i: number) => st[i].graph.edges.filter(e => e.classes.includes('dashed')).map(e => e.id).sort()
    expect(dashed(7)).toEqual(['cj'])
  })
  it('over all 8 samples E|light| = 2.75, below 2|V(G2)| = 6 = n/2; with dummy edges |F\'| + dummies = |V(G2)| - 1', () => {
    const es = tri.map(e => e.id)
    let sum = 0
    for (let mask = 0; mask < 8; mask++) {
      const S = es.filter((_, i) => (mask >> i) & 1)
      sum += light(S).light.length
      // number of trees of F' is |V| - |F'|, so |V| - |F'| - 1 dummy edges make a spanning tree
      expect(light(S).F.length + (p2.vs.length - light(S).F.length - 1)).toBe(p2.vs.length - 1)
    }
    expect(sum / 8).toBe(2.75)
    expect(2 * p2.vs.length).toBe(6)
    expect(2 * p2.vs.length).toBe(n / 2)
    expect(light(['de', 'hi']).light.length).toBe(2)
  })
  it('F1, F2 and the MSF of H\' = {de, hi} (both edges) together are the MST of G, weight 66', () => {
    const F3 = msf(light(['de', 'hi']).light).F
    expect(F3).toEqual(['de', 'hi'])
    const all = new Set([...marked('F1'), ...marked('F2'), ...F3])
    expect(all.size).toBe(n - 1)
    const T = mstEdges(g)
    expect(nm(T)).toEqual([...all].sort())
    expect(weight(g, T)).toBe(66)
  })
  it('recursion tree: n = 64, m = 256, sizes 2n + m; the recurrence terms add up to 2c(2n + m); the base calls have sizes 2 and 0', () => {
    const f = index.figureById.get('a01-kkt-recursion')!
    const last = parseGraph(f.source, f.info).panels[0].steps.at(-1)!.graph
    const lab = Object.fromEntries(last.vertices.map(v => [v.id, Number(v.label)]))
    const size = (a: number, b: number) => 2 * a + b
    const kids = (a: number, b: number): [number, number][] => [[a / 4, b / 2], [a / 4, a / 2]]
    const [k1, k2] = kids(64, 256)
    const [l1, l2] = kids(...k1), [k3, k4] = kids(...k2)
    expect(lab).toEqual({ r: 384, o: 2, z: 0, l: 160, k: 64, l1: size(...l1), l2: size(...l2), k1: size(...k3), k2: size(...k4) })
    expect([size(...l1), size(...l2), size(...k3), size(...k4)]).toEqual([72, 16, 24, 16])
    expect(lab.o).toBe(size(1, 0))
    // base case: bound 2c(2n + 0) = 4cn, at least 4c for n >= 1
    expect(2 * size(1, 0)).toBe(4)
    // empty call: size and bound 0; a caller with an edge has n >= 2, so c(n + m) >= 3c
    expect(lab.z).toBe(size(0, 0))
    expect(2 * size(0, 0)).toBe(0)
    expect(2 + 1).toBe(3)
    expect(2 * lab.l).toBe(64 + 256)
    expect(2 * lab.k).toBe(2 * 64)
    expect(320 + 320 + 128).toBe(768)
    expect(2 * lab.r).toBe(768)
    for (const [a, b] of [[64, 256], [100, 7], [3, 50], [1, 1]]) {
      const [x, y] = kids(a, b)
      expect(2 * size(...x)).toBe(a + b)
      expect(2 * size(...y)).toBe(2 * a)
      expect((a + b) + (a + b) + 2 * a).toBe(2 * size(a, b))
      // actual sizes: at most n/4 vertices and m edges, so size at most n/2 + m < 2n + m
      expect(a / 2 + b).toBeLessThan(size(a, b))
    }
    const marks = last.marks ?? {}
    expect(marks.root).toEqual(['r'])
    expect(marks.base).toEqual(['o'])
    expect(marks.empty).toEqual(['z'])
    expect(marks.calls).toEqual(['l', 'k'])
    expect(marks.below).toEqual(['l1', 'l2', 'k1', 'k2'])
  })
})

describe('Ford–Fulkerson analysis (a02-ffa-*)', () => {
  const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const flow = (g: GraphData) => Object.fromEntries(g.edges.map(e => [name(g, e.id), num(e.data.f)]))
  const cap = (g: GraphData) => Object.fromEntries(g.edges.map(e => [name(g, e.id), num(e.data.c)]))
  const value = (g: GraphData) => g.edges.reduce((z, e) => z + (e.tail[0] === 's' ? num(e.data.f) : 0), 0)
  const isFlow = (g: GraphData) => {
    for (const e of g.edges) { expect(num(e.data.f)).toBeGreaterThanOrEqual(0); expect(num(e.data.f)).toBeLessThanOrEqual(num(e.data.c)) }
    for (const v of ['a', 'b', 'c', 'd'])
      expect(g.edges.filter(e => e.head[0] === v).reduce((z, e) => z + num(e.data.f), 0))
        .toBe(g.edges.filter(e => e.tail[0] === v).reduce((z, e) => z + num(e.data.f), 0))
  }
  // residual capacities of a flow: forward c - f when positive, reverse f when positive
  const residual = (c: Record<string, number>, f: Record<string, number>) => {
    const r: Record<string, number> = {}
    for (const k of Object.keys(c)) { if (c[k] > f[k]) r[k] = c[k] - f[k]; if (f[k] > 0) r[k[1] + k[0]] = f[k] }
    return r
  }
  const augment = (f: Record<string, number>, path: string, d: number) => {
    const g = { ...f }
    for (let i = 0; i + 1 < path.length; i++) { const e = path[i] + path[i + 1]; if (e in g) g[e] += d; else g[path[i + 1] + path[i]] -= d }
    return g
  }
  const bottleneck = (r: Record<string, number>, path: string) => Math.min(...[...path].slice(0, -1).map((u, i) => r[u + path[i + 1]]))

  it('integrality figure: integral flows of values 0, 8, 10, 19; bottlenecks 8, 2, 7, 2, each at least 1', () => {
    const S = steps('a02-ffa-integral')
    expect(S.length).toBe(5)
    const c = cap(S[0])
    expect(Object.keys(c).length).toBe(9)
    S.forEach(g => { isFlow(g); expect(Object.values(flow(g)).every(Number.isInteger)).toBe(true); expect(cap(g)).toEqual(c) })
    expect(S.map(value)).toEqual([0, 0, 8, 10, 19])
    // start: residual capacities are the capacities (all 9 edges)
    expect(residual(c, flow(S[0]))).toEqual(c)
    // iteration 1: path s a d t, residual capacities 10, 8, 10
    const f1 = augment(flow(S[0]), 'sadt', 8)
    expect([...'sadt'].slice(0, -1).map((u, i) => residual(c, flow(S[0]))[u + 'sadt'[i + 1]])).toEqual([10, 8, 10])
    expect(bottleneck(residual(c, flow(S[0])), 'sadt')).toBe(8)
    expect(f1).toEqual(flow(S[2]))
    // iteration 2: path s a b d t, residual capacities 2, 2, 9, 2 (as on the page augmenting-paths)
    expect(bottleneck(residual(c, f1), 'sabdt')).toBe(2)
    const f2 = augment(f1, 'sabdt', 2)
    expect(f2).toEqual(flow(S[3]))
    // iteration 3: path s b d c t, bottleneck 7; iteration 4: s b a c t, bottleneck 2 (b -> a cancels a -> b)
    expect(bottleneck(residual(c, f2), 'sbdct')).toBe(7)
    const f3 = augment(f2, 'sbdct', 7)
    expect(bottleneck(residual(c, f3), 'sbact')).toBe(2)
    const f4 = augment(f3, 'sbact', 2)
    expect(f4).toEqual(flow(S[4]))
    expect(f4.ab).toBe(0)
    expect(maxFlowValue(S[0], 's', 't').value).toBe(19)
    // every gain is a whole number of at least 1
    expect([8, 2, 7, 2].every(d => Number.isInteger(d) && d >= 1)).toBe(true)
    expect(8 + 2 + 7 + 2).toBe(19)
    expect(S[1].marks.P).toEqual(S[1].edges.filter(e => ['sa', 'ad', 'dt'].includes(name(S[1], e.id))).map(e => '@' + e.id))
  })

  it('bound figure: cut around s has capacity 20, 2 edges leave s, n = 6, C = 10, (n-1)C = 50, nC = 60, 4 iterations', () => {
    const S = steps('a02-ffa-bound')
    expect(S.length).toBe(5)
    const g = S[0]
    isFlow(g)
    const n = g.vertices.length, m = g.edges.length
    expect([n, m]).toEqual([6, 9])
    const C = Math.max(...g.edges.map(e => num(e.data.c)))
    expect(C).toBe(10)
    expect(cutCapacity(g, new Set(['s']))).toBe(20)
    expect(g.edges.filter(e => e.tail[0] === 's').map(e => name(g, e.id))).toEqual(['sa', 'sb'])
    expect(value(g)).toBe(19)
    expect(19).toBeLessThanOrEqual(20)
    expect(maxFlowValue(g, 's', 't').value).toBe(19)
    expect((n - 1) * C).toBe(50)
    expect(n * C).toBe(60)
    expect(S[0].vertices.length - 1).toBe(5)
    expect(S[0].marks.T).toEqual(['a', 'b', 'c', 'd', 't'])
    expect(S[1].marks.cross.length).toBe(2)
    expect(cutCapacity(g, new Set(['s']))).toBeLessThanOrEqual((n - 1) * C)
    // the demo uses 4 iterations, below the bound
    expect(4).toBeLessThanOrEqual((n - 1) * C)
    // the final flow is that of the integrality figure
    expect(flow(g)).toEqual(flow(steps('a02-ffa-integral')[4]))
  })

  it('time figure: G_f2 has 10 edges (at most 2m = 18), P = s b d c t has 4 edges (at most 5) and bottleneck 7; G_f3 has 12 edges', () => {
    const S = steps('a02-ffa-time')
    expect(S.length).toBe(4)
    const I = steps('a02-ffa-integral')
    const c = cap(I[0]), f2 = flow(I[3])
    const res = (g: GraphData) => Object.fromEntries(g.edges.map(e => [name(g, e.id), num(e.data.c)]))
    expect(res(S[0])).toEqual(residual(c, f2))
    expect(S[0].edges.length).toBe(10)
    expect(2 * Object.keys(c).length).toBe(18)
    expect(S[1].marks.P.length).toBe(4)
    expect(bottleneck(res(S[0]), 'sbdct')).toBe(7)
    expect([10, 7, 9, 10]).toEqual([...'sbdct'].slice(0, -1).map((u, i) => res(S[0])[u + 'sbdct'[i + 1]]))
    expect(4).toBeLessThanOrEqual(6 - 1)
    const f3 = augment(f2, 'sbdct', 7)
    expect(res(S[2])).toEqual(residual(c, f3))
    expect(S[2].edges.length).toBe(12)
    // only edges of P and their reverses change; b -> d disappears, three reverse edges appear
    const r2 = residual(c, f2), r3 = residual(c, f3)
    const onP = new Set(['sb', 'bd', 'dc', 'ct', 'bs', 'db', 'cd', 'tc'])
    const changed = [...new Set([...Object.keys(r2), ...Object.keys(r3)])].filter(k => r2[k] !== r3[k])
    expect(changed.every(k => onP.has(k))).toBe(true)
    expect(Object.keys(r2).filter(k => !(k in r3))).toEqual(['bd'])
    expect(Object.keys(r3).filter(k => !(k in r2)).sort()).toEqual(['bs', 'cd', 'tc'])
    // the unchanged edges are the muted ones
    const unchanged = Object.keys(r3).filter(k => r2[k] === r3[k]).sort()
    expect(unchanged).toEqual(['ac', 'as', 'ba', 'da', 'td'])
    expect(S[3].edges.filter(e => e.classes.includes('muted')).map(e => name(S[3], e.id)).sort()).toEqual(unchanged)
    // total time: at most nC = 60 iterations of O(m)
    expect(6 * 10).toBe(60)
  })
})

describe('Edmonds–Karp analysis (a02-eka-*)', () => {
  const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const nm = (g: GraphData) => Object.fromEntries(g.edges.map(e => [name(g, e.id), e]))
  const cap = (g: GraphData, key: string) => Object.fromEntries(g.edges.map(e => [name(g, e.id), num(e.data[key])]))
  // BFS distances from s in a residual graph given as {uv: capacity}
  const dist = (r: Record<string, number>) => {
    const d: Record<string, number> = { s: 0 }, q = ['s']
    while (q.length) { const u = q.shift()!; for (const v of 'sabcdt') if (r[u + v] > 0 && !(v in d)) { d[v] = d[u] + 1; q.push(v) } }
    return d
  }
  const residual = (c: Record<string, number>, f: Record<string, number>) => {
    const r: Record<string, number> = {}
    for (const k of Object.keys(c)) { if (c[k] > f[k]) r[k] = c[k] - f[k]; if (f[k] > 0) r[k[1] + k[0]] = f[k] }
    return r
  }
  const augment = (f: Record<string, number>, path: string) => {
    const r = residual(c0, f)
    const d = Math.min(...[...path].slice(0, -1).map((u, i) => r[u + path[i + 1]]))
    const g = { ...f }
    for (let i = 0; i + 1 < path.length; i++) { const e = path[i] + path[i + 1]; if (e in g) g[e] += d; else g[path[i + 1] + path[i]] -= d }
    return { f: g, d }
  }
  const M = steps('a02-eka-monotone')
  const c0 = cap(M[0], 'c')
  const f0 = Object.fromEntries(Object.keys(c0).map(k => [k, 0]))

  it('monotone figure: levels 0,1,1,2,2,3; P = sadt has bottleneck 8; distances stay the same; reverse edges fall one level', () => {
    expect(M.length).toBe(6)
    expect(Object.keys(c0).length).toBe(9)
    const d0 = dist(residual(c0, f0))
    expect(d0).toEqual({ s: 0, a: 1, b: 1, c: 2, d: 2, t: 3 })
    // (a,b) stays on level 1: d(b) = 1 <= d(a) + 1 = 2
    expect(d0.b).toBe(1)
    const { f: f1, d } = augment(f0, 'sadt')
    expect(d).toBe(8)
    const r1 = residual(c0, f1)
    // a -> d is saturated and gone; s -> a and d -> t drop to 2; reverse edges have capacity 8
    expect('ad' in r1).toBe(false)
    expect([r1.sa, r1.dt, r1.as, r1.da, r1.td]).toEqual([2, 2, 8, 8, 8])
    expect(Object.keys(cap(M[2], 'c')).sort()).toEqual(Object.keys(r1).filter(k => !['as', 'da', 'td'].includes(k)).sort())
    expect([cap(M[2], 'c').sa, cap(M[2], 'c').dt]).toEqual([2, 2])
    // new edges fall exactly one level of d_f
    for (const k of ['as', 'da', 'td']) expect(d0[k[1]]).toBe(d0[k[0]] - 1)
    // every edge of G_f' satisfies d_f(y) <= d_f(x) + 1
    for (const k of Object.keys(r1)) expect(d0[k[1]]).toBeLessThanOrEqual(d0[k[0]] + 1)
    // distances after augmenting: no vertex got closer; here they are unchanged; shortest s-t path is s b d t
    const d1 = dist(r1)
    for (const v of 'sabcdt') expect(d1[v]).toBeGreaterThanOrEqual(d0[v])
    expect(d1).toEqual(d0)
    expect(['sb', 'bd', 'dt'].every(k => r1[k] > 0)).toBe(true)
    // figure content
    expect(M[1].marks.P.length).toBe(3)
    expect(Object.keys(nm(M[3])).filter(k => !(k in r1)).length).toBe(0)
    expect(M[3].marks.new.length).toBe(3)
    expect(M[5].edges.filter(e => e.classes.includes('path')).map(e => name(M[5], e.id)).sort()).toEqual(['bd', 'dt', 'sb'])
  })

  it('phase figure: L has 7 of 9 edges, three augmentations (8, 2, 2) remove ad, dt, sa; then the shortest path has length 4', () => {
    const P = steps('a02-eka-phase')
    expect(P.length).toBe(5)
    expect(cap(P[0], 'c')).toEqual(c0)
    const d0 = dist(residual(c0, f0))
    expect(d0.t).toBe(3)
    const up = Object.keys(c0).filter(k => d0[k[1]] === d0[k[0]] + 1)
    expect(up.length).toBe(7)
    expect(Object.keys(c0).filter(k => !up.includes(k)).sort()).toEqual(['ab', 'dc'])
    expect(P[0].edges.filter(e => e.classes.includes('muted')).map(e => name(P[0], e.id)).sort()).toEqual(['ab', 'dc'])
    expect(Object.keys(c0).length).toBe(9)
    // new reverse edges of the first augmentation all fall one level
    let st = augment(f0, 'sadt'); expect(st.d).toBe(8)
    const r1 = residual(c0, st.f)
    for (const k of ['as', 'da', 'td']) expect(d0[k[1]]).toBe(d0[k[0]] - 1)
    expect(P[1].marks.new.length).toBe(3)
    // second path s b d t: bottleneck 2, uses edges of L only
    expect(['sb', 'bd', 'dt'].every(k => up.includes(k))).toBe(true)
    expect([r1.sb, r1.bd, r1.dt]).toEqual([10, 9, 2])
    const s2 = augment(st.f, 'sbdt'); expect(s2.d).toBe(2)
    // third path s a c t: bottleneck 2, edges of L only
    expect(['sa', 'ac', 'ct'].every(k => up.includes(k))).toBe(true)
    const s3 = augment(s2.f, 'sact'); expect(s3.d).toBe(2)
    // bottleneck edges ad, dt, sa are gone from the residual graph
    const r3 = residual(c0, s3.f)
    expect(['ad', 'dt', 'sa'].filter(k => k in r3)).toEqual([])
    expect(['sb', 'bd', 'ac', 'ct'].every(k => k in r3)).toBe(true)
    // no path of length 3 is left, the shortest path has length 4: s b d c t
    const d3 = dist(r3)
    expect(d3.t).toBe(4)
    expect(['sb', 'bd', 'dc', 'ct'].every(k => k in r3)).toBe(true)
    expect(P[4].edges.filter(e => e.classes.includes('path')).map(e => name(P[4], e.id)).sort()).toEqual(['bd', 'ct', 'dc', 'sb'])
    // L has at most m = 9 edges; 3 augmentations <= 7 <= 9
    expect(3).toBeLessThanOrEqual(up.length)
    expect(up.length).toBeLessThanOrEqual(9)
    // the figure after the removals
    expect(P[3].edges.map(e => name(P[3], e.id)).sort()).toEqual(['ab', 'ac', 'as', 'bd', 'ct', 'da', 'dc', 'sb', 'td'])
  })

  it('time figure: m = 9, n = 6, m(n-1) = 45; run has 4 augmentations of lengths 3,3,3,4 and values 12 then 19', () => {
    const T = steps('a02-eka-time')
    expect(T.length).toBe(4)
    expect(T[0].vertices.length).toBe(6)
    expect(T[0].edges.length).toBe(9)
    expect(T[3].vertices.filter(v => v.classes.includes('visited')).length).toBe(6)
    expect(9 * (6 - 1)).toBe(45)
    let f = f0
    const lens: number[] = []
    for (const p of ['sadt', 'sbdt', 'sact', 'sbdct']) {
      lens.push(dist(residual(c0, f)).t)
      f = augment(f, p).f
      if (p === 'sact') expect(cap(T[0], 'f')).toEqual(f)
    }
    expect(lens).toEqual([3, 3, 3, 4])
    expect(cap(T[1], 'f')).toEqual(f)
    expect(dist(residual(c0, f)).t).toBeUndefined()
    expect(f.sa + f.sb).toBe(19)
    expect(maxFlowValue(T[0], 's', 't').value).toBe(19)
    expect(4).toBeLessThanOrEqual(45)
    expect(T[0].edges.filter(e => e.classes.includes('path')).length).toBe(7)
    expect(cap(T[0], 'f').sa + cap(T[0], 'f').sb).toBe(12)
    expect(T[2].edges.filter(e => e.classes.includes('bold')).length).toBe(8)
  })
})

describe('Blocking flows (a02-blk-*)', () => {
  const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const key = (g: GraphData, id: string) => name(g, id)
  const cap = (g: GraphData, k: string) => Object.fromEntries(g.edges.map(e => [key(g, e.id), num(e.data[k])]))
  const marked = (g: GraphData, m: string) => (g.marks[m] ?? []).map(String)
  // the lecture network (a02-blocking-flow): capacities, no flow
  const c0: Record<string, number> = { sp: 9, sq: 4, pr: 5, rq: 9, rt: 3, qx: 5, xt: 9 }
  const V = 'spqrxt'
  const dist = (r: Record<string, number>) => {
    const d: Record<string, number> = { s: 0 }, q = ['s']
    while (q.length) { const u = q.shift()!; for (const v of V) if (r[u + v] > 0 && !(v in d)) { d[v] = d[u] + 1; q.push(v) } }
    return d
  }
  const residual = (f: Record<string, number>) => {
    const r: Record<string, number> = {}
    for (const k of Object.keys(c0)) { if (c0[k] > f[k]) r[k] = c0[k] - f[k]; if (f[k] > 0) r[k[1] + k[0]] = f[k] }
    return r
  }
  const f0 = Object.fromEntries(Object.keys(c0).map(k => [k, 0]))
  // the procedure of alg:dinic-blocking on the level graph of residual r; returns the flow and the step counts
  const blocking = (r: Record<string, number>) => {
    const d = dist(r)
    const res = Object.fromEntries(Object.keys(r).filter(k => d[k[1]] === d[k[0]] + 1).map(k => [k, r[k]]))
    const L = new Set(Object.keys(res))
    const f: Record<string, number> = {}
    const cnt = { aug: 0, ret: 0, adv: 0, runs: [] as number[], bottlenecks: [] as number[], deleted: [] as string[] }
    let v = 's', P: string[] = [], run = 0
    for (;;) {
      if (v === 't') {
        const b = Math.min(...P.map(e => res[e] - (f[e] ?? 0)))
        for (const e of P) f[e] = (f[e] ?? 0) + b
        cnt.aug++; cnt.runs.push(run); run = 0; cnt.bottlenecks.push(b)
        for (const e of [...L]) if ((f[e] ?? 0) === res[e]) { L.delete(e); cnt.deleted.push(e) }
        v = 's'; P = []
      } else {
        const out = [...L].find(e => e[0] === v)
        if (out) { P.push(out); v = out[1]; cnt.adv++; run++ } else {
          if (v === 's') break
          for (const e of [...L]) if (e[0] === v || e[1] === v) { L.delete(e); cnt.deleted.push(e) }
          cnt.deleted.push(v)
          cnt.ret++; cnt.runs.push(run); run = 0
          const last = P.pop()!; v = last[0]
        }
      }
    }
    return { f, res, d, cnt, L }
  }

  it('correctness figure: L has 6 edges (levels s0 p1 q1 r2 x2 t3, rq excluded), augmentations 3 and 4 saturate rt and sq, then the loop stops at s', () => {
    const S = steps('a02-blk-correct')
    expect(S.length).toBe(6)
    const d = dist(residual(f0))
    expect(d).toEqual({ s: 0, p: 1, q: 1, r: 2, x: 2, t: 3 })
    const b = blocking(residual(f0))
    expect([...b.L].sort()).toEqual(['qx', 'xt'])  // left in L, but no edge leaves s
    expect(Object.keys(b.res).sort()).toEqual(['pr', 'qx', 'rt', 'sp', 'sq', 'xt'])
    expect(Object.keys(c0).filter(k => !(k in b.res))).toEqual(['rq'])
    expect(cap(S[0], 'c')).toEqual(b.res)
    expect(b.cnt.bottlenecks).toEqual([3, 4])
    expect(b.cnt.deleted.slice(0, 1)).toEqual(['rt'])
    expect(b.f).toEqual({ sp: 3, pr: 3, rt: 3, sq: 4, qx: 4, xt: 4 })
    expect(cap(S[1], 'f')).toEqual({ sp: 3, sq: 0, pr: 3, rt: 3, qx: 0, xt: 0 })
    expect(cap(S[4], 'f')).toEqual(b.f)
    // two open paths at the start, none at the end: every s-t path of L has a saturated edge
    expect(['sp', 'pr', 'rt'].some(e => b.f[e] === b.res[e])).toBe(true)
    expect(['sq', 'qx', 'xt'].some(e => b.f[e] === b.res[e])).toBe(true)
    expect(b.f.sp + b.f.sq).toBe(7)
    expect(marked(S[0], 'open').length).toBe(6)
    // deleted: rt (saturated), r with pr, p with sp, sq (saturated)
    expect(S[1].edges.filter(e => e.classes.includes('muted')).map(e => key(S[1], e.id))).toEqual(['rt'])
    expect(S[2].vertices.filter(v => v.classes.includes('muted')).map(v => v.id)).toEqual(['r'])
    expect(S[3].vertices.filter(v => v.classes.includes('muted')).map(v => v.id).sort()).toEqual(['p', 'r'])
    expect(S[4].edges.filter(e => e.classes.includes('muted')).map(e => key(S[4], e.id)).sort()).toEqual(['pr', 'rt', 'sp', 'sq'])
    expect(S[5].vertices.filter(v => v.classes.includes('current')).map(v => v.id)).toEqual(['s'])
  })

  it('time figure: 2 augmentations, 2 retreats, 8 advances in runs 3,2,0,3; n = 6, the path s q x t has 3 edges', () => {
    const S = steps('a02-blk-time')
    expect(S.length).toBe(5)
    const b = blocking(residual(f0))
    expect(b.cnt.aug).toBe(2)
    expect(b.cnt.ret).toBe(2)
    expect(b.cnt.adv).toBe(8)
    expect(b.cnt.runs).toEqual([3, 2, 0, 3])
    expect(b.cnt.runs.every(r => r <= 6 - 1)).toBe(true)
    expect(V.length).toBe(6)
    expect(Object.keys(b.res).length).toBe(6)
    expect(marked(S[0], 'aug').length).toBe(2)
    expect(S[0].edges.filter(e => e.classes.includes('muted')).map(e => key(S[0], e.id)).sort()).toEqual(['rt', 'sq'])
    expect(S[1].vertices.filter(v => v.classes.includes('muted')).map(v => v.id).sort()).toEqual(['p', 'r'])
    expect(marked(S[1], 'dead').length).toBe(2)
    expect(marked(S[2], 'run').length).toBe(3)
    expect(marked(S[3], 'P').length).toBe(3)
    expect(S[4].vertices.filter(v => v.classes.includes('visited')).length).toBe(6)
  })

  it('dinic figure: phase 1 (distance 3) gives 7, phase 2 (distance 5, path s p r q x t, 1 unit) gives 8 = max flow; then no path; m = 7, n = 6', () => {
    const S = steps('a02-blk-dinic')
    expect(S.length).toBe(4)
    expect(cap(S[0], 'c')).toEqual(c0)
    expect(Object.keys(c0).length).toBe(7)
    expect(V.length).toBe(6)
    const r0 = residual(f0)
    const d0 = dist(r0)
    expect(d0.t).toBe(3)
    // rq does not climb a level of phase 1; the other six edges do
    expect(Object.keys(c0).filter(k => d0[k[1]] !== d0[k[0]] + 1)).toEqual(['rq'])
    const b1 = blocking(r0)
    const f1 = { ...f0 }; for (const k of Object.keys(b1.f)) f1[k] += b1.f[k]
    expect(f1.sp + f1.sq).toBe(7)
    expect(cap(S[0], 'f')).toEqual(f1)
    expect(S[0].edges.filter(e => e.classes.includes('bold')).length).toBe(6)
    // phase 2
    const r1 = residual(f1)
    const d1 = dist(r1)
    expect(d1.t).toBe(5)
    const b2 = blocking(r1)
    expect(b2.cnt.aug).toBe(1)
    expect(b2.cnt.bottlenecks).toEqual([1])
    expect(Object.keys(b2.f).sort()).toEqual(['pr', 'qx', 'rq', 'sp', 'xt'])
    const f2 = { ...f1 }; for (const k of Object.keys(b2.f)) f2[k] += b2.f[k]
    expect(f2).toEqual({ sp: 4, sq: 4, pr: 4, rq: 1, rt: 3, qx: 5, xt: 5 })
    expect(cap(S[2], 'f')).toEqual({ ...f2, rt: 3, sq: 4 })
    expect(f2.sp + f2.sq).toBe(8)
    expect(dist(residual(f2)).t).toBeUndefined()
    const g = S[0]
    expect(maxFlowValue(g, 's', 't').value).toBe(8)
    // 2 phases of at most n = 6
    expect(2).toBeLessThanOrEqual(6)
    expect(marked(S[2], 'P2').length).toBe(5)
    expect(S[3].edges.filter(e => e.classes.includes('bold')).length).toBe(7)
  })
})

describe('MPM proofs (a02-mpm-count, a02-mpm-phases)', () => {
  const steps = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const key = (g: GraphData, id: string) => name(g, id)
  const val = (g: GraphData, k: string) => Object.fromEntries(g.edges.map(e => [key(g, e.id), num(e.data[k])]))
  const marked = (g: GraphData, m: string) => (g.marks[m] ?? []).map(String)
  // the lecture network (a02-network): capacities
  const c0: Record<string, number> = { sa: 10, sb: 10, ab: 2, ac: 4, ad: 8, bd: 9, dc: 9, ct: 10, dt: 10 }
  const V = 'sabcdt'
  const dist = (r: Record<string, number>) => {
    const d: Record<string, number> = { s: 0 }, q = ['s']
    while (q.length) { const u = q.shift()!; for (const v of V) if (r[u + v] > 0 && !(v in d)) { d[v] = d[u] + 1; q.push(v) } }
    return d
  }
  const residual = (f: Record<string, number>) => {
    const r: Record<string, number> = {}
    for (const k of Object.keys(c0)) { r[k] = (r[k] ?? 0) + c0[k] - f[k]; const b = k[1] + k[0]; r[b] = (r[b] ?? 0) + f[k] }
    return r
  }
  // MPM on the level graph of a residual graph; follows the written algorithm (min vertex capacity, push, pull, erase)
  const mpm = (r: Record<string, number>) => {
    const d = dist(r)
    const L: Record<string, number> = {}
    for (const k of Object.keys(r)) if (r[k] > 0 && d[k[1]] === d[k[0]] + 1) L[k] = r[k]
    const flow: Record<string, number> = {}
    const alive = new Set(V)
    const log: { v: string; d: number; caps: Record<string, number>; partial: string[]; saturated: string[] }[] = []
    const live = () => Object.keys(L).filter(k => L[k] > 0 && alive.has(k[0]) && alive.has(k[1]))
    const prune = () => {
      for (let ch = true; ch;) {
        ch = false
        for (const v of [...alive]) {
          if (v === 's' || v === 't') continue
          const E = live()
          if (!E.some(k => k[1] === v) || !E.some(k => k[0] === v)) { alive.delete(v); ch = true }
        }
      }
    }
    const capOf = (v: string) => {
      const E = live()
      const i = E.filter(k => k[1] === v).reduce((z, k) => z + L[k], 0)
      const o = E.filter(k => k[0] === v).reduce((z, k) => z + L[k], 0)
      return v === 's' ? o : v === 't' ? i : Math.min(i, o)
    }
    prune()
    const eraseOrder: string[] = []
    while (alive.has('s') && alive.has('t') && live().length) {
      const caps = Object.fromEntries([...alive].map(v => [v, capOf(v)]))
      const v = [...alive].sort((a, b) => caps[a] - caps[b])[0]
      const dd = caps[v]
      const before = { ...L }
      const move = (dir: 1 | -1) => {
        const ex: Record<string, number> = { [v]: dd }
        const order = [...alive].sort((a, b) => dir * (d[a] - d[b]))
        for (const u of order) {
          let x = ex[u] ?? 0
          if (x <= 0 || (dir === 1 && u === 't') || (dir === -1 && u === 's')) continue
          for (const k of live()) {
            if (x <= 0) break
            const from = dir === 1 ? k[0] : k[1], to = dir === 1 ? k[1] : k[0]
            if (from !== u) continue
            const a = Math.min(x, L[k])
            L[k] -= a; x -= a; flow[k] = (flow[k] ?? 0) + a
            ex[to] = (ex[to] ?? 0) + a
          }
        }
      }
      move(1); move(-1)
      const touched = Object.keys(L).filter(k => before[k] !== L[k])
      log.push({ v, d: dd, caps, partial: touched.filter(k => L[k] > 0), saturated: touched.filter(k => L[k] === 0) })
      alive.delete(v); eraseOrder.push(v)
      prune()
    }
    return { L, flow, log, eraseOrder, d, value: (flow.sa ?? 0) + (flow.sb ?? 0) }
  }
  const zero = Object.fromEntries(Object.keys(c0).map(k => [k, 0]))
  const add = (f: Record<string, number>, g: Record<string, number>) => { const h = { ...f }; for (const k of Object.keys(g)) h[k] = (h[k] ?? 0) + g[k]; return h }
  const p1 = mpm(residual(zero))

  it('count figure: L has 7 edges (ab, dc dropped), 6 vertices, 9 edges in G', () => {
    const S = steps('a02-mpm-count')
    expect(S.length).toBe(8)
    expect(Object.keys(c0).length).toBe(9)
    expect(p1.d).toEqual({ s: 0, a: 1, b: 1, c: 2, d: 2, t: 3 })
    expect(Object.keys(c0).filter(k => p1.d[k[1]] !== p1.d[k[0]] + 1).sort()).toEqual(['ab', 'dc'])
    expect(S[0].edges.length).toBe(7)
    expect(marked(S[0], 'L').length).toBe(7)
    expect(S[0].vertices.length).toBe(6)
    expect(6 * 6).toBe(36)
    expect(9).toBeLessThanOrEqual(36)
  })
  it('count figure: vertex capacities at the start are c 4, a 10, b 9, d 10, s 20, t 20', () => {
    expect(p1.log[0].caps).toEqual({ s: 20, a: 10, b: 9, c: 4, d: 10, t: 20 })
  })
  it('count figure: three iterations erase c, a, d with capacities 4, 6, 4 (d tied with t); value 14', () => {
    const S = steps('a02-mpm-count')
    expect(p1.eraseOrder).toEqual(['c', 'a', 'd'])
    expect(p1.log.map(l => l.d)).toEqual([4, 6, 4])
    expect(p1.log[1].caps.a).toBe(6)
    expect(p1.log[2].caps.d).toBe(4)
    expect(p1.log[2].caps.t).toBe(4)
    expect(p1.value).toBe(14)
    expect(6 - 1).toBeGreaterThanOrEqual(p1.log.length)
    expect(marked(S[1], 'erased').sort()).toEqual(['a', 'c', 'd'])
    expect(marked(S[2], 'mins').sort()).toEqual(['a', 'c', 'd'])
    expect(S[1].vertices.filter(v => v.classes.includes('muted')).map(v => v.id).sort()).toEqual(['a', 'c', 'd'])
  })
  it('count figure: final flow labels equal the MPM run; sa, ac, dt saturated; sb, ad, bd, ct partly used', () => {
    const S = steps('a02-mpm-count')
    expect(p1.flow).toEqual({ ac: 4, ct: 4, sa: 10, ad: 6, dt: 10, bd: 4, sb: 4 })
    expect(val(S[1], 'f')).toEqual({ sa: 10, sb: 4, ac: 4, ad: 6, bd: 4, ct: 4, dt: 10 })
    const L0 = { sa: 10, sb: 10, ac: 4, ad: 8, bd: 9, ct: 10, dt: 10 } as Record<string, number>
    expect(val(S[0], 'c')).toEqual(L0)
    const sat = Object.keys(L0).filter(k => p1.flow[k] === L0[k]).sort()
    const part = Object.keys(L0).filter(k => p1.flow[k] > 0 && p1.flow[k] < L0[k]).sort()
    expect(sat).toEqual(['ac', 'dt', 'sa'])
    expect(part).toEqual(['ad', 'bd', 'ct', 'sb'])
    expect(marked(S[3], 'sat').length).toBe(3)
    expect(marked(S[4], 'part').length).toBe(4)
    // push from a (iteration 2): a->d is the only partly used edge, 6 of 8; sa is then saturated
    expect(p1.log[1].v).toBe('a')
    expect(p1.log[1].partial).toContain('ad')
    expect(p1.flow.ad).toBe(6)
    expect(L0.ad).toBe(8)
    // at most one partly used outgoing edge per vertex at the end
    for (const v of V) expect(part.filter(k => k[0] === v).length).toBeLessThanOrEqual(1)
  })
  it('count figure: capacity of d drops from 10 to 4 in the iteration for a', () => {
    expect(p1.log[1].caps.d).toBe(10)
    expect(p1.log[2].caps.d).toBe(4)
    const S = steps('a02-mpm-count')
    expect(marked(S[5], 'key')).toEqual(['d'])
  })

  const f1 = add(zero, p1.flow)
  const r1 = residual(f1 as any)
  it('phases figure: phase 1 distance 3 value 14; phase 2 distance 4 along s b d c t adds 5, value 19, then t unreachable', () => {
    const S = steps('a02-mpm-phases')
    expect(S.length).toBe(4)
    expect(val(S[0], 'c')).toEqual(c0)
    expect(val(S[0], 'f')).toEqual({ sa: 10, sb: 4, ac: 4, ad: 6, bd: 4, ct: 4, dt: 10, ab: 0, dc: 0 })
    expect(p1.d.t).toBe(3)
    expect(p1.value).toBe(14)
    const d1 = dist(r1)
    expect(d1.t).toBe(4)
    const p2 = mpm(r1)
    expect(p2.value).toBe(5)
    expect(Object.keys(p2.flow).sort()).toEqual(['bd', 'dc', 'ct', 'sb'].sort())
    expect(marked(S[1], 'L2').length).toBe(4)
    expect(marked(S[2], 'P2').length).toBe(4)
    const f2 = add(f1, p2.flow)
    expect(f2.sa + f2.sb).toBe(19)
    expect(val(S[2], 'f')).toEqual({ sa: 10, sb: 9, ac: 4, ad: 6, bd: 9, ct: 9, dt: 10, ab: 0, dc: 5 })
    expect(dist(residual(f2 as any)).t).toBeUndefined()
    expect(maxFlowValue(fig('a02-network'), 's', 't').value).toBe(19)
    // L2 also has the dead end d->a (a lies on no s-t path); the s-t path s b d c t is the only one
    expect(Object.keys(r1).filter(k => r1[k] > 0 && d1[k[1]] === d1[k[0]] + 1).sort()).toEqual(['bd', 'ct', 'da', 'dc', 'sb'])
    expect(d1).toEqual({ s: 0, b: 1, d: 2, c: 3, a: 3, t: 4 })
    // 2 phases of at most n = 6; m = 9 <= n^2 = 36
    expect(2).toBeLessThanOrEqual(6)
    expect(9).toBeLessThanOrEqual(36)
    expect(S[1].edges.filter(e => e.classes.includes('path')).length).toBe(4)
    expect(S[0].edges.filter(e => e.classes.includes('muted')).map(e => key(S[0], e.id)).sort()).toEqual(['ab', 'dc'])
  })
})

describe('Unit-capacity networks (a02-unit-levels, a02-unit-phases, a02-unit-residual)', () => {
  const stepsOf = (id: string) => { const f = index.figureById.get(id)!; const d = parseGraph(f.source, f.info); expect(d.errors).toEqual([]); return d.panels[0].steps.map(s => s.graph) }
  const marked = (g: GraphData, m: string) => (g.marks[m] ?? []).map(String)
  const ek = (g: GraphData, id: string) => name(g, id)
  const edgesOf = (g: GraphData) => g.edges.map(e => e.tail[0] + e.head[0])
  const bfsDist = (es: string[], s: string) => {
    const d: Record<string, number> = { [s]: 0 }, q = [s]
    while (q.length) { const u = q.shift()!; for (const e of es) if (e[0] === u && !(e[1] in d)) { d[e[1]] = d[u] + 1; q.push(e[1]) } }
    return d
  }
  // Dinic on unit capacities (net flow); returns per phase the distance and the units pushed, and the final flow
  const dinicRun = (es: string[], V: string, s: string, t: string) => {
    const f: Record<string, number> = Object.fromEntries(es.map(e => [e, 0]))
    const resid = () => { const r: string[] = []; for (const e of es) { if (f[e] === 0) r.push(e); else r.push(e[1] + e[0]) } return r }
    const phases: { dist: number; push: number; edges: string[] }[] = []
    for (;;) {
      const R = resid(), d = bfsDist(R, s)
      if (!(t in d)) break
      let push = 0; const used: string[] = []
      const dead = new Set<string>()
      const dfs = (u: string): string[] | undefined => {
        if (u === t) return []
        for (const e of es) {
          const fwd = f[e] === 0, a = fwd ? e[0] : e[1], b = fwd ? e[1] : e[0]
          if (a !== u || d[b] !== d[u] + 1 || dead.has(e + (fwd ? 'f' : 'r'))) continue
          const rest = dfs(b)
          if (rest) return [e + (fwd ? 'f' : 'r'), ...rest]
          dead.add(e + (fwd ? 'f' : 'r'))
        }
        return undefined
      }
      for (let p = dfs(s); p; p = dfs(s)) {
        for (const x of p) { const e = x.slice(0, 2); f[e] = x[2] === 'f' ? 1 : 0; used.push(e) }
        push++
      }
      phases.push({ dist: d[t], push, edges: used })
    }
    return { phases, f, V }
  }

  it('levels figure: 6 vertices, 9 edges, layers s | a b | c d | t, distance l = 3', () => {
    const S = stepsOf('a02-unit-levels')
    expect(S.length).toBe(5)
    const es = edgesOf(S[0])
    expect(es.length).toBe(9)
    expect(S[0].vertices.length).toBe(6)
    const d = bfsDist(es, 's')
    expect(d).toEqual({ s: 0, a: 1, b: 1, c: 2, d: 2, t: 3 })
    expect(marked(S[0], 'S1').sort()).toEqual(['a', 'b', 's'])
    expect(marked(S[0], 'L1').sort()).toEqual(['a', 'b'])
    expect(marked(S[0], 'L2').sort()).toEqual(['c', 'd'])
    // no antiparallel edges
    for (const e of es) expect(es).not.toContain(e[1] + e[0])
  })
  it('levels figure: edges leaving S_1 are ac, ad, bd (3); cb enters, ab stays inside', () => {
    const S = stepsOf('a02-unit-levels')
    const es = edgesOf(S[0]), d = bfsDist(es, 's')
    const S1 = new Set(['s', 'a', 'b'])
    const leaving = es.filter(e => S1.has(e[0]) && !S1.has(e[1]))
    expect(leaving.sort()).toEqual(['ac', 'ad', 'bd'])
    expect(leaving.every(e => d[e[0]] === 1 && d[e[1]] === 2)).toBe(true)
    expect(marked(S[0], 'cut1').length).toBe(3)
    expect(S[1].edges.filter(e => e.classes.includes('cut')).map(e => ek(S[1], e.id)).sort()).toEqual(['ac', 'ad', 'bd'])
    expect(S[1].edges.filter(e => e.classes.includes('muted')).map(e => ek(S[1], e.id)).sort()).toEqual(['ab', 'cb'])
    // every edge raises the distance by at most one
    expect(es.every(e => d[e[1]] <= d[e[0]] + 1)).toBe(true)
  })
  it('levels figure: maximum flow 2 along s a c t and s b d t; sets of 2, 3, 2 edges; 3 * 2 = 6 <= 9', () => {
    const S = stepsOf('a02-unit-levels')
    const es = edgesOf(S[0])
    const run = dinicRun(es, 'sabcdt', 's', 't')
    expect(run.phases.reduce((z, p) => z + p.push, 0)).toBe(2)
    expect(marked(S[0], 'flow').length).toBe(6)
    expect(S[2].edges.filter(e => e.classes.includes('path')).map(e => ek(S[2], e.id)).sort()).toEqual(['ac', 'bd', 'ct', 'dt', 'sa', 'sb'])
    const sets = [0, 1, 2].map(i => es.filter(e => bfsDist(es, 's')[e[0]] === i && bfsDist(es, 's')[e[1]] === i + 1))
    expect(sets.map(x => x.length)).toEqual([2, 3, 2])
    expect(sets.flat().length).toBe(7)
    expect(new Set(sets.flat()).size).toBe(7)
    expect(3 * 2).toBe(6)
    expect(6).toBeLessThanOrEqual(9)
    expect(es.filter(e => !sets.flat().includes(e)).sort()).toEqual(['ab', 'cb'])
    const g = S[3]
    expect(g.edges.filter(e => e.classes.includes('color5')).length).toBe(2)
    expect(g.edges.filter(e => e.classes.includes('color6')).length).toBe(3)
    expect(g.edges.filter(e => e.classes.includes('color7')).length).toBe(2)
    expect(S[4].edges.filter(e => e.classes.includes('dashed')).map(e => ek(S[4], e.id)).sort()).toEqual(['ab', 'cb'])
    // maximum flow = minimum cut: the cut out of s has 2 edges
    expect(es.filter(e => e[0] === 's').length).toBe(2)
  })
  it('phases figure: m = 9, sqrt(m) = 3; Dinic needs 3 phases at distances 1, 2, 4 pushing 1, 2, 1; value 4 > 3', () => {
    const S = stepsOf('a02-unit-phases')
    expect(S.length).toBe(3)
    const es = edgesOf(S[0])
    expect(es.length).toBe(9)
    expect(Math.sqrt(9)).toBe(3)
    for (const e of es) expect(es).not.toContain(e[1] + e[0])
    const run = dinicRun(es, 'sabcdt', 's', 't')
    expect(run.phases.map(p => p.dist)).toEqual([1, 2, 4])
    expect(run.phases.map(p => p.push)).toEqual([1, 2, 1])
    expect(run.phases.reduce((z, p) => z + p.push, 0)).toBe(4)
    expect(4).toBeGreaterThan(3)
    expect(Object.values(run.f).every(x => x === 1)).toBe(true) // every edge carries a unit at the end
    expect(marked(S[0], 'ph1').length).toBe(1)
    expect(marked(S[0], 'ph2').length).toBe(4)
    expect(marked(S[0], 'ph3').length).toBe(4)
    expect(marked(S[0], 'fstar').map(id => ek(S[0], id.replace(/^@/, ''))).sort()).toEqual(['sa', 'sb', 'sc', 'st'])
    expect(es.filter(e => e[0] === 's').length).toBe(4) // value of f* = edges out of s = 4
    // connected, so n - 1 <= m
    expect(S[0].vertices.length - 1).toBeLessThanOrEqual(9)
    // the distance sequence 1, 2, 4 starts at 1 and strictly increases
    expect(bfsDist(es, 's').t).toBe(1)
  })
  it('residual figure: after 2 phases f has value 3, G_f has 9 edges, distance 4 along s b c d t, f\' = 1 = 4 - 3', () => {
    const S = stepsOf('a02-unit-residual')
    expect(S.length).toBe(9)
    const es = edgesOf(S[0])
    const run = dinicRun(es, 'sabcdt', 's', 't')
    const f2: Record<string, number> = Object.fromEntries(es.map(e => [e, 0]))
    for (const p of run.phases.slice(0, 2)) for (const e of p.edges) f2[e] = 1
    expect(Object.entries(f2).filter(([, v]) => v === 1).map(([k]) => k).sort()).toEqual(['at', 'ct', 'sa', 'sc', 'st'])
    expect(S[0].edges.filter(e => e.classes.includes('path')).map(e => ek(S[0], e.id)).sort()).toEqual(['at', 'ct', 'sa', 'sc', 'st'])
    const Gf = es.map(e => (f2[e] === 0 ? e : e[1] + e[0]))
    expect(Gf.length).toBe(9)
    expect(new Set(Gf).size).toBe(9)
    for (const e of Gf) expect(Gf).not.toContain(e[1] + e[0]) // no antiparallel edge in G_f
    expect(bfsDist(Gf, 's').t).toBe(4)
    expect(bfsDist(es, 's').t).toBe(1)
    expect(4).toBeGreaterThan(3)
    expect(Math.floor(9 / 4)).toBe(2)
    expect(9 / 3).toBe(3)
    // flow of value 1 left; f* - f is 1 on sb bc cd dt
    expect(Object.entries(f2).filter(([, v]) => v === 0).map(([k]) => k).sort()).toEqual(['bc', 'cd', 'dt', 'sb'])
    expect(4 - 3).toBe(1)
    // figure after step 2 shows G_f: forward edges sb bc cd dt, reverse edges ts, as, ta, cs, tc
    expect(S[1].edges.map(e => ek(S[1], e.id)).sort()).toEqual([...Gf].sort())
    expect(marked(S[1], 'rev').length).toBe(5)
    expect(marked(S[1], 'fwd').length).toBe(4)
    // remaining: one phase in G (distance 4), 2 phases done, at most 2 * 3 = 6
    expect(run.phases.length - 2).toBe(1)
    expect(2 * 3).toBe(6)
    expect(Gf.filter(e => (e === 'sb' || e === 'bc' || e === 'cd' || e === 'dt')).length).toBe(4)
  })
  it('global-minimum-cuts walkthroughs: f(a, t) = 18, 13, 13, 13, 17 for t = b..f, lambda = 13 reached only by {c, d, e}; U = {a, b} has capacity 17 = f(a, f)', () => {
    const g = fig('a03-network')
    const sig = (h: GraphData) => h.edges.map(e => [e.tail[0], e.head[0]].sort().join('') + num(e.data.c)).sort().join()
    const t = (id: string) => index.figureById.get(id)!
    for (const id of ['a03-gmc-lower', 'a03-gmc-upper']) expect(sig(fig(id))).toBe(sig(g))
    // a03-gmc-time: undirected base graph is G; its step 1 replaces af by two arcs of capacity 8
    expect(sig(fig('a03-gmc-time'))).toBe(sig(g))
    const steps = (id: string) => parseGraph(t(id).source, t(id).info).panels[0].steps
    const arcs = steps('a03-gmc-time')[0].graph.edges.filter(e => e.directed)
    expect(arcs.map(e => e.tail[0] + e.head[0] + num(e.data.c)).sort()).toEqual(['af8', 'fa8'])
    expect(g.vertices.length).toBe(6)
    expect(g.vertices.length - 1).toBe(5)
    const f = (p: string, q: string) => minSTCut(g, p, q).value
    const vals = ['b', 'c', 'd', 'e', 'f'].map(q => f('a', q))
    expect(vals).toEqual([18, 13, 13, 13, 17])
    expect(Math.min(...vals)).toBe(13)
    expect(globalMinCut(g).value).toBe(13)
    const V = g.vertices.map(v => v.id)
    const cap = (S: string[]) => cutCapacity(g, new Set(S))
    const subsets: string[][] = []
    for (let m = 1; m < (1 << V.length) - 1; m++) subsets.push(V.filter((_, i) => (m >> i) & 1))
    // the minimum cut is unique: {c, d, e} against {a, b, f}
    expect(subsets.filter(S => cap(S) === 13).map(S => S.join('')).sort()).toEqual(['abf', 'cde'])
    expect(cap(['c', 'd', 'e'])).toBe(13)
    // U = {a, b}: unique minimum a–f cut, capacity 17; its edges af bf bc be have capacities 8, 3, 4, 2
    expect(subsets.filter(S => S.includes('a') && !S.includes('f') && cap(S) === 17).map(S => S.join(''))).toEqual(['ab'])
    expect(cap(['a', 'b'])).toBe(17)
    expect(8 + 3 + 4 + 2).toBe(17)
    // thick/cut edges in the figures
    const cutSum = (id: string, step: number, cls: string) => {
      const h = steps(id)[step].graph
      return h.edges.filter(e => e.classes.includes(cls)).reduce((z, e) => z + num(e.data.c), 0)
    }
    expect([cutSum('a03-gmc-lower', 1, 'bold'), cutSum('a03-gmc-lower', 2, 'cut'), cutSum('a03-gmc-lower', 3, 'cut')]).toEqual([17, 17, 13])
    expect([cutSum('a03-gmc-upper', 0, 'cut'), cutSum('a03-gmc-upper', 3, 'bold')]).toEqual([13, 13])
    // U = {a, b} is not empty and not V; a lies in U and f does not; the far side {c, d, e} is non-empty, d is on it
    expect(cap(['a', 'b'])).toBeGreaterThanOrEqual(13)
    // the arc a→f leaves U = {a, b}, f→a does not: 8 of the 17
    expect(new Set(['a', 'b']).has('a') && !new Set(['a', 'b']).has('f')).toBe(true)
    // MPM time: 5 runs of O(n^3); (n - 1) < n
    expect(5).toBeLessThan(6)
  })
})
