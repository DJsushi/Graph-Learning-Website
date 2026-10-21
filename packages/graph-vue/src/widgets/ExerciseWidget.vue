<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { parseCall, parseKV, type GraphDoc } from '@core/dsl/parser'
import { cloneGraph, resolveRef, type GraphData, type Id } from '@core/model'
import { PREDICATES } from '@core/predicates'
import { ALGORITHMS, collect, emptyOverlay, type Overlay } from '@core/algorithms'
import GraphView from '../GraphView.vue'
import EditableGraph from '../EditableGraph.vue'
import RichText from '../RichText.vue'
import { positioned } from '../positions'
import { loadProgress, markAttempted, markSolved, progress } from '../progress'

const props = defineProps<{ doc: GraphDoc; height: number; figId: string }>()
const d = computed(() => props.doc.directives)
const task = computed(() => d.value.task?.[0] ?? 'select-edges')
const original = computed(() => positioned(props.doc.panels[0].graph))
const graph = ref<GraphData>(cloneGraph(original.value))
watch(original, g => { graph.value = cloneGraph(g) })

const selection = ref<{ vertices: Id[]; edges: Id[] }>({ vertices: [], edges: [] })
const selectable = computed(() => (task.value === 'select-vertices' ? 'vertices' : task.value === 'select-edges' ? 'edges' : task.value === 'select-elements' ? 'both' : 'none'))
const feedback = ref<{ ok: boolean; text: string } | null>(null)
const hintsShown = ref(0)
const solutionShown = ref(false)
const answer = ref('')
const solved = ref(false)

onMounted(() => { loadProgress(); solved.value = !!progress.solved[props.figId] })

function toggle(kind: 'vertex' | 'edge', id: Id) {
  if (task.value === 'simulate') return simulateClick(kind, id)
  const list = kind === 'vertex' ? selection.value.vertices : selection.value.edges
  const i = list.indexOf(id)
  if (i >= 0) list.splice(i, 1)
  else list.push(id)
  feedback.value = null
}

function check() {
  markAttempted(props.figId)
  if (task.value === 'answer') {
    const want = (d.value.answer?.[0] ?? '').trim()
    const tol = Number(d.value.tolerance?.[0] ?? 1e-9)
    const got = answer.value.trim()
    const ok = isFinite(Number(want)) && got !== '' ? Math.abs(Number(got) - Number(want)) <= tol : got.toLowerCase() === want.toLowerCase()
    return finish(ok, ok ? 'Correct!' : 'Not quite. Try again, or use a hint.')
  }
  const sel = { vertices: new Set(selection.value.vertices), edges: new Set(selection.value.edges) }
  for (const c of d.value.check ?? []) {
    const { name, args } = parseCall(c)
    const pred = PREDICATES[name]
    if (!pred) return finish(false, `Unknown check "${name}".`)
    const r = pred({ graph: graph.value, original: original.value, selection: sel, args })
    if (!r.ok) return finish(false, r.feedback ?? 'Not correct yet.')
  }
  finish(true, 'Correct!')
}
function finish(ok: boolean, text: string) {
  feedback.value = { ok, text }
  if (ok) { solved.value = true; markSolved(props.figId) }
}
function clearSel() {
  selection.value = { vertices: [], edges: [] }
  feedback.value = null
}

// ---- simulate: reproduce the algorithm's actions ----
const sim = computed(() => {
  if (task.value !== 'simulate') return null
  const def = ALGORITHMS[d.value.algo?.[0] ?? '']
  if (!def) return null
  const steps = collect(def, original.value, parseKV(d.value.params?.[0] ?? '')).steps
  return steps.map((s, i) => ({ s, i })).filter(x => x.s.action)
})
const simDone = ref(0)
const simOverlay = computed<Overlay>(() => {
  if (!sim.value || simDone.value === 0) return emptyOverlay()
  return sim.value[simDone.value - 1].s.overlay
})
function simulateClick(kind: 'vertex' | 'edge', id: Id) {
  if (!sim.value || simDone.value >= sim.value.length) return
  const next = sim.value[simDone.value].s.action!
  if (next.kind === kind && next.id === id) {
    simDone.value++
    feedback.value = simDone.value === sim.value.length ? { ok: true, text: 'Correct! You have reproduced the whole run.' } : { ok: true, text: `Correct (${simDone.value} of ${sim.value.length}).` }
    if (simDone.value === sim.value.length) { solved.value = true; markSolved(props.figId) }
  } else {
    markAttempted(props.figId)
    feedback.value = { ok: false, text: 'That is not the next step of the algorithm.' }
  }
}
function simReset() { simDone.value = 0; feedback.value = null }

const revealed = computed<GraphData>(() => {
  if (!solutionShown.value || !d.value.reveal) return graph.value
  const g = cloneGraph(graph.value)
  for (const r of d.value.reveal.join(' ').split(/\s+/).filter(Boolean)) {
    const res = resolveRef(g, r)
    const el = res?.kind === 'vertex' ? g.vertices.find(v => v.id === res.id) : res?.kind === 'edge' ? g.edges.find(e => e.id === res.id) : undefined
    if (el) el.classes = el.classes.filter(c => c !== 'hidden').concat('highlight')
  }
  return g
})
const hints = computed(() => d.value.hint ?? [])
</script>

<template>
  <div class="ga-exercise" :class="{ 'ga-solved': solved }">
    <div class="ga-exercise-head">
      <span class="ga-exercise-kind">Exercise</span>
      <span v-if="solved" class="ga-solved-badge">Solved</span>
    </div>
    <div v-if="d.prompt" class="ga-prompt"><RichText :text="d.prompt[0]" /></div>

    <EditableGraph v-if="task === 'build'" v-model="graph" :original="original" :height="height" compact />
    <GraphView v-else :graph="revealed" :overlay="task === 'simulate' ? simOverlay : undefined" :selection="selection"
      :selectable="task === 'simulate' ? (sim?.[0]?.s.action?.kind === 'vertex' ? 'vertices' : 'edges') : selectable"
      :max-height="height" :aria-label="d.prompt?.[0]?.replace(/\$/g, '') ?? 'Exercise graph'" @toggle="toggle" />

    <div class="ga-exercise-actions">
      <template v-if="task === 'answer'">
        <label class="ga-answer">
          <span>Your answer</span>
          <input v-model="answer" type="text" inputmode="decimal" autocomplete="off" @keydown.enter="check" />
        </label>
        <button type="button" class="ga-btn ga-btn-primary" @click="check">Check</button>
      </template>
      <template v-else-if="task === 'simulate'">
        <span class="ga-sim-progress">{{ simDone }} / {{ sim?.length ?? 0 }} steps</span>
        <button type="button" class="ga-btn" @click="simReset">Start over</button>
      </template>
      <template v-else>
        <button type="button" class="ga-btn ga-btn-primary" @click="check">Check</button>
        <button v-if="task !== 'build'" type="button" class="ga-btn" @click="clearSel">Clear selection</button>
      </template>
      <button v-if="hintsShown < hints.length" type="button" class="ga-btn" @click="hintsShown++">{{ hintsShown ? 'Another hint' : 'Hint' }}</button>
      <button v-if="d.solution && !solutionShown" type="button" class="ga-btn ga-btn-quiet" @click="solutionShown = true">Show solution</button>
    </div>
    <p v-if="feedback" class="ga-feedback" :class="feedback.ok ? 'ga-ok' : 'ga-no'" role="status">
      <RichText :text="feedback.text" />
    </p>
    <ol v-if="hintsShown" class="ga-hints">
      <li v-for="(h, i) in hints.slice(0, hintsShown)" :key="i"><RichText :text="h" /></li>
    </ol>
    <div v-if="solutionShown && d.solution" class="ga-solution-text">
      <strong>Solution.</strong> <RichText :text="d.solution[0]" />
    </div>
  </div>
</template>
