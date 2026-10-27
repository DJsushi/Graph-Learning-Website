// Local search for the topic pages. They are dynamic routes with no file on disk, which VitePress indexes as
// empty, so their sections are rendered here (the splitting follows VitePress's own splitPageIntoSections).
import fs from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, type MarkdownRenderer } from 'vitepress'
import { loadContent, loadTopics } from '../packages/content/index'
import { topicMarkdown } from '../packages/content/pages'
import { ROOT, setupMarkdown } from './markdown'
import { BASE } from './base'

let md: Promise<MarkdownRenderer> | undefined
const clearTags = (s: string) => s.replace(/<[^>]*>/g, '')

export async function topicSections(file: string) {
  const slug = /site\/reference\/([\w-]+)\.md$/.exec(file)?.[1]
  const topics = loadTopics(ROOT)
  if (!slug || !topics.some(t => t.slug === slug)) return undefined
  md ??= createMarkdownRenderer(ROOT, { attrs: { disable: true }, config: m => setupMarkdown(m) }, BASE)
  const template = fs.readFileSync(path.join(ROOT, 'site/reference/[topic].md'), 'utf8')
  const src = template.replace('<!-- @content -->', topicMarkdown(loadContent(ROOT), topics, slug))
  const html = (await md).render(src, { relativePath: `reference/${slug}.md` })
  const parts = html.split(/<h(\d*).*?>(.*?<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi).slice(1)
  const sections: { anchor: string; titles: string[]; text: string }[] = []
  let parents: string[] = []
  for (let i = 0; i < parts.length; i += 3) {
    const level = parseInt(parts[i]) - 1
    const m = /(.*?)<a.*? href="#(.*?)".*?>.*?<\/a>/i.exec(parts[i + 1])
    const title = clearTags(m?.[1] ?? '').trim()
    if (!title || !parts[i + 2]) continue
    const titles = [...parents.slice(0, level), title].filter(Boolean)
    sections.push({ anchor: m?.[2] ?? '', titles, text: clearTags(parts[i + 2]) })
    parents = [...parents.slice(0, level)]
    parents[level] = title
  }
  return sections
}
