import { eq } from 'drizzle-orm'
import { projectTable } from '~~/server/db/schema/project'
import { projectTaskTable } from '~~/server/db/schema/project-task'
import { GENERIC_ERRORS } from '~~/server/errors'
import type { TaskInsert, User } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  const projectId = getRouterParam(event, 'projectId') as string

  // Check if the user owns the project
  const [projectFound] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.userId, userAuthenticated.id))

  if (!projectFound) {
    throw createError({
      statusCode: 403,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code'],
    })
  }

  // Add new task
  const data = (await readBody(event)) as TaskInsert
  data['projectId'] = projectId

  const lastOrder = await db.$count(
    projectTaskTable,
    eq(projectTaskTable.projectId, projectId)
  ) + 1

  const [taskInserted] = await db
    .insert(projectTaskTable)
    .values({
      name: data.name,
      description: data.description,
      projectId: data.projectId,
      order: lastOrder,
    })
    .returning()

  return taskInserted
})
