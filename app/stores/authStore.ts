import { authClient } from '~/lib/auth'

type User = typeof authClient.$Infer.Session['user']

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<User>()
  const error = ref()
  async function getUserSession () {
    const { data, error: errorResponse } = await authClient.useSession(useFetch)
    if (errorResponse) error.value = errorResponse
    user.value = data.value?.user
  }

  const isProjectOwner = (projectUserId: string) => {
    return user.value?.id === projectUserId
  }

  return {
    user,
    error,
    getUserSession,
    isProjectOwner
  }
})

export {
  useAuthStore as default
}
