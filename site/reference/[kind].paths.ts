import path from 'node:path'
import { loadContent, loadTopics } from '../../packages/content/index'
import { REFERENCE_KINDS, referenceMarkdown } from '../../packages/content/pages'

const root = path.resolve(__dirname, '../..')

export default {
  watch: ['../../content/**/*.md', '../../content/topics.yaml'],
  paths() {
    const ix = loadContent(root)
    const topics = loadTopics(root)
    return Object.keys(REFERENCE_KINDS).map(kind => ({ params: { kind }, content: referenceMarkdown(ix, topics, kind) }))
  },
}
