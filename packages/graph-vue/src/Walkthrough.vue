<script setup lang="ts">
// A walkthrough with a figure (CONTENT_CONVENTIONS.md 9): numbered steps beside (or under) a sticky stepper.
// The active step follows scrolling, a click or focus on a step, the arrow keys on a step and the stepper's controls.
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { WALKTHROUGH, crossing, offScreen } from './walkthrough'

const root = ref<HTMLElement>()
const step = ref(0)
const els: HTMLElement[] = []
let fromScroll = false
// after a programmatic scroll, scrolling does not move the active step for a moment (the smooth scroll passes other steps)
let quietUntil = 0

provide(WALKTHROUGH, { step, register: (i, el) => { els[i] = el }, select: i => { step.value = i } })

function ensureVisible(i: number) {
  const el = els[i], fig = root.value?.querySelector('.ga-figure-anchor')
  if (!el) return
  const r = el.getBoundingClientRect(), f = fig?.getBoundingClientRect()
  // one column: the sticky figure covers the top of the viewport
  const top = f && f.left < r.right ? f.bottom : 0
  if (!offScreen(r, top, window.innerHeight)) return
  quietUntil = performance.now() + 1000
  el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
watch(step, i => { if (!fromScroll) nextTick(() => ensureVisible(i)) }, { flush: 'sync' })

let raf = 0
function sync() {
  raf = 0
  if (performance.now() < quietUntil) return
  const i = crossing(els.map(e => e.getBoundingClientRect()), window.innerHeight / 2)
  if (i < 0 || i === step.value) return
  fromScroll = true
  step.value = i
  fromScroll = false
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync) }

function onKey(ev: KeyboardEvent) {
  const li = ev.target instanceof Element ? ev.target.closest<HTMLElement>('.ga-wt-step') : null
  if (ev.defaultPrevented || !li || !els.includes(li)) return
  const to = ({ ArrowRight: step.value + 1, ArrowLeft: step.value - 1, Home: 0, End: els.length - 1 } as Record<string, number>)[ev.key]
  if (to === undefined) return
  ev.preventDefault()
  step.value = Math.max(0, Math.min(els.length - 1, to))
  els[step.value]?.focus({ preventScroll: true })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  sync()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="ga-walkthrough" @keydown="onKey">
    <div class="ga-wt-body"><slot /></div>
  </div>
</template>
