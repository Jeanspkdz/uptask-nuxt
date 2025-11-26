<template>
  <div class="flex gap-x-4 overflow-x-auto max-w-full">
    <div
      v-for="(val, key) in tasksByState"
      :key="key"
      class="min-w-full flex-1 md:min-w-auto"
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
          class="flex flex-col gap-4 min-h-32"
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
            :name="item.name"
            :description="item.description"
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

type TaskPayload = Pick<
  Task,
  'id' | 'name' | 'order' | 'state' | 'description'
>

const route = useRoute()
const projectId = route.params.id

const { tasks = [] } = defineProps<{
  tasks?: TaskPayload[];
}>()

const tasksGroupedByStatus = computed(() => {
  if (!tasks) return {}
  return Object.groupBy(tasks, (task) => task.state)
})

const tasksByState = reactive({
  pending: {
    label: 'Pending',
    variant: 'pending' as const,
    tasks: tasksGroupedByStatus.value.pending || [],
  },
  waiting: {
    label: 'Waiting',
    variant: 'waiting' as const,
    tasks: tasksGroupedByStatus.value.waiting || [],
  },
  in_progress: {
    label: 'In Progress',
    variant: 'in_progress' as const,
    tasks: tasksGroupedByStatus.value.in_progress || [],
  } as const,
  in_review: {
    label: 'In Review',
    variant: 'in_review',
    tasks: tasksGroupedByStatus.value.in_review || [],
  } as const,
  completed: {
    label: 'Completed',
    variant: 'completed' as const,
    tasks: tasksGroupedByStatus.value.completed || [],
  },
})

const onEnd = async (e: DraggableEvent) => {
  const fromState = e.from.dataset.taskState
  const toState = e.to.dataset.taskState as TaskState

  const fromIndex = e.oldDraggableIndex
  const toIndex = e.newDraggableIndex

  if (fromState === toState && fromIndex === toIndex) {
    return
  }

  tasksByState[toState].tasks.map((task, index) => {
    task.state = toState
    task.order = index + 1 // The order is the reflection of its current position
    return task
  })

  // Call API to update all tasks in toState
  await $fetch(`/api/project/${projectId}/task/reorder`, {
    method: 'PUT',
    body: tasksByState[toState].tasks,
    ignoreResponseError: true,
    onResponse ({ response }) {
      console.log('RESPONSE', response)
    },
  })
}
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
