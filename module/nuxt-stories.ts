import { defineNuxtModule, createResolver, addTemplate, updateTemplates } from '@nuxt/kit'
import glob from 'fast-glob'
import { extname } from 'pathe'
import { withTrailingSlash, joinURL } from 'ufo'
import { outdent } from 'outdent'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-stories',
    configKey: 'nuxtStories',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const buildResolver = createResolver(nuxt.options.buildDir)
    nuxt.options.alias['#stories'] = addTemplate({
      write: true,
      filename: buildResolver.resolve('stories.ts'),
      getContents: async () => {
        const stories = (await glob(joinURL(withTrailingSlash(nuxt.options.rootDir), '/**/*.story.*')))
          .map((path) => {
            const key = `story_${path.replace(withTrailingSlash(nuxt.options.rootDir), '').replace(extname(path), '')}`
            return { key, path }
          })
          .filter(({ path }) => !path.includes('/dist/'))
        const parseStoryName = (key: string) => key.split('/').at(-1)?.split('.story')[0] + 'Story'
        return outdent`
          ${stories
            .map(({ key, path }) => {
              if (extname(path) !== '.vue') {
                path = path.replace(extname(path), '')
              }
              return `import * as ${parseStoryName(key)} from '${path}'`
            })
            .join('\n')}

          export const getStories = () => ({
          ${stories.map(({ key }) => `  ${parseStoryName(key)},`).join('\n')}
          })
        `
      },
    }).dst

    if (nuxt.options.dev) {
      nuxt.hook('builder:watch', (_, path) => {
        if (path.includes('story')) {
          updateTemplates({
            filter: (template) => template.dst === nuxt.options.alias['#stories'],
          })
        }
      })
    }
  },
})
