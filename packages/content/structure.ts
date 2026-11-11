// Structure checks of RESTRUCTURE.md §4.1 and BACKLOG S7, S19, S20: frontmatter, ids, fences, quizzes, concept pages.
// Pure functions of the content index; scripts/validate-content.ts prints the result and fails on errors.
import path from 'node:path'
import { anchorId, type ContentIndex, type Topic } from './index'
import { REFERENCE_KINDS } from './pages'

export const ID_PREFIX: Record<string, string> = {
  definition: 'def', theorem: 'thm', lemma: 'lem', proposition: 'prop', corollary: 'cor', observation: 'obs',
  claim: 'claim', algorithm: 'alg', example: 'ex', remark: 'rem', exercise: 'exr', quiz: 'q',
}

export function structureChecks(root: string, ix: ContentIndex, topics: Topic[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  const at = (file: string, line?: number) => `${path.relative(root, file)}${line ? `:${line}` : ''}`

  // Frontmatter of lecture and concept pages.
  const lectures = ix.lessons.filter(l => l.kind === 'lecture')
  const seen = new Map<string, string>()
  for (const l of ix.lessons) {
    const fm = l.frontmatter
    const missing = (l.kind === 'concept' ? ['title', 'course', 'chapter', 'order', 'lectures', 'stage', 'status'] : ['title', 'course', 'lecture', 'slug', 'status'])
      .filter(k => fm[k] === undefined || fm[k] === '' || (Array.isArray(fm[k]) && !fm[k].length))
    if (missing.length) errors.push(`${at(l.file)} frontmatter lacks ${missing.join(', ')}`)
    if (fm.course !== undefined && fm.course !== l.course) errors.push(`${at(l.file)} course: ${fm.course} does not match its folder ${l.course}`)
    if (l.kind === 'lecture') {
      for (const [what, value] of [['slug', fm.slug], ['lecture', fm.lecture]] as const) {
        if (value === undefined) continue
        const key = `${what}:${what === 'slug' ? '' : l.course}:${value}`
        if (seen.has(key)) errors.push(`${at(l.file)} ${what} ${value} is also used by ${seen.get(key)}`)
        else seen.set(key, at(l.file))
      }
    } else {
      if (fm.stage !== undefined && !['split', 'taught'].includes(fm.stage)) errors.push(`${at(l.file)} stage: ${fm.stage} is neither split nor taught`)
      const chapter = topics.find(t => t.slug === l.chapter && t.course === l.course)
      if (!chapter) errors.push(`${at(l.file)} unknown chapter ${l.chapter} (not a ${l.course} topic of content/topics.yaml)`)
      if (fm.order !== undefined && !Number.isInteger(fm.order)) errors.push(`${at(l.file)} order: ${fm.order} is not an integer`)
      else if (l.order !== undefined) {
        const key = `order:${l.course}/${l.chapter}/${l.order}`
        if (seen.has(key)) errors.push(`${at(l.file)} order ${l.order} in chapter ${l.chapter} is also used by ${seen.get(key)}`)
        else seen.set(key, at(l.file))
      }
      for (const s of l.lectures)
        if (!lectures.some(x => x.slug === s && x.course === l.course)) errors.push(`${at(l.file)} lectures: ${s} is not the slug of a ${l.course} lecture file`)
    }
  }

  // Ids: prefix by container type, quiz id and explanation, one anchor per id, figure prefix by lecture slug.
  const anchors = new Map<string, string>()
  for (const c of ix.containers) {
    const lines = c.lesson.source.split('\n')
    for (const n of [c.line, c.endLine])
      if (/^\s/.test(lines[n - 1] ?? '')) errors.push(`${at(c.lesson.file, n)} container fence must start at column 0`)
    const prefix = ID_PREFIX[c.type]
    if (c.type === 'quiz') {
      if (!c.id) errors.push(`${at(c.lesson.file, c.line)} quiz without id`)
      if (!ix.containers.some(e => e.type === 'explanation' && e.lesson === c.lesson && e.line > c.line && e.endLine < c.endLine))
        errors.push(`${at(c.lesson.file, c.line)} quiz ${c.id ?? '(no id)'} without explanation`)
    }
    if (!c.id) continue
    if (prefix && !c.id.startsWith(`${prefix}:`)) errors.push(`${at(c.lesson.file, c.line)} ${c.type} id ${c.id} should start with ${prefix}:`)
    const a = anchorId(c.id)
    if (anchors.has(a) && anchors.get(a) !== c.id) errors.push(`${at(c.lesson.file, c.line)} ids ${anchors.get(a)} and ${c.id} give the same anchor #${a}`)
    else anchors.set(a, c.id)
  }
  for (const f of ix.figures) {
    const slugs = f.lesson.kind === 'lecture' ? [f.lesson.slug] : f.lesson.lectures
    if (f.id && slugs.length && !slugs.some(s => f.id.startsWith(`${s}-`)))
      errors.push(`${at(f.lesson.file, f.line)} figure id ${f.id} should start with ${slugs.join(' or ')}-`)
  }

  // Warnings: concept pages only.
  const concept = new Set(ix.lessons.filter(l => l.kind === 'concept'))
  const walkthroughs = new Set<string>()
  for (const l of concept)
    for (const m of l.source.matchAll(/^ {0,3}:{3,}\s*walkthrough\b.*?\bfor=([^\s}]+)/gm)) walkthroughs.add(`${l.path}\0${m[1]}`)
  const bare = ix.containers.filter(c => c.type === 'proof' && concept.has(c.lesson) && !(c.forId && walkthroughs.has(`${c.lesson.path}\0${c.forId}`)))
    .map(c => ({ c, len: c.endLine - c.line - 1 })).sort((a, b) => b.len - a.len)
  for (const { c, len } of bare) warnings.push(`${at(c.lesson.file, c.line)} proof of ${c.forId} (${len} lines) has no walkthrough`)

  const refTypes = new Set(Object.values(REFERENCE_KINDS).flatMap(k => k.types))
  for (const l of concept) {
    const entries = ix.containers.filter(c => c.lesson === l && c.id && !c.parentId && refTypes.has(c.type)).length
    const figures = ix.figures.filter(f => f.lesson === l).length
    if (figures < entries) warnings.push(`${at(l.file)} ${figures} figures for ${entries} reference entries`)
  }
  return { errors, warnings }
}
