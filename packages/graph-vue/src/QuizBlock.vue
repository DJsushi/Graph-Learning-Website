<script setup lang="ts">
// Quiz container: the question and choices are rendered Markdown in the slot; this component adds the interaction.
import { onMounted, ref } from 'vue'
import { loadProgress, markAttempted, markSolved, progress } from './progress'

const props = defineProps<{ qid?: string; answer?: string; tolerance?: string }>()
const root = ref<HTMLElement>()
const answered = ref(false)
const correct = ref(false)
const value = ref('')
const multi = ref(false)
const feedback = ref('')
let choices: HTMLElement[] = []

onMounted(() => {
  loadProgress()
  if (props.qid && progress.solved[props.qid]) correct.value = true
  choices = [...(root.value?.querySelectorAll<HTMLElement>('li.ga-choice') ?? [])]
  multi.value = choices.filter(c => c.dataset.correct === 'true').length > 1
  choices.forEach((li, i) => {
    li.setAttribute('role', multi.value ? 'checkbox' : 'radio')
    li.setAttribute('tabindex', i === 0 ? '0' : '-1')
    li.setAttribute('aria-checked', 'false')
    li.addEventListener('click', () => choose(li))
    li.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choose(li) }
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
        ev.preventDefault()
        const j = (i + (ev.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length
        choices[j].focus()
      }
    })
    if (i > 0) li.setAttribute('tabindex', '0')
  })
  const list = root.value?.querySelector('ul.ga-choices')
  list?.setAttribute('role', multi.value ? 'group' : 'radiogroup')
})

function choose(li: HTMLElement) {
  if (multi.value) {
    if (answered.value) return
    li.setAttribute('aria-checked', li.getAttribute('aria-checked') === 'true' ? 'false' : 'true')
    li.classList.toggle('is-picked')
    return
  }
  for (const c of choices) { c.setAttribute('aria-checked', 'false'); c.classList.remove('is-picked', 'is-right', 'is-wrong') }
  li.setAttribute('aria-checked', 'true')
  li.classList.add('is-picked', li.dataset.correct === 'true' ? 'is-right' : 'is-wrong')
  grade(li.dataset.correct === 'true')
}

function checkMulti() {
  let ok = true
  for (const c of choices) {
    const picked = c.getAttribute('aria-checked') === 'true'
    const right = c.dataset.correct === 'true'
    if (picked !== right) ok = false
    if (right) c.classList.add('is-right')
    else if (picked) c.classList.add('is-wrong')
  }
  grade(ok)
}

function checkAnswer() {
  const want = (props.answer ?? '').trim()
  const got = value.value.trim().replace(',', '.')
  const tol = Number(props.tolerance ?? 1e-9)
  const ok = got !== '' && (isFinite(Number(want)) ? Math.abs(Number(got) - Number(want)) <= tol : got.toLowerCase() === want.toLowerCase())
  grade(ok)
}

function grade(ok: boolean) {
  answered.value = true
  correct.value = ok
  feedback.value = ok ? 'Correct.' : props.answer !== undefined ? `Not quite. The answer is ${props.answer}.` : 'Not quite.'
  if (props.qid) ok ? markSolved(props.qid) : markAttempted(props.qid)
}

function retry() {
  answered.value = false
  feedback.value = ''
  value.value = ''
  for (const c of choices) { c.setAttribute('aria-checked', 'false'); c.classList.remove('is-picked', 'is-right', 'is-wrong') }
}
</script>

<template>
  <section ref="root" class="ga-quiz" :class="{ answered, 'is-correct': answered && correct, 'is-incorrect': answered && !correct }" :id="qid ? `q-${qid.replace(/[^\w-]/g, '-')}` : undefined" aria-label="Quiz question">
    <div class="ga-quiz-head">
      <span class="ga-box-kind">Quick check</span>
      <span v-if="multi && !answered" class="ga-quiz-note">Select all that apply</span>
    </div>
    <div class="ga-quiz-body"><slot /></div>
    <div class="ga-quiz-actions">
      <template v-if="answer !== undefined && !answered">
        <label class="ga-answer">
          <span>Your answer</span>
          <input v-model="value" type="text" inputmode="decimal" autocomplete="off" @keydown.enter="checkAnswer" />
        </label>
        <button type="button" class="ga-btn ga-btn-primary" @click="checkAnswer">Check</button>
      </template>
      <button v-if="multi && !answered" type="button" class="ga-btn ga-btn-primary" @click="checkMulti">Check</button>
      <span v-if="feedback" class="ga-feedback-inline" :class="correct ? 'ga-ok' : 'ga-no'" role="status">{{ feedback }}</span>
      <button v-if="answered" type="button" class="ga-btn ga-btn-quiet" @click="retry">Try again</button>
    </div>
  </section>
</template>
