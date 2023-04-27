import { MyButton } from '#components'

export default defineStory({
  component: MyButton,
  title: 'MyButton: default',
  args: {
    label: 'hi',
    theme: 'primary',
  },
  slotArgs: {
    default: () => <div>some slot content</div>,
  },
})

export const hello = defineStory({
  component: MyButton,
  title: 'MyButton: hello',
  args: {
    label: 'hello',
    theme: 'secondary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args.props}></MyButton>),
})

export const world = defineStory({
  component: MyButton,
  title: 'MyButton: world',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args.props}></MyButton>),
})
