import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamValidator = routeParamsSchema.pick({ projectId: true })
const routeBodyValidator = projectTaskInsertSchema.pick({
  name: true,
  description: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routerParamValidationResult = await getValidatedRouterParams(
    event,
    routerParamValidator.safeParse
  )

  if (!routerParamValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId } = routerParamValidationResult.data

  // Check if the user owns the project
  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userAuthenticated.id))

  if (!projectFound) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  // Add new task
  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { name, description } = routeBodyValidationResult.data

  const lastOrder =
    (await db.$count(
      projectTaskTable,
      and(
        eq(projectTaskTable.projectId, projectId),
        eq(projectTaskTable.state, 'pending')
      )
    )) + 1

  const [insertedTask] = await db
    .insert(projectTaskTable)
    .values({
      name,
      description,
      projectId,
      order: lastOrder,
    })
    .returning()

  return {
    insertedTask,
  }
})
