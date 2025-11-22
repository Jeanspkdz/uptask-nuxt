<template>
  <div>
    <div class="flex *:flex-1 gap-x-4">
      <TaskBoardColumnHeader heading="Pending" variant="pending" />
      <TaskBoardColumnHeader heading="Waiting" variant="waiting" />
      <TaskBoardColumnHeader heading="In Progress" variant="in_progress" />
      <TaskBoardColumnHeader heading="In Review" variant="in_review" />
      <TaskBoardColumnHeader heading="Completed" variant="completed" />
    </div>

    <div class="flex *:flex-1 gap-x-4">
      <template v-for="(_, key) in tasksByState" :key="key">
        <template v-if="tasksByState[key].length > 0">
          <VueDraggable
            ref="pending-tasks"
            v-model="tasksByState[key]"
            class="flex flex-col gap-4"
            group="tasks"
            handle="[data-draggable]"
            force-fallback
            :animation="150"
            :data-task-state="key"
            @end="onEnd!"
          >
            <TaskCard
              v-for="item in tasksByState[key]"
              :key="item.id"
              :name="item.name"
              :description="item.description"
            />
          </VueDraggable>
        </template>
        <div v-else class="mt-4">
          <p class="capitalize font-bold text-black/35 text-sm text-center">
            No hay tareas
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  VueDraggable,
  type DraggableEvent,
  type UseDraggableReturn,
} from 'vue-draggable-plus'
import type { TaskState } from './column-header.vue'

const route = useRoute()
const projectId = route.params.id
const { data: tasks, error } = await useFetch(
  `/api/project/${projectId}/task`,
  {
    transform: (tasks) => {
      return tasks.map((task) => ({
        id: task.id,
        name: task.name,
        state: task.state,
        order: task.order,
        description: task.description,
      }))
    },
  }
)

const tasksGroupedByStatus = computed(() => {
  if (!tasks.value) return {}
  return Object.groupBy(tasks.value, (task) => task.state)
})

const tasksByState = reactive({
  // or reactive
  pending: tasksGroupedByStatus.value.pending || [],
  waiting: tasksGroupedByStatus.value.waiting || [],
  in_progress: tasksGroupedByStatus.value.in_progress || [],
  in_review: tasksGroupedByStatus.value.in_review || [],
  completed: tasksGroupedByStatus.value.completed || [],
})

const taskBoardRef = useTemplateRef<UseDraggableReturn>('pending-tasks')

const onEnd = async (e: DraggableEvent) => {
  const fromState = e.from.dataset.taskState
  const toState = e.to.dataset.taskState as TaskState

  const fromIndex = e.oldDraggableIndex
  const toIndex = e.newDraggableIndex

  if (fromState === toState && fromIndex === toIndex) {
    return
  }

  tasksByState[toState].map((task, index) => {
    task.state = toState
    task.order = index + 1 // The order is the reflection of its current position
    return task
  })

  // Call API to update all tasks in toState
  const { data, error } = await useFetch(
    '/api/project/:projectId/task/reorder',
    {
      method: 'PUT',
      body: tasksByState[toState],
    }
  )

  console.log({
    reorder: {
      tasks: data.value,
      error: error.value,
    },
  })
}

watch(
  tasksByState,
  () => {
    console.log({
      tasksByState,
    })
  },
  { immediate: true }
)
</script>

<style>
.sortable-chosen {
  background: red;
}
.sortable-drag {
  background: greenyellow;
  padding: 20px;
}
.sortable-ghost {
  background: blue;
  padding: 12px;
}
</style>
