<template>
  <div class="prose prose-invert">
    <h1 style="margin-top: 0.5rem">
      <Icon name="mdi:book-open-variant" size="32" style="color: #737373; margin-top: -8px"></Icon>
      {{ docgenInfo?.displayName || docgenInfo?.exportName || '[Unknown Component]' }}
    </h1>
    <p v-if="docgenInfo?.description || story?.docs?.description">
      {{ docgenInfo.description || story.docs.description }}
    </p>
    <hr style="border-color: #333" />
    <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem">
      <button
        style="color: #fff; padding: 0.5rem 0.5rem; font-size: 0.75rem; line-height: 1; border-radius: 0.5rem"
        :style="
          state.componentBackground === 'dim'
            ? 'outline: 1px solid #525252; background-color: #333333'
            : 'background-color: #232323'
        "
        @click="state.componentBackground = 'dim'"
      >
        dim
      </button>
      <button
        style="color: #fff; padding: 0.5rem 0.5rem; font-size: 0.75rem; line-height: 1; border-radius: 0.5rem"
        :style="
          state.componentBackground === 'bright'
            ? 'outline: 1px solid #525252; background-color: #333333'
            : 'background-color: #232323'
        "
        @click="state.componentBackground = 'bright'"
      >
        bright
      </button>
      <button
        style="color: #fff; padding: 0.5rem 0.5rem; font-size: 0.75rem; line-height: 1; border-radius: 0.5rem"
        :style="
          state.componentBackground === 'white'
            ? 'outline: 1px solid #525252; background-color: #333333'
            : 'background-color: #232323'
        "
        @click="state.componentBackground = 'white'"
      >
        white
      </button>
      <button
        style="color: #fff; padding: 0.5rem 0.5rem; font-size: 0.75rem; line-height: 1; border-radius: 0.5rem"
        :style="
          state.componentBackground === 'black'
            ? 'outline: 1px solid #525252; background-color: #333333'
            : 'background-color: #232323'
        "
        @click="state.componentBackground = 'black'"
      >
        black
      </button>
    </div>
    <div
      class="component-wrapper"
      v-if="Comp"
      :style="{
        backgroundColor: {
          dim: 'rgb(23, 23, 23)',
          bright: 'rgb(230, 230, 230)',
          white: '#ffffff',
          black: '#000000',
        }[state.componentBackground],
        border: {
          dim: '1px solid #000000 ',
          bright: '1px solid #ffffff',
          white: '1px solid rgb(230, 230, 230)',
          black: '1px solid rgb(23, 23, 23)',
        }[state.componentBackground],
      }"
    >
      <Component :is="Comp"></Component>
    </div>
    <hr style="border-color: #333" />
    <h2 v-if="filteredProps">Props</h2>
    <DataTable v-if="filteredProps" :rows="filteredProps" :columns="['Name', 'Description', 'Default', 'Controls']">
      <tr v-for="(row, i) in filteredProps" :key="'row-' + i">
        <td>
          <div>
            {{ row.name }}
          </div>
          <div v-if="row.required" style="font-size: 0.75em; color: #fbbf24">required*</div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.75rem">
            <div v-if="row.description" style="white-space: pre-wrap">{{ row.description }}</div>
            <pre><code v-if="row.type" style="color: #93c5fd; font-size: 0.8em">{{
                row.type.elements?.length
                  ? row.type.elements
                      .map((elem) => (typeof elem === 'object' ? JSON.stringify(elem) : elem))
                      .join(' | ')
                  : row.type.type
              }}</code></pre>
          </div>
        </td>
        <td>
          <code style="color: #2dd4bf; font-size: 0.8em">
            {{ row.defaultValue }}
          </code>
        </td>
        <td style="width: 20rem">
          <div style="width: 20rem; position: relative">
            <StoryControl
              :controlType="story.controls[row.name].type?.controlType"
              :type="story.controls[row.name].type?.type"
              :elements="story.controls[row.name].type?.elements"
              :model-value="(query.controls as any)?.[row.name] ?? (row.name in story.docs.render.args ? (story.docs.render.args as any)[row.name] : '')"
              @update:model-value="(val: any) => (query.controls as any)[row.name] = val"
            />
          </div>
        </td>
      </tr>
    </DataTable>
    <div v-else style="color: #d4d4d4; font-size: 0.875rem">Component has no detected props</div>
    <hr v-if="filteredSlots" style="border-color: #333" />
    <h2 v-if="filteredSlots">Slots</h2>
    <DataTable v-if="filteredSlots" :rows="filteredSlots" :columns="['Name', 'Description', 'Bindings', 'Controls']">
      <tr v-for="(row, i) in filteredSlots" :key="'row-' + i">
        <td>
          {{ row.name }}
        </td>
        <td>
          <div>
            <div v-if="row.description" style="white-space: pre-wrap">{{ row.description }}</div>
            <pre v-if="row.tags"><code>{{ row.tags }}</code></pre>
          </div>
        </td>
        <td>
          <pre><code>{{ row.bindings }}</code></pre>
        </td>
        <td style="width: 20rem">
          <div style="width: 20rem; position: relative">
            <StoryControl
              controlType="string"
              type="string"
              :model-value="(query.slots as any)?.[row.name] ?? (row.name in story.docs.render.slots ? story.docs.render.slots[row.name] : '')"
              @update:model-value="(val: any) => (query.slots as any)[row.name] = val"
            />
            <button
              v-if="(query.slots as any)[row.name] != null"
              @click="() => (query.slots as any)[row.name] = null"
              style="
                margin-top: 0.25rem;
                background-color: #450a0a;
                color: #fecaca;
                padding: 0.25rem 0.5rem;
                border-radius: 0.5rem;
              "
            >
              Clear Slot
            </button>
          </div>
        </td>
      </tr>
    </DataTable>
    <div v-else style="color: #d4d4d4; font-size: 0.875rem">Component has no detected slots</div>
    <hr style="border-color: #333" />
    <details>
      <summary style="color: #333">
        <div style="display: inline; margin-left: 0.5rem; color: white">Full Docgen</div>
      </summary>
      <pre><code>{{ ({ ...docgenInfo, sourceFiles: undefined }) }}</code></pre>
    </details>
  </div>
</template>

<script setup lang="tsx">
import { useStoryUtils } from '#imports'
import { DefineComponent } from 'vue'
import type { ComponentDoc } from 'vue-docgen-api'

const { generateControls, generateSlotControls } = useStoryUtils()
export type Component = (abstract new (...args: any) => any) & {
  props?: any
} & {
  __docgenInfo?: ComponentDoc
}
export type Story<T extends Component> = {
  component: T
  title: string
  args: InstanceType<T>['$props']
  controls: ReturnType<typeof generateControls>
  slots: {
    [slotName in keyof Partial<InstanceType<T>['$slots']>]?: Component | VNode | (() => VNode | null) | string | null
  }
  slotControls?: ReturnType<typeof generateSlotControls>
  render: (args: { props: InstanceType<T>['$props']; slots: InstanceType<T>['$slots'] }) => DefineComponent
  docs: {
    description: string
    content: string
    render: {
      args: InstanceType<T>['$props']
      slots: {
        [slotName in keyof Partial<InstanceType<T>['$slots']>]?:
          | Component
          | VNode
          | (() => VNode | null)
          | string
          | null
      }
      defaultRenderer: (args: { props: InstanceType<T>['$props']; slots: InstanceType<T>['$slots'] }) => DefineComponent
    }
  }
}
const props = defineProps<{
  docgenInfo: ComponentDoc
  story: Story<any>
}>()

const query = reactive({
  slots: {},
  controls: {},
})

const state = reactive({
  componentBackground: 'dim' as 'dim' | 'bright' | 'white' | 'black',
})

const tryParseOrDefault = (val: string, replacement: any = undefined) => {
  try {
    if (val.startsWith("'") && val.endsWith("'")) {
      // silly hacky nonsense bc we get string default values as "'my string contents'" which is not parseable
      const replaced = '"' + val.slice(1, -1) + '"'
      if (typeof tryParseOrDefault(replaced, false) === 'string') {
        val = replaced
      }
    }
    return JSON.parse(val)
  } catch (error) {
    return replacement
  }
}

const parseElementsArray = (elements: any[]): any[] => {
  // [
  //   { "name": "Array", "elements": [ { "name": "Array", "elements": [ { "name": "string" } ] } ] },
  //   { "name": "Array", "elements": [ { "name": "Record", "elements": [ { "name": "string" }, { "name": "unknown" } ] } ] }
  // ]
  const primitiveTypeMap = {
    string: { type: 'string', controlType: 'string' },
    number: { type: 'number', controlType: 'number' },
    null: { type: 'null', controlType: 'null' },
    boolean: { type: 'boolean', controlType: 'boolean' },
    TSFunctionType: { type: 'function', controlType: 'function' },
    function: { type: 'function', controlType: 'function' },
    undefined: { type: 'undefined', controlType: 'null' },
    TSTupleType: { type: 'array', controlType: 'array' },
    array: { type: 'array', controlType: 'array' },
    object: { type: 'object', controlType: 'object' },
  }
  return elements.map((element) => {
    if (element.name === 'Array') {
      return 'Array<' + parseElementsArray(element.elements).join(', ') + '>'
    }
    if (element.name === 'Record') {
      return 'Record<' + parseElementsArray(element.elements).join(', ') + '>'
    }
    if (element.name in primitiveTypeMap) {
      return (primitiveTypeMap as any)[element.name].type
    }
    return element?.name || element
  })
}

const _parseComponentDocProps = (type: any): { type: string; controlType: string; elements?: any[] } => {
  const primitiveTypeMap = {
    string: { type: 'string', controlType: 'string' },
    number: { type: 'number', controlType: 'number' },
    null: { type: 'null', controlType: 'null' },
    boolean: { type: 'boolean', controlType: 'boolean' },
    TSFunctionType: { type: 'function', controlType: 'function' },
    function: { type: 'function', controlType: 'function' },
    undefined: { type: 'undefined', controlType: 'null' },
    TSTupleType: { type: 'array', controlType: 'array' },
    array: { type: 'array', controlType: 'array' },
    object: { type: 'object', controlType: 'object' },
  }
  if (type?.name in primitiveTypeMap) {
    return (primitiveTypeMap as any)[type?.name]
  }
  if ((type?.name + '').startsWith('{')) {
    return { type: type?.name, controlType: 'object' }
  }
  if (type?.name === 'union') {
    if (Array.isArray(type?.elements) && type.elements.length > 0) {
      if (type.elements.some((elem: any) => elem.name === 'Array' || elem.name === 'Record')) {
        type.elements = parseElementsArray(type.elements)
      }
      const firstElementParsed = tryParseOrDefault(type.elements[0].name, undefined)
      if (firstElementParsed === undefined) {
        return { type: type?.name, controlType: 'null', elements: type.elements }
      }
      if (
        (type.elements as { name: unknown }[]).every(
          ({ name }) => typeof tryParseOrDefault(name + '', undefined) === typeof firstElementParsed
        ) &&
        typeof firstElementParsed in primitiveTypeMap
      ) {
        return {
          type: type?.name,
          controlType: (primitiveTypeMap as any)[typeof firstElementParsed].controlType,
          elements: type.elements.map(({ name }: any) => name),
        }
      }
      return {
        type: type?.name,
        controlType: 'null',
        elements: type.elements.map(({ name }: any) => name),
      }
    }
    return { type: type?.name, controlType: 'null', elements: undefined }
  }
  if (type?.elements?.some((elem: any) => elem.name === 'Array' || elem.name === 'Record')) {
    type.elements = parseElementsArray(type.elements)
  } else if (type.name === 'Array' || type.name === 'Record') {
    if (type.name === 'Array') {
      type.elements = ['Array<' + parseElementsArray(type.elements).join(', ') + '>']
    }
    if (type.name === 'Record') {
      type.elements = ['Record<' + parseElementsArray(type.elements).join(', ') + '>']
    }
  }
  return { type: type?.name, controlType: 'null', elements: type?.elements }
}

const filteredProps = computed(() => {
  if (!props.docgenInfo?.props) {
    return null
  }
  return props.docgenInfo.props.map((prop) => {
    // name	description	required	type	tags	defaultValue
    return {
      name: prop.name,
      description: prop.description,
      required: prop.required,
      // type: parseComponentDocProps(prop.type),
      type: _parseComponentDocProps(prop.type),
      tags: prop.tags,
      defaultValue: prop.defaultValue?.value,
    }
  })
})

const filteredSlots = computed(() => {
  if (!props.docgenInfo?.slots) {
    return null
  }
  return props.docgenInfo.slots.map((slot) => {
    return {
      name: slot.name,
      description: slot.description,
      bindings: slot.bindings,
      scoped: slot.scoped,
      tags: slot.tags,
    }
  })
})

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
  if (!props.story) {
    return null
  }
  const slots = Object.fromEntries(
    Object.entries(JSON.parse(JSON.stringify(query.slots)))
      .filter(([_, val]) => val != null)
      .map(mapSlotsWithTemplate)
  )
  return props.story.docs.render.defaultRenderer({
    props: { ...props.story.docs.render.args, ...query.controls },
    slots: { ...props.story.docs.render.slots, ...slots },
  } as any)
})
</script>

<style>
.component-wrapper {
  padding: 3rem 2rem;
  border-radius: 1rem;
}
td {
  vertical-align: top;
}
.prose td pre {
  font-size: 0.875rem;
  line-height: 1.1;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  padding-top: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-left: 0;
}
</style>
