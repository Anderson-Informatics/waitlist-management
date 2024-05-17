// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxtjs/supabase", "@pinia/nuxt"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  typescript: {
    shim: false,
  },
  nitro: {
    plugins: ["~/server/plugins/mongodb.ts"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    API_URL: process.env.API_URL,
  },
});
