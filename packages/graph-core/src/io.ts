// Import / export: DSL, JSON, TikZ, adjacency matrix and list, share URLs (PLAN.md §10).
import LZString from 'lz-string'
import { emptyGraph, ends, type AttrValue, type GraphData, type Id } from './model'
import { parseGraph, KNOWN_DIRECTIVES } from './dsl/parser'

const IDENT = /^[A-Za-z0-9_][A-Za-z0-9_']*$/

function val(v: AttrValue): string {
  if (typeof v === 'number') return v === Infinity ? 'inf' : String(v)
  return IDENT.test(v) ? v : `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function attrs(pairs: [string, AttrValue | undefined][]): string {
  const xs = pairs.filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${val(v!)}`)
  return xs.length ? ` [${xs.join(' ')}]` : ''
}

/** Serialize a graph to canonical DSL text. */
export function serialize(g: GraphData, opts: { positions?: boolean } = {}): string {
  const out: string[] = []
  if (g.type !== 'undirected') out.push(`type: ${g.type}`)
  if (g.simple) out.push('simple: true')
  for (const k of ['layout', 'vertex-label', 'edge-label', 'directed-style']) if (g.meta[k]) out.push(`${k}: ${g.meta[k]}`)
  for (const v of g.vertices) {
    const a = attrs([['label', v.label], ['class', v.classes.join(' ') || undefined], ...Object.entries(v.data)])
    const pos = (v.pinned || opts.positions) && v.x !== undefined && v.y !== undefined ? ` @(${round(v.x)}, ${round(v.y)})` : ''
    const isolated = !g.edges.some(e => e.tail.includes(v.id) || e.head.includes(v.id))
    if (a || pos || isolated) out.push(`${v.id}${a}${pos}`)
  }
  // edges: keep declaration order so auto ids and parallel indices survive
  // the parser numbers edges without explicit id e1, e2, …; emit id= only where that would differ
  let auto = 0
  g.edges.forEach(e => {
    const isAuto = e.id === `e${auto + 1}`
    if (isAuto) auto++
    const a = attrs([['id', isAuto ? undefined : e.id], ['label', e.label], ['class', e.classes.join(' ') || undefined], ...Object.entries(e.data)])
    if (e.hyper) {
      out.push(`hyperedge {${e.tail.join(' ')}}${e.directed ? ` -> {${e.head.join(' ')}}` : ''}${a}`)
      return
    }
    const [u, v] = ends(e)
    out.push(`${u} ${e.directed ? '->' : '--'} ${v}${a}`)
  })
  for (const f of g.faces) out.push(`face ${f.id}${f.outer ? ' outer' : ''}: ${f.walk.join(' ')}${attrs([['label', f.label], ['class', f.classes.join(' ') || undefined]])}`)
  for (const gr of g.groups) out.push(`group ${gr.id}: ${gr.members.join(' ')}${attrs([['label', gr.label], ['class', gr.classes.join(' ') || undefined]])}`)
  return out.join('\n') + '\n'
}

const round = (x: number) => Math.round(x * 100) / 100

export function toJSON(g: GraphData): string {
  return JSON.stringify({ format: 'graph-atlas', version: 1, graph: g }, null, 2)
}

export function fromJSON(text: string): GraphData {
  const o = JSON.parse(text)
  const g = o.graph ?? o
  if (!Array.isArray(g.vertices) || !Array.isArray(g.edges)) throw new Error('not a graph JSON file')
  const base = emptyGraph(g.type ?? 'undirected')
  return {
    ...base, ...g,
    vertices: g.vertices.map((v: any) => ({ classes: [], data: {}, ...v })),
    edges: g.edges.map((e: any) => ({ classes: [], data: {}, hyper: false, directed: false, ...e })),
    faces: g.faces ?? [], groups: g.groups ?? [], meta: g.meta ?? {},
  }
}

/** Adjacency matrix (entries count parallel edges; loops count 2 on the diagonal, as degrees do). */
export function toAdjacencyMatrix(g: GraphData): { ids: Id[]; matrix: number[][] } {
  const ids = g.vertices.map(v => v.id)
  const at = new Map(ids.map((v, i) => [v, i]))
  const M = ids.map(() => ids.map(() => 0))
  for (const e of g.edges) {
    if (e.hyper) continue
    const [u, v] = ends(e)
    const i = at.get(u)!, j = at.get(v)!
    if (u === v) M[i][i] += e.directed ? 1 : 2
    else { M[i][j]++; if (!e.directed) M[j][i]++ }
  }
  return { ids, matrix: M }
}

export function adjacencyMatrixText(g: GraphData): string {
  const { ids, matrix } = toAdjacencyMatrix(g)
  const w = Math.max(...ids.map(x => x.length), 1)
  return [' '.repeat(w) + ' ' + ids.map(x => x.padStart(w)).join(' '), ...matrix.map((row, i) => ids[i].padStart(w) + ' ' + row.map(x => String(x).padStart(w)).join(' '))].join('\n')
}

/** Parse a square 0/1 (or count) matrix; symmetric matrices give undirected graphs. */
export function fromAdjacencyMatrix(text: string): GraphData {
  const rows = text.trim().split('\n').map(r => r.trim().split(/[\s,;]+/).filter(Boolean))
  const numeric = rows.filter(r => r.every(x => /^-?\d+(\.\d+)?$/.test(x)))
  const n = numeric.length
  if (!n || numeric.some(r => r.length !== n)) throw new Error('expected a square matrix of numbers')
  const M = numeric.map(r => r.map(Number))
  const sym = M.every((r, i) => r.every((x, j) => x === M[j][i]))
  const g = emptyGraph(sym ? 'undirected' : 'directed')
  g.vertices = M.map((_, i) => ({ id: String(i + 1), classes: [], data: {} }))
  let k = 0
  const push = (i: number, j: number) => g.edges.push({ id: `e${++k}`, tail: [String(i + 1)], head: [String(j + 1)], directed: !sym, hyper: false, classes: [], data: {} })
  for (let i = 0; i < n; i++)
    for (let j = sym ? i : 0; j < n; j++) {
      const c = i === j && sym ? M[i][j] / 2 : M[i][j]
      for (let t = 0; t < c; t++) push(i, j)
    }
  return g
}

export function adjacencyListText(g: GraphData): string {
  return g.vertices.map(v => {
    const ns: string[] = []
    for (const e of g.edges) {
      if (e.hyper) continue
      const [a, b] = ends(e)
      if (a === v.id) ns.push(b)
      else if (b === v.id && !e.directed) ns.push(a)
    }
    return `${v.id}: ${ns.join(' ')}`
  }).join('\n')
}

/** Parse "v: n1 n2 …" lines. Undirected unless some neighbour relation is one-sided. */
export function fromAdjacencyList(text: string): GraphData {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean)
  const adj = new Map<Id, Id[]>()
  for (const l of lines) {
    const m = /^([^:\s]+)\s*:\s*(.*)$/.exec(l)
    if (!m) throw new Error(`cannot parse line "${l}"`)
    adj.set(m[1], m[2].split(/[\s,]+/).filter(Boolean))
  }
  for (const ns of adj.values()) for (const w of ns) if (!adj.has(w)) adj.set(w, [])
  const count = (a: Id, b: Id) => adj.get(a)!.filter(x => x === b).length
  const sym = [...adj].every(([a, ns]) => ns.every(b => count(a, b) === count(b, a)))
  const g = emptyGraph(sym ? 'undirected' : 'directed')
  g.vertices = [...adj.keys()].map(id => ({ id, classes: [], data: {} }))
  let k = 0
  for (const [a, ns] of adj) for (const b of ns) {
    if (sym && a > b) continue
    g.edges.push({ id: `e${++k}`, tail: [a], head: [b], directed: !sym, hyper: false, classes: [], data: {} })
  }
  return g
}

/** TikZ export using the vertex positions (call after layout). */
export function toTikZ(g: GraphData, scale = 1.5): string {
  const name = (id: Id) => `v${id.replace(/[^A-Za-z0-9]/g, (c) => `x${c.charCodeAt(0)}`)}`
  const tex = (s?: string) => (s ?? '').replace(/^\$(.*)\$$/, '$$$1$$')
  const lines = [
    '% Generated by Graph Atlas. Requires \\usetikzlibrary{arrows.meta}',
    '\\begin{tikzpicture}[',
    '  vertex/.style={circle, draw, fill=white, inner sep=1.5pt, minimum size=16pt},',
    '  arc/.style={-{Stealth[length=6pt]}},',
    '  highlight/.style={very thick}, muted/.style={draw=black!35},',
    ']',
  ]
  for (const v of g.vertices) {
    const label = v.label ? tex(v.label) : `$${v.id}$`
    lines.push(`  \\node[vertex] (${name(v.id)}) at (${round((v.x ?? 0) * scale)}, ${round((v.y ?? 0) * scale)}) {${label}};`)
  }
  const groups = new Map<string, number>()
  for (const e of g.edges) {
    if (e.hyper) continue
    const [u, v] = ends(e)
    const key = [u, v].sort().join('\u0000')
    const k = groups.get(key) ?? 0
    groups.set(key, k + 1)
    const total = g.edges.filter(x => !x.hyper && [...ends(x)].sort().join('\u0000') === key).length
    const opts: string[] = []
    if (e.directed) opts.push('arc')
    for (const c of e.classes) if (c === 'highlight' || c === 'tree' || c === 'path' || c === 'cut' || c === 'matched') opts.push('highlight')
    if (e.classes.includes('muted')) opts.push('muted')
    if (e.classes.includes('dashed')) opts.push('dashed')
    const lab = e.label ?? (e.data.f !== undefined && e.data.c !== undefined ? `${e.data.f}/${e.data.c}` : e.data.c ?? e.data.w)
    const node = lab !== undefined ? ` node[midway, auto, font=\\small] {$${lab}$}` : ''
    if (u === v) {
      lines.push(`  \\draw[${[...opts, 'loop above', 'min distance=8mm'].join(', ')}] (${name(u)}) to${node} (${name(u)});`)
      continue
    }
    const bend = total > 1 ? (k - (total - 1) / 2) * 25 : Number(e.data.bend ?? 0) * 40
    if (bend) opts.push(bend > 0 ? `bend left=${round(bend)}` : `bend right=${round(-bend)}`)
    lines.push(`  \\draw${opts.length ? `[${opts.join(', ')}]` : ''} (${name(u)}) to${node} (${name(v)});`)
  }
  lines.push('\\end{tikzpicture}')
  return lines.join('\n')
}

export function encodeShare(text: string): string {
  return LZString.compressToEncodedURIComponent(text)
}

export function decodeShare(code: string): string | null {
  return LZString.decompressFromEncodedURIComponent(code)
}

/** Detect the format of pasted text and import it. */
export function importAny(text: string): GraphData {
  const t = text.trim()
  if (t.startsWith('{')) return fromJSON(t)
  if (!/--|->/.test(t) && /^[\d\s,;.-]+$/.test(t)) return fromAdjacencyMatrix(t)
  // adjacency list: every line is "v: neighbours", and no key is a DSL directive
  const lines = t.split('\n').filter(l => l.trim())
  if (lines.every(l => /^\s*[^:\s]+\s*:/.test(l) && !KNOWN_DIRECTIVES.has(l.split(':')[0].trim()))) return fromAdjacencyList(t)
  const doc = parseGraph(t)
  if (doc.errors.length) throw new Error(doc.errors.map(e => `line ${e.line}: ${e.message}`).join('\n'))
  return doc.panels[0].graph
}
