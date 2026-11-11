import { expect, it } from 'vitest'
import { renderRich } from '../src/rich'

it('a double quote in a link URL cannot end the href attribute', () => {
  const html = renderRich('[x](/a"onmouseover="y)')
  expect(html).toContain('href="/a&quot;onmouseover=&quot;y"')
  expect(html).not.toMatch(/href="[^"]*"[^>]*onmouseover/)
})
