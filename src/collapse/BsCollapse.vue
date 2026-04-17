<script setup lang="ts">
import type {Collapse} from 'bootstrap'
import {ref, watch, onMounted, onBeforeUnmount} from 'vue'

import {useBootstrapInstance} from '../core/useBootstrap'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    horizontal?: boolean
    tag?: string
  }>(),
  {
    modelValue: false,
    horizontal: false,
    tag: 'div',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'show': [event: Event]
  'shown': [event: Event]
  'hide': [event: Event]
  'hidden': [event: Event]
}>()

const elRef = ref<HTMLElement | null>(null)

// `toggle: props.modelValue` tells Bootstrap to animate open on init when the
// initial model is true — the template purposely does NOT bind `.show`, since
// Bootstrap owns that class during transitions.
const bsOptions = ref({toggle: props.modelValue})

// True between Bootstrap's `show`/`shown` and `hide`/`hidden` events. Used by
// the watcher to reject mid-transition changes.
const isTransitioning = ref(false)

const {instance} = useBootstrapInstance<Collapse>(elRef, 'Collapse', bsOptions)

const eventHandlers: Array<[string, EventListener]> = []

onMounted(() => {
  if (!elRef.value) return
  const events = ['show', 'shown', 'hide', 'hidden'] as const
  for (const evt of events) {
    const eventName = evt + '.bs.collapse'
    const handler = (e: Event) => {
      elRef.value!.dataset.status = evt
      if (evt === 'show' || evt === 'hide') isTransitioning.value = true
      if (evt === 'shown' || evt === 'hidden') isTransitioning.value = false
      emit(evt as any, e)
      if (evt === 'shown') emit('update:modelValue', true)
      if (evt === 'hidden') emit('update:modelValue', false)
    }
    elRef.value.addEventListener(eventName, handler)
    eventHandlers.push([eventName, handler])
  }
})

onBeforeUnmount(() => {
  if (!elRef.value) return
  for (const [eventName, handler] of eventHandlers) {
    elRef.value.removeEventListener(eventName, handler)
  }
})

// Mid-transition v-model changes are rejected to match Bootstrap's native
// behavior (clicks during a collapse animation are no-ops). To avoid a visible
// frame where the parent's v-model sits at the rejected value, we revert it
// synchronously via `flush: 'sync'` + an `emit('update:modelValue', oldVal)`.
// The `reverting` flag breaks the loop: the revert-emit re-triggers this same
// watcher, and that second invocation must be skipped.
let reverting = false
watch(
  () => props.modelValue,
  (val, oldVal) => {
    if (reverting) {
      reverting = false
      return
    }
    if (!instance.value) return
    if (isTransitioning.value) {
      reverting = true
      emit('update:modelValue', oldVal)
      return
    }
    if (val) instance.value.show()
    else instance.value.hide()
  },
  {flush: 'sync'}
)

const show = () => instance.value?.show()
const hide = () => instance.value?.hide()
const toggle = () => instance.value?.toggle()

defineExpose({show, hide, toggle, isTransitioning})
</script>

<template>
  <component
    :is="tag"
    ref="elRef"
    :class="['collapse', horizontal && 'collapse-horizontal']"
    role="region"
  >
    <slot />
  </component>
</template>
