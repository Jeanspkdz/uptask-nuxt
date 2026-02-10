<template>
  <div class="mx-auto max-w-10/12 w-full">
    <BaseHeading
      title="Team Management"
      subtitle="Organize and oversee your project team"
    />

    <div class="flex gap-x-2 mt-5 mb-7">
      <CollaboratorAddDialog />
      <Button variant="default" @click="$router.back">Go Back</Button>
    </div>

    <div v-if="isCollaboratorsLoading">
        <CollaboratorCardSkeleton v-for="value in 5" :key="value" />

    </div>
    <div v-else-if="collaborators && collaborators?.length > 0">
     <CollaboratorCard
        v-for="collaborator in collaborators"
        :key="collaborator.id"
        :collaborator="collaborator"
      />
    </div>
    <div v-else-if="collaborators?.length === 0">
      You don't have collaboratros yet.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const projectId = route.params.projectId as string
const { collaborators, isCollaboratorsLoading } = useCollaborator(() => projectId)

</script>

<style scoped></style>
