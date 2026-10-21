<script setup lang="ts">
// The single SVG graph renderer. Pure view + pointer/keyboard event translation; editing logic lives in the widgets.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import katex from 'katex'
import type { GraphData, Id, Vertex, Edge } from '@core/model'
import type { Overlay } from '@core/algorithms/types'
import { routeEdges, toScreen, blobPath, centroid, UNIT, R, type Pt } from './geometry'
import { labelToSpans, spansWidth, type TSpan } from './texsvg'
import { KATEX_MACROS } from './katexMacros'

const props = withDefaults(defineProps<{
  graph: GraphData
  overlay?: Overlay
  selection?: { vertices: string[]; edges: string[] }
  selectable?: 'none' | 'vertices' | 'edges' | 'both'
  editable?: boolean
  preview?: { from: Id; to: Pt } | null
  maxHeight?: number
  fill?: boolean
  zoomable?: boolean
  backgroundPan?: boolean
  ariaLabel?: string
  midArrows?: boolean
}>(), { selectable: 'none', maxHeight: 320 })

const emit = defineEmits<{
  toggle: [kind: 'vertex' | 'edge', id: Id]
  'vertex-down': [id: Id, p: Pt, ev: PointerEvent]
  'edge-down': [id: Id, ev: PointerEvent]
  'background-down': [p: Pt, ev: PointerEvent]
  move: [p: Pt, ev: PointerEvent]
  up: [p: Pt, vertex: Id | undefined, ev: PointerEvent]
  'background-dblclick': [p: Pt]
  'vertex-dblclick': [id: Id]
  'edge-dblclick': [id: Id]
  key: [ev: KeyboardEvent]
}>()

const svg = ref<SVGSVGElement>()
const root = ref<SVGGElement>()

const pos = computed(() => {
  const m = new Map<Id, Pt>()
  for (const v of props.graph.vertices) m.set(v.id, toScreen(v.x ?? 0, v.y ?? 0))
  return m
})

const stripQuotes = (s?: string) => s?.replace(/^"(.*)"$/, '$1')

function fillTemplate(t: string, data: Record<string, unknown>): string {
  return t.replace(/\{(\w+)\}/g, (_, k) => (data[k] === undefined ? '' : data[k] === Infinity ? '∞' : String(data[k])))
}

const vertexLabels = computed(() => {
  const t = stripQuotes(props.graph.meta['vertex-label']) ?? '{label}'
  const m = new Map<Id, string>()
  if (t === 'none') return m
  for (const v of props.graph.vertices) {
    const s = fillTemplate(t, { ...v.data, id: v.id, label: v.label ?? v.id })
    if (s) m.set(v.id, s)
  }
  return m
})

const spanCache = new Map<string, TSpan[] | null>()
function spans(label: string): TSpan[] | null {
  if (!spanCache.has(label)) spanCache.set(label, labelToSpans(label) ?? null)
  return spanCache.get(label)!
}

const labelsInside = computed(() => {
  for (const l of vertexLabels.value.values()) {
    const sp = spans(l)
    if (!sp || spansWidth(sp) > 2.3) return false
  }
  return true
})
const radius = computed(() => (labelsInside.value ? R : 6.5))

function edgeLabel(e: Edge): string | undefined {
  const ov = props.overlay?.edgeLabels[e.id]
  if (ov !== undefined) return ov
  const data = { ...e.data, ...(props.overlay?.edgeData[e.id] ?? {}) }
  const t = stripQuotes(props.graph.meta['edge-label'])
  if (t === 'none') return undefined
  if (e.label !== undefined) return e.label
  if (t) return fillTemplate(t, data)
  if (data.f !== undefined && data.c !== undefined) return `${fmtNum(data.f)}/${fmtNum(data.c)}`
  if (data.c !== undefined) return fmtNum(data.c)
  if (data.w !== undefined) return fmtNum(data.w)
  return undefined
}
const fmtNum = (x: unknown) => (x === Infinity ? '∞' : typeof x === 'number' ? String(Math.round(x * 1000) / 1000) : String(x))

const visibleEdges = computed(() => props.graph.edges.filter(e => !classesOf('edge', e).includes('hidden')))
const visibleVertices = computed(() => props.graph.vertices.filter(v => !classesOf('vertex', v).includes('hidden')))

const geoms = computed(() => {
  const g = { ...props.graph, edges: visibleEdges.value }
  return new Map(routeEdges(g, pos.value, { midArrows: props.midArrows || props.graph.meta['directed-style'] === 'mid-arrow', radius: () => radius.value }).map(x => [x.id, x]))
})

function classesOf(kind: 'vertex' | 'edge', el: Vertex | Edge): string[] {
  const ov = kind === 'vertex' ? props.overlay?.vertexClasses[el.id] : props.overlay?.edgeClasses[el.id]
  const sel = kind === 'vertex' ? props.selection?.vertices.includes(el.id) : props.selection?.edges.includes(el.id)
  return [...el.classes, ...(ov ?? []), ...(sel ? ['selected'] : [])]
}

const hyperShapes = computed(() => props.graph.edges.filter(e => e.hyper).map(e => {
  const pts = [...e.tail, ...e.head].map(v => pos.value.get(v)).filter(Boolean) as Pt[]
  return { id: e.id, d: blobPath(pts), c: centroid(pts), classes: classesOf('edge', e), label: e.label, directed: e.directed, tail: e.tail.map(v => pos.value.get(v)!), head: e.head.map(v => pos.value.get(v)!) }
}))

const groupShapes = computed(() => [...props.graph.groups, ...(props.overlay?.groups ?? [])].map(gr => {
  const pts = gr.members.map(v => pos.value.get(v)).filter(Boolean) as Pt[]
  const top = pts.reduce((a, b) => (b.y < a.y ? b : a), pts[0] ?? { x: 0, y: 0 })
  return { id: gr.id, d: blobPath(pts), label: gr.label, classes: gr.classes, labelAt: { x: top.x, y: top.y - 30 } }
}))

const faceShapes = computed(() => props.graph.faces.filter(fc => !fc.outer).map(fc => {
  const pts = fc.walk.map(v => pos.value.get(v)).filter(Boolean) as Pt[]
  return { id: fc.id, d: pts.length ? `M${pts.map(p => `${p.x},${p.y}`).join(' L')} Z` : '', c: centroid(pts), label: fc.label, classes: fc.classes }
}))
const outerFaceLabels = computed(() => props.graph.faces.filter(fc => fc.outer && fc.label).map(fc => {
  const pts = fc.walk.map(v => pos.value.get(v)).filter(Boolean) as Pt[]
  const right = pts.reduce((a, b) => (b.x > a.x ? b : a), pts[0] ?? { x: 0, y: 0 })
  return { id: fc.id, label: fc.label!, at: { x: right.x + 34, y: right.y - 18 } }
}))

// ---- viewBox ----
const bbox = computed(() => {
  // vertices, curve apexes (edge label points) and group labels all have to fit
  const pts = [...pos.value.values(), ...[...geoms.value.values()].filter(g => !g.loop).map(g => g.label)]
  for (const gr of groupShapes.value) if (gr.label) pts.push({ x: gr.labelAt.x - 40, y: gr.labelAt.y - 6 }, { x: gr.labelAt.x + 40, y: gr.labelAt.y - 6 })
  if (!pos.value.size) return { x: -100, y: -60, w: 200, h: 120 }
  let x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x))
  let y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y))
  const hasLoops = props.graph.edges.some(e => !e.hyper && e.tail[0] === e.head[0])
  const pad = (labelsInside.value ? 30 : 38) + (hasLoops ? 42 : 0) + (props.graph.groups.length || props.overlay?.groups.length ? 26 : 0)
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad
  if (props.overlay && Object.keys(props.overlay.vertexBadges).length) { y0 -= 12; x1 += 18 }
  const w = Math.max(x1 - x0, 140), h = Math.max(y1 - y0, 90)
  return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h }
})
// while editing, the box only grows (fill mode: fixed until "fit"), so the drawing does not rescale under the cursor
type Box = { x: number; y: number; w: number; h: number }
const frozen = ref<Box | null>(null)
const box = computed<Box>(() => {
  const b = bbox.value
  if (props.fill) return frozen.value ?? b
  if (!props.editable || !frozen.value) return b
  const f = frozen.value
  const x0 = Math.min(f.x, b.x), y0 = Math.min(f.y, b.y)
  return { x: x0, y: y0, w: Math.max(f.x + f.w, b.x + b.w) - x0, h: Math.max(f.y + f.h, b.y + b.h) - y0 }
})
watch(box, b => {
  // only store real growth; writing an equal copy would retrigger this watcher forever
  const f = frozen.value
  if (props.editable && !props.fill && (!f || f.x !== b.x || f.y !== b.y || f.w !== b.w || f.h !== b.h)) frozen.value = b
})
const viewBox = computed(() => `${box.value.x} ${box.value.y} ${box.value.w} ${box.value.h}`)

// ---- zoom / pan ----
const view = ref({ tx: 0, ty: 0, k: 1 })
const transform = computed(() => (props.zoomable ? `translate(${view.value.tx},${view.value.ty}) scale(${view.value.k})` : undefined))
function resetView() {
  view.value = { tx: 0, ty: 0, k: 1 }
  const b = bbox.value
  frozen.value = props.fill ? { x: b.x - b.w * 0.15, y: b.y - b.h * 0.15, w: b.w * 1.3, h: b.h * 1.3 } : null
}
defineExpose({ resetView, svg })
watch(() => props.graph.vertices.length === 0, () => { if (props.fill) resetView() })
onMounted(() => { if (props.fill) resetView() })

function toModel(ev: { clientX: number; clientY: number }): Pt {
  const g = root.value
  const s = svg.value
  if (!g || !s) return { x: 0, y: 0 }
  const m = g.getScreenCTM()
  if (!m) return { x: 0, y: 0 }
  const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse())
  return { x: p.x / UNIT, y: -p.y / UNIT }
}

function svgPoint(ev: { clientX: number; clientY: number }): Pt {
  const s = svg.value!
  const m = s.getScreenCTM()!
  const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse())
  return { x: p.x, y: p.y }
}

function onWheel(ev: WheelEvent) {
  if (!props.zoomable) return
  ev.preventDefault()
  const p = svgPoint(ev)
  const k0 = view.value.k
  const k = Math.min(6, Math.max(0.2, k0 * Math.exp(-ev.deltaY * 0.0015)))
  view.value = { k, tx: p.x - ((p.x - view.value.tx) * k) / k0, ty: p.y - ((p.y - view.value.ty) * k) / k0 }
}

const pointers = new Map<number, Pt>()
let pan: { start: Pt; tx: number; ty: number } | null = null
let pinch: { d: number; k: number; mid: Pt; tx: number; ty: number } | null = null

function onPointerDown(ev: PointerEvent, kind: 'bg' | 'vertex' | 'edge', id?: Id) {
  if (props.zoomable) {
    pointers.set(ev.pointerId, svgPoint(ev))
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.value.k, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, tx: view.value.tx, ty: view.value.ty }
      pan = null
      return
    }
  }
  svg.value?.setPointerCapture(ev.pointerId)
  const p = toModel(ev)
  if (kind === 'vertex' && id !== undefined) emit('vertex-down', id, p, ev)
  else if (kind === 'edge' && id !== undefined) emit('edge-down', id, ev)
  else {
    emit('background-down', p, ev)
    if (props.zoomable && props.backgroundPan) pan = { start: svgPoint(ev), tx: view.value.tx, ty: view.value.ty }
  }
}

function onPointerMove(ev: PointerEvent) {
  if (props.zoomable && pointers.has(ev.pointerId)) {
    pointers.set(ev.pointerId, svgPoint(ev))
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const k = Math.min(6, Math.max(0.2, (pinch.k * d) / Math.max(pinch.d, 1)))
      view.value = { k, tx: pinch.mid.x - ((pinch.mid.x - pinch.tx) * k) / pinch.k, ty: pinch.mid.y - ((pinch.mid.y - pinch.ty) * k) / pinch.k }
      return
    }
  }
  if (pan) {
    const p = svgPoint(ev)
    view.value = { ...view.value, tx: pan.tx + p.x - pan.start.x, ty: pan.ty + p.y - pan.start.y }
    return
  }
  emit('move', toModel(ev), ev)
}

function vertexAt(ev: PointerEvent): Id | undefined {
  const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-vertex]')
  return el?.getAttribute('data-vertex') ?? undefined
}

function onPointerUp(ev: PointerEvent) {
  pointers.delete(ev.pointerId)
  if (pointers.size < 2) pinch = null
  if (pan) { pan = null; return }
  emit('up', toModel(ev), vertexAt(ev), ev)
}

function clickElement(kind: 'vertex' | 'edge', id: Id) {
  if (props.selectable === 'both' || (props.selectable === 'vertices' && kind === 'vertex') || (props.selectable === 'edges' && kind === 'edge')) emit('toggle', kind, id)
}

const interactiveVertices = computed(() => props.selectable === 'both' || props.selectable === 'vertices' || props.editable)
const interactiveEdges = computed(() => props.selectable === 'both' || props.selectable === 'edges' || props.editable)

function onKey(ev: KeyboardEvent, kind: 'vertex' | 'edge', id: Id) {
  if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); clickElement(kind, id) }
  emit('key', ev)
}

onBeforeUnmount(() => pointers.clear())

// ---- labels ----
function katexHtml(label: string): string {
  return label.split(/(\$[^$]+\$)/g).map(p => {
    if (p.startsWith('$') && p.endsWith('$') && p.length > 1) {
      try { return katex.renderToString(p.slice(1, -1), { macros: { ...KATEX_MACROS }, throwOnError: false, output: 'html' }) } catch { return p }
    }
    return p.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  }).join('')
}

function tspans(sp: TSpan[]) {
  // dy-based sub/superscripts (baseline-shift is not supported everywhere)
  const out: { text: string; italic: boolean; small: boolean; dy: number }[] = []
  let cur = 0
  for (const s of sp) {
    const target = s.shift === 'sub' ? 4 : s.shift === 'sup' ? -6 : 0
    out.push({ text: s.text, italic: !!s.italic && !s.upright, small: !!s.small, dy: target - cur })
    cur = target
  }
  return out
}

const describe = computed(() => {
  const vs = props.graph.vertices.map(v => v.label?.replace(/\$/g, '') ?? v.id).join(', ')
  const es = props.graph.edges.filter(e => !e.hyper).map(e => `${e.tail[0]}${e.directed ? '→' : '–'}${e.head[0]}`).join(', ')
  return `Vertices: ${vs}. Edges: ${es}.`
})
</script>

<template>
  <svg
    ref="svg"
    class="gv-root"
    :class="{ 'gv-fill': fill, 'gv-editable': editable, 'gv-selectable': selectable !== 'none' }"
    :viewBox="viewBox"
    :style="fill ? undefined : { maxHeight: `${maxHeight}px` }"
    :role="selectable !== 'none' || editable ? 'group' : 'img'"
    :aria-label="ariaLabel ?? 'Graph'"
    @wheel="onWheel"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <desc>{{ describe }}</desc>
    <rect class="gv-bg" :x="box.x - 4000" :y="box.y - 4000" :width="box.w + 8000" :height="box.h + 8000"
      @pointerdown="onPointerDown($event, 'bg')" @dblclick="emit('background-dblclick', toModel($event))" />
    <g ref="root" :transform="transform">
      <!-- faces -->
      <g class="gv-faces">
        <path v-for="fc in faceShapes" :key="fc.id" :d="fc.d" class="gv-face" :class="fc.classes" />
      </g>
      <!-- groups -->
      <g class="gv-groups">
        <path v-for="gr in groupShapes" :key="gr.id" :d="gr.d" class="gv-group" :class="gr.classes" />
      </g>
      <!-- hyperedges -->
      <g class="gv-hyper">
        <template v-for="h in hyperShapes" :key="h.id">
          <path v-if="!h.directed" :d="h.d" class="gv-hyperedge" :class="h.classes" />
          <template v-else>
            <line v-for="(t, i) in h.tail" :key="'t' + i" :x1="t.x" :y1="t.y" :x2="h.c.x" :y2="h.c.y" class="gv-line gv-hyperarc" :class="h.classes" />
            <line v-for="(t, i) in h.head" :key="'h' + i" :x1="h.c.x" :y1="h.c.y" :x2="t.x" :y2="t.y" class="gv-line gv-hyperarc" :class="h.classes" />
          </template>
        </template>
      </g>
      <!-- edges -->
      <g class="gv-edges">
        <g v-for="e in visibleEdges" :key="e.id" class="gv-edge" :class="[...classesOf('edge', e), { 'gv-directed': e.directed }]"
          :data-edge="e.id">
          <template v-if="geoms.get(e.id)">
            <path class="gv-hit" :d="geoms.get(e.id)!.d"
              :tabindex="interactiveEdges ? 0 : undefined"
              :role="interactiveEdges ? 'button' : undefined"
              :aria-label="interactiveEdges ? `edge ${e.tail[0]} ${e.head[0]}` : undefined"
              :aria-pressed="selectable !== 'none' ? !!selection?.edges.includes(e.id) : undefined"
              @pointerdown.stop="onPointerDown($event, 'edge', e.id)"
              @click="clickElement('edge', e.id)"
              @dblclick.stop="emit('edge-dblclick', e.id)"
              @keydown="onKey($event, 'edge', e.id)" />
            <path class="gv-line" :d="geoms.get(e.id)!.d" />
            <path v-if="geoms.get(e.id)!.arrow" class="gv-arrow" :d="geoms.get(e.id)!.arrow" />
            <path v-if="geoms.get(e.id)!.midArrow" class="gv-arrow" :d="geoms.get(e.id)!.midArrow" />
          </template>
        </g>
        <line v-if="preview && pos.get(preview.from)" class="gv-preview" :x1="pos.get(preview.from)!.x" :y1="pos.get(preview.from)!.y"
          :x2="preview.to.x * UNIT" :y2="-preview.to.y * UNIT" />
      </g>
      <!-- edge labels -->
      <g class="gv-edge-labels">
        <template v-for="e in visibleEdges" :key="e.id">
          <text v-if="edgeLabel(e) !== undefined && geoms.get(e.id)" class="gv-edge-label" :class="classesOf('edge', e)"
            :x="geoms.get(e.id)!.label.x" :y="geoms.get(e.id)!.label.y" text-anchor="middle" dominant-baseline="central">
            <template v-if="spans(edgeLabel(e)!)">
              <tspan v-for="(s, i) in tspans(spans(edgeLabel(e)!)!)" :key="i" :class="{ 'gv-it': s.italic }"
                :font-size="s.small ? '75%' : undefined" :dy="s.dy || undefined">{{ s.text }}</tspan>
            </template>
            <template v-else>{{ edgeLabel(e)!.replace(/\$/g, '') }}</template>
          </text>
        </template>
      </g>
      <!-- vertices -->
      <g class="gv-vertices">
        <g v-for="v in visibleVertices" :key="v.id" class="gv-vertex" :class="[...classesOf('vertex', v), { 'gv-dot': !labelsInside }]"
          :transform="`translate(${pos.get(v.id)!.x},${pos.get(v.id)!.y})`" :data-vertex="v.id"
          :tabindex="interactiveVertices ? 0 : undefined"
          :role="interactiveVertices ? 'button' : undefined"
          :aria-label="interactiveVertices ? `vertex ${v.label?.replace(/\$/g, '') ?? v.id}` : undefined"
          :aria-pressed="selectable !== 'none' ? !!selection?.vertices.includes(v.id) : undefined"
          @pointerdown.stop="onPointerDown($event, 'vertex', v.id)"
          @click="clickElement('vertex', v.id)"
          @dblclick.stop="emit('vertex-dblclick', v.id)"
          @keydown="onKey($event, 'vertex', v.id)">
          <circle class="gv-vertex-hit" :r="Math.max(radius + 6, 18)" />
          <circle class="gv-vertex-shape" :r="radius" />
          <template v-if="vertexLabels.get(v.id)">
            <text v-if="spans(vertexLabels.get(v.id)!)" class="gv-vertex-label" :class="{ 'gv-outside': !labelsInside }"
              :x="labelsInside ? 0 : 9" :y="labelsInside ? 0.5 : -11" :text-anchor="labelsInside ? 'middle' : 'start'" dominant-baseline="central">
              <tspan v-for="(s, i) in tspans(spans(vertexLabels.get(v.id)!)!)" :key="i" :class="{ 'gv-it': s.italic }"
                :font-size="s.small ? '72%' : undefined" :dy="s.dy || undefined">{{ s.text }}</tspan>
            </text>
            <foreignObject v-else class="gv-fo" :x="labelsInside ? -40 : 8" :y="labelsInside ? -12 : -26" width="80" height="24">
              <div xmlns="http://www.w3.org/1999/xhtml" class="gv-fo-label" :class="{ 'gv-fo-left': !labelsInside }" v-html="katexHtml(vertexLabels.get(v.id)!)" />
            </foreignObject>
          </template>
          <g v-if="overlay?.vertexBadges[v.id] !== undefined" class="gv-badge" :transform="`translate(${radius + 3},${-radius - 4})`">
            <text class="gv-badge-text" x="0" y="0" text-anchor="start" dominant-baseline="central">
              <template v-if="spans(`$${overlay.vertexBadges[v.id]}$`)">
                <tspan v-for="(s, i) in tspans(spans(`$${overlay.vertexBadges[v.id]}$`)!)" :key="i" :class="{ 'gv-it': s.italic }"
                  :font-size="s.small ? '75%' : undefined" :dy="s.dy || undefined">{{ s.text }}</tspan>
              </template>
              <template v-else>{{ overlay.vertexBadges[v.id] }}</template>
            </text>
          </g>
        </g>
      </g>
      <!-- group / face labels on top -->
      <g class="gv-annotations">
        <template v-for="gr in groupShapes" :key="gr.id">
          <foreignObject v-if="gr.label" :x="gr.labelAt.x - 60" :y="gr.labelAt.y - 12" width="120" height="24" class="gv-fo">
            <div xmlns="http://www.w3.org/1999/xhtml" class="gv-fo-label gv-group-label" v-html="katexHtml(gr.label)" />
          </foreignObject>
        </template>
        <template v-for="fc in faceShapes" :key="fc.id">
          <foreignObject v-if="fc.label" :x="fc.c.x - 40" :y="fc.c.y - 12" width="80" height="24" class="gv-fo">
            <div xmlns="http://www.w3.org/1999/xhtml" class="gv-fo-label" v-html="katexHtml(fc.label)" />
          </foreignObject>
        </template>
        <foreignObject v-for="o in outerFaceLabels" :key="o.id" :x="o.at.x - 40" :y="o.at.y - 12" width="80" height="24" class="gv-fo">
          <div xmlns="http://www.w3.org/1999/xhtml" class="gv-fo-label" v-html="katexHtml(o.label)" />
        </foreignObject>
      </g>
    </g>
  </svg>
</template>
