<template>
  <slot
    :tasks="projectTasks"
    :tasks-by-status="projectTasksByStatus"
    :pending="pending"
  />
</template>

<script setup lang="ts">

const route = useRoute()
const projectId = route.params.projectId as string

const { projectTasks, pending } = useProjectTasks(() => projectId)

const projectTasksByStatus = computed<Partial<Record<TaskState, ProjectTask[]>>>(() => {
  if (pending.value || projectTasks.value === undefined) {
    return {}
  }
  const groupedTasks = Object.groupBy(
    projectTasks.value,
    (task) => task.state
  )

  const orderedGropuedTasks = Object.fromEntries(
    Object.entries(groupedTasks).map(([key, value]) => {
      const tasksSorted = value.toSorted((a, b) => a.order - b.order)
      return [key as TaskState, tasksSorted]
    })
  ) as Record<TaskState, ProjectTask[]>

  return orderedGropuedTasks
})

provide(projectTasksKey, {
  projectTasks,
  projectTasksByStatus,
  pending,
  updateProjectTask (id, values) {
    console.log('UPDATE TASK', {
      id,
      values,
    })

    if (this.projectTasks.value) {
      this.projectTasks.value = this.projectTasks.value.map((task) => {
        if (task.id === id) {
          return { ...task, ...values }
        }
        return task
      })
    }
  },
  addProjectTask (task) {
    projectTasks.value?.push(task)
  },
  deleteProjectTask (taskId) {
    projectTasks.value = projectTasks.value?.filter(task => task.id !== taskId)
  }
})
</script>

<style scoped></style>
