<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { tweenMs } from '../settings'

const props = defineProps<{ count: number; modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [n: number] }>()

const playing = ref(false)
const speed = ref(1)
let timer: ReturnType<typeof setTimeout> | undefined

const set = (n: number) => emit('update:modelValue', Math.max(0, Math.min(props.count - 1, n)))
function tick() {
  if (!playing.value) return
  if (props.modelValue >= props.count - 1) { playing.value = false; return }
  set(props.modelValue + 1)
  timer = setTimeout(tick, (tweenMs() + 1200) / speed.value)
}
function toggle() {
  if (playing.value) { playing.value = false; clearTimeout(timer); return }
  if (props.modelValue >= props.count - 1) set(0)
  playing.value = true
  timer = setTimeout(tick, 400 / speed.value)
}
watch(() => props.count, () => { playing.value = false; clearTimeout(timer) })
onBeforeUnmount(() => clearTimeout(timer))

function onKey(ev: KeyboardEvent) {
  if (ev.key === 'ArrowRight') { set(props.modelValue + 1); ev.preventDefault() }
  else if (ev.key === 'ArrowLeft') { set(props.modelValue - 1); ev.preventDefault() }
  else if (ev.key === 'Home') { set(0); ev.preventDefault() }
  else if (ev.key === 'End') { set(props.count - 1); ev.preventDefault() }
}
</script>

<template>
  <div class="ga-controls" role="group" aria-label="Step controls" @keydown="onKey">
    <button type="button" class="ga-btn ga-icon-btn" :disabled="modelValue === 0" aria-label="First step" title="First step (Home)" @click="set(0)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M18 6l-9 6 9 6z" /></svg>
    </button>
    <button type="button" class="ga-btn ga-icon-btn" :disabled="modelValue === 0" aria-label="Previous step" title="Previous step (←)" @click="set(modelValue - 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-7 6 7 6z" /></svg>
    </button>
    <button type="button" class="ga-btn ga-icon-btn ga-play" :aria-label="playing ? 'Pause' : 'Play'" :title="playing ? 'Pause' : 'Play'" @click="toggle">
      <svg v-if="!playing" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
    </button>
    <button type="button" class="ga-btn ga-icon-btn" :disabled="modelValue >= count - 1" aria-label="Next step" title="Next step (→)" @click="set(modelValue + 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l7 6-7 6z" /></svg>
    </button>
    <button type="button" class="ga-btn ga-icon-btn" :disabled="modelValue >= count - 1" aria-label="Last step" title="Last step (End)" @click="set(count - 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M6 6l9 6-9 6z" /></svg>
    </button>
    <input class="ga-slider" type="range" min="0" :max="count - 1" :value="modelValue" aria-label="Step" @input="set(Number(($event.target as HTMLInputElement).value))" />
    <span class="ga-step-count" aria-live="polite">{{ modelValue + 1 }} / {{ count }}</span>
    <label class="ga-speed">
      <span class="ga-sr-only">Speed</span>
      <select v-model.number="speed" aria-label="Playback speed">
        <option :value="0.5">0.5×</option>
        <option :value="1">1×</option>
        <option :value="2">2×</option>
      </select>
    </label>
  </div>
</template>
