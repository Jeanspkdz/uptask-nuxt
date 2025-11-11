<template>
  <section class="max-w-10/12 w-full mx-auto">
    <ProjectError
      v-if="error"
      :error-code="error.statusMessage as GenericErrorKey ?? 'UNKNOWN'"
      :error-status-code="error.statusCode ?? 400"
    />

    <div v-else>
      <BaseHeading
        :title="data?.name ?? ''"
        :subtitle="data?.description ?? ''"
      />

      <div class="space-x-2 mt-2.5">
        <Button variant="primaryAlt" class="px-6"> Add Task </Button>
        <Button class="px-6"> Collaborator </Button>
      </div>

      <div class="mt-8">
        <h3 class="text-3xl font-black">Tasks</h3>

        <div>Your tasks</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GenericErrorKey } from '~/errors'
import type { Project } from '~~/server/types'

definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const id = route.params.id
const { data, error } = await useFetch<Project>(`/api/project/${id}`)
console.log({
  error: error.value,
})
</script>

<style scoped></style>
