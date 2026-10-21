import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'katex/dist/katex.min.css'
import './custom.css'
import GraphBlock from './stub/GraphBlock.vue'
import QuizBlock from './stub/QuizBlock.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GraphBlock', GraphBlock)
    app.component('QuizBlock', QuizBlock)
  },
} satisfies Theme
