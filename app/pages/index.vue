<template>
  <div class="w-full max-w-10/12 mx-auto">
    <BaseHeading
      title="My Projects"
      subtitle="Control and manage your projects"
    />
    <Button as-child variant="primaryAlt" class="mt-3">
      <NuxtLink to="/project/create"> Add new project </NuxtLink>
    </Button>

    <div v-if="projects && !isProjectsPending" class="space-y-4 mt-6">
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
          :role="ownedProject.projectRole"
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
          :role="collaboratorProject.projectRole"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'home-layout',
})

const { projects, isProjectsPending } = useProjects()
watchEffect(() => {
  console.log(projects.value)
})

</script>

<style scoped></style>
