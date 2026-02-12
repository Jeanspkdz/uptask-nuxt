<template>
  <article class="flex justify-between items-center">
    <span>{{ userEmail }}</span>
    <Button
      :disabled="isLoading || isAdded"
      variant="ghost"
      class="hover:cursor-pointer transition-colors"
      :class="
        isAdded
          ? 'bg-green-200/75 text-green-600 hover:bg-green-300 hover:text-green-800 hover:cursor-not-allowed'
          : 'bg-purple-200/75 text-purple-600 hover:bg-purple-300 hover:text-purple-600 cursor-not-allowed opacity-60'
      "
      @click="handleAddCollaborator(userId)"
    >
      {{ isAdded ? "Already added" : "Add to Project" }}
    </Button>
  </article>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

defineProps<{
  userEmail: string;
  userId: string;
  isAdded: boolean;
}>()

const emit = defineEmits<{
  'collaborator-added': [collaborator: User]
}>()

const route = useRoute()
const projectId = route.params.projectId
const isLoading = ref(false)

const handleAddCollaborator = async (userId: string) => {
  try {
    isLoading.value = true
    await $fetch(`/api/project/${projectId}/collaborator`, {
      method: 'POST',
      body: {
        userId,
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          console.log('RES_SUCCES', response)
          emit('collaborator-added', response._data.collaborator)
          toast.success('Collaborator added successfully! ')
          return
        }
        console.log('RESPONSE_ERR', response)
        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })
  } catch (error) {
    console.log('[ADD_COLLAB_ERROR]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
