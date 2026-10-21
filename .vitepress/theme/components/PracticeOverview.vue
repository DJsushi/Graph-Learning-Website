<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../data/site.data'
import { exportProgress, importProgress, loadProgress, progress, resetProgress } from '@gv/progress'

onMounted(loadProgress)
const solved = (ids: string[]) => ids.filter(id => progress.solved[id]).length
const total = computed(() => data.totals.exercises)
const totalSolved = computed(() => data.lessons.reduce((z, l) => z + solved(l.exercises), 0))
const msg = ref('')

function download() {
  const blob = new Blob([exportProgress()], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'graph-atlas-progress.json'
  a.click()
  URL.revokeObjectURL(a.href)
}
function upload(ev: Event) {
  const f = (ev.target as HTMLInputElement).files?.[0]
  if (!f) return
  f.text().then(t => { try { importProgress(t); msg.value = 'Progress imported.' } catch { msg.value = 'That file is not a Graph Atlas progress file.' } })
}
const confirmReset = ref(false)
</script>

<template>
  <div class="ga-practice">
    <p class="ga-practice-total"><strong>{{ totalSolved }}</strong> of {{ total }} exercises and quick checks solved.</p>
    <div class="ga-practice-grid">
      <a v-for="l in data.lessons" :key="l.slug" class="ga-practice-card" :href="withBase(`/practice/${l.slug}`)">
        <span class="ga-practice-course">{{ l.course === 'theory' ? 'Theory' : 'Algorithms' }} {{ l.lecture }}</span>
        <span class="ga-practice-title">{{ l.title }}</span>
        <span class="ga-meter" role="progressbar" :aria-valuenow="solved(l.exercises)" :aria-valuemin="0" :aria-valuemax="l.exercises.length" :aria-label="`${l.title}: ${solved(l.exercises)} of ${l.exercises.length} solved`">
          <span class="ga-meter-fill" :style="{ width: `${l.exercises.length ? (100 * solved(l.exercises)) / l.exercises.length : 0}%` }" />
        </span>
        <span class="ga-practice-count">{{ solved(l.exercises) }} / {{ l.exercises.length }}</span>
      </a>
    </div>
    <div class="ga-practice-tools">
      <button type="button" class="ga-btn" @click="download">Export progress</button>
      <label class="ga-btn">Import progress<input type="file" accept="application/json" class="ga-sr-only" @change="upload" /></label>
      <button v-if="!confirmReset" type="button" class="ga-btn ga-btn-quiet" @click="confirmReset = true">Reset progress…</button>
      <template v-else>
        <span>Delete all saved progress?</span>
        <button type="button" class="ga-btn" @click="resetProgress(); confirmReset = false">Delete</button>
        <button type="button" class="ga-btn ga-btn-quiet" @click="confirmReset = false">Cancel</button>
      </template>
      <span role="status">{{ msg }}</span>
    </div>
  </div>
</template>
