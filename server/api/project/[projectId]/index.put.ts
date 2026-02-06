import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import { PROJECT_ERRORS } from '~~/server/errors/project'
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
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const routeParamsValidationResult = await getValidatedRouterParams(
    event,
    routeParamValidator.safeParse
  )

  if (!routeParamsValidationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        scope: 'GENERIC',
        ...GENERIC_ERRORS['BAD_REQUEST'],
      },
    })
  }

  const { projectId } = routeParamsValidationResult.data

  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, projectId))

  if (!projectFound) {
    throw createError<ErrorData>({
      statusCode: 404,
      statusMessage: GENERIC_ERRORS['NOT_FOUND']['code'],
      data: {
        ...GENERIC_ERRORS['NOT_FOUND'],
        reason: 'The requested project could not be found in the database',
        scope: 'GENERIC',
      },
    })
  }

  // If the user does not own the project
  if (projectFound.userId !== userAuthenticated.id) {
    throw createError<ErrorData>({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['FORBIDDEN']['code'],
      data: {
        ...GENERIC_ERRORS['FORBIDDEN'],
        reason: 'You are not authorized to access this project',
        scope: 'GENERIC',
      },
    })
  }

  const routeBodyValidationResult = await readValidatedBody(
    event,
    routeBodyValidator.safeParse
  )

  if (!routeBodyValidationResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        scope: 'GENERIC',
        ...GENERIC_ERRORS['BAD_REQUEST'],
      },
    })
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
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage:
        PROJECT_ERRORS['NAME_AND_CLIENT_NAME_ALREADY_EXISTS']['code'],
      data: {
        ...PROJECT_ERRORS['NAME_AND_CLIENT_NAME_ALREADY_EXISTS'],
        scope: 'PROJECT',
        reason: 'Unique Constraint Violation',
      },
    })
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
