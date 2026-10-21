// Pseudocode HTML for every registered algorithm, for players outside the lessons (playground).
import path from 'node:path'
import { defineLoader } from 'vitepress'
import { loadContent } from '../../packages/content/index'
import { ALGORITHMS } from '../../packages/graph-core/src/algorithms'
import { renderPseudo } from '../markdown'

declare const data: Record<string, string>
export { data }

export default defineLoader({
  watch: ['../../content/**/*.md'],
  load() {
    const ix = loadContent(path.resolve(__dirname, '../..'))
    const out: Record<string, string> = {}
    for (const a of Object.values(ALGORITHMS)) {
      const code = ix.pseudocode.get(a.pseudocode ?? `alg:${a.id}`)
      if (code) out[a.id] = renderPseudo(code).replace(' v-pre', '')
    }
    return out
  },
})
