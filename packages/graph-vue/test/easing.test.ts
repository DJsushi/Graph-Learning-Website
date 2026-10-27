import { describe, expect, it } from 'vitest'
import { cubicBezier, EASING_PRESETS } from '../src/easing'
import { clampBezier } from '../src/settings'

describe('cubicBezier', () => {
  it('starts at 0 and ends at 1', () => {
    for (const p of EASING_PRESETS) {
      const f = cubicBezier(...p.bezier)
      expect(f(0)).toBe(0)
      expect(f(1)).toBe(1)
    }
  })
  it('linear is the identity', () => {
    const f = cubicBezier(0, 0, 1, 1)
    for (const x of [0.1, 0.37, 0.5, 0.9]) expect(f(x)).toBeCloseTo(x, 4)
  })
  it('smooth is symmetric and matches CSS ease-in-out', () => {
    const f = cubicBezier(0.42, 0, 0.58, 1)
    expect(f(0.5)).toBeCloseTo(0.5, 4)
    expect(f(0.25)).toBeCloseTo(0.1291, 3)
  })
  it('overshoot goes past 1 before settling', () => {
    const f = cubicBezier(0.3, 1.5, 0.6, 1)
    expect(Math.max(...[0.3, 0.4, 0.5, 0.6, 0.7].map(f))).toBeGreaterThan(1.05)
  })
  it('is monotone in x for the plain presets', () => {
    const f = cubicBezier(0.2, 0, 0, 1)
    let prev = 0
    for (let i = 1; i <= 20; i++) { const y = f(i / 20); expect(y).toBeGreaterThanOrEqual(prev); prev = y }
  })
})

describe('clampBezier', () => {
  it('keeps x in [0, 1] and y in [-1, 2]', () => {
    expect(clampBezier([-1, -5, 3, 9])).toEqual([0, -1, 1, 2])
  })
})
