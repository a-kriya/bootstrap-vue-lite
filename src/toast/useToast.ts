import {reactive} from 'vue'

export interface ToastOptions {
  title?: string
  body: string
  variant?: string
  delay?: number
}

export interface ToastEntry extends ToastOptions {
  id: number
}

// Module-level singleton queue — shared across all useToast() calls
const queue = reactive<ToastEntry[]>([])
let nextId = 0

/**
 * Programmatic toast API.
 *
 * Usage:
 *   const toast = useToast()
 *   toast.success('Saved!')
 *   toast.error('Something went wrong')
 */
export function useToast() {
  function push(opts: ToastOptions): number {
    const id = ++nextId
    queue.push({...opts, id})

    const delay = opts.delay ?? 5000
    if (delay > 0) {
      setTimeout(() => {
        const idx = queue.findIndex((t) => t.id === id)
        if (idx !== -1) queue.splice(idx, 1)
      }, delay + 500)
    }

    return id
  }

  function dismiss(id: number) {
    const idx = queue.findIndex((t) => t.id === id)
    if (idx !== -1) queue.splice(idx, 1)
  }

  function clear() {
    queue.splice(0, queue.length)
  }

  const success = (body: string, o?: Partial<ToastOptions>) =>
    push({body, variant: 'success', title: 'Success', ...o})

  const error = (body: string, o?: Partial<ToastOptions>) =>
    push({body, variant: 'danger', title: 'Error', ...o})

  const info = (body: string, o?: Partial<ToastOptions>) =>
    push({body, variant: 'info', title: 'Info', ...o})

  const warning = (body: string, o?: Partial<ToastOptions>) =>
    push({body, variant: 'warning', title: 'Warning', ...o})

  return {push, dismiss, clear, success, error, info, warning, queue}
}
