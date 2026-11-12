// The review state shown in the page header. Pure and browser-safe: the theme imports it.
export function statusTag(status: unknown): { status: 'reviewed' | 'draft'; text: string; note: string } | undefined {
  if (status === 'reviewed') return { status, text: 'Checked', note: 'A second reader checked the mathematics on this page.' }
  if (status === 'draft') return { status, text: 'Not checked yet', note: 'Old text from before the rebuild. It may contain errors; trust the lecture notes over it.' }
  return undefined
}

/** `audited: 2026-11-13` as "2026-11-13". YAML reads an unquoted date as a Date, so take both. Anything else is undefined. */
export function auditedDate(v: unknown): string | undefined {
  const s = v instanceof Date && !isNaN(+v) ? v.toISOString().slice(0, 10) : v
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined
}

/** The tag for a page whose text was compared with the lecture notes. */
export function auditTag(audited: unknown): { text: string; title: string } | undefined {
  const d = auditedDate(audited)
  return d ? { text: 'Matches the lecture notes', title: `Compared with the lecture notes on ${d}` } : undefined
}
