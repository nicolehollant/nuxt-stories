# nuxt-stories

> https://nuxt-stories.vercel.app/_stories/

hopefully could be good at some point

peep the [repo guide](./REPO_GUIDE.md)

## Todo:

higher priority:

- [ ] support slots
- [ ] publish the module
- [ ] make module better ?
- [ ] figure out how to get vercel to work for this...
  - pipeline should be:
    - install for the module
    - build module
    - install for the layer (can't do this until module is build bc postinstall would fail)
    - build layer (? maybe this doesnt need to happen)
    - install for apps
    - build apps

lower priority:

- [ ] support different sized canvases
- [ ] support light/dark mode
- [ ] support controls on the right?
- [ ] support custom controls ?
- [ ] get rid of tailwind probably
- [ ] nuxt generate stories only?
- [ ] nuxt generate and ignore stories?
- [ ] improve navbar (maybe use default exported story as roots, and put other exports under it?)
- [ ] write docs (eventually) and have more examples?
- [ ] make controls better
- [ ] make autogen stories more configurable

## Todone:

- [x] autogen stories for things in components dir
- [x] make this a monorepo (docs, module, layer, playground, any recipes or whatever idk)
- [x] separate UI out into a layer
- [x] actually make a module
- [x] sync query string between iframe and main page
- [x] support a resizeable canvas
- [x] ig we need to do controls w codegen, forgot stuff compiles like this:
```js
import {a as o, o as p, b as r, t as e} from "./entry.5e7b0b8a.js";
const t = {
    class: "p-4 rounded-lg text-neutral-200 text-sm"
}
  , _ = o({
    __name: "Debugger",
    props: {
        prop_string: null,
        prop_object: null,
        prop_null: null,
        prop_number: null,
        prop_boolean: {
            type: Boolean
        },
        prop_function: {
            type: Function
        },
        prop_undefined: null,
        prop_array: null
    },
    setup(n) {
        return (l,u)=>(p(),
        r("pre", t, e({
            prop_string: n.prop_string,
            prop_object: n.prop_object,
            prop_null: n.prop_null,
            prop_number: n.prop_number,
            prop_boolean: n.prop_boolean,
            prop_function: n.prop_function,
            prop_undefined: n.prop_undefined,
            prop_array: n.prop_array
        }), 1))
    }
});
export {_};
```

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