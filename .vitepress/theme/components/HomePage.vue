<script setup lang="ts">
import { withBase } from 'vitepress'
import { parseGraph } from '@core/dsl/parser'
import FigureWidget from '@gv/widgets/FigureWidget.vue'
import { data } from '../../data/site.data'

const hero = parseGraph(`interactive: drag
use: Petersen
class cycle: 0--1 1--2 2--3 3--4 4--0
class tree: 0--5 1--6 2--7 3--8 4--9`)
const theory = data.lessons.filter(l => l.course === 'theory')
const algorithms = data.lessons.filter(l => l.course === 'algorithms')
</script>

<template>
  <div class="ga-home">
    <section class="ga-hero">
      <div class="ga-hero-text">
        <p class="ga-eyebrow">Graph Theory · MA015 Graph Algorithms</p>
        <h1 class="ga-hero-title">Graph Atlas</h1>
        <p class="ga-hero-lead">
          Two university courses on graphs, written out in full: every definition, every theorem with a complete proof,
          and a picture you can play with wherever a picture helps.
        </p>
        <div class="ga-hero-actions">
          <a class="ga-btn ga-btn-primary ga-btn-lg" :href="withBase('/theory/')">Start with Graph Theory</a>
          <a class="ga-btn ga-btn-lg" :href="withBase('/algorithms/')">Graph Algorithms</a>
        </div>
      </div>
      <div class="ga-hero-graph">
        <FigureWidget :doc="hero" :height="300" />
        <p class="ga-hero-note">The Petersen graph. Drag the vertices; it stays the same graph.</p>
      </div>
    </section>

    <section class="ga-home-grid" aria-label="What is here">
      <a class="ga-home-card" :href="withBase('/theory/')">
        <h2>Graph Theory</h2>
        <p>{{ theory.length }} lessons: graphs and degrees, walks and bipartite graphs, trees, chordal and Hamiltonian graphs, connectivity and Menger's theorem.</p>
      </a>
      <a class="ga-home-card" :href="withBase('/algorithms/')">
        <h2>Graph Algorithms</h2>
        <p>{{ algorithms.length }} lessons: minimum spanning trees (from Kruskal to the randomized linear-time algorithm) and maximum flows, with step-by-step players.</p>
      </a>
      <a class="ga-home-card" :href="withBase('/reference/')">
        <h2>Reference</h2>
        <p>All {{ data.totals.definitions }} definitions and {{ data.totals.statements }} results in one place, each linked back to its lesson.</p>
      </a>
      <a class="ga-home-card" :href="withBase('/practice/')">
        <h2>Practice and exam prep</h2>
        <p>{{ data.totals.exercises }} interactive exercises and quick checks, random drills, and flashcards for every definition and theorem.</p>
      </a>
      <a class="ga-home-card ga-home-card-wide" :href="withBase('/playground')">
        <h2>Playground</h2>
        <p>Draw any graph, generate classic families, run the algorithms from the courses on it, and export it as TikZ for your homework.</p>
      </a>
    </section>

    <p class="ga-home-credit">
      An unofficial student resource based on the lectures <em>Graph Theory</em> (P. Hliněný) and <em>MA015 Graph Algorithms</em>
      (Jan Obdržálek) at the Faculty of Informatics, Masaryk University. Material marked “beyond the lectures” was added for completeness.
    </p>
  </div>
</template>
