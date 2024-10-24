import { AuraWithAmber, AuraWithNoir } from './themes/themes';
import Aura from '@primevue/themes/aura';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    families: [
      { name: 'Geist Sans', provider: 'fontsource' },
      { name: 'Geist Mono', provider: 'fontsource' },
    ],
    // styles: ['normal', 'italic'],
  },
  modules: ['@primevue/nuxt-module', '@nuxt/fonts', '@nuxtjs/tailwindcss', '@nuxt/icon', '@pinia/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  primevue: {
    options: {
      theme: {
        // preset: Aura,
        preset: AuraWithNoir,
        // options: { darkModeSelector: '.my-app-dark' }
      },
    },
    importPT: { from: '@/themes/ptconfig.ts' },
  }
})