// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  typescript: {
    shim: false,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
