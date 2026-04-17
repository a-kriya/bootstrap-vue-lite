import {createApp, h, ref} from 'vue'

import BsModal from './BsModal.vue'

export interface ConfirmOptions {
  title?: string
  body?: string
  size?: '' | 'sm' | 'lg' | 'xl'
  centered?: boolean
  scrollable?: boolean
  staticBackdrop?: boolean
  confirmText?: string
  cancelText?: string
  confirmVariant?: string
  cancelVariant?: string
}

export type ConfirmResult = 'confirm' | 'cancel'

/**
 * Programmatic modal API.
 *
 * Usage:
 *   const modal = useModal()
 *   const result = await modal.confirm({ title: 'Delete?', body: 'Sure?' })
 *   if (result === 'confirm') { ... }
 */
export function useModal() {
  function confirm(opts: ConfirmOptions = {}): Promise<ConfirmResult> {
    return new Promise((resolve) => {
      const host = document.createElement('div')
      document.body.appendChild(host)

      let result: ConfirmResult = 'cancel'
      const show = ref(true)

      const app = createApp({
        setup() {
          const onConfirm = () => {
            result = 'confirm'
            show.value = false
          }
          const onCancel = () => {
            result = 'cancel'
            show.value = false
          }
          const onHidden = () => {
            app.unmount()
            host.remove()
            resolve(result)
          }

          return () =>
            h(
              BsModal,
              {
                'modelValue': show.value,
                'onUpdate:modelValue': (v: boolean) => (show.value = v),
                'title': opts.title,
                'size': opts.size,
                'centered': opts.centered,
                'scrollable': opts.scrollable,
                'staticBackdrop': opts.staticBackdrop,
                onHidden,
              },
              {
                default: () => h('div', {innerHTML: opts.body ?? ''}),
                footer: () => [
                  h(
                    'button',
                    {
                      type: 'button',
                      class: `btn btn-${opts.cancelVariant ?? 'secondary'}`,
                      onClick: onCancel,
                    },
                    opts.cancelText ?? 'Cancel'
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      class: `btn btn-${opts.confirmVariant ?? 'primary'}`,
                      onClick: onConfirm,
                    },
                    opts.confirmText ?? 'OK'
                  ),
                ],
              }
            )
        },
      })
      app.mount(host)
    })
  }

  return {confirm}
}
