import {resolve} from 'path'

import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'

export default defineConfig(({command}) => {
  // Dev server: serve the playground app
  if (command === 'serve') {
    return {
      root: 'playground',
      plugins: [vue()],
      resolve: {
        alias: {
          'bootstrap-vue-lite': resolve(__dirname, 'src'),
        },
      },
    }
  }

  // Build: library mode
  return {
    plugins: [vue()],
    build: {
      lib: {
        entry: {
          'index': resolve(__dirname, 'src/index.ts'),
          'core/index': resolve(__dirname, 'src/core/index.ts'),
          'collapse/index': resolve(__dirname, 'src/collapse/index.ts'),
          'dropdown/index': resolve(__dirname, 'src/dropdown/index.ts'),
          'modal/index': resolve(__dirname, 'src/modal/index.ts'),
          'toast/index': resolve(__dirname, 'src/toast/index.ts'),
        },
        formats: ['es'],
      },
      rolldownOptions: {
        external: ['vue', 'bootstrap'],
        output: {
          globals: {vue: 'Vue', bootstrap: 'bootstrap'},
          preserveModules: false,
        },
      },
    },
  }
})
