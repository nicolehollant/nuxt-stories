import { defineComponent, h } from "#imports";
import type { DefineComponent } from "nuxt/dist/app/compat/capi";
import type { ComponentDoc } from "vue-docgen-api";

type Component = (abstract new (...args: any) => any) & { props?: any } & {
  __docgenInfo?: ComponentDoc;
};

type ControlType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "null"
  | "array"
  | "function";

type StoryParams<T extends Component> = {
  component: T;
  title: string;
  args?: Partial<InstanceType<T>["$props"]>;
  controls?: Partial<ReturnType<typeof generateControls>>;
  render?: (args: InstanceType<T>["$props"]) => DefineComponent;
};

type Story<T extends Component> = {
  component: T;
  title: string;
  args: InstanceType<T>["$props"];
  controls: ReturnType<typeof generateControls>;
  render: (args: InstanceType<T>["$props"]) => DefineComponent;
};

export const tryParseOrDefault = (
  val: string,
  replacement: any = undefined
) => {
  try {
    if (val.startsWith("'") && val.endsWith("'")) {
      // silly hacky nonsense bc we get string default values as "'my string contents'" which is not parseable
      const replaced = `"${val.slice(1, -1)}"`;
      if (typeof tryParseOrDefault(replaced, false) === "string") {
        val = replaced;
      }
    }
    return JSON.parse(val);
  } catch (error) {
    return replacement;
  }
};

const propTypeToControlValue = (propType: ControlType) => {
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

const parseComponentDocProps = (
  type: any
): { type: string; controlType: ControlType; elements?: any[] } => {
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

const generateControls = (
  component: ComponentDoc
): {
  [prop: string]: {
    required: boolean;
    type: ReturnType<typeof parseComponentDocProps>;
  };
} => {
  return Object.fromEntries(
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
};

const generateArgs = (
  component: ComponentDoc
): {
  [prop: string]: ReturnType<typeof propTypeToControlValue> | undefined;
} => {
  return Object.fromEntries(
    (component.props ?? []).map((prop) => {
      const hasDefaultValue = !!prop?.defaultValue;
      console.log({
        [prop.name]: hasDefaultValue,
        defaultValue: prop.defaultValue,
      });
      const defaultValue = hasDefaultValue
        ? prop.defaultValue!.func
          ? undefined
          : tryParseOrDefault(prop.defaultValue!.value, undefined)
        : undefined;
      console.log({ defaultValue });
      return [
        prop.name,
        defaultValue ??
          propTypeToControlValue(
            parseComponentDocProps(prop?.type).controlType
          ),
      ];
    })
  );
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
  return {
    render: (args) =>
      defineComponent({
        setup() {
          return () => h(storyDefinition.component as any, args);
        },
      }),
    ...storyDefinition,
    controls: {
      ...generateControls(docGenInfo),
      ...Object.fromEntries(
        Object.entries(storyDefinition.controls ?? {}).filter(
          ([_k, val]) => !!val
        )
      ),
    } as ReturnType<typeof generateControls>,
    args: { ...generateArgs(docGenInfo), ...storyDefinition.args },
  };
}
