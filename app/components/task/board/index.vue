<template>
  <div class="flex gap-x-4 overflow-x-auto max-w-full">
    <div
      v-for="(val, key) in tasksByState"
      :key="key"
      class="min-w-full lg:min-w-2/5 xl:min-w-auto  xl:w-1/5"
    >
      <TaskBoardColumnHeader
        :heading="val.label"
        :variant="val.variant"
        class=""
      />

      <div class="relative">
        <VueDraggable
          ref="pending-tasks"
          v-model="val.tasks"
          :disabled="isSending"
          class="flex flex-col gap-4 min-h-32"
          :class="{
            'opacity-60 cursor-not-allowed': isSending,
          }"
          :group="{
            name: 'tasks',
          }"
          handle="[data-draggable]"
          :animation="150"
          :data-task-state="key"
          :scroll="true"
          :bubble-scroll="true"
          :force-fallback="true"
          :scroll-sensitivity="50"
          :scroll-speed="50"
          @end="onEnd!"
        >
          <TaskCard
            v-for="item in val.tasks"
            :key="item.id"
            :task="item"
            class="select-none"
          />
        </VueDraggable>

        <div v-if="val.tasks.length == 0" class="absolute top-0 w-full mt-4">
          <p
            class="pointer-events-none capitalize font-bold text-black/35 text-sm text-center"
          >
            No tasks yet
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import type { Task } from '~~/server/types'
import type { TaskState } from './column-header.vue'
import { toast } from 'vue-sonner'
import { getErrorMessage } from '~/errors'
import { useCloned } from '@vueuse/core'
import { FetchError } from 'ofetch'

const route = useRoute()
const projectId = route.params.projectId
const isSending = ref(false)

const { tasks } = defineProps<{
  tasks: Partial<Record<TaskState, Task[]>>
}>()

const prevtasksByState = computed(() => {
  return {
    pending: {
      label: 'Pending',
      variant: 'pending' as const,
      tasks: tasks.pending || [],
    },
    waiting: {
      label: 'Waiting',
      variant: 'waiting' as const,
      tasks: tasks.waiting || [],
    },
    in_progress: {
      label: 'In Progress',
      variant: 'in_progress' as const,
      tasks: tasks.in_progress || [],
    },
    in_review: {
      label: 'In Review',
      variant: 'in_review' as const,
      tasks: tasks.in_review || [],
    },
    completed: {
      label: 'Completed',
      variant: 'completed' as const,
      tasks: tasks.completed || [],
    },
  }
})

const { cloned: tasksByState, sync } = useCloned(prevtasksByState, {
  deep: true,
})

const onEnd = async (e: DraggableEvent) => {
  try {
    const fromState = e.from.dataset.taskState as TaskState
    const toState = e.to.dataset.taskState as TaskState

    const fromIndex = e.oldDraggableIndex
    const toIndex = e.newDraggableIndex

    if (fromState === toState && fromIndex === toIndex) {
      return
    }

    tasksByState.value[fromState].tasks.forEach((task, index) => {
      task.order = index + 1
    })

    tasksByState.value[toState].tasks.forEach((task, index) => {
      task.state = toState
      task.order = index + 1 // The order is the reflection of its current position
    })

    isSending.value = true

    // Call API to reorder tasks
    await $fetch(`/api/project/${projectId}/task/reorder`, {
      method: 'PUT',
      body: tasksByState.value[toState].tasks,
    })

    await $fetch(`/api/project/${projectId}/task/reorder`, {
      method: 'PUT',
      body: tasksByState.value[fromState].tasks,
    })

    // Update prevState to match the sucessfull one
    Object.keys(prevtasksByState.value).forEach((key) => {
      const stateKey = key as TaskState
      prevtasksByState.value[stateKey].tasks = tasksByState.value[
        stateKey
      ].tasks.map((t) => ({ ...t }))
    })

    toast.success('Task Updated Succesfully', {
      position: 'top-right',
    })
  } catch (error) {
    sync()

    if (error instanceof FetchError) {
      console.dir(error)
      toast.error(
        getErrorMessage(error.data.data.scope, error.data.data.code),
        {
          position: 'top-right',
        }
      )
      return
    }
    toast.error(getErrorMessage('GENERIC', 'UNKNOWN'), {
      position: 'top-right',
    })
  } finally {
    isSending.value = false
  }
}

watch(
  () => tasks,
  () => {
    sync()
  }
)

</script>

<style scoped>
@reference 'tailwindcss';

:global(.sortable-chosen) {
  @apply border-2 border-slate-400;
}
:global(.sortable-drag) {
  @apply shadow-2xl border-none;
}
:global(.sortable-ghost) {
  @apply border-2 border-slate-400;
}
</style>
