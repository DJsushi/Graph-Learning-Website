// Generates Markdown for the reference, practice and exam pages from the content index.
// The generated Markdown goes through the same pipeline as the lessons (math, containers, refs, graph blocks).
import { COURSE_NAMES, KIND_NAMES, containerLabel, type Container, type ContentIndex, type Course, type Lesson } from './index'

export const REFERENCE_KINDS: Record<string, { title: string; types: string[]; intro: string }> = {
  definitions: { title: 'Definitions', types: ['definition'], intro: 'Every definition from both courses, in lesson order.' },
  theorems: {
    title: 'Theorems and lemmas',
    types: ['theorem', 'lemma', 'proposition', 'corollary', 'observation'],
    intro: 'Every theorem, lemma, proposition, corollary and observation, with its proof (click a proof to expand it).',
  },
  algorithms: { title: 'Algorithms', types: ['algorithm'], intro: 'Every algorithm with its pseudocode.' },
}

const sortedLessons = (ix: ContentIndex) =>
  [...ix.lessons].sort((a, b) => (a.course === b.course ? a.lecture - b.lecture : a.course === 'theory' ? -1 : 1))

/** Raw source of a container with at least `colons` colons, so it can be nested. */
function fenced(c: Container): string {
  return c.raw
}

function proofsFor(ix: ContentIndex, id: string): Container[] {
  return ix.containers.filter(c => c.type === 'proof' && c.forId === id && c.parentId === undefined)
}

export function referenceMarkdown(ix: ContentIndex, kind: string): string {
  const k = REFERENCE_KINDS[kind]
  const out: string[] = [
    `# ${k.title}`, '', k.intro, '',
  ]
  let course: Course | undefined
  for (const l of sortedLessons(ix)) {
    const items = ix.containers.filter(c => c.lesson === l && k.types.includes(c.type) && c.id && !c.parentId)
    if (!items.length) continue
    if (course !== l.course) { course = l.course; out.push(`## ${COURSE_NAMES[l.course]}`, '') }
    out.push(`### ${l.lecture}. ${l.title}`, '')
    for (const c of items) {
      out.push(fenced(c), '')
      for (const p of proofsFor(ix, c.id!)) out.push(p.raw, '')
    }
  }
  return out.join('\n')
}

export function practiceLessons(ix: ContentIndex): Lesson[] {
  return sortedLessons(ix)
}

export function practiceMarkdown(ix: ContentIndex, lesson: Lesson): string {
  const out: string[] = [
    `# Practice: ${lesson.title}`, '',
    `Exercises and quick checks for [${COURSE_NAMES[lesson.course]}, lesson ${lesson.lecture}](/${lesson.path}). Your progress is saved in this browser.`, '',
  ]
  const figs = ix.figures.filter(f => f.lesson === lesson && f.info.widget === 'exercise')
  const texts = ix.containers.filter(c => c.lesson === lesson && c.type === 'exercise')
  const quizzes = ix.containers.filter(c => c.lesson === lesson && c.type === 'quiz')
  if (quizzes.length) { out.push('## Quick checks', ''); for (const q of quizzes) out.push(q.raw, '') }
  if (figs.length) { out.push('## Interactive exercises', ''); for (const f of figs) out.push(f.raw, '') }
  if (texts.length) { out.push('## Written exercises', ''); for (const t of texts) out.push(t.raw, '') }
  return out.join('\n')
}

export const FLASHCARD_TYPES = ['definition', 'theorem', 'lemma', 'proposition', 'corollary']

export function flashcardMarkdown(ix: ContentIndex): string {
  const out: string[] = ['# Flashcards', '',
    'Recall the statement, then reveal the card and rate yourself. Cards you know move to the back; cards you miss come back sooner. Your progress is saved in this browser.', '',
    '<FlashcardDeck>', '']
  for (const l of sortedLessons(ix)) {
    for (const c of ix.containers.filter(x => x.lesson === l && FLASHCARD_TYPES.includes(x.type) && x.id && !x.parentId)) {
      const label = containerLabel(c, l.course === 'theory' ? 'algorithms' : 'theory')
      const title = (c.title ?? '').replace(/"/g, '&quot;')
      const extra = c.attrs.extra === 'true' ? ' extra' : ''
      out.push(`<Flashcard id="${c.id}" course="${l.course}" label="${label}" title="${title}" href="/${l.path}#${c.id!.replace(/[^A-Za-z0-9_-]/g, '-')}"${extra}>`, '')
      out.push(stripFigures(c.body), '', '</Flashcard>', '')
    }
  }
  out.push('</FlashcardDeck>', '')
  return out.join('\n')
}

function stripFigures(body: string): string {
  return body.replace(/```graph[\s\S]*?```/g, '')
}

export function kindName(type: string) {
  return KIND_NAMES[type] ?? type
}

export function mixedQuizMarkdown(ix: ContentIndex): string {
  const out = ['# Mixed self-test', '', 'Ten random quick checks from all lessons. Answer them, then ask for a new set.', '', '<QuizSession :size="10">', '']
  for (const q of ix.containers.filter(c => c.type === 'quiz')) out.push(q.raw, '')
  out.push('</QuizSession>', '')
  return out.join('\n')
}
