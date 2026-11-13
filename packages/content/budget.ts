// Budget checks E1 to E11 of CONTENT_CONVENTIONS.md 10, for concept pages with `stage: taught` (BACKLOG D1).
// Pure functions of the content index; scripts/validate-content.ts prints the result and fails on errors.
import path from 'node:path'
import matter from 'gray-matter'
import { parseMarkRef, STATEMENT_TYPES, type ContentIndex, type Lesson } from './index'

export interface Measure { words: number; spans: number; heavy: number }

// Excluded from the reading path as well as the statement containers.
const STATEMENTS = new Set([...STATEMENT_TYPES, 'definition', 'algorithm'])
const EXCLUDED = new Set([...STATEMENTS, 'proof', 'hint', 'solution', 'explanation'])

const SPAN = /\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g
const GREEK = 'alpha|beta|gamma|delta|epsilon|varepsilon|ell|kappa|lambda|mu|nu|pi|rho|sigma|tau|phi|chi|psi|omega|Delta|Gamma|Lambda|Sigma|Omega'
const ATOM = `(?:(?:[A-Za-z]|\\\\(?:${GREEK}))(?:_(?:\\{[^{}]*\\}|[A-Za-z0-9]))?'*|\\d+)`
const LIGHT = new RegExp(`^${ATOM}(?:\\s*[+-]\\s*${ATOM})?$`)

/** Words of the prose and the number of math spans (heavy: every span that is not a single letter, a number, or two joined by + or -). */
export function measure(text: string): Measure {
  const clean = text.replace(/<!--[\s\S]*?-->/g, ' ')
  const spans = clean.match(SPAN) ?? []
  const heavy = spans.filter(s => !LIGHT.test(s.replace(/^\$+|\$+$/g, '').trim()) || s.startsWith('$$')).length
  const prose = clean.replace(SPAN, ' ')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, _id, t) => t ?? 'ref')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  const words = prose.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length
  return { words, spans: spans.length, heavy }
}

/** The reading path of a concept page: its text (comments still inside; `measure` drops them) and the 1-based lines it comes from. */
export function readingPath(ix: ContentIndex, l: Lesson): { text: string; lines: Set<number> } {
  const src = l.source.split('\n')
  const offset = src.length - matter(l.source).content.split('\n').length
  const mine = ix.containers.filter(c => c.lesson === l)
  const excluded = mine.filter(c => EXCLUDED.has(c.type))
  const fences = new Set(mine.flatMap(c => [c.line, c.endLine]))
  const lines = new Set<number>()
  const out: string[] = []
  let fence: { ch: string; len: number } | undefined
  let more = false
  src.forEach((line, i) => {
    const n = i + 1
    if (fence) {
      if (new RegExp(`^${fence.ch}{${fence.len},}\\s*$`).test(line.trim())) fence = undefined
      return
    }
    const fo = /^\s*(`{3,}|~{3,})/.exec(line)
    if (fo) { fence = { ch: fo[1][0], len: fo[1].length }; return }
    if (/^## /.test(line)) more = /^## More\s*$/.test(line)
    if (n <= offset || more || fences.has(n) || excluded.some(c => c.line <= n && n <= c.endLine)) return
    lines.add(n)
    out.push(line.replace(/^#+\s*/, ''))
  })
  return { text: out.join('\n'), lines }
}

export function budgetChecks(root: string, ix: ContentIndex): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  const needsOf = (l: Lesson): string[] => (Array.isArray(l.frontmatter.needs) ? l.frontmatter.needs.map(String) : [])
  const reach = (l: Lesson) => {
    const seen = new Set<string>()
    const walk = (p: string) => {
      if (seen.has(p)) return
      seen.add(p)
      const x = ix.lessons.find(y => y.path === p)
      if (x) needsOf(x).forEach(walk)
    }
    needsOf(l).forEach(walk)
    return seen
  }

  for (const l of ix.lessons) {
    if (l.kind !== 'concept' || l.stage !== 'taught') continue
    const at = (line?: number) => `${path.relative(root, l.file)}${line ? `:${line}` : ''}`
    const err = (m: string, line?: number) => errors.push(`${at(line)} ${m}`)
    const practice = l.frontmatter.kind === 'practice'
    const mine = ix.containers.filter(c => c.lesson === l)
    const top = mine.filter(c => c.parentId === undefined)
    const figures = ix.figures.filter(f => f.lesson === l)

    // E1, E2
    const firstStatement = top.find(c => STATEMENTS.has(c.type))
    const firstFigure = figures[0]
    if (!practice) {
      if (firstStatement && (!firstFigure || firstFigure.line > firstStatement.line)) err(`the first graph block must come before the first statement (${firstStatement.type} on line ${firstStatement.line})`, firstStatement.line)
      if (figures.length < 2 || figures.every(f => (f.info.widget ?? 'figure') === 'figure')) err(`needs at least 2 graph blocks, one of them not widget=figure (has ${figures.length})`)
    }
    // E3
    if (!practice) {
      const defs = top.filter(c => c.type === 'definition').length
      const other = top.filter(c => STATEMENTS.has(c.type) && c.type !== 'definition').length
      if (defs > 2) err(`${defs} definitions (at most 2)`)
      if (other > 3) err(`${other} statements besides definitions (at most 3)`)
    }
    // E4, E5
    const rp = readingPath(ix, l)
    const m = measure(rp.text)
    const cap = l.frontmatter.long === true ? 1400 : 900
    if (m.words > cap) err(`reading path has ${m.words} words (at most ${cap}${cap === 900 ? ', 1400 with long: true' : ''})`)
    else if (m.words > 600) warnings.push(`${at()} reading path has ${m.words} words (over 600)`)
    const w = Math.max(m.words, 1)
    if (m.heavy * 100 > 3 * w) err(`reading path has ${m.heavy} heavy math spans in ${m.words} words (at most 3 per 100 words)`)
    if (m.spans * 100 > 12 * w) err(`reading path has ${m.spans} math spans in ${m.words} words (at most 12 per 100 words)`)

    // E6
    const walked = new Set(mine.filter(c => c.type === 'walkthrough' && c.attrs.for).map(c => c.attrs.for))
    for (const p of mine.filter(c => c.type === 'proof'))
      if (!p.forId || !walked.has(p.forId)) err(`proof of ${p.forId ?? '?'} has no walkthrough with for=${p.forId ?? '?'}`, p.line)
    // E7 (the rest is in structure.ts, on every page): at most 2 heavy math spans per step. Taught pages only, the split pages' steps are longer.
    for (const st of mine.filter(c => c.type === 'step')) {
      const h = measure(st.body).heavy
      if (h > 2) err(`step has ${h} heavy math spans (at most 2)`, st.line)
    }
    // E8
    const intuitions = mine.filter(c => c.type === 'intuition')
    for (const c of intuitions) {
      const im = measure(c.body)
      if (im.words > 50) err(`intuition of ${c.forId ?? '?'} has ${im.words} words (at most 50)`, c.line)
      if (im.heavy > 1) err(`intuition of ${c.forId ?? '?'} has ${im.heavy} heavy math spans (at most 1)`, c.line)
    }
    for (const c of top.filter(c => STATEMENTS.has(c.type) && c.id))
      if (!intuitions.some(i => i.forId === c.id)) err(`${c.id} has no intuition`, c.line)
    // E9
    if (!practice && !mine.some(c => c.type === 'quiz') && !figures.some(f => f.info.widget === 'exercise')) err('has no quiz and no graph exercise')
    // E10
    const goal = l.frontmatter.goal
    if (typeof goal !== 'string' || !goal.trim()) err('frontmatter lacks goal')
    else if (goal.trim().split(/\s+/).length > 25) err(`goal has ${goal.trim().split(/\s+/).length} words (at most 25)`)
    const needs = l.frontmatter.needs
    if (needs !== undefined && !Array.isArray(needs)) err('needs must be a list of page paths')
    for (const n of needsOf(l)) if (!ix.lessons.some(x => x.path === n)) err(`needs: ${n} is not a page`)
    const reachable = reach(l)
    if (reachable.has(l.path)) err('needs has a cycle through this page')
    // E11
    const pageOf = (target: string): Lesson | undefined => {
      const fig = parseMarkRef(target)?.fig ?? (target.startsWith('fig:') ? target.slice(4) : undefined)
      if (fig) return ix.figureById.get(fig)?.lesson
      return ix.byId.get(target)?.lesson ?? ix.lessons.find(x => x.path === target)
    }
    for (const r of ix.refs) {
      if (r.lesson !== l || !rp.lines.has(r.line)) continue
      const t = pageOf(r.target)
      if (t && t !== l && t.kind === 'concept' && !reachable.has(t.path))
        err(`forward reference [[${r.target}]]: ${t.path} is not on this page or in needs`, r.line)
    }
  }
  return { errors, warnings }
}
