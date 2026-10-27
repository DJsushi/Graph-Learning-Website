// Build-time previews for [[ref]] links: the rendered statement of every referable container, keyed by its anchor.
// Reference entries (those in content/topics.yaml) also carry the fields of the reference search.
import path from 'node:path'
import { createMarkdownRenderer, defineLoader } from 'vitepress'
import { anchorId, containerLabel, loadContent, loadTopics, resolveTarget } from '../../packages/content/index'
import { REFERENCE_KINDS } from '../../packages/content/pages'
import { inlineMath, setupMarkdown } from '../markdown'
import { BASE } from '../base'

export interface RefEntry {
  label: string; title: string; aka: string; defines: string
  kind: string; course: 'theory' | 'algorithms'; topic: string; text: string; link: string
}
export interface RefPreview { head: string; html: string; lesson: string; entry?: RefEntry }
declare const data: Record<string, RefPreview>
export { data }

const SKIP = new Set(['proof', 'quiz', 'hint', 'solution', 'explanation'])

export default defineLoader({
  watch: ['../../content/**/*.md', '../../content/topics.yaml'],
  async load(): Promise<Record<string, RefPreview>> {
    const root = path.resolve(__dirname, '../..')
    const ix = loadContent(root)
    const md = await createMarkdownRenderer(path.join(root, 'content'), { attrs: { disable: true }, config: m => setupMarkdown(m) }, BASE)
    const topicOf = new Map(loadTopics(root).flatMap(t => t.ids.map(id => [id, t] as const)))
    const kindOf = (type: string) => Object.keys(REFERENCE_KINDS).find(k => REFERENCE_KINDS[k].types.includes(type))!
    // plain text for matching: no figures, code or math; [[refs]] become their labels
    const plain = (s: string) => s.replace(/```[\s\S]*?```/g, ' ').replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' ')
      .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, t: string, l?: string) => l ?? resolveTarget(ix, t.trim())?.label ?? '')
      .replace(/\{[^}]*\}|[*_#>`:|\[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
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
      const t = topicOf.get(c.id)
      if (t) out[anchorId(c.id)].entry = {
        label: c.number ? `${c.lesson.course === 'theory' ? 'T' : 'A'}${c.number}` : '', title: c.title ?? '',
        aka: c.attrs.aka ?? '', defines: c.attrs.defines ?? '', kind: kindOf(c.type), course: c.lesson.course,
        topic: t.title, text: plain(c.body), link: `/reference/${t.slug}#${anchorId(c.id)}`,
      }
    }
    return out
  },
})
