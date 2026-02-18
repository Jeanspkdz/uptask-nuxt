import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routerParamValidator = routeParamsSchema.pick({
  projectId: true,
  taskId: true,
})

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

  const { projectId, taskId } = routerParamValidationResult.data

  // Check if the user is either the owner or a project's collaborator
  const project = await db.query.project.findFirst({
    where: {
      AND: [
        { id: projectId },
        {
          OR: [
            {
              userId: userAuthenticated.id,
            },
            {
              collaborator: {
                id: userAuthenticated.id,
              },
            },
          ],
        },
      ],
    },
  })

  if (!project) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  // Check if the task belongs to the project
  const task = await db.query.projectTask.findFirst({
    where: {
      AND: [{ id: taskId }, { projectId }],
    },
  })

  if (!task) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  const notes = await db.query.taskNote.findMany({
    where: {
      taskId,
    },
    with: {
      owner: {
        columns: {
          id: true,
          name: true
        }
      }
    }
  })

  return notes ?? []
})
