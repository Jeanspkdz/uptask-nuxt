import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'

const routeParamValidator = routeParamsSchema.pick({ projectId: true })

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId } = routeParamsValidationResult.data

  const projectWithCollaborator = await db.query.project.findFirst({
    columns: {},
    with: {
      collaborator: true,
    },
    where: {
      id: projectId,
    },
  })
  console.log({
    COLLLBAS: projectWithCollaborator
  })

  if (!projectWithCollaborator) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  return {
    collaborator: projectWithCollaborator.collaborator
  }
})
