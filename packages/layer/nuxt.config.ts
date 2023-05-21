// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['nuxt-icon', '@nuxt-fable/module'],
  srcDir: './src',
  build: {
    transpile: ['highlight.js', 'vue-docgen-api', 'draggable-resizable-vue3'],
  },
  css: [join(currentDir, './src/assets/css/preflight.css'), join(currentDir, './src/assets/css/main.css')],
})
