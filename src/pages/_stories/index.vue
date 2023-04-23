<template>
  <div class="grid grid-cols-[auto,minmax(0,1fr)] h-full">
    <aside class="p-4 border-r border-neutral-600 h-full">
      <nav class="space-y-2">
        <li v-for="component in components">
          <button
            @click="
              () => {
                query.component = component.value
                query.controls = {}
              }
            "
            :class="{ 'underline text-sky-300': query.component === component.value }"
          >
            {{ component.label }}
          </button>
        </li>
      </nav>
    </aside>
    <div
      class="w-full h-full grid"
      :class="{
        'grid-rows-[auto,minmax(0,1fr),minmax(0px,500px)]': !!activeComponent && state.controls.open,
        'grid-rows-[auto,minmax(0,1fr),auto]': !state.controls.open,
      }"
    >
      <header class="w-full overflow-auto p-4 border-b border-neutral-600">
        <h1>{{ activeComponent?.title ?? 'Nuxt Stories' }}</h1>
      </header>
      <iframe
        :src="`/_stories/iframe?component=${query.component}&controls=${JSON.stringify(query.controls)}`"
        class="w-full h-full p-4"
      />
      <section v-if="activeComponent" class="w-full overflow-auto border-t border-neutral-600 relative h-full">
        <header
          class="w-full p-4 bg-black/50 backdrop-blur sticky top-0 border-b z-10 border-neutral-800 flex justify-between items-center"
        >
          <h2 class="text-lg">Controls</h2>
          <button @click="state.controls.open = !state.controls.open">
            <Icon
              class="w-5 h-5 transition transform"
              :class="{ '-scale-y-[1]': !state.controls.open }"
              name="mdi:chevron-down"
            ></Icon>
          </button>
        </header>
        <div class="grid p-4" v-if="state.controls.open">
          <label
            v-for="(control, label, index) in activeComponent.controls"
            class="grid gap-1 py-6"
            :class="{ 'border-t border-neutral-900': index > 0 }"
          >
            <p>
              {{ label }}
              <span class="text-neutral-500 text-xs">({{ control.required ? 'required' : 'optional' }})</span>
            </p>
            <pre
              class="text-[10px] text-neutral-300 p-1 rounded-lg bg-black/40 my-0.5"
            ><code>{{ control.type }}</code></pre>
            <StoryControl
              :type="activeComponent.controls[label].type?.controlType"
              :model-value="(query.controls as any)?.[label] ?? (label in activeComponent.args ? activeComponent.args[label] : '')"
              @update:model-value="(val: any) => (query.controls as any)[label] = val"
            />
          </label>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { MyButtonStory, DebuggerStory } from '../../stories'

const components = [
  { label: 'Home', value: '' },
  { label: 'MyButton - default', value: 'my-button_default' },
  { label: 'MyButton - hello', value: 'my-button_hello' },
  { label: 'MyButton - world', value: 'my-button_world' },
  { label: 'Debugger - world', value: 'debugger_default' },
]

const state = reactive({
  controls: {
    open: true,
    position: 'bottom' as 'right' | 'bottom',
  },
})

const query = reactive({
  component: '',
  controls: {},
})

const activeComponent = computed(() => {
  if (!query.component) {
    return null
  }
  if (query.component === 'my-button_default') {
    return MyButtonStory.default
  }
  if (query.component === 'my-button_hello') {
    return MyButtonStory.hello
  }
  if (query.component === 'my-button_world') {
    return MyButtonStory.world
  }
  if (query.component === 'debugger_default') {
    return DebuggerStory.default
  }
  return null
})
</script>
