import { COOKIE_TOKEN_KEY } from "~/plugins/01.authCookie"

export const $api = $fetch.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'http://192.168.205.73:8000',
  onRequest({ options }) {
    const token = useCookie(COOKIE_TOKEN_KEY).value
    // options.headers = options.headers || {}
    options.headers.set('Authorization', `Bearer ${token}`)
    // if (localStorage.getItem('userData')) {
    //   const userData = JSON.parse(localStorage.getItem('userData') ?? '{}') 
    //   options.headers.set('Authorization', `${userData.id}`)
    // }
  },
  onRequestError(error) {
  },
  onResponseError(error) {
  }
})