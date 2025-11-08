<template>
  <div class="max-w-10/12 mx-auto">
    <BaseHeading
      title="My Projects"
      subtitle="Control and manage your projects"
    />
    <Button
      as-child
      variant="soft"
      class="mt-3"
    >
      <NuxtLink to="/project/create"> Add new project </NuxtLink>
    </Button>

    <div v-if="data && data?.length > 0" class="space-y-4 mt-6">
      <ProjectCard
        v-for="{projects: project} in data"
        :key="project.id"
        :title="project.name"
        :client-name="project.clientName"
        :description="project.description"
        :role="getUserRoleForProject(project.userId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project, User } from '@@/server/types/index'
import type { UserRole } from '~/components/project/card.vue'

definePageMeta({
  layout: 'home-layout',
})

const authStore = useAuthStore()

const { data } = await useFetch<{
  users: User,
  projects: Project
}[]>('/api/project')

function getUserRoleForProject (projectUserId: string): UserRole {
  return authStore.user?.id === projectUserId ? 'manager' : 'collaborator'
}

</script>

<style scoped></style>
