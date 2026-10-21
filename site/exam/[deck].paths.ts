import path from 'node:path'
import { loadContent } from '../../packages/content/index'
import { flashcardMarkdown, mixedQuizMarkdown } from '../../packages/content/pages'

const root = path.resolve(__dirname, '../..')

export default {
  watch: ['../../content/**/*.md'],
  paths() {
    const ix = loadContent(root)
    return [
      { params: { deck: 'flashcards' }, content: flashcardMarkdown(ix) },
      { params: { deck: 'self-test' }, content: mixedQuizMarkdown(ix) },
    ]
  },
}
