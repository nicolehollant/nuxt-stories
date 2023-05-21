<template>
  <label :class="$xClass('field-label', classes?.wrapper)">
    <slot name="label">
      <p :class="$xClass('text-label', classes?.label)" v-if="label">{{ label }}</p>
    </slot>
    <select
      :class="$xClass(['field-input', error ? 'field-error' : 'field-base'].join(' '), classes?.input)"
      @change="(e: any) => $emit('update:modelValue', e.target.value)"
    >
      <slot>
        <option v-if="placeholder" :selected="modelValue === ''" :value="''">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :selected="modelValue === (typeof option === 'string' ? option : option.value ?? option.label)"
          :value="typeof option === 'string' ? option : option.value ?? option.label"
        >
          {{ typeof option === 'string' ? option : option.label ?? option.value }}
        </option>
      </slot>
    </select>
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
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  options: { label?: string; value: any }[] | string[]
  classes?: {
    wrapper?: XClass
    label?: XClass
    input?: XClass
    hint?: XClass
    error?: XClass
  }
}>()
</script>
