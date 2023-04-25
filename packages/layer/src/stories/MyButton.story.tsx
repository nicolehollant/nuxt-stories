import MyButton from '../components/MyButton.vue'

export default defineStory({
  component: MyButton,
  title: 'MyButton: default',
  args: {
    label: 'hi',
    theme: 'primary',
  },
})

export const hello = defineStory({
  component: MyButton,
  title: 'MyButton: hello',
  args: {
    label: 'hello',
    theme: 'secondary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args}></MyButton>),
})

export const world = defineStory({
  component: MyButton,
  title: 'MyButton: world',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args}></MyButton>),
})