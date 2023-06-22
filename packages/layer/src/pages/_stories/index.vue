<template>
  <main class="fable-main">
    <button class="fable-aside-open-backdrop" @click="state.nav.open = false"></button>
    <aside class="fable-aside" :class="{ 'fable-aside__open': state.nav.open, 'fable-aside__closed': !state.nav.open }">
      <h1>
        {{ title || 'Nuxt Stories' }}
      </h1>
      <nav>
        <li v-for="component in components">
          <button
            @click="
              () => {
                query.component = component.value
                query.controls = {}
                query.slots = {}
              }
            "
            :class="{ 'active-nav': query.component === component.value }"
          >
            {{ component.label }}
          </button>
          <ul v-if="query.component.split('_')[0] === component.value.split('_')[0]">
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
                    query.slots = {}
                  }
                "
                :class="{ 'active-nav': query.component === childComponent.value }"
              >
                {{ childComponent.label }}
              </button>
            </li>
          </ul>
        </li>
      </nav>
    </aside>
    <div
      class="fable-component-container"
      :class="{
        'fable-component-container__empty': !activeComponent,
        'fable-component-container__controls-open': !!activeComponent && state.controls.open && state.mode === 'canvas',
        'fable-component-container__controls-closed': !state.controls.open,
      }"
    >
      <div>
        <h2 class="small-hidden" style="margin: 0; padding: 1rem; border-bottom: 1px dotted rgb(82, 82, 82)">
          {{ activeComponent?.title ?? 'Nuxt Stories' }}
        </h2>
        <header class="fable-component-header">
          <h2 class="small-block">{{ activeComponent?.title ?? 'Nuxt Stories' }}</h2>
          <div v-if="!!activeComponent" class="small-block fable-component-header-separator"></div>
          <div v-if="!!activeComponent" class="fable-button-row">
            <button @click="state.canvas.resizable = !state.canvas.resizable" class="fable-option-button">
              <Icon name="mdi:responsive"></Icon>
              <p class="small-block">{{ state.canvas.resizable ? 'Resizeable' : 'Fixed' }}</p>
            </button>
          </div>
          <div v-if="!!activeComponent" class="fable-button-tab-row">
            <button
              @click="state.mode = 'canvas'"
              class="fable-option-button-tab"
              :class="{ 'fable-option-button-tab-active': state.mode === 'canvas' }"
            >
              <Icon name="mdi:palette"></Icon>
              <p class="small-block">Canvas</p>
            </button>
            <button
              @click="state.mode = 'docs'"
              class="fable-option-button-tab"
              :class="{ 'fable-option-button-tab-active': state.mode === 'docs' }"
            >
              <Icon name="mdi:book-open-variant"></Icon>
              <p class="small-block">Docs</p>
            </button>
          </div>
          <div class="fable-button-row small-hidden" style="margin-left: auto">
            <button @click="state.nav.open = !state.nav.open" class="fable-option-button">
              <Icon name="mdi:menu"></Icon>
            </button>
          </div>
        </header>
      </div>
      <section v-if="state.mode === 'docs'" class="fable-canvas">
        <ComponentDocs
          v-if="!!activeComponent && activeComponent.component?.__docgenInfo"
          :docgen-info="activeComponent.component?.__docgenInfo"
          :story="activeComponent"
        ></ComponentDocs>
        <p v-else>No active component with docs</p>
      </section>
      <section v-else-if="state.canvas.resizable" class="fable-canvas fable-canvas-resizeable">
        <draggable-resizable-container :key="!!activeComponent && state.controls.open" class="fullsize">
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
            <iframe :src="`/_stories/iframe?${queryString}`" class="fullsize fable-iframe" />
          </draggable-resizable-vue>
        </draggable-resizable-container>
        <p fable-dimensions class="fable-dimensions">
          {{ isNaN(Number(resizableElement.width)) ? resizableElement.width : Number(resizableElement.width) - 2 }}
          &times;
          {{ isNaN(Number(resizableElement.height)) ? resizableElement.height : Number(resizableElement.height) - 2 }}
        </p>
      </section>
      <iframe v-else :src="`/_stories/iframe?${queryString}`" class="fullsize" />
      <section v-if="activeComponent && state.mode === 'canvas'" class="fable-controls">
        <header class="controls-header">
          <h2>Controls</h2>
          <button
            @click="
              () => {
                resizableElement.height = 'auto'
                state.controls.open = !state.controls.open
              }
            "
          >
            <Icon
              class="fable-control-toggle"
              :class="{ 'fable-control-toggle--open': !state.controls.open }"
              name="mdi:chevron-down"
            ></Icon>
          </button>
        </header>
        <div class="fable-controls-menu" v-if="state.controls.open">
          <h3>Props</h3>
          <label
            v-for="(control, label, index) in activeComponent.controls"
            class="fable-control-field"
            :class="{ 'fable-control-field--separated': index! > 0 }"
          >
            <details>
              <summary>
                <p>
                  {{ label }}
                  <span>({{ control.required ? 'required' : 'optional' }})</span>
                </p>
              </summary>
              <pre><code>{{ control.type }}</code></pre>
            </details>
            <StoryControl
              :controlType="activeComponent.controls[label].type?.controlType"
              :type="activeComponent.controls[label].type?.type"
              :elements="activeComponent.controls[label].type?.elements"
              :model-value="(query.controls as any)?.[label] ?? (label in activeComponent.args ? (activeComponent.args as any)[label] : '')"
              @update:model-value="(val: any) => (query.controls as any)[label] = val"
            />
          </label>
          <h3>Slots</h3>
          <label
            v-for="(control, label, index) in activeComponent.slotControls"
            class="fable-control-field"
            :class="{ 'fable-control-field--separated': index! > 0 }"
          >
            <details>
              <summary>
                <p>
                  {{ label }}
                </p>
              </summary>
              <pre><code>{{ control }}</code></pre>
            </details>
            <StoryControl
              controlType="string"
              type="string"
              :model-value="(query.slots as any)?.[label] ?? (label in activeComponent.slots ? activeComponent.slots[label] : '')"
              @update:model-value="(val: any) => (query.slots as any)[label] = val"
            />
          </label>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="tsx">
import { DraggableResizableVue, DraggableResizableContainer } from 'draggable-resizable-vue3'
import { getStories, title } from '#stories'

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
    value: 'default' in storyExports ? [kebabCase(storyGroup), 'default'].join('_') : kebabCase(storyGroup),
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
  mode: 'canvas' as 'canvas' | 'docs',
  nav: {
    open: false,
  },
})

const query = reactive({
  component: '',
  controls: {},
  slots: {},
})

const activeComponent = computed(() => {
  if (!query.component) {
    return null
  }
  for (const [storyGroup, storyExports] of Object.entries(stories)) {
    for (const [storyName, story] of Object.entries(storyExports)) {
      if (query.component === [kebabCase(storyGroup), kebabCase(storyName)].join('_')) {
        return story
      }
    }
  }
  return null
})

const queryString = computed(() => {
  return `component=${query.component}&controls=${JSON.stringify(query.controls)}&slots=${JSON.stringify(query.slots)}`
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
    query.slots = tryParseOrEmptyObject(route.query.slots + '')
  }
})
</script>

<style>
/* page */
.fable-main {
  display: grid;
  height: 100%;
  overflow: hidden;
}
.fable-aside {
  padding-bottom: 2rem /* 32px */;
  border-right: 1px solid rgb(82, 82, 82);
  height: 100%;
  grid-template-rows: auto minmax(0px, 1fr);
}
.fable-aside h1 {
  width: 100%;
  padding: 1rem;
  border-bottom: 1px solid rgb(82, 82, 82);
  font-size: 1.25rem /* 20px */;
  line-height: 1.75rem /* 28px */;
  height: 4rem;
  display: flex;
  align-items: center;
  margin: 0;
}

.fable-main nav {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  overflow: auto;
  max-height: 100%;
  height: max-content;
}

.fable-main nav li {
  list-style-type: none;
  height: max-content;
}

.fable-main nav li button {
  font-size: 0.75rem /* 12px */;
  line-height: 1rem /* 16px */;
}

@media (min-width: 640px) {
  .fable-main nav li button {
    font-size: 0.875rem /* 14px */;
    line-height: 1.25rem /* 20px */;
  }
}

.active-nav {
  text-decoration-line: underline;
  color: rgb(125, 211, 252);
}

.fable-main nav li ul {
  margin-left: 0.75rem /* 12px */;
  margin-top: 0.25rem /* 4px */;
}

.fable-component-container {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: auto;
}

.fable-component-container__empty {
  grid-template-rows: auto minmax(0, 1fr);
}
.fable-component-container__controls-open {
  grid-template-rows: auto minmax(0, 1fr) minmax(0px, 500px);
}
.fable-component-container__controls-closed {
  grid-template-rows: auto minmax(0, 1fr) auto;
}
.controls-header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgb(82, 82, 82);
  backdrop-filter: blur(8px);
}
.fable-component-header {
  display: flex;
  overflow: auto;
  padding: 1rem;
  align-items: center;
  width: 100%;
  height: 4rem;
  border-bottom: 1px solid rgb(82, 82, 82);
  gap: 1rem;
}

.fable-component-header-separator {
  margin-top: -1rem;
  margin-bottom: -1rem;
  border-left: 1px solid rgb(82, 82, 82);
  height: calc(100%+2rem);
}

.fable-button-row {
  display: flex;
  align-items: center;
}

.fable-option-button {
  display: flex;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  align-items: center;
  border-radius: 0.5rem;
  gap: 0.75rem;
  height: 32px;
  background-color: rgb(23, 23, 23);
}
.fable-option-button:hover {
  background-color: rgb(38, 38, 38);
}
.fable-option-button p {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: rgba(229, 229, 229, 0.8);
  margin: 0;
}

.fable-button-tab-row {
  display: flex;
  align-items: center;
  background-color: rgb(23, 23, 23);
  padding: 0.25rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
  height: 32px;
}

.fable-option-button-tab-active {
  background-color: rgb(38, 38, 38);
}
.fable-option-button-tab {
  display: flex;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  align-items: center;
  border-radius: 0.5rem;
  gap: 0.5rem;
}
.fable-option-button-tab:hover {
  background-color: rgb(3, 3, 3);
}
.fable-option-button-tab p {
  font-size: 0.875rem;
  line-height: 1.2rem;
  font-weight: 500;
  color: rgba(229, 229, 229, 0.8);
  margin: 0;
}

.fable-canvas {
  overflow-x: hidden;
  position: relative;
  padding: 1rem;
  width: 100%;
  min-height: 100%;
  height: auto;
}
.fable-canvas-resizeable {
  padding-right: 3rem;
  padding-bottom: 3rem;
}

.fullsize {
  width: 100%;
  height: 100%;
}
.fable-iframe {
  border-top-width: 2px;
  border-left-width: 2px;
  border-style: dashed;
  border-color: rgb(82, 82, 82);
}

.fable-control-toggle {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  width: 1.25rem;
  height: 1.25rem;
}
.fable-control-toggle--open {
  transform: -scaleY(1);
}
.controls-header h2 {
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
}
.fable-controls {
  overflow: auto;
  position: relative;
  width: 100%;
  height: 100%;
  border-top-width: 1px;
  border-color: rgb(82, 82, 82);
}

.fable-controls-menu {
  display: grid;
  padding: 1rem;
}
.fable-controls-menu h3 {
  padding-bottom: 1rem;
  color: #60a5fa;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom-width: 1px;
  border-color: rgb(23, 23, 23);
}

.fable-control-field {
  display: grid;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  gap: 0.25rem;
}
.fable-control-field--separated {
  border-top: 1px solid rgb(23, 23, 23);
}

.fable-control-field details summary {
  color: rgb(82, 82, 82);
  font-size: 0.75rem /* 12px */;
  line-height: 1rem /* 16px */;
}
.fable-control-field details summary p {
  display: inline;
  margin-left: 0.25rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgb(229, 229, 229);
}
.fable-control-field details summary p span {
  color: rgb(115, 115, 115);
  font-size: 0.75rem /* 12px */;
  line-height: 1rem /* 16px */;
}

.fable-control-field details pre {
  padding: 0.25rem;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: rgb(212, 212, 212);
}
.fable-dimensions {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border-width: 1px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: rgba(0, 0, 0, 0.5);

  color: rgb(163, 163, 163);

  border-color: rgba(0, 0, 0, 0.9);
}

.fable-dimensions:hover {
  color: #ffffff;
}
/* draggable resizable */

/* resizeable stuff */
.drv-handles .drv-handle-mr {
  width: 2rem;
  transition: all 100ms ease-in;
  transform: translate(100%, 0px) !important;
  top: 0px !important;
  bottom: 0px !important;
  cursor: ew-resize;
  background-color: #262626;
}
.drv-handles .drv-handle-bm {
  height: 2rem;
  transition: all 100ms ease-in;
  transform: translate(0px, 100%) !important;
  left: 0px !important;
  right: 0px !important;
  cursor: ns-resize;
  background-color: #262626;
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
  border-top: 2px solid #a3a3a3;
  border-bottom: 2px solid #a3a3a3;
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
  border-left: 2px solid #a3a3a3;
  border-right: 2px solid #a3a3a3;
}
.drv-handles .drv-handle-br {
  height: 2rem;
  transition: all 100ms ease-in;
  width: 2rem;
  cursor: nwse-resize;
  background-color: #525252;
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
  border-left: 2px solid #a3a3a3;
  border-right: 2px solid #a3a3a3;
}

.drv-handles .drv-handle-br:hover {
  background-color: #404040;
}
.drv-handles .drv-handle-br:hover::after {
  border-left: 2px solid #60a5fa;
  border-right: 2px solid #60a5fa;
}

.drv-handles .drv-handle-bm:hover {
  background-color: #404040;
}
.drv-handles .drv-handle-bm:hover::after {
  border-top: 2px solid #60a5fa;
  border-bottom: 2px solid #60a5fa;
}

.drv-handles .drv-handle-mr:hover {
  background-color: #404040;
}
.drv-handles .drv-handle-mr:hover::after {
  border-left: 2px solid #60a5fa;
  border-right: 2px solid #60a5fa;
}
.drv {
  border: none !important;
}

.fable-aside__open {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  min-width: max(260px, 64vw);
}

.fable-aside__closed {
  display: none;
}

.fable-aside-open-backdrop {
  display: none;
}

.fable-main:has(.fable-aside__open) .fable-aside-open-backdrop {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #00000040;
  backdrop-filter: blur(2px);
  z-index: 10;
  grid-area: 3;
}

.small-block {
  display: none;
}

@media (min-width: 640px) {
  .fable-component-header {
    gap: 2rem;
  }
  .fable-option-button {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    height: 36px;
  }

  .fable-button-tab-row {
    height: 36px;
  }

  .fable-option-button-tab {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .fable-main {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .fable-aside__open {
    position: static;
    top: unset;
    left: unset;
    z-index: unset;
    min-width: 0;
  }

  .fable-aside,
  .fable-aside__closed {
    display: grid;
  }
  .small-hidden {
    display: none;
  }
  .small-block {
    display: block;
  }
  .fable-aside-open-backdrop {
    display: none;
  }
  .fable-main:has(.fable-aside__open) .fable-aside-open-backdrop {
    display: none;
  }
}
</style>
