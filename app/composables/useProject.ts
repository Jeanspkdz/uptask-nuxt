import type { Project } from '~~/server/types'

export const useProject = (projectId: MaybeRefOrGetter<string>) => {
  const { data: project, error, pending, refresh, status } = useFetch<Project>(
    () => `/api/project/${toValue(projectId)}`
  )

  return {
    project,
    pending,
    error,
    refresh,
    status
  }
}
