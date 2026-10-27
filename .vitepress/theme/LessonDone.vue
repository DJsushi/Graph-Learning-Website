<script setup lang="ts">
// "Mark as done" toggle for the current lesson; also records the visit for "Continue where you left off".
import { computed, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import { loadProgress, markVisited, progress, toggleDone } from '@gv/progress'

const props = defineProps<{ record?: boolean; footer?: boolean }>()
const { page, frontmatter } = useData()
const path = computed(() => page.value.relativePath.replace(/\.md$/, ''))
const done = computed(() => !!progress.done[path.value])
onMounted(() => {
  loadProgress()
  if (props.record) watch(path, p => frontmatter.value.course && markVisited(p), { immediate: true })
})
</script>

<template>
  <div v-if="frontmatter.course && frontmatter.lecture" :class="{ 'ga-done-footer': footer }">
  <button type="button" class="ga-btn ga-done-btn" :class="{ active: done }" :aria-pressed="done" @click="toggleDone(path)">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="done ? 'M5 12.5l4.5 4.5L19 7.5' : 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z'" /></svg>
    {{ done ? 'Done' : 'Mark as done' }}
  </button>
  </div>
</template>
