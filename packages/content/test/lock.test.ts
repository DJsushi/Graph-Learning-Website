import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../index'
import { entryHashes, lockErrors } from '../lock'

const hashes = (body: string) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lock-'))
  fs.mkdirSync(path.join(root, 'content/theory'), { recursive: true })
  fs.writeFileSync(path.join(root, 'content/theory/03-trees.md'), ['---', 'title: T', 'course: theory', 'lecture: 3', '---', body].join('\n'))
  return entryHashes(loadContent(root))
}
const page = (stmt: string) => ['::: theorem {#thm:a}', stmt, ':::', '::: proof', 'P1.', ':::', '::: proof', 'P2.', ':::'].join('\n')

describe('entry lock', () => {
  it('keys statements by id and proofs by <id>#proof<n>', () => {
    expect(Object.keys(hashes(page('A.')))).toEqual(['thm:a', 'thm:a#proof1', 'thm:a#proof2'])
  })

  it('ignores trailing spaces, but not text', () => {
    const base = hashes(page('A.'))
    expect(hashes(page('A.  '))).toEqual(base)
    expect(hashes(page('B.'))['thm:a']).not.toBe(base['thm:a'])
  })

  it('reports a changed and a missing entry', () => {
    const locked = hashes(page('A.'))
    expect(lockErrors(locked, locked)).toEqual([])
    const errs = lockErrors(locked, { 'thm:a': 'x', 'thm:a#proof1': locked['thm:a#proof1'] })
    expect(errs).toHaveLength(2)
    expect(errs[0]).toMatch(/thm:a changed/)
    expect(errs[1]).toMatch(/thm:a#proof2 is gone/)
  })
})
