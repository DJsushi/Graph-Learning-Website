<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import LessonDone from './LessonDone.vue'

const { frontmatter } = useData()
const course = computed(() => frontmatter.value.course as string | undefined)
const label = computed(() => (course.value === 'theory' ? 'Graph Theory' : course.value === 'algorithms' ? 'Graph Algorithms' : ''))
</script>

<template>
  <header v-if="course && frontmatter.lecture" class="ga-lesson-header">
    <div class="ga-lesson-top">
      <p class="ga-lesson-eyebrow">{{ label }} · Lesson {{ frontmatter.lecture }}</p>
      <LessonDone record />
    </div>
    <h1 class="ga-lesson-title">{{ frontmatter.title }}</h1>
    <p v-if="frontmatter.summary" class="ga-lesson-summary">{{ frontmatter.summary }}</p>
    <p class="ga-lesson-credit">Based on the lectures <em>{{ course === 'theory' ? 'Graph Theory' : 'MA015 Graph Algorithms' }}</em> by {{ course === 'theory' ? 'P. Hliněný' : 'Jan Obdržálek' }}, Faculty of Informatics, Masaryk University. Unofficial student resource.</p>
  </header>
</template>
