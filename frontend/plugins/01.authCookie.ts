export const COOKIE_TOKEN_KEY = 'grafiles-token'

export default defineNuxtPlugin(() => {
  const cookieRef = useCookie(COOKIE_TOKEN_KEY, {
    // path: '/',
    // sameSite: true,
    // maxAge: 60 * 60 * 24 * 24 /* 24 days */
  })
  return {
    provide: {
      authCookie: {
        getToken: () => cookieRef.value || null,
        removeToken: () => {
          cookieRef.value = null
        },
        setToken: (token?: string | null) => {
          cookieRef.value = token
        }
      }
    }
  }
})
