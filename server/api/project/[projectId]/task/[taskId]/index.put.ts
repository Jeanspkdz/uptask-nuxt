import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
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
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routerParamsValidator.safeParse
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

  const { projectId, taskId } = routeParamsValidationResult.data

  if (!taskId) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
        reason: 'Missing param',
      },
    })
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
    throw createError<ErrorData>({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['FORBIDDEN']['code'],
      data: {
        ...GENERIC_ERRORS['FORBIDDEN'],
        scope: 'GENERIC',
        reason: 'Project access denied: user is not the owner',
      },
    })
  }

  // Validate incoming data
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
        reason: 'Invalid Data',
      },
    })
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
