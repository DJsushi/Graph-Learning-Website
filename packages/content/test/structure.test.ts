import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent, type Topic } from '../index'
import { structureChecks } from '../structure'

const topics: Topic[] = [{ slug: 'trees', course: 'theory', title: 'Trees', intro: '', ids: [] }]
const lecture = ['---', 'title: Trees', 'course: theory', 'lecture: 3', 'slug: t03', 'status: draft', '---']
const concept = (body: string[] = []) => ['---', 'title: Leaves', 'course: theory', 'chapter: trees', 'order: 1', 'lectures: [t03]', 'stage: split', 'status: draft', '---', ...body]
const run = (files: Record<string, string[]>) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'structure-'))
  for (const [f, lines] of Object.entries({ 'content/theory/03-trees.md': lecture, ...files })) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true })
    fs.writeFileSync(path.join(root, f), lines.join('\n'))
  }
  return structureChecks(root, loadContent(root), topics)
}

describe('structureChecks', () => {
  it('accepts a clean lecture and concept page', () => {
    expect(run({ 'content/theory/trees/leaves.md': concept(['Text.']) })).toEqual({ errors: [], warnings: [] })
  })

  it('checks chapter, order, lectures and required fields of a concept page', () => {
    const bad = concept().filter(l => !l.startsWith('stage')).map(l => l.replace('chapter: trees', 'chapter: nope').replace('[t03]', '[zz]'))
    const { errors } = run({
      'content/theory/trees/a.md': bad,
      'content/theory/trees/b.md': concept(),
      'content/theory/trees/c.md': concept(),
    })
    expect(errors).toEqual([
      'content/theory/trees/a.md frontmatter lacks stage',
      'content/theory/trees/a.md unknown chapter nope (not a theory topic of content/topics.yaml)',
      'content/theory/trees/a.md lectures: zz is not the slug of a theory lecture file',
      'content/theory/trees/c.md order 1 in chapter trees is also used by content/theory/trees/b.md',
    ])
  })

  it('accepts audited as a date and rejects anything else', () => {
    const withAudit = (v: string) => concept(['Text.']).map(l => (l === 'status: draft' ? `status: draft\naudited: ${v}` : l))
    expect(run({ 'content/theory/trees/a.md': withAudit('2026-11-13') }).errors).toEqual([])
    expect(run({ 'content/theory/trees/a.md': withAudit('yes') }).errors).toEqual(['content/theory/trees/a.md audited: yes is not a date like 2026-11-13'])
  })

  it('reports duplicate slug and lecture number', () => {
    const { errors } = run({ 'content/theory/04-x.md': lecture })
    expect(errors).toEqual(['content/theory/04-x.md slug t03 is also used by content/theory/03-trees.md', 'content/theory/04-x.md lecture 3 is also used by content/theory/03-trees.md'])
  })

  it('checks id prefixes, anchors, figure prefixes and fences', () => {
    const { errors } = run({
      'content/theory/trees/p.md': concept([
        '::: theorem {#lem:a.b}', 'T.', ':::',
        '::: lemma {#lem:a-b}', 'L.', ':::',
        '  ::: observation {#obs:x}', 'O.', ':::',
        '```graph id=bad-fig', '1 -- 2', '```',
      ]),
    })
    expect(errors).toEqual([
      'content/theory/trees/p.md:10 theorem id lem:a.b should start with thm:',
      'content/theory/trees/p.md:13 ids lem:a.b and lem:a-b give the same anchor #lem-a-b',
      'content/theory/trees/p.md:16 container fence must start at column 0',
      'content/theory/trees/p.md:19 figure id bad-fig should start with t03-',
    ])
  })

  it('requires an id and an explanation on every quiz', () => {
    const { errors } = run({
      'content/theory/trees/q.md': concept([':::: quiz', 'Q?', 'answer: 1', '::::', ':::: quiz {#q:ok}', 'Q?', '::: explanation', 'Because.', ':::', '::::']),
    })
    expect(errors).toEqual(['content/theory/trees/q.md:10 quiz without id', 'content/theory/trees/q.md:10 quiz (no id) without explanation'])
  })

  it('warns about proofs without walkthrough, longest first, and about missing figures', () => {
    const { warnings } = run({
      'content/theory/trees/w.md': concept([
        '::: lemma {#lem:a}', 'A.', ':::', '::: proof', 'P.', ':::',
        '::: lemma {#lem:b}', 'B.', ':::', '::: proof', 'P1.', 'P2.', 'P3.', ':::',
      ]),
    })
    expect(warnings).toEqual([
      'content/theory/trees/w.md:19 proof of lem:b (3 lines) has no walkthrough',
      'content/theory/trees/w.md:13 proof of lem:a (1 lines) has no walkthrough',
      'content/theory/trees/w.md 0 figures for 2 reference entries',
    ])
  })

  describe('walkthroughs', () => {
    const fig = (extra = '', n = 2) => ['```graph id=t03-wt widget=stepper' + extra, '1 -- 2', ...Array.from({ length: n }, (_, i) => `step: S${i}.`), '```']
    const step = (t = 'Text.') => ['::: step', t, ':::']
    const wt = (head: string, inner: string[], proof = ['P.']) => run({
      'content/theory/trees/w.md': concept(['::: lemma {#lem:a}', 'A.', ':::', ...head ? [`:::: walkthrough {${head}}`, ...inner, '::::'] : [], '::: proof', ...proof, ':::']),
    })
    const msgs = (r: ReturnType<typeof run>) => [...r.errors, ...r.warnings].map(m => m.replace(/^content\/theory\/trees\/w.md:\d+ /, ''))

    it('accepts a walkthrough with a stepper figure and matching steps, and finds the proof by for=', () => {
      const r = wt('for=lem:a', [...fig(), ...step(), ...step()])
      expect(r.errors).toEqual([])
      expect(r.warnings.filter(w => w.includes('no walkthrough'))).toEqual([])
    })

    it('rejects a for= that is not a statement on the page', () => {
      expect(msgs(wt('for=lem:zz', [...fig(), ...step(), ...step()]))).toContain('walkthrough for=lem:zz does not name a statement on this page')
    })

    it('errors on a long proof without figure, warns otherwise', () => {
      const long = Array.from({ length: 11 }, () => 'L.')
      expect(msgs(wt('for=lem:a', step(), long))).toContain('walkthrough for a proof of 11 lines has no figure')
      expect(msgs(wt('for=lem:a', step()))).toContain('walkthrough has no figure')
    })

    it('checks the position and widget of the figure and the number of steps', () => {
      const m = msgs(wt('for=lem:a', ['Intro.', ...fig().map(l => l.replace(' widget=stepper', '')), ...step()]))
      expect(m).toContain('figure t03-wt is not the first child of its walkthrough')
      expect(m).toContain('figure t03-wt in a walkthrough needs widget=stepper')
      expect(m).toContain('walkthrough has 1 step blocks but its figure has 2 step: lines')
    })

    it('limits a step to 60 words', () => {
      expect(msgs(wt('for=lem:a', [...fig('', 1), ...step('w '.repeat(61))]))).toEqual(['step has 61 words (at most 60)'])
      expect(wt('for=lem:a', [...fig('', 1), ...step('w '.repeat(60))]).errors).toEqual([])
    })
  })
})
