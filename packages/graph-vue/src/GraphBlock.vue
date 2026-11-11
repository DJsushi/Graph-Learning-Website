<script setup lang="ts">
// Entry point for ```graph blocks in Markdown: decodes the payload, parses the DSL and dispatches to a widget.
import { computed, ref, type Component } from 'vue'
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
// The info-string `height` stays valid but sets no size: figures fill their column up to 70% of the viewport height.
const height = '70vh'
const WIDGETS = { figure: FigureWidget, stepper: StepperWidget, player: PlayerWidget, editable: SandboxWidget, exercise: ExerciseWidget } as Record<string, Component>
const widgetProps = (name: string, h: number | string) => ({
  doc: doc.value, height: h,
  ...(name === 'player' ? { pseudocode: payload.value.pseudocode?.html } : {}),
  ...(name === 'exercise' ? { figId: payload.value.id } : {}),
})
const widgetOf = (name: string) => WIDGETS[name] ?? FigureWidget
// a plain figure also opens on click and Enter; interactive ones keep their own pointer handling
const isStatic = computed(() => widgetOf(widget.value) === FigureWidget && !(doc.value.directives.interactive?.[0] ?? '').includes('drag'))
// an exercise is not interactive in the dialog
const zoomed = computed(() => (widget.value === 'exercise' ? 'figure' : widget.value))
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
    <div class="ga-graph-frame">
      <div v-if="doc.errors.length" class="ga-graph-error" role="alert">
        <strong>Graph error</strong>
        <ul><li v-for="(e, i) in doc.errors" :key="i">line {{ e.line }}: {{ e.message }}</li></ul>
      </div>
      <template v-else>
        <button type="button" class="ga-btn ga-icon-btn ga-enlarge" aria-label="Enlarge figure" title="Show this figure larger, with zoom" @click="enlarge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" /></svg>
        </button>
        <div v-if="isStatic" class="ga-graph-static" role="button" tabindex="0" @click="enlarge" @keydown.enter="enlarge">
          <component :is="widgetOf(widget)" v-bind="widgetProps(widget, height)" />
        </div>
        <component :is="widgetOf(widget)" v-else v-bind="widgetProps(widget, height)" />
      </template>
    </div>
    <ZoomDialog v-if="enlarged" :caption="caption" @close="enlarged = false">
      <component :is="widgetOf(zoomed)" v-bind="widgetProps(zoomed, bigHeight)" />
    </ZoomDialog>
    <figcaption v-if="caption || widget !== 'exercise'" class="ga-caption">
      <RichText v-if="caption" :text="caption" />
      <span class="ga-figure-actions">
        <a class="ga-open-playground" :href="playgroundHref" title="Open this graph in the playground">Open in playground</a>
      </span>
    </figcaption>
  </figure>
</template>
