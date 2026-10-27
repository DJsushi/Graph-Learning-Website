// Site-wide reader settings in localStorage. SSR-safe and failure-tolerant, like progress.ts.
import { reactive } from 'vue'

const KEY = 'graph-atlas-settings-v1'

/** control points x1, y1, x2, y2 of a CSS cubic-bezier */
export type Bezier = [number, number, number, number]
export const DEFAULT_EASING: Bezier = [0.42, 0, 0.58, 1]

export interface Settings {
  /** false: figures jump between steps */
  animations: boolean
  /** multiplier: 1 = normal, 0.5 = half as fast */
  animSpeed: number
  /** easing curve of every figure transition */
  easing: Bezier
}

export const SPEEDS = { min: 0.25, max: 2, step: 0.05 }
/** one step of a figure takes this long at speed 1 */
export const BASE_MS = 900

export const settings = reactive<Settings>({ animations: true, animSpeed: 1, easing: [...DEFAULT_EASING] })
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
      if (Array.isArray(s.easing) && s.easing.length === 4 && s.easing.every((n: unknown) => typeof n === 'number' && Number.isFinite(n))) {
        settings.easing = clampBezier(s.easing as Bezier)
      }
    }
  } catch { /* storage unavailable: settings stay in memory */ }
}

/** x in [0, 1] (CSS requires it), y in [-1, 2] so an overshoot is possible but sane */
export function clampBezier([a, b, c, d]: Bezier): Bezier {
  const x = (n: number) => Math.min(1, Math.max(0, n)), y = (n: number) => Math.min(2, Math.max(-1, n))
  return [x(a), y(b), x(c), y(d)]
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
