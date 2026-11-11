import { expect, it } from 'vitest'
import { renderRich } from '../src/rich'

it('a double quote in a link URL cannot end the href attribute', () => {
  const html = renderRich('[x](/a"onmouseover="y)')
  expect(html).toContain('href="/a&quot;onmouseover=&quot;y"')
  expect(html).not.toMatch(/href="[^"]*"[^>]*onmouseover/)
})

it('renders a mark link [[fig:id#mark|text]] as a mark button, with math in the text', () => {
  const html = renderRich('Look at [[fig:a01-x#cut|the $k$ edges]] now.')
  expect(html).toContain('<button type="button" class="ga-mark" data-fig="a01-x" data-mark="cut" aria-pressed="false">the <span class="katex">')
  expect(html).toMatch(/edges<\/button> now\.$/)
  expect(html).not.toContain('[[')
})
