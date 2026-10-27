---
title: Reference
---

<script setup>
import { withBase } from 'vitepress'
import { data } from '../../.vitepress/data/site.data'
</script>

# Reference

Every definition, result and algorithm from both courses, generated from the lessons so that numbers and wording always match. Numbers starting with **T** refer to Graph Theory, numbers starting with **A** to Graph Algorithms. Use the search box (<kbd>Ctrl</kbd> <kbd>K</kbd>) to find a term.

## Topics

Each topic page gives every entry with its statement, intuition and proof (collapsed), and what it uses and is used by.

<ul>
  <li v-for="t in data.topics" :key="t.slug"><a :href="withBase(`/reference/${t.slug}`)">{{ t.title }}</a>: {{ t.intro }}</li>
</ul>

## Lists

- [Definitions](/reference/definitions)
- [Theorems and lemmas](/reference/theorems)
- [Algorithms](/reference/algorithms)

For revision, try the [flashcards](/exam/flashcards).
