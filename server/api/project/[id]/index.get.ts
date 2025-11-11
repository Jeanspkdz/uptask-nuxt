import { eq } from 'drizzle-orm'
import { project } from '~~/server/db/schema/project'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERROR_MESSAGES } from '~~/server/errors'
import type { User } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERROR_MESSAGES['UNAUTHORIZED']['code'],
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERROR_MESSAGES['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERROR_MESSAGES['BAD_REQUEST'],
        reason: 'Missing required parameter'
      }
    })
  }

  const numericId = Number(id)
  if (isNaN(numericId)) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERROR_MESSAGES['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERROR_MESSAGES['BAD_REQUEST'],
        reason: 'Project ID must be a number'
      }
    })
  }

  const projectFound = await db.select().from(project).where(eq(project.id, numericId))

  if (projectFound.length === 0) {
    throw createError<ErrorData>({
      statusCode: 404,
      statusMessage: GENERIC_ERROR_MESSAGES['NOT_FOUND']['code'],
      data: {
        ...GENERIC_ERROR_MESSAGES['NOT_FOUND'],
        reason: 'The requested project could not be found in the database'
      }
    })
  }

  return projectFound.at(0)
})
