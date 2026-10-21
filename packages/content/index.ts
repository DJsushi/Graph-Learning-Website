// Scans content/**/*.md: lessons, theorem-like containers (with numbering), graph figures, pseudocode, references.
// Shared by the VitePress config (numbering, [[refs]]), the data loaders and scripts/validate-content.ts.
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { parseKV } from '../graph-core/src/dsl/parser'

export type Course = 'theory' | 'algorithms'

export interface Lesson {
  path: string          // e.g. "theory/01-basic-notions" (URL path without leading slash)
  file: string
  course: Course
  lecture: number
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
  number?: string       // e.g. "1.3"
  lesson: Lesson
  line: number
  body: string          // raw markdown between the fences
  parentId?: string
  forId?: string        // for proofs: the statement proved
}

export interface Figure { id: string; info: Record<string, string>; source: string; lesson: Lesson; line: number }
export interface Ref { target: string; lesson: Lesson; line: number }

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
const COUNTER: Record<string, string> = {
  theorem: 'stmt', lemma: 'stmt', proposition: 'stmt', corollary: 'stmt', observation: 'stmt', claim: 'stmt',
  definition: 'def', algorithm: 'alg', example: 'ex', exercise: 'exr',
}
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

let cached: { root: string; stamp: string; index: ContentIndex } | undefined

export function loadContent(root: string): ContentIndex {
  const dir = path.join(root, 'content')
  const files: string[] = []
  for (const course of ['theory', 'algorithms']) {
    const d = path.join(dir, course)
    if (!fs.existsSync(d)) continue
    for (const f of fs.readdirSync(d).sort()) if (f.endsWith('.md') && f !== 'index.md') files.push(path.join(d, f))
  }
  const stamp = files.map(f => `${f}:${fs.statSync(f).mtimeMs}`).join('|')
  if (cached && cached.root === root && cached.stamp === stamp) return cached.index

  const index: ContentIndex = {
    lessons: [], containers: [], byId: new Map(), figures: [], figureById: new Map(),
    pseudocode: new Map(), refs: [], unclear: [], problems: [],
  }
  for (const file of files) scanLesson(file, root, index)
  for (const c of index.containers) {
    if (c.type === 'proof' && c.forId && !index.byId.has(c.forId))
      index.problems.push({ lesson: c.lesson, line: c.line, message: `proof for=${c.forId}: unknown statement` })
  }
  cached = { root, stamp, index }
  return index
}

function scanLesson(file: string, root: string, index: ContentIndex) {
  const text = fs.readFileSync(file, 'utf8')
  const fm = matter(text)
  const rel = path.relative(path.join(root, 'content'), file).replace(/\\/g, '/').replace(/\.md$/, '')
  const course = rel.split('/')[0] as Course
  const lesson: Lesson = {
    path: rel, file, course,
    lecture: Number(fm.data.lecture ?? 0),
    slug: String(fm.data.slug ?? rel),
    title: String(fm.data.title ?? rel),
    summary: String(fm.data.summary ?? ''),
    status: String(fm.data.status ?? 'draft'),
    frontmatter: fm.data,
    source: text,
  }
  index.lessons.push(lesson)
  const lines = text.split('\n')
  const offset = text.split('\n').length - fm.content.split('\n').length
  const counters: Record<string, number> = {}
  const stack: { c: Container; colons: number; start: number }[] = []
  let fence: { ch: string; len: number; info: string; start: number; lines: string[] } | undefined
  let lastStatement: Container | undefined
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
          const fig: Figure = { id: id ?? '', info: kv, source: fence.lines.join('\n'), lesson, line: fence.start }
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

    const open = /^(:{3,})\s*([a-z]+)\b(.*)$/.exec(line)
    if (open && CONTAINER_TYPES.has(open[2])) {
      const [, colons, type, rest] = open
      const { id, attrs } = parseContainerInfo(rest)
      const c: Container = {
        type, id, attrs, title: attrs.title, lesson, line: lineNo, body: '',
        parentId: stack.at(-1)?.c.id,
      }
      const counter = COUNTER[type]
      if (counter && id) {
        counters[counter] = (counters[counter] ?? 0) + 1
        c.number = `${lesson.lecture}.${counters[counter]}`
      }
      if (type === 'proof') c.forId = attrs.for ?? lastStatement?.id
      if (STATEMENT_TYPES.has(type)) lastStatement = c
      if (type === 'algorithm') currentAlg = c
      if (id) {
        if (index.byId.has(id)) index.problems.push({ lesson, line: lineNo, message: `duplicate id ${id}` })
        else index.byId.set(id, c)
      } else if (counter && type !== 'claim') {
        index.problems.push({ lesson, line: lineNo, message: `${type} without id` })
      }
      index.containers.push(c)
      stack.push({ c, colons: colons.length, start: i + 1 })
      continue
    }
    const close = /^(:{3,})\s*$/.exec(line)
    if (close && stack.length && stack[stack.length - 1].colons <= close[1].length) {
      const top = stack.pop()!
      top.c.body = lines.slice(top.start, i).join('\n')
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
  while ((m = re.exec(text))) index.refs.push({ target: m[1].trim(), lesson, line })
}

/** Resolve a [[target]] to a URL path (without base) and default label. */
export function resolveTarget(index: ContentIndex, target: string, fromCourse?: Course): { href: string; label: string } | undefined {
  if (target.startsWith('fig:')) {
    const f = index.figureById.get(target.slice(4))
    if (!f) return undefined
    return { href: `/${f.lesson.path}#fig-${f.id}`, label: 'this figure' }
  }
  const c = index.byId.get(target)
  if (c) {
    const coursePrefix = fromCourse && fromCourse !== c.lesson.course ? (c.lesson.course === 'theory' ? 'T' : 'A') : ''
    const name = KIND_NAMES[c.type] ?? c.type
    const num = c.number ? ` ${coursePrefix}${c.number}` : ''
    const title = c.title ? ` (${c.title})` : ''
    return { href: `/${c.lesson.path}#${anchorId(c.id!)}`, label: `${name}${num}${title}` }
  }
  const l = index.lessons.find(x => x.path === target)
  if (l) return { href: `/${l.path}`, label: l.title }
  return undefined
}

/** HTML id for a container id ("thm:handshake" -> "thm-handshake"), safe in CSS selectors and URLs. */
export function anchorId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, '-')
}

export function containerLabel(c: Container, fromCourse?: Course): string {
  const coursePrefix = fromCourse && fromCourse !== c.lesson.course ? (c.lesson.course === 'theory' ? 'T' : 'A') : ''
  return `${KIND_NAMES[c.type] ?? c.type}${c.number ? ` ${coursePrefix}${c.number}` : ''}`
}
