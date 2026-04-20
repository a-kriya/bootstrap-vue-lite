<script setup lang="ts">
import {ref} from 'vue'

import {BsToast} from '../../src/toast/index'
import {useToast} from '../../src/toast/useToast'

const toast = useToast()

const showManual = ref(false)
const showSimple = ref(false)
</script>

<template>
  <div class="vstack gap-5">
    <section>
      <h3 class="h5">Queue via <code>useToast()</code></h3>
      <p class="text-body-secondary small mb-3">
        The <code>useToast()</code> singleton queues toasts rendered by the global
        <code>BsToastContainer</code> in <code>App.vue</code>.
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-success" @click="toast.success('Operation succeeded')">
          success()
        </button>
        <button class="btn btn-danger" @click="toast.error('Something broke')">error()</button>
        <button class="btn btn-info text-white" @click="toast.info('FYI — update available')">
          info()
        </button>
        <button class="btn btn-warning" @click="toast.warning('Heads up: low disk space')">
          warning()
        </button>
        <button class="btn btn-outline-secondary" @click="toast.clear()">clear()</button>
      </div>
    </section>

    <section class="border-top pt-4">
      <h3 class="h5">Manual <code>&lt;BsToast v-model&gt;</code></h3>
      <p class="text-body-secondary small mb-3">
        Render a toast inline (without the queue). Shown here outside the global container.
      </p>
      <button class="btn btn-primary" @click="showManual = true">Show manual toast</button>
      <div class="mt-3">
        <BsToast v-model="showManual" title="Manual" variant="primary" :delay="4000">
          Dismisses automatically after 4 seconds, or click the × to close.
        </BsToast>
      </div>
    </section>

    <section>
      <h3 class="h5">Simple variant</h3>
      <p class="text-body-secondary small mb-3">
        Single-line toast with no header (<code>simple</code> prop).
      </p>
      <button class="btn btn-outline-primary" @click="showSimple = true">Show simple toast</button>
      <div class="mt-3">
        <BsToast v-model="showSimple" simple variant="success" :delay="3000">
          Saved to cloud.
        </BsToast>
      </div>
    </section>
  </div>
</template>
