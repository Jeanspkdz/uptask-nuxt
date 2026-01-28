<template>
  <Select
    v-model="localNewState"
    :disabled="isSubmitting"
    class=""
    @update:model-value="(e) => {
      if(isValidTaskState(e)){
        handleUpdateTaskState(e)
      }
    }"
  >
    <SelectTrigger class="mt-3 w-full mb-4">
      <SelectValue placeholder="Update the task state" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>States</SelectLabel>
        <SelectItem v-for="(label, key) in taskStates" :key="key" :value="key">
          {{ label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'
import type { TaskState } from '~~/server/types'

const props = defineProps<{
  taskState: TaskState,
  taskId: string
}>()
const emit = defineEmits<{
  taskStateUpdated: [taskId: string, state: TaskState, order: number]
}>()

const projectTasksProvider = inject(projectTasksKey)
const localNewState = ref(props.taskState)
const isSubmitting = ref(false)

const taskStates: Record<TaskState, string> = {
  pending: 'Pending',
  waiting: 'Waiting',
  in_progress: 'In Progress',
  in_review: 'In Review',
  completed: 'Completed',
}

const route = useRoute()
const projectId = route.params.projectId as string

const handleUpdateTaskState = async (state: TaskState | null) => {
  try {
    if (!state) return
    isSubmitting.value = true

    const tasksFromPreviousState = projectTasksProvider?.projectTasksByStatus.value[props.taskState]
    const currentTaskIndex = tasksFromPreviousState?.findIndex(task => task.id === props.taskId) as number

    const reorderedTasksFromPreviousState = tasksFromPreviousState?.map((task, index) => {
      if (index > currentTaskIndex) {
        return {
          ...task,
          order: task.order - 1
        }
      }
      return task
    })
    const reorderedTasksFromPreviousStateFiltered = reorderedTasksFromPreviousState?.filter(task => task.id !== props.taskId)

    const tasksFromNewState = projectTasksProvider?.projectTasksByStatus.value[state]
    const lastTaskOrder = tasksFromNewState ? tasksFromNewState.length + 1 : 1

    await $fetch(`/api/project/${projectId}/task/${props.taskId}`, {
      method: 'PUT',
      body: {
        state,
        order: lastTaskOrder
      },
      ignoreResponseError: true,
      onResponse ({ response }) {
        if (response.ok) {
          toast.success('Task State Updated Sucessfully')
          emit('taskStateUpdated', props.taskId, state, lastTaskOrder)
          return
        }
        toast.error(
          getErrorMessage(response._data.data.scope, response._data.data.code)
        )
      },
    })

    await $fetch(`/api/project/${projectId}/task/reorder`, {
      method: 'PUT',
      body: reorderedTasksFromPreviousStateFiltered
    })
  } catch (error) {
    console.log('[ERROR_UPDATE_TASK_STATE]', error)
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'))
  } finally {
    isSubmitting.value = false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidTaskState = (state: any): state is TaskState => {
  const availableStates = ['pending', 'waiting', 'in_progress', 'in_review', 'completed'] as const
  return availableStates.includes(state)
}

</script>

<style scoped></style>
