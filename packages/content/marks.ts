// Validation of mark links `[[fig:<id>#<mark>|text]]` (CONTENT_CONVENTIONS.md 6.1).
import { parseMarkRef, type ContentIndex, type Figure } from './index'

/** `marksOf` returns every mark name a figure defines, in its base graph or in any step. */
export function markRefErrors(index: ContentIndex, marksOf: (f: Figure) => Set<string>): { lesson: ContentIndex['lessons'][number]; line: number; message: string }[] {
  const out: ReturnType<typeof markRefErrors> = []
  for (const r of index.refs) {
    const m = parseMarkRef(r.target)
    if (!m) continue
    const f = index.figureById.get(m.fig)
    const bad = (message: string) => out.push({ lesson: r.lesson, line: r.line, message: `[[${r.target}]] ${message}` })
    if (!f) bad(`names an unknown figure ${m.fig}`)
    else if (f.lesson !== r.lesson) bad('points at a figure on another page')
    else if (!marksOf(f).has(m.mark)) bad(`names a mark that figure ${m.fig} does not define`)
    if (!r.text?.trim()) bad('needs link text: [[fig:<id>#<mark>|text]]')
  }
  return out
}
