<script setup lang="ts">
// Hover / focus / long-press preview of the definition or result behind a [[ref]] link (a.ga-ref).
// The previews are a build-time data chunk loaded on first use.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { RefPreview } from '../data/refs.data'

const shown = ref<{ p: RefPreview; x: number; y: number; above: boolean } | null>(null)
const box = ref<HTMLElement>()
let previews: Record<string, RefPreview> | undefined
let link: HTMLAnchorElement | null = null
let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let suppressClick = false

async function load() {
  previews ??= (await import('../data/refs.data')).data
  return previews
}
const refLink = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLAnchorElement>('a.ga-ref') : null)

async function show(a: HTMLAnchorElement) {
  const key = decodeURIComponent(new URL(a.href).hash.slice(1))
  const p = (await load())[key]
  if (!p || !a.isConnected) return
  hide()
  link = a
  const r = a.getBoundingClientRect()
  const above = r.bottom + 260 > window.innerHeight && r.top > 260
  shown.value = { p, x: Math.min(Math.max(8, r.left), window.innerWidth - Math.min(420, window.innerWidth - 16) - 8), y: above ? r.top - 6 : r.bottom + 6, above }
  a.setAttribute('aria-describedby', 'ga-ref-preview')
  await nextTick()
}
function hide() {
  clearTimeout(openTimer)
  link?.removeAttribute('aria-describedby')
  link = null
  shown.value = null
}
const scheduleClose = () => { clearTimeout(closeTimer); closeTimer = setTimeout(hide, 180) }
const cancelClose = () => clearTimeout(closeTimer)

function onOver(ev: PointerEvent) {
  if (ev.pointerType !== 'mouse') return
  const a = refLink(ev.target)
  if (a) { cancelClose(); if (a !== link) { clearTimeout(openTimer); openTimer = setTimeout(() => show(a), 300) } }
}
function onOut(ev: PointerEvent) {
  if (ev.pointerType !== 'mouse' || !refLink(ev.target)) return
  clearTimeout(openTimer)
  if (link) scheduleClose()
}
function onFocusIn(ev: FocusEvent) { const a = refLink(ev.target); if (a) show(a) }
function onFocusOut(ev: FocusEvent) { if (refLink(ev.target)) scheduleClose() }
function onDown(ev: PointerEvent) {
  // touch: a long press previews instead of following the link
  if (ev.pointerType === 'mouse') { if (shown.value && !box.value?.contains(ev.target as Node) && !refLink(ev.target)) hide(); return }
  const a = refLink(ev.target)
  if (!a) { if (shown.value && !box.value?.contains(ev.target as Node)) hide(); return }
  clearTimeout(openTimer)
  openTimer = setTimeout(() => { suppressClick = true; show(a) }, 450)
}
function onUp() { if (!suppressClick) clearTimeout(openTimer) }
function onClick(ev: MouseEvent) {
  if (suppressClick && refLink(ev.target)) { ev.preventDefault(); suppressClick = false }
}
function onKey(ev: KeyboardEvent) { if (ev.key === 'Escape' && shown.value) hide() }

const listeners: [string, EventListener][] = [
  ['pointerover', onOver as EventListener], ['pointerout', onOut as EventListener], ['focusin', onFocusIn as EventListener],
  ['focusout', onFocusOut as EventListener], ['pointerdown', onDown as EventListener], ['pointerup', onUp], ['click', onClick as EventListener],
  ['keydown', onKey as EventListener], ['scroll', hide],
]
onMounted(() => { for (const [t, f] of listeners) document.addEventListener(t, f, t === 'click' || t === 'scroll' ? { capture: true } : undefined) })
onBeforeUnmount(() => { for (const [t, f] of listeners) document.removeEventListener(t, f, t === 'click' || t === 'scroll' ? { capture: true } : undefined) })
</script>

<template>
  <Teleport to="body">
    <div v-if="shown" id="ga-ref-preview" ref="box" class="ga-ref-preview" :class="{ above: shown.above }" role="tooltip"
      :style="{ left: `${shown.x}px`, top: `${shown.y}px` }" @pointerenter="cancelClose" @pointerleave="scheduleClose">
      <div class="ga-ref-preview-head"><span v-html="shown.p.head" /><span class="ga-ref-preview-where">{{ shown.p.lesson }}</span></div>
      <div class="ga-ref-preview-body vp-doc" v-html="shown.p.html" />
    </div>
  </Teleport>
</template>
