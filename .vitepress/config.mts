import { defineConfig, type DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { loadContent, loadTopics, courseChapters, lectureLessons, COURSE_NAMES, type Course } from '../packages/content/index'
import { setupMarkdown, ROOT } from './markdown'
import { topicSections } from './search'

import { BASE } from './base'

const base = BASE
const index = loadContent(ROOT)
const topics = loadTopics(ROOT)

/** Everything the sidebars are built from. The sidebar is fixed when the config loads (S8), so the dev server restarts when this changes. */
const navKey = (ix: ReturnType<typeof loadContent>, tp: ReturnType<typeof loadTopics>) => JSON.stringify([
  tp.map(t => [t.slug, t.course, t.title]),
  (['theory', 'algorithms'] as Course[]).map(c => [
    courseChapters(ix, tp, c).map(ch => [ch.topic.slug, ch.pages.map(p => [p.path, p.title])]),
    lectureLessons(ix, c).map(l => [l.path, l.slug, l.lecture, l.title]),
  ]),
])
const currentNavKey = navKey(index, topics)

function courseSidebar(course: Course): DefaultTheme.SidebarItem[] {
  return [
    { text: COURSE_NAMES[course], link: `/${course}/` },
    ...courseChapters(index, topics, course).map(({ topic, pages }) => ({
      text: topic.title, collapsed: false,
      items: pages.map(p => ({ text: p.title, link: `/${p.path}` })),
    })),
    {
      text: 'Lectures',
      items: lectureLessons(index, course).map(l => ({ text: `${l.lecture}. ${l.title}`, link: `/${l.path}` })),
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
    'README.md', 'ARCHITECTURE.md', 'BACKLOG.md', 'RESTRUCTURE.md', 'GRAPH_DSL.md', 'CONTENT_CONVENTIONS.md', 'CLAUDE.md',
    '.claude/**',
    'resources/**', 'packages/**', 'scripts/**', 'node_modules/**',
  ],
  rewrites: {
    'content/:course/:page': ':course/:page',
    'content/:course/:chapter/:page': ':course/:chapter/:page',
    'site/:page': ':page',
    'site/:dir/:page': ':dir/:page',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#2f5d8a' }],
  ],
  markdown: {
    // container attributes {#id title=…} are parsed by our own plugin, not markdown-it-attrs
    attrs: { disable: true },
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
      { text: 'Exam prep', link: '/exam/', activeMatch: '^/exam/' },
      { text: 'Playground', link: '/playground', activeMatch: '^/playground' },
      { text: 'Settings', link: '/settings', activeMatch: '^/settings' },
    ],
    sidebar: {
      '/theory/': courseSidebar('theory'),
      '/algorithms/': courseSidebar('algorithms'),
      '/reference/': [
        {
          text: 'Reference',
          items: [{ text: 'Overview', link: '/reference/' }],
        },
        { text: 'Topics', items: topics.map(t => ({ text: t.title, link: `/reference/${t.slug}` })) },
        {
          text: 'Lists',
          items: [
            { text: 'Definitions', link: '/reference/definitions' },
            { text: 'Theorems and lemmas', link: '/reference/theorems' },
            { text: 'Algorithms', link: '/reference/algorithms' },
          ],
        },
      ],
      '/exam/': [
        { text: 'Exam prep', items: [{ text: 'Overview', link: '/exam/' }, { text: 'Flashcards', link: '/exam/flashcards' }, { text: 'Mixed self-test', link: '/exam/self-test' }] },
      ],
      '/practice/': [
        { text: 'Practice', items: [{ text: 'Overview', link: '/practice/' }, { text: 'Random drills', link: '/practice/drills' }] },
        ...(['theory', 'algorithms'] as Course[]).map(c => ({
          text: COURSE_NAMES[c],
          items: lectureLessons(index, c)
            .map(l => ({ text: `${l.lecture}. ${l.title}`, link: `/practice/${l.slug}` })),
        })),
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
    search: {
      provider: 'local',
      options: { miniSearch: { _splitIntoSections: (file, html) => (html ? undefined : topicSections(file)) as any } },
    },
    footer: {
      message: 'Unofficial student resource based on the lectures <em>Graph Theory</em> (P. Hliněný) and <em>MA015 Graph Algorithms</em> (Jan Obdržálek), Faculty of Informatics, Masaryk University.',
      copyright: 'Errors are ours, not the lecturers\'.',
    },
    docFooter: { prev: 'Previous', next: 'Next' },
  },
  vite: {
    plugins: [{
      name: 'ga-restart-on-new-pages',
      configureServer(server) {
        const config = path.join(ROOT, '.vitepress/config.mts')
        const check = (file: string) => {
          if (!/[\\/]content[\\/].*\.(md|ya?ml)$/.test(file)) return
          try {
            if (navKey(loadContent(ROOT), loadTopics(ROOT)) !== currentNavKey) fs.utimesSync(config, new Date(), new Date())   // VitePress restarts when the config file changes
          } catch { /* a half-saved file: the next save checks again */ }
        }
        for (const ev of ['add', 'unlink', 'change']) server.watcher.on(ev, check)
      },
    }],
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
