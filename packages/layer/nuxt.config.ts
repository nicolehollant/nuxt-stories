// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icon', '@nuxt-fable/module'],
  srcDir: './src',
  build: {
    transpile: ['highlight.js', 'vue-docgen-api', 'draggable-resizable-vue3'],
  },
  css: ['./src/assets/css/preflight.css', './src/assets/css/main.css'],
})
