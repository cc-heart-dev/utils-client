// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['assets/index.scss'],
  modules: ['@unocss/nuxt'],

  runtimeConfig: {
    public: {}
  }
})
