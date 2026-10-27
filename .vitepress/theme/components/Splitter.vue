<script setup lang="ts">
// Draggable divider between two panes. Emits pixel deltas; the parent owns and clamps the size.
import { ref } from 'vue'

const props = withDefaults(defineProps<{ vertical?: boolean; label: string; value?: number }>(), { vertical: false })
const emit = defineEmits<{ resize: [delta: number]; end: []; reset: [] }>()

const dragging = ref(false)
let last = 0

function down(ev: PointerEvent) {
  if (ev.button !== 0) return
  ev.preventDefault()
  ;(ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId)
  dragging.value = true
  last = props.vertical ? ev.clientY : ev.clientX
}
function move(ev: PointerEvent) {
  if (!dragging.value) return
  const p = props.vertical ? ev.clientY : ev.clientX
  emit('resize', p - last)
  last = p
}
function up() {
  if (!dragging.value) return
  dragging.value = false
  emit('end')
}
function key(ev: KeyboardEvent) {
  const step = ev.shiftKey ? 48 : 16
  const back = props.vertical ? 'ArrowUp' : 'ArrowLeft', fwd = props.vertical ? 'ArrowDown' : 'ArrowRight'
  if (ev.key === back || ev.key === fwd) { ev.preventDefault(); emit('resize', ev.key === fwd ? step : -step); emit('end') }
}
</script>

<template>
  <div class="ga-splitter" :class="{ 'ga-splitter-v': vertical, dragging }" role="separator" tabindex="0"
    :aria-orientation="vertical ? 'horizontal' : 'vertical'" :aria-label="label" :aria-valuenow="value"
    :title="`${label}: drag to resize, double-click to reset`"
    @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @dblclick="emit('reset'); emit('end')" @keydown="key" />
</template>
