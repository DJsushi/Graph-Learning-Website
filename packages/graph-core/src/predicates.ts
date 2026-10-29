// Exercise predicates (PLAN.md §8). Property-based: every correct answer is accepted.
import { GraphIndex, ends, num, type GraphData, type Id } from './model'
import * as A from './analysis'
import { mstEdges } from './algorithms/mst'
import { maxFlowValue } from './algorithms/flow'
import { minArborescenceCost } from './algorithms/arborescence'
import { cutCapacity, globalMinCut } from './algorithms/cuts'
import { emptyGraph } from './model'

export interface Selection { vertices: Set<Id>; edges: Set<Id> }
export interface PredicateContext {
  graph: GraphData
  original: GraphData
  selection: Selection
  args: Record<string, string>
}
export interface PredicateResult { ok: boolean; feedback?: string }
export type Predicate = (ctx: PredicateContext) => PredicateResult

const ok = (): PredicateResult => ({ ok: true })
const no = (feedback: string): PredicateResult => ({ ok: false, feedback })
const sameSet = (a: Set<Id>, b: Set<Id>) => a.size === b.size && [...a].every(x => b.has(x))

function spanningTreeCheck(ctx: PredicateContext): PredicateResult {
  const { graph, selection } = ctx
  const n = graph.vertices.length
  if (selection.edges.size !== n - 1) return no(`A spanning tree of this graph has exactly ${n - 1} edges; you selected ${selection.edges.size}.`)
  const ix = new GraphIndex(A.spanningSubgraph(graph, selection.edges))
  if (!A.isAcyclic(ix)) return no('Your selection contains a cycle.')
  if (!A.isConnected(ix)) return no('Your selection does not connect all vertices.')
  return ok()
}

const weightOf = (g: GraphData, ids: Set<Id>) => g.edges.filter(e => ids.has(e.id)).reduce((z, e) => z + num(e.data.w, 1), 0)

const preds: Record<string, Predicate> = {
  'is-tree': ({ graph }) => {
    const ix = new GraphIndex(graph)
    if (!A.isConnected(ix)) return no('The graph is not connected yet.')
    if (!A.isAcyclic(ix)) return no('The graph contains a cycle.')
    return ok()
  },
  'is-simple': ({ graph }) => (A.isSimple(graph) ? ok() : no('The graph has a loop or parallel edges.')),
  'is-connected': ({ graph }) => (A.isConnected(new GraphIndex(graph)) ? ok() : no('The graph is not connected.')),
  'is-bipartite': ({ graph }) => (A.bipartition(new GraphIndex(graph)) ? ok() : no('The graph contains an odd cycle.')),
  'degree-sequence': ({ graph, args }) => {
    const want = (args.seq ?? '').split(/[\s,]+/).filter(Boolean).map(Number).sort((a, b) => b - a)
    const have = A.degreeSequence(new GraphIndex(graph))
    if (want.length !== have.length) return no(`The graph should have ${want.length} vertices.`)
    if (want.every((x, i) => x === have[i])) return ok()
    return no(`Current degree sequence: (${have.join(', ')}).`)
  },
  'vertex-count': ({ graph, args }) => (graph.vertices.length === Number(args.n) ? ok() : no(`The graph should have ${args.n} vertices.`)),
  'edge-count': ({ graph, args }) => (graph.edges.length === Number(args.m) ? ok() : no(`The graph should have ${args.m} edges.`)),
  'is-spanning-tree': spanningTreeCheck,
  'is-mst': ctx => {
    const r = spanningTreeCheck(ctx)
    if (!r.ok) return r
    const best = weightOf(ctx.graph, mstEdges(ctx.graph))
    const have = weightOf(ctx.graph, ctx.selection.edges)
    return have === best ? ok() : no(`This spanning tree has weight ${have}, but a lighter one exists.`)
  },
  'is-cycle': ({ graph, selection }) => (A.isCycleEdgeSet(graph, selection.edges) ? ok() : no('The selected edges do not form a single cycle.')),
  'odd-length': ({ selection }) => (selection.edges.size % 2 === 1 ? ok() : no(`You selected ${selection.edges.size} edges, an even number.`)),
  'is-hamiltonian-cycle': ({ graph, selection }) => {
    if (!A.isCycleEdgeSet(graph, selection.edges)) return no('The selected edges do not form a single cycle.')
    if (selection.edges.size !== graph.vertices.length) return no('The cycle does not pass through all vertices.')
    return ok()
  },
  'is-path': ({ graph, selection, args }) => {
    const sub = new GraphIndex(A.subgraphOfEdges(graph, selection.edges))
    const degs = sub.vertexIds.map(v => sub.degree(v))
    if (!A.isConnected(sub) || !A.isAcyclic(sub) || degs.some(d => d > 2)) return no('The selected edges do not form a path.')
    const endsV = sub.vertexIds.filter(v => sub.degree(v) === 1)
    if (args.from && args.to && !(endsV.includes(args.from) && endsV.includes(args.to))) return no(`The path should go from ${args.from} to ${args.to}.`)
    return ok()
  },
  'is-matching': ({ graph, selection }) => {
    const used = new Set<Id>()
    for (const e of graph.edges.filter(x => selection.edges.has(x.id))) {
      for (const v of ends(e)) { if (used.has(v)) return no('Two selected edges share a vertex.'); used.add(v) }
    }
    return ok()
  },
  'is-max-matching': ctx => {
    const r = preds['is-matching'](ctx)
    if (!r.ok) return r
    const best = A.maxMatchingSize(new GraphIndex(ctx.graph))
    return ctx.selection.edges.size === best ? ok() : no(`This matching has ${ctx.selection.edges.size} edges; a larger one exists.`)
  },
  'is-independent-set': ({ graph, selection }) => {
    const ix = new GraphIndex(graph)
    const S = [...selection.vertices]
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) if (ix.adjacent(S[i], S[j])) return no(`${S[i]} and ${S[j]} are adjacent.`)
    return ok()
  },
  'is-clique': ({ graph, selection }) => {
    const ix = new GraphIndex(graph)
    const S = [...selection.vertices]
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) if (!ix.adjacent(S[i], S[j])) return no(`${S[i]} and ${S[j]} are not adjacent.`)
    return ok()
  },
  'odd-degree-vertices': ({ graph, selection }) => {
    const ix = new GraphIndex(graph)
    const want = new Set(ix.vertexIds.filter(v => ix.degree(v) % 2 === 1))
    if (sameSet(want, selection.vertices)) return ok()
    const wrong = [...selection.vertices].filter(v => !want.has(v))
    return no(wrong.length ? `${wrong.join(', ')} ${wrong.length > 1 ? 'have' : 'has'} even degree.` : 'Some vertex of odd degree is missing.')
  },
  'simplicial-vertices': ({ graph, selection }) => {
    const ix = new GraphIndex(graph)
    const want = new Set(ix.vertexIds.filter(v => A.isSimplicial(ix, v)))
    if (sameSet(want, selection.vertices)) return ok()
    const wrong = [...selection.vertices].filter(v => !want.has(v))
    return no(wrong.length ? `The neighbours of ${wrong[0]} do not form a clique.` : 'Some simplicial vertex is missing.')
  },
  'is-bipartition-side': ({ graph, selection }) => {
    const ix = new GraphIndex(graph)
    const S = selection.vertices
    for (const e of ix.edges()) {
      const [a, b] = ends(e)
      if (S.has(a) === S.has(b)) return no(`The edge ${a}${b} has both ends on the same side.`)
    }
    return ok()
  },
  'is-min-cut-side': ({ graph, selection, args }) => {
    const s = args.source ?? 's', t = args.sink ?? 't'
    const S = selection.vertices
    if (!S.has(s)) return no(`The source side must contain ${s}.`)
    if (S.has(t)) return no(`The source side must not contain ${t}.`)
    let cap = 0
    for (const e of graph.edges) if (S.has(e.tail[0]) && !S.has(e.head[0])) cap += num(e.data.c, Infinity)
    const best = maxFlowValue(graph, s, t).value
    return cap === best ? ok() : no(`This cut has capacity ${cap}; a cut of smaller capacity exists.`)
  },
  'is-global-min-cut-side': ({ graph, selection }) => {
    const S = selection.vertices
    if (!S.size || S.size === graph.vertices.length) return no('Both sides of a cut must be non-empty.')
    const cap = cutCapacity(graph, S), best = globalMinCut(graph).value
    return cap === best ? ok() : no(`This cut has capacity ${cap}; a cut of smaller capacity exists.`)
  },
  'is-min-arborescence': ({ graph, selection, args }) => {
    const r = args.root ?? 'r'
    const es = graph.edges.filter(e => selection.edges.has(e.id))
    const indeg = new Map<Id, number>()
    for (const e of es) indeg.set(e.head[0], (indeg.get(e.head[0]) ?? 0) + 1)
    if (indeg.get(r)) return no('No arc of an arborescence enters the root.')
    for (const v of graph.vertices) if (v.id !== r && indeg.get(v.id) !== 1) return no(`Vertex ${v.id} must have exactly one entering arc.`)
    const seen = new Set([r]), st = [r]
    while (st.length) { const u = st.pop()!; for (const e of es) if (e.tail[0] === u && !seen.has(e.head[0])) { seen.add(e.head[0]); st.push(e.head[0]) } }
    if (seen.size !== graph.vertices.length) return no('Not every vertex is reachable from the root (there is a directed cycle).')
    const cost = weightOf(graph, selection.edges)
    const best = minArborescenceCost(graph, r)
    return cost === best ? ok() : no(`This arborescence costs ${cost}; a cheaper one exists.`)
  },
  'f-heavy-edges': ({ graph, original, selection, args }) => {
    const spec = args.forest ?? 'class:tree'
    const cls = spec.startsWith('class:') ? spec.slice(6) : spec
    const forest = new Set(original.edges.filter(e => e.classes.includes(cls)).map(e => e.id))
    const fx = new GraphIndex(A.spanningSubgraph(graph, forest))
    const heavy = new Set<Id>()
    for (const e of graph.edges) {
      if (forest.has(e.id)) continue
      const [a, b] = ends(e)
      // heaviest edge on the forest path a..b
      const prev = new Map<Id, { from: Id; w: number }>([[a, { from: a, w: -Infinity }]]), q = [a]
      while (q.length) {
        const u = q.shift()!
        for (const f of fx.incident(u)) {
          const w = fx.other(f, u)
          if (!prev.has(w)) { prev.set(w, { from: u, w: Math.max(prev.get(u)!.w, num(f.data.w, 1)) }); q.push(w) }
        }
      }
      if (prev.has(b) && num(e.data.w, 1) > prev.get(b)!.w) heavy.add(e.id)
    }
    if (sameSet(heavy, selection.edges)) return ok()
    const wrong = [...selection.edges].filter(x => !heavy.has(x))
    return no(wrong.length ? 'Some selected edge is F-light.' : 'Some F-heavy edge is missing.')
  },
  'contains-edge-disjoint-paths': ({ graph, selection, args }) => {
    const k = Number(args.k ?? 1), s = args.from ?? 's', t = args.to ?? 't'
    const net = emptyGraph('directed')
    net.vertices = graph.vertices.map(v => ({ id: v.id, classes: [], data: {} }))
    for (const e of graph.edges.filter(x => selection.edges.has(x.id))) {
      const [a, b] = ends(e)
      net.edges.push({ id: `${e.id}a`, tail: [a], head: [b], directed: true, hyper: false, classes: [], data: { c: 1 } })
      if (!e.directed) net.edges.push({ id: `${e.id}b`, tail: [b], head: [a], directed: true, hyper: false, classes: [], data: { c: 1 } })
    }
    const v = maxFlowValue(net, s, t).value
    return v >= k ? ok() : no(`Your edges contain only ${v} edge-disjoint ${s}–${t} path${v === 1 ? '' : 's'}.`)
  },
}

export const PREDICATES: Record<string, Predicate> = preds
