// The drawing's viewBox and its size cap. Pure, so the renderer and the content validator agree.
export interface Pt { x: number; y: number }
export type Box = { x: number; y: number; w: number; h: number }

/** Largest px per unit a figure is drawn at: circles 32px, labels 17.5px (1.0 gives 26px and 14px). */
export const SCALE_MAX = 1.25

export interface BoxOpts {
  hasVertices: boolean
  labelsInside: boolean
  hasLoops: boolean
  hasGroups: boolean
  hasBadges: boolean
}

/** pts: everything that has to fit (vertices, curve apexes, group labels), screen units. */
export function computeBox(pts: Pt[], o: BoxOpts): Box {
  if (!o.hasVertices || !pts.length) return { x: -100, y: -60, w: 200, h: 120 }
  let x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x))
  let y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y))
  const pad = (o.labelsInside ? 30 : 38) + (o.hasLoops ? 42 : 0) + (o.hasGroups ? 26 : 0)
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad
  if (o.hasBadges) { y0 -= 12; x1 += 18 }
  const w = Math.max(x1 - x0, 140), h = Math.max(y1 - y0, 90)
  return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h }
}

/** CSS width: the column, at most SCALE_MAX px per unit (unless `uncapped`), and no wider than maxHeight allows. */
export function widthStyle(b: Box, maxHeight: string, uncapped: boolean): string {
  const cap = uncapped ? '' : `${Math.round(b.w * SCALE_MAX)}px, `
  return `min(100%, ${cap}calc(${maxHeight} * ${(b.w / b.h).toFixed(4)}))`
}
