<script setup lang="ts">
// One step of a walkthrough with a figure (Walkthrough.vue): a list item that is marked while its figure step shows.
import { computed, inject, onMounted, ref } from 'vue'
import { WALKTHROUGH } from './walkthrough'

const props = defineProps<{ index: number }>()
const wt = inject(WALKTHROUGH, null)
const el = ref<HTMLElement>()
const active = computed(() => (wt?.step.value ?? 0) === props.index)
onMounted(() => { if (el.value) wt?.register(props.index, el.value) })
const select = () => wt?.select(props.index)
</script>

<template>
  <li ref="el" class="ga-wt-step" :class="{ 'ga-wt-active': active }" :aria-current="active ? 'step' : undefined" tabindex="0"
    @click="select" @focus="select"><slot /></li>
</template>
