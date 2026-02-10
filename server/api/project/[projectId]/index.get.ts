import { eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({ projectId: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId } = routeParamsValidationResult.data

  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))

  if (!projectFound) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  return {
    project: projectFound
  }
})
