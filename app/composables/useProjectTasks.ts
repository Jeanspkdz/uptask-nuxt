export const useProjectTasks = (projectId: MaybeRefOrGetter<string>) => {
  const { data: projectTasks, error, pending, refresh, clear } = useFetch(`/api/project/${toValue(projectId)}/task`, {
    transform (tasks) {
      return tasks.map((task) => {
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt ?? task.createdAt)
        }
      })
    },
    lazy: true,
    deep: true
  })

  return {
    refresh,
    clear,
    projectTasks,
    pending,
    error,
  }
}
