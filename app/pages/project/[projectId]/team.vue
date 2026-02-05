<template>
  <div class="mx-auto max-w-10/12 w-full">
    <BaseHeading
      title="Team Management"
      subtitle="Organize and oversee your project team"
    />

    <div class="flex gap-x-2 mt-5 mb-5">
      <CollaboratorAddDialog />
      <Button variant="default" @click="$router.back">Go Back</Button>
    </div>

    <div v-if="!pending && collaborators && collaborators.length > 0">
      <CollaboratorCard
        v-for="collaborator in collaborators"
        :key="collaborator.id"
        :collaborator="collaborator"
      />
    </div>
    <div v-else>
      <CollaboratorCardSkeleton v-for="value in 5" :key="value" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const projectId = route.params.projectId
const {
  data: collaborators,
  pending,
} = useFetch(`/api/project/${projectId}/collaborator`, { lazy: true })

watchEffect(() => {
  console.log('DATA', collaborators.value)
})
</script>

<style scoped></style>
