import { describe, expect, it } from 'vitest'
import { parseGraph } from '../src/dsl/parser'
import { PREDICATES } from '../src/predicates'
import type { GraphData } from '../src/model'

const colored = (src: string, colors: Record<string, number>): GraphData => {
  const g = parseGraph(src).panels[0].graph
  for (const v of g.vertices) if (colors[v.id]) v.classes.push(`color${colors[v.id]}`)
  return g
}
const check = (g: GraphData, args: Record<string, string> = {}) =>
  PREDICATES['is-proper-coloring']({ graph: g, original: g, selection: { vertices: new Set(), edges: new Set() }, args })

describe('is-proper-coloring', () => {
  const tri = 'a -- b -- c -- a'
  it('accepts a proper colouring', () => expect(check(colored(tri, { a: 1, b: 2, c: 3 })).ok).toBe(true))
  it('rejects an uncoloured vertex', () => expect(check(colored(tri, { a: 1, b: 2 })).feedback).toMatch(/c has no colour/))
  it('rejects adjacent vertices with the same colour', () => expect(check(colored(tri, { a: 1, b: 1, c: 2 })).feedback).toMatch(/a and b/))
  it('rejects a loop', () => expect(check(colored('a -- a', { a: 1 })).ok).toBe(false))
  it('k limits the number of colours', () => {
    const g = colored('a -- b -- c', { a: 1, b: 2, c: 3 })
    expect(check(g).ok).toBe(true)
    expect(check(g, { k: '2' }).feedback).toMatch(/3 colours/)
    expect(check(colored('a -- b -- c', { a: 1, b: 2, c: 1 }), { k: '2' }).ok).toBe(true)
  })
})
