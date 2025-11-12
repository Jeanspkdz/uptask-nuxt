import { and, eq } from 'drizzle-orm'
import { project } from '~~/server/db/schema/project'
import { GENERIC_ERRORS } from '~~/server/errors'
import { PROJECT_ERRORS } from '~~/server/errors/project'
import type { User, ProjectInsert } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const userAuthenticated: User = event.context.auth
  if (!userAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: GENERIC_ERRORS['UNAUTHORIZED']['code']
    })
  }
  const data = (await readBody(event)) as ProjectInsert

  // Check if an project with the name and ClientName already exists
  const foundProject = await db.select().from(project).where(and(eq(project.name, data.name), eq(project.clientName, data.clientName)))

  if (foundProject.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: PROJECT_ERRORS['NAME_AND_CLIENT_NAME_ALREADY_EXISTS']['code'],
      data: {
        ...PROJECT_ERRORS['NAME_AND_CLIENT_NAME_ALREADY_EXISTS'],
      }
    })
  }

  const projectInserted = await db
    .insert(project)
    .values({
      clientName: data.clientName,
      name: data.name,
      description: data.description,
      userId: userAuthenticated.id,
    })
    .returning()

  return {
    data: projectInserted,
  }
})
