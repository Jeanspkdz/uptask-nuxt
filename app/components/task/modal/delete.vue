<template>
  <DialogHeader>
    <DialogTitle class="text-3xl font-bold">Delete Task</DialogTitle>
    <DialogDescription class="font-semibold text-lg text-black/85 text-pretty">
      This action cannot be undone and will permanently
      <span class="text-fuchsia-600">delete this task</span>.
    </DialogDescription>
  </DialogHeader>

  <DialogFooter class="mt-10">
    <DialogClose as-child>
      <Button variant="ghost"> Cancel </Button>
    </DialogClose>
    <Button :disabled="loading" variant="default" @click="handleDeleteTask(taskId)">Confirm</Button>
  </DialogFooter>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'

defineProps<{
  taskId: string
}>()

const route = useRoute()
const projectId = route.params.projectId as string
const loading = ref(false)

const projectTasksProvider = inject(projectTasksKey)

const handleDeleteTask = async (taskId: string) => {
  try {
    loading.value = true
    await $fetch(`/api/project/${projectId}/task/${taskId}`, {
      method: 'DELETE',
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Task Deleted Successfully!!')
          projectTasksProvider?.deleteProjectTask(taskId)
          return
        }
        toast.error(getErrorMessage(response._data.data.scope, response._data.data.code))
      }
    })
  } catch (error) {
    console.log('[DELETE_TASK_ERROR]', error)
    toast(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
