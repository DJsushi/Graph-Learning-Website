# Graph Atlas

Learning site for Graph Theory (P. Hliněný) and MA015 Graph Algorithms (Jan Obdržálek), FI MUNI.
VitePress + Vue 3 + TypeScript. See PLAN.md, GRAPH_DSL.md, CONTENT_CONVENTIONS.md.

## Run

    npm install
    npm run dev        # http://localhost:5173/graph-learning-website/
    npm test           # graph-core tests (checks numbers claimed in lessons)
    npm run validate   # content validator
    npm run build      # validate + static build into .vitepress/dist

## What is here

- `/theory/`, `/algorithms/`: 7 lessons with numbered definitions and theorems, full proofs, figures,
  step-by-step algorithm players, editable sandboxes, exercises and quick checks.
- `/reference/`: definitions, theorems (with collapsible proofs) and algorithms, generated from the lessons.
- `/practice/`: exercises per lesson with progress (saved in the browser, exportable), random drills.
- `/exam/`: flashcards for every definition and theorem, mixed self-test.
- `/playground`: full-screen editor with generators, layouts, inspector, live properties, all algorithms,
  text editing, import/export (DSL, JSON, TikZ, adjacency matrix/list), SVG/PNG download, share links.

## Adding a lecture

Add `content/<course>/NN-title.md` following CONTENT_CONVENTIONS.md, then `npm run validate` and `npm test`.
New algorithms, exercise checks or live properties go into the registries in `packages/graph-core/src/`.

## Deploy

1. Create a GitHub repository named `graph-learning-website` and push `main`.
2. In the repository settings, Pages, set the source to "GitHub Actions".
3. The workflow `.github/workflows/deploy.yml` tests, validates, builds and publishes on every push.
   The base path is taken from the repository name (`BASE` env var); for a custom domain set `BASE=/`.

## Known limitations

- SOURCE UNCLEAR: content/theory/01-basic-notions.md, the second pentagon drawing of lecture 1 p.4 is hard to
  read; the lesson uses a drawing that is certainly isomorphic.
- All lessons are `status: draft`: written from your notes and slides and checked by tests where numbers are
  involved, but not proofread by a human.
- Planar layouts and `dual(...)` are not implemented (not used by any lesson); `layout: planar` falls back to force.
- PNG export may be blocked by some browsers for labels rendered with KaTeX; SVG export always works.
