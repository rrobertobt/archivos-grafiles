import { useSessionStore } from '~/stores/session'

export default defineNuxtPlugin(async (nuxtApp) => {
  const sessionStore = useSessionStore()
  await sessionStore.recoverSession()
})
