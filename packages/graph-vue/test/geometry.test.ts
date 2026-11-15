import { describe, expect, it } from 'vitest'
import { parseGraph } from '@core/dsl/parser'
import { facePolygon, routeEdges, toScreen } from '../src/geometry'

const setup = (src: string) => {
  const g = parseGraph(src).panels[0].graph
  return { g, pos: new Map(g.vertices.map(v => [v.id, toScreen(v.x ?? 0, v.y ?? 0)])) }
}

describe('edges through given points (via)', () => {
  it('draws a smooth curve through every point and fits the box to them', () => {
    const { g, pos } = setup('a @(0,0); b @(2,0)\na -- b [via="(1,1) (1.5,1.5)"]')
    const [geom] = routeEdges(g, pos)
    expect(geom.d.match(/C/g)?.length).toBe(3)
    expect(geom.d).toContain(' 64,-64 ')
    expect(geom.d).toContain(' 96,-96 ')
    expect(geom.extent).toEqual([{ x: 64, y: -64 }, { x: 96, y: -96 }])
  })
  it('routes a loop through its points', () => {
    const { g, pos } = setup('a @(0,0)\na -- a [via="(1,1) (-1,1)"]')
    const [geom] = routeEdges(g, pos)
    expect(geom.loop).toBe(true)
    expect(geom.d.startsWith('M0,0 C')).toBe(true)
  })
})

describe('faces follow their edges', () => {
  it('a straight triangle is three corners', () => {
    const { g, pos } = setup('a @(0,0); b @(2,0); c @(1,1)\na -- b -- c -- a\nface f: a b c')
    expect(facePolygon(g, g.faces[0].walk, pos)).toEqual([pos.get('a'), pos.get('b'), pos.get('c')])
  })
  it('a bent edge adds points along its curve, in the direction the face walks it', () => {
    const { g, pos } = setup('a @(0,0); b @(2,0); c @(1,1)\nb -- a [bend=0.3]; b -- c -- a\nface f: a b c')
    const poly = facePolygon(g, g.faces[0].walk, pos)
    expect(poly.length).toBe(12 + 2)
    expect(Math.hypot(poly[0].x - pos.get('a')!.x, poly[0].y - pos.get('a')!.y)).toBeLessThan(1e-9)
    // the curve bulges away from the straight segment a-b
    expect(Math.max(...poly.slice(1, 12).map(p => Math.abs(p.y)))).toBeGreaterThan(10)
  })
  it('a digon uses both parallel edges', () => {
    const { g, pos } = setup('a @(0,0); b @(2,0)\na -- b; a -- b\nface f: a b')
    const poly = facePolygon(g, g.faces[0].walk, pos)
    const ys = poly.map(p => p.y)
    expect(Math.min(...ys)).toBeLessThan(0)
    expect(Math.max(...ys)).toBeGreaterThan(0)
  })
})
