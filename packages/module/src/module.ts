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
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-stories",
    configKey: "nuxtStories",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const moduleResolver = createResolver(import.meta.url);
    const buildResolver = createResolver(nuxt.options.buildDir);
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
            joinURL(
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
            joinURL(withTrailingSlash(nuxt.options.rootDir), "/**/*.story.*")
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
        // import { defineStory } from '#story-utils'
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

          export const getStories = () => ({
          ${stories.map(({ key }) => `  ${parseStoryName(key)},`).join("\n")}
          AutoStories,
          })
        `;
      },
    }).dst;

    // nuxt.options.alias["#story-utils"] = addTemplate({
    //   write: true,
    //   filename: buildResolver.resolve("story-utils.ts"),
    //   getContents: () => `import { defineComponent, h } from "#imports";
    //   // import { defineComponent, h, type VNode } from "vue";
    //   import type { DefineComponent, VNode } from "nuxt/dist/app/compat/capi";
    //   import type { ComponentDoc } from "vue-docgen-api";

    //   type Component = (abstract new (...args: any) => any) & { props?: any } & {
    //     __docgenInfo?: ComponentDoc;
    //   };

    //   type ControlType =
    //     | "string"
    //     | "number"
    //     | "boolean"
    //     | "object"
    //     | "null"
    //     | "array"
    //     | "function";

    //   type StoryParams<T extends Component> = {
    //     component: T;
    //     title: string;
    //     args?: Partial<InstanceType<T>["$props"]>;
    //     slotArgs?: {
    //       [slotName in keyof Partial<InstanceType<T>["$slots"]>]?:
    //         | Component
    //         | VNode
    //         | (() => VNode | null)
    //         | string
    //         | null;
    //     };
    //     controls?: Partial<ReturnType<typeof generateControls>>;
    //     render?: (args: {
    //       props: InstanceType<T>["$props"];
    //       slots: InstanceType<T>["$slots"];
    //     }) => DefineComponent;
    //   };

    //   type Story<T extends Component> = {
    //     component: T;
    //     title: string;
    //     args: InstanceType<T>["$props"];
    //     controls: ReturnType<typeof generateControls>;
    //     slots: {
    //       [slotName in keyof Partial<InstanceType<T>["$slots"]>]?:
    //         | Component
    //         | VNode
    //         | (() => VNode | null)
    //         | string
    //         | null;
    //     };
    //     slotControls?: ReturnType<typeof generateSlotControls>;
    //     render: (args: {
    //       props: InstanceType<T>["$props"];
    //       slots: InstanceType<T>["$slots"];
    //     }) => DefineComponent;
    //   };

    //   export const tryParseOrDefault = (
    //     val: string,
    //     replacement: any = undefined
    //   ) => {
    //     try {
    //       if (val.startsWith("'") && val.endsWith("'")) {
    //         // silly hacky nonsense bc we get string default values as "'my string contents'" which is not parseable
    //         const replaced = '"' + val.slice(1, -1) + '"';
    //         if (typeof tryParseOrDefault(replaced, false) === "string") {
    //           val = replaced;
    //         }
    //       }
    //       return JSON.parse(val);
    //     } catch (error) {
    //       return replacement;
    //     }
    //   };

    //   const propTypeToControlValue = (propType: ControlType) => {
    //     return {
    //       string: "",
    //       number: 0,
    //       boolean: false,
    //       object: {},
    //       null: null,
    //       array: [],
    //       function: () => {},
    //     }[propType];
    //   };

    //   const parseComponentDocProps = (
    //     type: any
    //   ): { type: string; controlType: ControlType; elements?: any[] } => {
    //     const primitiveTypeMap = {
    //       string: { type: "string", controlType: "string" },
    //       number: { type: "number", controlType: "number" },
    //       null: { type: "null", controlType: "null" },
    //       boolean: { type: "boolean", controlType: "boolean" },
    //       TSFunctionType: { type: "function", controlType: "function" },
    //       function: { type: "function", controlType: "function" },
    //       undefined: { type: "undefined", controlType: "null" },
    //       TSTupleType: { type: "array", controlType: "array" },
    //       array: { type: "array", controlType: "array" },
    //       object: { type: "object", controlType: "object" },
    //     };
    //     if (type?.name in primitiveTypeMap) {
    //       return (primitiveTypeMap as any)[type?.name];
    //     }
    //     if ((type?.name + "").startsWith("{")) {
    //       return { type: type?.name, controlType: "object" };
    //     }
    //     if (type?.name === "union") {
    //       if (Array.isArray(type?.elements) && type.elements.length > 0) {
    //         const firstElementParsed = tryParseOrDefault(
    //           type.elements[0].name,
    //           undefined
    //         );
    //         if (firstElementParsed === undefined) {
    //           return { type: type?.name, controlType: "null" };
    //         }
    //         if (
    //           (type.elements as { name: unknown }[]).every(
    //             ({ name }) =>
    //               typeof tryParseOrDefault(name + "", undefined) ===
    //               typeof firstElementParsed
    //           ) &&
    //           typeof firstElementParsed in primitiveTypeMap
    //         ) {
    //           return {
    //             type: type?.name,
    //             controlType: (primitiveTypeMap as any)[typeof firstElementParsed]
    //               .controlType,
    //             elements: type.elements.map(({ name }: any) =>
    //               tryParseOrDefault(name, undefined)
    //             ),
    //           };
    //         }
    //         return {
    //           type: type?.name,
    //           controlType: "null",
    //           elements: type.elements.map(({ name }: any) =>
    //             tryParseOrDefault(name, undefined)
    //           ),
    //         };
    //       }
    //       return { type: type?.name, controlType: "null", elements: undefined };
    //     }
    //     return { type: type?.name, controlType: "null" };
    //   };

    //   const generateControls = (
    //     component: ComponentDoc
    //   ): {
    //     [prop: string]: {
    //       required: boolean;
    //       type: ReturnType<typeof parseComponentDocProps>;
    //     };
    //   } => {
    //     const props = Object.fromEntries(
    //       (component.props ?? []).map((prop) => {
    //         return [
    //           prop.name,
    //           {
    //             required: prop?.required ?? false,
    //             type: parseComponentDocProps(prop?.type),
    //           },
    //         ];
    //       })
    //     );

    //     return props;
    //   };

    //   const generateArgs = (
    //     component: ComponentDoc
    //   ): {
    //     [prop: string]: ReturnType<typeof propTypeToControlValue> | undefined;
    //   } => {
    //     const props = Object.fromEntries(
    //       (component.props ?? []).map((prop) => {
    //         const hasDefaultValue = !!prop?.defaultValue;
    //         const defaultValue = hasDefaultValue
    //           ? prop.defaultValue!.func
    //             ? undefined
    //             : tryParseOrDefault(prop.defaultValue!.value, undefined)
    //           : undefined;
    //         return [
    //           prop.name,
    //           defaultValue ??
    //             propTypeToControlValue(
    //               parseComponentDocProps(prop?.type).controlType
    //             ),
    //         ];
    //       })
    //     );
    //     return props;
    //   };

    //   const generateSlotControls = (
    //     component: ComponentDoc
    //   ): {
    //     [slot: string]: NonNullable<ComponentDoc["slots"]>[number];
    //   } => {
    //     const slots = Object.fromEntries(
    //       (component.slots ?? []).map((slot) => {
    //         return [slot.name, slot];
    //       })
    //     );
    //     return slots;
    //   };

    //   const generateSlotArgs = (
    //     component: ComponentDoc
    //   ): {
    //     [slot: string]: Component | VNode | (() => VNode | null) | string | null;
    //   } => {
    //     const slots = Object.fromEntries(
    //       (component.slots ?? []).map((slot) => {
    //         return [slot.name, () => null];
    //       })
    //     );
    //     return slots;
    //   };

    //   export function defineStory<T extends Component>(
    //     storyDefinition: StoryParams<T>
    //   ): Story<T> {
    //     if (!("__docgenInfo" in storyDefinition.component)) {
    //       storyDefinition.component.__docgenInfo = {
    //         displayName: storyDefinition.title,
    //         exportName: storyDefinition.title,
    //         tags: {},
    //       };
    //     }
    //     const docGenInfo = storyDefinition.component.__docgenInfo as ComponentDoc;
    //     const controls = {
    //       ...generateControls(docGenInfo),
    //       ...Object.fromEntries(
    //         Object.entries(storyDefinition.controls ?? {}).filter(
    //           ([_k, val]) => !!val
    //         )
    //       ),
    //     } as ReturnType<typeof generateControls>;
    //     const slotControls = { ...generateSlotControls(docGenInfo) };
    //     const args = { ...generateArgs(docGenInfo), ...storyDefinition.args };
    //     const componentSlots = {
    //       ...generateSlotArgs(docGenInfo),
    //       ...storyDefinition.slotArgs,
    //     } as Story<T>["slots"];
    //     return {
    //       render: (renderArgs) =>
    //         defineComponent({
    //           setup(_, { slots }) {
    //             return () =>
    //               h(
    //                 storyDefinition.component as any,
    //                 renderArgs.props,
    //                 renderArgs.slots
    //               );
    //           },
    //         }),
    //       ...storyDefinition,
    //       controls,
    //       slotControls,
    //       args,
    //       slots: componentSlots,
    //     };
    //   }
    //   `,
    // }).dst;
    addImports({
      from: moduleResolver.resolve("runtime/useStory"),
      name: "defineStory",
      as: "defineStory",
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
