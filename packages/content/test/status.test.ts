import { expect, it } from 'vitest'
import { statusTag } from '../status'

it('maps frontmatter status to a tag and a visible line', () => {
  expect(statusTag('reviewed')).toMatchObject({ status: 'reviewed', text: 'Checked', note: 'A second reader checked the mathematics on this page.' })
  expect(statusTag('draft')).toMatchObject({ status: 'draft', text: 'Not checked yet' })
  expect(statusTag(undefined)).toBeUndefined()
})
