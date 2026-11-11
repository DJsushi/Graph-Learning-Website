import { expect, it } from 'vitest'
import { activeStep, inBand, scrollDelta } from '../src/walkthrough'

it('the active step is the last one that starts at or above the line', () => {
  const steps = [{ top: 0, bottom: 100 }, { top: 120, bottom: 300 }, { top: 320, bottom: 400 }]
  expect(activeStep(steps, 200)).toBe(1)
  expect(activeStep(steps, 110)).toBe(0)
  expect(activeStep(steps, 500)).toBe(2)
})

it('with every step below the line the first one is active (scrolled back above the walkthrough)', () => {
  expect(activeStep([{ top: 300, bottom: 400 }, { top: 420, bottom: 500 }], 100)).toBe(0)
})

it('a step is in the band only when all of it is, give or take 2px', () => {
  expect(inBand({ top: 100, bottom: 200 }, 50, 800)).toBe(true)
  expect(inBand({ top: 49, bottom: 200 }, 50, 800)).toBe(true)
  expect(inBand({ top: 40, bottom: 200 }, 50, 800)).toBe(false)
  expect(inBand({ top: 728, bottom: 801 }, 0, 768)).toBe(false)
  expect(inBand({ top: 118, bottom: 191 }, 191, 768)).toBe(false)
})

it('scrolls a step into the band: not at all when it is in it, centred, or top-aligned when it is taller than the band', () => {
  expect(scrollDelta({ top: 400, bottom: 500 }, 372, 844)).toBe(0)
  // the clipped step 802..902 under a figure ending at 372 in an 844px viewport: centre it
  expect(scrollDelta({ top: 802, bottom: 902 }, 372, 844)).toBe(852 - 608)
  expect(scrollDelta({ top: 100, bottom: 200 }, 372, 844)).toBe(150 - 608)
  expect(scrollDelta({ top: 900, bottom: 1500 }, 372, 844)).toBe(900 - 372)
  expect(scrollDelta({ top: -300, bottom: 400 }, 372, 844)).toBe(-300 - 372)
})
