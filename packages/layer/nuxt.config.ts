// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt-fable/module'],
  srcDir: './src',
  build: {
    transpile: ['highlight.js', 'vue-docgen-api', 'draggable-resizable-vue3'],
  },
})
