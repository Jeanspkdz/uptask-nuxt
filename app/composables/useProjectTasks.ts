export const useProjectTasks = (projectId: MaybeRefOrGetter<string>) => {
  const {
    data: projectTasks,
    error: projectTasksError,
    pending: isProjectTasksLoading,
    refresh,
    clear,
  } = useFetch(`/api/project/${toValue(projectId)}/task`, {
    transform (tasks) {
      return tasks.map((task) => {
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt ?? task.createdAt),
        }
      })
    },
    lazy: true,
    deep: true,
  })

  const ALL_TASK_STATES: TaskState[] = [
    'pending',
    'waiting',
    'in_progress',
    'in_review',
    'completed',
  ]

  const projectTasksByStatus = computed(
    () => {
      if (!projectTasks.value) {
        return ALL_TASK_STATES.reduce((acc, state) => {
          acc[state] = []
          return acc
        }, {} as Record<TaskState, ProjectTask[]>)
      }

      const groupedTasks = ALL_TASK_STATES.reduce((acc, state) => {
        acc[state] = projectTasks.value!.filter(task => task.state === state)
        return acc
      }, {} as Record<TaskState, ProjectTask[]>)

      const orderedGroupedTasks = Object.fromEntries(
        Object.entries(groupedTasks).map(([key, value]) => {
          const tasksSorted = value.toSorted((a, b) => a.order - b.order)
          return [key, tasksSorted]
        })
      ) as Record<TaskState, ProjectTask[]>

      return orderedGroupedTasks
    }
  )

  return {
    refresh,
    clear,
    projectTasks,
    projectTasksByStatus,
    isProjectTasksLoading,
    projectTasksError,
  }
}
