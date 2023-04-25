<template>
  <div style="padding: 1rem">
    <Component :is="Comp"></Component>
  </div>
  <div style="padding: 1rem; border-top: 2px solid black">
    <Component :is="curr" v-for="curr in FlatComponents"></Component>
  </div>
</template>

<script setup lang="tsx">
import type { DefineComponent } from "vue";
import { getStories } from "#stories";

const DefaultComponent = defineComponent({
  setup() {
    return {};
  },
  template: `<div>pls select component</div>`,
});

const tryParseOrEmptyObject = (val: string) => {
  try {
    return JSON.parse(val);
  } catch (error) {
    return {};
  }
};

const kebabCase = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const route = useRoute();

const stories = getStories();

const Comp = computed(() => {
  if (!route.query) {
    return DefaultComponent;
  }
  const controls = tryParseOrEmptyObject(route.query.controls + "");
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      if (
        route.query.component === [kebabCase(storyGroup), storyName].join("_")
      ) {
        return story.render({ ...story.args, ...controls });
      }
    }
  }
  return DefaultComponent;
});

const FlatComponents = computed(() => {
  const components: DefineComponent<any, any, any, any, any>[] = [
    DefaultComponent,
  ];
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      components.push(story.render({ ...story.args }));
    }
  }
  return components;
});
</script>
