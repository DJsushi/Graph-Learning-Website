// Markdown-it plugins for the course content (CONTENT_CONVENTIONS.md).
import path from 'node:path'
import katex from 'katex'
import container from 'markdown-it-container'
import { tex } from '@mdit/plugin-tex'
import type { MarkdownRenderer as MarkdownIt } from 'vitepress'
import {
  loadContent, parseContainerInfo, resolveTarget, parseMarkRef, anchorId, KIND_NAMES, CONTAINER_TYPES, STATEMENT_TYPES, sourceTag,
  type ContentIndex,
} from '../packages/content/index'
import { ALGORITHMS } from '../packages/graph-core/src/algorithms'
import { KATEX_MACROS } from '../packages/graph-vue/src/katexMacros'
import { BASE } from './base'

export const ROOT = path.resolve(__dirname, '..')

export { KATEX_MACROS }

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function renderTex(content: string, displayMode: boolean, where = ''): string {
  try {
    const html = katex.renderToString(content, { displayMode, macros: { ...KATEX_MACROS }, throwOnError: true, strict: 'ignore', output: 'htmlAndMathml' })
    return displayMode ? `<div class="ga-math-block" v-pre>${html}</div>` : `<span v-pre>${html}</span>`
  } catch (e) {
    throw new Error(`KaTeX error${where ? ` in ${where}` : ''}: ${(e as Error).message} in "${content}"`)
  }
}

/** Render text containing $math$ (titles, labels). Everything else is escaped. */
export function inlineMath(text: string, where = ''): string {
  return text.split(/(\$[^$]+\$)/g).map(part =>
    part.startsWith('$') && part.endsWith('$') && part.length > 1 ? renderTex(part.slice(1, -1), false, where) : escapeHtml(part),
  ).join('')
}

function b64(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64')
}

// One index per page render (S1): loadContent re-reads every content directory on each call.
const perRender = new WeakMap<object, ContentIndex>()
function contentFor(env: any): ContentIndex {
  if (!env || typeof env !== 'object') return loadContent(ROOT)
  let ix = perRender.get(env)
  if (!ix) perRender.set(env, ix = loadContent(ROOT))
  return ix
}

/** Replace [[target]] by markdown links, for text that is rendered at runtime (graph block captions etc.). */
function linkRefs(index: ContentIndex, text: string): string {
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, t: string, label?: string) => {
    const r = resolveTarget(index, t.trim())
    return r ? `[${label ?? r.label}](${r.href})` : `[[${t}]]`
  })
}

const KEYWORDS = /\b(foreach|for|while|if|then|else|return|do|repeat|until|break|times|and|or|not|in)\b/g

export function renderPseudo(code: string): string {
  const lines = code.replace(/\s+$/, '').split('\n').map(line => {
    let label = ''
    const m = /^(.*?)(\/\/.*?)?@([\w-]+)\s*$/.exec(line)
    let text = line
    if (m) {
      label = m[3]
      const comment = (m[2] ?? '').replace(/^\/\/\s*/, '').trim()
      text = m[1].replace(/\s+$/, '') + (comment ? `   // ${comment}` : '')
    }
    const [codePart, ...commentParts] = text.split('//')
    let html = escapeHtml(codePart).replace(KEYWORDS, '<b>$1</b>')
    if (commentParts.length) html += `<span class="ga-pseudo-comment">//${escapeHtml(commentParts.join('//'))}</span>`
    return `<span class="ga-line"${label ? ` data-label="${label}"` : ''}>${html || ' '}</span>`
  })
  return `<pre class="ga-pseudo" v-pre><code>${lines.join('\n')}</code></pre>`
}

export function setupMarkdown(md: MarkdownIt) {
  // ---- math ----
  md.use(tex as any, {
    delimiters: 'dollars',
    render: (content: string, displayMode: boolean, env: any) => renderTex(content, displayMode, env?.relativePath),
  })

  // ---- fences: graph and pseudo ----
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const info = token.info.trim()
    if (/^graph(\s|$)/.test(info)) {
      const index = contentFor(env)
      const kv: Record<string, string> = {}
      info.slice(5).replace(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|\S+)/g, (_, k, v, q) => (kv[k] = q ?? v, ''))
      const algo = /^algo:\s*(\S+)/m.exec(token.content)?.[1]
      const pseudoId = algo && ALGORITHMS[algo] ? ALGORITHMS[algo].pseudocode ?? `alg:${algo}` : undefined
      const pseudo = pseudoId ? index.pseudocode.get(pseudoId) : undefined
      const payload = {
        id: kv.id, info: kv, source: linkRefs(index, token.content),
        pseudocode: pseudo ? { id: pseudoId, html: renderPseudo(pseudo).replace(' v-pre', '') } : undefined,
      }
      const anchor = kv.id ? ` id="fig-${anchorId(kv.id)}"` : ''
      return `<div class="ga-figure-anchor"${anchor}><GraphBlock data="${b64(JSON.stringify(payload))}" /></div>\n`
    }
    if (/^pseudo(\s|$)/.test(info)) return renderPseudo(token.content)
    return fence(tokens, idx, options, env, self)
  }

  // ---- [[refs]] ----
  md.inline.ruler.before('link', 'ga_ref', (state, silent) => {
    const src = state.src.slice(state.pos)
    const m = /^\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/.exec(src)
    if (!m) return false
    if (!silent) {
      const index = contentFor(state.env)
      const mark = parseMarkRef(m[1].trim())
      const r = mark ? undefined : resolveTarget(index, m[1].trim())
      if (mark && m[2]) {
        // a mark link spotlights part of a figure (MarkLink.vue); the validator checks figure, mark and page
        const t = state.push('html_inline', '', 0)
        t.content = `<MarkLink fig="${escapeHtml(mark.fig)}" mark="${escapeHtml(mark.mark)}">${inlineMath(m[2])}</MarkLink>`
      } else if (r) {
        const open = state.push('link_open', 'a', 1)
        open.attrs = [['href', r.href], ['class', 'ga-ref']]
        const t = state.push('html_inline', '', 0)
        t.content = m[2] ? inlineMath(m[2]) : inlineMath(r.label)
        state.push('link_close', 'a', -1)
      } else {
        const t = state.push('html_inline', '', 0)
        t.content = `<span class="ga-ref-broken">[[${escapeHtml(m[1])}]]</span>`
      }
    }
    state.pos += m[0].length
    return true
  })

  // ---- containers ----
  const opened: { type: string }[] = []
  for (const type of CONTAINER_TYPES) {
    // markdown-it-container's types target a different markdown-it version than VitePress bundles
    md.use(container as any, type, {
      validate: (params: string) => params.trim().split(/[\s{]/)[0] === type,
      render: (tokens: any[], idx: number, _o: any, env: any) => {
        const tok = tokens[idx]
        if (tok.nesting === 1) {
          opened.push({ type })
          return openContainer(type, tok.info.trim().slice(type.length), env, tok)
        }
        opened.pop()
        return closeContainer(type)
      },
    })
  }

  // ---- proofs: source length and walkthrough, for proofOnConceptPage ----
  // shortcut: a walkthrough counts for the next proof after it (the order of CONTENT_CONVENTIONS.md §9), not matched by for=
  md.core.ruler.push('ga_proof_meta', state => {
    let walkthrough = false
    for (const t of state.tokens) {
      if (t.type === 'container_walkthrough_open') walkthrough = true
      if (t.type === 'container_proof_open') {
        t.meta = { lines: t.map ? t.map[1] - t.map[0] - 1 : 0, walkthrough }
        walkthrough = false
      }
    }
  })

  // ---- quizzes: task-list choices and `answer:` lines ----
  md.core.ruler.push('ga_quiz', state => {
    const toks = state.tokens
    let quiz: any
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i]
      if (t.type === 'container_quiz_open') { quiz = t; quiz.meta = { answer: undefined, tolerance: undefined }; continue }
      if (t.type === 'container_quiz_close') { quiz = undefined; continue }
      if (!quiz) continue
      if (t.type === 'bullet_list_open') t.attrJoin('class', 'ga-choices')
      if (t.type === 'inline') {
        const m = /^\[( |x|X)\]\s+/.exec(t.content)
        if (m && toks[i - 2]?.type === 'list_item_open') {
          toks[i - 2].attrSet('data-correct', m[1] === ' ' ? 'false' : 'true')
          toks[i - 2].attrJoin('class', 'ga-choice')
          t.content = t.content.slice(m[0].length)
          const first = t.children?.[0]
          if (first?.type === 'text') first.content = first.content.replace(/^\[( |x|X)\]\s+/, '')
        }
        const a = /^answer:\s*(.+)$/m.exec(t.content)
        const tol = /^tolerance:\s*(.+)$/m.exec(t.content)
        if (a || tol) {
          if (a) quiz.meta.answer = a[1].trim()
          if (tol) quiz.meta.tolerance = tol[1].trim()
          t.children = []
          t.content = ''
          if (toks[i - 1]?.type === 'paragraph_open') toks[i - 1].hidden = true
          if (toks[i + 1]?.type === 'paragraph_close') toks[i + 1].hidden = true
        }
      }
    }
  })
}

/** Concept pages (CONTENT_CONVENTIONS.md §4.3): a proof of more than 10 source lines, or one with a walkthrough, renders closed. */
export function proofOnConceptPage(lines: number, walkthrough: boolean): { closed: boolean; summary: string } {
  return { closed: walkthrough || lines > 10, summary: walkthrough ? 'Compact proof' : 'Proof' }
}

function openContainer(type: string, rest: string, env: any, tok: any): string {
  const index = contentFor(env)
  const { id, attrs } = parseContainerInfo(rest)
  const where = env?.relativePath ?? ''
  const name = KIND_NAMES[type] ?? type
  const c = id ? index.byId.get(id) : undefined
  const title = attrs.title ? `<span class="ga-box-title">${inlineMath(attrs.title, where)}</span>` : ''
  const extra = attrs.extra === 'true' ? ' <span class="ga-badge" title="Not covered in the lectures; added for completeness">beyond the lectures</span>' : ''
  const anchor = id ? ` id="${anchorId(id)}"` : ''
  switch (type) {
    case 'proof': {
      const concept = env?.frontmatter?.chapter ? proofOnConceptPage(tok.meta?.lines ?? 0, !!tok.meta?.walkthrough) : undefined
      const t = attrs.title ? inlineMath(attrs.title, where) : concept?.summary ?? 'Proof'
      const closed = concept ? concept.closed : env?.frontmatter?.referencePage
      return `<details class="ga-proof"${closed ? '' : ' open'}><summary>${t}</summary><div class="ga-proof-body">\n`
    }
    case 'hint':
    case 'solution':
    case 'explanation':
      if (type === 'explanation') return `<div class="ga-quiz-explanation"><div class="ga-quiz-explanation-head">Explanation</div>\n`
      return `<details class="ga-reveal ga-${type}"><summary>${name}</summary><div>\n`
    case 'quiz': {
      const meta = tok.meta ?? {}
      const props = [`qid="${id ?? ''}"`]
      if (meta.answer !== undefined) props.push(`answer="${escapeHtml(meta.answer)}"`)
      if (meta.tolerance !== undefined) props.push(`tolerance="${escapeHtml(meta.tolerance)}"`)
      return `<QuizBlock ${props.join(' ')}>\n`
    }
    default: {
      const kindClass = STATEMENT_TYPES.has(type) && type !== 'claim' ? ' ga-statement' : ''
      const diff = attrs.difficulty ? ` <span class="ga-difficulty" title="difficulty ${attrs.difficulty} of 3">${'●'.repeat(Number(attrs.difficulty))}${'○'.repeat(3 - Number(attrs.difficulty))}</span>` : ''
      const back = env?.frontmatter?.referencePage && c ? ` <a class="ga-box-source" href="${BASE}${c.lesson.path}#${anchorId(id!)}">${c.lesson.kind === 'concept' ? c.lesson.title : `in lesson ${c.lesson.course === 'theory' ? 'T' : 'A'}${c.lesson.lecture}`}</a>` : ''
      const dataId = id ? ` data-ref="${escapeHtml(id)}"` : ''
      const cls = `ga-box ga-${type}${kindClass}${attrs.extra === 'true' ? ' ga-extra' : ''}`
      const src = attrs.source && sourceTag(attrs.source)
      const srcTag = src ? ` <span class="ga-box-src" title="Where this is in the course material">${escapeHtml(src)}</span>` : ''
      const head = `<span class="ga-box-kind">${name}</span>${title ? ' · ' + title : ''}${srcTag}`
      // topic pages: the head is an h4 with the anchor, on one line, so the local search indexes each entry
      if (env?.frontmatter?.topicPage && c && !c.parentId && (kindClass || type === 'definition' || type === 'algorithm')) {
        const a = anchorId(id!)
        return `<div class="${cls}"${dataId}><div class="ga-box-head"><h4 id="${a}" tabindex="-1">${head} <a class="header-anchor" href="#${a}" aria-label="Permalink">&#8203;</a></h4>${diff}${extra}${back}</div><div class="ga-box-body">\n`
      }
      return `<div class="${cls}"${anchor}${dataId}><div class="ga-box-head">${head}${diff}${extra}${back}</div><div class="ga-box-body">\n`
    }
  }
}

function closeContainer(type: string): string {
  switch (type) {
    case 'proof': return '<span class="ga-qed" aria-label="end of proof">∎</span></div></details>\n'
    case 'hint': case 'solution': return '</div></details>\n'
    case 'explanation': return '</div>\n'
    case 'quiz': return '</QuizBlock>\n'
    default: return '</div></div>\n'
  }
}
