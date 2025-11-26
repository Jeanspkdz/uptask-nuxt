export const useProjectTasks = (projectId: MaybeRefOrGetter<string>) => {
  const { data: projectTasks, error, pending } = useFetch(`/api/project/${toValue(projectId)}/task`, {
    transform: (tasks) => {
      return tasks.map((task) => ({
        id: task.id,
        name: task.name,
        state: task.state,
        order: task.order,
        description: task.description,
      }))
    },
  })

  return {
    projectTasks,
    pending,
    error,
  }
}
