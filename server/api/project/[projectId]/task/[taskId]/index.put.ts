import { and, eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import type { ErrorData } from '~~/server/errors'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'

const routerBodyValidator = projectTaskUpdateSchema.omit({
  id: true,
  projectId: true,
})

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const taskId = getRouterParam(event, 'taskId')

  if (!taskId) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
        reason: 'Missing param'
      }
    })
  }

  // Check if the user owns the task
  const [task] = await db
    .select()
    .from(projectTaskTable)
    .where(eq(projectTaskTable.id, taskId))

  const [project] = await db
    .select()
    .from(projectTable)
    .where(
      and(
        eq(projectTable.id, task.projectId),
        eq(projectTable.userId, userAuthenticated.id)
      )
    )

  if (!project) {
    throw createError<ErrorData>({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['FORBIDDEN']['code'],
      data: {
        ...GENERIC_ERRORS['FORBIDDEN'],
        scope: 'GENERIC',
        reason: 'Project access denied: user is not the owner'
      }
    })
  }

  // Validate incoming data
  const validatedBodyResult = await readValidatedBody(event, routerBodyValidator.safeParse)

  if (!validatedBodyResult.success) {
    throw createError<ErrorData>({
      statusCode: 400,
      statusMessage: GENERIC_ERRORS['BAD_REQUEST']['code'],
      data: {
        ...GENERIC_ERRORS['BAD_REQUEST'],
        scope: 'GENERIC',
        reason: 'Invalid Data'
      }
    })
  }

  const validatedBody = validatedBodyResult.data

  const taskUpdated = await db.update(projectTaskTable).set(validatedBody).where(eq(projectTaskTable.id, taskId)).returning()

  return {
    taskUpdated
  }
})
