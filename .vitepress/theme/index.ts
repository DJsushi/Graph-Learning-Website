import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'katex/dist/katex.min.css'
import './custom.css'
import GraphBlock from '@gv/GraphBlock.vue'
import QuizBlock from '@gv/QuizBlock.vue'
import LessonHeader from './LessonHeader.vue'
import SiteCredit from './SiteCredit.vue'
import { h } from 'vue'
import HomePage from './components/HomePage.vue'
import CourseIndex from './components/CourseIndex.vue'
import PracticeOverview from './components/PracticeOverview.vue'
import FlashcardDeck from './components/FlashcardDeck.vue'
import Flashcard from './components/Flashcard.vue'
import RandomDrills from './components/RandomDrills.vue'
import QuizSession from './components/QuizSession.vue'
import Playground from './components/Playground.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(LessonHeader), 'doc-footer-before': () => h(SiteCredit) }),
  enhanceApp({ app }) {
    app.component('GraphBlock', GraphBlock)
    app.component('QuizBlock', QuizBlock)
    for (const [name, c] of Object.entries({ HomePage, CourseIndex, PracticeOverview, FlashcardDeck, Flashcard, RandomDrills, QuizSession, Playground })) app.component(name, c)
  },
} satisfies Theme
