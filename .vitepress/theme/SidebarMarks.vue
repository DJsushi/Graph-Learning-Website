<script setup lang="ts">
// Scrolls the active item into view and ticks finished lessons in the VitePress sidebar (data-done on the matching links; CSS draws the mark).
import { nextTick, onMounted, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { loadProgress, progress } from '@gv/progress'

const route = useRoute()
function mark() {
  const done = new Set(Object.keys(progress.done).map(p => withBase(`/${p}`)))
  for (const a of document.querySelectorAll<HTMLAnchorElement>('.VPSidebar a[href]')) {
    const href = a.getAttribute('href')!.replace(/\.html$/, '').replace(/#.*$/, '')
    a.toggleAttribute('data-done', done.has(href))
  }
  document.querySelector('.VPSidebar .VPSidebarItem.is-active > .item')?.scrollIntoView({ block: 'nearest' })   // VitePress leaves a long sidebar at the top
}
onMounted(() => {
  loadProgress()
  watch([() => route.path, () => Object.keys(progress.done).join()], () => nextTick(mark), { immediate: true })
})
</script>

<template><span hidden /></template>
