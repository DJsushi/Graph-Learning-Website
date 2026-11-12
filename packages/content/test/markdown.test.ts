import { expect, it, vi } from 'vitest'
import { createMarkdownRenderer } from 'vitepress'
import * as content from '../index'
import { setupMarkdown, proofOnConceptPage } from '../../../.vitepress/markdown'

vi.mock('../index', async importOriginal => {
  const real = await importOriginal<typeof import('../index')>()
  return { ...real, loadContent: vi.fn(real.loadContent) }
})

it('loads the content index once per page render, however many refs, figures and containers', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const load = vi.mocked(content.loadContent)
  load.mockClear()
  const html = md.render([
    'See [[def:graph]] and [[def:degree]].',
    '',
    '::: definition {#def:graph}',
    'Text with [[lem:handshake]].',
    ':::',
    '',
    '```graph id=a01-example-graph',
    'caption: [[def:graph]]',
    '```',
  ].join('\n'), { frontmatter: { course: 'theory' } })
  expect(html).toContain('class="ga-ref">Definition')
  expect(load).toHaveBeenCalledTimes(1)
  md.render('[[def:graph]]', {})
  expect(load).toHaveBeenCalledTimes(2)
}, 30_000)

it('heads a box with kind, title and the source tag, without a number', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const html = md.render(['::: theorem {#thm:x title="Cut property" source="algorithms/01 p5"}', 'Text.', ':::'].join('\n'), { frontmatter: { course: 'theory' } })
  expect(html).toContain('<span class="ga-box-kind">Theorem</span> · <span class="ga-box-title">Cut property</span>')
  expect(html).toContain('Slides 01, p. 5')
  expect(html).not.toMatch(/Theorem [TA]?\d/)
}, 30_000)

it('closes long proofs on concept pages and keeps short ones open', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const proof = (n: number) => ['::: theorem {#thm:x}', 'T.', ':::', '', '::: proof', ...Array.from({ length: n }, (_, i) => `Line ${i}.`), ':::'].join('\n')
  const concept = { frontmatter: { chapter: 'trees' } }
  expect(md.render(proof(10), concept)).toContain('<details class="ga-proof" open><summary>Proof</summary>')
  expect(md.render(proof(11), concept)).toContain('<details class="ga-proof"><summary>Proof</summary>')
  // lecture pages keep today's behaviour
  expect(md.render(proof(11), { frontmatter: { lecture: 1 } })).toContain('<details class="ga-proof" open>')
}, 30_000)

it('names a proof with a walkthrough "Compact proof" and closes it', () => {
  expect(proofOnConceptPage(3, true)).toEqual({ closed: true, summary: 'Compact proof' })
  expect(proofOnConceptPage(3, false)).toEqual({ closed: false, summary: 'Proof' })
})

it('renders [[fig:id#mark|text]] as a MarkLink and leaves it out when the text is missing', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const html = md.render('See [[fig:a01-x#S|the $k$ edges]].', {})
  expect(html).toContain('<MarkLink fig="a01-x" mark="S">')
  expect(html).toContain('</MarkLink>')
  expect(md.render('See [[fig:a01-x#S]].', {})).toContain('ga-ref-broken')
}, 30_000)

it('renders a walkthrough with a figure as steps that drive it, and closes the proof it explains', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const page = (wtFor: string) => [
    '::: theorem {#thm:x}', 'T.', ':::', '',
    `:::: walkthrough {for=${wtFor}}`, '```graph id=a01-wt widget=stepper', 'a -- b', 'step: One.', 'step: Two.', '```', '',
    '::: step', 'First [[fig:a01-wt#S|the set]].', ':::', '', '::: step', 'Second.', ':::', '::::', '',
    '::: proof', 'By [[lem:handshake]] and [[thm:x]].', ':::',
  ].join('\n')
  const html = md.render(page('thm:x'), { frontmatter: { chapter: 'trees' } })
  expect(html).toContain('<Walkthrough>')
  expect(html).toMatch(/<ol class="ga-wt-steps"><WalkthroughStep :index="0">[\s\S]*<\/WalkthroughStep>\s*<WalkthroughStep :index="1">[\s\S]*<\/WalkthroughStep><\/ol>\s*<\/Walkthrough>/)
  expect(html).toContain('<details class="ga-proof"><summary>Compact proof</summary>')
  expect(html).toMatch(/<p class="ga-wt-uses">This proof uses: <a class="ga-ref" href="\/[^"]+">Lemma[^<]*<\/a><\/p>/)
  // a walkthrough for another statement leaves the proof alone
  const other = md.render(page('thm:y'), { frontmatter: { chapter: 'trees' } })
  expect(other).toContain('<details class="ga-proof" open><summary>Proof</summary>')
  expect(other).not.toContain('This proof uses')
}, 30_000)

it('renders a walkthrough without a figure as a numbered list', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { attrs: { disable: true }, config: m => setupMarkdown(m) })
  const html = md.render([':::: walkthrough', '::: step', 'One.', ':::', '::: step', 'Two.', ':::', '::::'].join('\n'), {})
  expect(html).toMatch(/<div class="ga-walkthrough ga-wt-plain">\s*<ol class="ga-wt-steps"><li class="ga-wt-step">[\s\S]*<\/li>\s*<li class="ga-wt-step">[\s\S]*<\/li><\/ol>\s*<\/div>/)
  expect(html).not.toContain('Walkthrough')
}, 30_000)
