// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import path from "path";

export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxtjs/supabase", "@pinia/nuxt", "nuxt-primevue"],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "~/assets/css/base.css"],
  ssr: false,
  typescript: {
    shim: false,
  },
  nitro: {
    plugins: ["~/server/plugins/mongodb.ts"],
  },
  postcss: {
    plugins: {
      "tailwindcss/nesting": {}, //needed to use primevue css
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    API_URL: process.env.API_URL,
  },
  primevue: {
    options: {
      unstyled: true,
    },
    importPT: { as: "Aura", from: path.resolve(__dirname, "./presets/aura/") }, //import and apply preset
  },
});
