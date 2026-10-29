<script setup lang="ts">
// Hover / focus / long-press preview of the definition or result behind a [[ref]] link (a.ga-ref).
// The previews are a build-time data chunk loaded on first use.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { RefPreview } from '../data/refs.data'

type Layer = { p: RefPreview; x: number; y: number; above: boolean; link: HTMLAnchorElement }
// One layer per nesting level: layer i is opened from a link inside layer i-1 (layer 0 from the page).
const layers = ref<Layer[]>([])
let previews: Record<string, RefPreview> | undefined
let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let keep = 0 // number of layers the pointer / focus is currently "in"; the close timer trims to it
let suppressClick = false

async function load() {
  previews ??= (await import('../data/refs.data')).data
  return previews
}
const refLink = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLAnchorElement>('a.ga-ref') : null)
const layerEl = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>('.ga-ref-preview') : null)
// layers the target sits inside: 0 for page content, i + 1 for layer i
const depthOf = (t: EventTarget | null) => { const el = layerEl(t); return el ? Number(el.dataset.depth) + 1 : 0 }
const idOf = (i: number) => `ga-ref-preview-${i}`

function trim(n: number) {
  clearTimeout(openTimer)
  for (const l of layers.value.slice(n)) l.link.removeAttribute('aria-describedby')
  layers.value = layers.value.slice(0, n)
}
const hide = () => trim(0)

async function show(a: HTMLAnchorElement) {
  const key = decodeURIComponent(new URL(a.href).hash.slice(1))
  const p = (await load())[key]
  if (!p || !a.isConnected) return
  const d = depthOf(a)
  trim(d)
  const r = a.getBoundingClientRect()
  const above = r.bottom + 260 > window.innerHeight && r.top > 260
  layers.value.push({ p, link: a, above, x: Math.min(Math.max(8, r.left), window.innerWidth - Math.min(420, window.innerWidth - 16) - 8), y: above ? r.top - 6 : r.bottom + 6 })
  a.setAttribute('aria-describedby', idOf(d))
  keep = d + 2
}
const scheduleClose = () => { clearTimeout(closeTimer); closeTimer = setTimeout(() => trim(keep), 180) }
const cancelClose = () => clearTimeout(closeTimer)
const openedBy = (a: HTMLAnchorElement) => layers.value.some(l => l.link === a)

function onOver(ev: PointerEvent) {
  if (ev.pointerType !== 'mouse') return
  const a = refLink(ev.target)
  if (a) {
    cancelClose()
    keep = depthOf(a) + (openedBy(a) ? 1 : 0)
    if (!openedBy(a)) { clearTimeout(openTimer); openTimer = setTimeout(() => show(a), 300) }
  } else if (layerEl(ev.target)) { cancelClose(); keep = depthOf(ev.target) }
}
function onOut(ev: PointerEvent) {
  if (ev.pointerType !== 'mouse') return
  const a = refLink(ev.target), el = layerEl(ev.target)
  if (!a && !el) return
  clearTimeout(openTimer)
  // leaving a link or a layer: fall back to the layers below it unless the pointer lands in another one
  keep = a ? depthOf(a) : depthOf(el) - 1
  if (layers.value.length) scheduleClose()
}
function onFocusIn(ev: FocusEvent) { const a = refLink(ev.target); if (a) show(a) }
function onFocusOut(ev: FocusEvent) { const a = refLink(ev.target); if (a) { keep = depthOf(a); scheduleClose() } }
function onDown(ev: PointerEvent) {
  // touch: a long press previews instead of following the link
  const a = refLink(ev.target)
  if (ev.pointerType === 'mouse' || !a) {
    if (!layerEl(ev.target) && !a) hide()
    else if (!a) trim(depthOf(ev.target))
    return
  }
  clearTimeout(openTimer)
  openTimer = setTimeout(() => { suppressClick = true; show(a) }, 450)
}
function onUp() { if (!suppressClick) clearTimeout(openTimer) }
function onClick(ev: MouseEvent) {
  if (suppressClick && refLink(ev.target)) { ev.preventDefault(); suppressClick = false }
}
function onKey(ev: KeyboardEvent) { if (ev.key === 'Escape' && layers.value.length) hide() }
// scrolling inside a preview must not close it; page scrolling does
function onScroll(ev: Event) { if (!layerEl(ev.target)) hide() }

const listeners: [string, EventListener][] = [
  ['pointerover', onOver as EventListener], ['pointerout', onOut as EventListener], ['focusin', onFocusIn as EventListener],
  ['focusout', onFocusOut as EventListener], ['pointerdown', onDown as EventListener], ['pointerup', onUp], ['click', onClick as EventListener],
  ['keydown', onKey as EventListener], ['scroll', onScroll],
]
onMounted(() => { for (const [t, f] of listeners) document.addEventListener(t, f, t === 'click' || t === 'scroll' ? { capture: true } : undefined) })
onBeforeUnmount(() => { for (const [t, f] of listeners) document.removeEventListener(t, f, t === 'click' || t === 'scroll' ? { capture: true } : undefined) })
</script>

<template>
  <Teleport to="body">
    <div v-for="(l, i) in layers" :id="idOf(i)" :key="`${i}:${l.p.head}`" :data-depth="i" class="ga-ref-preview" :class="{ above: l.above }" role="tooltip"
      :style="{ left: `${l.x}px`, top: `${l.y}px` }" @pointerenter="cancelClose" @pointerleave="scheduleClose">
      <div class="ga-ref-preview-head"><span v-html="l.p.head" /><span class="ga-ref-preview-where">{{ l.p.lesson }}</span></div>
      <div class="ga-ref-preview-body vp-doc" v-html="l.p.html" />
    </div>
  </Teleport>
</template>
