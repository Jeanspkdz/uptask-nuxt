import { and, eq, or } from 'drizzle-orm'
import { collaboratorTable } from '~~/server/db/schema/collaborator'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { taskNoteTable } from '~~/server/db/schema/task-note'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema, taskNoteInsertSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({ projectId: true, taskId: true })
const routeBodyValidator = taskNoteInsertSchema.pick({
  description: true,
})

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

  const { projectId, taskId } = routeParamValidationResult.data

  // Check if the user is the owner OR a collaborator of the project
  const [projectFound] = await db
    .select()
    .from(projectTable)
    .leftJoin(
      collaboratorTable,
      and(
        eq(collaboratorTable.projectId, projectTable.id),
        eq(collaboratorTable.userId, userAuthenticated.id)
      )
    )
    .where(
      and(
        eq(projectTable.id, projectId),
        or(
          eq(projectTable.userId, userAuthenticated.id),
          eq(collaboratorTable.userId, userAuthenticated.id)
        )
      )
    )

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

  // Validate body and add note
  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { description } = routeBodyValidationResult.data

  const [insertedNote] = await db
    .insert(taskNoteTable)
    .values({
      description,
      taskId,
      userId: userAuthenticated.id,
    })
    .returning()

  return {
    insertedNote,
  }
})
