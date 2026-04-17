<script setup lang="ts">
import type {Modal} from 'bootstrap'
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue'
import type {ClassValue} from 'vue'

import {useBootstrapInstance} from '../core/useBootstrap'

type ModalPart = 'root' | 'dialog' | 'content' | 'header' | 'body' | 'footer'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    size?: '' | 'sm' | 'lg' | 'xl'
    staticBackdrop?: boolean
    centered?: boolean
    scrollable?: boolean
    fullscreen?: boolean | string
    noCloseButton?: boolean
    teleportTo?: string
    classes?: Partial<Record<ModalPart, ClassValue>>
  }>(),
  {
    modelValue: false,
    title: '',
    size: '',
    staticBackdrop: false,
    centered: false,
    scrollable: false,
    fullscreen: false,
    noCloseButton: false,
    teleportTo: 'body',
    classes: () => ({}),
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'show': [event: Event]
  'shown': [event: Event]
  'hide': [event: Event]
  'hidden': [event: Event]
  'hide-prevented': [event: Event]
}>()

const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`
const elRef = ref<HTMLElement | null>(null)
const bsOptions = ref({
  backdrop: props.staticBackdrop ? 'static' : true,
})

const {instance, isReady} = useBootstrapInstance<Modal>(elRef, 'Modal', bsOptions)

// v-model → Bootstrap
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

// Show modal once the Bootstrap instance is ready (async import resolved)
watch(isReady, (ready) => {
  if (ready && props.modelValue) {
    ;(instance.value as any)?.show()
  }
})

// Bootstrap events → v-model
const eventHandlers: Array<[string, EventListener]> = []

onMounted(() => {
  if (!elRef.value) return
  const events = ['show', 'shown', 'hide', 'hidden'] as const
  for (const evt of events) {
    const eventName = evt + '.bs.modal'
    const handler = (e: Event) => {
      elRef.value!.dataset.status = evt
      emit(evt as any, e)
      if (evt === 'shown') emit('update:modelValue', true)
      if (evt === 'hidden') emit('update:modelValue', false)
    }
    elRef.value.addEventListener(eventName, handler)
    eventHandlers.push([eventName, handler])
  }

  const hidePreventedName = 'hidePrevented.bs.modal'
  const hidePreventedHandler = (e: Event) => {
    elRef.value!.dataset.status = 'hide-prevented'
    emit('hide-prevented', e)
  }
  elRef.value.addEventListener(hidePreventedName, hidePreventedHandler)
  eventHandlers.push([hidePreventedName, hidePreventedHandler])
})

onBeforeUnmount(() => {
  if (!elRef.value) return
  for (const [eventName, handler] of eventHandlers) {
    elRef.value.removeEventListener(eventName, handler)
  }
})

const dialogClasses = computed(() =>
  [
    'modal-dialog',
    props.size ? `modal-${props.size}` : '',
    props.centered ? 'modal-dialog-centered' : '',
    props.scrollable ? 'modal-dialog-scrollable' : '',
    props.fullscreen === true
      ? 'modal-fullscreen'
      : typeof props.fullscreen === 'string'
        ? `modal-fullscreen-${props.fullscreen}-down`
        : '',
  ].filter(Boolean)
)

const show = () => (instance.value as any)?.show()
const hide = () => (instance.value as any)?.hide()
const toggle = () => (instance.value as any)?.toggle()

defineExpose({show, hide, toggle})
</script>

<template>
  <Teleport :to="teleportTo">
    <div
      ref="elRef"
      :class="['modal', 'fade', classes.root]"
      tabindex="-1"
      :aria-hidden="!modelValue"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div :class="[dialogClasses, classes.dialog]">
        <div :class="['modal-content', classes.content]">
          <div
            v-if="title || $slots.header || !noCloseButton"
            :class="['modal-header', classes.header]"
          >
            <slot name="header">
              <h5 :id="titleId" class="modal-title">{{ title }}</h5>
            </slot>
            <button
              v-if="!noCloseButton"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div :class="['modal-body', classes.body]">
            <slot />
          </div>
          <div v-if="$slots.footer" :class="['modal-footer', classes.footer]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
