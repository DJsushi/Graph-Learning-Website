// Generates Markdown for the reference, practice and exam pages from the content index.
// The generated Markdown goes through the same pipeline as the lessons (math, containers, refs, graph blocks).
import { COURSE_NAMES, KIND_NAMES, anchorId, containerLabel, type Container, type ContentIndex, type Lesson, type Topic } from './index'

export const REFERENCE_KINDS: Record<string, { title: string; types: string[]; intro: string }> = {
  definitions: { title: 'Definitions', types: ['definition'], intro: 'Every definition from both courses, grouped by topic. Each links to its full entry.' },
  theorems: {
    title: 'Theorems and lemmas',
    types: ['theorem', 'lemma', 'proposition', 'corollary', 'observation'],
    intro: 'Every theorem, lemma, proposition, corollary and observation, grouped by topic. Each links to its full entry with the proof.',
  },
  algorithms: { title: 'Algorithms', types: ['algorithm'], intro: 'Every algorithm, grouped by topic. Each links to its full entry with the pseudocode.' },
}

/** Sections of a topic page, in order. */
const TOPIC_SECTIONS: [string, string][] = [['Definitions', 'definitions'], ['Results', 'theorems'], ['Algorithms', 'algorithms']]

const sortedLessons = (ix: ContentIndex) =>
  [...ix.lessons].sort((a, b) => (a.course === b.course ? a.lecture - b.lecture : a.course === 'theory' ? -1 : 1))

/** Raw source of a container with at least `colons` colons, so it can be nested. */
function fenced(c: Container): string {
  return c.raw
}

function proofsFor(ix: ContentIndex, id: string): Container[] {
  return ix.containers.filter(c => c.type === 'proof' && c.forId === id && c.parentId === undefined)
}

export function intuitionsFor(ix: ContentIndex, id: string): Container[] {
  return ix.containers.filter(c => c.type === 'intuition' && c.forId === id && c.parentId === undefined)
}

/** Label with the course prefix and title, e.g. "Theorem T3.2 (Two leaves)". */
function entryLabel(c: Container): string {
  return `${containerLabel(c, c.lesson.course === 'theory' ? 'algorithms' : 'theory')}${c.title ? ` (${c.title})` : ''}`
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Compact list of the entries of one kind, grouped by topic, linking to the topic pages. */
export function referenceMarkdown(ix: ContentIndex, topics: Topic[], kind: string): string {
  const k = REFERENCE_KINDS[kind]
  const out: string[] = [`# ${k.title}`, '', k.intro, '']
  for (const t of topics) {
    const items = t.ids.map(id => ix.byId.get(id)!).filter(c => k.types.includes(c.type))
    if (!items.length) continue
    out.push(`## ${t.title}`, '')
    for (const c of items) out.push(`- [${entryLabel(c)}](/reference/${t.slug}#${anchorId(c.id!)})`)
    out.push('')
  }
  return out.join('\n')
}

/** For every reference entry: the entries its body and proofs link to ([[refs]]), and the inverse. */
export function entryLinks(ix: ContentIndex, topics: Topic[]) {
  const ids = new Set(topics.flatMap(t => t.ids))
  const uses = new Map<string, string[]>()
  const usedBy = new Map<string, string[]>()
  for (const id of ids) {
    const c = ix.byId.get(id)
    if (!c) continue
    const text = [c.raw, ...proofsFor(ix, id).map(p => p.raw)].join('\n')
    const targets = [...new Set([...text.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)].map(m => m[1].trim()))]
      .filter(t => t !== id && ids.has(t))
    uses.set(id, targets)
    for (const t of targets) usedBy.set(t, [...(usedBy.get(t) ?? []), id])
  }
  return { uses, usedBy }
}

/** A topic page: the intro, then each entry with its statement, intuition (open), proof (collapsed) and links. */
export function topicMarkdown(ix: ContentIndex, topics: Topic[], slug: string): string {
  const topic = topics.find(t => t.slug === slug)!
  const { uses, usedBy } = entryLinks(ix, topics)
  const refList = (ids: string[]) => ids.map(id => `[[${id}|${entryLabel(ix.byId.get(id)!)}]]`).join(', ')
  const out: string[] = [`# ${topic.title}`, '', topic.intro, '']
  for (const [title, kind] of TOPIC_SECTIONS) {
    const items = topic.ids.map(id => ix.byId.get(id)!).filter(c => REFERENCE_KINDS[kind].types.includes(c.type))
    if (!items.length) continue
    out.push(`## ${title}`, '')
    for (const c of items) {
      // the container renders its head as an h4 carrying the anchor (topicPage frontmatter)
      out.push(fenced(c), '')
      // visually hidden, for the local search
      const words = [c.attrs.aka && `Also known as: ${c.attrs.aka}.`, c.attrs.defines && `Defines: ${c.attrs.defines}.`].filter(Boolean)
      if (words.length) out.push(`<p class="ga-sr-only">${escapeHtml(words.join(' '))}</p>`, '')
      for (const i of intuitionsFor(ix, c.id!)) out.push(i.raw, '')
      for (const p of proofsFor(ix, c.id!)) out.push(p.raw, '')
      const u = uses.get(c.id!) ?? [], b = usedBy.get(c.id!) ?? []
      if (!u.length && !b.length) continue
      out.push('<div class="ga-uses">', '')
      if (u.length) out.push(`**Uses:** ${refList(u)}`, '')
      if (b.length) out.push(`**Used by:** ${refList(b)}`, '')
      out.push('</div>', '')
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
