// Validates content/: container ids, [[refs]], graph blocks (DSL parse), and registry names (algo/check/live).
// Exits with code 1 on errors. Run: npm run validate
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent, resolveTarget } from '../packages/content/index'
import { REFERENCE_KINDS } from '../packages/content/pages'
import { parseGraph, parseCall } from '../packages/graph-core/src/dsl/parser'
import { ALGORITHMS } from '../packages/graph-core/src/algorithms'
import { PREDICATES } from '../packages/graph-core/src/predicates'
import { PROPERTIES } from '../packages/graph-core/src/properties'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const index = loadContent(root)
const errors: string[] = []
const warnings: string[] = []
const lint: string[] = []
const where = (file: string, line?: number) => `${path.relative(root, file)}${line ? `:${line}` : ''}`

for (const p of index.problems) errors.push(`${p.lesson ? where(p.lesson.file, p.line) : ''} ${p.message}`)

for (const r of index.refs) {
  if (!resolveTarget(index, r.target)) errors.push(`${where(r.lesson.file, r.line)} broken reference [[${r.target}]]`)
}

const resolveFigure = (id: string, panel?: number) => {
  const f = index.figureById.get(id)
  if (!f) return undefined
  return parseGraph(f.source, f.info).panels[(panel ?? 1) - 1]?.graph
}

const WIDGETS = new Set(['figure', 'player', 'editable', 'exercise', 'stepper'])
for (const f of index.figures) {
  const doc = parseGraph(f.source, f.info, { resolveFigure })
  const at = (line: number) => where(f.lesson.file, f.line + line)
  for (const e of doc.errors) errors.push(`${at(e.line)} [${f.id}] ${e.message}`)
  for (const w of doc.warnings) warnings.push(`${at(w.line)} [${f.id}] ${w.message}`)
  const widget = f.info.widget ?? 'figure'
  if (!WIDGETS.has(widget)) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] unknown widget ${widget}`)
  if (!doc.directives.caption && widget !== 'exercise') warnings.push(`${where(f.lesson.file, f.line)} [${f.id}] no caption`)
  const algo = doc.directives.algo?.[0]
  if (algo && !ALGORITHMS[algo]) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] unknown algorithm ${algo}`)
  if (algo && ALGORITHMS[algo]) {
    const code = index.pseudocode.get(ALGORITHMS[algo].pseudocode ?? `alg:${algo}`)
    for (const label of ALGORITHMS[algo].labels ?? []) {
      if (code && !code.includes(`@${label}`)) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] pseudocode of ${algo} lacks @${label}`)
    }
  }
  for (const c of doc.directives.check ?? []) {
    const { name } = parseCall(c)
    if (!PREDICATES[name]) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] unknown predicate ${name}`)
  }
  for (const l of doc.directives.live ?? []) {
    for (const name of l.split(',').map(s => s.trim()).filter(Boolean))
      if (!PROPERTIES[name]) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] unknown live property ${name}`)
  }
  if (widget === 'exercise' && !doc.directives.task) errors.push(`${where(f.lesson.file, f.line)} [${f.id}] exercise without task`)
}

for (const u of index.unclear) warnings.push(`${where(u.lesson.file, u.line)} SOURCE UNCLEAR: ${u.text}`)
for (const l of index.lessons) if (l.status === 'draft') warnings.push(`${where(l.file)} status: draft`)

// Lint: every reference entry has an attached intuition.
const refTypes = new Set(Object.values(REFERENCE_KINDS).flatMap(k => k.types))
const entries = index.containers.filter(c => refTypes.has(c.type) && c.id && !c.parentId)
const explained = new Set(index.containers.filter(c => c.type === 'intuition').map(c => c.forId))
for (const c of entries) if (!explained.has(c.id)) lint.push(`${where(c.lesson.file, c.line)} ${c.id} has no intuition`)

// Lint: a defined term mentioned in another section (## heading) must be linked there to one of its definitions.
// Terms of definitions marked basic=true (graph, vertex, edge, ...) are exempt; cross-course links are added by hand.
const definedBy = new Map<string, Set<string>>()
for (const c of index.containers) {
  if (c.type !== 'definition' || !c.id || !c.attrs.defines) continue
  for (const t of c.attrs.defines.split(',').map(s => s.trim()))
    if (t && !/[_({\\]/.test(t) && c.attrs.basic !== 'true') definedBy.set(t, (definedBy.get(t) ?? new Set()).add(c.id))
}
const terms = [...definedBy.keys()].sort((a, b) => b.length - a.length)
const termRe = new Map(terms.map(t => {
  const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [t, new RegExp(`(?<![\\w-])${esc}(?:s|es)?(?![\\w-])`, /[A-Z]/.test(t) ? 'g' : 'gi')]
}))
for (const l of index.lessons) {
  const lines = l.source.split('\n')
  const sections: { start: number; text: string[] }[] = [{ start: 1, text: [] }]
  let fence = false
  lines.forEach((line, i) => {
    if (/^\s*(`{3,}|~{3,})/.test(line)) { fence = !fence; sections.at(-1)!.text.push(''); return }
    if (/^## /.test(line) && !fence) { sections.push({ start: i + 1, text: [] }); return }
    sections.at(-1)!.text.push(fence || /^(:{3,})|^#/.test(line) ? '' : line)
  })
  const fm = sections[0]
  fm.text = fm.text.map(() => '')   // frontmatter and title
  const defsIn = (s: typeof sections[number]) => {
    const end = s.start + s.text.length
    return new Set(index.containers.filter(c => c.lesson === l && c.type === 'definition' && c.line >= s.start && c.line <= end).map(c => c.id))
  }
  for (const s of sections) {
    const own = defsIn(s)
    const linked = new Set(index.refs.filter(r => r.lesson === l && r.line >= s.start && r.line <= s.start + s.text.length).map(r => r.target))
    let text = s.text.join('\n')
      .replace(/<!--[\s\S]*?-->/g, ' ').replace(/\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g, ' ')
      .replace(/\[\[[^\]]*\]\]|\[[^\]]*\]\([^)]*\)|`[^`\n]*`|<[^>\n]*>/g, ' ')
    for (const t of terms) {
      const ids = new Set([...definedBy.get(t)!].filter(id => index.byId.get(id)!.lesson.course === l.course))
      if (!ids.size) continue
      const re = termRe.get(t)!
      re.lastIndex = 0
      const m = re.exec(text)
      if (!m) continue
      if (![...ids].some(id => own.has(id) || linked.has(id))) {
        const line = s.start + text.slice(0, m.index).split('\n').length
        lint.push(`${where(l.file, line)} "${t}" not linked to [[${[...ids][0]}]] in this section`)
      }
      text = text.replace(re, m => ' '.repeat(m.length))
    }
  }
}

for (const w of warnings) console.warn(`warning: ${w}`)
for (const w of lint) console.warn(`lint: ${w}`)
for (const e of errors) console.error(`error: ${e}`)
console.log(`\n${index.lessons.length} lessons, ${index.containers.length} containers, ${index.figures.length} figures, ${index.refs.length} references: ${errors.length} errors, ${warnings.length} warnings, ${lint.length} lint warnings`)
if (errors.length) process.exit(1)
