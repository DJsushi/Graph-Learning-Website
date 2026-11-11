<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import LessonDone from './LessonDone.vue'
import { data } from '../data/site.data'

const { frontmatter } = useData()
const router = useRouter()
const course = computed(() => frontmatter.value.course as string | undefined)
const label = computed(() => (course.value === 'theory' ? 'Graph Theory' : course.value === 'algorithms' ? 'Graph Algorithms' : ''))
const isConcept = computed(() => !!course.value && !!frontmatter.value.chapter)
const isLecture = computed(() => !!course.value && !!frontmatter.value.lecture)
const chapter = computed(() => data.topics.find(t => t.slug === frontmatter.value.chapter)?.title ?? frontmatter.value.chapter)
const lectureTags = computed(() => (frontmatter.value.lectures ?? [])
  .map((s: string) => data.lessons.find(l => l.slug === s)).filter(Boolean)
  .map((l: any) => ({ href: withBase(`/${l.path}`), text: `Lecture ${l.lecture}`, title: l.title })))
// concept pages that come from this lecture, in chapter order
const conceptPages = computed(() => {
  if (!isLecture.value) return []
  const chapterRank = (c: string) => data.topics.findIndex(t => t.slug === c)
  return data.pages.filter(p => p.lectures.includes(frontmatter.value.slug))
    .sort((a, b) => chapterRank(a.chapter) - chapterRank(b.chapter) || a.order - b.order)
})
const sources = computed(() => (isLecture.value && Array.isArray(frontmatter.value.sources) ? frontmatter.value.sources : []).map((s: string) => s.split('/').pop()))

// An entry that moved to a concept page: a lecture-page link with its #hash goes to the new page.
onMounted(async () => {
  await nextTick()
  const id = decodeURIComponent(location.hash.slice(1))
  if (isLecture.value && id && !document.getElementById(id) && data.moved[id]) router.go(`${withBase(`/${data.moved[id]}`)}#${id}`)
})
</script>

<template>
  <header v-if="isConcept || isLecture" class="ga-lesson-header">
    <div class="ga-lesson-top">
      <p class="ga-lesson-eyebrow">{{ isConcept ? `${label} · ${chapter}` : `${label} · Lecture ${frontmatter.lecture}` }}</p>
      <LessonDone record />
    </div>
    <h1 class="ga-lesson-title">{{ frontmatter.title }}</h1>
    <p v-if="isConcept && lectureTags.length" class="ga-lesson-tags">
      <a v-for="t in lectureTags" :key="t.href" class="ga-lesson-tag" :href="t.href" :title="t.title">{{ t.text }}</a>
    </p>
    <p v-if="isConcept && frontmatter.goal" class="ga-lesson-summary">{{ frontmatter.goal }}</p>
    <p v-else-if="frontmatter.summary" class="ga-lesson-summary">{{ frontmatter.summary }}</p>
    <p v-if="sources.length" class="ga-lesson-credit">Sources: {{ sources.join(', ') }}</p>
    <nav v-if="conceptPages.length" class="ga-lesson-pages" aria-label="Concept pages from this lecture">
      <p class="ga-lesson-eyebrow">Concept pages from this lecture</p>
      <ul>
        <li v-for="p in conceptPages" :key="p.path"><a :href="withBase(`/${p.path}`)">{{ p.title }}</a></li>
      </ul>
    </nav>
    <p class="ga-lesson-credit">Based on the lectures <em>{{ course === 'theory' ? 'Graph Theory' : 'MA015 Graph Algorithms' }}</em> by {{ course === 'theory' ? 'P. Hliněný' : 'Jan Obdržálek' }}, Faculty of Informatics, Masaryk University. Unofficial student resource.</p>
  </header>
</template>
