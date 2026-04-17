import type {App, Plugin} from 'vue'

import BsDropdown from './BsDropdown.vue'
import BsDropdownItem from './BsDropdownItem.vue'

export {BsDropdown, BsDropdownItem}

export const DropdownPlugin: Plugin = {
  install(app: App) {
    app.component('BsDropdown', BsDropdown)
    app.component('BsDropdownItem', BsDropdownItem)
  },
}
