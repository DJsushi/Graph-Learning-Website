# Graph learning website

Learning site for the Graph Theory and Graph Algorithms (MA015) courses: written courses,
generated reference, practice, exam prep, and a graph playground. Vue 3 + TypeScript +
VitePress, static hosting.

Read before working:

- `PLAN.md` — architecture, packages, interfaces, registries, build order.
- `GRAPH_DSL.md` — the graph text format used in content and the playground.
- `CONTENT_CONVENTIONS.md` — the Markdown format of the lessons.

Rules:

- `content/` is the source of truth. The course text was written first (with figures as
  `graph` DSL blocks); the code must render it. Do not edit proofs or statements while
  implementing the app; if a figure block is invalid, fix the block minimally and note it.
- Never rename figure ids, container ids or lesson slugs.
- Required algorithms / predicates / live properties: grep `algo:`, `check:`, `live:` in
  `content/`.
- `resources/` holds the original lecture PDFs (graph-theory notes are handwritten scans). Not
  published.

Commands: `npm run dev`, `npm test`, `npm run validate`, `npm run typecheck`, `npm run build`.
In the Claude Code sandbox: run scripts with `node --import tsx` (plain `tsx` needs an IPC socket), and start
dev/preview servers outside the sandbox so a browser can reach them.
