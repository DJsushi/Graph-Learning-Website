import { expect, it } from 'vitest'
import { parseMarkRef, type ContentIndex } from '../index'
import { markRefErrors } from '../marks'

const page = {} as any, other = {} as any
const index = (refs: { target: string; text?: string; lesson?: any }[]) => ({
  refs: refs.map(r => ({ lesson: page, line: 1, ...r })),
  figureById: new Map<string, any>([['f1', { id: 'f1', lesson: page }], ['f2', { id: 'f2', lesson: other }]]),
}) as unknown as ContentIndex
const marksOf = () => new Set(['S'])

it('parses fig:id#mark only', () => {
  expect(parseMarkRef('fig:a01-x#S_1')).toEqual({ fig: 'a01-x', mark: 'S_1' })
  for (const t of ['fig:a01-x', 'def:graph', 'fig:#S', 'fig:a#']) expect(parseMarkRef(t)).toBeUndefined()
})

it('accepts a mark link on the same page and rejects the rest', () => {
  expect(markRefErrors(index([{ target: 'fig:f1#S', text: 'the set' }, { target: 'def:graph' }]), marksOf)).toEqual([])
  const msg = (r: { target: string; text?: string }) => markRefErrors(index([r]), marksOf).map(e => e.message)
  expect(msg({ target: 'fig:zz#S', text: 't' })).toEqual(['[[fig:zz#S]] names an unknown figure zz'])
  expect(msg({ target: 'fig:f2#S', text: 't' })[0]).toContain('another page')
  expect(msg({ target: 'fig:f1#T', text: 't' })[0]).toContain('does not define')
  expect(msg({ target: 'fig:f1#S' })[0]).toContain('needs link text')
  expect(msg({ target: 'fig:f1#S', text: ' ' })[0]).toContain('needs link text')
})
