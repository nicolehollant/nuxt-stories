import type { SetupContext } from 'nuxt/dist/app/compat/capi'
type Prepend<T, U extends unknown[]> = [T, ...U]
type Keys_<T extends Record<string, unknown>, U extends PropertyKey[]> = {
  [P in keyof T]: object extends Omit<T, P> ? [P] : Prepend<P, Keys_<Omit<T, P>, U>>
}[keyof T]
type Keys<T extends Record<string, unknown>> = Keys_<T, []>

export const defineTsxComponent = <Props extends Readonly<{ [x: string]: unknown }>>(
  props: Keys<Props> | Props,
  render: (props: Props, ctx: SetupContext) => JSX.Element
) =>
  defineComponent({
    props: Array.isArray(props) ? (props as string[]) : Object.keys(props),
    setup: (props, ctx) => () => render(props as Props, ctx),
  })

export const TsxProp = undefined as unknown
