<script setup lang="ts">
import type {Toast} from 'bootstrap'
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue'

import {useBootstrapInstance} from '../core/useBootstrap'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    delay?: number
    variant?: string
    simple?: boolean
  }>(),
  {
    modelValue: false,
    title: '',
    delay: 5000,
    variant: '',
    simple: false,
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
const bsOptions = ref({
  autohide: props.delay > 0,
  delay: props.delay,
})

const {instance, isReady} = useBootstrapInstance<Toast>(elRef, 'Toast', bsOptions)

watch(
  () => props.modelValue,
  async (show) => {
    await nextTick()
    if (!instance.value) return
    const inst = instance.value as any
    if (show) inst.show()
    else inst.hide()
  }
)

// Show toast once the Bootstrap instance is ready (async import resolved)
watch(isReady, (ready) => {
  if (ready && props.modelValue) {
    ;(instance.value as any)?.show()
  }
})

const eventHandlers: Array<[string, EventListener]> = []

onMounted(() => {
  if (!elRef.value) return
  const events = ['show', 'shown', 'hide', 'hidden'] as const
  for (const evt of events) {
    const eventName = evt + '.bs.toast'
    const handler = (e: Event) => {
      elRef.value!.dataset.status = evt
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

const show = () => (instance.value as any)?.show()
const hide = () => (instance.value as any)?.hide()

defineExpose({show, hide})

const toastClasses = computed(() =>
  ['toast', props.variant ? 'text-bg-' + props.variant : ''].filter(Boolean)
)
</script>

<template>
  <div
    v-if="simple"
    ref="elRef"
    :class="toastClasses"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body"><slot /></div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" />
    </div>
  </div>

  <div
    v-else
    ref="elRef"
    :class="toastClasses"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="toast-header">
      <slot name="header">
        <strong class="me-auto">{{ title }}</strong>
      </slot>
      <button type="button" class="btn-close" data-bs-dismiss="toast" />
    </div>
    <div class="toast-body"><slot /></div>
  </div>
</template>
