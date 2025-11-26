<template>
  <section class="max-w-10/12 w-full mx-auto">
    <ProjectError
      v-if="projectError"
      :error-code="projectError.statusMessage as GenericErrorKey ?? 'UNKNOWN'"
      :error-status-code="projectError.statusCode ?? 400"
    />

    <div v-else>
      <div v-if="projectPending" class="animate-pulse">
        <div class="h-10 bg-gray-200 rounded w-1/3 mb-2" />
        <div class="h-6 bg-gray-200 rounded w-2/3" />
      </div>
      <BaseHeading
        v-else
        :title="project?.name ?? ''"
        :subtitle="project?.description ?? ''"
      />

      <div class="space-x-2 mt-2.5">
        <TaskAddButton @task-created="handleAddNewTask" />
        <Button class="px-6"> Collaborator </Button>
      </div>

      <div class="mt-8">
        <h3 class="text-3xl font-black mb-6">Tasks</h3>

        <div v-if="projectTasksPending">
          <TaskBoardSkeleton/>
        </div>
        <TaskBoard v-else :tasks="projectTasks" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GenericErrorKey } from '~/errors'
import type { Task } from '~~/server/types'

definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const projectId = route.params.id as string

const {
  project,
  error: projectError,
  pending: projectPending,
} = useProject(() => projectId)
const {
  projectTasks,
  error: projectTaskError,
  pending: projectTasksPending,
} = useProjectTasks(() => projectId)

watchEffect(() => {
  console.log({
    projectPending: projectPending.value,
    project: project.value,
  })
})

const handleAddNewTask = (task: Task) => {}
</script>

<style scoped></style>
