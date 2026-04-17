<script setup lang="ts">
import {computed} from 'vue'

const props = withDefaults(
  defineProps<{
    position?:
      | 'top-start'
      | 'top-center'
      | 'top-end'
      | 'middle-start'
      | 'middle-center'
      | 'middle-end'
      | 'bottom-start'
      | 'bottom-center'
      | 'bottom-end'
  }>(),
  {
    position: 'top-end',
  }
)

const positionMap: Record<string, string> = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'middle-start': 'top-50 start-0 translate-middle-y',
  'middle-center': 'top-50 start-50 translate-middle',
  'middle-end': 'top-50 end-0 translate-middle-y',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0',
}

const posClasses = computed(() => positionMap[props.position] ?? positionMap['top-end'])
</script>

<template>
  <Teleport to="body">
    <div :class="'toast-container position-fixed p-3 ' + posClasses" style="z-index: 1090">
      <slot />
    </div>
  </Teleport>
</template>
