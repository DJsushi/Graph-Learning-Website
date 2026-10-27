import { describe, expect, it } from 'vitest'
import { parseGraph } from '@core/dsl/parser'
import { inBox, paste, snap, subgraph } from '@gv/editing'

const g = parseGraph('1 -- 2 [w=3]\n2 -- 3\n3 -- 1\n1 @(0, 0)\n2 @(1, 0)\n3 @(5, 5)').panels[0].graph

describe('editing helpers', () => {
  it('copies the selected vertices with the edges among them', () => {
    const s = subgraph(g, ['1', '2'])
    expect(s.vertices.map(v => v.id)).toEqual(['1', '2'])
    expect(s.edges).toHaveLength(1)
    expect(s.edges[0].data.w).toBe(3)
  })
  it('pastes with fresh ids, offset positions and remapped edges', () => {
    const r = paste(g, subgraph(g, ['1', '2']), { x: 0.5, y: -0.5 })
    expect(r.vertices).toEqual(['4', '5'])
    expect(r.graph.vertices).toHaveLength(5)
    const e = r.graph.edges.find(x => x.id === r.edges[0])!
    expect([e.tail[0], e.head[0]]).toEqual(['4', '5'])
    expect(r.graph.vertices.find(v => v.id === '5')).toMatchObject({ x: 1.5, y: -0.5 })
    expect(new Set(r.graph.edges.map(x => x.id)).size).toBe(r.graph.edges.length)
  })
  it('selects vertices in a box and the edges inside it', () => {
    expect(inBox(g, { x: 2, y: 1 }, { x: -1, y: -1 })).toEqual({ vertices: ['1', '2'], edges: [g.edges[0].id] })
  })
  it('snaps to the half-unit grid only when on', () => {
    expect(snap({ x: 0.74, y: -0.26 }, true)).toEqual({ x: 0.5, y: -0.5 })
    expect(snap({ x: 0.74, y: 1 }, false)).toEqual({ x: 0.74, y: 1 })
  })
})
