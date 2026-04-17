<script setup lang="ts">
import type {Dropdown} from 'bootstrap'
import {ref, onMounted, onBeforeUnmount} from 'vue'

import {useBootstrapInstance} from '../core/useBootstrap'

const props = withDefaults(
  defineProps<{
    text?: string
    variant?: string
    split?: boolean
    direction?: 'down' | 'up' | 'start' | 'end'
    autoClose?: boolean | 'inside' | 'outside'
    dark?: boolean
    menuAlign?: 'start' | 'end'
    menuClass?: string
  }>(),
  {
    text: 'Dropdown',
    variant: 'secondary',
    split: false,
    direction: 'down',
    autoClose: true,
    dark: false,
    menuAlign: 'start',
    menuClass: '',
  }
)

const emit = defineEmits<{
  show: [event: Event]
  shown: [event: Event]
  hide: [event: Event]
  hidden: [event: Event]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const bsOptions = ref({autoClose: props.autoClose})

const {instance} = useBootstrapInstance<Dropdown>(triggerRef, 'Dropdown', bsOptions)

const eventHandlers: Array<[string, EventListener]> = []

onMounted(() => {
  if (!triggerRef.value) return
  const events = ['show', 'shown', 'hide', 'hidden'] as const
  for (const evt of events) {
    const eventName = evt + '.bs.dropdown'
    const handler = (e: Event) => {
      triggerRef.value!.dataset.status = evt
      emit(evt as any, e)
      if (evt === 'shown') isOpen.value = true
      if (evt === 'hidden') isOpen.value = false
    }
    triggerRef.value.addEventListener(eventName, handler)
    eventHandlers.push([eventName, handler])
  }
})

onBeforeUnmount(() => {
  if (!triggerRef.value) return
  for (const [eventName, handler] of eventHandlers) {
    triggerRef.value.removeEventListener(eventName, handler)
  }
})

const show = () => instance.value?.show()
const hide = () => instance.value?.hide()
const toggle = () => instance.value?.toggle()

defineExpose({show, hide, toggle})
</script>

<template>
  <div :class="['dropdown', direction !== 'down' ? 'drop' + direction : '']">
    <slot name="trigger">
      <button
        ref="triggerRef"
        :class="'btn btn-' + variant + ' dropdown-toggle'"
        type="button"
        data-bs-toggle="dropdown"
        :aria-expanded="isOpen"
      >
        {{ text }}
      </button>
    </slot>

    <ul
      :class="[
        'dropdown-menu',
        dark && 'dropdown-menu-dark',
        'dropdown-menu-' + menuAlign,
        menuClass,
      ]"
    >
      <slot />
    </ul>
  </div>
</template>
