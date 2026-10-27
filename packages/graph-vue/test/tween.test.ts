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
    expect(u.x).toBeCloseTo(0.625) // 0.5 / 0.8 of the way to w
    // the members slide without fading; the merged vertex waits behind them
    expect(r.fade['v:u']).toBeUndefined()
    expect(r.fade['v:w']).toBeUndefined()
    expect(r.ghost).toEqual(['w'])
    expect(r.fade['e:uv']).toBeCloseTo(0) // the contracted edge is already gone
    expect(r.goo?.sort()).toEqual(['u', 'v'])
    expect(r.fade['l:u']).toBeCloseTo(0) // labels clear out before the blobs fuse
    // from 80% the members coincide
    const late = interpolate(s0.graph, s1.graph, 0.85, s1.merges)
    const [lu, lv] = ['u', 'v'].map(id => late.graph.vertices.find(v => v.id === id)!.x)
    expect(lu).toBeCloseTo(lv!)
  })
  it('reverse plays the merge backwards', () => {
    const r = interpolate(s1.graph, s0.graph, 0.25, s1.merges, true)
    const u = r.graph.vertices.find(v => v.id === 'u')!
    expect(u.x).toBeCloseTo(0.9375) // reversed: u has slid 0.75 / 0.8 of the way, as seen from u's side
    expect(r.fade['v:w']).toBeUndefined()
  })
})

describe('renamed arcs', () => {
  it('pair up by merged endpoints instead of fading', () => {
    const a = parseGraph('type: directed\nlayout: fixed\na @(0,0); b @(1,0); c @(2,0)\na -> c [id=e1]').panels[0].graph
    const b = parseGraph('type: directed\nlayout: fixed\nm @(0.5,0); c @(2,0)\nm -> c [id=e1x]').panels[0].graph
    const r = interpolate(a, b, 0.5, [{ from: ['a', 'b'], to: 'm' }])
    expect(r.graph.edges.map(e => e.id)).toEqual(['e1'])
    expect(r.fade['e:e1']).toBeUndefined()
    expect(r.fade['e:e1x']).toBeUndefined()
  })
})
