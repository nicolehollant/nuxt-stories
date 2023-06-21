<template>
  <label :class="$xClass('field-label', classes?.wrapper)">
    <div :class="$xClass(labelSide === 'top' ? 'field-label' : 'field-label-horizontal', classes?.labelWrapper)">
      <template v-if="labelSide !== 'right'">
        <slot name="label">
          <p :class="$xClass('text-label', classes?.label)" v-if="label">{{ label }}</p>
        </slot>
      </template>
      <div class="border-neutral-700"></div>
      <div
        :class="{
          ...(modelValue
            ? $xClass('checkbox-active', classes?.inputActive)
            : $xClass('checkbox-inactive', classes?.inputInactive)),
          ...$xClass('field-wrapper ' + (size === 'input' ? 'field-size-input' : 'field-size-base'), classes?.input),
        }"
      >
        <input
          type="checkbox"
          :checked="modelValue"
          class="sr-only"
          @input="$emit('update:modelValue', ($event.target as any).checked)"
        />
        <Icon name="mdi:check" v-if="modelValue"></Icon>
      </div>
      <template v-if="labelSide === 'right'">
        <slot name="label">
          <p :class="$xClass('text-label', classes?.label)" v-if="label">{{ label }}</p>
        </slot>
      </template>
    </div>
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
  (event: 'update:modelValue', newValue: boolean): void
}>()
withDefaults(
  defineProps<{
    /**
     * size of checkbox, use 'input' to match the height of a TextInput
     */
    size?: 'base' | 'input'
    modelValue: boolean
    label?: string
    labelSide?: 'top' | 'left' | 'right'
    hint?: string
    error?: string
    type?: string
    /**
     * optional class overrides
     */
    classes?: {
      wrapper?: XClass
      label?: XClass
      labelWrapper?: XClass
      input?: XClass
      inputActive?: XClass
      inputInactive?: XClass
      hint?: XClass
      error?: XClass
    }
  }>(),
  {
    labelSide: 'top',
    size: 'base',
  }
)
</script>
