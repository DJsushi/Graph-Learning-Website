// Keep in sync with KATEX_MACROS in .vitepress/markdown.ts (CONTENT_CONVENTIONS.md §3).
export const KATEX_MACROS: Record<string, string> = {
  '\\N': '\\mathbb{N}',
  '\\Z': '\\mathbb{Z}',
  '\\R': '\\mathbb{R}',
  '\\abs': '\\left\\lvert #1 \\right\\rvert',
  '\\set': '\\left\\{ #1 \\right\\}',
  '\\ol': '\\overline{#1}',
  '\\O': '\\mathcal{O}',
}
