// Scans content/{theory,algorithms}/**/*.md: lecture and concept pages, theorem-like containers (with numbering), graph figures, pseudocode, references.
// Shared by the VitePress config (numbering, [[refs]]), the data loaders and scripts/validate-content.ts.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { parseKV } from '../graph-core/src/dsl/parser'

export type Course = 'theory' | 'algorithms'

export interface Lesson {
  path: string          // e.g. "theory/01-basic-notions" or "theory/trees/leaves" (URL path without leading slash)
  file: string
  kind: 'lecture' | 'concept'   // concept page: frontmatter has `chapter`; lecture page: numeric `lecture`
  course: Course
  lecture: number       // 0 on a concept page
  chapter?: string      // concept page: chapter slug from topics.yaml
  order?: number        // concept page: position in the chapter
  lectures: string[]    // concept page: slugs of the lecture files it comes from
  stage?: string        // concept page: split | taught
  slug: string
  title: string
  summary: string
  status: string
  frontmatter: Record<string, any>
  source: string        // full file text
}

export interface Container {
  type: string
  id?: string
  attrs: Record<string, string>
  title?: string
  lesson: Lesson
  line: number          // first line (the opening fence), 1-based
  endLine: number       // last line (the closing fence)
  body: string          // raw markdown between the fences
  raw: string           // full source including the fences
  parentId?: string
  forId?: string        // for proofs: the statement proved; for intuitions: the reference entry explained
}

export interface Figure { id: string; info: Record<string, string>; source: string; raw: string; lesson: Lesson; line: number; endLine: number; parentId?: string }
export interface Ref { target: string; lesson: Lesson; line: number; text?: string }

export interface ContentIndex {
  lessons: Lesson[]
  containers: Container[]
  byId: Map<string, Container>
  figures: Figure[]
  figureById: Map<string, Figure>
  pseudocode: Map<string, string>   // algorithm container id -> pseudo code
  refs: Ref[]
  unclear: { lesson: Lesson; line: number; text: string }[]
  problems: { lesson?: Lesson; line?: number; message: string }[]
}

export const KIND_NAMES: Record<string, string> = {
  definition: 'Definition', theorem: 'Theorem', lemma: 'Lemma', proposition: 'Proposition', corollary: 'Corollary',
  observation: 'Observation', claim: 'Claim', algorithm: 'Algorithm', example: 'Example', exercise: 'Exercise',
  proof: 'Proof', remark: 'Remark', intuition: 'Intuition', pitfall: 'Pitfall', quiz: 'Quiz',
  hint: 'Hint', solution: 'Solution', explanation: 'Explanation',
}
export const STATEMENT_TYPES = new Set(['theorem', 'lemma', 'proposition', 'corollary', 'observation', 'claim'])
// types that need an id (claims may go without)
const NEEDS_ID = new Set(['theorem', 'lemma', 'proposition', 'corollary', 'observation', 'claim', 'definition', 'algorithm', 'example', 'exercise'])
export const CONTAINER_TYPES = new Set(Object.keys(KIND_NAMES))
export const COURSE_NAMES: Record<Course, string> = { theory: 'Graph Theory', algorithms: 'Graph Algorithms' }

export function parseContainerInfo(rest: string): { id?: string; attrs: Record<string, string> } {
  const m = /\{(.*)\}\s*$/.exec(rest)
  if (!m) return { attrs: {} }
  const inner = m[1]
  const idm = /(?:^|\s)#([\w:.\-']+)/.exec(inner)
  const attrs = parseKV(inner.replace(/(?:^|\s)#[\w:.\-']+/, ' '))
  return { id: idm?.[1], attrs }
}

export interface Topic { slug: string; course?: Course; title: string; intro: string; ids: string[] }

/** content/topics.yaml: the ordered topic map of the reference. */
export function loadTopics(root: string): Topic[] {
  return (matter as any).engines.yaml.parse(fs.readFileSync(path.join(root, 'content', 'topics.yaml'), 'utf8')) ?? []
}

/** The lecture pages of a course (or of both), in lecture order. Concept pages have `lecture: 0` and are not in this list. */
export function lectureLessons(ix: ContentIndex, course?: Course): Lesson[] {
  return ix.lessons.filter(l => l.kind === 'lecture' && (!course || l.course === course))
    .sort((a, b) => (a.course === b.course ? a.lecture - b.lecture : a.course === 'theory' ? -1 : 1))
}

/** The chapters of a course, in `topics.yaml` order, each with its concept pages by `order`. Chapters without a page are left out. */
export function courseChapters(ix: ContentIndex, topics: Topic[], course: Course): { topic: Topic; pages: Lesson[] }[] {
  return topics.filter(t => t.course === course)
    .map(topic => ({ topic, pages: ix.lessons.filter(l => l.kind === 'concept' && l.course === course && l.chapter === topic.slug).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }))
    .filter(c => c.pages.length)
}

let cached: { root: string; stamp: string; index: ContentIndex } | undefined

/** Rebuilds only when a content file or one of the yaml files changed; callers that ask many times per page
 * (the markdown plugins) should ask once per page, since even the check reads every directory. */
export function loadContent(root: string): ContentIndex {
  const dir = path.join(root, 'content')
  const files: string[] = []
  for (const course of ['theory', 'algorithms']) {
    const d = path.join(dir, course)
    if (!fs.existsSync(d)) continue
    for (const f of (fs.readdirSync(d, { recursive: true }) as string[]).sort())
      if (f.endsWith('.md') && path.basename(f) !== 'index.md') files.push(path.join(d, f))
  }
  const keyed = [...files, ...['topics.yaml', 'notation.yaml', 'techniques.yaml'].map(f => path.join(dir, f)).filter(f => fs.existsSync(f))]
  const stamp = keyed.map(f => `${f}:${fs.statSync(f).mtimeMs}`).join('|')
  if (cached && cached.root === root && cached.stamp === stamp) return cached.index

  const index: ContentIndex = {
    lessons: [], containers: [], byId: new Map(), figures: [], figureById: new Map(),
    pseudocode: new Map(), refs: [], unclear: [], problems: [],
  }
  for (const file of files) scanLesson(file, root, index)
  for (const c of index.containers) {
    if ((c.type === 'proof' || c.type === 'intuition') && c.forId && !index.byId.has(c.forId))
      index.problems.push({ lesson: c.lesson, line: c.line, message: `${c.type} for=${c.forId}: unknown statement` })
  }
  cached = { root, stamp, index }
  return index
}

function scanLesson(file: string, root: string, index: ContentIndex) {
  const text = fs.readFileSync(file, 'utf8')
  const fm = matter(text)
  const rel = path.relative(path.join(root, 'content'), file).replace(/\\/g, '/').replace(/\.md$/, '')
  const course = rel.split('/')[0] as Course
  const kind = fm.data.chapter !== undefined ? 'concept' : 'lecture'
  const lesson: Lesson = {
    path: rel, file, kind, course,
    lecture: kind === 'lecture' ? Number(fm.data.lecture ?? 0) : 0,
    chapter: kind === 'concept' ? String(fm.data.chapter) : undefined,
    order: fm.data.order !== undefined ? Number(fm.data.order) : undefined,
    lectures: Array.isArray(fm.data.lectures) ? fm.data.lectures.map(String) : [],
    stage: fm.data.stage !== undefined ? String(fm.data.stage) : undefined,
    slug: String(fm.data.slug ?? rel),
    title: String(fm.data.title ?? rel),
    summary: String(fm.data.summary ?? ''),
    status: String(fm.data.status ?? 'draft'),
    frontmatter: fm.data,
    source: text,
  }
  index.lessons.push(lesson)
  if (kind === 'lecture' && !Number.isInteger(fm.data.lecture))
    index.problems.push({ lesson, line: 1, message: 'page has neither chapter (concept page) nor a numeric lecture (lecture page)' })
  const lines = text.split('\n')
  const offset = text.split('\n').length - fm.content.split('\n').length
  // lastStatement: the statement a proof without for= proves, the last one among its siblings (S3)
  const stack: { c: Container; colons: number; start: number; lastStatement?: Container }[] = []
  const outer: { lastStatement?: Container } = {}
  const frame = () => stack.at(-1) ?? outer
  let fence: { ch: string; len: number; info: string; start: number; lines: string[] } | undefined
  let lastEntry: Container | undefined   // last reference entry (definition, statement, algorithm), for intuitions
  let currentAlg: Container | undefined

  for (let i = offset; i < lines.length; i++) {
    const line = lines[i]
    const lineNo = i + 1
    if (fence) {
      const close = new RegExp(`^${fence.ch === '`' ? '`' : '~'}{${fence.len},}\\s*$`)
      if (close.test(line.trim())) {
        const info = fence.info.trim()
        if (/^graph(\s|$)/.test(info)) {
          const kv = parseKV(info.slice(5))
          const id = kv.id
          const fig: Figure = { id: id ?? '', info: kv, source: fence.lines.join('\n'), raw: lines.slice(fence.start - 1, i + 1).join('\n'), lesson, line: fence.start, endLine: lineNo, parentId: stack.at(-1)?.c.id }
          if (!id) index.problems.push({ lesson, line: fence.start, message: 'graph block without id' })
          else if (index.figureById.has(id)) index.problems.push({ lesson, line: fence.start, message: `duplicate figure id ${id}` })
          else index.figureById.set(id, fig)
          index.figures.push(fig)
          scanRefs(fence.lines.join('\n'), lesson, fence.start, index)
        } else if (/^pseudo\b/.test(info) && currentAlg?.id) {
          index.pseudocode.set(currentAlg.id, fence.lines.join('\n'))
        }
        fence = undefined
      } else fence.lines.push(line)
      continue
    }
    const fo = /^\s*(`{3,}|~{3,})(.*)$/.exec(line)
    if (fo) { fence = { ch: fo[1][0], len: fo[1].length, info: fo[2], start: lineNo, lines: [] }; continue }

    // up to 3 spaces of indent, as markdown-it-container accepts (S2)
    const open = /^ {0,3}(:{3,})\s*([a-z]+)\b(.*)$/.exec(line)
    if (open && CONTAINER_TYPES.has(open[2])) {
      const [, colons, type, rest] = open
      const { id, attrs } = parseContainerInfo(rest)
      const c: Container = {
        type, id, attrs, title: attrs.title, lesson, line: lineNo, endLine: lineNo, body: '', raw: '',
        parentId: stack.at(-1)?.c.id,
      }
      if (type === 'proof') {
        const stmt = frame().lastStatement
        c.forId = attrs.for ?? stmt?.id
        if (!attrs.for && !stmt) index.problems.push({ lesson, line: lineNo, message: 'proof without a preceding statement or for=' })
      }
      if (type === 'intuition') c.forId = attrs.for ?? lastEntry?.id
      if (STATEMENT_TYPES.has(type)) frame().lastStatement = c
      if (id && (STATEMENT_TYPES.has(type) || type === 'definition' || type === 'algorithm') && type !== 'claim') lastEntry = c
      if (type === 'algorithm') currentAlg = c
      if (id) {
        if (index.byId.has(id)) index.problems.push({ lesson, line: lineNo, message: `duplicate id ${id}` })
        else index.byId.set(id, c)
      } else if (NEEDS_ID.has(type) && type !== 'claim') {
        index.problems.push({ lesson, line: lineNo, message: `${type} without id` })
      }
      index.containers.push(c)
      stack.push({ c, colons: colons.length, start: i + 1 })
      continue
    }
    const close = /^ {0,3}(:{3,})\s*$/.exec(line)
    if (close && stack.length && stack[stack.length - 1].colons <= close[1].length) {
      const top = stack.pop()!
      top.c.body = lines.slice(top.start, i).join('\n')
      top.c.raw = lines.slice(top.start - 1, i + 1).join('\n')
      top.c.endLine = lineNo
      if (top.c.type === 'algorithm') currentAlg = undefined
      continue
    }
    const unclear = /<!--\s*SOURCE UNCLEAR:(.*?)-->/.exec(line)
    if (unclear) index.unclear.push({ lesson, line: lineNo, text: unclear[1].trim() })
    scanRefs(line, lesson, lineNo, index)
  }
  if (stack.length) index.problems.push({ lesson, line: stack[0].c.line, message: `unclosed container ${stack[0].c.type}` })
  if (fence) index.problems.push({ lesson, line: fence.start, message: 'unclosed code fence' })
}

function scanRefs(text: string, lesson: Lesson, line: number, index: ContentIndex) {
  const re = /\[\[([^\]|]+)(\|[^\]]*)?\]\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) index.refs.push({ target: m[1].trim(), lesson, line, text: m[2]?.slice(1) })
}

/** `fig:<figure id>#<mark>` (CONTENT_CONVENTIONS.md 6.1): a link that spotlights a mark of a figure. */
export function parseMarkRef(target: string): { fig: string; mark: string } | undefined {
  const m = /^fig:([^#\s]+)#([A-Za-z0-9_-]+)$/.exec(target)
  return m ? { fig: m[1], mark: m[2] } : undefined
}

/** Resolve a [[target]] to a URL path (without base) and default label. */
export function resolveTarget(index: ContentIndex, target: string): { href: string; label: string } | undefined {
  if (target.startsWith('fig:')) {
    const f = index.figureById.get(target.slice(4))
    if (!f) return undefined
    return { href: `/${f.lesson.path}#fig-${f.id}`, label: 'this figure' }
  }
  const c = index.byId.get(target)
  if (c) {
    const title = c.title ? ` (${c.title})` : ''
    return { href: `/${c.lesson.path}#${anchorId(c.id!)}`, label: `${KIND_NAMES[c.type] ?? c.type}${title}` }
  }
  const l = index.lessons.find(x => x.path === target)
  if (l) return { href: `/${l.path}`, label: l.title }
  return undefined
}

/** HTML id for a container id ("thm:handshake" -> "thm-handshake"), safe in CSS selectors and URLs. */
export function anchorId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, '-')
}

export function containerLabel(c: Container): string {
  return KIND_NAMES[c.type] ?? c.type
}

/** `source` attribute: `<course>/<document> p<pages>`, several joined by "; " (pages: `p5`, `p1–2`, `p6, p5`). */
const SOURCE_PART = /^(theory|algorithms)\/(\S+) (p\d+(?:–\d+)?(?:, p\d+(?:–\d+)?)*)$/
export function sourceTag(source: string): string | undefined {
  const parts = source.split(/;\s*/).map(p => SOURCE_PART.exec(p.trim()))
  if (!parts.length || parts.includes(null)) return undefined
  return parts.map(m => {
    const [, course, doc, pages] = m!
    return `${course === 'theory' ? 'Lecture' : 'Slides'} ${doc}, ${/[–,]/.test(pages) ? 'pp.' : 'p.'} ${pages.replace(/p/g, '')}`
  }).join('; ')
}
