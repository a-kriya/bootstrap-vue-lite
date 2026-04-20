<script setup lang="ts">
import {ref} from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import {BsToast, BsToastContainer} from '../src/toast/index'
import {useToast} from '../src/toast/useToast'
import CollapseExamples from './examples/CollapseExamples.vue'
import DropdownExamples from './examples/DropdownExamples.vue'
import ModalExamples from './examples/ModalExamples.vue'
import ToastExamples from './examples/ToastExamples.vue'

const tabs = [
  {id: 'dropdown', label: 'Dropdown', component: DropdownExamples},
  {id: 'modal', label: 'Modal', component: ModalExamples},
  {id: 'toast', label: 'Toast', component: ToastExamples},
  {id: 'collapse', label: 'Collapse', component: CollapseExamples},
] as const

type TabId = (typeof tabs)[number]['id']

const active = ref<TabId>('dropdown')
const toast = useToast()
</script>

<template>
  <div class="container py-4">
    <header class="mb-4">
      <h1 class="h3 mb-1">bootstrap-vue-lite Playground</h1>
      <p class="text-body-secondary mb-0">Live examples for each component.</p>
    </header>

    <ul class="nav nav-tabs mb-4">
      <li v-for="t in tabs" :key="t.id" class="nav-item">
        <a
          href="#"
          class="nav-link"
          :class="{active: active === t.id}"
          @click.prevent="active = t.id"
        >
          {{ t.label }}
        </a>
      </li>
    </ul>

    <template v-for="t in tabs" :key="t.id">
      <component :is="t.component" v-if="active === t.id" />
    </template>

    <BsToastContainer position="bottom-end">
      <BsToast
        v-for="t in toast.queue"
        :key="t.id"
        :title="t.title"
        :variant="t.variant"
        :delay="t.delay ?? 5000"
        model-value
      >
        {{ t.body }}
      </BsToast>
    </BsToastContainer>
  </div>
</template>
