// Minimum cuts in undirected capacitated graphs: Gomory–Hu trees, Stoer–Wagner, Karger's random contraction.
import { emptyGraph, ends, num, type Edge, type GraphData, type Id } from '../model'
import { rng } from '../random'
import { maxFlowValue } from './flow'
import { Recorder, fmt, vname, type AlgorithmDef, type StepPanel } from './types'

/** Capacity of an undirected edge: `c`, else `w`, else 1 (unweighted multigraphs). */
export const capacity = (e: Edge) => num(e.data.c, num(e.data.w, 1))

const ordinary = (g: GraphData) => g.edges.filter(e => !e.hyper && e.tail[0] !== e.head[0])

/** c(δ(S)): total capacity of the edges with exactly one end in S. */
export function cutCapacity(g: GraphData, S: Set<Id>): number {
  let z = 0
  for (const e of ordinary(g)) { const [a, b] = ends(e); if (S.has(a) !== S.has(b)) z += capacity(e) }
  return z
}

/** Minimum s–t cut of an undirected graph: max flow in the network with two opposite arcs per edge. */
export function minSTCut(g: GraphData, s: Id, t: Id): { value: number; side: Set<Id> } {
  const net = emptyGraph('directed')
  net.vertices = g.vertices.map(v => ({ id: v.id, classes: [], data: {} }))
  for (const e of ordinary(g)) {
    const [a, b] = ends(e), c = capacity(e)
    net.edges.push({ id: `${e.id}>`, tail: [a], head: [b], directed: true, hyper: false, classes: [], data: { c } })
    net.edges.push({ id: `${e.id}<`, tail: [b], head: [a], directed: true, hyper: false, classes: [], data: { c } })
  }
  const r = maxFlowValue(net, s, t)
  return { value: r.value, side: r.cut }
}

/** A vertex of a contracted graph and the original vertices it stands for. */
type Members = Map<Id, Id[]>

const setLabel = (orig: GraphData, ms: Id[]) => (ms.length === 1 ? orig.vertices.find(v => v.id === ms[0])?.label : `$${ms.map(m => vname(orig, m)).join(',')}$`)

/**
 * Identify each listed vertex set of `g` into one new vertex (node identification, applied repeatedly):
 * edges inside a set vanish, parallel edges are merged into the first one with the capacities summed.
 * The new vertex is placed at the centroid of the original members.
 */
function identify(g: GraphData, sets: { from: Id[]; to: Id }[], members: Members, orig: GraphData): { graph: GraphData; members: Members } {
  const map = new Map<Id, Id>()
  for (const s of sets) for (const v of s.from) map.set(v, s.to)
  const m2: Members = new Map(members)
  const rank = new Map(orig.vertices.map((v, i) => [v.id, i]))
  for (const s of sets) { m2.set(s.to, s.from.flatMap(v => members.get(v) ?? [v]).sort((x, y) => rank.get(x)! - rank.get(y)!)); for (const v of s.from) if (v !== s.to) m2.delete(v) }
  const pos = new Map(orig.vertices.map(v => [v.id, v]))
  const out = emptyGraph('undirected')
  out.meta = { ...g.meta }
  for (const v of g.vertices) {
    const to = map.get(v.id)
    if (to === undefined) { out.vertices.push({ ...v, classes: [...v.classes], data: { ...v.data } }); continue }
    if (out.vertices.some(x => x.id === to)) continue
    const ms = m2.get(to)!
    const ps = ms.map(x => pos.get(x)!).filter(p => p?.x !== undefined && p?.y !== undefined)
    out.vertices.push({
      id: to, label: setLabel(orig, ms), classes: [], data: {},
      ...(ps.length ? { x: ps.reduce((z, p) => z + p.x!, 0) / ps.length, y: ps.reduce((z, p) => z + p.y!, 0) / ps.length, pinned: true } : {}),
    })
  }
  const byPair = new Map<string, Edge>()
  for (const e of ordinary(g)) {
    const [a0, b0] = ends(e)
    const a = map.get(a0) ?? a0, b = map.get(b0) ?? b0
    if (a === b) continue
    const key = a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`
    const old = byPair.get(key)
    if (old) { old.data.c = num(old.data.c) + capacity(e); continue }
    const ne: Edge = { id: e.id, tail: [a], head: [b], directed: false, hyper: false, classes: [], data: { c: capacity(e) } }
    byPair.set(key, ne)
    out.edges.push(ne)
  }
  return { graph: out, members: m2 }
}

/** Start state for the contraction-based algorithms: parallel edges merged, capacities in `c`. */
function start(g: GraphData): { graph: GraphData; members: Members } {
  return identify(g, [], new Map(g.vertices.map(v => [v.id, [v.id]])), g)
}

const setTex = (orig: GraphData, ms: Iterable<Id>) => `\\{${[...ms].map(m => vname(orig, m)).join(',')}\\}`
/** Name of a vertex of a contracted graph in messages: the vertex, or the set of original vertices it stands for. */
const nm = (orig: GraphData, members: Members, v: Id) => (members.get(v)!.length > 1 ? setTex(orig, members.get(v)!) : vname(orig, v))
const left = (g: GraphData) => `${g.vertices.length} vert${g.vertices.length === 1 ? 'ex' : 'ices'}`
const mergedId = (ms: Id[]) => ms.join('+')

function cutOverlay(R: Recorder, g: GraphData, S: Set<Id>, labels: [string, string]) {
  for (const e of ordinary(g)) { const [a, b] = ends(e); if (S.has(a) !== S.has(b)) R.addE(e.id, 'cut') }
  R.o.groups = [
    { id: 'S', members: [...S], label: labels[0], classes: [] },
    { id: 'T', members: g.vertices.map(v => v.id).filter(v => !S.has(v)), label: labels[1], classes: ['muted'] },
  ]
}

export const stoerWagner: AlgorithmDef = {
  id: 'stoer-wagner',
  name: 'Stoer–Wagner algorithm',
  labels: ['init', 'loop', 'phase', 'compare', 'record', 'identify', 'return', 'start', 'add', 'end'],
  params: ['start', 'phases'],
  *run(g, params) {
    const first = params.start ?? g.vertices[0]?.id
    if (!first || !g.vertices.some(v => v.id === first)) throw new Error(`stoer-wagner: unknown start vertex "${first}"`)
    const maxPhases = params.phases ? Number(params.phases) : Infinity
    let { graph: cur, members } = start(g)
    let M = Infinity, A: Id[] = []
    const best = () => (isFinite(M) ? { M: fmt(M), A: `\\delta(${setTex(g, A)})` } : { M: '\\infty', A: '\\emptyset' })
    yield new Recorder().snap('No cut found yet: $A = \\emptyset$, $M = \\infty$.', { line: 'init', graph: cur, state: best() })
    for (let phase = 1; cur.vertices.length > 1 && phase <= maxPhases; phase++) {
      const R = new Recorder()
      const adj = (u: Id, v: Id) => ordinary(cur).filter(e => { const [a, b] = ends(e); return (a === u && b === v) || (a === v && b === u) }).reduce((z, e) => z + capacity(e), 0)
      const u0 = [...members].find(([, ms]) => ms.includes(first))![0]
      const order = [u0]
      const key = new Map(cur.vertices.filter(v => v.id !== u0).map(v => [v.id, adj(u0, v.id)]))
      const paint = () => { for (const [v, k] of key) R.badge(v, fmt(k)) }
      const orderTex = () => order.map(v => nm(g, members, v)).join(',\\ ')
      R.addV(u0, 'done')
      paint()
      yield R.snap(`Phase ${phase} (MINCUTPHASE): start with $U = \\{${nm(g, members, u0)}\\}$. The badges show $c(U, v)$, the capacity between $U$ and $v$.`,
        { line: 'start', graph: cur, state: { ...best(), order: orderTex() } })
      let last = 0
      while (key.size) {
        let v: Id | undefined
        for (const x of cur.vertices) if (key.has(x.id) && (v === undefined || key.get(x.id)! > key.get(v)!)) v = x.id
        last = key.get(v!)!
        key.delete(v!)
        for (const x of key.keys()) key.set(x, key.get(x)! + adj(v!, x))
        order.push(v!)
        R.badge(v!, undefined)
        for (const x of order.slice(0, -1)) { R.delV(x, 'current'); R.addV(x, 'done') }
        R.addV(v!, 'current')
        paint()
        yield R.snap(`Add $${nm(g, members, v!)}$, the vertex most tightly connected to $U$ ($c(U, ${nm(g, members, v!)}) = ${fmt(last)}$).`,
          { line: 'add', graph: cur, state: { ...best(), order: orderTex() }, action: { kind: 'vertex', id: v! } })
      }
      const s = order.at(-2)!, t = order.at(-1)!
      const R2 = new Recorder()
      R2.addV(s, 'source'); R2.addV(t, 'sink')
      for (const e of ordinary(cur)) if (ends(e).includes(t)) R2.addE(e.id, 'cut')
      const T = members.get(t)!
      yield R2.snap(`The phase returns $s = ${nm(g, members, s)}$, $t = ${nm(g, members, t)}$. The cut of the phase $\\delta(t)$ has capacity $c(U \\setminus \\{t\\}, t) = ${fmt(last)}$; it is a minimum $s$–$t$ cut. In $G$ it is $\\delta(${setTex(g, T)})$.`,
        { line: 'end', graph: cur, state: { ...best(), order: orderTex() } })
      if (last < M) {
        M = last; A = T
        yield R2.snap(`$${fmt(last)} < M$: remember $A = \\delta(${setTex(g, T)})$ and $M = ${fmt(M)}$.`, { line: 'record', graph: cur, state: best() })
      } else {
        yield R2.snap(`$${fmt(last)} \\ge M = ${fmt(M)}$: keep the cut found earlier.`, { line: 'compare', graph: cur, state: best() })
      }
      if (phase === maxPhases) break
      const to = mergedId([...members.get(s)!, ...T])
      const st = `$s = ${nm(g, members, s)}$ and $t = ${nm(g, members, t)}$`
      const next = identify(cur, [{ from: [s, t], to }], members, g)
      cur = next.graph; members = next.members
      yield new Recorder().snap(`Identify ${st}: $G \\leftarrow G_{st}$ (${left(cur)} left; parallel edges are merged and their capacities added).`,
        { line: 'identify', graph: cur, merges: [{ from: [s, t], to }], state: best() })
    }
    const R = new Recorder()
    if (A.length) cutOverlay(R, g, new Set(A), ['$S$', '$V \\setminus S$'])
    if (cur.vertices.length > 1) {
      yield R.snap(`Stopped after ${maxPhases} phase${maxPhases === 1 ? '' : 's'}; the best cut so far is $\\delta(${setTex(g, A)})$ of capacity $${fmt(M)}$.`, { graph: g, state: best() })
      return { value: M, side: new Set(A) }
    }
    yield R.snap(isFinite(M) ? `Done: a minimum cut is $\\delta(S)$ for $S = ${setTex(g, A)}$, of capacity $\\lambda(G) = ${fmt(M)}$.` : 'A single vertex has no cut.',
      { line: 'return', graph: g, state: best() })
    return { value: M, side: new Set(A) }
  },
}

/** λ(G) and one side of a minimum cut, by Stoer–Wagner (for predicates, properties and tests). */
export function globalMinCut(g: GraphData): { value: number; side: Set<Id> } {
  const it = stoerWagner.run(g, {})
  let r = it.next()
  while (!r.done) r = it.next()
  return r.value as { value: number; side: Set<Id> }
}

interface TreeNode { id: Id; set: Id[] }
interface TreeEdge { a: Id; b: Id; w: number }

export const gomoryHu: AlgorithmDef = {
  id: 'gomory-hu',
  name: 'Gomory–Hu tree construction',
  labels: ['init', 'choose', 'contract', 'mincut', 'split', 'return'],
  params: ['pairs'],
  *run(g, params) {
    const pairs = (params.pairs ?? '').split(',').map(p => p.trim().split(/\s+/)).filter(p => p.length === 2)
    const base = start(g).graph
    const orig = new Map(g.vertices.map(v => [v.id, v]))
    let nodes: TreeNode[] = [{ id: mergedId(g.vertices.map(v => v.id)), set: g.vertices.map(v => v.id) }]
    let tree: TreeEdge[] = []
    const nodeLabel = (n: TreeNode) => (n.set.length === 1 ? orig.get(n.set[0])!.label : `$${n.set.map(x => vname(g, x)).join(',')}$`)
    const treePanel = (hl: Id[] = [], hlEdge?: TreeEdge): StepPanel => {
      const T = emptyGraph('undirected')
      T.vertices = nodes.map(n => {
        const ps = n.set.map(x => orig.get(x)!).filter(p => p.x !== undefined && p.y !== undefined)
        return {
          id: n.id, label: nodeLabel(n), classes: [], data: {},
          ...(ps.length ? { x: ps.reduce((z, p) => z + p.x!, 0) / ps.length, y: ps.reduce((z, p) => z + p.y!, 0) / ps.length, pinned: true } : {}),
        }
      })
      // hidden corners of G's drawing keep the panel's scale fixed while nodes split
      const ps = g.vertices.filter(v => v.x !== undefined && v.y !== undefined)
      if (ps.length) for (const [id, f] of [['~min', Math.min], ['~max', Math.max]] as const)
        T.vertices.push({ id, classes: ['hidden'], data: {}, x: f(...ps.map(v => v.x!)), y: f(...ps.map(v => v.y!)), pinned: true })
      T.edges = tree.map(e => ({ id: `${e.a}~${e.b}`, tail: [e.a], head: [e.b], directed: false, hyper: false, classes: [], data: { w: e.w } }))
      const R = new Recorder()
      for (const id of hl) R.addV(id, 'highlight')
      if (hlEdge) R.addE(`${hlEdge.a}~${hlEdge.b}`, 'highlight')
      return { title: 'tree $T$', graph: T, overlay: R.o }
    }
    const partition = () => nodes.map(n => setTex(g, n.set)).join(',\\ ')
    const groupsOf = (R: Recorder, hl?: TreeNode) => {
      R.o.groups = nodes.filter(n => n.set.length > 1).map(n => ({ id: n.id, members: n.set, classes: n === hl ? [] : ['muted'] }))
    }
    yield new Recorder().snap('Start with the partition $\\{V\\}$: the tree $T$ has a single node.', { line: 'init', graph: base, panels: [treePanel()], state: { partition: partition() }, title: 'network $G$' })
    for (let round = 1; nodes.some(n => n.set.length > 1); round++) {
      const pair = pairs[round - 1]
      const S = pair ? nodes.find(n => n.set.includes(pair[0])) : nodes.find(n => n.set.length > 1)
      if (!S || (pair && !S.set.includes(pair[1])) || (pair && pair[0] === pair[1])) throw new Error(`gomory-hu: round ${round}: ${pair?.join(' ')} are not two vertices of one node`)
      const [a, b] = pair ?? S.set.slice(0, 2)
      // components of T − S
      const comps: Id[][] = []
      const seen = new Set([S.id])
      for (const n of nodes) {
        if (seen.has(n.id)) continue
        const comp: Id[] = [], st = [n.id]
        seen.add(n.id)
        while (st.length) {
          const x = st.pop()!
          comp.push(x)
          for (const e of tree) for (const [p, q] of [[e.a, e.b], [e.b, e.a]]) if (p === x && !seen.has(q)) { seen.add(q); st.push(q) }
        }
        comps.push(comp)
      }
      const compSets = comps.map(c => c.flatMap(id => nodes.find(n => n.id === id)!.set))
      const R = new Recorder()
      groupsOf(R, S)
      R.addV(a, 'source'); R.addV(b, 'sink')
      yield R.snap(`Round ${round}: split the node $S = ${setTex(g, S.set)}$ using $a = ${vname(g, a)}$ and $b = ${vname(g, b)}$.`,
        { line: 'choose', graph: base, panels: [treePanel([S.id])], state: { partition: partition() }, title: 'network $G$' })
      const merges = compSets.filter(c => c.length > 1).map(c => ({ from: c, to: mergedId(c) }))
      const { graph: H } = identify(base, merges, new Map(base.vertices.map(v => [v.id, [v.id]])), g)
      const vOf = (set: Id[]) => (set.length > 1 ? mergedId(set) : set[0])
      const RH = new Recorder()
      RH.addV(a, 'source'); RH.addV(b, 'sink')
      yield RH.snap(merges.length
        ? `Contract every component of $T - S$ to a single vertex: this gives the graph $H$.`
        : 'The forest $T - S$ is empty, so $H = G$.',
      { line: 'contract', graph: H, merges, panels: [treePanel([S.id])], state: { partition: partition() }, title: 'graph $H$' })
      const cut = minSTCut(H, a, b)
      const RC = new Recorder()
      RC.addV(a, 'source'); RC.addV(b, 'sink')
      cutOverlay(RC, H, cut.side, ['$A$', '$B$'])
      yield RC.snap(`A minimum $${vname(g, a)}$–$${vname(g, b)}$ cut in $H$ has capacity $${fmt(cut.value)}$; $A$ is the side of $${vname(g, a)}$.`,
        { line: 'mincut', graph: H, panels: [treePanel([S.id])], state: { partition: partition() }, title: 'graph $H$' })
      // split S and reconnect its tree neighbours to the side their component lies on
      const inA = (id: Id) => cut.side.has(id)
      const Sa: TreeNode = { id: mergedId(S.set.filter(inA)), set: S.set.filter(inA) }
      const Sb: TreeNode = { id: mergedId(S.set.filter(x => !inA(x))), set: S.set.filter(x => !inA(x)) }
      const compOf = (id: Id) => comps.findIndex(c => c.includes(id))
      tree = tree.map(e => {
        if (e.a !== S.id && e.b !== S.id) return e
        const X = e.a === S.id ? e.b : e.a
        return { a: inA(vOf(compSets[compOf(X)])) ? Sa.id : Sb.id, b: X, w: e.w }
      })
      const newEdge = { a: Sa.id, b: Sb.id, w: cut.value }
      tree.push(newEdge)
      nodes = nodes.flatMap(n => (n === S ? [Sa, Sb] : [n]))
      const RS = new Recorder()
      groupsOf(RS)
      yield RS.snap(`Split $S$ into $S_a = ${setTex(g, Sa.set)}$ and $S_b = ${setTex(g, Sb.set)}$, joined by an edge of capacity $${fmt(cut.value)}$. Each former neighbour of $S$ is attached to the part on its side of the cut.`,
        { line: 'split', graph: base, merges, split: true, panels: [treePanel([Sa.id, Sb.id], newEdge)], state: { partition: partition() }, title: 'network $G$' })
    }
    yield new Recorder().snap('All nodes are single vertices: $T$ is a Gomory–Hu tree of $G$.', { line: 'return', graph: base, panels: [treePanel()], state: { partition: partition() }, title: 'network $G$' })
    return { tree: tree.map(e => ({ u: e.a, v: e.b, w: e.w })) }
  },
}

/** Gomory–Hu tree edges {u, v, w} (optionally with the lecture's choice of pairs). */
export function gomoryHuTree(g: GraphData, pairs?: string): { u: Id; v: Id; w: number }[] {
  const it = gomoryHu.run(g, pairs ? { pairs } : {})
  let r = it.next()
  while (!r.done) r = it.next()
  return (r.value as { tree: { u: Id; v: Id; w: number }[] }).tree
}

export const karger: AlgorithmDef = {
  id: 'karger',
  name: "Karger's contraction algorithm",
  labels: ['loop', 'choose', 'contract', 'return'],
  params: ['seed'],
  *run(g, params) {
    if (g.vertices.length < 2) throw new Error('karger: the graph needs at least two vertices')
    const rand = rng(Number(params.seed ?? 1))
    let { graph: cur, members } = start(g)
    yield new Recorder().snap(`Contract random edges until two vertices are left (random seed ${Number(params.seed ?? 1)}).`, { line: 'loop', graph: cur })
    while (cur.vertices.length > 2) {
      const es = ordinary(cur)
      const total = es.reduce((z, e) => z + capacity(e), 0)
      if (!total) break
      let x = rand() * total, e = es[0]
      for (const f of es) { e = f; x -= capacity(f); if (x < 0) break }
      const [u, v] = ends(e)
      const R = new Recorder()
      R.addE(e.id, 'current')
      yield R.snap(`Choose the edge between $${nm(g, members, u)}$ and $${nm(g, members, v)}$ at random, with probability $c(e)/c(E) = ${fmt(capacity(e))}/${fmt(total)}$.`, { line: 'choose', graph: cur })
      const to = mergedId([...members.get(u)!, ...members.get(v)!])
      const next = identify(cur, [{ from: [u, v], to }], members, g)
      cur = next.graph; members = next.members
      yield new Recorder().snap(`Contract it: $G \\leftarrow G_e$ (${left(cur)} left).`, { line: 'contract', graph: cur, merges: [{ from: [u, v], to }] })
    }
    // two vertices left (or no edges: then any component is a cut of capacity 0)
    const side = new Set(members.get(cur.vertices[0].id))
    const value = cutCapacity(g, side)
    const R = new Recorder()
    cutOverlay(R, g, side, ['$S$', '$V \\setminus S$'])
    yield R.snap(`Return the cut between the two remaining vertices: $\\delta(${setTex(g, side)})$ of capacity $${fmt(value)}$.`, { line: 'return', graph: g, state: { 'c(cut)': fmt(value) } })
    return { value, side }
  },
}
