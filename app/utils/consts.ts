import type { InjectionKey } from 'vue'

export type ProjectTasksKey = {
  projectTasks: Ref<ProjectTask[] | undefined>;
  projectTasksByStatus: ComputedRef<Partial<Record<TaskState, ProjectTask[]>>>;
  pending: Ref<boolean>;
  updateProjectTask: (
    id: ProjectTask['id'],
    values: Omit<ProjectTask, 'id' | 'projectId'>,
  ) => void;
  addProjectTask: (task: ProjectTask) => void;
  deleteProjectTask: (taskId: ProjectTask['id']) => void;
}

export const projectTasksKey = Symbol(
  'project tasks'
) as InjectionKey<ProjectTasksKey>
