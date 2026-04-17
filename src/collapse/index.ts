import type {App, Plugin} from 'vue'

import BsCollapse from './BsCollapse.vue'

export {BsCollapse}

export const CollapsePlugin: Plugin = {
  install(app: App) {
    app.component('BsCollapse', BsCollapse)
  },
}
