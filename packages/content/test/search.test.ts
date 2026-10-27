import { expect, it } from 'vitest'
import { scoreEntry, tokens, type SearchFields } from '../search'

const e = (o: Partial<SearchFields>): SearchFields => ({ label: '', title: '', aka: '', defines: '', text: '', ...o })

it('ranks label/title above aka/defines above text, and needs every token', () => {
  const q = tokens('cut vertex')
  const title = scoreEntry(e({ title: 'Cut vertex' }), q)
  const defines = scoreEntry(e({ defines: 'cut vertex, articulation point' }), q)
  const text = scoreEntry(e({ text: 'Removing a cut vertex disconnects G.' }), q)
  expect(title).toBeGreaterThan(defines)
  expect(defines).toBeGreaterThan(text)
  expect(text).toBeGreaterThan(0)
  expect(scoreEntry(e({ text: 'a cut edge' }), q)).toBe(0)
  expect(scoreEntry(e({ label: 'T5.2' }), tokens('T5.2'))).toBe(10)
  expect(scoreEntry(e({ label: 'T5.20' }), tokens('5.2'))).toBe(10) // shortcut: prefix match, so 5.2 also finds 5.20
})
