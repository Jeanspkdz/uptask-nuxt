<template>
   <div>
     <TaskAddButton @task-created="handleAddNewTask" />
    <NuxtLink as-child :to="`/project/${projectId}/team`">
      <Button class="px-6"> Collaborator </Button>
    </NuxtLink>
   </div>
</template>

<script setup lang="ts">

const route = useRoute()
const projectId = route.params.projectId

const tasksProvider = inject(projectTasksKey)

const handleAddNewTask = (task: ProjectTask) => {
  tasksProvider?.addProjectTask(task)
}

</script>

<style scoped></style>
