export const useProject = (projectId: MaybeRefOrGetter<string>) => {
  type ProjectResponse = {
    project: Project;
  }

  const {
    data,
    error: projectError,
    pending: isProjectLoading,
    refresh,
    status,
  } = useFetch<ProjectResponse>(() => `/api/project/${toValue(projectId)}`)

  const project = computed(() => data.value?.project)

  return {
    project,
    isProjectLoading,
    projectError,
    refresh,
    status,
  }
}
