<template>
  <label :class="$xClass('grid gap-1', classes?.wrapper)">
    <slot name="label">
      <p :class="$xClass('text-sm text-neutral-50', classes?.label)" v-if="label">{{ label }}</p>
    </slot>
    <div
      v-if="multiline"
      :class="
        $xClass(
          [
            'w-full rounded-lg bg-neutral-800 p-2 font-medium text-neutral-50 border grid relative h-max',
            error ? 'border-red-700' : 'border-neutral-700',
          ].join(' '),
          classes?.input
        )
      "
    >
      <textarea
        style="grid-area: 1 / 1 / 2 / 2"
        v-bind="$attrs"
        :value="modelValue"
        class="bg-transparent resize-none border-none outline-none ring-0 focus:outline-none focus:ring-0 p-0 overflow-hidden"
        @input="(e: any) => $emit('update:modelValue', e.target.value)"
      />
      <div style="grid-area: 1 / 1 / 2 / 2" class="whitespace-pre-wrap invisible">
        {{ modelValue + ' ' }}
      </div>
    </div>
    <input
      v-else
      :type="type ?? 'text'"
      :class="
        $xClass(
          [
            'w-full rounded-lg bg-neutral-800 p-2 font-medium text-neutral-50 border',
            error ? 'border-red-700' : 'border-neutral-700',
          ].join(' '),
          classes?.input
        )
      "
      v-bind="$attrs"
      :value="modelValue"
      @input="(e: any) => $emit('update:modelValue', e.target.value)"
    />

    <slot name="hint">
      <p :class="$xClass('text-xs italic text-neutral-300', classes?.hint)" v-if="hint">{{ hint }}</p>
    </slot>
    <slot name="error">
      <p :class="$xClass('text-sm text-red-300', classes?.error)" v-if="error">{{ error }}</p>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { XClass } from '../plugins/xClass'

defineEmits<{
  (event: 'update:modelValue', newValue: string): void
}>()
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    hint?: string
    error?: string
    type?: string
    multiline?: boolean
    classes?: {
      wrapper?: XClass
      label?: XClass
      input?: XClass
      hint?: XClass
      error?: XClass
    }
  }>(),
  {
    multiline: false,
  }
)
</script>
