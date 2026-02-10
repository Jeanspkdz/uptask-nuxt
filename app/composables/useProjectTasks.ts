export const useProjectTasks = (projectId: MaybeRefOrGetter<string>) => {
  const {
    data: projectTasks, error: projectTasksError, pending: isProjectTasksLoading
    , refresh, clear
  } = useFetch(`/api/project/${toValue(projectId)}/task`, {
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

  const projectTasksByStatus = computed<
    Partial<Record<TaskState, ProjectTask[]>>
  >(() => {
    if (isProjectTasksLoading.value || projectTasks.value === undefined) {
      return {}
    }
    const groupedTasks = Object.groupBy(projectTasks.value, (task) => task.state)

    const orderedGropuedTasks = Object.fromEntries(
      Object.entries(groupedTasks).map(([key, value]) => {
        const tasksSorted = value.toSorted((a, b) => a.order - b.order)
        return [key as TaskState, tasksSorted]
      })
    ) as Record<TaskState, ProjectTask[]>

    return orderedGropuedTasks
  })

  return {
    refresh,
    clear,
    projectTasks,
    projectTasksByStatus,
    isProjectTasksLoading,
    projectTasksError,
  }
}
