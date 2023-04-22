// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // extends: ['senp-ui'],
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
  srcDir: './src',
  build: {
    transpile: ['highlight.js'],
  },
  hooks: {
    'vite:extendConfig': (config, { isClient, isServer }) => {
      if (isClient && config?.resolve?.alias) {
        ;(config.resolve.alias as any).vue = 'vue/dist/vue.esm-bundler'
        ;(config.resolve.alias as any)['lodash.debounce'] = 'lodash.debounce/index.js'
        ;(config.resolve.alias as any).vuedraggable = 'vuedraggable/dist/vuedraggable.common.js'
        ;(config.resolve.alias as any).jsurl = 'jsurl/lib/jsurl.js'
      }
    },
  },
  components: {
    global: true,
    dirs: ['~/components'],
  },
})
