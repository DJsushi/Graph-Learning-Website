// The review state shown in the page header. Pure and browser-safe: the theme imports it.
export function statusTag(status: unknown): { status: 'reviewed' | 'draft'; text: string; note: string } | undefined {
  if (status === 'reviewed') return { status, text: 'Checked', note: 'A second reader checked the mathematics on this page.' }
  if (status === 'draft') return { status, text: 'Not checked yet', note: 'Old text from before the rebuild. It may contain errors; trust the lecture notes over it.' }
  return undefined
}
