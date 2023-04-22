import MyButton from '~/components/MyButton.vue'

console.log(MyButton)

export default defineStory({
  component: MyButton,
  title: 'UI/MyButton',
  args: {
    label: 'hi',
    theme: 'primary',
  },
})

export const hello = defineStory({
  component: MyButton,
  title: 'UI/MyButton',
  args: {
    label: 'hello',
    theme: 'secondary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args}></MyButton>),
})

export const world = defineStory({
  component: MyButton,
  title: 'UI/MyButton',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args}></MyButton>),
})
