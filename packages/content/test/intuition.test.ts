import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { expect, it } from 'vitest'
import { loadContent } from '../index'
import { intuitionsFor } from '../pages'

it('attaches intuitions to the preceding reference entry or to for=', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-'))
  fs.mkdirSync(path.join(root, 'content/theory'), { recursive: true })
  fs.writeFileSync(path.join(root, 'content/theory/01-x.md'), [
    '---', 'lecture: 1', 'slug: x', 'title: X', '---',
    '::: definition {#def:a}', 'A.', ':::',
    '::: intuition', 'About A.', ':::',
    '::: theorem {#thm:b}', 'B.', ':::',
    ':::: proof', '::: claim', 'C.', ':::', '::::',
    '::: intuition', 'About B.', ':::',
    '::: intuition {for=def:a}', 'More about A.', ':::',
    '::: intuition {for=def:missing}', 'Bad.', ':::',
  ].join('\n'))
  const ix = loadContent(root)
  expect(intuitionsFor(ix, 'def:a').map(c => c.body)).toEqual(['About A.', 'More about A.'])
  expect(intuitionsFor(ix, 'thm:b').map(c => c.body)).toEqual(['About B.'])
  expect(ix.problems.map(p => p.message)).toEqual(['intuition for=def:missing: unknown statement'])
})
