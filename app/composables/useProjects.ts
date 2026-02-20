import type { UserRole } from '~/components/project/card/index.vue'

export const useProjects = () => {
  const { data: projects, pending: isProjectsPending } = useFetch(
    '/api/project',
    {
      transform (data) {
        const collaboratorProjects = data.collaboratorProjects.map(
          (cProject) => {
            const projectRole: UserRole = 'collaborator'

            return {
              ...cProject,
              projectRole,
            }
          }
        )

        const ownedProjects = data.ownedProjects.map((oProject) => {
          const projectRole: UserRole = 'manager'
          return {
            ...oProject,
            projectRole,
          }
        })

        return {
          collaboratorProjects,
          ownedProjects
        }
      },
      deep: true
    }
  )

  const deleteProject = (projectId: string) => {
    console.log('DELETE', projectId)

    if (projects.value) {
      projects.value.ownedProjects = projects.value?.ownedProjects.filter(project => project.id !== projectId)
    }
  }

  return {
    projects,
    isProjectsPending,
    deleteProject
  }
}
