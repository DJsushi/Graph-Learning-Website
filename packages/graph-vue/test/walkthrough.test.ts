import { expect, it } from 'vitest'
import { crossing, offScreen } from '../src/walkthrough'

it('the active step is the one that crosses the middle line', () => {
  const steps = [{ top: 0, bottom: 100 }, { top: 120, bottom: 300 }, { top: 320, bottom: 400 }]
  expect(crossing(steps, 200)).toBe(1)
  expect(crossing(steps, 110)).toBe(-1)
  expect(crossing(steps, 500)).toBe(-1)
})

it('a step is off screen only when no part of it is in the visible band', () => {
  expect(offScreen({ top: -50, bottom: 10 }, 0, 800)).toBe(false)
  expect(offScreen({ top: -50, bottom: 0 }, 0, 800)).toBe(true)
  expect(offScreen({ top: 100, bottom: 200 }, 300, 800)).toBe(true)
  expect(offScreen({ top: 800, bottom: 900 }, 0, 800)).toBe(true)
})
