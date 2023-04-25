# @nuxt-fable/module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Stories built for nuxt 🏔📚

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@nuxt-fable/module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- write stories in `/stories/**/*.stories.(jsx|tsx|vue)`
- auto generate stories for components in your components directory

## Quick Setup

1. Add `@nuxt-fable/module` dependency to your project

```bash
# Using pnpm
pnpm add -D @nuxt-fable/module

# Using yarn
yarn add --dev @nuxt-fable/module

# Using npm
npm install --save-dev @nuxt-fable/module
```

2. Add `@nuxt-fable/module` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@nuxt-fable/module'
  ]
})
```

That's it! You can now use @nuxt-fable/module in your Nuxt app ✨

## Advanced Usage Notes

We generate slots/props using [vue-docgen-api](https://github.com/vue-styleguidist/vue-styleguidist), if you need more configuration from within your files, try looking [here](https://vue-styleguidist.github.io/docs/Documenting.html#code-comments)

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt-fable/module/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt-fable/module

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxt-fable/module.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt-fable/module

[license-src]: https://img.shields.io/npm/l/@nuxt-fable/module.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxt-fable/module

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
