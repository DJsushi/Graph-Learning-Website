// Build-time previews for [[ref]] links: the rendered statement of every referable container, keyed by its anchor.
import path from 'node:path'
import { createMarkdownRenderer, defineLoader } from 'vitepress'
import { anchorId, containerLabel, loadContent } from '../../packages/content/index'
import { inlineMath, setupMarkdown } from '../markdown'
import { BASE } from '../base'

export interface RefPreview { head: string; html: string; lesson: string }
declare const data: Record<string, RefPreview>
export { data }

const SKIP = new Set(['proof', 'quiz', 'hint', 'solution', 'explanation'])

export default defineLoader({
  watch: ['../../content/**/*.md'],
  async load(): Promise<Record<string, RefPreview>> {
    const root = path.resolve(__dirname, '../..')
    const ix = loadContent(root)
    const md = await createMarkdownRenderer(path.join(root, 'content'), { attrs: { disable: true }, config: m => setupMarkdown(m) }, BASE)
    const out: Record<string, RefPreview> = {}
    for (const c of ix.containers) {
      if (!c.id || SKIP.has(c.type)) continue
      const env = { frontmatter: { course: c.lesson.course }, relativePath: `${c.lesson.path}.md` }
      // figures are interactive components; the popover only shows the text
      const body = c.body.replace(/```graph[\s\S]*?```/g, '*(figure in the lesson)*')
      out[anchorId(c.id)] = {
        head: `${containerLabel(c)}${c.attrs.title ? ` (${inlineMath(c.attrs.title)})` : ''}`,
        html: md.render(body, env),
        lesson: `${c.lesson.course === 'theory' ? 'Graph Theory' : 'Graph Algorithms'} · Lesson ${c.lesson.lecture}`,
      }
    }
    return out
  },
})
