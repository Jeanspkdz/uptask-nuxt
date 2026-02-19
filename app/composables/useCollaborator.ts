export default function useCollaborator (projectId: MaybeRefOrGetter<string>) {
  const { data: collaborators, pending: isCollaboratorsLoading, refresh, status } = useFetch(
    `/api/project/${toValue(projectId)}/collaborator`,
    {
      lazy: true,
      deep: true,
      transform (data) {
        return data.collaborator.map(collaborator => ({
          ...collaborator,
          createdAt: new Date(collaborator.createdAt),
          updatedAt: new Date(collaborator.createdAt),
          image: collaborator.image ?? null
        }))
      }
    }
  )

  const deleteCollaborator = (collaboratorId: string) => {
    if (collaborators.value) {
      collaborators.value = collaborators.value.filter(
        c => c.id !== collaboratorId
      )
    }
  }

  const addCollaborator = (collaborator : User) => {
    if (collaborators.value) {
      collaborators.value.push(collaborator)
    }
  }

  return {
    collaborators,
    deleteCollaborator,
    addCollaborator,
    isCollaboratorsLoading,
    refresh,
    status
  }
}
