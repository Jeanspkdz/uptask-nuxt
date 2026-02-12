import { and, eq } from 'drizzle-orm'
import { collaboratorTable } from '~~/server/db/schema/collaborator'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'
import { collaboratorSelectSchema } from '~~/server/utils/validator'

const routeParamsValidator = routeParamsSchema.pick({
  projectId: true,
})
const routeBodyValidator = collaboratorSelectSchema.pick({
  userId: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createCustomError('GENERIC', 'UNAUTHORIZED')
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamsValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { projectId } = routeParamsValidationResult.data
  const { userId } = routeBodyValidationResult.data

  const [project] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userAuthenticated.id))

  const isProjectOwner = Boolean(project)

  if (!isProjectOwner) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  const [collaborator] = await db
    .delete(collaboratorTable)
    .where(
      and(
        eq(collaboratorTable.userId, userId),
        eq(collaboratorTable.projectId, projectId)
      )
    )
    .returning()

  return {
    collaborator,
  }
})
