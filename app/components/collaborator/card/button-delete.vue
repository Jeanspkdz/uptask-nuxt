<template>
  <Button
    variant="destructive"
    :disabled="isLoading"
    @click="handleDeleteCollaborator(collaboratorId)"
  >
    Delete
  </Button>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

defineProps<{
  collaboratorId: string;
}>()

const emit = defineEmits<{
  'collaborator-deleted': [userId: string];
}>()

const isLoading = ref(false)
const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const handleDeleteCollaborator = async (collaboratorId: string) => {
  try {
    isLoading.value = true

    await $fetch(`/api/project/${projectId.value}/collaborator`, {
      method: 'DELETE',
      body: {
        userId: collaboratorId,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Collaborator Deleted!!!')
          console.log(response)

          emit('collaborator-deleted', response._data.collaborator.userId)
          return
        }
        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('[DELETE_COLLABORATOR_ERROR]', error)

    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
