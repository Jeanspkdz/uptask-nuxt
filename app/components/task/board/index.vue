<template>
  <div>
    <div class="flex *:flex-1 gap-x-4">
      <TaskBoardColumnHeader heading="Pending" variant="pending" />
      <TaskBoardColumnHeader heading="Waiting" variant="waiting" />
      <TaskBoardColumnHeader heading="In Progress" variant="in_progress" />
      <TaskBoardColumnHeader heading="In Review" variant="in_review" />
      <TaskBoardColumnHeader heading="Completed" variant="completed" />
    </div>

    <div class="flex *:flex-1 gap-x-4 ">
      <template v-for="(_, key) in tasksByState" :key="key">
        <VueDraggable
          ref="pending-tasks"
          v-model="tasksByState[key]"
          class="bg-slate-200"
          group="tasks"
          force-fallback
          :animation="150"
          :data-task-state="key"
          @end="onEnd!"
        >
          <div v-for="item in tasksByState[key]" :key="item.id">
            {{ item.title }} - {{ item.state }}
          </div>
        </VueDraggable>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  VueDraggable,
  type DraggableEvent,
  type UseDraggableReturn
} from 'vue-draggable-plus'
import type { TaskState } from './column-header.vue'

type Task = { id: string; title: string; state: TaskState; order: number }
const tasks: Task[] = [
  {
    id: 'tsk_a1f9',
    title: 'Design login screen',
    state: 'pending',
    order: 1,
  },
  { id: 'tsk_b2d7', title: 'Create wireframes', state: 'pending', order: 2 },
  { id: 'tsk_b2dc', title: 'Learn wordpress', state: 'pending', order: 3 },

  {
    id: 'tsk_c8e4',
    title: 'Client feedback on mockups',
    state: 'waiting',
    order: 1,
  },
  { id: 'tsk_d3a5', title: 'Confirm API specs', state: 'waiting', order: 2 },

  {
    id: 'tsk_e9b2',
    title: 'Implement authentication',
    state: 'in_progress',
    order: 1,
  },
  {
    id: 'tsk_f4c1',
    title: 'Integrate payment gateway',
    state: 'in_progress',
    order: 2,
  },

  {
    id: 'tsk_g7d8',
    title: 'Review user dashboard',
    state: 'in_review',
    order: 1,
  },
  {
    id: 'tsk_h5e3',
    title: 'Test mobile responsiveness',
    state: 'in_review',
    order: 2,
  },

  {
    id: 'tsk_i6f0',
    title: 'Set up database schema',
    state: 'completed',
    order: 1,
  },
  {
    id: 'tsk_j2a9',
    title: 'Deploy to production',
    state: 'completed',
    order: 2,
  },
]
const tasksRef = ref(tasks)

const tasksGroupedByStatus = ref(
  Object.groupBy(tasksRef.value, (task) => task.state)
)

const tasksByState = ref({
  // or reactive
  pending: tasksGroupedByStatus.value.pending || [],
  waiting: tasksGroupedByStatus.value.waiting || [],
  in_progress: tasksGroupedByStatus.value.in_progress || [],
  in_review: tasksGroupedByStatus.value.in_review || [],
  completed: tasksGroupedByStatus.value.completed || [],
})

const taskBoardRef = useTemplateRef<UseDraggableReturn>('pending-tasks')

const onEnd = (e: DraggableEvent) => {
  console.log('onEnd', e)
  const fromState = e.from.dataset.taskState
  const toState = e.to.dataset.taskState as TaskState

  const fromIndex = e.oldDraggableIndex
  const toIndex = e.newDraggableIndex

  if (fromState === toState && fromIndex === toIndex) {
    console.log('NO ME MOVI')
    return
  }
  tasksByState.value[toState].map((task, index) => {
    task.state = toState
    task.order = index + 1 // The order is the reflection of its current position
    return task
  })
}

watch(
  tasksByState,
  () => {
    console.log({
      tasksByState: tasksByState.value,
    })
  },
  { immediate: true, deep: true }
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
