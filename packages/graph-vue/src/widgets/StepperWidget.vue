<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GraphDoc } from '@core/dsl/parser'
import GraphView from '../GraphView.vue'
import RichText from '../RichText.vue'
import StepControls from './StepControls.vue'
import { applyPositions, unionPositions } from '../positions'

const props = defineProps<{ doc: GraphDoc; height: number }>()
const panel = computed(() => props.doc.panels[0])
const frames = computed(() => {
  const p = panel.value
  const graphs = p.steps.length ? p.steps.map(s => s.graph) : [p.graph]
  const pos = unionPositions([p.graph, ...graphs])
  return (p.steps.length ? p.steps : [{ text: '', graph: p.graph }]).map(s => ({ text: s.text, graph: applyPositions(s.graph, pos) }))
})
const step = ref(0)
watch(frames, () => { step.value = 0 })
</script>

<template>
  <div class="ga-stepper">
    <GraphView :graph="frames[step].graph" :max-height="height" :aria-label="doc.directives.caption?.[0]?.replace(/\$/g, '') ?? 'Step-by-step figure'" />
    <div class="ga-step-message" aria-live="polite"><RichText :text="frames[step].text" /></div>
    <StepControls v-model="step" :count="frames.length" />
  </div>
</template>
