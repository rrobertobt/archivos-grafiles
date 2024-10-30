import { storeToRefs } from "pinia"
import { useSessionStore } from "~/stores/session"

export default defineNuxtRouteMiddleware((to, _from) => {
  const {session, role} = storeToRefs(useSessionStore())
  const roles = ['admin', 'employee']
  
  const pathIncludesRoles = roles.some(role => to.fullPath.includes(role))
  if (!session.value && pathIncludesRoles) {
    console.log('Redirecting to login')
    return navigateTo('/login')
  }

  // Check if the to route is the user's role
  const isAuthorizedRole = to.fullPath.includes(role.value)
  if (session.value && !isAuthorizedRole && to.fullPath !== '/') {
    console.log('Redirecting to role')
    return navigateTo(`/${role.value}`)
  }

  if (session.value && to.fullPath.includes('login')) {
    console.log('Redirecting to home')
    return navigateTo('/')
  }

})