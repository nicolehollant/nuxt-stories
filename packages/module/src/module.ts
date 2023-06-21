import {
  defineNuxtModule,
  createResolver,
  addTemplate,
  updateTemplates,
  addImports,
} from "@nuxt/kit";
import glob from "fast-glob";
import { extname } from "pathe";
import { withTrailingSlash, joinURL } from "ufo";
import { outdent } from "outdent";
import vueDocgenPlugin from "./vue-docgen-vite-plugin";
import { mergeConfig } from "vite";

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * title shown on story page
   */
  title?: string;
  /**
   * glob added after nuxt.rootDir
   */
  storiesGlob?: string[];
  /**
   * glob added after nuxt.rootDir
   */
  autoStoriesGlob?: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-stories",
    configKey: "nuxtStories",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    title: "Nuxt Fables",
  },
  setup(options, nuxt) {
    const moduleResolver = createResolver(import.meta.url);
    const buildResolver = createResolver(nuxt.options.buildDir);
    // need to clean this up!!!
    nuxt.options.alias["#stories"] = addTemplate({
      write: true,
      filename: buildResolver.resolve("stories.ts"),
      getContents: async () => {
        const parseStoryName = (key: string) =>
          key.split("/").at(-1)?.split(".story")[0] + "Story";
        const parseComponentName = (key: string) =>
          key.split("/").at(-1)?.split(".story")[0];

        const autoStories = (
          await glob(
            options.autoStoriesGlob?.length
              ? options.autoStoriesGlob.map((g) =>
                  joinURL(withTrailingSlash(nuxt.options.rootDir), g)
                )
              : joinURL(
                  withTrailingSlash(nuxt.options.srcDir),
                  "components",
                  "/**/*.vue"
                )
          )
        )
          .map((path) => {
            const key = `story_${path
              .replace(withTrailingSlash(nuxt.options.rootDir), "")
              .replace(extname(path), "")}`;
            return { key, path };
          })
          .filter(
            ({ path }) =>
              !path.includes("/dist/") &&
              !path.includes("node_modules/@nuxt-fable/module")
          );

        const stories = (
          await glob(
            options.storiesGlob?.length
              ? options.storiesGlob.map((g) =>
                  joinURL(withTrailingSlash(nuxt.options.rootDir), g)
                )
              : joinURL(
                  withTrailingSlash(nuxt.options.rootDir),
                  "/**/*.story.*"
                )
          )
        )
          .map((path) => {
            const key = `story_${path
              .replace(withTrailingSlash(nuxt.options.rootDir), "")
              .replace(extname(path), "")}`;
            return { key, path };
          })
          .filter(
            ({ path }) =>
              !path.includes("/dist/") &&
              !path.includes("node_modules/@nuxt-fable/module")
          );

        return outdent`
        import { defineStory } from '#imports'
          ${stories
            .map(({ key, path }) => {
              if (extname(path) !== ".vue") {
                path = path.replace(extname(path), "");
              }
              return `import * as ${parseStoryName(key)} from '${path}'`;
            })
            .join("\n")}
          ${autoStories
            .map(({ key, path }) => {
              if (extname(path) !== ".vue") {
                path = path.replace(extname(path), "");
              }
              return `import  ${parseComponentName(key)} from '${path}'`;
            })
            .join("\n")}
          const AutoStories = {
            ${autoStories
              .map(({ key, path }) => {
                return `${parseComponentName(key)}: defineStory({
                component: ${parseComponentName(key)},
                title: 'AutoStory: ${parseComponentName(key)}',
              })`;
              })
              .join("\n,")}
          }

          export const title = '${options.title}'

          export const getStories = () => ({
          ${stories.map(({ key }) => `  ${parseStoryName(key)},`).join("\n")}
          AutoStories,
          })
        `;
      },
    }).dst;

    addImports({
      from: moduleResolver.resolve("runtime/useStory"),
      name: "defineStory",
      as: "defineStory",
    });
    addImports({
      from: moduleResolver.resolve("runtime/useStory"),
      name: "useStoryUtils",
      as: "useStoryUtils",
    });

    // handle vite config
    const plugins = [vueDocgenPlugin()];
    nuxt.options.vite = mergeConfig(nuxt.options.vite, {
      plugins,
    });
    nuxt.hook("vite:extendConfig", (config, { isClient, isServer }) => {
      if (isClient) {
        if (!config.resolve) {
          config.resolve = { alias: {} };
        }
        if (!config.resolve.alias) {
          config.resolve.alias = {};
        }
        (config.resolve.alias as Record<string, string>).vue =
          "vue/dist/vue.esm-bundler.js";
      }
    });

    // watch stuff
    if (nuxt.options.dev) {
      nuxt.hook("builder:watch", (_, path) => {
        if (path.includes("story")) {
          updateTemplates({
            filter: (template) =>
              template.dst === nuxt.options.alias["#stories"],
          });
        }
      });
    }
  },
});
