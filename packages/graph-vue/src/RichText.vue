<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import { withBase } from 'vitepress'
import { renderRich } from './rich'
import { spotlights } from './marks'

const props = defineProps<{ text: string; tag?: string }>()
const html = computed(() => {
  // links in rich text are absolute site paths; withBase('/') gives the deployment base
  return renderRich(props.text, withBase('/'))
})

// mark links in the html (rich.ts) behave like MarkLink.vue: hover, focus or tap spotlights the mark
const root = ref<HTMLElement>()
const markOf = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>('.ga-mark[data-fig]') : null)
const on = (b: HTMLElement) => { spotlights[b.dataset.fig!] = b.dataset.mark! }
const off = (b: HTMLElement) => { if (spotlights[b.dataset.fig!] === b.dataset.mark) spotlights[b.dataset.fig!] = null }
let touch = false
function ev(e: Event) {
  const b = markOf(e.target)
  if (!b) return
  const pe = e as PointerEvent
  if (e.type === 'pointerdown') touch = pe.pointerType === 'touch'
  else if (e.type === 'pointerover' && pe.pointerType !== 'touch') on(b)
  else if (e.type === 'pointerout' && pe.pointerType !== 'touch' && !b.contains(pe.relatedTarget as Node | null)) off(b)
  else if (e.type === 'focusin') on(b)
  else if (e.type === 'focusout') off(b)
  else if (e.type === 'click' && touch) (spotlights[b.dataset.fig!] === b.dataset.mark ? off : on)(b)
}
watchEffect(() => {
  void html.value
  for (const b of root.value?.querySelectorAll<HTMLElement>('.ga-mark[data-fig]') ?? []) b.setAttribute('aria-pressed', String(spotlights[b.dataset.fig!] === b.dataset.mark))
}, { flush: 'post' })
onBeforeUnmount(() => { for (const b of root.value?.querySelectorAll<HTMLElement>('.ga-mark[data-fig]') ?? []) off(b) })
</script>

<template>
  <component :is="tag ?? 'span'" ref="root" class="ga-rich" v-html="html"
    @pointerdown="ev" @pointerover="ev" @pointerout="ev" @focusin="ev" @focusout="ev" @click="ev" />
</template>
