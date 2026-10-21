// Learner progress in localStorage (solved exercises and quizzes, flashcard boxes). SSR-safe and failure-tolerant.
import { reactive } from 'vue'

const KEY = 'graph-atlas-progress-v1'

export interface Progress {
  solved: Record<string, number>          // exercise / quiz id -> timestamp
  attempted: Record<string, number>
  cards: Record<string, { box: number; seen: number }>
}

export const progress = reactive<Progress>({ solved: {}, attempted: {}, cards: {} })
let loaded = false

export function loadProgress() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) Object.assign(progress, { solved: {}, attempted: {}, cards: {}, ...JSON.parse(raw) })
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

export function exportProgress(): string {
  return JSON.stringify(progress, null, 2)
}

export function importProgress(text: string) {
  const o = JSON.parse(text)
  Object.assign(progress, { solved: o.solved ?? {}, attempted: o.attempted ?? {}, cards: o.cards ?? {} })
  save()
}

export function resetProgress() {
  Object.assign(progress, { solved: {}, attempted: {}, cards: {} })
  save()
}
