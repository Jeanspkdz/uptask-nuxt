<template>
  <div class="w-full max-w-10/12 mx-auto">
    <BaseHeading
      title="My Projects"
      subtitle="Control and manage your projects"
    />
    <Button as-child variant="primaryAlt" class="mt-3">
      <NuxtLink to="/project/create"> Add new project </NuxtLink>
    </Button>

    <div v-if="projects && !pending" class="space-y-4 mt-6">
      <NuxtLink
        v-for="ownedProject in projects.ownedProjects"
        :key="ownedProject.id"
        class="block"
        :to="`/project/${ownedProject.id}`"
      >
        <ProjectCard
          :id="ownedProject.id"
          :title="ownedProject.name"
          :client-name="ownedProject.clientName"
          :description="ownedProject.description"
          :role="getUserRoleForProject(ownedProject.userId)"
        />
      </NuxtLink>

      <NuxtLink
        v-for="collaboratorProject in projects.collaboratorProjects"
        :key="collaboratorProject.id"
        class="block"
        :to="`/project/${collaboratorProject.id}`"
      >
        <ProjectCard
          :id="collaboratorProject.id"
          :title="collaboratorProject.name"
          :client-name="collaboratorProject.clientName"
          :description="collaboratorProject.description"
          :role="getUserRoleForProject(collaboratorProject.userId)"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '@/components/project/card/index.vue'

definePageMeta({
  layout: 'home-layout',
})

type ProjectsResponse = {
  ownedProjects: Project[];
  collaboratorProjects: Project[];
}

const authStore = useAuthStore()

const { data: projects, pending } =
  await useFetch<ProjectsResponse>('/api/project')

watchEffect(() => {
  console.log(projects.value)
})

function getUserRoleForProject (projectUserId: string): UserRole {
  return authStore.user?.id === projectUserId ? 'manager' : 'collaborator'
}
</script>

<style scoped></style>
