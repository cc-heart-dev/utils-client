<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

:root {
  --global-bg-color: #1c1c1c;
  --text-color: #fff;
  --split-bg-color: #666;
  --divider-color: #444;
}

body,
html,
#__nuxt {
  width: 100%;
  height: 100%;
}

body {
  background: var(--global-bg-color);
  color: var(--text-color);
}
</style>