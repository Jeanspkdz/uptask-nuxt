import { and, eq } from 'drizzle-orm'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { taskNoteTable } from '~~/server/db/schema/task-note'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({ projectId: true, taskId: true, noteId: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeParamValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId, taskId, noteId } = routeParamValidationResult.data

  // Check if the user is the owner OR a collaborator of the project
  const projectFound = await db.query.project.findFirst({
    where: {
      AND: [
        { id: projectId },
        {
          OR: [
            {
              userId: userAuthenticated.id,
            },
            {
              collaborator: {
                id: userAuthenticated.id,
              },
            },
          ],
        },
      ],
    },
  })

  if (!projectFound) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  // Check if the task belongs to the project
  const [taskFound] = await db
    .select()
    .from(projectTaskTable)
    .where(
      and(
        eq(projectTaskTable.id, taskId),
        eq(projectTaskTable.projectId, projectId)
      )
    )

  if (!taskFound) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  // Check if the note exists and belongs to the task
  const [noteFound] = await db
    .select()
    .from(taskNoteTable)
    .where(
      and(
        eq(taskNoteTable.id, noteId),
        eq(taskNoteTable.taskId, taskId)
      )
    )

  if (!noteFound) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  // Only the note owner or the project owner can delete the note
  const isNoteOwner = noteFound.userId === userAuthenticated.id
  const isProjectOwner = projectFound.userId === userAuthenticated.id

  if (!isNoteOwner && !isProjectOwner) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  const [deletedNote] = await db
    .delete(taskNoteTable)
    .where(eq(taskNoteTable.id, noteId))
    .returning()

  return {
    deletedNote,
  }
})
