<template>
  <article class="flex justify-between items-center">
    <span>{{ userEmail }}</span>
    <Button
      :disabled="isLoading"
      variant="ghost"
      class="bg-purple-200/75 text-purple-600 hover:bg-purple-300 hover:text-purple-600 hover:cursor-pointer transition-colors"
      @click="handleAddCollaborator(userId)"
    >
      Add to project
    </Button>
  </article>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

defineProps<{
  userEmail: string,
  userId: string
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
