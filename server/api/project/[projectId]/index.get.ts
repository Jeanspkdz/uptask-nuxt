import { eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({ projectId: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        scope: 'GENERIC',
        ...GENERIC_ERRORS['BAD_REQUEST'],
      }
    })
  }

  const { projectId } = routeParamsValidationResult.data

  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))

  if (!projectFound) {
    throw createError<ErrorData>({
      statusCode: 404,
      statusMessage: GENERIC_ERRORS['NOT_FOUND']['code'],
      data: {
        ...GENERIC_ERRORS['NOT_FOUND'],
        reason: 'The requested project could not be found in the database',
        scope: 'GENERIC',
      },
    })
  }

  return {
    project: projectFound
  }
})
