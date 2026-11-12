# Graph Atlas

Learning site for Graph Theory (P. Hliněný) and MA015 Graph Algorithms (Jan Obdržálek), FI MUNI.
VitePress + Vue 3 + TypeScript. See ARCHITECTURE.md, CONTENT_CONVENTIONS.md, GRAPH_DSL.md.

The lessons are being rebuilt from one page per lecture into one page per concept: see
RESTRUCTURE.md (plan and task board) and BACKLOG.md (known defects and missing features).

## Run

    npm install
    npm run dev        # http://localhost:5173/
    npm test           # graph-core tests (checks numbers claimed in lessons)
    npm run validate   # content validator
    npm run check      # validator + tests + type check (run before every commit)
    npm run build      # validate + static build into .vitepress/dist

## What is here

- `/theory/`, `/algorithms/`: 8 lecture pages with definitions and theorems, full proofs, figures,
  step-by-step algorithm players, editable sandboxes, exercises and quick checks.
- `/reference/`: definitions, theorems (with collapsible proofs) and algorithms, generated from the lessons.
- `/practice/`: exercises per lesson with progress (saved in the browser, exportable), random drills.
- `/exam/`: flashcards for every definition and theorem, mixed self-test.
- `/playground`: full-screen editor with generators, layouts, inspector, live properties, all algorithms,
  text editing, import/export (DSL, JSON, TikZ, adjacency matrix/list), SVG/PNG download, share links.

## Adding a lecture

Follow CONTENT_CONVENTIONS.md (§1 for where files go), then `npm run check`.
New algorithms, exercise checks or live properties go into the registries in `packages/graph-core/src/`.

## Deploy

1. Create a GitHub repository named `graph-learning-website` and push `main`.
2. In the repository settings, Pages, set the source to "GitHub Actions".
3. The workflow `.github/workflows/deploy.yml` tests, validates, builds and publishes on every push.
   The site is served from a custom domain (graphs.gaens.dev), so the workflow builds with `BASE=/`. For a plain project site set `BASE=/<repo-name>/`.

## Known limitations

- SOURCE UNCLEAR: content/theory/01-basic-notions.md, the second pentagon drawing of lecture 1 p.4 is hard to
  read; the lesson uses a drawing that is certainly isomorphic.
- All lessons are `status: draft`: written from your notes and slides and checked by tests where numbers are
  involved, but not proofread by a human.
- Planar layouts and `dual(...)` are not implemented (not used by any lesson); `layout: planar` falls back to force.
- PNG export may be blocked by some browsers for labels rendered with KaTeX; SVG export always works.
