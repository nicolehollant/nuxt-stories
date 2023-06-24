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

const asdf = (args: any) => <MyButton {...args.props}></MyButton>
type foo = ReturnType<typeof asdf>

export const hello = defineStory({
  component: MyButton,
  title: 'MyButton: hello',
  args: {
    label: 'hello',
    theme: 'secondary',
  },
  render: (args) => <MyButton {...args.props}>{...Object.values(args.slots).map((a) => a?.({}))}</MyButton>,
  docs: {
    description: 'its a button',
  },
})

export const world = defineStory({
  component: MyButton,
  title: 'MyButton: world',
  args: {
    label: 'world',
    theme: 'tertiary',
  },
  render: (args) =>
    defineComponent(() => () => (
      <MyButton {...args.props}>{...Object.values(args.slots).map((a) => a?.({}))}</MyButton>
    )),
  docs: {
    description: 'its a button',
  },
})
