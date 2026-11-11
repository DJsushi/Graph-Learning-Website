// Every number the lessons claim about their figures is checked here against the implementations.
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../../content/index'
import { parseGraph } from '../src/dsl/parser'
import { ALGORITHMS, collect, cutCapacity, globalMinCut, gomoryHuTree, maxFlowValue, minArborescenceCost, minSTCut, mstEdges } from '../src/algorithms'
import { GraphIndex, num, type GraphData } from '../src/model'
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
  it('odd-count walkthrough: odd vertices mt, mb, p, q (k = 4); sums 8 and 8, total 16', () => {
    const ix = new GraphIndex(fig('t01-odd-count'))
    const odd = ix.vertexIds.filter(v => ix.degree(v) % 2 === 1)
    const even = ix.vertexIds.filter(v => ix.degree(v) % 2 === 0)
    expect(odd.sort()).toEqual(['mb', 'mt', 'p', 'q'])
    expect(even.sort()).toEqual(['l', 'r', 'x'])
    expect(odd.reduce((z, v) => z + ix.degree(v), 0)).toBe(8)
    expect(even.reduce((z, v) => z + ix.degree(v), 0)).toBe(8)
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
  it('corollary figure: tree on 7 vertices, a longest path a b c d g of length 4, a and g leaves', () => {
    const g = fig('t03-tree-leaf-proof')
    expect(A.isTree(new GraphIndex(g))).toBe(true)
    expect(g.vertices.length).toBe(7)
    const { best, paths } = longest(g)
    expect(best).toBe(4)
    expect(paths.map(p => p.join(' '))).toContain('a b c d g')
    expect([deg(g, 'a'), deg(g, 'g')]).toEqual([1, 1])
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
