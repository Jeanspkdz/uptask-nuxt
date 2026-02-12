import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { collaboratorTable } from '~~/server/db/schema/collaborator'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import { routeParamsSchema } from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({
  projectId: true,
})

const routerBodyValidator = z.object({
  userId: z.string(),
})

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
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routerBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { userId } = routeBodyValidationResult.data

  await db
    .insert(collaboratorTable)
    .values({
      userId,
      projectId,
    })

  const addedCollaborator = await db.query.user.findFirst({
    where: {
      id: userId
    }
  })

  return {
    collaborator: addedCollaborator,
  }
})
