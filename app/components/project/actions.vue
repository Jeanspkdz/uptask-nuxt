<template>
    <TaskAddButton @task-created="handleAddNewTask" />
    <NuxtLink as-child :to="`/project/${projectId}/team`">
      <Button class="px-6"> Collaborator </Button>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Task } from '~~/server/types'

const route = useRoute()
const projectId = route.params.projectId

const tasksProvider = inject(projectTasksKey)

const handleAddNewTask = (task: Task) => {
  tasksProvider?.addProjectTask(task)
}

</script>

<style scoped></style>
