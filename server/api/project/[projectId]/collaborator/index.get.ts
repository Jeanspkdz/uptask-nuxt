import z from 'zod'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'

const routeParamValidator = z.object({
  projectId: z.cuid2({ error: 'Invalid format' }),
})

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
        ...GENERIC_ERRORS['BAD_REQUEST'],
        reason: z.prettifyError(routeParamsValidationResult.error),
        scope: 'GENERIC',
      },
    })
  }

  const { projectId } = routeParamsValidationResult.data

  const [projectWithCollaborator] = await db.query.project.findMany({
    columns: {},
    with: {
      collaborator: true,
    },
    where: {
      id: projectId,
    },
  })

  if (!projectWithCollaborator) {
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
    collaborator: projectWithCollaborator.collaborator
  }
})
