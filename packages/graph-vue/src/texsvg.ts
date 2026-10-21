// Converts simple TeX labels ($v_1$, $x'$, $L_{3}$, $\infty$, $f/c$) into SVG tspans so labels stay crisp and exportable.
// Anything unsupported returns undefined, and the caller falls back to KaTeX in a foreignObject.

export interface TSpan { text: string; italic?: boolean; shift?: 'sub' | 'sup'; small?: boolean; upright?: boolean }

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', lambda: 'λ',
  mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  infty: '∞', cdot: '·', times: '×', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', to: '→', emptyset: '∅',
}

/** Parse one TeX math string (without $). */
export function texToSpans(tex: string): TSpan[] | undefined {
  const out: TSpan[] = []
  let i = 0
  const s = tex.trim()
  const pushText = (text: string, shift?: TSpan['shift']) => {
    for (const ch of text) {
      const italic = /[A-Za-z]/.test(ch)
      out.push({ text: ch, italic, shift, small: !!shift })
    }
  }
  const readGroup = (): string | undefined => {
    if (s[i] === '{') {
      let depth = 0, j = i
      for (; j < s.length; j++) {
        if (s[j] === '{') depth++
        else if (s[j] === '}' && --depth === 0) break
      }
      if (j >= s.length) return undefined
      const g = s.slice(i + 1, j)
      i = j + 1
      return g
    }
    if (s[i] === '\\') {
      const m = /^\\([A-Za-z]+)/.exec(s.slice(i))
      if (!m) return undefined
      i += m[0].length
      return '\\' + m[1]
    }
    return s[i++]
  }
  const simple = (g: string, shift?: TSpan['shift']): boolean => {
    // group contents: letters, digits, primes, commas, greek commands
    let k = 0
    while (k < g.length) {
      if (g[k] === '\\') {
        const m = /^\\([A-Za-z]+)/.exec(g.slice(k))
        if (!m || !GREEK[m[1]]) return false
        out.push({ text: GREEK[m[1]], shift, small: !!shift, italic: /^[a-z]/.test(m[1]) && m[1] !== 'infty' })
        k += m[0].length
        continue
      }
      if (/[A-Za-z0-9,'+\-*= ]/.test(g[k])) {
        if (g[k] !== ' ') pushText(g[k] === "'" ? '′' : g[k] === '-' ? '−' : g[k], shift)
        k++
        continue
      }
      return false
    }
    return true
  }
  while (i < s.length) {
    const ch = s[i]
    if (ch === ' ') { i++; continue }
    if (ch === '_' || ch === '^') {
      i++
      const g = readGroup()
      if (g === undefined || !simple(g, ch === '_' ? 'sub' : 'sup')) return undefined
      continue
    }
    if (ch === '\\') {
      const m = /^\\([A-Za-z]+|[{}, ])/.exec(s.slice(i))
      if (!m) return undefined
      i += m[0].length
      const name = m[1]
      if (GREEK[name]) { out.push({ text: GREEK[name], italic: /^[a-z]/.test(name) && !['infty', 'cdot', 'times', 'le', 'leq', 'ge', 'geq', 'ne', 'to', 'emptyset'].includes(name) }); continue }
      if (name === '{' || name === '}') { out.push({ text: name, upright: true }); continue }
      if (name === ',' || name === ' ') { out.push({ text: ' ', upright: true }); continue }
      if (name === 'text' || name === 'mathrm') {
        const g = readGroup()
        if (g === undefined || /[\\{}$]/.test(g)) return undefined
        out.push({ text: g.replace(/\\_/g, '_'), upright: true })
        continue
      }
      if (name === 'bar' || name === 'overline') return undefined
      return undefined
    }
    if (ch === "'") { out.push({ text: '′' }); i++; continue }
    if (/[A-Za-z]/.test(ch)) { out.push({ text: ch, italic: true }); i++; continue }
    if (/[0-9.,/()=+\-:;|<>[\]]/.test(ch)) { out.push({ text: ch === '-' ? '−' : ch }); i++; continue }
    if (ch === '{' || ch === '}') { i++; continue }
    return undefined
  }
  return out
}

/** Split a label into plain text and $math$ parts and convert; undefined if KaTeX is needed. */
export function labelToSpans(label: string): TSpan[] | undefined {
  const parts = label.split(/(\$[^$]+\$)/g).filter(p => p !== '')
  const out: TSpan[] = []
  for (const p of parts) {
    if (p.startsWith('$') && p.endsWith('$')) {
      const sp = texToSpans(p.slice(1, -1))
      if (!sp) return undefined
      out.push(...sp)
    } else out.push({ text: p, upright: true })
  }
  return out
}

/** Rough visual width in em units, for layout decisions (inside/outside the vertex circle). */
export function spansWidth(spans: TSpan[]): number {
  return spans.reduce((w, s) => w + [...s.text].length * (s.small ? 0.42 : 0.6), 0)
}
