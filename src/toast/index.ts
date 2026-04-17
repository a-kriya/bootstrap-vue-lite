import type {App, Plugin} from 'vue'

import BsToast from './BsToast.vue'
import BsToastContainer from './BsToastContainer.vue'
import {useToast} from './useToast'

export {BsToast, BsToastContainer, useToast}

export const ToastPlugin: Plugin = {
  install(app: App) {
    app.component('BsToast', BsToast)
    app.component('BsToastContainer', BsToastContainer)
  },
}
