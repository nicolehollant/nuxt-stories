import MyButton from '../components/MyButton.vue'

export default defineStory({
  component: MyButton,
  title: 'MyButton: default',
  args: {
    label: 'hi',
    theme: 'primary',
  },
  slotArgs: {
    default: () => <div>hiasjdhfkansdhfa</div>,
  },
  docs: {
    description: 'its a button',
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
  docs: {
    description: 'its a button',
    args: {
      label: 'Hello World',
    },
  },
})

export const world = defineStory({
  component: MyButton,
  title: 'MyButton: world',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) => defineComponent(() => () => <MyButton {...args.props}></MyButton>),
  docs: {
    description: 'its a button',
  },
})
