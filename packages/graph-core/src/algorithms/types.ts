import type { Attrs, GraphData, Id, Merge } from '../model'

/** Per-step visual state layered over the base graph. */
export interface Overlay {
  vertexClasses: Record<Id, string[]>
  edgeClasses: Record<Id, string[]>
  /** small text shown next to a vertex (distance, key, capacity, …); may contain $math$ */
  vertexBadges: Record<Id, string>
  /** overrides of edge data, e.g. current flow values f */
  edgeData: Record<Id, Attrs>
  /** explicit edge label overrides (e.g. reduced weights) */
  edgeLabels: Record<Id, string>
  /** group hulls drawn on top (e.g. min cut side, components) */
  groups: { id: string; members: Id[]; label?: string; classes: string[] }[]
}

export interface StepPanel { title: string; graph: GraphData; overlay?: Overlay }

export interface Step {
  message: string
  /** pseudocode @label to highlight */
  line?: string
  overlay: Overlay
  /** replaces the displayed graph (structure changes, e.g. contraction or construction) */
  graph?: GraphData
  /** vertices of the previous graph merged into `to` in `graph` (or, with `split`, split apart); animates contraction */
  merges?: Merge[]
  split?: boolean
  /** extra graphs shown next to the main one (residual network, level graph) */
  panels?: StepPanel[]
  /** state panel entries, name -> display text ($math$ allowed) */
  state?: Record<string, string>
  /** what a learner reproducing the algorithm must click at this step (simulate exercises) */
  action?: { kind: 'edge' | 'vertex'; id: Id }
}

export interface AlgorithmDef {
  id: string
  name: string
  /** content container id of the pseudocode; default `alg:<id>` */
  pseudocode?: string
  /** @labels the implementation refers to (validated against the pseudocode) */
  labels?: string[]
  /** parameter names, for the playground */
  params?: string[]
  directed?: boolean
  run(g: GraphData, params: Record<string, string>): Generator<Step, unknown, void>
}

export function emptyOverlay(): Overlay {
  return { vertexClasses: {}, edgeClasses: {}, vertexBadges: {}, edgeData: {}, edgeLabels: {}, groups: [] }
}

export function cloneOverlay(o: Overlay): Overlay {
  const cc = (r: Record<Id, string[]>) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, [...v]]))
  return {
    vertexClasses: cc(o.vertexClasses),
    edgeClasses: cc(o.edgeClasses),
    vertexBadges: { ...o.vertexBadges },
    edgeData: Object.fromEntries(Object.entries(o.edgeData).map(([k, v]) => [k, { ...v }])),
    edgeLabels: { ...o.edgeLabels },
    groups: o.groups.map(g => ({ ...g, members: [...g.members], classes: [...g.classes] })),
  }
}

/** Mutable overlay with helpers; `snap` produces an immutable Step. */
export class Recorder {
  o = emptyOverlay()
  addV(id: Id, ...cls: string[]) { add(this.o.vertexClasses, id, cls) }
  delV(id: Id, ...cls: string[]) { del(this.o.vertexClasses, id, cls) }
  addE(id: Id, ...cls: string[]) { add(this.o.edgeClasses, id, cls) }
  delE(id: Id, ...cls: string[]) { del(this.o.edgeClasses, id, cls) }
  clearClass(cls: string) {
    for (const r of [this.o.vertexClasses, this.o.edgeClasses]) for (const k of Object.keys(r)) r[k] = r[k].filter(c => c !== cls)
  }
  badge(id: Id, text: string | undefined) {
    if (text === undefined) delete this.o.vertexBadges[id]
    else this.o.vertexBadges[id] = text
  }
  snap(message: string, extra: Omit<Partial<Step>, 'overlay' | 'message'> = {}): Step {
    return { message, overlay: cloneOverlay(this.o), ...extra }
  }
}

function add(r: Record<Id, string[]>, id: Id, cls: string[]) {
  const cur = (r[id] ??= [])
  for (const c of cls) if (!cur.includes(c)) cur.push(c)
}
function del(r: Record<Id, string[]>, id: Id, cls: string[]) {
  if (r[id]) r[id] = r[id].filter(c => !cls.includes(c))
}

/** Format a number for display (integers stay integers, others get up to 3 decimals). */
export function fmt(x: number): string {
  if (!isFinite(x)) return x > 0 ? '\\infty' : '-\\infty'
  return Number.isInteger(x) ? String(x) : String(Math.round(x * 1000) / 1000)
}

/** Vertex label for state panels: label if given, else id. */
export function vname(g: GraphData, id: Id): string {
  const v = g.vertices.find(x => x.id === id)
  if (v?.label) return v.label.replace(/^\$(.*)\$$/, '$1')
  return /^[A-Za-z]$/.test(id) ? id : `\\text{${id.replace(/_/g, '\\_')}}`
}

export function collect(def: AlgorithmDef, g: GraphData, params: Record<string, string>): { steps: Step[]; result: unknown } {
  const it = def.run(g, params)
  const steps: Step[] = []
  for (let i = 0; i < 5000; i++) {
    const r = it.next()
    if (r.done) return { steps, result: r.value }
    steps.push(r.value)
  }
  throw new Error(`${def.id}: too many steps`)
}
