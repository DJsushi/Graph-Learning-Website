<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GraphDoc } from '@core/dsl/parser'
import type { GraphData, Id } from '@core/model'
import type { Pt } from '../geometry'
import GraphView from '../GraphView.vue'
import RichText from '../RichText.vue'
import { positioned, positionsOf } from '../positions'

const props = defineProps<{ doc: GraphDoc; height: number }>()

const sync = computed(() => props.doc.directives['layout-sync']?.[0] === 'true')
const draggable = computed(() => (props.doc.directives.interactive?.[0] ?? '').includes('drag'))

function layoutAll(): GraphData[] {
  const out: GraphData[] = []
  let known = new Map<Id, { x: number; y: number }>()
  for (const p of props.doc.panels) {
    const g = positioned(p.graph, sync.value && out.length ? known : undefined)
    out.push(g)
    if (sync.value) known = new Map([...known, ...positionsOf(g)])
  }
  return out
}

const graphs = ref<GraphData[]>(layoutAll())
watch(() => props.doc, () => { graphs.value = layoutAll() })

let dragging: { panel: number; id: Id } | null = null
function down(panel: number, id: Id) { if (draggable.value) dragging = { panel, id } }
function move(panel: number, p: Pt) {
  if (!dragging || dragging.panel !== panel) return
  const v = graphs.value[panel].vertices.find(x => x.id === dragging!.id)
  if (v) { v.x = p.x; v.y = p.y }
}
function up() { dragging = null }
</script>

<template>
  <div class="ga-panels" :class="{ 'ga-panels-multi': graphs.length > 1 }">
    <div v-for="(g, i) in graphs" :key="i" class="ga-panel">
      <div v-if="doc.panels[i].title" class="ga-panel-title"><RichText :text="doc.panels[i].title!" /></div>
      <GraphView :graph="g" :max-height="graphs.length > 1 ? Math.min(height, 240) : height" :editable="draggable"
        :aria-label="doc.directives.caption?.[0]?.replace(/\$/g, '') ?? 'Graph figure'"
        @vertex-down="(id) => down(i, id)" @move="(p) => move(i, p)" @up="up" />
    </div>
  </div>
</template>
