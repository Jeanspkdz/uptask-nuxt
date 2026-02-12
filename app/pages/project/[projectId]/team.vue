<template>
  <div class="mx-auto max-w-10/12 w-full">
    <BaseHeading
      title="Team Management"
      subtitle="Organize and oversee your project team"
    />

    <div class="flex gap-x-2 mt-5 mb-7">
      <CollaboratorDialogAdd
        v-if="collaborators"
        :current-collaborators="collaborators"
        @collaborator-added="handleCollaboratorAdded"
      />
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
        @collaborator-deleted="handleCollaboratorDeleted"
      />
    </div>
    <div
      v-else-if="collaborators?.length === 0"
      class="italic text-slate-800 text-center text-lg font-semibold  mt-5 "
    >
       No collaborators yet
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home-layout',
})

const route = useRoute()
const projectId = route.params.projectId as string
const { collaborators, isCollaboratorsLoading, deleteCollaborator, addCollaborator } =
  useCollaborator(() => projectId)

const handleCollaboratorDeleted = (collaboratorId: string) => {
  deleteCollaborator(collaboratorId)
}

const handleCollaboratorAdded = (collaborator : User) => {
  addCollaborator(collaborator)
}
</script>

<style scoped></style>
