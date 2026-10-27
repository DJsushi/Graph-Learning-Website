<script setup lang="ts">
// Modal for an enlarged figure. Everything inside may zoom (wheel, pinch, buttons) and pan.
import { onMounted, provide, ref } from 'vue'
import RichText from './RichText.vue'

defineProps<{ caption?: string }>()
const emit = defineEmits<{ close: [] }>()
provide('ga-zoomable', true)
const dlg = ref<HTMLDialogElement>()
onMounted(() => dlg.value?.showModal())
</script>

<template>
  <dialog ref="dlg" class="ga-dialog ga-zoom-dialog"  aria-label="Enlarged figure" @close="emit('close')" @click.self="dlg?.close()">
    <div class="ga-dialog-body">
      <div class="ga-dialog-head">
        <h2>Figure</h2>
        <button type="button" class="ga-btn ga-icon-btn" aria-label="Close" @click="dlg?.close()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <p class="ga-muted ga-zoom-help">Scroll or pinch to zoom, drag the background to pan.</p>
      <slot />
      <p v-if="caption" class="ga-caption"><RichText :text="caption" /></p>
    </div>
  </dialog>
</template>
