<script setup lang="ts">
// Site-wide reader settings. Today: animation speed, with a live preview that plays the same transition figures use.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { parseGraph } from '@core/dsl/parser'
import GraphView from '@gv/GraphView.vue'
import { useTweened } from '@gv/useTweened'
import { SPEEDS, loadSettings, saveSettings, settings, tweenMs } from '@gv/settings'

const PRESETS = [['Slow', 0.5], ['Normal', 1], ['Fast', 1.5]] as const

const doc = parseGraph(`layout: fixed
u @(0, 0); v @(1.2, 0); x @(0.6, 1.1); y @(-0.9, 0.7); z @(2.1, 0.7)
u -- v [id=uv class=highlight]; u -- x [id=ux]; v -- x [id=vx]; u -- y; v -- z
step: contracted
merge u v -> w [label="$w$" class=color1]
`)
const before = doc.panels[0].graph
const after = doc.panels[0].steps[0]

const merged = ref(false)
// the preview is built on the client only: it reads the stored speed
const { graph, fade, goo, ghost } = useTweened(() => merged.value
  ? { graph: after.graph, merges: after.merges }
  : { graph: before, merges: after.merges, reverse: true })

const ms = ref(900)
const seconds = computed(() => (ms.value / 1000).toFixed(1))
const label = computed(() => (settings.animations ? `${settings.animSpeed.toFixed(2).replace(/0$/, '')}×` : 'off'))

let timer: ReturnType<typeof setTimeout> | undefined
function loop() {
  ms.value = tweenMs() || 900
  merged.value = !merged.value
  timer = setTimeout(loop, (tweenMs() || 0) + 1100)
}
// the bar sweeps once per transition, so duration is visible as well as felt
const runKey = ref(0)
watch(merged, () => { runKey.value++ })
watch(() => [settings.animations, settings.animSpeed], () => { ms.value = tweenMs() || 900; saveSettings() })

onMounted(() => { loadSettings(); ms.value = tweenMs() || 900; timer = setTimeout(loop, 600) })
onBeforeUnmount(() => clearTimeout(timer))
const replay = () => {
  clearTimeout(timer)
  if (!merged.value) return loop()
  merged.value = false // split first; the loop picks up after it settles
  timer = setTimeout(loop, tweenMs() + 900)
}
</script>

<template>
  <section class="ga-settings">
    <h2 id="animation">Animation</h2>
    <p class="ga-settings-lead">How fast figures move between steps: contractions, splits, and the algorithm players. Stored in this browser.</p>

    <label class="ga-settings-row ga-settings-toggle">
      <input v-model="settings.animations" type="checkbox" />
      <span>Animate figures</span>
    </label>

    <div class="ga-settings-row" :class="{ 'ga-off': !settings.animations }">
      <div class="ga-settings-head">
        <label for="ga-speed">Speed</label>
        <output class="ga-settings-value" for="ga-speed">{{ label }}<span v-if="settings.animations"> · {{ seconds }} s per step</span></output>
      </div>
      <input id="ga-speed" v-model.number="settings.animSpeed" class="ga-slider" type="range" :min="SPEEDS.min" :max="SPEEDS.max" :step="SPEEDS.step" :disabled="!settings.animations" />
      <div class="ga-settings-scale" aria-hidden="true"><span>slower</span><span>faster</span></div>
      <div class="ga-seg ga-settings-presets" role="group" aria-label="Speed presets">
        <button v-for="[name, v] in PRESETS" :key="name" type="button" class="ga-btn" :class="{ active: settings.animSpeed === v }" :disabled="!settings.animations" @click="settings.animSpeed = v">{{ name }}</button>
      </div>
    </div>

    <div class="ga-settings-preview">
      <div class="ga-settings-figure">
        <GraphView :graph="graph" :fade="fade" :goo="goo" :ghost="ghost" animate :max-height="170" aria-label="Preview: two vertices merge into one" />
      </div>
      <div class="ga-settings-bar" aria-hidden="true">
        <div :key="runKey" class="ga-settings-sweep" :style="{ animationDuration: `${settings.animations ? ms : 0}ms` }" />
      </div>
      <div class="ga-settings-foot">
        <span>Preview: contracting an edge, then undoing it.</span>
        <button type="button" class="ga-btn" @click="replay">Replay</button>
      </div>
    </div>

    <p class="ga-settings-note">If your system asks for reduced motion, figures never animate, whatever is set here.</p>
  </section>
</template>
