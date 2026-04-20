<script setup lang="ts">
import {ref} from 'vue'

import {BsCollapse} from '../../src/collapse/index'

const showBasic = ref(false)
const showHorizontal = ref(false)
const openFaq = ref<number | null>(0)

const faq = [
  {
    q: 'What is this library?',
    a: 'A hyper-modular Vue 3 wrapper around Bootstrap 5.3 JS components.',
  },
  {q: 'Is it tree-shakeable?', a: 'Yes — each component is a separate entry point.'},
  {q: 'What are its dependencies?', a: 'None other than peer dependencies of bootstrap and vue.'},
]
</script>

<template>
  <div class="vstack gap-5">
    <section>
      <h3 class="h5">Basic v-model</h3>
      <p class="text-body-secondary small mb-3">
        Height transition is driven by Bootstrap; state is controlled by Vue.
      </p>
      <button class="btn btn-outline-primary mb-3" @click="showBasic = !showBasic">
        {{ showBasic ? 'Hide' : 'Show' }} content
      </button>
      <BsCollapse v-model="showBasic">
        <div class="card card-body text-bg-dark">
          <p class="mb-2">
            This content is toggled via <code>v-model</code>. Bootstrap handles the height
            transition.
          </p>
          <p class="mb-0">
            It is tree-shakeable and wraps Bootstrap's native <code>Collapse</code> plugin.
          </p>
        </div>
      </BsCollapse>
    </section>

    <section class="border-top pt-4">
      <h3 class="h5">Horizontal collapse</h3>
      <p class="text-body-secondary small mb-3">
        Use the <code>horizontal</code> prop to animate width instead of height.
      </p>
      <button class="btn btn-outline-primary mb-3" @click="showHorizontal = !showHorizontal">
        Toggle horizontally
      </button>
      <div style="min-height: 120px">
        <BsCollapse v-model="showHorizontal" horizontal>
          <div class="card card-body" style="width: 300px">
            Horizontally collapsing panel — useful for off-canvas-style UIs.
          </div>
        </BsCollapse>
      </div>
    </section>

    <section class="border-top pt-4">
      <h3 class="h5">Accordion-style group</h3>
      <p class="text-body-secondary small mb-3">
        Mutually-exclusive collapses controlled by a single ref.
      </p>
      <div class="accordion">
        <div v-for="(item, i) in faq" :key="i" class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              :class="{collapsed: openFaq !== i}"
              type="button"
              @click="openFaq = openFaq === i ? null : i"
            >
              {{ item.q }}
            </button>
          </h2>
          <BsCollapse :model-value="openFaq === i">
            <div class="accordion-body">{{ item.a }}</div>
          </BsCollapse>
        </div>
      </div>
    </section>
  </div>
</template>
