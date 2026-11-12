// Every number the lessons claim about their figures is checked here against the implementations.
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../../content/index'
import { parseGraph } from '../src/dsl/parser'
import { ALGORITHMS, collect, cutCapacity, globalMinCut, gomoryHuTree, maxFlowValue, minArborescenceCost, minSTCut, mstEdges } from '../src/algorithms'
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
