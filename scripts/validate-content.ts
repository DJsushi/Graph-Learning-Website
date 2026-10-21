// Validates content/: container ids, [[refs]], graph blocks (DSL parse), and registry names (algo/check/live).
// Exits with code 1 on errors. Run: npm run validate
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent, resolveTarget } from '../packages/content/index'
import { parseGraph, parseCall } from '../packages/graph-core/src/dsl/parser'
import { ALGORITHMS } from '../packages/graph-core/src/algorithms'
import { PREDICATES } from '../packages/graph-core/src/predicates'
import { PROPERTIES } from '../packages/graph-core/src/properties'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const index = loadContent(root)
const errors: string[] = []
const warnings: string[] = []
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

for (const w of warnings) console.warn(`warning: ${w}`)
for (const e of errors) console.error(`error: ${e}`)
console.log(`\n${index.lessons.length} lessons, ${index.containers.length} containers, ${index.figures.length} figures, ${index.refs.length} references: ${errors.length} errors, ${warnings.length} warnings`)
if (errors.length) process.exit(1)
