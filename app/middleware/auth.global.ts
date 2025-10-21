import { authClient } from '~/lib/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = /^\/(auth\/[a-zA-Z0-9\-_/]+|api\/auth\/.*)/

  const isPrivateRoute = !publicRoutes.test(to.path)

  if (isPrivateRoute) {
    const userSession = await authClient.useSession(useFetch)
    console.log(userSession.data.value)

    if (!userSession.data.value) {
      return navigateTo('/auth/sign-in')
    }
  }
})
