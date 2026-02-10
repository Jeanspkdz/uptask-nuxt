import { asc, eq } from 'drizzle-orm'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamValidator = routeParamsSchema.pick({ projectId: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routerParamValidationResult = await getValidatedRouterParams(
    event,
    routerParamValidator.safeParse
  )

  if (!routerParamValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
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
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  const tasks = await db
    .select()
    .from(projectTaskTable)
    .where(eq(projectTaskTable.projectId, projectId))
    .orderBy(asc(projectTaskTable.order))

  return tasks ?? []
})
