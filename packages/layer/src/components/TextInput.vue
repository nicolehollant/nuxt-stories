<template>
  <label :class="$xClass('field-label', classes?.wrapper)">
    <slot name="label">
      <p :class="$xClass('text-label', classes?.label)" v-if="label">{{ label }}</p>
    </slot>
    <div
      v-if="multiline"
      :class="$xClass(['field-input auto-grow', error ? 'field-error' : 'field-base'].join(' '), classes?.input)"
    >
      <textarea
        style="grid-area: 1 / 1 / 2 / 2; word-break: break-all"
        v-bind="$attrs"
        :value="modelValue"
        class="field-textarea"
        @input="(e: any) => $emit('update:modelValue', e.target.value)"
      />
      <div style="grid-area: 1 / 1 / 2 / 2; white-space: pre-wrap; visibility: hidden; word-break: break-all">
        {{ modelValue + ' ' }}
      </div>
    </div>
    <input
      v-else
      :type="type ?? 'text'"
      :class="$xClass(['field-input', error ? 'field-error' : 'field-base'].join(' '), classes?.input)"
      v-bind="$attrs"
      :value="modelValue"
      @input="(e: any) => $emit('update:modelValue', e.target.value)"
    />

    <slot name="hint">
      <p :class="$xClass('text-hint', classes?.hint)" v-if="hint">{{ hint }}</p>
    </slot>
    <slot name="error">
      <p :class="$xClass('text-error', classes?.error)" v-if="error">{{ error }}</p>
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
