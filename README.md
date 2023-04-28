# nuxt-stories

> https://nuxt-stories.vercel.app/_stories/

hopefully could be good at some point

peep the [repo guide](./REPO_GUIDE.md)

## Todo:

higher priority:

- [ ] remove post-install scripts from `@nuxt-fable/module` or something like that 
```sh
# installation in a new project:
$/my-app: npm i @nuxt-fable/layer
    npm ERR! code 127
    npm ERR! path ~/tmp/nuxt-story-test/my-app/node_modules/@nuxt-fable/module
    npm ERR! command failed
    npm ERR! command sh -c -- nuxt-module-build --stub && pnpm dev:prepare
    npm ERR! sh: nuxt-module-build: command not found

    npm ERR! A complete log of this run can be found in:
    npm ERR!     ~/.npm/_logs/2023-04-28T11_44_39_265Z-debug-0.log
```
- [ ] remove `nuxt-icon` from `@nuxt-fable/layer`
- [ ] remove tailwind from `@nuxt-fable/layer`
- [ ] make module better ?

lower priority:

- [ ] add auto-docs like storybook has?
- [ ] better collision detection for stories with the same name (both for auto stories and regular stories i think)
- [ ] support different sized canvases
- [ ] support light/dark mode
- [ ] support controls on the right?
- [ ] support custom controls ?
- [ ] nuxt generate stories only?
- [ ] nuxt generate and ignore stories?
- [ ] improve navbar (maybe use default exported story as roots, and put other exports under it?)
- [ ] write docs (eventually) and have more examples?
- [ ] make controls better
- [ ] make autogen stories more configurable
- [ ] look more into compatibility stuff

## Todone:

- [x] publish the module
- [x] support slots
- [x] autogen stories for things in components dir
- [x] make this a monorepo (docs, module, layer, playground, any recipes or whatever idk)
- [x] figure out how to get vercel to work for this...
- [x] separate UI out into a layer
- [x] actually make a module
- [x] sync query string between iframe and main page
- [x] support a resizeable canvas
- [x] ig we need to do controls w codegen, forgot stuff compiles 

<details>

<summary style="display: inline">

# Nuxt 3 Minimal Starter

</summary>

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

</details>

shoutouts to https://github.com/andrewcourtice/vite-plugin-vue-docgen/blob/main/test/index.test.ts but i didn't wanna fight npm today

