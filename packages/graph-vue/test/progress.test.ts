import { describe, expect, it } from 'vitest'
import { exportProgress, importProgress, lastVisited, markVisited, progress, resetProgress, toggleDone } from '@gv/progress'

describe('progress', () => {
  it('tracks visits and done lessons and round-trips them', async () => {
    resetProgress()
    markVisited('theory/01-basic-notions')
    await new Promise(r => setTimeout(r, 2))
    markVisited('algorithms/02-maximum-flow')
    toggleDone('theory/01-basic-notions')
    expect(lastVisited()).toBe('algorithms/02-maximum-flow')
    const saved = exportProgress()
    resetProgress()
    expect(progress.done).toEqual({})
    importProgress(saved)
    expect(Object.keys(progress.done)).toEqual(['theory/01-basic-notions'])
    toggleDone('theory/01-basic-notions')
    expect(progress.done).toEqual({})
  })
  it('rejects files that are not progress objects', () => {
    expect(() => importProgress('3')).toThrow()
  })
})
