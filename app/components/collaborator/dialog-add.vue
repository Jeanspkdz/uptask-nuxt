<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="primaryAlt">Add Collaborator</Button>
    </DialogTrigger>
    <DialogContent @close-auto-focus="handleCloseAutoFocus">
      <DialogHeader>
        <DialogTitle class="text-2xl font-bold"
          >Add a new member to the team</DialogTitle
        >
        <DialogDescription class="text-lg font-semibold text-black">
          Search for a new member to
          <span class="text-fuchsia-600">add them to the project</span>
        </DialogDescription>
      </DialogHeader>

      <div class="mt-3">
        <CollaboratorSearchInput @search-results="handleSearchResult" />
      </div>

      <CollaboratorSearchResult
        v-if="foundUsers"
        :users="foundUsers"
        @collaborator-added="(collab) => $emit('collaborator-added', collab)"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
const { currentCollaborators } = defineProps<{
  currentCollaborators: User[];
}>()

defineEmits<{
  'collaborator-added': [collaborator: User];
}>()

const foundUsers = ref<Array<User & { isAdded: boolean }> | null>(null)

const handleSearchResult = (collaborators: User[]) => {
  const enrichedCollaborators = enricheCollaboratorsData(collaborators)
  foundUsers.value = [...enrichedCollaborators]
}
const enricheCollaboratorsData = (collaborators: User[]) => {
  return collaborators.map((collaborator) => {
    const isAdded = currentCollaborators.some(
      (currentCollaborator) => currentCollaborator.id === collaborator.id
    )
    return {
      ...collaborator,
      isAdded,
    }
  })
}

watch(() => currentCollaborators, () => {
  if (foundUsers.value) {
    foundUsers.value = enricheCollaboratorsData(foundUsers.value)
  }
}, { deep: true })

const handleCloseAutoFocus = () => {
  foundUsers.value = null
}
</script>

<style scoped></style>
