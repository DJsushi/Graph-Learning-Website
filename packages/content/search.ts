// Token scoring for the reference search (pure, used in the browser).

export interface SearchFields { label: string; title: string; aka: string; defines: string; text: string }

const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9.]+/g, ' ')} `
export const tokens = (q: string) => norm(q).split(' ').map(t => t.replace(/^\.+|\.+$/g, '')).filter(Boolean)

/** Every token must start a word somewhere (labels also match without the T/A prefix); label/title hits weigh 10, aka/defines 4, text 1. 0 means no match. */
export function scoreEntry(e: SearchFields, toks: string[]): number {
  const strong = norm(`${e.label} ${e.label.slice(1)} ${e.title}`), mid = norm(`${e.aka} ${e.defines}`), weak = norm(e.text)
  let score = 0
  for (const t of toks) {
    const w = ` ${t}`
    const s = (strong.includes(w) ? 10 : 0) + (mid.includes(w) ? 4 : 0) + (weak.includes(w) ? 1 : 0)
    if (!s) return 0
    score += s
  }
  return score
}
