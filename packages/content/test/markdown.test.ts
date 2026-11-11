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
