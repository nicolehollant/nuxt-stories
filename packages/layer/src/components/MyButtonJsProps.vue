<template>
  <button
    class="p-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl lg:p-6"
    :class="{
      'bg-blue-600 text-white': theme === 'primary',
      'border border-blue-600 text-blue-400': theme === 'secondary',
      'text-blue-400': theme === 'tertiary',
    }"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
    validator: (v: string) => ['primary', 'secondary', 'tertiary'].includes(v),
  },
  obj: { type: Object, default: () => ({}) },
  null: { type: null, default: null },
  number: {
    type: Number,
    default: 0,
  },
  boolean: {
    type: Boolean,
    default: false,
  },
  function: {
    type: Function,
    default: () => () => {},
  },
  undefined: {
    type: null,
    default: undefined,
  },
  array: {
    type: Array,
    default: () => [],
  },
})
</script>
