export default defineAppConfig({
  docus: {
    title: 'Nuxt Fable',
    description: 'Unbelievably simple stories tailored for Nuxt',
    image: '/nuxt-fable-dark.svg',
    url: '/',
    socials: {
      github: 'nicolehollant/nuxt-stories',
    },
    aside: {
      level: 0,
      collapsed: false,
      exclude: [],
    },
    main: {
      padded: true,
      fluid: true,
    },
    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.dev',
      },
      textLinks: [
        {
          text: '👩‍💻💚 nicole',
          href: 'https://fleur.codes',
          target: '_blank',
        },
      ],
      iconLinks: [
        {
          href: 'https://stackblitz.com/edit/nuxt-starter-ct5hc5?file=stories%2FBadge.story.tsx',
          icon: 'simple-icons:stackblitz',
        },
        {
          href: 'https://www.npmjs.com/package/@nuxt-fable/layer',
          icon: 'simple-icons:npm',
        },
      ],
    },
  },
})
