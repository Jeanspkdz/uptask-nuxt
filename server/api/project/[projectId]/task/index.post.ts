import { eq } from 'drizzle-orm'
import { project } from '~~/server/db/schema/project'
import { projectTask } from '~~/server/db/schema/project-task'
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
  data['projectId'] = projectId

  const [taskInserted] = await db.insert(projectTask).values({
    name: data.name,
    description: data.description,
    projectId: data.projectId
  }).returning()

  return taskInserted
})
