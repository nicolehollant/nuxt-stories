import vuePlugin from '@vitejs/plugin-vue'
// import vueDocgenPlugin from './module/vue-docgen-vite-plugin'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // extends: ['senp-ui'],
  // modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', './module/nuxt-stories'],
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
  srcDir: './src',
  build: {
    transpile: ['highlight.js', 'vue-docgen-api', 'draggable-resizable-vue3'],
  },
  vite: {
    // plugins: [vuePlugin(), vueDocgenPlugin()],
    // plugins: [vueDocgenPlugin()],
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
