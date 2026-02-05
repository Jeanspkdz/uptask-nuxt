import { defineRelations } from 'drizzle-orm'
import { userTable as user } from './auth-schema'
import { projectTaskTable as projectTask } from './project-task'
import { projectTable as project } from './project'
import { collaboratorTable as collaborator } from './collaborator'
import { taskNoteTable as taskNote } from './task-note'

export const relations = defineRelations(
  { user, project, projectTask, collaborator, taskNote },
  (r) => ({
    user: {
      projects: r.many.project({ alias: 'project' }),
      taskNotes: r.many.taskNote(),
    },
    project: {
      owner: r.one.user({
        from: r.project.userId,
        to: r.user.id,
        optional: false,
        alias: 'project'
      }),
      collaborator: r.many.user({
        from: r.project.id.through(r.collaborator.projectId),
        to: r.user.id.through(r.collaborator.userId),
        alias: 'collaborators',
      }),
      tasks: r.many.projectTask(),
    },
    projectTask: {
      project: r.one.project({
        from: r.projectTask.projectId,
        to: r.project.id,
      }),
    },
    taskNote: {
      task: r.one.projectTask({
        from: r.taskNote.taskId,
        to: r.projectTask.id,
      }),
      owner: r.one.user({
        from: r.taskNote.userId,
        to: r.user.id,
      }),
    },
  })
)
