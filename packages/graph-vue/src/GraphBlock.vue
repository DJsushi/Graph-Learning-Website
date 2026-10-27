<script setup lang="ts">
// Entry point for ```graph blocks in Markdown: decodes the payload, parses the DSL and dispatches to a widget.
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { parseGraph } from '@core/dsl/parser'
import { encodeShare } from '@core/io'
import FigureWidget from './widgets/FigureWidget.vue'
import StepperWidget from './widgets/StepperWidget.vue'
import PlayerWidget from './widgets/PlayerWidget.vue'
import SandboxWidget from './widgets/SandboxWidget.vue'
import ExerciseWidget from './widgets/ExerciseWidget.vue'
import RichText from './RichText.vue'
import ZoomDialog from './ZoomDialog.vue'

const props = defineProps<{ data: string }>()

function decode(b64: string) {
  const bin = atob(b64)
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes)) as {
    id: string; info: Record<string, string>; source: string
    pseudocode?: { id: string; html: string }
  }
}

const payload = computed(() => decode(props.data))
const doc = computed(() => parseGraph(payload.value.source, payload.value.info))
const widget = computed(() => payload.value.info.widget ?? 'figure')
const caption = computed(() => doc.value.directives.caption?.[0])
const height = computed(() => ({ small: 200, medium: 300, large: 440 } as Record<string, number>)[payload.value.info.height ?? 'medium'] ?? 300)
const enlarged = ref(false)
const bigHeight = ref(600)
function enlarge() {
  bigHeight.value = Math.max(320, Math.round(window.innerHeight * 0.62))
  enlarged.value = true
}
const playgroundHref = computed(() => {
  // strip widget directives so that the playground gets a plain graph
  const plain = payload.value.source.split('\n').filter(l => !/^\s*(caption|intent|prompt|check|hint|solution|answer|task|reveal|algo|params|show|live|allow|step|tolerance):/.test(l)).join('\n')
  return withBase(`/playground#g=${encodeShare(plain)}`)
})
</script>

<template>
  <figure class="ga-graph" :class="`ga-graph-${widget}`">
    <div v-if="doc.errors.length" class="ga-graph-error" role="alert">
      <strong>Graph error</strong>
      <ul><li v-for="(e, i) in doc.errors" :key="i">line {{ e.line }}: {{ e.message }}</li></ul>
    </div>
    <template v-else>
      <FigureWidget v-if="widget === 'figure'" :doc="doc" :height="height" />
      <StepperWidget v-else-if="widget === 'stepper'" :doc="doc" :height="height" />
      <PlayerWidget v-else-if="widget === 'player'" :doc="doc" :height="height" :pseudocode="payload.pseudocode?.html" />
      <SandboxWidget v-else-if="widget === 'editable'" :doc="doc" :height="height" />
      <ExerciseWidget v-else-if="widget === 'exercise'" :doc="doc" :height="height" :fig-id="payload.id" />
      <FigureWidget v-else :doc="doc" :height="height" />
    </template>
    <ZoomDialog v-if="enlarged" :caption="caption" @close="enlarged = false">
      <StepperWidget v-if="widget === 'stepper'" :doc="doc" :height="bigHeight" />
      <PlayerWidget v-else-if="widget === 'player'" :doc="doc" :height="bigHeight" :pseudocode="payload.pseudocode?.html" />
      <SandboxWidget v-else-if="widget === 'editable'" :doc="doc" :height="bigHeight" />
      <FigureWidget v-else :doc="doc" :height="bigHeight" />
    </ZoomDialog>
    <figcaption v-if="caption || widget !== 'exercise'" class="ga-caption">
      <RichText v-if="caption" :text="caption" />
      <span class="ga-figure-actions">
        <button v-if="!doc.errors.length" type="button" class="ga-link-btn" title="Show this figure larger, with zoom" @click="enlarge">Enlarge</button>
        <a class="ga-open-playground" :href="playgroundHref" title="Open this graph in the playground">Open in playground</a>
      </span>
    </figcaption>
  </figure>
</template>
