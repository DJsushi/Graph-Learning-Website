<script setup lang="ts">
// Graph editor: GraphView plus mouse gestures (left select/move, right add, middle delete/pan), selection and undo/redo.
// `tools` lists the allowed actions; the tool buttons are a fallback for touch screens, which have no right/middle button.
// Used by the sandbox widget, build exercises and the playground.
import { computed, ref, watch } from 'vue'
import { cloneGraph, type GraphData, type Id } from '@core/model'
import GraphView from './GraphView.vue'
import type { Pt } from './geometry'
import { nextVertexId } from './positions'
import type { Overlay } from '@core/algorithms/types'

export type Tool = 'move' | 'vertex' | 'edge' | 'delete'

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

const emit = defineEmits<{ 'update:modelValue': [g: GraphData]; select: [sel: { vertices: Id[]; edges: Id[] }] }>()

const tool = ref<Tool>(props.tools[0])
const selection = ref<{ vertices: Id[]; edges: Id[] }>({ vertices: [], edges: [] })
const undoStack: string[] = []
const redoStack: string[] = []
const canUndo = ref(false), canRedo = ref(false)
const view = ref<InstanceType<typeof GraphView>>()
const status = ref('')

const g = computed(() => props.modelValue)
const can = (t: Tool) => props.tools.includes(t)
const hint = computed(() => [
  can('vertex') && 'right-click: add vertex',
  can('edge') && 'right-drag between vertices: add edge',
  can('delete') && 'middle-click: delete',
  'left-drag: move',
].filter(Boolean).join(' · '))

function commit(next: GraphData, before?: string) {
  undoStack.push(before ?? JSON.stringify(props.modelValue))
  if (undoStack.length > 200) undoStack.shift()
  redoStack.length = 0
  canUndo.value = true; canRedo.value = false
  emit('update:modelValue', next)
}
function undo() {
  const s = undoStack.pop()
  if (!s) return
  redoStack.push(JSON.stringify(props.modelValue))
  emit('update:modelValue', JSON.parse(s))
  canUndo.value = undoStack.length > 0; canRedo.value = true
}
function redo() {
  const s = redoStack.pop()
  if (!s) return
  undoStack.push(JSON.stringify(props.modelValue))
  emit('update:modelValue', JSON.parse(s))
  canRedo.value = redoStack.length > 0; canUndo.value = true
}
function reset() {
  if (props.original) commit(cloneGraph(props.original))
}
defineExpose({ undo, redo, reset, selection, resetView: () => view.value?.resetView() })

function setSelection(s: { vertices: Id[]; edges: Id[] }) {
  selection.value = s
  emit('select', s)
}

function addVertex(p: Pt): Id {
  const n = cloneGraph(g.value)
  const id = nextVertexId(n)
  n.vertices.push({ id, x: p.x, y: p.y, classes: [], data: {} })
  commit(n)
  status.value = `Added vertex ${id}.`
  return id
}
function nextEdgeId(n: GraphData) {
  const ids = new Set(n.edges.map(e => e.id))
  for (let i = n.edges.length + 1; ; i++) if (!ids.has(`e${i}`)) return `e${i}`
}
function addEdge(u: Id, v: Id, base?: GraphData) {
  if (u === v && !props.allowLoops) return
  const n = cloneGraph(base ?? g.value)
  const directed = n.type === 'directed'
  n.edges.push({ id: nextEdgeId(n), tail: [u], head: [v], directed, hyper: false, classes: [], data: {} })
  commit(n, base ? undefined : undefined)
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
  if (!selection.value.vertices.length && !selection.value.edges.length) return
  const n = cloneGraph(g.value)
  const vs = new Set(selection.value.vertices), es = new Set(selection.value.edges)
  n.vertices = n.vertices.filter(v => !vs.has(v.id))
  n.edges = n.edges.filter(e => !es.has(e.id) && !e.tail.some(x => vs.has(x)) && !e.head.some(x => vs.has(x)))
  commit(n)
  setSelection({ vertices: [], edges: [] })
}

// ---- gestures ----
let drag: { id: Id; start: Pt; before: string; moved: boolean } | null = null
const edgeDrag = ref<{ from: Id; start: Pt; moved: boolean } | null>(null)
const preview = ref<{ from: Id; to: Pt } | null>(null)
const pendingFrom = ref<Id | null>(null)

function onVertexDown(id: Id, p: Pt, ev: PointerEvent) {
  if (ev.button === 1 || tool.value === 'delete') { if (can('delete')) removeVertex(id); return }
  if (pendingFrom.value !== null) {
    addEdge(pendingFrom.value, id)
    pendingFrom.value = null
    preview.value = null
    return
  }
  if (can('edge') && (ev.button === 2 || tool.value === 'edge' || (tool.value === 'move' && ev.shiftKey))) {
    edgeDrag.value = { from: id, start: p, moved: false }
    preview.value = { from: id, to: p }
    return
  }
  if (ev.button !== 0) return
  drag = { id, start: p, before: JSON.stringify(g.value), moved: false }
  if (tool.value === 'move') setSelection({ vertices: [id], edges: [] })
}
function onMove(p: Pt) {
  if (drag) {
    if (!drag.moved && Math.hypot(p.x - drag.start.x, p.y - drag.start.y) < 0.05) return
    const n = cloneGraph(g.value)
    const v = n.vertices.find(x => x.id === drag!.id)
    if (v) { v.x = p.x; v.y = p.y; if (v.pinned) v.pinned = true }
    drag.moved = true
    emit('update:modelValue', n)
    return
  }
  if (edgeDrag.value) {
    if (Math.hypot(p.x - edgeDrag.value.start.x, p.y - edgeDrag.value.start.y) > 0.15) edgeDrag.value.moved = true
    preview.value = { from: edgeDrag.value.from, to: p }
  } else if (pendingFrom.value !== null) preview.value = { from: pendingFrom.value, to: p }
}
function onUp(p: Pt, vertex: Id | undefined) {
  if (drag) {
    if (drag.moved) {
      undoStack.push(drag.before); redoStack.length = 0; canUndo.value = true; canRedo.value = false
    }
    drag = null
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
    n.vertices.push({ id, x: p.x, y: p.y, classes: [], data: {} })
    n.edges.push({ id: nextEdgeId(n), tail: [ed.from], head: [id], directed: n.type === 'directed', hyper: false, classes: [], data: {} })
    commit(n, before)
    preview.value = null
  } else preview.value = null
}
function onBackgroundDown(p: Pt, ev: PointerEvent) {
  if (pendingFrom.value !== null) { pendingFrom.value = null; preview.value = null; status.value = ''; return }
  if (ev.button === 2 || tool.value === 'vertex') { if (can('vertex')) addVertex(p) }
  else if (ev.button === 0) setSelection({ vertices: [], edges: [] })
}
function onEdgeDown(id: Id, ev: PointerEvent) {
  if (ev.button === 1 || tool.value === 'delete') { if (can('delete')) removeEdge(id) }
  else if (ev.button === 0) setSelection({ vertices: [], edges: [id] })
}
function onKey(ev: KeyboardEvent) {
  const mod = ev.ctrlKey || ev.metaKey
  if (mod && ev.key.toLowerCase() === 'z') { ev.preventDefault(); ev.shiftKey ? redo() : undo(); return }
  if (mod && ev.key.toLowerCase() === 'y') { ev.preventDefault(); redo(); return }
  if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); removeSelection(); return }
  if (ev.key === 'Escape') { pendingFrom.value = null; preview.value = null; edgeDrag.value = null }
}
watch(tool, () => { pendingFrom.value = null; preview.value = null })

const TOOL_INFO: Record<Tool, { label: string; hint: string; icon: string }> = {
  move: { label: 'Move', hint: 'Drag vertices; tap to select', icon: 'M5 12h14M12 5v14M5 12l3-3M5 12l3 3M19 12l-3-3M19 12l-3 3M12 5l-3 3M12 5l3 3M12 19l-3-3M12 19l3-3' },
  vertex: { label: 'Vertex', hint: 'Tap empty space to add a vertex', icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 3v2M12 19v2M3 12h2M19 12h2' },
  edge: { label: 'Edge', hint: 'Drag from one vertex to another, or tap two vertices', icon: 'M6 18L18 6M6 18a2.5 2.5 0 1 1 0-.01M18 6a2.5 2.5 0 1 1 0-.01' },
  delete: { label: 'Delete', hint: 'Tap a vertex or edge to delete it', icon: 'M6 7h12M9 7V5h6v2M8 7l1 12h6l1-12' },
}
</script>

<template>
  <div class="ga-editor" :class="{ 'ga-editor-fill': fill }" tabindex="-1" @keydown="onKey">
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
        <button v-if="original" type="button" class="ga-btn" title="Restore the original graph" @click="reset">Reset</button>
        <slot name="toolbar" />
      </div>
    </div>
    <div class="ga-editor-stage">
    <GraphView ref="view" :graph="g" :overlay="overlay" :selection="selection" editable :fill="fill" :zoomable="fill" :background-pan="fill"
      :max-height="height" :preview="preview" aria-label="Editable graph"
      @vertex-down="onVertexDown" @move="onMove" @up="onUp" @background-down="onBackgroundDown" @edge-down="onEdgeDown"
      @background-dblclick="(p) => can('vertex') && tool === 'move' && addVertex(p)" @key="onKey" />
    <slot name="side" />
    </div>
    <div class="ga-sr-only" aria-live="polite">{{ status }}</div>
  </div>
</template>
