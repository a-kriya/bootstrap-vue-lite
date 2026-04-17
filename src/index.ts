import type {App, Plugin} from 'vue'

export * from './core/index'
export * from './collapse/index'
export * from './dropdown/index'
export * from './modal/index'
export * from './toast/index'

import {CollapsePlugin} from './collapse/index'
import {DropdownPlugin} from './dropdown/index'
import {ModalPlugin} from './modal/index'
import {ToastPlugin} from './toast/index'

const VueBootstrapModular: Plugin = {
  install(app: App) {
    app.use(CollapsePlugin)
    app.use(DropdownPlugin)
    app.use(ModalPlugin)
    app.use(ToastPlugin)
  },
}

export default VueBootstrapModular
