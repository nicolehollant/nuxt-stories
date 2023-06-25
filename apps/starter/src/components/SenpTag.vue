<template>
  <component
    :is="as"
    :class="
      $xClass(
        [
          'max-w-max font-medium w-full flex items-center text-xs gap-2 px-2 py-1 rounded',
          {
            primary: 'bg-blue-800 hover:bg-blue-700',
            neutral: 'bg-neutral-800 hover:bg-neutral-700',
            error: 'bg-red-800 hover:bg-red-700',
            success: 'bg-green-800 hover:bg-green-700',
          }[theme],
        ].join(' '),
        classes?.tag
      )
    "
    v-bind="$attrs"
    ><slot></slot
  ></component>
</template>

<script setup lang="ts">
import { XClass } from '~~/../../packages/layer/src/plugins/xClass'

withDefaults(
  defineProps<{
    /**
     * tag to render as
     */
    as?: string
    /**
     * theme of tag
     */
    theme?: 'primary' | 'success' | 'neutral' | 'error'
    /**
     * class overrides for component
     * - tag: outter wrapper for the tag
     */
    classes?: {
      tag?: XClass
    }
  }>(),
  {
    as: 'div',
    theme: 'neutral',
  }
)
</script>
