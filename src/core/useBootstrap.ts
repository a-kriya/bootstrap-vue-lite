import {ref, shallowRef, onMounted, onBeforeUnmount, type Ref} from 'vue'

/**
 * Lazily resolve a Bootstrap JS class by name.
 * Dynamic import ensures tree-shaking works — only the
 * Bootstrap modules you actually use get bundled.
 */
export async function getBootstrapModule(name: string): Promise<any> {
  const bs = await import('bootstrap')
  return (bs as Record<string, any>)[name] ?? (bs as Record<string, any>).default?.[name]
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
  moduleName: string,
  options: Ref<Record<string, any>> | Record<string, any> = {}
) {
  const instance = shallowRef<T | null>(null)
  const isReady = ref(false)

  async function init() {
    if (!elRef.value) return
    const Ctor = await getBootstrapModule(moduleName)
    if (!Ctor || !elRef.value) return

    // Dispose any previous instance on the same element
    const existing = Ctor.getInstance(elRef.value)
    if (existing) existing.dispose()

    const opts = 'value' in options ? (options as Ref).value : options
    instance.value = new Ctor(elRef.value, opts) as T
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
