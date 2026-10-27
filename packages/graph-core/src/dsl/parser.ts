// Parser for the graph DSL (GRAPH_DSL.md). Line based; produces one GraphData per panel plus stepper frames.
import { cloneGraph, emptyGraph, resolveRef, type Attrs, type AttrValue, type Edge, type GraphData, type Id, type Merge } from '../model'
import * as gen from './generators'

export interface DslMessage { line: number; message: string }
export type Directives = Record<string, string[]>

export interface StepDoc {
  text: string
  graph: GraphData
  /** vertices merged (or, with `split`, split apart) by this step's statements; drives the animation */
  merges?: Merge[]
  split?: boolean
}

export interface PanelDoc {
  title?: string
  /** graph before any step (or the whole graph if there are no steps) */
  graph: GraphData
  /** stepper frames: state after each step's statements */
  steps: StepDoc[]
  directives: Directives
}

export interface GraphDoc {
  info: Record<string, string>
  directives: Directives
  panels: PanelDoc[]
  errors: DslMessage[]
  warnings: DslMessage[]
}

export const TEXT_DIRECTIVES = new Set(['caption', 'intent', 'prompt', 'hint', 'solution', 'step', 'panel'])
export const KNOWN_DIRECTIVES = new Set([
  ...TEXT_DIRECTIVES, 'type', 'simple', 'use', 'layout', 'vertex-label', 'edge-label', 'directed-style', 'interactive',
  'algo', 'params', 'show', 'start', 'editable', 'live', 'allow', 'reset', 'task', 'check', 'answer', 'tolerance',
  'reveal', 'layout-sync', 'height',
])
/** Directives that affect only the graph of the current panel. */
const PANEL_GRAPH_DIRECTIVES = new Set(['type', 'simple', 'layout', 'vertex-label', 'edge-label', 'directed-style'])

export type RefResolver = (figureId: string, panel?: number) => GraphData | undefined

export interface ParseOptions { resolveFigure?: RefResolver }

/** Parse `key=value` pairs (values may be quoted). Used for info strings, params and check arguments. */
export function parseKV(s: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /([A-Za-z_][\w-]*)\s*=\s*("((?:[^"\\]|\\.)*)"|[^\s"]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) out[m[1]] = m[3] !== undefined ? m[3].replace(/\\(.)/g, '$1') : m[2]
  return out
}

/** Split `name args…` of a check: / algo line into name and key/value args. */
export function parseCall(s: string): { name: string; args: Record<string, string> } {
  const t = s.trim()
  const sp = t.search(/\s/)
  if (sp < 0) return { name: t, args: {} }
  return { name: t.slice(0, sp), args: parseKV(t.slice(sp + 1)) }
}

function splitStatements(line: string): string[] {
  const out: string[] = []
  let cur = '', inStr = false, depth = 0
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inStr) {
      cur += ch
      if (ch === '\\') { cur += line[++i] ?? ''; continue }
      if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') { inStr = true; cur += ch; continue }
    if (ch === '[' || ch === '(' || ch === '{') depth++
    if (ch === ']' || ch === ')' || ch === '}') depth--
    if (ch === ';' && depth <= 0) { out.push(cur); cur = ''; continue }
    cur += ch
  }
  out.push(cur)
  return out.map(s => s.trim()).filter(Boolean)
}

function stripComment(line: string): string {
  let inStr = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inStr) { if (ch === '\\') i++; else if (ch === '"') inStr = false; continue }
    if (ch === '"') inStr = true
    else if (ch === '/' && line[i + 1] === '/') return line.slice(0, i)
  }
  return line
}

function value(raw: string): AttrValue {
  if (raw === 'inf') return Infinity
  if (/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(raw)) return Number(raw)
  return raw
}

const IDENT = /^[A-Za-z0-9_][A-Za-z0-9_']*/

class Scanner {
  pos = 0
  constructor(public s: string) {}
  ws() { while (this.pos < this.s.length && /\s/.test(this.s[this.pos])) this.pos++ }
  eof() { this.ws(); return this.pos >= this.s.length }
  peek(str: string) { this.ws(); return this.s.startsWith(str, this.pos) }
  eat(str: string) { if (this.peek(str)) { this.pos += str.length; return true } return false }
  ident(): string | undefined {
    this.ws()
    const m = IDENT.exec(this.s.slice(this.pos))
    if (!m) return undefined
    this.pos += m[0].length
    return m[0]
  }
  op(): '--' | '->' | undefined {
    if (this.eat('--')) return '--'
    if (this.eat('->')) return '->'
    return undefined
  }
  attrs(): Attrs | undefined {
    if (!this.eat('[')) return undefined
    const end = findClose(this.s, this.pos - 1, '[', ']')
    if (end < 0) throw new Error('unterminated [')
    const body = this.s.slice(this.pos, end)
    this.pos = end + 1
    const kv = parseKV(body)
    const out: Attrs = {}
    for (const [k, v] of Object.entries(kv)) out[k] = k === 'label' || k === 'class' || k === 'id' ? v : value(v)
    const leftover = body.replace(/([A-Za-z_][\w-]*)\s*=\s*("((?:[^"\\]|\\.)*)"|[^\s"]+)/g, '').trim()
    if (leftover) throw new Error(`cannot parse attributes near "${leftover}"`)
    return out
  }
  position(): [number, number] | undefined {
    this.ws()
    const m = /^@\(\s*([-+0-9.eE]+)\s*,\s*([-+0-9.eE]+)\s*\)/.exec(this.s.slice(this.pos))
    if (!m) return undefined
    this.pos += m[0].length
    return [Number(m[1]), Number(m[2])]
  }
  vset(): Id[] | undefined {
    if (!this.eat('{')) return undefined
    const ids: Id[] = []
    while (!this.eat('}')) {
      const id = this.ident()
      if (!id) throw new Error('expected vertex id in { }')
      ids.push(id)
    }
    return ids
  }
  rest() { this.ws(); const r = this.s.slice(this.pos); this.pos = this.s.length; return r }
}

function findClose(s: string, open: number, o: string, c: string): number {
  let depth = 0, inStr = false
  for (let i = open; i < s.length; i++) {
    const ch = s[i]
    if (inStr) { if (ch === '\\') i++; else if (ch === '"') inStr = false; continue }
    if (ch === '"') inStr = true
    else if (ch === o) depth++
    else if (ch === c && --depth === 0) return i
  }
  return -1
}

// ---------- `use:` expressions ----------

interface Expr { name: string; args: (Expr | number)[]; kw: Record<string, string> }

function parseExpr(s: string): { expr: Expr; rest: string } {
  const sc = new Scanner(s)
  const expr = parseExprAt(sc)
  return { expr, rest: sc.rest() }
}

function parseExprAt(sc: Scanner): Expr {
  const name = sc.ident()
  if (!name) throw new Error('expected generator name')
  const e: Expr = { name, args: [], kw: {} }
  if (sc.eat('(')) {
    while (!sc.eat(')')) {
      sc.ws()
      const kwm = /^([A-Za-z_]\w*)\s*=\s*([^,)\s]+)/.exec(sc.s.slice(sc.pos))
      const nm = /^-?\d+(\.\d+)?/.exec(sc.s.slice(sc.pos))
      if (kwm) { e.kw[kwm[1]] = kwm[2]; sc.pos += kwm[0].length }
      else if (nm) { e.args.push(Number(nm[0])); sc.pos += nm[0].length }
      else e.args.push(parseExprAt(sc))
      sc.eat(',')
      if (sc.eof()) throw new Error('unterminated (')
    }
  }
  return e
}

function evalExpr(e: Expr, ctx: { current: GraphData; opts: ParseOptions; warn: (m: string) => void }): GraphData {
  const n = (i: number) => {
    const a = e.args[i]
    if (typeof a !== 'number') throw new Error(`${e.name}: argument ${i + 1} must be a number`)
    return a
  }
  const g = (i: number) => {
    const a = e.args[i]
    if (typeof a === 'number' || !a) throw new Error(`${e.name}: argument ${i + 1} must be a graph`)
    return evalExpr(a, ctx)
  }
  const seed = () => {
    if (e.kw.seed === undefined) { ctx.warn(`${e.name}: no seed given, using 1`); return 1 }
    return Number(e.kw.seed)
  }
  switch (e.name) {
    case 'K':
      if (e.args.length === 1) return gen.complete(n(0))
      if (e.args.length === 2) return gen.completeBipartite(n(0), n(1))
      return gen.completeMultipartite(e.args.map((_, i) => n(i)))
    case 'C': return gen.cycle(n(0))
    case 'P': return gen.path(n(0))
    case 'E': return gen.emptyN(n(0))
    case 'Star': return gen.star(n(0))
    case 'Wheel': return gen.wheel(n(0))
    case 'Q': return gen.hypercube(n(0))
    case 'Grid': return gen.grid(n(0), n(1))
    case 'Petersen': return gen.petersen()
    case 'BinTree': return gen.binTree(n(0))
    case 'Gnp': return gen.gnp(n(0), n(1), seed())
    case 'Gnm': return gen.gnm(n(0), n(1), seed())
    case 'RandomTree': return gen.randomTree(n(0), seed())
    case 'RandomWeights': return gen.randomWeights(cloneGraph(ctx.current), n(0), n(1), seed())
    case 'complement': return gen.complement(g(0))
    case 'line': return gen.lineGraph(g(0))
    case 'this': return cloneGraph(ctx.current)
    case 'ref': {
      const a = e.args[0]
      const id = typeof a === 'object' ? a.name : String(a)
      const panel = e.kw.panel ? Number(e.kw.panel) : undefined
      const r = ctx.opts.resolveFigure?.(id, panel)
      if (!r) throw new Error(`ref(${id}): unknown figure`)
      return cloneGraph(r)
    }
    case 'dual':
      throw new Error('dual(): not supported yet')
    default:
      throw new Error(`unknown generator "${e.name}"`)
  }
}

// ---------- main parser ----------

interface PanelState {
  title?: string
  graph: GraphData
  directives: Directives
  steps: StepDoc[]
  openStep?: string
  merges: Merge[]
  split?: boolean
  baseSnapshot?: GraphData
  autoEdge: number
  usedLayoutDefault: boolean
}

export function parseGraph(source: string, info: Record<string, string> = {}, opts: ParseOptions = {}): GraphDoc {
  const errors: DslMessage[] = []
  const warnings: DslMessage[] = []
  const header: Directives = {}
  const panels: PanelState[] = []
  let lineNo = 0
  const err = (message: string) => errors.push({ line: lineNo, message })
  const warn = (message: string) => warnings.push({ line: lineNo, message })

  const newPanel = (title?: string): PanelState => {
    const g = emptyGraph()
    for (const k of ['type', 'simple', 'layout', 'vertex-label', 'edge-label', 'directed-style']) {
      const v = header[k]?.at(-1)
      if (v !== undefined) applyGraphDirective(g, k, v)
    }
    return { title, graph: g, directives: {}, steps: [], autoEdge: 0, usedLayoutDefault: false, merges: [] }
  }
  let explicit: PanelState | undefined
  let implicit: PanelState | undefined
  const panel = (): PanelState => {
    if (explicit) return explicit
    if (!implicit) { implicit = newPanel(); panels.push(implicit) }
    return implicit
  }

  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  for (const raw of lines) {
    lineNo++
    const line = stripComment(raw).trim()
    if (!line) continue
    const dm = /^([a-z][a-z-]*)\s*:\s*(.*)$/.exec(line)
    const statements = dm && TEXT_DIRECTIVES.has(dm[1]) ? [line] : splitStatements(line)
    for (const st of statements) {
      try {
        const d = /^([a-z][a-z-]*)\s*:\s*(.*)$/.exec(st)
        if (d && !/^(face|group|class|unclass)\b/.test(st)) {
          const [, key, val] = d
          if (key === 'panel') {
            explicit = newPanel(val)
            panels.push(explicit)
            continue
          }
          if (key === 'step') {
            const p = panel()
            if (p.openStep !== undefined) pushStep(p)
            else p.baseSnapshot = cloneGraph(p.graph)
            p.merges = []; p.split = undefined
            p.openStep = val
            continue
          }
          if (!KNOWN_DIRECTIVES.has(key)) { warn(`unknown directive "${key}"`); continue }
          if (key === 'use') { doUse(panel(), val); continue }
          const target = explicit ? explicit.directives : header
          ;(target[key] ??= []).push(val)
          if (PANEL_GRAPH_DIRECTIVES.has(key)) {
            if (explicit) applyGraphDirective(explicit.graph, key, val)
            else if (implicit) applyGraphDirective(implicit.graph, key, val)
          }
          continue
        }
        statement(panel(), st)
      } catch (e) {
        err((e as Error).message)
      }
    }
  }
  if (!panels.length) panels.push(newPanel())
  for (const p of panels) finishPanel(p)

  return {
    info,
    directives: header,
    panels: panels.map(p => ({ title: p.title, graph: p.baseSnapshot ?? p.graph, steps: p.steps, directives: p.directives })),
    errors,
    warnings,
  }

  function pushStep(p: PanelState) {
    const step: StepDoc = { text: p.openStep!, graph: cloneGraph(p.graph) }
    if (p.merges.length) { step.merges = p.merges; step.split = p.split }
    p.steps.push(step)
    p.merges = []
    p.split = undefined
  }

  function finishPanel(p: PanelState) {
    if (p.openStep !== undefined) {
      pushStep(p)
      p.openStep = undefined
    }
    validate(p.graph)
    for (const s of p.steps) validate(s.graph)
  }

  function validate(g: GraphData) {
    const hasArc = g.edges.some(e => e.directed)
    const hasUndirected = g.edges.some(e => !e.directed)
    if (g.type === 'undirected' && hasArc) err('directed edge "->" in an undirected graph (add "type: directed" or "type: mixed")')
    if (g.type === 'directed' && hasUndirected) err('undirected edge "--" in a directed graph (use "type: mixed")')
    if (g.simple) {
      const seen = new Set<string>()
      for (const e of g.edges) {
        if (e.hyper) continue
        const [a, b] = [e.tail[0], e.head[0]]
        if (a === b) err(`loop at ${a} in a simple graph`)
        const key = e.directed ? `${a}>${b}` : [a, b].sort().join('|')
        if (seen.has(key)) err(`parallel edge ${a}-${b} in a simple graph`)
        seen.add(key)
      }
    }
  }

  function ensureVertex(p: PanelState, id: Id) {
    let v = p.graph.vertices.find(x => x.id === id)
    if (!v) { v = { id, classes: [], data: {} }; p.graph.vertices.push(v) }
    return v
  }

  function applyVertexAttrs(v: ReturnType<typeof ensureVertex>, a: Attrs) {
    for (const [k, val] of Object.entries(a)) {
      if (k === 'label') v.label = String(val)
      else if (k === 'class') v.classes = mergeClasses(v.classes, String(val))
      else v.data[k] = val
    }
  }

  function newEdge(p: PanelState, u: Id, v: Id, directed: boolean, a: Attrs): Edge {
    const e: Edge = { id: '', tail: [u], head: [v], directed, hyper: false, classes: [], data: {} }
    applyEdgeAttrs(e, a)
    if (!e.id) e.id = nextEdgeId(p)
    else if (p.graph.edges.some(x => x.id === e.id)) throw new Error(`duplicate edge id ${e.id}`)
    return e
  }

  function nextEdgeId(p: PanelState) {
    let id: string
    do id = `e${++p.autoEdge}`
    while (p.graph.edges.some(x => x.id === id))
    return id
  }

  function applyEdgeAttrs(e: Edge, a: Attrs) {
    for (const [k, val] of Object.entries(a)) {
      if (k === 'label') e.label = String(val)
      else if (k === 'class') e.classes = mergeClasses(e.classes, String(val))
      else if (k === 'id') e.id = String(val)
      else e.data[k] = val
    }
  }

  function refs(p: PanelState, list: string) {
    return list.trim().split(/\s+/).filter(Boolean).map(r => {
      const res = resolveRef(p.graph, r)
      if (!res) {
        const grp = p.graph.groups.find(g => g.id === r)
        if (grp) return { kind: 'group' as const, id: r }
        throw new Error(`unknown element "${r}"`)
      }
      return res
    })
  }

  function statement(p: PanelState, st: string) {
    const kw = /^(hyperedge|face|group|class|unclass|remove|merge|split)\b\s*(.*)$/.exec(st)
    if (kw) return keyword(p, kw[1], kw[2])
    const sc = new Scanner(st)
    const first = sc.ident()
    if (!first) throw new Error(`cannot parse "${st}"`)
    const op = sc.op()
    if (op) {
      const chain: [Id, '--' | '->'][] = []
      let prev = first, o: '--' | '->' | undefined = op
      const nodes: Id[] = [first]
      const ops: ('--' | '->')[] = []
      while (o) {
        const nxt = sc.ident()
        if (!nxt) throw new Error(`expected vertex after "${o}"`)
        nodes.push(nxt)
        ops.push(o)
        chain.push([prev, o])
        prev = nxt
        o = sc.op()
      }
      const a = sc.attrs() ?? {}
      if (!sc.eof()) throw new Error(`unexpected "${sc.rest()}"`)
      for (const id of nodes) ensureVertex(p, id)
      for (let i = 0; i < ops.length; i++) {
        const e = newEdge(p, nodes[i], nodes[i + 1], ops[i] === '->', ops.length > 1 && a.id ? { ...a, id: `${a.id}_${i + 1}` } : a)
        p.graph.edges.push(e)
      }
      return
    }
    const ids = [first]
    let a: Attrs | undefined, pos: [number, number] | undefined
    for (;;) {
      const id = sc.ident()
      if (id) { ids.push(id); continue }
      const at = sc.attrs()
      if (at) { a = at; continue }
      const ps = sc.position()
      if (ps) { pos = ps; continue }
      break
    }
    if (!sc.eof()) throw new Error(`unexpected "${sc.rest()}"`)
    for (const id of ids) {
      const v = ensureVertex(p, id)
      if (a) applyVertexAttrs(v, a)
      if (pos) { v.x = pos[0]; v.y = pos[1]; v.pinned = true }
    }
  }

  // `merge u v -> w` identifies/contracts; `split x -> p q` is the inverse for arcs (into x -> p, out of x -> q)
  function mergeOrSplit(p: PanelState, kw: 'merge' | 'split', rest: string) {
    const m = /^(.+?)\s*->\s*(.+)$/.exec(rest)
    if (!m) throw new Error(`expected "${kw} <vertices> -> <vertices>"`)
    const split = kw === 'split'
    if (p.openStep === undefined) throw new Error(`"${kw}" belongs inside a step`)
    if (p.merges.length && p.split !== split) throw new Error('a step cannot both merge and split')
    p.split = split
    const sc = new Scanner(m[2])
    const targets: Id[] = []
    for (let x = sc.ident(); x; x = sc.ident()) targets.push(x)
    const attrs = sc.attrs() ?? {}
    const sources = m[1].trim().split(/\s+/)
    const exists = (id: Id) => p.graph.vertices.some(v => v.id === id)
    for (const id of sources) if (!exists(id)) throw new Error(`unknown vertex "${id}"`)
    if (!split) {
      if (targets.length !== 1) throw new Error('merge needs exactly one target vertex')
      const to = targets[0]
      const set = new Set(sources)
      if (exists(to) && !set.has(to)) throw new Error(`vertex "${to}" already exists`)
      const fresh = !exists(to)
      const tv = ensureVertex(p, to)
      applyVertexAttrs(tv, attrs)
      // a new vertex starts at the centroid of its members
      const at = sources.map(id => p.graph.vertices.find(v => v.id === id)!).filter(v => v.x !== undefined)
      if (fresh && at.length) { tv.x = at.reduce((n, v) => n + v.x!, 0) / at.length; tv.y = at.reduce((n, v) => n + v.y!, 0) / at.length }
      // edges inside the merged set vanish (contraction); the rest are rewired
      p.graph.edges = p.graph.edges.filter(e => !e.tail.concat(e.head).every(x => set.has(x) || x === to))
      for (const e of p.graph.edges) {
        e.tail = e.tail.map(x => (set.has(x) ? to : x))
        e.head = e.head.map(x => (set.has(x) ? to : x))
      }
      p.graph.vertices = p.graph.vertices.filter(v => v.id === to || !set.has(v.id))
      for (const g of p.graph.groups) g.members = [...new Set(g.members.map(x => (set.has(x) ? to : x)))]
      p.merges.push({ from: sources, to })
    } else {
      if (sources.length !== 1 || targets.length !== 2) throw new Error('split needs one vertex and two targets: "split x -> p q"')
      const [x] = sources, [into, out] = targets
      for (const t of targets) if (exists(t)) throw new Error(`vertex "${t}" already exists`)
      const xv = p.graph.vertices.find(v => v.id === x)!
      for (const e of p.graph.edges) if (!e.directed || e.hyper) throw new Error('split works on arcs only')
      applyVertexAttrs(ensureVertex(p, into), attrs)
      ensureVertex(p, out)
      for (const e of p.graph.edges) {
        e.head = e.head.map(v => (v === x ? into : v))
        e.tail = e.tail.map(v => (v === x ? out : v))
      }
      for (const v of [into, out]) { const nv = p.graph.vertices.find(y => y.id === v)!; nv.x = xv.x; nv.y = xv.y }
      p.graph.vertices = p.graph.vertices.filter(v => v.id !== x)
      p.merges.push({ from: targets, to: x })
    }
  }

  function keyword(p: PanelState, kw: string, rest: string) {
    if (kw === 'merge' || kw === 'split') return mergeOrSplit(p, kw, rest)
    if (kw === 'remove') {
      for (const r of refs(p, rest)) {
        if (r.kind === 'vertex') {
          p.graph.vertices = p.graph.vertices.filter(v => v.id !== r.id)
          p.graph.edges = p.graph.edges.filter(e => !e.tail.includes(r.id) && !e.head.includes(r.id))
          for (const g of p.graph.groups) g.members = g.members.filter(m => m !== r.id)
        } else if (r.kind === 'edge') p.graph.edges = p.graph.edges.filter(e => e.id !== r.id)
        else if (r.kind === 'face') p.graph.faces = p.graph.faces.filter(f => f.id !== r.id)
        else p.graph.groups = p.graph.groups.filter(g => g.id !== r.id)
      }
      return
    }
    if (kw === 'class' || kw === 'unclass') {
      const m = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(rest)
      if (!m) throw new Error(`expected "${kw} <name>: <elements>"`)
      const [, cls, list] = m
      for (const r of refs(p, list)) {
        const el = r.kind === 'vertex' ? p.graph.vertices.find(v => v.id === r.id)
          : r.kind === 'edge' ? p.graph.edges.find(e => e.id === r.id)
          : r.kind === 'face' ? p.graph.faces.find(f => f.id === r.id)
          : p.graph.groups.find(g => g.id === r.id)
        if (!el) continue
        el.classes = kw === 'class' ? mergeClasses(el.classes, cls) : el.classes.filter(c => c !== cls)
      }
      return
    }
    if (kw === 'group' || kw === 'face') {
      const m = /^([A-Za-z0-9_]+)(\s+outer)?\s*:\s*(.*)$/.exec(rest)
      if (!m) throw new Error(`expected "${kw} <id>: <vertices>"`)
      const [, id, outer, body] = m
      const sc = new Scanner(body)
      const members: Id[] = []
      for (let x = sc.ident(); x; x = sc.ident()) members.push(x)
      const a = sc.attrs() ?? {}
      if (!sc.eof()) throw new Error(`unexpected "${sc.rest()}"`)
      for (const v of members) if (!p.graph.vertices.some(x => x.id === v)) throw new Error(`unknown vertex "${v}" in ${kw} ${id}`)
      const label = a.label !== undefined ? String(a.label) : undefined
      const classes = a.class ? String(a.class).split(/\s+/) : []
      if (kw === 'group') {
        p.graph.groups = p.graph.groups.filter(g => g.id !== id)
        p.graph.groups.push({ id, members, label, classes })
      } else {
        p.graph.faces = p.graph.faces.filter(f => f.id !== id)
        p.graph.faces.push({ id, walk: members, outer: !!outer, label, classes })
      }
      return
    }
    // hyperedge
    const sc = new Scanner(rest)
    const tail = sc.vset()
    if (!tail) throw new Error('expected { … } after hyperedge')
    let head: Id[] = tail, directed = false
    if (sc.eat('->')) {
      const h = sc.vset()
      if (!h) throw new Error('expected { … } after ->')
      head = h
      directed = true
    }
    const a = sc.attrs() ?? {}
    for (const v of [...tail, ...head]) ensureVertex(p, v)
    const e: Edge = { id: '', tail, head: directed ? head : [], directed, hyper: true, classes: [], data: {} }
    applyEdgeAttrs(e, a)
    if (!e.id) e.id = nextEdgeId(p)
    p.graph.edges.push(e)
  }

  function doUse(p: PanelState, val: string) {
    const { expr, rest } = parseExpr(val)
    const kv = parseKV(rest)
    const sub = evalExpr(expr, { current: p.graph, opts, warn })
    const prefix = kv.prefix ?? ''
    if (expr.name === 'RandomWeights') {
      for (const e of sub.edges) {
        const t = p.graph.edges.find(x => x.id === e.id)
        if (t) t.data.w = e.data.w
      }
      return
    }
    const ren = (id: Id) => prefix + id
    for (const v of sub.vertices) {
      const t = ensureVertex(p, ren(v.id))
      if (v.label) t.label = v.label
      t.classes = mergeClasses(t.classes, v.classes.join(' '))
      Object.assign(t.data, v.data)
      if (v.pinned) { t.x = v.x; t.y = v.y; t.pinned = true }
    }
    for (const e of sub.edges) {
      p.graph.edges.push({
        ...e, id: nextEdgeId(p), tail: e.tail.map(ren), head: e.head.map(ren),
        classes: [...e.classes], data: { ...e.data },
      })
    }
    if (!p.usedLayoutDefault && sub.meta.defaultLayout) {
      p.graph.meta.defaultLayout = sub.meta.defaultLayout
      p.usedLayoutDefault = true
    } else if (sub.meta.defaultLayout && p.graph.meta.defaultLayout !== sub.meta.defaultLayout) {
      p.graph.meta.defaultLayout = 'force'
    }
    for (const k of ['bipartiteLeft', 'treeRoot', 'gridCols'] as const) {
      if (sub.meta[k]) p.graph.meta[k] = k === 'gridCols' ? sub.meta[k] : sub.meta[k].split(' ').map(ren).join(' ')
    }
  }
}

function applyGraphDirective(g: GraphData, key: string, val: string) {
  if (key === 'type') {
    if (val !== 'undirected' && val !== 'directed' && val !== 'mixed') throw new Error(`unknown type "${val}"`)
    g.type = val
  } else if (key === 'simple') g.simple = val.trim() === 'true'
  else g.meta[key] = val.trim()
}

function mergeClasses(a: string[], add: string): string[] {
  const out = [...a]
  for (const c of add.split(/\s+/).filter(Boolean)) if (!out.includes(c)) out.push(c)
  return out
}

/** Parse the info string of a ```graph fence: `graph id=x widget=y`. */
export function parseInfo(info: string): Record<string, string> {
  return parseKV(info.replace(/^graph\b/, ''))
}
