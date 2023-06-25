// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content'],
  extends: ['@nuxt-fable/layer'],
  srcDir: './src',
  nuxtStories: {
    title: 'Example Stories',
    autoStoriesGlob: ['/**/components/**/*.vue'],
  },
})
