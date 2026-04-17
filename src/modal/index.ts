import type {App, Plugin} from 'vue'

import BsModal from './BsModal.vue'
import {useModal} from './useModal'

export {BsModal, useModal}

export const ModalPlugin: Plugin = {
  install(app: App) {
    app.component('BsModal', BsModal)
  },
}
