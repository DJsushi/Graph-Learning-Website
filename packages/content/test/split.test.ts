import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../index'
import { entryHashes } from '../lock'
import { runSplit } from '../../../scripts/split'

const lecture = [
  '---', 'title: T', 'course: theory', 'lecture: 1', 'slug: t01', '---',
  'Intro.', '',
  '## First', '',
  '::: definition {#def:a title="A"}', 'A.', ':::', '',
  'Lead-in of B.', '',
  '::: theorem {#thm:b}', 'B.', ':::', '::: proof', 'Proof of B.', ':::', '',
  '```graph id=t01-fig widget=figure', 'a -- b', '```', '',
  'Lead-in of C.', '',
  '::: lemma {#lem:c}', 'C.', ':::', '',
  '## Summary', '', 'Done.', '',
].join('\n')
const map = [
  'content/theory/01-t.md:',
  '  - { page: x/first, title: "First: a", from: "## First" }',
  '  - { page: x/b, title: "B", from: "thm:b" }',
  '  - { page: y/c, title: "C", from: "lem:c" }',
  '  - { stay: "## Summary" }',
].join('\n')

const setup = (text = lecture, mapText = map) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'split-'))
  fs.mkdirSync(path.join(root, 'content/theory'), { recursive: true })
  fs.writeFileSync(path.join(root, 'content/theory/01-t.md'), text)
  fs.writeFileSync(path.join(root, 'map.yaml'), mapText)
  return root
}
const read = (root: string, f: string) => fs.readFileSync(path.join(root, 'content/theory', f), 'utf8')

describe('split', () => {
  it('cuts the pages, drops headings, keeps the lead-in, numbers pages per chapter', () => {
    const root = setup()
    const before = entryHashes(loadContent(root))
    runSplit(root, path.join(root, 'map.yaml'))
    expect(read(root, 'x/first.md')).toBe([
      '---', 'title: "First: a"', 'course: theory', 'chapter: x', 'order: 1', 'lectures: [t01]', 'stage: split', 'status: draft', '---', '',
      '::: definition {#def:a title="A"}', 'A.', ':::', '',
    ].join('\n').replace(/\n$/, '') + '\n')
    const b = read(root, 'x/b.md')
    expect(b).toContain('order: 2')
    expect(b).toMatch(/---\n\nLead-in of B\.\n\n::: theorem/)
    expect(b.trimEnd().endsWith('```')).toBe(true)
    expect(read(root, 'y/c.md')).toMatch(/order: 1[\s\S]*Lead-in of C\.\n\n::: lemma[\s\S]*:::\n$/)
    expect(read(root, '01-t.md')).toBe(lecture.split('\n').slice(0, 7).join('\n') + '\n\n## Summary\n\nDone.\n')
    expect(entryHashes(loadContent(root))).toEqual(before)   // statements and proofs are verbatim
  })

  it('stops with a clear message and writes nothing', () => {
    const run = (m: string, text?: string) => { const r = setup(text, m); try { runSplit(r, path.join(r, 'map.yaml')) } catch (e) { return [(e as Error).message, r] as const } return ['', r] as const }
    const head = 'content/theory/01-t.md:\n'
    let [msg, root] = run(head + '  - { page: x/a, title: A, from: "## Nope" }')
    expect(msg).toMatch(/heading "## Nope" found 0 times/)
    expect(fs.existsSync(path.join(root, 'content/theory/x'))).toBe(false)
    expect(run(head + '  - { page: x/a, title: A, from: "thm:zzz" }')[0]).toMatch(/anchor thm:zzz is not a container/)
    expect(run(head + '  - { page: x/a, title: A, from: "## First" }', lecture + '## First\n')[0]).toMatch(/found 2 times/)
    expect(run(head + '  - { page: x/a, title: A, from: "lem:c" }\n  - { page: x/b, title: B, from: "## First" }')[0]).toMatch(/x\/b starts at or before x\/a/)
    expect(run(head + '  - { page: x/a, title: A, from: "## First" }\n  - { page: x/a, title: A, from: "lem:c" }')[0]).toMatch(/x\/a is in the map twice/)
  })
})
