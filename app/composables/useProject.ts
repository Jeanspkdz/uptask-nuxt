import type { UserRole } from '~/components/project/card/index.vue'

export const useProject = (projectId: MaybeRefOrGetter<string>) => {
  const authStore = useAuthStore()

  const {
    data,
    error: projectError,
    pending: isProjectLoading,
    refresh,
    status,
  } = useFetch(() => `/api/project/${toValue(projectId)}`, {
    transform ({ project }) {
      const userRole: UserRole =
        authStore.user?.id === project.userId ? 'manager' : 'collaborator'

      return {
        ...project,
        userRole
      }
    },
    lazy: true,
    key: `project-${toValue(projectId)}`
  })

  const project = computed(() => data.value)
  return {
    project,
    isProjectLoading,
    projectError,
    refresh,
    status,
  }
}
