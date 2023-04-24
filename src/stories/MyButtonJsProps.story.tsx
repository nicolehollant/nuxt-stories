import MyButtonJsProps from '~/components/MyButtonJsProps.vue'

export default defineStory({
  component: MyButtonJsProps,
  title: 'UI/MyButtonJsProps',
  args: {
    label: 'hi',
    theme: 'primary',
  },
})

export const hello = defineStory({
  component: MyButtonJsProps,
  title: 'UI/MyButtonJsProps',
  args: {
    label: 'hello',
    theme: 'secondary',
  },
  render: (args) => defineComponent(() => () => <MyButtonJsProps {...args}></MyButtonJsProps>),
})

export const world = defineStory({
  component: MyButtonJsProps,
  title: 'UI/MyButtonJsProps',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) => defineComponent(() => () => <MyButtonJsProps {...args}></MyButtonJsProps>),
})
