<script setup lang="ts">
import { computed, inject, type ComputedRef, type Ref } from 'vue'
import { withBase } from 'vitepress'
import RichText from '@gv/RichText.vue'
import { progress } from '@gv/progress'

const props = defineProps<{ id: string; course: string; label: string; title?: string; href: string; extra?: boolean | string }>()
const deck = inject<{ register: (c: { id: string; course: string; extra: boolean }) => void; currentId: ComputedRef<string | undefined>; revealed: Ref<boolean> }>('deck')!
const isExtra = props.extra === '' || props.extra === true || props.extra === 'true'
deck.register({ id: props.id, course: props.course, extra: isExtra })
const active = computed(() => deck.currentId.value === props.id)
const box = computed(() => progress.cards[props.id]?.box ?? 0)
</script>

<template>
  <article v-show="active" class="ga-card" :aria-hidden="!active">
    <header class="ga-card-front">
      <span class="ga-card-label">{{ label }}</span>
      <span v-if="title" class="ga-card-title"><RichText :text="title" /></span>
      <span class="ga-card-box" :title="`Leitner box ${box} of 4`">{{ '●'.repeat(box) }}{{ '○'.repeat(4 - box) }}</span>
    </header>
    <div v-show="deck.revealed.value" class="ga-card-back">
      <slot />
      <a class="ga-card-link" :href="withBase(href)">Open in the lesson</a>
    </div>
    <p v-show="!deck.revealed.value" class="ga-card-hint">Try to state it from memory first.</p>
  </article>
</template>
