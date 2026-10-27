import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'katex/dist/katex.min.css'
import './custom.css'
import GraphBlock from '@gv/GraphBlock.vue'
import QuizBlock from '@gv/QuizBlock.vue'
import LessonHeader from './LessonHeader.vue'
import SiteCredit from './SiteCredit.vue'
import LessonDone from './LessonDone.vue'
import SidebarMarks from './SidebarMarks.vue'
import RefPreview from './RefPreview.vue'
import { h } from 'vue'
import HomePage from './components/HomePage.vue'
import CourseIndex from './components/CourseIndex.vue'
import PracticeOverview from './components/PracticeOverview.vue'
import FlashcardDeck from './components/FlashcardDeck.vue'
import Flashcard from './components/Flashcard.vue'
import RandomDrills from './components/RandomDrills.vue'
import QuizSession from './components/QuizSession.vue'
import Playground from './components/Playground.vue'
import ReferenceSearch from './components/ReferenceSearch.vue'
import Settings from './components/Settings.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(LessonHeader),
    'doc-footer-before': () => [h(LessonDone, { footer: true }), h(SiteCredit)],
    'sidebar-nav-after': () => h(SidebarMarks),
    'layout-bottom': () => h(RefPreview),
  }),
  enhanceApp({ app }) {
    app.component('GraphBlock', GraphBlock)
    app.component('QuizBlock', QuizBlock)
    for (const [name, c] of Object.entries({ HomePage, CourseIndex, PracticeOverview, FlashcardDeck, Flashcard, RandomDrills, QuizSession, Playground, ReferenceSearch, Settings })) app.component(name, c)
  },
} satisfies Theme
