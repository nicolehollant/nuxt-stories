<template>
  <Select
    v-if="type === 'union' && elements?.length"
    :model-value="modelValue"
    :options="elements.map((element) => ({ value: element, label: element + '' }))"
    @update:model-value="(v: string) => $emit('update:modelValue', v)"
    :label="label"
  ></Select>
  <TextInput
    v-else-if="controlType === 'string'"
    :model-value="modelValue"
    multiline
    @update:model-value="(v: string) => $emit('update:modelValue', v)"
    :label="label"
  ></TextInput>
  <TextInput
    v-else-if="controlType === 'number'"
    :model-value="modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', Number(v))"
  ></TextInput>
  <Checkbox
    v-else-if="controlType === 'boolean'"
    :model-value="modelValue"
    @update:model-value="(v: boolean) => $emit('update:modelValue', v)"
  ></Checkbox>
  <TextInput
    v-else-if="controlType === 'object'"
    multiline
    :model-value="typeof modelValue == 'object' ? JSON.stringify(modelValue, null, 2) : modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', tryParseOrGiveStringValue(v))"
  ></TextInput>
  <TextInput
    v-else-if="controlType === 'array'"
    multiline
    :model-value="typeof modelValue == 'object' ? JSON.stringify(modelValue, null, 2) : modelValue"
    @update:model-value="(v: string) => $emit('update:modelValue', tryParseOrGiveStringValue(v))"
  ></TextInput>
  <TextInput
    v-else-if="controlType === 'null'"
    multiline
    :model-value="typeof modelValue == 'object' ? JSON.stringify(modelValue, null, 2) : modelValue || ''"
    @update:model-value="(v: string) => $emit('update:modelValue', v === '' ? null : tryParseOrGiveStringValue(v))"
    :label="label"
  ></TextInput>
  <TextInput
    v-else
    multiline
    :model-value="modelValue || ''"
    @update:model-value="(v: string) => $emit('update:modelValue', v)"
    :label="label"
  ></TextInput>
</template>

<script setup lang="ts">
defineProps<{
  type: string
  controlType: 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array' | 'function'
  elements?: any[]
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
