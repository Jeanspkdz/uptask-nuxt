<template>
  <section class="max-w-10/12 w-full mx-auto">
    <ProjectError
      v-if="projectError"
      :error-code="(projectError.statusMessage as GenericErrorKey) ?? 'UNKNOWN'"
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

      <TaskProvider v-slot="{pending: tasksPending, tasksByStatus}">
        <div v-if="project && isProjectOwner(project.userId)" class="space-x-2 mt-2.5">
          <ProjectActions/>
        </div>

        <div class="mt-8">
          <h3 class="text-3xl font-black mb-6">Tasks</h3>

          <div v-if="tasksPending">
            <TaskBoardSkeleton />
          </div>
          <TaskBoard v-else :tasks="tasksByStatus" />
        </div>
      </TaskProvider>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GenericErrorKey } from '~/errors'

definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const projectId = route.params.projectId as string

const {
  project,
  error: projectError,
  pending: projectPending,
} = useProject(() => projectId)

const { isProjectOwner } = useAuthStore()

</script>

<style scoped></style>
