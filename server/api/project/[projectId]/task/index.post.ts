import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamValidator = routeParamsSchema.pick({ projectId: true })
const routeBodyValidator = projectTaskInsertSchema.clone()

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const routerParamValidationResult = await getValidatedRouterParams(
    event,
    routerParamValidator.safeParse
  )

  if (!routerParamValidationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
      },
    })
  }

  const { projectId } = routerParamValidationResult.data

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

  // Add new task
  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
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
    insertedTask
  }
})
