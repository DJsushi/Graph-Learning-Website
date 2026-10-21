<script setup lang="ts">
import { computed, onMounted, provide, reactive, ref } from 'vue'
import { loadProgress, progress, rateCard } from '@gv/progress'

interface Card { id: string; course: string; extra: boolean; order: number }
const cards = reactive<Card[]>([])
const course = ref<'all' | 'theory' | 'algorithms'>('all')
const includeExtra = ref(true)
const revealed = ref(false)
const pos = ref(0)
const mounted = ref(false)

const box = (id: string) => (mounted.value ? progress.cards[id]?.box ?? 0 : 0)
const queue = computed(() => cards
  .filter(c => (course.value === 'all' || c.course === course.value) && (includeExtra.value || !c.extra))
  .sort((a, b) => box(a.id) - box(b.id) || a.order - b.order))
const current = computed(() => queue.value[Math.min(pos.value, queue.value.length - 1)])
const known = computed(() => queue.value.filter(c => box(c.id) >= 3).length)

provide('deck', {
  register(c: Omit<Card, 'order'>) { if (!cards.some(x => x.id === c.id)) cards.push({ ...c, order: cards.length }) },
  currentId: computed(() => current.value?.id),
  revealed,
})

onMounted(() => { loadProgress(); mounted.value = true })

function rate(ok: boolean) {
  if (!current.value) return
  const id = current.value.id
  rateCard(id, ok)
  revealed.value = false
  // the queue re-sorts by box; move on to the first card that is not the one just rated
  pos.value = queue.value[0]?.id === id && queue.value.length > 1 ? 1 : 0
}
function skip() { revealed.value = false; pos.value = (pos.value + 1) % Math.max(1, queue.value.length) }
function onKey(ev: KeyboardEvent) {
  if (ev.target instanceof HTMLSelectElement || ev.target instanceof HTMLInputElement) return
  if (ev.key === ' ' && !revealed.value) { ev.preventDefault(); revealed.value = true }
  else if (revealed.value && (ev.key === 'k' || ev.key === 'ArrowRight')) rate(true)
  else if (revealed.value && (ev.key === 'a' || ev.key === 'ArrowLeft')) rate(false)
}
</script>

<template>
  <div class="ga-deck" tabindex="0" @keydown="onKey">
    <div class="ga-deck-bar">
      <label>Course
        <select v-model="course" @change="pos = 0; revealed = false">
          <option value="all">Both courses</option>
          <option value="theory">Graph Theory</option>
          <option value="algorithms">Graph Algorithms</option>
        </select>
      </label>
      <label class="ga-check"><input v-model="includeExtra" type="checkbox" @change="pos = 0" /> Include material beyond the lectures</label>
      <span class="ga-deck-stats" aria-live="polite">{{ known }} of {{ queue.length }} known</span>
    </div>
    <div class="ga-deck-cards"><slot /></div>
    <div class="ga-deck-actions">
      <button v-if="!revealed" type="button" class="ga-btn ga-btn-primary" @click="revealed = true">Show statement <kbd>Space</kbd></button>
      <template v-else>
        <button type="button" class="ga-btn" @click="rate(false)">Again <kbd>A</kbd></button>
        <button type="button" class="ga-btn ga-btn-primary" @click="rate(true)">I knew it <kbd>K</kbd></button>
      </template>
      <button type="button" class="ga-btn ga-btn-quiet" @click="skip">Skip</button>
    </div>
  </div>
</template>
