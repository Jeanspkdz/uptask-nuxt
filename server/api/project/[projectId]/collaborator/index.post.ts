import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { collaboratorTable } from '~~/server/db/schema/collaborator'
import { projectTable } from '~~/server/db/schema/project'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({
  projectId: true,
  taskId: true,
})
const routerBodyValidator = z.object({
  userId: z.string(),
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
        scope: 'GENERIC',
      },
    })
  }

  const { projectId } = routeParamsValidationResult.data

  const [project] = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.userId, userAuthenticated.id),
        eq(projectTable.id, projectId)
      )
    )

  if (!project) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['FORBIDDEN']['code'],
      data: {
        ...GENERIC_ERRORS['FORBIDDEN'],
        scope: 'GENERIC',
      },
    })
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routerBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
      },
    })
  }

  const { userId } = routeBodyValidationResult.data

  const [collaborator] = await db
    .insert(collaboratorTable)
    .values({
      userId,
      projectId,
    })
    .returning()

  return {
    collaborator,
  }
})
