<script setup lang="ts">
import type {Dropdown} from 'bootstrap'
import {ref, onMounted, onBeforeUnmount, cloneVNode, h, type ClassValue} from 'vue'

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
    menuClass?: ClassValue
  }>(),
  {
    text: 'Dropdown',
    variant: 'secondary',
    split: false,
    direction: 'down',
    autoClose: true,
    dark: false,
    menuAlign: 'start',
    menuClass: undefined,
  }
)

const emit = defineEmits<{
  show: [event: Event]
  shown: [event: Event]
  hide: [event: Event]
  hidden: [event: Event]
}>()

// The `trigger` slot's first root must be a DOM element (button/a/div) — a
// component vnode would bind the ref to the component instance, not the DOM
// node, breaking `new Dropdown(el)`.
const slots = defineSlots<{
  trigger?(props: {isOpen: boolean}): any
  default?(): any
}>()

const triggerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const bsOptions = ref({autoClose: props.autoClose})

function setTriggerRef(el: unknown) {
  triggerRef.value = el as HTMLElement | null
}

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

function TriggerSlot() {
  const provided = slots.trigger?.({isOpen: isOpen.value})
  const base =
    provided?.[0] ??
    h('button', {class: `btn btn-${props.variant} dropdown-toggle`, type: 'button'}, props.text)
  return cloneVNode(
    base,
    {'ref': setTriggerRef, 'data-bs-toggle': 'dropdown', 'aria-expanded': isOpen.value},
    true
  )
}
</script>

<template>
  <div :class="['dropdown', direction !== 'down' ? 'drop' + direction : '']">
    <TriggerSlot />

    <ul
      :class="['dropdown-menu', 'dropdown-menu-' + menuAlign, menuClass]"
      :data-bs-theme="dark ? 'dark' : null"
    >
      <slot />
    </ul>
  </div>
</template>
