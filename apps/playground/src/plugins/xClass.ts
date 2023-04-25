export type XClass = {
  extend?: string
  base?: string
}
export default defineNuxtPlugin((nuxtApp) => {
  const extendClasses = (base: string, xClass?: XClass) => {
    return {
      [xClass?.base ?? base]: true,
      [xClass?.extend ?? '']: true,
    }
  }
  return {
    provide: {
      xClass: extendClasses,
    },
  }
})
