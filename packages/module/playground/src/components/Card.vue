<template>
  <div
    style="
      padding: 2rem;
      background: white;
      border: 1px solid #eee;
      border-radius: 1rem;
    "
  >
    <h3>{{ title || "Some Card" }}</h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "Some Card",
  }
);
</script>
