import { expect, it, vi } from 'vitest'
import { createMarkdownRenderer } from 'vitepress'
import * as content from '../index'
import { setupMarkdown } from '../../../.vitepress/markdown'

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
