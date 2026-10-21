// Minimal rich text for captions, prompts, step messages: $math$, $$display$$, **bold**, *em*, `code`, [text](url).
import katex from 'katex'
import { KATEX_MACROS } from './katexMacros'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function renderRich(text: string, linkBase = ''): string {
  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  return parts.map(p => {
    if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) return tex(p.slice(2, -2), true)
    if (p.startsWith('$') && p.endsWith('$') && p.length > 1) return tex(p.slice(1, -1), false)
    return esc(p)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u.startsWith('/') ? linkBase.replace(/\/$/, '') + u : u}">${t}</a>`)
  }).join('')
}

function tex(src: string, display: boolean): string {
  try {
    return katex.renderToString(src, { displayMode: display, macros: { ...KATEX_MACROS }, throwOnError: false, output: 'html' })
  } catch {
    return esc(src)
  }
}
