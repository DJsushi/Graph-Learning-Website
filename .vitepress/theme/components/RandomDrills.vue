<script setup lang="ts">
// Randomly generated exercises, checked by the same predicates as the lesson exercises.
import { computed, ref } from 'vue'
import { parseGraph } from '@core/dsl/parser'
import ExerciseWidget from '@gv/widgets/ExerciseWidget.vue'
import { maxFlowValue } from '@core/algorithms'
import { rng } from '@core/random'

type Kind = 'mst' | 'spanning' | 'bipartition' | 'flow' | 'matching'
const KINDS: { id: Kind; label: string }[] = [
  { id: 'mst', label: 'Minimum spanning tree' },
  { id: 'spanning', label: 'Spanning tree' },
  { id: 'bipartition', label: 'Bipartition' },
  { id: 'matching', label: 'Maximum matching' },
  { id: 'flow', label: 'Maximum flow value' },
]
const kind = ref<Kind>('mst')
const seed = ref(1 + Math.floor(Math.random() * 100000))

function connectedGraph(r: () => number, n: number, extra: number, weights: boolean): string {
  const lines: string[] = []
  const used = new Set<string>()
  const ws = Array.from({ length: n * 3 }, (_, i) => i + 1).sort(() => r() - 0.5)
  let wi = 0
  const add = (a: number, b: number) => {
    const k = [a, b].sort().join('-')
    if (a === b || used.has(k)) return
    used.add(k)
    lines.push(`${a} -- ${b}${weights ? ` [w=${ws[wi++ % ws.length]}]` : ''}`)
  }
  for (let i = 2; i <= n; i++) add(1 + Math.floor(r() * (i - 1)), i)
  for (let t = 0; t < extra * 4 && used.size < n - 1 + extra; t++) add(1 + Math.floor(r() * n), 1 + Math.floor(r() * n))
  return lines.join('\n')
}

const source = computed(() => {
  const r = rng(seed.value)
  switch (kind.value) {
    case 'mst': return `task: select-edges\nprompt: Select the edges of the minimum spanning tree.\ncheck: is-mst\nhint: Kruskal: process the edges by increasing weight and skip the ones that close a cycle.\n${connectedGraph(r, 7, 5, true)}`
    case 'spanning': return `task: select-edges\nprompt: Select the edges of any spanning tree.\ncheck: is-spanning-tree\nhint: You need $n - 1$ edges and no cycle.\n${connectedGraph(r, 8, 5, false)}`
    case 'bipartition': {
      const n = 8, side = Array.from({ length: n }, () => (r() < 0.5 ? 0 : 1))
      const es: string[] = []
      for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) if (side[i - 1] !== side[j - 1] && r() < 0.45) es.push(`${i} -- ${j}`)
      return `task: select-vertices\nprompt: This graph is bipartite. Select one side of a bipartition.\ncheck: is-bipartition-side\nhint: Start with any vertex and alternate sides along edges (BFS).\n${Array.from({ length: n }, (_, i) => i + 1).join(' ')}\n${es.join('\n')}`
    }
    case 'matching': {
      const es: string[] = []
      for (let i = 1; i <= 5; i++) for (let j = 1; j <= 5; j++) if (r() < 0.38) es.push(`a${i} -- b${j}`)
      return `task: select-edges\nprompt: Select a maximum matching.\ncheck: is-max-matching\nhint: Look for augmenting paths that alternate between unmatched and matched edges.\nlayout: bipartite left="a1 a2 a3 a4 a5"\na1 a2 a3 a4 a5 b1 b2 b3 b4 b5\n${es.join('\n')}`
    }
    case 'flow': {
      const caps = () => 1 + Math.floor(r() * 9)
      const body = `type: directed\ns [class=source]; t [class=sink]\ns -> a [c=${caps()}]; s -> b [c=${caps()}]; a -> b [c=${caps()}]; a -> c [c=${caps()}]; b -> d [c=${caps()}]; d -> c [c=${caps()}]; c -> t [c=${caps()}]; d -> t [c=${caps()}]; b -> c [c=${caps()}]`
      const g = parseGraph(body).panels[0].graph
      return `task: answer\nprompt: What is the value of a maximum flow from $s$ to $t$?\nanswer: ${maxFlowValue(g, 's', 't').value}\nhint: Find a flow and a cut of the same value.\nlayout: layered\n${body}`
    }
  }
})
const doc = computed(() => parseGraph(source.value))
</script>

<template>
  <div class="ga-drills">
    <div class="ga-drills-bar" role="group" aria-label="Drill type">
      <button v-for="k in KINDS" :key="k.id" type="button" class="ga-btn" :class="{ active: kind === k.id }" :aria-pressed="kind === k.id" @click="kind = k.id">{{ k.label }}</button>
    </div>
    <ExerciseWidget :key="`${kind}-${seed}`" :doc="doc" :height="320" :fig-id="''" />
    <div class="ga-drills-next">
      <button type="button" class="ga-btn ga-btn-primary" @click="seed = 1 + Math.floor(Math.random() * 100000)">New graph</button>
    </div>
  </div>
</template>
