import { eq } from 'drizzle-orm'
import { project } from '~~/server/db/schema/project'
import { projectTask } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { TaskInsert, User } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code']
    })
  }

  const projectId = getRouterParam(event, 'projectId') as string
  const projectIdNum = Number(projectId)

  if (isNaN(projectIdNum)) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        code: GENERIC_ERRORS['BAD_REQUEST']['code'],
        message: GENERIC_ERRORS['BAD_REQUEST']['message'],
        scope: 'GENERIC',
        reason: 'Project id is not a number'
      }
    })
  }

  // Check if the user owns the project
  const [projectFound] = await db.select().from(project).where(eq(project.userId, userAuthenticated.id))

  if (!projectFound) {
    throw createError({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code']
    })
  }

  // Add new task
  const data = await readBody(event) as TaskInsert
  data['projectId'] = projectIdNum

  const [taskInserted] = await db.insert(projectTask).values({
    name: data.name,
    description: data.description,
    projectId: data.projectId
  }).returning()

  return taskInserted
})
