// Which mark each figure on the page spotlights, by figure id. Written by MarkLink, read by GraphBlock (CONTENT_CONVENTIONS.md 6.1).
import { reactive } from 'vue'

export const spotlights = reactive<Record<string, string | null>>({})

/** The mark names the graph a figure shows right now defines (published by a stepper); a link to a mark that is not in it is inert. */
export const shown = reactive<Record<string, string[]>>({})
export const markAvailable = (fig: string, mark: string) => !shown[fig] || shown[fig].includes(mark)

/** A tap spotlights and keeps it until the next pointer-down elsewhere (a touch has no hover, and not every browser focuses a tapped button). */
export function tapSpot(el: Element, fig: string, mark: string) {
  spotlights[fig] = mark
  const away = (e: Event) => {
    if (el.contains(e.target as Node)) return
    document.removeEventListener('pointerdown', away, true)
    if (spotlights[fig] === mark) spotlights[fig] = null
  }
  document.addEventListener('pointerdown', away, true)
}

export interface Spot { vertices: Set<string>; edges: Set<string>; faces: Set<string>; groups: Set<string> }

/** The elements of a mark that exist in this graph, or null when none do (then nothing is dimmed). Refs: vertex id, `@edgeId`, `face:id`, group id. */
export function spotOf(g: { vertices: { id: string }[]; edges: { id: string }[]; faces: { id: string }[]; groups: { id: string }[]; marks?: Record<string, string[]> }, name: string | null | undefined): Spot | null {
  const refs = name ? g.marks?.[name] : undefined
  if (!refs) return null
  const has = (xs: { id: string }[], id: string) => xs.some(x => x.id === id)
  const s: Spot = { vertices: new Set(), edges: new Set(), faces: new Set(), groups: new Set() }
  for (const r of refs) {
    if (r.startsWith('@')) { if (has(g.edges, r.slice(1))) s.edges.add(r.slice(1)) }
    else if (r.startsWith('face:')) { if (has(g.faces, r.slice(5))) s.faces.add(r.slice(5)) }
    else if (has(g.vertices, r)) s.vertices.add(r)
    else if (has(g.groups, r)) s.groups.add(r)
  }
  return s.vertices.size + s.edges.size + s.faces.size + s.groups.size ? s : null
}
