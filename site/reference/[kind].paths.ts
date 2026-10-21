import path from 'node:path'
import { loadContent } from '../../packages/content/index'
import { REFERENCE_KINDS, referenceMarkdown } from '../../packages/content/pages'

const root = path.resolve(__dirname, '../..')

export default {
  watch: ['../../content/**/*.md'],
  paths() {
    const ix = loadContent(root)
    return Object.keys(REFERENCE_KINDS).map(kind => ({ params: { kind }, content: referenceMarkdown(ix, kind) }))
  },
}
