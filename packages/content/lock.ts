// Entry lock (RESTRUCTURE.md §4.1): SHA-256 of every statement container and every proof, keyed by id and `<id>#proof<n>`.
import { createHash } from 'node:crypto'
import type { ContentIndex } from './index'
import { STATEMENT_TYPES } from './index'

const LOCKED_TYPES = new Set([...STATEMENT_TYPES, 'definition', 'algorithm'])

/** Hash of a container's source text, line ends normalised and trailing spaces removed. */
const hash = (raw: string) =>
  createHash('sha256').update(raw.replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '')).digest('hex')

/** Current hashes of all locked entries, keys sorted. */
export function entryHashes(ix: ContentIndex): Record<string, string> {
  const out: Record<string, string> = {}
  const proofs = new Map<string, number>()
  for (const c of ix.containers) {
    if (c.id && LOCKED_TYPES.has(c.type)) out[c.id] = hash(c.raw)
    else if (c.type === 'proof' && c.forId) {
      const n = (proofs.get(c.forId) ?? 0) + 1
      proofs.set(c.forId, n)
      out[`${c.forId}#proof${n}`] = hash(c.raw)
    }
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}

/** Error messages for locked entries that are gone or whose text differs. */
export function lockErrors(locked: Record<string, string>, current: Record<string, string>): string[] {
  return Object.entries(locked).flatMap(([key, h]) =>
    !(key in current) ? [`content/entries.lock.json: locked entry ${key} is gone`]
      : current[key] !== h ? [`content/entries.lock.json: locked entry ${key} changed (if on purpose: node --import tsx scripts/lock-entries.ts --accept ${key})`]
        : [])
}
