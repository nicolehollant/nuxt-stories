<template>
  <button
    class="my-button"
    :style="
      [
        theme === 'primary' ? 'color: white; background-color: rgb(37, 99, 235);' : '',
        theme === 'secondary' ? 'color: rgb(96, 165, 250); border: 1px solid rgb(37, 99, 235);' : '',
        theme === 'tertiary' ? 'color: rgb(96, 165, 250);' : '',
      ].join(' ')
    "
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * label for the button, renders in default slot
     */
    label: string
    /**
     * theme of button
     * @values 'primary', 'secondary', 'tertiary'
     */
    theme?: 'primary' | 'secondary' | 'tertiary'
    /**
     * object property
     */
    obj: { someObj: true }
    // null property
    null: null
    // number property
    number: number
    boolean: boolean
    function: () => {}
    undefined: undefined
    array: []
  }>(),
  {
    theme: 'primary',
  }
)
</script>

<style>
.my-button {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.5rem;
}

@media (min-width: 640px) {
  .my-button {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
@media (min-width: 768px) {
  .my-button {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
@media (min-width: 1024px) {
  .my-button {
    padding: 1.5rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}
</style>
