import { asc, eq } from 'drizzle-orm'
import z from 'zod'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
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

  // Check if the user owns the project
  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userAuthenticated.id))

  if (!projectFound) {
    throw createError({
      statusCode: 403,
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
        scope: 'GENERIC'
      }
    })
  }

  const { projectId } = validatedRouterParams.data

  const tasks = await db
    .select()
    .from(projectTaskTable)
    .where(eq(projectTaskTable.projectId, projectId))
    .orderBy(asc(projectTaskTable.order))

  return tasks ?? []
})
