<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GraphDoc } from '@core/dsl/parser'
import { GraphIndex, type GraphData } from '@core/model'
import { PROPERTIES } from '@core/properties'
import EditableGraph, { type Tool } from '../EditableGraph.vue'
import RichText from '../RichText.vue'
import { positioned } from '../positions'

const props = defineProps<{ doc: GraphDoc; height: number }>()
const original = positioned(props.doc.panels[0].graph)
const graph = ref<GraphData>(original)
const live = computed(() => (props.doc.directives.live?.[0] ?? 'vertex-count, edge-count, degree-sequence').split(',').map(s => s.trim()).filter(s => PROPERTIES[s]))
const values = computed(() => {
  const ix = new GraphIndex(graph.value)
  return live.value.map(id => ({ id, name: PROPERTIES[id].name, value: PROPERTIES[id].compute(ix) }))
})
const tools = computed<Tool[]>(() => {
  const allow = props.doc.directives.allow?.[0]
  if (!allow) return ['move', 'vertex', 'edge', 'delete']
  const out: Tool[] = ['move']
  if (allow.includes('add-vertex')) out.push('vertex')
  if (allow.includes('add-edge')) out.push('edge')
  if (allow.includes('delete')) out.push('delete')
  return out
})
</script>

<template>
  <div class="ga-sandbox">
    <EditableGraph v-model="graph" :original="original" :tools="tools" :height="height" compact />
    <dl class="ga-live" aria-live="polite">
      <div v-for="p in values" :key="p.id" class="ga-live-item">
        <dt><RichText :text="p.name" /></dt>
        <dd><RichText :text="p.value" /></dd>
      </div>
    </dl>
  </div>
</template>
