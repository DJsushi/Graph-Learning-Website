// Writes content/entries.lock.json from the current content. `--accept <key>` updates one entry (an id or `<id>#proof<n>`).
// Run: node --import tsx scripts/lock-entries.ts [--accept <key>]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent } from '../packages/content/index'
import { entryHashes } from '../packages/content/lock'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const file = path.join(root, 'content/entries.lock.json')
const current = entryHashes(loadContent(root))
const write = (lock: Record<string, string>) => fs.writeFileSync(file, JSON.stringify(lock, null, 2) + '\n')

const i = process.argv.indexOf('--accept')
if (i < 0) {
  write(current)
  console.log(`locked ${Object.keys(current).length} entries`)
} else {
  const key = process.argv[i + 1]
  if (!key || !(key in current)) { console.error(`error: no such entry: ${key}`); process.exit(1) }
  const lock: Record<string, string> = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
  write(Object.fromEntries(Object.entries({ ...lock, [key]: current[key] }).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))))
  console.log(`accepted ${key}`)
}
