import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { courseChapters, lectureLessons, loadContent, resolveTarget, type Topic } from '../index'

function site(files: Record<string, string[]>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-'))
  for (const [f, lines] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true })
    fs.writeFileSync(path.join(root, f), lines.join('\n'))
  }
  return root
}
const lecture = ['---', 'title: Trees', 'course: theory', 'lecture: 3', 'slug: t03', '---']
const concept = ['---', 'title: Leaves', 'course: theory', 'chapter: trees', 'order: 2', 'lectures: [t03]', 'stage: split', 'status: draft', '---']

describe('loadContent', () => {
  it('scans lecture and concept pages in subfolders', () => {
    const root = site({
      'content/theory/03-trees.md': [...lecture, 'Text.'],
      'content/theory/trees/leaves.md': [...concept, '::: lemma {#lem:leaves}', 'Two leaves.', ':::'],
      'content/algorithms/mst/index.md': ['---', 'chapter: mst', '---'],
    })
    const ix = loadContent(root)
    expect(ix.lessons.map(l => [l.path, l.kind])).toEqual([['theory/03-trees', 'lecture'], ['theory/trees/leaves', 'concept']])
    const page = ix.lessons[1]
    expect(page).toMatchObject({ course: 'theory', chapter: 'trees', order: 2, lectures: ['t03'], stage: 'split', lecture: 0, status: 'draft' })
    expect(ix.lessons[0]).toMatchObject({ lecture: 3, lectures: [], chapter: undefined })
    expect(resolveTarget(ix, 'lem:leaves')?.href).toBe('/theory/trees/leaves#lem-leaves')
    expect(resolveTarget(ix, 'theory/trees/leaves')).toEqual({ href: '/theory/trees/leaves', label: 'Leaves' })
    expect(ix.problems).toEqual([])
  })

  it('reports a page that is neither a concept page nor a lecture page', () => {
    const ix = loadContent(site({ 'content/theory/x/y.md': ['---', 'title: Y', '---'] }))
    expect(ix.problems.map(p => p.message)).toEqual(['page has neither chapter (concept page) nor a numeric lecture (lecture page)'])
  })

  it('records the first and last line of containers and figures', () => {
    const ix = loadContent(site({
      'content/theory/03-trees.md': [
        ...lecture,                      // lines 1-6
        '::: theorem {#thm:a}',          // 7
        'A.',
        '```graph id=t03-f',             // 9
        'a - b',
        '```',                           // 11
        ':::',                           // 12
        '   ::: definition {#def:b}',    // 13: indented up to 3 spaces still opens a container
        '   B.',
        '   :::',                        // 15
      ],
    }))
    expect(ix.byId.get('thm:a')).toMatchObject({ line: 7, endLine: 12 })
    expect(ix.figureById.get('t03-f')).toMatchObject({ line: 9, endLine: 11, parentId: 'thm:a' })
    expect(ix.byId.get('def:b')).toMatchObject({ line: 13, endLine: 15, body: '   B.' })
    expect(ix.problems).toEqual([])
  })

  it('attaches a proof to the last statement among its siblings, not to a claim inside an earlier proof', () => {
    const ix = loadContent(site({
      'content/theory/03-trees.md': [
        ...lecture,
        '::: proof', 'Orphan.', ':::',
        '::: theorem {#thm:a}', 'A.', ':::',
        ':::: proof', '::: claim {#claim:c}', 'C.', ':::', '::: proof', 'Of C.', ':::', '::::',
        '::: proof {title="Second proof"}', 'Again A.', ':::',
      ],
    }))
    const proofs = ix.containers.filter(c => c.type === 'proof').map(c => [c.body.split('\n')[0], c.forId])
    expect(proofs).toEqual([['Orphan.', undefined], ['::: claim {#claim:c}', 'thm:a'], ['Of C.', 'claim:c'], ['Again A.', 'thm:a']])
    expect(ix.problems.map(p => [p.line, p.message])).toEqual([[7, 'proof without a preceding statement or for=']])
  })

  it('rebuilds when a content file, a new folder or topics.yaml changes, and only then', () => {
    const root = site({ 'content/theory/03-trees.md': lecture, 'content/topics.yaml': ['[]'] })
    const first = loadContent(root)
    expect(loadContent(root)).toBe(first)
    const later = new Date(Date.now() + 60_000)
    fs.utimesSync(path.join(root, 'content/topics.yaml'), later, later)
    const second = loadContent(root)
    expect(second).not.toBe(first)
    fs.mkdirSync(path.join(root, 'content/theory/trees'))
    fs.writeFileSync(path.join(root, 'content/theory/trees/leaves.md'), concept.join('\n'))
    const third = loadContent(root)
    expect(third).not.toBe(second)
    expect(third.lessons.map(l => l.path)).toContain('theory/trees/leaves')
  })
})

describe('lectureLessons and courseChapters', () => {
  const page = (order: number, chapter = 'trees') => ['---', `title: P${order}`, 'course: theory', `chapter: ${chapter}`, `order: ${order}`, '---']
  const ix = loadContent(site({
    'content/theory/03-trees.md': [...lecture, 'Text.'],
    'content/theory/trees/b.md': page(2),
    'content/theory/trees/a.md': page(1),
    'content/theory/degrees/c.md': page(1, 'degrees'),
  }))
  const topic = (slug: string, course: 'theory' | 'algorithms'): Topic => ({ slug, course, title: slug, intro: '', ids: [] })
  it('lists only lecture pages', () => {
    expect(lectureLessons(ix).map(l => l.path)).toEqual(['theory/03-trees'])
  })
  it('groups concept pages by chapter in topics order and page order, leaving out empty chapters', () => {
    const topics = [topic('trees', 'theory'), topic('empty', 'theory'), topic('degrees', 'theory'), topic('mst', 'algorithms')]
    expect(courseChapters(ix, topics, 'theory').map(c => [c.topic.slug, c.pages.map(p => p.path)]))
      .toEqual([['trees', ['theory/trees/a', 'theory/trees/b']], ['degrees', ['theory/degrees/c']]])
    expect(courseChapters(ix, topics, 'algorithms')).toEqual([])
  })
})
