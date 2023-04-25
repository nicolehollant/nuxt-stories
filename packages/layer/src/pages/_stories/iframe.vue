<template>
  <div class="p-4">
    <Component :is="Comp"></Component>
  </div>
</template>

<script setup lang="tsx">
import { getStories } from '#stories'

const DefaultComponent = defineComponent({
  setup() {
    return {}
  },
  template: `<div>pls select component</div>`,
})

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

const Comp = computed(() => {
  if (!route.query) {
    return DefaultComponent
  }
  const controls = tryParseOrEmptyObject(route.query.controls + '')
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      if (route.query.component === [kebabCase(storyGroup), kebabCase(storyName)].join('_')) {
        return story.render({ ...story.args, ...controls })
      }
    }
  }
  return DefaultComponent
})
</script>
