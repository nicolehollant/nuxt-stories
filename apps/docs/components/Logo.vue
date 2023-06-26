<template>
  <div style="display: flex; gap: 0.5rem; align-items: center">
    <div id="logo" style="width: 40px; height: 40px" alt="" />
    <ProseH4 to="/" style="margin: 0">
      <NuxtLink to="/"> Nuxt Fable </NuxtLink>
    </ProseH4>
  </div>
</template>

<style>
#logo {
  background-image: url('/nuxt-fable-light.png');
  background-size: cover;
}

@media (prefers-color-scheme: dark) {
  #logo {
    background-image: url('/nuxt-fable-dark.png');
  }
}
</style>
