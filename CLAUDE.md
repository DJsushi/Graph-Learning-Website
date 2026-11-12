# Graph Atlas (graph learning website)

Learning site for the Graph Theory and Graph Algorithms (MA015) courses: concept pages with
interactive figures, a generated reference, practice, exam prep and a graph playground.
Vue 3 + TypeScript + VitePress, static hosting.

The lessons are being rebuilt from one page per lecture into one page per concept. The plan and
the task board are in `RESTRUCTURE.md`. If you are asked to continue the restructure, read its
§1 and §2 first and nothing else.

Documents. Read the one your work needs, not all of them:

- `RESTRUCTURE.md` — plan, task board, how to orchestrate agents.
- `BACKLOG.md` — every known defect and missing feature, by id.
- `CONTENT_CONVENTIONS.md` — how content is written.
- `GRAPH_DSL.md` — the text format of figures.
- `ARCHITECTURE.md` — where things live in the code.

Rules:

- Work on branch `restructure`. Never push. `main` is the live site.
- Never rename a container id, a figure id or a lecture slug.
- Never change the text of a statement or a proof while moving it or working on the app. Fix a
  real mathematical error minimally and mark it `<!-- REVIEW: what and why -->`.
- `content/` is the source of truth. When code and content disagree, fix the code, or change
  the convention on purpose.
- `resources/` holds the lecture PDFs (the graph-theory notes are handwritten scans). Not
  published and not committed.
- Commit messages are Conventional Commits.

Commands: `npm run check` (validator + tests + type check; the gate for every change),
`npm run dev`, `npm run build`.
In the Claude Code sandbox: run scripts with `node --import tsx` (plain `tsx` needs an IPC
socket), and start dev/preview servers outside the sandbox so a browser can reach them.
