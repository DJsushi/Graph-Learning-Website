// Build-time summary of the content for landing, course and practice pages.
import path from 'node:path'
import { defineLoader } from 'vitepress'
import { anchorId, loadContent, loadTopics, lectureLessons, proofStats } from '../../packages/content/index'

export interface LessonSummary {
  path: string; course: 'theory' | 'algorithms'; lecture: number; slug: string; title: string; summary: string
  counts: { definitions: number; statements: number; algorithms: number; figures: number }
  exercises: string[]   // ids of interactive exercises and quizzes (for progress)
}
export interface PageSummary { path: string; course: 'theory' | 'algorithms'; chapter: string; order: number; title: string; goal: string; lectures: string[]; proofs: { total: number; explained: number } }
/** `lessons` are the lecture pages only; concept pages are in `pages`. `moved`: anchor id -> concept page that now holds the entry or figure. */
export interface SiteData { lessons: LessonSummary[]; pages: PageSummary[]; moved: Record<string, string>; topics: { slug: string; title: string; intro: string }[]; totals: { definitions: number; statements: number; algorithms: number; figures: number; exercises: number } }

declare const data: SiteData
export { data }

export default defineLoader({
  watch: ['../../content/**/*.md', '../../content/topics.yaml'],
  load(): SiteData {
    const ix = loadContent(path.resolve(__dirname, '../..'))
    const lessons = lectureLessons(ix).map(l => {
      const cs = ix.containers.filter(c => c.lesson === l)
      const figs = ix.figures.filter(f => f.lesson === l)
      return {
        path: l.path, course: l.course, lecture: l.lecture, slug: l.slug, title: l.title, summary: l.summary,
        counts: {
          definitions: cs.filter(c => c.type === 'definition').length,
          statements: cs.filter(c => ['theorem', 'lemma', 'proposition', 'corollary', 'observation'].includes(c.type)).length,
          algorithms: cs.filter(c => c.type === 'algorithm').length,
          figures: figs.length,
        },
        exercises: [...figs.filter(f => f.info.widget === 'exercise').map(f => f.id), ...cs.filter(c => c.type === 'quiz' && c.id).map(c => c.id!)],
      }
    })
    const sum = (k: keyof LessonSummary['counts']) => lessons.reduce((z, l) => z + l.counts[k], 0)
    const topics = loadTopics(path.resolve(__dirname, '../..')).map(({ slug, title, intro }) => ({ slug, title, intro }))
    const concept = ix.lessons.filter(l => l.kind === 'concept')
    const pages = concept.map(l => ({ path: l.path, course: l.course, chapter: l.chapter!, order: l.order ?? 0, title: l.title, goal: String(l.frontmatter.goal ?? ''), lectures: l.lectures, proofs: proofStats(ix, l) }))
    const moved: Record<string, string> = {}
    for (const c of ix.containers) if (c.id && c.lesson.kind === 'concept') moved[anchorId(c.id)] = c.lesson.path
    for (const f of ix.figures) if (f.id && f.lesson.kind === 'concept') moved[`fig-${anchorId(f.id)}`] = f.lesson.path
    return { lessons, pages, moved, topics, totals: { definitions: sum('definitions'), statements: sum('statements'), algorithms: sum('algorithms'), figures: sum('figures'), exercises: lessons.reduce((z, l) => z + l.exercises.length, 0) } }
  },
})
