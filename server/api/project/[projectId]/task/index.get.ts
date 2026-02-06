import { asc, eq } from 'drizzle-orm'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamValidator = routeParamsSchema.pick({ projectId: true })

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
        scope: 'GENERIC'
      }
    })
  }

  const { projectId } = routerParamValidationResult.data

  // Check if the user is either the owner or a project's collaborator
  const project = await db.query.project.findFirst({
    where: {
      AND: [
        { id: projectId },
        {
          OR: [
            { userId: userAuthenticated.id },
            {
              collaborator: {
                id: userAuthenticated.id
              }
            }
          ]
        }
      ]
    }

  })

  if (!project) {
    throw createError<ErrorData>({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
      data: {
        ...GENERIC_ERRORS['UNAUTHORIZED'],
        scope: 'GENERIC'
      }
    })
  }

  const tasks = await db
    .select()
    .from(projectTaskTable)
    .where(eq(projectTaskTable.projectId, projectId))
    .orderBy(asc(projectTaskTable.order))

  return tasks ?? []
})
