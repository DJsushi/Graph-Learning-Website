<script setup lang="ts">
import { useData } from 'vitepress'
const { frontmatter } = useData()
</script>

<template>
  <p v-if="!frontmatter.course" class="ga-lesson-credit ga-site-credit">
    Graph Atlas is an unofficial student resource based on the lectures <em>Graph Theory</em> (P. Hliněný) and
    <em>MA015 Graph Algorithms</em> (Jan Obdržálek), Faculty of Informatics, Masaryk University.
  </p>
</template>
