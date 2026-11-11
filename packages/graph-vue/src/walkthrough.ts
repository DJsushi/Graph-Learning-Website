// Shared state of a walkthrough (CONTENT_CONVENTIONS.md 9): Walkthrough.vue provides it, its steps and the stepper inside inject it.
import type { InjectionKey, Ref } from 'vue'

export interface WalkthroughState {
  step: Ref<number>
  register(index: number, el: HTMLElement): void
  select(index: number): void
}

export const WALKTHROUGH: InjectionKey<WalkthroughState> = Symbol('ga-walkthrough')

interface Box { top: number; bottom: number }

/** The active step for the line `y`: the last step that starts at or above it, or the first one when `y` is above them all. */
export function activeStep(boxes: Box[], y: number): number {
  let i = 0
  boxes.forEach((b, k) => { if (b.top <= y) i = k })
  return i
}

/** A box lies wholly inside the visible band from `top` to `bottom`, give or take `tol` pixels. */
export function inBand(b: Box, top: number, bottom: number, tol = 2): boolean {
  return b.top >= top - tol && b.bottom <= bottom + tol
}

/** How far to scroll down so the box shows in the band: 0 when it is in it, else center it, or align its top when it is taller than the band. */
export function scrollDelta(b: Box, top: number, bottom: number): number {
  if (inBand(b, top, bottom)) return 0
  return b.bottom - b.top > bottom - top ? b.top - top : (b.top + b.bottom) / 2 - (top + bottom) / 2
}
