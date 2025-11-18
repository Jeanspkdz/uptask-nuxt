import { and, eq } from 'drizzle-orm'
import { project } from '~~/server/db/schema/project'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import { PROJECT_ERRORS } from '~~/server/errors/project'
import type { ProjectUpdate, User } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const id = getRouterParam(event, 'projectId')

  if (!id) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        reason: 'Missing required parameter',
        scope: 'GENERIC',
      },
    })
  }

  const numericId = Number(id)
  if (isNaN(numericId)) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        reason: 'Project ID must be a number',
        scope: 'GENERIC',
      },
    })
  }

  const [projectFound] = await db
    .select()
    .from(project)
    .where(eq(project.id, numericId))

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

  const data = (await readBody(event)) as ProjectUpdate

  // Check if an project with the name and ClientName already exists
  const foundProject = await db
    .select()
    .from(project)
    .where(
      and(eq(project.name, data.name), eq(project.clientName, data.clientName))
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

  const [projectUpdated] = await db
    .update(project)
    .set({
      clientName: data.clientName,
      name: data.name,
      description: data.description,
    })
    .where(eq(project.id, numericId))
    .returning()

  return projectUpdated
})
