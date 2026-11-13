import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../index'
import { budgetChecks, measure, readingPath } from '../budget'

const run = (files: Record<string, string>) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'budget-'))
  for (const [f, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true })
    fs.writeFileSync(path.join(root, f), text)
  }
  return { root, ix: loadContent(root) }
}
const page = (over: Record<string, string> = {}, body = '') => [
  '---', ...Object.entries({ title: 'Leaves', course: 'theory', chapter: 'trees', order: '1', lectures: '[t03]', stage: 'taught', status: 'draft', goal: 'Find the leaves.', ...over })
    .filter(([, v]) => v !== '').map(([k, v]) => `${k}: ${v}`), '---', body,
].join('\n')
const good = [
  'Which vertices of the tree have degree 1?', '',
  '```graph id=t03-a', '1 -- 2', '```', '',
  '```graph id=t03-b widget=stepper', '1 -- 2', 'step: one', '```', '',
  '::: definition {#def:leaf}', 'A leaf has degree $1$ and $\\sum_v d(v)$ and $x^2+y^2$ and $a_{ij}b$ and $z\\cdot w$.', ':::',
  '::: intuition', 'A leaf is a dead end.', ':::',
  ':::: walkthrough {for=def:leaf}', '::: step', 'Step.', ':::', '::::',
  '::: quiz {#q:a}', 'Q?', '::: explanation', 'Because.', ':::', ':::',
].join('\n')
const errorsOf = (text: string, extra: Record<string, string> = {}) => {
  const { root, ix } = run({ 'content/theory/trees/leaves.md': text, ...extra })
  return budgetChecks(root, ix).errors.map(e => e.replace('content/theory/trees/leaves.md', 'P'))
}

describe('measure', () => {
  it('counts words and splits light from heavy spans', () => {
    expect(measure('Let $P$, $v_1$, $K_{3,3}$, $n-1$, $4$, $x\'$ be [[def:a|nice things]] <!-- skip me -->.')).toEqual({ words: 4, spans: 6, heavy: 0 })
    expect(measure('$\\sum_v d(v)$ and $$x^2$$ and $a+b+c$ and $ab$')).toEqual({ words: 3, spans: 4, heavy: 4 })
  })
})

describe('readingPath', () => {
  it('leaves out statements, proofs, fences, comments and ## More', () => {
    const { ix } = run({ 'content/theory/trees/leaves.md': page({}, [
      'Intro words.', '::: definition {#def:a}', 'Hidden.', ':::', '```graph id=t03-x', 'hidden fence', '```',
      '::: pitfall', 'Shown here.', ':::', '## More', 'Hidden more.', '## Next', 'Back.',
    ].join('\n')) })
    const text = readingPath(ix, ix.lessons[0]).text.split('\n').map(s => s.trim()).filter(Boolean)
    expect(text).toEqual(['Intro words.', 'Shown here.', 'Next', 'Back.'])
  })
})

describe('budgetChecks', () => {
  it('accepts a page inside every budget and skips split pages', () => {
    expect(errorsOf(page({}, good))).toEqual([])
    expect(errorsOf(page({ stage: 'split' }, 'Text.'))).toEqual([])
  })

  it('reports the structure rules E1 to E3, E6, E8, E9', () => {
    const stmt = (id: string, intuition: string) => `::: theorem {#thm:${id}}\nT.\n:::\n::: intuition\n${intuition}\n:::\n::: proof\nP.\n:::`
    const body = [
      '::: definition {#def:a}', 'A.', ':::', '::: definition {#def:b}', 'B.', ':::', '::: definition {#def:c}', 'C.', ':::',
      stmt('t', 'word '.repeat(51)), stmt('u', 'Fine.'), stmt('v', 'Fine.'), stmt('w', 'Fine $\\sum$ $\\sum$.'),
      '```graph id=t03-a', '1 -- 2', '```',
    ].join('\n')
    const e = errorsOf(page({}, body))
    expect(e).toContain('P:11 the first graph block must come before the first statement (definition on line 11)')
    expect(e).toContain('P needs at least 2 graph blocks, one of them not widget=figure (has 1)')
    expect(e).toContain('P 3 definitions (at most 2)')
    expect(e).toContain('P 4 statements besides definitions (at most 3)')
    expect(e).toContain('P:26 proof of thm:t has no walkthrough with for=thm:t')
    expect(e).toContain('P:23 intuition of thm:t has 51 words (at most 50)')
    expect(e).toContain('P:50 intuition of thm:w has 2 heavy math spans (at most 1)')
    expect(e).toContain('P:11 def:a has no intuition')
    expect(e).toContain('P has no quiz and no graph exercise')
  })

  it('reports reading path size and math density E4, E5 and step spans E7', () => {
    const e = errorsOf(page({}, [good, 'word '.repeat(901), '$\\sum$ $\\sum$ $\\sum$ $\\sum$', ':::: walkthrough', '::: step', '$\\sum$ $\\sum$ $\\sum$', ':::', '::::'].join('\n')))
    expect(e.some(x => /^P reading path has \d+ words \(at most 900, 1400 with long: true\)$/.test(x))).toBe(true)
    expect(e.some(x => x.includes('heavy math spans (at most 3)'))).toBe(true)
    expect(e.some(x => x.endsWith('step has 3 heavy math spans (at most 2)'))).toBe(true)
    expect(errorsOf(page({ long: 'true' }, [good, 'word '.repeat(901)].join('\n')))).toEqual([])
    expect(errorsOf(page({}, [good, '$a$ '.repeat(10)].join('\n')))[0]).toMatch(/math spans in .* words/)
  })

  it('checks goal, needs and forward references E10, E11', () => {
    const ref = (t: string) => [good, `See [[${t}|there]].`].join('\n')
    const other = (needs: string) => ({
      'content/theory/trees/other.md': page({ order: '2', needs, stage: 'split' }, '::: theorem {#thm:other}\nT.\n:::\n'),
      'content/theory/03-trees.md': '---\ntitle: L\ncourse: theory\nlecture: 3\nslug: t03\nstatus: draft\n---\n::: theorem {#thm:lec}\nT.\n:::\n',
    })
    expect(errorsOf(page({ goal: '' }, good))).toEqual(['P frontmatter lacks goal'])
    expect(errorsOf(page({ goal: 'w '.repeat(26) }, good))).toEqual(['P goal has 26 words (at most 25)'])
    expect(errorsOf(page({ needs: '[theory/trees/nope]' }, good))).toEqual(['P needs: theory/trees/nope is not a page'])
    expect(errorsOf(page({ needs: '[theory/trees/other]' }, good), other('[theory/trees/leaves]'))).toEqual(['P needs has a cycle through this page'])
    expect(errorsOf(page({}, ref('thm:other')), other('[]'))[0]).toMatch(/^P:\d+ forward reference \[\[thm:other\]\]/)
    expect(errorsOf(page({ needs: '[theory/trees/other]' }, ref('thm:other')), other('[]'))).toEqual([])
    expect(errorsOf(page({}, ref('thm:lec')), other('[]'))).toEqual([])
    expect(errorsOf(page({}, [good, 'See [[thm:other|there]].', '## More', 'Also [[thm:other|there]].'].join('\n')), other('[]')).length).toBe(1)
  })
})
