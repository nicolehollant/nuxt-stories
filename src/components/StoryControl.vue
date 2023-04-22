<template>
  <TextInput
    v-if="type === 'string'"
    :model-value="modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', v)"
    :label="label"
  ></TextInput>
  <TextInput
    v-else-if="type === 'number'"
    :model-value="modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', Number(v))"
  ></TextInput>
  <Checkbox
    v-else-if="type === 'boolean'"
    :model-value="modelValue"
    @update:model-value="(v: boolean) => $emit('update:modelValue', v)"
  ></Checkbox>
  <TextInput
    v-else-if="type === 'object'"
    multiline
    :model-value="typeof modelValue == 'object' ? JSON.stringify(modelValue, null, 2) : modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', tryParseOrGiveStringValue(v))"
  ></TextInput>
  <TextInput
    v-else-if="type === 'array'"
    multiline
    :model-value="typeof modelValue == 'object' ? JSON.stringify(modelValue, null, 2) : modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', tryParseOrGiveStringValue(v))"
  ></TextInput>
  <TextInput
    v-else-if="type === 'null'"
    multiline
    :model-value="modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', v === '' ? null : tryParseOrGiveStringValue(v))"
    :label="label"
  ></TextInput>
  <TextInput
    v-else
    multiline
    :model-value="modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', v)"
    :label="label"
  ></TextInput>
</template>

<script setup lang="ts">
defineProps<{
  type: 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array' | 'function'
  modelValue: any
  label?: string
}>()

defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()

function tryParseOrGiveStringValue(value: string) {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
</script>
