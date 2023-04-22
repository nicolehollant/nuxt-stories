import { DefineComponent } from 'nuxt/dist/app/compat/capi'

const propFnStringToPropType = (propFnString?: string) => {
  if (propFnString == null) {
    return 'null'
  }
  const propType = propFnString.split('()')[0].split(/\s+/)[1].toLowerCase() as
    | 'array'
    | 'string'
    | 'object'
    | 'boolean'
    | 'number'
    | 'function'
  return propType
}

const propTypeToControlValue = (
  propType: 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array' | 'function'
) => {
  return {
    string: '',
    number: 0,
    boolean: false,
    object: {},
    null: null,
    array: [],
    function: () => {},
  }[propType]
}

type propTypes = {
  [prop: string]: {
    required: boolean
    type: Function
  }
}

const generateControls = (
  component: propTypes
): {
  [prop: string]: {
    required: boolean
    type: ReturnType<typeof propFnStringToPropType>
  }
} =>
  Object.fromEntries(
    Object.entries(component).map(([key, value]: [string, any]) => {
      return [key, { required: value?.required, type: propFnStringToPropType(value?.type?.toString()) }]
    })
  )

const generateArgs = (
  component: propTypes
): {
  [prop: string]: ReturnType<typeof propTypeToControlValue> | undefined
} =>
  Object.fromEntries(
    Object.entries(component).map(([key, value]: [string, any]) => {
      return [key, propTypeToControlValue(propFnStringToPropType(value?.type?.toString()))]
    })
  )

type StoryParams<T extends (abstract new (...args: any) => any) & { props?: any }> = {
  component: T
  title: string
  args?: Partial<InstanceType<T>['$props']>
  controls?: Partial<ReturnType<typeof generateControls>>
  render?: (args: InstanceType<T>['$props']) => DefineComponent
}

type Story<T extends (abstract new (...args: any) => any) & { props?: any }> = {
  component: T
  title: string
  args: InstanceType<T>['$props']
  controls: ReturnType<typeof generateControls>
  render: (args: InstanceType<T>['$props']) => DefineComponent
}

export function defineStory<T extends (abstract new (...args: any) => any) & { props?: any }>(
  storyDefinition: StoryParams<T>
): Story<T> {
  return {
    render: (args) =>
      defineComponent({
        setup() {
          return () => h(storyDefinition.component as any, args)
        },
      }),
    ...storyDefinition,
    controls: {
      ...generateControls(storyDefinition.component.props),
      ...Object.fromEntries(Object.entries(storyDefinition.controls ?? {}).filter(([_k, val]) => !!val)),
    } as ReturnType<typeof generateControls>,
    args: { ...generateArgs(storyDefinition.component.props), ...storyDefinition.args },
  }
}
