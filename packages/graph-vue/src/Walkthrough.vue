<script setup lang="ts">
// A walkthrough with a figure (CONTENT_CONVENTIONS.md 9): numbered steps beside (or under) a sticky stepper.
// The active step follows scrolling, a click or focus on a step, the arrow keys on a step and the stepper's controls.
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { WALKTHROUGH, activeStep, figureHeight, scrollDelta } from './walkthrough'

const root = ref<HTMLElement>()
const body = ref<HTMLElement>()
const step = ref(0)
const els: HTMLElement[] = []
let fromScroll = false
// while a programmatic scroll runs, scrolling does not move the active step (the smooth scroll passes other steps)
let quietUntil = 0

provide(WALKTHROUGH, { step, register: (i, el) => { els[i] = el }, select: i => { step.value = i } })

// The top of the part of the viewport the steps can use: below the sticky figure in one column, below the page header beside it.
function bandTop(): number {
  const fig = root.value?.querySelector<HTMLElement>('.ga-figure-anchor')
  const first = els[0]
  if (!fig || !first) return 0
  const f = fig.getBoundingClientRect()
  // where the figure sits once it sticks, not where it is now (before the walkthrough reaches the top it is lower)
  const stuck = parseFloat(getComputedStyle(fig).top) || 0
  return f.left < first.getBoundingClientRect().right ? stuck + f.height : stuck
}

// Where the running programmatic scroll ends. Rects measured while it runs are judged at that position, and the page
// scrolls to an absolute target: a relative scroll from mid-flight rects lags behind or overshoots (Chrome queues them).
let goal = 0
// the scroll's last frame still reaches sync() after scrollend, so the quiet lasts one more moment
const onScrollEnd = () => { const now = performance.now(); if (now < quietUntil) quietUntil = now + 100 }

function ensureVisible(i: number) {
  const el = els[i]
  if (!el) return
  const r = el.getBoundingClientRect(), now = performance.now()
  const ahead = now < quietUntil ? goal - window.scrollY : 0
  const d = scrollDelta({ top: r.top - ahead, bottom: r.bottom - ahead }, bandTop(), window.innerHeight)
  if (!d) return
  const max = document.documentElement.scrollHeight - window.innerHeight
  goal = Math.max(0, Math.min(max, window.scrollY + ahead + d))
  // shortcut: without a scrollend event (older Safari) the quiet ends after 3s, enough for any smooth scroll
  quietUntil = now + 3000
  window.scrollTo({ top: goal, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
watch(step, i => { if (!fromScroll) nextTick(() => ensureVisible(i)) }, { flush: 'sync' })

// What sticks at the top of the page depends on the width and on whether the page has a local nav (it is empty without headings),
// so the sticky offset is measured instead of guessed (custom.css has the fallback without JavaScript).
function place() {
  const nav = document.querySelector<HTMLElement>('.VPNav'), local = document.querySelector<HTMLElement>('.VPLocalNav')
  const px = (nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0) + (local && getComputedStyle(local).display !== 'none' ? local.offsetHeight : 0)
  root.value?.style.setProperty('--ga-wt-top', `${px}px`)
}

// In one column the figure box has a maximum height; the drawing gets what the controls and the caption leave (a long caption wraps on a phone).
// Beside the text the box has no maximum and the CSS value stays.
function fit() {
  const el = body.value, box = el?.querySelector<HTMLElement>(':scope > .ga-figure-anchor'), svg = box?.querySelector<SVGElement>('svg.gv-root')
  if (!el || !box || !svg) return
  const maxH = parseFloat(getComputedStyle(box).maxHeight)
  if (!maxH) return el.style.removeProperty('--ga-fig-h')
  el.style.setProperty('--ga-fig-h', `${figureHeight(maxH, box.scrollHeight - svg.getBoundingClientRect().height)}px`)
}
let ro: ResizeObserver | undefined

let raf = 0
function sync() {
  raf = 0
  place()
  if (performance.now() < quietUntil) return
  // at the bottom of the page the last step is active when it is on screen, even if it never reaches the line
  const last = els[els.length - 1]
  const atEnd = !!last && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 && last.getBoundingClientRect().top < window.innerHeight
  const i = atEnd ? els.length - 1 : activeStep(els.map(e => e.getBoundingClientRect()), (bandTop() + window.innerHeight) / 2)
  if (i === step.value) return
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
  place()
  // the width changes how the caption wraps; the figcaption is observed too so a late font or KaTeX is caught
  ro = new ResizeObserver(fit)
  if (body.value) ro.observe(body.value)
  const cap = body.value?.querySelector('.ga-figure-anchor figcaption')
  if (cap) ro.observe(cap)
  fit()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('scrollend', onScrollEnd)
  sync()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('scrollend', onScrollEnd)
  cancelAnimationFrame(raf)
  ro?.disconnect()
})
</script>

<template>
  <div ref="root" class="ga-walkthrough" @keydown="onKey">
    <div ref="body" class="ga-wt-body"><slot /></div>
  </div>
</template>
