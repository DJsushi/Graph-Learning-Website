import { defineConfig, type DefaultTheme } from 'vitepress'
import path from 'node:path'
import { loadContent, COURSE_NAMES, type Course } from '../packages/content/index'
import { setupMarkdown, ROOT } from './markdown'

const base = process.env.BASE ?? '/graph-learning-website/'
const index = loadContent(ROOT)

function courseSidebar(course: Course): DefaultTheme.SidebarItem[] {
  return [
    { text: COURSE_NAMES[course], link: `/${course}/` },
    {
      text: 'Lessons',
      items: index.lessons.filter(l => l.course === course).sort((a, b) => a.lecture - b.lecture)
        .map(l => ({ text: `${l.lecture}. ${l.title}`, link: `/${l.path}` })),
    },
    {
      text: 'More',
      items: [
        { text: 'Reference', link: '/reference/' },
        { text: `Practice`, link: `/practice/` },
      ],
    },
  ]
}

export default defineConfig({
  title: 'Graph Atlas',
  description: 'Graph theory and graph algorithms: full courses, a reference of every definition and theorem, practice, and an interactive graph playground.',
  lang: 'en-GB',
  base,
  cleanUrls: true,
  lastUpdated: false,
  srcExclude: [
    'README.md', 'PLAN.md', 'GRAPH_DSL.md', 'CONTENT_CONVENTIONS.md', 'CLAUDE.md',
    'resources/**', 'packages/**', 'scripts/**', 'node_modules/**',
  ],
  rewrites: {
    'content/:course/:page': ':course/:page',
    'site/:page': ':page',
    'site/:dir/:page': ':dir/:page',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#2f5d8a' }],
  ],
  markdown: {
    config: md => setupMarkdown(md),
    headers: { level: [2, 3] },
  },
  themeConfig: {
    logo: { src: '/favicon.svg', alt: '' },
    nav: [
      { text: 'Theory', link: '/theory/', activeMatch: '^/theory/' },
      { text: 'Algorithms', link: '/algorithms/', activeMatch: '^/algorithms/' },
      { text: 'Reference', link: '/reference/', activeMatch: '^/reference/' },
      { text: 'Practice', link: '/practice/', activeMatch: '^/practice/' },
      { text: 'Exam prep', link: '/exam', activeMatch: '^/exam' },
      { text: 'Playground', link: '/playground', activeMatch: '^/playground' },
    ],
    sidebar: {
      '/theory/': courseSidebar('theory'),
      '/algorithms/': courseSidebar('algorithms'),
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Definitions', link: '/reference/definitions' },
            { text: 'Theorems and lemmas', link: '/reference/theorems' },
            { text: 'Algorithms', link: '/reference/algorithms' },
          ],
        },
      ],
      '/practice/': [
        { text: 'Practice', items: [{ text: 'Overview', link: '/practice/' }, { text: 'Random drills', link: '/practice/drills' }] },
        ...(['theory', 'algorithms'] as Course[]).map(c => ({
          text: COURSE_NAMES[c],
          items: index.lessons.filter(l => l.course === c).sort((a, b) => a.lecture - b.lecture)
            .map(l => ({ text: `${l.lecture}. ${l.title}`, link: `/practice/${l.slug}` })),
        })),
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local' },
    footer: {
      message: 'Unofficial student resource based on the lectures <em>Graph Theory</em> (P. Hliněný) and <em>MA015 Graph Algorithms</em> (Jan Obdržálek), Faculty of Informatics, Masaryk University.',
      copyright: 'Errors are ours, not the lecturers\'.',
    },
    docFooter: { prev: 'Previous', next: 'Next' },
  },
  vite: {
    resolve: {
      alias: {
        '@core': path.join(ROOT, 'packages/graph-core/src'),
        '@gv': path.join(ROOT, 'packages/graph-vue/src'),
        '@content': path.join(ROOT, 'packages/content'),
      },
    },
    server: { fs: { allow: [ROOT] } },
  },
})
