import type { InjectionKey } from 'vue'
import type { Task, TaskState, TaskUpdate } from '~~/server/types'

export type ProjectTasksKey = {
  projectTasks: Ref<Task[] | undefined>
  projectTasksByStatus: ComputedRef<Partial<Record<TaskState, Task[]>>>
  pending: Ref<boolean>
  updateProjectTask: (id: Task['id'], values: TaskUpdate) => void
  addProjectTask: (task: Task) => void
  deleteProjectTask: (taskId: Task['id']) => void
}

export const projectTasksKey = Symbol('project tasks') as InjectionKey<ProjectTasksKey>
