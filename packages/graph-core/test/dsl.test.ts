import { describe, expect, it } from 'vitest'
import { parseGraph } from '../src/dsl/parser'
import { serialize } from '../src/io'

describe('DSL parser', () => {
  it('parses edges, chains, attributes and parallel edges', () => {
    const d = parseGraph('a -- b -- c [w=3]\na -- b\nc -- c')
    const g = d.panels[0].graph
    expect(d.errors).toEqual([])
    expect(g.vertices.map(v => v.id)).toEqual(['a', 'b', 'c'])
    expect(g.edges.map(e => e.id)).toEqual(['e1', 'e2', 'e3', 'e4'])
    expect(g.edges[0].data.w).toBe(3)
    expect(g.edges[3].tail[0]).toBe(g.edges[3].head[0])
  })
  it('rejects arcs in undirected graphs', () => {
    expect(parseGraph('a -> b').errors.length).toBe(1)
    expect(parseGraph('type: directed\na -> b').errors).toEqual([])
  })
  it('handles generators with prefixes and removal', () => {
    const g = parseGraph('use: K(5)\nremove 1--2').panels[0].graph
    expect(g.edges.length).toBe(9)
    const h = parseGraph('use: C(3) prefix=a\nuse: C(3) prefix=b').panels[0].graph
    expect(h.vertices.map(v => v.id)).toEqual(['a1', 'a2', 'a3', 'b1', 'b2', 'b3'])
  })
  it('P(n) has n+1 vertices (lecture convention)', () => {
    expect(parseGraph('use: P(4)').panels[0].graph.vertices.length).toBe(5)
  })
  it('builds stepper frames cumulatively', () => {
    const d = parseGraph('1 -- 2 -- 3\nstep: one\nclass highlight: 1\nstep: two\nremove 3')
    const p = d.panels[0]
    expect(p.steps.length).toBe(2)
    expect(p.steps[0].graph.vertices[0].classes).toContain('highlight')
    expect(p.steps[1].graph.vertices.length).toBe(2)
    expect(p.graph.vertices.length).toBe(3)
  })
  it('splits panels and keeps header directives', () => {
    const d = parseGraph('caption: x\nlayout: fixed\npanel: A\na @(0,0)\npanel: B\nb @(1,1)')
    expect(d.panels.length).toBe(2)
    expect(d.directives.caption).toEqual(['x'])
    expect(d.panels[1].graph.meta.layout).toBe('fixed')
  })
  it('does not split text directives at semicolons', () => {
    const d = parseGraph('caption: a; b\na -- b')
    expect(d.directives.caption).toEqual(['a; b'])
  })
  it('round-trips through serialize', () => {
    const src = 'type: mixed\na [label="$a_1$"] @(0, 1)\na -- b [w=2]\nb -> c [c=3 f=1 class=path]\nc -- c\ngroup S: a b [label="$S$"]'
    const g1 = parseGraph(src).panels[0].graph
    const g2 = parseGraph(serialize(g1)).panels[0].graph
    expect(g2).toEqual(g1)
  })
})
