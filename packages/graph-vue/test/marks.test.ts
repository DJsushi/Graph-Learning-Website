import { expect, it } from 'vitest'
import { parseGraph } from '../../graph-core/src/dsl/parser'
import { spotOf } from '../src/marks'

const graph = (src: string, step = -1) => { const p = parseGraph(src).panels[0]; return step < 0 ? p.graph : p.steps[step].graph }

it('spotOf resolves vertices, edges, faces and groups, and skips absent elements', () => {
  const g = graph('a -- b -- c\ngroup G: a b\nmark m: a @e2 G\nmark gone: c\nstep: s\nremove c')
  expect([...spotOf(g, 'm')!.vertices]).toEqual(['a'])
  expect([...spotOf(g, 'm')!.edges]).toEqual(['e2'])
  expect([...spotOf(g, 'm')!.groups]).toEqual(['G'])
  const s = graph('a -- b -- c\nmark gone: c\nstep: s\nremove c', 0)
  expect(spotOf(s, 'gone')).toBeNull()
  expect(spotOf(g, 'nope')).toBeNull()
  expect(spotOf(g, null)).toBeNull()
})
