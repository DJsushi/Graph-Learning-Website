import { describe, expect, it } from 'vitest'
import { parseGraph } from '@core/dsl/parser'
import { interpolate } from '../src/tween'

const doc = parseGraph(`layout: fixed
u @(0, 0); v @(2, 0); x @(1, 2)
u -- v [id=uv]; u -- x [id=ux]; v -- x [id=vx]
step: start
step: merge
merge u v -> w
`)
const [s0, s1] = doc.panels[0].steps

describe('merge / split parsing', () => {
  it('records the merge and rewires edges', () => {
    expect(doc.errors).toEqual([])
    expect(s1.merges).toEqual([{ from: ['u', 'v'], to: 'w' }])
    expect(s1.graph.vertices.map(v => v.id).sort()).toEqual(['w', 'x'])
    expect(s1.graph.edges.map(e => e.id).sort()).toEqual(['ux', 'vx'])
    expect(s1.graph.vertices.find(v => v.id === 'w')).toMatchObject({ x: 1, y: 0 })
  })
  it('splits arcs', () => {
    const d = parseGraph('type: directed\nlayout: fixed\na @(0,0); x @(1,0); b @(2,0)\na -> x; x -> b\nstep: s\nsplit x -> p q')
    expect(d.errors).toEqual([])
    const g = d.panels[0].steps[0].graph
    expect(g.edges.map(e => [e.tail[0], e.head[0]])).toEqual([['a', 'p'], ['q', 'b']])
    expect(d.panels[0].steps[0]).toMatchObject({ split: true, merges: [{ from: ['p', 'q'], to: 'x' }] })
  })
  it('rejects a merge outside a step', () => {
    expect(parseGraph('a -- b\nmerge a b -> c').errors.length).toBe(1)
  })
})

describe('interpolate', () => {
  it('endpoints are the frames', () => {
    expect(interpolate(s0.graph, s1.graph, 0).graph).toBe(s0.graph)
    expect(interpolate(s0.graph, s1.graph, 1).graph).toBe(s1.graph)
  })
  it('slides merged vertices together and fades them', () => {
    const r = interpolate(s0.graph, s1.graph, 0.5, s1.merges)
    const u = r.graph.vertices.find(v => v.id === 'u')!
    expect(u.x).toBeCloseTo(0.5)
    expect(r.fade['v:u']).toBeCloseTo(0.5)
    expect(r.fade['v:w']).toBeCloseTo(0.5)
    expect(r.fade['e:uv']).toBeCloseTo(0.5)
    expect(r.graph.edges.find(e => e.id === 'ux')!.tail[0]).toBe('u') // still on the sliding vertex
  })
  it('reverse plays the merge backwards', () => {
    const r = interpolate(s1.graph, s0.graph, 0.25, s1.merges, true)
    const u = r.graph.vertices.find(v => v.id === 'u')!
    expect(u.x).toBeCloseTo(0.75) // a quarter of the way back from w (x=1) towards u (x=0)
    expect(r.fade['v:w']).toBeCloseTo(0.75)
  })
})
