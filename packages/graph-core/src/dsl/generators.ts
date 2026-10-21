// Graph generators and transforms used by `use:` (GRAPH_DSL.md §11) and the playground.
import { emptyGraph, ends, type GraphData, type Id } from '../model'
import { rng } from '../random'

function build(ids: Id[], pairs: [Id, Id][], layout: string): GraphData {
  const g = emptyGraph()
  g.vertices = ids.map(id => ({ id, classes: [], data: {} }))
  g.edges = pairs.map(([u, v], i) => ({ id: `e${i + 1}`, tail: [u], head: [v], directed: false, hyper: false, classes: [], data: {} }))
  g.meta.defaultLayout = layout
  return g
}

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => String(a + i))

export function complete(n: number) {
  const ids = range(1, n)
  const pairs: [Id, Id][] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([ids[i], ids[j]])
  return build(ids, pairs, 'circle')
}

export function completeBipartite(m: number, n: number) {
  const a = range(1, m), b = range(1, n).map(x => `${x}'`)
  const pairs: [Id, Id][] = []
  for (const u of a) for (const v of b) pairs.push([u, v])
  const g = build([...a, ...b], pairs, 'bipartite')
  g.meta.bipartiteLeft = a.join(' ')
  return g
}

export function completeMultipartite(parts: number[]) {
  const sides = parts.map((k, p) => range(1, k).map(i => `p${p + 1}_${i}`))
  const pairs: [Id, Id][] = []
  for (let p = 0; p < sides.length; p++)
    for (let q = p + 1; q < sides.length; q++)
      for (const u of sides[p]) for (const v of sides[q]) pairs.push([u, v])
  return build(sides.flat(), pairs, 'circle')
}

export function cycle(n: number) {
  const ids = range(1, n)
  return build(ids, ids.map((v, i) => [v, ids[(i + 1) % n]] as [Id, Id]), 'circle')
}

/** Path of length n (lecture convention): vertices 0..n. */
export function path(n: number) {
  const ids = range(0, n)
  return build(ids, ids.slice(1).map((v, i) => [ids[i], v] as [Id, Id]), 'line')
}

export function emptyN(n: number) {
  return build(range(1, n), [], 'circle')
}

export function star(n: number) {
  return build(['0', ...range(1, n)], range(1, n).map(v => ['0', v] as [Id, Id]), 'star')
}

export function wheel(n: number) {
  const rim = range(1, n)
  const pairs: [Id, Id][] = rim.map(v => ['0', v] as [Id, Id])
  rim.forEach((v, i) => pairs.push([v, rim[(i + 1) % n]]))
  return build(['0', ...rim], pairs, 'wheel')
}

export function hypercube(d: number) {
  const ids = Array.from({ length: 2 ** d }, (_, i) => i.toString(2).padStart(d, '0'))
  const pairs: [Id, Id][] = []
  for (let i = 0; i < ids.length; i++)
    for (let b = 0; b < d; b++) {
      const j = i ^ (1 << b)
      if (j > i) pairs.push([ids[i], ids[j]])
    }
  return build(ids, pairs, 'hypercube')
}

export function grid(m: number, n: number) {
  const ids: Id[] = []
  const pairs: [Id, Id][] = []
  for (let r = 1; r <= m; r++)
    for (let c = 1; c <= n; c++) {
      ids.push(`${r}_${c}`)
      if (c < n) pairs.push([`${r}_${c}`, `${r}_${c + 1}`])
      if (r < m) pairs.push([`${r}_${c}`, `${r + 1}_${c}`])
    }
  const g = build(ids, pairs, 'grid')
  g.meta.gridCols = String(n)
  return g
}

export function petersen() {
  const pairs: [Id, Id][] = []
  for (let i = 0; i < 5; i++) {
    pairs.push([String(i), String((i + 1) % 5)])
    pairs.push([String(i), String(i + 5)])
    pairs.push([String(i + 5), String(((i + 2) % 5) + 5)])
  }
  return build(range(0, 9), pairs, 'petersen')
}

export function binTree(h: number) {
  const n = 2 ** (h + 1) - 1
  const ids = range(1, n)
  const pairs: [Id, Id][] = []
  for (let i = 2; i <= n; i++) pairs.push([String(Math.floor(i / 2)), String(i)])
  const g = build(ids, pairs, 'tree')
  g.meta.treeRoot = '1'
  return g
}

export function gnp(n: number, p: number, seed: number) {
  const r = rng(seed)
  const ids = range(1, n)
  const pairs: [Id, Id][] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (r() < p) pairs.push([ids[i], ids[j]])
  return build(ids, pairs, 'force')
}

export function gnm(n: number, m: number, seed: number) {
  const r = rng(seed)
  const ids = range(1, n)
  const all: [Id, Id][] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([ids[i], ids[j]])
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return build(ids, all.slice(0, Math.min(m, all.length)), 'force')
}

export function randomTree(n: number, seed: number) {
  const r = rng(seed)
  const ids = range(1, n)
  const pairs: [Id, Id][] = []
  for (let i = 1; i < n; i++) pairs.push([ids[Math.floor(r() * i)], ids[i]])
  const g = build(ids, pairs, 'tree')
  g.meta.treeRoot = '1'
  return g
}

export function complement(g: GraphData): GraphData {
  const ids = g.vertices.map(v => v.id)
  const has = new Set(g.edges.filter(e => !e.hyper).map(e => { const [a, b] = ends(e); return [a, b].sort().join('\u0000') }))
  const pairs: [Id, Id][] = []
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++)
      if (!has.has([ids[i], ids[j]].sort().join('\u0000'))) pairs.push([ids[i], ids[j]])
  const out = build(ids, pairs, g.meta.defaultLayout ?? 'circle')
  out.vertices = g.vertices.map(v => ({ ...v, classes: [...v.classes], data: { ...v.data } }))
  return out
}

export function lineGraph(g: GraphData): GraphData {
  const es = g.edges.filter(e => !e.hyper)
  const pairs: [Id, Id][] = []
  for (let i = 0; i < es.length; i++)
    for (let j = i + 1; j < es.length; j++) {
      const a = ends(es[i]), b = ends(es[j])
      if (a.some(x => b.includes(x))) pairs.push([es[i].id, es[j].id])
    }
  return build(es.map(e => e.id), pairs, 'force')
}

export function randomWeights(g: GraphData, lo: number, hi: number, seed: number) {
  const r = rng(seed)
  for (const e of g.edges) e.data.w = lo + Math.floor(r() * (hi - lo + 1))
  return g
}

/** Names and parameter arity, for the playground menu. */
export const GENERATORS: { name: string; params: string[]; doc: string }[] = [
  { name: 'K', params: ['n'], doc: 'complete graph' },
  { name: 'K', params: ['m', 'n'], doc: 'complete bipartite graph' },
  { name: 'C', params: ['n'], doc: 'cycle' },
  { name: 'P', params: ['n'], doc: 'path of length n' },
  { name: 'E', params: ['n'], doc: 'empty graph' },
  { name: 'Star', params: ['n'], doc: 'star K_{1,n}' },
  { name: 'Wheel', params: ['n'], doc: 'wheel' },
  { name: 'Q', params: ['d'], doc: 'hypercube' },
  { name: 'Grid', params: ['m', 'n'], doc: 'grid' },
  { name: 'Petersen', params: [], doc: 'Petersen graph' },
  { name: 'BinTree', params: ['h'], doc: 'complete binary tree' },
  { name: 'Gnp', params: ['n', 'p', 'seed'], doc: 'random graph G(n,p)' },
  { name: 'Gnm', params: ['n', 'm', 'seed'], doc: 'random graph G(n,m)' },
  { name: 'RandomTree', params: ['n', 'seed'], doc: 'random tree' },
]
