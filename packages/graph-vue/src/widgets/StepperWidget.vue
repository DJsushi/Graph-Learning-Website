<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GraphDoc, StepDoc } from '@core/dsl/parser'
import GraphView from '../GraphView.vue'
import RichText from '../RichText.vue'
import StepControls from './StepControls.vue'
import { applyPositions, unionPositions } from '../positions'
import { useTweened } from '../useTweened'

const props = defineProps<{ doc: GraphDoc; height: number }>()
const panel = computed(() => props.doc.panels[0])
const frames = computed(() => {
  const p = panel.value
  const graphs = p.steps.length ? p.steps.map(s => s.graph) : [p.graph]
  const pos = unionPositions([p.graph, ...graphs])
  return (p.steps.length ? p.steps : [{ text: '', graph: p.graph }] as StepDoc[]).map(s => ({ text: s.text, graph: applyPositions(s.graph, pos), merges: s.merges, split: s.split }))
})
const step = ref(0)
const prev = ref(0)
watch(frames, () => { step.value = 0; prev.value = 0 })
watch(step, (_, old) => { prev.value = old }, { flush: 'sync' })
// moving one step forward plays that step's merges; one step back plays them in reverse
const { graph, fade, goo, ghost } = useTweened(() => {
  const i = step.value, f = frames.value
  if (i === prev.value + 1) return { graph: f[i].graph, merges: f[i].merges, reverse: f[i].split }
  if (i === prev.value - 1) return { graph: f[i].graph, merges: f[i + 1].merges, reverse: !f[i + 1].split }
  return { graph: f[i].graph }
})
</script>

<template>
  <div class="ga-stepper">
    <GraphView :graph="graph" :fade="fade" :goo="goo" :ghost="ghost" animate :max-height="height" :aria-label="doc.directives.caption?.[0]?.replace(/\$/g, '') ?? 'Step-by-step figure'" />
    <div class="ga-step-message" aria-live="polite"><RichText :text="frames[step].text" /></div>
    <StepControls v-model="step" :count="frames.length" />
  </div>
</template>
