<template>
  <slot
    :tasks="projectTasks"
    :tasks-by-status="projectTasksByStatus"
    :pending="isProjectTasksLoading"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const projectId = route.params.projectId as string

const { projectTasks, isProjectTasksLoading, projectTasksByStatus } = useProjectTasks(
  () => projectId
)

provide(projectTasksKey, {
  projectTasks,
  projectTasksByStatus,
  pending: isProjectTasksLoading,
  updateProjectTask (id, values) {
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
    projectTasks.value = projectTasks.value?.filter(
      (task) => task.id !== taskId
    )
  },
})
</script>

<style scoped></style>
