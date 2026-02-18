<template>
  <Button
    variant="destructive"
    :disabled="isLoading"
    @click="handleDeleteNote(noteId)"
  >
    Delete
  </Button>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

const { noteId, projectId, taskId } = defineProps<{
  noteId: string;
  taskId: string;
  projectId: string;
}>()

const isLoading = ref(false)

const emit = defineEmits<{
  'delete-note': [noteId: string];
}>()

const handleDeleteNote = async (noteId: string) => {
  try {
    isLoading.value = true
    await $fetch(`/api/project/${projectId}/task/${taskId}/note/${noteId}`, {
      method: 'DELETE',
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Note deleted successfully!')
          emit('delete-note', noteId)
          return
        }
        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('[DELETE_NOTE_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
