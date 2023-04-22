<template>
  <div class="p-4">
    <Component :is="Comp"></Component>
  </div>
</template>

<script setup lang="tsx">
import { MyButtonStory } from '../../stories'
import { DebuggerStory } from '../../stories'
const DefaultComponent = defineComponent(() => () => <div>pls select component</div>)

const tryParseOrEmptyObject = (val: string) => {
  try {
    return JSON.parse(val)
  } catch (error) {
    return {}
  }
}

const route = useRoute()
const Comp = computed(() => {
  if (!route.query) {
    return DefaultComponent
  }
  const controls = tryParseOrEmptyObject(route.query.controls + '')
  if (route.query.component === 'my-button_default') {
    return MyButtonStory.default.render({ ...MyButtonStory.default.args, ...controls })
  }
  if (route.query.component === 'my-button_hello') {
    return MyButtonStory.hello.render({ ...MyButtonStory.hello.args, ...controls })
  }
  if (route.query.component === 'my-button_world') {
    return MyButtonStory.world.render({ ...MyButtonStory.world.args, ...controls })
  }
  if (route.query.component === 'debugger_default') {
    return DebuggerStory.default.render({ ...DebuggerStory.default.args, ...controls })
  }
  return DefaultComponent
})
</script>
