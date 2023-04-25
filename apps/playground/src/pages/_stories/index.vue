<template>
  <div class="grid grid-cols-[auto,minmax(0,1fr)] h-full">
    <aside class="p-4 border-r border-neutral-600 h-full">
      <nav class="space-y-2">
        <li class="list-none" v-for="component in components">
          <button
            @click="
              () => {
                query.component = component.value
                query.controls = {}
              }
            "
            class="text-xs sm:text-sm"
            :class="{ 'underline text-sky-300': query.component === component.value }"
          >
            {{ component.label }}
          </button>
          <ul class="ml-3 mt-1" v-if="query.component.split('_')[0] === component.value.split('_')[0]">
            <li
              v-for="childComponent in components.find(
                (comp) => comp.value.split('_')[0] === query.component.split('_')[0]
              )?.children"
            >
              <button
                @click="
                  () => {
                    query.component = childComponent.value
                    query.controls = {}
                  }
                "
                class="text-xs sm:text-sm"
                :class="{ 'underline text-sky-300': query.component === childComponent.value }"
              >
                {{ childComponent.label }}
              </button>
            </li>
          </ul>
        </li>
      </nav>
    </aside>
    <div
      class="w-full h-full grid"
      :class="{
        'grid-rows-[auto,minmax(0,1fr)]': !activeComponent,
        'grid-rows-[auto,minmax(0,1fr),minmax(0px,500px)]': !!activeComponent && state.controls.open,
        'grid-rows-[auto,minmax(0,1fr),auto]': !state.controls.open,
      }"
    >
      <header class="w-full overflow-auto p-4 border-b border-neutral-600 flex items-center gap-8">
        <h1>{{ activeComponent?.title ?? 'Nuxt Stories' }}</h1>
        <div v-if="!!activeComponent" class="h-[calc(100%+2rem)] -my-4 border-l border-neutral-800"></div>
        <div v-if="!!activeComponent" class="flex items-center">
          <button
            @click="state.canvas.resizable = !state.canvas.resizable"
            class="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800"
          >
            <Icon name="mdi:responsive"></Icon>
            <p class="text-sm text-neutral-200/80 font-medium">{{ state.canvas.resizable ? 'Resizeable' : 'Fixed' }}</p>
          </button>
        </div>
      </header>
      <section v-if="state.canvas.resizable" class="relative p-4 pr-12 pb-12 overflow-hidden w-full h-full">
        <draggable-resizable-container :key="!!activeComponent && state.controls.open" class="w-full h-full">
          <draggable-resizable-vue
            v-model:h="resizableElement.height"
            v-model:w="resizableElement.width"
            :handles="['br', 'bm', 'mr']"
            :draggable="false"
            :active="true"
            :prevent-deactivation="true"
            handles-border="1px solid rgb(64, 64, 64)"
            class="!border-none"
            :handles-size="32"
            :minHeight="52"
            :minWidth="52"
          >
            <iframe
              :src="`/_stories/iframe?${queryString}`"
              class="w-full h-full border-t-2 border-l-2 border-dashed border-neutral-700"
            />
          </draggable-resizable-vue>
        </draggable-resizable-container>
        <p
          class="absolute top-1 right-1 bg-black/50 rounded-lg p-1 text-xs font-semibold text-neutral-400 hover:text-white border border-black/90 shadow-lg"
        >
          {{ isNaN(Number(resizableElement.width)) ? resizableElement.width : Number(resizableElement.width) - 2 }}
          &times;
          {{ isNaN(Number(resizableElement.height)) ? resizableElement.height : Number(resizableElement.height) - 2 }}
        </p>
      </section>
      <iframe v-else :src="`/_stories/iframe?${queryString}`" class="w-full h-full" />
      <section v-if="activeComponent" class="w-full overflow-auto border-t border-neutral-600 relative h-full">
        <header
          class="w-full p-4 bg-black/50 backdrop-blur sticky top-0 border-b z-10 border-neutral-800 flex justify-between items-center"
        >
          <h2 class="text-lg">Controls</h2>
          <button
            @click="
              () => {
                resizableElement.height = 'auto'
                state.controls.open = !state.controls.open
              }
            "
          >
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
            :class="{ 'border-t border-neutral-900': index! > 0 }"
          >
            <p>
              {{ label }}
              <span class="text-neutral-500 text-xs">({{ control.required ? 'required' : 'optional' }})</span>
            </p>
            <pre
              class="text-[10px] text-neutral-300 p-1 rounded-lg bg-black/40 my-0.5"
            ><code>{{ control.type }}</code></pre>
            <StoryControl
              :controlType="activeComponent.controls[label].type?.controlType"
              :type="activeComponent.controls[label].type?.type"
              :elements="activeComponent.controls[label].type?.elements"
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
import { DraggableResizableVue, DraggableResizableContainer } from 'draggable-resizable-vue3'
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

const stories = getStories()

const components = Object.entries(stories).map(([storyGroup, storyExports]) => {
  return {
    label: storyGroup,
    value: 'default' in storyExports ? [kebabCase(storyGroup), 'default'].join('_') : storyGroup,
    children: Object.keys(storyExports)
      .filter((storyName) => storyName != 'default')
      .map((storyName) => ({
        label: storyName,
        value: [kebabCase(storyGroup), kebabCase(storyName)].join('_'),
      })),
  }
})

const resizableElement = ref({
  x: 0,
  y: 0,
  width: 'auto',
  height: 'auto',
  isActive: true,
})

const state = reactive({
  controls: {
    open: true,
    position: 'bottom' as 'right' | 'bottom',
  },
  canvas: {
    resizable: false,
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
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      if (query.component === [kebabCase(storyGroup), storyName].join('_')) {
        return story
      }
    }
  }
  return null
})

const queryString = computed(() => {
  return `component=${query.component}&controls=${JSON.stringify(query.controls)}`
})

const route = useRoute()
const router = useRouter()
watch(queryString, () => {
  router.replace({
    path: route.path,
    query: Object.fromEntries(new URLSearchParams(queryString.value).entries()),
  })
})

onMounted(() => {
  if (route.query) {
    query.component = route.query.component + ''
    query.controls = tryParseOrEmptyObject(route.query.controls + '')
  }
})
</script>

<style>
.drv-handles .drv-handle-mr {
  width: 2rem;
  transition: all 100ms ease-in;
  transform: translate(100%, 0px) !important;
  top: 0px !important;
  bottom: 0px !important;
  cursor: ew-resize;
  background-color: theme('colors.neutral.800');
}
.drv-handles .drv-handle-bm {
  height: 2rem;
  transition: all 100ms ease-in;
  transform: translate(0px, 100%) !important;
  left: 0px !important;
  right: 0px !important;
  cursor: ns-resize;
  background-color: theme('colors.neutral.800');
}
.drv-handles .drv-handle-bm::after {
  position: absolute;
  content: ' ';
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 6px;
  border-top: 2px solid theme('colors.neutral.400');
  border-bottom: 2px solid theme('colors.neutral.400');
}
.drv-handles .drv-handle-mr::after {
  position: absolute;
  content: ' ';
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 2rem;
  width: 6px;
  border-left: 2px solid theme('colors.neutral.400');
  border-right: 2px solid theme('colors.neutral.400');
}
.drv-handles .drv-handle-br {
  height: 2rem;
  transition: all 100ms ease-in;
  width: 2rem;
  cursor: nwse-resize;
  background-color: theme('colors.neutral.600');
}
.drv-handles .drv-handle-br::after {
  position: absolute;
  content: ' ';
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  height: 10px;
  width: 6px;
  border-left: 2px solid theme('colors.neutral.400');
  border-right: 2px solid theme('colors.neutral.400');
}

.drv-handles .drv-handle-br:hover {
  background-color: theme('colors.neutral.700');
}
.drv-handles .drv-handle-br:hover::after {
  border-left: 2px solid theme('colors.blue.400');
  border-right: 2px solid theme('colors.blue.400');
}

.drv-handles .drv-handle-bm:hover {
  background-color: theme('colors.neutral.700');
}
.drv-handles .drv-handle-bm:hover::after {
  border-top: 2px solid theme('colors.blue.400');
  border-bottom: 2px solid theme('colors.blue.400');
}

.drv-handles .drv-handle-mr:hover {
  background-color: theme('colors.neutral.700');
}
.drv-handles .drv-handle-mr:hover::after {
  border-left: 2px solid theme('colors.blue.400');
  border-right: 2px solid theme('colors.blue.400');
}
</style>
