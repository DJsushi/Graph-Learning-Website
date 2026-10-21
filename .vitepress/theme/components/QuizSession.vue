<script setup lang="ts">
// Shows a random subset of the quizzes in its slot.
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ size?: number }>(), { size: 10 })
const root = ref<HTMLElement>()
const shown = ref(0)

function shuffle() {
  const qs = [...(root.value?.querySelectorAll<HTMLElement>('.ga-quiz') ?? [])]
  const order = qs.map((q, i) => ({ q, k: Math.random(), i })).sort((a, b) => a.k - b.k)
  order.forEach(({ q }, i) => { q.style.display = i < props.size ? '' : 'none'; q.style.order = String(i) })
  shown.value = Math.min(props.size, qs.length)
  root.value?.scrollIntoView({ block: 'start' })
}
onMounted(shuffle)
</script>

<template>
  <div ref="root" class="ga-quiz-session">
    <div class="ga-quiz-session-list"><slot /></div>
    <button type="button" class="ga-btn ga-btn-primary" @click="shuffle">New set of {{ size }} questions</button>
  </div>
</template>
