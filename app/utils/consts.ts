import type { InjectionKey } from 'vue'
import type { Task, TaskUpdate } from '~~/server/types'

type ProjectTasksKey = {
  projectTasks: Ref<Task[] | undefined>,
  updateProjectTask: (id: Task['id'], values: TaskUpdate) => void
  [attributes: string]: unknown
}

export const projectTasksKey = Symbol('project tasks') as InjectionKey<ProjectTasksKey>
