<script setup lang="ts">
// Site-wide reader settings: animation speed and easing curve, with a live preview that plays the same transitions figures use.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { parseGraph } from '@core/dsl/parser'
import GraphView from '@gv/GraphView.vue'
import { useTweened } from '@gv/useTweened'
import { SPEEDS, clampBezier, loadSettings, saveSettings, settings, tweenMs, type Bezier } from '@gv/settings'
import { EASING_PRESETS } from '@gv/easing'

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
watch(() => [settings.animations, settings.animSpeed, ...settings.easing], () => { ms.value = tweenMs() || 900; saveSettings() })

// ---- easing curve editor: unit square in x, y shown from -0.5 to 1.5 so overshoot is visible
const W = 220, H = 220, PAD = 14, YMIN = -0.5, YMAX = 1.5
const px = (x: number) => PAD + x * (W - 2 * PAD)
const py = (y: number) => PAD + (1 - (y - YMIN) / (YMAX - YMIN)) * (H - 2 * PAD)
const unx = (x: number) => (x - PAD) / (W - 2 * PAD)
const uny = (y: number) => YMIN + (1 - (y - PAD) / (H - 2 * PAD)) * (YMAX - YMIN)
const curve = computed(() => { const [a, b, c, d] = settings.easing; return `M${px(0)},${py(0)} C${px(a)},${py(b)} ${px(c)},${py(d)} ${px(1)},${py(1)}` })
const css = computed(() => `cubic-bezier(${settings.easing.map(n => +n.toFixed(2)).join(', ')})`)
const activePreset = computed(() => EASING_PRESETS.find(p => p.bezier.every((n, i) => Math.abs(n - settings.easing[i]) < 0.005))?.id ?? 'custom')
const svgEl = ref<SVGSVGElement>()
const dragging = ref<0 | 1 | null>(null)
function setHandle(i: 0 | 1, x: number, y: number) {
  const e = [...settings.easing] as Bezier
  e[2 * i] = x
  e[2 * i + 1] = y
  settings.easing = clampBezier(e)
}
function onMove(ev: PointerEvent) {
  if (dragging.value === null || !svgEl.value) return
  const r = svgEl.value.getBoundingClientRect()
  setHandle(dragging.value, unx(((ev.clientX - r.left) / r.width) * W), uny(((ev.clientY - r.top) / r.height) * H))
}
function onKey(i: 0 | 1, ev: KeyboardEvent) {
  const d = ev.shiftKey ? 0.1 : 0.02
  const dx = ev.key === 'ArrowRight' ? d : ev.key === 'ArrowLeft' ? -d : 0
  const dy = ev.key === 'ArrowUp' ? d : ev.key === 'ArrowDown' ? -d : 0
  if (!dx && !dy) return
  ev.preventDefault()
  setHandle(i, settings.easing[2 * i] + dx, settings.easing[2 * i + 1] + dy)
}
const pickPreset = (b: Bezier) => { settings.easing = [...b] }

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

    <h2 id="easing">Easing</h2>
    <p class="ga-settings-lead">The speed profile of every transition, as a cubic Bézier curve: time runs left to right, progress bottom to top. A curve that leaves the box overshoots, which gives a springy feel.</p>
    <div class="ga-settings-easing" :class="{ 'ga-off': !settings.animations }">
      <svg ref="svgEl" class="ga-curve" :viewBox="`0 0 ${W} ${H}`" role="group" aria-label="Easing curve editor" @pointermove="onMove" @pointerup="dragging = null" @pointercancel="dragging = null">
        <rect :x="px(0)" :y="py(1)" :width="px(1) - px(0)" :height="py(0) - py(1)" class="ga-curve-box" />
        <line :x1="px(0)" :y1="py(0)" :x2="px(1)" :y2="py(1)" class="ga-curve-diag" />
        <line :x1="px(0)" :y1="py(0)" :x2="px(settings.easing[0])" :y2="py(settings.easing[1])" class="ga-curve-arm" />
        <line :x1="px(1)" :y1="py(1)" :x2="px(settings.easing[2])" :y2="py(settings.easing[3])" class="ga-curve-arm" />
        <path :d="curve" class="ga-curve-line" />
        <circle v-for="i in [0, 1] as const" :key="i" :cx="px(settings.easing[2 * i])" :cy="py(settings.easing[2 * i + 1])" r="7" class="ga-curve-handle" tabindex="0" role="slider"
          :aria-label="`Control point ${i + 1}`" :aria-valuetext="`x ${settings.easing[2 * i].toFixed(2)}, y ${settings.easing[2 * i + 1].toFixed(2)}`"
          @pointerdown.prevent="dragging = i; ($event.target as Element).setPointerCapture($event.pointerId)" @keydown="onKey(i, $event)" />
      </svg>
      <div class="ga-settings-easing-side">
        <div class="ga-seg ga-settings-presets" role="group" aria-label="Easing presets">
          <button v-for="p in EASING_PRESETS" :key="p.id" type="button" class="ga-btn" :class="{ active: activePreset === p.id }" :disabled="!settings.animations" @click="pickPreset(p.bezier)">{{ p.name }}</button>
        </div>
        <code class="ga-settings-css">{{ css }}</code>
        <button type="button" class="ga-btn" :disabled="!settings.animations" @click="pickPreset(EASING_PRESETS[0].bezier)">Reset</button>
      </div>
    </div>

    <div class="ga-settings-preview">
      <div class="ga-settings-figure">
        <GraphView :graph="graph" :fade="fade" :goo="goo" :ghost="ghost" animate :max-height="170" aria-label="Preview: two vertices merge into one" />
      </div>
      <div class="ga-settings-bar" aria-hidden="true">
        <div :key="runKey" class="ga-settings-sweep" :style="{ animationDuration: `${settings.animations ? ms : 0}ms`, animationTimingFunction: css }" />
      </div>
      <div class="ga-settings-foot">
        <span>Preview: contracting an edge (the two edges to x fan out), then undoing it.</span>
        <button type="button" class="ga-btn" @click="replay">Replay</button>
      </div>
    </div>

    <p class="ga-settings-note">If your system asks for reduced motion, figures never animate, whatever is set here.</p>
  </section>
</template>
