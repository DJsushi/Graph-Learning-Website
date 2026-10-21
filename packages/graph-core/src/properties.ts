// Live properties for editable widgets and the playground (PLAN.md §7).
import { GraphIndex } from './model'
import * as A from './analysis'
import { maxFlowValue } from './algorithms/flow'

export interface PropertyDef {
  id: string
  name: string
  /** display value; strings may contain $math$ */
  compute(ix: GraphIndex): string
}

const yesno = (b: boolean) => (b ? 'yes' : 'no')
const inf = (x: number) => (isFinite(x) ? String(x) : '$\\infty$')

const defs: PropertyDef[] = [
  { id: 'vertex-count', name: 'vertices $n$', compute: ix => String(ix.n) },
  { id: 'edge-count', name: 'edges $m$', compute: ix => String(ix.m) },
  { id: 'degree-sequence', name: 'degree sequence', compute: ix => `(${A.degreeSequence(ix).join(', ')})` },
  { id: 'degree-sum', name: 'degree sum', compute: ix => String(A.degreeSequence(ix).reduce((a, b) => a + b, 0)) },
  { id: 'min-degree', name: 'minimum degree $\\delta$', compute: ix => String(ix.n ? Math.min(...A.degreeSequence(ix)) : 0) },
  { id: 'max-degree', name: 'maximum degree $\\Delta$', compute: ix => String(ix.n ? Math.max(...A.degreeSequence(ix)) : 0) },
  { id: 'connected', name: 'connected', compute: ix => yesno(A.isConnected(ix)) },
  { id: 'components', name: 'components', compute: ix => String(A.components(ix).length) },
  { id: 'bipartite', name: 'bipartite', compute: ix => yesno(!!A.bipartition(ix)) },
  { id: 'is-tree', name: 'tree', compute: ix => yesno(A.isTree(ix)) },
  { id: 'is-forest', name: 'forest', compute: ix => yesno(A.isAcyclic(ix)) },
  { id: 'has-cycle', name: 'has a cycle', compute: ix => yesno(!A.isAcyclic(ix)) },
  { id: 'girth', name: 'girth', compute: ix => inf(A.girth(ix)) },
  { id: 'diameter', name: 'diameter', compute: ix => inf(A.diameter(ix)) },
  { id: 'is-simple', name: 'simple', compute: ix => yesno(A.isSimple(ix.g)) },
  {
    id: 'is-regular', name: 'regular', compute: ix => {
      const d = A.degreeSequence(ix)
      return d.length && d.every(x => x === d[0]) ? `yes (${d[0]}-regular)` : 'no'
    },
  },
  {
    id: 'eulerian', name: 'Eulerian', compute: ix => {
      const nonIso = ix.vertexIds.filter(v => ix.degree(v) > 0)
      const conn = A.components(ix).filter(c => c.some(v => ix.degree(v) > 0)).length <= 1
      return yesno(conn && nonIso.every(v => ix.degree(v) % 2 === 0))
    },
  },
  { id: 'chromatic-number', name: 'chromatic number $\\chi$', compute: ix => { const c = A.chromaticNumber(ix); return c === undefined ? '—' : String(c) } },
  { id: 'max-matching', name: 'maximum matching', compute: ix => String(A.maxMatchingSize(ix)) },
  {
    id: 'max-flow-value', name: 'maximum flow', compute: ix => {
      const s = ix.g.vertices.find(v => v.classes.includes('source'))?.id
      const t = ix.g.vertices.find(v => v.classes.includes('sink'))?.id
      return s && t ? String(maxFlowValue(ix.g, s, t).value) : '—'
    },
  },
]

export const PROPERTIES: Record<string, PropertyDef> = Object.fromEntries(defs.map(d => [d.id, d]))
