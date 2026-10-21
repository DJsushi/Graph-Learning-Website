import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'packages/graph-core/src'),
      '@gv': path.resolve(__dirname, 'packages/graph-vue/src'),
    },
  },
  test: { include: ['packages/**/test/**/*.test.ts'] },
})
