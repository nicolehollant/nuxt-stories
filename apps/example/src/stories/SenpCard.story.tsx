import SenpCardVue from '~/components/SenpCard.vue'

export default defineStory({
  component: SenpCardVue,
  title: 'SenpCard: default',
  slotArgs: {
    default: () => <div>some slot content</div>,
  },
})

export const titled = defineStory({
  component: SenpCardVue,
  title: 'SenpCard: titled',
  args: {
    title: 'Some Title',
    type: 'header',
  },
  slotArgs: {
    default: () => <div>some slot content</div>,
  },
})
