// Drives `interpolate` over time: feed it the frame to show, get back the scene to draw.
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { GraphData, Merge } from '@core/model'
import { interpolate } from './tween'

export interface TweenTarget {
  graph: GraphData
  merges?: Merge[]
  reverse?: boolean
}

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useTweened(source: () => TweenTarget, duration: () => number = () => 450) {
  const graph = shallowRef<GraphData>(source().graph)
  const fade = shallowRef<Record<string, number>>({})
  let raf = 0
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0 }

  watch(source, tgt => {
    const prevFade = fade.value
    // interrupted mid-flight: restart from what is mostly visible
    let a = graph.value
    const interrupted = raf !== 0
    if (interrupted && Object.keys(prevFade).length) {
      const gone = (k: string) => (prevFade[k] ?? 1) < 0.5
      a = { ...a, vertices: a.vertices.filter(v => !gone(`v:${v.id}`)), edges: a.edges.filter(e => !gone(`e:${e.id}`)) }
    }
    stop()
    if (tgt.graph === a || reduced() || typeof requestAnimationFrame === 'undefined') { graph.value = tgt.graph; fade.value = {}; return }
    const ms = duration()
    const t0 = performance.now()
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / ms)
      const r = interpolate(a, tgt.graph, ease(p), // merges only describe the previous frame -> this one
        interrupted ? [] : tgt.merges, tgt.reverse)
      graph.value = r.graph
      fade.value = r.fade
      raf = p < 1 ? requestAnimationFrame(frame) : 0
    }
    raf = requestAnimationFrame(frame)
  })
  onBeforeUnmount(stop)
  return { graph, fade }
}
