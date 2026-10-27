import path from 'node:path'
import { loadContent, loadTopics } from '../../packages/content/index'
import { topicMarkdown } from '../../packages/content/pages'

const root = path.resolve(__dirname, '../..')

export default {
  watch: ['../../content/**/*.md', '../../content/topics.yaml'],
  paths() {
    const ix = loadContent(root)
    const topics = loadTopics(root)
    return topics.map(t => ({ params: { topic: t.slug }, content: topicMarkdown(ix, topics, t.slug) }))
  },
}
