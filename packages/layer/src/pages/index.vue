<template>
  <div class="container">
    <h1>Nuxt stories</h1>
    <li>
      <NuxtLink to="/_stories"> Stories </NuxtLink>
    </li>
    <li style="margin-top: 1rem">
      <a href="https://github.com/nicolehollant/nuxt-stories" target="_blank" rel="noopener noreferrer">git</a>
    </li>
  </div>
</template>

<style scoped>
.container {
  padding: 4rem;
  display: grid;
  gap: 2rem;
}
h1 {
  font-size: 2.25rem /* 36px */;
  line-height: 2.5rem /* 40px */;
}
</style>
