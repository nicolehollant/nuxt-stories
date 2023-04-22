<template>
  <pre class="p-4 rounded-lg text-neutral-200 text-sm">{{
    {
      prop_string,
      prop_object,
      prop_null,
      prop_number,
      prop_boolean,
      prop_function,
      prop_undefined,
      prop_array,
    }
  }}</pre>
</template>

<script setup lang="ts">
defineProps<{
  prop_string: string
  prop_object: { someObj: true }
  prop_null: null
  prop_number: number
  prop_boolean: boolean
  prop_function: () => {}
  prop_undefined: undefined
  prop_array: []
}>()
</script>
