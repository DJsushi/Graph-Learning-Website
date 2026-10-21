<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { renderRich } from './rich'

const props = defineProps<{ text: string; tag?: string }>()
const html = computed(() => {
  // links in rich text are absolute site paths; withBase('/') gives the deployment base
  return renderRich(props.text, withBase('/'))
})
</script>

<template>
  <component :is="tag ?? 'span'" class="ga-rich" v-html="html" />
</template>
