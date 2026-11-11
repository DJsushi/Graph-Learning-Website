// One-time split of the lecture files into concept pages, driven by scripts/split-map.yaml (RESTRUCTURE.md §4.1).
// Run: node --import tsx scripts/split.ts [--root <dir>]     (delete this file and the map after the split, T1.8)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { loadContent } from '../packages/content/index'
import type { ContentIndex, Lesson } from '../packages/content/index'

export interface Entry { page?: string; title?: string; from?: string; stay?: string }
export interface PageOut { page: string; title: string; body: string }

const blank = (l: string) => !l.trim()
const trimBlank = (ls: string[]) => {
  let a = 0, b = ls.length
  while (a < b && blank(ls[a])) a++
  while (b > a && blank(ls[b - 1])) b--
  return ls.slice(a, b)
}

/** Cuts one lecture into pages. Returns the page bodies (no frontmatter) and the shortened lecture text. */
export function splitLecture(ix: ContentIndex, lesson: Lesson, entries: Entry[]): { pages: PageOut[]; lecture: string } {
  const where = path.relative(path.dirname(path.dirname(lesson.file)), lesson.file)
  const fail = (msg: string): never => { throw new Error(`${where}: ${msg}`) }
  const lines = lesson.source.split('\n')
  const offset = lines.length - matter(lesson.source).content.split('\n').length

  // headings outside code fences, as line index -> text
  const headings = new Map<number, string>()
  let fence = ''
  for (let i = offset; i < lines.length; i++) {
    const f = /^\s*(`{3,}|~{3,})/.exec(lines[i])
    if (f) { if (!fence) fence = f[1]; else if (new RegExp(`^${fence[0]}{${fence.length},}$`).test(lines[i].trim())) fence = ''; continue }
    if (!fence && /^#{1,6} /.test(lines[i])) headings.set(i, lines[i].trimEnd())
  }
  const findHeading = (text: string) => {
    const hits = [...headings].filter(([, t]) => t === text).map(([i]) => i)
    if (hits.length !== 1) fail(`heading "${text}" found ${hits.length} times, need exactly 1`)
    return hits[0]
  }
  const ends = [...ix.containers, ...ix.figures].filter(x => x.lesson === lesson).map(x => ({ line: x.line, end: x.endLine }))
  const findId = (id: string) => {
    const c = ix.byId.get(id)
    if (!c || c.lesson !== lesson) return fail(`anchor ${id} is not a container of this file`)
    if (c.parentId) fail(`anchor ${id} is nested in ${c.parentId}`)
    // first line after the previous container or figure that ends before c
    return Math.max(offset, ...ends.filter(e => e.end < c.line).map(e => e.end))
  }

  const pages = entries.filter(e => e.page)
  const stay = entries.find(e => e.stay)
  const cuts = pages.map(e => {
    if (!e.from || !e.title) fail(`entry ${e.page} needs title and from`)
    return e.from!.startsWith('#') ? findHeading(e.from!) : findId(e.from!)
  })
  const stayAt = stay ? findHeading(stay.stay!) : lines.length
  const all = [...cuts, stayAt]
  for (let i = 1; i < all.length; i++)
    if (all[i] <= all[i - 1]) fail(`${i < cuts.length ? pages[i].page : 'stay'} starts at or before ${pages[i - 1].page} (check the order and the anchors in the map)`)
  if (!pages.length) fail('no pages in the map')

  const out = pages.map((e, i) => {
    const region = lines.slice(cuts[i], all[i + 1])
    if (headings.has(cuts[i])) region.shift()   // the title replaces the heading
    return { page: e.page!, title: e.title!, body: trimBlank(region).join('\n') + '\n' }
  })
  const lecture = [...trimBlank(lines.slice(0, cuts[0])), '', ...lines.slice(stayAt)].join('\n')
  return { pages: out, lecture: lecture.endsWith('\n') ? lecture : lecture + '\n' }
}

/** Reads the map and writes the pages and the shortened lecture files. Nothing is written when any file fails. */
export function runSplit(root: string, mapFile: string): string[] {
  const map = ((matter as any).engines.yaml.parse(fs.readFileSync(mapFile, 'utf8')) ?? {}) as Record<string, Entry[]>
  const ix = loadContent(root)
  const writes: [string, string][] = []
  const seen = new Set<string>()
  const orders = new Map<string, number>()
  for (const [file, entries] of Object.entries(map)) {
    const lesson = ix.lessons.find(l => path.relative(root, l.file) === file)
    if (!lesson) throw new Error(`${file}: not a lecture file`)
    if (lesson.kind !== 'lecture') throw new Error(`${file}: is a concept page, not a lecture`)
    const { pages, lecture } = splitLecture(ix, lesson, entries)
    for (const p of pages) {
      const [chapter, name, ...rest] = p.page.split('/')
      if (!chapter || !name || rest.length) throw new Error(`${file}: page "${p.page}" must be <chapter>/<name>`)
      if (seen.has(p.page)) throw new Error(`${file}: page ${p.page} is in the map twice`)
      seen.add(p.page)
      const target = path.join(root, 'content', lesson.course, `${p.page}.md`)
      if (fs.existsSync(target)) throw new Error(`${file}: ${path.relative(root, target)} already exists`)
      const key = `${lesson.course}/${chapter}`
      const order = (orders.get(key) ?? 0) + 1
      orders.set(key, order)
      const fm = ['---', `title: ${JSON.stringify(p.title)}`, `course: ${lesson.course}`, `chapter: ${chapter}`, `order: ${order}`,
        `lectures: [${lesson.slug}]`, 'stage: split', 'status: draft', '---'].join('\n')
      writes.push([target, `${fm}\n\n${p.body}`])
    }
    // frontmatter and the text before the first page are kept as they are
    writes.push([lesson.file, lecture])
  }
  for (const [f, text] of writes) {
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, text)
  }
  return writes.map(([f]) => path.relative(root, f))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const i = process.argv.indexOf('--root')
  const root = i > 0 ? path.resolve(process.argv[i + 1]) : path.resolve(here, '..')
  try {
    const files = runSplit(root, path.join(here, 'split-map.yaml'))
    console.log(`wrote ${files.length} files`)
  } catch (e) {
    console.error(`error: ${(e as Error).message}`)
    process.exit(1)
  }
}
