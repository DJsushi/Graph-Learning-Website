<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { parseKV, type GraphDoc } from '@core/dsl/parser'
import { ALGORITHMS, collect, type Step } from '@core/algorithms'
import type { GraphData } from '@core/model'
import GraphView from '../GraphView.vue'
import RichText from '../RichText.vue'
import StepControls from './StepControls.vue'
import { positioned, positionsOf } from '../positions'

const props = defineProps<{ doc: GraphDoc; height: number; pseudocode?: string; graph?: GraphData; params?: Record<string, string>; algo?: string }>()

const algoId = computed(() => props.algo ?? props.doc.directives.algo?.[0] ?? '')
const def = computed(() => ALGORITHMS[algoId.value])
const params = computed(() => props.params ?? parseKV(props.doc.directives.params?.[0] ?? ''))
const show = computed(() => (props.doc.directives.show?.[0] ?? 'pseudocode state').split(/[\s,]+/))
const base = computed(() => positioned(props.graph ?? props.doc.panels[0].graph))

const run = computed<{ steps: Step[]; error?: string }>(() => {
  if (!def.value) return { steps: [], error: `Unknown algorithm "${algoId.value}".` }
  try { return { steps: collect(def.value, base.value, params.value).steps } }
  catch (e) { return { steps: [], error: (e as Error).message } }
})
const step = ref(0)
watch(run, () => { step.value = 0 })
const cur = computed(() => run.value.steps[step.value])

// positions for step graphs (construction, contraction) and side panels
const cache = new WeakMap<GraphData, GraphData>()
function place(g: GraphData): GraphData {
  let c = cache.get(g)
  if (!c) {
    // graphs built from scratch (no shared vertices) are laid out on the final step's graph for stability
    c = positioned(g, positionsOf(stable.value))
    cache.set(g, c)
  }
  return c
}
const stable = computed(() => {
  if (base.value.vertices.length) return base.value
  const last = [...run.value.steps].reverse().find(s => s.graph)?.graph
  return last ? positioned(last) : base.value
})
const shownGraph = computed(() => (cur.value?.graph ? place(cur.value.graph) : base.value))
const panels = computed(() => (show.value.includes('residual') || !props.doc.directives.show ? cur.value?.panels ?? [] : []).map(p => ({ ...p, graph: place(p.graph) })))

const codeHtml = computed(() => {
  if (!props.pseudocode || !show.value.includes('pseudocode')) return ''
  const line = cur.value?.line
  return line ? props.pseudocode.replace(`<span class="ga-line" data-label="${line}">`, `<span class="ga-line ga-active" data-label="${line}">`) : props.pseudocode
})
const stateEntries = computed(() => (show.value.includes('state') ? Object.entries(cur.value?.state ?? {}) : []))
</script>

<template>
  <div class="ga-player">
    <div v-if="run.error" class="ga-graph-error" role="alert">{{ run.error }}</div>
    <template v-else-if="cur">
      <div class="ga-player-head">
        <span class="ga-player-name">{{ def?.name }}</span>
      </div>
      <div class="ga-player-body" :class="{ 'ga-has-side': codeHtml || stateEntries.length }">
        <div class="ga-player-main">
          <GraphView :graph="shownGraph" :overlay="cur.overlay" :max-height="height" :aria-label="`${def?.name}, step ${step + 1}`" />
          <div v-for="(p, i) in panels" :key="i" class="ga-side-graph">
            <div class="ga-panel-title"><RichText :text="p.title" /></div>
            <GraphView :graph="p.graph" :overlay="p.overlay" :max-height="Math.min(height, 260)" :aria-label="p.title.replace(/\$/g, '')" />
          </div>
        </div>
        <div v-if="codeHtml || stateEntries.length" class="ga-player-side">
          <div v-if="codeHtml" class="ga-player-code" v-html="codeHtml" />
          <dl v-if="stateEntries.length" class="ga-state">
            <template v-for="[k, v] in stateEntries" :key="k">
              <dt>{{ k }}</dt>
              <dd><RichText :text="`$${v}$`" /></dd>
            </template>
          </dl>
        </div>
      </div>
      <div class="ga-step-message" aria-live="polite"><RichText :text="cur.message" /></div>
      <StepControls v-model="step" :count="run.steps.length" />
    </template>
  </div>
</template>
