import { eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { User } from '~~/server/types'

const routerBodyValidator = projectTaskUpdateSchema

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
    throw createError({
      statusCode: 500,
      statusMessage: GENERIC_ERRORS['UNKNOWN']['code']
    })
  }

  // Check if the user owns the task
  // const [taskId] = await db
  //   .select()
  //   .from(projectTaskTable)
  //   .where(eq(projectTaskTable.id, taskId))
})
