import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'katex/dist/katex.min.css'
import './custom.css'
import GraphBlock from '@gv/GraphBlock.vue'
import QuizBlock from '@gv/QuizBlock.vue'
import LessonHeader from './LessonHeader.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(LessonHeader) }),
  enhanceApp({ app }) {
    app.component('GraphBlock', GraphBlock)
    app.component('QuizBlock', QuizBlock)
  },
} satisfies Theme
