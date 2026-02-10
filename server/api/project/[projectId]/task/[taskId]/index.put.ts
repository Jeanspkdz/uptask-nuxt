import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerBodyValidator = projectTaskUpdateSchema.omit({
  id: true,
  projectId: true,
})
const routerParamsValidator = routeParamsSchema.pick({
  projectId: true,
  taskId: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routerParamsValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId, taskId } = routeParamsValidationResult.data

  if (!taskId) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  // Check if the user owns the task
  const [project] = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.id, projectId),
        eq(projectTable.userId, userAuthenticated.id)
      )
    )

  if (!project) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  // Validate incoming data
  const routeBodyValidationResult = await readValidatedBody(
    event,
    routerBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { description, name, order, state } = routeBodyValidationResult.data

  const [updatedTask] = await db
    .update(projectTaskTable)
    .set({
      description,
      name,
      order,
      state,
    })
    .where(eq(projectTaskTable.id, taskId))
    .returning()

  return {
    updatedTask
  }
})
