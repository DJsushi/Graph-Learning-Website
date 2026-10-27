<script setup lang="ts">
// Graph editor: GraphView plus mouse gestures (left select/move, right add, middle delete/pan), multi-selection,
// clipboard, inline label/weight editing and one undo history that also records changes made by the host (v-model).
// `tools` lists the allowed actions; the tool buttons are a fallback for touch screens, which have no right/middle button.
// Used by the sandbox widget, build exercises and the playground.
import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { cloneGraph, type GraphData, type Id } from '@core/model'
import { serialize } from '@core/io'
import GraphView from './GraphView.vue'
import type { Pt } from './geometry'
import { nextVertexId } from './positions'
import { inBox, nextEdgeId, paste, snap, subgraph } from './editing'
import type { Overlay } from '@core/algorithms/types'

export type Tool = 'move' | 'vertex' | 'edge' | 'delete'
type Sel = { vertices: Id[]; edges: Id[] }

const props = withDefaults(defineProps<{
  modelValue: GraphData
  tools?: Tool[]
  height?: number
  fill?: boolean
  original?: GraphData
  overlay?: Overlay
  allowLoops?: boolean
  compact?: boolean
}>(), { tools: () => ['move', 'vertex', 'edge', 'delete'], height: 320, allowLoops: true })

const emit = defineEmits<{ 'update:modelValue': [g: GraphData]; select: [sel: Sel] }>()

const tool = ref<Tool>(props.tools[0])
const selection = ref<Sel>({ vertices: [], edges: [] })
const view = ref<InstanceType<typeof GraphView>>()
const root = ref<HTMLElement>()
const wrap = ref<HTMLElement>()
const help = ref<HTMLDialogElement>()
const status = ref('')
const snapOn = ref(false)

const g = computed(() => props.modelValue)
const can = (t: Tool) => props.tools.includes(t)
const hint = computed(() => [
  can('vertex') && 'right-click: add vertex',
  can('edge') && 'right-drag: add edge',
  can('delete') && 'middle-click: delete',
  'press ? for all shortcuts',
].filter(Boolean).join(' · '))

// ---- history ----
const undoStack: string[] = []
const redoStack: string[] = []
const canUndo = ref(false), canRedo = ref(false)
let lastEmitted: GraphData | undefined
let group = '', groupAt = 0
let ready = false
// the host's first assignments (initial load in onMounted) are not undoable edits
onMounted(() => setTimeout(() => { ready = true }))

function push(before: string, coalesce = '') {
  // repeated changes of one kind in quick succession (typing, nudging) form one undo step
  const now = Date.now()
  if (!(coalesce && coalesce === group && now - groupAt < 600)) {
    undoStack.push(before)
    if (undoStack.length > 200) undoStack.shift()
  }
  group = coalesce; groupAt = now
  redoStack.length = 0
  canUndo.value = undoStack.length > 0; canRedo.value = false
}
function emitGraph(n: GraphData) {
  lastEmitted = n
  emit('update:modelValue', n)
}
function commit(next: GraphData, before?: string, coalesce = '') {
  push(before ?? JSON.stringify(props.modelValue), coalesce)
  emitGraph(next)
}
// changes made by the host (inspector, generators, layouts, text, import) join the same history
watch(() => props.modelValue, (n, o) => {
  // the host stores our emits in a ref, so compare the raw objects, not the reactive proxies
  if (toRaw(n) === lastEmitted || !o || !ready) return
  push(JSON.stringify(o), 'host')
  const ids = new Set(n.vertices.map(v => v.id)), eids = new Set(n.edges.map(e => e.id))
  const s = selection.value
  if (s.vertices.some(v => !ids.has(v)) || s.edges.some(e => !eids.has(e))) setSelection({ vertices: s.vertices.filter(v => ids.has(v)), edges: s.edges.filter(e => eids.has(e)) })
})
function restore(from: string[], to: string[]) {
  const s = from.pop()
  if (!s) return
  to.push(JSON.stringify(props.modelValue))
  group = ''
  emitGraph(JSON.parse(s))
  canUndo.value = undoStack.length > 0; canRedo.value = redoStack.length > 0
}
const undo = () => restore(undoStack, redoStack)
const redo = () => restore(redoStack, undoStack)
function reset() {
  if (props.original) commit(cloneGraph(props.original))
}
defineExpose({ undo, redo, reset, selection, resetView: () => view.value?.resetView() })

function setSelection(s: Sel) {
  selection.value = s
  emit('select', s)
}
const isSelected = (kind: 'vertex' | 'edge', id: Id) => (kind === 'vertex' ? selection.value.vertices : selection.value.edges).includes(id)
function toggleSelected(kind: 'vertex' | 'edge', id: Id) {
  const s = { vertices: [...selection.value.vertices], edges: [...selection.value.edges] }
  const list = kind === 'vertex' ? s.vertices : s.edges
  const i = list.indexOf(id)
  if (i >= 0) list.splice(i, 1); else list.push(id)
  setSelection(s)
}

// ---- edits ----
function addVertex(p: Pt): Id {
  const n = cloneGraph(g.value)
  const id = nextVertexId(n)
  const q = snap(p, snapOn.value)
  n.vertices.push({ id, x: q.x, y: q.y, classes: [], data: {} })
  commit(n)
  status.value = `Added vertex ${id}.`
  return id
}
function addEdge(u: Id, v: Id) {
  if (u === v && !props.allowLoops) return
  const n = cloneGraph(g.value)
  const directed = n.type === 'directed'
  n.edges.push({ id: nextEdgeId(n), tail: [u], head: [v], directed, hyper: false, classes: [], data: {} })
  commit(n)
  status.value = `Added edge ${u}${directed ? '→' : '–'}${v}.`
}
function removeVertex(id: Id) {
  const n = cloneGraph(g.value)
  n.vertices = n.vertices.filter(v => v.id !== id)
  n.edges = n.edges.filter(e => !e.tail.includes(id) && !e.head.includes(id))
  for (const gr of n.groups) gr.members = gr.members.filter(m => m !== id)
  commit(n)
  status.value = `Removed vertex ${id}.`
}
function removeEdge(id: Id) {
  const n = cloneGraph(g.value)
  n.edges = n.edges.filter(e => e.id !== id)
  commit(n)
  status.value = 'Removed an edge.'
}
function removeSelection() {
  if (!can('delete') || (!selection.value.vertices.length && !selection.value.edges.length)) return
  const n = cloneGraph(g.value)
  const vs = new Set(selection.value.vertices), es = new Set(selection.value.edges)
  n.vertices = n.vertices.filter(v => !vs.has(v.id))
  n.edges = n.edges.filter(e => !es.has(e.id) && !e.tail.some(x => vs.has(x)) && !e.head.some(x => vs.has(x)))
  for (const gr of n.groups) gr.members = gr.members.filter(m => !vs.has(m))
  commit(n)
  status.value = `Removed ${vs.size} vertices and ${es.size} edges.`
  setSelection({ vertices: [], edges: [] })
}

// ---- clipboard (shared by all editors on the page) ----
let pasteCount = 0
function copySelection(cut: boolean) {
  if (!selection.value.vertices.length) return
  clipboard = subgraph(g.value, selection.value.vertices)
  pasteCount = 0
  navigator.clipboard?.writeText(serialize(clipboard, { positions: true })).catch(() => { /* best effort */ })
  status.value = `Copied ${clipboard.vertices.length} vertices.`
  if (cut) removeSelection()
}
function pasteClipboard(clip = clipboard) {
  if (!clip || !can('vertex')) return
  pasteCount++
  const r = paste(g.value, clip, { x: 0.5 * pasteCount, y: -0.5 * pasteCount })
  commit(r.graph)
  setSelection({ vertices: r.vertices, edges: r.edges })
  status.value = `Pasted ${r.vertices.length} vertices.`
}
function duplicate() {
  if (!selection.value.vertices.length) return
  pasteCount = 0
  pasteClipboard(subgraph(g.value, selection.value.vertices))
}
function nudge(dx: number, dy: number) {
  const vs = new Set(selection.value.vertices)
  if (!vs.size) return
  const n = cloneGraph(g.value)
  for (const v of n.vertices) if (vs.has(v.id)) { const q = snap({ x: (v.x ?? 0) + dx, y: (v.y ?? 0) + dy }, snapOn.value); v.x = q.x; v.y = q.y; v.pinned = true }
  commit(n, undefined, 'nudge')
}
function flipSelected() {
  const es = new Set(selection.value.edges)
  if (!es.size || g.value.type !== 'directed') return
  const n = cloneGraph(g.value)
  for (const e of n.edges) if (es.has(e.id) && !e.hyper) [e.tail, e.head] = [e.head, e.tail]
  commit(n)
  status.value = `Reversed ${es.size} edges.`
}

// ---- inline editing (labels, weights) ----
const editing = ref<{ kind: 'vertex' | 'edge'; id: Id; value: string; key: string; x: number; y: number } | null>(null)
const editInput = ref<HTMLInputElement>()
function startEdit(kind: 'vertex' | 'edge', id: Id) {
  const c = view.value?.clientPoint(kind, id), r = wrap.value?.getBoundingClientRect()
  if (!c || !r) return
  let value = '', key = 'label'
  if (kind === 'vertex') value = g.value.vertices.find(v => v.id === id)?.label ?? ''
  else {
    const e = g.value.edges.find(x => x.id === id)
    if (!e) return
    key = e.directed ? 'c' : 'w'
    value = e.data[key] === undefined ? '' : String(e.data[key])
  }
  editing.value = { kind, id, value, key, x: c.x - r.x, y: c.y - r.y }
  nextTick(() => { editInput.value?.focus(); editInput.value?.select() })
}
function finishEdit(save: boolean) {
  const ed = editing.value
  editing.value = null
  root.value?.focus({ preventScroll: true })
  if (!ed || !save) return
  const n = cloneGraph(g.value)
  const v = ed.value.trim()
  if (ed.kind === 'vertex') {
    const x = n.vertices.find(y => y.id === ed.id)
    if (!x || (x.label ?? '') === v) return
    x.label = v || undefined
  } else {
    const e = n.edges.find(y => y.id === ed.id)
    if (!e) return
    if (v === '') delete e.data[ed.key]
    else if (isFinite(Number(v))) e.data[ed.key] = Number(v)
    else { status.value = `${ed.key} must be a number.`; return }
  }
  commit(n)
}
const editLabel = computed(() => (editing.value?.kind === 'vertex' ? 'Vertex label ($…$ for math)' : editing.value?.key === 'c' ? 'Capacity c' : 'Weight w'))

// ---- gestures ----
let drag: { ids: Id[]; start: Pt; origin: Map<Id, Pt>; before: string; moved: boolean } | null = null
const edgeDrag = ref<{ from: Id; start: Pt; moved: boolean } | null>(null)
const preview = ref<{ from: Id; to: Pt } | null>(null)
const pendingFrom = ref<Id | null>(null)
const marquee = ref<{ a: Pt; b: Pt; add: boolean } | null>(null)

function onVertexDown(id: Id, p: Pt, ev: PointerEvent) {
  if (ev.button === 1 || tool.value === 'delete') { if (can('delete')) removeVertex(id); return }
  if (pendingFrom.value !== null) {
    addEdge(pendingFrom.value, id)
    pendingFrom.value = null
    preview.value = null
    return
  }
  if (can('edge') && (ev.button === 2 || tool.value === 'edge')) {
    edgeDrag.value = { from: id, start: p, moved: false }
    preview.value = { from: id, to: p }
    return
  }
  if (ev.button !== 0) return
  if (ev.shiftKey) { toggleSelected('vertex', id); return }
  if (!isSelected('vertex', id)) setSelection({ vertices: [id], edges: [] })
  const ids = selection.value.vertices
  const origin = new Map(g.value.vertices.filter(v => ids.includes(v.id)).map(v => [v.id, { x: v.x ?? 0, y: v.y ?? 0 }]))
  drag = { ids, start: p, origin, before: JSON.stringify(g.value), moved: false }
}
function onMove(p: Pt) {
  if (drag) {
    if (!drag.moved && Math.hypot(p.x - drag.start.x, p.y - drag.start.y) < 0.05) return
    const n = cloneGraph(g.value)
    for (const v of n.vertices) {
      const o = drag.origin.get(v.id)
      if (!o) continue
      const q = snap({ x: o.x + p.x - drag.start.x, y: o.y + p.y - drag.start.y }, snapOn.value)
      v.x = q.x; v.y = q.y; v.pinned = true
    }
    drag.moved = true
    emitGraph(n)
    return
  }
  if (marquee.value) { marquee.value = { ...marquee.value, b: p }; return }
  if (edgeDrag.value) {
    if (Math.hypot(p.x - edgeDrag.value.start.x, p.y - edgeDrag.value.start.y) > 0.15) edgeDrag.value.moved = true
    preview.value = { from: edgeDrag.value.from, to: p }
  } else if (pendingFrom.value !== null) preview.value = { from: pendingFrom.value, to: p }
}
function onUp(p: Pt, vertex: Id | undefined) {
  if (drag) {
    if (drag.moved) push(drag.before)
    drag = null
    return
  }
  const m = marquee.value
  if (m) {
    marquee.value = null
    if (Math.hypot(m.a.x - m.b.x, m.a.y - m.b.y) < 0.1) { if (!m.add) setSelection({ vertices: [], edges: [] }); return }
    const box = inBox(g.value, m.a, m.b)
    const base = m.add ? selection.value : { vertices: [], edges: [] }
    setSelection({ vertices: [...new Set([...base.vertices, ...box.vertices])], edges: [...new Set([...base.edges, ...box.edges])] })
    status.value = `Selected ${selection.value.vertices.length} vertices.`
    return
  }
  const ed = edgeDrag.value
  if (!ed) return
  edgeDrag.value = null
  if (vertex !== undefined && (vertex !== ed.from || ed.moved)) {
    addEdge(ed.from, vertex)
    preview.value = null
  } else if (vertex === ed.from && !ed.moved) {
    // click-click mode: wait for the second vertex
    pendingFrom.value = ed.from
    status.value = `Edge from ${ed.from}: now click the other end (or the same vertex for a loop).`
  } else if (ed.moved && can('vertex')) {
    const before = JSON.stringify(g.value)
    const n = cloneGraph(g.value)
    const id = nextVertexId(n)
    const q = snap(p, snapOn.value)
    n.vertices.push({ id, x: q.x, y: q.y, classes: [], data: {} })
    n.edges.push({ id: nextEdgeId(n), tail: [ed.from], head: [id], directed: n.type === 'directed', hyper: false, classes: [], data: {} })
    commit(n, before)
    preview.value = null
  } else preview.value = null
}
function onBackgroundDown(p: Pt, ev: PointerEvent) {
  if (pendingFrom.value !== null) { pendingFrom.value = null; preview.value = null; status.value = ''; return }
  if (ev.button === 2 || tool.value === 'vertex') { if (can('vertex')) addVertex(p); return }
  // Shift-drag draws a selection box; without panning (small editors) a plain drag does too
  if (ev.button === 0 && (ev.shiftKey || !props.fill)) marquee.value = { a: p, b: p, add: ev.shiftKey }
  else if (ev.button === 0) setSelection({ vertices: [], edges: [] })
}
function onEdgeDown(id: Id, ev: PointerEvent) {
  if (ev.button === 1 || tool.value === 'delete') { if (can('delete')) removeEdge(id) }
  else if (ev.button === 0) ev.shiftKey ? toggleSelected('edge', id) : setSelection({ vertices: [], edges: [id] })
}
function onCanvasPointerDown(ev: PointerEvent) {
  // keys must reach the editor after clicking empty canvas (the background is not focusable)
  if (!(ev.target instanceof HTMLInputElement)) root.value?.focus({ preventScroll: true })
}

function onKey(ev: KeyboardEvent) {
  if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return
  const mod = ev.ctrlKey || ev.metaKey
  const k = ev.key.toLowerCase()
  const act = (f: () => void) => { ev.preventDefault(); f() }
  if (mod && k === 'z') return act(() => (ev.shiftKey ? redo() : undo()))
  if (mod && k === 'y') return act(redo)
  if (mod && k === 'a') return act(() => setSelection({ vertices: g.value.vertices.map(v => v.id), edges: g.value.edges.map(e => e.id) }))
  if (mod && k === 'c') return act(() => copySelection(false))
  if (mod && k === 'x' && can('delete')) return act(() => copySelection(true))
  if (mod && k === 'v') return act(() => pasteClipboard())
  if (mod && k === 'd' && can('vertex')) return act(duplicate)
  if (mod) return
  if (ev.key === 'Delete' || ev.key === 'Backspace') return act(removeSelection)
  if (ev.key === 'Escape') {
    if (pendingFrom.value !== null || edgeDrag.value) { pendingFrom.value = null; preview.value = null; edgeDrag.value = null }
    else setSelection({ vertices: [], edges: [] })
    return
  }
  const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }
  if (arrows[ev.key] && selection.value.vertices.length) {
    const step = ev.shiftKey ? 0.5 : 0.1
    return act(() => nudge(arrows[ev.key][0] * step, arrows[ev.key][1] * step))
  }
  const one = selection.value.vertices.length + selection.value.edges.length === 1
  if ((ev.key === 'F2' || ev.key === 'Enter') && one) {
    return act(() => (selection.value.vertices.length ? startEdit('vertex', selection.value.vertices[0]) : startEdit('edge', selection.value.edges[0])))
  }
  if (k === 'f') return act(flipSelected)
  if (k === 'g') return act(() => { snapOn.value = !snapOn.value; status.value = `Snap to grid ${snapOn.value ? 'on' : 'off'}.` })
  if (ev.key === '?') return act(() => help.value?.showModal())
}
watch(tool, () => { pendingFrom.value = null; preview.value = null })

const zoomPct = computed(() => `${Math.round((view.value?.zoom ?? 1) * 100)}%`)

const TOOL_INFO: Record<Tool, { label: string; hint: string; icon: string }> = {
  move: { label: 'Move', hint: 'Drag vertices; tap to select', icon: 'M5 12h14M12 5v14M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3M12 5l-3 3M12 5l3 3M12 19l-3-3M12 19l3-3' },
  vertex: { label: 'Vertex', hint: 'Tap empty space to add a vertex', icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 3v2M12 19v2M3 12h2M19 12h2' },
  edge: { label: 'Edge', hint: 'Drag from one vertex to another, or tap two vertices', icon: 'M6 18L18 6M6 18a2.5 2.5 0 1 1 0-.01M18 6a2.5 2.5 0 1 1 0-.01' },
  delete: { label: 'Delete', hint: 'Tap a vertex or edge to delete it', icon: 'M6 7h12M9 7V5h6v2M8 7l1 12h6l1-12' },
}
const SHORTCUTS: [string, string][] = [
  ['Left-drag a vertex', 'Move it (or the whole selection)'],
  ['Click · Shift-click', 'Select · add to the selection'],
  ['Shift-drag on the background', 'Select with a box'],
  ['Right-click empty space · double-click', 'Add a vertex'],
  ['Right-drag between vertices', 'Add an edge (into empty space: new vertex too)'],
  ['Middle-click a vertex or edge', 'Delete it'],
  ['Drag the background · middle-drag · scroll', 'Pan · pan · zoom'],
  ['Double-click a vertex / edge, F2', 'Edit the label / weight'],
  ['Delete', 'Delete the selection'],
  ['Ctrl+C · Ctrl+X · Ctrl+V · Ctrl+D', 'Copy · cut · paste · duplicate'],
  ['Ctrl+A · Esc', 'Select all · clear the selection'],
  ['Arrow keys (Shift: larger steps)', 'Nudge the selection'],
  ['F', 'Reverse the selected arcs'],
  ['G', 'Snap to grid on/off'],
  ['Ctrl+Z · Ctrl+Shift+Z', 'Undo · redo'],
]
</script>

<script lang="ts">
let clipboard: GraphData | null = null
</script>

<template>
  <div ref="root" class="ga-editor" :class="{ 'ga-editor-fill': fill }" tabindex="-1" @keydown="onKey">
    <div class="ga-toolbar" role="toolbar" aria-label="Editing tools">
      <p class="ga-editor-hint">{{ hint }}</p>
      <div class="ga-tool-group ga-touch-tools" role="radiogroup" aria-label="Tool">
        <button v-for="t in tools" :key="t" type="button" class="ga-btn ga-tool" :class="{ active: tool === t }" role="radio" :aria-checked="tool === t"
          :title="TOOL_INFO[t].hint" @click="tool = t">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="TOOL_INFO[t].icon" /></svg>
          <span :class="{ 'ga-sr-only': compact }">{{ TOOL_INFO[t].label }}</span>
        </button>
      </div>
      <div class="ga-tool-group">
        <button type="button" class="ga-btn ga-icon-btn" :disabled="!canUndo" title="Undo (Ctrl+Z)" aria-label="Undo" @click="undo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" /></svg>
        </button>
        <button type="button" class="ga-btn ga-icon-btn" :disabled="!canRedo" title="Redo (Ctrl+Shift+Z)" aria-label="Redo" @click="redo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" /></svg>
        </button>
        <button type="button" class="ga-btn ga-icon-btn" :class="{ active: snapOn }" :aria-pressed="snapOn" title="Snap to grid (G)" aria-label="Snap to grid" @click="snapOn = !snapOn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM4 12h16M12 4v16" /></svg>
        </button>
        <button v-if="original" type="button" class="ga-btn" title="Restore the original graph" @click="reset">Reset</button>
        <slot name="toolbar" />
        <button type="button" class="ga-btn ga-icon-btn" title="Keyboard and mouse shortcuts (?)" aria-label="Shortcuts" @click="help?.showModal()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" /></svg>
        </button>
      </div>
    </div>
    <div class="ga-editor-stage">
      <div ref="wrap" class="ga-canvas-wrap" @pointerdown.capture="onCanvasPointerDown">
        <GraphView ref="view" :graph="g" :overlay="overlay" :selection="selection" editable :fill="fill" :zoomable="fill" :background-pan="fill"
          :max-height="height" :preview="preview" :marquee="marquee" aria-label="Editable graph"
          @vertex-down="onVertexDown" @move="onMove" @up="onUp" @background-down="onBackgroundDown" @edge-down="onEdgeDown"
          @background-dblclick="(p) => can('vertex') && tool === 'move' && addVertex(p)"
          @vertex-dblclick="(id) => startEdit('vertex', id)" @edge-dblclick="(id) => startEdit('edge', id)" />
        <input v-if="editing" ref="editInput" v-model="editing.value" class="ga-inline-edit" type="text" :aria-label="editLabel" :placeholder="editLabel"
          :inputmode="editing.kind === 'edge' ? 'decimal' : 'text'" :style="{ left: `${editing.x}px`, top: `${editing.y}px` }"
          @keydown.enter.prevent="finishEdit(true)" @keydown.esc.prevent="finishEdit(false)" @blur="finishEdit(true)" />
        <div v-if="fill" class="ga-zoom" role="group" aria-label="Zoom">
          <button type="button" class="ga-btn ga-icon-btn" aria-label="Zoom out" title="Zoom out" @click="view?.zoomBy(1 / 1.25)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" /></svg>
          </button>
          <span class="ga-zoom-pct" aria-live="polite">{{ zoomPct }}</span>
          <button type="button" class="ga-btn ga-icon-btn" aria-label="Zoom in" title="Zoom in" @click="view?.zoomBy(1.25)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" /></svg>
          </button>
          <button type="button" class="ga-btn ga-icon-btn" aria-label="Fit to view" title="Fit to view" @click="view?.resetView()">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4M17 12h4M12 3v4M12 17v4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6" /></svg>
          </button>
        </div>
      </div>
      <slot name="side" />
    </div>
    <div class="ga-sr-only" aria-live="polite">{{ status }}</div>
    <dialog ref="help" class="ga-dialog" aria-label="Shortcuts" @click.self="help?.close()">
      <div class="ga-dialog-body">
      <div class="ga-dialog-head">
        <h2>Shortcuts</h2>
        <button type="button" class="ga-btn ga-icon-btn" aria-label="Close" @click="help?.close()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <dl class="ga-shortcuts">
        <template v-for="[k, v] in SHORTCUTS" :key="k"><dt>{{ k }}</dt><dd>{{ v }}</dd></template>
      </dl>
      </div>
    </dialog>
  </div>
</template>
