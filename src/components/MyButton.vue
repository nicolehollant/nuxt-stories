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
defineProps<{
  label: string
  theme?: 'primary' | 'secondary' | 'tertiary'
  obj: { someObj: true }
  null: null
  number: number
  boolean: boolean
  function: () => {}
  undefined: undefined
  array: []
}>()
</script>
