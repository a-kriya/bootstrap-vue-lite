import * as bootstrap from 'bootstrap'
import {ref, shallowRef, onMounted, onBeforeUnmount, type Ref} from 'vue'

export type BootstrapModuleName = keyof typeof bootstrap

interface BootstrapComponent {
  new (el: Element, options?: Record<string, any>): unknown
  getInstance(el: Element): {dispose(): void} | null
}

/**
 * Core composable: manages a Bootstrap JS instance lifecycle.
 *
 * - Creates the instance on mount
 * - Disposes on unmount
 * - Exposes the raw instance ref for imperative control
 *
 * @param elRef      - template ref pointing to the root DOM element
 * @param moduleName - Bootstrap class name, e.g. 'Modal', 'Dropdown', 'Toast'
 * @param options    - constructor options (reactive ref or plain object)
 */
export function useBootstrapInstance<T>(
  elRef: Ref<HTMLElement | null>,
  moduleName: BootstrapModuleName,
  options: Ref<Record<string, any>> | Record<string, any> = {}
) {
  const instance = shallowRef<T | null>(null)
  const isReady = ref(false)

  function init() {
    const el = elRef.value
    if (!el) return
    const Ctor = bootstrap[moduleName] as unknown as BootstrapComponent

    // Dispose any previous instance on the same element
    Ctor.getInstance(el)?.dispose()

    const opts = 'value' in options ? (options as Ref).value : options
    instance.value = new Ctor(el, opts) as T
    isReady.value = true
  }

  function dispose() {
    if (
      instance.value &&
      typeof (instance.value as {dispose?: () => void}).dispose === 'function'
    ) {
      ;(instance.value as {dispose: () => void}).dispose()
      instance.value = null
      isReady.value = false
    }
  }

  onMounted(init)
  onBeforeUnmount(dispose)

  return {instance, isReady, init, dispose}
}
