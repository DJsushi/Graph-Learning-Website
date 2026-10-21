<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../data/site.data'
import { loadProgress, progress } from '@gv/progress'

const props = defineProps<{ course: 'theory' | 'algorithms' }>()
const lessons = computed(() => data.lessons.filter(l => l.course === props.course))
onMounted(loadProgress)
const done = (ids: string[]) => ids.filter(id => progress.solved[id]).length
</script>

<template>
  <ol class="ga-lesson-list">
    <li v-for="l in lessons" :key="l.path" class="ga-lesson-card">
      <a :href="withBase(`/${l.path}`)" class="ga-lesson-link">
        <span class="ga-lesson-num">{{ l.lecture }}</span>
        <span class="ga-lesson-text">
          <span class="ga-lesson-name">{{ l.title }}</span>
          <span class="ga-lesson-sum">{{ l.summary }}</span>
          <span class="ga-lesson-meta">
            {{ l.counts.definitions }} definitions · {{ l.counts.statements }} results<template v-if="l.counts.algorithms"> · {{ l.counts.algorithms }} algorithms</template>
            · {{ l.counts.figures }} figures
            <template v-if="l.exercises.length"> · <span class="ga-progress-count">{{ done(l.exercises) }}/{{ l.exercises.length }} exercises solved</span></template>
          </span>
        </span>
      </a>
    </li>
  </ol>
</template>
