# Graph Atlas

Learning site for Graph Theory (P. Hliněný) and MA015 Graph Algorithms (Jan Obdržálek), FI MUNI.
VitePress + Vue 3 + TypeScript. See PLAN.md, GRAPH_DSL.md, CONTENT_CONVENTIONS.md.

## Run

    npm install
    npm run dev        # http://localhost:5173/graph-learning-website/
    npm test           # graph-core tests (checks numbers claimed in lessons)
    npm run validate   # content validator
    npm run build      # validate + static build into .vitepress/dist

## Status (work in progress)

Done: all 7 lessons (content/), graph core (DSL parser, generators, layouts, 11 algorithms,
predicates, properties, import/export), content validator, 34 tests, VitePress site rendering
lessons with numbered containers, [[refs]], KaTeX, pseudocode, and graph widgets
(figure, stepper, player, editable sandbox, exercise, quiz).

Not done yet:
- Course landing pages (site/theory/index.md, site/algorithms/index.md) and home page design
- Generated /reference/ pages (plan: VitePress dynamic routes from container sources)
- /practice/ and /exam/ (flashcards) pages
- /playground/ full-screen app (EditableGraph + panels + io.ts import/export)
- GitHub Actions deploy workflow (.github/workflows), base path /graph-learning-website/
- Visual QA in the browser (light/dark, 375px), apple-design accessibility pass
- SOURCE UNCLEAR: content/theory/01-basic-notions.md (pentagon isomorphism drawing, lecture 1 p.4)

## Deploy (to do by the author)
Create GitHub repo `graph-learning-website`, push, enable Pages (GitHub Actions).
