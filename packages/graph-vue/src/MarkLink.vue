<script setup lang="ts">
// A link in the text that spotlights a mark of a figure on the same page: hover, focus or tap (CONTENT_CONVENTIONS.md 6.1).
// While the figure shows a step that does not define the mark, the link is inert.
import { computed, onBeforeUnmount, ref } from 'vue'
import { markAvailable, spotlights, tapSpot } from './marks'

const props = defineProps<{ fig: string; mark: string }>()
const el = ref<HTMLElement>()
const live = computed(() => markAvailable(props.fig, props.mark))
const on = () => { if (live.value) spotlights[props.fig] = props.mark }
const off = () => { if (spotlights[props.fig] === props.mark) spotlights[props.fig] = null }
// a touch has no hover: a tap spotlights and it stays until a tap elsewhere or a blur. A mouse already spotlighted on enter.
let touch = false
const down = (ev: PointerEvent) => { touch = ev.pointerType === 'touch' }
const tap = () => { if (touch && live.value && el.value) tapSpot(el.value, props.fig, props.mark) }
onBeforeUnmount(off)
</script>

<template>
  <button ref="el" type="button" class="ga-mark" :class="{ 'ga-mark-inert': !live }" :aria-pressed="live ? spotlights[fig] === mark : undefined" :aria-disabled="live ? undefined : true"
    @pointerdown="down"
    @pointerenter="$event.pointerType !== 'touch' && on()" @pointerleave="$event.pointerType !== 'touch' && off()"
    @focus="on" @blur="off" @click="tap"><slot /></button>
</template>
