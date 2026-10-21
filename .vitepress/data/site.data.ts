// Build-time summary of the content for landing, course and practice pages.
import path from 'node:path'
import { defineLoader } from 'vitepress'
import { loadContent } from '../../packages/content/index'

export interface LessonSummary {
  path: string; course: 'theory' | 'algorithms'; lecture: number; slug: string; title: string; summary: string
  counts: { definitions: number; statements: number; algorithms: number; figures: number }
  exercises: string[]   // ids of interactive exercises and quizzes (for progress)
}
export interface SiteData { lessons: LessonSummary[]; totals: { definitions: number; statements: number; algorithms: number; figures: number; exercises: number } }

declare const data: SiteData
export { data }

export default defineLoader({
  watch: ['../../content/**/*.md'],
  load(): SiteData {
    const ix = loadContent(path.resolve(__dirname, '../..'))
    const lessons = ix.lessons.map(l => {
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
    }).sort((a, b) => (a.course === b.course ? a.lecture - b.lecture : a.course === 'theory' ? -1 : 1))
    const sum = (k: keyof LessonSummary['counts']) => lessons.reduce((z, l) => z + l.counts[k], 0)
    return { lessons, totals: { definitions: sum('definitions'), statements: sum('statements'), algorithms: sum('algorithms'), figures: sum('figures'), exercises: lessons.reduce((z, l) => z + l.exercises.length, 0) } }
  },
})
