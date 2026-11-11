<script setup lang="ts">
// A link in the text that spotlights a mark of a figure on the same page: hover, focus or tap (CONTENT_CONVENTIONS.md 6.1).
import { onBeforeUnmount } from 'vue'
import { spotlights } from './marks'

const props = defineProps<{ fig: string; mark: string }>()
const on = () => { spotlights[props.fig] = props.mark }
const off = () => { if (spotlights[props.fig] === props.mark) spotlights[props.fig] = null }
// a touch has no hover: a tap toggles. A mouse already spotlighted on enter, so its click does nothing.
let touch = false
const down = (ev: PointerEvent) => { touch = ev.pointerType === 'touch' }
const tap = () => { if (touch) (spotlights[props.fig] === props.mark ? off : on)() }
onBeforeUnmount(off)
</script>

<template>
  <button type="button" class="ga-mark" :aria-pressed="spotlights[fig] === mark"
    @pointerdown="down"
    @pointerenter="$event.pointerType !== 'touch' && on()" @pointerleave="$event.pointerType !== 'touch' && off()"
    @focus="on" @blur="off" @click="tap"><slot /></button>
</template>
