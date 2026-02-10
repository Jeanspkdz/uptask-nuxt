import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { createCustomError } from '~~/server/errors'
import type { User } from '~~/server/types'
import {
  projectSelectSchema,
  routeParamsSchema
} from '~~/server/utils/validator'

const routeParamValidator = routeParamsSchema.pick({ projectId: true })
const routeBodyValidator = projectSelectSchema.pick({ clientName: true, name: true, description: true })

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

  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))

  if (!projectFound) {
    throw createCustomError('GENERIC', 'NOT_FOUND')
  }

  // If the user does not own the project
  if (projectFound.userId !== userAuthenticated.id) {
    throw createCustomError('GENERIC', 'FORBIDDEN')
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createCustomError('GENERIC', 'BAD_REQUEST')
  }

  const { name, clientName, description } = routeBodyValidationResult.data

  // Check if an project with the name and ClientName already exists
  const foundProject = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.name, name),
        eq(projectTable.clientName, clientName)
      )
    )

  if (foundProject.length > 0) {
    throw createCustomError('PROJECT', 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS')
  }

  const [updatedProject] = await db
    .update(projectTable)
    .set({
      clientName,
      name,
      description,
    })
    .where(eq(projectTable.id, projectId))
    .returning()

  return {
    updatedProject
  }
})
