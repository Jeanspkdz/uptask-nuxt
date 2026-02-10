export default function useCollaborator (projectId: MaybeRefOrGetter<string>) {
  const { data, pending: isCollaboratorsLoading, refresh, status } = useFetch(
    `/api/project/${toValue(projectId)}/collaborator`,
    { lazy: true }
  )

  const collaborators = computed(() => data.value?.collaborator)

  return {
    collaborators,
    isCollaboratorsLoading,
    refresh,
    status
  }
}
