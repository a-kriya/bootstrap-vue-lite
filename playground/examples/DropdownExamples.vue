<script setup lang="ts">
import {ref} from 'vue'

import {BsDropdown, BsDropdownItem} from '../../src/dropdown/index'
import {useToast} from '../../src/toast/useToast'

const toast = useToast()
const selection = ref('Any')
const options = ['Any', 'Draft', 'Published', 'Archived']

type DropdownHandle = {show: () => void; hide: () => void; toggle: () => void}
const programmaticRef = ref<DropdownHandle | null>(null)
</script>

<template>
  <div class="vstack gap-5">
    <section>
      <h3 class="h5">Default trigger</h3>
      <p class="text-body-secondary small mb-3">
        Uses the built-in <code>text</code> + <code>variant</code> props.
      </p>
      <BsDropdown text="Actions" variant="primary">
        <BsDropdownItem @click="toast.info('Clicked Save')">Save Draft</BsDropdownItem>
        <BsDropdownItem @click="toast.success('Published!')">Publish</BsDropdownItem>
        <BsDropdownItem divider />
        <BsDropdownItem header>Danger zone</BsDropdownItem>
        <BsDropdownItem @click="toast.error('Deleted')">Delete</BsDropdownItem>
        <BsDropdownItem disabled>Disabled item</BsDropdownItem>
      </BsDropdown>
    </section>

    <section>
      <h3 class="h5">Directions</h3>
      <p class="text-body-secondary small mb-3">
        <code>direction</code> controls which side the menu expands toward.
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <BsDropdown text="Down" variant="outline-secondary" direction="down">
          <BsDropdownItem>Item 1</BsDropdownItem>
          <BsDropdownItem>Item 2</BsDropdownItem>
        </BsDropdown>
        <BsDropdown text="Up" variant="outline-secondary" direction="up">
          <BsDropdownItem>Item 1</BsDropdownItem>
          <BsDropdownItem>Item 2</BsDropdownItem>
        </BsDropdown>
        <BsDropdown text="Start" variant="outline-secondary" direction="start">
          <BsDropdownItem>Item 1</BsDropdownItem>
          <BsDropdownItem>Item 2</BsDropdownItem>
        </BsDropdown>
        <BsDropdown text="End" variant="outline-secondary" direction="end">
          <BsDropdownItem>Item 1</BsDropdownItem>
          <BsDropdownItem>Item 2</BsDropdownItem>
        </BsDropdown>
      </div>
    </section>

    <section>
      <h3 class="h5">Dark menu &amp; end alignment</h3>
      <p class="text-body-secondary small mb-3">
        Combine <code>dark</code> with <code>menu-align="end"</code>.
      </p>
      <BsDropdown text="Menu" variant="dark" dark menu-align="end">
        <BsDropdownItem active>Active</BsDropdownItem>
        <BsDropdownItem>Settings</BsDropdownItem>
        <BsDropdownItem divider />
        <BsDropdownItem>Sign out</BsDropdownItem>
      </BsDropdown>
    </section>

    <section class="border-top pt-4">
      <h3 class="h5">Custom trigger — auto-wired</h3>
      <p class="text-body-secondary small mb-3">
        Any markup in <code>#trigger</code> works — BsDropdown injects <code>ref</code>,
        <code>data-bs-toggle</code>, and <code>aria-expanded</code> automatically.
      </p>
      <BsDropdown>
        <template #trigger>
          <button type="button" class="btn btn-light rounded-pill border px-3">
            Filter by <small class="text-body-secondary">{{ selection }}</small>
            <i class="bi bi-caret-down-fill ms-2" />
          </button>
        </template>
        <BsDropdownItem v-for="opt in options" :key="opt" @click="selection = opt">
          {{ opt }}
        </BsDropdownItem>
      </BsDropdown>
    </section>

    <section>
      <h3 class="h5">Custom trigger — reactive <code>{ isOpen }</code></h3>
      <p class="text-body-secondary small mb-3">
        Scoped slot exposes <code>isOpen</code> so the trigger can reflect open state.
      </p>
      <BsDropdown>
        <template #trigger="{isOpen}">
          <button
            type="button"
            class="btn btn-outline-primary d-inline-flex align-items-center gap-2"
          >
            <span>Expandable</span>
            <i
              class="bi bi-chevron-down"
              :style="{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }"
            />
          </button>
        </template>
        <BsDropdownItem>Option A</BsDropdownItem>
        <BsDropdownItem>Option B</BsDropdownItem>
        <BsDropdownItem>Option C</BsDropdownItem>
      </BsDropdown>
    </section>

    <section>
      <h3 class="h5">Programmatic control</h3>
      <p class="text-body-secondary small mb-3">
        Expose <code>show()</code>, <code>hide()</code>, <code>toggle()</code> on the component ref.
      </p>
      <div class="d-flex gap-2 align-items-center">
        <BsDropdown ref="programmaticRef" text="Controlled" variant="info">
          <BsDropdownItem>One</BsDropdownItem>
          <BsDropdownItem>Two</BsDropdownItem>
        </BsDropdown>
        <button class="btn btn-sm btn-outline-secondary" @click.stop="programmaticRef?.show()">
          show()
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click.stop="programmaticRef?.hide()">
          hide()
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click.stop="programmaticRef?.toggle()">
          toggle()
        </button>
      </div>
    </section>
  </div>
</template>
