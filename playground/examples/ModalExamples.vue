<script setup lang="ts">
import {ref} from 'vue'

import {BsModal} from '../../src/modal/index'
import {useModal} from '../../src/modal/useModal'
import {useToast} from '../../src/toast/useToast'

const toast = useToast()
const modal = useModal()

const showBasic = ref(false)
const showCentered = ref(false)
const showScrollable = ref(false)
const showStatic = ref(false)
const showFullscreen = ref(false)

function handleBasicSave() {
  showBasic.value = false
  toast.success('Saved')
}

async function handleConfirmDelete() {
  const result = await modal.confirm({
    title: 'Delete item?',
    body: '<p>This action <strong>cannot</strong> be undone.</p>',
    centered: true,
    confirmVariant: 'danger',
    confirmText: 'Delete',
  })
  if (result === 'confirm') toast.error('Item deleted.')
  else toast.info('Cancelled.')
}
</script>

<template>
  <div class="vstack gap-5">
    <section>
      <h3 class="h5">Basic v-model</h3>
      <p class="text-body-secondary small mb-3">
        <code>v-model</code> syncs with Bootstrap's show/hide events.
      </p>
      <button class="btn btn-primary" @click="showBasic = true">Open</button>
      <BsModal v-model="showBasic" title="Settings">
        <p>Closing the modal (backdrop, X, or ESC) automatically syncs the ref back to false.</p>
        <template #footer>
          <button class="btn btn-secondary" @click="showBasic = false">Cancel</button>
          <button class="btn btn-primary" @click="handleBasicSave">Save</button>
        </template>
      </BsModal>
    </section>

    <section>
      <h3 class="h5">Centered + large</h3>
      <p class="text-body-secondary small mb-3"><code>centered</code> + <code>size="lg"</code>.</p>
      <button class="btn btn-outline-primary" @click="showCentered = true">Open</button>
      <BsModal v-model="showCentered" title="Centered" size="lg" centered>
        <p>Vertically centered via the <code>centered</code> prop.</p>
      </BsModal>
    </section>

    <section>
      <h3 class="h5">Scrollable body</h3>
      <p class="text-body-secondary small mb-3">
        The body scrolls independently of the viewport when content overflows.
      </p>
      <button class="btn btn-outline-primary" @click="showScrollable = true">Open</button>
      <BsModal v-model="showScrollable" title="Long content" scrollable>
        <p v-for="n in 30" :key="n">Paragraph {{ n }} — {{ 'lorem ipsum '.repeat(12) }}</p>
      </BsModal>
    </section>

    <section>
      <h3 class="h5">Static backdrop</h3>
      <p class="text-body-secondary small mb-3">
        Clicking the backdrop does not dismiss; use the footer buttons.
      </p>
      <button class="btn btn-outline-primary" @click="showStatic = true">Open</button>
      <BsModal v-model="showStatic" title="Static backdrop" static-backdrop>
        <p>The backdrop click is a no-op while this is open.</p>
        <template #footer>
          <button class="btn btn-secondary" @click="showStatic = false">Close</button>
        </template>
      </BsModal>
    </section>

    <section>
      <h3 class="h5">Fullscreen</h3>
      <button class="btn btn-outline-primary" @click="showFullscreen = true">Open</button>
      <BsModal v-model="showFullscreen" title="Fullscreen" fullscreen>
        <p>Takes the entire viewport. Useful for mobile-first flows.</p>
      </BsModal>
    </section>

    <section class="border-top pt-4">
      <h3 class="h5">Programmatic: <code>useModal().confirm()</code></h3>
      <p class="text-body-secondary small mb-3">
        Promise-based API — resolves to <code>'confirm'</code> or <code>'cancel'</code>.
      </p>
      <button class="btn btn-danger" @click="handleConfirmDelete">Delete item…</button>
    </section>
  </div>
</template>
