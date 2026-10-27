<script setup lang="ts">
// Search over the reference entries (label, title, aka/defines, statement text) with kind and course chips.
// The entries come from the same build-time chunk as the [[ref]] previews, loaded on mount.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, withBase } from 'vitepress'
import type { RefPreview } from '../../data/refs.data'
import { scoreEntry, tokens } from '../../../packages/content/search'

const KINDS = [['definitions', 'Definitions'], ['theorems', 'Results'], ['algorithms', 'Algorithms']] as const
const COURSES = [['theory', 'Graph Theory'], ['algorithms', 'Graph Algorithms']] as const
const LIMIT = 20

const router = useRouter()
const q = ref('')
const kinds = ref(new Set<string>())
const courses = ref(new Set<string>())
const entries = ref<(RefPreview & { key: string })[]>([])
const active = ref(0)
const box = ref<HTMLInputElement>()
const list = ref<HTMLElement>()

const results = computed(() => {
  const toks = tokens(q.value)
  if (!toks.length) return []
  return entries.value
    .filter(p => (!kinds.value.size || kinds.value.has(p.entry!.kind)) && (!courses.value.size || courses.value.has(p.entry!.course)))
    .map(p => ({ p, s: scoreEntry(p.entry!, toks) }))
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, LIMIT)
    .map(r => r.p)
})
watch(results, () => { active.value = 0 })

function toggle(set: Set<string>, v: string) { if (!set.delete(v)) set.add(v) }
const go = (p: RefPreview) => router.go(withBase(p.entry!.link))

async function move(d: number) {
  const n = results.value.length
  if (!n) return
  active.value = (active.value + d + n) % n
  await nextTick()
  list.value?.children[active.value]?.scrollIntoView({ block: 'nearest' })
}
function onKey(ev: KeyboardEvent) {
  if (ev.key === 'ArrowDown') { ev.preventDefault(); move(1) }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); move(-1) }
  else if (ev.key === 'Enter' && results.value[active.value]) { ev.preventDefault(); go(results.value[active.value]) }
}
function onClick(ev: MouseEvent, p: RefPreview) {
  // links inside the statement keep working
  if (!(ev.target as Element).closest('a')) go(p)
}
function onSlash(ev: KeyboardEvent) {
  if (ev.key !== '/' || ev.ctrlKey || ev.metaKey || ev.altKey) return
  const t = ev.target as HTMLElement
  if (t.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return
  ev.preventDefault()
  ev.stopPropagation()   // VitePress local search also opens on '/' (window listener); here '/' means this box
  box.value?.focus()
}

onMounted(async () => {
  document.addEventListener('keydown', onSlash)
  const data = (await import('../../data/refs.data')).data
  entries.value = Object.entries(data).filter(([, p]) => p.entry).map(([key, p]) => ({ ...p, key }))
})
onBeforeUnmount(() => document.removeEventListener('keydown', onSlash))
</script>

<template>
  <div class="ga-refsearch">
    <div class="ga-field">
      <input ref="box" v-model="q" type="search" placeholder="Search by name, number (T5.2) or term — press /"
        aria-label="Search the reference" role="combobox" aria-autocomplete="list" aria-controls="ga-refsearch-results"
        :aria-expanded="results.length > 0" :aria-activedescendant="results.length ? `ga-rs-${results[active].key}` : undefined"
        @keydown="onKey">
    </div>
    <div class="ga-chips" role="group" aria-label="Kind">
      <button v-for="[k, name] in KINDS" :key="k" type="button" class="ga-chip" :class="{ active: kinds.has(k) }" :aria-pressed="kinds.has(k)" @click="toggle(kinds, k)">{{ name }}</button>
      <span class="ga-refsearch-sep" aria-hidden="true" />
      <button v-for="[c, name] in COURSES" :key="c" type="button" class="ga-chip" :class="{ active: courses.has(c) }" :aria-pressed="courses.has(c)" @click="toggle(courses, c)">{{ name }}</button>
    </div>
    <p v-if="q.trim() && !results.length" class="ga-refsearch-none">No entries match.</p>
    <ul v-show="results.length" id="ga-refsearch-results" ref="list" class="ga-refsearch-results" role="listbox" aria-label="Results">
      <li v-for="(p, i) in results" :id="`ga-rs-${p.key}`" :key="p.key" role="option" :aria-selected="i === active"
        :class="{ active: i === active }" @click="onClick($event, p)" @pointermove="active = i">
        <div class="ga-ref-preview-head">
          <a :href="withBase(p.entry!.link)" v-html="p.head" />
          <span class="ga-ref-preview-where">{{ p.entry!.topic }} · {{ p.entry!.course === 'theory' ? 'T' : 'A' }}</span>
        </div>
        <div class="ga-refsearch-body vp-doc" v-html="p.html" />
      </li>
    </ul>
  </div>
</template>
