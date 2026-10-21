import { describe, expect, it } from 'vitest'
import { importAny, serialize, toTikZ, encodeShare, decodeShare, adjacencyMatrixText, fromAdjacencyMatrix } from '../src/io'
import { parseGraph } from '../src/dsl/parser'

describe('importAny', () => {
  it('reads a symmetric adjacency matrix as an undirected graph', () => {
    const g = importAny('0 1 1\n1 0 0\n1 0 0')
    expect(g.type).toBe('undirected')
    expect(g.edges.length).toBe(2)
  })
  it('reads an asymmetric matrix as a digraph', () => {
    const g = importAny('0 1\n0 0')
    expect(g.type).toBe('directed')
    expect(g.edges.length).toBe(1)
  })
  it('reads an adjacency list', () => {
    const g = importAny('a: b c\nb: a\nc: a')
    expect(g.edges.length).toBe(2)
    expect(g.type).toBe('undirected')
  })
  it('reads JSON', () => {
    const src = parseGraph('a -- b [w=2]').panels[0].graph
    const g = importAny(JSON.stringify({ graph: src }))
    expect(g.edges[0].data.w).toBe(2)
  })
  it('reads DSL with numeric vertex ids (not mistaken for a matrix)', () => {
    const g = importAny('1 -- 2\n2 -- 3')
    expect(g.vertices.map(v => v.id)).toEqual(['1', '2', '3'])
    expect(g.edges.length).toBe(2)
  })
  it('matrix text round-trips', () => {
    const g = parseGraph('use: C(4)').panels[0].graph
    const back = fromAdjacencyMatrix(adjacencyMatrixText(g).split('\n').slice(1).map(l => l.trim().split(/\s+/).slice(1).join(' ')).join('\n'))
    expect(back.edges.length).toBe(4)
  })
})

describe('share links and TikZ', () => {
  it('share code round-trips', () => {
    const text = serialize(parseGraph('a -- b [w=3]\nb -> c').panels[0].graph)
    expect(decodeShare(encodeShare(text))).toBe(text)
  })
  it('TikZ mentions every vertex and edge', () => {
    const g = parseGraph('layout: fixed\na @(0,0); b @(1,0)\na -- b [w=5]\na -- b').panels[0].graph
    const t = toTikZ(g)
    expect(t).toContain('\\begin{tikzpicture}')
    expect(t.match(/\\node/g)?.length).toBe(2)
    expect(t.match(/\\draw/g)?.length).toBe(2)
    expect(t).toContain('bend')
  })
})
