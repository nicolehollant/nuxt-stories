<template>
  <label :class="$xClass('grid gap-1', classes?.wrapper)">
    <div :class="$xClass(labelSide === 'top' ? 'grid gap-1' : 'flex items-center gap-2', classes?.labelWrapper)">
      <template v-if="labelSide !== 'right'">
        <slot name="label">
          <p :class="$xClass('text-sm text-neutral-50', classes?.label)" v-if="label">{{ label }}</p>
        </slot>
      </template>

      <div
        :class="{
          ...(modelValue
            ? $xClass('bg-blue-600', classes?.inputActive)
            : $xClass('bg-neutral-800', classes?.inputInactive)),
          ...$xClass(
            'rounded-lg  flex items-center justify-center border border-neutral-700 ' +
              (size === 'input' ? 'w-[42px] h-[42px] text-2xl' : 'w-8 h-8 text-lg'),
            classes?.input
          ),
        }"
      >
        <input
          type="checkbox"
          :checked="modelValue"
          class="sr-only"
          @input="$emit('update:modelValue', $event.target.checked)"
        />
        <Icon name="mdi:check" v-if="modelValue"></Icon>
      </div>
      <template v-if="labelSide === 'right'">
        <slot name="label">
          <p :class="$xClass('text-sm text-neutral-50', classes?.label)" v-if="label">{{ label }}</p>
        </slot>
      </template>
    </div>
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
  (event: 'update:modelValue', newValue: boolean): void
}>()
withDefaults(
  defineProps<{
    size?: 'base' | 'input'
    modelValue: boolean
    label?: string
    labelSide?: 'top' | 'left' | 'right'
    hint?: string
    error?: string
    type?: string
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
