// Learner progress in localStorage (solved exercises and quizzes, flashcard boxes, visited and finished lessons). SSR-safe and failure-tolerant.
import { reactive } from 'vue'

const KEY = 'graph-atlas-progress-v1'

export interface Progress {
  solved: Record<string, number>          // exercise / quiz id -> timestamp
  attempted: Record<string, number>
  cards: Record<string, { box: number; seen: number }>
  visited: Record<string, number>         // lesson path ("theory/01-basic-notions") -> last visit
  done: Record<string, number>            // lesson path -> marked as done
}

const empty = (): Progress => ({ solved: {}, attempted: {}, cards: {}, visited: {}, done: {} })
export const progress = reactive<Progress>(empty())

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const times = (v: unknown): Record<string, number> =>
  isRecord(v) ? Object.fromEntries(Object.entries(v).filter(([, t]) => typeof t === 'number' && Number.isFinite(t))) as Record<string, number> : {}
const cards = (v: unknown): Progress['cards'] =>
  isRecord(v) ? Object.fromEntries(Object.entries(v).filter(([, c]) => isRecord(c) && Number.isFinite(c.box) && Number.isFinite(c.seen))) as Progress['cards'] : {}

/** Keep only well-formed entries, so a hand-edited or old storage value cannot break the pages (S9). The storage key carries the version. */
export function normalizeProgress(o: unknown): Progress {
  const r = isRecord(o) ? o : {}
  return { solved: times(r.solved), attempted: times(r.attempted), cards: cards(r.cards), visited: times(r.visited), done: times(r.done) }
}
let loaded = false

export function loadProgress() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) Object.assign(progress, normalizeProgress(JSON.parse(raw)))
  } catch { /* storage unavailable: progress stays in memory */ }
}

function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(progress)) } catch { /* ignore */ }
}

export function markSolved(id: string) {
  loadProgress()
  if (!id) return
  progress.solved[id] = Date.now()
  save()
}

export function markAttempted(id: string) {
  loadProgress()
  if (!id) return
  progress.attempted[id] = Date.now()
  save()
}

export function rateCard(id: string, known: boolean) {
  loadProgress()
  const c = progress.cards[id] ?? { box: 0, seen: 0 }
  progress.cards[id] = { box: known ? Math.min(c.box + 1, 4) : 0, seen: Date.now() }
  save()
}

export function markVisited(path: string) {
  loadProgress()
  progress.visited[path] = Date.now()
  save()
}

export function toggleDone(path: string) {
  loadProgress()
  if (progress.done[path]) delete progress.done[path]
  else progress.done[path] = Date.now()
  save()
}

/** The most recently visited lesson path, if any. */
export function lastVisited(): string | undefined {
  return Object.entries(progress.visited).sort((a, b) => b[1] - a[1])[0]?.[0]
}

export function exportProgress(): string {
  return JSON.stringify(progress, null, 2)
}

export function importProgress(text: string) {
  const o = JSON.parse(text)
  if (!o || typeof o !== 'object') throw new Error('not a progress file')
  Object.assign(progress, normalizeProgress(o))
  save()
}

export function resetProgress() {
  Object.assign(progress, empty())
  save()
}
