import { asc, eq } from 'drizzle-orm'
import z from 'zod'
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
        scope: 'GENERIC'
      }
    })
  }

  const { projectId } = validatedRouterParams.data

  // Check if the user is either the owner or a collaborator of the project
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
    throw createError({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const tasks = await db
    .select()
    .from(projectTaskTable)
    .where(eq(projectTaskTable.projectId, projectId))
    .orderBy(asc(projectTaskTable.order))

  return tasks ?? []
})
