<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const course = computed(() => frontmatter.value.course as string | undefined)
const label = computed(() => (course.value === 'theory' ? 'Graph Theory' : course.value === 'algorithms' ? 'Graph Algorithms' : ''))
</script>

<template>
  <header v-if="course && frontmatter.lecture" class="ga-lesson-header">
    <p class="ga-lesson-eyebrow">{{ label }} · Lesson {{ frontmatter.lecture }}</p>
    <h1 class="ga-lesson-title">{{ frontmatter.title }}</h1>
    <p v-if="frontmatter.summary" class="ga-lesson-summary">{{ frontmatter.summary }}</p>
  </header>
</template>
