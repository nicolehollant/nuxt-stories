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
  | Component;

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
