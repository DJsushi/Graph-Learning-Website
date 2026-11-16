import { describe, expect, it } from 'vitest'
import { parseGraph } from '../src/dsl/parser'
import { computeLayout } from '../src/layout'
import { dual, embed, interiorPoint, isPlanar, planarLayout } from '../src/planar'
import { PROPERTIES } from '../src/properties'
import { GraphIndex, ends, type GraphData } from '../src/model'

const graph = (src: string) => {
  const d = parseGraph(src)
  expect(d.errors).toEqual([])
  return d.panels[0].graph
}

/** Pairs of edges without a common end whose straight segments cross, or vertices lying on an edge. */
function crossings(g: GraphData, pos: Map<string, { x: number; y: number }>): number {
  const es = g.edges.filter(e => !e.hyper && ends(e)[0] !== ends(e)[1]).map(ends)
  const cr = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  let n = 0
  for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
    const [a, b] = es[i], [c, d] = es[j]
    if (a === c || a === d || b === c || b === d) continue
    const [p, q, r, s] = [a, b, c, d].map(v => pos.get(v)!)
    if (Math.sign(cr(p, q, r)) * Math.sign(cr(p, q, s)) < 0 && Math.sign(cr(r, s, p)) * Math.sign(cr(r, s, q)) < 0) n++
  }
  for (const v of g.vertices) for (const [a, b] of es) {
    if (v.id === a || v.id === b) continue
    const [p, q, r] = [pos.get(a)!, pos.get(b)!, pos.get(v.id)!]
    const t = ((r.x - p.x) * (q.x - p.x) + (r.y - p.y) * (q.y - p.y)) / ((q.x - p.x) ** 2 + (q.y - p.y) ** 2)
    if (t > 0 && t < 1 && Math.abs(cr(p, q, r)) / Math.hypot(q.x - p.x, q.y - p.y) < 1e-6) n++
  }
  return n
}

describe('planarity', () => {
  it('tells planar from non-planar graphs', () => {
    for (const s of ['use: K(4)', 'use: Q(3)', 'use: Wheel(6)', 'use: Grid(3,4)', 'use: K(2,5)', 'use: BinTree(3)', 'use: K(5)\nremove 1--2'])
      expect(isPlanar(graph(s)), s).toBe(true)
    for (const s of ['use: K(5)', 'use: K(3,3)', 'use: Petersen', 'use: Q(4)']) expect(isPlanar(graph(s)), s).toBe(false)
    expect(PROPERTIES.planar.compute(new GraphIndex(graph('use: K(5)')))).toBe('no')
  })
  it('draws planar graphs without crossings', () => {
    const cases = [
      'use: K(4)', 'use: Q(3)', 'use: Wheel(7)', 'use: Grid(3,3)', 'use: K(2,4)', 'use: BinTree(3)', 'use: C(6)', 'use: P(4)',
      'use: K(5)\nremove 1--2',
      // cut vertices, a pendant path and two components
      'a -- b -- c -- a; c -- d -- e -- c; e -- f; f -- g; x -- y -- z',
      // octahedron
      'use: K(2,2,2)',
    ]
    for (const s of cases) {
      const g = graph(`layout: planar\n${s}`)
      const pos = computeLayout(g)
      expect(pos.size).toBe(g.vertices.length)
      expect(crossings(g, pos), s).toBe(0)
      const xs = [...pos.values()].flatMap(p => [p.x, p.y])
      expect(xs.every(Number.isFinite)).toBe(true)
    }
  })
  it('reports a non-planar graph with layout: planar', () => {
    expect(parseGraph('layout: planar\nuse: K(3,3)').errors.map(e => e.message)).toEqual(['layout: planar: the graph is not planar'])
    expect(planarLayout(graph('use: K(5)'))).toBeUndefined()
  })
  it('realises authored faces, whatever direction they are written in', () => {
    // a 4-cycle with a chord: the faces fix which side the chord is drawn on
    const g = graph('layout: planar\na -- b -- c -- d -- a; a -- c\nface f1: a b c\nface f2: a c d\nface f0 outer: a b c d')
    const emb = embed(g)
    expect(typeof emb).toBe('object')
    if (typeof emb === 'string') return
    expect(emb.authored).toBe(true)
    expect(emb.comps[0].outer).toBe(2)
    expect(crossings(g, computeLayout(g))).toBe(0)
  })
  it('rejects faces that do not form an embedding', () => {
    const msg = (s: string) => parseGraph(`layout: planar\n${s}`).errors.map(e => e.message)
    expect(msg('a -- b -- c -- a\nface f1: a b c')[0]).toMatch(/face sides, expected 2/)
    expect(msg('a -- b -- c -- a\nface f1: a b c\nface f2: a c b d')[0]).toMatch(/not an edge|unknown vertex/)
    // K4 with a wrong face set: every edge twice, but the walks do not close around the vertices
    expect(msg('use: K(4)\nface f1: 1 2 3\nface f2: 1 2 4\nface f3: 1 3 4\nface f4: 2 3 4 1')[0]).toMatch(/./)
  })
  it('finds a point inside a non-convex polygon', () => {
    const u = [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 0, y: 3 }]
    const p = interiorPoint(u)
    expect(p.y < 1 || p.x < 1 || p.x > 2).toBe(true)
  })
})

describe('radius', () => {
  it('is the smallest eccentricity', () => {
    expect(PROPERTIES.radius.compute(new GraphIndex(graph('use: P(4)')))).toBe('2')
    expect(PROPERTIES.radius.compute(new GraphIndex(graph('use: Star(5)')))).toBe('1')
    expect(PROPERTIES.radius.compute(new GraphIndex(graph('a -- b; c')))).toBe('$\\infty$')
  })
})

describe('dual', () => {
  const degrees = (g: GraphData) => { const ix = new GraphIndex(g); return ix.vertexIds.map(v => ix.degree(v)).sort() }
  it('of K4 is K4, of a cube is the octahedron', () => {
    const d = dual(graph('use: K(4)'))
    expect(d.vertices.length).toBe(4)
    expect(d.edges.length).toBe(6)
    expect(degrees(d)).toEqual([3, 3, 3, 3])
    const o = dual(graph('use: Q(3)'))
    expect(o.vertices.length).toBe(6)
    expect(degrees(o)).toEqual([4, 4, 4, 4, 4, 4])
    expect(o.meta.defaultLayout).toBe('planar')
  })
  it('turns a cycle into parallel edges and a tree into loops', () => {
    const c = dual(graph('use: C(4)'))
    expect(c.vertices.map(v => v.id).sort()).toEqual(['f0', 'f1'])
    expect(c.edges.every(e => ends(e)[0] !== ends(e)[1])).toBe(true)
    const t = dual(graph('use: P(3)'))
    expect(t.vertices.map(v => v.id)).toEqual(['f0'])
    expect(t.edges.length).toBe(3)
  })
  it('keeps authored face ids and labels', () => {
    const d = dual(graph('a -- b -- c -- a\nface f1: a b c [label="$f_1$"]\nface fo outer: a c b'))
    expect(d.vertices.map(v => [v.id, v.label])).toEqual([['f1', '$f_1$'], ['fo', undefined]])
    expect(d.edges.length).toBe(3)
  })
  it('is drawn over the primal graph: dual(this) pins it and routes each dual edge across its edge', () => {
    const d = parseGraph('layout: planar\nuse: K(4)\nuse: dual(this) prefix=d')
    expect(d.errors).toEqual([])
    const g = d.panels[0].graph
    expect(g.vertices.length).toBe(8)
    expect(g.vertices.every(v => v.pinned)).toBe(true)
    const duals = g.edges.filter(e => e.classes.includes('dual'))
    expect(duals.length).toBe(6)
    expect(duals.every(e => typeof e.data.via === 'string' && /^\(/.test(String(e.data.via)))).toBe(true)
    // an inner dual vertex lies inside the triangle of its face
    const tri = g.vertices.filter(v => !v.id.startsWith('d'))
    const inner = g.vertices.filter(v => v.id.startsWith('d') && v.id !== 'df0')
    const xs = tri.map(v => v.x!), ys = tri.map(v => v.y!)
    for (const v of inner) {
      expect(v.x!).toBeGreaterThan(Math.min(...xs))
      expect(v.x!).toBeLessThan(Math.max(...xs))
      expect(v.y!).toBeGreaterThan(Math.min(...ys))
    }
  })
  it('refuses graphs it cannot dualise', () => {
    expect(parseGraph('use: dual(K(5))').errors[0].message).toMatch(/not planar/)
    expect(parseGraph('a -- b; a -- b\nuse: dual(this)').errors[0].message).toMatch(/parallel/)
    expect(parseGraph('a -- b; c -- d\nuse: dual(this)').errors[0].message).toMatch(/connected/)
    expect(parseGraph('a -- b [via="1,2"]').errors[0].message).toMatch(/via/)
  })
})
