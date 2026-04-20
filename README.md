# bootstrap-vue-lite

> Bootstrap 5.3 JS components implemented in Vue.

## Demo

Live playground: **https://a-kriya.github.io/bootstrap-vue-lite/**

## Philosophy

Unlike monolithic Bootstrap+Vue libraries, this package is built around a
**simple import → register → use** workflow.

You don’t install a global plugin or pull in the entire framework. Instead,
you import exactly the Bootstrap JS components you need, register them,
and start using them.

Each component is a standalone module with zero global state, designed to
mirror Bootstrap’s JavaScript behavior while fitting naturally into Vue’s
composition model.

## Install

```bash
npm install bootstrap-vue-lite bootstrap@5.3
```

Don't forget to import Bootstrap CSS in your entry file:

```ts
import 'bootstrap/dist/css/bootstrap.min.css'
```

## Usage

### Option 1: Direct Import (recommended)

```vue
<script setup lang="ts">
import {ref} from 'vue'
import {BsModal} from 'bootstrap-vue-lite/modal'

const show = ref(false)
</script>

<template>
  <button @click="show = true">Open</button>
  <BsModal v-model="show" title="Hello">
    <p>Modal content here.</p>
  </BsModal>
</template>
```

### Option 2: Plugin (global registration)

```ts
import {createApp} from 'vue'
import {ModalPlugin} from 'bootstrap-vue-lite/modal'

const app = createApp(App)
app.use(ModalPlugin)
```

### Option 3: Composable (programmatic)

```ts
import {useToast} from 'bootstrap-vue-lite/toast'
import {useModal} from 'bootstrap-vue-lite/modal'

const toast = useToast()
const modal = useModal()

toast.success('It worked!')

const result = await modal.confirm({
  title: 'Are you sure?',
  body: 'This cannot be undone.',
  confirmText: 'Delete',
  confirmVariant: 'danger',
})
// result is 'confirm' | 'cancel'
```

## Components

| Package     | Components                     | Composable   |
| ----------- | ------------------------------ | ------------ |
| `/collapse` | `BsCollapse`                   | —            |
| `/dropdown` | `BsDropdown`, `BsDropdownItem` | —            |
| `/modal`    | `BsModal`                      | `useModal()` |
| `/toast`    | `BsToast`, `BsToastContainer`  | `useToast()` |

Every component that wraps a Bootstrap JS instance exposes a `data-status` attribute
on its root element reflecting the current transition state (`show` / `shown` /
`hide` / `hidden`, plus `hide-prevented` on modals). This is useful for CSS
targeting and E2E tests.

## License

MIT
