<template>
    <TaskAddButton @task-created="handleAddNewTask" />
    <Button class="px-6"> Collaborator </Button>
</template>

<script setup lang="ts">
import type { Task } from '~~/server/types'

const tasksProvider = inject(projectTasksKey)

const handleAddNewTask = (task: Task) => {
  tasksProvider?.addProjectTask(task)
}

</script>

<style scoped></style>
