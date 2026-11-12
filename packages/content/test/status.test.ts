import { expect, it } from 'vitest'
import { auditedDate, auditTag, statusTag } from '../status'

it('maps frontmatter status to a tag and a visible line', () => {
  expect(statusTag('reviewed')).toMatchObject({ status: 'reviewed', text: 'Checked', note: 'A second reader checked the mathematics on this page.' })
  expect(statusTag('draft')).toMatchObject({ status: 'draft', text: 'Not checked yet' })
  expect(statusTag(undefined)).toBeUndefined()
})

it('reads audited as a date, from a YAML Date or a string, and tags it', () => {
  expect(auditedDate(new Date('2026-11-13'))).toBe('2026-11-13')
  expect(auditedDate('2026-11-13')).toBe('2026-11-13')
  for (const bad of [undefined, true, 'soon', '13.11.2026', new Date('x')]) expect(auditedDate(bad)).toBeUndefined()
  expect(auditTag('2026-11-13')).toMatchObject({ text: 'Matches the lecture notes' })
  expect(auditTag(undefined)).toBeUndefined()
})
