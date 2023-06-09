import { defineComponent, h } from "#imports";
import { defu } from "defu";
import type { ComponentDoc } from "vue-docgen-api";
import type { DefineComponent, VNode } from "nuxt/dist/app/compat/capi";

export type Component = (abstract new (...args: any) => any) & {
  props?: any;
} & {
  __docgenInfo?: ComponentDoc;
};
export type MaybeDefineCompnent =
  | DefineComponent
  | Element
  | JSX.Element
  | Component
  | any;

export type ControlType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "null"
  | "array"
  | "function";

export type StoryParams<T extends Component> = {
  component: T;
  title: string;
  args?: Partial<InstanceType<T>["$props"]>;
  slotArgs?: {
    [slotName in keyof Partial<InstanceType<T>["$slots"]>]?:
      | Component
      | VNode
      | (() => VNode | null)
      | string
      | null;
  };
  controls?: Partial<GenerateControlsOutput>;
  render?: (args: {
    props: InstanceType<T>["$props"];
    slots: InstanceType<T>["$slots"];
  }) => MaybeDefineCompnent;
  docs?: {
    description?: string;
    content?: string;
    render?: (args: {
      props: InstanceType<T>["$props"];
      slots: InstanceType<T>["$slots"];
    }) => MaybeDefineCompnent;
  };
};

export type Story<T extends Component> = {
  component: T;
  title: string;
  args: InstanceType<T>["$props"];
  controls: GenerateControlsOutput;
  slots: {
    [slotName in keyof Partial<InstanceType<T>["$slots"]>]?:
      | Component
      | VNode
      | (() => VNode | null)
      | string
      | null;
  };
  slotControls?: GenerateSlotControlsOutput;
  render: (args: {
    props: InstanceType<T>["$props"];
    slots: InstanceType<T>["$slots"];
  }) => MaybeDefineCompnent;
  docs: {
    description: string;
    content: string;
    render: {
      args: InstanceType<T>["$props"];
      slots: {
        [slotName in keyof Partial<InstanceType<T>["$slots"]>]?:
          | Component
          | VNode
          | (() => VNode | null)
          | string
          | null;
      };
      defaultRenderer: (args: {
        props: InstanceType<T>["$props"];
        slots: InstanceType<T>["$slots"];
      }) => MaybeDefineCompnent;
    };
  };
};

export type ParseComponentDocPropsOutput = {
  type: string;
  controlType: ControlType;
  elements?: any[];
};

export type GenerateControlsOutput = {
  [prop: string]: {
    required: boolean;
    type: ParseComponentDocPropsOutput;
  };
};

export type GenerateSlotArgsOutput = {
  [slot: string]: Component | VNode | (() => VNode | null) | string | null;
};

export type GenerateArgsOutput = {
  [prop: string]: PropTypeToControlValueOutput;
};

export type GenerateSlotControlsOutput = {
  [slot: string]: NonNullable<ComponentDoc["slots"]>[number];
};

export type StoryFactoryOutput<T extends Component> = {
  params: StoryParams<T>;
  component: Story<T>;
  extend: (overrides: Partial<StoryParams<T>>) => Story<T>;
  extendArgs: (overrides: Partial<StoryParams<T>["args"]>) => Story<T>;
};

export type PropTypeToControlValueOutput =
  | string
  | number
  | boolean
  | {}
  | null
  | any[]
  | (() => void)
  | undefined;

export const tryParseOrDefault = (
  val: string,
  replacement: any = undefined
) => {
  try {
    if (val.startsWith("'") && val.endsWith("'")) {
      // silly hacky nonsense bc we get string default values as "'my string contents'" which is not parseable
      const replaced = '"' + val.slice(1, -1) + '"';
      if (typeof tryParseOrDefault(replaced, false) === "string") {
        val = replaced;
      }
    }
    return JSON.parse(val);
  } catch (error) {
    return replacement;
  }
};

export const propTypeToControlValue = (
  propType: ControlType
): PropTypeToControlValueOutput => {
  return {
    string: "",
    number: 0,
    boolean: false,
    object: {},
    null: null,
    array: [],
    function: () => {},
  }[propType];
};

export const parseComponentDocProps = (
  type: any
): ParseComponentDocPropsOutput => {
  const primitiveTypeMap = {
    string: { type: "string", controlType: "string" },
    number: { type: "number", controlType: "number" },
    null: { type: "null", controlType: "null" },
    boolean: { type: "boolean", controlType: "boolean" },
    TSFunctionType: { type: "function", controlType: "function" },
    function: { type: "function", controlType: "function" },
    undefined: { type: "undefined", controlType: "null" },
    TSTupleType: { type: "array", controlType: "array" },
    array: { type: "array", controlType: "array" },
    object: { type: "object", controlType: "object" },
  };
  if (type?.name in primitiveTypeMap) {
    return (primitiveTypeMap as any)[type?.name];
  }
  if ((type?.name + "").startsWith("{")) {
    return { type: type?.name, controlType: "object" };
  }
  if (type?.name === "union") {
    if (Array.isArray(type?.elements) && type.elements.length > 0) {
      const firstElementParsed = tryParseOrDefault(
        type.elements[0].name,
        undefined
      );
      if (firstElementParsed === undefined) {
        return { type: type?.name, controlType: "null" };
      }
      if (
        (type.elements as { name: unknown }[]).every(
          ({ name }) =>
            typeof tryParseOrDefault(name + "", undefined) ===
            typeof firstElementParsed
        ) &&
        typeof firstElementParsed in primitiveTypeMap
      ) {
        return {
          type: type?.name,
          controlType: (primitiveTypeMap as any)[typeof firstElementParsed]
            .controlType,
          elements: type.elements.map(({ name }: any) =>
            tryParseOrDefault(name, undefined)
          ),
        };
      }
      return {
        type: type?.name,
        controlType: "null",
        elements: type.elements.map(({ name }: any) =>
          tryParseOrDefault(name, undefined)
        ),
      };
    }
    return { type: type?.name, controlType: "null", elements: undefined };
  }
  return { type: type?.name, controlType: "null" };
};

export const generateControls = (
  component: ComponentDoc
): GenerateControlsOutput => {
  const props = Object.fromEntries(
    (component.props ?? []).map((prop) => {
      return [
        prop.name,
        {
          required: prop?.required ?? false,
          type: parseComponentDocProps(prop?.type),
        },
      ];
    })
  );

  return props;
};

export const generateArgs = (component: ComponentDoc): GenerateArgsOutput => {
  const props = Object.fromEntries(
    (component.props ?? []).map((prop) => {
      const hasDefaultValue = !!prop?.defaultValue;
      const defaultValue = hasDefaultValue
        ? prop.defaultValue!.func
          ? undefined
          : tryParseOrDefault(prop.defaultValue!.value, undefined)
        : undefined;
      return [
        prop.name,
        defaultValue ??
          propTypeToControlValue(
            parseComponentDocProps(prop?.type).controlType
          ),
      ];
    })
  );
  return props;
};

export const generateSlotControls = (
  component: ComponentDoc
): GenerateSlotControlsOutput => {
  const slots = Object.fromEntries(
    (component.slots ?? []).map((slot) => {
      return [slot.name, slot];
    })
  );
  return slots;
};

export const generateSlotArgs = (
  component: ComponentDoc
): GenerateSlotArgsOutput => {
  // const slots = Object.fromEntries(
  //   (component.slots ?? []).map((slot) => {
  //     return [slot.name, () => null];
  //   })
  // );
  const slots = Object.fromEntries(
    (component.slots ?? []).map((slot) => {
      return [slot.name, null];
    })
  );
  return slots;
};

export function defineStory<T extends Component>(
  storyDefinition: StoryParams<T>
): Story<T> {
  if (!("__docgenInfo" in storyDefinition.component)) {
    storyDefinition.component.__docgenInfo = {
      displayName: storyDefinition.title,
      exportName: storyDefinition.title,
      tags: {},
    };
  }
  const docGenInfo = storyDefinition.component.__docgenInfo as ComponentDoc;
  const controls = {
    ...generateControls(docGenInfo),
    ...Object.fromEntries(
      Object.entries(storyDefinition.controls ?? {}).filter(
        ([_k, val]) => !!val
      )
    ),
  } as ReturnType<typeof generateControls>;
  const slotControls = { ...generateSlotControls(docGenInfo) };
  const args = { ...generateArgs(docGenInfo), ...storyDefinition.args };
  const componentSlots = {
    ...generateSlotArgs(docGenInfo),
    ...storyDefinition.slotArgs,
  } as Story<T>["slots"];
  return {
    render: (renderArgs) =>
      defineComponent({
        setup(_, { slots }) {
          return () =>
            h(
              storyDefinition.component as any,
              renderArgs.props,
              renderArgs.slots
            );
        },
      }),
    ...storyDefinition,
    controls,
    slotControls,
    args,
    slots: componentSlots,
    docs: {
      content: storyDefinition?.docs?.content || "",
      description: storyDefinition?.docs?.description || "",
      render: {
        args: generateArgs(docGenInfo),
        slots: generateSlotArgs(docGenInfo) as Story<T>["slots"],
        defaultRenderer: (renderArgs) =>
          defineComponent({
            setup(_, { slots }) {
              return () =>
                h(
                  storyDefinition.component as any,
                  renderArgs.props,
                  renderArgs.slots
                );
            },
          }),
      },
    },
  };
}

export const storyFactory = <T extends Component>(
  base: StoryParams<T>,
  overrides?: Partial<StoryParams<T>>
): StoryFactoryOutput<T> => {
  const params = !!overrides ? (defu(overrides, base) as StoryParams<T>) : base;
  return {
    params,
    component: defineStory(params),
    extend: (overrides) => storyFactory(params, overrides).component,
    extendArgs: (overrides) =>
      storyFactory(params, { args: overrides }).component,
  };
};

export const useStoryUtils = () => {
  return {
    tryParseOrDefault,
    propTypeToControlValue,
    parseComponentDocProps,
    generateControls,
    generateArgs,
    generateSlotControls,
    generateSlotArgs,
    defineStory,
    useStoryUtils,
    storyFactory,
  };
};
