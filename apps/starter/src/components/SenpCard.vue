<template>
  <component
    v-if="type === 'media-top'"
    :is="as"
    :class="$xClass('flex flex-col gap-4 px-4 pb-4 rounded-lg bg-neutral-900', classes?.wrapper)"
    v-bind="$attrs"
  >
    <slot name="media"></slot>
    <slot></slot>
  </component>
  <component
    v-else-if="type === 'header'"
    :is="as"
    :class="$xClass('flex flex-col gap-4 p-4 rounded-lg bg-neutral-900', classes?.wrapper)"
    v-bind="$attrs"
  >
    <slot name="title">
      <p class="text-xl font-medium">{{ title }}</p>
    </slot>
    <slot></slot>
  </component>
  <component
    v-else
    :is="as"
    :class="$xClass('flex flex-col gap-4 p-4 rounded-lg bg-neutral-900', classes?.wrapper)"
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
     * type of card
     * @values 'basic', 'header', 'media-top'
     */
    type?: 'basic' | 'header' | 'media-top'
    /**
     * title of card, renders when `type` is `header`
     */
    title?: string
    /**
     * class overrides for component
     * - wrapper: outter wrapper for the card
     * - something else: checking whitespace
     */
    classes?: {
      wrapper?: XClass
    }
  }>(),
  {
    as: 'div',
    type: 'basic',
  }
)
</script>
