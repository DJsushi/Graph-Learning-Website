<script setup lang="ts">
// Full-screen graph playground: editor canvas, generators, layouts, inspector, properties, algorithms, DSL text, import/export.
import { computed, onMounted, ref, watch } from 'vue'
import { data as pseudo } from '../../data/pseudo.data'
import { parseGraph } from '@core/dsl/parser'
import { cloneGraph, emptyGraph, GraphIndex, type GraphData, type Id } from '@core/model'
import { applyLayout } from '@core/layout'
import { PROPERTIES } from '@core/properties'
import { ALGORITHMS } from '@core/algorithms'
import { GENERATORS } from '@core/dsl/generators'
import {
  serialize, toJSON, toTikZ, adjacencyMatrixText, adjacencyListText, importAny, encodeShare, decodeShare,
} from '@core/io'
import EditableGraph from '@gv/EditableGraph.vue'
import PlayerWidget from '@gv/widgets/PlayerWidget.vue'
import RichText from '@gv/RichText.vue'
import { positioned } from '@gv/positions'

const STORE = 'graph-atlas-playground-v1'
const START = `// Edit the graph on the canvas or here.\nuse: Petersen\n`

const graph = ref<GraphData>(emptyGraph())
const editor = ref<InstanceType<typeof EditableGraph>>()
const mode = ref<'edit' | 'run'>('edit')
const tab = ref<'inspect' | 'properties' | 'algorithms' | 'text' | 'io'>('inspect')
const sel = ref<{ vertices: Id[]; edges: Id[] }>({ vertices: [], edges: [] })
const message = ref('')

// ---------- load / save ----------
function fromText(text: string): GraphData | undefined {
  const doc = parseGraph(text)
  if (doc.errors.length) return undefined
  return positioned(doc.panels[0].graph)
}
function pinAll(g: GraphData): GraphData {
  for (const v of g.vertices) v.pinned = true
  return g
}
onMounted(() => {
  let g: GraphData | undefined
  const hash = new URLSearchParams(location.hash.slice(1)).get('g')
  if (hash) {
    const text = decodeShare(hash)
    if (text) g = fromText(text)
    if (!g) message.value = 'The shared graph could not be read.'
  }
  if (!g) {
    try { const saved = localStorage.getItem(STORE); if (saved) g = fromText(saved) } catch { /* no storage */ }
  }
  graph.value = pinAll(g ?? fromText(START)!)
  text.value = serialize(graph.value, { positions: true })
})
watch(graph, g => {
  try { localStorage.setItem(STORE, serialize(g, { positions: true })) } catch { /* ignore */ }
  if (!textFocused.value) text.value = serialize(g, { positions: true })
}, { deep: true })

// ---------- graph type, generators, layout ----------
const isDirected = computed(() => graph.value.type === 'directed')
function setType(t: 'undirected' | 'directed') {
  const g = cloneGraph(graph.value)
  g.type = t
  for (const e of g.edges) if (!e.hyper) e.directed = t === 'directed'
  graph.value = g
}
function clearGraph() {
  const g = emptyGraph(graph.value.type)
  graph.value = g
  message.value = 'Canvas cleared. Click with the Vertex tool or double-click to add vertices.'
}

const genIndex = ref(9)
const genArgs = ref<string[]>(['5', '0.4', '1'])
const gen = computed(() => GENERATORS[genIndex.value])
function generatorCall(): string {
  const g = gen.value
  const args = g.params.map((p, i) => (p === 'seed' ? `seed=${genArgs.value[i] || 1}` : genArgs.value[i] || '3'))
  return g.params.length ? `${g.name}(${args.join(',')})` : g.name
}
function generate(replace: boolean) {
  const doc = parseGraph(`use: ${generatorCall()}`)
  if (doc.errors.length) { message.value = doc.errors[0].message; return }
  const fresh = positioned(doc.panels[0].graph)
  if (replace) {
    fresh.type = graph.value.type
    if (fresh.type === 'directed') for (const e of fresh.edges) e.directed = true
    graph.value = pinAll(fresh)
  } else {
    // insert next to the existing drawing with renamed vertices
    const g = cloneGraph(graph.value)
    const maxX = Math.max(0, ...g.vertices.map(v => v.x ?? 0))
    const minX = Math.min(...fresh.vertices.map(v => v.x ?? 0))
    const taken = new Set(g.vertices.map(v => v.id))
    let k = 1
    const ren = new Map<Id, Id>()
    for (const v of fresh.vertices) {
      let id = v.id
      while (taken.has(id)) id = `${v.id}_${k++}`
      taken.add(id); ren.set(v.id, id)
      g.vertices.push({ ...v, id, x: (v.x ?? 0) - minX + maxX + 1.5, pinned: true })
    }
    let e = g.edges.length
    for (const ed of fresh.edges) {
      while (g.edges.some(x => x.id === `e${e + 1}`)) e++
      g.edges.push({ ...ed, id: `e${++e}`, tail: ed.tail.map(x => ren.get(x)!), head: ed.head.map(x => ren.get(x)!), directed: g.type === 'directed' })
    }
    graph.value = g
  }
  editor.value?.resetView()
}

const LAYOUTS = ['force', 'circle', 'tree', 'layered', 'bipartite', 'grid', 'line']
const layoutName = ref('force')
function relayout() {
  const g = cloneGraph(graph.value)
  for (const v of g.vertices) v.pinned = false
  g.meta.layout = layoutName.value
  applyLayout(g)
  delete g.meta.layout
  graph.value = pinAll(g)
  editor.value?.resetView()
}

// ---------- inspector ----------
const selVertex = computed(() => (sel.value.vertices.length === 1 ? graph.value.vertices.find(v => v.id === sel.value.vertices[0]) : undefined))
const selEdge = computed(() => (sel.value.edges.length === 1 ? graph.value.edges.find(e => e.id === sel.value.edges[0]) : undefined))
const CLASSES = ['highlight', 'source', 'sink', 'tree', 'path', 'cut', 'muted', 'color1', 'color2', 'color3', 'color4', 'color5']
function update(fn: (g: GraphData) => void) {
  const g = cloneGraph(graph.value)
  fn(g)
  graph.value = g
}
function setVertexLabel(v: string) { const id = selVertex.value!.id; update(g => { const x = g.vertices.find(y => y.id === id)!; x.label = v || undefined }) }
function setEdgeAttr(key: string, v: string) {
  const id = selEdge.value!.id
  update(g => {
    const e = g.edges.find(x => x.id === id)!
    if (key === 'label') e.label = v || undefined
    else if (v === '') delete e.data[key]
    else e.data[key] = isFinite(Number(v)) ? Number(v) : v
  })
}
function toggleClass(kind: 'vertex' | 'edge', cls: string) {
  const id = kind === 'vertex' ? selVertex.value!.id : selEdge.value!.id
  update(g => {
    const el = kind === 'vertex' ? g.vertices.find(x => x.id === id)! : g.edges.find(x => x.id === id)!
    el.classes = el.classes.includes(cls) ? el.classes.filter(c => c !== cls) : [...el.classes, cls]
  })
}
function hasClass(kind: 'vertex' | 'edge', cls: string) {
  const el = kind === 'vertex' ? selVertex.value : selEdge.value
  return !!el?.classes.includes(cls)
}
function randomWeights(key: 'w' | 'c') {
  update(g => { for (const e of g.edges) e.data[key] = 1 + Math.floor(Math.random() * 12) })
}

// ---------- properties ----------
const props = computed(() => {
  const ix = new GraphIndex(graph.value)
  return Object.values(PROPERTIES).map(p => {
    try { return { id: p.id, name: p.name, value: p.compute(ix) } } catch { return { id: p.id, name: p.name, value: '—' } }
  })
})

// ---------- algorithms ----------
const algoId = ref('kruskal')
const algo = computed(() => ALGORITHMS[algoId.value])
const algoParams = ref<Record<string, string>>({})
watch([algoId, graph], () => {
  const ids = graph.value.vertices.map(v => v.id)
  const p: Record<string, string> = {}
  for (const name of algo.value?.params ?? []) {
    const prev = algoParams.value[name]
    if (name === 'source') p.source = prev && ids.includes(prev) ? prev : graph.value.vertices.find(v => v.classes.includes('source'))?.id ?? ids[0] ?? ''
    else if (name === 'sink') p.sink = prev && ids.includes(prev) ? prev : graph.value.vertices.find(v => v.classes.includes('sink'))?.id ?? ids[ids.length - 1] ?? ''
    else if (name === 'root') p.root = prev && ids.includes(prev) ? prev : ids[0] ?? ''
    else if (name === 'choice') p.choice = prev ?? 'dfs'
    else if (name === 'seq') p.seq = prev ?? '3,3,2,2,2'
  }
  algoParams.value = p
}, { immediate: true })
const algoNote = computed(() => {
  const a = algo.value
  if (!a) return ''
  if (a.directed && !isDirected.value) return 'This algorithm needs a directed graph with capacities c (switch the graph type above).'
  if (['kruskal', 'jarnik', 'boruvka'].includes(a.id)) return 'Uses edge weights w (default 1). Set them in the inspector or with “Random weights”.'
  if (a.directed) return 'Uses arc capacities c (or weights w for arborescences).'
  return ''
})
function run() { mode.value = 'run' }
const runGraph = computed(() => (algoId.value === 'havel-hakimi' ? emptyGraph() : graph.value))
const runPseudo = computed(() => pseudo[algoId.value])

// ---------- text ----------
const text = ref('')
const textFocused = ref(false)
const textErrors = ref<string[]>([])
function onText() {
  const doc = parseGraph(text.value)
  textErrors.value = doc.errors.map(e => `line ${e.line}: ${e.message}`)
  if (!doc.errors.length) {
    const prev = new Map(graph.value.vertices.map(v => [v.id, v]))
    const g = doc.panels[0].graph
    for (const v of g.vertices) { const p = prev.get(v.id); if (!v.pinned && p) { v.x = p.x; v.y = p.y; v.pinned = true } }
    graph.value = pinAll(positioned(g))
  }
}

// ---------- import / export ----------
const ioText = ref('')
const ioFormat = ref<'dsl' | 'json' | 'tikz' | 'matrix' | 'list'>('dsl')
function exportAs(f: typeof ioFormat.value) {
  ioFormat.value = f
  const g = graph.value
  ioText.value = f === 'dsl' ? serialize(g, { positions: true }) : f === 'json' ? toJSON(g) : f === 'tikz' ? toTikZ(g) : f === 'matrix' ? adjacencyMatrixText(g) : adjacencyListText(g)
}
function doImport() {
  try {
    graph.value = pinAll(positioned(importAny(ioText.value)))
    message.value = 'Graph imported.'
    editor.value?.resetView()
  } catch (e) { message.value = `Import failed: ${(e as Error).message}` }
}
async function copy(textToCopy: string, what: string) {
  try { await navigator.clipboard.writeText(textToCopy); message.value = `${what} copied to the clipboard.` }
  catch { message.value = `Could not access the clipboard; select the text and copy it manually.` }
}
function shareLink() {
  const url = `${location.origin}${location.pathname}#g=${encodeShare(serialize(graph.value, { positions: true }))}`
  history.replaceState(null, '', url)
  copy(url, 'Share link')
}
function svgElement(): SVGSVGElement | null {
  return document.querySelector('.ga-playground-canvas svg.gv-root')
}
function inlineStyles(src: SVGSVGElement): string {
  const clone = src.cloneNode(true) as SVGSVGElement
  const props = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity', 'font-family', 'font-size', 'font-style', 'paint-order', 'stroke-linejoin', 'stroke-linecap']
  const a = src.querySelectorAll('*'), b = clone.querySelectorAll('*')
  a.forEach((el, i) => {
    const cs = getComputedStyle(el)
    ;(b[i] as SVGElement).setAttribute('style', props.map(p => `${p}:${cs.getPropertyValue(p)}`).join(';'))
  })
  clone.querySelector('.gv-bg')?.remove()
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.removeAttribute('style')
  return new XMLSerializer().serializeToString(clone)
}
function download(name: string, blob: Blob) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
function downloadSVG() {
  const s = svgElement()
  if (s) download('graph.svg', new Blob([inlineStyles(s)], { type: 'image/svg+xml' }))
}
function downloadPNG() {
  const s = svgElement()
  if (!s) return
  const vb = s.viewBox.baseVal
  const img = new Image()
  const url = URL.createObjectURL(new Blob([inlineStyles(s)], { type: 'image/svg+xml' }))
  img.onload = () => {
    const c = document.createElement('canvas')
    c.width = vb.width * 2; c.height = vb.height * 2
    const ctx = c.getContext('2d')!
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0, c.width, c.height)
    URL.revokeObjectURL(url)
    try { c.toBlob(b => b && download('graph.png', b)) } catch { message.value = 'PNG export is blocked by this browser for labels with formulas; use SVG instead.' }
  }
  img.src = url
}
watch(message, m => { if (m) setTimeout(() => { if (message.value === m) message.value = '' }, 5000) })
</script>

<template>
  <div class="ga-playground">
    <aside class="ga-pg-left" aria-label="Graph">
      <section>
        <h2>Graph</h2>
        <div class="ga-seg" role="radiogroup" aria-label="Graph type">
          <button type="button" class="ga-btn" role="radio" :aria-checked="!isDirected" :class="{ active: !isDirected }" @click="setType('undirected')">Undirected</button>
          <button type="button" class="ga-btn" role="radio" :aria-checked="isDirected" :class="{ active: isDirected }" @click="setType('directed')">Directed</button>
        </div>
        <button type="button" class="ga-btn ga-wide" @click="clearGraph">Clear canvas</button>
      </section>
      <section>
        <h2>Generate</h2>
        <label class="ga-field">Family
          <select v-model.number="genIndex">
            <option v-for="(g, i) in GENERATORS" :key="i" :value="i">{{ g.doc }} {{ g.params.length ? `${g.name}(${g.params.join(',')})` : '' }}</option>
          </select>
        </label>
        <div class="ga-field-row">
          <label v-for="(p, i) in gen.params" :key="p" class="ga-field ga-small">{{ p }}
            <input v-model="genArgs[i]" type="text" inputmode="decimal" />
          </label>
        </div>
        <div class="ga-field-row">
          <button type="button" class="ga-btn" @click="generate(true)">Replace</button>
          <button type="button" class="ga-btn" @click="generate(false)">Add</button>
        </div>
      </section>
      <section>
        <h2>Layout</h2>
        <div class="ga-field-row">
          <select v-model="layoutName" aria-label="Layout algorithm">
            <option v-for="l in LAYOUTS" :key="l" :value="l">{{ l }}</option>
          </select>
          <button type="button" class="ga-btn" @click="relayout">Apply</button>
        </div>
      </section>
      <section>
        <h2>Weights</h2>
        <div class="ga-field-row">
          <button type="button" class="ga-btn" @click="randomWeights('w')">Random weights</button>
          <button type="button" class="ga-btn" @click="randomWeights('c')">Random capacities</button>
        </div>
      </section>
    </aside>

    <main class="ga-pg-center">
      <div class="ga-seg ga-mode" role="tablist" aria-label="Mode">
        <button type="button" role="tab" class="ga-btn" :aria-selected="mode === 'edit'" :class="{ active: mode === 'edit' }" @click="mode = 'edit'">Edit</button>
        <button type="button" role="tab" class="ga-btn" :aria-selected="mode === 'run'" :class="{ active: mode === 'run' }" @click="mode = 'run'">Run {{ algo?.name }}</button>
      </div>
      <div v-show="mode === 'edit'" class="ga-playground-canvas">
        <EditableGraph ref="editor" v-model="graph" fill @select="(s) => (sel = s)">
          <template #toolbar>
            <button type="button" class="ga-btn" title="Fit the drawing to the canvas" @click="editor?.resetView()">Fit</button>
          </template>
        </EditableGraph>
      </div>
      <div v-if="mode === 'run'" class="ga-pg-run">
        <PlayerWidget :key="algoId + JSON.stringify(algoParams)" :doc="parseGraph('show: pseudocode state residual')" :graph="runGraph" :algo="algoId" :params="algoParams" :height="420" :pseudocode="runPseudo" />
      </div>
      <p class="ga-pg-message" role="status" aria-live="polite">{{ message }}</p>
    </main>

    <aside class="ga-pg-right" aria-label="Tools">
      <div class="ga-tabs" role="tablist">
        <button v-for="t in (['inspect', 'properties', 'algorithms', 'text', 'io'] as const)" :key="t" type="button" role="tab" class="ga-tab"
          :aria-selected="tab === t" :class="{ active: tab === t }" @click="tab = t">
          {{ { inspect: 'Inspect', properties: 'Properties', algorithms: 'Algorithms', text: 'Text', io: 'Import / export' }[t] }}
        </button>
      </div>

      <section v-if="tab === 'inspect'" class="ga-tabpanel">
        <p v-if="!selVertex && !selEdge" class="ga-muted">Select a vertex or an edge with the Move tool to edit it.</p>
        <template v-if="selVertex">
          <h3>Vertex {{ selVertex.id }}</h3>
          <label class="ga-field">Label (math in $…$)
            <input :value="selVertex.label ?? ''" type="text" @change="setVertexLabel(($event.target as HTMLInputElement).value)" />
          </label>
          <div class="ga-chips">
            <button v-for="c in CLASSES" :key="c" type="button" class="ga-chip" :class="{ active: hasClass('vertex', c) }" :aria-pressed="hasClass('vertex', c)" @click="toggleClass('vertex', c)">{{ c }}</button>
          </div>
        </template>
        <template v-if="selEdge">
          <h3>Edge {{ selEdge.tail[0] }}{{ selEdge.directed ? '→' : '–' }}{{ selEdge.head[0] }}</h3>
          <div class="ga-field-row">
            <label v-for="k in ['w', 'c', 'f']" :key="k" class="ga-field ga-small">{{ { w: 'weight w', c: 'capacity c', f: 'flow f' }[k] }}
              <input :value="selEdge.data[k] ?? ''" type="text" inputmode="decimal" @change="setEdgeAttr(k, ($event.target as HTMLInputElement).value)" />
            </label>
          </div>
          <label class="ga-field">Label
            <input :value="selEdge.label ?? ''" type="text" @change="setEdgeAttr('label', ($event.target as HTMLInputElement).value)" />
          </label>
          <div class="ga-chips">
            <button v-for="c in CLASSES.filter(x => !['source', 'sink'].includes(x))" :key="c" type="button" class="ga-chip" :class="{ active: hasClass('edge', c) }" :aria-pressed="hasClass('edge', c)" @click="toggleClass('edge', c)">{{ c }}</button>
          </div>
        </template>
        <details class="ga-help">
          <summary>How to edit</summary>
          <ul>
            <li><strong>Move</strong> (M): drag vertices, click to select, drag the background to pan, scroll to zoom. Shift-drag from a vertex draws an edge.</li>
            <li><strong>Vertex</strong> (V): click empty space. Double-click also adds a vertex in Move mode.</li>
            <li><strong>Edge</strong> (E): drag between vertices, or click two vertices (the same vertex twice for a loop).</li>
            <li><strong>Delete</strong> (D), or select and press Delete. Undo with Ctrl+Z.</li>
          </ul>
        </details>
      </section>

      <section v-if="tab === 'properties'" class="ga-tabpanel">
        <dl class="ga-props">
          <template v-for="p in props" :key="p.id">
            <dt><RichText :text="p.name" /></dt>
            <dd><RichText :text="p.value" /></dd>
          </template>
        </dl>
      </section>

      <section v-if="tab === 'algorithms'" class="ga-tabpanel">
        <label class="ga-field">Algorithm
          <select v-model="algoId">
            <option v-for="a in Object.values(ALGORITHMS)" :key="a.id" :value="a.id">{{ a.name }}</option>
          </select>
        </label>
        <template v-for="name in algo?.params ?? []" :key="name">
          <label v-if="['source', 'sink', 'root'].includes(name)" class="ga-field">{{ name }}
            <select v-model="algoParams[name]">
              <option v-for="v in graph.vertices" :key="v.id" :value="v.id">{{ v.label?.replace(/\$/g, '') ?? v.id }}</option>
            </select>
          </label>
          <label v-else-if="name === 'choice'" class="ga-field">augmenting path choice
            <select v-model="algoParams.choice"><option value="dfs">depth-first</option><option value="bfs">shortest (BFS)</option><option value="widest">widest</option></select>
          </label>
          <label v-else-if="name === 'seq'" class="ga-field">degree sequence
            <input v-model="algoParams.seq" type="text" />
          </label>
        </template>
        <p v-if="algoNote" class="ga-muted">{{ algoNote }}</p>
        <button type="button" class="ga-btn ga-btn-primary ga-wide" @click="run">Run step by step</button>
      </section>

      <section v-if="tab === 'text'" class="ga-tabpanel">
        <p class="ga-muted">The graph as text: <code>a -- b [w=3]</code>, <code>a -> b [c=5]</code>, <code>use: K(5)</code>, <code>v [label="$v_1$"] @(0, 1)</code>. Changes apply as you type.</p>
        <textarea v-model="text" class="ga-code" spellcheck="false" aria-label="Graph as text" rows="16"
          @focus="textFocused = true" @blur="textFocused = false" @input="onText" />
        <ul v-if="textErrors.length" class="ga-errors" role="alert"><li v-for="(e, i) in textErrors" :key="i">{{ e }}</li></ul>
      </section>

      <section v-if="tab === 'io'" class="ga-tabpanel">
        <div class="ga-field-row ga-wrap">
          <button type="button" class="ga-btn" @click="exportAs('dsl')">DSL</button>
          <button type="button" class="ga-btn" @click="exportAs('tikz')">TikZ</button>
          <button type="button" class="ga-btn" @click="exportAs('matrix')">Adjacency matrix</button>
          <button type="button" class="ga-btn" @click="exportAs('list')">Adjacency list</button>
          <button type="button" class="ga-btn" @click="exportAs('json')">JSON</button>
        </div>
        <textarea v-model="ioText" class="ga-code" spellcheck="false" rows="12" aria-label="Import or export text"
          placeholder="Export with the buttons above, or paste DSL, JSON, an adjacency matrix or an adjacency list here and press Import." />
        <div class="ga-field-row ga-wrap">
          <button type="button" class="ga-btn ga-btn-primary" @click="doImport">Import</button>
          <button type="button" class="ga-btn" :disabled="!ioText" @click="copy(ioText, 'Text')">Copy</button>
        </div>
        <h3>Image and link</h3>
        <div class="ga-field-row ga-wrap">
          <button type="button" class="ga-btn" @click="downloadSVG">Download SVG</button>
          <button type="button" class="ga-btn" @click="downloadPNG">Download PNG</button>
          <button type="button" class="ga-btn" @click="shareLink">Copy share link</button>
        </div>
      </section>
    </aside>
  </div>
</template>
