<template>
  <div class="p-4">
    <p v-if="Comp == null">Please select a component</p>
    <Component v-else :is="Comp"></Component>
  </div>
</template>

<script setup lang="tsx">
import Loading from '../../components/Loading.vue'
import AutoStoryDocs from '../../components/AutoStoryDocs.vue'
import { getStories } from '#stories'

const tryParseOrEmptyObject = (val: string) => {
  try {
    return JSON.parse(val)
  } catch (error) {
    return {}
  }
}

const kebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

const route = useRoute()

const stories = getStories()

/**
 * use this if you're using NOT resolving vue as 'vue/dist/vue.esm-bundler.js'
 */
const mapSlotsWithoutTemplate = ([key, value]: [string, unknown]) => {
  return [key, () => value]
}

/**
 * use this if you're using resolving vue as 'vue/dist/vue.esm-bundler.js'
 */
const mapSlotsWithTemplate = ([key, value]: [string, unknown]) => {
  return [
    key,
    () => {
      try {
        return h(
          defineComponent({
            template: value + '',
          })
        )
      } catch (error) {
        return value
      }
    },
  ]
}

const Comp = computed(() => {
  if (!route.query) {
    return Loading
  }
  const controls = tryParseOrEmptyObject(route.query.controls + '')

  const slots = Object.fromEntries(
    Object.entries(tryParseOrEmptyObject(route.query.slots + '')).map(mapSlotsWithTemplate)
    // Object.entries(tryParseOrEmptyObject(route.query.slots + '')).map(mapSlotsWithoutTemplate)
  )
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      if (route.query.component === [kebabCase(storyGroup), kebabCase(storyName)].join('_')) {
        return story.render({ props: { ...story.args, ...controls }, slots: { ...story.slots, ...slots } } as any)
      }
    }
  }
  if (route.query.component === 'auto-stories') {
    return AutoStoryDocs
  }
  return null
})
</script>
