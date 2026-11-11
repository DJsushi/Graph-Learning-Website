import { describe, expect, it } from 'vitest'
import { computeBox, widthStyle, SCALE_MAX } from '../src/viewbox'

const opts = { hasVertices: true, labelsInside: true, hasLoops: false, hasGroups: false, hasBadges: false }

describe('viewbox', () => {
  it('3 vertices: box is small and width is capped in px', () => {
    const b = computeBox([{ x: 0, y: 0 }, { x: 128, y: 0 }, { x: 64, y: -110 }], opts)
    expect(b.w).toBe(188)
    expect(widthStyle(b, '70vh', false)).toBe(`min(100%, ${Math.round(b.w * SCALE_MAX)}px, calc(70vh * ${(b.w / b.h).toFixed(4)}))`)
  })
  it('uncapped (zoom dialog, editor) has no px cap', () => {
    const b = computeBox([{ x: 0, y: 0 }, { x: 128, y: 0 }], opts)
    expect(widthStyle(b, '70vh', true)).toBe(`min(100%, calc(70vh * ${(b.w / b.h).toFixed(4)}))`)
  })
  it('empty graph gets the default box', () => {
    expect(computeBox([], { ...opts, hasVertices: false })).toEqual({ x: -100, y: -60, w: 200, h: 120 })
  })
})
