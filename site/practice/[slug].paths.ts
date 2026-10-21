import path from 'node:path'
import { loadContent } from '../../packages/content/index'
import { practiceLessons, practiceMarkdown } from '../../packages/content/pages'

const root = path.resolve(__dirname, '../..')

export default {
  watch: ['../../content/**/*.md'],
  paths() {
    const ix = loadContent(root)
    return practiceLessons(ix).map(l => ({ params: { slug: l.slug }, content: practiceMarkdown(ix, l) }))
  },
}
