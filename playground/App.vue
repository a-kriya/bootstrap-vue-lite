<script setup lang="ts">
import {ref} from 'vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import {BsCollapse} from '../src/collapse/index'
import {BsDropdown, BsDropdownItem} from '../src/dropdown/index'
import {BsModal} from '../src/modal/index'
import {useModal} from '../src/modal/useModal'
import {BsToast, BsToastContainer} from '../src/toast/index'
import {useToast} from '../src/toast/useToast'

const showModal = ref(false)
const showCollapse = ref(false)
const toast = useToast()
const modal = useModal()

function handleSave() {
  showModal.value = false
  toast.success('Settings saved successfully!')
}

async function handleDelete() {
  const result = await modal.confirm({
    title: 'Confirm Delete',
    body: '<p>Are you sure? This <strong>cannot</strong> be undone.</p>',
    centered: true,
    confirmVariant: 'danger',
    confirmText: 'Delete',
  })
  if (result === 'confirm') {
    toast.error('Item has been deleted.')
  }
}
</script>

<template>
  <div class="container py-5">
    <h1 class="mb-4">bootstrap-vue-lite Playground</h1>

    <div class="d-flex gap-3 flex-wrap mb-4">
      <button class="btn btn-primary" @click="showModal = true">Open Modal</button>

      <BsDropdown text="Actions" variant="outline-secondary">
        <BsDropdownItem @click="toast.info('Clicked Save')">Save Draft</BsDropdownItem>
        <BsDropdownItem @click="toast.success('Published!')">Publish</BsDropdownItem>
        <BsDropdownItem divider />
        <BsDropdownItem @click="handleDelete">Delete</BsDropdownItem>
      </BsDropdown>

      <button class="btn btn-success" @click="toast.success('Operation succeeded!')">
        Toast: Success
      </button>
      <button class="btn btn-danger" @click="toast.error('Something broke!')">Toast: Error</button>
      <button class="btn btn-info text-white" @click="toast.info('FYI — new update available.')">
        Toast: Info
      </button>

      <button class="btn btn-outline-primary" @click="showCollapse = !showCollapse">
        {{ showCollapse ? 'Hide' : 'Show' }} Collapse
      </button>
    </div>

    <BsCollapse v-model="showCollapse" class="mb-4">
      <div class="card card-body text-bg-dark">
        <p class="mb-2">
          This content is toggled via <code>v-model</code> on <code>BsCollapse</code>. Bootstrap
          handles the height transition.
        </p>
        <p class="mb-0">
          Like the other components, it is tree-shakeable and wraps Bootstrap's native
          <code>Collapse</code> plugin.
        </p>
      </div>
    </BsCollapse>

    <BsModal v-model="showModal" title="Settings" size="lg" centered>
      <p>
        This modal is controlled via <code>v-model</code>. Closing it via backdrop, X button, or ESC
        automatically syncs the ref.
      </p>
      <p>
        It is <strong>tree-shakeable</strong> — importing BsModal does not pull in Dropdown or Toast
        code.
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="showModal = false">Cancel</button>
        <button class="btn btn-primary" @click="handleSave">Save Changes</button>
      </template>
    </BsModal>

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
