// Site-wide reader settings in localStorage. SSR-safe and failure-tolerant, like progress.ts.
import { reactive } from 'vue'

const KEY = 'graph-atlas-settings-v1'

export interface Settings {
  /** false: figures jump between steps */
  animations: boolean
  /** multiplier: 1 = normal, 0.5 = half as fast */
  animSpeed: number
}

export const SPEEDS = { min: 0.25, max: 2, step: 0.05 }
/** one step of a figure takes this long at speed 1 */
export const BASE_MS = 900

export const settings = reactive<Settings>({ animations: true, animSpeed: 1 })
let loaded = false

export function loadSettings() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (typeof s.animations === 'boolean') settings.animations = s.animations
      if (typeof s.animSpeed === 'number') settings.animSpeed = Math.min(SPEEDS.max, Math.max(SPEEDS.min, s.animSpeed))
    }
  } catch { /* storage unavailable: settings stay in memory */ }
}

export function saveSettings() {
  try { window.localStorage.setItem(KEY, JSON.stringify(settings)) } catch { /* ignore */ }
}

const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Duration of a figure transition in ms; 0 = jump. The OS "reduce motion" preference always wins. */
export function tweenMs(): number {
  loadSettings()
  return settings.animations && !reduced() ? Math.round(BASE_MS / settings.animSpeed) : 0
}
