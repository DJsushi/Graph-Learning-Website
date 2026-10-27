// CSS-style cubic-bezier easing: the curve from (0,0) to (1,1) with control points (x1,y1) and (x2,y2).
// x stays in [0, 1]; y is free, so a curve may overshoot.
import { settings, loadSettings, type Bezier } from './settings'

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (p: number) => number {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const X = (t: number) => ((ax * t + bx) * t + cx) * t
  const Y = (t: number) => ((ay * t + by) * t + cy) * t
  const dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return p => {
    if (p <= 0) return 0
    if (p >= 1) return 1
    // Newton from t = p, falling back to bisection where the slope is flat
    let t = p
    for (let i = 0; i < 6; i++) {
      const err = X(t) - p
      const d = dX(t)
      if (Math.abs(err) < 1e-6 || Math.abs(d) < 1e-6) break
      t -= err / d
    }
    if (Math.abs(X(t) - p) > 1e-5) {
      let lo = 0, hi = 1
      t = p
      for (let i = 0; i < 30; i++) { if (X(t) < p) lo = t; else hi = t; t = (lo + hi) / 2 }
    }
    return Y(t)
  }
}

export const EASING_PRESETS: { id: string; name: string; bezier: Bezier }[] = [
  { id: 'smooth', name: 'Smooth', bezier: [0.42, 0, 0.58, 1] },
  { id: 'linear', name: 'Linear', bezier: [0, 0, 1, 1] },
  { id: 'in', name: 'Ease in', bezier: [0.5, 0, 0.9, 0.6] },
  { id: 'out', name: 'Ease out', bezier: [0.1, 0.4, 0.5, 1] },
  { id: 'snappy', name: 'Snappy', bezier: [0.2, 0, 0, 1] },
  { id: 'overshoot', name: 'Overshoot', bezier: [0.3, 1.5, 0.6, 1] },
]

/** The reader's easing curve (Settings page). */
export function easeFn(): (p: number) => number {
  loadSettings()
  const [a, b, c, d] = settings.easing
  return cubicBezier(a, b, c, d)
}
