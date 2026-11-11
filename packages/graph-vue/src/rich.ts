// Minimal rich text for captions, prompts, step messages: $math$, $$display$$, **bold**, *em*, `code`, [text](url), mark links.
import katex from 'katex'
import { KATEX_MACROS } from './katexMacros'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// [[fig:<id>#<mark>|text]] (CONTENT_CONVENTIONS.md 6.1); RichText.vue makes it spotlight the mark
const MARK = /\[\[fig:([^#\]|\s]+)#([A-Za-z0-9_-]+)\|([^\]]+)\]\]/g

export function renderRich(text: string, linkBase = ''): string {
  let out = '', last = 0
  for (const m of text.matchAll(MARK)) {
    out += plain(text.slice(last, m.index), linkBase)
    out += `<button type="button" class="ga-mark" data-fig="${esc(m[1]).replace(/"/g, '&quot;')}" data-mark="${m[2]}" aria-pressed="false">${plain(m[3], linkBase)}</button>`
    last = m.index! + m[0].length
  }
  return out + plain(text.slice(last), linkBase)
}

function plain(text: string, linkBase: string): string {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  return parts.map(p => {
    if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) return tex(p.slice(2, -2), true)
    if (p.startsWith('$') && p.endsWith('$') && p.length > 1) return tex(p.slice(1, -1), false)
    return esc(p)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${(u.startsWith('/') ? linkBase.replace(/\/$/, '') + u : u).replace(/"/g, '&quot;')}">${t}</a>`)
  }).join('')
}

function tex(src: string, display: boolean): string {
  try {
    return katex.renderToString(src, { displayMode: display, macros: { ...KATEX_MACROS }, throwOnError: false, output: 'html' })
  } catch {
    return esc(src)
  }
}
