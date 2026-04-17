<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    href?: string
    active?: boolean
    disabled?: boolean
    header?: boolean
    divider?: boolean
  }>(),
  {
    href: '#',
    active: false,
    disabled: false,
    header: false,
    divider: false,
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(e: MouseEvent) {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <hr v-if="divider" class="dropdown-divider" />
  <h6 v-else-if="header" class="dropdown-header">
    <slot />
  </h6>
  <li v-else>
    <a
      :class="['dropdown-item', active && 'active', disabled && 'disabled']"
      :href="href"
      @click.prevent="handleClick"
    >
      <slot />
    </a>
  </li>
</template>
