import z from 'zod'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'

const routerParamValidator = z.object({
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

  const validatedRouterParams = await getValidatedRouterParams(
    event,
    routerParamValidator.safeParse
  )

  if (!validatedRouterParams.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        reason: z.prettifyError(validatedRouterParams.error),
        scope: 'GENERIC',
      },
    })
  }

  const { projectId } = validatedRouterParams.data

  const [project] = await db.query.project.findMany({
    columns: {},
    with: {
      collaborator: true,
    },
    where: {
      id: projectId,
    },
  })

  return project?.collaborator
})
