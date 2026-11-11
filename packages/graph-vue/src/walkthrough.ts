// Shared state of a walkthrough (CONTENT_CONVENTIONS.md 9): Walkthrough.vue provides it, its steps and the stepper inside inject it.
import type { InjectionKey, Ref } from 'vue'

export interface WalkthroughState {
  step: Ref<number>
  register(index: number, el: HTMLElement): void
  select(index: number): void
}

export const WALKTHROUGH: InjectionKey<WalkthroughState> = Symbol('ga-walkthrough')

interface Box { top: number; bottom: number }

/** The step whose box crosses the line `y` (the middle of the viewport), or -1 when none does. */
export function crossing(boxes: Box[], y: number): number {
  return boxes.findIndex(b => b.top <= y && b.bottom >= y)
}

/** A box lies wholly outside the visible band from `top` to `bottom`. */
export function offScreen(b: Box, top: number, bottom: number): boolean {
  return b.bottom <= top || b.top >= bottom
}
