<template>
  <SenpLayoutBasic
    fixed-header
    :classes="{
      header: {
        extend: 'text-2xl bg-black/70 bg-gradient-to-r from-black/50 to-neutral-900/50 backdrop-blur',
      },
      content: {
        extend: 'max-w-3xl w-full mx-auto !py-12',
      },
      footer: {
        extend: 'hidden',
      },
    }"
  >
    <template #header>
      <div
        class="px-4 sm:px-6 lg:px-8 font-medium flex items-center gap-3 max-w-3xl w-full m-auto border-b border-neutral-700"
      >
        <p class="text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-teal-700 text-4xl">🎨</p>
        <p>SenpUI</p>
      </div>
    </template>

    <template #content>
      <p>
        Senp-ui is a simple component library for nuxt3 with the intention of being used via
        <code class="text-blue-300 font-semibold">nuxt extends</code>
      </p>
      <div class="flex gap-2 items-center justify-center">
        <NuxtLink to="/docs">
          <SenpButton>Docs</SenpButton>
        </NuxtLink>
        <NuxtLink to="/playground/edit">
          <SenpButton>Playground</SenpButton>
        </NuxtLink>
      </div>
    </template>
  </SenpLayoutBasic>
</template>
