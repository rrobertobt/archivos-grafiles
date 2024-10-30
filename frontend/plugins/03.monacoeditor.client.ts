import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(VueMonacoEditorPlugin, {
    paths: {
      // You can change the CDN config to load other versions
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
    },
  })
})
